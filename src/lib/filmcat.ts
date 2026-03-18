import type { Film, Cinema } from './types';
import {
  CartellerapiResponseSchema,
  CinemasApiResponseSchema,
  RawFilmSchema,
  RawCinemaSchema,
  SessionSchema,
} from './schemas';

const API_URL = 'https://filmcat-api.vercel.app';

const COLORS: Record<string, [string, string]> = {
  VDC: ['#0a0a1a', '#1a1535'],
  VD: ['#0a0a1a', '#1a1535'], // legacy alias — API may still return 'VD'
  VO: ['#0a1a0a', '#0d3a1a'],
  VOSC: ['#1a0a0a', '#3a0d0d'],
};

/** Normalitza les sigles que retorna l'API a la terminologia oficial */
function normalizeVersion(v: string): string {
  return v === 'VD' ? 'VDC' : v;
}

export function mapFilm(raw: Record<string, unknown>, id: number): Film {
  // Validate + coerce with Zod — invalid or missing fields get safe defaults
  const f = RawFilmSchema.parse(raw);

  const version = normalizeVersion(f.version || 'VDC');
  const [color1, color2] = COLORS[version] || COLORS['VDC'];

  const titleOriginal = f.titleOriginal || '';
  const title = f.title || 'Sense títol';
  const searchTitle =
    titleOriginal && titleOriginal !== title ? titleOriginal.split('(')[0].trim() : title;

  const year =
    typeof f.year === 'number' ? f.year : parseInt(String(f.year)) || new Date().getFullYear();

  const trailerKey = f.trailer && f.trailer !== '--' ? f.trailer : null;

  const language = f.language || '';
  const genre = language
    ? language
        .split(';')[0]
        .replace(/\s*\(\d+\s*%\)/, '')
        .trim()
    : 'Cinema';

  const rawSessions = (f.sessions as Array<Record<string, unknown>>) || [];
  const sessions = rawSessions
    .filter((s) => s.cinema && s.cinema !== 'Pendent de confirmar')
    .map((s) => {
      // Validate each session individually — a bad session won't kill the whole film
      const parsed = SessionSchema.safeParse(s);
      const safe = parsed.success ? parsed.data : (s as Record<string, unknown>);
      return {
        cinema: String(safe.cinema || ''),
        city: String(safe.city || ''),
        lang: normalizeVersion(String(safe.lang || version || 'VDC')),
        times: ((safe.times as string[]) || []).slice(0, 7),
      };
    });

  return {
    id: f.id ?? String(id),
    title,
    titleOriginal,
    director: f.director || '',
    synopsis: f.synopsis || '',
    version,
    versionRaw: f.versionRaw || '',
    language,
    rating: f.rating || '',
    year,
    premiere: f.premiere || '',
    trailer: f.trailer || '',
    searchTitle,
    genre,
    duration: '',
    color1,
    color2,
    posterPath: null,
    backdropPath: null,
    _trailerKey: trailerKey,
    sessions,
  };
}

// ── FALLBACK DATA (used if API is unavailable) ──
const FALLBACK_FILMS: Film[] = [
  {
    id: '1',
    title: 'Balandrau, Vent Salvatge',
    titleOriginal: 'Balandrau, Vent Salvatge',
    director: '',
    synopsis: "Un grup de muntanyencs s'enfronta a una tempesta als Pirineus.",
    version: 'VDC',
    year: 2026,
    searchTitle: 'Balandrau Vent Salvatge',
    genre: 'Aventura',
    duration: '116 min',
    color1: '#0a0a1a',
    color2: '#1a1535',
    posterPath: null,
    backdropPath: null,
    _trailerKey: null,
    sessions: [{ cinema: 'Cinemes Verdi', city: 'Barcelona', lang: 'VDC', times: ['Avui'] }],
  },
  {
    id: '2',
    title: 'Zootròpolis 2',
    titleOriginal: 'Zootopia 2',
    director: '',
    synopsis: 'La Judy Hopps i el Nick Wilde tornen amb una nova aventura.',
    version: 'VDC',
    year: 2025,
    searchTitle: 'Zootopia 2',
    genre: 'Animació',
    duration: '108 min',
    color1: '#0a0a1a',
    color2: '#1a1535',
    posterPath: null,
    backdropPath: null,
    _trailerKey: null,
    sessions: [{ cinema: 'Cinesa Diagonal Mar', city: 'Barcelona', lang: 'VDC', times: ['Avui'] }],
  },
];

export const FALLBACK_CINEMAS: Cinema[] = [
  {
    id: '1',
    name: 'Cinemes Verdi',
    address: 'C/ Verdi 32, Gràcia',
    city: 'Barcelona',
    province: 'Barcelona',
    lat: 41.4036,
    lng: 2.1586,
    films: 6,
  },
  {
    id: '2',
    name: 'Cinesa Diagonal Mar',
    address: 'C/ Llull 314-318',
    city: 'Barcelona',
    province: 'Barcelona',
    lat: 41.4097,
    lng: 2.2197,
    films: 7,
  },
];

// ── FETCH FUNCTIONS ──
export async function fetchFilms(): Promise<{
  films: Film[];
  comingSoon: Film[];
  isOffline: boolean;
}> {
  try {
    // Cache-buster horari: la CDN de Vercel ignora Cache-Control en requests,
    // però una URL diferent cada hora força un fetch fresc de l'origen.
    const hourKey = Math.floor(Date.now() / 3_600_000);
    const r = await fetch(`${API_URL}/api/cartellera?_h=${hourKey}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const raw = await r.json();

    // Zod validates the top-level response shape
    const result = CartellerapiResponseSchema.safeParse(raw);
    if (!result.success) {
      if (import.meta.env.DEV)
        console.warn('[filmcat] API response shape invalid:', result.error.flatten().fieldErrors);
      throw new Error('API schema mismatch — Gencat may have changed format');
    }
    const data = result.data;
    if (!data.ok) throw new Error(data.error ?? 'API error');

    return {
      films: data.films.map((f, i) => mapFilm(f, i + 1)),
      comingSoon: data.comingSoon.map((f, i) => mapFilm(f, 100 + i)),
      isOffline: false,
    };
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[filmcat] Usant dades de mostra:', (e as Error).message);
    return { films: FALLBACK_FILMS, comingSoon: [], isOffline: true };
  }
}

export async function fetchCinemas(): Promise<Cinema[]> {
  try {
    const hourKey = Math.floor(Date.now() / 3_600_000);
    const r = await fetch(`${API_URL}/api/cinemes?_h=${hourKey}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const raw = await r.json();

    // Zod validates the cinemas response shape
    const result = CinemasApiResponseSchema.safeParse(raw);
    if (!result.success) {
      if (import.meta.env.DEV)
        console.warn('[filmcat] Cinemes API shape invalid:', result.error.flatten().fieldErrors);
      return [];
    }
    const data = result.data;
    if (!data.ok) throw new Error(data.error ?? 'API error');

    return data.cinemas.map((c) => {
      const cinema = RawCinemaSchema.parse(c);
      return {
        id: cinema.id ?? '',
        name: cinema.name ?? '',
        address: cinema.address ?? '',
        city: cinema.city ?? '',
        province: cinema.province ?? '',
        lat: cinema.lat ?? null,
        lng: cinema.lng ?? null,
      };
    });
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[filmcat] fetchCinemas error:', (e as Error).message);
    return [];
  }
}
