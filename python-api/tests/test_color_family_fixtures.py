"""Golden colour-family fixtures — the lock for the single classifier.

`color_family_fixtures.json` is the SHARED ground-truth set, consumed by this
Python test AND by the frontend vitest test
(schemestealer-react/lib/__tests__/colorFamily.test.ts). Both run every fixture
through their respective classifier and assert it equals `expected`; because the
backend `classify_family` and the frontend `classifyFamily` are the same
algorithm over the same rounded lab→rgb→hsv bridge, "both match expected" is also
"both agree with each other" — the parity guarantee Stage A locks.

`color_family_stage_b_targets.json` holds the correct families the current
HSV-threshold method does NOT yet produce (the edge cases Stage B's LAB anchors
must fix). They are tracked, not asserted as passing, so CI stays green and a
target that starts passing is surfaced for promotion.
"""
import json
import os

import pytest

from core.color_engine import classify_family, compute_color_family

_HERE = os.path.dirname(__file__)
with open(os.path.join(_HERE, "color_family_fixtures.json"), encoding="utf-8") as f:
    FIXTURES = json.load(f)
with open(os.path.join(_HERE, "color_family_stage_b_targets.json"), encoding="utf-8") as f:
    STAGE_B_TARGETS = json.load(f)


def test_fixture_set_is_substantial():
    assert len(FIXTURES) >= 250, "golden set must cover the family space broadly"


@pytest.mark.parametrize(
    "case", FIXTURES,
    ids=[f"{c['hex']}{'-m' if c.get('metallic') else ''}" for c in FIXTURES],
)
def test_fixture_family(case):
    # The classifier is locked on the canonical LAB stored in the fixture — the
    # SAME value the frontend vitest test classifies, so the two are proven byte
    # identical regardless of any tiny rgb→lab float differences.
    assert classify_family(case["lab"], is_metallic=case.get("metallic", False)) \
        == case["expected"]
    # And the hex→family adapter agrees with the stored LAB (backend rgb→lab path).
    assert compute_color_family(
        case["hex"], "metallic" if case.get("metallic") else "matte") == case["expected"]


@pytest.mark.parametrize(
    "case", STAGE_B_TARGETS, ids=[c["hex"] for c in STAGE_B_TARGETS],
)
def test_stage_b_target_still_pending(case):
    """A Stage B target should still be misclassified by the current method. When
    one starts passing, fail loudly so it gets promoted into the golden set.
    (Empty after Stage B — the LAB nearest-exemplar classifier handles them all.)"""
    got = classify_family(case["lab"], is_metallic=case.get("metallic", False)) \
        if "lab" in case else compute_color_family(
            case["hex"], "metallic" if case.get("metallic") else "matte")
    if got == case["expected"]:
        pytest.fail(
            f"{case['hex']} now classifies correctly as '{got}' — move it into "
            "color_family_fixtures.json and remove from color_family_stage_b_targets.json"
        )
