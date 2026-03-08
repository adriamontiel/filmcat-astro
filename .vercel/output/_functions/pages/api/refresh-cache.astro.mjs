import { f as fetchFilms } from '../../chunks/filmcat_DweQ5djV.mjs';
import { f as fetchTMDBPoster, g as getCacheSize } from '../../chunks/tmdb_DX24Wr-G.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  const secret = '4a686d802b5e17ae771953e782916720bd8566ba9cfe9000dd77f062c1d7e28a';
  {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  const startTime = Date.now();
  const { films, comingSoon, isOffline } = await fetchFilms();
  if (isOffline) {
    return new Response(
      JSON.stringify({ ok: false, error: 'filmcat API unavailable — cache not warmed' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const allFilms = [...films, ...comingSoon];
  const results = await Promise.allSettled(
    allFilms.map((film) => fetchTMDBPoster(film.searchTitle, film.year))
  );
  const hits = results.filter((r) => r.status === 'fulfilled' && r.value !== null).length;
  const misses = results.filter((r) => r.status === 'fulfilled' && r.value === null).length;
  const errors = results.filter((r) => r.status === 'rejected').length;
  const elapsed = Date.now() - startTime;
  console.log(`[refresh-cache] ${hits} hits, ${misses} misses, ${errors} errors — ${elapsed}ms`);
  return new Response(
    JSON.stringify({
      ok: true,
      films: allFilms.length,
      tmdbHits: hits,
      tmdbMisses: misses,
      tmdbErrors: errors,
      cacheSize: getCacheSize(),
      elapsedMs: elapsed,
      timestamp: /* @__PURE__ */ new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Never cache this endpoint itself
        'Cache-Control': 'no-store',
      },
    }
  );
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
