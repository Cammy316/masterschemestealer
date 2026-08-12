"""Video gate controls.

These inject synthetic frame sequences rather than building MP4s. The ffmpeg
vendored with Remotion is a decode-oriented build — no rawvideo muxer, no
rawvideo demuxer, no lavfi source filters — so a frozen clip cannot be
manufactured as a real file here. The end-to-end "measures a muxed MP4" claim
is carried by the two device exports in tests/test_device_exports.py; what
these prove is that the gate logic rejects what it is supposed to reject.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from video_gates import antifreeze_min, deltas_from_planes  # noqa: E402

H, W, FPS = 64, 36, 30.0


def _frozen(n: int = 60) -> list[np.ndarray]:
    f = np.full((H, W), 80, np.uint8)
    return [f.copy() for _ in range(n)]


def _moving(n: int = 60, amplitude: int = 12) -> list[np.ndarray]:
    rng = np.random.default_rng(7)
    base = np.full((H, W), 80, np.int16)
    return [np.clip(base + rng.integers(-amplitude, amplitude, (H, W)), 0, 255)
            .astype(np.uint8) for _ in range(n)]


def test_constant_frames_fail_antifreeze():
    """If this passes, the gate is not measuring motion at all and every green
    anti-freeze result in the harness is meaningless."""
    value, _ = antifreeze_min(deltas_from_planes(iter(_frozen())), FPS)
    assert value == 0.0
    assert value < 0.5


def test_moving_frames_pass_antifreeze():
    """The control's control — the gate must not simply reject everything."""
    value, _ = antifreeze_min(deltas_from_planes(iter(_moving())), FPS)
    assert value >= 0.5


def test_a_freeze_in_the_middle_is_located_not_just_detected():
    """A clip can move overall and still stall. The gate reports WHEN, because
    'somewhere in 14 seconds' is not actionable."""
    frames = _moving(30) + _frozen(20) + _moving(30)
    value, at = antifreeze_min(deltas_from_planes(iter(frames)), FPS)
    assert value < 0.5
    # The frozen run starts at frame 30 -> 1.0 s in, and the quietest window
    # sits inside it rather than at either end of the clip.
    assert 0.9 <= at <= 1.7, f"freeze located at {at}s, expected inside 0.9-1.7s"


def test_a_single_dropped_frame_does_not_trip_the_gate():
    """One duplicated frame is normal encoder behaviour. The 0.4 s window
    exists so a momentary repeat does not read as a freeze."""
    frames = _moving(30)
    frames.insert(15, frames[14].copy())
    value, _ = antifreeze_min(deltas_from_planes(iter(frames)), FPS)
    assert value >= 0.5
