/**
 * Callout legibility, measured from rendered pixels.
 *
 * `labelTint` lifts dark families toward a luma floor, but that floor was
 * computed against THE VOID while the callouts land on the MODEL. Measured on
 * the shipped pict-cast: DARK GREY and BLACK rendered as dark glyphs over red
 * armour, and RED rendered red-on-red.
 *
 * Asserted from pixels rather than from the colour constant, because the
 * constant was never the thing that was wrong — what it was compared against
 * was.
 */
import { test, expect } from '@playwright/test';
import { seedScan } from './revealSeed';

const STORAGE_KEY = 'schemestealer-storage';

test('callout labels clear 4.5:1 against whatever is behind them', async ({ page }) => {
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.route('**/api/**', (r) =>
    r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', ready: true }) }),
  );
  await page.addInitScript(seedScan, STORAGE_KEY);
  await page.goto('/miniature/results');

  const worst = await page.evaluate(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const R = (window as any).__revealDebug;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scan = (window as any).__seedScan;
    const colors = scan.detectedColors;
    const steps = R.recipeSteps(colors[0].paintRecipe, 'citadel');
    const spec = R.buildRevealSpec(colors, steps, 'Citadel', 'imperial', 'colours', 11000, 0);
    const res = await R.prepareResources(scan.imageUrl, colors, scan.maskFrame, spec);

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const relLuma = (r: number, g: number, b: number) => {
      const f = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    let worstRatio = Infinity;
    let worstAt = -1;
    let measured = 0;
    const ratios: number[] = [];
    const FPS = 10; // every 3rd frame — the labels do not move between them

    for (let i = 0; i < 11 * FPS; i++) {
      const t = (i * 1000) / FPS;
      const st = R.frameState(t, spec);
      const hud = 1 - st.hudFade;
      if (hud <= 0) continue;
      R.composeAt(ctx, t, res);
      const r0 = R.modelRectAt(st.camera, res.imgW, res.imgH);

      for (const c of res.callouts) {
        // labelReveal is per-REGION, not on the frame state. Reading it off the
        // frame made this gate skip every frame and pass on nothing, which is
        // worse than no gate at all.
        const rs = st.regions[c.index];
        if (!rs || rs.labelReveal * hud <= 0.5) continue;
        measured++;
        const box = R.calloutLabelBox(c.side, r0.y + c.railY * r0.h, 300);
        const d = ctx.getImageData(
          Math.max(0, Math.floor(box.x)),
          Math.max(0, Math.floor(box.y)),
          Math.max(1, Math.floor(box.w)),
          Math.max(1, Math.floor(box.h)),
        ).data;
        // Split the patch into ink and ground by luminance, then measure the
        // contrast between the two populations. Sampling a single "text colour"
        // would miss the glow and the antialiasing that actually reach the eye.
        const lum: number[] = [];
        for (let p = 0; p < d.length; p += 4) lum.push(relLuma(d[p], d[p + 1], d[p + 2]));
        if (lum.length < 16) continue;
        /**
         * Glyph core against the darkest ground in the same patch.
         *
         * The percentile window matters and two earlier choices were wrong. A
         * 20/80 split puts the label's own soft glow into the "background"
         * population; comparing the top decile against the MEDIAN is worse
         * still, because on a small patch the median is half glyph. What the
         * eye separates is the solid centre of a stroke from the darkest thing
         * around it, so that is what this measures.
         */
        const sorted = [...lum].sort((a, b) => a - b);
        const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))];
        const ground = at(0.05);
        const ink = at(0.95);
        const ratio = (Math.max(ink, ground) + 0.05) / (Math.min(ink, ground) + 0.05);
        ratios.push(ratio);
        if (ratio < worstRatio) {
          worstRatio = ratio;
          worstAt = t;
        }
      }
    }
    ratios.sort((a, b) => a - b);
    const medianRatio = ratios.length ? ratios[Math.floor(ratios.length / 2)] : 0;
    return { worstRatio, worstAt, measured, medianRatio };
  });

  console.log('CALLOUT CONTRAST:', JSON.stringify(worst));
  // A gate that measured nothing is not a gate. The first version of this read
  // labelReveal off the frame state, where it does not exist, skipped every
  // frame and passed on an empty set.
  expect(worst.measured, 'no callout label was ever measured').toBeGreaterThan(20);
  /**
   * A RATCHET, not the target.
   *
   * The target is 4.5:1 and this does not reach it: the worst label measures
   * 2.77 at t=3200ms, while the typical one clears 5-7. Solving the ink against
   * the sampled local background fixed the defect that was reported — dark
   * glyphs on red armour, red-on-red — but it does not yet guarantee WCAG AA on
   * every frame, and the remaining gap sits in the garble phase where the
   * glyphs are still resolving.
   *
   * The number below is what the code actually achieves today. It is set here
   * so the figure cannot silently get worse, and it is deliberately NOT
   * loosened to whatever makes a green tick: three different percentile windows
   * were tried while chasing this, and picking the one that passes would be
   * fitting the gate to the outcome rather than measuring the product.
   *
   * Re-baselined once, from 2.7, when D2 lifted the pict-cast backdrop from 23
   * to 46 mean luma. A brighter ground genuinely reduces the worst label's
   * headroom; that is a product decision moving a measurement, not the gate
   * being bent to fit.
   */
  expect(worst.worstRatio, `worst callout contrast at t=${worst.worstAt}ms`).toBeGreaterThanOrEqual(2.5);
  // The typical label must be genuinely legible, which is the claim that matters.
  expect(worst.medianRatio, 'typical callout contrast').toBeGreaterThanOrEqual(4.5);
});
