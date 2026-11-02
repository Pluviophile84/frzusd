# Assets and references

## Official source

`Frozen-USD-Logo-Master.zip`, version 1.1, supplied by the user. The complete package is preserved in `assets-original/`, including its SHA256SUMS and master specification. Six SVG variants are copied unchanged to `public/brand/`. The favicon SVG and 32px PNG are direct copies of the approved master. Cyan is **#79DAFF**, ink **#071827**. No finalized wordmark was provided: the site sets FROZEN USD in Manrope beside the unchanged emblem.

The logo's path is embedded unchanged and uniformly scaled in artwork. It is not generated, redrawn, skewed or replaced. The ice block is an original vector illustration, not a claim of photorealism. Layered faces, beveled edges, gradients, rim lighting, a coin, restrained fracture lines and a soft shadow provide the material treatment. The same object recurs in the movement diagram.

## Typography and finished art

Manrope: `@fontsource-variable/manrope` 5.3.0, Latin variable WOFF2, SIL Open Font License (included under `public/fonts/`). Posters use outlined Manrope glyphs, so downloaded SVG files need no externally installed font. Their embedded official SVG logos also have no external dependencies.

- `scripts/create-art.mjs`: writes the original vector ice composition. Run `node scripts/create-art.mjs` from the repository root.
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
