import { describe, it, expect } from 'vitest';
import {
  frameState,
  sortRegionsForReveal,
  phaseAt,
  LOOP_FAINT_ALPHA,
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
    { role: 'shade', name: 'Shade', hex: '#222' },
    { role: 'highlight', name: 'Highlight', hex: '#333' },
    { role: 'wash', name: 'Wash', hex: '#444' },
  ],
  brand: 'Citadel',
  colourCount: 3,
  durationMs: 13000,
  captionPreset: 'colours',
};

describe('revealTimeline', () => {
  // Intent: the seam. The clip must dissolve back onto its own opening frame, so
  // frame 0's faint model and the loop target opacity must be the SAME constant.
  it('opens on the faint-model alpha that the loop dissolves back to', () => {
    const first = frameState(0, SPEC);
    expect(first.baseAlpha).toBeCloseTo(LOOP_FAINT_ALPHA, 5);
    expect(first.loopCrossfade).toBe(0);
    const last = frameState(SPEC.durationMs, SPEC);
    expect(last.loopCrossfade).toBeGreaterThan(0.99);
  });

  // Intent: t drives the clip, so the sweep must advance monotonically regardless
  // of how the render loop is sampled.
  it('sweep advances top→bottom monotonically', () => {
    const ys: number[] = [];
    for (let t = 0; t <= SPEC.durationMs; t += 100) {
      const s = frameState(t, SPEC).sweepY;
      if (s !== null) ys.push(s);
    }
    expect(ys.length).toBeGreaterThan(3);
    for (let i = 1; i < ys.length; i++) expect(ys[i]).toBeGreaterThanOrEqual(ys[i - 1]);
  });

  // Intent: regions reveal ONE BY ONE in a stable order — an out-of-order or
  // simultaneous bloom would look like a cheap all-at-once flash.
  it('reveals regions in array order (earlier region never lags a later one)', () => {
    // Sample mid-reveal where the stagger is visible.
    const mid = frameState(SPEC.durationMs * 0.4, SPEC);
    for (let i = 1; i < mid.regions.length; i++) {
      expect(mid.regions[i - 1].revealProgress).toBeGreaterThanOrEqual(mid.regions[i].revealProgress);
    }
    // All fully revealed by the end of the reveal phase.
    const done = frameState(SPEC.durationMs * 0.73, SPEC);
    done.regions.forEach((r) => expect(r.revealProgress).toBeGreaterThan(0.9));
  });

  // Intent: the recipe cascade fills in, never rewinds.
  it('recipe progress is monotonic and completes', () => {
    let prev = -1;
    for (let t = 0; t <= SPEC.durationMs; t += 100) {
      const p = frameState(t, SPEC).recipeProgress;
      expect(p).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = p;
    }
    expect(frameState(SPEC.durationMs * 0.93, SPEC).recipeProgress).toBeCloseTo(1, 2);
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

  it('phaseAt walks boot→sweep→reveal→recipe→plate', () => {
    expect(phaseAt(0)).toBe('boot');
    expect(phaseAt(0.15)).toBe('sweep');
    expect(phaseAt(0.5)).toBe('reveal');
    expect(phaseAt(0.85)).toBe('recipe');
    expect(phaseAt(1)).toBe('plate');
  });
});
