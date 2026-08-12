"""Calibration against two real device exports.

These are the reference measurements. A harness that reports all-green on two
known-broken files is itself broken, so this asserts BOTH directions: the six
gates that must fail, and the calibration figures that must stay passing.

Skipped when the exports are absent — they are large and untracked.
"""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from audio_gates import analyse_audio, demux_wav, read_wav  # noqa: E402
from container import read_container  # noqa: E402
from video_gates import analyse_video  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
MINI = ROOT / "Testimages" / "Mini2.0.mp4"
WARP = ROOT / "Testimages" / "Insppiration2.0.mp4"

pytestmark = pytest.mark.skipif(
    not (MINI.exists() and WARP.exists()),
    reason="device exports not present (large, untracked)",
)


@pytest.fixture(scope="module")
def mini():
    return _measure(MINI)


@pytest.fixture(scope="module")
def warp():
    return _measure(WARP)


def _measure(path: Path):
    c = read_container(path)
    v = analyse_video(path, c.width, c.height, c.fps or 30.0)
    with tempfile.TemporaryDirectory() as td:
        w = Path(td) / "a.wav"
        demux_wav(path, w)
        ch, sr = read_wav(w)
        a = analyse_audio(ch, sr)
    return c, v, a


# ---- must FAIL ----------------------------------------------------------

def test_both_files_carry_a_bt601_sps_under_a_bt709_atom(mini, warp):
    """Phase 1's evidence. The atom is patched and correct; the SPS is the
    layer ffprobe and every platform transcoder actually reads."""
    for c, _, _ in (mini, warp):
        assert c.colr.triple() == (1, 1, 1)
        assert c.sps.triple() == (6, 6, 5)
        assert not c.tags_agree


def test_both_beds_are_about_3_db_hot(mini, warp):
    _, _, am = mini
    _, _, aw = warp
    assert am.lufs_summed == pytest.approx(-10.72, abs=0.05)
    assert aw.lufs_summed == pytest.approx(-11.20, abs=0.05)
    # The wrong aggregation lands 3.01 dB lower, which is why the offline gate
    # reported these as roughly in range.
    assert am.lufs_summed - am.lufs_channel_mean == pytest.approx(3.01, abs=0.02)
    assert aw.lufs_summed - aw.lufs_channel_mean == pytest.approx(3.01, abs=0.02)


def test_warp_true_peak_breaches_the_ceiling(mini, warp):
    _, _, am = mini
    _, _, aw = warp
    assert am.true_peak_dbtp == pytest.approx(-1.26, abs=0.05)
    assert aw.true_peak_dbtp == pytest.approx(-0.84, abs=0.05)
    assert aw.true_peak_dbtp > -1.0


def test_crest_is_under_the_floor_on_both(mini, warp):
    assert mini[2].crest_min_db == pytest.approx(8.97, abs=0.1)
    assert warp[2].crest_min_db == pytest.approx(9.92, abs=0.1)


def test_warp_antifreeze_is_below_the_floor_after_encoding(mini, warp):
    """Measured on the CODED luma plane. Converting to RGB first lets chroma
    upsampling invent motion and reads 0.587 here, which would wrongly pass."""
    assert mini[1].antifreeze_min == pytest.approx(0.583, abs=0.005)
    assert warp[1].antifreeze_min == pytest.approx(0.493, abs=0.005)
    assert warp[1].antifreeze_min < 0.5
    assert warp[1].antifreeze_min_at_s == pytest.approx(13.57, abs=0.1)


def test_warp_has_a_long_sharpness_dip_and_mini_does_not(mini, warp):
    assert warp[1].sharpness_worst_ratio < 0.50
    assert warp[1].sharpness_dip_s > 1.0
    assert mini[1].sharpness_dip_s <= 0.35


def test_warp_puts_detail_outside_the_safe_area_and_mini_does_not(mini, warp):
    assert mini[1].detail_below_safe < 0.02
    assert warp[1].detail_below_safe > 0.10
    assert warp[1].detail_right_safe > 0.05


# ---- must PASS — miscalibration shows up here ----------------------------

def test_frame_pacing_is_exactly_30fps_on_both(mini, warp):
    assert mini[0].frame_count == 330
    assert warp[0].frame_count == 420
    for c, _, _ in (mini, warp):
        assert c.pts_gap_median_ms == pytest.approx(33.333, abs=0.001)
        assert c.pts_gap_std_ms < 0.01


def test_stereo_is_healthy_on_both(mini, warp):
    assert mini[2].correlation == pytest.approx(0.906, abs=0.01)
    assert warp[2].correlation == pytest.approx(0.823, abs=0.01)
    assert mini[2].mono_retention == pytest.approx(0.976, abs=0.01)
    assert warp[2].mono_retention == pytest.approx(0.955, abs=0.01)


def test_loop_seam_is_diffuse_not_a_jump(mini, warp):
    """~1.0 everywhere including flat black is I-frame versus end-of-GOP
    quantisation, not a composition error. Recorded so nobody chases it."""
    assert mini[1].loop_seam_mean < 2.0
    assert warp[1].loop_seam_mean < 2.0


def test_frame_luma_matches_the_reference(mini, warp):
    """Input to decision D2 — reported, never gated."""
    assert mini[1].luma_mean == pytest.approx(23.0, abs=1.0)
    assert warp[1].luma_mean == pytest.approx(131.0, abs=2.0)
