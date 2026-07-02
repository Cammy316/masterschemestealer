"""
Boundary-value analysis for the colour-science core.

These complement the existing suites (Sharma ΔE pairs in test_colour_science.py,
the neon-gamut K-means case in test_color_classification.py) by attacking the
mathematical extremes the prompt calls out:

  * CIEDE2000 at pure neutrals (L*=0 black, L*=100 white, chroma≈0) — the points
    where naive implementations divide by zero or trip atan2/Cbar discontinuities.
  * K-means fed physically impossible / degenerate fields (pure black, pure white)
    and a determinism lock (the seeded clusterer must be reproducible).
  * The recipe monotonicity guard — a highlight must never resolve to a darker
    paint, a shade never to a lighter one — which is the contract that keeps
    derived recipes physically sensible.

Why it matters: a NaN here silently poisons every downstream paint match, and a
broken monotonicity guard would recommend a "highlight" that darkens the model.

conftest.py stubs cv2; extract_colors runs fine under that stub (see the existing
neon test), so no real OpenCV is required.
"""

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.colour_maths import ciede2000_single  # noqa: E402
from core.recipe_geometry import (  # noqa: E402
    target_lab, derive_partner, PaintNode, IDEAL_DL_HIGHLIGHT, IDEAL_DL_SHADE,
)
from core.smart_color_system import SmartColorExtractor  # noqa: E402


# ===========================================================================
# 1. CIEDE2000 near the pure neutrals (L*≈0, L*≈100, chroma≈0)
# ===========================================================================

# Each entry is an extreme the formula must survive. Black/white have a*=b*=0,
# so the hue angle is undefined — the classic NaN trap.
_BOUNDARY_LABS = [
    (0.0, 0.0, 0.0),       # pure black
    (100.0, 0.0, 0.0),     # pure white
    (1.0, 0.0, 0.0),       # just above black, achromatic
    (99.0, 0.0, 0.0),      # just below white, achromatic
    (50.0, 0.0, 0.0),      # mid neutral grey
    (0.0, 0.01, -0.01),    # black with a whisker of chroma
    (100.0, -0.01, 0.01),  # white with a whisker of chroma
]


@pytest.mark.parametrize("lab", _BOUNDARY_LABS)
def test_ciede2000_identity_is_zero_at_extremes(lab):
    """A colour compared to itself is ΔE=0 even when a*=b*=0 (undefined hue)."""
    assert ciede2000_single(lab, lab) == pytest.approx(0.0, abs=1e-9)


@pytest.mark.parametrize("lab", _BOUNDARY_LABS)
def test_ciede2000_finite_and_nonneg_vs_grey(lab):
    """ΔE from each extreme to a neutral grey must be finite and non-negative —
    no NaN/inf leaking out of the hue/chroma terms near the neutrals."""
    d = ciede2000_single(lab, (50.0, 0.0, 0.0))
    assert np.isfinite(d), f"non-finite ΔE for {lab}: {d}"
    assert d >= 0.0


def test_ciede2000_black_to_white_is_large_and_finite():
    """Black↔white is the maximum lightness excursion; ~100 and finite."""
    d = ciede2000_single((0.0, 0.0, 0.0), (100.0, 0.0, 0.0))
    assert np.isfinite(d)
    assert d > 50.0, f"black→white ΔE unexpectedly small: {d}"


def test_ciede2000_symmetric_across_lightness_extreme():
    """Symmetry must hold even when one operand is a pure neutral extreme."""
    a, b = (0.0, 0.0, 0.0), (100.0, 5.0, -5.0)
    assert ciede2000_single(a, b) == pytest.approx(ciede2000_single(b, a), abs=1e-9)


def test_ciede2000_no_nan_on_full_neutral_sweep():
    """Sweep the achromatic axis end to end (L*=0→100, chroma=0): every pairwise
    distance to the next step stays finite — guards the L* discontinuity band."""
    greys = [(float(l), 0.0, 0.0) for l in range(0, 101, 5)]
    for p, q in zip(greys, greys[1:]):
        d = ciede2000_single(p, q)
        assert np.isfinite(d) and d >= 0.0, f"bad ΔE between {p} and {q}: {d}"


# ===========================================================================
# 2. K-means on degenerate / impossible fields + determinism
#    (the neon #00FF00 gamut case already lives in test_color_classification.py)
# ===========================================================================

@pytest.fixture(scope="module")
def extractor():
    return SmartColorExtractor()


def test_kmeans_pure_white_field(extractor):
    """A pure-white field (L*≈100) must cluster without NaN and report a near-white
    dominant colour — the upper gamut extreme."""
    img = np.full((50, 50, 3), 255, dtype=np.uint8)
    mask = np.ones((50, 50), dtype=bool)
    clusters = extractor.extract_colors(img, mask)
    assert isinstance(clusters, list) and len(clusters) > 0
    dominant = max(clusters, key=lambda c: c["coverage"])
    assert np.all(np.asarray(dominant["median_rgb"]) >= 245)


