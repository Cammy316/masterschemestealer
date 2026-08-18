"""The plinth discriminator must be geometric, not chromatic (O-C8).

`BaseDetection.BASE_COLORS` keyed base removal on HSV bands applied to the
whole zone below `EXCLUSION_ZONE_TOP` regardless of geometry -- the
`suspected_base` argument was accepted and never read. `stone_grey` is
`H in [0,1]`, the FULL hue circle, at `S <= 0.3`, `V in [0.3,0.6]`: a
description of any desaturated mid-tone, not of a base material. HSV S and V
are gamma-domain and conflate lightness with chroma, so the band cannot
separate a resin plinth from grey armour -- they are colorimetrically
identical. A colour test for a geometric property cannot be repaired by
tuning, so C3.1 deletes it and leaves the geometric flood-fill alone.

Both tests here are SYNTHETIC, and deliberately so.

The plan specified three real-photograph fixtures (`Example.jpg` recovering
Magenta, `complex.PNG` recovering Pink, `pinkhorror2.webp` recovering Bone).
None reproduces: the rig they were measured on no longer exists on disk, and
on the two rigs that do, `Example.jpg` keeps Magenta both before and after,
`complex.PNG` moves the opposite way, and Bone never appears at all.

Re-derived photograph assertions were written and then withdrawn, because
the skeptic pass showed they were true for the wrong reason: `complex.PNG`
recovers 604 px of which at most 8 classify red, yet its Red card is ~6,500
px -- that card comes from downstream re-clustering, not from pixels this
commit hands back -- and `pinkhorror2.webp`'s margin sat below the
scoreboard's own single-LSB noise floor. A test that passes for a reason its
docstring misstates is worse than no test.

What is left is the mechanism itself, which is synthetic, deterministic, and
exactly the finding. Real-photograph behaviour is recorded in the commit
message and the scoreboard as a re-baseline instead of asserted here.
"""

import os
import sys
from pathlib import Path

import numpy as np
import pytest

if not os.environ.get("USE_REAL_CV2"):
    pytest.skip("requires real OpenCV -- run the suite with USE_REAL_CV2=1",
                allow_module_level=True)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.base_detector import BaseDetector  # noqa: E402

_PLINTH_GREY = (115, 115, 115)  # S=0.00, V=0.45 -- squarely inside `stone_grey`
_MODEL_RED = (200, 30, 30)      # V=0.78 -- outside every band in BASE_COLORS


def _scene(lower_body_rgb):
    """A model standing on a rectangular plinth. Returns (rgba, body, plinth).

    Geometry is fixed; only `lower_body_rgb` varies. The lower body sits below
    `EXCLUSION_ZONE_TOP` (0.6 x 400 = row 240) and so is inside the zone the
    deleted HSV bands were applied to, while being unambiguously model rather
    than base -- it is above the plinth and part of the same silhouette.
    """
    h, w = 400, 300
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    body = np.zeros((h, w), dtype=bool)
    plinth = np.zeros((h, w), dtype=bool)

    body[120:340, 100:200] = True
    plinth[340:400, 30:270] = True          # wide and regular: a base, geometrically

    rgba[body] = (*_MODEL_RED, 255)
    rgba[260:340, 100:200] = (*lower_body_rgb, 255)
    rgba[plinth] = (*_PLINTH_GREY, 255)
    return rgba, body, plinth


def test_rectangular_plinth_is_still_removed_by_geometry():
    """THE REGRESSION GUARD, AND THE ONE THAT MUST BE ABLE TO FAIL.

    C3.1 deletes a colour test and keeps a geometric one, so the whole commit
    rests on the geometric path still working unaided. It does: the plinth is
    wide, regular and in the bottom zone, which is what
    `_find_base_platform_v2` looks for, and `_flood_fill_downward` expands
    across it.

    WHAT WOULD MAKE THIS FAIL: damaging the geometric path. Raise
    `MIN_REGULARITY` (`base_detector.py:119`) or the 1.2 aspect gate (`:132`)
    above what a rectangular plinth satisfies, or return early from
    `_find_base_platform_v2`, and the plinth survives as analysed surface;
    drop the downward-only constraint from `_flood_fill_downward`'s kernel and
    it climbs into the legs, taking the body with it. Verified by mutation:
    four of six single-line changes to those two methods turn this red.

    NOT a failure mode, though it looks like one: widening the safety buffer
    at `:151` changes nothing here, because the 15-iteration cap at `:189`
    binds first on a scene this size.

    This test passed before C3.1 and must keep passing -- it is the only
    assertion here that is not supposed to change.
    """
    rgba, body, plinth = _scene(_MODEL_RED)
    keep = BaseDetector().detect_base_region(rgba)

    assert keep[plinth].mean() < 0.05, (
        f"plinth survived: {100 * keep[plinth].mean():.1f}% of it kept")
    assert keep[body].mean() > 0.90, (
        f"the flood fill ate the model: only {100 * keep[body].mean():.1f}% kept")


def test_base_detection_ignores_colour_entirely():
    """THE PROPERTY THE FINDING IS ABOUT.

    Two silhouettes identical in every geometric respect, differing only in
    the colour of a region below `EXCLUSION_ZONE_TOP`. One is painted a
    desaturated mid-grey -- grey armour, a stone-effect cloak hem, a
    drybrushed tabard -- which is colorimetrically indistinguishable from a
    resin plinth and therefore lands inside `stone_grey`. The other is a
    saturated red that no band matches.

    A base detector reasoning about geometry cannot tell these two apart.

    FAILS TODAY: the grey lower body is stripped by `stone_grey` and the red
    one is not, so the two masks differ -- painted surface deleted by colour
    alone, which is O-C8 in one assertion.

    WHAT WOULD MAKE IT FAIL AFTER THE CHANGE: re-introducing any colour-keyed
    exclusion. After C3.1 `detect_base_region` reads only the alpha channel
    (`_find_base_platform_v2` accepts `img_rgba` and never touches it), so
    any future path that consults RGB breaks this immediately.
    """
    grey_rgba, _, _ = _scene(_PLINTH_GREY)
    red_rgba, _, _ = _scene(_MODEL_RED)

    detector = BaseDetector()
    grey_keep = detector.detect_base_region(grey_rgba)
    red_keep = detector.detect_base_region(red_rgba)

    differing = int(np.count_nonzero(grey_keep != red_keep))
    assert differing == 0, (
        f"{differing} pixels analysed differently because of colour alone; "
        "the base decision must rest on geometry")
