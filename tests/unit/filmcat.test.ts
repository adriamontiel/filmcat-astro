import { describe, it, expect } from 'vitest';
import { mapFilm } from '../../src/lib/filmcat';

// Minimal valid raw film object from the API
const baseRaw: Record<string, unknown> = {
  id: 'abc123',
  title: 'Balandrau, Vent Salvatge',
  version: 'VD',
  year: '2026',
  sessions: [],
};

describe('mapFilm', () => {
  it('maps basic fields correctly', () => {
    const film = mapFilm(baseRaw, 1);
    expect(film.id).toBe('abc123');
    expect(film.title).toBe('Balandrau, Vent Salvatge');
    expect(film.version).toBe('VD');
    expect(film.year).toBe(2026);
  });

  it('assigns VD gradient colors for VD version', () => {
    const film = mapFilm({ ...baseRaw, version: 'VD' }, 1);
    expect(film.color1).toBe('#0a0a1a');
    expect(film.color2).toBe('#1a1535');
  });

  it('assigns VO gradient colors for VO version', () => {
    const film = mapFilm({ ...baseRaw, version: 'VO' }, 1);
    expect(film.color1).toBe('#0a1a0a');
    expect(film.color2).toBe('#0d3a1a');
  });

  it('assigns VOSC gradient colors for VOSC version', () => {
    const film = mapFilm({ ...baseRaw, version: 'VOSC' }, 1);
    expect(film.color1).toBe('#1a0a0a');
    expect(film.color2).toBe('#3a0d0d');
  });

  it('uses originalTitle for searchTitle when different from title', () => {
    const film = mapFilm(
      {
        ...baseRaw,
        title: 'Zootròpolis 2',
        titleOriginal: 'Zootopia 2',
      },
      1
    );
    expect(film.searchTitle).toBe('Zootopia 2');
  });

  it('uses title for searchTitle when originalTitle matches', () => {
    const film = mapFilm(
      {
        ...baseRaw,
        title: 'Balandrau',
        titleOriginal: 'Balandrau',
      },
      1
    );
    expect(film.searchTitle).toBe('Balandrau');
  });

  it('strips year suffix from titleOriginal when building searchTitle', () => {
    const film = mapFilm(
      {
        ...baseRaw,
        title: 'Algun Film',
        titleOriginal: 'Some Film (2024)',
      },
      1
    );
    expect(film.searchTitle).toBe('Some Film');
  });

  it('extracts genre from language field', () => {
    const film = mapFilm(
      {
        ...baseRaw,
        language: 'Aventura (60%);Drama (40%)',
      },
      1
    );
    expect(film.genre).toBe('Aventura');
  });

  it('defaults genre to "Cinema" when language is empty', () => {
    const film = mapFilm({ ...baseRaw, language: '' }, 1);
    expect(film.genre).toBe('Cinema');
  });

  it('filters out "Pendent de confirmar" sessions', () => {
    const film = mapFilm(
      {
        ...baseRaw,
        sessions: [
          { cinema: 'Pendent de confirmar', city: 'Barcelona', lang: 'VD', times: ['18:00'] },
          { cinema: 'Cinemes Verdi', city: 'Barcelona', lang: 'VD', times: ['20:00'] },
        ],
      },
      1
    );
    expect(film.sessions).toHaveLength(1);
    expect(film.sessions[0].cinema).toBe('Cinemes Verdi');
  });

  it('limits session times to 7 max', () => {
    const film = mapFilm(
      {
        ...baseRaw,
        sessions: [
          {
            cinema: 'Cinemes Verdi',
            city: 'Barcelona',
            lang: 'VD',
            times: [
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
            ],
          },
        ],
      },
      1
    );
    expect(film.sessions[0].times).toHaveLength(7);
  });

  it('sets null trailerKey when trailer is "--"', () => {
    const film = mapFilm({ ...baseRaw, trailer: '--' }, 1);
    expect(film._trailerKey).toBeNull();
  });

  it('keeps trailerKey when trailer is a valid YouTube key', () => {
    const film = mapFilm({ ...baseRaw, trailer: 'dQw4w9WgXcQ' }, 1);
    expect(film._trailerKey).toBe('dQw4w9WgXcQ');
  });

  it('defaults missing fields to safe values', () => {
    const film = mapFilm({ title: 'Test' }, 99);
    expect(film.id).toBe('99');
    expect(film.synopsis).toBe('');
    expect(film.director).toBe('');
    expect(film.posterPath).toBeNull();
    expect(film.backdropPath).toBeNull();
    expect(film.sessions).toEqual([]);
  });

  it('parses year from string', () => {
    const film = mapFilm({ ...baseRaw, year: '2025' }, 1);
    expect(film.year).toBe(2025);
  });
});
