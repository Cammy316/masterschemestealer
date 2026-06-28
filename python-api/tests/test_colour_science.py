"""
Unit tests for colour-science helpers and detection logic.

Run from the python-api directory:
    pytest tests/test_colour_science.py -v
"""

import sys
from pathlib import Path

import numpy as np
import pytest

# Ensure python-api root is importable.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.colour_maths import ciede2000_single, circular_mean_hue
from utils.helpers import apply_white_balance
from core.color_engine import ColorAnalyzer


# ============================================================================
# ciede2000_single — Sharma 2005 test pairs (tolerances ±0.01)
# ============================================================================

# Selected pairs from G. Sharma, W. Wu, E. N. Dalal, "The CIEDE2000
# Color-Difference Formula", Color Research & Application, 2005.
SHARMA_PAIRS = [
    # (LAB1, LAB2, expected_dE)
    ((50.0000,  2.6772, -79.7751), (50.0000,  0.0000, -82.7485), 2.0425),
    ((50.0000,  3.1571, -77.2803), (50.0000,  0.0000, -82.7485), 2.8615),
    ((50.0000,  2.8361, -74.0200), (50.0000,  0.0000, -82.7485), 3.4412),
    ((50.0000, -1.3802,  -84.2814), (50.0000,  0.0000, -82.7485), 1.0000),
    ((50.0000, -1.1848,  -84.8006), (50.0000,  0.0000, -82.7485), 1.0000),
    ((50.0000, -0.9009,  -85.5211), (50.0000,  0.0000, -82.7485), 1.0000),
]


@pytest.mark.parametrize("lab1,lab2,expected", SHARMA_PAIRS)
def test_ciede2000_sharma_pairs(lab1, lab2, expected):
    result = ciede2000_single(lab1, lab2)
    assert abs(result - expected) < 0.02, (
        f"Expected ΔE≈{expected}, got {result:.4f}"
    )


def test_ciede2000_identical_colours():
    """Zero distance for identical colours."""
    assert ciede2000_single([50, 20, -10], [50, 20, -10]) == pytest.approx(0.0, abs=1e-6)


def test_ciede2000_symmetric():
    """Distance is symmetric."""
    a, b = [60, 10, 30], [50, -5, 20]
    assert ciede2000_single(a, b) == pytest.approx(ciede2000_single(b, a), abs=1e-9)


# ============================================================================
# circular_mean_hue — boundary case
# ============================================================================

def test_circular_hue_red_boundary():
    """Cluster spanning 350°–10° should average near 0° (red), not 180° (cyan)."""
    # Hues in [0, 1): 350° → 350/360, 10° → 10/360
    hues = np.array([350 / 360, 355 / 360, 0 / 360, 5 / 360, 10 / 360])
    mean_hue = circular_mean_hue(hues)
    mean_deg = mean_hue * 360
    # Must be in the red zone (< 15° or > 345°), not cyan (~180°)
    assert mean_deg < 15 or mean_deg > 345, (
        f"Expected red-zone hue, got {mean_deg:.1f}°"
    )


def test_circular_hue_blue_unambiguous():
    """Cluster entirely in blue zone should average to blue."""
    hues = np.linspace(190 / 360, 230 / 360, 50)
    mean_hue = circular_mean_hue(hues)
    mean_deg = mean_hue * 360
    assert 190 < mean_deg < 230, f"Expected blue-zone hue, got {mean_deg:.1f}°"


def test_circular_hue_uniform():
    """Uniformly-distributed hues should average near 0 or 1 (undefined, not crash)."""
    hues = np.linspace(0, 1, 360, endpoint=False)
    result = circular_mean_hue(hues)
    assert 0.0 <= result < 1.0


# ============================================================================
# apply_white_balance — Shades-of-Grey
# ============================================================================

def test_white_balance_grey_stays_grey():
    """A perfectly neutral grey image should remain grey after white balance."""
    grey = np.full((50, 50, 3), 128, dtype=np.uint8)
    result = apply_white_balance(grey)
    diff = np.abs(result.astype(int) - grey.astype(int))
    assert diff.max() <= 3, "Grey image drifted by more than 3 DN after white balance"


def test_white_balance_warm_cast_neutralises():
    """An orange-cast image should become more neutral (R-B gap should shrink)."""
    warm = np.zeros((50, 50, 3), dtype=np.uint8)
    warm[:, :, 0] = 200  # strong red
    warm[:, :, 1] = 140  # moderate green
    warm[:, :, 2] = 80   # weak blue

    result = apply_white_balance(warm)
    original_rb_gap = int(warm[0, 0, 0]) - int(warm[0, 0, 2])
    corrected_rb_gap = int(result[0, 0, 0]) - int(result[0, 0, 2])
    assert corrected_rb_gap < original_rb_gap, (
        f"Warm cast not reduced: original R-B gap={original_rb_gap}, "
        f"corrected={corrected_rb_gap}"
    )


