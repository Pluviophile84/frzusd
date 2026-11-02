# Verification record

Validated in the managed cloud checkout on 2 November 2026 using Node.js 24.19.0, npm 11.9.0 and system Chromium. Dependencies are exact versions in the generated npm lockfile.

## Refinement

The ticker is now `$FUSD`, with the display name `Frozen USD` across page copy, metadata and regenerated posters/social artwork. A textured ice render with the unchanged official symbol replaces the glass-like vector cube. Responsive WebP assets serve the hero and movement diagram. Motion now coordinates the travelling object, route trace and wallet accents; one-time section entrances and subtle control hover states round out the interaction treatment. Reduced-motion preferences disable animation.

The top anchor now sits at the actual document origin rather than on the sticky header. Both logos and the footer return link use document scrolling without reloading the homepage. Three browser regression tests verify intermediate smooth-scroll positions and arrival at zero, and another verifies immediate reduced-motion return and updated branding.

## Results

- Clean `npm ci`: passed.
- `npm run check`: zero errors, warnings or hints.
- `npm run build`: static homepage, 404, robots and sitemap generated successfully, with default null launch configuration and no secrets.
- `npm test`: **8 configuration tests and 13 browser tests passed**, none skipped. Browser tests use actual production builds, including an isolated live configuration.
- Default pre-launch has no Copy, Explorer, Buy or unconfigured social actions. Live fixture exposes address, trading and explorer controls; clipboard success and failure are announced. Invalid live values are rejected by configuration tests.
- Keyboard menu activation, Tab order, Escape/focus restoration, FAQ, pause, reduced motion and no-JavaScript navigation/content verified.
- Internal anchors resolve; three downloaded assets contain standalone SVG artwork; all local images decode. No browser page errors in responsive checks.
- Axe WCAG A/AA automated scans: zero violations at all three requested viewport sizes. Automated scans are not a complete accessibility audit.
- Missing route returns HTTP 404 and the designed page.
- Full-page screenshots captured and visually inspected at **390×844**, **768×1024**, **1440×1000**. No horizontal overflow. Close-up mobile/desktop hero and posters, plus the 1200×630 social PNG, were inspected. The missing diagonal-arrow font glyph was replaced with inline SVG; no-JavaScript mobile navigation uses a nonsticky header so expanded links cannot cover anchor targets.
- Original logo archive contents and public SVG variants were compared byte-for-byte with the supplied files; they match.

Screenshots: [mobile](screenshots/mobile.png), [tablet](screenshots/tablet.png), [desktop](screenshots/desktop.png). Motion is reduced for stable visual evidence.

## Performance evidence

Three cold-cache mobile Chromium lab runs against the local production preview: 390×844 at 2×, 1.6 Mbps down / 750 Kbps up, 150 ms latency, 4× CPU slowdown, four seconds of observation. LCP: **2352 / 2368 / 2360 ms**; CLS: **0 / 0 / 0**. Median LCP **2360 ms**. Raw results: [performance.json](performance.json). Reproduce with `npm run perf` while a production preview runs; `PERF_URL` can point to the eventual deployment.

These are synthetic local measurements, not Lighthouse scores or real-user data. They do not include Vercel edge latency, DNS/TLS, production geography or low-end physical devices. Re-measure the deployed site before making public performance claims.

## Limits and handoff

Only Chromium was available for browser verification; Safari, Firefox and physical-device behavior were not tested. No Vercel connection was available, so project linking, remote build logs, deployed URL, DNS and social-crawler retrieval remain unverified. The reference sites and Binance source were denied by the network proxy; no visual/reference-source verification is claimed. The source's dated copy is preserved and can be disabled with `features.datedNews`.

GitHub Actions is configured to run clean install, checks and tests on pushes/PRs. Local passing results do not establish remote Actions or Vercel deployment success. See [deployment.md](deployment.md) for the remaining browser-based handoff.
