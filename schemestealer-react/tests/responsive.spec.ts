/**
 * Responsive audit verification.
 *
 * Screenshots every key route at phone/tablet/desktop widths (plus one
 * landscape phone) and asserts the page never scrolls horizontally — the
 * blanket regression signal for crushed/overflowing layouts. Store state is
 * seeded so the requisition cart (long paint names — the reported squash)
 * and the session runner render with real content.
 */

import { test, expect, Page } from '@playwright/test';

const VIEWPORTS = [
  { name: '320', width: 320, height: 658 },
  { name: '360', width: 360, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
  { name: 'land740', width: 740, height: 360 },
];

const ROUTES: Array<{ path: string; name: string; setup?: (page: Page) => Promise<void> }> = [
  { path: '/', name: 'home' },
  { path: '/miniature', name: 'miniature' },
  { path: '/inspiration', name: 'inspiration' },
  { path: '/forge', name: 'forge-inventory' },
  {
    path: '/forge',
    name: 'forge-cart',
    setup: async (page) => {
      await page.getByRole('button', { name: /requisition/i }).click();
      await page.waitForTimeout(400);
    },
  },
  { path: '/daily', name: 'daily' },
  { path: '/session', name: 'session' },
  { path: '/convert/pro-acryl-bright-pale-yellow-to-ak', name: 'convert' },
  { path: '/paints/pro-acryl/pro-acryl-bright-pale-yellow', name: 'paints' },
];

const SEEDED_STATE = {
  state: {
    cart: [
      { paint: { name: 'Thunderhawk Blue Air', brand: 'citadel', hex: '#3d5c6f' }, quantity: 2, addedFrom: 'miniature' },
      { paint: { name: 'Averland Sunset', brand: 'citadel', hex: '#fbb81c' }, quantity: 1, addedFrom: 'miniature' },
      { paint: { name: 'Screaming Bell', brand: 'citadel', hex: '#7d3c2e' }, quantity: 3, addedFrom: 'inspiration' },
    ],
    inventory: [],
    activeSession: {
      scanId: 'responsive-spec',
      startedAt: new Date().toISOString(),
      colours: [
        {
          colourIndex: 0,
          brand: 'citadel',
          hex: '#e195b9',
          steps: [
            { role: 'base', paintName: 'Emperors Children', status: 'pending' },
            { role: 'wash', paintName: 'Carroburg Crimson', status: 'drying', dryUntil: Date.now() + 300000 },
          ],
        },
        {
          colourIndex: 1,
          brand: 'citadel',
          hex: '#93c5cd',
          steps: [{ role: 'base', paintName: 'Lothern Blue', status: 'pending' }],
        },
      ],
      dryTimeOverrides: {},
    },
  },
  version: 0,
};

test.describe('responsive layout', () => {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${route.name} @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.addInitScript((seed) => {
          window.localStorage.setItem('schemestealer-storage', JSON.stringify(seed));
          // Consent decided so the banner doesn't cover every screenshot.
          window.localStorage.setItem('schemestealer-analytics-consent', 'denied');
        }, SEEDED_STATE);

        await page.goto(route.path, { waitUntil: 'networkidle' });
        if (route.setup) await route.setup(page);
        await page.waitForTimeout(600); // settle entry animations

        // The blanket regression assertion: no horizontal scroll, ever.
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        }));
        expect(
          overflow.scrollWidth,
          `${route.name} overflows horizontally at ${vp.width}px (${overflow.scrollWidth} > ${overflow.innerWidth})`
        ).toBeLessThanOrEqual(overflow.innerWidth + 1);

        await page.screenshot({
          path: `test-results/responsive/${route.name}-${vp.name}.png`,
          fullPage: true,
        });
      });
    }
  }
});
