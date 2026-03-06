// sitemap.xml.ts — dynamic sitemap with all film URLs
import type { APIRoute } from 'astro';
import { fetchFilms } from '../lib/filmcat';
import { slugify }    from '../lib/slug';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://filmcat.cat';

  const { films, comingSoon } = await fetchFilms();
  const allFilms = [...films, ...comingSoon];

  // Deduplicate slugs (in case two films have the same title)
  const seen = new Set<string>();
  const filmUrls: string[] = [];
  for (const film of allFilms) {
    const slug = slugify(film.title);
    if (!seen.has(slug)) {
      seen.add(slug);
      filmUrls.push(slug);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${filmUrls.map(slug => `  <url>
    <loc>${siteUrl}/films/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=604800, stale-while-revalidate=86400',
    },
  });
};
