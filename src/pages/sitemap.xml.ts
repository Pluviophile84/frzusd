import { site, indexable } from '../config/site';
export function GET() {
  const origin = site.canonicalOrigin
    ?.replace(/\/$/, '')
    .replace(/&/g, '&amp;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexable ? `<url><loc>${origin}/</loc></url>` : ''}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
