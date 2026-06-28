"""
Shared LAB-geometry scorer for recipe edges (highlight / shade).

This is the SINGLE source of truth for the algorithmic fallback used in two
places: scripts/generate_algorithmic_edges.py (pre-computes edges into
recipes.json) and core/schemestealer_engine.py (live fallback when the graph has
no curated edge). Both import the functions here so the maths can never drift.

Real paint progressions shift hue, not just lightness:
  - HIGHLIGHT: lighter (target dL* = +12) and warm colours rotate TOWARD YELLOW,
    cool colours TOWARD CYAN (by ~5–20°). Chroma should not collapse.
  - SHADE: darker (target dL* = -12) with the hue rotation reversed (toward the
    cool/deeper side); a slight chroma increase is fine.

Hue is measured as the LAB hue angle h_ab = atan2(b*, a*).
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple
import math
import numpy as np

# ---------------------------------------------------------------------------
# Tunables (documented; kept identical across script + engine via this module)
# ---------------------------------------------------------------------------
IDEAL_DL_HIGHLIGHT = 12.0
IDEAL_DL_SHADE = -12.0
IDEAL_HUE_SHIFT_DEG = 12.0   # within the 5–20° band the prompt specifies

DL_WEIGHT = 1.0
HUE_WEIGHT = 0.8
CHROMA_WEIGHT = 0.5
CHROMA_COLLAPSE_TOLERANCE = 5.0  # only penalise chroma loss beyond this

# Candidates scoring above this are not good enough to suggest.
SCORE_THRESHOLD = 30.0

# Phase 4 candidate weighting (tie-breakers on the LAB-ΔE scale, NOT hard
# filters): opaque paints make poor highlight/glaze layers, so penalise opacity
# for the highlight role; reward vibrant paints when the target is saturated.
OPACITY_HIGHLIGHT_PENALTY = 2.0   # per opacity_rating point (0..3) → up to +6 ΔE
VIBRANCY_BONUS = 3.0              # 'significant' vibrancy when target is saturated
SATURATED_CHROMA = 30.0          # target chroma above which vibrancy matters

# Highlight "pull" target hue angles (degrees). Warm colours highlight toward
# yellow (~90°); cool colours toward cyan (~200°, between green 180° and blue
# 270°). Shade reverses the direction.
WARM_HIGHLIGHT_TARGET = 90.0
COOL_HIGHLIGHT_TARGET = 200.0

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
    "bronze": {"bronze", "gold", "silver", "grey", "copper", "brown"},
    "copper": {"copper", "bronze", "brown"},
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
    """LAB hue angle h_ab in degrees, normalised to [0, 360)."""
    return math.degrees(math.atan2(b, a)) % 360.0


def chroma(a: float, b: float) -> float:
    return math.hypot(a, b)


def _angular_diff(frm: float, to: float) -> float:
    """Signed smallest rotation from `frm` to `to`, in (-180, 180]."""
    return ((to - frm + 180.0) % 360.0) - 180.0


def is_warm(h_ab_deg: float) -> bool:
    """Warm = LAB hue angle in roughly -20°..120° (reds/oranges/yellows and
    yellow-greens); everything else (greens/cyans/blues/purples/magentas) is
    cool. The boundary is documented here so script + engine agree."""
    h = h_ab_deg % 360.0
    return h <= 120.0 + 1e-5 or h >= 340.0 - 1e-5


def score_edge(from_lab: Tuple[float, float, float],
               to_lab: Tuple[float, float, float],
               rel: str) -> float:
    """Lower is better. Combines lightness, hue-direction and chroma terms."""
    lf, af, bf = from_lab
    lt, at, bt = to_lab

    h_from = hue_angle_deg(af, bf)
    h_to = hue_angle_deg(at, bt)
    c_from = chroma(af, bf)
    c_to = chroma(at, bt)

    target_dl = IDEAL_DL_HIGHLIGHT if rel == "highlight" else IDEAL_DL_SHADE

    # Ideal signed hue shift: toward yellow/cyan for a highlight; reversed for a
    # shade.
    target_hue = WARM_HIGHLIGHT_TARGET if is_warm(h_from) else COOL_HIGHLIGHT_TARGET
    direction = 1.0 if _angular_diff(h_from, target_hue) >= 0 else -1.0
    ideal_dh = direction * IDEAL_HUE_SHIFT_DEG
    if rel == "shade":
        ideal_dh = -ideal_dh

    dl = lt - lf
    actual_dh = _angular_diff(h_from, h_to)

    dl_penalty = abs(dl - target_dl) * DL_WEIGHT
    hue_penalty = abs(actual_dh - ideal_dh) * HUE_WEIGHT
    chroma_penalty = max(0.0, (c_from - c_to) - CHROMA_COLLAPSE_TOLERANCE) * CHROMA_WEIGHT

    return dl_penalty + hue_penalty + chroma_penalty


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


# ===========================================================================
# Phase 4 — explicit target-LAB derivation with a monotonicity guard, a tiered
# fallback ladder, and opacity/vibrancy candidate weighting.
# ===========================================================================

def ideal_hue_shift(h_from_deg: float, rel: str) -> float:
    """Signed ideal hue rotation (deg): toward yellow/cyan for a highlight,
    reversed for a shade — the same warm/cool logic score_edge uses."""
    target_hue = WARM_HIGHLIGHT_TARGET if is_warm(h_from_deg) else COOL_HIGHLIGHT_TARGET
    direction = 1.0 if _angular_diff(h_from_deg, target_hue) >= 0 else -1.0
    dh = direction * IDEAL_HUE_SHIFT_DEG
    return dh if rel == "highlight" else -dh


def target_lab(from_lab: Tuple[float, float, float], rel: str) -> Tuple[float, float, float]:
    """Explicit highlight/shade target LAB: lighten (+dL) or darken (-dL) the base
    with a small hue rotation toward yellow (warm) / cyan (cool) and chroma kept."""
    lf, af, bf = from_lab
    h = hue_angle_deg(af, bf)
    c = chroma(af, bf)
    dl = IDEAL_DL_HIGHLIGHT if rel == "highlight" else IDEAL_DL_SHADE
    h2 = math.radians((h + ideal_hue_shift(h, rel)) % 360.0)
    return (lf + dl, c * math.cos(h2), c * math.sin(h2))


def _lab_distance(a: Tuple[float, float, float], b: Tuple[float, float, float]) -> float:
    """Euclidean LAB distance (ΔE76) — 'nearest to the target' selection metric."""
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)


def _candidate_penalty(cand: PaintNode, rel: str, target_chroma: float) -> float:
    """Opacity/vibrancy tie-breaker added to the ΔE-to-target. Small vs the LAB
    scale, so it only separates near-ties — never overrides colour (per Phase 4)."""
    pen = 0.0
    if rel == "highlight" and cand.opacity_rating is not None:
        pen += OPACITY_HIGHLIGHT_PENALTY * float(cand.opacity_rating)  # opaque = worse glaze
    if target_chroma >= SATURATED_CHROMA and cand.vibrancy:
        pen -= VIBRANCY_BONUS if cand.vibrancy == "significant" else VIBRANCY_BONUS * 0.5
    return pen


def derive_partner(from_node: PaintNode, pool: List[PaintNode], rel: str
                   ) -> Tuple[Optional[PaintNode], str]:
    """Phase 4 derivation. Returns (best PaintNode | None, tier_label).

    Picks the candidate nearest the explicit target LAB (weighted by
    opacity/vibrancy) under a hard MONOTONICITY GUARD — a highlight must be
    strictly lighter than the base, a shade strictly darker — walking a tiered
    fallback ladder: in-family → adjacent-family → relaxed (any same-brand base) →
    honest empty. A candidate that violates the guard is never returned.
    """
    tgt = target_lab(from_node.lab, rel)
    target_c = chroma(tgt[1], tgt[2])
    base_l = from_node.lab[0]
    same_fam = (from_node.color_family or "").lower()
    allowed = allowed_families(from_node.color_family) or {same_fam}

    def _monotonic_ok(cand: PaintNode) -> bool:
        return cand.lab[0] > base_l if rel == "highlight" else cand.lab[0] < base_l

    def _base_ok(cand: PaintNode) -> bool:
        return (cand.paint_id != from_node.paint_id and cand.matchable
                and not cand.discontinued and cand.brand == from_node.brand
                and (cand.category or "").lower() in CANDIDATE_CATEGORIES)

    def _best(family_filter) -> Optional[PaintNode]:
        valid_cands = []
        for c in pool:
            if not _base_ok(c) or not _monotonic_ok(c):
                continue
            if family_filter is not None and (c.color_family or "").lower() not in family_filter:
                continue
            valid_cands.append(c)

        if not valid_cands:
            return None

        # Vectorized distance calculation
        labs = np.array([c.lab for c in valid_cands])
        tgt_arr = np.array(tgt)
        
        distances = np.linalg.norm(labs - tgt_arr, axis=1)
        penalties = np.array([_candidate_penalty(c, rel, target_c) for c in valid_cands])
        
        total_scores = distances + penalties
        best_idx = np.argmin(total_scores)
        
        return valid_cands[best_idx]

    for family_filter, tier in (({same_fam}, "in-family"),
                                (allowed, "adjacent-family"),
                                (None, "relaxed")):
        cand = _best(family_filter)
        if cand is not None:
            return cand, tier
    return None, "empty"
