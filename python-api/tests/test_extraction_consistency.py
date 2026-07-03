"""
Extraction self-consistency tests (Phase 0 of the colour-science overhaul).

The principle under test: A CLUSTER MUST BE ONE COLOUR. Every statistic a
cluster carries (median_rgb, median_lab, chroma) must describe the same
colour, and the clustering result must not depend on internal iteration
order — otherwise downstream classification, trim protection and detail
thresholds reason from fictional numbers.

These began as STRICT xfails documenting audit findings F3 (cluster
statistics, fixed in Phase 1) and F7 (merge order-dependence, fixed in
Phase 5 by the complete-linkage agglomerative merge); all now run as hard
invariants.

The plain tests pin end-to-end extraction behaviour that must survive both
rewrites: a simple multi-colour scene comes back as the same colours.

conftest.py stubs cv2; extract_colors and the helpers run fine under the stub.
"""

import math
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.colour_maths import ciede2000_single, rgb_to_lab  # noqa: E402
from core.smart_color_system import SmartColorExtractor  # noqa: E402


@pytest.fixture()
def extractor():
    return SmartColorExtractor()


def _cluster(lab, rgb, coverage: float, start_idx: int) -> dict:
    """A synthetic cluster dict with internally consistent fields, shaped as
    extract_colors builds them."""
    lab = np.asarray(lab, dtype=float)
    rgb = np.asarray(rgb, dtype=float)
    return {
        "coverage": coverage,
        "median_rgb": rgb,
        "median_lab": lab,
        "chroma": float(math.hypot(lab[1], lab[2])),
        "brightness_std": 5.0,
        "median_hsv": np.array([0.0, 0.5, 0.5]),
        "pixel_indices": np.arange(start_idx, start_idx + 10),
        "local_indices": np.arange(start_idx, start_idx + 10),
    }


# ---------------------------------------------------------------------------
# _combine_clusters: statistics must stay self-consistent
# ---------------------------------------------------------------------------

def test_combined_chroma_matches_combined_ab(extractor):
    """A merged cluster's chroma must equal hypot(a,b) of its own combined
    colour — never an average of the parents' chroma scalars (audit F3.3,
    fixed in Phase 1).

    Why it matters: trim protection, detail thresholds and confidence all
    branch on cluster['chroma']; after a merge it must describe the merged
    colour, not the average of the parents' colourfulness."""
    red_ish = _cluster((50.0, 40.0, 0.0), (196, 83, 121), 10.0, 0)
    green_ish = _cluster((50.0, -40.0, 0.0), (0, 140, 118), 10.0, 100)

    combined = extractor._combine_clusters([red_ish, green_ish], np.zeros((200, 3)))
    a, b = combined["median_lab"][1], combined["median_lab"][2]

    assert combined["chroma"] == pytest.approx(math.hypot(a, b), abs=2.0), (
        f"stored chroma {combined['chroma']:.1f} vs actual "
        f"{math.hypot(a, b):.1f} from (a,b)=({a:.1f},{b:.1f})")


def test_combined_rgb_and_lab_describe_the_same_colour(extractor):
    """A cluster keeps ONE colour representative (LAB); its RGB view is
    derived from it, so the two can never drift apart (audit F3.1, fixed in
    Phase 1).

    Why it matters: the family gate can be evaluated on one colour and the
    ΔE ranking on another — for the same cluster."""
    red_ish = _cluster((50.0, 40.0, 0.0), (196, 83, 121), 10.0, 0)
    green_ish = _cluster((50.0, -40.0, 0.0), (0, 140, 118), 10.0, 100)

    combined = extractor._combine_clusters([red_ish, green_ish], np.zeros((200, 3)))
    lab_from_rgb = rgb_to_lab(combined["median_rgb"])

    divergence = ciede2000_single(lab_from_rgb, combined["median_lab"])
    assert divergence < 2.0, (
        f"cluster's rgb and lab representations are ΔE {divergence:.1f} apart")


# ---------------------------------------------------------------------------
# _merge_perceptually_similar: result must not depend on cluster order
# ---------------------------------------------------------------------------

def _lab_on_ray(origin, direction, want_de: float, tol: float = 0.3):
    """Point on a ray from origin at CIEDE2000 ≈ want_de (bisection)."""
    o = np.asarray(origin, dtype=float)
    d = np.asarray(direction, dtype=float)
    d = d / np.linalg.norm(d)
    lo, hi = 0.0, 300.0
    for _ in range(80):
        mid = (lo + hi) / 2.0
        if ciede2000_single(o, o + mid * d) < want_de:
            lo = mid
        else:
            hi = mid
    cand = o + ((lo + hi) / 2.0) * d
    assert ciede2000_single(o, cand) == pytest.approx(want_de, abs=tol)
    return tuple(cand)


