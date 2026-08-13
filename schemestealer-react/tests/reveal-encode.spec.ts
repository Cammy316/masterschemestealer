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
import { seedScan, seedInspirationScan } from './revealSeed';
const ENCODE_OUT_DIR = 'test-results/encode';

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

  // Written out so video-qa can measure the artefact — frame luma for D2 in
  // particular, which is reported rather than gated.
  if (!('error' in out) && out.bytes) {
    mkdirSync(ENCODE_OUT_DIR, { recursive: true });
    writeFileSync(resolve(ENCODE_OUT_DIR, 'mini-offline.mp4'), Buffer.from(out.bytes, 'base64'));
  }

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

/**
 * The same real encode, driven through the INSPIRATION storyboard.
 *
 * The point is not that the warp clip encodes — it is that it goes through the
 * SAME encoder. The storyboard refactor exists so there is one implementation of
 * frame pacing, BT.709 tagging and the colr byte patch; this asserts the warp
 * mode actually reaches it rather than having quietly acquired a second path.
 */
test('warp-cast offline render: same encoder, exact frame count, BT.709', async ({ page }) => {
  test.setTimeout(180000);
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.addInitScript(seedInspirationScan, STORAGE_KEY);
  await page.goto('/inspiration/results');

  const out = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    await R?.loadOffline?.();
    await R?.loadWarp?.();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const O = (window as any).__revealOfflineDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).__warpDebug;
    if (!O || !scan || !W) return { error: `offlineHook=${!!O} scan=${!!scan} warp=${!!W}` } as const;
    const plan = await O.planOfflineRender(1080, 1920);
    if (!plan) return { error: 'no encodable codec in this browser' } as const;

    // NO durationMs on purpose. Passing one made the requested length and the
    // storyboard's chosen length agree, which is exactly what hid a shipped bug:
    // the warp-cast runs 14 s, the frame loop used the requested 11 s, and the
    // export came out with an 11.000 s video track against a 14.016 s audio
    // track -- the payoff hold and the whole loop dissolve missing.
    const fps = 30;
    const res = await O.renderRevealOffline({
      imageUrl: scan.imageUrl,
      colors: scan.detectedColors,
      brand: 'citadel',
      brandLabel: 'Citadel',
      skin: 'warp',
      captionPreset: 'colours',
      mode: 'inspiration',
      fps,
      plan,
      // The warp storyboard, resolved the same way the production dispatch
      // resolves it: a dynamic import of the warpCompose chunk.
      storyboard: (await R.loadWarp()).WARP_STORYBOARD,
    });
    const buf = new Uint8Array(await res.blob.arrayBuffer());
    let bin = '';
    const CH = 0x8000;
    for (let i = 0; i < buf.length; i += CH) bin += String.fromCharCode(...buf.subarray(i, i + CH));
    return {
      mime: res.blob.type,
      size: res.blob.size,
      frameCount: res.frameCount,
      durationMs: res.durationMs,
      expectedFrames: Math.round((res.durationMs / 1000) * fps),
      warpDurationMs: W.WARP_DURATION_MS,
      width: res.width,
      height: res.height,
      engine: res.engine,
      colrPatched: res.colrPatched,
      bytes: btoa(bin),
    } as const;
  });

  // Write the muxed file out so video-qa can measure the artefact. Headless
  // Chrome's software encoder differs from a device's on colour and grain, but
  // SHARPNESS is a property of the composed frames rather than the encoder, so
  // the defocus gate is measurable here without a phone.
  if (!('error' in out) && out.bytes) {
    mkdirSync(ENCODE_OUT_DIR, { recursive: true });
    writeFileSync(resolve(ENCODE_OUT_DIR, 'warp-offline.mp4'), Buffer.from(out.bytes, 'base64'));
  }

  console.log('WARP OFFLINE RENDER:', JSON.stringify({ ...out, bytes: undefined }));
  expect('error' in out ? out.error : null).toBeNull();
  if ('error' in out) return;

  // Intent: the VIDEO must run to the storyboard's own length, not to the
  // length the caller happened to ask for. A shipped warp export had an
  // 11.000 s video track against a 14.016 s audio track.
  expect(out.durationMs, 'render must adopt the storyboard duration').toBe(out.warpDurationMs);
  expect(out.frameCount).toBe(out.expectedFrames);
  expect(out.frameCount, 'frames for a 14 s clip at 30 fps').toBe(420);
  expect(out.engine).toBe('webcodecs');
  expect(out.width).toBe(1080);
  expect(out.height).toBe(1920);
  expect(out.size).toBeGreaterThan(10_000);

  mkdirSync(OUT_DIR, { recursive: true });
  const file = resolve(OUT_DIR, `warp-offline.${out.mime.includes('mp4') ? 'mp4' : 'webm'}`);
  writeFileSync(file, Buffer.from(out.bytes, 'base64'));

  // Same permanent assertion as the miniature. If the warp path ever grew its
  // own encoder this is where it would show up as BT.601.
  if (out.mime.includes('mp4')) {
    const probe = execFileSync(
      FFPROBE,
      ['-v', 'error', '-select_streams', 'v', '-show_entries',
       'stream=color_primaries,color_transfer,color_space', '-of', 'csv=p=0', file],
      { encoding: 'utf8' },
    ).trim();
    console.log('WARP COLOUR TAGS:', probe);
    const [primaries, transfer, matrix] = probe.split(',').map((s) => s.trim());
    expect(primaries, 'color_primaries').toBe('bt709');
    expect(transfer, 'color_transfer').toBe('bt709');
    expect(matrix, 'color_space').toBe('bt709');

    // Intent: the muxed streams must agree with each other. Everything above is
    // measured from the render's own report; this is measured from the FILE,
    // which is what the shipped bug actually looked like.
    const durs = execFileSync(
      FFPROBE,
      ['-v', 'error', '-show_entries', 'stream=duration', '-of', 'csv=p=0', file],
      { encoding: 'utf8' },
    )
      .trim()
      .split(/\s+/)
      .map((d) => parseFloat(d))
      .filter((d) => Number.isFinite(d));
    console.log('WARP STREAM DURATIONS:', JSON.stringify(durs));
    expect(durs.length, 'expected a video and an audio stream').toBeGreaterThanOrEqual(2);
    expect(Math.abs(durs[0] - durs[1]), 'video and audio tracks must be the same length').toBeLessThan(0.2);
  }
});
