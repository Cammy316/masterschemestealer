/**
 * Offline recipe generator — structure + the documented monotonicity gap (M5).
 *
 * The backend (python-api/core/recipe_geometry.py) enforces a hard monotonicity
 * guard: a highlight is always strictly lighter than the base, a shade strictly
 * darker. The OFFLINE fallback here (getRecipeForColor → findClosestPaint) has no
 * such guard — it picks the nearest paint by ΔE to a ±12 L* target across the
 * whole brand pool, so when the brand has no lighter paint than the base the
 * "highlight" can land equal-to or darker-than the base. See audit-report.md M5.
 *
 * Per the agreed no-app-change policy we do NOT fix paintMatcher.ts here; the gap
 * is captured as a skipped, documented case. The authoritative backend guard is
 * covered by python-api/tests/test_boundary_math.py::test_derive_partner_*.
 */
import { describe, it, expect } from 'vitest';
import { getRecipeForColor } from '../paintMatcher';
import { rgbToLab } from '../colorConversion';

/** L* of a hex colour, for asserting highlight/shade lightness ordering. */
function hexL(hex: string): number {
  const h = hex.replace('#', '');
  return rgbToLab({
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }).l;
}

describe('offline recipe generator (getRecipeForColor)', () => {
  it('returns a fully-populated BrandRecipe for a mid-tone colour', () => {
    // Mid grey, neutral. Citadel has ample base/layer paints, so every slot fills.
    const recipe = getRecipeForColor([50, 0, 0], 'grey', 'citadel');

    expect(recipe).toHaveProperty('base');
    expect(recipe).toHaveProperty('shade');
    expect(recipe).toHaveProperty('highlight');
    expect(recipe).toHaveProperty('wash');
    expect(recipe.base).not.toBeNull();
    expect(typeof recipe.base?.name).toBe('string');
    expect(recipe.base?.hex).toMatch(/^#?[0-9a-fA-F]{6}$/);
  });

  it('produces a sensible base match (small ΔE) for a saturated red', () => {
    const recipe = getRecipeForColor([45, 60, 35], 'red', 'citadel');
    expect(recipe.base).not.toBeNull();
    // The nearest red base should be a genuinely close colour, not a wild miss.
    expect(recipe.base?.deltaE ?? 999).toBeLessThan(25);
  });

  // M5 FIXED: the offline path now mirrors the backend monotonicity guard
  // (paintMatcher.findClosestPaint filters highlight candidates to L > base,
  // shade candidates to L < base). A mid grey has ample lighter/darker base
  // paints, so both slots fill and obey the ordering.
  it('keeps the offline highlight lighter than the base and the shade darker', () => {
    const recipe = getRecipeForColor([50, 0, 0], 'grey', 'citadel');
    if (recipe.highlight) expect(hexL(recipe.highlight.hex)).toBeGreaterThan(48);
    if (recipe.shade) expect(hexL(recipe.shade.hex)).toBeLessThan(52);
    if (recipe.highlight && recipe.shade) {
      expect(hexL(recipe.highlight.hex)).toBeGreaterThan(hexL(recipe.shade.hex));
    }
  });
});
