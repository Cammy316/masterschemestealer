"""
Metallic misclassification regression tests (production fix).

Production failure: superpixel clustering made clusters span their region's
full lit-to-shadow pixel range, so the cluster-wide brightness std blew past
the metallic detector's thresholds — a pink body came back "Bronze 57%",
white claws "Silver", and a black-armoured model returned "Silver 71.5%"
merged from seven scattered clusters. The fixes under test:

  1. The metallic detector reads LOCAL (within-superpixel) brightness
     variance — sparkle is high-frequency; matte shading is locally smooth.
  2. A scan-inferred metallic flag on a near-black cluster is demoted (black
     armour must never classify Silver); the DB's curated flags are untouched.
  3. Family dedup only merges perceptually close clusters — no more
     scattered single-family blobs with meaningless average colours.

conftest.py stubs cv2 unless USE_REAL_CV2 is set; extract_colors and SLIC run
under either.
"""

import math
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.smart_color_system import SmartColorExtractor  # noqa: E402

METAL_FAMILIES = {"Silver", "Gold", "Bronze"}


@pytest.fixture()
def extractor():
    return SmartColorExtractor()


def _pink_figure_scene():
    """The production reproduction: a small bright-pink figure (strong 3D
    shading, thin dark stripes, white claws, cyan/yellow details) on a masked
    background — the scene whose claws came back 'Silver, metallic' before
    the fix."""
    rng = np.random.default_rng(3)
    H, W = 370, 300
    img = np.full((H, W, 3), 30, dtype=float)
    mask = np.zeros((H, W), dtype=bool)
    yy, xx = np.mgrid[0:H, 0:W]

    body = (((yy - 190) / 130.0) ** 2 + ((xx - 150) / 65.0) ** 2) < 1.0
    mask |= body
    shade = (1.15 - 0.9 * np.abs((xx - 150) / 65.0) * 0.45
             - 0.55 * ((yy - 190) / 260.0 + 0.5) * 0.6)
    pink = np.stack([233 * shade, 120 * shade, 160 * shade], axis=-1)
    img[body] = pink[body]
    for y in range(70, 330, 22):
        band = body & (yy >= y) & (yy < y + 3)
        img[band] = np.stack([150 * shade, 40 * shade, 70 * shade], axis=-1)[band]
    claws = ((yy - 80) ** 2 / 18 ** 2 + (xx - 150) ** 2 / 30 ** 2) < 1
    img[claws] = (245, 245, 250)
    mask |= claws
    knife = (yy > 280) & (yy < 320) & (xx > 95) & (xx < 115)
    img[knife] = (90, 200, 210)
    mask |= knife
    beak = ((yy - 160) ** 2 / 12 ** 2 + (xx - 165) ** 2 / 16 ** 2) < 1
    img[beak] = (200, 160, 40)

    img = np.clip(img + rng.normal(0, 5, img.shape), 0, 255).astype(np.uint8)
    return img, mask


def test_pink_figure_produces_no_metal_families(extractor):
    """Why it matters: this is the exact production failure — a matte pink
    miniature whose dominant colour was returned as Bronze and whose white
    claws as Silver, because cluster-wide brightness spread was read as
    metallic sparkle."""
    img, mask = _pink_figure_scene()
    clusters = extractor.extract_colors(img, mask)
    assert clusters, "extraction produced nothing"

    metals = [(c["family"], c["coverage"]) for c in clusters
              if c["family"] in METAL_FAMILIES]
    assert not metals, f"matte scene produced metal families: {metals}"

    dominant = max(clusters, key=lambda c: c["coverage"])
    assert dominant["family"] in {"Pink", "Magenta"}, (
        f"dominant family {dominant['family']} — expected the pink body")
    assert not dominant.get("is_metallic"), "dominant cluster flagged metallic"


def test_matte_gradient_is_not_metallic_but_sparkle_is(extractor):
    """The core detector contract: a smooth lit-to-shadow gradient (huge
    cluster-wide brightness spread, tiny local variance) is MATTE; a
    high-frequency sparkle texture of the same mean colour is METALLIC."""
    rng = np.random.default_rng(9)
    H, W = 200, 300
    img = np.zeros((H, W, 3), dtype=float)
    # Left: smooth grey gradient 60→200 (matte shading).
    grad = np.linspace(60, 200, W // 2).reshape(1, -1, 1)
    img[:, :W // 2] = grad
    # Right: mid-grey with strong per-pixel sparkle (metallic glint).
    img[:, W // 2:] = 120 + rng.normal(0, 45, (H, W // 2, 1))
    img = np.clip(img + rng.normal(0, 2, img.shape), 0, 255).astype(np.uint8)
    mask = np.ones((H, W), dtype=bool)

    clusters = extractor.extract_colors(img, mask)
    assert clusters

    # The sparkle side must contain at least one metallic-flagged cluster;
    # any cluster made purely of the smooth gradient must not be flagged.
    sparkle_flagged = [c for c in clusters if c.get("is_metallic")]
    assert sparkle_flagged, "high-frequency sparkle no longer detected as metallic"
    for c in sparkle_flagged:
        # flagged clusters must come from the sparkle half (local std high)
        assert c.get("local_brightness_std", 0) > 18


def test_near_black_cluster_is_never_a_scan_metal(extractor):
    """Black armour must never come back 'Silver': a scan-inferred metallic
    flag on a near-black cluster is demoted before classification."""
    cluster = {
        "median_lab": np.array([5.0, 0.5, 0.5]),
        "median_rgb": np.array([18.0, 18.0, 18.0]),
        "median_hsv": np.array([0.0, 0.05, 0.1]),
        "chroma": 0.7,
        "coverage": 40.0,
        "brightness_std": 30.0,
        "local_brightness_std": 30.0,   # sparkle-level variance…
        "pixel_indices": np.arange(10),
    }
    family, _conf = extractor._classify_family_ensemble_weighted(cluster, [cluster])
    assert family not in METAL_FAMILIES, (
        f"near-black cluster classified {family}")
    assert cluster["is_metallic"] is False


def test_family_dedup_merges_ramps_but_respects_the_lightness_cap(extractor):
    """Ramp-aware dedup: a painted surface's lightness bands (mid greys of
    one armour) consolidate into ONE card, but the ΔL-span cap keeps the
    opposite ends of the lightness axis apart — near-black armour and
    near-white trim must never collapse into one blob (the scattered-
    reveal-mask failure)."""
    def cl(lab, rgb, cov, idx):
        return {
            "family": "Grey", "confidence": 0.9,
            "median_lab": np.array(lab, dtype=float),
            "median_rgb": np.array(rgb, dtype=float),
            "median_hsv": np.array([0.0, 0.02, rgb[0] / 255.0]),
            "chroma": float(math.hypot(lab[1], lab[2])),
            "coverage": cov, "brightness_std": 5.0,
            "local_brightness_std": 4.0,
            "pixel_indices": np.arange(idx, idx + 10),
        }

    shadow = cl((30.0, 0.5, 0.5), (72, 72, 72), 20.0, 0)      # armour shadow
    lit = cl((48.0, -0.5, 0.0), (114, 114, 114), 15.0, 100)   # armour lit band
    near_white = cl((92.0, 0.0, 1.0), (232, 232, 232), 10.0, 200)

    result = extractor._deduplicate_by_family([shadow, lit, near_white])
    assert len(result) == 2, (
        f"expected armour ramp merged + near-white separate, got "
        f"{[(round(c['coverage'], 1), round(c['median_lab'][0], 1)) for c in result]}")
    coverages = sorted(round(c["coverage"], 1) for c in result)
    assert coverages == [10.0, 35.0]
