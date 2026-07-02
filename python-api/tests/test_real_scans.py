"""
Real-photo end-to-end regression tests (production fix).

These run the two photographs that exposed the production metallic
misclassification through the full engine. Synthetic scenes did not catch
the failure — these photos are the permanent guard.

Fixtures (skipped when absent): place the original photos in
    python-api/tests/fixtures/real_scans/capturepink.png   (pink figure)
    python-api/tests/fixtures/real_scans/complex.png       (Black Templars chaplain)
Either raw photos on their studio backgrounds (a foreground mask is derived
from the border colour) or background-removed RGBA exports work.

Requires real OpenCV: run with USE_REAL_CV2=1 (the canonical suite command).
"""

import os
import sys
from pathlib import Path

import numpy as np
import pytest

if not os.environ.get("USE_REAL_CV2"):
    pytest.skip("requires real OpenCV — run the suite with USE_REAL_CV2=1",
                allow_module_level=True)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import cv2  # noqa: E402
from PIL import Image  # noqa: E402

from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402

_FIXTURES = Path(__file__).resolve().parent / "fixtures" / "real_scans"
METAL_FAMILIES = {"silver", "gold", "bronze"}


def _find(name: str):
    for ext in (".png", ".jpg", ".jpeg", ".webp"):
        p = _FIXTURES / f"{name}{ext}"
        if p.exists():
            return p
    return None


def _load_rgba(path: Path) -> np.ndarray:
    """Load as RGBA; if the photo has no meaningful alpha, derive a
    foreground mask from the border colour (studio backdrop)."""
    img = Image.open(path)
    if img.mode == "RGBA":
        rgba = np.asarray(img)
        # Meaningful alpha = some genuinely transparent pixels.
        if (rgba[:, :, 3] < 128).mean() > 0.02:
            return rgba

    rgb = np.asarray(img.convert("RGB"))
    h, w = rgb.shape[:2]
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]], axis=0)
    backdrop = np.median(border.astype(float), axis=0)

    dist = np.linalg.norm(rgb.astype(float) - backdrop, axis=2)
    fg = (dist > 45).astype(np.uint8)

    # Clean up: close pinholes, keep the largest component, fill its holes.
    kernel = np.ones((5, 5), np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, kernel)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(fg, connectivity=8)
    if n > 1:
        largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fg = (labels == largest).astype(np.uint8)
    flood = fg.copy()
    ff_mask = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(flood, ff_mask, (0, 0), 1)
    fg = fg | (1 - flood)   # holes = not-fg and not reachable from the border

    alpha = (fg * 255).astype(np.uint8)
    return np.dstack([rgb, alpha])


@pytest.fixture(scope="module")
def engine():
    return SchemeStealerEngine()


def _scan(engine, name: str):
    path = _find(name)
    if path is None:
        pytest.skip(f"real-photo fixture missing: {_FIXTURES / name}.png")
    rgba = _load_rgba(path)
    recipes, _, _ = engine.analyze_miniature(
        rgba[:, :, :3].copy(), mode="mini", remove_base=True,
        use_awb=True, precomputed_rgba=rgba)
    assert recipes, f"{name}: engine returned no colours"
    return recipes


def _coverage_by_family(recipes) -> dict:
    cov = {}
    for r in recipes:
        fam = (r.get("family") or "").lower()
        cov[fam] = cov.get(fam, 0.0) + float(r.get("dominance", 0.0))
    return cov


def test_pink_figure_dominant_is_pink_not_bronze(engine):
    """The production failure: this photo's dominant colour came back
    'Bronze 56.8%'. The dominant family must be the pink body and metal
    families must stay at trim scale."""
    recipes = _scan(engine, "capturepink")
    cov = _coverage_by_family(recipes)

    dominant = max(cov, key=cov.get)
    assert dominant in {"pink", "magenta"}, (
        f"dominant family {dominant!r} (coverage map: {cov})")

    metal_total = sum(v for f, v in cov.items() if f in METAL_FAMILIES)
    assert metal_total < 15.0, (
        f"metal families at {metal_total:.1f}% on a matte pink figure: {cov}")


def test_complex_figure_is_not_a_silver_blob(engine):
    """The production failure: 'Silver 71.5%' merged from seven scattered
    clusters across black armour, cloak and heraldry. The model is mostly
    black armour with red cloak and metal trim — no single family may
    swallow the model, black must be present, and metals stay trim-scale."""
    recipes = _scan(engine, "complex")
    cov = _coverage_by_family(recipes)

    top_family = max(cov, key=cov.get)
    assert cov[top_family] <= 60.0, (
        f"{top_family!r} swallowed the model at {cov[top_family]:.1f}%: {cov}")

    assert any(f in cov for f in ("black", "grey")), (
        f"black armour not detected: {cov}")

    for metal in METAL_FAMILIES:
        assert cov.get(metal, 0.0) <= 40.0, (
            f"{metal} at {cov.get(metal, 0):.1f}% — trim cannot cover that: {cov}")
