// schemas.ts — Zod runtime validation for the filmcat API response.
// If Gencat changes the XML structure (field names, types), these schemas
// will catch the mismatch immediately and fall back to sample data rather
// than silently rendering empty/broken UI.

import { z } from 'zod';

// ── Session (one cinema + time-slots inside a film) ──────────────────────────
export const SessionSchema = z.object({
  cinema: z.string().default(''),
  city: z.string().default(''),
  lang: z.string().default('VDC'),
  times: z.array(z.string()).default([]),
});

// ── Raw film as returned by /api/cartellera ───────────────────────────────────
export const RawFilmSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).optional(),
  title: z.string().default('Sense títol'),
  titleOriginal: z.string().optional().default(''),
  director: z.string().optional().default(''),
  synopsis: z.string().optional().default(''),
  version: z.string().optional().default('VDC'),
  versionRaw: z.string().optional().default(''),
  language: z.string().optional().default(''),
  rating: z.string().optional().default(''),
  year: z.union([z.string(), z.number()]).optional().default(new Date().getFullYear()),
  premiere: z.string().optional().default(''),
  trailer: z.string().optional().default(''),
  sessions: z.array(z.record(z.unknown())).optional().default([]),
});

// ── Top-level API response from /api/cartellera ───────────────────────────────
export const CartellerapiResponseSchema = z.object({
  ok: z.boolean(),
  films: z.array(z.record(z.unknown())).default([]),
  comingSoon: z.array(z.record(z.unknown())).default([]),
  error: z.string().optional(),
});

// ── Raw cinema as returned by /api/cinemes ────────────────────────────────────
export const RawCinemaSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String).optional().default(''),
  name: z.string().default(''),
  address: z.string().optional().default(''),
  city: z.string().default(''),
  province: z.string().optional().default(''),
  lat: z.number().nullable().optional().default(null),
  lng: z.number().nullable().optional().default(null),
});

// ── Top-level API response from /api/cinemes ──────────────────────────────────
export const CinemasApiResponseSchema = z.object({
  ok: z.boolean(),
  cinemas: z.array(z.record(z.unknown())).default([]),
  error: z.string().optional(),
});

export type RawFilm = z.infer<typeof RawFilmSchema>;
export type RawCinema = z.infer<typeof RawCinemaSchema>;
