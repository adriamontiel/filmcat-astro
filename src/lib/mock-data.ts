// mock-data.ts — Realistic mock data for the Design System component previews.
// Used exclusively by src/pages/design/components.astro.
// posterPath: null → no TMDB network calls at render time; poster-placeholder renders instead.

import type { Film, Cinema } from './types';

export const mockFilms: Film[] = [
  // Film with sessions — shows VDC badge, rating, genre
  {
    id: 'mock-1',
    title: 'El Comte de Montecristo',
    titleOriginal: 'Le Comte de Monte-Cristo',
    director: 'Alexandre de la Patellière',
    synopsis:
      "Adaptació moderna del clàssic d'Alexandre Dumas. Edmond Dantès, un jove mariner injustament empresonat, escapa i es transforma en el misteriós i ric Comte de Montecristo per venjar-se dels qui el van trair.",
    version: 'VDC',
    language: 'Català',
    rating: 'A partir de 12 anys',
    year: 2024,
    genre: 'Aventura',
    duration: '178 min',
    color1: '#1a0a05',
    color2: '#3d1a0a',
    posterPath: null,
    backdropPath: null,
    searchTitle: 'el comte de montecristo',
    sessions: [
      {
        cinema: 'Cinemes Sant Cugat',
        city: 'Sant Cugat del Vallès',
        lang: 'VDC',
        times: ['16:00', '19:00', '21:30'],
      },
      {
        cinema: 'CineBaix de Sant Feliu de Llobregat',
        city: 'Sant Feliu de Llobregat',
        lang: 'VDC',
        times: ['18:30', '21:15'],
      },
    ],
  },
  // Upcoming film — shows tag-premiere, VOSC badge, no sessions
  {
    id: 'mock-2',
    title: 'Vals amb Bashir',
    titleOriginal: 'Waltz with Bashir',
    director: 'Ari Folman',
    synopsis:
      "Documental d'animació sobre la guerra del Líban de 1982. Un director de cinema intenta recuperar els records perduts de la seva experiència com a soldat, reconstruint la nit de la massacre de Sabra i Chatila.",
    version: 'VOSC',
    language: 'Hebreu',
    rating: 'A partir de 16 anys',
    year: 2008,
    premiere: '15/05/2026',
    genre: 'Documental',
    duration: '90 min',
    color1: '#060d1a',
    color2: '#0d1a2e',
    posterPath: null,
    backdropPath: null,
    searchTitle: 'vals amb bashir',
    sessions: [],
  },
];

export const mockCinemas: Cinema[] = [
  {
    id: 'mock-cinema-1',
    name: 'Cinemes Sant Cugat',
    address: 'C. de Francesc Macià, 17',
    city: 'Sant Cugat del Vallès',
    province: 'Barcelona',
    lat: 41.4728,
    lng: 2.0834,
    films: 7,
  },
  {
    id: 'mock-cinema-2',
    name: 'Zumzeig Cinecooperativa',
    address: 'C. de Béjar, 53',
    city: 'Barcelona',
    province: 'Barcelona',
    lat: 41.3724,
    lng: 2.1474,
    films: 4,
  },
];
