// Isolated test fixture. Never writes a demonstration address into application source.
import {
  mkdtempSync,
  cpSync,
  readFileSync,
  writeFileSync,
  symlinkSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync, spawn } from 'node:child_process';
const root = mkdtempSync(join(tmpdir(), 'frzusd-live-'));
for (const entry of [
  'src',
  'public',
  'astro.config.mjs',
  'tsconfig.json',
  'package.json',
])
  cpSync(entry, join(root, entry), { recursive: true });
symlinkSync(
  join(process.cwd(), 'node_modules'),
  join(root, 'node_modules'),
  'dir',
);
const path = join(root, 'src/config/site.ts');
writeFileSync(
  path,
  readFileSync(path, 'utf8')
    .replace(
      'canonicalOrigin: null,',
      "canonicalOrigin: 'https://frozen.test',",
    )
    .replace(
      /token:\s*\{\s*status: 'prelaunch',[\s\S]*?\}/,
      "token: { status: 'live', networkLabel: 'Solana', contractAddress: 'So11111111111111111111111111111111111111112', tradeUrl: 'https://pump.fun/coin/So11111111111111111111111111111111111111112', explorerUrl: 'https://solscan.io/token/So11111111111111111111111111111111111111112' }",
    ),
);
const env = {
  ...process.env,
  ASTRO_TELEMETRY_DISABLED: '1',
  VERCEL_ENV: 'production',
};
const cli = join(process.cwd(), 'node_modules/astro/bin/astro.mjs');
const build = spawnSync(process.execPath, [cli, 'build', '--root', root], {
  env,
  stdio: 'inherit',
  cwd: root,
});
if (build.status !== 0) {
  rmSync(root, { recursive: true, force: true });
  process.exit(build.status ?? 1);
}
const server = spawn(
  process.execPath,
  [
    cli,
    'preview',
    '--root',
    root,
    '--ignore-lock',
    '--port',
    '4322',
    '--host',
    '127.0.0.1',
  ],
  { env, stdio: 'inherit', cwd: root },
);
const cleanup = () => {
  server.kill('SIGTERM');
  rmSync(root, { recursive: true, force: true });
};
process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});
process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
server.on('exit', (code) => {
  rmSync(root, { recursive: true, force: true });
  process.exit(code ?? 0);
});
