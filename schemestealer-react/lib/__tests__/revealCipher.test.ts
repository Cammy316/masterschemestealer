import { describe, it, expect } from 'vitest';
import {
  CIPHER_MS,
  CIPHER_CLEARANCE_MS,
  PAYOFF_HOLD,
  PHASE_FRACTIONS,
  cipherBeats,
  frameState,
  nameCipherFraction,
} from '../reveal/revealTimeline';
import { garbleReveal, buildRevealSpec } from '../reveal/revealCompose';
import type { Color } from '../types';

const DURATION = 11000;

/** A 1x1 PNG. buildRevealSpec DROPS any colour without a mask, so a fixture
 *  that omits this silently yields fewer regions than it looks like it has —
 *  which is how a 15 ms beat collision at five regions went unnoticed. */
const MASK_1PX =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

function colour(i: number): Color {
  return {
    hex: ['#8B2E2E', '#3A5A8C', '#D9BE8A', '#1A1A1A', '#4A7C3F'][i],
    family: ['RED', 'BLUE', 'BONE', 'BLACK', 'GREEN'][i],
    percentage: 20,
    mask: MASK_1PX,
    position: { x: 0.4 + i * 0.05, y: 0.3 + i * 0.1 },
  } as unknown as Color;
}

const SPEC = buildRevealSpec(
  [0, 1, 2, 3, 4].map(colour),
  [
    { role: 'base', name: 'Mephiston Red', hex: '#8B2E2E', deltaE: 1.2 },
    { role: 'highlight', name: 'Evil Sunz Scarlet', hex: '#C0392B' },
    { role: 'shade', name: 'Nuln Oil', hex: '#141414' },
    { role: 'wash', name: 'Reikland Fleshshade', hex: '#7B3F1E' },
  ],
  'Citadel',
  'imperial',
  'colours',
  DURATION,
  0,
);

/**
 * The deterministic symbol cipher has run on region labels since v5. v5.3
 * extends it to the burned-in caption, the colour counter and the paint names.
 * These encode the rules that keep it a readable effect rather than noise.
 */
describe('reveal cipher — timing rules', () => {
  const beatsMs = cipherBeats(SPEC.regions.length, DURATION).map((f) => f * DURATION);

  // Guards the fixture itself. Five regions is the case where the last counter
  // tick collides with the phase change; a fixture that quietly produced four
  // would make every assertion below vacuous.
  it('the fixture really has five regions', () => {
    expect(SPEC.regions.length).toBe(5);
  });

  it('every burst lasts between 0.18 s and 0.22 s', () => {
    expect(CIPHER_MS).toBeGreaterThanOrEqual(180);
    expect(CIPHER_MS).toBeLessThanOrEqual(220);
  });

  // Intent: the whole point of a decrypt effect is the moment it RESOLVES. If
  // the next burst starts before the viewer has had a readable frame, the
  // readout just looks broken.
  it('each burst is readable before the next one starts', () => {
    for (let i = 1; i < beatsMs.length; i++) {
      const gap = beatsMs[i] - beatsMs[i - 1];
      expect(
        gap,
        `beats at ${Math.round(beatsMs[i - 1])}ms and ${Math.round(beatsMs[i])}ms are only ${Math.round(gap)}ms apart`,
      ).toBeGreaterThanOrEqual(CIPHER_MS + CIPHER_CLEARANCE_MS);
    }
  });

  // Intent: a hold exists so the viewer can READ. Scrambling text inside one
  // defeats the only thing the hold is for.
  it('never fires inside the proof hold or the payoff hold', () => {
    for (const f of cipherBeats(SPEC.regions.length, DURATION)) {
      const endF = f + CIPHER_MS / DURATION;
      expect(f, `burst starts inside the proof hold at ${Math.round(f * DURATION)}ms`).toBeGreaterThan(
        PHASE_FRACTIONS.proofEnd,
      );
      const inPayoff = endF > PAYOFF_HOLD.start && f < PAYOFF_HOLD.end;
      expect(inPayoff, `burst overlaps the payoff hold at ${Math.round(f * DURATION)}ms`).toBe(false);
    }
  });

  // Intent: the loop target IS frameState(0). A burst at frame 0 would render
  // the opening caption as glyphs in the dissolve target and break the seam.
  it('frame 0 is fully resolved', () => {
    expect(frameState(0, SPEC).captionResolve).toBe(1);
    expect(frameState(DURATION, SPEC).captionResolve).toBe(1);
  });

  // Intent: the paint names decrypt as their row lands, and must be readable
  // well before the next row arrives — the cascade is the tightest cadence in
  // the clip and is what sets CIPHER_MS.
  it('a paint name resolves with clearance before the next row lands', () => {
    const steps = SPEC.recipe.length;
    const cascadeMs = (0.5818 - PHASE_FRACTIONS.slamEnd) * DURATION;
    const rowSpanMs = cascadeMs / steps;
    const resolveMs = nameCipherFraction(DURATION, steps) * rowSpanMs;
    expect(resolveMs, 'name cipher is outside the 0.18–0.22 s window').toBeGreaterThanOrEqual(179);
    expect(resolveMs).toBeLessThanOrEqual(221);
    expect(
      rowSpanMs - resolveMs,
      `only ${Math.round(rowSpanMs - resolveMs)}ms of readable time before the next row`,
    ).toBeGreaterThanOrEqual(CIPHER_CLEARANCE_MS);
  });
});

describe('reveal cipher — the substitution itself', () => {
  // Intent: this is a colour-accuracy product. A cipher that could momentarily
  // spell a DIFFERENT real paint name would be the app appearing to recommend
  // something it did not measure. Symbols only makes that impossible.
  it('never emits a letter or digit that is not in the final text', () => {
    for (const p of [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) {
      const out = garbleReveal('MEPHISTON RED', p);
      const final = 'MEPHISTON RED';
      for (let i = 0; i < out.length; i++) {
        if (/[A-Z0-9]/.test(out[i])) {
          expect(out[i], `position ${i} at progress ${p} shows a letter that is not the real one`).toBe(final[i]);
        }
      }
    }
  });

  it('keeps the width fixed so nothing reflows while decrypting', () => {
    for (const p of [0, 0.25, 0.5, 0.75, 1]) {
      expect(garbleReveal('REIKLAND FLESHSHADE', p)).toHaveLength('REIKLAND FLESHSHADE'.length);
    }
  });

  // Intent: deterministic. A Math.random() cipher would make two exports of the
  // same scan different files, and would make the loop seam a coin flip.
  it('is deterministic', () => {
    expect(garbleReveal('NULN OIL', 0.4)).toBe(garbleReveal('NULN OIL', 0.4));
  });

  it('is fully resolved at progress 1', () => {
    expect(garbleReveal('EVIL SUNZ SCARLET', 1)).toBe('EVIL SUNZ SCARLET');
  });
});
