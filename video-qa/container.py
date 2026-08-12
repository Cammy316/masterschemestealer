"""Container and elementary-stream parsing, done from the bytes.

Why this does not just call ffprobe: ffprobe collapses the `colr` atom and the
H.264 SPS VUI into ONE reported colour value. That collapse is precisely what
hid the defect this harness exists to catch — a file whose atom says BT.709 and
whose SPS says BT.601 reports as BT.601 and looks internally consistent. Both
layers are parsed here independently and reported with an explicit agreement
check.
"""

from __future__ import annotations

import json
import struct
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

# Vendored with Remotion — no new binary dependency for this harness.
_FF_DIR = (
    Path(__file__).resolve().parents[1]
    / "video-factory"
    / "node_modules"
    / "@remotion"
    / "compositor-win32-x64-msvc"
)
FFPROBE = _FF_DIR / ("ffprobe.exe" if (_FF_DIR / "ffprobe.exe").exists() else "ffprobe")
FFMPEG = _FF_DIR / ("ffmpeg.exe" if (_FF_DIR / "ffmpeg.exe").exists() else "ffmpeg")


@dataclass
class ColourTags:
    """What each layer claims. BT.709 is 1/1/1 in both encodings."""

    primaries: Optional[int] = None
    transfer: Optional[int] = None
    matrix: Optional[int] = None
    present: bool = False
    # Bit offset of colour_primaries within the unescaped SPS. Phase 1 needs
    # this to patch in place; recording it now costs nothing.
    bit_offset: Optional[int] = None

    def triple(self) -> tuple[Optional[int], Optional[int], Optional[int]]:
        return (self.primaries, self.transfer, self.matrix)

    def is_bt709(self) -> bool:
        return self.triple() == (1, 1, 1)


@dataclass
class ContainerReport:
    path: str
    width: int = 0
    height: int = 0
    frame_count: int = 0
    fps: float = 0.0
    video_duration: float = 0.0
    audio_duration: float = 0.0
    sample_rate: int = 0
    channels: int = 0
    pts_gap_min_ms: float = 0.0
    pts_gap_median_ms: float = 0.0
    pts_gap_max_ms: float = 0.0
    pts_gap_std_ms: float = 0.0
    colr: ColourTags = field(default_factory=ColourTags)
    sps: ColourTags = field(default_factory=ColourTags)
    ffprobe_colour: tuple = ()
    notes: list = field(default_factory=list)

    @property
    def tags_agree(self) -> bool:
        return self.colr.triple() == self.sps.triple()


# --------------------------------------------------------------------------
# colr atom
# --------------------------------------------------------------------------

def parse_colr_atoms(data: bytes) -> list[ColourTags]:
    """Scan for `colr` atoms carrying an nclx/nclc payload.

    Mirrors the scan-and-verify approach already proven in
    schemestealer-react/lib/reveal/mp4ColrPatch.ts: a false positive would need
    four bytes spelling 'colr', a valid colour type, and a plausible box size.
    """
    found: list[ColourTags] = []
    n = len(data)
    i = 0
    while i + 15 <= n:
        i = data.find(b"colr", i)
        if i < 0 or i + 15 > n:
            break
        ctype = data[i + 4 : i + 8]
        if ctype not in (b"nclx", b"nclc") or i < 4:
            i += 1
            continue
        size = struct.unpack(">I", data[i - 4 : i])[0]
        if size < 18 or i - 4 + size > n:
            i += 1
            continue
        found.append(
            ColourTags(
                primaries=struct.unpack(">H", data[i + 8 : i + 10])[0],
                transfer=struct.unpack(">H", data[i + 10 : i + 12])[0],
                matrix=struct.unpack(">H", data[i + 12 : i + 14])[0],
                present=True,
            )
        )
        i += 4
    return found


# --------------------------------------------------------------------------
# H.264 SPS VUI
# --------------------------------------------------------------------------

