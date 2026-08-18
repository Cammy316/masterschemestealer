"""
O-G4 — the server-side overlay path is dead, and it is the code every Bug C
re-diagnosis keeps landing on.

`VisualizationEngine.create_color_overlay` composited a dimmed single-colour
highlight JPEG on the server. That path is gone: the backend now emits the raw
boolean `spatial_mask` as an alpha PNG (`miniature_scanner.py:244-268`) and the
client composites it through `lib/maskGeometry.ts`. Four methods survived the
change with zero callers — `_clean_mask` and `_draw_minimal_reticle` are reached
only FROM `create_color_overlay`, i.e. dead calling dead.

They are not harmless. `_clean_mask`'s 5 px component floor and
`create_color_overlay`'s `min_area = max(25, 0.0005*h*w)` contour floor are the
documented mechanism of Bug C (small trims produce a blank overlay) — a
mechanism that has been unreachable for as long as the alpha-PNG path has
shipped. Leaving them in place is what made the same wrong diagnosis repeatable.

**The class itself is LIVE.** `schemestealer_engine.py:188` instantiates
`VisualizationEngine` and `:470` calls `find_optimal_reticle_position` for every
served colour. The audit's wording ("delete the visualisation engine") is wrong;
only four of its methods are dead. That is the trap this file exists to catch:
the second test fails if the deletion takes the class or the live method with it.

`find_optimal_reticle_position` had no test at all before this commit, which is
precisely why over-deleting it would have been silent.

conftest.py stubs cv2 unless USE_REAL_CV2 is set. The stub returns a constant
`minMaxLoc`, so the geometric assertion would pass on any input — it is skipped
without real OpenCV rather than allowed to pass vacuously. The project gate runs
with USE_REAL_CV2=1.
"""

import os
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.color_engine import VisualizationEngine  # noqa: E402

# The four zero-caller methods of the dead server-side overlay path.
DEAD_OVERLAY_METHODS = (
    'create_color_overlay',
    '_clean_mask',
    '_draw_minimal_reticle',
    'draw_enhanced_reticle',
)

needs_real_cv2 = pytest.mark.skipif(
    not os.environ.get('USE_REAL_CV2'),
    reason="conftest's cv2 stub returns a constant minMaxLoc, so the geometry "
           "assertion could not fail; run with USE_REAL_CV2=1",
)


@pytest.mark.parametrize('name', DEAD_OVERLAY_METHODS)
def test_dead_overlay_method_is_gone(name):
    """Each method of the server-side overlay path must be absent.

    What would make this fail: re-adding any of the four, or reviving the
    server-side composite instead of extending the live alpha-PNG path in
    `miniature_scanner.py`. If Bug C recurs, it has a different cause — these
    are not it, and restoring them would only make that harder to see.
    """
    assert not hasattr(VisualizationEngine, name), (
        f"VisualizationEngine.{name} is back. It has no callers; the live "
        f"overlay is the client-side alpha-PNG composite."
    )


def test_reticle_positioning_survives():
    """`find_optimal_reticle_position` is LIVE and must not be deleted with the
    dead four.

    What would make this fail: deleting `VisualizationEngine` wholesale, or its
    import in `schemestealer_engine.py:20`, on the audit's (incorrect) wording
    that the whole visualisation engine is dead. Every served colour goes
    through this method at `schemestealer_engine.py:470`.
    """
    assert hasattr(VisualizationEngine, 'find_optimal_reticle_position')
    assert callable(VisualizationEngine.find_optimal_reticle_position)


@needs_real_cv2
def test_reticle_lands_inside_the_region_it_marks():
    """The live method still returns a point inside the mask, above the excluded
    bottom band.

    The mask is a single off-centre blob, so a method that silently degraded to
    "centre of the frame" would land outside it and fail. The frame centre
    (50, 50) is deliberately background.

    What would make this fail: losing the distance-transform body, or returning
    (x, y) transposed — the caller at `schemestealer_engine.py:468` documents the
    contract as (x=col, y=row) and reprojects on that basis.
    """
    mask = np.zeros((100, 100), dtype=bool)
    mask[10:40, 60:95] = True  # upper-right blob; frame centre is NOT in it

    x, y = VisualizationEngine.find_optimal_reticle_position(mask)

    assert mask[y, x], f"reticle ({x}, {y}) landed outside the mask"
    assert y < 80, "reticle landed inside the excluded bottom 20%"
