import { site, indexable } from '../config/site';
export function GET() {
  return new Response(
    indexable
      ? `User-agent: *\nAllow: /\nSitemap: ${site.canonicalOrigin!.replace(/\/$/, '')}/sitemap.xml\n`
      : 'User-agent: *\nDisallow: /\n',
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
