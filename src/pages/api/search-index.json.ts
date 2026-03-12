// search-index.json — minimal enriched index for client-side search.
// Fetches film + cinema data, adds TMDB poster paths, returns compact JSON.
// Cached 1h on CDN (stale-while-revalidate 24h).
export const prerender = false;

import type { APIRoute } from 'astro';
import { fetchFilms, fetchCinemas } from '../../lib/filmcat';
import { fetchTMDBPoster } from '../../lib/tmdb';
import { slugify, cinemaSlug } from '../../lib/slug';

export const GET: APIRoute = async () => {
  const [filmData, cinemasFromApi] = await Promise.all([fetchFilms(), fetchCinemas()]);

  const { films: rawFilms, comingSoon: rawComingSoon } = filmData;

  const films = rawFilms.filter((f) => f.sessions.length > 0);
  const comingSoon = [...rawFilms.filter((f) => f.sessions.length === 0), ...rawComingSoon];

  // Enrich with TMDB poster paths (same as index.astro)
  await Promise.allSettled(
    [...films, ...comingSoon].map(async (film) => {
      const result = await fetchTMDBPoster(film.searchTitle, film.year);
      if (result) film.posterPath = result.posterPath;
    })
  );

  const filmResults = films
    .map((f) => ({
      slug: slugify(f.title), // URL slug — same as /films/[id].astro uses
      title: f.title,
      posterPath: f.posterPath ?? null,
      cinemaCount: new Set(f.sessions.map((s) => s.cinema)).size,
      upcoming: false,
    }))
    .sort((a, b) => b.cinemaCount - a.cinemaCount);

  const upcomingResults = comingSoon.map((f) => ({
    slug: slugify(f.title),
    title: f.title,
    posterPath: f.posterPath ?? null,
    cinemaCount: 0,
    upcoming: true,
  }));

  // If the Gencat cinema API is empty (happens often), derive from session data
  let cinemaList = cinemasFromApi;
  if (cinemaList.length === 0) {
    const seen = new Set<string>();
    cinemaList = [];
    for (const film of films) {
      for (const session of film.sessions) {
        if (!seen.has(session.cinema)) {
          seen.add(session.cinema);
          cinemaList.push({
            id: session.cinema,
            name: session.cinema,
            address: '',
            city: session.city,
            province: '',
            lat: null,
            lng: null,
          });
        }
      }
    }
  }

  const cinemaResults = cinemaList.map((c) => ({
    name: c.name,
    city: c.city,
    slug: cinemaSlug(c.name),
  }));

  return new Response(
    JSON.stringify({
      films: [...filmResults, ...upcomingResults],
      cinemas: cinemaResults,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
};
