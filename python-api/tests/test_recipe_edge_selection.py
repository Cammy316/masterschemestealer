"""
C4.1 / O-E4 — `RecipeGraph._best_edge` must rank stored candidates with the same
geometry that generated them.

`scripts/generate_algorithmic_edges.py:115` writes the top TWO candidates per
`(from_id, rel)` key, ranked by `recipe_geometry.score_edge`. At runtime
`_best_edge` discarded that ranking and re-picked on `|dL* - IDEAL_DL|` alone —
lightness only, no hue and no chroma — so a warm base could be handed a cooler,
chroma-collapsed highlight (O-E4).

Measured over the live table while writing these tests: all 2,344
algorithmic-only keys hold exactly the generator's top-2, and in all 2,344 the
`score_edge` winner IS the generator's rank-1. The edge data is therefore
consistent with its own generator; the defect is in the consumer.

These tests need the real 1,312-paint DB and the real `recipes.json`. The sibling
`test_recipe_graph.py` deliberately builds synthetic graphs from `tmp_path` and
is kept free of that load; the two files are not redundant.
"""

import json
import os
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from core.recipe_graph import RecipeGraph  # noqa: E402
from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402

# Pinned baselines, measured on `python-api\venv` (skimage 0.24.0) at 6efeeb3 and
# published in benchmarks/out/scoreboard.md. Every one is conditional on the
# warm-base OKLab chroma floor of 0.02 that benchmarks/recipes.py pins.
BASELINE_WARM_BASES = 747
BASELINE_COOLER_PCT = 21.55
BASELINE_CHROMA_LOSS = 75
BASELINE_INVERSIONS = 2


@pytest.fixture(scope="module")
def real_graph():
    """The production edge table over the production paint DB.

    Paints are the minimal view `_best_edge` consults: `paint_id`, `lab`, and
    the name/family used only by these tests' messages.
    """
    records = json.loads((_PY_API / "paints_groundtruth.json").read_text(encoding="utf-8"))
    paints = {
        r["paint_id"]: SimpleNamespace(
            paint_id=r["paint_id"], name=r["name"], lab=r["lab"],
            color_family=(r.get("color_family") or "").lower(),
        )
        for r in records
    }
    return RecipeGraph(paints, str(_PY_API / "recipes.json")), paints


def _recipe_metric_helpers():
    """The bench's own warm/cooler predicates, imported rather than re-derived.

    `benchmarks.engine_load` runs `os.chdir(python-api)` at import time; the
    contract already requires pytest to be run from there, but the cwd is
    restored so this import can never move it for the rest of the session.
    """
    cwd = os.getcwd()
    try:
        from benchmarks.recipes import (  # noqa: PLC0415
            _CHROMA_LOSS_FRACTION, _WARM_MIN_CHROMA_OK, _is_cooler, _is_warm, _oklch,
        )
    finally:
        os.chdir(cwd)
    return _oklch, _is_warm, _is_cooler, _WARM_MIN_CHROMA_OK, _CHROMA_LOSS_FRACTION


# ---------------------------------------------------------------------------
# Named exemplars — the defect in one paint each
# ---------------------------------------------------------------------------
def test_warm_bronze_base_is_not_highlighted_with_a_silver(real_graph):
    """Skullcrusher Brass must highlight to Auric Armour Gold, not Canoptek Alloy.

    Both stored candidates are `algorithmic` at confidence 0.5, so the third sort
    element decides alone. Under `|dL* - 12|` Canoptek Alloy scores 5.25 against
    the gold's 9.20 and wins — a SILVER carrying 29.2% of the base's OKLab chroma
    on a bronze base. `score_edge` scores the gold 0.06924 against the alloy's
    0.09739.

    FAILS IF: the tie-break reverts to `|dL* - ideal|`, or the geometry term is
    computed from something other than the base's own hue (a bare "distance from
    the yellow pole" also prefers the alloy here, because the alloy is the
    lighter of the two).
    """
    graph, paints = real_graph
    edge = graph.get_edge(paints["citadel-skullcrusher-brass"], "highlight")
    assert edge is not None
    assert edge.to_id == "citadel-auric-armour-gold", (
        f"bronze base highlighted to {edge.to_id}"
    )


def test_warm_off_white_keeps_its_chroma_in_the_highlight(real_graph):
    """Pro Acryl Ivory must highlight to Bright Pale Yellow, not Bold Titanium White.

    The two candidates' `|dL* - 12|` differ by **0.01** (1.21 against 1.22), so
    today the choice between a highlight that keeps 167% of the base's OKLab
    chroma and one that keeps 5.2% is decided by a hundredth of a lightness unit.
    `score_edge` scores them 0.02703 against 0.03678.

    FAILS IF: the tie-break reverts to `|dL* - ideal|`. Pin the `paint_id` — three
    records are named "Ivory" across brands.
    """
    graph, paints = real_graph
    edge = graph.get_edge(paints["pro-acryl-ivory"], "highlight")
    assert edge is not None
    assert edge.to_id == "pro-acryl-bright-pale-yellow", (
        f"warm off-white highlighted to {edge.to_id}"
    )


