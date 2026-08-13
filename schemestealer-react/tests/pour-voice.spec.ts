/**
 * The pour voice, measured.
 *
 * This started as direct user feedback — "the tones for filling the paints
 * sound a bit keyboard setting" — and the analysis said exactly why. Every gate
 * here is a property of the RENDERED AUDIO rather than of the graph, because
 * the graph was never the thing that sounded wrong.
 *
 * Baselines quoted below are from the shipped 2026-08-12 bed.
 */
import { test, expect } from '@playwright/test';
import { seedInspirationScan } from './revealSeed';

const STORAGE_KEY = 'schemestealer-storage';
const SR = 48000;

async function seed(page: import('@playwright/test').Page) {
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.addInitScript(seedInspirationScan, STORAGE_KEY);
  await page.goto('/inspiration/results');
  await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (window as any).__revealDebug.loadWarp();
  });
}

/** Render one pour in isolation and return its samples.
 *
 * In isolation deliberately: inside the full mix the pad, the air layer and the
 * sub all overlap every pour, so none of the spectral properties below can be
 * measured there.
 */
async function renderPour(
  page: import('@playwright/test').Page,
  args: { freq: number; seed: number; glide?: number },
): Promise<number[]> {
  return page.evaluate(async (a) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const W = (window as any).__warpDebug;
    const sr = 48000;
    const ctx = new OfflineAudioContext(1, Math.ceil(sr * 2.2), sr);
    W.poured(ctx, ctx.destination, {
      freq: a.freq,
      at: 0.02,
      gain: 0.3,
      decay: 1.5,
      attack: 0.05,
      seed: a.seed,
      glideSemitones: a.glide ?? 3.5,
    });
    const buf = await ctx.startRendering();
    return Array.from(buf.getChannelData(0));
  }, args);
}

/** Magnitude spectrum over a window, via a real FFT. */
function spectrum(d: number[], from: number, to: number): { mag: Float64Array; binHz: number } {
  const seg = d.slice(from, to);
  let N = 1;
  while (N < seg.length) N <<= 1;
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  for (let i = 0; i < seg.length; i++) {
    // Hann, so partial peaks are not smeared by the window's own sidelobes.
    re[i] = seg[i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / seg.length));
  }
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
    for (let i = 0; i < N; i += len) {
      for (let k = 0; k < len / 2; k++) {
        const wr = Math.cos(ang * k);
        const wi = Math.sin(ang * k);
        const ur = re[i + k];
        const ui = im[i + k];
        const vr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
        const vi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
        re[i + k] = ur + vr;
        im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr;
        im[i + k + len / 2] = ui - vi;
      }
    }
  }
  const mag = new Float64Array(N / 2);
  for (let k = 0; k < N / 2; k++) mag[k] = Math.hypot(re[k], im[k]);
  return { mag, binHz: SR / N };
}

/** The strongest spectral peaks, as frequencies, loudest first. */
function peaks(mag: Float64Array, binHz: number, count: number, minHz = 120): number[] {
  const found: { hz: number; v: number }[] = [];
  for (let k = 2; k < mag.length - 2; k++) {
    const hz = k * binHz;
    if (hz < minHz || hz > 9000) continue;
    if (mag[k] > mag[k - 1] && mag[k] >= mag[k + 1] && mag[k] > mag[k - 2] && mag[k] > mag[k + 2]) {
      // Parabolic interpolation — bin resolution alone is too coarse for a 3%
      // formant assertion.
      const a = mag[k - 1];
      const b = mag[k];
      const c = mag[k + 1];
      const shift = (0.5 * (a - c)) / (a - 2 * b + c || 1e-12);
      found.push({ hz: (k + shift) * binHz, v: b });
    }
  }
  return found.sort((x, y) => y.v - x.v).slice(0, count).map((f) => f.hz);
}

/** Dominant frequency in a window, for tracking the glide. */
function f0(d: number[], from: number, to: number): number {
  const { mag, binHz } = spectrum(d, from, to);
  let best = 0;
  let bestK = 0;
  for (let k = 2; k < mag.length; k++) {
    const hz = k * binHz;
    if (hz < 200 || hz > 1400) continue;
    if (mag[k] > best) {
      best = mag[k];
      bestK = k;
    }
  }
  return bestK * binHz;
}

/** Is there a local maximum within `tol` of `targetHz`? */
function hasPeakNear(mag: Float64Array, binHz: number, targetHz: number, tol: number): boolean {
  const lo = Math.floor((targetHz * (1 - tol)) / binHz);
  const hi = Math.ceil((targetHz * (1 + tol)) / binHz);
  let bestK = -1;
  let best = 0;
  for (let k = lo; k <= hi; k++) {
    if (k < 2 || k >= mag.length - 2) continue;
    if (mag[k] > best) {
      best = mag[k];
      bestK = k;
    }
  }
  if (bestK < 0) return false;
  // A genuine resonance, not the shoulder of a neighbouring partial: it must
  // rise above what sits just outside the band on both sides.
  const out = Math.max(1, Math.round((targetHz * tol * 2) / binHz));
  const left = mag[Math.max(2, bestK - out)];
  const right = mag[Math.min(mag.length - 3, bestK + out)];
  return best > left * 1.15 && best > right * 1.15;
}

