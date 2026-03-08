// /api/refresh-cache — called every Thursday by the Vercel cron job.
//
// What it does:
//   1. Fetches all current films from the filmcat API
//   2. Calls TMDB for each film's poster (populating the in-process cache)
//   3. Returns a JSON summary of the warm-up result
//
// Security: the endpoint checks for a shared secret token so that only
// the cron job (or an authorised caller) can trigger a refresh.
// Set CRON_SECRET in Vercel environment variables.

import type { APIRoute } from 'astro';
import { fetchFilms } from '../../lib/filmcat';
import { fetchTMDBPoster, getCacheSize } from '../../lib/tmdb';

export const GET: APIRoute = async ({ request }) => {
  // ── Auth: require CRON_SECRET header ─────────────────────────────────────
  const secret = import.meta.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  const startTime = Date.now();

  // ── Fetch all films ───────────────────────────────────────────────────────
  const { films, comingSoon, isOffline } = await fetchFilms();
  if (isOffline) {
    return new Response(
      JSON.stringify({ ok: false, error: 'filmcat API unavailable — cache not warmed' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Warm TMDB cache for every film ───────────────────────────────────────
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
      timestamp: new Date().toISOString(),
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
