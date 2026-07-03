"""
Apply the reviewed swatch re-sample to paints_groundtruth.json.

Runs AFTER human review of swatch_resample_report.md (the sign-off step).
For every matched paint the region-median lab/hex from the Stahly PDF
replaces the old centre-point value (uniform provenance), `swatch_spread`
records the swatch's internal Lab spread (reliability / metallic signature),
and `color_source` records provenance: 'swatch-median' vs 'assumed' (washes
and inks, which the opaque chart cannot carry).

Because colour families are classified against anchors that are themselves
built FROM the DB, families and anchors are re-derived to a fixed point:
    patch labs -> reclassify families -> rebuild anchors -> reclassify ...
until no family changes (converges in 1-2 rounds).

Usage:
    python scripts/apply_swatch_resample.py
Then regenerate the remaining artefacts (edges, frontend DB, parity
fixtures) and run the full suite.
"""

import json
import os
import subprocess
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
sys.path.insert(0, _ROOT)

DB_PATH = os.path.join(_ROOT, "paints_groundtruth.json")
RESAMPLE_PATH = os.path.join(_ROOT, "swatch_resample.json")


def reclassify_families(paints) -> int:
    """Recompute every stored color_family from the (new) lab with the
    CURRENT anchors; returns the number of changes."""
    import core.color_engine as ce
    ce._ANCHORS = None          # drop the module cache — anchors just changed
    changed = 0
    for p in paints:
        fam = ce.classify_family(p["lab"], None,
                                 is_metallic=bool(p.get("metallic")))
        if fam != p.get("color_family"):
            p["color_family"] = fam
            changed += 1
    return changed


def main():
    with open(DB_PATH, encoding="utf-8") as f:
        paints = json.load(f)
    with open(RESAMPLE_PATH, encoding="utf-8") as f:
        resample = json.load(f)

    by_id = {r["paint_id"]: r for r in resample["matched"]}

    patched = 0
    for p in paints:
        r = by_id.get(p["paint_id"])
        if r is not None:
            p["hex"] = r["hex"]
            p["lab"] = r["lab"]
            p["swatch_spread"] = r["spread"]
            p["color_source"] = "swatch-median"
            patched += 1
        else:
            p["color_source"] = "assumed"
    print(f"patched {patched} paints with swatch-median lab/hex; "
          f"{len(paints) - patched} remain assumed")

    with open(DB_PATH, "w", encoding="utf-8") as f:
        json.dump(paints, f, indent=1)

    # Fixed point: families <-> anchors.
    for round_no in range(1, 4):
        changed = reclassify_families(paints)
        print(f"round {round_no}: {changed} family changes")
        with open(DB_PATH, "w", encoding="utf-8") as f:
            json.dump(paints, f, indent=1)
        subprocess.run([sys.executable,
                        os.path.join(_HERE, "build_color_anchors.py")],
                       check=True, cwd=_ROOT)
        if changed == 0:
            break

    print("done — now regenerate edges, frontend DB and parity fixtures")


if __name__ == "__main__":
    main()
