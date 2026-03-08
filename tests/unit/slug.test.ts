import { describe, it, expect } from 'vitest';
import { slugify } from '../../src/lib/slug';

describe('slugify', () => {
  it('lowercase and replaces spaces with dashes', () => {
    expect(slugify('Hola Món')).toBe('hola-mon');
  });

  it('strips Catalan diacritics', () => {
    expect(slugify('Àngels i Dimonis')).toBe('angels-i-dimonis');
    expect(slugify('Pèl·lícula')).toBe('pel-licula');
    expect(slugify('Però Açò')).toBe('pero-aco');
  });

  it('handles accented vowels', () => {
    expect(slugify('Balandrau, Vent Salvatge')).toBe('balandrau-vent-salvatge');
    expect(slugify('Zootròpolis 2')).toBe('zootropolis-2');
  });

  it('collapses multiple non-alphanumeric chars into one dash', () => {
    expect(slugify('Film: Una (nova) aventura!')).toBe('film-una-nova-aventura');
  });

  it('trims leading and trailing dashes', () => {
    expect(slugify('  --Hola--  ')).toBe('hola');
  });

  it('handles numbers in titles', () => {
    expect(slugify('Toy Story 4')).toBe('toy-story-4');
    expect(slugify('2001: A Space Odyssey')).toBe('2001-a-space-odyssey');
  });

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('handles single word', () => {
    expect(slugify('Oppenheimer')).toBe('oppenheimer');
  });

  it('strips ens & ell-es (Catalan punctuation)', () => {
    expect(slugify("L'Últim Acte")).toBe('l-ultim-acte');
  });
});
