"""
Task 2 — replace target colours for existing (matched) paints with the measured
applied colour. Writes a NEW DB file (never in place); idempotent because it
always reads the original paints.json.

For each measured->db mapping in reconciliation_map.json:
  * preserve the old colour as chart_hex / chart_lab (provenance, never discarded)
  * add measured_hex / measured_lab and color_source = "measured"
  * map measured opacity into the matcher's existing transparency-aware logic
    (transparency = 1 - opacity); keep raw opacity / opacity_rating as metadata
  * GAP-FILL: where the old hex_source was missing/approximate, the measured
    value becomes the primary hex and the paint is flipped matchable = true

Outputs: paints_measured.json  (+ a printed summary incl. mean chart-vs-measured
ΔE, which quantifies how far the old chart hexes were from applied reality).
"""
from __future__ import annotations

import json
import os
import sys

import numpy as np
from skimage import color as sk_color

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)  # make the `core` package importable when run as a script

try:
    from core.colour_maths import ciede2000_single
except Exception:  # pragma: no cover - fallback if import path differs
    ciede2000_single = None
DB_PATH = os.path.join(ROOT, "paints.json")
MEASURED_PATH = os.path.join(ROOT, "data", "measured_swatches_by_id.json")
MAP_PATH = os.path.join(ROOT, "reconciliation_map.json")
OUT_PATH = os.path.join(ROOT, "paints_measured.json")

GAP_SOURCES = {"missing", "approximate"}


def hex_to_lab(hex_str: str) -> list[float]:
    h = hex_str.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]) / 255.0
    lab = sk_color.rgb2lab(np.array([[rgb]]))[0][0]
    return [float(lab[0]), float(lab[1]), float(lab[2])]


def delta_e(lab1: list[float], lab2: list[float]) -> float:
    if ciede2000_single is not None:
        return float(ciede2000_single(np.asarray(lab1), np.asarray(lab2)))
    # plain ΔE76 fallback
    return float(np.linalg.norm(np.asarray(lab1) - np.asarray(lab2)))


def main() -> None:
    db = json.load(open(DB_PATH, encoding="utf-8"))
    measured = json.load(open(MEASURED_PATH, encoding="utf-8"))["paints"]
    recon = json.load(open(MAP_PATH, encoding="utf-8"))

    # db_paint_id -> measured record (invert the confident matches)
    db_to_measured: dict[str, dict] = {}
    for mid, target in recon.items():
        if target in ("NEW", "REVIEW"):
            continue
        db_to_measured[target] = measured[mid]

    upgraded = 0
    gap_filled = 0
    deltas: list[float] = []
    gap_examples: list[str] = []

    for paint in db:
        m = db_to_measured.get(paint["paint_id"])
        if m is None:
            continue

        chart_hex = paint["hex"]
        chart_lab = hex_to_lab(chart_hex)
        measured_lab = [float(x) for x in m["measured_lab"]]

        # Provenance — never silently discard the old value.
        paint.setdefault("chart_hex", chart_hex)
        paint.setdefault("chart_lab", chart_lab)

        paint["measured_hex"] = m["measured_hex"]
        paint["measured_lab"] = measured_lab
        paint["color_source"] = "measured"

        opacity = float(m.get("opacity", 1.0))
        paint["opacity"] = round(opacity, 3)
        paint["opacity_rating"] = int(m.get("opacity_rating", 3))
        # Feed the matcher's existing transparency-aware pooling with real coverage.
        paint["transparency"] = round(max(0.0, min(1.0, 1.0 - opacity)), 3)

        deltas.append(delta_e(chart_lab, measured_lab))

        # Gap-fill the weakest entries: measured colour becomes primary hex.
        if paint.get("hex_source") in GAP_SOURCES or not paint.get("matchable", True):
            was_source = paint.get("hex_source")
            was_matchable = paint.get("matchable", True)
            if was_source in GAP_SOURCES or not was_matchable:
                paint["hex"] = m["measured_hex"]
                paint["hex_source"] = "measured_swatch"
                paint["matchable"] = True
                gap_filled += 1
                if len(gap_examples) < 12:
                    gap_examples.append(f"{paint['paint_id']} ({was_source}, matchable={was_matchable})")

        upgraded += 1

    json.dump(db, open(OUT_PATH, "w", encoding="utf-8"), indent=2)

    mean_de = sum(deltas) / len(deltas) if deltas else 0.0
    p90 = float(np.percentile(deltas, 90)) if deltas else 0.0
    print("=== apply_measured_colors summary ===")
    print(f"  paints upgraded to measured target : {upgraded}")
    print(f"  gap-filled (approximate/missing/not-matchable -> measured): {gap_filled}")
    print(f"  mean chart-vs-measured Delta-E (CIEDE2000): {mean_de:.2f}")
    print(f"  p90  chart-vs-measured Delta-E            : {p90:.2f}")
    print(f"  (that Delta-E is how far the old chart hexes sat from applied reality)")
    if gap_examples:
        print("  gap-filled examples:")
        for g in gap_examples:
            print(f"     - {g}")
    print(f"\n  wrote {os.path.relpath(OUT_PATH, ROOT)} ({len(db)} paints)")


if __name__ == "__main__":
    main()
