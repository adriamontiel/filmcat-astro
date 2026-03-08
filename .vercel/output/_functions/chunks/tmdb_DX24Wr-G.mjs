const TMDB_KEY = '2dca580c2a14b55200e784d157207b4d';
const PATH_RE = /^\/[a-zA-Z0-9_-]+\.(jpg|png|webp)$/;
const TTL_MS = 8 * 60 * 60 * 1e3;
const _cache = /* @__PURE__ */ new Map();
function cacheKey(title, year) {
  return `${title.toLowerCase()}__${year}`;
}
function getCachedPoster(title, year) {
  const entry = _cache.get(cacheKey(title, year));
  if (!entry) return void 0;
  if (Date.now() > entry.expiresAt) {
    _cache.delete(cacheKey(title, year));
    return void 0;
  }
  return entry.result;
}
function setCachedPoster(title, year, result) {
  _cache.set(cacheKey(title, year), { result, expiresAt: Date.now() + TTL_MS });
}
function getCacheSize() {
  return _cache.size;
}
async function fetchTMDBPoster(searchTitle, year) {
  const cached = getCachedPoster(searchTitle, year);
  if (cached !== void 0) return cached;
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchTitle)}&include_adult=false`,
      { signal: AbortSignal.timeout(6e3) }
    );
    if (!r.ok) {
      setCachedPoster(searchTitle, year, null);
      return null;
    }
    const data = await r.json();
    const match = data.results?.find((m) => {
      if (!m.release_date) return false;
      const resultYear = parseInt(m.release_date.slice(0, 4));
      return Math.abs(resultYear - year) <= 1 && m.poster_path;
    });
    if (!match) {
      setCachedPoster(searchTitle, year, null);
      return null;
    }
    const result = {
      posterPath: PATH_RE.test(match.poster_path) ? match.poster_path : null,
      backdropPath: PATH_RE.test(match.backdrop_path) ? match.backdrop_path : null,
      tmdbId: match.id,
    };
    setCachedPoster(searchTitle, year, result);
    return result;
  } catch {
    setCachedPoster(searchTitle, year, null);
    return null;
  }
}
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

export { TMDB_IMG as T, fetchTMDBPoster as f, getCacheSize as g };
