"""Gate thresholds and the safe-area artwork allowlist.

Ground rule 8: every gate must have a one-sentence answer to "what would make
this fail". Those answers are the `why` field — they are printed on failure, so
a red gate explains itself without anyone opening this file.
"""

from __future__ import annotations

from dataclasses import dataclass

BT709 = (1, 1, 1)


@dataclass(frozen=True)
class Gate:
    key: str
    why: str


# Regions permitted to be artwork, per mode. A NAMED LIST, not a threshold:
# a threshold lets a future regression hide underneath it, whereas adding a
# region here is a visible decision someone has to justify in review.
SAFE_AREA_ARTWORK = {
    "pict": [],
    "warp": [
        # D1(a): the swatch colour fields keep bleeding to the frame bottom.
        # Their LABELS move above y=1428 in Phase 4 and are NOT allowlisted.
        ("swatch-colour-fields", 0, 1430, 1080, 1920),
    ],
}

THRESHOLDS = {
    # --- container -------------------------------------------------------
    "colr_bt709":       dict(why="the colr atom stops reading 1/1/1"),
    "sps_bt709":        dict(why="the H.264 SPS VUI stops reading 1/1/1 — this is the layer ffprobe and every platform transcoder believes"),
    "tags_agree":       dict(why="the atom and the SPS disagree, so the file contradicts itself about its own colour"),
    "av_duration_50ms": dict(max_delta=0.050, why="audio and video durations drift more than 50 ms apart"),
    "fps_stable":       dict(max_std_ms=1.0, why="PTS spacing wanders, i.e. the render dropped or duplicated frames"),

    # --- video -----------------------------------------------------------
    "antifreeze":       dict(floor=0.5, why="any 0.4 s window of coded luma moves less than 0.5/255 per pixel, i.e. the clip looks frozen after H.264 has taken its cut"),
    "sharpness":        dict(ratio=0.70, max_dip_s=0.35, why="a window longer than 0.35 s sits below 70% of the clip's median sharpness"),
    "safe_area_right":  dict(max_fraction=0.02, why="more than 2% of detail sits right of x=900, under the platform action rail"),
    "safe_area_below":  dict(max_fraction=0.02, why="more than 2% of NON-ALLOWLISTED detail sits below y=1430, under the caption"),

    # --- audio -----------------------------------------------------------
    "loudness":         dict(target=-14.0, tol=1.0, why="integrated loudness (channel energies SUMMED per BS.1770-4) leaves the -14 +/-1 window platforms normalise toward"),
    "true_peak":        dict(ceiling=-1.0, why="true peak exceeds -1 dBTP, so AAC reconstruction overshoot can clip on the listener's device"),
    "crest":            dict(floor=12.0, why="the quietest 3 s window's crest factor drops below 12 dB, i.e. the limiter has flattened the transients"),
    "mono_retention":   dict(floor=0.80, why="a mono downmix loses more than 20% of level, i.e. the stereo width is phase tricks that cancel on a phone speaker"),
    "correlation":      dict(floor=0.30, why="the two channels decorrelate far enough to sound like two different mixes"),
}


def loudness_ok(lufs: float) -> bool:
    t = THRESHOLDS["loudness"]
    return abs(lufs - t["target"]) <= t["tol"]