test('pour voice: a fixed formant survives transposition', async ({ page }) => {
  await seed(page);
  // Three pitches spanning more than a fourth.
  const freqs = [330, 440, 587];
  const found: Record<number, boolean[]> = { 700: [], 2400: [] };
  for (const freq of freqs) {
    const d = await renderPour(page, { freq, seed: 12345 });
    // Measured just after the attack, where a struck body's own modes ring
    // loudest. Later in the note the partials dominate and the body has decayed.
    const start = Math.floor(0.12 * SR);
    const { mag, binHz } = spectrum(d, start, start + 16384);
    for (const hz of [700, 2400]) found[hz].push(hasPeakNear(mag, binHz, hz, 0.03));
  }
  console.log('POUR FORMANTS:', JSON.stringify(found));

  /**
   * Intent: this is the single largest contributor to the synthetic
   * impression. On the shipped bed NOTHING held a fixed frequency — the entire
   * spectrum transposed with the note, which is what a sampler does and what a
   * struck object does not.
   *
   * Stated as "a local maximum within 3% of a fixed frequency" rather than
   * "the same entry appears in the top-N peaks", because the glide smears the
   * partials across bins and a top-N list is dominated by that smear.
   */
  const holds = Object.entries(found).filter(([, hits]) => hits.every(Boolean));
  expect(
    holds.length,
    `no body mode held station across ${freqs.join('/')} Hz: ${JSON.stringify(found)}`,
  ).toBeGreaterThan(0);
});

test('pour voice: the pitch actually rises as the vessel fills', async ({ page }) => {
  await seed(page);
  const d = await renderPour(page, { freq: 440, seed: 999, glide: 3.5 });

  const win = 8192;
  const early = f0(d, Math.floor(0.08 * SR), Math.floor(0.08 * SR) + win);
  const later = f0(d, Math.floor(0.62 * SR), Math.floor(0.62 * SR) + win);
  const cents = 1200 * Math.log2(later / early);
  console.log('POUR GLIDE:', JSON.stringify({ early, later, cents }));

  // Intent: a real pour rises as the air column shortens. Measured on the
  // shipped bed: +2.4 and +0.7 cents across an entire note, i.e. a ruler-flat
  // line on the spectrogram.
  expect(cents, 'pour pitch is static').toBeGreaterThan(150);
});

test('pour voice: every paint gets its own spectral template', async ({ page }) => {
  await seed(page);
  const ratios: number[] = [];
  // Five different paint seeds, one pitch — so any divergence is the seed's.
  for (const seedV of [11, 2222, 33333, 444444, 5555555]) {
    const d = await renderPour(page, { freq: 440, seed: seedV, glide: 3.5 });
    const start = Math.floor(0.35 * SR);
    const { mag, binHz } = spectrum(d, start, start + 16384);
    const p = peaks(mag, binHz, 10).sort((a, b) => a - b);
    const fund = p.find((hz) => Math.abs(hz - 440 * Math.pow(2, 3.5 / 12)) / hz < 0.12) ?? p[0];
    const second = p.find((hz) => hz > fund * 1.8);
    if (fund && second) ratios.push(second / fund);
  }
  const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const sd = Math.sqrt(ratios.reduce((a, r) => a + (r - mean) ** 2, 0) / ratios.length);
  const cov = sd / mean;
  console.log('POUR TEMPLATE COV:', JSON.stringify({ ratios, cov }));

  // Intent: on the shipped bed two PAIRS of pours agreed to within 0.15% and
  // 0.3% — one timbre, transposed, which is the definition of a preset.
  expect(ratios.length).toBeGreaterThanOrEqual(4);
  expect(cov, 'every paint still sounds like the same instrument').toBeGreaterThan(0.03);
});

test('pour voice: the attack is coupled to the body, not bolted on', async ({ page }) => {
  await seed(page);
  const d = await renderPour(page, { freq: 440, seed: 777, glide: 3.5 });

  const centroid = (from: number, to: number) => {
    const { mag, binHz } = spectrum(d, from, to);
    let num = 0;
    let den = 0;
    for (let k = 2; k < mag.length; k++) {
      const hz = k * binHz;
      if (hz > 9000) break;
      num += hz * mag[k];
      den += mag[k];
    }
    return den ? num / den : 0;
  };

  const atk = centroid(Math.floor(0.02 * SR), Math.floor(0.02 * SR) + 2048);
  const sus = centroid(Math.floor(0.45 * SR), Math.floor(0.45 * SR) + 8192);
  const ratio = sus > 0 ? atk / sus : Infinity;
  console.log('POUR ATTACK COUPLING:', JSON.stringify({ atk, sus, ratio }));

  /**
   * Intent: the shipped bed measured 3990 Hz at the attack against 1852 Hz in
   * the sustain — a 2.2x gap. The transient was broadband noise that never
   * passed through the note's own resonances, so the ear heard two separate
   * events: a click, then an oscillator. That is the classic rompler tell.
   * Running the burst through the partial bank pulls them together.
   */
  expect(ratio, 'attack is spectrally disconnected from the sustain').toBeLessThan(2.0);
});

test('pour voice: renders are bit-identical', async ({ page }) => {
  await seed(page);
  const args = { freq: 440, seed: 4242, glide: 3.5 };
  const a = await renderPour(page, args);
  const b = await renderPour(page, args);
  // Intent: everything added here is seeded, not random. A voice that drifts
  // between renders would make every gate above unfalsifiable.
  expect(a.length).toBe(b.length);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff = Math.max(diff, Math.abs(a[i] - b[i]));
  console.log('POUR DETERMINISM: max sample delta', diff);
  expect(diff, 'two renders of the same pour differ audibly').toBeLessThan(1e-6);
});
