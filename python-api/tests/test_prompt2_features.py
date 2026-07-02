"""
Unit tests for Prompt 2 features:
  - matchable filter in PaintMatcher.__init__
  - role-based candidate filtering (ROLE_CATEGORIES)
  - bidirectional metallic finish gate
  - transparency penalty
  - top-N deduplication within ΔE 2.0
"""

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.color_engine import (
    Paint,
    PaintMatcher,
    ROLE_CATEGORIES,
    TRANSPARENCY_PENALTY,
)


# ---------------------------------------------------------------------------
# Helpers to build test Paint objects without needing paints_groundtruth.json
# ---------------------------------------------------------------------------

def _make_paint(name, brand, category, finish="matte", transparency=0.0,
                lab=(50.0, 0.0, 0.0), matchable=True, discontinued=False,
                metallic=False):
    """Construct a Paint with precomputed lab — bypasses hex parsing."""
    p = Paint(
        name=name,
        brand=brand,
        hex="#808080",
        type=category.lower(),
        category=category.lower(),
        finish=finish.lower(),
        transparency=transparency,
        matchable=matchable,
        discontinued=discontinued,
        metallic=metallic,
    )
    # Inject precomputed colour properties directly
    p.lab = np.array(lab, dtype=float)
    p.rgb = np.array([0.5, 0.5, 0.5])
    p.hsv = np.array([0.0, 0.0, 0.5])
    p.saturation = 0.0
    p.brightness = 0.5
    p.chroma = 0.0
    return p


# Neutral grey target — L=50, a=0, b=0
TARGET_RGB = np.array([128, 128, 128], dtype=np.uint8)
TARGET_LAB = np.array([50.0, 0.0, 0.0])

# Six paints, all Citadel, covering every test scenario
_DB = [
    # dominant-role (base/layer/air), opaque — deltaE from target ≈ 10
    _make_paint("Opaque Base",   "Citadel", "base",     lab=(60.0, 0.0, 0.0)),
    # dominant-role, contrast (transparent) — deltaE ≈ 7, penalty=5.6 → effective 12.6
    _make_paint("Close Contrast","Citadel", "contrast", transparency=0.7, lab=(57.0, 0.0, 0.0)),
    # dominant-role, contrast — deltaE ≈ 0, penalty=5.6 → effective 5.6 (beats opaque @ 10)
    _make_paint("Exact Contrast","Citadel", "contrast", transparency=0.7, lab=(50.0, 0.0, 0.0)),
    # shade-role — wash
    _make_paint("Wash",          "Citadel", "wash",      lab=(40.0, 0.0, 0.0)),
    # shade-role — ink
    _make_paint("Ink",           "Citadel", "ink",       lab=(45.0, 0.0, 0.0)),
    # metallic base paint (metallic-ness carried by the flag, not finish)
    _make_paint("Gold Metal",    "Citadel", "base",      metallic=True, lab=(55.0, 5.0, 25.0)),
    # unmatchable paint — must be excluded from index
    _make_paint("Bad Code",      "Citadel", "base",      matchable=False,   lab=(50.5, 0.0, 0.0)),
]


@pytest.fixture(scope="module")
def matcher():
    return PaintMatcher(_DB)


# ============================================================================
# matchable filter
# ============================================================================

def test_matchable_filter_excludes_unmatchable(matcher):
    """PaintMatcher.__init__ must exclude matchable=False paints from the index."""
    names = {p.name for p in matcher.paint_db}
    assert "Bad Code" not in names, (
        "Unmatchable paint 'Bad Code' is in the matcher index — should have been excluded"
    )
    assert "Opaque Base" in names


def test_matchable_filter_count(matcher):
    expected = sum(1 for p in _DB if p.matchable)
    assert len(matcher.paint_db) == expected


# ============================================================================
# role-based candidate filtering
# ============================================================================

def test_role_dominant_excludes_wash(matcher):
    """dominant role must not return a wash/shade/ink paint."""
    result = matcher.match_color(TARGET_RGB, "Citadel", role="dominant",
                                 context={"metallic_score": 0.0})
    assert result is not None
    assert result.type.lower() in ROLE_CATEGORIES["dominant"], (
        f"dominant match returned type {result.type!r}, expected one of "
        f"{ROLE_CATEGORIES['dominant']}"
    )