class _BitReader:
    """Bit-level reader. The VUI colour fields are u(8) at an arbitrary bit
    offset — they are not byte-aligned, so nothing here can use struct."""

    def __init__(self, data: bytes) -> None:
        self.data = data
        self.pos = 0  # in bits

    def u(self, n: int) -> int:
        v = 0
        for _ in range(n):
            byte = self.pos >> 3
            if byte >= len(self.data):
                raise ValueError("SPS truncated")
            bit = (self.data[byte] >> (7 - (self.pos & 7))) & 1
            v = (v << 1) | bit
            self.pos += 1
        return v

    def ue(self) -> int:
        """Exp-Golomb unsigned."""
        lead = 0
        while self.u(1) == 0:
            lead += 1
            if lead > 32:
                raise ValueError("invalid exp-Golomb")
        if lead == 0:
            return 0
        return (1 << lead) - 1 + self.u(lead)

    def se(self) -> int:
        k = self.ue()
        return (k + 1) // 2 if k % 2 else -(k // 2)


def unescape_rbsp(nal: bytes) -> bytes:
    """Strip emulation-prevention bytes: 00 00 03 -> 00 00."""
    out = bytearray()
    i = 0
    n = len(nal)
    while i < n:
        if i + 2 < n and nal[i] == 0 and nal[i + 1] == 0 and nal[i + 2] == 3:
            out += b"\x00\x00"
            i += 3
        else:
            out.append(nal[i])
            i += 1
    return bytes(out)


def escape_rbsp(rbsp: bytes) -> bytes:
    """Re-insert emulation-prevention bytes. Phase 1 needs this; Phase 0 uses
    it only to assert the round trip is lossless."""
    out = bytearray()
    zeros = 0
    for b in rbsp:
        if zeros >= 2 and b <= 3:
            out.append(3)
            zeros = 0
        out.append(b)
        zeros = zeros + 1 if b == 0 else 0
    return bytes(out)


_HIGH_PROFILES = {100, 110, 122, 244, 44, 83, 86, 118, 128, 138, 139, 134, 135}


def _skip_scaling_list(r: _BitReader, size: int) -> None:
    last = next_ = 8
    for _ in range(size):
        if next_ != 0:
            next_ = (last + r.se() + 256) % 256
        last = next_ if next_ != 0 else last


def parse_sps_colour(sps_nal: bytes) -> ColourTags:
    """Walk an SPS NAL to its VUI colour_description.

    Returns present=False when colour_description_present_flag is 0. That case
    matters: Phase 1 must NOT attempt an in-place patch there, because inserting
    the 25 bits would shift every subsequent VUI field and silently corrupt the
    stream.
    """
    rbsp = unescape_rbsp(sps_nal)
    r = _BitReader(rbsp)

    r.u(8)  # NAL header
    profile_idc = r.u(8)
    r.u(8)  # constraint flags + reserved
    r.u(8)  # level_idc
    r.ue()  # seq_parameter_set_id

    if profile_idc in _HIGH_PROFILES:
        chroma_format_idc = r.ue()
        if chroma_format_idc == 3:
            r.u(1)  # separate_colour_plane_flag
        r.ue()  # bit_depth_luma_minus8
        r.ue()  # bit_depth_chroma_minus8
        r.u(1)  # qpprime_y_zero_transform_bypass_flag
        if r.u(1):  # seq_scaling_matrix_present_flag
            count = 8 if chroma_format_idc != 3 else 12
            for i in range(count):
                if r.u(1):
                    _skip_scaling_list(r, 16 if i < 6 else 64)

    r.ue()  # log2_max_frame_num_minus4
    poc_type = r.ue()
    if poc_type == 0:
        r.ue()
    elif poc_type == 1:
        r.u(1)
        r.se()
        r.se()
        for _ in range(r.ue()):
            r.se()

    r.ue()  # max_num_ref_frames
    r.u(1)  # gaps_in_frame_num_value_allowed_flag
    r.ue()  # pic_width_in_mbs_minus1
    r.ue()  # pic_height_in_map_units_minus1
    if not r.u(1):  # frame_mbs_only_flag
        r.u(1)  # mb_adaptive_frame_field_flag
    r.u(1)  # direct_8x8_inference_flag
    if r.u(1):  # frame_cropping_flag
        r.ue(); r.ue(); r.ue(); r.ue()

    if not r.u(1):  # vui_parameters_present_flag
        return ColourTags(present=False)

    # ---- VUI ----
    if r.u(1):  # aspect_ratio_info_present_flag
        if r.u(8) == 255:  # aspect_ratio_idc == Extended_SAR
            r.u(16)
            r.u(16)
    if r.u(1):  # overscan_info_present_flag
        r.u(1)
    if r.u(1):  # video_signal_type_present_flag
        r.u(3)  # video_format
        r.u(1)  # video_full_range_flag
        if r.u(1):  # colour_description_present_flag
            offset = r.pos
            return ColourTags(
                primaries=r.u(8),
                transfer=r.u(8),
                matrix=r.u(8),
                present=True,
                bit_offset=offset,
            )
    return ColourTags(present=False)


