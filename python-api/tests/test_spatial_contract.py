"""
Spatial-contract tests (Auspex Reveal production fix).

The frontend composites region masks and numbered markers onto the FULL
uploaded image. The engine analyses an alpha-bbox-cropped, 300px-wide copy.
Production shipped three stacked defects: reticle x/y axis-swapped (and
normalised by the wrong dimension — markers left the frame on portrait
crops), masks encoded as OPAQUE 1-bit PNGs (the frontend's alpha-keyed
`destination-in` clip then kept the whole frame, tinting everything), and
the crop offset never transmitted (masks stretched over the uncropped
photo). These tests pin the corrected contract.

conftest.py stubs cv2 unless USE_REAL_CV2 is set; the reprojection and
mask-encoding tests run under either. The end-to-end engine test needs the
real pipeline and is gated on USE_REAL_CV2.
"""

import base64
import io
import os
import sys
from pathlib import Path

import numpy as np
import pytest
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.schemestealer_engine import reproject_to_frame  # noqa: E402


# ---------------------------------------------------------------------------
# reproject_to_frame: analysis (col,row) -> full-frame normalised (x,y)
# ---------------------------------------------------------------------------

def test_reprojection_portrait_crop():
    """Portrait crop (taller than wide) — the shape that pushed markers off
    frame in production: row/width exceeded 1.0."""
    # Crop of 400x600 frame-pixels at offset (100, 50) in an 800x1000 frame,
    # analysed at 300x450.
    fx, fy = reproject_to_frame(150, 400, 300, 450,
                                crop_rect=(100, 50, 400, 600),
                                frame_shape=(1000, 800))
    assert fx == pytest.approx((100 + 150 / 300 * 400) / 800)   # 0.375
    assert fy == pytest.approx((50 + 400 / 450 * 600) / 1000)   # 0.5833
    assert 0.0 <= fx <= 1.0 and 0.0 <= fy <= 1.0


def test_reprojection_locks_the_axis_order():
    """col moves x ONLY and row moves y ONLY — the production bug fed the
    row into x. A pure-horizontal move must leave y untouched."""
    base = reproject_to_frame(10, 200, 300, 450,
                              crop_rect=(0, 0, 300, 450),
                              frame_shape=(450, 300))
    moved = reproject_to_frame(290, 200, 300, 450,
                               crop_rect=(0, 0, 300, 450),
                               frame_shape=(450, 300))
    assert moved[0] > base[0], "col did not move x"
    assert moved[1] == pytest.approx(base[1]), "col moved y — axis swap"


def test_reprojection_is_always_inside_the_frame():
    """Every analysis pixel of every crop shape maps into [0,1]²."""
    for crop_rect, frame in [((0, 0, 300, 900), (900, 300)),     # extreme portrait
                             ((500, 10, 700, 200), (300, 1300)),  # wide landscape
                             ((0, 0, 50, 50), (2000, 2000))]:     # tiny crop
        aw, ah = 300, int(300 * crop_rect[3] / crop_rect[2])
        for col, row in [(0, 0), (aw, ah), (aw, 0), (0, ah), (aw / 2, ah / 2)]:
            fx, fy = reproject_to_frame(col, row, aw, ah, crop_rect, frame)
            assert 0.0 <= fx <= 1.0 and 0.0 <= fy <= 1.0, (
                f"({col},{row}) in crop {crop_rect} left the frame: ({fx},{fy})")


# ---------------------------------------------------------------------------
# _encode_mask: the PNG's ALPHA channel must be the region
# ---------------------------------------------------------------------------

def test_encoded_mask_alpha_is_the_region():
    """The frontend clips with `destination-in`, which keys off alpha. The
    encoded PNG must be transparent outside the region and opaque inside —
    the old 1-bit encoding was opaque everywhere and the whole frame got
    tinted."""
    from services.miniature_scanner import MiniatureScannerService

    mask = np.zeros((40, 30), dtype=bool)
    mask[5:20, 8:25] = True

    svc = object.__new__(MiniatureScannerService)  # no engine init needed
    b64 = svc._encode_mask(mask, '#ff00ff')
    assert b64, "mask failed to encode"

    img = Image.open(io.BytesIO(base64.b64decode(b64)))
    assert img.mode == 'RGBA', f"mask PNG has no alpha channel (mode {img.mode})"
    alpha = np.asarray(img)[:, :, 3]
    assert np.array_equal(alpha > 127, mask), "alpha channel != region mask"


# ---------------------------------------------------------------------------
# End-to-end: engine emits full-frame coordinates and crop geometry
# ---------------------------------------------------------------------------

@pytest.mark.skipif(not os.environ.get("USE_REAL_CV2"),
                    reason="full engine pipeline needs real OpenCV")
def test_engine_reticles_land_on_the_figure():
    """A figure at a known offset inside a larger transparent frame: every
    emitted reticle must be inside [0,1]² and the dominant colour's marker
    must land ON the figure — in FULL-FRAME coordinates."""
    from core.schemestealer_engine import SchemeStealerEngine

    rng = np.random.default_rng(7)
    frame_h, frame_w = 640, 480
    fig_x, fig_y, fig_w, fig_h = 120, 90, 200, 380

    rgba = np.zeros((frame_h, frame_w, 4), dtype=np.uint8)
    figure = np.clip(
        np.array([180, 40, 60]) + rng.normal(0, 12, (fig_h, fig_w, 3)),
        0, 255).astype(np.uint8)
    figure[::14] = (240, 220, 200)  # texture bands so quality checks pass
    rgba[fig_y:fig_y + fig_h, fig_x:fig_x + fig_w, :3] = figure
    rgba[fig_y:fig_y + fig_h, fig_x:fig_x + fig_w, 3] = 255

    engine = SchemeStealerEngine()
    recipes, _, _ = engine.analyze_miniature(
        rgba[:, :, :3].copy(), mode="mini", remove_base=False,
        use_awb=False, precomputed_rgba=rgba)
    assert recipes, "engine returned no colours"

    for r in recipes:
        assert 0.0 <= r['reticle_x'] <= 1.0 and 0.0 <= r['reticle_y'] <= 1.0, (
            f"{r['family']}: reticle outside the frame "
            f"({r['reticle_x']:.2f}, {r['reticle_y']:.2f})")
        assert r['crop_rect'] == (fig_x, fig_y, fig_w, fig_h)
        assert r['frame_shape'] == (frame_h, frame_w)

    dominant = max(recipes, key=lambda r: r['dominance'])
    px = dominant['reticle_x'] * frame_w
    py = dominant['reticle_y'] * frame_h
    assert fig_x <= px <= fig_x + fig_w and fig_y <= py <= fig_y + fig_h, (
        f"dominant marker ({px:.0f}, {py:.0f}) missed the figure at "
        f"({fig_x}, {fig_y}, {fig_w}, {fig_h}) — coordinate contract broken")
