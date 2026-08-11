/**
 * Engine A — warp-cast export (inspiration mode).
 *
 * Mirrors reveal-export.spec.ts. The gates are deliberately the SAME gates: the
 * warp storyboard reuses the encode path, the phase table and the loudness
 * chain, so if it can pass a different bar than the miniature then one of those
 * claims is untrue.
 *
 * The real encode lives in reveal-encode.spec.ts — it needs real Chrome, because
 * Playwright's bundled Chromium crashes on VideoEncoder.
 */
import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedInspirationScan } from './revealSeed';

const STORAGE_KEY = 'schemestealer-storage';
const OUT_DIR = resolve('test-results', 'warp-frames');

async function seed(page: import('@playwright/test').Page) {
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.addInitScript(seedInspirationScan, STORAGE_KEY);
  await page.goto('/inspiration/results');
  // warpCompose is a dynamic chunk in production; pulling it in registers
  // window.__warpDebug.
  await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (window as any).__revealDebug.loadWarp();
  });
}

test('warp-cast: export UI is wired into the inspiration Share modal', async ({ page }) => {
  await seed(page);
  await page.getByRole('button', { name: /share essence/i }).click();
  await expect(page.getByRole('heading', { name: /broadcast warp-cast/i })).toBeVisible();
  const exportBtn = page.getByRole('button', { name: /export warp-cast/i });
  await expect(exportBtn).toBeVisible();
  // Intent: the gate used to require masks, which an inspiration scan never
  // has — that is precisely why this tab had no export. If the button is
  // disabled or the fallback copy is showing, the gate has regressed.
  await expect(page.getByText(/scan an image to broadcast/i)).toHaveCount(0);
});

test('warp-cast: storyboard frames render and the loop seam is exact', async ({ page }) => {
  await seed(page);

  // Sampled against the warp phase table, not the miniature's.
  const FRAMES: Record<string, number> = {
    frame0: 0,
    poster: 900,
    drain: 2200,
    bloom: 3300,
    pour2: 5900,
    pour5: 8600,
    settle: 10500,
    hold: 12600,
    loop: 14000,
  };

  const result = await page.evaluate(async (frames) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).__warpDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    if (!W || !scan) return { error: `warpHook=${!!W} scan=${!!scan}` } as const;
    const spec = W.buildWarpSpec(scan.detectedColors, 'citadel', 'Citadel', 'warp', 'colours', W.WARP_DURATION_MS);
    const res = await W.prepareWarpResources(scan.imageUrl, spec);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;
    const out: Record<string, string> = {};
    for (const name of Object.keys(frames)) {
      W.composeWarpAt(ctx, frames[name], res);
      out[name] = canvas.toDataURL('image/png');
    }
    return {
      frames: out,
      // Orbs must NOT be stacked: the seed sets every position to dead centre,
      // so distinct positions here prove the pixel scan actually ran.
      positions: spec.regions.map((r: { position: { x: number; y: number } }) => r.position),
      wall: spec.wall,
      colourCount: spec.colourCount,
    } as const;
  }, FRAMES);

  expect('error' in result ? result.error : null).toBeNull();
  if ('error' in result) return;

  mkdirSync(OUT_DIR, { recursive: true });
  for (const [name, dataUrl] of Object.entries(result.frames)) {
    const b64 = dataUrl.split(',')[1];
    writeFileSync(resolve(OUT_DIR, `${name}.png`), Buffer.from(b64, 'base64'));
    expect(b64.length, `${name} is a trivial frame`).toBeGreaterThan(2000);
  }

  // Intent: the loop seam IS the product — the clip is posted to autoplay
  // repeatedly. frame0 and the loop target must be the same pixels, not merely
  // similar, or the restart shows a visible jump.
  expect(result.frames.loop, 'loop seam is not pixel-exact').toBe(result.frames.frame0);

  // Intent: without a pixel scan every orb sits at the centre of the frame and
  // the clip's core claim ("these paints are IN this image") is visibly false.
  console.log('ORB ORIGINS:', JSON.stringify(result.positions));
  const stacked = result.positions.filter((p: { x: number; y: number }) => p.x === 0.5 && p.y === 0.5);
  expect(stacked.length, 'orbs left at the seeded centre — the origin scan did not run').toBe(0);
  for (let i = 0; i < result.positions.length; i++) {
    for (let j = i + 1; j < result.positions.length; j++) {
      const a = result.positions[i];
      const b = result.positions[j];
      expect(Math.hypot(a.x - b.x, a.y - b.y), `orbs ${i} and ${j} overlap`).toBeGreaterThan(0.05);
    }
  }

  // Intent: six colours in, six rows out, each carrying its own measurement.
  expect(result.colourCount).toBe(6);
  expect(result.wall).toHaveLength(6);
  for (const row of result.wall) {
    expect(row.paintName.length).toBeGreaterThan(0);
    expect(typeof row.deltaE).toBe('number');
  }
});

