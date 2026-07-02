"""
OKLab conversion and two-stage retrieval tests (Phase 2 of the overhaul).

OKLab Euclidean is the GEOMETRY metric (clustering embedding, candidate
retrieval); CIEDE2000 remains the final-ranking/reporting metric. These tests
pin the conversion against reference values (cross-checked with culori's
oklab converter) and prove the two-stage matcher is behaviour-preserving:
the OKLab shortlist must never change the CIEDE2000 winner.

conftest.py stubs cv2; nothing here needs the real library.
"""

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.colour_maths import (  # noqa: E402
    ciede2000_single, lab_to_oklab, oklab_distance, rgb_to_oklab,
)
from core.color_engine import Paint, PaintMatcher  # noqa: E402


# ---------------------------------------------------------------------------
# Conversion correctness
# ---------------------------------------------------------------------------

def test_oklab_white_and_black_are_exact():
    """OKLab is normalised so sRGB white is L=1 and black is L=0 with zero
    chroma — the anchor points of the space."""
    white = rgb_to_oklab([255, 255, 255])
    black = rgb_to_oklab([0, 0, 0])
    assert np.allclose(white, [1.0, 0.0, 0.0], atol=1e-3)
    assert np.allclose(black, [0.0, 0.0, 0.0], atol=1e-3)


def test_oklab_reference_value_matches_culori():
    """#c0392b — cross-checked against culori's oklab converter, which the
    frontend uses. The two stacks must land on the same numbers."""
    ok = rgb_to_oklab([192, 57, 43])
    assert np.allclose(ok, [0.54337, 0.15114, 0.08617], atol=1e-3)


def test_oklab_vectorised_matches_single():
    """The (N,3) batch path must agree exactly with per-triple conversion."""
    rng = np.random.default_rng(7)
    labs = np.column_stack([rng.uniform(5, 95, 20),
                            rng.uniform(-60, 60, 20),
                            rng.uniform(-60, 60, 20)])
    batch = lab_to_oklab(labs)
    singles = np.array([lab_to_oklab(row) for row in labs])
    assert np.allclose(batch, singles, atol=1e-12)


def test_oklab_distance_is_a_metric_on_samples():
    """Identity, symmetry, and the triangle inequality — the properties
    CIEDE2000 lacks and the reason OKLab owns the geometry role."""
    rng = np.random.default_rng(11)
    pts = lab_to_oklab(np.column_stack([rng.uniform(5, 95, 30),
                                        rng.uniform(-60, 60, 30),
                                        rng.uniform(-60, 60, 30)]))
    for i in range(0, 30, 3):
        a, b, c = pts[i], pts[(i + 1) % 30], pts[(i + 2) % 30]
        assert oklab_distance(a, a) == pytest.approx(0.0, abs=1e-12)
        assert oklab_distance(a, b) == pytest.approx(oklab_distance(b, a))
        assert (oklab_distance(a, c)
                <= oklab_distance(a, b) + oklab_distance(b, c) + 1e-12)


# ---------------------------------------------------------------------------
# Two-stage retrieval is behaviour-preserving
# ---------------------------------------------------------------------------

def _random_paint(i: int, lab, brand: str = "Big") -> Paint:
    p = Paint(name=f"p{i}", brand=brand, hex="#808080", type="layer",
              color_family="red", paint_id=f"p{i}",
              measured_lab=[float(lab[0]), float(lab[1]), float(lab[2])])
    p.compute_properties()
    return p


def test_shortlist_never_changes_the_ciede2000_winner():
    """Why it matters: the OKLab stage exists for speed and metric hygiene,
    not to alter results — for any target, the paint returned must equal the
    brute-force CIEDE2000 argmin over the full candidate pool."""
    rng = np.random.default_rng(3)
    labs = np.column_stack([rng.uniform(10, 90, 200),
                            rng.uniform(-55, 55, 200),
                            rng.uniform(-55, 55, 200)])
    db = [_random_paint(i, lab) for i, lab in enumerate(labs)]
    matcher = PaintMatcher(db)
    assert len(db) > 48  # the shortlist must actually engage

    targets = np.column_stack([rng.uniform(15, 85, 12),
                               rng.uniform(-45, 45, 12),
                               rng.uniform(-45, 45, 12)])
    for tgt in targets:
        got = matcher.match_color(np.array([128.0, 128.0, 128.0]), "Big",
                                  role="dominant", target_lab=tgt)
        brute = min(db, key=lambda p: ciede2000_single(tgt, p.lab))
        brute_de = ciede2000_single(tgt, brute.lab)
        if brute_de > 30.0:
            assert got is None  # ceiling applies to the true best as well
        else:
            assert got is brute, (
                f"shortlist changed the winner for target {tgt}: "
                f"{got.name if got else None} vs brute-force {brute.name}")
