// design-tokens.ts — Single source of truth for all Filmcat CSS design tokens.
// Both Base.astro and DesignSystem.astro derive their :root {} from this file.
// tokens.astro imports this for documentation.
//
// To change a token: edit this file only. The change propagates automatically to:
//   - filmcat.app      (via Base.astro)
//   - filmcat.app/design/tokens (via tokens.astro swatch docs)
//   - filmcat.app/design/*      (via DesignSystem.astro)

export type TokenCategory =
  | 'color-bg'
  | 'color-surface'
  | 'color-text'
  | 'color-accent-red'
  | 'color-accent-gold'
  | 'color-structural'
  | 'spacing'
  | 'radius'
  | 'layout';

export interface DesignToken {
  value: string;
  description: string;
  category: TokenCategory;
}

export const tokens: Record<string, DesignToken> = {
  // ── ACCENT VERMELL (marca, accions, focus) ─────────────────────────────────
  '--red': {
    value: '#c0392b',
    description: 'Base · logo, títols de secció',
    category: 'color-accent-red',
  },
  '--red-light': {
    value: '#e74c3c',
    description: 'Hover · botons, links actius',
    category: 'color-accent-red',
  },
  '--red-dark': {
    value: '#922b21',
    description: 'Pressió · button:active',
    category: 'color-accent-red',
  },
  '--red-focus': {
    value: '#ff6b5b',
    description: 'Focus / badge text · contrast 5.16:1',
    category: 'color-accent-red',
  },

  // ── FONS (profunditat sense color) ─────────────────────────────────────────
  '--bg': {
    value: '#0a0a0c',
    description: 'Fons principal · body, pàgina',
    category: 'color-bg',
  },
  '--bg2': {
    value: '#111115',
    description: 'Fons secundari · sidebar, header',
    category: 'color-bg',
  },
  '--bg3': {
    value: '#18181e',
    description: 'Fons terciari · tooltips, inputs',
    category: 'color-bg',
  },

  // ── SUPERFÍCIES (cards, modals) ─────────────────────────────────────────────
  '--surface': {
    value: '#1e1e26',
    description: 'Superfície primària · cards, panels',
    category: 'color-surface',
  },
  '--surface2': {
    value: '#252530',
    description: 'Superfície secundària · hover states',
    category: 'color-surface',
  },

  // ── ESTRUCTURAL (vores) ────────────────────────────────────────────────────
  '--border': {
    value: 'rgba(255, 255, 255, 0.08)',
    description: 'Vores de cards, separadors',
    category: 'color-structural',
  },

  // ── TEXT (jerarquia per opacitat) ──────────────────────────────────────────
  '--text': {
    value: '#f0f0f0',
    description: 'Text principal · títols, cos',
    category: 'color-text',
  },
  '--text-mid': {
    value: 'rgba(240, 240, 240, 0.72)',
    description: 'Text secundari · metadades',
    category: 'color-text',
  },
  '--muted': {
    value: 'rgba(255, 255, 255, 0.45)',
    description: 'Text desactivat · labels, hints',
    category: 'color-text',
  },

  // ── ACCENT DAURAT (horaris i VO — ús semàntic exclusiu) ────────────────────
  '--gold': {
    value: '#e8c97a',
    description: 'Horaris, estrenes, VO badges',
    category: 'color-accent-gold',
  },

  // ── ESPAIAT & GEOMETRIA ────────────────────────────────────────────────────
  '--px': {
    value: 'clamp(16px, 4vw, 48px)',
    description: 'Padding horitzontal de pàgina (fluid)',
    category: 'spacing',
  },
  '--r-card': {
    value: '12px',
    description: 'Border radius de cards',
    category: 'radius',
  },
  '--r-modal': {
    value: '20px',
    description: 'Border radius de modals i overlays',
    category: 'radius',
  },
  '--nav-h': {
    value: '64px',
    description: 'Alçada del header de navegació',
    category: 'layout',
  },
};

/**
 * Generates a :root { ... } CSS block from the tokens map.
 * @param extra  Additional tokens to include (e.g. { '--sidebar-w': '220px' })
 *               that are context-specific and not part of the global token set.
 */
export function rootCSS(extra?: Record<string, string>): string {
  const lines = Object.entries(tokens).map(([name, t]) => `  ${name}: ${t.value};`);
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      lines.push(`  ${k}: ${v};`);
    }
  }
  return `:root {\n${lines.join('\n')}\n}`;
}

// ── Helpers for tokens.astro documentation ────────────────────────────────────

export const colorGroups: { label: string; desc: string; keys: string[] }[] = [
  {
    label: 'Backgrounds',
    desc: "Capes de fons, de la més fosca a la més clara. S'usen per crear profunditat sense color.",
    keys: ['--bg', '--bg2', '--bg3'],
  },
  {
    label: 'Superfícies',
    desc: 'Per a cards, modals i elements sobreposats al fons.',
    keys: ['--surface', '--surface2'],
  },
  {
    label: 'Text',
    desc: "Jerarquia textual. S'usa el pes d'opacitat per indicar importància.",
    keys: ['--text', '--text-mid', '--muted'],
  },
  {
    label: 'Accent Vermell',
    desc: 'El color de marca. Reservat per a accions, focus i elements destacats de navegació.',
    keys: ['--red', '--red-light', '--red-dark', '--red-focus'],
  },
  {
    label: 'Accent Daurat',
    desc: "Ús semàntic exclusiu: horaris de cinema. No s'usa per a decoració genèrica.",
    keys: ['--gold'],
  },
  {
    label: 'Estructural',
    desc: 'Vores i separadors. El border usa alfa per adaptar-se a qualsevol fons.',
    keys: ['--border'],
  },
];

export const spacingKeys = ['--px', '--r-card', '--r-modal', '--nav-h'];
