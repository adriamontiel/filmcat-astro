export interface Session {
  cinema: string;
  city: string;
  lang: 'VD' | 'VO' | 'VOSC' | string;
  times: string[];
}

export interface Film {
  id: string;
  title: string;
  titleOriginal: string;
  director: string;
  synopsis: string;
  version: 'VD' | 'VO' | 'VOSC' | string;
  versionRaw?: string;
  language?: string;
  rating?: string;
  year: number;
  premiere?: string;
  trailer?: string;
  poster?: string;
  sessions: Session[];
  // computed client-side
  searchTitle: string;
  genre: string;
  duration: string;
  color1: string;
  color2: string;
  // from TMDB (populated server-side)
  posterPath: string | null;
  backdropPath: string | null;
  _tmdbId?: number;
  _trailerKey?: string | null;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  lat: number | null;
  lng: number | null;
  films?: number;
}