def test_kmeans_pure_black_field_does_not_crash(extractor):
    """A pure-black field (L*≈0, a*=b*=0) must not throw or emit NaN. Current
    behaviour may classify it as shadow and return an empty list — that is fine;
    we only pin that it degrades gracefully rather than crashing."""
    img = np.zeros((50, 50, 3), dtype=np.uint8)
    mask = np.ones((50, 50), dtype=bool)
    clusters = extractor.extract_colors(img, mask)
    assert isinstance(clusters, list)
    for c in clusters:
        assert np.all(np.isfinite(np.asarray(c["median_lab"])))


def test_kmeans_is_deterministic(extractor):
    """The clusterer is seeded (random_state=42, n_init=10); identical input must
    yield identical dominant colours across runs — no flaky recipes."""
    img = np.zeros((60, 60, 3), dtype=np.uint8)
    img[:20, :, 0] = 200            # red band
    img[20:40, :, 1] = 200          # green band
    img[40:, :, 2] = 200            # blue band
    mask = np.ones((60, 60), dtype=bool)

    first = extractor.extract_colors(img.copy(), mask.copy())
    second = extractor.extract_colors(img.copy(), mask.copy())

    assert len(first) == len(second)
    med = lambda cs: sorted(tuple(np.round(c["median_rgb"]).astype(int)) for c in cs)
    assert med(first) == med(second)


# ===========================================================================
# 3. Recipe monotonicity guard
#    target_lab is the ideal target; derive_partner is the guarded selection.
# ===========================================================================

# Bases spanning the lightness range incl. both neutral extremes and saturated hues.
_MONO_BASES = [
    (0.0, 0.0, 0.0),       # black
    (5.0, 0.1, 0.1),       # near-black neutral
    (50.0, 40.0, 30.0),    # saturated warm
    (50.0, -40.0, -20.0),  # saturated cool
    (95.0, -3.0, 4.0),     # near-white
    (100.0, 0.0, 0.0),     # white
]

# The Phase 3 geometry scales the lightness step by the available headroom
# (a base at L*=95 cannot be lifted 12), so the contract is DIRECTION plus a
# meaningful step wherever headroom exists — never an inversion.
_MID_RANGE = lambda L: 5.0 < L < 90.0  # noqa: E731


@pytest.mark.parametrize("base", _MONO_BASES)
def test_target_lab_highlight_never_darkens(base):
    """A highlight target is lighter than the base wherever headroom exists,
    and never darker anywhere — an inverted target would derive recipes that
    darken the model."""
    tgt_l = target_lab(base, "highlight")[0]
    assert tgt_l >= base[0] - 1e-6
    if _MID_RANGE(base[0]):
        assert tgt_l > base[0] + 2.0, f"highlight step too small: {tgt_l - base[0]:.2f}"
        assert tgt_l < base[0] + 25.0, f"highlight step too large: {tgt_l - base[0]:.2f}"


@pytest.mark.parametrize("base", _MONO_BASES)
def test_target_lab_shade_never_lightens(base):
    """The mirror: a shade target is darker wherever headroom exists, never
    lighter anywhere."""
    tgt_l = target_lab(base, "shade")[0]
    assert tgt_l <= base[0] + 1e-6
    if _MID_RANGE(base[0]):
        assert tgt_l < base[0] - 2.0, f"shade step too small: {base[0] - tgt_l:.2f}"
        assert tgt_l > base[0] - 25.0, f"shade step too large: {base[0] - tgt_l:.2f}"


def _node(pid: str, L: float, fam: str = "red", brand: str = "TestBrand") -> PaintNode:
    """A minimal matchable layer-paint node at a given lightness."""
    # Keep a/b modest and in-hue for 'red' so the family gate admits it.
    return PaintNode(paint_id=pid, name=pid, brand=brand, category="layer",
                     color_family=fam, lab=(L, 35.0, 25.0))


def test_derive_partner_highlight_is_strictly_lighter_than_base():
    """Given both lighter and darker candidates, a highlight must select a paint
    strictly lighter than the base — never the darker option."""
    base = _node("base", 50.0)
    pool = [_node("lighter", 70.0), _node("darker", 30.0), base]
    chosen, tier = derive_partner(base, pool, "highlight")
    assert chosen is not None
    assert chosen.lab[0] > base.lab[0], "highlight resolved to a paint darker than base"
    assert tier in {"in-family", "adjacent-family", "relaxed"}


def test_derive_partner_shade_is_strictly_darker_than_base():
    """The mirror: a shade must select a paint strictly darker than the base."""
    base = _node("base", 50.0)
    pool = [_node("lighter", 70.0), _node("darker", 30.0), base]
    chosen, tier = derive_partner(base, pool, "shade")
    assert chosen is not None
    assert chosen.lab[0] < base.lab[0], "shade resolved to a paint lighter than base"


def test_derive_partner_returns_empty_when_no_lighter_paint_exists():
    """If every candidate is darker than the base, a highlight must return
    (None, 'empty') — an honest no-match — rather than a darker paint."""
    base = _node("base", 50.0)
    pool = [_node("d1", 20.0), _node("d2", 35.0), _node("d3", 45.0)]
    chosen, tier = derive_partner(base, pool, "highlight")
    assert chosen is None
    assert tier == "empty"
