"""Phase-3 scoreboard entry point.

    venv\\Scripts\\python.exe -m benchmarks.run
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone

from benchmarks.match_scoreboard import run_match_scoreboard
from benchmarks.stability import run_stability
from benchmarks.synthetic_extract import run_synthetic_extract


_OUT_DIR = os.path.join(os.path.dirname(__file__), "out")


def _md(payload: dict) -> str:
    m = payload["match"]
    lines = [
        f"# Colour-accuracy scoreboard — {payload['generated_at']}",
        "",
        "There is no labelled photograph set. Matcher numbers are identity /",
        "cross-brand recovery on stored (or primer-composited) LABs. Real",
        "photos contribute **stability only**. Do not quote `1_synthetic_sweep.py`.",
        "",
        f"Primer for translucent scoring: `{m['primer']['name']}` (`{m['primer']['paint_id']}`).",
        "",
        "## Matcher",
        "",
        f"| Metric | Value |",
        f"|---|---|",
        f"| Paints scored | {m['n_scored']} |",
        f"| Same-brand top-1 self (base/layer/air) | {m['top1_self_pct']}% |",
        f"| Same-brand top-3 self (base/layer/air) | {m['top3_self_pct']}% |",
        f"| Opaque matte top-1 self | {m['opaque_matte_top1_self_pct']}% (n={m['opaque_matte_n']}) |",
        f"| Median ΔE00 of winner | {m['median_de']} |",
        f"| p90 ΔE00 of winner | {m['p90_de']} |",
        f"| Cross-brand median ΔE00 | {m['cross_brand_median_de']} |",
        f"| Cross-brand p90 ΔE00 | {m['cross_brand_p90_de']} |",
        f"| Honest-empty slots | {m['honest_empty']} |",
        "",
        "### Per brand",
        "",
        "| Brand | n | Self % | Median ΔE | p90 ΔE |",
        "|---|---:|---:|---:|---:|",
    ]
    for brand, row in sorted(m["by_brand"].items()):
        lines.append(
            f"| {brand} | {row['n']} | {row['self_hit_pct']} | "
            f"{row['median_de']} | {row['p90_de']} |"
        )
    lines += [
        "",
        "### Silver vs grey",
        "",
        f"- Silver scored as matte: n={m['silver_vs_grey']['n']}, "
        f"self={m['silver_vs_grey']['self']}, grey-win={m['silver_vs_grey']['grey_win']}",
        f"- Grey scored as metallic: n={m['grey_as_metallic']['n']}, "
        f"silver-win={m['grey_as_metallic']['silver_win']}",
        "",
        "### Contrast / translucent vs base",
        "",
        f"- n={m['contrast_vs_base']['n']}, winner is opaque base="
        f"{m['contrast_vs_base']['winner_is_base']}, winner still translucent="
        f"{m['contrast_vs_base']['winner_is_translucent']}",
        "",
        "## Synthetic extraction",
        "",
        "| Scene | Planted | Split same family | Family hits |",
        "|---|---|---|---|",
    ]
    for s in payload["synthetic"]["scenes"]:
        lines.append(
            f"| {s['name']} | {', '.join(s['planted_families'])} | "
            f"{s['split_same_family']} | {s['family_hit']} |"
        )
    lines += [
        "",
        "## Real-photo stability (unlabelled)",
        "",
        f"Images scored: {payload['stability']['n']}. "
        f"Unstable under LSB/JPEG/−0.3 EV: {payload['stability']['n_unstable']}.",
        "",
        "| Image | Base cards | LSB +1 | JPEG 85 | EV −0.3 |",
        "|---|---:|---|---|---|",
    ]
    for im in payload["stability"]["images"]:
        if "error" in im:
            lines.append(f"| {im['image']} | ERROR {im['error']} | — | — | — |")
            continue
        v = im["variants"]

        def _cell(key: str) -> str:
            cell = v[key]
            mark = "changed" if cell["card_count_changed"] or cell["family_set_changed"] else "same"
            return f"{cell['n']} ({mark})"

        lines.append(
            f"| {im['image']} | {im['base_n']} | {_cell('lsb_plus1')} | "
            f"{_cell('jpeg85')} | {_cell('ev_minus_0_3')} |"
        )
    lines.append("")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Phase-3 colour-accuracy scoreboard")
    parser.add_argument("--skip-stability", action="store_true",
                        help="Matcher + synthetic only (faster)")
    args = parser.parse_args(argv)

    t0 = time.perf_counter()
    print("Loading engine …", flush=True)
    match = run_match_scoreboard()
    print(f"  matcher: n={match['n_scored']} top-1={match['top1_self_pct']}%", flush=True)
    synthetic = run_synthetic_extract()
    print(f"  synthetic scenes: {len(synthetic['scenes'])}", flush=True)
    if args.skip_stability:
        stability = {"images": [], "n": 0, "n_unstable": 0, "skipped": True}
    else:
        print("  stability (real photos) …", flush=True)
        stability = run_stability()
        print(f"  unstable: {stability['n_unstable']}/{stability['n']}", flush=True)

    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
        "elapsed_s": round(time.perf_counter() - t0, 1),
        "match": match,
        "synthetic": synthetic,
        "stability": stability,
    }
    os.makedirs(_OUT_DIR, exist_ok=True)
    json_path = os.path.join(_OUT_DIR, "scoreboard.json")
    md_path = os.path.join(_OUT_DIR, "scoreboard.md")
    with open(json_path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2)
    with open(md_path, "w", encoding="utf-8") as fh:
        fh.write(_md(payload))
    print(f"Wrote {json_path}")
    print(f"Wrote {md_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
