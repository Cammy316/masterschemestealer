"""
O-B3 (UI half) — the quality report must not promise a correction the pipeline
never applies.

Three warnings claimed an automatic fix:

    "✨ Glare detected - reducing brightness peaks"        (photo_processor.py:60)
    "💡 Image is dark - brightening automatically"          (:69)
    "☀️ Image is too bright - reducing exposure"            (:75)

All three describe an effect on `enhanced_image`, which is built and NEVER READ.
`schemestealer_engine.py:228-230` consumes only `can_process` (closed ledger row
L7), so the matcher sees the untouched pixels. The underlying condition is not
cosmetic: -0.3 EV already changes 57% of top-1 matches and flips the family set
on 5 of 5 real photographs.

**Scope correction, measured on live code.** The plan (and the audit behind it)
says the UI tells the user a correction happened. It does not: `quality_report`
is bound and then discarded in BOTH scanners
(`miniature_scanner.py:105,118`, `inspiration_scanner.py:77`),
`_format_results(recipes, mode)` takes no quality argument, and the API response
is `{mode, colors, paints, mask_frame, metadata}` — no quality field, and
`main.py` adds none. So these strings reach nobody today. They are still wrong,
for the reason this whole audit exists: they are the description a future reader
trusts, and they describe an enhancement path that does not run. The honest claim
is "dead copy asserting a correction that never happens", not "the UI lies".

Rewriting them to state the CONDITION and the USER ACTION keeps them correct
whichever way that plumbing is later resolved — surfaced or deleted.

Out of scope, deliberately: wiring `enhanced_image` into the pipeline, and any
L* normalisation. Naive normalisation destroys the lightness the paint match
depends on and is on the ledger's already-rejected list; a real exposure
substitute is spike S2.
"""

import re
import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.photo_processor import PhotoProcessor  # noqa: E402

# Language that asserts the pipeline did something to the pixels. `brighten`
# rather than `bright` so a warning may still say "re-shoot brighter" — that is
# an instruction to the user, not a claim about the image.
PROMISSORY = re.compile(
    r'automatic|brighten|reducing|corrected|correcting|adjusted|adjusting|'
    r'enhanced|enhancing|compensat',
    re.IGNORECASE,
)

# A warning that names a fault and no remedy is only half useful. Every warning
# that reports a fixable capture condition must contain one of these; adding a
# new warning means adding its verb here on purpose.
USER_ACTIONS = ('re-scan', 're-shoot', 'shade the lamp')


def _flat_image(level: int) -> np.ndarray:
    return np.full((64, 64, 3), level, dtype=np.uint8)


def _warnings_for(monkeypatch, *, glare=False, exposure='normal', cast=False):
    """Force one branch of `process_and_assess` and return its warnings.

    The detectors are patched rather than fed contrived pixels so the test pins
    the COPY, not the thresholds — a threshold change must not silently stop
    exercising a branch.
    """
    proc = PhotoProcessor()
    monkeypatch.setattr(proc, '_is_blurry', lambda img: False)
    monkeypatch.setattr(proc, '_has_glare', lambda img: glare)
    monkeypatch.setattr(proc, '_check_exposure', lambda img: exposure)
    monkeypatch.setattr(proc, '_has_severe_color_cast', lambda img: cast)
    return proc.process_and_assess(_flat_image(128)).warnings


@pytest.mark.parametrize(
    'kwargs',
    [
        {'glare': True},
        {'exposure': 'underexposed'},
        {'exposure': 'overexposed'},
        {'cast': True},
    ],
    ids=['glare', 'underexposed', 'overexposed', 'colour_cast'],
)
def test_no_warning_claims_an_automatic_correction(monkeypatch, kwargs):
    """No quality warning may assert that the image was fixed.

    What would make this fail: restoring any of the three original strings, or
    writing a new one that says the auspex compensated, adjusted or corrected
    anything. Nothing downstream of `photo_processor` touches the pixels the
    matcher measures — `enhanced_image` has no reader.

    The colour-cast case carries no promise today and is included so that the
    reword cannot quietly sweep it up: it must still fire, and still say only
    what it observes.
    """
    warnings = _warnings_for(monkeypatch, **kwargs)
    assert warnings, f"branch {kwargs} produced no warning at all"
    for text in warnings:
        assert not PROMISSORY.search(text), (
            f"quality warning promises a correction the pipeline never applies: {text!r}"
        )


@pytest.mark.parametrize(
    'kwargs',
    [{'glare': True}, {'exposure': 'underexposed'}, {'exposure': 'overexposed'}],
    ids=['glare', 'underexposed', 'overexposed'],
)
def test_capture_warnings_tell_the_user_what_to_do(monkeypatch, kwargs):
    """Each fixable capture fault names an action the user can take.

    What would make this fail: replacing a false promise with a bare
    observation ("Glare detected") — honest, but it drops the only half of the
    message that was ever actionable. These three faults are all corrected at
    the camera, which is the point: there is no server-side remedy.
    """
    warnings = _warnings_for(monkeypatch, **kwargs)
    assert any(
        any(action in text.lower() for action in USER_ACTIONS) for text in warnings
    ), f"branch {kwargs} names a fault with no user action: {warnings}"


def test_emoji_convention_is_preserved(monkeypatch):
    """Every warning still opens with its emoji.

    The scan card's layout is built around that convention, so dropping it while
    rewording the copy would move UI that this commit has no business moving.
    What would make this fail: emitting a bare-text warning.
    """
    for kwargs in ({'glare': True}, {'exposure': 'underexposed'},
                   {'exposure': 'overexposed'}, {'cast': True}):
        for text in _warnings_for(monkeypatch, **kwargs):
            assert not text[0].isascii(), f"warning lost its emoji prefix: {text!r}"
