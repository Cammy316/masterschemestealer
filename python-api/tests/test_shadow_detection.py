"""
O-C14b — `_is_likely_shadow`'s self-skip is an IDENTITY test written as an
EQUALITY test.

`smart_color_system.py:552` reads `if other == cluster: continue`. Both
operands are dicts holding NumPy arrays, so dict comparison can reach
`bool(array == array)` and raise `ValueError: The truth value of an array
with more than one element is ambiguous` — killing the whole scan.

Why it survives in production today, and why the fixture must be shaped the
way it is: dict `__eq__` compares length first, then values in insertion
order, short-circuiting on the first inequality.

  * An UN-merged cluster carries 12 keys beginning with `id`, so two of them
    differ on an int before any array is touched.
  * A MERGED cluster (`_combine_clusters`) carries 9 keys beginning with
    `coverage`. Two merged clusters with byte-identical coverage fall
    straight through to `median_rgb` — two distinct ndarrays — and raise.

The audit measured 1 exact coverage collision in 2,109 merged pairs (0.047%)
across five real photographs: a latent crash of roughly 5e-4 per pair. The
self-skip runs for EVERY `other` before any shadow condition is evaluated,
so the crash does not depend on the shadow rule firing.

conftest.py stubs cv2 unless USE_REAL_CV2 is set; nothing here needs it.
"""

import colorsys
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.colour_maths import lab_to_rgb  # noqa: E402
from core.smart_color_system import SmartColorExtractor  # noqa: E402


@pytest.fixture()
def extractor():
    return SmartColorExtractor()


def _merged_cluster(coverage: float, lab) -> dict:
    """A cluster in the exact shape `_combine_clusters` emits: nine keys, no
    `id`, `coverage` first in insertion order, RGB/HSV/chroma all DERIVED
    from the median LAB (the F3 one-colour-per-cluster rule).

    Using the merged shape is the point of the fixture — the un-merged shape
    cannot reproduce the defect, so a test built on it would pass vacuously.
    """
    lab = np.asarray(lab, dtype=float)
    rgb = lab_to_rgb(lab)
    return {
        'coverage': coverage,
        'median_rgb': rgb,
        'median_lab': lab,
        'chroma': float(np.hypot(lab[1], lab[2])),
        'brightness_std': 4.0,
        'local_brightness_std': 4.0,
        'median_hsv': np.array(colorsys.rgb_to_hsv(*(rgb / 255.0))),
        'pixel_indices': np.arange(10),
        'local_indices': np.arange(10),
    }


# Two real paints from paints_groundtruth.json, 14.90 ΔE00 apart, whose V
# values straddle the shadow rule's 0.20 gap. They are the narrowest real
# example of the rule firing, so they exercise the loop end to end.
_DRAGON_BLOOD = (11.96, 15.08, -0.87)      # ak-3gen-dragon-blood
_BASILISK_RED = (24.46, 37.87, 9.91)       # army-painter-basilisk-red


def test_coverage_collision_does_not_crash_the_scan(extractor):
    """Two DIFFERENT merged clusters that happen to share a coverage value
    must not blow up the shadow test.

    WHAT WOULD MAKE THIS FAIL: reverting `:552` to `other == cluster`, or
    introducing any dict-equality comparison inside this loop. It passes only
    because the self-skip is an identity test. Note the two clusters must
    share `coverage` exactly and carry the nine-key merged shape — change
    either and the test stops exercising the defect.
    """
    dark = _merged_cluster(3.0, _DRAGON_BLOOD)
    other = _merged_cluster(3.0, _BASILISK_RED)   # identical coverage
    assert dark['coverage'] == other['coverage']
    assert len(dark) == len(other) and list(dark)[0] == 'coverage'

    result = extractor._is_likely_shadow(dark, [dark, other])
    assert isinstance(result, bool)


def test_a_genuine_shadow_is_still_detected(extractor):
    """The self-skip fix must not disable the rule it guards.

    WHAT WOULD MAKE THIS FAIL: breaking the loop so it never evaluates
    `other`, skipping every candidate, or the shadow thresholds moving so
    this pair no longer qualifies (ΔE00 14.90 sits just inside the 15.0 cut —
    if O-C16 later tightens that threshold, this expectation flips and the
    test must be updated deliberately, not silently).
    """
    dark = _merged_cluster(3.0, _DRAGON_BLOOD)
    lighter = _merged_cluster(9.0, _BASILISK_RED)

    assert extractor._is_likely_shadow(dark, [dark, lighter]) is True


def test_a_lone_cluster_is_never_its_own_shadow(extractor):
    """A cluster compared only against itself must be skipped, not matched.

    WHAT WOULD MAKE THIS FAIL: removing the self-skip entirely. A cluster is
    at ΔE00 0.0 from itself, so without the skip the only thing standing
    between it and deletion is the V-gap test.
    """
    dark = _merged_cluster(3.0, _DRAGON_BLOOD)
    assert extractor._is_likely_shadow(dark, [dark]) is False
