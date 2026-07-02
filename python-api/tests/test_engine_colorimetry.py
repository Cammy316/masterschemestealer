"""
Engine colorimetry test (Phase 0 of the colour-science overhaul).

The principle under test: ENHANCE FOR DECISIONS, MEASURE FROM TRUTH. Photo
enhancement (CLAHE, contrast) exists to make segmentation robust; the colour
statistics that get matched against the measured paint database must come
from un-enhanced pixels, or every match inherits the enhancement bias.

Requires real OpenCV (cv2.resize on real arrays): run with USE_REAL_CV2=1,
as the canonical suite command does.
"""

import os
import sys
from pathlib import Path
from types import SimpleNamespace

import numpy as np
import pytest

if not os.environ.get("USE_REAL_CV2"):
    pytest.skip("requires real OpenCV — run the suite with USE_REAL_CV2=1",
                allow_module_level=True)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402


@pytest.fixture(scope="module")
def engine():
    return SchemeStealerEngine()


def test_colours_are_measured_from_unenhanced_image(engine, monkeypatch):
    """Colour statistics come from the un-enhanced photograph; the enhanced
    image exists for quality/segmentation decisions only (audit F1, fixed in
    Phase 1 — the dual-image invariant).

    Why it matters: CLAHE locally redistributes L*; measuring from the
    enhanced image biases every cluster's lightness relative to the measured
    paint DB the colours are matched against.

    Setup: the quality step returns an 'enhanced' image deliberately shifted
    +40 on every channel. A spy captures the image the extractor is given.
    The extractor must receive the ORIGINAL colours, not the shifted ones.
    """
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    img[:, :100] = (140, 30, 40)      # dark red
    img[:, 100:200] = (40, 60, 140)   # blue
    img[:, 200:] = (220, 210, 180)    # bone

    shifted = np.clip(img.astype(np.int16) + 40, 0, 255).astype(np.uint8)

    monkeypatch.setattr(
        engine.photo_processor, "process_and_assess",
        lambda _img: SimpleNamespace(can_process=True, enhanced_image=shifted),
    )

    captured = {}

    def spy(img_rgb, mask):
        captured["img"] = np.asarray(img_rgb).copy()
        return []

    monkeypatch.setattr(engine.smart_extractor, "extract_colors", spy)

    engine.analyze_miniature(img, mode="inspiration", use_awb=False)

    assert "img" in captured, "extractor was never called"
    measured_mean = captured["img"].mean(axis=(0, 1))
    original_mean = img.mean(axis=(0, 1))

    assert np.allclose(measured_mean, original_mean, atol=5.0), (
        f"extractor measured channel means {np.round(measured_mean, 1)} but "
        f"the photograph's means are {np.round(original_mean, 1)} — colours "
        "are being measured from the enhanced image")
