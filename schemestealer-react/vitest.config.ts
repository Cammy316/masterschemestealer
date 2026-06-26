import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Pure-logic unit tests (the colour-family lock). Node env — no DOM needed.
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
});
