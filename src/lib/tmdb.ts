// tmdb.ts — server-side TMDB poster fetch with two-level cache.
//
// CACHE ARCHITECTURE
// ──────────────────
// L1 — In-process Map (module scope)
//   • Persists across requests on the same warm serverless instance.
//   • Zero-latency reads; lost on cold starts.
//
// L2 — Vercel KV (Redis)
//   • Persists across ALL instances and cold starts.
//   • Requires KV_REST_API_URL + KV_REST_API_TOKEN env vars (set
//     automatically when you link a KV database in the Vercel dashboard).
//   • Gracefully disabled when env vars are absent (local dev, or if KV
//     is not yet provisioned).
//   • Non-fatal: any KV error falls through to a TMDB API call.
//
// FETCH STRATEGY (fetchTMDBPoster)
// ─────────────────────────────────
//   1. L1 hit → return immediately (0 ms)
//   2. L2 hit → populate L1, return (~5–15 ms, no TMDB call)
//   3. TMDB call → store in both L1 and L2
//
// The Vercel cron job (/api/refresh-cache) pre-warms KV every Thursday
// so cold starts after a weekly data update still get a fast response.
// TTL is 8 hours (well within the 7-day s-maxage CDN cache).

import { kv } from '@vercel/kv';

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

// ── L1: In-process cache ──────────────────────────────────────────────────────
// Key: `${searchTitle}__${year}`   Value: { result, expiresAt }

const TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const TTL_SEC = 8 * 60 * 60; // same, in seconds (for KV ex option)

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
    _cache.delete(cacheKey(title, year));
    return undefined; // expired
  }
  return entry.result; // hit (may be null = "not found on TMDB")
}

export function setCachedPoster(title: string, year: number, result: TMDBResult | null): void {
  _cache.set(cacheKey(title, year), { result, expiresAt: Date.now() + TTL_MS });
}

/** Returns current L1 cache size — used by the /api/refresh-cache health endpoint */
export function getCacheSize(): number {
  return _cache.size;
}

// ── L2: Vercel KV helpers ─────────────────────────────────────────────────────
// KV stores { v: TMDBResult | null } to distinguish a key miss (kv.get → null)
// from a stored "TMDB returned nothing" entry ({ v: null }).

interface KVEntry {
  v: TMDBResult | null;
}

// KV is enabled only when the required env vars are present.
// @vercel/kv throws if called without them, so we guard every call.
const KV_ENABLED = !!(import.meta.env.KV_REST_API_URL && import.meta.env.KV_REST_API_TOKEN);

async function kvGet(key: string): Promise<TMDBResult | null | undefined> {
  if (!KV_ENABLED) return undefined;
  try {
    const entry = await kv.get<KVEntry>(`tmdb:${key}`);
    return entry == null ? undefined : entry.v; // null → miss, {v:…} → hit
  } catch {
    return undefined; // KV failure is non-fatal
  }
}

async function kvSet(key: string, val: TMDBResult | null): Promise<void> {
  if (!KV_ENABLED) return;
  try {
    await kv.set<KVEntry>(`tmdb:${key}`, { v: val }, { ex: TTL_SEC });
  } catch {
    // KV failure is non-fatal — L1 and future TMDB calls are the fallback
  }
}

// ── Raw TMDB HTTP call ────────────────────────────────────────────────────────

/** Raw TMDB HTTP call — no caching. Returns null on miss, error or bad key. */
async function _callTMDB(title: string, year: number): Promise<TMDBResult | null> {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}&include_adult=false`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!r.ok) return null;

    const data = await r.json();
    const match = (data.results as Array<Record<string, unknown>>)?.find((m) => {
      if (!m.release_date) return false;
      const resultYear = parseInt((m.release_date as string).slice(0, 4));
      return Math.abs(resultYear - year) <= 1 && m.poster_path;
    });
    if (!match) return null;

    return {
      posterPath: PATH_RE.test(match.poster_path as string) ? (match.poster_path as string) : null,
      backdropPath: PATH_RE.test(match.backdrop_path as string)
        ? (match.backdrop_path as string)
        : null,
      tmdbId: match.id as number,
    };
  } catch {
    return null;
  }
}

// ── fetchTMDBPoster (L1 → L2 → TMDB) ────────────────────────────────────────

/**
 * Fetch TMDB poster for a film, with optional fallback to the original title.
 *
 * Strategy:
 *  1. L1 (in-process) hit for `searchTitle` → return immediately.
 *  2. L2 (KV) hit for `searchTitle` → populate L1, return.
 *  3. TMDB call with `searchTitle`.
 *  4. On TMDB miss AND `fallbackTitle` differs: repeat steps 1-2-3 for
 *     the original title (e.g. English/French/etc.).
 *  5. Store winning result in both L1 and L2 under all tried keys.
 */
export async function fetchTMDBPoster(
  searchTitle: string,
  year: number,
  fallbackTitle?: string
): Promise<TMDBResult | null> {
  if (!TMDB_KEY) return null;

  const primaryKey = cacheKey(searchTitle, year);

  // 1. L1 hit
  const l1 = getCachedPoster(searchTitle, year);
  if (l1 !== undefined) return l1;

  // 2. L2 hit
  const l2 = await kvGet(primaryKey);
  if (l2 !== undefined) {
    setCachedPoster(searchTitle, year, l2); // promote to L1
    return l2;
  }

  // 3. TMDB call — primary title
  const primaryResult = await _callTMDB(searchTitle, year);
  if (primaryResult !== null) {
    setCachedPoster(searchTitle, year, primaryResult);
    await kvSet(primaryKey, primaryResult);
    return primaryResult;
  }

  // 4. Primary returned nothing — try the original title if it differs
  const normalFallback = fallbackTitle?.trim().toLowerCase();
  const normalPrimary = searchTitle.trim().toLowerCase();

  if (normalFallback && normalFallback !== normalPrimary) {
    const fallbackKey = cacheKey(fallbackTitle!, year);

    // L1 hit for fallback
    const l1Fallback = getCachedPoster(fallbackTitle!, year);
    if (l1Fallback !== undefined) {
      setCachedPoster(searchTitle, year, l1Fallback);
      return l1Fallback;
    }

    // L2 hit for fallback
    const l2Fallback = await kvGet(fallbackKey);
    if (l2Fallback !== undefined) {
      setCachedPoster(fallbackTitle!, year, l2Fallback);
      setCachedPoster(searchTitle, year, l2Fallback);
      return l2Fallback;
    }

    // TMDB call — fallback title
    const fallbackResult = await _callTMDB(fallbackTitle!, year);
    // Store under both keys so future lookups for either title are instant
    setCachedPoster(fallbackTitle!, year, fallbackResult);
    setCachedPoster(searchTitle, year, fallbackResult);
    await kvSet(fallbackKey, fallbackResult);
    await kvSet(primaryKey, fallbackResult);
    return fallbackResult;
  }

  // No result — cache the miss so we don't hammer TMDB again
  setCachedPoster(searchTitle, year, null);
  await kvSet(primaryKey, null);
  return null;
}

export const TMDB_185 = 'https://image.tmdb.org/t/p/w185';
export const TMDB_342 = 'https://image.tmdb.org/t/p/w342';
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
