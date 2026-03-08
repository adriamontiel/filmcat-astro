export { renderers } from '../renderers.mjs';

const GET = ({ site }) => {
  const siteUrl = site?.toString().replace(/\/$/, '') || 'https://filmcat.cat';
  const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=86400',
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
