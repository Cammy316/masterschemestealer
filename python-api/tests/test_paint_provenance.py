"""
C4.7 / O-E1 — the engine must not upgrade a paint's provenance at load time.

`paints_groundtruth.json` records provenance honestly: 1,216 opaque paints carry
`color_source: "swatch-median"` (a region median of a photographed swatch) and 96
washes/shades/inks carry `color_source: "assumed"` — their LAB was never measured
at all. The engine overwrote both with `'measured'` for every record, so the
distinction the data records was destroyed before it reached the API.

MERGED O-E1 measured how synthetic those 96 are: **12 hex values are each carried
by 2+ assumed records, covering 68 of the 96 (71%)** — `#63493c` is shared by 17
paints across four brands — and each one ships an independently formatted ΔE badge
computed from the same number.

This matters beyond tidiness. `SESSION_BOOTSTRAP_PROMPT` invariant 9 is explicit
that the spectrophotometer story is FALSE and the honest line rests on the
measured/assumed split. An API that calls all 1,312 "measured" is the same class
of claim.

WHAT THIS COMMIT DOES NOT DO: it changes no ΔE, no badge and no matching
behaviour. `Paint.compute_properties` (`core/color_engine.py:108-111`) selects the
CIEDE2000 target on `measured_lab is not None`, NOT on `color_source`, so nothing
downstream reads the field yet. Surfacing the distinction in the UI is DEC-2.
"""

import sys
from collections import Counter
from pathlib import Path

import pytest

# NO `USE_REAL_CV2` GUARD, DELIBERATELY. These three assertions touch no image
# data at all -- they read `engine.paint_db` after the DB load -- so they are
# meaningful under `conftest.py`'s cv2 stub, and CI runs pytest WITHOUT that
# variable set. Verified by mutation under the stub: restoring
# `color_source='measured'` turns two of the three red. Contrast
# `test_plinth_detection.py`, which must keep its guard.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402

# The DB's own composition, per Skills&rules/skills/schemestealer-data/SKILL.md.
EXPECTED = {"swatch-median": 1216, "assumed": 96}


@pytest.fixture(scope="module")
def engine():
    return SchemeStealerEngine()


def test_loaded_paints_keep_the_provenance_the_database_records(engine):
    """Every loaded paint reports the `color_source` its record carries.

    FAILS TODAY: the engine set `color_source='measured'` unconditionally, so all
    1,312 reported `measured` and neither expected key appeared at all.

    FAILS AFTER IF: the assignment is reverted, or a defaulted `.get()` silently
    rewrites a value the record does have.
    """
    counts = Counter(p.color_source for p in engine.paint_db)
    assert dict(counts) == EXPECTED, f"provenance counts drifted: {dict(counts)}"


def test_assumed_washes_are_not_labelled_measured(engine):
    """The 96 records with no measured LAB must not claim one.

    Checked by name rather than by count so the assertion states the property
    instead of restating the fixture: a paint whose record says `assumed` must
    never report anything stronger.

    FAILS AFTER IF: anything maps `assumed` onto `measured`/`swatch-median` on the
    way through — the exact upgrade this commit removes.
    """
    assumed = [p for p in engine.paint_db if p.color_source == "assumed"]
    assert len(assumed) == EXPECTED["assumed"]
    assert all(p.category in ("wash", "shade", "ink") for p in assumed), (
        "an opaque base is reporting assumed provenance"
    )


def test_provenance_does_not_decide_the_matching_target(engine):
    """Changing `color_source` must not move a single matched colour.

    `compute_properties` (`core/color_engine.py:108-111`) branches on
    `measured_lab is not None`, not on `color_source` — despite the dataclass
    comment at `:82-84` having claimed the opposite for both. This pins the real
    coupling so a future reader cannot re-derive the wrong one: every paint whose
    record carries a `lab` still matches on that `lab`, whatever its provenance
    string says.

    FAILS AFTER IF: someone "restores" the documented behaviour by gating the
    measured-LAB selection on `color_source == 'measured'` — which, after this
    commit, no paint has, so all 1,312 would silently fall back to the hex.
    """
    for paint in engine.paint_db:
        if paint.measured_lab is not None:
            assert list(paint.lab) == pytest.approx(list(paint.measured_lab)), (
                f"{paint.paint_id} stopped matching on its stored LAB"
            )
