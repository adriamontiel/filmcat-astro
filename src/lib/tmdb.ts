// tmdb.ts — server-side TMDB poster fetch with in-process cache.
//
// WHY A CACHE?
// Each page request previously called TMDB once per film (~10-20 calls),
// adding 3-8 s of latency. With the cache:
//   • Warm serverless instance: cache hit → 0 TMDB calls → ~200 ms page load
//   • Cold start: cache miss → TMDB calls → results stored for next request
//
// The Vercel cron job (/api/refresh-cache) pre-warms the cache every Thursday
// so that the first real visitor after a weekly content update still gets a fast
// response. TTL is 8 hours (well within the 7-day s-maxage CDN cache).

const TMDB_KEY = import.meta.env.TMDB_KEY;
const PATH_RE = /^\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/;

export interface TMDBResult {
  posterPath: string | null;
  backdropPath: string | null;
  tmdbId: number;
}

export interface TMDBDetails {
  runtime: number | null;
  genres: string[];
}

// ── In-process cache ─────────────────────────────────────────────────────────
// Key: `${searchTitle}__${year}`
// Value: { result, expiresAt }
// Note: this cache lives in the Node.js module scope — it persists across
// requests within the same serverless function instance (Vercel reuses warm
// instances for subsequent requests). Cross-instance persistence requires
// Vercel KV, which can be added later without changing this interface.

const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

interface CacheEntry {
  result: TMDBResult | null;
  expiresAt: number;
}

const _cache = new Map<string, CacheEntry>();

function cacheKey(title: string, year: number): string {
  return `${title.toLowerCase()}__${year}`;
}

export function getCachedPoster(title: string, year: number): TMDBResult | null | undefined {
  const entry = _cache.get(cacheKey(title, year));
  if (!entry) return undefined; // miss
  if (Date.now() > entry.expiresAt) {
    // expired
    _cache.delete(cacheKey(title, year));
    return undefined;
  }
  return entry.result; // hit (may be null = "not found")
}

export function setCachedPoster(title: string, year: number, result: TMDBResult | null): void {
  _cache.set(cacheKey(title, year), { result, expiresAt: Date.now() + TTL_MS });
}

/** Returns current cache size — used by the /api/refresh-cache health endpoint */
export function getCacheSize(): number {
  return _cache.size;
}

// ── Fetch with cache ─────────────────────────────────────────────────────────
export async function fetchTMDBPoster(
  searchTitle: string,
  year: number
): Promise<TMDBResult | null> {
  if (!TMDB_KEY) return null;

  // 1. Cache hit
  const cached = getCachedPoster(searchTitle, year);
  if (cached !== undefined) return cached;

  // 2. Cache miss → call TMDB
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchTitle)}&include_adult=false`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) {
      setCachedPoster(searchTitle, year, null);
      return null;
    }
    const data = await r.json();

    const match = (data.results as Array<Record<string, unknown>>)?.find((m) => {
      if (!m.release_date) return false;
      const resultYear = parseInt((m.release_date as string).slice(0, 4));
      return Math.abs(resultYear - year) <= 1 && m.poster_path;
    });

    if (!match) {
      setCachedPoster(searchTitle, year, null);
      return null;
    }

    const result: TMDBResult = {
      posterPath: PATH_RE.test(match.poster_path as string) ? (match.poster_path as string) : null,
      backdropPath: PATH_RE.test(match.backdrop_path as string)
        ? (match.backdrop_path as string)
        : null,
      tmdbId: match.id as number,
    };

    setCachedPoster(searchTitle, year, result);
    return result;
  } catch {
    setCachedPoster(searchTitle, year, null);
    return null;
  }
}

export const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BIG = 'https://image.tmdb.org/t/p/w780';

// ── Genre name translations (EN → CA) ────────────────────────────────────────
// TMDB's Catalan translations are incomplete; this map fills the gaps so users
// always see genre names in Catalan.
const GENRE_CA: Record<string, string> = {
  Action: 'Acció',
  Adventure: 'Aventura',
  Animation: 'Animació',
  Comedy: 'Comèdia',
  Crime: 'Crim',
  Documentary: 'Documental',
  Drama: 'Drama',
  Family: 'Família',
  Fantasy: 'Fantasia',
  History: 'Història',
  Horror: 'Terror',
  Music: 'Música',
  Mystery: 'Misteri',
  Romance: 'Romanç',
  'Science Fiction': 'Ciència-ficció',
  'TV Movie': 'Telefilm',
  Thriller: 'Thriller',
  War: 'Bèl·lic',
  Western: 'Western',
};

function toCA(name: string): string {
  return GENRE_CA[name] ?? name;
}

// ── TMDB Film Details (runtime + genres) ─────────────────────────────────────
// Used on the individual film detail page only (not fetched for all 80 films
// on the index page). Cached with the same 8-hour TTL as poster results.

interface DetailsCacheEntry {
  result: TMDBDetails | null;
  expiresAt: number;
}

const _detailsCache = new Map<number, DetailsCacheEntry>();

/**
 * Fetches runtime and genre names (in Catalan) for a film already identified
 * by its TMDB ID. Returns null if the API is unavailable or the key is missing.
 */
export async function fetchTMDBDetails(tmdbId: number): Promise<TMDBDetails | null> {
  if (!TMDB_KEY) return null;

  // Cache hit
  const cached = _detailsCache.get(tmdbId);
  if (cached) {
    if (Date.now() < cached.expiresAt) return cached.result;
    _detailsCache.delete(tmdbId);
  }

  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_KEY}&language=ca`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) {
      _detailsCache.set(tmdbId, { result: null, expiresAt: Date.now() + TTL_MS });
      return null;
    }

    const data = await r.json();

    const result: TMDBDetails = {
      runtime: typeof data.runtime === 'number' && data.runtime > 0 ? data.runtime : null,
      genres: Array.isArray(data.genres)
        ? (data.genres as Array<{ name: string }>).map((g) => toCA(g.name))
        : [],
    };

    _detailsCache.set(tmdbId, { result, expiresAt: Date.now() + TTL_MS });
    return result;
  } catch {
    _detailsCache.set(tmdbId, { result: null, expiresAt: Date.now() + TTL_MS });
    return null;
  }
}
