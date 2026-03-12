// lib/rating.ts — converts Gencat QUALIFICACIO text to a short badge label
// Values observed: "Apte per a tots els públics", "A partir de N anys", "--"

export interface RatingInfo {
  /** Short display label: "TP", "+7", "+16" */
  short: string;
  /** Full Catalan text for accessible title/tooltip */
  full: string;
  /** Visual severity level for colour coding */
  level: 'low' | 'mid' | 'high';
}

/**
 * Returns a RatingInfo object from a raw Gencat rating string,
 * or null if the rating is absent / unknown ("--").
 *
 * Level mapping:
 *   low  → TP, +3, +4, +5, +7  (green)
 *   mid  → +10, +12             (amber)
 *   high → +16, +18             (orange)
 */
export function ratingInfo(raw: string | undefined | null): RatingInfo | null {
  if (!raw || raw === '--') return null;

  if (raw === 'Apte per a tots els públics') {
    return { short: 'TP', full: raw, level: 'low' };
  }

  const m = raw.match(/A partir de (\d+) anys/i);
  if (!m) return null;

  const age = parseInt(m[1], 10);
  const level: RatingInfo['level'] = age <= 7 ? 'low' : age <= 12 ? 'mid' : 'high';
  return { short: `+${age}`, full: raw, level };
}
