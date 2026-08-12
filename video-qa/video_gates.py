"""Video measured from decoded frames of the muxed file.

Frames are streamed one at a time rather than loaded as an array: 420 frames of
1080x1920 RGB is ~2.6 GB, and every gate here is either a running scalar or a
per-region accumulator, so nothing needs the whole clip resident.
"""

from __future__ import annotations

import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterator

import numpy as np

from container import FFMPEG

# Matches lib/reveal/revealLayout.ts SAFE_RECT { x:180, y:190, w:720, h:1240 }.
SAFE_X0, SAFE_Y0, SAFE_X1, SAFE_Y1 = 180, 190, 900, 1430
DETAIL_GRADIENT = 25  # a pixel counts as "detail" above this local gradient


@dataclass
class VideoReport:
    width: int = 0
    height: int = 0
    frame_count: int = 0
    fps: float = 30.0
    antifreeze_min: float = 0.0
    antifreeze_min_at_s: float = 0.0
    loop_seam_mean: float = 0.0
    loop_seam_p99: float = 0.0
    loop_seam_worst_tile: tuple = ()
    sharpness_median: float = 0.0
    sharpness_worst_ratio: float = 1.0
    sharpness_dip_s: float = 0.0
    sharpness_dip_at_s: float = 0.0
    detail_below_safe: float = 0.0
    detail_right_safe: float = 0.0
    detail_left_safe: float = 0.0
    luma_mean: float = 0.0
    luma_per_second: list = field(default_factory=list)


def iter_frames(path: Path, width: int, height: int) -> Iterator[np.ndarray]:
    """Yield RGB frames as uint8 (h, w, 3), streamed from ffmpeg."""
    size = width * height * 3
    # image2pipe + the rawvideo ENCODER, not the rawvideo muxer: the ffmpeg
    # vendored with Remotion is a stripped build and has no rawvideo muxer.
    proc = subprocess.Popen(
        [str(FFMPEG), "-v", "error", "-i", str(path),
         "-f", "image2pipe", "-vcodec", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
    )
    try:
        while True:
            buf = proc.stdout.read(size)
            if not buf or len(buf) < size:
                break
            yield np.frombuffer(buf, np.uint8).reshape(height, width, 3)
    finally:
        proc.stdout.close()
        proc.wait()


def _luma(rgb: np.ndarray) -> np.ndarray:
    # BT.709 luma, matching how the file is meant to be interpreted.
    return (0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1]
            + 0.0722 * rgb[:, :, 2])


def iter_luma_planes(path: Path, width: int, height: int) -> Iterator[np.ndarray]:
    """Yield the CODED Y plane, uint8 (h, w).

    Anti-freeze uses this rather than RGB deliberately. Converting to RGB first
    lets 4:2:0 chroma upsampling invent inter-frame difference that the encoder
    never coded, which inflates the measurement by ~0.03 and hides a file that
    is genuinely below the floor.
    """
    size = width * height
    proc = subprocess.Popen(
        [str(FFMPEG), "-v", "error", "-i", str(path),
         "-f", "image2pipe", "-vcodec", "rawvideo", "-pix_fmt", "gray", "-"],
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
    )
    try:
        while True:
            buf = proc.stdout.read(size)
            if not buf or len(buf) < size:
                break
            yield np.frombuffer(buf, np.uint8).reshape(height, width)
    finally:
        proc.stdout.close()
        proc.wait()


def _gradient(y: np.ndarray) -> np.ndarray:
    """Local gradient magnitude, forward difference. Cheap and sufficient —
    this feeds a threshold, not a rendering. Magnitude, not gx+gy: summing the
    two axes roughly doubles an edge running along one of them, which pushes
    twice as many pixels past the detail threshold."""
    gx = np.zeros_like(y)
    gy = np.zeros_like(y)
    gx[:, :-1] = np.diff(y, axis=1)
    gy[:-1, :] = np.diff(y, axis=0)
    return np.sqrt(gx * gx + gy * gy)


