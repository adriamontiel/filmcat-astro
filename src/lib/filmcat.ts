import type { Film, Cinema } from './types';

const API_URL = 'https://filmcat-api.vercel.app';

const COLORS: Record<string, [string, string]> = {
  'VD':   ['#0a0a1a', '#1a1535'],
  'VO':   ['#0a1a0a', '#0d3a1a'],
  'VOSC': ['#1a0a0a', '#3a0d0d'],
};

function mapFilm(f: Record<string, unknown>, id: number): Film {
  const version = (f.version as string) || 'VD';
  const [color1, color2] = COLORS[version] || COLORS['VD'];

  const titleOriginal = (f.titleOriginal as string) || '';
  const title = (f.title as string) || 'Sense títol';
  const searchTitle = titleOriginal && titleOriginal !== title
    ? titleOriginal.split('(')[0].trim()
    : title;

  const year = parseInt(f.year as string) || new Date().getFullYear();
  const trailerKey = f.trailer && f.trailer !== '--' ? (f.trailer as string) : null;

  const language = (f.language as string) || '';
  const genre = language
    ? language.split(';')[0].replace(/\s*\(\d+\s*%\)/, '').trim()
    : 'Cinema';

  const rawSessions = (f.sessions as Array<Record<string, unknown>>) || [];
  const sessions = rawSessions
    .filter(s => s.cinema && s.cinema !== 'Pendent de confirmar')
    .map(s => ({
      cinema: (s.cinema as string) || '',
      city:   (s.city as string) || '',
      lang:   (s.lang as string) || version || 'VD',
      times:  ((s.times as string[]) || []).slice(0, 7),
    }));

  return {
    id:            (f.id as string) || String(id),
    title,
    titleOriginal,
    director:      (f.director as string) || '',
    synopsis:      (f.synopsis as string) || '',
    version,
    versionRaw:    (f.versionRaw as string) || '',
    language,
    rating:        (f.rating as string) || '',
    year,
    premiere:      (f.premiere as string) || '',
    trailer:       (f.trailer as string) || '',
    searchTitle,
    genre,
    duration:      '',
    color1,
    color2,
    posterPath:    null,
    backdropPath:  null,
    _trailerKey:   trailerKey,
    sessions,
  };
}

// ── FALLBACK DATA (used if API is unavailable) ──
const FALLBACK_FILMS: Film[] = [
  { id:'1', title:'Balandrau, Vent Salvatge', titleOriginal:'Balandrau, Vent Salvatge', director:'', synopsis:'Un grup de muntanyencs s\'enfronta a una tempesta als Pirineus.', version:'VD', year:2026, searchTitle:'Balandrau Vent Salvatge', genre:'Aventura', duration:'116 min', color1:'#0a0a1a', color2:'#1a1535', posterPath:null, backdropPath:null, _trailerKey:null, sessions:[{cinema:'Cinemes Verdi', city:'Barcelona', lang:'VD', times:['Avui']}] },
  { id:'2', title:'Zootròpolis 2', titleOriginal:'Zootopia 2', director:'', synopsis:'La Judy Hopps i el Nick Wilde tornen amb una nova aventura.', version:'VD', year:2025, searchTitle:'Zootopia 2', genre:'Animació', duration:'108 min', color1:'#0a0a1a', color2:'#1a1535', posterPath:null, backdropPath:null, _trailerKey:null, sessions:[{cinema:'Cinesa Diagonal Mar', city:'Barcelona', lang:'VD', times:['Avui']}] },
];

const FALLBACK_CINEMAS: Cinema[] = [
  { id:'1', name:'Cinemes Verdi', address:'C/ Verdi 32, Gràcia', city:'Barcelona', province:'Barcelona', lat:41.4036, lng:2.1586, films:6 },
  { id:'2', name:'Cinesa Diagonal Mar', address:'C/ Llull 314-318', city:'Barcelona', province:'Barcelona', lat:41.4097, lng:2.2197, films:7 },
];

// ── FETCH FUNCTIONS ──
export async function fetchFilms(): Promise<{ films: Film[]; comingSoon: Film[] }> {
  try {
    const r = await fetch(`${API_URL}/api/cartellera`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (!data.ok) throw new Error(data.error);
    return {
      films:     (data.films     || []).map((f: Record<string, unknown>, i: number) => mapFilm(f, i + 1)),
      comingSoon:(data.comingSoon|| []).map((f: Record<string, unknown>, i: number) => mapFilm(f, 100 + i)),
    };
  } catch (e) {
    console.warn('[filmcat] Usant dades de mostra:', (e as Error).message);
    return { films: FALLBACK_FILMS, comingSoon: [] };
  }
}

export async function fetchCinemas(): Promise<Cinema[]> {
  try {
    const r = await fetch(`${API_URL}/api/cinemes`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    if (!data.ok) throw new Error(data.error || 'API error');
    // API may return empty list — return it as-is, caller can derive from sessions
    const list = (data.cinemas as Array<Record<string, unknown>>) || [];
    return list.map(c => ({
      id:       (c.id as string)       || '',
      name:     (c.name as string)     || '',
      address:  (c.address as string)  || '',
      city:     (c.city as string)     || '',
      province: (c.province as string) || '',
      lat:      (c.lat as number)      || null,
      lng:      (c.lng as number)      || null,
    }));
  } catch (e) {
    console.warn('[filmcat] fetchCinemas error:', (e as Error).message);
    return [];
  }
}
