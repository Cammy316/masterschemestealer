"""
PaintMatcher contract tests (Phase 0 of the colour-science overhaul).

These pin the behavioural contract the rest of the app relies on:

  * Family gate: base/highlight candidates are restricted to the detected
    family + adjacent families; an empty gated pool returns None (an honest
    "No match found"), never a far-off cross-family paint.
  * Metallic gate: the DB `metallic` flag is the single metallic decision —
    a metallic target only matches metallic paints (falling back to the
    unrestricted pool when a brand stocks none); a non-metallic target never
    receives a metallic paint.
  * ΔE ceiling: a best match beyond CIEDE2000 30 is noise, not a
    recommendation — the slot returns None.
  * Deduplication: match_top_n never returns two same-brand paints within
    ΔE 2 of each other.
  * Transparency penalty: with colour equal, the more opaque paint wins the
    dominant role (contrast/transparent paints make poor basecoats).

conftest.py stubs cv2; nothing in the matcher path needs the real library.
"""

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.color_engine import (  # noqa: E402
    Paint, PaintMatcher, BASE_MATCH_DELTA_E_CEILING, TRANSPARENCY_PENALTY,
)
from core.colour_maths import ciede2000_single, rgb_to_lab  # noqa: E402

BRAND = "TestBrand"


def _paint(name: str, lab, family: str = "red", *, metallic: bool = False,
           transparency: float = 0.0, category: str = "layer") -> Paint:
    """A synthetic paint with an exact LAB (via measured_lab)."""
    p = Paint(name=name, brand=BRAND, hex="#808080", type=category,
              color_family=family, metallic=metallic,
              transparency=transparency, paint_id=name,
              measured_lab=[float(lab[0]), float(lab[1]), float(lab[2])])
    p.compute_properties()
    return p


def _lab_on_ray(origin, direction, want_de: float, tol: float = 0.3):
    """Walk a ray from `origin` until CIEDE2000 to the walked point ≈ want_de.

    Bisection over the ray parameter; CIEDE2000 is monotone along a fixed ray
    at these scales, and the achieved distance is asserted as a precondition so
    the test can never silently drift.
    """
    o = np.asarray(origin, dtype=float)
    d = np.asarray(direction, dtype=float)
    d = d / np.linalg.norm(d)
    lo, hi = 0.0, 300.0
    for _ in range(80):
        mid = (lo + hi) / 2.0
        if ciede2000_single(o, o + mid * d) < want_de:
            lo = mid
        else:
            hi = mid
    cand = o + ((lo + hi) / 2.0) * d
    achieved = ciede2000_single(o, cand)
    assert achieved == pytest.approx(want_de, abs=tol), (
        f"ray construction failed: wanted ΔE {want_de}, got {achieved}")
    return tuple(cand)


# A reddish scan target used throughout. lab derived exactly as match_color
# derives it (skimage rgb2lab), so raw distances in the tests match the
# matcher's internal distances.
TARGET_RGB = np.array([150.0, 60.0, 60.0])
TARGET_LAB = tuple(rgb_to_lab(TARGET_RGB))


# ---------------------------------------------------------------------------
# Family gate
# ---------------------------------------------------------------------------

def test_family_gate_empty_pool_returns_none():
    """A brand whose only paints live in a non-adjacent family must yield an
    honest None for a red target — never a cross-family recommendation."""
    matcher = PaintMatcher([_paint("blue-1", (45.0, 5.0, -40.0), family="blue")])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              target_family="red")
    assert got is None


def test_family_gate_admits_adjacent_family():
    """Orange is adjacent to red — with no red paint in the brand, a close
    orange paint is a legitimate base match."""
    orange = _paint("orange-1", _lab_on_ray(TARGET_LAB, (1.0, 0.5, 1.0), 8.0),
                    family="orange")
    matcher = PaintMatcher([orange])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              target_family="red")
    assert got is orange


# ---------------------------------------------------------------------------
# Metallic gate (DB flag is the single source of truth)
# ---------------------------------------------------------------------------

def test_metallic_target_prefers_metallic_pool():
    """A metallic scan restricts to metallic-flagged paints even when a
    non-metallic paint is colorimetrically closer."""
    near_matte = _paint("matte-close", _lab_on_ray(TARGET_LAB, (1, 0, 0), 3.0))
    far_metal = _paint("metal-far", _lab_on_ray(TARGET_LAB, (1, 0, 0), 15.0),
                       metallic=True)
    matcher = PaintMatcher([near_matte, far_metal])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              context={"is_metallic": True}, target_family="red")
    assert got is far_metal


