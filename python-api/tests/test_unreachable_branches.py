"""
C2.5 — code that reads as live and is not.

One class of defect, three instances, no behaviour change intended anywhere.

  * **O-C14c** `smart_color_system.py:234` — `elif coverage >= 0.5 and
    cluster_chroma > 50` sits behind `elif coverage >= 0.2` at `:223`. Any
    coverage clearing 0.5 clears 0.2 first, so the branch is unreachable by
    construction; the audit confirmed it by execution (`sys.settrace` over five
    real photographs: `:223` ran 7 times, `:234` and its logger 0). It lives
    inside `extract_colors`, which takes a whole image, so there is no unit-level
    seam to assert on — **its gate is a zero-diff bench plus both suites**, which
    is what the plan specifies.
  * **O-G8** `color_engine.py:346` — the `brightness_std > 30` branch of
    `determine_shade_type` is unreachable because `classify_surface_type` runs
    first and already returns `'wash'` for everything above 20. That one IS
    testable, and the test below is what makes the deletion provably safe rather
    than merely plausible.
  * **L5** `scripts/build_color_anchors.py` — the module docstring claimed
    grey/white/black "are NOT anchors", contradicted by its own code 30 lines
    below and by `classify_family`, which has no such gate. The last open ledger
    row.

**These tests are behaviour LOCKS, not failing-first fixtures**, and that is the
correct shape for a commit whose whole claim is "nothing changes". Two of them
(the config constant and the docstring) do fail on the parent commit; the rest
would fail if a deletion turned out not to be behaviour-neutral after all.
"""

import re
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import config  # noqa: E402
from core.color_engine import ColorAnalyzer, ShadeTypeAnalyser  # noqa: E402


def _cluster(is_metallic=False, value=0.5):
    return {'is_metallic': is_metallic, 'median_hsv': [0, 0, value]}


class TestHighTextureBranchWasRedundant:
    """The `> 30` branch could never decide anything. Proven, not assumed."""

    @pytest.mark.parametrize('std', [20.1, 25, 29.9, 30, 30.1, 35, 35.1, 45, 60])
    def test_everything_above_twenty_is_already_a_wash(self, std):
        """Above brightness_std 20, `classify_surface_type` returns 'weathered'
        or 'metallic', and `determine_shade_type` returns 'wash' on that alone —
        before reaching the deleted `> 30` test.

        What would make this fail: moving `classify_surface_type`'s 20 or 35
        thresholds (`color_engine.py:129-133`). That would make the deleted
        branch reachable again, and deleting it would then have been a real
        behaviour change rather than a tidy-up. This test is the tripwire on that.
        """
        assert ColorAnalyzer.classify_surface_type(std) in ('metallic', 'weathered')
        assert ShadeTypeAnalyser.determine_shade_type(_cluster(), std, 'Blue') == 'wash'

    def test_the_live_boundary_is_twenty_not_thirty(self):
        """The decision moves at 20. Three numbers existed for one decision —
        dead 45 (`ShadeRules.HIGH_TEXTURE_THRESHOLD`), unreachable 30, live 20 —
        and having a live constant beside a dead one is exactly why the dead one
        read as live.

        What would make this fail: a 'paint' answer at 20.1, or a 'wash' answer
        at 20.0 for a plain chromatic family in decent light.
        """
        assert ShadeTypeAnalyser.determine_shade_type(_cluster(), 20.0, 'Blue') == 'paint'
        assert ShadeTypeAnalyser.determine_shade_type(_cluster(), 20.1, 'Blue') == 'wash'

    def test_dead_constant_is_gone(self):
        """`ShadeRules.HIGH_TEXTURE_THRESHOLD = 45` had zero references anywhere
        in the tree — the branch it was named for used a hardcoded 30. Fails on
        the parent commit.

        What would make this fail: re-adding it. A threshold nothing reads is a
        claim about behaviour that is not true.
        """
        assert not hasattr(config.ShadeRules, 'HIGH_TEXTURE_THRESHOLD')

    def test_live_constant_survives(self):
        """`DARK_VALUE_THRESHOLD` sits on the next config line and IS read by the
        same function. Deleting it too would be a real behaviour change.

        What would make this fail: sweeping the whole ShadeRules block.
        """
        assert config.ShadeRules.DARK_VALUE_THRESHOLD == 0.2
        assert ShadeTypeAnalyser.determine_shade_type(_cluster(value=0.1), 5, 'Blue') == 'wash'


class TestShadeTypeGolden:
    """A slice of the 256-row sweep recorded on the parent commit, chosen at the
    rows that decide something: the 20 boundary, the deleted 30 boundary, the
    metallic dispatch, the keyword list and the dark-value floor.

    What would make this fail: any answer moving. That is the whole claim of this
    commit — the deletions change nothing.
    """

    @pytest.mark.parametrize(
        'std,is_metallic,family,value,expected',
        [
            # Below the live boundary: a plain chromatic family in decent light
            # is the ONLY combination that returns 'paint'.
            (0, False, 'Blue', 0.5, 'paint'),
            (19.9, False, 'Green', 0.5, 'paint'),
            (20, False, 'Blue', 0.5, 'paint'),
            # The live boundary.
            (20.1, False, 'Blue', 0.5, 'wash'),
            # Straddling the DELETED threshold — identical either side of it.
            (29.9, False, 'Blue', 0.5, 'wash'),
            (30, False, 'Blue', 0.5, 'wash'),
            (30.1, False, 'Blue', 0.5, 'wash'),
            # Metallic dispatch, by flag and by family name.
            (0, True, 'Blue', 0.5, 'wash'),
            (0, False, 'Silver', 0.5, 'wash'),
            # Wash keyword ('bone').
            (0, False, 'Bone', 0.5, 'wash'),
            # Dark value floor.
            (0, False, 'Blue', 0.1, 'wash'),
        ],
    )
    def test_answer_is_unchanged(self, std, is_metallic, family, value, expected):
        assert ShadeTypeAnalyser.determine_shade_type(
            _cluster(is_metallic, value), std, family
        ) == expected


def test_anchor_builder_docstring_does_not_contradict_its_own_code():
    """L5 — the docstring claimed the achromatic families are NOT anchors and are
    "handled by the explicit gate in color_engine.classify_family". There is no
    such gate, and `NEUTRALS` thirty lines below builds them as anchors like any
    other family. Fails on the parent commit.

    This is the class of stale claim that misdirects the next reader: it argues
    for a design (a hard achromatic gate) that D1 forbids and that the code does
    not implement.

    What would make this fail: restoring the claim, or deleting `NEUTRALS` so the
    docstring becomes true the wrong way round.
    """
    source = (Path(__file__).resolve().parent.parent
              / 'scripts' / 'build_color_anchors.py').read_text(encoding='utf-8')
    docstring = source.split('"""')[1]

    assert not re.search(r'NOT anchors', docstring), (
        "build_color_anchors' docstring still claims the neutrals are not anchors"
    )
    assert not re.search(r'explicit gate', docstring), (
        "build_color_anchors' docstring still cites a gate classify_family does not have"
    )
    # And the code it was lying about is still there.
    assert re.search(r'^NEUTRALS = \["grey", "white", "black"\]', source, re.MULTILINE)
