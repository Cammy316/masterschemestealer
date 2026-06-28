"""
Prompt 1.3 — colour classification overhaul regression locks.

Three contracts:
  1. Agreement: compute_color_family() (the DB path) and the scan-time ensemble
     (_classify_family_ensemble_weighted) agree on EVERY swept colour. Both route
     their hue decision through the single canonical color_engine.hue_family(), so
     after consolidation there must be 0 disagreements (the harness reported 1086
     before the fix). Metal overlays (the ensemble may report "gold" for a yellow
     with a gold LAB signature) normalise back to their matte family for the
     comparison, exactly as compute_color_family does for matte paints.
  2. Family regression table: validated hex -> family contract.
  3. Metallic preservation: metallic typing still yields gold/silver, and matte
     paints never carry a metal family.

conftest.py stubs cv2 so the engine imports without OpenCV.
"""

import sys
import colorsys
from pathlib import Path

import numpy as np
import pytest
from skimage import color as skcolor

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from core.color_engine import (  # noqa: E402
    compute_color_family, hue_family, RECOGNISED_FAMILIES, _NON_METALLIC_REMAP,
)
from core.smart_color_system import SmartColorExtractor  # noqa: E402

_METALS = {"gold", "silver", "bronze", "copper"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _hsv_to_hex(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h / 360.0, s, v)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def _hex_to_props(hexv):
    """h_deg, s, v, chroma, lab from a hex — the exact inputs compute_color_family
    derives, so both code paths are compared on identical inputs."""
    h = hexv.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=float)
    rgb01 = rgb / 255.0
    lab = skcolor.rgb2lab(rgb01.reshape(1, 1, 3)).reshape(3)
    hsv = np.array(colorsys.rgb_to_hsv(*rgb01))
    chroma = float(np.sqrt(lab[1] ** 2 + lab[2] ** 2))
    return rgb, hsv, lab, chroma


def _cluster_from_hex(hexv):
    """Minimal cluster dict the ensemble expects, built from a hex."""
    rgb, hsv, lab, chroma = _hex_to_props(hexv)
    return {"median_hsv": hsv, "chroma": chroma,
            "median_lab": lab, "median_rgb": rgb}


def _normalise_family(fam):
    """Collapse a (possibly metal, possibly capitalised) family to the flat matte
    vocabulary, the way compute_color_family does for matte paints."""
    f = fam.lower().split("/")[0].strip()
    return _NON_METALLIC_REMAP.get(f, f)


@pytest.fixture(scope="module")
def extractor():
    return SmartColorExtractor()


# ---------------------------------------------------------------------------
# 1. Agreement test — the consolidation regression lock (must be 0)
# ---------------------------------------------------------------------------

def test_db_and_ensemble_agree_across_sweep(extractor):
    disagreements = []
    for h in range(0, 360, 2):
        for s in (0.25, 0.5, 0.8, 1.0):
            for v in (0.4, 0.7, 0.95):
                hexv = _hsv_to_hex(h, s, v)
                cf = compute_color_family(hexv)
                fam, _conf = extractor._classify_family_ensemble_weighted(
                    _cluster_from_hex(hexv))
                ef = _normalise_family(fam)
                if cf != ef:
                    disagreements.append((hexv, h, s, v, cf, ef))
    assert not disagreements, (
        f"{len(disagreements)} DB/ensemble disagreements (expected 0). "
        f"First few: {disagreements[:10]}"
    )


# ---------------------------------------------------------------------------
# 2. Family regression table — the validated contract
# ---------------------------------------------------------------------------

_FAMILY_TABLE = [
    ("#EF6E2E", "orange"),   # Troll Slayer Orange — Orange now exists (was pink)
    ("#F2792B", "orange"),   # Fire Dragon Bright
    ("#664400", "brown"),    # dark olive → nearest brown exemplar (Stage B)
    ("#665E33", "yellow"),   # olive-yellow (was brown)
    ("#797424", "green"),    # Death/Dead Flesh olive (was brown)
    ("#60664D", "green"),    # yellow-green floor (was bone)
    ("#B2DFD1", "cyan"),     # blue-spike bug (was green)
    ("#3FB8C8", "cyan"),     # cyan regression
    ("#0D407F", "blue"),     # blue regression
    ("#9A1115", "red"),      # Mephiston stays red
    ("#C21E10", "red"),      # Evil Sunz stays red
    ("#DECBDA", "pink"),     # pale mauve → nearest pink exemplar (Stage B fixed it)
    ("#F2C2B6", "pink"),     # pale warm pink
    ("#7D1846", "magenta"),  # deep magenta (was pink)
    ("#90305D", "magenta"),  # magenta
    ("#C9A227", "yellow"),   # non-metallic gold-hue stays yellow
    ("#FFFFFF", "white"),    # white
    ("#231F20", "black"),    # black
    ("#888D8F", "grey"),     # non-metallic leadbelcher -> grey
]


