/**
 * Engine A — pict-cast export.
 *
 * Verifies (a) the export UI is wired into the Miniscan results Share modal, and
 * (b) the deterministic storyboard renders correctly by composing the 5 key
 * frames to an offscreen canvas and saving PNGs for eyeball QA.
 *
 * The real-time MediaRecorder capture can't be driven under headless/offscreen
 * Chromium (it suspends page timers after ~130 ms — see the timer probe), so the
 * end-to-end record is verified on a real device. The compose pipeline, spec
 * building and resource prep ARE exercised here in a real browser.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const STORAGE_KEY = 'schemestealer-storage';
const OUT_DIR = resolve('test-results', 'reveal-frames');

test('pict-cast export: UI wired + storyboard frames render', async ({ page }) => {
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );

  // Build a synthetic MASKED scan in-browser; stash on window (persist strips
  // masks/imageUrl from localStorage) and also seed localStorage for the app.
  await page.addInitScript((key) => {
    window.localStorage.setItem('schemestealer-analytics-consent', 'granted');

    const miniUrl = (() => {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 600;
      const x = c.getContext('2d')!;
      x.fillStyle = '#0a0a0a';
      x.fillRect(0, 0, 400, 600);
      x.fillStyle = '#8a3a3a';
      x.fillRect(140, 180, 120, 260);
      x.fillStyle = '#c8a06a';
      x.beginPath();
      x.arc(200, 140, 50, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#3a5a8a';
      x.fillRect(120, 200, 40, 240);
      x.fillRect(240, 200, 40, 240);
      return c.toDataURL('image/png');
    })();

    const maskB64 = (draw: (x: CanvasRenderingContext2D) => void) => {
      const c = document.createElement('canvas');
      c.width = 400;
      c.height = 600;
      const x = c.getContext('2d')!;
      x.fillStyle = '#ffffff';
      draw(x);
      return c.toDataURL('image/png').split(',')[1];
    };
    const redMask = maskB64((x) => x.fillRect(140, 180, 120, 260));
    const boneMask = maskB64((x) => {
      x.beginPath();
      x.arc(200, 140, 50, 0, Math.PI * 2);
      x.fill();
    });
    const blueMask = maskB64((x) => {
      x.fillRect(120, 200, 40, 240);
      x.fillRect(240, 200, 40, 240);
    });

    const recipe = (hex: string) => ({
      base: { name: 'Mephiston Red', hex, type: 'base', deltaE: 1.2 },
      shade: { name: 'Nuln Oil', hex: '#141414', type: 'shade', deltaE: 0 },
      highlight: { name: 'Evil Sunz Scarlet', hex: '#d49a9a', type: 'layer', deltaE: 2.4 },
      wash: { name: 'Reikland Fleshshade', hex: '#7a3b1a', type: 'wash', deltaE: 0 },
    });
    const colour = (
      hex: string,
      rgb: number[],
      lab: number[],
      family: string,
      pct: number,
      pos: { x: number; y: number },
      mask: string,
    ) => ({
      hex,
      rgb,
      lab,
      family,
      percentage: pct,
      position: pos,
      mask,
      paintRecipe: { citadel: recipe(hex), vallejo: recipe(hex), army_painter: recipe(hex) },
    });

    const scan = {
      id: 'reveal-seed',
      mode: 'miniature',
      timestamp: '2026-06-30T00:00:00.000Z',
      analysisSource: 'backend',
      recommendedPaints: [],
      imageUrl: miniUrl,
      maskFrame: { width: 400, height: 600, cropX: 0, cropY: 0, cropW: 400, cropH: 600, frameW: 400, frameH: 600 },
      detectedColors: [
        colour('#8a3a3a', [138, 58, 58], [40, 35, 20], 'red', 50, { x: 0.5, y: 0.55 }, redMask),
        colour('#c8a06a', [200, 160, 106], [70, 10, 35], 'bone', 25, { x: 0.5, y: 0.23 }, boneMask),
        colour('#3a5a8a', [58, 90, 138], [40, 5, -30], 'blue', 25, { x: 0.35, y: 0.5 }, blueMask),
      ],
    };
    (window as unknown as { __seedScan: unknown }).__seedScan = scan;
    const state = { cart: [], scanHistory: [scan], currentScan: scan, preferredBrands: ['all'], preferredRegion: 'global' };
    window.localStorage.setItem(key, JSON.stringify({ state, version: 0 }));
  }, STORAGE_KEY);

  await page.goto('/miniature/results');

  // (a) UI wiring: Share → modal → export button present.
  await page.getByRole('button', { name: /share results/i }).click();
  await expect(page.getByRole('heading', { name: /broadcast pict-cast/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /export pict-cast/i })).toBeVisible();

  // Diagnostic: do page timers advance here? (documents the record limitation)
  const probe = await page.evaluate(
    () =>
      new Promise<{ ticks: number; elapsed: number }>((res) => {
        let n = 0;
        const s = performance.now();
        const id = setInterval(() => {
          n++;
          if (performance.now() - s > 1500) {
            clearInterval(id);
            res({ ticks: n, elapsed: Math.round(performance.now() - s) });
          }
        }, 30);
      }),
  );
  console.log('TIMER PROBE:', JSON.stringify(probe));

  // (b) Deterministic storyboard frames via the dev render hook.
  const FRAMES: Record<string, number> = { boot: 500, sweep: 2000, reveal: 6500, recipe: 10800, loop: 12850 };
  const result = await page.evaluate(async (frames) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    if (!R || !scan) return { error: `hook=${!!R} scan=${!!scan}` } as const;
    const colors = scan.detectedColors;
    const steps = R.recipeSteps(colors[0].paintRecipe, 'citadel');
    const spec = R.buildRevealSpec(colors, steps, 'Citadel', 'imperial', 'colours', 13000);
    const res = await R.prepareResources(scan.imageUrl, colors, scan.maskFrame, spec);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;
    const out: Record<string, string> = {};
    for (const name of Object.keys(frames)) {
      R.composeAt(ctx, frames[name], res);
      out[name] = canvas.toDataURL('image/png');
    }
    return { frames: out } as const;
  }, FRAMES);

  expect('error' in result ? result.error : null).toBeNull();
  const frames = 'frames' in result ? result.frames : undefined;
  expect(frames).toBeTruthy();
  mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, dataUrl] of Object.entries(frames ?? {})) {
    const b64 = dataUrl.split(',')[1];
    writeFileSync(resolve(OUT_DIR, `${name}.png`), Buffer.from(b64, 'base64'));
    expect(b64.length).toBeGreaterThan(2000); // non-trivial frame
  }
});
