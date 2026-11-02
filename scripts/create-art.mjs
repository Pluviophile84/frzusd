import fs from 'node:fs';
import sharp from 'sharp';
// Sandwich the unchanged, approved cyan master between separate ice layers.
// The ice carries genuine alpha so the scene remains visible through its body.
const { data, info } = await sharp(
  'assets-original/generated/ice-clear-shell.png',
)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const front = Buffer.from(data);
for (let y = 0; y < info.height; y++)
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const l =
      (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
    const radius = Math.max(
      Math.abs((x - 625) / 420),
      Math.abs((y - 650) / 425),
    );
    const edge = Math.min(1, Math.max(0, (radius - 0.53) / 0.47));
    front[i] = Math.round(160 + 95 * l);
    front[i + 1] = Math.round(195 + 60 * l);
    front[i + 2] = Math.round(215 + 40 * l);
    front[i + 3] = Math.round(
      data[i + 3] * Math.min(0.9, 0.09 + 0.65 * edge + (1 - l) * 0.55),
    );
  }
// Restore the approved clear centre. Strengthen only existing thicker edge
// regions, weighted toward the lower boundary and right side. Original source
// luminance preserves fine cracks, bubbles and illuminated upper highlights.
const rearIce = await sharp(front, { raw: info }).png().toBuffer();
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const l =
      (data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722) / 255;
    const radius = Math.max(
      Math.abs((x - 625) / 420),
      Math.abs((y - 650) / 425),
    );
    const edge = Math.min(1, Math.max(0, (radius - 0.58) / 0.42));
    const lower = Math.min(1, Math.max(0, (y - 450) / 580));
    const side = Math.min(1, Math.max(0, (x - 800) / 240));
    const thickness =
      edge * Math.max(lower, side * 0.85) * (0.35 + 0.65 * (1 - l));
    front[i] = Math.round(front[i] - 100 * thickness);
    front[i + 1] = Math.round(front[i + 1] - 79 * thickness);
    front[i + 2] = Math.round(front[i + 2] - 60 * thickness);
  }
}
const ice = await sharp(front, { raw: info }).png().toBuffer();
const rearShell = rearIce.toString('base64');
const emblem = fs
  .readFileSync('public/brand/Frozen-USD-Master.svg')
  .toString('base64');
const shell = ice.toString('base64');
const scene = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1280" viewBox="0 0 1280 1280"><defs><linearGradient id="veil" x1="0" y1="0" x2="1" y2="1"><stop stop-color="white" stop-opacity=".19"/><stop offset=".5" stop-color="#e9faff" stop-opacity=".025"/><stop offset="1" stop-color="#a6e8ff" stop-opacity=".12"/></linearGradient><filter id="depth"><feGaussianBlur stdDeviation="13"/></filter><clipPath id="clear-front"><rect x="350" y="310" width="600" height="680" rx="55"/></clipPath></defs>
<image href="data:image/png;base64,${rearShell}" width="1280" height="1280" opacity=".45"/>
<g transform="translate(625 681) scale(1.416) translate(-625 -635)">
<circle cx="637" cy="650" r="222" fill="#4ba7c7" opacity=".12" filter="url(#depth)"/>
<circle cx="625" cy="635" r="223" fill="#d2f4ff" stroke="#a5daed" stroke-width="3"/>
<image href="data:image/svg+xml;base64,${emblem}" x="410" y="420" width="430" height="430"/>
</g>
<image href="data:image/png;base64,${shell}" width="1280" height="1280"/>
<g clip-path="url(#clear-front)"><rect x="350" y="310" width="600" height="680" fill="url(#veil)"/></g></svg>`;
const master = await sharp(Buffer.from(scene)).png().toBuffer();
await sharp(master)
  .resize(960, 960)
  .webp({ quality: 88 })
  .toFile('public/media/frozen-dollar.webp');
await sharp(master)
  .resize(480, 480)
  .webp({ quality: 85 })
  .toFile('public/media/frozen-dollar-small.webp');
const raster = await sharp(master).resize(620, 620).png().toBuffer();
fs.writeFileSync(
  'public/media/frozen-dollar.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="620" viewBox="0 0 620 620"><image width="620" height="620" href="data:image/png;base64,${raster.toString('base64')}"/></svg>`,
);
// Retain a reproducible layered source outside the public web root.
fs.writeFileSync('assets-original/generated/ice-layered.svg', scene);