@pytest.mark.parametrize("hexv,expected", _FAMILY_TABLE)
def test_family_regression_table(hexv, expected):
    got = compute_color_family(hexv)
    assert got == expected, f"{hexv}: expected {expected}, got {got}"
    assert got in RECOGNISED_FAMILIES


# ---------------------------------------------------------------------------
# 3. Metallic preservation
# ---------------------------------------------------------------------------

def test_metallic_typing_preserved():
    # Metallic sub-typing is now nearest-exemplar over the metal anchors (gold/
    # silver/bronze are mutually adjacent for matching). Clear cases hold:
    assert compute_color_family("#D4AF37", finish="metallic") == "gold"
    assert compute_color_family("#888D8F", finish="metallic") == "silver"


def test_matte_never_carries_metal_family():
    # A metallic-hued paint with a matte finish must NOT come back as a metal.
    assert compute_color_family("#C39E81") not in _METALS

    # hue_family() itself must never emit a metal family, anywhere in HSV space.
    for h in range(0, 360, 3):
        for s in (0.2, 0.6, 1.0):
            for v in (0.3, 0.6, 0.95):
                hexv = _hsv_to_hex(h, s, v)
                _rgb, hsv, lab, chroma = _hex_to_props(hexv)
                fam = hue_family(hsv[0] * 360, hsv[1], hsv[2], chroma, lab=lab)
                assert fam not in _METALS, f"{hexv} -> {fam}"
                assert fam in RECOGNISED_FAMILIES
"""
Prompt 1.3 — colour classification overhaul regression locks.

Three contracts:
  1. Agreement: compute_color_family() (the DB path) and the scan-time ensemble
     (_classify_family_ensemble_weighted) agree on EVERY swept colour. Both route
     their hue decision through the single canonical color_engine.hue_family(), so
     after consolidation there must be 0 disagreements (the harness reported 1086
     before the fix). Metal overlays (the ensemble may report "gold" for a yellow
     with a gold LAB signature) normalise back to their matte family for the
     comparison, exactly as compute_color_family does for matte paints.
  2. Family regression table: validated hex -> family contract.
  3. Metallic preservation: metallic typing still yields gold/silver, and matte
     paints never carry a metal family.

conftest.py stubs cv2 so the engine imports without OpenCV.
"""

import sys
import colorsys
from pathlib import Path

import numpy as np
import pytest
from skimage import color as skcolor

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from core.color_engine import (  # noqa: E402
    compute_color_family, hue_family, RECOGNISED_FAMILIES, _NON_METALLIC_REMAP,
)
from core.smart_color_system import SmartColorExtractor  # noqa: E402

_METALS = {"gold", "silver", "bronze", "copper"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _hsv_to_hex(h, s, v):
    r, g, b = colorsys.hsv_to_rgb(h / 360.0, s, v)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def _hex_to_props(hexv):
    """h_deg, s, v, chroma, lab from a hex — the exact inputs compute_color_family
    derives, so both code paths are compared on identical inputs."""
    h = hexv.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=float)
    rgb01 = rgb / 255.0
    lab = skcolor.rgb2lab(rgb01.reshape(1, 1, 3)).reshape(3)
    hsv = np.array(colorsys.rgb_to_hsv(*rgb01))
    chroma = float(np.sqrt(lab[1] ** 2 + lab[2] ** 2))
    return rgb, hsv, lab, chroma


def _cluster_from_hex(hexv):
    """Minimal cluster dict the ensemble expects, built from a hex."""
    rgb, hsv, lab, chroma = _hex_to_props(hexv)
    return {"median_hsv": hsv, "chroma": chroma,
            "median_lab": lab, "median_rgb": rgb}


def _normalise_family(fam):
    """Collapse a (possibly metal, possibly capitalised) family to the flat matte
    vocabulary, the way compute_color_family does for matte paints."""
    f = fam.lower().split("/")[0].strip()
    return _NON_METALLIC_REMAP.get(f, f)


@pytest.fixture(scope="module")
def extractor():
    return SmartColorExtractor()


