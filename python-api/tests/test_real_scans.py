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
    foreground mask with grabCut (the prod flow uses ML background removal —
    a naive border-colour threshold leaks gradient backdrops and enclosed
    background between limbs into the foreground, corrupting coverage)."""
    img = Image.open(path)
    if img.mode == "RGBA":
        rgba = np.asarray(img)
        # Meaningful alpha = some genuinely transparent pixels.
        if (rgba[:, :, 3] < 128).mean() > 0.02:
            return rgba

    rgb = np.asarray(img.convert("RGB"))
    h, w = rgb.shape[:2]

    gc_mask = np.zeros((h, w), np.uint8)
    rect = (int(w * 0.04), int(h * 0.04), int(w * 0.92), int(h * 0.92))
    bgd, fgd = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
    cv2.grabCut(cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR), gc_mask, rect,
                bgd, fgd, 5, cv2.GC_INIT_WITH_RECT)
    fg = np.where((gc_mask == cv2.GC_FGD) | (gc_mask == cv2.GC_PR_FGD),
                  1, 0).astype(np.uint8)

    # Keep the largest component only (no hole filling: enclosed background
    # between limbs/weapons is genuine background).
    n, labels, stats, _ = cv2.connectedComponentsWithStats(fg, connectivity=8)
    if n > 1:
        largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fg = (labels == largest).astype(np.uint8)

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
    'Bronze 56.8%'. The dominant CHROMATIC family must be the pink body and
    metal families must stay at trim scale. (Neutral families are excluded
    from the dominance check: the fixture's derived mask keeps slivers of
    studio backdrop and rock base that the app's ML background removal
    would strip.)"""
    recipes = _scan(engine, "capturepink")
    cov = _coverage_by_family(recipes)

    chromatic = {f: v for f, v in cov.items()
                 if f not in {"grey", "white", "black", "bone"}}
    assert chromatic, f"no chromatic families detected: {cov}"
    dominant = max(chromatic, key=chromatic.get)
    assert dominant in {"pink", "magenta"}, (
        f"dominant chromatic family {dominant!r} (coverage map: {cov})")
    assert cov.get("pink", 0) + cov.get("magenta", 0) >= 20.0, (
        f"pink body under-detected: {cov}")

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
