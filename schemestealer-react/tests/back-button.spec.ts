/**
 * Chaos vector: the back-button trap.
 *
 * The app navigates with router.push only (Miniscan → results). A user who hits
 * the browser Back button from deep in the results must land back on the Miniscan
 * page with its layout intact — not a white screen, error boundary, or 404.
 */
import { test, expect } from '@playwright/test';
import { seedScan, mockApiGeneric } from './fixtures/seed';

test.beforeEach(async ({ page }) => {
  await mockApiGeneric(page); // /api/ready → ready:true, so /miniature shows its UI
  await seedScan(page);
});

test('browser Back from results restores the Miniscan page', async ({ page }) => {
  // Build real history: Miniscan page, then the results page.
  await page.goto('/miniature');
  await expect(page.getByText('MINISCAN PROTOCOL')).toBeVisible({ timeout: 20000 });

  await page.goto('/miniature/results');
  await expect(page.getByText(/Auspex has identified/i)).toBeVisible();

  // The trap: hit Back.
  await page.goBack();

  // Router restores Miniscan cleanly — correct URL, real layout, no crash.
  await expect(page).toHaveURL(/\/miniature$/);
  await expect(page.getByText('MINISCAN PROTOCOL')).toBeVisible();
  await expect(page.getByText(/something went wrong/i)).toHaveCount(0);
});
