/**
 * DEC-2 — the "Estimated colour" marker's gate.
 *
 * 96 of 1,312 paints have no measured colour; their LAB is inferred, and 71% of
 * those share a hex with another assumed record. The card marks them rather than
 * presenting an estimate with the same confidence as a photographed swatch. This
 * qualifies a number, it does not hide one (invariant 10).
 *
 * The backend half — `color_source` reaching the served paint dict at all — is
 * gated by `python-api/tests/test_served_provenance.py`. This file gates the
 * rule the card applies to it, which is the half that is easy to get subtly
 * wrong in a way no reviewer would notice.
 */

import { describe, it, expect } from 'vitest';
import {
  shouldShowEstimatedColour,
  ESTIMATED_COLOUR_LABEL,
  ESTIMATED_COLOUR_TOOLTIP,
} from '../paintProvenance';

describe('DEC-2 — shouldShowEstimatedColour', () => {
  it('marks a paint whose colour was never measured', () => {
    // FAILS IF: the gate is inverted or the sentinel value changes. This is the
    // 96-paint population — in practice the wash row on essentially every scan.
    expect(shouldShowEstimatedColour('assumed')).toBe(true);
  });

  it('does not mark a measured paint', () => {
    // FAILS IF: the gate returns true for everything — which would put the
    // marker on all four slots of every recipe and make it meaningless.
    expect(shouldShowEstimatedColour('swatch-median')).toBe(false);
  });

  it('does not mark a paint with no provenance at all', () => {
    // The offline path ships no `color_source` (lib/paintDatabase.ts has no such
    // field), so every offline paint arrives undefined.
    //
    // FAILS IF: the gate is written as `colorSource !== 'swatch-median'` — the
    // obvious-looking inversion, which reads identically on the two cases above
    // and would then mark all four slots of every OFFLINE scan. An unknown
    // provenance is not evidence of an estimate.
    expect(shouldShowEstimatedColour(undefined)).toBe(false);
    expect(shouldShowEstimatedColour('')).toBe(false);
  });

  it('is not a rule about the wash slot', () => {
    // The rule that would be right today by accident. Every assumed record in
    // the DB is a wash/shade/ink, so a category-keyed marker agrees with this
    // one on all 1,312 paints right now — and breaks the moment a wash is
    // measured, which is what the accuracy roadmap intends to do.
    //
    // FAILS IF: someone re-implements the gate as `step.key === 'wash'`. A
    // measured wash must NOT be marked, and an assumed paint must be marked
    // whatever slot it lands in.
    expect(shouldShowEstimatedColour('swatch-median')).toBe(false); // a measured wash
    expect(shouldShowEstimatedColour('assumed')).toBe(true);        // an assumed anything
  });

  it('states the copy once, in British English', () => {
    // FAILS IF: the chip and its tooltip drift apart, or American spelling
    // creeps in (invariant 6).
    expect(ESTIMATED_COLOUR_LABEL).toBe('Estimated colour');
    expect(ESTIMATED_COLOUR_LABEL).not.toMatch(/color/i);
    expect(ESTIMATED_COLOUR_TOOLTIP).toContain('estimated');
    expect(ESTIMATED_COLOUR_TOOLTIP).toContain('not measured');
    expect(ESTIMATED_COLOUR_TOOLTIP).not.toMatch(/\bcolor\b/);
  });
});
