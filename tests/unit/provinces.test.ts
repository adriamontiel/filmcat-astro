import { describe, it, expect } from 'vitest';
import { cityToProvince, PROVINCE_ORDER } from '../../src/lib/provinces';

describe('cityToProvince', () => {
  it('maps Barcelona cities correctly', () => {
    expect(cityToProvince('Barcelona')).toBe('Barcelona');
    expect(cityToProvince('Badalona')).toBe('Barcelona');
    expect(cityToProvince('Sabadell')).toBe('Barcelona');
  });

  it('maps Girona cities correctly', () => {
    expect(cityToProvince('Girona')).toBe('Girona');
    expect(cityToProvince('Figueres')).toBe('Girona');
    expect(cityToProvince('Blanes')).toBe('Girona');
    expect(cityToProvince("Platja d'Aro")).toBe('Girona');
  });

  it('maps Tarragona cities correctly', () => {
    expect(cityToProvince('Tarragona')).toBe('Tarragona');
    expect(cityToProvince('Reus')).toBe('Tarragona');
    expect(cityToProvince('Tortosa')).toBe('Tarragona');
  });

  it('maps Lleida cities correctly', () => {
    expect(cityToProvince('Lleida')).toBe('Lleida');
    expect(cityToProvince('Alpicat')).toBe('Lleida');
    expect(cityToProvince("La Seu d'Urgell")).toBe('Lleida');
  });

  it('maps València cities correctly', () => {
    expect(cityToProvince('València')).toBe('València');
    expect(cityToProvince('Valencia')).toBe('València'); // alternate spelling
    expect(cityToProvince('Gandia')).toBe('València');
  });

  it('maps Andorra correctly', () => {
    expect(cityToProvince('Andorra la Vella')).toBe('Andorra');
    expect(cityToProvince('Escaldes-Engordany')).toBe('Andorra');
  });

  it('defaults unknown city to Barcelona', () => {
    expect(cityToProvince('Greenland')).toBe('Barcelona');
    expect(cityToProvince('')).toBe('Barcelona');
  });

  it('is case-insensitive', () => {
    expect(cityToProvince('GIRONA')).toBe('Girona');
    expect(cityToProvince('lleida')).toBe('Lleida');
  });
});

describe('PROVINCE_ORDER', () => {
  it('has 6 provinces in the correct order', () => {
    expect(PROVINCE_ORDER).toEqual([
      'Barcelona',
      'Girona',
      'Tarragona',
      'Lleida',
      'València',
      'Andorra',
    ]);
  });

  it('starts with Barcelona', () => {
    expect(PROVINCE_ORDER[0]).toBe('Barcelona');
  });
});
