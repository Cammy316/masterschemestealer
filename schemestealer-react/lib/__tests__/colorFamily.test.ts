/**
 * Frontend half of the colour-family lock. Runs the SHARED golden fixtures
 * (authored under python-api/tests/) through the frontend `classifyFamily` and
 * asserts it equals the same `expected` the Python test asserts — so the offline
 * classifier and the backend classifier are proven identical in CI. The Stage B
 * targets assert the frontend reproduces the backend's *current* (still-wrong)
 * output exactly, locking parity even on the cases Stage B will later fix.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { classifyFamily } from '../offlineColorDetection';
import type { LAB } from '../colorConversion';

type Fixture = { hex: string; lab: [number, number, number]; expected: string;
                 metallic?: boolean; current?: string };

const load = (rel: string): Fixture[] =>
  JSON.parse(readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf-8'));

const FIXTURES = load('../../../python-api/tests/color_family_fixtures.json');
const TARGETS = load('../../../python-api/tests/color_family_stage_b_targets.json');

// Classify the canonical LAB stored in the fixture — the SAME value the Python
// test classifies — so backend and frontend are proven byte-identical (the
// rgb→lab path is matched to skimage separately, to ~6e-5 ΔE).
const family = (f: Fixture) => {
  const lab: LAB = { l: f.lab[0], a: f.lab[1], b: f.lab[2] };
  return classifyFamily(lab, undefined, !!f.metallic);
};

describe('colour-family golden fixtures (frontend === backend)', () => {
  it('covers the family space broadly', () => {
    expect(FIXTURES.length).toBeGreaterThanOrEqual(250);
  });

  for (const f of FIXTURES) {
    it(`${f.hex}${f.metallic ? '-m' : ''} → ${f.expected}`, () => {
      expect(family(f)).toBe(f.expected);
    });
  }
});

// Empty after Stage B (the nearest-exemplar classifier handles every edge case);
// kept so re-added targets are checked for exact cross-language parity.
describe.skipIf(TARGETS.length === 0)('Stage B targets (frontend matches backend)', () => {
  for (const f of TARGETS) {
    it(`${f.hex} === backend current '${f.current}'`, () => {
      expect(family(f)).toBe(f.current);
    });
  }
});
