// @ts-check
import js from '@eslint/js';
import tsEslint from 'typescript-eslint';
import pluginAstro from 'eslint-plugin-astro';

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript files
  ...tsEslint.configs.recommended,

  // Astro files
  ...pluginAstro.configs.recommended,

  // Global ignores
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },

  // Project-wide overrides
  {
    rules: {
      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Allow explicit any in fetch/API mapping code
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