def deltas_from_planes(planes: Iterator[np.ndarray]) -> list[float]:
    """Mean absolute inter-frame delta for each adjacent pair.

    Split out from analyse_video so the anti-freeze control can inject a
    synthetic sequence: the ffmpeg vendored with Remotion can decode but not
    encode from a filter source, so a frozen clip cannot be manufactured as a
    real MP4 here. The end-to-end path is covered by the two device exports.
    """
    out: list[float] = []
    prev = None
    for plane in planes:
        f = plane.astype(np.float32)
        if prev is not None:
            out.append(float(np.mean(np.abs(f - prev))))
        prev = f
    return out


def antifreeze_min(deltas: list[float], fps: float) -> tuple[float, float]:
    """Quietest 0.4 s window, and when it happens. Returns (value, seconds)."""
    if not deltas:
        return 0.0, 0.0
    win = max(1, int(round(fps * 0.4)))
    d = np.array(deltas)
    means = (np.convolve(d, np.ones(win) / win, mode="valid")
             if len(d) >= win else np.array([d.mean()]))
    return float(means.min()), float(int(means.argmin()) / fps)


def analyse_video(path: Path, width: int, height: int, fps: float) -> VideoReport:
    rep = VideoReport(width=width, height=height, fps=fps)

    # Pass 1 — anti-freeze, on the coded Y plane. See iter_luma_planes.
    deltas = deltas_from_planes(iter_luma_planes(path, width, height))

    # Pass 2 — everything else, on RGB.
    first = None
    prev = None
    sharp: list[float] = []        # per frame, mean |gradient|
    luma: list[float] = []
    det_total = det_below = det_right = det_left = 0

    for i, frame in enumerate(iter_frames(path, width, height)):
        f = frame.astype(np.float32)
        if first is None:
            first = f.copy()
        prev = f

        y = _luma(f)
        luma.append(float(y.mean()))
        g = _gradient(y)
        sharp.append(float(g.mean()))

        detail = g > DETAIL_GRADIENT
        det_total += int(detail.sum())
        det_below += int(detail[SAFE_Y1:, :].sum())
        det_right += int(detail[:, SAFE_X1:].sum())
        det_left += int(detail[:, :SAFE_X0].sum())

    rep.frame_count = len(luma)
    if rep.frame_count == 0:
        return rep

    # ---- anti-freeze: sliding 0.4 s window over adjacent-frame deltas -------
    rep.antifreeze_min, rep.antifreeze_min_at_s = antifreeze_min(deltas, fps)

    # ---- loop seam: frame 0 vs final, plus a tile map -----------------------
    # A diffuse ~1.0 everywhere is I-frame vs end-of-GOP quantisation. A tile
    # map is what separates that from a real, localised composition jump.
    last = prev
    if first is not None and last is not None:
        diff = np.abs(_luma(first) - _luma(last))
        rep.loop_seam_mean = float(diff.mean())
        rep.loop_seam_p99 = float(np.percentile(diff, 99))
        th, tw = height // 6, width // 6
        worst, worst_at = -1.0, ()
        for ty in range(6):
            for tx in range(6):
                m = float(diff[ty * th:(ty + 1) * th, tx * tw:(tx + 1) * tw].mean())
                if m > worst:
                    worst, worst_at = m, (tx, ty)
        rep.loop_seam_worst_tile = (*worst_at, round(worst, 3))

    # ---- sharpness ----------------------------------------------------------
    s = np.array(sharp)
    rep.sharpness_median = float(np.median(s))
    ratio = s / (rep.sharpness_median + 1e-9)
    rep.sharpness_worst_ratio = float(ratio.min())
    # Longest contiguous run below 70% of the clip median.
    below = ratio < 0.70
    run = best = 0
    best_end = 0
    for i, b in enumerate(below):
        run = run + 1 if b else 0
        if run > best:
            best, best_end = run, i
    rep.sharpness_dip_s = best / fps
    rep.sharpness_dip_at_s = float((best_end - best + 1) / fps) if best else 0.0

    # ---- safe area ----------------------------------------------------------
    if det_total:
        rep.detail_below_safe = det_below / det_total
        rep.detail_right_safe = det_right / det_total
        rep.detail_left_safe = det_left / det_total

    # ---- luma ---------------------------------------------------------------
    rep.luma_mean = float(np.mean(luma))
    per_s = []
    for s0 in range(0, rep.frame_count, int(round(fps))):
        per_s.append(round(float(np.mean(luma[s0:s0 + int(round(fps))])), 1))
    rep.luma_per_second = per_s
    return rep
