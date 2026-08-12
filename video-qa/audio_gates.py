"""Audio measured from the muxed file's decoded audio track.

The one that matters: BS.1770-4 integrated loudness sums channel energies, it
does not average them. Averaging two highly correlated channels reads exactly
3.01 dB quiet, which is the error the repo's existing offline gate makes by
measuring a mono render. Every figure here is derived from the artefact.
"""

from __future__ import annotations

import subprocess
import wave
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np

from container import FFMPEG

# ITU-R BS.1770-4 K-weighting at 48 kHz: high-shelf then high-pass.
_SHELF_B = np.array([1.53512485958, -2.69169618940, 1.19839281085])
_SHELF_A = np.array([1.0, -1.69065929318, 0.73248077421])
_HPF_B = np.array([1.0, -2.0, 1.0])
_HPF_A = np.array([1.0, -1.99004745483, 0.99007225036])


@dataclass
class AudioReport:
    sample_rate: int = 0
    channels: int = 0
    duration: float = 0.0
    lufs_summed: float = 0.0
    lufs_channel_mean: float = 0.0  # the wrong method, reported for contrast
    true_peak_dbtp: float = 0.0
    crest_min_db: float = 0.0
    crest_median_db: float = 0.0
    crest_max_db: float = 0.0
    crest_min_at_s: float = 0.0
    bands: dict = field(default_factory=dict)
    onsets: list = field(default_factory=list)
    hf_on_beat: float = 0.0
    hf_window_coverage: float = 0.0
    correlation: float = 0.0
    mono_retention: float = 0.0


def demux_wav(src: Path, dst: Path) -> None:
    subprocess.run(
        [str(FFMPEG), "-y", "-v", "error", "-i", str(src), "-vn",
         "-acodec", "pcm_s16le", str(dst)],
        check=True, capture_output=True,
    )


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    """Returns float64 array shaped (channels, samples) in [-1, 1)."""
    with wave.open(str(path), "rb") as w:
        sr = w.getframerate()
        ch = w.getnchannels()
        raw = w.readframes(w.getnframes())
    a = np.frombuffer(raw, dtype="<i2").astype(np.float64) / 32768.0
    return a.reshape(-1, ch).T.copy(), sr


def _biquad(x: np.ndarray, b: np.ndarray, a: np.ndarray) -> np.ndarray:
    from scipy.signal import lfilter

    return lfilter(b, a, x)


def k_weight(x: np.ndarray) -> np.ndarray:
    return _biquad(_biquad(x, _SHELF_B, _SHELF_A), _HPF_B, _HPF_A)


def integrated_loudness(ch: np.ndarray, sr: int, aggregate: str = "sum") -> float:
    """BS.1770-4 integrated loudness over (channels, samples).

    aggregate='sum'  -> -0.691 + 10log10(SUM_ch z_ch), G_L = G_R = 1.0. Correct.
    aggregate='mean' -> the same with the mean. Wrong by 10log10(2) = 3.01 dB
    for two correlated channels, and reported only so the harness can show the
    gap rather than assert it in the dark.
    """
    kw = np.vstack([k_weight(c) for c in ch])
    block = int(round(sr * 0.400))
    hop = int(round(block * 0.25))
    if kw.shape[1] < block:
        return -70.0

    starts = range(0, kw.shape[1] - block + 1, hop)
    # z per block per channel: mean square of the K-weighted signal.
    z = np.array([[np.mean(kw[c, s : s + block] ** 2) for s in starts]
                  for c in range(kw.shape[0])])  # (channels, blocks)

    def loud(zblock: np.ndarray) -> np.ndarray:
        agg = zblock.sum(axis=0) if aggregate == "sum" else zblock.mean(axis=0)
        return -0.691 + 10 * np.log10(agg + 1e-12)

    l = loud(z)
    keep = l > -70.0  # absolute gate
    if not keep.any():
        return -70.0
    # Relative gate sits 10 LU below the absolutely-gated loudness.
    rel = -0.691 + 10 * np.log10(
        (z[:, keep].sum(axis=0) if aggregate == "sum" else z[:, keep].mean(axis=0)).mean()
        + 1e-12
    ) - 10.0
    keep2 = keep & (l > rel)
    if not keep2.any():
        return -70.0
    final = (z[:, keep2].sum(axis=0) if aggregate == "sum" else z[:, keep2].mean(axis=0))
    return float(-0.691 + 10 * np.log10(final.mean() + 1e-12))


def true_peak_dbtp(ch: np.ndarray, sr: int, oversample: int = 4) -> float:
    """Inter-sample peak via 4x oversampling, per BS.1770 Annex 2."""
    from scipy.signal import resample_poly

    peak = 0.0
    for c in ch:
        up = resample_poly(c, oversample, 1)
        peak = max(peak, float(np.max(np.abs(up))))
    return 20 * np.log10(peak + 1e-12)


