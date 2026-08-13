"""Post-mux QA harness — measures the artefact, not the render.

Every gate in schemestealer-react runs before muxing: on frameState, on an
OfflineAudioContext, or on a canvas. Two shipped device exports failed four
gates that the pre-encode suite reported as passing, because nobody measured
the finished MP4. This does.

Usage:
    python qa_video.py FILE.mp4 [FILE.mp4 ...] [--mode pict|warp] [--json DIR]

Exits non-zero if any gate fails.
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from audio_gates import analyse_audio, demux_wav, read_wav  # noqa: E402
from container import read_container  # noqa: E402
from thresholds import SAFE_AREA_ARTWORK, THRESHOLDS, loudness_ok  # noqa: E402
from video_gates import analyse_video  # noqa: E402

GREEN, RED, DIM, RESET = "\033[32m", "\033[31m", "\033[2m", "\033[0m"


class Results:
    def __init__(self) -> None:
        self.rows: list[dict] = []
        self.failed = False

    def add(self, name: str, ok: bool, measured, threshold, at: str = "") -> None:
        self.rows.append(
            {"gate": name, "ok": bool(ok), "measured": measured,
             "threshold": threshold, "at": at,
             "why": THRESHOLDS.get(name, {}).get("why", "")}
        )
        if not ok:
            self.failed = True


def infer_mode(duration: float) -> str:
    """pict-cast is 11 s, warp-cast 14 s. Only a default — --mode overrides,
    and the mode only selects the safe-area artwork allowlist."""
    return "warp" if duration > 12.5 else "pict"


def run_one(path: Path, mode: str | None, out_dir: Path | None) -> Results:
    res = Results()
    c = read_container(path)
    mode = mode or infer_mode(c.video_duration)

    # ---- container ------------------------------------------------------
    res.add("colr_bt709", c.colr.is_bt709(), c.colr.triple(), (1, 1, 1))
    res.add("sps_bt709", c.sps.is_bt709(), c.sps.triple(), (1, 1, 1))
    res.add("tags_agree", c.tags_agree,
            {"colr": c.colr.triple(), "sps": c.sps.triple(), "ffprobe": c.ffprobe_colour},
            "colr == sps")
    d = abs(c.video_duration - c.audio_duration)
    res.add("av_duration_50ms", d <= THRESHOLDS["av_duration_50ms"]["max_delta"],
            round(d, 4), "<= 0.050 s")
    res.add("fps_stable", c.pts_gap_std_ms <= THRESHOLDS["fps_stable"]["max_std_ms"],
            round(c.pts_gap_std_ms, 5), "<= 1.0 ms std")

    # ---- video ----------------------------------------------------------
    allow = SAFE_AREA_ARTWORK.get(mode, [])
    v = analyse_video(path, c.width, c.height, c.fps or 30.0, allow)
    res.add("antifreeze", v.antifreeze_min >= THRESHOLDS["antifreeze"]["floor"],
            round(v.antifreeze_min, 3), ">= 0.5", f"t={v.antifreeze_min_at_s:.2f}s")
    res.add("sharpness", v.sharpness_dip_s <= THRESHOLDS["sharpness"]["max_dip_s"],
            {"worst_ratio": round(v.sharpness_worst_ratio, 3),
             "dip_s": round(v.sharpness_dip_s, 2)},
            "no window > 0.35 s below 70% of median",
            f"t={v.sharpness_dip_at_s:.2f}s")

    # Detail inside an allowlisted artwork rect is excluded upstream, in
    # analyse_video. What remains below the line is INFORMATION, which is the
    # thing the platform caption would cover.
    res.add("safe_area_right",
            v.detail_right_safe <= THRESHOLDS["safe_area_right"]["max_fraction"],
            round(v.detail_right_safe, 4), "<= 0.02")
    res.add("safe_area_below",
            v.detail_below_safe <= THRESHOLDS["safe_area_below"]["max_fraction"],
            {"fraction": round(v.detail_below_safe, 4),
             "artwork_noted": [r[0] for r in allow]},
            "<= 0.02 of detail")

    # ---- audio ----------------------------------------------------------
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "a.wav"
        demux_wav(path, wav)
        ch, sr = read_wav(wav)
        a = analyse_audio(ch, sr)

    res.add("loudness", loudness_ok(a.lufs_summed), round(a.lufs_summed, 2), "-14 +/-1 LUFS")
    res.add("true_peak", a.true_peak_dbtp <= THRESHOLDS["true_peak"]["ceiling"],
            round(a.true_peak_dbtp, 2), "<= -1.0 dBTP")
    res.add("crest", a.crest_min_db >= THRESHOLDS["crest"]["floor"],
            round(a.crest_min_db, 2), ">= 12 dB", f"t={a.crest_min_at_s:.2f}s")
    res.add("mono_retention", a.mono_retention >= THRESHOLDS["mono_retention"]["floor"],
            round(a.mono_retention, 3), ">= 0.80")
    res.add("correlation", a.correlation >= THRESHOLDS["correlation"]["floor"],
            round(a.correlation, 3), ">= 0.30")

    payload = {
        "file": str(path),
        "mode": mode,
        "container": dataclasses.asdict(c),
        "video": dataclasses.asdict(v),
        "audio": dataclasses.asdict(a),
        "gates": res.rows,
        # Reported, never gated — input to decision D2.
        "reported_only": {
            "frame_luma_mean": round(v.luma_mean, 1),
            "frame_luma_per_second": v.luma_per_second,
            "loop_seam_mean": round(v.loop_seam_mean, 3),
            "loop_seam_p99": round(v.loop_seam_p99, 3),
            "loop_seam_worst_tile": v.loop_seam_worst_tile,
            "band_ratios": a.bands,
            "onsets": a.onsets,
            "hf_on_beat": round(a.hf_on_beat, 3),
            "hf_window_coverage": round(a.hf_window_coverage, 3),
            "lufs_channel_mean_WRONG": round(a.lufs_channel_mean, 2),
        },
    }
    if out_dir:
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / (path.stem + ".json")).write_text(
            json.dumps(payload, indent=2, default=str), encoding="utf-8"
        )
    _print_table(path, mode, res, payload["reported_only"])
    return res


def _print_table(path: Path, mode: str, res: Results, reported: dict) -> None:
    print(f"\n{path.name}  [mode={mode}]")
    print("-" * 78)
    for r in res.rows:
        mark = f"{GREEN}PASS{RESET}" if r["ok"] else f"{RED}FAIL{RESET}"
        at = f"  {DIM}{r['at']}{RESET}" if r["at"] else ""
        print(f"  {mark}  {r['gate']:<18} {str(r['measured']):<34} vs {r['threshold']}{at}")
        if not r["ok"] and r["why"]:
            print(f"        {DIM}fails when: {r['why']}{RESET}")
    print(f"  {DIM}reported only: luma {reported['frame_luma_mean']}, "
          f"seam {reported['loop_seam_mean']}, "
          f"LUFS-if-averaged(wrong) {reported['lufs_channel_mean_WRONG']}{RESET}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--mode", choices=["pict", "warp"], default=None)
    ap.add_argument("--json", type=Path, default=None, dest="json_dir")
    args = ap.parse_args()

    any_failed = False
    for f in args.files:
        if not f.exists():
            print(f"{RED}missing:{RESET} {f}")
            any_failed = True
            continue
        if run_one(f, args.mode, args.json_dir).failed:
            any_failed = True

    print()
    print(f"{RED}FAILED{RESET}" if any_failed else f"{GREEN}ALL GATES PASSED{RESET}")
    return 1 if any_failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
