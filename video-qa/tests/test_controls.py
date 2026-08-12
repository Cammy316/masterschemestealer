"""Synthetic controls.

Findings register #35: a gate you have never seen fail is not a gate. Each test
here feeds a signal engineered to violate exactly one gate and asserts that gate
rejects it. The two loudness controls are the ones that would have caught the
defect Phase 2 fixes.
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from audio_gates import (  # noqa: E402
    integrated_loudness, stereo_metrics, windowed_crest,
)
from container import escape_rbsp, parse_sps_colour, unescape_rbsp  # noqa: E402
from thresholds import loudness_ok  # noqa: E402

SR = 48000


def _sine(freq: float, seconds: float, amp: float, sr: int = SR) -> np.ndarray:
    t = np.arange(int(sr * seconds)) / sr
    return amp * np.sin(2 * np.pi * freq * t)


# --------------------------------------------------------------------------
# Loudness — the Phase 2 defect
# --------------------------------------------------------------------------

def test_correlated_stereo_reads_exactly_3_01_db_louder_than_one_channel():
    """THE test. Two identical correlated channels must sum, not average.

    Averaging is what the repo's offline gate effectively does by measuring a
    mono render, and it is why both beds shipped ~3 dB hot while the gate
    reported them in range.
    """
    one = _sine(1000, 5.0, 0.1)
    mono = np.vstack([one])
    dual = np.vstack([one, one])

    delta = integrated_loudness(dual, SR, "sum") - integrated_loudness(mono, SR, "sum")
    assert delta == pytest.approx(3.0103, abs=0.02)

    # And the wrong method must show no gain at all, which is the tell.
    wrong = integrated_loudness(dual, SR, "mean") - integrated_loudness(mono, SR, "sum")
    assert abs(wrong) < 0.02


def test_minus_20_dbfs_dual_mono_sine_reads_minus_20_lufs():
    """Absolute calibration of the K-weighting and gating chain.

    A 1 kHz sine sits on the K-weighting curve's unity point, so a -20 dBFS
    dual-mono tone must read -20.0 LUFS. If this drifts, every other loudness
    figure in the harness is offset by the same amount.
    """
    amp = 10 ** (-20 / 20)
    ch = np.vstack([_sine(1000, 8.0, amp)] * 2)
    # The reference case the standard is calibrated on. It lands on -20.0
    # because two effects cancel exactly: summing the pair adds 3.01 dB, and a
    # -20 dBFS sine's mean square sits 3.01 dB below its peak. Getting -17 or
    # -23 here means the channel aggregation is wrong in one direction or the
    # other, which is precisely the Phase 2 defect.
    assert integrated_loudness(ch, SR, "sum") == pytest.approx(-20.0, abs=0.1)
    # One channel alone is 3.01 dB quieter than the pair.
    single = integrated_loudness(np.vstack([_sine(1000, 8.0, amp)]), SR, "sum")
    assert single == pytest.approx(-23.01, abs=0.1)


def test_loudness_window_rejects_a_hot_master():
    assert loudness_ok(-14.0) and loudness_ok(-13.1) and loudness_ok(-14.9)
    assert not loudness_ok(-10.72)  # the shipped pict-cast
    assert not loudness_ok(-11.20)  # the shipped warp-cast


# --------------------------------------------------------------------------
# Stereo
# --------------------------------------------------------------------------

def test_phase_inverted_pair_fails_mono_retention():
    """Width built from phase tricks cancels on the phone speaker most people
    watch on. The metric must see that."""
    one = _sine(440, 2.0, 0.5)
    corr, mono_ret = stereo_metrics(np.vstack([one, -one]))
    assert mono_ret < 0.05, "a phase-inverted pair must collapse in mono"
    assert corr < -0.9
    # Control: an identical pair must NOT be flagged.
    _, ok_ret = stereo_metrics(np.vstack([one, one]))
    assert ok_ret > 0.99


# --------------------------------------------------------------------------
# Crest
# --------------------------------------------------------------------------

def test_square_wave_fails_the_crest_floor():
    """A fully limited signal has crest ~0 dB. A gate that passes this is not
    measuring dynamics at all."""
    sq = np.sign(_sine(200, 6.0, 1.0))
    cmin, _, _, _ = windowed_crest(np.vstack([sq, sq]), SR)
    assert cmin < 1.0
    # A sine's crest is 3.01 dB, well-defined — proves the metric is calibrated.
    sn = _sine(200, 6.0, 0.5)
    cmin2, _, _, _ = windowed_crest(np.vstack([sn, sn]), SR)
    assert cmin2 == pytest.approx(3.01, abs=0.1)


# --------------------------------------------------------------------------
# SPS parsing
# --------------------------------------------------------------------------

def test_rbsp_escape_round_trip_is_lossless():
    raw = bytes([0x67, 0x64, 0x00, 0x00, 0x03, 0x01, 0x00, 0x00, 0x03, 0x02, 0xFF])
    assert escape_rbsp(unescape_rbsp(raw)) == raw


def test_sps_without_colour_description_reports_absent():
    """Phase 1 must NOT patch in place when the flag is 0 — inserting 25 bits
    would shift every later VUI field and silently corrupt the stream. The
    parser has to report that case rather than invent a triple."""
    # video_signal_type_present_flag = 1, colour_description_present_flag = 0.
    tags = parse_sps_colour(_sps_with(colour_desc=False))
    assert tags.present is False
    assert tags.triple() == (None, None, None)


def test_sps_with_colour_description_reports_the_triple_and_its_bit_offset():
    tags = parse_sps_colour(_sps_with(colour_desc=True, triple=(6, 6, 5)))
    assert tags.present is True
    assert tags.triple() == (6, 6, 5)
    assert isinstance(tags.bit_offset, int) and tags.bit_offset > 0


class _BitWriter:
    def __init__(self) -> None:
        self.bits: list[int] = []

    def u(self, val: int, n: int) -> "_BitWriter":
        for i in range(n - 1, -1, -1):
            self.bits.append((val >> i) & 1)
        return self

    def ue(self, val: int) -> "_BitWriter":
        v = val + 1
        n = v.bit_length()
        self.u(0, n - 1)
        self.u(v, n)
        return self

    def bytes(self) -> bytes:
        b = bytearray()
        for i in range(0, len(self.bits), 8):
            chunk = self.bits[i : i + 8]
            chunk += [0] * (8 - len(chunk))
            b.append(int("".join(map(str, chunk)), 2))
        return bytes(b)


def _sps_with(colour_desc: bool, triple=(1, 1, 1)) -> bytes:
    """Minimal Baseline-profile SPS. Baseline (66) avoids the High-profile
    chroma branch, keeping the fixture small and readable."""
    w = _BitWriter()
    w.u(0x67, 8)          # NAL header, type 7
    w.u(66, 8)            # profile_idc = Baseline
    w.u(0, 8)             # constraint flags
    w.u(30, 8)            # level_idc
    w.ue(0)               # sps id
    w.ue(0)               # log2_max_frame_num_minus4
    w.ue(2)               # pic_order_cnt_type = 2
    w.ue(1)               # max_num_ref_frames
    w.u(0, 1)             # gaps_in_frame_num_value_allowed_flag
    w.ue(67)              # pic_width_in_mbs_minus1
    w.ue(119)             # pic_height_in_map_units_minus1
    w.u(1, 1)             # frame_mbs_only_flag
    w.u(1, 1)             # direct_8x8_inference_flag
    w.u(0, 1)             # frame_cropping_flag
    w.u(1, 1)             # vui_parameters_present_flag
    w.u(0, 1)             # aspect_ratio_info_present_flag
    w.u(0, 1)             # overscan_info_present_flag
    w.u(1, 1)             # video_signal_type_present_flag
    w.u(5, 3)             # video_format = unspecified
    w.u(0, 1)             # video_full_range_flag
    if colour_desc:
        w.u(1, 1)
        w.u(triple[0], 8)
        w.u(triple[1], 8)
        w.u(triple[2], 8)
    else:
        w.u(0, 1)
    w.u(0, 1)             # chroma_loc_info_present_flag
    w.u(0, 1)             # timing_info_present_flag
    w.u(1, 1)             # rbsp stop bit
    return w.bytes()
