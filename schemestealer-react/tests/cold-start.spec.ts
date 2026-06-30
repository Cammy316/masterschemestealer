/**
 * Chaos vector: the Render cold start.
 *
 * useApiReady polls /api/ready every 5s and only reveals the Miniscan UI once
 * `data.ready` is true. We hold the backend "asleep" for the first poll, then let
 * it wake, and assert the "MACHINE SPIRIT AWAKENING" theatre renders and then
 * hands off to the real UI — i.e. the latency is masked and the screen never hangs.
 */
import { test, expect } from '@playwright/test';

test('cold start shows the awakening sequence, then reveals the scan UI', async ({ page }) => {
  let polls = 0;
  // Backend is "asleep" for the first two polls, then reports ready.
  await page.route('**/api/ready', (route) => {
    polls += 1;
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ ready: polls > 1 }),
    });
  });
  // Everything else (analytics etc.) returns benign 200.
  await page.route('**/api/**', (route) => {
    if (route.request().url().includes('/api/ready')) return route.fallback();
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ status: 'ok' }),
    });
  });

  await page.goto('/miniature');

  // The cold-start theatre is visible immediately while the backend is asleep.
  await expect(page.getByText('MACHINE SPIRIT AWAKENING')).toBeVisible();

  // Once /api/ready flips to true (next 5s poll), the real Miniscan UI appears
  // and the awakening screen is gone — proving the latency was masked, not hung.
  await expect(page.getByText('MINISCAN PROTOCOL')).toBeVisible({ timeout: 20000 });
  await expect(page.getByText('MACHINE SPIRIT AWAKENING')).toHaveCount(0);
  expect(polls).toBeGreaterThan(1);
});