/**
 * Pixel-level anti-freeze, inherited from the miniature.
 *
 * The v5.3 measurement that forced the ambient layer: the calmest 0.4 s window
 * of the shipped clip scored a mean channel delta of 0.012 — a still image in
 * everything but name, while every field-based assertion passed. The warp
 * storyboard reuses `drawAmbient`, and this proves it actually reaches the
 * frame rather than being drawn under something opaque.
 */
test('warp-cast: no 0.4 s window is visually frozen', async ({ page }) => {
  await seed(page);

  const worst = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).__warpDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    const spec = W.buildWarpSpec(scan.detectedColors, 'citadel', 'Citadel', 'warp', 'colours', W.WARP_DURATION_MS);
    const res = await W.prepareWarpResources(scan.imageUrl, spec);
    // Quarter scale: the metric is a mean over all pixels, so it is unchanged by
    // resolution, and full size would take minutes.
    const w = 270;
    const h = 480;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    const FPS = 30;
    const frames = Math.round((W.WARP_DURATION_MS / 1000) * FPS);
    let prev: Uint8ClampedArray | null = null;
    const deltas: number[] = [];
    for (let i = 0; i < frames; i++) {
      ctx.save();
      ctx.scale(w / 1080, h / 1920);
      W.composeWarpAt(ctx, (i * 1000) / FPS, res);
      ctx.restore();
      const d = ctx.getImageData(0, 0, w, h).data;
      if (prev) {
        let sum = 0;
        for (let p = 0; p < d.length; p += 4) {
          sum += Math.abs(d[p] - prev[p]) + Math.abs(d[p + 1] - prev[p + 1]) + Math.abs(d[p + 2] - prev[p + 2]);
        }
        deltas.push(sum / ((d.length / 4) * 3));
      }
      prev = new Uint8ClampedArray(d);
    }
    // Quietest 0.4 s window.
    const win = Math.round(0.4 * FPS);
    let quietest = Number.POSITIVE_INFINITY;
    let atFrame = -1;
    for (let s = 0; s + win <= deltas.length; s++) {
      let m = 0;
      for (let i = s; i < s + win; i++) m += deltas[i];
      m /= win;
      if (m < quietest) {
        quietest = m;
        atFrame = s;
      }
    }
    return { quietest, atSec: atFrame / FPS };
  });

  console.log('WARP ANTI-FREEZE:', JSON.stringify(worst));
  expect(worst.quietest, `quietest 0.4 s window at ${worst.atSec}s`).toBeGreaterThan(0.5);
});

/**
 * The audio gates, re-measured against the WARP bed.
 *
 * This is a brand-new mix, not an inherited one — the timbre is entirely
 * different (detuned drone and glass instead of cogitator rumble and clacks) so
 * none of the miniature's measurements carry over. The thresholds do.
 */
