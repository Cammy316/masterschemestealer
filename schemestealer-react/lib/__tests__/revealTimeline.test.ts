import { describe, it, expect } from 'vitest';
import {
  frameState,
  regionSchedule,
  sortRegionsForReveal,
  phaseAt,
  HERO_SCALE,
  PHASE_FRACTIONS,
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
    expect(frameState(SPEC.durationMs * 0.05, SPEC).scanned).toBe(0); // pre-sweep
    const mid = frameState(SPEC.durationMs * 0.14, SPEC).scanned;
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

  // Intent: v2 let the FIRST bloom run 2.6 s alone — right on the 3–6 s
  // retention cliff. Blooms are capped and never slower than their predecessor,
  // and the last one still finishes exactly on the phase boundary.
  it('caps bloom length and keeps the stagger accelerating', () => {
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
    expect(phaseAt(0.08)).toBe('smash');
    expect(phaseAt(0.15)).toBe('sweep');
    expect(phaseAt(0.3)).toBe('reveal');
    expect(phaseAt(0.42)).toBe('slam');
    expect(phaseAt(0.7)).toBe('recipe');
    expect(phaseAt(1)).toBe('plate');
  });
});