def test_role_shade_returns_wash_or_contrast(matcher):
    """shade role must return a wash/ink/contrast, not a base paint."""
    result = matcher.match_color(TARGET_RGB, "Citadel", role="shade")
    assert result is not None
    assert result.type.lower() in ROLE_CATEGORIES["shade"], (
        f"shade match returned type {result.type!r}, expected one of "
        f"{ROLE_CATEGORIES['shade']}"
    )


def test_role_wash_excludes_contrast(matcher):
    """wash role must only return wash/shade/ink — not contrast."""
    result = matcher.match_color(TARGET_RGB, "Citadel", role="wash")
    assert result is not None
    assert result.type.lower() in ROLE_CATEGORIES["wash"]
    assert result.type.lower() != "contrast"


def test_backward_compat_paint_type_maps_to_dominant(matcher):
    """paint_type='paint' backward-compat shim must resolve to dominant role."""
    result_role = matcher.match_color(TARGET_RGB, "Citadel", role="dominant",
                                      context={"metallic_score": 0.0})
    result_compat = matcher.match_color(TARGET_RGB, "Citadel", paint_type="paint",
                                        context={"metallic_score": 0.0})
    assert result_role is not None and result_compat is not None
    assert result_role.name == result_compat.name, (
        "paint_type='paint' and role='dominant' returned different paints — "
        "backward-compat shim may be broken"
    )


# ============================================================================
# metallic gate
# ============================================================================

def test_metallic_gate_restricts_to_metallic_when_score_high(matcher):
    """metallic_score >= 0.5 must restrict candidates to metallic-flagged
    paints — the DB `metallic` flag is the single metallic decision."""
    result = matcher.match_color(
        TARGET_RGB, "Citadel", role="dominant",
        context={"metallic_score": 1.0}
    )
    assert result is not None
    assert result.metallic, (
        f"Expected a metallic-flagged paint, got {result.name!r}"
    )


def test_metallic_gate_excludes_metallic_when_score_zero(matcher):
    """metallic_score == 0 must exclude metallic-flagged paints."""
    result = matcher.match_color(
        TARGET_RGB, "Citadel", role="dominant",
        context={"metallic_score": 0.0}
    )
    assert result is not None
    assert not result.metallic, (
        f"Metallic paint {result.name!r} was returned for a non-metallic colour"
    )


def test_metallic_gate_empty_pool_fallback():
    """When no metallic paints exist for a brand, fall back to all candidates."""
    # Build a DB with only non-metallic paints for the test brand
    db = [
        _make_paint("Base Only", "TestBrand", "base", finish="matte", lab=(50.0, 0.0, 0.0)),
        _make_paint("Layer Only", "TestBrand", "layer", finish="matte", lab=(52.0, 0.0, 0.0)),
    ]
    m = PaintMatcher(db)
    # Request metallic match — pool is empty, should fall back gracefully
    result = m.match_color(TARGET_RGB, "TestBrand", role="dominant",
                           context={"metallic_score": 1.0})
    assert result is not None, (
        "Metallic gate empty-pool fallback returned None — should have used unrestricted candidates"
    )


def test_metallic_gate_not_applied_to_shade_role(matcher):
    """Metallic gate must be bypassed for shade/wash roles."""
    result = matcher.match_color(
        TARGET_RGB, "Citadel", role="shade",
        context={"metallic_score": 1.0}
    )
    # Should return a shade/wash/ink/contrast, regardless of metallic_score
    assert result is not None
    assert result.type.lower() in ROLE_CATEGORIES["shade"]


# ============================================================================
# transparency penalty
# ============================================================================

def test_transparency_penalty_3de_closer_still_loses():
    """
    Contrast paint 3 ΔE closer than the best opaque paint must still lose
    after the transparency penalty (0.7 * 8.0 = 5.6 penalty, 3 < 5.6).
    """
    # Opaque base at L=60: deltaE ≈ 10 from target (50,0,0)
    # Contrast at L=57: deltaE ≈ 7, penalty = 5.6 → effective ≈ 12.6
    db = [
        _make_paint("Opaque",   "T", "base",     transparency=0.0, lab=(60.0, 0.0, 0.0)),
        _make_paint("Contrast", "T", "contrast", transparency=0.7, lab=(57.0, 0.0, 0.0)),
    ]
    m = PaintMatcher(db)
    result = m.match_color(TARGET_RGB, "T", role="dominant",
                           context={"metallic_score": 0.0})
    assert result is not None
    assert result.name == "Opaque", (
        f"Contrast paint 3 ΔE closer won despite penalty — expected 'Opaque', got {result.name!r}"
    )


