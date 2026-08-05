import { describe, it, expect } from 'vitest';
import {
  frameState,
  regionSchedule,
  sortRegionsForReveal,
  phaseAt,
  PHASE_FRACTIONS,
  type RevealSpec,
  type RevealRegion,
} from '../reveal/revealTimeline';

function region(index: number, y: number): RevealRegion {
  return { index, hex: '#00ff41', family: 'green', position: { x: 0.5, y } };
}

const SPEC: RevealSpec = {
  skin: 'imperial',
  regions: [region(0, 0.2), region(1, 0.5), region(2, 0.8)],
  recipe: [
    { role: 'base', name: 'Base', hex: '#111' },
    { role: 'highlight', name: 'Highlight', hex: '#333' },
    { role: 'shade', name: 'Shade', hex: '#222' },
    { role: 'wash', name: 'Wash', hex: '#444' },
  ],
  brand: 'Citadel',
  colourCount: 3,
  durationMs: 13000,
  captionPreset: 'colours',
  recipeRegionIndex: 0,
};

describe('revealTimeline', () => {
  // Intent: the hook. A feed viewer decides to scroll inside ~2.5 s, so the
  // payoff — the painter's actual model in full colour — must be on screen from
  // the first frame. The clip used to open on a near-black greyscale blob.
  it('opens on the full-colour model, not the greyscale one', () => {
    const first = frameState(0, SPEC);
    expect(first.phase).toBe('hero');
    expect(first.heroAlpha).toBe(1);
    expect(first.baseAlpha).toBe(0);
    // and it is still the hero well inside the scroll-decision window
    expect(frameState(800, SPEC).heroAlpha).toBeGreaterThan(0);
  });

  // Intent: the seam. The clip must dissolve back onto its own opening frame, so
  // the last frame's camera has to match frame 1's exactly — otherwise the loop
  // jump-cuts on a size change.
  it('lands the final frame back on the opening framing (the loop)', () => {
    const first = frameState(0, SPEC);
    const last = frameState(SPEC.durationMs, SPEC);
    expect(first.loopCrossfade).toBe(0);
    expect(last.loopCrossfade).toBeGreaterThan(0.99);
    expect(last.camera.scale).toBeCloseTo(first.camera.scale, 5);
    expect(last.camera.boxLerp).toBeCloseTo(first.camera.boxLerp, 5);
    expect(last.camera.focusX).toBeCloseTo(first.camera.focusX, 5);
    expect(last.camera.focusY).toBeCloseTo(first.camera.focusY, 5);
  });

  // Intent: the first export ghosted labels and recipe chips through the loop
  // dissolve because they were still drawn under it. The HUD must be gone before
  // the crossfade carries any real weight.
  it('fades the HUD out before the dissolve is half-way', () => {
    for (let t = 0; t <= SPEC.durationMs; t += 25) {
      const s = frameState(t, SPEC);
      if (s.loopCrossfade >= 0.5) expect(s.hudFade).toBeCloseTo(1, 5);
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
    expect(frameState(SPEC.durationMs * 0.1, SPEC).scanned).toBe(0); // pre-sweep
    const mid = frameState(SPEC.durationMs * 0.17, SPEC).scanned;
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

  // Intent: a metronome reveal sags in the middle. Later regions land quicker so
  // the clip keeps gaining pace toward the recipe.
  it('accelerates: each bloom is shorter than the one before it', () => {
    const slots = regionSchedule(5);
    for (let i = 1; i < slots.length; i++) {
      expect(slots[i].dur).toBeLessThan(slots[i - 1].dur);
      expect(slots[i].start).toBeGreaterThan(slots[i - 1].start);
    }
    // the last bloom still finishes exactly on the phase boundary
    const last = slots[slots.length - 1];
    expect(last.start + last.dur).toBeCloseTo(PHASE_FRACTIONS.revealEnd, 6);
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
    expect(frameState(SPEC.durationMs * 0.91, SPEC).plateAlpha).toBeGreaterThan(0);
  });

  // Intent: determinism — same t, same state, no matter when it's called.
  it('is a pure function of (t, spec)', () => {
    const a = frameState(5000, SPEC);
    const b = frameState(5000, SPEC);
    expect(a).toEqual(b);
  });

  it('sortRegionsForReveal orders by y then index', () => {
    const shuffled = [region(2, 0.8), region(0, 0.2), region(1, 0.5)];
    expect(sortRegionsForReveal(shuffled).map((r) => r.index)).toEqual([0, 1, 2]);
  });

  it('phaseAt walks hero→snap→sweep→reveal→recipe→plate', () => {
    expect(phaseAt(0)).toBe('hero');
    expect(phaseAt(0.1)).toBe('snap');
    expect(phaseAt(0.18)).toBe('sweep');
    expect(phaseAt(0.5)).toBe('reveal');
    expect(phaseAt(0.8)).toBe('recipe');
    expect(phaseAt(1)).toBe('plate');
  });
});
