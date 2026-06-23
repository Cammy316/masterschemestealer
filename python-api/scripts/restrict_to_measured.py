"""
Issue 3 (Prompt 7) — restrict the matchable pool to ground-truth (measured)
paints only.

The old chart/approximate hexes drag matches across family lines, so every paint
WITHOUT measured ground truth is made non-matchable. Rows are preserved (never
deleted) for provenance and future data — only the `matchable` flag changes.

Allow-list: wash/shade/ink paints are recipe-critical (they fill shade/wash slots
and the family-keyed WashMapping lookup) and are largely absent from the measured
set, so unmeasured washes for brands that DO have measured data are kept matchable
and flagged `kept_for_recipe`. Brands with no measured data at all (e.g. Scale75)
are cut entirely — their recipes can't anchor on a measured base anyway.

Output: paints_groundtruth.json + a summary (matchable per brand, excluded count,
the wash allow-list). The engine loads this behind resolve_paint_db_path().
"""
from __future__ import annotations

import json
import os
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DB_PATH = os.path.join(ROOT, "paints_measured.json")
OUT_PATH = os.path.join(ROOT, "paints_groundtruth.json")

WASH_CATEGORIES = {"wash", "shade", "ink"}


def qualifies(p: dict) -> bool:
    """A paint is ground-truth iff it carries measured colour."""
    return p.get("color_source") == "measured" or p.get("measured_lab") is not None


def main() -> None:
    db = json.load(open(DB_PATH, encoding="utf-8"))

    brands_with_measured = {p["brand"] for p in db if qualifies(p)}

    kept_measured = 0
    kept_wash = 0
    excluded = 0
    allow_list = []
    per_brand_matchable = Counter()

    for p in db:
        is_wash = p.get("category", "").lower() in WASH_CATEGORIES

        if qualifies(p):
            p["matchable"] = True
            p.pop("excluded_reason", None)
            kept_measured += 1
            per_brand_matchable[p["brand"]] += 1
        elif is_wash and p["brand"] in brands_with_measured:
            # Recipe-critical wash/shade kept matchable despite no measured colour.
            p["matchable"] = True
            p["kept_for_recipe"] = True
            p.pop("excluded_reason", None)
            kept_wash += 1
            per_brand_matchable[p["brand"]] += 1
            allow_list.append(f"{p['brand']} / {p['name']} ({p.get('category')})")
        else:
            p["matchable"] = False
            p["excluded_reason"] = "no_measured_data"
            p.pop("kept_for_recipe", None)
            excluded += 1

    json.dump(db, open(OUT_PATH, "w", encoding="utf-8"), indent=2)

    print("=== restrict_to_measured summary ===")
    print(f"  total paints (rows preserved): {len(db)}")
    print(f"  matchable — measured ground truth: {kept_measured}")
    print(f"  matchable — wash allow-list (kept_for_recipe): {kept_wash}")
    print(f"  excluded (matchable=false, no_measured_data): {excluded}")
    print("  matchable per brand:")
    for b in sorted(per_brand_matchable):
        print(f"     {b:16s} {per_brand_matchable[b]}")
    print(f"\n  wash allow-list ({len(allow_list)}):")
    for w in sorted(allow_list):
        print(f"     - {w}")
    print(f"\n  wrote {os.path.relpath(OUT_PATH, ROOT)}")


if __name__ == "__main__":
    main()
