"""
CAM16-UCS validation (Phase 6a of the colour-science overhaul).

lab_to_cam16ucs implements the CAM16-UCS forward transform under fixed
viewing conditions (D65 white, L_A=64 cd/m², Y_b=20, average surround).
Reference values below were generated with colour-science 0.4.7
(XYZ_to_CAM16 + JMh_CAM16_to_CAM16UCS) under the same conditions; the small
tolerance absorbs the D65 white-point variant difference (skimage's D65 vs
colour-science's, ≈0.02 UCS units).

Phase 6a outcome, for the record: CAM16-UCS ranking was benchmarked against
CIEDE2000 ranking on distorted-swatch paint recovery (1,534 trials, module-2
distortion set) and TIED (33.7% vs 33.8%) — with fixed viewing conditions and
a D65-everywhere pipeline the appearance model adds nothing measurable, so
the matcher's final ranking stays CIEDE2000. The transform is kept as a
validated capability (e.g. for future known-viewing-condition features).
"""

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.colour_maths import cam16ucs_distance, lab_to_cam16ucs  # noqa: E402

# (CIELAB D65) -> (J', a', b') from colour-science 0.4.7.
_REFERENCE = [
    ((50.0, 0.0, 0.0),       (52.800629, -0.849968, -0.482748)),
    ((50.0, 40.0, 30.0),     (54.543815, 27.921112, 15.255008)),
    ((30.0, -25.0, -35.0),   (30.706860, -24.196931, -22.931272)),
    ((75.0, 10.0, 60.0),     (78.130092, 4.908386, 28.667946)),
    ((92.29, -2.74, 22.89),  (93.431692, -1.807854, 13.842109)),
    ((10.0, 5.0, -10.0),     (13.692673, 3.863083, -10.257535)),
    ((60.32, 98.23, -60.82), (67.612111, 46.459669, -21.764108)),
    ((5.0, 0.1, 0.1),        (9.311850, 0.016660, 0.064026)),
]


@pytest.mark.parametrize("lab,expected", _REFERENCE,
                         ids=[str(r[0]) for r in _REFERENCE])
def test_cam16ucs_matches_colour_science(lab, expected):
    got = lab_to_cam16ucs(np.array(lab))
    assert np.allclose(got, expected, atol=0.03), (
        f"CAM16-UCS for {lab}: got {np.round(got, 5)}, expected {expected}")


def test_cam16ucs_batch_matches_single():
    labs = np.array([r[0] for r in _REFERENCE])
    batch = lab_to_cam16ucs(labs)
    singles = np.array([lab_to_cam16ucs(row) for row in labs])
    assert np.allclose(batch, singles, atol=1e-12)


def test_cam16ucs_white_is_lightest():
    """J' orders by lightness: white above grey above black."""
    j_white = lab_to_cam16ucs(np.array([100.0, 0.0, 0.0]))[0]
    j_grey = lab_to_cam16ucs(np.array([50.0, 0.0, 0.0]))[0]
    j_black = lab_to_cam16ucs(np.array([0.0, 0.0, 0.0]))[0]
    assert j_white > j_grey > j_black
    assert j_white == pytest.approx(100.0, abs=0.5)


def test_cam16ucs_distance_metric_properties():
    rng = np.random.default_rng(5)
    labs = np.column_stack([rng.uniform(10, 90, 15),
                            rng.uniform(-50, 50, 15),
                            rng.uniform(-50, 50, 15)])
    pts = lab_to_cam16ucs(labs)
    for i in range(0, 15, 3):
        a, b, c = pts[i], pts[(i + 1) % 15], pts[(i + 2) % 15]
        assert cam16ucs_distance(a, a) == pytest.approx(0.0, abs=1e-12)
        assert cam16ucs_distance(a, b) == pytest.approx(cam16ucs_distance(b, a))
        assert (cam16ucs_distance(a, c)
                <= cam16ucs_distance(a, b) + cam16ucs_distance(b, c) + 1e-12)
