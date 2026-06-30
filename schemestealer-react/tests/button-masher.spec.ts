/**
 * Chaos vector: the button masher.
 *
 * On the results page each detected colour renders a PaintRecipeCard whose brand
 * selector is a dropdown (toggle button → brand options). A chaotic user hammers
 * it. We rapidly open/close and switch brands and assert the UI never locks up:
 * the recipe content stays visible and the control remains interactive.
 */
import { test, expect } from '@playwright/test';
import { seedScan, mockApiGeneric } from './fixtures/seed';

test.beforeEach(async ({ page }) => {
  await mockApiGeneric(page);
  await seedScan(page);
});

test('hammering the brand dropdown does not lock the UI', async ({ page }) => {
  await page.goto('/miniature/results');

  // Page rendered from the seeded scan.
  await expect(page.getByText(/Auspex has identified/i)).toBeVisible();

  // The first card's brand toggle shows a brand name (Citadel/Vallejo/Army Painter).
  const brandToggle = page
    .getByRole('button', { name: /Citadel|Vallejo|Army Painter/ })
    .first();
  await expect(brandToggle).toBeVisible();

  // Mash it: open, pick a different brand, repeat — fast.
  for (let i = 0; i < 12; i++) {
    await brandToggle.click({ timeout: 5000 }).catch(() => {});
    const option = page
      .getByRole('button', { name: i % 2 === 0 ? /Vallejo/ : /Army Painter/ })
      .last();
    if (await option.isVisible().catch(() => false)) {
      await option.click({ timeout: 2000 }).catch(() => {});
    }
  }

  // No lock-up: the recipe content is still there and the control still responds.
  await expect(page.getByText(/Auspex has identified/i)).toBeVisible();
  await expect(brandToggle).toBeEnabled();
  // And no React error boundary tripped.
  await expect(page.getByText(/something went wrong/i)).toHaveCount(0);
});
