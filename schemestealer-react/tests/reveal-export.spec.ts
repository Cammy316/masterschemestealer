/**
 * Engine A — pict-cast export.
 *
 * Verifies (a) the export UI is wired into the Miniscan results Share modal,
 * (b) the deterministic storyboard renders correctly, (c) the audio bed is
 * audible, and (d) compose stays inside the frame budget at realistic photo
 * size.
 *
 * The real encode is in reveal-encode.spec.ts — it needs real Chrome, because
 * Playwright's bundled Chromium crashes on VideoEncoder.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedScan } from './revealSeed';

const STORAGE_KEY = 'schemestealer-storage';
const OUT_DIR = resolve('test-results', 'reveal-frames');


test('pict-cast export: UI wired + storyboard frames render', async ({ page }) => {
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );

  await page.addInitScript(seedScan, STORAGE_KEY);

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

  // (b) Deterministic storyboard frames via the dev render hook: one per phase
  // of the 11 s proof-first cut, for eyeball QA of the exported look.
  // `frame0` and `loop` must be pixel-identical — that pair IS the loop seam.
  const FRAMES: Record<string, number> = {
    frame0: 0,
    proof: 350,
    smash: 950,
    sweep: 1700,
    reveal: 3300,
    slam: 4600,
    recipe: 8500,
    loop: 11000,
  };
  const result = await page.evaluate(async (frames) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    if (!R || !scan) return { error: `hook=${!!R} scan=${!!scan}` } as const;
    const colors = scan.detectedColors;
    const steps = R.recipeSteps(colors[0].paintRecipe, 'citadel');
    const spec = R.buildRevealSpec(colors, steps, 'Citadel', 'imperial', 'colours', 11000, 0);
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

  // (c) The audio bed must be AUDIBLE. The first shipped export measured
  // −40 dBFS RMS — inaudible once a platform normalises toward ~−14 LUFS, and a
  // silent clip gets demoted outright. Rendering the same graph offline is the
  // only way to check this without a real-time MediaRecorder.
  const audio = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    const spec = R.buildRevealSpec(scan.detectedColors, [], 'Citadel', 'imperial', 'colours', 11000, 0);
    const sr = 48000;
    const ctx = new OfflineAudioContext(1, Math.ceil(sr * 11.6), sr);
    R.scheduleRevealAudio(ctx, ctx.destination, spec, 0.05);
    const d = (await ctx.startRendering()).getChannelData(0);
    let sum = 0;
    let peak = 0;
    for (let i = 0; i < d.length; i++) {
      sum += d[i] * d[i];
      if (Math.abs(d[i]) > peak) peak = Math.abs(d[i]);
    }
    // Spectral balance, measured the same way the defect was found: a real FFT
    // over the whole bed. A phone speaker rolls off hard below ~500 Hz, so a bed
    // whose energy is all sub-1 kHz is inaudible to most viewers however loud it
    // measures. The shipped bed was 99% below 1 kHz and 0.0% above 2 kHz.
    let N = 1;
    while (N < d.length) N <<= 1;
    const re = new Float64Array(N);
    const im = new Float64Array(N);
    for (let i = 0; i < d.length; i++) re[i] = d[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / d.length));
    for (let i = 1, j = 0; i < N; i++) {
      let bit = N >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let len = 2; len <= N; len <<= 1) {
      const ang = (-2 * Math.PI) / len;
      const wr = Math.cos(ang);
      const wi = Math.sin(ang);
      for (let i = 0; i < N; i += len) {
        let cr = 1;
        let ci = 0;
        for (let k = 0; k < len / 2; k++) {
          const ur = re[i + k];
          const ui = im[i + k];
          const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
          const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
          re[i + k] = ur + vr;
          im[i + k] = ui + vi;
          re[i + k + len / 2] = ur - vr;
          im[i + k + len / 2] = ui - vi;
          const ncr = cr * wr - ci * wi;
          ci = cr * wi + ci * wr;
          cr = ncr;
        }
      }
    }
    const binHz = sr / N;
    let low = 0;
    let high = 0;
    for (let k = 1; k < N / 2; k++) {
      const f = k * binHz;
      if (f < 40) continue;
      const p = re[k] * re[k] + im[k] * im[k];
      if (f < 1000) low += p;
      else if (f < 12000) high += p;
    }

    // Integrated loudness, K-weighted per BS.1770 (shelf + high-pass), gated.
    const kw = new Float64Array(d.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < d.length; i++) {
      const x = d[i];
      const y = 1.53512485958 * x - 2.69169618940 * x1 + 1.19839281085 * x2
        + 1.69065929318 * y1 - 0.73248077421 * y2;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      kw[i] = y;
    }
    let z1 = 0, z2 = 0, w1 = 0, w2 = 0;
    for (let i = 0; i < kw.length; i++) {
      const x = kw[i];
      const y = 1.0 * x - 2.0 * z1 + 1.0 * z2 + 1.99004745483 * w1 - 0.99007225036 * w2;
      z2 = z1; z1 = x; w2 = w1; w1 = y;
      kw[i] = y;
    }
    const block = Math.floor(sr * 0.4);
    const loud: number[] = [];
    for (let s = 0; s + block <= kw.length; s += Math.floor(block * 0.25)) {
      let ss = 0;
      for (let i = s; i < s + block; i++) ss += kw[i] * kw[i];
      loud.push(-0.691 + 10 * Math.log10(ss / block + 1e-12));
    }
    const gated = loud.filter((l) => l > -70);
    const rel = gated.length
      ? -0.691 + 10 * Math.log10(gated.reduce((a, l) => a + 10 ** ((l + 0.691) / 10), 0) / gated.length) - 10
      : -70;
    const kept = gated.filter((l) => l > rel);
    const lufs = kept.length
      ? -0.691 + 10 * Math.log10(kept.reduce((a, l) => a + 10 ** ((l + 0.691) / 10), 0) / kept.length)
      : -70;

    return {
      rmsDb: 20 * Math.log10(Math.sqrt(sum / d.length) + 1e-9),
      peakDb: 20 * Math.log10(peak + 1e-9),
      highFraction: high / (low + high),
      lufs,
    };
  });
  console.log('AUDIO BED:', JSON.stringify(audio));
  expect(audio.rmsDb).toBeGreaterThan(-26);
  expect(audio.peakDb).toBeLessThan(-1); // true-peak headroom: platforms add ~2 dB
  expect(audio.peakDb).toBeGreaterThan(-12); // …but it still has to have transients
  // Intent: the shipped bed had 1.0% of its energy above 1 kHz and literally
  // nothing above 2 kHz, so a phone speaker reproduced almost none of it.
  expect(audio.highFraction, 'energy above 1 kHz').toBeGreaterThan(0.15);
  // Intent: platforms normalise to about -14 LUFS. At -16.2 they add ~2 dB to a
  // file with 0.5 dB of headroom, and it clips on their servers.
  expect(audio.lufs, 'integrated loudness').toBeGreaterThan(-15);
  expect(audio.lufs, 'integrated loudness').toBeLessThan(-13);
});

// Perf gate. The stutter bug was invisible to this suite for two rounds because
// the seed image is 400×600 and composes in 0.2 ms — 200× cheaper than a real
// background-removed phone photo. This renders at a realistic source size and
// fails if any phase blows the budget.
test('pict-cast perf gate: compose stays in budget at phone-photo resolution', async ({ page }) => {
  test.setTimeout(180000);
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.goto('/miniature/results');

  const perf = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    if (!R) return { error: 'no hook' } as const;
    const W = 2400;
    const H = 3200;
    const mk = (draw: (x: CanvasRenderingContext2D) => void) => {
      const c = document.createElement('canvas');
      c.width = W;
      c.height = H;
      draw(c.getContext('2d')!);
      return c;
    };
    const src = mk((x) => {
      x.fillStyle = '#c4457a';
      x.fillRect(860, 940, 670, 1410);
      x.fillStyle = '#e8c56a';
      x.beginPath();
      x.arc(1200, 725, 300, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = '#2f9fb5';
      x.fillRect(720, 1070, 220, 1280);
      x.fillStyle = '#141414';
      x.fillRect(1010, 2690, 380, 170);
    }).toDataURL('image/png');
    const maskB64 = (draw: (x: CanvasRenderingContext2D) => void) =>
      mk((x) => {
        x.fillStyle = '#fff';
        draw(x);
      })
        .toDataURL('image/png')
        .split(',')[1];
    const colour = (hex: string, family: string, pct: number, pos: { x: number; y: number }, mask: string) => ({
      hex, rgb: [0, 0, 0], lab: [50, 0, 0], family, percentage: pct, position: pos, mask,
    });
    const colors = [
      colour('#c4457a', 'pink', 50, { x: 0.5, y: 0.5 }, maskB64((x) => x.fillRect(860, 940, 670, 1410))),
      colour('#e8c56a', 'yellow', 22, { x: 0.5, y: 0.23 }, maskB64((x) => { x.beginPath(); x.arc(1200, 725, 300, 0, Math.PI * 2); x.fill(); })),
      colour('#2f9fb5', 'cyan', 20, { x: 0.3, y: 0.53 }, maskB64((x) => x.fillRect(720, 1070, 220, 1280))),
      colour('#141414', 'black', 8, { x: 0.5, y: 0.86 }, maskB64((x) => x.fillRect(1010, 2690, 380, 170))),
    ];
    const steps = [
      { role: 'base', name: 'Fulgrim Pink', hex: '#c4457a', deltaE: 1.8 },
      { role: 'highlight', name: 'Ceramite White', hex: '#f2f2ee' },
      { role: 'shade', name: 'Dechala Lilac', hex: '#8a7ab5' },
      { role: 'wash', name: 'Carroburg Crimson', hex: '#7a1f3d' },
    ];
    const spec = R.buildRevealSpec(colors, steps, 'Citadel', 'imperial', 'colours', 11000, 0);
    const res = await R.prepareResources(
      src, colors,
      { width: W, height: H, cropX: 0, cropY: 0, cropW: W, cropH: H, frameW: W, frameH: H },
      spec,
    );
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;
    const phases: Record<string, number> = { proof: 300, smash: 900, sweep: 1600, reveal: 3200, slam: 4600, recipe: 8500, loop: 10900 };
    const timings: Record<string, number> = {};
    for (const [name, t0] of Object.entries(phases)) {
      R.composeAt(ctx, t0, res); // warm
      const N = 10;
      const start = performance.now();
      for (let i = 0; i < N; i++) R.composeAt(ctx, t0 + i, res);
      timings[name] = +((performance.now() - start) / N).toFixed(1);
    }
    return { timings, layer: `${res.imgW}x${res.imgH}` } as const;
  });

  console.log('PERF GATE:', JSON.stringify(perf));
  expect('error' in perf ? perf.error : null).toBeNull();
  if ('error' in perf) return;

  // Budget with headroom for CI noise: the regression this catches took the
  // reveal phase to ~70 ms (2× the 33 ms frame budget at 30 fps).
  const BUDGET_MS = 50;
  for (const [phase, ms] of Object.entries(perf.timings)) {
    expect(ms, `compose phase "${phase}" took ${ms}ms (budget ${BUDGET_MS}ms)`).toBeLessThan(BUDGET_MS);
  }
});
