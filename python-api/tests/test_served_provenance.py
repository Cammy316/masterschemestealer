"""
DEC-2 — the served paint dict must carry `color_source`.

WHY THIS MATTERS.

C4.7 made the field honest INTERNALLY: `paints_groundtruth.json`'s 1,216
`swatch-median` / 96 `assumed` split now survives the load instead of every
record being relabelled `measured`. But it stopped at the engine. Measured
2026-08-19 against the live API, `color_source` appeared **0 times** in scan
responses — `/api/paints` carries it only because that endpoint serves the raw
JSON. So the split was honest in memory and invisible to the user.

96 of 1,312 paints have no measured colour at all; their LAB is inferred, not
photographed. And they are not 96 independent guesses: **12 hex values are each
carried by 2+ assumed records, covering 68 of the 96 (71%)** — `#63493c` is
shared by 17 paints across four brands, `#1ba169` by 9, `#ca6c4d` by 7. Several
distinct washes therefore ship the same colour and each gets its own
independently formatted recommendation.

This QUALIFIES a number, it does not hide one (invariant 10). The ΔE badge and
every recipe are unchanged; the card gains a marker saying which colours are
estimated. Combined with DEC-8 — which removed the wash slot's meaningless match
score — the wash row loses a number that meant nothing and gains a qualifier
that means something.

`test_paint_provenance.py` covers the LOAD. This file covers what is SERVED.
"""

import sys
from collections import Counter
from pathlib import Path

import pytest

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402
from services.recipe_builder import build_paint_recipe  # noqa: E402


@pytest.fixture(scope="module")
def engine():
    return SchemeStealerEngine()


def _first(engine, predicate):
    for p in engine.paint_db:
        if predicate(p):
            return p
    raise AssertionError("no paint matched the predicate")


# ---------------------------------------------------------------------------
# The API payload, not the engine dict
# ---------------------------------------------------------------------------
#
# These assert through `build_paint_recipe`, which is what the scanner services
# actually return. That distinction is not pedantry: `format_paint_match`
# rebuilds the payload from scratch and copies named fields, so a value present
# on the engine's dict but not copied there reaches nobody. An earlier draft of
# this commit tested `_format_paint` alone, passed, and shipped a field the API
# still dropped — the audit's own recurring failure class, measuring a
# population the pipeline does not serve.


def test_a_served_base_slot_reports_measured_provenance(engine):
    """A base paint's recipe slot reaches the API saying its colour was measured.

    FAILS TODAY: neither `_format_paint` nor `format_paint_match` emits the key,
    so it is absent from every slot of every scan response — verified live,
    `color_source` appeared 0 times.

    FAILS AFTER IF: the field is dropped from either builder, or hardcoded to
    'assumed' — which would mark all 1,312 paints and make the marker useless.
    """
    base = _first(engine, lambda p: p.color_source == "swatch-median")
    recipe = {"base": {"Citadel": engine._format_paint(base)}}

    out = build_paint_recipe(recipe, base.color_family, list(base.lab), [])

    assert out["citadel"]["base"]["color_source"] == "swatch-median"


def test_a_served_wash_slot_reports_assumed_provenance_on_both_paths(engine):
    """A wash reaches the API saying its colour was never measured — via the
    graph edge AND via the WashMapping fallback.

    The wash slot has two builders (the same split DEC-8 had to fix): 34 of 198
    served wash slots come from `format_paint_match` and 164 from
    `_wash_result`. Fixing one would leave the marker rendering on a sixth of
    wash rows and absent on the rest, which is worse than not marking at all —
    an inconsistent qualifier reads as a property of the paint.

    FAILS AFTER IF: either builder stops carrying the field.
    """
    wash = _first(engine, lambda p: p.color_source == "assumed")

    # Path 1 — the engine resolved a wash through the recipe graph.
    graph = {
        "base": {"Citadel": {"name": "X", "hex": "#9A1115", "type": "base",
                             "color_family": "red"}},
        "wash": {"Citadel": engine._format_paint(wash, is_wash=True)},
    }
    out = build_paint_recipe(graph, "red", [32, 53, 37], [])
    assert out["citadel"]["wash"]["color_source"] == "assumed", "graph wash path"

    # Path 2 — no graph edge, so get_wash_for_family resolves the archetype from
    # the raw DB records.
    raw = {"brand": "Citadel", "name": "Nuln Oil", "hex": "#14100e",
           "category": "shade", "color_source": "assumed"}
    fallback = {"base": {"Citadel": {"name": "X", "hex": "#F2F2F0", "type": "base",
                                     "color_family": "white"}}}
    out = build_paint_recipe(fallback, "white", [95.0, 0.0, 0.0], [raw])
    assert out["citadel"]["wash"]["name"] == "Nuln Oil"
    assert out["citadel"]["wash"]["color_source"] == "assumed", "fallback wash path"


def test_the_marker_must_key_on_provenance_and_not_on_category(engine):
    """States the property the frontend must implement, and why keying on
    `category in (wash, shade, ink)` would be right today by accident.

    All 96 assumed records are currently wash/shade/ink, so the two rules agree
    on every paint in the DB right now. They stop agreeing the moment a single
    wash is measured — and measuring the washes is exactly what the accuracy
    roadmap intends. A category-keyed marker would then label a genuinely
    measured wash "estimated" forever, and would silently mislabel any future
    assumed base.

    FAILS IF: the DB gains a measured wash (the assertion below stops holding),
    which is the correct alarm — it means the frontend's rule must already be
    provenance-keyed, and this test is where that is recorded.
    """
    by_source = Counter(p.color_source for p in engine.paint_db)
    assert by_source == Counter({"swatch-median": 1216, "assumed": 96})

    # The two rules agree TODAY. The test exists so the equivalence is written
    # down as a coincidence rather than relied on as a design.
    assumed_ids = {p.paint_id for p in engine.paint_db if p.color_source == "assumed"}
    wash_ids = {p.paint_id for p in engine.paint_db
                if p.category in ("wash", "shade", "ink")}
    assert assumed_ids == wash_ids, (
        "provenance and category have diverged — the frontend marker must key "
        "on color_source, and any category-keyed shortcut is now wrong"
    )


def test_assumed_colours_are_frequently_shared_between_paints(engine):
    """The reason a marker is worth screen space at all.

    The 96 assumed records are not 96 independent estimates: 71% of them share a
    hex with at least one other assumed record, so several distinct washes ship
    the same colour and each gets its own separately formatted recommendation.

    FAILS IF: the DB's assumed colours are ever genuinely re-measured, at which
    point the sharing collapses and DEC-2's justification needs restating.
    """
    assumed = [p for p in engine.paint_db if p.color_source == "assumed"]
    hex_counts = Counter(p.hex.lower() for p in assumed)
    shared = {h: n for h, n in hex_counts.items() if n >= 2}

    covered = sum(shared.values())
    assert len(shared) == 12, f"shared hex values: {len(shared)}"
    assert covered == 68, f"assumed records sharing a hex: {covered} of {len(assumed)}"
    assert max(shared.values()) == 17, "the most-shared hex is carried by 17 paints"