def test_non_metallic_target_never_gets_metallic_paint():
    """The reverse gate: a matte scan must exclude metallic paints even when
    the metallic is the nearest colour."""
    near_metal = _paint("metal-close", _lab_on_ray(TARGET_LAB, (1, 0, 0), 3.0),
                        metallic=True)
    far_matte = _paint("matte-far", _lab_on_ray(TARGET_LAB, (1, 0, 0), 15.0))
    matcher = PaintMatcher([near_metal, far_matte])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              context={"is_metallic": False}, target_family="red")
    assert got is far_matte


def test_metallic_target_falls_back_when_brand_has_no_metallics():
    """A brand with zero metallic paints still returns its best matte paint
    for a metallic target (fallback documented in match_color) — not None."""
    matte = _paint("matte-only", _lab_on_ray(TARGET_LAB, (1, 0, 0), 5.0))
    matcher = PaintMatcher([matte])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              context={"is_metallic": True}, target_family="red")
    assert got is matte


# ---------------------------------------------------------------------------
# ΔE ceiling
# ---------------------------------------------------------------------------

def test_ceiling_far_match_returns_none():
    """The best in-family paint sits beyond the ΔE-30 ceiling — the slot must
    report None instead of a misleading recommendation."""
    far = _paint("red-far",
                 _lab_on_ray(TARGET_LAB, (0.5, 1.0, 0.3),
                             BASE_MATCH_DELTA_E_CEILING + 10.0))
    matcher = PaintMatcher([far])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              target_family="red")
    assert got is None


def test_ceiling_gates_candidates_before_ranking():
    """The ΔE ceiling is a candidacy condition, so it must remove candidates
    BEFORE penalties reorder them (audit F4, fixed in Phase 1).

    Why it matters: the user sees "No match found" although a legitimate
    match exists in the brand. Candidate A (raw ΔE≈29, transparent) is within
    the ceiling; candidate B (raw ΔE≈31, opaque) is not. The matcher must
    return A."""
    lab_a = _lab_on_ray(TARGET_LAB, (0.5, 1.0, 0.3), 29.0)
    lab_b = _lab_on_ray(TARGET_LAB, (0.7, 0.8, -0.2), 31.0)
    paint_a = _paint("A-within-ceiling", lab_a, transparency=1.0)
    paint_b = _paint("B-beyond-ceiling", lab_b, transparency=0.0)

    # Preconditions that make this the F4 geometry: A within ceiling, B beyond,
    # and B's penalised score beats A's (raw_B < raw_A + penalty).
    raw_a = ciede2000_single(TARGET_LAB, lab_a)
    raw_b = ciede2000_single(TARGET_LAB, lab_b)
    assert raw_a <= BASE_MATCH_DELTA_E_CEILING < raw_b
    assert raw_b < raw_a + 1.0 * TRANSPARENCY_PENALTY

    matcher = PaintMatcher([paint_a, paint_b])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              target_family="red")
    assert got is paint_a, (
        f"expected the within-ceiling paint, got "
        f"{got.name if got else None}")


# ---------------------------------------------------------------------------
# Transparency penalty & deduplication
# ---------------------------------------------------------------------------

def test_transparency_penalty_prefers_opaque_for_dominant():
    """Two paints at the same colour distance: the opaque one must win the
    dominant slot — transparent paint makes a poor basecoat."""
    lab = _lab_on_ray(TARGET_LAB, (1, 0, 0), 5.0)
    transparent = _paint("transparent", lab, transparency=0.8)
    opaque = _paint("opaque", (lab[0], lab[1] + 0.01, lab[2]), transparency=0.0)
    matcher = PaintMatcher([transparent, opaque])
    got = matcher.match_color(TARGET_RGB, BRAND, role="dominant",
                              target_family="red")
    assert got is opaque


def test_match_top_n_deduplicates_same_brand_near_twins():
    """Two same-brand paints within ΔE 2 of each other are duplicates from the
    painter's point of view — only one may appear in the top-N list."""
    twin_a = _paint("twin-a", (45.0, 40.0, 25.0))
    twin_b = _paint("twin-b", (45.5, 40.5, 25.0))       # ΔE << 2 from twin_a
    distinct = _paint("distinct", (60.0, 30.0, 40.0))
    assert ciede2000_single(twin_a.lab, twin_b.lab) < 2.0  # precondition

    matcher = PaintMatcher([twin_a, twin_b, distinct])
    results = matcher.match_top_n(np.asarray(TARGET_LAB), brand=BRAND,
                                  role="dominant", n=5)
    names = [p.name for p, _ in results]
    assert len(results) == 2
    assert "distinct" in names
    assert not {"twin-a", "twin-b"}.issubset(set(names))
