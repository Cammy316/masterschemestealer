import { describe, it, expect } from 'vitest';
import {
  frameState,
  regionSchedule,
  sortRegionsForReveal,
  phaseAt,
  HERO_SCALE,
  PHASE_FRACTIONS,
  PAYOFF_HOLD,
  type RevealSpec,
  type RevealRegion,
} from '../reveal/revealTimeline';

function region(index: number, y: number, percentage: number): RevealRegion {
  return { index, hex: '#00ff41', family: 'green', position: { x: 0.5, y }, percentage };
}

// Regions arrive already sorted (smallest coverage first — see sortRegionsForReveal).
const SPEC: RevealSpec = {
  skin: 'imperial',
  regions: [region(0, 0.2, 10), region(1, 0.5, 30), region(2, 0.8, 60)],
  recipe: [
    { role: 'base', name: 'Base', hex: '#111' },
    { role: 'highlight', name: 'Highlight', hex: '#333' },
    { role: 'shade', name: 'Shade', hex: '#222' },
    { role: 'wash', name: 'Wash', hex: '#444' },
  ],
  brand: 'Citadel',
  colourCount: 3,
  durationMs: 11000,
  captionPreset: 'colours',
  recipeRegionIndex: 2,
};

describe('revealTimeline', () => {
  // Intent: the hook. A feed viewer decides to scroll inside ~1.7 s, so frame 0
  // must be the painter's model in full colour, PUNCHED IN and MOVING — v2
  // opened on a small static product shot and it read as an ad.
  it('opens punched-in on the full-colour model WITH the recipe stamped', () => {
    const first = frameState(0, SPEC);
    expect(first.phase).toBe('proof');
    // proof-first: the finished answer is on screen before the question exists
    expect(first.proofAlpha).toBe(1);
    expect(first.heroAlpha).toBe(1);
    expect(first.baseAlpha).toBe(0);
    expect(first.camera.scale).toBeCloseTo(HERO_SCALE, 5);
    expect(first.heroGlow).toBeGreaterThan(0); // the backlight is on from frame 0
    expect(first.camera.rotationDeg).toBeCloseTo(0, 6); // rock phase 0 at t=0 (loop seam)
  });

  // Intent: the hero must MOVE — the pull-back and the rock are the visible
  // motion that stops the scroll, not a slow 1%-per-second drift.
  it('the hero visibly pulls back and rocks within the first half-second', () => {
    const early = frameState(400, SPEC);
    expect(early.camera.scale).toBeLessThan(HERO_SCALE - 0.01); // pulling back
    expect(Math.abs(early.camera.rotationDeg)).toBeGreaterThan(0.2); // rocking
    expect(early.heroAlpha).toBe(1); // still the full-colour model
  });

  // Intent: the seam. The clip must dissolve back onto its own opening frame —
  // scale, focus, box AND rotation all have to land exactly on frame 0's state
  // or the loop jump-cuts.
  it('lands the final frame back on the opening camera (the loop)', () => {
    const first = frameState(0, SPEC);
    const last = frameState(SPEC.durationMs, SPEC);
    expect(first.loopCrossfade).toBe(0);
    expect(last.loopCrossfade).toBeGreaterThan(0.99);
    expect(last.camera.scale).toBeCloseTo(first.camera.scale, 5);
    expect(last.camera.boxLerp).toBeCloseTo(first.camera.boxLerp, 5);
    expect(last.camera.focusX).toBeCloseTo(first.camera.focusX, 5);
    expect(last.camera.focusY).toBeCloseTo(first.camera.focusY, 5);
    expect(last.camera.rotationDeg).toBeCloseTo(first.camera.rotationDeg, 5);
  });

  // Intent: the first export ghosted labels and recipe chips through the loop
  // dissolve because they were still drawn under it. The HUD must be gone before
  // the crossfade carries any real weight.
  it('finishes the HUD fade BEFORE the dissolve starts at all', () => {
    // v4 let them overlap for ~0.26 s and the outgoing caption ghosted through
    // the incoming one. The old assertion only checked crossfade >= 0.5, so it
    // passed while the defect was on screen.
    for (let t = 0; t <= SPEC.durationMs; t += 10) {
      const s = frameState(t, SPEC);
      if (s.loopCrossfade > 0) expect(s.hudFade).toBeCloseTo(1, 5);
    }
    expect(frameState(SPEC.durationMs, SPEC).hudFade).toBeCloseTo(1, 5);
  });

  // Intent: t drives the clip, so the sweep must advance monotonically regardless
  // of how the render loop is sampled.
  it('sweep advances top→bottom monotonically', () => {
    const ys: number[] = [];
    for (let t = 0; t <= SPEC.durationMs; t += 50) {
      const s = frameState(t, SPEC).sweepY;
      if (s !== null) ys.push(s);
    }
    expect(ys.length).toBeGreaterThan(3);
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThanOrEqual(ys[i - 1]);
  });

  // Intent: the model lights up BEHIND the scan line — the sweep has to actually
  // do something to the model, not just slide a decorative bar over it.
  it('the scanned fraction tracks the sweep and stays lit afterwards', () => {
    expect(frameState(SPEC.durationMs * 0.15, SPEC).scanned).toBe(0); // pre-sweep
    const mid = frameState(SPEC.durationMs * 0.24, SPEC).scanned;
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
    expect(frameState(SPEC.durationMs * 0.5, SPEC).scanned).toBe(1);
  });

  // Intent: regions reveal ONE BY ONE in a stable order — an out-of-order or
  // simultaneous bloom would look like a cheap all-at-once flash.
  it('reveals regions in array order (earlier region never lags a later one)', () => {
    for (let t = 0; t <= SPEC.durationMs; t += 100) {
      const s = frameState(t, SPEC);
      for (let i = 1; i < s.regions.length; i++) {
        expect(s.regions[i - 1].revealProgress).toBeGreaterThanOrEqual(s.regions[i].revealProgress - 1e-9);
      }
    }
    // All fully revealed by the end of the reveal phase, so the recipe cascade
    // starts on a completely coloured model.
    const done = frameState(SPEC.durationMs * PHASE_FRACTIONS.revealEnd, SPEC);
    done.regions.forEach((r) => expect(r.revealProgress).toBeGreaterThan(0.99));
  });

  // Intent: region locks are evenly spaced and short — five in 2.0 s. An early
  // cut let the FIRST bloom run 2.6 s alone, right on the retention cliff.
  it('locks regions on a uniform, capped cadence', () => {
    const slots = regionSchedule(5);
    const capMs = 0.055 * 11000;
    for (let i = 0; i < slots.length; i++) {
      expect(slots[i].dur * 11000).toBeLessThanOrEqual(capMs);
      if (i > 0) {
        expect(slots[i].start).toBeGreaterThan(slots[i - 1].start);
        expect(slots[i].dur).toBeLessThanOrEqual(slots[i - 1].dur + 1e-9);
      }
    }
    const last = slots[slots.length - 1];
    expect(last.start + last.dur).toBeLessThanOrEqual(PHASE_FRACTIONS.revealEnd + 1e-9);
  });

  // Intent: the caption counts up as colours resolve (progression to watch)
  // instead of stating the total from second one.
  it('identified count climbs from 0 to every region', () => {
    expect(frameState(0, SPEC).identifiedCount).toBe(0);
    let prev = -1;
    for (let t = 0; t <= SPEC.durationMs; t += 50) {
      const c = frameState(t, SPEC).identifiedCount;
      expect(c).toBeGreaterThanOrEqual(prev);
      prev = c;
    }
    expect(frameState(SPEC.durationMs * PHASE_FRACTIONS.revealEnd, SPEC).identifiedCount).toBe(3);
  });

  // Intent: the recipe cascade fills in, never rewinds, and completes before the
  // brand plate arrives so the two never race.
  it('recipe progress is monotonic and completes before the plate', () => {
    let prev = -1;
    for (let t = 0; t <= SPEC.durationMs; t += 100) {
      const p = frameState(t, SPEC).recipeProgress;
      expect(p).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = p;
    }
    expect(frameState(SPEC.durationMs * PHASE_FRACTIONS.recipeEnd, SPEC).recipeProgress).toBeCloseTo(1, 5);
    expect(frameState(SPEC.durationMs * 0.89, SPEC).plateAlpha).toBeGreaterThan(0);
  });

  // Intent: determinism — same t, same state, no matter when it's called.
  it('is a pure function of (t, spec)', () => {
    const a = frameState(5000, SPEC);
    const b = frameState(5000, SPEC);
    expect(a).toEqual(b);
  });

  // Intent: quick wins escalate to the dominant colour igniting LAST as the
  // finale — v2 opened the reveal with the biggest region and sagged.
  it('sortRegionsForReveal orders smallest coverage first, dominant last', () => {
    const shuffled = [region(0, 0.2, 60), region(1, 0.5, 10), region(2, 0.8, 30)];
    expect(sortRegionsForReveal(shuffled).map((r) => r.index)).toEqual([1, 2, 0]);
  });

  it('breaks percentage ties by y then index', () => {
    const tied = [region(2, 0.8, 20), region(0, 0.2, 20), region(1, 0.5, 20)];
    expect(sortRegionsForReveal(tied).map((r) => r.index)).toEqual([0, 1, 2]);
  });

  it('phaseAt walks proof→smash→sweep→reveal→slam→recipe→plate', () => {
    expect(phaseAt(0)).toBe('proof');
    expect(phaseAt(0.2)).toBe('smash');
    expect(phaseAt(0.25)).toBe('sweep');
    expect(phaseAt(0.35)).toBe('reveal');
    expect(phaseAt(0.47)).toBe('slam');
    expect(phaseAt(0.7)).toBe('recipe');
    expect(phaseAt(1)).toBe('plate');
  });

  // Intent: the hook must be readable. Measured on a shipped export the proof was
  // on screen for 0.6 s — a headline plus four paint names is ~2 s of reading, so
  // the answer was shown and withheld before anyone could take it in.
  it('holds the proof for a readable two seconds', () => {
    expect(PHASE_FRACTIONS.proofEnd * SPEC.durationMs).toBeGreaterThanOrEqual(1900);
    expect(frameState(1800, SPEC).proofAlpha).toBe(1);
  });

  // Intent: the payoff — all four rows plus the coloured model — existed for only
  // 1.4 s of 11 on a shipped export, and it is the frame people screenshot.
  it('holds the complete payoff state for three seconds', () => {
    const from = PAYOFF_HOLD.start * SPEC.durationMs;
    const to = PAYOFF_HOLD.end * SPEC.durationMs;
    expect(to - from).toBeGreaterThanOrEqual(2900);
    for (let t = from; t <= to; t += 50) {
      const s = frameState(t, SPEC);
      expect(s.recipeProgress, `cascade incomplete at ${t}ms`).toBeCloseTo(1, 5);
      expect(s.hudFade, `HUD fading during the hold at ${t}ms`).toBe(0);
      s.regions.forEach((rg) => expect(rg.revealProgress).toBeGreaterThan(0.99));
    }
  });

  // Intent: 4.0 s of a shipped export was frame-identical. This guards the BUILD
  // — outside the deliberate payoff hold, the visible information must keep
  // changing. Camera drift is excluded deliberately: it mutates frameState every
  // frame and would make a naive assertion pass while the screen looked frozen.
  it('never goes 0.4s without an information change during the build', () => {
    const visible = (t: number) => {
      const s = frameState(t, SPEC);
      return JSON.stringify([
        s.phase,
        s.identifiedCount,
        Math.round(s.recipeProgress * 20),
        Math.round(s.plateAlpha * 20),
        Math.round(s.scanned * 20),
        Math.round(s.proofAlpha * 20),
        s.regions.map((r) => Math.round(r.revealProgress * 20)),
      ]);
    };
    const step = 1000 / 30;
    for (let t = 0; t < PAYOFF_HOLD.start * SPEC.durationMs - 400; t += step) {
      // proof hold is a deliberate readable pause, like the payoff hold
      if (t < PHASE_FRACTIONS.proofEnd * SPEC.durationMs) continue;
      expect(visible(t), `frozen for 0.4s at ${Math.round(t)}ms`).not.toBe(visible(t + 400));
    }
  });

  // Intent: the desaturation used to go 4.9 → 4.5 → 9.7 → 4.0, flashing the
  // colour model back one frame AFTER it had gone grey.
  it('the smash strobe decays monotonically — no isolated colour pop', () => {
    let prev = Infinity;
    for (let t = 0; t <= SPEC.durationMs * 0.25; t += 1000 / 30) {
      const a = frameState(t, SPEC).heroAlpha;
      expect(a, `hero alpha rose at ${Math.round(t)}ms`).toBeLessThanOrEqual(prev + 1e-9);
      prev = a;
    }
  });

  // Intent: the end card was on screen 0.5 s and never reached full opacity,
  // overlapping the rows fading beneath it. It is the only call to action.
  it('gives the end card a full second at full opacity on a clean frame', () => {
    const full: number[] = [];
    for (let t = 0; t <= SPEC.durationMs; t += 1000 / 30) {
      const s = frameState(t, SPEC);
      if (s.plateAlpha >= 0.999) {
        full.push(t);
        expect(s.hudFade, 'HUD still up under the end card').toBe(1);
      }
    }
    expect(full.length, 'end card never reaches full opacity').toBeGreaterThan(0);
    expect(full[full.length - 1] - full[0]).toBeGreaterThanOrEqual(900);
  });
});