def test_transparency_penalty_10de_closer_wins():
    """
    Contrast paint placed exactly on the target colour must win over an opaque
    paint ~20 ΔE away, because penalty (0.7*8=5.6) < 20.

    We derive the actual target LAB from TARGET_RGB so the paint LABs are
    placed correctly regardless of the platform's LAB conversion rounding.
    """
    from skimage import color as sk_color

    actual_target_lab = sk_color.rgb2lab(
        np.array([[TARGET_RGB / 255.0]])
    )[0][0]
    # Opaque 20 L* units above target → deltaE ≈ 20
    opaque_lab = (float(actual_target_lab[0]) + 20.0, 0.0, 0.0)
    # Contrast exactly ON the target → deltaE ≈ 0, effective = 0 + 0.7*8 = 5.6
    exact_contrast_lab = (float(actual_target_lab[0]), 0.0, 0.0)

    db = [
        _make_paint("Opaque",   "T", "base",     transparency=0.0, lab=opaque_lab),
        _make_paint("Contrast", "T", "contrast", transparency=0.7, lab=exact_contrast_lab),
    ]
    m = PaintMatcher(db)
    result = m.match_color(TARGET_RGB, "T", role="dominant",
                           context={"metallic_score": 0.0})
    assert result is not None
    assert result.name == "Contrast", (
        f"Contrast paint (effective ΔE≈5.6) lost to opaque (effective ΔE≈20) — "
        f"transparency penalty may not be applied correctly. Got {result.name!r}"
    )


def test_transparency_penalty_not_applied_to_shade_role():
    """Transparency penalty must NOT be applied when role is 'shade'."""
    # A contrast paint very close to target should win for the shade role
    db = [
        _make_paint("Wash",     "T", "wash",    transparency=0.0, lab=(60.0, 0.0, 0.0)),
        _make_paint("Contrast", "T", "contrast", transparency=0.9, lab=(51.0, 0.0, 0.0)),
    ]
    m = PaintMatcher(db)
    result = m.match_color(TARGET_RGB, "T", role="shade")
    assert result is not None
    assert result.name == "Contrast", (
        "Transparency penalty incorrectly applied to shade role — closest contrast lost"
    )


# ============================================================================
# top-N deduplication
# ============================================================================

def test_topn_deduplication_skips_near_identical_same_brand():
    """
    match_top_n must skip same-brand paints within ΔE 2.0 of an already-included paint.
    Two nearly identical paints should yield only one result per brand.
    """
    db = [
        _make_paint("PaintA", "Brand", "base", lab=(50.0, 0.0, 0.0)),
        _make_paint("PaintB", "Brand", "base", lab=(50.5, 0.0, 0.0)),   # ΔE ≈ 0.5 from A
        _make_paint("PaintC", "Brand", "base", lab=(60.0, 0.0, 0.0)),   # ΔE ≈ 10 from A
    ]
    m = PaintMatcher(db)
    results = m.match_top_n(TARGET_LAB, brand="Brand", role="dominant", n=3)
    names = [r[0].name for r in results]
    # PaintA and PaintB are within ΔE 2.0 — only one should appear
    assert not ("PaintA" in names and "PaintB" in names), (
        f"Both near-identical paints A and B were returned: {names}. "
        "Deduplication failed."
    )
    # PaintC is far enough to always be included
    assert "PaintC" in names


def test_topn_deduplication_allows_different_brands():
    """Same-colour paints from different brands must NOT be deduplicated."""
    db = [
        _make_paint("PaintX", "Brand1", "base", lab=(50.0, 0.0, 0.0)),
        _make_paint("PaintY", "Brand2", "base", lab=(50.5, 0.0, 0.0)),  # same colour, diff brand
    ]
    m = PaintMatcher(db)
    results = m.match_top_n(TARGET_LAB, role="dominant", n=5)
    names = [r[0].name for r in results]
    # Both should appear — dedup only applies within a brand
    assert "PaintX" in names and "PaintY" in names, (
        f"Cross-brand deduplication incorrectly removed a paint: {names}"
    )
