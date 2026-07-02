"""
White-balance tests (Phase 6b of the colour-science overhaul).

The principle under test: A COLOUR CAST CORRECTION MUST NEVER COST MORE THAN
THE CAST. The old shades-of-grey corrector estimated the illuminant from ALL
pixels, so a miniature's deliberately non-neutral palette read as a cast and
was "corrected" away — ~10 ΔE00 of injected error even on clean photos
(measured on synthetic paint scenes). The Phase 6b corrector estimates only
from near-neutral pixels (primer, bases, desaturated shadows), applies a
CAT16 partial adaptation (D=0.7) in linear light, and returns the image
untouched when there is no neutral evidence.

conftest.py stubs cv2; apply_white_balance is pure numpy.
"""

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from skimage import color as skcolor  # noqa: E402

from core.colour_maths import ciede2000_single  # noqa: E402
from utils.helpers import apply_white_balance, _srgb_to_linear, _linear_to_srgb  # noqa: E402


def _lab_of_patch(img_u8, sl_rows, sl_cols):
    med = np.median(img_u8[sl_rows, sl_cols].reshape(-1, 3).astype(float) / 255.0,
                    axis=0)
    return skcolor.rgb2lab(med.reshape(1, 1, 3)).reshape(3)


def _warm_cast(img_u8, gains=(1.3, 1.0, 0.65)):
    """A physically-modelled illuminant change: per-channel gains in linear
    light (what a warm lamp actually does to a photo)."""
    lin = _srgb_to_linear(img_u8.astype(float) / 255.0)
    out = _linear_to_srgb(np.clip(lin * np.asarray(gains), 0, 1))
    return (out * 255).astype(np.uint8)


def _scene():
    """A realistic mini-photo stand-in: four paint patches + grey primer +
    dark base rim. 40px tiles, 80x120 total."""
    colours = [(154, 17, 21), (13, 64, 127), (30, 123, 63),   # red, blue, green
               (246, 177, 31),                                 # yellow
               (107, 107, 110), (33, 31, 32)]                  # primer, base
    tiles = [np.full((40, 40, 3), c, dtype=np.uint8) for c in colours]
    return np.vstack([np.hstack(tiles[:3]), np.hstack(tiles[3:])])


def test_clean_photo_is_nearly_untouched():
    """No cast in, (almost) no change out — the failure mode of the old
    corrector was rewriting clean photos."""
    scene = _scene()
    out = apply_white_balance(scene)
    errs = []
    for k in range(6):
        r, c = divmod(k, 3)
        rows, cols = slice(r * 40, (r + 1) * 40), slice(c * 40, (c + 1) * 40)
        errs.append(ciede2000_single(_lab_of_patch(scene, rows, cols),
                                     _lab_of_patch(out, rows, cols)))
    assert float(np.mean(errs)) < 2.5, (
        f"clean photo altered by mean ΔE {np.mean(errs):.2f}")


def test_warm_cast_is_reduced():
    """The reason AWB exists: under a strong warm cast, corrected colours must
    land closer to the truth than uncorrected ones."""
    scene = _scene()
    cast = _warm_cast(scene)
    out = apply_white_balance(cast)

    err_uncorrected, err_corrected = [], []
    for k in range(6):
        r, c = divmod(k, 3)
        rows, cols = slice(r * 40, (r + 1) * 40), slice(c * 40, (c + 1) * 40)
        truth = _lab_of_patch(scene, rows, cols)
        err_uncorrected.append(ciede2000_single(truth, _lab_of_patch(cast, rows, cols)))
        err_corrected.append(ciede2000_single(truth, _lab_of_patch(out, rows, cols)))

    assert float(np.mean(err_corrected)) < float(np.mean(err_uncorrected)), (
        f"correction made things worse: {np.mean(err_corrected):.2f} vs "
        f"{np.mean(err_uncorrected):.2f} uncorrected")


def test_no_neutral_evidence_returns_image_untouched():
    """A pure saturated palette offers no illuminant evidence — the corrector
    must decline rather than misread paint as cast."""
    tiles = [np.full((40, 40, 3), c, dtype=np.uint8)
             for c in [(200, 30, 40), (30, 60, 200), (240, 200, 20),
                       (30, 160, 60), (170, 30, 160), (230, 120, 30)]]
    scene = np.vstack([np.hstack(tiles[:3]), np.hstack(tiles[3:])])
    out = apply_white_balance(scene)
    assert np.array_equal(out, scene)


def test_alpha_mask_restricts_estimation_to_foreground():
    """With an alpha mask, a strongly tinted BACKGROUND must not drive the
    correction — only foreground pixels count as evidence."""
    scene = _scene()
    h, w = scene.shape[:2]
    # Paste the scene onto a big orange background.
    canvas = np.full((h * 2, w * 2, 3), (230, 140, 40), dtype=np.uint8)
    canvas[:h, :w] = scene
    alpha = np.zeros((h * 2, w * 2), dtype=np.uint8)
    alpha[:h, :w] = 255

    masked = apply_white_balance(canvas, alpha_mask=alpha)
    unmasked = apply_white_balance(canvas)

    # The foreground (clean, neutral-bearing) should stay near-identity under
    # the mask; without it the orange background pollutes the estimate.
    fg_shift_masked = np.abs(masked[:h, :w].astype(int) - scene.astype(int)).mean()
    fg_shift_unmasked = np.abs(unmasked[:h, :w].astype(int) - scene.astype(int)).mean()
    assert fg_shift_masked <= fg_shift_unmasked
    assert fg_shift_masked < 6.0


def test_neutral_grey_under_cast_is_pulled_toward_neutral():
    """The most direct statement of the contract: a tinted grey card comes
    back less tinted (chroma reduced)."""
    grey = np.full((60, 60, 3), 128, dtype=np.uint8)
    cast = _warm_cast(grey)
    out = apply_white_balance(cast)

    def patch_chroma(img):
        lab = _lab_of_patch(img, slice(0, 60), slice(0, 60))
        return float(np.hypot(lab[1], lab[2]))

    assert patch_chroma(out) < patch_chroma(cast) * 0.6, (
        f"cast chroma {patch_chroma(cast):.1f} only reduced to "
        f"{patch_chroma(out):.1f}")
