# Assets and references

## Official source

`Frozen-USD-Logo-Master.zip`, version 1.1, supplied by the user. The complete package is preserved in `assets-original/`, including its SHA256SUMS and master specification. Six SVG variants are copied unchanged to `public/brand/`. The favicon SVG and 32px PNG are direct copies of the approved master. Cyan is **#79DAFF**, ink **#071827**. No finalized wordmark was provided: the site sets Frozen USD in Manrope beside the unchanged emblem.

The full official master — including the approved #79DAFF cyan circle — is embedded unchanged between rear and front ice layers. The foreground has actual partial alpha, fine refraction highlights and surface detail crossing the coin, so the coin sits inside the volume instead of on its face. Pale cyan/white material replaces the dark reflections. The new blank shell was created with OpenAI image generation and is retained at `assets-original/generated/ice-clear-shell.png`; the reproducible layered composition is `assets-original/generated/ice-layered.svg`. `scripts/create-art.mjs` produces 480px/960px WebP exports and the portable SVG used by social artwork. The same object appears in the movement diagram. The earlier `ice-blank.png` is retained as historical source but is no longer used. No runtime image-generation service is required.

The current refinement retains clear front alpha and structural edge shading. The coin, rim and internal shadow now scale together by 1.416 from the original source composition (a further 18% above the preceding 1.2 scale) and move down 46 source pixels. The artificial paired diagonal crack strokes and wide diagonal highlight have been removed entirely; the original shell's texture remains. Both WebP sizes and social previews are regenerated using the scripts below. Standalone logos and official brand files remain unchanged.

## Animation reference

The current hero uses an original SVG/CSS orbit scene based on the owner's description of circulating tokens on Tether. A fresh request to https://tether.to/en/ returned a proxy-policy 403; the live reference was not visually reviewed or copied. Four Frozen USD tokens follow a 20-second elliptical orbit around the central ice cube. Matched front/rear layers establish occlusion, and restrained scale/opacity changes communicate depth. The earlier two-wallet transfer scene, originally informed by the owner's GitHub reference, has been replaced.

Pause freezes the current orbit positions. No-JavaScript and reduced-motion modes show four distinct resting token positions around a complete, static cube. No external motion library, canvas or WebGL engine is required.

## Typography and finished art

Manrope: `@fontsource-variable/manrope` 5.3.0, Latin variable WOFF2, SIL Open Font License (included under `public/fonts/`). Posters use outlined Manrope glyphs, so downloaded SVG files need no externally installed font. Their embedded official SVG logos also have no external dependencies.

- `scripts/create-art.mjs`: composites the official emblem on the retained ice material and writes WebP exports plus a portable SVG wrapper. Run `node scripts/create-art.mjs` from the repository root.
- `scripts/create-posters.py`: writes three 720×900 standalone posters and the 1200×630 social SVG. Optional regeneration needs Python 3 with `fonttools[woff]` (tested with fontTools 4.61.1 and Brotli 1.2.1). Run from the root after generating the ice asset.
- Convert the finished social SVG with the pinned `sharp` development dependency: `node --input-type=module -e "import sharp from 'sharp'; await sharp('public/media/social.svg').png().toFile('public/media/social.png');"`.

The final PNG and all SVGs are committed. Production builds do not execute asset-generation scripts. No external image host, runtime AI service, canvas or WebGL engine is used.

## Design references and access limitations

Requested references:

- https://www.usdc.com/ — primary product-site reference: product promise, action hierarchy and issuer composure.
- https://tether.to/en/ — secondary token presentation reference: clear product identity and factual token details.
- https://www.circle.com/usdc — supporting business-product reference: generous spacing and disciplined explanatory sections.

All three returned proxy policy denials (403) on 2 November 2026. They were **not visually reviewed**. The design follows the prompt's explicit direction: bright surfaces, ink type, glacial cyan, editorial spacing, precise rules and original financial-product artwork. No reference branding, code, imagery or sponsorship campaign was copied.

The supplied Binance update URL was also blocked by network policy. The site preserves the supplied, explicitly dated attribution in a restrained expandable note; it was not independently verified during implementation. The content pack's supporting source document and creative canon were inspected. Internal research/source documents are outside the public web root.