test('warp-cast audio: rumble bed, transient highs, broadcast loudness', async ({ page }) => {
  await seed(page);

  const audio = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).__warpDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    const spec = W.buildWarpSpec(scan.detectedColors, 'citadel', 'Citadel', 'warp', 'colours', W.WARP_DURATION_MS);
    const sr = 48000;
    const T0 = 0.05;

    const render = async (layers: 'all' | 'bed') => {
      const ctx = new OfflineAudioContext(1, Math.ceil(sr * 14.6), sr);
      W.scheduleWarpAudio(ctx, ctx.destination, spec, T0, { layers });
      return (await ctx.startRendering()).getChannelData(0);
    };

    const bands = (d: Float32Array) => {
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
      let sub = 0;
      let mid = 0;
      let hi = 0;
      for (let k = 1; k < N / 2; k++) {
        const f = k * binHz;
        if (f < 40) continue;
        const p = re[k] * re[k] + im[k] * im[k];
        if (f < 250) sub += p;
        else if (f < 3000) mid += p;
        else if (f < 16000) hi += p;
      }
      const total = sub + mid + hi;
      return { subFraction: sub / total, midFraction: mid / total, highFraction: hi / total };
    };

    const integratedLufs = (d: Float32Array) => {
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
      return kept.length
        ? -0.691 + 10 * Math.log10(kept.reduce((a, l) => a + 10 ** ((l + 0.691) / 10), 0) / kept.length)
        : -70;
    };

    const full = await render('all');
    const bed = await render('bed');

    let sum = 0;
    let peak = 0;
    for (let i = 0; i < full.length; i++) {
      sum += full[i] * full[i];
      if (Math.abs(full[i]) > peak) peak = Math.abs(full[i]);
    }
    const rmsDb = 20 * Math.log10(Math.sqrt(sum / full.length) + 1e-9);
    const peakDb = 20 * Math.log10(peak + 1e-9);

    const a = 0.7181;
    const st = [0, 0, 0, 0];
    const sx = [0, 0, 0, 0];
    const hf = new Float64Array(full.length);
    for (let i = 0; i < full.length; i++) {
      let v: number = full[i];
      for (let s = 0; s < 4; s++) {
        const y = a * (st[s] + v - sx[s]);
        sx[s] = v;
        st[s] = y;
        v = y;
      }
      hf[i] = v * v;
    }
    // The SAME beat table the scheduler uses, so this cannot drift into testing
    // a stale copy of the schedule. `warpAudioBeats`, not `revealAudioBeats` —
    // the warp-cast has its own phase table and the miniature's beats describe
    // a cut that does not exist here.
    const beats: number[] = W.warpAudioBeats(spec).map((b: number) => b + T0);
    const WINDOW = 0.06;
    let near = 0;
    let total = 0;
    for (let i = 0; i < hf.length; i++) {
      total += hf[i];
      const t = i / sr;
      for (let b = 0; b < beats.length; b++) {
        if (Math.abs(t - beats[b]) <= WINDOW) {
          near += hf[i];
          break;
        }
      }
    }

    return {
      rmsDb,
      peakDb,
      crestDb: peakDb - rmsDb,
      lufs: integratedLufs(full),
      mix: bands(full),
      bed: bands(bed),
      hfOnBeat: near / (total + 1e-30),
      beatCount: beats.length,
      windowCoverage: (beats.length * 2 * WINDOW) / (full.length / sr),
    };
  });
  console.log('WARP AUDIO:', JSON.stringify(audio, null, 1));

  expect(audio.bed.subFraction, 'bed energy below 250 Hz').toBeGreaterThan(0.6);
  expect(audio.bed.highFraction, 'bed energy above 3 kHz').toBeLessThan(0.1);
  expect(audio.hfOnBeat, 'HF energy within +/-60 ms of a scheduled beat').toBeGreaterThan(0.65);
  expect(audio.lufs, 'integrated loudness').toBeGreaterThan(-15);
  expect(audio.lufs, 'integrated loudness').toBeLessThan(-13);
  expect(audio.peakDb, 'true-peak headroom').toBeLessThan(-1);
  expect(audio.crestDb, 'crest factor').toBeGreaterThan(12);
});

/**
 * Perf gate at a realistic phone-photo size. The stutter bug that shipped twice
 * was invisible to the suite for two rounds because the seed image is small and
 * composes 200x cheaper than a real upload.
 */
test('warp-cast perf gate: compose stays in budget at phone-photo resolution', async ({ page }) => {
  await seed(page);

  const perf = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).__warpDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    const big = document.createElement('canvas');
    big.width = 2400;
    big.height = 3200;
    const bx = big.getContext('2d')!;
    bx.fillStyle = '#101014';
    bx.fillRect(0, 0, 2400, 3200);
    for (const [i, c] of scan.detectedColors.entries()) {
      bx.fillStyle = c.hex;
      bx.fillRect((i % 2) * 1200, Math.floor(i / 2) * 1000, 900, 800);
    }
    const bigUrl = big.toDataURL('image/jpeg', 0.9);

    const spec = W.buildWarpSpec(scan.detectedColors, 'citadel', 'Citadel', 'warp', 'colours', W.WARP_DURATION_MS);
    const res = await W.prepareWarpResources(bigUrl, spec);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d')!;
    const PHASES: Record<string, number> = {
      poster: 900, drain: 2200, bloom: 3300, pour2: 5900, pour5: 8600, settle: 10500, loop: 14000,
    };
    const timings: Record<string, number> = {};
    for (const [name, t] of Object.entries(PHASES)) {
      W.composeWarpAt(ctx, t, res); // warm
      const s = performance.now();
      for (let i = 0; i < 5; i++) W.composeWarpAt(ctx, t, res);
      timings[name] = Math.round(((performance.now() - s) / 5) * 10) / 10;
    }
    return { timings, layer: `${res.imgW}x${res.imgH}` };
  });

  console.log('WARP PERF GATE:', JSON.stringify(perf));
  const BUDGET_MS = 50;
  for (const [phase, ms] of Object.entries(perf.timings)) {
    expect(ms, `compose phase "${phase}" took ${ms}ms (budget ${BUDGET_MS}ms)`).toBeLessThan(BUDGET_MS);
  }
});

