"""
DEC-8 — the wash slot must not publish a match score.

WHY THIS MATTERS (the intent these tests encode).

The wash is chosen by FAMILY ARCHETYPE, never by colour: `config.WashMapping`
maps white -> ['dark'], so a white card is correctly washed with Nuln Oil. That
is right, because a wash is a glaze that goes OVER the base and its job is to
pool in recesses, not to match the surface. The code then scored the wash
paint's own hex against the CARD colour and published it as `deltaE` — a
category error. It is the same field name the base slot uses for a genuine
CIEDE2000 match distance, so one name carried two incommensurable quantities.

Measured on the five bench photographs x six brands (198 served wash slots,
2026-08-19): median 27.1, min 5.1, max 76.6, and **44.9% exceed 30** — beyond
the matcher's own BASE_MATCH_DELTA_E_CEILING entirely, which proves the number
was never a gated match distance. Directly: a white card at LAB [95, 0, 0]
returns Nuln Oil at 90.1 and Vallejo Black at 93.3.

This does not hide a ΔE (invariant 10). It removes a number that was never a ΔE
against the thing the field name claims. The base slot's real match distance is
untouched, and it is the only one the badge ever showed
(`lib/deltaE.ts` shouldShowDeltaBadge).

TWO PATHS FILL THE WASH SLOT and both had to be fixed. Measured over the same
198 slots: 164 came from the WashMapping fallback (`get_wash_for_family` ->
`_wash_result`) and **34 came from the graph edge** (`format_paint_match`, via
`build_paint_recipe:157`). Fixing only `_wash_result` would have left 17% of
served wash slots still publishing a score.
"""

import sys
from pathlib import Path

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from config import WashMapping  # noqa: E402
from core.colour_maths import ciede2000_single, rgb_to_lab  # noqa: E402
from services.recipe_builder import (  # noqa: E402
    build_paint_recipe,
    get_wash_for_family,
    hex_to_rgb,
)

# A white card. Its archetype wash is a near-black — that is the whole point.
_WHITE_CARD_LAB = [95.0, 0.0, 0.0]

_CITADEL_DARK_WASH = {
    "brand": "Citadel", "name": "Nuln Oil", "hex": "#14100e", "category": "shade",
}


def test_wash_from_the_mapping_fallback_carries_no_match_score():
    """The 164-of-198 path: no graph edge, so `get_wash_for_family` resolves the
    archetype and `_wash_result` formats it.

    FAILS IF: `_wash_result` sets `deltaE` again. Fails today — before this
    commit the same call returns `deltaE: 90.1` for a white card.
    """
    wash = get_wash_for_family("white", "Citadel", _WHITE_CARD_LAB,
                               [_CITADEL_DARK_WASH])

    assert wash is not None and wash["name"] == "Nuln Oil"
    assert "deltaE" not in wash, (
        f"the wash slot published a match score again: {wash.get('deltaE')!r}. "
        "The wash is picked by family archetype, not by colour — scoring its "
        "own hex against the card is a category error (DEC-8 / O-F4)."
    )


def test_wash_from_a_graph_edge_carries_no_match_score():
    """The 34-of-198 path: the engine resolved a wash through the recipe graph,
    so `build_paint_recipe` formats it with `format_paint_match` instead.

    This is the path the DEC-8 brief missed — it named `_wash_result` as "the
    wash-only one", but `format_paint_match` serves the wash slot too
    (`recipe_builder.py:157`) alongside base/highlight/shade.

    FAILS IF: the wash branch of `build_paint_recipe` stops suppressing the
    score — e.g. someone drops the `is_wash` argument at the call site. Fails
    today: before this commit the graph wash carries `deltaE: 90.1`.
    """
    recipe = {
        "base": {"Citadel": {"name": "White Scar", "hex": "#F2F2F0",
                             "type": "base", "color_family": "white"}},
        "wash": {"Citadel": {"name": "Nuln Oil", "hex": "#14100e", "type": "wash",
                             "color_family": "black", "source": "official"}},
    }
    out = build_paint_recipe(recipe, "white", _WHITE_CARD_LAB, [])

    wash = out["citadel"]["wash"]
    assert wash["name"] == "Nuln Oil"
    assert wash["source"] == "official"      # provenance is kept; only the score goes
    assert "deltaE" not in wash, (
        f"the graph-resolved wash published a match score: {wash.get('deltaE')!r}"
    )


def test_base_highlight_and_shade_keep_their_match_score():
    """The counterpart guard, and the reason DEC-8 is surgical rather than a
    blanket deletion.

    Only the WASH slot is a category error. base/highlight/shade are scored
    against a colour the user can reason about (the base slot's is a genuine
    match distance and is the one the badge shows), so they must keep the field.

    FAILS IF: `format_paint_match` stops computing `deltaE` for every caller —
    i.e. the field is removed one level too high, stripping the base badge with
    it. That is the most likely way to over-apply this commit.
    """
    recipe = {
        "base": {"Citadel": {"name": "Mephiston Red", "hex": "#9A1115",
                             "type": "base", "color_family": "red"}},
        "highlight": {"Citadel": {"name": "Evil Sunz Scarlet", "hex": "#C2191F",
                                  "type": "layer", "color_family": "red",
                                  "source": "official"}},
        "shade": {"Citadel": {"name": "Khorne Red", "hex": "#6B0F0F",
                              "type": "base", "color_family": "red",
                              "source": "computed"}},
    }
    out = build_paint_recipe(recipe, "red", [32, 53, 37], [])
    cit = out["citadel"]

    for slot in ("base", "highlight", "shade"):
        assert "deltaE" in cit[slot], (
            f"the {slot} slot lost its match score — DEC-8 removes the wash's "
            "score only"
        )
    assert isinstance(cit["base"]["deltaE"], float)


def test_the_wash_is_chosen_by_archetype_and_is_nowhere_near_the_card():
    """Encodes WHY the score was meaningless, not merely that it is gone.

    The white -> 'dark' archetype means the served wash sits further from the
    card than the matcher's own ceiling would ever permit a base match to be.
    A number that routinely exceeds the ceiling of the vocabulary it is
    rendered in is not a match distance.

    FAILS IF: the wash slot is ever made colour-selected — the distance would
    collapse toward the ceiling and this assertion would break, which is the
    correct alarm. It would also fail if WashMapping stopped sending white to a
    dark archetype.
    """
    assert WashMapping.archetypes_for_family("white") == ["dark"]

    wash = get_wash_for_family("white", "Citadel", _WHITE_CARD_LAB,
                               [_CITADEL_DARK_WASH])
    distance = ciede2000_single(
        rgb_to_lab(hex_to_rgb(wash["hex"])), _WHITE_CARD_LAB)

    # BASE_MATCH_DELTA_E_CEILING is 30.0; this is triple it.
    assert distance > 60.0, (
        f"the archetype wash is only {distance:.1f} from the card — if the wash "
        "became colour-selected, DEC-8's premise needs re-deciding"
    )
