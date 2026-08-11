import { describe, it, expect } from 'vitest';
import {
  buildImpulse,
  mulberry32,
  noteHz,
  scaleHz,
  SCALES,
  BELL_PARTIALS,
  GLASS_PARTIALS,
} from '../reveal/revealAudioEngine';

/**
 * The engine's MATHS is tested here rather than its nodes: an AudioBuffer needs
 * an AudioContext, a Float32Array does not, so the impulse generator and the
 * pitch helpers were split out to be checkable without a browser. The nodes
 * themselves are covered by the measured audio gates in the Playwright suites.
 */

describe('mulberry32', () => {
  // Intent: the loudness gates sit within ~0.3 dB of their thresholds, so an
  // unseeded generator could flip one at random. A test that fails randomly
  // teaches people to re-run until green, which is worse than no test.
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 50; i++) expect(a()).toBe(b());
  });

  it('gives different streams for different seeds', () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    expect(a()).not.toBe(b());
  });

  it('stays in [0,1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 500; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('noteHz / scaleHz', () => {
  it('an octave is exactly double', () => {
    expect(noteHz(110, 12)).toBeCloseTo(220, 6);
    expect(noteHz(110, -12)).toBeCloseTo(55, 6);
  });

  it('a fifth is the tempered 1.4983 ratio', () => {
    expect(noteHz(100, 7) / 100).toBeCloseTo(1.498307, 5);
  });

  // Intent: pitches used to be arbitrary Hz (`96 + i * 5`), so nothing agreed
  // with anything. Every pitched element now comes from a scale, and walking
  // past the end of one must land in the next octave rather than wrapping to
  // the tonic.
  it('walks into the next octave instead of repeating the tonic', () => {
    const s = SCALES.warp;
    const top = scaleHz(s, s.degrees.length - 1);
    const next = scaleHz(s, s.degrees.length);
    expect(next).toBeGreaterThan(top);
    expect(next).toBeCloseTo(s.root * 2, 4);
  });

  it('handles negative degrees', () => {
    const s = SCALES.imperial;
    expect(scaleHz(s, -1)).toBeLessThan(scaleHz(s, 0));
  });

  it('gives each skin its own key', () => {
    expect(SCALES.imperial.root).not.toBe(SCALES.warp.root);
    expect(SCALES.imperial.degrees).toContain(3); // minor third — D minor
    expect(SCALES.warp.degrees).toContain(4); // major third — A major
  });
});

describe('buildImpulse', () => {
  const rnd = () => 0.75; // constant input: isolates the envelope from the noise

  it('is the requested length', () => {
    expect(buildImpulse(1000, 3, 0.5, rnd)).toHaveLength(1000);
  });

  // Intent: this IS the reverb. A tail that does not decay is a wash that never
  // ends; one that decays instantly is no reverb at all.
  it('decays monotonically to silence', () => {
    const ir = buildImpulse(4000, 3, 1, rnd);
    const head = Math.abs(ir[50]);
    const mid = Math.abs(ir[2000]);
    const tail = Math.abs(ir[3990]);
    expect(head).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(tail);
    expect(tail).toBeLessThan(head * 0.05);
  });

  it('decays faster at a higher exponent', () => {
    const slow = buildImpulse(4000, 2, 1, rnd);
    const fast = buildImpulse(4000, 6, 1, rnd);
    expect(Math.abs(fast[2000])).toBeLessThan(Math.abs(slow[2000]));
  });

  // Intent: `tone` is the difference between a dark hall and a bright plate. A
  // low coefficient must actually remove high frequencies, which shows up as a
  // smaller sample-to-sample change.
  it('a lower tone produces a smoother, darker impulse', () => {
    const noise = mulberry32(9);
    const bright = buildImpulse(2000, 3, 1, mulberry32(9));
    void noise;
    const dark = buildImpulse(2000, 3, 0.05, mulberry32(9));
    const roughness = (a: Float32Array) => {
      let s = 0;
      for (let i = 1; i < a.length; i++) s += Math.abs(a[i] - a[i - 1]);
      return s;
    };
    expect(roughness(dark)).toBeLessThan(roughness(bright));
  });

  it('is deterministic for a given seed', () => {
    const a = buildImpulse(500, 3, 0.4, mulberry32(5));
    const b = buildImpulse(500, 3, 0.4, mulberry32(5));
    expect(Array.from(a)).toEqual(Array.from(b));
  });
});

describe('partial sets', () => {
  // Intent: a bell is inharmonic. If these ratios ever become integers the
  // result is an organ, not struck metal — the whole "sacred machine" character
  // rests on this.
  it('bell partials are inharmonic', () => {
    const nonInteger = BELL_PARTIALS.filter((p) => Math.abs(p - Math.round(p)) > 0.05);
    expect(nonInteger.length).toBeGreaterThanOrEqual(4);
  });

  it('bell partials include the minor-third hum below the strike tone', () => {
    expect(BELL_PARTIALS[0]).toBeLessThan(1);
  });

  it('glass partials are sparser and start at the fundamental', () => {
    expect(GLASS_PARTIALS[0]).toBe(1);
    expect(GLASS_PARTIALS.length).toBeLessThan(BELL_PARTIALS.length);
  });
});