def test_merge_is_order_independent(extractor):
    """The merged palette must not depend on cluster input order (audit F7,
    fixed in Phase 5 by the complete-linkage agglomerative merge).

    Why it matters: cluster order comes from K-means label numbering — an
    implementation detail. The same photo must always produce the same
    palette."""
    lab_a = (50.0, 10.0, 10.0)
    # B on a ray from A at ΔE≈4; C further along the same ray at ΔE(A,C)≈8,
    # giving the chain: A~B mergeable, B~C mergeable, A~C not.
    lab_b = _lab_on_ray(lab_a, (0.0, 1.0, 0.6), 4.0)
    lab_c = _lab_on_ray(lab_a, (0.0, 1.0, 0.6), 8.0)
    # A far-off cluster inflates the mean pairwise distance so the merge
    # threshold sits at its 6.0 cap rather than collapsing.
    lab_d = (20.0, -40.0, 30.0)

    # Preconditions for the chain geometry under threshold 6.0.
    assert ciede2000_single(lab_a, lab_b) < 6.0
    assert ciede2000_single(lab_b, lab_c) < 6.0
    assert ciede2000_single(lab_a, lab_c) > 6.0

    clusters = [
        _cluster(lab_a, (150, 110, 100), 10.0, 0),
        _cluster(lab_b, (150, 112, 104), 10.0, 100),
        _cluster(lab_c, (150, 114, 108), 10.0, 200),
        _cluster(lab_d, (20, 60, 20), 10.0, 300),
    ]
    dummy_pixels = np.zeros((400, 3))

    def palette(cluster_list):
        merged = extractor._merge_perceptually_similar(cluster_list, dummy_pixels)
        return sorted(tuple(np.round(np.asarray(c["median_lab"]), 1))
                      for c in merged)

    forward = palette([dict(c) for c in clusters])
    reverse = palette([dict(c) for c in reversed(clusters)])

    assert forward == reverse, (
        f"merge result depends on cluster order:\n  forward: {forward}\n"
        f"  reverse: {reverse}")


# ---------------------------------------------------------------------------
# Ramp-aware grouping: one painted surface = one cluster
# ---------------------------------------------------------------------------

def test_shaded_ramp_of_one_hue_is_one_cluster(extractor):
    """A painted surface is a lightness ramp at ~constant hue (base coat,
    shade, highlight). It must come back as ONE cluster — an isotropic
    metric split one blue armour into three Blue cards in production."""
    rng = np.random.default_rng(5)
    H, W = 160, 240
    # Blue armour ramp: same hue, lightness sweeping shadow -> highlight.
    ramp = np.linspace(0.45, 1.35, W).reshape(1, -1, 1)
    img = np.clip(np.array([70, 90, 165]) * ramp
                  + rng.normal(0, 3, (H, W, 3)), 0, 255).astype(np.uint8)
    mask = np.ones((H, W), dtype=bool)

    clusters = extractor.extract_colors(img, mask)
    majors = [c for c in clusters if not c.get("is_detail")]
    blues = [c for c in majors if c["family"].lower() in {"blue", "cyan"}]
    assert len(blues) == 1, (
        f"one shaded blue surface fragmented into "
        f"{[(c['family'], round(c['coverage'], 1)) for c in clusters]}")
    # The deepest shadow band (L*≈18) legitimately classifies near-black, so
    # the single blue card owns the ramp's chromatic majority (~63% measured)
    # rather than 100% of the sweep. The load-bearing assertion is the ONE
    # card above; the floor here only guards against the majority collapsing.
    assert blues[0]["coverage"] > 55.0


def test_two_distinct_hues_at_equal_lightness_stay_separate(extractor):
    """The lightness discount must never bridge distinct hues: equal-L blue
    and purple are different paints, not a ramp."""
    rng = np.random.default_rng(6)
    H, W = 120, 240
    img = np.zeros((H, W, 3), dtype=float)
    img[:, :W // 2] = (60, 90, 170)     # blue
    img[:, W // 2:] = (125, 60, 165)    # purple, similar lightness
    img = np.clip(img + rng.normal(0, 3, img.shape), 0, 255).astype(np.uint8)
    mask = np.ones((H, W), dtype=bool)

    clusters = extractor.extract_colors(img, mask)
    families = {c["family"].lower() for c in clusters}
    assert len(families) >= 2, (
        f"blue and purple collapsed together: "
        f"{[(c['family'], round(c['coverage'], 1)) for c in clusters]}")


# ---------------------------------------------------------------------------
# End-to-end extraction sanity (must survive Phases 1 & 5)
# ---------------------------------------------------------------------------

def test_three_colour_scene_recovers_all_three(extractor):
    """A scene of three well-separated colours (dark red armour, blue cloak,
    bone trim) must come back as clusters within ΔE 8 of each input — the
    baseline promise of the extractor."""
    scene_rgb = [(140, 30, 40), (40, 60, 140), (220, 210, 180)]
    rng = np.random.default_rng(0)

    img = np.zeros((120, 120, 3), dtype=float)
    img[:, :40] = scene_rgb[0]
    img[:, 40:80] = scene_rgb[1]
    img[:, 80:] = scene_rgb[2]
    img += rng.normal(0.0, 6.0, img.shape)
    img = np.clip(img, 0, 255).astype(np.uint8)
    mask = np.ones((120, 120), dtype=bool)

    clusters = extractor.extract_colors(img, mask)
    assert len(clusters) >= 3, f"expected >=3 clusters, got {len(clusters)}"

    for target in scene_rgb:
        target_lab = rgb_to_lab(np.asarray(target, dtype=float))
        best = min(ciede2000_single(target_lab, c["median_lab"])
                   for c in clusters)
        assert best < 8.0, (
            f"input colour {target} not recovered: nearest cluster ΔE {best:.1f}")

    # And no fragmentation explosion: three flat regions must not balloon
    # into more than a handful of clusters after merging/dedup.
    assert len(clusters) <= 6
