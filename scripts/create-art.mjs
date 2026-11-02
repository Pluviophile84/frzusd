import fs from 'node:fs';
import sharp from 'sharp';
// Generated ice material contains no logo. Composite the untouched official
// symbol as a separate uniformly scaled layer, preserving its exact geometry.
const emblem = await sharp('public/brand/Frozen-USD-Symbol-Ink.svg')
  .resize(440, 440)
  .png()
  .toBuffer();
const master = await sharp('assets-original/generated/ice-blank.png')
  .composite([{ input: emblem, left: 400, top: 390 }])
  .png()
  .toBuffer();
await sharp(master)
  .resize(960, 960)
  .webp({ quality: 88 })
  .toFile('public/media/frozen-dollar.webp');
await sharp(master)
  .resize(480, 480)
  .webp({ quality: 85 })
  .toFile('public/media/frozen-dollar-small.webp');
// Portable wrapper used by the social artwork generator.
const raster = await sharp(master).resize(620, 620).png().toBuffer();
fs.writeFileSync(
  'public/media/frozen-dollar.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="620" viewBox="0 0 620 620"><image width="620" height="620" href="data:image/png;base64,${raster.toString('base64')}"/></svg>`,
);
