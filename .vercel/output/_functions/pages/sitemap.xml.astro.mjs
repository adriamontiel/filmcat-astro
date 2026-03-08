import { f as fetchFilms } from '../chunks/filmcat_DweQ5djV.mjs';
import { s as slugify } from '../chunks/slug_Ds8KCdkD.mjs';
export { renderers } from '../renderers.mjs';

const GET = async ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://filmcat.cat';
  const { films, comingSoon } = await fetchFilms();
  const allFilms = [...films, ...comingSoon];
  const seen = /* @__PURE__ */ new Set();
  const filmUrls = [];
  for (const film of allFilms) {
    const slug = slugify(film.title);
    if (!seen.has(slug)) {
      seen.add(slug);
      filmUrls.push(slug);
    }
  }
  const today = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${filmUrls
  .map(
    (slug) => `  <url>
    <loc>${siteUrl}/films/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=604800, stale-while-revalidate=86400',
    },
  });
};

const _page = /*#__PURE__*/ Object.freeze(
  /*#__PURE__*/ Object.defineProperty(
    {
      __proto__: null,
      GET,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);

const page = () => _page;

export { page };
