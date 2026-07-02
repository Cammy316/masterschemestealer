"""
Shared OKLCH-geometry scorer for recipe edges (highlight / shade).

This is the SINGLE source of truth for the algorithmic fallback used in two
places: scripts/generate_algorithmic_edges.py (pre-computes edges into
recipes.json) and core/schemestealer_engine.py (live fallback when the graph has
no curated edge). Both import the functions here so the maths can never drift.

Phase 3 of the colour-science overhaul rebuilt this module on three principles:

  1. GEOMETRY LIVES IN OKLCH. Hue rotation at constant chroma is exactly the
     operation CIELAB gets wrong (its blue constant-hue loci are curved — the
     classic Lab-gradient purple shift); OKLCH hue is uniform by construction.
     CIELAB remains the interchange representation at the module boundary.

  2. RECIPES VARY CONTINUOUSLY WITH THEIR INPUT. The old binary warm/cool
     split flipped the hue-shift direction at exactly h=120°, and the neutral
     lock snapped at chroma 5 — two perceptually identical bases could get
     visibly different recipes. The hue field below is continuous everywhere:
     zero at the warm/cool poles (nothing to rotate toward), zero at the
     watersheds between the basins (ramped in over _WATERSHED_RAMP_DEG), and
     ramped in smoothly with chroma near neutral.

  3. ONE SOFT-SCORED OBJECTIVE, NO TIER LADDER. Candidate selection combines
     colour distance to the explicit target, a soft family preference, a soft
     monotonicity term with a minimum visible step, and the opacity/vibrancy
     tie-breakers — as weights, not cliffs. A lexicographic ladder let any
     in-family candidate beat an excellent adjacent-family one; weights keep
     the preference without the pathology. Selection stays deterministic.

Painterly model (unchanged in intent): a HIGHLIGHT is lighter and rotates
toward the warm pole (yellow) for warm colours, toward the cool pole (cyan)
for cool colours; a SHADE is darker with the rotation reversed. Chroma is
preserved — highlights must not wash out, shades must not grey out.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
import math
import numpy as np

from core.colour_maths import lab_to_oklab, oklab_to_lab

# ---------------------------------------------------------------------------
# Tunables (documented; kept identical across script + engine via this module)
# ---------------------------------------------------------------------------

# Lab-scale ideal lightness deltas. Consumed by recipe_graph as the curated-
# edge tie-break, and kept as the Lab-scale reference for tests/documentation.
IDEAL_DL_HIGHLIGHT = 12.0
IDEAL_DL_SHADE = -12.0

# OKLab lightness step (L in [0, 1]); ≈ the ±12 L* step at midtones. The step
# shrinks smoothly near the lightness extremes (see _lightness_delta) so a
# near-white base is not sent past white.
_DL_OK = 0.09
_HEADROOM_FACTOR = 0.75          # never target more than 75% of the remaining headroom

# Continuous hue field (OKLab hue degrees). Yellow sits near 110°, cyan near
# 195° in OKLab. The watersheds are the basin boundaries between them; the
# shift ramps to zero within _WATERSHED_RAMP_DEG of a watershed so the field
# is continuous where the old binary split jumped.
_YELLOW_POLE_DEG = 110.0
_CYAN_POLE_DEG = 195.0
_WATERSHED_A_DEG = (_YELLOW_POLE_DEG + _CYAN_POLE_DEG) / 2.0            # ≈152.5 (greens)
_WATERSHED_B_DEG = ((_CYAN_POLE_DEG + _YELLOW_POLE_DEG + 360.0) / 2.0) % 360.0  # ≈332.5 (magentas)
_HUE_SHIFT_MAX_DEG = 15.0
_WATERSHED_RAMP_DEG = 25.0

# Neutral stability: the hue shift ramps in linearly with OKLab chroma and is
# fully active from _CHROMA_FULL_OK — a ramp, not the old C<5 cliff.
_CHROMA_FULL_OK = 0.04

# Soft-objective weights (all in OKLab distance units, so they compose with
# the colour-distance term on one scale).
_MIN_STEP_OK = 0.02             # minimum clearly-visible lightness step (≈3 L*)
_W_MONOTONICITY = 8.0           # hinge slope: per OKLab-L unit short of the step
_W_ADJACENT_FAMILY = 0.02       # mild preference for staying in-family
_W_UNRELATED_FAMILY = 0.08      # strong (but not absolute) cross-family penalty
HONEST_EMPTY_SCORE = 0.35       # a best score above this is not a recommendation

# Phase 4 candidate weighting (tie-breakers on the OKLab scale, NOT hard
# filters): opaque paints make poor highlight/glaze layers, so penalise opacity
# for the highlight role; reward vibrant paints when the target is saturated.
OPACITY_HIGHLIGHT_PENALTY = 0.006   # per opacity_rating point (0..3)
VIBRANCY_BONUS = 0.010              # 'significant' vibrancy when target is saturated
SATURATED_CHROMA_OK = 0.09          # target OKLab chroma above which vibrancy matters

# Edge-generation quality bar (scripts/generate_algorithmic_edges.py): a
# candidate scoring above this is not good enough to write into recipes.json.
SCORE_THRESHOLD = 0.14

# Roles eligible as base/layer paints for a highlight or shade step.
CANDIDATE_CATEGORIES = {"base", "layer", "air"}

# Same/adjacent colour families (the DB's flat lowercase vocabulary).
FAMILY_ADJACENCY = {
    "red": {"red", "orange", "pink", "magenta", "brown"},
    "orange": {"orange", "red", "yellow", "brown"},
    "yellow": {"yellow", "orange", "green", "bone", "brown"},
    "green": {"green", "yellow", "cyan"},
    "cyan": {"cyan", "green", "blue"},
    "blue": {"blue", "cyan", "purple"},
    "purple": {"purple", "blue", "magenta", "pink"},
    "magenta": {"magenta", "purple", "pink", "red"},
    "pink": {"pink", "red", "magenta", "purple"},
    "brown": {"brown", "red", "orange", "yellow", "bone"},
    "bone": {"bone", "yellow", "brown", "white", "grey"},
    "white": {"white", "bone", "grey"},
    "grey": {"grey", "white", "black", "silver"},
    "black": {"black", "grey"},
    "silver": {"silver", "gold", "bronze", "grey", "white"},
    # The three metals are mutually adjacent and all border grey (Phase 1.5).
    "gold": {"gold", "silver", "bronze", "grey", "yellow", "brown"},
    "bronze": {"bronze", "gold", "silver", "grey", "brown"},
}


def allowed_families(family: str):
    """The detected family plus its adjacent families (canonical lowercase set).

    The SINGLE definition of colour-family adjacency, shared by the recipe graph
    (is_eligible) and the PaintMatcher's base/highlight family gate, so a paint is
    only ever offered for a colour it's actually near in hue.

    Returns None when `family` isn't in the adjacency map — the caller should then
    NOT gate (an unknown/edge family must not silently empty the candidate pool).
    """
    f = (family or "").lower()
    return FAMILY_ADJACENCY.get(f)


@dataclass
class PaintNode:
    """Minimal paint view the geometry needs — built from a Paint or a DB dict."""
    paint_id: str
    name: str
    brand: str
    category: str
    color_family: str
    lab: Tuple[float, float, float]
    matchable: bool = True
    discontinued: bool = False
    # Phase 4 candidate weighting (tie-breakers, never hard filters).
    opacity_rating: Optional[int] = None    # 0 (translucent) .. 3 (opaque)
    vibrancy: Optional[str] = None          # None | 'slight' | 'significant'


def hue_angle_deg(a: float, b: float) -> float:
    """Hue angle h = atan2(b, a) in degrees, normalised to [0, 360)."""
    return math.degrees(math.atan2(b, a)) % 360.0


def chroma(a: float, b: float) -> float:
    return math.hypot(a, b)


def _angular_diff(frm: float, to: float) -> float:
    """Signed smallest rotation from `frm` to `to`, in (-180, 180]."""
    return ((to - frm + 180.0) % 360.0) - 180.0


# ---------------------------------------------------------------------------
# The continuous OKLCH target
# ---------------------------------------------------------------------------

def _hue_shift_deg(h_ok_deg: float, c_ok: float, rel: str) -> float:
    """Signed hue rotation (OKLab degrees) — a continuous field.

    Direction: toward the basin's pole (yellow for warm hues, cyan for cool)
    for a highlight; reversed for a shade. Magnitude: capped at
    _HUE_SHIFT_MAX_DEG, ramped to zero approaching the watersheds between the
    basins (where the old binary model jumped sign) and near the poles
    (nothing to rotate toward), and ramped in with chroma so neutrals stay
    hue-stable without a threshold cliff.
    """
    h = h_ok_deg % 360.0

    in_warm_basin = h < _WATERSHED_A_DEG or h > _WATERSHED_B_DEG
    pole = _YELLOW_POLE_DEG if in_warm_basin else _CYAN_POLE_DEG
    delta = _angular_diff(h, pole)

    watershed_dist = min(abs(_angular_diff(h, _WATERSHED_A_DEG)),
                         abs(_angular_diff(h, _WATERSHED_B_DEG)))
    watershed_ramp = min(watershed_dist / _WATERSHED_RAMP_DEG, 1.0)
    chroma_ramp = min(max(c_ok, 0.0) / _CHROMA_FULL_OK, 1.0)

    magnitude = min(abs(delta), _HUE_SHIFT_MAX_DEG) * watershed_ramp * chroma_ramp
    shift = math.copysign(magnitude, delta) if delta != 0.0 else 0.0
    return shift if rel == "highlight" else -shift


def _lightness_delta(l_ok: float, rel: str) -> float:
    """Signed OKLab lightness step, shrunk smoothly near the extremes so the
    target never overshoots white/black (relative headroom, not a fixed ±12)."""
    headroom = (1.0 - l_ok) if rel == "highlight" else l_ok
    step = min(_DL_OK, _HEADROOM_FACTOR * max(headroom, 0.0))
    return step if rel == "highlight" else -step


def _target_oklab(from_ok: np.ndarray, rel: str) -> np.ndarray:
    """The explicit highlight/shade target in OKLab: lighten/darken with the
    continuous hue rotation, chroma preserved."""
    l_ok = float(from_ok[0])
    c_ok = chroma(float(from_ok[1]), float(from_ok[2]))
    h_ok = hue_angle_deg(float(from_ok[1]), float(from_ok[2]))

    h2 = math.radians((h_ok + _hue_shift_deg(h_ok, c_ok, rel)) % 360.0)
    return np.array([l_ok + _lightness_delta(l_ok, rel),
                     c_ok * math.cos(h2), c_ok * math.sin(h2)])


def target_lab(from_lab: Tuple[float, float, float], rel: str) -> Tuple[float, float, float]:
    """Explicit highlight/shade target, CIELAB in / CIELAB out. The geometry
    itself runs in OKLCH (see _target_oklab); CIELAB is the interchange
    representation the callers and the paint DB speak."""
    tgt_ok = _target_oklab(lab_to_oklab(np.asarray(from_lab, dtype=float)), rel)
    out = oklab_to_lab(tgt_ok)
    return (float(out[0]), float(out[1]), float(out[2]))


# ---------------------------------------------------------------------------
# The soft-scored objective (single selection contract, no tiers)
# ---------------------------------------------------------------------------

def _candidate_penalty(cand: PaintNode, rel: str, target_c_ok: float) -> float:
    """Opacity/vibrancy tie-breaker added to the OKLab distance. Small vs the
    distance scale, so it only separates near-ties — never overrides colour."""
    pen = 0.0
    if rel == "highlight" and cand.opacity_rating is not None:
        pen += OPACITY_HIGHLIGHT_PENALTY * float(cand.opacity_rating)  # opaque = worse glaze
    if target_c_ok >= SATURATED_CHROMA_OK and cand.vibrancy:
        pen -= VIBRANCY_BONUS if cand.vibrancy == "significant" else VIBRANCY_BONUS * 0.5
    return pen


def _family_penalty(cand_family: str, same_fam: str, allowed) -> float:
    fam = (cand_family or "").lower()
    if fam == same_fam:
        return 0.0
    if fam in allowed:
        return _W_ADJACENT_FAMILY
    return _W_UNRELATED_FAMILY


def _monotonicity_penalty(dl_signed_ok: float) -> float:
    """Hinge on the signed lightness step: zero once the candidate moves at
    least _MIN_STEP_OK in the right direction, growing linearly as it falls
    short or inverts. Soft by design — a hairline-short candidate competes
    with a small handicap instead of being banished to a fallback tier — but
    the slope makes a genuine inversion effectively unselectable."""
    return _W_MONOTONICITY * max(0.0, _MIN_STEP_OK - dl_signed_ok)


def score_edge(from_lab: Tuple[float, float, float],
               to_lab: Tuple[float, float, float],
               rel: str) -> float:
    """Lower is better: OKLab distance from the candidate to the explicit
    target, plus the soft monotonicity term. One metric, one scale."""
    from_ok = lab_to_oklab(np.asarray(from_lab, dtype=float))
    to_ok = lab_to_oklab(np.asarray(to_lab, dtype=float))
    tgt_ok = _target_oklab(from_ok, rel)

    dist = float(np.linalg.norm(to_ok - tgt_ok))
    dl_signed = (to_ok[0] - from_ok[0]) if rel == "highlight" else (from_ok[0] - to_ok[0])
    return dist + _monotonicity_penalty(float(dl_signed))


def is_eligible(from_node: PaintNode, to_node: PaintNode, rel: str) -> bool:
    """Candidate must be a different, matchable, non-discontinued base/layer paint
    of the same brand and the same or an adjacent colour family."""
    if to_node.paint_id == from_node.paint_id:
        return False
    if not to_node.matchable or to_node.discontinued:
        return False
    if to_node.brand != from_node.brand:
        return False
    if (to_node.category or "").lower() not in CANDIDATE_CATEGORIES:
        return False
    allowed = allowed_families(from_node.color_family)
    if allowed is None:  # unknown family — fall back to same-family only
        allowed = {(from_node.color_family or "").lower()}
    return (to_node.color_family or "").lower() in allowed


def best_geometric_edges(from_node: PaintNode,
                         pool: List[PaintNode],
                         rel: str,
                         top_n: int = 2,
                         threshold: float = SCORE_THRESHOLD) -> List[Tuple[PaintNode, float]]:
    """Top-N eligible candidates scored below `threshold`, best first."""
    scored: List[Tuple[PaintNode, float]] = []
    for cand in pool:
        if not is_eligible(from_node, cand, rel):
            continue
        s = score_edge(from_node.lab, cand.lab, rel)
        if s <= threshold:
            scored.append((cand, s))
    scored.sort(key=lambda x: x[1])
    return scored[:top_n]


def derive_partner(from_node: PaintNode, pool: List[PaintNode], rel: str
                   ) -> Tuple[Optional[PaintNode], str]:
    """Select the highlight/shade partner via the single soft-scored objective.

    Returns (best PaintNode | None, label). The label reports the winner's
    family relation ("in-family" / "adjacent-family" / "relaxed") for logging
    continuity with the old tier ladder; it no longer drives selection. A best
    score above HONEST_EMPTY_SCORE returns (None, "empty") — an honest
    no-match beats a bad recommendation.
    """
    from_ok = lab_to_oklab(np.asarray(from_node.lab, dtype=float))
    tgt_ok = _target_oklab(from_ok, rel)
    target_c_ok = chroma(float(tgt_ok[1]), float(tgt_ok[2]))

    same_fam = (from_node.color_family or "").lower()
    allowed = allowed_families(from_node.color_family) or {same_fam}

    def _base_ok(cand: PaintNode) -> bool:
        return (cand.paint_id != from_node.paint_id and cand.matchable
                and not cand.discontinued and cand.brand == from_node.brand
                and (cand.category or "").lower() in CANDIDATE_CATEGORIES)

    candidates = [c for c in pool if _base_ok(c)]
    if not candidates:
        return None, "empty"

    cand_ok = lab_to_oklab(np.array([c.lab for c in candidates], dtype=float))
    distances = np.linalg.norm(cand_ok - tgt_ok, axis=1)

    sign = 1.0 if rel == "highlight" else -1.0
    dl_signed = sign * (cand_ok[:, 0] - from_ok[0])
    mono = _W_MONOTONICITY * np.maximum(0.0, _MIN_STEP_OK - dl_signed)

    extras = np.array([
        _family_penalty(c.color_family, same_fam, allowed)
        + _candidate_penalty(c, rel, target_c_ok)
        for c in candidates
    ])

    scores = distances + mono + extras
    best_idx = int(np.argmin(scores))
    if scores[best_idx] > HONEST_EMPTY_SCORE:
        return None, "empty"

    winner = candidates[best_idx]
    win_fam = (winner.color_family or "").lower()
    label = ("in-family" if win_fam == same_fam
             else "adjacent-family" if win_fam in allowed
             else "relaxed")
    return winner, label