# ---------------------------------------------------------------------------
# 1. Agreement test — the consolidation regression lock (must be 0)
# ---------------------------------------------------------------------------

def test_db_and_ensemble_agree_across_sweep(extractor):
    disagreements = []
    for h in range(0, 360, 2):
        for s in (0.25, 0.5, 0.8, 1.0):
            for v in (0.4, 0.7, 0.95):
                hexv = _hsv_to_hex(h, s, v)
                cf = compute_color_family(hexv)
                fam, _conf = extractor._classify_family_ensemble_weighted(
                    _cluster_from_hex(hexv))
                ef = _normalise_family(fam)
                if cf != ef:
                    disagreements.append((hexv, h, s, v, cf, ef))
    assert not disagreements, (
        f"{len(disagreements)} DB/ensemble disagreements (expected 0). "
        f"First few: {disagreements[:10]}"
    )


# ---------------------------------------------------------------------------
# 2. Family regression table — the validated contract
# ---------------------------------------------------------------------------

_FAMILY_TABLE = [
    ("#EF6E2E", "orange"),   # Troll Slayer Orange — Orange now exists (was pink)
    ("#F2792B", "orange"),   # Fire Dragon Bright
    ("#664400", "brown"),    # dark olive → nearest brown exemplar (Stage B)
    ("#665E33", "yellow"),   # olive-yellow (was brown)
    ("#797424", "green"),    # Death/Dead Flesh olive (was brown)
    ("#60664D", "green"),    # yellow-green floor (was bone)
    ("#B2DFD1", "cyan"),     # blue-spike bug (was green)
    ("#3FB8C8", "cyan"),     # cyan regression
    ("#0D407F", "blue"),     # blue regression
    ("#9A1115", "red"),      # Mephiston stays red
    ("#C21E10", "red"),      # Evil Sunz stays red
    ("#DECBDA", "pink"),     # pale mauve → nearest pink exemplar (Stage B fixed it)
    ("#F2C2B6", "pink"),     # pale warm pink
    ("#7D1846", "magenta"),  # deep magenta (was pink)
    ("#90305D", "magenta"),  # magenta
    ("#C9A227", "yellow"),   # non-metallic gold-hue stays yellow
    ("#FFFFFF", "white"),    # white
    ("#231F20", "black"),    # black
    ("#888D8F", "grey"),     # non-metallic leadbelcher -> grey
]


@pytest.mark.parametrize("hexv,expected", _FAMILY_TABLE)
def test_family_regression_table(hexv, expected):
    got = compute_color_family(hexv)
    assert got == expected, f"{hexv}: expected {expected}, got {got}"
    assert got in RECOGNISED_FAMILIES


# ---------------------------------------------------------------------------
# 3. Metallic preservation
# ---------------------------------------------------------------------------

def test_metallic_typing_preserved():
    # Metallic sub-typing is now nearest-exemplar over the metal anchors (gold/
    # silver/bronze are mutually adjacent for matching). Clear cases hold:
    assert compute_color_family("#D4AF37", finish="metallic") == "gold"
    assert compute_color_family("#888D8F", finish="metallic") == "silver"


def test_matte_never_carries_metal_family():
    # A metallic-hued paint with a matte finish must NOT come back as a metal.
    assert compute_color_family("#C39E81") not in _METALS

    # hue_family() itself must never emit a metal family, anywhere in HSV space.
    for h in range(0, 360, 3):
        for s in (0.2, 0.6, 1.0):
            for v in (0.3, 0.6, 0.95):
                hexv = _hsv_to_hex(h, s, v)
                _rgb, hsv, lab, chroma = _hex_to_props(hexv)
                fam = hue_family(hsv[0] * 360, hsv[1], hsv[2], chroma, lab=lab)
                assert fam not in _METALS, f"{hexv} -> {fam}"
                assert fam in RECOGNISED_FAMILIES

def test_kmeans_gamut_breach_handled(extractor):
    # Image filled entirely with pure neon green #00FF00 (impossible in physical paint gamut)
    img = np.zeros((50, 50, 3), dtype=np.uint8)
    img[:, :, 1] = 255
    
    mask = np.ones((50, 50), dtype=bool)
    clusters = extractor.extract_colors(img, mask)
    assert len(clusters) > 0
    c = clusters[0]
    
    # The family classifier mathematically snapped the out-of-gamut cluster
    # to the nearest physical representation (green).
    assert c["family"].lower() == "green"