def extract_sps_nals(data: bytes) -> list[bytes]:
    """Pull SPS NALs out of every `avcC` record.

    Brand is isomavc1mp41, so parameter sets are out-of-band in avcC rather than
    in-band. numOfSequenceParameterSets > 1 is legal and handled.
    """
    nals: list[bytes] = []
    i = 0
    n = len(data)
    while True:
        i = data.find(b"avcC", i)
        if i < 0:
            break
        p = i + 4
        # configurationVersion, profile, compat, level, lengthSizeMinusOne
        if p + 6 > n:
            break
        num_sps = data[p + 5] & 0x1F
        p += 6
        ok = True
        for _ in range(num_sps):
            if p + 2 > n:
                ok = False
                break
            ln = struct.unpack(">H", data[p : p + 2])[0]
            p += 2
            if p + ln > n or ln == 0:
                ok = False
                break
            nal = data[p : p + ln]
            # nal_unit_type 7 == SPS
            if nal[0] & 0x1F == 7:
                nals.append(nal)
            p += ln
        if not ok:
            pass
        i += 4
    return nals


# --------------------------------------------------------------------------
# timing
# --------------------------------------------------------------------------

def _ffprobe_json(path: Path, args: list[str]) -> dict:
    out = subprocess.run(
        [str(FFPROBE), "-v", "error", *args, "-of", "json", str(path)],
        capture_output=True,
        text=True,
        check=True,
    )
    return json.loads(out.stdout or "{}")


def read_container(path: Path) -> ContainerReport:
    rep = ContainerReport(path=str(path))
    data = path.read_bytes()

    colrs = parse_colr_atoms(data)
    if colrs:
        rep.colr = colrs[0]
        if len({c.triple() for c in colrs}) > 1:
            rep.notes.append("multiple colr atoms disagree with each other")

    sps_nals = extract_sps_nals(data)
    if sps_nals:
        rep.sps = parse_sps_colour(sps_nals[0])
        if len(sps_nals) > 1:
            triples = {parse_sps_colour(s).triple() for s in sps_nals}
            if len(triples) > 1:
                rep.notes.append("multiple SPS disagree with each other")
    else:
        rep.notes.append("no SPS found in avcC")

    streams = _ffprobe_json(path, ["-show_streams"]).get("streams", [])
    for s in streams:
        if s.get("codec_type") == "video":
            rep.width = int(s.get("width", 0))
            rep.height = int(s.get("height", 0))
            rep.video_duration = float(s.get("duration", 0) or 0)
            rate = s.get("r_frame_rate", "0/1").split("/")
            rep.fps = float(rate[0]) / float(rate[1]) if float(rate[1]) else 0.0
            rep.ffprobe_colour = (
                s.get("color_primaries"),
                s.get("color_transfer"),
                s.get("color_space"),
            )
        elif s.get("codec_type") == "audio":
            rep.audio_duration = float(s.get("duration", 0) or 0)
            rep.sample_rate = int(s.get("sample_rate", 0) or 0)
            rep.channels = int(s.get("channels", 0) or 0)

    pts = _ffprobe_json(
        path, ["-select_streams", "v:0", "-show_entries", "packet=pts_time"]
    ).get("packets", [])
    times = sorted(float(p["pts_time"]) for p in pts if p.get("pts_time") is not None)
    rep.frame_count = len(times)
    if len(times) > 1:
        import numpy as np

        gaps = np.diff(np.array(times)) * 1000.0
        rep.pts_gap_min_ms = float(gaps.min())
        rep.pts_gap_median_ms = float(np.median(gaps))
        rep.pts_gap_max_ms = float(gaps.max())
        rep.pts_gap_std_ms = float(gaps.std())
    return rep