# ---------------------------------------------------------------------------
# The population — the exemplars above must not be the only thing that moved
# ---------------------------------------------------------------------------
def test_warm_base_cooler_highlight_rate_falls_against_the_pinned_baseline(real_graph):
    """Over the whole graph, fewer warm bases get a cooler or washed-out highlight.

    Scores the same population as `benchmarks/recipes.py` — the DB x edge-table,
    NOT the served slots MERGED reports at 44.44% — using the bench's own
    predicates so the two can never drift.

    FAILS IF: a change leaves the sort key alone (the rate stays 21.55%), or
    re-orders only `wash` edges (all 186 wash keys are singletons, so that moves
    nothing at all), or trades hue for monotonicity and pushes inversions above
    the pinned 2 of 2,365.

    This gate is a NET, and the trade is real: 58 warm bases move cooler ->
    warmer and 31 move warmer -> cooler (chroma-loss: 31 fixed, 4 broken). No test
    pins an individual regression, deliberately — pinning one would lock in a
    known-worse outcome. The 31 are enumerated in docs/audit/impl/skeptic-O-E4.md.

    NOT a claim that O-E4 is closed, on two counts. 59 of the 747 warm bases
    (7.90%) have EVERY candidate cooler and are immovable by any re-sort. And this
    is the DB x edge-table population: measured on the five real photographs, the
    served effect is the chroma half only (>50% collapse 12 -> 5 of 89 warm served
    highlight slots; cooler unchanged at 19). Do not quote this rate as the served
    one.
    """
    graph, paints = real_graph
    oklch, is_warm, is_cooler, min_chroma, loss_fraction = _recipe_metric_helpers()

    n_warm = n_cooler = n_chroma_loss = 0
    for (from_id, rel) in graph._index:
        if rel != "highlight":
            continue
        base = paints.get(from_id)
        if base is None or base.lab is None:
            continue
        h0, c0, _ = oklch(base.lab)
        if c0 < min_chroma or not is_warm(h0):
            continue
        n_warm += 1
        edge = graph.get_edge(base, "highlight")
        chosen = paints.get(edge.to_id) if edge is not None else None
        if chosen is None or chosen.lab is None:
            continue
        h1, c1, _ = oklch(chosen.lab)
        if is_cooler(h0, h1):
            n_cooler += 1
        if c1 < loss_fraction * c0:
            n_chroma_loss += 1

    n_inversions = 0
    for (from_id, rel) in graph._index:
        if rel not in ("highlight", "shade"):
            continue
        base = paints.get(from_id)
        edge = graph.get_edge(base, rel) if base is not None else None
        target = paints.get(edge.to_id) if edge is not None else None
        if base is None or target is None:
            continue
        if not SchemeStealerEngine._monotonic_ok(rel, base.lab, target):
            n_inversions += 1

    # The population itself must not have moved — otherwise the rates below are
    # measured against a different denominator than the pinned baseline.
    assert n_warm == BASELINE_WARM_BASES

    cooler_pct = round(100.0 * n_cooler / n_warm, 2)
    assert cooler_pct < BASELINE_COOLER_PCT, (
        f"cooler-highlight rate {cooler_pct}% did not improve on {BASELINE_COOLER_PCT}%"
    )
    assert n_chroma_loss < BASELINE_CHROMA_LOSS, (
        f"{n_chroma_loss} highlights lose >50% chroma, was {BASELINE_CHROMA_LOSS}"
    )
    assert n_inversions <= BASELINE_INVERSIONS, (
        f"monotonicity inversions rose to {n_inversions} from {BASELINE_INVERSIONS}"
    )


# ---------------------------------------------------------------------------
# The guard on the guard
# ---------------------------------------------------------------------------
def test_wash_edges_are_not_scored_as_shades(tmp_path):
    """A `wash` key keeps the lightness tie-break; geometry never sees it.

    `recipe_geometry` only models `highlight` and `shade`: `_hue_shift_deg` and
    `_lightness_delta` both branch on `rel == "highlight"`, so anything else is
    treated as a SHADE — a wash would be scored against a darker, reverse-rotated
    target it was never meant to hit. `_IDEAL_DL` has no `wash` entry, so the
    lightness tie-break for a wash is `|L_to - L_from|`.

    The two candidates here are ordered oppositely by the two metrics: `near` is
    2 L* from the base (the lightness winner) but LIGHTER, which as-a-shade earns
    a large monotonicity penalty; `dark` is 12 L* away (the lightness loser) but
    is what `score_edge` would pick if the guard were dropped.

    FAILS IF: the `rel in {"highlight", "shade"}` guard is removed from
    `_best_edge`'s sort key — `dark` then wins.

    Note the honest bound: all 186 real wash keys hold exactly ONE candidate, so
    this guard changes no production outcome today. It exists so that adding a
    second wash edge later cannot silently route it through shade geometry.
    """
    paints = {
        "base": SimpleNamespace(paint_id="base", lab=[50.0, 20.0, 10.0], name="base"),
        "near": SimpleNamespace(paint_id="near", lab=[52.0, 20.0, 10.0], name="near"),
        "dark": SimpleNamespace(paint_id="dark", lab=[38.0, 20.0, 10.0], name="dark"),
    }
    recipes = {"version": 1, "edges": [
        {"from_id": "base", "to_id": "near", "rel": "wash",
         "source": "manual", "confidence": 0.9},
        {"from_id": "base", "to_id": "dark", "rel": "wash",
         "source": "manual", "confidence": 0.9},
    ]}
    f = tmp_path / "recipes.json"
    f.write_text(json.dumps(recipes), encoding="utf-8")
    graph = RecipeGraph(paints, str(f))

    edge = graph.get_edge(paints["base"], "wash")
    assert edge is not None
    assert edge.to_id == "near", "wash edge was ranked by shade geometry"
