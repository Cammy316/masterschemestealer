"""Recipe-graph scoreboard (C1.1).

Before this file the scoreboard had NO recipe rows at all, so C4.1 (O-E4)
would have shipped behind a gate that did not exist.

Scores the edge table the engine actually consults: for every
`(from_id, rel)` key, `RecipeGraph._best_edge` picks one edge, and that is
the edge `_recipe_partner` (`schemestealer_engine.py:571-597`) hands to
`_monotonic_ok`. Nothing here re-implements colour maths — hue, chroma and
the warm/cool basin all come from the live `recipe_geometry` module, and the
monotonicity guard is the engine's own static method. If the geometry moves,
these numbers move with it, which is the point.

Detection is not involved. This is the DB × edge-table population, which is
why the rates differ from MERGED's served-slot figures (21.55% here vs
44.44% of real served warm bases): the served population is filtered by what
the extractor actually returns. Both are real; do not quote one as the other.

What would make a claim from this file fail:
  * Quoting `warm_cooler_highlight_pct` as if it covered served recipes.
  * Reading `both_candidates_cooler` as fixable by C4.1 — it is the floor.
"""

from __future__ import annotations

from collections import Counter
from typing import Any

import numpy as np

from benchmarks.engine_load import get_engine
from core import recipe_geometry as rg
from core.colour_maths import lab_to_oklab
from core.schemestealer_engine import SchemeStealerEngine

# Bases below this OKLab chroma have no meaningful hue, so "the highlight went
# cooler" is not a claim worth making about them. The value is pinned, not
# chosen freely: it is the one that reproduces the audit's warm-base
# population of 747 exactly, and with it all four of the plan's recipe
# baselines land to the last digit (161 / 59 / 75).
#
# Sensitivity, measured on this DB — the metric IS floor-dependent, so the
# number must never be quoted without it:
#     floor 0.000 -> 809 warm, 188 cooler, 73 both, 85 chroma-loss
#     floor 0.020 -> 747 warm, 161 cooler, 59 both, 75 chroma-loss   <- pinned
#     floor 0.040 -> 637 warm, 121 cooler, 44 both, 52 chroma-loss
#
# 0.02 is also `recipe_geometry._MIN_STEP_OK` and half of `_CHROMA_FULL_OK`,
# below which `_hue_shift_deg`'s own chroma ramp has faded the rotation to
# less than half strength. It is NOT imported from either: they mean different
# things (a lightness step and a ramp knee), and a future tweak to one must
# not silently move this population.
_WARM_MIN_CHROMA_OK = 0.02

# How much of the base's OKLab chroma a highlight may lose before it counts as
# washed out. AK Ice Yellow -> White is -89.8% (MERGED O-E4).
_CHROMA_LOSS_FRACTION = 0.5

_HUE_RELS = ("highlight", "shade")


def _oklch(lab) -> tuple[float, float, float]:
    """(hue°, chroma, L) in OKLab via the canonical conversion."""
    ok = lab_to_oklab(np.asarray(lab, dtype=float))
    return (rg.hue_angle_deg(float(ok[1]), float(ok[2])),
            rg.chroma(float(ok[1]), float(ok[2])),
            float(ok[0]))


def _is_warm(hue_deg: float) -> bool:
    """The warm basin exactly as `_hue_shift_deg` defines it (`:179`) — the
    side of the watersheds whose pole is yellow. Reusing the module's own test
    means a change to the poles reclassifies the population here too."""
    return hue_deg < rg._WATERSHED_A_DEG or hue_deg > rg._WATERSHED_B_DEG


def _is_cooler(h_from: float, h_to: float) -> bool:
    """True when the base -> highlight rotation OPPOSES the rotation geometry
    wants for that base.

    Not "further from the pole in absolute terms": for a base already sitting
    at the yellow pole, geometry rotates by zero, and any rotation at all is
    then trivially "further" — which would make the metric fire on paints
    nothing could improve. The signed test asks the question C4.1 can actually
    answer: did the sort pick an edge on the wrong side?
    """
    want = rg._angular_diff(h_from, rg._YELLOW_POLE_DEG)
    got = rg._angular_diff(h_from, h_to)
    return (got * want) < 0.0


def run_recipes() -> dict[str, Any]:
    engine = get_engine()
    graph = engine.recipe_graph
    paints = engine._paints_by_id
    # No public accessor for the per-key candidate lists; `get_edge` covers the
    # chosen edge only and the "both candidates cooler" floor needs all of them.
    index = graph._index

    per_key_candidates = Counter(len(edges) for edges in index.values())
    sources = Counter(e.source for edges in index.values() for e in edges)
    keys_by_rel = Counter(rel for (_fid, rel) in index)

    n_warm = 0
    n_cooler = 0
    n_all_cooler = 0
    n_chroma_loss = 0

    for (from_id, rel), candidates in index.items():
        if rel != "highlight":
            continue
        base = paints.get(from_id)
        if base is None or base.lab is None:
            continue
        h0, c0, _l0 = _oklch(base.lab)
        if c0 < _WARM_MIN_CHROMA_OK or not _is_warm(h0):
            continue
        n_warm += 1

        edge = graph.get_edge(base, "highlight")
        chosen = paints.get(edge.to_id) if edge is not None else None
        if chosen is not None and chosen.lab is not None:
            h1, c1, _l1 = _oklch(chosen.lab)
            if _is_cooler(h0, h1):
                n_cooler += 1
            if c1 < _CHROMA_LOSS_FRACTION * c0:
                n_chroma_loss += 1

        cooler_flags = []
        for cand in candidates:
            target = paints.get(cand.to_id)
            if target is None or target.lab is None:
                continue
            hc, _cc, _lc = _oklch(target.lab)
            cooler_flags.append(_is_cooler(h0, hc))
        if cooler_flags and all(cooler_flags):
            n_all_cooler += 1

    # The live guard, not a copy of it. Sees exactly one edge per key, which is
    # what `_recipe_partner` consults.
    n_guarded = 0
    n_inversions = 0
    for (from_id, rel) in index:
        if rel not in _HUE_RELS:
            continue
        base = paints.get(from_id)
        edge = graph.get_edge(base, rel) if base is not None else None
        target = paints.get(edge.to_id) if edge is not None else None
        if base is None or target is None:
            continue
        n_guarded += 1
        if not SchemeStealerEngine._monotonic_ok(rel, base.lab, target):
            n_inversions += 1

    def _pct(num: int, den: int) -> float | None:
        return None if not den else round(100.0 * num / den, 2)

    return {
        "warm_min_chroma_ok": _WARM_MIN_CHROMA_OK,
        "n_keys": len(index),
        "keys_by_rel": dict(sorted(keys_by_rel.items())),
        "candidates_per_key": {str(k): v for k, v in sorted(per_key_candidates.items())},
        "edge_sources": dict(sorted(sources.items())),
        "n_edges": sum(sources.values()),
        "warm_bases_with_highlight": n_warm,
        "warm_cooler_highlight": n_cooler,
        "warm_cooler_highlight_pct": _pct(n_cooler, n_warm),
        # The unfixable floor: every candidate edge on the key is cooler, so no
        # re-sort of the existing table can help. C4.1 must not claim otherwise.
        "both_candidates_cooler": n_all_cooler,
        "both_candidates_cooler_pct": _pct(n_all_cooler, n_warm),
        "chroma_loss_gt50": n_chroma_loss,
        "chroma_loss_gt50_pct": _pct(n_chroma_loss, n_warm),
        "monotonic_guarded_keys": n_guarded,
        "monotonic_inversions": n_inversions,
    }
