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


def _assert_no_family_fragmentation(recipes):
    """One painted surface must be ONE card: no family may appear three or
    more times (the prod failure showed Grey x3 / Blue x3, crowding real
    colours out of the five visible slots)."""
    counts = {}
    for r in recipes:
        fam = (r.get("family") or "").lower()
        counts[fam] = counts.get(fam, 0) + 1
    tripled = {f: n for f, n in counts.items() if n >= 3}
    assert not tripled, f"family fragmentation: {tripled} in {counts}"


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


def test_ultramarine_is_one_blue_card(engine):
    """One paint (blue armour + its shading) must be ONE Blue card — the
    prod failure returned three separate Blues. The ramp-aware dedup merges
    a surface's lightness bands; the gun/metals stay their own card."""
    recipes = _scan(engine, "ultra")
    _assert_no_family_fragmentation(recipes)

    majors = [r for r in recipes if not r.get("is_detail")]
    blues = [r for r in majors if (r.get("family") or "").lower() == "blue"]
    assert len(blues) == 1, (
        f"expected exactly one MAJOR Blue card, got {len(blues)}: "
        f"{[(r['family'], round(r.get('dominance', 0), 1)) for r in majors]}")
    assert blues[0].get("dominance", 0) >= 45.0, (
        f"blue armour under-detected: {blues[0].get('dominance'):.1f}%")


def test_pink_figure_is_not_fragmented(engine):
    """No family may fragment into 3+ cards on the pink figure."""
    recipes = _scan(engine, "capturepink")
    _assert_no_family_fragmentation(recipes)


def test_complex_red_cloak_survives_the_top_five(engine):
    """The chaplain's red cloak was detected (conf 0.94) but crowded out of
    the five visible slots by three Grey cards. With ramp consolidation the
    red must sit inside the top five majors."""
    recipes = _scan(engine, "complex")
    _assert_no_family_fragmentation(recipes)

    top5 = [(r.get("family") or "").lower() for r in recipes[:5]]
    assert "red" in top5, f"red cloak missing from the top five: {top5}"


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

def test_complex_neutral_display_labels(engine):
    """The two neutral cards (dark armour, light heraldry) must carry distinct display labels."""
    recipes = _scan(engine, "complex")
    grey_labels = [r.get('family', '') for r in recipes if 'Grey' in r.get('family', '')]
    assert len(set(grey_labels)) >= 2, f"Expected distinct grey display labels, got {grey_labels}"

def test_pinkhorror_union_median_accuracy(engine):
    """pink card's chroma > 15, representing a real bright paint band, not a desaturated average."""
    recipes = _scan(engine, "pinkhorror")
    pink_cards = [r for r in recipes if (r.get("heuristic_family") or "").lower() in {"pink", "magenta"}]
    assert pink_cards, "no pink/magenta cards detected on pinkhorror"

    best_card = max(pink_cards, key=lambda x: x.get("dominance", 0))
    assert best_card.get("chroma", 0) > 15.0, (
        f"Pink card chroma too low ({best_card.get('chroma')} <= 15), union-median failed to preserve saturation."
    )


# ---------------------------------------------------------------------------
# Displayed-response guards: what the USER sees (through _format_results),
# not just what the engine detects. The production regression detected the
# yellow beak but let a manufactured dark 'Brown' card evict it from the
# five displayed colours.
# ---------------------------------------------------------------------------

@pytest.fixture(scope="module")
def scanner():
    from services.miniature_scanner import MiniatureScannerService
    return MiniatureScannerService()


def _load_rgba_keyed(path: Path) -> np.ndarray:
    """Approximate the PRODUCTION input (client-side ML background removal)
    with a border-seeded flood-fill key. grabCut-with-rect (the `_load_rgba`
    loader) keeps large backdrop regions as probable-foreground on these
    studio shots (measured: 61% backdrop on pinkhorror), which fabricates
    grey/white major cards that don't exist in the live flow — useless for
    display-slot assertions. The studio backdrops are smooth, so the flood
    key recovers a near-production mask (verified against the committed
    production scan trace for capturepink)."""
    img = Image.open(path)
    if img.mode == "RGBA":
        rgba = np.asarray(img)
        if (rgba[:, :, 3] < 128).mean() > 0.02:
            return rgba

    rgb = np.asarray(img.convert("RGB"))
    h, w = rgb.shape[:2]
    ff_mask = np.zeros((h + 2, w + 2), np.uint8)
    seeds = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]
    scratch = rgb.copy()
    for seed in seeds:
        if ff_mask[seed[1] + 1, seed[0] + 1]:
            continue
        cv2.floodFill(scratch, ff_mask, seed, 0,
                      loDiff=(10,) * 3, upDiff=(10,) * 3,
                      flags=cv2.FLOODFILL_MASK_ONLY | 8)
    fg = (~ff_mask[1:-1, 1:-1].astype(bool)).astype(np.uint8)
    n, labels, stats, _ = cv2.connectedComponentsWithStats(fg, connectivity=8)
    if n > 1:
        largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
        fg = (labels == largest).astype(np.uint8)

    fraction = fg.mean()
    if not 0.05 <= fraction <= 0.6:
        pytest.skip(f"{path.name}: flood key implausible "
                    f"(foreground {fraction:.0%}) — cannot emulate the "
                    f"production mask for a display-slot assertion")
    return np.dstack([rgb, (fg * 255).astype(np.uint8)])


def _scan_response(scanner, name: str) -> dict:
    path = _find(name)
    if path is None:
        pytest.skip(f"real-photo fixture missing: {_FIXTURES / name}.png")
    rgba = _load_rgba_keyed(path)
    return scanner.scan(Image.fromarray(rgba))


def test_yellow_beak_survives_the_displayed_five(scanner):
    """The figure's beak is a real painted detail (vivid yellow). It must be
    among the displayed colours — the production failure showed Pink,
    Magenta, White, Cyan and a dark shadow 'Brown' instead.

    capturepink only: the pinkhorror fixture is a 225px thumbnail whose beak
    sits below reliable extraction resolution."""
    result = _scan_response(scanner, "capturepink")
    families = [(c.get("family") or "").lower() for c in result["colors"]]
    assert "yellow" in families, (
        f"capturepink: yellow beak missing from displayed colours: {families}")


@pytest.mark.parametrize("fixture_name", ["capturepink", "pinkhorror"])
def test_no_manufactured_dark_card_is_displayed(scanner, fixture_name):
    """The darker-half-bias signature: a displayed 'Brown' that is dark and
    near-neutral (L<30, LAB chroma<15) is a shadow artefact, not a paint —
    this figure has no such painted surface."""
    import math as _math
    result = _scan_response(scanner, fixture_name)
    for c in result["colors"]:
        L, a, b = c["lab"]
        chroma = _math.hypot(a, b)
        assert not ((c.get("family") or "").lower() == "brown"
                    and L < 30.0 and chroma < 15.0), (
            f"{fixture_name}: manufactured dark card displayed: "
            f"{c['family']} {c['hex']} (L={L:.1f}, chroma={chroma:.1f})")
