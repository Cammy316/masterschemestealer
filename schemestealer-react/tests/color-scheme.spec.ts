/**
 * The app must declare itself dark.
 *
 * SchemeStealer is dark by design. A page that does NOT declare `color-scheme`
 * is fair game for Chrome's Auto Dark Theme (and Dark Reader-class extensions),
 * which apply a CIELAB lightness inversion: an already-dark design comes out
 * LIGHT — void-black backgrounds render near-white, while hues are preserved, so
 * neon green stays green rather than flipping to magenta. That was reported from
 * Chrome on the Miniscan flow, and the exported video was unaffected because
 * canvas pixels are not touched by that inversion.
 *
 * Both declarations matter: the meta tag lands before the stylesheet parses, the
 * CSS property is canonical and drives native controls and scrollbars.
 */
import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/miniature', '/miniature/results', '/inspiration', '/forge', '/daily'];

test('every route declares color-scheme: dark', async ({ page }) => {
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );

  for (const route of ROUTES) {
    await page.goto(route);

    // The computed CSS property — the canonical declaration. Polled because the
    // dev server injects stylesheets via JS after load (in production the CSS is
    // a synchronous <link>), so a bare read can win the race and see 'normal'.
    await expect
      .poll(
        () => page.evaluate(() => getComputedStyle(document.documentElement).colorScheme),
        { message: `computed color-scheme on ${route}` },
      )
      .toContain('dark');

    // …and the head meta, which applies before CSS is parsed.
    const meta = await page.locator('meta[name="color-scheme"]').getAttribute('content');
    expect(meta, `<meta name="color-scheme"> on ${route}`).toContain('dark');
  }
});
