"""
Prompt 5 — recipe graph + geometry tests.

Covers: graph load/validation (unknown ids skipped with a warning), source
selection priority, the shared LAB-geometry scorer (warm reds highlight toward
orange not pink; cool blues toward cyan), candidate eligibility, the wash
fallback chain, and that the shared recipe builder (used by BOTH scanners)
passes the `source` field through.

conftest.py stubs cv2 so the engine modules import without OpenCV.
"""

import sys
import json
import logging
from pathlib import Path
from types import SimpleNamespace

import pytest

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from core.recipe_geometry import PaintNode, score_edge, best_geometric_edges  # noqa: E402
from core.recipe_graph import RecipeGraph  # noqa: E402
from services.recipe_builder import build_paint_recipe  # noqa: E402


def _paint(pid, lab, name=None):
    return SimpleNamespace(paint_id=pid, lab=lab, name=name or pid)


# ---------------------------------------------------------------------------
# Graph load / validation
# ---------------------------------------------------------------------------
def test_graph_skips_unknown_ids(tmp_path, caplog):
    paints = {"a": _paint("a", (40, 50, 30)), "b": _paint("b", (52, 48, 40))}
    recipes = {"version": 1, "edges": [
        {"from_id": "a", "to_id": "b", "rel": "highlight", "source": "citadel_official", "confidence": 1.0},
        {"from_id": "a", "to_id": "ZZZ", "rel": "highlight", "source": "algorithmic", "confidence": 0.5},
    ]}
    f = tmp_path / "recipes.json"
    f.write_text(json.dumps(recipes))

    with caplog.at_level(logging.WARNING):
        g = RecipeGraph(paints, str(f))

    assert g.edge_count() == 1  # the unknown-id edge was skipped
    assert any("unknown id" in r.getMessage().lower() for r in caplog.records)
    assert g.get(paints["a"], "highlight").paint_id == "b"


def test_graph_missing_file_is_not_fatal(tmp_path):
    g = RecipeGraph({"a": _paint("a", (40, 50, 30))}, str(tmp_path / "nope.json"))
    assert g.edge_count() == 0
    assert g.get(_paint("a", (40, 50, 30)), "highlight") is None


# ---------------------------------------------------------------------------
# Selection priority
# ---------------------------------------------------------------------------
def test_selection_priority_official_over_algorithmic(tmp_path):
    paints = {"base": _paint("base", (40, 50, 30)),
              "off": _paint("off", (52, 48, 40)),
              "alg": _paint("alg", (52, 48, 40))}
    recipes = {"version": 1, "edges": [
        {"from_id": "base", "to_id": "alg", "rel": "highlight", "source": "algorithmic", "confidence": 0.9},
        {"from_id": "base", "to_id": "off", "rel": "highlight", "source": "citadel_official", "confidence": 0.5},
    ]}
    f = tmp_path / "r.json"
    f.write_text(json.dumps(recipes))
    g = RecipeGraph(paints, str(f))

    edge = g.get_edge(paints["base"], "highlight")
    assert edge.to_id == "off"          # official wins despite lower confidence
    assert edge.kind == "official"


# ---------------------------------------------------------------------------
# Geometric scorer
# ---------------------------------------------------------------------------
def test_highlight_red_prefers_orange_shifted_over_pink():
    base = (32, 53, 37)        # Mephiston-ish red
    orange_hl = (44, 50, 52)   # lighter + rotated toward yellow (good highlight)
    pink = (72, 30, 2)         # much lighter, wrong hue + chroma
    assert score_edge(base, orange_hl, "highlight") < score_edge(base, pink, "highlight")


def test_highlight_blue_prefers_cyan_shifted():
    base = (28, 9, -40)        # Macragge-ish blue (cool)
    cyan_hl = (40, -5, -30)    # lighter + rotated toward cyan
    warm_wrong = (40, 40, 20)  # lighter but warm/wrong direction
    assert score_edge(base, cyan_hl, "highlight") < score_edge(base, warm_wrong, "highlight")


def test_shade_is_darker():
    base = (50, 40, 30)
    darker = (38, 42, 28)
    lighter = (62, 40, 30)
    assert score_edge(base, darker, "shade") < score_edge(base, lighter, "shade")


def test_best_geometric_eligibility_brand_role_family():
    base = PaintNode("b", "Base", "Citadel", "base", "red", (32, 53, 37))
    pool = [
        PaintNode("h1", "Hl", "Citadel", "layer", "red", (44, 50, 52)),      # eligible
        PaintNode("h2", "Wrong", "Vallejo", "layer", "red", (44, 50, 52)),   # wrong brand
        PaintNode("h3", "Wash", "Citadel", "shade", "red", (44, 50, 52)),    # wrong role
        PaintNode("h4", "Green", "Citadel", "layer", "green", (44, 50, 52)), # non-adjacent family
        PaintNode("h5", "Disc", "Citadel", "layer", "red", (44, 50, 52), discontinued=True),
    ]
    best = best_geometric_edges(base, pool, "highlight", top_n=5)
    assert [n.paint_id for n, _ in best] == ["h1"]


# ---------------------------------------------------------------------------
# Wash fallback chain
# ---------------------------------------------------------------------------
def test_wash_falls_back_to_wash_mapping():
    recipe = {"base": {"Citadel": {"name": "Mephiston Red", "hex": "#9A1115", "type": "base", "color_family": "red"}}}
    wash_db = [{"brand": "Citadel", "name": "Carroburg Crimson", "hex": "#7D1846", "category": "shade"}]
    out = build_paint_recipe(recipe, "red", [32, 53, 37], wash_db)
    assert out["citadel"]["wash"]["name"] == "Carroburg Crimson"


def test_wash_prefers_graph_edge():
    recipe = {
        "base": {"Citadel": {"name": "X", "hex": "#9A1115", "type": "base", "color_family": "red"}},
        "wash": {"Citadel": {"name": "Druchii Violet", "hex": "#2B1A3A", "type": "wash",
                             "color_family": "purple", "source": "official"}},
    }
    out = build_paint_recipe(recipe, "red", [32, 53, 37], [])
    assert out["citadel"]["wash"]["name"] == "Druchii Violet"
    assert out["citadel"]["wash"]["source"] == "official"


# ---------------------------------------------------------------------------
# Source passthrough (both scanners share build_paint_recipe)
# ---------------------------------------------------------------------------
def test_recipe_source_passthrough():
    recipe = {
        "base": {"Citadel": {"name": "Mephiston Red", "hex": "#9A1115", "type": "base", "color_family": "red"}},
        "highlight": {"Citadel": {"name": "Evil Sunz Scarlet", "hex": "#C2191F", "type": "layer",
                                  "color_family": "red", "source": "official"}},
        "shade": {"Citadel": {"name": "Khorne Red", "hex": "#6B0F0F", "type": "base",
                              "color_family": "red", "source": "computed"}},
    }
    out = build_paint_recipe(recipe, "red", [32, 53, 37], [])
    cit = out["citadel"]
    assert cit["highlight"]["source"] == "official"
    assert cit["shade"]["source"] == "computed"
    assert "source" not in cit["base"]  # base slot carries no relationship source