def windowed_crest(ch: np.ndarray, sr: int, win_s: float = 3.0,
                   hop_s: float = 0.5) -> tuple[float, float, float, float]:
    """Crest factor over sliding windows: (min, median, max, time_of_min)."""
    mono = ch.mean(axis=0)
    win = int(sr * win_s)
    hop = int(sr * hop_s)
    if len(mono) < win:
        win = len(mono)
    vals, times = [], []
    for s in range(0, max(1, len(mono) - win + 1), hop):
        seg = mono[s : s + win]
        rms = np.sqrt(np.mean(seg**2)) + 1e-12
        pk = np.max(np.abs(seg)) + 1e-12
        vals.append(20 * np.log10(pk / rms))
        times.append(s / sr)
    v = np.array(vals)
    return float(v.min()), float(np.median(v)), float(v.max()), float(times[int(v.argmin())])


def band_ratios(ch: np.ndarray, sr: int) -> dict:
    mono = ch.mean(axis=0)
    n = 1 << int(np.ceil(np.log2(len(mono))))
    spec = np.abs(np.fft.rfft(mono, n)) ** 2
    freqs = np.fft.rfftfreq(n, 1 / sr)
    m = freqs >= 40  # ignore DC/rumble below the audible floor
    total = spec[m].sum() + 1e-30
    def frac(lo, hi):
        sel = m & (freqs >= lo) & (freqs < hi)
        return float(spec[sel].sum() / total)
    return {
        "sub_250": frac(40, 250),
        "low_mid_250_1k": frac(250, 1000),
        "mid_1k_3k": frac(1000, 3000),
        "high_3k_plus": frac(3000, sr / 2),
    }


def detect_onsets(ch: np.ndarray, sr: int, hop: int = 512,
                  n_fft: int = 2048) -> list[float]:
    """Spectral-flux onsets. Used to check highs are EVENTS, not a hiss bed."""
    mono = ch.mean(axis=0)
    frames = 1 + max(0, (len(mono) - n_fft) // hop)
    win = np.hanning(n_fft)
    prev = None
    flux = np.zeros(frames)
    for i in range(frames):
        seg = mono[i * hop : i * hop + n_fft] * win
        mag = np.abs(np.fft.rfft(seg))
        if prev is not None:
            flux[i] = np.sum(np.maximum(0.0, mag - prev))
        prev = mag
    if frames < 3:
        return []
    # Adaptive threshold: local median plus a fixed multiple of local spread.
    k = max(3, int(0.3 * sr / hop))
    onsets = []
    for i in range(1, frames - 1):
        lo, hi = max(0, i - k), min(frames, i + k + 1)
        local = flux[lo:hi]
        thr = np.median(local) + 1.8 * np.std(local)
        if flux[i] > thr and flux[i] >= flux[i - 1] and flux[i] > flux[i + 1]:
            t = i * hop / sr
            if not onsets or t - onsets[-1] > 0.12:
                onsets.append(round(float(t), 3))
    return onsets


def hf_on_beat(ch: np.ndarray, sr: int, onsets: list[float],
               lo_ms: float = -60.0, hi_ms: float = 400.0) -> tuple[float, float]:
    """Fraction of >3 kHz energy landing near an onset, AND the fraction of
    runtime those windows cover — so the figure cannot be gamed by widening
    the windows."""
    from scipy.signal import butter, sosfilt

    mono = ch.mean(axis=0)
    sos = butter(4, 3000 / (sr / 2), btype="highpass", output="sos")
    hf = sosfilt(sos, mono) ** 2
    if not onsets:
        return 0.0, 0.0
    mask = np.zeros(len(mono), dtype=bool)
    for t in onsets:
        a = max(0, int((t + lo_ms / 1000) * sr))
        b = min(len(mono), int((t + hi_ms / 1000) * sr))
        mask[a:b] = True
    total = hf.sum() + 1e-30
    return float(hf[mask].sum() / total), float(mask.mean())


def stereo_metrics(ch: np.ndarray) -> tuple[float, float]:
    if ch.shape[0] < 2:
        return 1.0, 1.0
    l, r = ch[0], ch[1]
    corr = float(np.sum(l * r) / (np.sqrt(np.sum(l**2) * np.sum(r**2)) + 1e-30))
    mid = (l + r) / 2
    mono_ret = float(np.sqrt(np.sum(mid**2) / (np.sum((l**2 + r**2) / 2) + 1e-30)))
    return corr, mono_ret


def analyse_audio(ch: np.ndarray, sr: int) -> AudioReport:
    rep = AudioReport(sample_rate=sr, channels=ch.shape[0],
                      duration=ch.shape[1] / sr)
    rep.lufs_summed = integrated_loudness(ch, sr, "sum")
    rep.lufs_channel_mean = integrated_loudness(ch, sr, "mean")
    rep.true_peak_dbtp = true_peak_dbtp(ch, sr)
    (rep.crest_min_db, rep.crest_median_db,
     rep.crest_max_db, rep.crest_min_at_s) = windowed_crest(ch, sr)
    rep.bands = band_ratios(ch, sr)
    rep.onsets = detect_onsets(ch, sr)
    rep.hf_on_beat, rep.hf_window_coverage = hf_on_beat(ch, sr, rep.onsets)
    rep.correlation, rep.mono_retention = stereo_metrics(ch)
    return rep
