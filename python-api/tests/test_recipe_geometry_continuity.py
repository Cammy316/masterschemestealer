"""
Recipe-geometry continuity tests (Phase 0 of the colour-science overhaul).

The principle under test: RECIPES MUST VARY CONTINUOUSLY WITH THEIR INPUT.
Two perceptually indistinguishable base colours must receive perceptually
indistinguishable highlight/shade targets — otherwise the same model
photographed twice can flip between visibly different recipes.

These started life as STRICT xfails documenting audit finding F5; the Phase 3
geometry rewrite (continuous OKLCH hue field, chroma ramp, soft-scored
objective) fixed all three defects and they now run as hard invariants:

  1. No warm/cool boundary — adjacent teals get continuously varying targets.
  2. No neutral-stability cliff — the hue shift ramps in with chroma.
  3. No lexicographic tier ladder — an excellent adjacent-family candidate
     beats a terrible in-family one.
"""

import math
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.recipe_geometry import (  # noqa: E402
    PaintNode, chroma, derive_partner, target_lab,
)


def _lab_from_lch(L: float, C: float, h_deg: float):
    h = math.radians(h_deg)
    return (L, C * math.cos(h), C * math.sin(h))


def _euclid(p, q) -> float:
    return math.dist(p, q)


# ---------------------------------------------------------------------------
# Continuity of the explicit highlight/shade target
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("rel", ["highlight", "shade"])
def test_target_is_continuous_across_warm_cool_boundary(rel):
    """Why it matters: a repaint of the same teal armour, one camera-noise
    step apart in hue, must not flip between a yellow-pulled and a
    cyan-pulled recipe."""
    base_warm_side = _lab_from_lch(55.0, 40.0, 119.0)
    base_cool_side = _lab_from_lch(55.0, 40.0, 121.0)
    input_sep = _euclid(base_warm_side, base_cool_side)

    t_warm = target_lab(base_warm_side, rel)
    t_cool = target_lab(base_cool_side, rel)
    target_sep = _euclid(t_warm, t_cool)

    # A continuous map may amplify a little; a 4x envelope is generous.
    assert target_sep <= 4.0 * input_sep, (
        f"targets separated by {target_sep:.2f} for inputs "
        f"{input_sep:.2f} apart — warm/cool discontinuity")


@pytest.mark.parametrize("rel", ["highlight", "shade"])
def test_target_is_continuous_across_neutral_chroma_cliff(rel):
    """Why it matters: near-neutral greys with a whisker of warmth are the
    most common miniature basecoats; their targets must not jump as chroma
    crosses an arbitrary threshold."""
    just_below = _lab_from_lch(50.0, 4.99, 30.0)
    just_above = _lab_from_lch(50.0, 5.01, 30.0)
    input_sep = _euclid(just_below, just_above)     # ≈ 0.02

    t_below = target_lab(just_below, rel)
    t_above = target_lab(just_above, rel)
    target_sep = _euclid(t_below, t_above)

    assert target_sep <= 10.0 * input_sep, (
        f"targets separated by {target_sep:.3f} for inputs "
        f"{input_sep:.3f} apart — chroma cliff at C=5")


# ---------------------------------------------------------------------------
# derive_partner candidate selection
# ---------------------------------------------------------------------------

def _node(pid: str, lab, fam: str, category: str = "layer") -> PaintNode:
    return PaintNode(paint_id=pid, name=pid, brand="TestBrand",
                     category=category, color_family=fam, lab=lab)


def test_excellent_adjacent_candidate_beats_terrible_in_family_one():
    """Why it matters: recommending a barely-lighter wrong-hue red as the
    'highlight' while a perfect orange sits in the same brand produces
    recipes painters immediately distrust."""
    base = _node("base-red", (50.0, 35.0, 25.0), "red")
    tgt = target_lab(base.lab, "highlight")

    # In-family: satisfies the monotonicity guard by a hair but is far from
    # the target in hue/chroma. Adjacent-family: essentially at the target.
    poor_in_family = _node("poor-red", (50.5, 70.0, -10.0), "red")
    perfect_adjacent = _node("perfect-orange",
                             (tgt[0], tgt[1] + 0.5, tgt[2]), "orange")

    dist_poor = _euclid(poor_in_family.lab, tgt)
    dist_perfect = _euclid(perfect_adjacent.lab, tgt)
    assert dist_perfect < 2.0 < 20.0 < dist_poor      # precondition

    chosen, _tier = derive_partner(base, [poor_in_family, perfect_adjacent],
                                   "highlight")
    assert chosen is perfect_adjacent, (
        f"tier ladder chose {chosen.paint_id} at distance {dist_poor:.1f} "
        f"over {perfect_adjacent.paint_id} at {dist_perfect:.1f}")


# ---------------------------------------------------------------------------
# Behaviour that must SURVIVE the Phase 3 rewrite
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("rel", ["highlight", "shade"])
@pytest.mark.parametrize("base", [
    (50.0, 40.0, 30.0),     # saturated warm
    (50.0, -40.0, -20.0),   # saturated cool
    (50.0, 1.0, 1.0),       # near-neutral
])
def test_target_preserves_chroma(base, rel):
    """The target keeps the base's chroma — highlights must not wash out and
    shades must not grey out (chroma collapse is the classic bad-recipe
    smell). Chroma is held constant in OKLCH, so the CIELAB view of it may
    drift a little with the lightness change — the band below catches
    collapse while allowing that representation drift."""
    tgt = target_lab(base, rel)
    base_c = chroma(base[1], base[2])
    tgt_c = chroma(tgt[1], tgt[2])
    assert tgt_c > 0.7 * base_c - 0.5, f"chroma collapsed: {base_c:.1f} → {tgt_c:.1f}"
    assert tgt_c < 1.3 * base_c + 0.5, f"chroma ballooned: {base_c:.1f} → {tgt_c:.1f}"


def test_neutral_target_keeps_hue_locked():
    """A true neutral (chroma≈0) has no meaningful hue — the target must not
    invent one (a*/b* stay ≈0)."""
    tgt = target_lab((50.0, 0.5, -0.5), "highlight")
    assert chroma(tgt[1], tgt[2]) < 1.0


def test_derive_partner_prefers_candidate_near_target():
    """Among monotonicity-respecting in-family candidates, the one nearest
    the explicit target wins — the core selection contract."""
    base = _node("base-red", (50.0, 35.0, 25.0), "red")
    tgt = target_lab(base.lab, "highlight")
    near = _node("near", (tgt[0] + 1.0, tgt[1], tgt[2]), "red")
    far = _node("far", (base.lab[0] + 25.0, 10.0, 5.0), "red")
    chosen, tier = derive_partner(base, [near, far], "highlight")
    assert chosen is near
    assert tier == "in-family"
