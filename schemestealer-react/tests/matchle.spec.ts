import { test, expect, Page } from '@playwright/test';

/**
 * Matchle, end to end on a phone.
 *
 * These are the claims the unit tests cannot make: that a real player can
 * finish a daily with five taps and no keyboard, that what lands on the
 * clipboard is a palette someone would paste into a group chat, and that the
 * page survives the state Swatchle left behind on their device.
 */

const PHONE = { width: 390, height: 844 };

/** Squares the share grid is allowed to use — the mark row is a strict subset. */
const COLOUR_SQUARES = ['🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜'];
const MARK_SQUARES = ['🟩', '🟨', '🟥'];

const countSquares = (line: string, allowed: string[]) =>
  [...line].filter((ch) => allowed.includes(ch)).length;

/**
 * Consent is decided and the help modal suppressed, otherwise both cover the
 * candidates and every tap in this file hits an overlay instead.
 */
async function prepare(page: Page, extra?: Record<string, string>) {
  await page.setViewportSize(PHONE);
  await page.addInitScript((seed) => {
    window.localStorage.setItem('schemestealer-analytics-consent', 'granted');
    window.localStorage.setItem('schemestealer-matchle-help-seen', 'true');
    for (const [k, v] of Object.entries(seed ?? {})) window.localStorage.setItem(k, v);
    // navigator.share would open an OS sheet the test cannot dismiss; removing
    // it takes the clipboard branch the component already falls back to.
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    (window as unknown as { __shared?: string }).__shared = undefined;
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (text: string) => {
          (window as unknown as { __shared?: string }).__shared = text;
        },
      },
      configurable: true,
    });
  }, extra ?? {});
}

const candidates = (page: Page) => page.locator('[data-testid="matchle-candidate"]');
const advance = (page: Page) => page.locator('[data-testid="matchle-advance"]');

/** Play all five rounds, always taking the first candidate. */
async function playFullDaily(page: Page) {
  for (let round = 0; round < 5; round++) {
    await expect(candidates(page).first()).toBeVisible();
    await expect(candidates(page)).toHaveCount(4);
    await candidates(page).nth(0).click();
    // The reveal must show a number for every candidate — this is the promise
    // that a wrong answer still teaches something.
    await expect(page.getByText(/ΔE \d/).first()).toBeVisible();
    await advance(page).click();
  }
}

test('a full daily is five taps, no keyboard', async ({ page }) => {
  await prepare(page);
  await page.goto('/daily', { waitUntil: 'networkidle' });

  await playFullDaily(page);

  // Completing auto-opens the service record after a beat.
  await expect(page.getByText('SERVICE RECORD')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText('Played')).toBeVisible();

  // No text input exists anywhere in the game — the recall quiz is gone.
  await expect(page.getByRole('combobox')).toHaveCount(0);
  await expect(page.locator('input[type="text"]')).toHaveCount(0);
});

test('share puts a two-row palette on the clipboard', async ({ page }) => {
  await prepare(page);
  await page.goto('/daily', { waitUntil: 'networkidle' });
  await playFullDaily(page);

  await expect(page.getByText('SERVICE RECORD')).toBeVisible({ timeout: 5000 });
  // Two share buttons exist — the complete screen's and the stats modal's. The
  // modal is on top, so its is the one a player can actually reach here.
  await page.getByRole('button', { name: 'SHARE', exact: true }).click();

  const shared = await page.waitForFunction(
    () => (window as unknown as { __shared?: string }).__shared,
    undefined,
    { timeout: 5000 }
  );
  const text = (await shared.jsonValue()) as string;

  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const colourRow = lines.find((l) => countSquares(l, COLOUR_SQUARES) === 5);
  const markRow = lines.filter((l) => countSquares(l, MARK_SQUARES) === 5).pop();

  // Intent: the colour row is what makes this scroll-stopping. A share with no
  // colour in it is indistinguishable from every other daily-game post.
  expect(colourRow, `no 5-square colour row in:\n${text}`).toBeTruthy();
  expect(markRow, `no 5-square result row in:\n${text}`).toBeTruthy();

  expect(text).toContain('Matchle');
  expect(text).toMatch(/schemestealer\.com\/daily/);
  // Always picking candidate 0 cannot be a perfect game across five rounds, so
  // at least one mark must be a miss — proves the row reflects real results.
  expect(markRow!).toMatch(/[🟨🟥]/);
});

test('the same day gives the same rounds, and practice re-rolls', async ({ page }) => {
  await prepare(page);
  await page.goto('/daily', { waitUntil: 'networkidle' });

  const targetName = page.locator('[data-testid="matchle-target-name"]');
  await expect(targetName).toBeVisible();
  const first = await targetName.textContent();

  // Determinism is what lets everyone argue about the same puzzle.
  await page.reload({ waitUntil: 'networkidle' });
  await expect(targetName).toBeVisible();
  expect(await targetName.textContent()).toBe(first);

  await page.getByRole('button', { name: /practice/i }).click();
  await expect(candidates(page).first()).toBeVisible();

  const seen = new Set<string>();
  for (let i = 0; i < 4; i++) {
    seen.add((await targetName.textContent()) ?? '');
    await candidates(page).nth(0).click();
    await advance(page).click();
    await expect(candidates(page).first()).toBeVisible();
  }
  // Practice that repeated one target would be indistinguishable from a bug.
  expect(seen.size, `practice repeated targets: ${[...seen].join(', ')}`).toBeGreaterThan(1);
});

test('a device holding Swatchle state still gets a playable board', async ({ page }) => {
  // The exact shape Swatchle persisted, under its own frozen key, plus a blob
  // under Matchle's key to prove the loader does not trust what it reads.
  await prepare(page, {
    'schemestealer-daily-augury': JSON.stringify({
      guesses: [{ paint_id: 'citadel-abaddon-black' }],
      status: 'won',
      lastPlayedDate: '2026-08-11',
      streak: 12,
      guessDistribution: [0, 1, 2, 0, 0, 0],
    }),
    'schemestealer-matchle': '{ this is not json',
  });

  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/daily', { waitUntil: 'networkidle' });
  await expect(candidates(page)).toHaveCount(4);
  await candidates(page).nth(0).click();
  await expect(advance(page)).toBeVisible();

  expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
});
