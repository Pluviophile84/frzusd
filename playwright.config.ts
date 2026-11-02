import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
        (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    },
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: 'npm run preview -- --ignore-lock --host 127.0.0.1',
      url: 'http://127.0.0.1:4321',
      reuseExistingServer: !process.env.CI,
      env: { ASTRO_TELEMETRY_DISABLED: '1' },
    },
    {
      command: 'node tests/live-server.mjs',
      url: 'http://127.0.0.1:4322',
      reuseExistingServer: false,
      timeout: 60000,
    },
  ],
});
