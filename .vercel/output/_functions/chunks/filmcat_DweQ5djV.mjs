import { z } from 'zod';

const SessionSchema = z.object({
  cinema: z.string().default(''),
  city: z.string().default(''),
  lang: z.string().default('VD'),
  times: z.array(z.string()).default([]),
});
const RawFilmSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).optional(),
  title: z.string().default('Sense títol'),
  titleOriginal: z.string().optional().default(''),
  director: z.string().optional().default(''),
  synopsis: z.string().optional().default(''),
  version: z.string().optional().default('VD'),
  versionRaw: z.string().optional().default(''),
  language: z.string().optional().default(''),
  rating: z.string().optional().default(''),
  year: z
    .union([z.string(), z.number()])
    .optional()
    .default(/* @__PURE__ */ new Date().getFullYear()),
  premiere: z.string().optional().default(''),
  trailer: z.string().optional().default(''),
  sessions: z.array(z.record(z.unknown())).optional().default([]),
});
const CartellerapiResponseSchema = z.object({
  ok: z.boolean(),
  films: z.array(z.record(z.unknown())).default([]),
  comingSoon: z.array(z.record(z.unknown())).default([]),
  error: z.string().optional(),
});
const RawCinemaSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).optional().default(''),
  name: z.string().default(''),
  address: z.string().optional().default(''),
  city: z.string().default(''),
  province: z.string().optional().default(''),
  lat: z.number().nullable().optional().default(null),
  lng: z.number().nullable().optional().default(null),
});
const CinemasApiResponseSchema = z.object({
  ok: z.boolean(),
  cinemas: z.array(z.record(z.unknown())).default([]),
  error: z.string().optional(),
});

const API_URL = 'https://filmcat-api.vercel.app';
const COLORS = {
  VD: ['#0a0a1a', '#1a1535'],
  VO: ['#0a1a0a', '#0d3a1a'],
  VOSC: ['#1a0a0a', '#3a0d0d'],
};
function mapFilm(raw, id) {
  const f = RawFilmSchema.parse(raw);
  const version = f.version || 'VD';
  const [color1, color2] = COLORS[version] || COLORS['VD'];
  const titleOriginal = f.titleOriginal || '';
  const title = f.title || 'Sense títol';
  const searchTitle =
    titleOriginal && titleOriginal !== title ? titleOriginal.split('(')[0].trim() : title;
  const year =
    typeof f.year === 'number'
      ? f.year
      : parseInt(String(f.year)) || /* @__PURE__ */ new Date().getFullYear();
  const trailerKey = f.trailer && f.trailer !== '--' ? f.trailer : null;
  const language = f.language || '';
  const genre = language
    ? language
        .split(';')[0]
        .replace(/\s*\(\d+\s*%\)/, '')
        .trim()
    : 'Cinema';
  const rawSessions = f.sessions || [];
  const sessions = rawSessions
    .filter((s) => s.cinema && s.cinema !== 'Pendent de confirmar')
    .map((s) => {
      const parsed = SessionSchema.safeParse(s);
      const safe = parsed.success ? parsed.data : s;
      return {
        cinema: String(safe.cinema || ''),
        city: String(safe.city || ''),
        lang: String(safe.lang || version),
        times: (safe.times || []).slice(0, 7),
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
const FALLBACK_FILMS = [
  {
    id: '1',
    title: 'Balandrau, Vent Salvatge',
    titleOriginal: 'Balandrau, Vent Salvatge',
    director: '',
    synopsis: "Un grup de muntanyencs s'enfronta a una tempesta als Pirineus.",
    version: 'VD',
    year: 2026,
    searchTitle: 'Balandrau Vent Salvatge',
    genre: 'Aventura',
    duration: '116 min',
    color1: '#0a0a1a',
    color2: '#1a1535',
    posterPath: null,
    backdropPath: null,
    _trailerKey: null,
    sessions: [{ cinema: 'Cinemes Verdi', city: 'Barcelona', lang: 'VD', times: ['Avui'] }],
  },
  {
    id: '2',
    title: 'Zootròpolis 2',
    titleOriginal: 'Zootopia 2',
    director: '',
    synopsis: 'La Judy Hopps i el Nick Wilde tornen amb una nova aventura.',
    version: 'VD',
    year: 2025,
    searchTitle: 'Zootopia 2',
    genre: 'Animació',
    duration: '108 min',
    color1: '#0a0a1a',
    color2: '#1a1535',
    posterPath: null,
    backdropPath: null,
    _trailerKey: null,
    sessions: [{ cinema: 'Cinesa Diagonal Mar', city: 'Barcelona', lang: 'VD', times: ['Avui'] }],
  },
];
async function fetchFilms() {
  try {
    const r = await fetch(`${API_URL}/api/cartellera`, {
      signal: AbortSignal.timeout(12e3),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const raw = await r.json();
    const result = CartellerapiResponseSchema.safeParse(raw);
    if (!result.success) {
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
    console.warn('[filmcat] Usant dades de mostra:', e.message);
    return { films: FALLBACK_FILMS, comingSoon: [], isOffline: true };
  }
}
async function fetchCinemas() {
  try {
    const r = await fetch(`${API_URL}/api/cinemes`, {
      signal: AbortSignal.timeout(8e3),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const raw = await r.json();
    const result = CinemasApiResponseSchema.safeParse(raw);
    if (!result.success) {
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
    console.warn('[filmcat] fetchCinemas error:', e.message);
    return [];
  }
}

export { fetchCinemas as a, fetchFilms as f };
