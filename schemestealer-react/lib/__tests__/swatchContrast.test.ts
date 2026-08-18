/**
 * O-F3 — text on a dynamic swatch must be READABLE, and the swatch colour is
 * measured at runtime, so the ink has to be computed rather than chosen.
 *
 * Measured by the audit on the 60 real cluster swatches a scan produces: 6 of 60
 * (10.0%) fail WCAG 4.5:1, worst 2.85:1, and 2 of 60 fall below even the 3:1
 * large-text floor — the worst being a 79.9%-coverage White card, i.e. the most
 * prominent swatch on the scan. Roughly 1 in 12 men has a colour-vision
 * deficiency; this was the one accessibility defect the audit found on a surface
 * every user reads.
 *
 * **The plan's hooks were the wrong population.** It names the shared card and
 * `components/seo/SwatchCompare.tsx`. Neither renders text on a swatch:
 * `SwatchCompare.tsx:57,80` put their labels in a `bg-black/70 backdrop-blur-md`
 * panel with `text-white`, `PaintRecipeCard`'s `ColorComparison` (`:553-563`)
 * uses `bg-black/40` + `text-white`, and the step-row swatch (`:643`) carries no
 * text at all. Fixing those two would have hardened components that already pass.
 *
 * The component that actually inks with a measured colour is `AuspexReveal`:
 *   * `:727` — the focused callout's type inherits `color: color.hex` over a
 *     `bg-black/90` scrim, so a dark family renders dark-on-black
 *   * `:761` — the focused chip paints `background: color.hex` and puts BLACK
 *     type on it, which fails for every dark swatch
 *
 * Both are fixed by reusing what already exists: `contrastTint` from
 * `lib/reveal/revealCompose` (hue-preserving, already gated on rendered pixels by
 * `tests/callout-contrast.spec.ts` — the pict-cast solved this for video and the
 * app never inherited it) and `readableInkOn` from `lib/colorConversion`, which
 * finally gives `getContrastRatio`/`getRelativeLuminance` their first callers
 * after shipping with none.
 */

import { describe, expect, it } from 'vitest';

import { getContrastRatio, hexToRgb, readableInkOn } from '../colorConversion';
import { contrastTint, relLuma } from '../reveal/revealCompose';
import paintsRaw from '../data/paints_groundtruth.json';

const paints = paintsRaw as Array<{ name: string; brand: string; hex?: string }>;

/** The callout scrim is `bg-black/90`. Solved against black: that is the 90% the
 *  scrim actually contributes, and the residual backdrop is neither knowable nor
 *  samplable from the DOM. The pict-cast, which CAN sample its own canvas, makes
 *  the same call for the same callouts. */
const SCRIM_LUMA = 0;

const WCAG_AA = 4.5;

const ratioAgainst = (inkHex: string, bgHex: string) =>
  getContrastRatio(hexToRgb(inkHex), hexToRgb(bgHex));

/**
 * The audit's named worst cases, plus the two extremes that break a hard-coded
 * ink in either direction.
 */
const NAMED_CASES: Array<[string, string]> = [
  ['White Scar (the 79.9% White card class)', '#ffffff'],
  ['Abaddon Black', '#000000'],
  ['Nuln Oil', '#14100e'],
  ['brass family', '#b5a642'],
  ['mid grey — the worst case for a binary ink', '#777777'],
];

describe('readableInkOn — type sitting ON a measured swatch', () => {
  it.each(NAMED_CASES)('clears 4.5:1 on %s', (_label, hex) => {
    expect(ratioAgainst(readableInkOn(hex), hex)).toBeGreaterThanOrEqual(WCAG_AA);
  });

  it('clears 4.5:1 on every paint in the shipped database', () => {
    /**
     * The swatch is whatever the scan measured, so the only honest population is
     * "any colour". 1,312 shipped paints is the broadest real one available, and
     * it contains both extremes.
     *
     * What would make this fail: hard-coding an ink colour anywhere on a dynamic
     * background — which is exactly what `:761` did with `#000`, and it fails on
     * 688 of these 1,312.
     */
    const failures = paints
      .filter((p) => p.hex)
      .map((p) => ({ p, ratio: ratioAgainst(readableInkOn(p.hex!), p.hex!) }))
      .filter(({ ratio }) => ratio < WCAG_AA);

    expect(failures.map((f) => `${f.p.brand} ${f.p.name} ${f.ratio.toFixed(2)}:1`)).toEqual([]);
  });

  it('a hard-coded ink would fail, which is why this is computed', () => {
    // Not a tautology — it is the measurement that justifies the change, and it
    // pins the direction: black type is the one that was there.
    const blackFails = paints.filter(
      (p) => p.hex && ratioAgainst('#000000', p.hex) < WCAG_AA,
    );
    const whiteFails = paints.filter(
      (p) => p.hex && ratioAgainst('#ffffff', p.hex) < WCAG_AA,
    );
    expect(blackFails.length).toBeGreaterThan(0);
    expect(whiteFails.length).toBeGreaterThan(0);
  });
});

describe('contrastTint — type that keeps its hue over the callout scrim', () => {
  it.each(NAMED_CASES)('lifts %s clear of the scrim', (_label, hex) => {
    const ink = contrastTint(hex, SCRIM_LUMA, WCAG_AA);
    const l = relLuma(hexToRgb(ink).r, hexToRgb(ink).g, hexToRgb(ink).b);
    expect((Math.max(l, SCRIM_LUMA) + 0.05) / (Math.min(l, SCRIM_LUMA) + 0.05))
      .toBeGreaterThanOrEqual(WCAG_AA);
  });

  it('clears 4.5:1 for every paint in the shipped database', () => {
    /**
     * What would make this fail: reverting the callout to raw `color.hex`, which
     * fails on 688 of the 1,312 — every dark family, which is precisely the
     * BLACK and BROWN case the pict-cast's own docstring records as invisible.
     */
    const failures = paints
      .filter((p) => p.hex)
      .map((p) => {
        const ink = hexToRgb(contrastTint(p.hex!, SCRIM_LUMA, WCAG_AA));
        const l = relLuma(ink.r, ink.g, ink.b);
        return { p, ratio: (l + 0.05) / (SCRIM_LUMA + 0.05) };
      })
      .filter(({ ratio }) => ratio < WCAG_AA);

    expect(failures.map((f) => `${f.p.brand} ${f.p.name} ${f.ratio.toFixed(2)}:1`)).toEqual([]);
  });

  it('leaves a colour that already reads alone', () => {
    /**
     * The colour story stays honest: only illegible ink is touched. This is what
     * bounds the visual change to the swatches that were actually broken.
     *
     * What would make this fail: lifting unconditionally, which would wash every
     * callout toward white and lose the family's identity.
     */
    for (const hex of ['#ffffff', '#ff4d4d', '#7fd8ff']) {
      expect(contrastTint(hex, SCRIM_LUMA, WCAG_AA)).toBe(hex);
    }
  });
});

describe('the components consume the helpers', () => {
  const read = (rel: string) =>
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('node:fs').readFileSync(
      require('node:path').join(__dirname, '..', '..', rel),
      'utf8',
    ) as string;

  it('AuspexReveal no longer inks with a raw hex or a hard-coded black', () => {
    const source = read('components/miniscan/AuspexReveal.tsx');
    expect(source).toMatch(/contrastTint\(/);
    expect(source).toMatch(/readableInkOn\(/);
    // The chip's hard-coded ink, in both the inline style and the class.
    expect(source).not.toContain("color: isFocused ? '#000'");
    expect(source).not.toContain("isFocused ? 'text-black'");
  });
});
