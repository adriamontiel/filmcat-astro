const TMDB_KEY = import.meta.env.TMDB_KEY;
const PATH_RE  = /^\/[a-zA-Z0-9_\-]+\.(jpg|png|webp)$/;

export interface TMDBResult {
  posterPath:   string | null;
  backdropPath: string | null;
  tmdbId:       number;
}

export async function fetchTMDBPoster(
  searchTitle: string,
  year: number,
): Promise<TMDBResult | null> {
  if (!TMDB_KEY) return null;
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(searchTitle)}&include_adult=false`,
      { signal: AbortSignal.timeout(6000) },
    );
    if (!r.ok) return null;
    const data = await r.json();

    const match = (data.results as Array<Record<string, unknown>>)?.find(m => {
      if (!m.release_date) return false;
      const resultYear = parseInt((m.release_date as string).slice(0, 4));
      return Math.abs(resultYear - year) <= 1 && m.poster_path;
    });

    if (!match) return null;

    return {
      posterPath:   PATH_RE.test(match.poster_path as string) ? (match.poster_path as string) : null,
      backdropPath: PATH_RE.test(match.backdrop_path as string) ? (match.backdrop_path as string) : null,
      tmdbId:       match.id as number,
    };
  } catch {
    return null;
  }
}

export const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
export const TMDB_BIG = 'https://image.tmdb.org/t/p/w780';
