import { availableParallelism } from 'node:os';

import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration.
 *
 * Discovers source-level and workspace-level unit tests.
 * Route tests start an in-memory PostgreSQL, so workers are capped and hooks wait longer.
 *
 * @since 0.0.0
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    hookTimeout: 60_000,
    include: [
      'src/**/*.test.ts',
      'tests/**/*.test.ts',
    ],
    maxWorkers: Math.max(1, Math.min(4, Math.floor(availableParallelism() / 2))),
    passWithNoTests: true,
    testTimeout: 30_000,
  },
});
