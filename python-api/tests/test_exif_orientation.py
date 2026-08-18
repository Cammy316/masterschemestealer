"""EXIF orientation must be applied before anything measures the array (O-A2).

A phone capturing in portrait routinely stores the sensor's landscape array
plus Orientation 6 and leaves the rotation to the viewer. PIL's `Image.open`
does NOT apply it, so the scan endpoints analyse a sideways array. Both modes
then resize to a fixed analysis width (300 px), so a 90 degree difference
swings the analysis pixel budget by the aspect ratio -- up to 1.74x on
`Example.jpg` (68,100 -> 118,200 px). That budget sets `n_segments`
(`smart_color_system.py`, `n_masked // 40`) and therefore superpixel
granularity, which O-C6 adjudicated as the lever that flips metallic flags on
real photographs. O-A2 is the audit's only promotion, because the finder
under-claimed it as "marker placement only".

No file in `Testimages/` carries Orientation != 1, so the trigger is CONSTRUCTED
here rather than found. Each pair below is one photograph written twice: once
plain, once rotated 90 degrees and tagged Orientation 6 so that it DISPLAYS
identically. A correct pipeline cannot tell them apart.

Both members are PNG deliberately. A JPEG round trip perturbs pixels at LSB
level, and O-C15 measured the card list changing on 5 of 5 real photographs
under a single-LSB flip -- so a lossy pair could fail this assertion for a
reason with nothing to do with EXIF. Lossless means the transposed array is
bit-identical to the original (asserted below, so the fixture cannot silently
degrade into comparing two different images) and the comparison is exact.

WHAT WOULD MAKE THESE FAIL:
  * Today: the absence of the transpose. The two requests analyse arrays of
    different shape and return different cards.
  * After the fix: removing `ImageOps.exif_transpose` from either endpoint, or
    applying it after `image.thumbnail(...)` -- the resize has by then already
    consumed the wrong shape.
"""

import io
import os
import sys
from pathlib import Path

import numpy as np
import pytest
from PIL import Image, ImageOps

if not os.environ.get("USE_REAL_CV2"):
    pytest.skip("requires real OpenCV -- run the suite with USE_REAL_CV2=1",
                allow_module_level=True)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient  # noqa: E402

from main import app, _prewarm, _scanner_ready  # noqa: E402

_TESTIMAGES = Path(__file__).resolve().parents[2] / "Testimages"

_ORIENTATION_TAG = 274  # EXIF Orientation
_ORIENTATION_ROTATE_90_CW = 6  # "0th row is the visual left-hand side"


@pytest.fixture(scope="module", autouse=True)
def prewarm_scanners():
    _prewarm()
    _scanner_ready.wait(timeout=60)
    yield


client = TestClient(app)


def _orientation_pair(name: str, mode: str) -> tuple[bytes, bytes]:
    """One photograph as two PNGs that must display -- and scan -- identically.

    Returns (plain, rotated_and_tagged). The second stores the pixels rotated
    90 degrees anticlockwise and declares Orientation 6, which is precisely
    what a portrait phone capture looks like on the wire.
    """
    path = _TESTIMAGES / name
    if not path.is_file():
        pytest.skip(f"source photograph missing: {path}")

    plain_img = Image.open(path).convert(mode)
    rotated_img = plain_img.transpose(Image.Transpose.ROTATE_90)

    exif = Image.Exif()
    exif[_ORIENTATION_TAG] = _ORIENTATION_ROTATE_90_CW

    plain, rotated = io.BytesIO(), io.BytesIO()
    plain_img.save(plain, format="PNG")
    rotated_img.save(rotated, format="PNG", exif=exif)

    # The fixture is only meaningful if the two really are the same picture.
    # A silently degraded pair -- a dropped EXIF chunk, a rotation the wrong
    # way -- would make every assertion below vacuous.
    reopened = Image.open(io.BytesIO(rotated.getvalue()))
    assert reopened.getexif().get(_ORIENTATION_TAG) == _ORIENTATION_ROTATE_90_CW, \
        "the PNG lost its orientation tag -- the fixture would test nothing"
    assert reopened.size == (plain_img.size[1], plain_img.size[0]), \
        "the stored array should be sideways -- otherwise there is nothing to correct"
    assert np.array_equal(np.asarray(ImageOps.exif_transpose(reopened)),
                          np.asarray(plain_img)), \
        "applying the tag must reproduce the original exactly"

    return plain.getvalue(), rotated.getvalue()


def _cards(endpoint: str, payload: bytes, filename: str) -> list[tuple]:
    """The card list as the user would read it: family, colour, coverage."""
    response = client.post(endpoint,
                           files={"file": (filename, payload, "image/png")})
    assert response.status_code == 200, response.text
    colors = response.json()["colors"]
    assert colors, f"{endpoint} returned no colours for {filename}"
    return [(c["family"], tuple(c["rgb"]), round(c["percentage"], 4))
            for c in colors]


def test_inspiration_reads_a_rotated_capture_the_same_way():
    """Inspiration is the mode the finding is about -- it takes the upload
    exactly as the camera wrote it, with no client-side re-encode in between.
    """
    plain, rotated = _orientation_pair("sunset.PNG", "RGB")

    assert _cards("/api/scan/inspiration", plain, "plain.png") == \
        _cards("/api/scan/inspiration", rotated, "orientation6.png")


def test_miniature_reads_a_rotated_capture_the_same_way():
    """Miniscan uploads are re-encoded by the browser's background removal,
    which usually strips EXIF -- so this is defence in depth rather than the
    reported symptom. Nothing in the contract promises the client strips it,
    and the endpoint must not depend on that.
    """
    plain, rotated = _orientation_pair("capturepink.PNG", "RGBA")

    assert _cards("/api/scan/miniature", plain, "plain.png") == \
        _cards("/api/scan/miniature", rotated, "orientation6.png")
