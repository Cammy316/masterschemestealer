/**
 * Engine A — the OFFLINE encode path.
 *
 * Split out because it must run in REAL Chrome: Playwright's bundled Chromium
 * crashes its renderer process the moment `VideoEncoder.encode()` is called
 * (verified with raw WebCodecs and no library involved — it is the test browser,
 * not our code). Real Chrome encodes vp8, vp9 and H.264 fine, headless included.
 *
 * Unlike MediaRecorder, this pipeline has no real-time requirement, so the whole
 * encode CAN be driven end to end in a test instead of only on a device.
 */
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedScan } from './revealSeed';

/** Remotion ships a static ffprobe; no system install required. */
const FFPROBE = resolve(
  '..',
  'video-factory',
  'node_modules',
  '@remotion',
  'compositor-win32-x64-msvc',
  'ffprobe.exe',
);

test.use({ channel: 'chrome' });

const STORAGE_KEY = 'schemestealer-storage';
const OUT_DIR = resolve('test-results', 'reveal-frames');

test('pict-cast offline render: real encode, exact frame count', async ({ page }) => {
  test.setTimeout(180000);
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.addInitScript(seedScan, STORAGE_KEY);
  await page.goto('/miniature/results');

  const out = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    // The encoder lives in a dynamic chunk in production; pull it in explicitly.
    await R?.loadOffline?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const O = (window as any).__revealOfflineDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    if (!O || !scan) return { error: `offlineHook=${!!O} scan=${!!scan}` } as const;
    const plan = await O.planOfflineRender(1080, 1920);
    if (!plan) return { error: 'no encodable codec in this browser' } as const;

    // Short clip so the test stays quick; the pipeline is identical.
    const durationMs = 2000;
    const fps = 30;
    const started = performance.now();
    const res = await O.renderRevealOffline({
      imageUrl: scan.imageUrl,
      colors: scan.detectedColors,
      maskFrame: scan.maskFrame,
      recipe: scan.detectedColors[0].paintRecipe,
      brand: 'citadel',
      brandLabel: 'Citadel',
      recipeColourIndex: 0,
      skin: 'imperial',
      captionPreset: 'colours',
      durationMs,
      fps,
      plan,
    });
    const buf = new Uint8Array(await res.blob.arrayBuffer());
    let bin = '';
    const CH = 0x8000;
    for (let i = 0; i < buf.length; i += CH) bin += String.fromCharCode(...buf.subarray(i, i + CH));
    return {
      plan,
      mime: res.blob.type,
      size: res.blob.size,
      frameCount: res.frameCount,
      expectedFrames: Math.round((durationMs / 1000) * fps),
      width: res.width,
      height: res.height,
      engine: res.engine,
      elapsedMs: Math.round(performance.now() - started),
      bytes: btoa(bin),
    } as const;
  });

  console.log('OFFLINE RENDER:', JSON.stringify({ ...out, bytes: undefined }));
  expect('error' in out ? out.error : null).toBeNull();
  if ('error' in out) return;

  // Intent: MediaRecorder dropped every frame it could not encode in time — 5 fps
  // on a real phone. The offline pipeline has no clock, so the frame count is
  // exact by construction whatever the machine's speed.
  expect(out.frameCount).toBe(out.expectedFrames);
  expect(out.engine).toBe('webcodecs');
  expect(out.width).toBe(1080);
  expect(out.height).toBe(1920);
  expect(out.size).toBeGreaterThan(10_000);
  expect(out.mime).toMatch(/^video\/(mp4|webm)$/);

  // Keep the artefact so its pacing can be parsed offline if ever in doubt.
  mkdirSync(OUT_DIR, { recursive: true });
  const file = resolve(OUT_DIR, `offline.${out.mime.includes('mp4') ? 'mp4' : 'webm'}`);
  writeFileSync(file, Buffer.from(out.bytes, 'base64'));

  // Intent: the shipped file was tagged BT.601 (bt470bg/smpte170m) on a 1080×1920
  // canvas. Every modern player assumes BT.709 for HD, so the same frame decoded
  // under the wrong matrix drifts by up to ΔE 4.9 — a full band — while the card
  // claims ΔE 0.8. That makes the video contradict the engine's own measurement,
  // which is the one thing this product cannot do. PERMANENT ASSERTION.
  if (out.mime.includes('mp4')) {
    const probe = execFileSync(
      FFPROBE,
      ['-v', 'error', '-select_streams', 'v', '-show_entries',
       'stream=color_primaries,color_transfer,color_space', '-of', 'csv=p=0', file],
      { encoding: 'utf8' },
    ).trim();
    console.log('COLOUR TAGS:', probe);
    const [primaries, transfer, matrix] = probe.split(',').map((s) => s.trim());
    expect(primaries, 'color_primaries').toBe('bt709');
    expect(transfer, 'color_transfer').toBe('bt709');
    expect(matrix, 'color_space').toBe('bt709');
  }
});
