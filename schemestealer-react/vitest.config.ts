import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Pure-logic unit tests (the colour-family lock) + the Zustand store race
    // tests. Node env — no DOM needed; setup adds an in-memory localStorage so
    // the store's `persist` middleware works.
    include: ['lib/**/*.test.ts'],
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
  },
});
