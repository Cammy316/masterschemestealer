/**
 * Shared E2E fixtures: a canned persisted scan + network stubs.
 *
 * Seeding localStorage directly (rather than driving the real upload) lets the
 * results-page tests run deterministically without the heavy @imgly client-side
 * background-removal path or a live backend. The shape mirrors what the Zustand
 * `persist` middleware writes: { state: <partialized>, version: 0 } under the
 * 'schemestealer-storage' key.
 */
import type { Page } from '@playwright/test';

export const STORAGE_KEY = 'schemestealer-storage';

const brandRecipe = (baseHex: string) => ({
  base: { name: 'Base Paint', hex: baseHex, type: 'base', deltaE: 1.2 },
  shade: { name: 'Shade Paint', hex: '#2e2020', type: 'shade', deltaE: 3.1 },
  highlight: { name: 'Highlight Paint', hex: '#d49a9a', type: 'layer', deltaE: 2.4 },
  wash: { name: 'Nuln Oil', hex: '#141414', type: 'wash', deltaE: 0 },
});

const colour = (hex: string, rgb: number[], lab: number[], family: string, pct: number) => ({
  hex,
  rgb,
  lab,
  family,
  percentage: pct,
  paintRecipe: {
    citadel: brandRecipe(hex),
    vallejo: brandRecipe(hex),
    army_painter: brandRecipe(hex),
  },
});

const scan = {
  id: 'e2e-seed-1',
  mode: 'miniature',
  timestamp: '2026-06-30T00:00:00.000Z',
  analysisSource: 'backend',
  recommendedPaints: [],
  detectedColors: [
    colour('#8a3a3a', [138, 58, 58], [40, 35, 20], 'red', 55),
    colour('#3a5a8a', [58, 90, 138], [40, 5, -30], 'blue', 30),
  ],
};

export const SEEDED_STATE = {
  cart: [],
  scanHistory: [scan],
  currentScan: scan,
  preferredBrands: ['all'],
  preferredRegion: 'global',
};

/** Pre-seed a committed miniature scan into localStorage before the app boots. */
export async function seedScan(page: Page): Promise<void> {
  await page.addInitScript(
    ([key, state]) => {
      window.localStorage.setItem(key as string, JSON.stringify({ state, version: 0 }));
    },
    [STORAGE_KEY, SEEDED_STATE] as const
  );
}

/** Stub every /api/** call with a benign 200 so background logging never errors. */
export async function mockApiGeneric(page: Page): Promise<void> {
  await page.route('**/api/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ status: 'ok', ready: true, events_logged: 0 }),
    })
  );
}
