// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  site: 'https://www.filmcat.app',

  // Allow Astro's <Image> to optimise remote TMDB posters (→ WebP, correct sizing)
  image: {
    domains: ['image.tmdb.org'],
  },
});
