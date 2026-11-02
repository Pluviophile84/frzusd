# FROZEN USD

A static, pre-launch memecoin parody website. Built with Astro 7, strict TypeScript, native components and small browser modules. The official forked-dollar emblem appears inside an original layered SVG ice illustration. Manrope is self-hosted. No wallet connection, backend, secrets or market API is required.

## Develop and verify

Use Node.js **24.x** (`.nvmrc`). The repository root is the application root.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
npm test
```

`npm test` builds production output, runs configuration tests, then starts production previews for browser tests. The live fixture is built in an isolated temporary directory and removed afterwards; its test address never enters public application configuration. On a machine without Chromium, run `npx playwright install --with-deps chromium` first. Tests use `/usr/bin/chromium` when present, otherwise Playwright's installed browser. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` for another installed Chromium.

In the managed cloud sandbox, network access and browser/server processes may need the supported elevated execution path. `ASTRO_TELEMETRY_DISABLED=1` avoids Astro writing telemetry settings outside the writable workspace. Astro 7 may automatically background dev/preview servers in agent sessions; `--ignore-lock` keeps verification servers in the foreground. Stop only servers you started with `npx astro preview stop` / `npx astro dev stop`, as appropriate.

`npm run format` formats maintained source. `npm run perf` measures three cold-cache, throttled mobile runs against a running production preview. See [verification](docs/verification.md) for results and limitations.

Cloud tasks are already isolated: use the existing checkout; do not create Git worktrees unless explicitly requested.

## GitHub → Vercel

Import **Pluviophile84/frzusd** into the intended Vercel account/team via the Git integration. Use the delivered **work** branch as the production branch for this initial empty-repository delivery, or merge it into your chosen production branch first.

| Setting                        | Value                 |
| ------------------------------ | --------------------- |
| Framework preset               | Astro                 |
| Root directory                 | Repository root (`.`) |
| Node.js                        | 24.x                  |
| Install command                | `npm ci`              |
| Build command                  | `npm run build`       |
| Output directory               | `dist`                |
| Required environment variables | None                  |

There is no server adapter, catch-all rewrite or CLI deployment workflow. GitHub Actions verifies code only; Vercel's Git integration owns deployment. Vercel should serve the generated `404.html` for unknown paths.

No Vercel connector or project credentials were available during implementation. The project has not been linked or deployed from this session, and no deployment URL is claimed. Complete the browser-based import and inspect the resulting deployment. Detailed instructions: [deployment handoff](docs/deployment.md).

## Activate the token

Edit **`src/config/site.ts`**, replacing the null launch values with verified real values:

- `token.status`: change `prelaunch` to `live`.
- `token.networkLabel`: use the actual supported network (`Solana`, `Ethereum` or `Base`). The intended pump.fun platform does not itself supply a verified network/address.
- `token.contractAddress`: the actual contract/mint address.
- `token.tradeUrl`: the official HTTPS trading URL.
- `token.explorerUrl`: the official HTTPS token explorer URL (optional in the schema; fill it to expose Explorer controls).
- `canonicalOrigin`: the verified production HTTPS origin, with no path/query/fragment.
- `social.xUrl` and `social.communityUrl`: verified official HTTPS links, or leave null.
- `features.datedNews`: enables the supplied October 2026 editorial note; set false to omit it.

Commit and push the change. The static site must rebuild and redeploy. Invalid required live values fail the build. Address syntax checks do **not** verify token existence, ownership, permissions or tradability. Never copy addresses from the test fixtures.

Pre-launch is always noindex. Vercel preview builds remain noindex. Only `live` + a canonical origin + Vercel's `VERCEL_ENV=production` enables indexing and a populated sitemap. Vercel provides that system variable; no custom variable is needed for the initial build. A null canonical emits no canonical URL; the local social image is still present, but full external sharing should be checked after the real origin is configured.

## Edit content and artwork

- `src/pages/index.astro`: editorial composition and selected section copy.
- `src/content/home.ts`: FAQ, stages, benefit copy and poster manifest.
- `src/components/`: header, hero, contract controls and footer.
- `src/styles/global.css`: tokens, typography, responsive layouts and motion.
- `public/brand/`: unchanged official SVG variants.
- `assets-original/`: complete original logo package, outside the public web root.
- `public/media/`: finished ice illustration, outlined downloadable SVG posters and committed 1200×630 social PNG.
- `public/fonts/`: Latin variable Manrope WOFF2 and OFL licence.

The internal narrative pack is not served or committed as public content. [Content map](docs/content-map.md) and [asset provenance](docs/assets-and-references.md) record the supplied sources and design decisions. Asset generation is optional development work; Vercel builds use the committed finished files and do not require Python, fonts installed on the host, or browser rendering.
