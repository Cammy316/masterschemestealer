"""
Task 3 — add the ~501 new-brand paints (AK 3rd Gen, Pro Acryl, Two Thin Coats)
from the measured records. These have no DB presence, so they are pure additions
(recon == "NEW").

Reads paints_measured.json (Task 2 output) and appends the new-brand entries,
writing back to the same file (the single final DB). Idempotent: any existing
new-brand rows are dropped and rebuilt on each run.

Family is assigned via the canonical hue_family classifier (compute_color_family)
from the MEASURED colour — `reference_families` is kept as validation data only
(Task 5), never used as the stored family.

Metallic note: the per-record measured data carries no finish/reference-page
field, so metallic cannot be reliably derived here (name keywords mis-flag e.g.
"Golden Yellow"). New-brand paints are therefore stored matte; their LAB still
matches correctly. Curating metallic flags is left for a follow-up.
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)  # make the `core` package importable when run as a script

from core.color_engine import compute_color_family  # noqa: E402
MEASURED_PATH = os.path.join(ROOT, "data", "measured_swatches_by_id.json")
MAP_PATH = os.path.join(ROOT, "reconciliation_map.json")
DB_PATH = os.path.join(ROOT, "paints_measured.json")  # Task 2 output, appended in place

# Measured brand slug -> (DB display brand, range label)
NEW_BRAND_META = {
    "ak": ("AK", "3rd Gen"),
    "pro-acryl": ("Pro Acryl", "Pro Acryl"),
    "two-thin-coats": ("Two Thin Coats", "Two Thin Coats"),
}


def main() -> None:
    measured = json.load(open(MEASURED_PATH, encoding="utf-8"))["paints"]
    recon = json.load(open(MAP_PATH, encoding="utf-8"))
    db = json.load(open(DB_PATH, encoding="utf-8"))

    new_display = {disp for disp, _ in NEW_BRAND_META.values()}
    # Idempotent: drop any previously-added new-brand rows, keep everything else.
    db = [p for p in db if p.get("brand") not in new_display]

    added = 0
    per_brand = {}
    for mid, target in recon.items():
        if target != "NEW":
            continue
        rec = measured[mid]
        meta = NEW_BRAND_META.get(rec["brand"])
        if meta is None:
            continue
        display, range_label = meta

        measured_hex = rec["measured_hex"]
        measured_lab = [float(x) for x in rec["measured_lab"]]
        opacity = float(rec.get("opacity", 1.0))
        family = compute_color_family(measured_hex, "matte")

        db.append({
            "paint_id": mid,
            "name": rec["name"],
            "brand": display,
            "range": range_label,
            "hex": measured_hex,
            "code": "",
            "category": "base",
            "finish": "matte",
            "transparency": round(max(0.0, min(1.0, 1.0 - opacity)), 3),
            "color_family": family,
            "aliases": [],
            "citadel_equiv": None,
            "tags": [f"family:{family}", "measured"],
            "matchable": True,
            "discontinued": False,
            "hex_source": "measured_swatch",
            "layer_sequence": None,
            # measured colour fields
            "measured_hex": measured_hex,
            "measured_lab": measured_lab,
            "color_source": "measured",
            "opacity": round(opacity, 3),
            "opacity_rating": int(rec.get("opacity_rating", 3)),
            "reference_families": list(rec.get("reference_families", [])),
        })
        added += 1
        per_brand[display] = per_brand.get(display, 0) + 1

    json.dump(db, open(DB_PATH, "w", encoding="utf-8"), indent=2)

    print("=== add_measured_brands summary ===")
    print(f"  new-brand paints added: {added}")
    for b in sorted(per_brand):
        print(f"     {b:16s}: {per_brand[b]}")
    print(f"  final DB size: {len(db)} paints")
    print("  NOTE: new brands have no curated recipe-graph edges yet; the")
    print("        algorithmic LAB-geometry fallback (Prompt 5) covers their recipes.")
    print(f"  wrote {os.path.relpath(DB_PATH, ROOT)}")


if __name__ == "__main__":
    main()