/**
 * The inspiration tab must not render the OTHER theme's signature colour.
 *
 * The miniature identity is cogitator green (#00FF41); the inspiration identity
 * is warp purple with teal for positive states. A shipped build had every
 * "✓ Perfect" badge, every ΔE chip and the share modal's quality banner in
 * imperial green, because the quality ramp used a THEME colour to carry SEMANTIC
 * meaning. A grep cannot catch the next instance of that — a computed-style
 * sweep can.
 *
 * Detected-colour data is exempt: if someone scans a photo of grass, green
 * swatches are the correct output. The allowance covers that and nothing more.
 */
test('inspiration tab renders no imperial green chrome', async ({ page }) => {
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.addInitScript(seedInspirationScan, STORAGE_KEY);
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('/inspiration/results');
  await page.waitForTimeout(2000);

  const sweep = () =>
    page.evaluate(() => {
      // Colours are resolved through a canvas rather than parsed as text.
      // Tailwind v4 emits `lab()` / `oklch()`, so getComputedStyle returns
      // `lab(70.55 -66.51 45.81)` for bg-green-500 — an rgb() regex is blind to
      // every class-based colour in the app, which is exactly how the first
      // version of this sweep reported a clean page that was not clean.
      const probe = document.createElement('canvas').getContext('2d')!;
      const toRgb = (v: string): { r: number; g: number; b: number } | null => {
        if (!v || v === 'transparent' || v === 'none') return null;
        const alpha = /rgba?\([^)]*?,\s*([\d.]+)\s*\)$/.exec(v);
        if (alpha && parseFloat(alpha[1]) < 0.06) return null;
        probe.clearRect(0, 0, 1, 1);
        probe.fillStyle = '#000000';
        probe.fillStyle = v;
        if (probe.fillStyle === '#000000' && !/^#0{3,6}$|black/i.test(v)) return null;
        probe.fillRect(0, 0, 1, 1);
        const d = probe.getImageData(0, 0, 1, 1).data;
        if (d[3] < 16) return null;
        return { r: d[0], g: d[1], b: d[2] };
      };
      // Imperial green: green dominates both other channels hard. Warp teal has
      // substantial blue and does not match.
      const isImperialGreen = (c: { r: number; g: number; b: number }) =>
        c.g > 90 && c.g - c.r > 55 && c.g - c.b > 55;
      const hits: string[] = [];
      document.querySelectorAll('*').forEach((el) => {
        const cs = getComputedStyle(el);
        (['color', 'backgroundColor', 'borderTopColor', 'borderLeftColor'] as const).forEach((p) => {
          const c = toRgb(cs[p]);
          if (!c || !isImperialGreen(c)) return;
          const e = el as HTMLElement;
          // A swatch painted with a DETECTED colour is data, not chrome: scan a
          // photo of grass and green output is correct.
          if (p === 'backgroundColor' && e.style.backgroundColor) return;
          if (p === 'borderTopColor' && e.style.borderColor) return;
          hits.push(`${p}=${cs[p]} <${e.tagName.toLowerCase()}> "${(e.innerText || '').trim().slice(0, 30)}"`);
        });
      });
      return Array.from(new Set(hits));
    });

  const page1 = await sweep();
  console.log('INSPIRATION PAGE GREEN CHROME:', JSON.stringify(page1));
  expect(page1, 'imperial green on the inspiration results page').toEqual([]);

  await page.getByRole('button', { name: /share essence/i }).click();
  await expect(page.getByRole('heading', { name: /broadcast warp-cast/i })).toBeVisible();
  const withModal = await sweep();
  console.log('WARP MODAL GREEN CHROME:', JSON.stringify(withModal));
  expect(withModal, 'imperial green in the warp-cast share modal').toEqual([]);
});
