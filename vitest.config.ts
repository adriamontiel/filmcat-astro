import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Unit tests live next to source or in tests/unit/
    include: ['src/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**/*.ts'],
    },
  },
});
