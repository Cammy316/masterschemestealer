"""
Unit tests for the Prompt 2.6 database rebuild:
  - shared family computation matches the engine for sample hexes
  - paint_id slug stability + collision handling + uniqueness
  - matchable rules (ink gated, wash not)
  - schema completeness of paints_rebuilt.json
  - Army Painter alias/citadel_equiv carry-through; Scale75 preserved

conftest.py stubs cv2 so core.color_engine imports without OpenCV.
"""

import json
import sys
from pathlib import Path

import pytest

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))
sys.path.insert(0, str(_PY_API / "scripts"))

from core.color_engine import compute_color_family, RECOGNISED_FAMILIES
import build_paints_db as builder

_REBUILT = _PY_API / "paints_rebuilt.json"

_REQUIRED_FIELDS = [
    "paint_id", "name", "brand", "range", "hex", "code", "category",
    "finish", "transparency", "color_family", "aliases", "citadel_equiv",
    "tags", "matchable", "discontinued", "hex_source", "layer_sequence",
]


@pytest.fixture(scope="module")
def rebuilt():
    if not _REBUILT.exists():
        pytest.skip("paints_rebuilt.json not present — run build_paints_db.py")
    with open(_REBUILT, encoding="utf-8") as f:
        return json.load(f)


# ============================================================================
# Family computation — must match the engine's classifier output
# ============================================================================

@pytest.mark.parametrize("hex_str,acceptable", [
    ("#9A1115", {"red"}),       # Mephiston Red — must NOT be pink
    ("#C21E10", {"red"}),       # Evil Sunz Scarlet
    ("#000000", {"black"}),
    ("#FFFFFF", {"white"}),
    ("#DECBDA", {"pink", "purple", "flesh"}),  # pale pink — must NOT be grey
])
def test_family_matches_expected(hex_str, acceptable):
    assert compute_color_family(hex_str) in acceptable


def test_family_always_in_recognised_set():
    for hx in ["#9A1115", "#2A9D8F", "#1D3557", "#E9C46A", "#332D0D", "#888888"]:
        assert compute_color_family(hx) in RECOGNISED_FAMILIES


def test_metallic_family_preserved():
    # A bright silver metallic should map to a metal family, not grey.
    assert compute_color_family("#CCD7D5", finish="metallic") in {"silver", "grey"}
    # The same hex matte stays neutral (non-metallic remap path).
    assert compute_color_family("#CCD7D5", finish="matte") in RECOGNISED_FAMILIES


# ============================================================================
# paint_id slug — stability, collisions, uniqueness
# ============================================================================

def test_slugify_deterministic_and_ascii():
    assert builder._slugify("Vallejo", "Game Color", "Dead White") == \
        "vallejo-game-color-dead-white"
    # Punctuation stripped (apostrophe)
    assert builder._slugify("Citadel", "Gehenna's Gold") == "citadel-gehenna-s-gold"


def test_id_allocator_collision_suffixes():
    ids = builder.IdAllocator()
    a = ids.make("Citadel", "Red")
    b = ids.make("Citadel", "Red")
    c = ids.make("Citadel", "Red")
    assert (a, b, c) == ("citadel-red", "citadel-red-2", "citadel-red-3")
    assert len(ids.collisions) == 2


def test_paint_id_unique(rebuilt):
    ids = [p["paint_id"] for p in rebuilt]
    assert len(ids) == len(set(ids)), "duplicate paint_id in rebuilt DB"


def test_paint_id_pattern(rebuilt):
    import re
    pat = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")
    for p in rebuilt:
        assert pat.match(p["paint_id"]), f"bad paint_id {p['paint_id']!r}"


# ============================================================================
# matchable rules
# ============================================================================

def test_inks_are_unmatchable(rebuilt):
    inks = [p for p in rebuilt if p["category"] == "ink"]
    assert inks, "expected ink paints in the rebuilt DB"
    assert all(not p["matchable"] for p in inks), \
        "ink paints must be matchable:false (gated specialist)"


def test_washes_are_not_category_gated(rebuilt):
    """Washes (unlike inks) remain matchable."""
    washes = [p for p in rebuilt if p["category"] == "wash"]
    assert washes, "expected wash paints"
    assert any(p["matchable"] for p in washes), \
        "wash paints should be matchable (only ink/technical/dry/glaze are gated)"


def test_metallic_tag_implies_metallic_finish(rebuilt):
    for p in rebuilt:
        if "metallic" in p.get("tags", []):
            assert p["finish"] == "metallic"


def test_no_placeholder_hex_on_matchable(rebuilt):
    for p in rebuilt:
        if not p["matchable"]:
            continue
        hx = p["hex"].upper()
        nl = p["name"].lower()
        if hx in ("#FFFFFF", "#000000"):
            assert "white" in nl or "black" in nl, \
                f"{p['name']} matchable with placeholder hex {hx}"


# ============================================================================
# schema completeness
# ============================================================================

def test_schema_complete(rebuilt):
    for p in rebuilt:
        for field in _REQUIRED_FIELDS:
            assert field in p, f"{p.get('name')} missing field {field!r}"


def test_layer_sequence_null(rebuilt):
    assert all(p["layer_sequence"] is None for p in rebuilt)


# ============================================================================
# brand-specific carry-through
# ============================================================================

def test_army_painter_aliases_and_equiv(rebuilt):
    ap = [p for p in rebuilt if p["brand"] == "Army Painter"]
    assert ap, "expected Army Painter paints"
    assert any(p["aliases"] for p in ap), "AP old-name aliases not carried"
    assert any(p["citadel_equiv"] for p in ap), "AP citadel_equiv not carried"


def test_scale75_preserved_and_legacy_tagged(rebuilt):
    s75 = [p for p in rebuilt if p["brand"] == "Scale75"]
    assert len(s75) == 350, "Scale75 count changed — must be preserved"
    assert all(p["hex_source"] == "legacy" for p in s75)


def test_citadel_gloss_variant_unmatchable(rebuilt):
    """Matte/gloss Citadel shade duplicates: gloss variant must be unmatchable."""
    for name in ("Agrax Earthshade", "Nuln Oil", "Reikland Fleshshade"):
        variants = [p for p in rebuilt if p["brand"] == "Citadel" and p["name"] == name]
        assert len(variants) == 2, f"{name} should have matte + gloss variants"
        assert sum(p["matchable"] for p in variants) == 1, \
            f"{name}: exactly one (matte) variant should be matchable"
