import fs from 'node:fs';
const logo = fs
  .readFileSync('public/brand/Frozen-USD-Master.svg', 'utf8')
  .replace(/<\?xml[^>]*>/, '');
const embedded = Buffer.from(logo).toString('base64');
// The official mark is embedded intact, uniformly scaled, never redrawn or skewed.
const art = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="620" viewBox="0 0 620 620"><defs>
<linearGradient id="front" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".92"/><stop offset=".24" stop-color="#b6e7f5" stop-opacity=".28"/><stop offset=".55" stop-color="#f2fcff" stop-opacity=".7"/><stop offset="1" stop-color="#6bb7d3" stop-opacity=".55"/></linearGradient>
<linearGradient id="side" x1="0" x2="1"><stop stop-color="#69b5d0" stop-opacity=".5"/><stop offset=".45" stop-color="#d5f7ff" stop-opacity=".65"/><stop offset="1" stop-color="#89c6da" stop-opacity=".32"/></linearGradient>
<linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#faffff"/><stop offset=".6" stop-color="#b8e3ef" stop-opacity=".6"/><stop offset="1" stop-color="#effcff"/></linearGradient>
<linearGradient id="edge" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#e1f8ff"/><stop offset="1" stop-color="#7ebfd6"/></linearGradient>
<radialGradient id="coin"><stop stop-color="#edfcff"/><stop offset=".8" stop-color="#9cdff2"/><stop offset=".94" stop-color="#468ca9"/><stop offset="1" stop-color="#c6effa"/></radialGradient>
<linearGradient id="glint" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".25"/><stop offset=".55" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="blur"><feGaussianBlur stdDeviation="14"/></filter><filter id="shadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="14" stdDeviation="13" flood-color="#29647e" flood-opacity=".18"/></filter>
</defs>
<ellipse cx="315" cy="510" rx="158" ry="24" fill="#3d7a94" opacity=".18" filter="url(#blur)"/>
<g filter="url(#shadow)">
<path d="M147 176 Q141 166 155 158 L366 83 Q377 79 389 89 L479 158 Q488 164 488 180 L471 396 Q470 408 456 415 L250 501 Q237 507 226 497 L134 419 Q126 412 128 397Z" fill="#e0f4fa" fill-opacity=".3" stroke="#acd3e3" stroke-width="2"/>
<path d="M150 170 L373 91 477 170 253 255Z" fill="url(#top)" stroke="#fff" stroke-width="2"/>
<path d="M253 255 L477 170 463 400 241 493Z" fill="url(#side)" stroke="#b6e1ef" stroke-width="2"/>
<path d="M145 177 L253 255 241 493 137 413Z" fill="url(#side)"/>
<path d="M165 185 L369 113 454 178 252 251Z" fill="#fff" opacity=".23"/>
<path d="M160 194 L370 122 453 184 440 386 242 468 151 400Z" fill="url(#front)" stroke="#eafaff" stroke-opacity=".8" stroke-width="1.5"/>
<circle cx="308" cy="295" r="112" fill="#347b98" opacity=".18"/>
<circle cx="303" cy="286" r="110" fill="url(#coin)" stroke="#e9faff" stroke-width="3"/>
<circle cx="303" cy="286" r="100" fill="#abdeed" stroke="#639fb7" stroke-width="1"/>
<image href="data:image/svg+xml;base64,${embedded}" x="208" y="191" width="190" height="190"/>
<circle cx="303" cy="286" r="97" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>
<path d="M145 177 L369 99 475 171 460 397 241 489 137 411Z" fill="url(#glint)"/>
<path d="M150 178 L251 258 239 483 M251 258 L476 173" fill="none" stroke="url(#edge)" stroke-width="6" stroke-linejoin="round" opacity=".8"/>
<path d="M157 176 L368 103 M147 398 L239 474 M258 477 L450 397 M472 186 L457 385" stroke="white" stroke-width="2" stroke-linecap="round" fill="none" opacity=".9"/>
<path d="M173 198 L166 260 178 280 169 315 M428 205 L417 234 425 250 411 267 M268 429 L294 416 300 400 327 387 M182 384 L199 373 206 351" fill="none" stroke="#fff" stroke-width="1.5" opacity=".6"/>
<path d="M180 207 L172 252 M432 289 L436 345 M273 455 L322 434" stroke="#ecfcff" stroke-width="5" opacity=".5" stroke-linecap="round"/>
<g fill="#fff" opacity=".55"><circle cx="181" cy="332" r="2"/><circle cx="201" cy="405" r="2.5"/><circle cx="412" cy="362" r="2"/><circle cx="391" cy="181" r="2"/><circle cx="283" cy="170" r="1.8"/><circle cx="421" cy="307" r="1.5"/><circle cx="352" cy="411" r="1.7"/></g>
</g></svg>`;
fs.writeFileSync('public/media/frozen-dollar.svg', art);
