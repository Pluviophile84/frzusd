# Verification record

Validated in the managed cloud checkout on 2 November 2026 using Node.js 24.19.0, npm 11.9.0 and system Chromium. Dependencies are exact versions in the generated npm lockfile.

## Refinement

The ticker remains `$FUSD` and the display name `Frozen USD`. The new pale ice asset encloses the complete approved cyan logo between separate ice layers. The exported image has actual partial alpha through the ice body, while the coin itself stays opaque. Highlights and surface detail cross in front of the coin. The same asset is used in the hero, product diagram and regenerated social card.

The current hero replaces the earlier two-wallet transfer with a 20-second token orbit. Four official cyan tokens pass behind and in front of the central ice cube, with scale and opacity changing by depth. Browser assertions verify movement on both axes, varying depth, pause holding the current position, and four distinct static positions under reduced motion. The requested live Tether reference returned a proxy-policy 403; the composition follows the owner's description rather than a claimed visual inspection.

The top anchor now sits at the actual document origin rather than on the sticky header. Both logos and the footer return link use document scrolling without reloading the homepage. Three browser regression tests verify intermediate smooth-scroll positions and arrival at zero, and another verifies immediate reduced-motion return and updated branding.

## Reserve narrative and latest clear-ice refinement

Added the exact supplied reserve copy in the hero, a dedicated section immediately after Hero, shared header/mobile/footer navigation, and the FAQ. The token configuration, factual table, financial clarification, official brand assets and motion implementation remain unchanged.

The latest refinement enlarges the enclosed coin by a further 18% (1.2 → 1.416 source scale) and lowers its center by 46 source pixels. Coin, rim and internal shadow move coherently. The artificial paired crack strokes and diagonal highlight have been removed entirely. Original shell texture, transparent front ice, structural edge shading and standalone official assets remain unchanged. The same treatment was exported to large/small WebP, portable SVG and social previews; poster artwork remains unchanged.

Reserves now has a light glacial gradient (#f1f9fc → #e3f2f8), ink headings, teal figures, readable muted supporting text and fine blue-gray rules. Copy, layout, links, token configuration and financial clarification remain unchanged.

[Current matching coin comparison](screenshots/coin-position-comparison.png) shows both export sizes at the same size and background. [Desktop reserves](screenshots/reserves-1440.png) and [mobile reserves](screenshots/reserves-390.png) show the light treatment. Hero screenshots at 390, 768, 901, 1024, 1100 and 1440px showed no horizontal overflow. The enlarged coin remains contained by a visible ice border. Actual small cubes in Idea and Product stages and the social PNG were inspected.

Orbit phases: [start](screenshots/orbit-start.png), [2.5 seconds](screenshots/orbit-eighth.png), [6.5 seconds](screenshots/orbit-third.png). Earlier density/clear-ice and transfer screenshots remain historical evidence.

## Results

- Clean `npm ci`: passed.
- `npm run check`: zero errors, warnings or hints.
- `npm run build`: static homepage, 404, robots and sitemap generated successfully, with default null launch configuration and no secrets.
- `npm test`: **8 configuration tests and 16 browser tests passed**, none skipped. Browser tests use actual production builds, including an isolated live configuration.
- Default pre-launch has no Copy, Explorer, Buy or unconfigured social actions. Live fixture exposes address, trading and explorer controls; clipboard success and failure are announced. Invalid live values are rejected by configuration tests.
- Keyboard menu activation, Tab order, Escape/focus restoration, FAQ, pause, reduced motion and no-JavaScript navigation/content verified.
- Internal anchors resolve; three downloaded assets contain standalone SVG artwork; all local images decode. No browser page errors in responsive checks.
- Axe WCAG A/AA automated scans: zero violations at all three requested viewport sizes. Automated scans are not a complete accessibility audit.
- Missing route returns HTTP 404 and the designed page.
- Full-page screenshots captured and visually inspected at **390×844**, **768×1024**, **1440×1000**. No horizontal overflow. Close-up mobile/desktop hero and posters, plus the 1200×630 social PNG, were inspected. The missing diagonal-arrow font glyph was replaced with inline SVG; no-JavaScript mobile navigation uses a nonsticky header so expanded links cannot cover anchor targets.
- Original logo archive contents and public SVG variants were compared byte-for-byte with the supplied files; they match.

Screenshots: [mobile](screenshots/mobile.png), [tablet](screenshots/tablet.png), [desktop](screenshots/desktop.png). Motion is reduced for stable full-page visual evidence. The current orbit phases are linked above; earlier transfer captures are historical.

## Performance evidence from the preceding refinement

These measurements predate the reserve-section update; performance was not remeasured for the subsequent visual refinements. Three cold-cache mobile Chromium lab runs against the local production preview: 390×844 at 2×, 1.6 Mbps down / 750 Kbps up, 150 ms latency, 4× CPU slowdown, four seconds of observation. LCP: **2304 / 2288 / 2272 ms**; CLS: **0 / 0 / 0**. Median LCP **2288 ms**. Raw results: [performance.json](performance.json). Reproduce with `npm run perf` while a production preview runs; `PERF_URL` can point to the eventual deployment.

These are synthetic local measurements, not Lighthouse scores or real-user data. They do not include Vercel edge latency, DNS/TLS, production geography or low-end physical devices. Re-measure the deployed site before making public performance claims.

## Limits and handoff

Only Chromium was available for browser verification; Safari, Firefox and physical-device behavior were not tested. No Vercel connection was available, so project linking, remote build logs, deployed URL, DNS and social-crawler retrieval remain unverified. The original external design-reference sites and Binance source were denied by the network proxy; no visual/source verification is claimed for those URLs. The subsequently supplied GitHub `frozenusd` animation reference was accessible and visually inspected. The source's dated copy is preserved and can be disabled with `features.datedNews`.

GitHub Actions is configured to run clean install, checks and tests on pushes/PRs. Local passing results do not establish remote Actions or Vercel deployment success. See [deployment.md](deployment.md) for the remaining browser-based handoff.
