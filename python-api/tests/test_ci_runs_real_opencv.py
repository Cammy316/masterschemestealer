"""
DEC-9 — CI must run the real image library.

WHY THIS MATTERS.

`tests/conftest.py` substitutes a `MagicMock` for cv2 unless `USE_REAL_CV2` is
set, so the suite can be imported on a machine with no OpenCV. CI never set it.
Seven test modules guard themselves on that flag and skipped themselves at
import, so the pipeline's green tick covered a strictly smaller suite than the
one run locally.

MEASURED 2026-08-19 on `python-api\\venv` (skimage 0.24.0 / Python 3.11.9):

    without USE_REAL_CV2 (CI's condition)   724 collected,  8 skipped -> 716 ran
    with    USE_REAL_CV2=1 (local)          736 collected,  3 skipped -> 733 ran
                                                                        + 2 xfail

Twelve tests CI never saw, including the entire real-photograph scan suite
(`test_real_scans.py`), the EXIF-orientation pair, the engine colorimetry
module, the spatial contract's full-pipeline case, the visualisation geometry
assertion, the ML batch-log path and the plinth detector's colour test.

THE GUARDS ARE NOT THE PROBLEM AND MUST NOT BE DELETED. Two are load-bearing:

  * `test_plinth_detection.py` — under the stub, `cvtColor` ignores
    COLOR_RGB2HSV, so its colour test reports 0 differing pixels against the
    PRE-C3.1 detector. It passes on the exact code it was written to catch.
  * `test_exif_orientation.py` — the stub's `resize` is a passthrough, so the
    mask and image shapes diverge and one of its two tests errors outright.

The fix is to give CI real OpenCV, not to widen coverage by removing guards.
That is what this file pins.

THE HONEST LIMIT OF THIS TEST. It asserts the workflow is configured to ask for
real OpenCV. It cannot assert that the runner delivers it — `requirements.txt`
pins `opencv-python` rather than `-headless`, which links against libGL, and the
workflow installs `libgl1`/`libglib2.0-0` to satisfy that. Whether those are the
right package names on the current runner image is answered by the first CI run
and by nothing else. That is a prediction, and it is recorded as one.
"""

import re
from pathlib import Path

import pytest

_WORKFLOW = Path(__file__).resolve().parents[2] / ".github" / "workflows" / "ci.yml"


@pytest.fixture(scope="module")
def workflow() -> str:
    if not _WORKFLOW.exists():
        pytest.skip(f"workflow not found at {_WORKFLOW}")
    return _WORKFLOW.read_text(encoding="utf-8")


def test_ci_asks_for_real_opencv(workflow):
    """The backend test step sets USE_REAL_CV2.

    FAILS IF: the env entry is dropped — at which point CI silently reverts to
    running 716 of 733 tests, which is exactly the condition that went unnoticed
    from the Phase-0 CI commit until 2026-08-19.
    """
    assert re.search(r'USE_REAL_CV2:\s*"?1"?', workflow), (
        "ci.yml no longer sets USE_REAL_CV2 — the backend job is back to running "
        "a stubbed cv2 and skipping seven test modules at import"
    )


def test_ci_installs_the_libraries_opencv_links_against(workflow):
    """`opencv-python` (not `-headless`) needs libGL and libgthread present.

    FAILS IF: the apt step is removed while USE_REAL_CV2 stays — real cv2 would
    then fail to import and the whole backend job would error, which is loud but
    a great deal more confusing than this assertion.
    """
    assert "libgl1" in workflow, "ci.yml stopped installing libgl1"
    assert "libglib2.0-0" in workflow, "ci.yml stopped installing libglib2.0-0"


def test_the_cv2_guards_are_still_in_place():
    """The seven guards must survive. Removing one to "widen CI coverage" is the
    trap this decision exists to avoid: two of them protect tests that pass
    vacuously under the stub.

    FAILS IF: a module drops its `USE_REAL_CV2` guard. That is not automatically
    wrong — `3afe085` correctly removed three unnecessary ones — but it must be a
    decision, not a side effect, and this is where it gets noticed.
    """
    tests_dir = Path(__file__).resolve().parent
    guarded = {
        p.name for p in tests_dir.glob("test_*.py")
        if "USE_REAL_CV2" in p.read_text(encoding="utf-8", errors="replace")
        and "environ" in p.read_text(encoding="utf-8", errors="replace")
    }

    load_bearing = {"test_plinth_detection.py", "test_exif_orientation.py"}
    missing = load_bearing - guarded
    assert not missing, (
        f"{sorted(missing)} lost its USE_REAL_CV2 guard. Both are vacuous under "
        "conftest's stub — plinth detection reports 0 differing pixels against "
        "the pre-C3.1 detector, and EXIF orientation errors on shape mismatch. "
        "Giving CI real OpenCV is the fix; deleting the guard is not."
    )
