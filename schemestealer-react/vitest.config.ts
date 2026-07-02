import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Pure-logic unit tests (colour family, colour maths, store races) plus
    // the cross-stack parity suite in tests/. Playwright specs stay on
    // *.spec.ts and are NOT picked up here. Node env — no DOM needed; setup
    // adds an in-memory localStorage so the store's `persist` middleware works.
    include: ['lib/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
});