def test_white_balance_alpha_mask_respected():
    """With an alpha mask, illuminant is estimated only over opaque pixels."""
    # Create a blue image (background) with a red foreground square.
    img = np.zeros((60, 60, 3), dtype=np.uint8)
    img[:, :, 2] = 200          # blue background
    img[20:40, 20:40, 0] = 200  # red foreground square
    img[20:40, 20:40, 2] = 0

    alpha = np.zeros((60, 60), dtype=np.uint8)
    alpha[20:40, 20:40] = 255   # only foreground is opaque

    # With mask: illuminant estimated from red pixels only — output should
    # not crash and should differ from the no-mask version.
    result_masked = apply_white_balance(img, alpha_mask=alpha)
    result_full = apply_white_balance(img)

    assert result_masked.shape == img.shape
    assert not np.array_equal(result_masked, result_full), (
        "Masked and unmasked white balance produced identical output "
        "(mask may not be respected)"
    )


# ============================================================================
# Metallic detection — flat dark grey must NOT be flagged metallic
# ============================================================================

def test_metallic_flat_dark_grey_is_not_metallic():
    """A flat dark-grey swatch (#3a3a3c) must not trigger metallic detection.

    Before the fix, is_dark_gunmetal fired on any dark desaturated surface
    regardless of brightness variance.
    """
    import colorsys

    # Build a 100-pixel cluster of near-constant dark-grey pixels.
    # HSV: hue=0, sat≈0.01, val≈0.24 — achromatic, no texture.
    r, g, b = 0x3a / 255, 0x3a / 255, 0x3c / 255
    h, s, v = colorsys.rgb_to_hsv(r, g, b)

    n = 200
    rng = np.random.default_rng(42)
    # Tiny random variation (brightness_std will be well below 18).
    noise = rng.normal(0, 0.002, (n, 3))
    pixels_hsv = np.clip(
        np.tile([h, s, v], (n, 1)) + noise,
        0.0, 1.0
    )

    from core.color_engine import is_metallic_surface
    
    brightness_std = float(np.std(pixels_hsv[:, 2]) * 255.0)
    median_sat = float(np.median(pixels_hsv[:, 1]))
    median_val = float(np.median(pixels_hsv[:, 2]))
    
    is_metallic = is_metallic_surface(brightness_std, median_sat, median_val)
    assert not is_metallic, "Flat dark grey incorrectly flagged as metallic"


# ============================================================================
# PaintMatcher — type/category mapping regression
# ============================================================================

@pytest.fixture(scope="module")
def paint_matcher_live():
    """Load the real paints_groundtruth.json and build a PaintMatcher.

    Skipped automatically when paints_groundtruth.json is not present (CI without assets).
    """
    import json
    db_path = Path(__file__).resolve().parent.parent / "paints_groundtruth.json"
    if not db_path.exists():
        pytest.skip("paints_groundtruth.json not found — skipping live matcher tests")

    from core.color_engine import Paint, PaintMatcher

    with open(db_path, encoding="utf-8") as f:
        raw = json.load(f)

    paint_db = []
    for p in raw:
        paint = Paint(
            name=p["name"],
            brand=p["brand"],
            hex=p["hex"],
            type=p.get("type", p.get("category", "paint")),
            color_family=p.get("color_family", ""),
            category=p.get("category", ""),
            finish=p.get("finish", ""),
            transparency=float(p.get("transparency", 0.0)),
        )
        paint.compute_properties()
        paint_db.append(paint)

    return PaintMatcher(paint_db)


_MID_RED_RGB = np.array([154, 17, 21], dtype=np.uint8)
# Scale75 was dropped from the ground-truth DB (Prompt 7) — retired here.
_BRANDS = ["Citadel", "Vallejo", "Army Painter"]

# role='dominant' maps to base/layer/air/contrast (contrast is penalised but eligible).
_DOMINANT_CATS = {"base", "layer", "air", "contrast"}
# role='wash' (formerly paint_type='wash') maps to wash/shade/ink.
_WASH_CATS = {"wash", "shade", "ink"}


@pytest.mark.parametrize("brand", _BRANDS)
def test_match_color_paint_returns_result(paint_matcher_live, brand):
    """role='dominant' (backward-compat paint_type='paint') must return a non-None match."""
    result = paint_matcher_live.match_color(_MID_RED_RGB, brand, role="dominant")
    assert result is not None, (
        f"match_color returned None for brand={brand!r}, role='dominant'. "
        "Likely ROLE_CATEGORIES mapping is broken."
    )
    assert result.type.lower() in _DOMINANT_CATS, (
        f"Returned paint has unexpected type {result.type!r} for brand={brand!r}"
    )


@pytest.mark.parametrize("brand", _BRANDS)
def test_match_color_wash_returns_wash_category(paint_matcher_live, brand):
    """role='wash' must return a wash/shade/ink category paint."""
    result = paint_matcher_live.match_color(_MID_RED_RGB, brand, role="wash")
    if result is None:
        pytest.skip(f"No wash-category paints for brand={brand!r} — acceptable")
    assert result.type.lower() in _WASH_CATS, (
        f"Returned paint has type {result.type!r}, expected a wash category"
    )
