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
  // Tall Androids (Pixel-class) — the worst case for dead-space bugs.
  { name: '412', width: 412, height: 915 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
  { name: 'land740', width: 740, height: 360 },
];

const ROUTES: Array<{ path: string; name: string; setup?: (page: Page) => Promise<void> }> = [
  { path: '/', name: 'home' },
  { path: '/miniature', name: 'miniature' },
  {
    path: '/miniature',
    name: 'miniature-how-to',
    setup: async (page) => {
      await page.getByRole('button', { name: /how to use/i }).click();
      await page.waitForTimeout(400);
    },
  },
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
  {
    path: '/daily',
    name: 'daily-complete',
    setup: async (page) => {
      await page.evaluate(() => {
        // MUST match the real MatchleState shape (lib/matchleState.ts). The
        // stats fields have to exist or the card renders "undefined-day streak".
        window.localStorage.setItem('schemestealer-matchle', JSON.stringify({
          lastPlayedDate: new Date().toLocaleDateString('en-CA'),
          status: 'complete',
          results: [
            { pickedIndex: 0, correct: true, cost: 0 },
            { pickedIndex: 2, correct: false, cost: 3.4 },
            { pickedIndex: 1, correct: true, cost: 0 },
            { pickedIndex: 0, correct: true, cost: 0 },
            { pickedIndex: 3, correct: false, cost: 1.1 },
          ],
          streak: 3,
          maxStreak: 5,
          played: 10,
          perfect: 4,
          hitDistribution: [0, 1, 2, 3, 3, 1],
          bestCost: 0.4,
        }));
      });
      // reload to pick up the new local storage state
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
    }
  },
  { path: '/session', name: 'session' },
  { path: '/convert/pro-acryl-bright-pale-yellow-to-ak', name: 'convert' },
  { path: '/paints/pro-acryl/pro-acryl-bright-pale-yellow', name: 'paints' },
  {
    // The shared seed sets offlineMode: true, which hides the warm-up strip
    // from every other screenshot — this variant makes it visible (the backend
    // is absent in the test env, so useApiReady stays false).
    path: '/miniature',
    name: 'miniature-warmup',
    setup: async (page) => {
      await page.evaluate(() => {
        const raw = window.localStorage.getItem('schemestealer-storage');
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.state.offlineMode = false;
          window.localStorage.setItem('schemestealer-storage', JSON.stringify(parsed));
        }
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
    },
  },
];

const SEEDED_STATE = {
  state: {
    cart: [
      { paint: { name: 'Thunderhawk Blue Air', brand: 'citadel', hex: '#3d5c6f' }, quantity: 2, addedFrom: 'miniature' },
      { paint: { name: 'Averland Sunset', brand: 'citadel', hex: '#fbb81c' }, quantity: 1, addedFrom: 'miniature' },
      { paint: { name: 'Screaming Bell', brand: 'citadel', hex: '#7d3c2e' }, quantity: 3, addedFrom: 'inspiration' },
    ],
    inventory: [],
    offlineMode: true,
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
          // Suppress HowToPlay auto-open for standard runs
          window.localStorage.setItem('schemestealer-matchle-help-seen', 'true');
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

/**
 * Intent, inherited from the Swatchle version of this test: on the shortest
 * phone we support, the control the player has to reach must not sit under the
 * 64px bottom nav. It used to be the autocomplete dropdown; Matchle has no
 * typing, so it is now the last candidate and the advance button — the two
 * things a round cannot be completed without.
 */
test('daily controls clear the bottom nav @ 360x740', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.addInitScript(() => {
    window.localStorage.setItem('schemestealer-analytics-consent', 'denied');
    window.localStorage.setItem('schemestealer-matchle-help-seen', 'true');
  });
  await page.goto('/daily', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const innerHeight = await page.evaluate(() => window.innerHeight);
  const navSafeBottom = innerHeight - 64;

  // Needing a scroll is fine — these are in normal document flow. What is not
  // fine is the control being unreachable *after* scrolling, which is what
  // happens when a page ends flush under a fixed nav with no bottom padding.
  const clearsNavAfterScrolling = async (testid: string, label: string) => {
    const el = page.locator(`[data-testid="${testid}"]`).last();
    await expect(el).toBeVisible();
    // scrollIntoViewIfNeeded is a no-op on a partially-visible element, which
    // is exactly the case we care about — scroll the page to the end instead.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(200);
    const box = await el.boundingBox();
    expect(box, `${label} has no box`).toBeTruthy();
    if (box) {
      expect(box.y + box.height, `${label} stays under the bottom nav`).toBeLessThanOrEqual(
        navSafeBottom
      );
    }
  };

  await clearsNavAfterScrolling('matchle-candidate', 'last candidate');

  // Picking reveals the ΔEs and swaps in the advance button, which grows the
  // card stack — the taller state is the one that can end up pinned under it.
  await page.locator('[data-testid="matchle-candidate"]').first().click();
  await clearsNavAfterScrolling('matchle-advance', 'advance button');
});

test('home first-viewport @ 360x740', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  
  const matchleCard = page.locator('text=Matchle').first();
  const box = await matchleCard.boundingBox();
  expect(box).toBeTruthy();
  if (box) {
    expect(box.y).toBeLessThan(740);
  }
});

// The idle Miniscan screen must fit a single viewport at every phone size —
// dead space and pointless scroll here was a launch-blocking complaint.
for (const vp of [{ w: 320, h: 658 }, { w: 360, h: 740 }, { w: 390, h: 844 }, { w: 412, h: 915 }]) {
  test(`miniature idle vertical fit @ ${vp.w}x${vp.h}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.addInitScript(() => {
      // offlineMode hides the transient warm-up strip for a deterministic layout.
      window.localStorage.setItem('schemestealer-storage', JSON.stringify({ state: { cart: [], inventory: [], offlineMode: true }, version: 0 }));
      window.localStorage.setItem('schemestealer-analytics-consent', 'denied');
    });
    await page.goto('/miniature', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const fit = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
    }));
    expect(
      fit.scrollHeight,
      `idle miniscan scrolls at ${vp.w}x${vp.h} (${fit.scrollHeight} > ${fit.innerHeight})`
    ).toBeLessThanOrEqual(fit.innerHeight + 24);
  });
}

test('miniature first-viewport @ 360x640', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/miniature', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  
  const uploadBtn = page.getByRole('button', { name: /UPLOAD FROM ARCHIVE/i }).first();
  const box = await uploadBtn.boundingBox();
  expect(box).toBeTruthy();
  if (box) {
    const bottom = box.y + box.height;
    expect(bottom).toBeLessThanOrEqual(640 - 64);
  }
});
