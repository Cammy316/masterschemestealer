"""
Prompt 7, Issue 1 — regression lock for the detected-colour family display.

The bug: the UI family was taken from the nearest base *paint's* curated
color_family, not the detected *colour's* family. A #c7afbd region (pink) matched
"Mourn Mountain Snow" (white) and showed WHITE; a baby-blue (cyan) matched a
green base and showed GREEN.

These tests assert the displayed family is always the detected colour's canonical
hue_family, regardless of the nearest base paint's family.
"""
from __future__ import annotations

import os
import sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
os.chdir(ROOT)  # so the engine resolves the live DB relative to python-api/

from core.color_engine import compute_color_family  # noqa: E402
from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402

PINK_HEX = "#FFB6C1"   # clear light pink: classifier -> pink
CYAN_HEX = "#9fd4e0"   # baby-blue: classifier -> cyan

_engine = None


def _get_engine() -> SchemeStealerEngine:
    global _engine
    if _engine is None:
        _engine = SchemeStealerEngine()
    return _engine


def _rgb(hexs: str) -> np.ndarray:
    h = hexs.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)])


def test_classifier_fixtures():
    """The canonical classifier is correct for these hexes — it is the source the
    display must use."""
    assert compute_color_family(PINK_HEX, "matte") == "pink"
    assert compute_color_family(CYAN_HEX, "matte") == "cyan"


def test_display_family_is_detected_not_paint():
    """The recipe's 'family' must equal the detected colour's family, never the
    matched base paint's family."""
    eng = _get_engine()
    img = np.full((40, 40, 3), 128, dtype=np.uint8)
    mask = np.ones((40, 40), dtype=bool)
    brands = ["Citadel", "Vallejo"]

    for hexv, fam in [(PINK_HEX, "Pink"), (CYAN_HEX, "Cyan")]:
        color_data = {
            "family": fam,
            "median_rgb": _rgb(hexv),
            "median_hsv": np.array([0.5, 0.2, 0.7]),
            "median_lab": None,
            "coverage": 10.0,
            "brightness_std": 20.0,
            "pixel_indices": None,
            "is_detail": False,
        }
        recipes = eng._build_recipes_with_ml_features([color_data], img, mask, brands, 40, 40)
        assert recipes, f"no recipe produced for {hexv}"
        shown = recipes[0]["family"]
        # The exact bug: nearest base paint can be white/green; the shown family
        # must still be the detected colour's family.
        base_family = None
        for b in brands:
            bm = recipes[0]["base"].get(b)
            if bm and bm.get("color_family"):
                base_family = bm["color_family"]
                break
        assert shown == fam, (
            f"{hexv}: displayed '{shown}' but detected family is '{fam}' "
            f"(nearest base paint family was '{base_family}')"
        )


if __name__ == "__main__":
    test_classifier_fixtures()
    test_display_family_is_detected_not_paint()
    print("Issue 1 family-display regression tests passed.")
