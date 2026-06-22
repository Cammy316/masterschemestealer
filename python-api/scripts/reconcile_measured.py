"""
Task 1 — reconcile measured-swatch paint_ids against the live DB.

The measured slugs are generated from a reference set's names and do NOT all
match our DB paint_ids (Vallejo in particular uses an abbreviated range, e.g.
measured `vallejo-game-gold-yellow` vs DB `vallejo-game-color-gold-yellow`).

Strategy (within overlapping brands only):
  1. exact paint_id match
  2. within-brand exact NORMALISED-name match (handles the Vallejo range-slug gap
     cleanly — the display names are identical)
  3. within-brand fuzzy name match; auto-accept only confident, unique matches
  4. everything else → REVIEW (a CSV for hand resolution)

New brands (ak / pro-acryl / two-thin-coats) are pure additions → NEW.

Outputs (written next to the DB):
  - reconciliation_map.json : measured_paint_id -> db_paint_id | "NEW" | "REVIEW"
  - reconcile_review.csv     : ambiguous/low-confidence rows for Cam to resolve
  - prints a per-bucket / per-brand summary

Nothing downstream runs until reconciliation_map.json exists.
"""
from __future__ import annotations

import csv
import json
import os
import re
from difflib import SequenceMatcher

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DB_PATH = os.path.join(ROOT, "paints.json")
MEASURED_PATH = os.path.join(ROOT, "data", "measured_swatches_by_id.json")
MAP_PATH = os.path.join(ROOT, "reconciliation_map.json")
REVIEW_CSV = os.path.join(ROOT, "reconcile_review.csv")

# Measured brand slug -> DB display brand. Only these overlap the DB.
OVERLAP_BRANDS = {
    "citadel": "Citadel",
    "vallejo": "Vallejo",
    "army-painter": "Army Painter",
}
NEW_BRANDS = {"ak", "pro-acryl", "two-thin-coats"}

# Auto-accept a fuzzy name match at/above this ratio (and only if unique);
# between REVIEW_FLOOR and this it goes to the review CSV.
AUTO_ACCEPT = 0.90
REVIEW_FLOOR = 0.62

# Light token-level abbreviation expansion so "lt"/"dk"/"met" line up.
ABBREV = {
    "lt": "light", "dk": "dark", "med": "medium", "metal": "metallic",
    "met": "metallic", "fl": "fluorescent", "trans": "transparent",
    "br": "brown", "gr": "green", "bl": "blue", "yel": "yellow",
}


def normalise(name: str) -> str:
    s = (name or "").lower().replace("&", " and ")
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    tokens = [ABBREV.get(t, t) for t in s.split()]
    return " ".join(tokens)


def main() -> None:
    db = json.load(open(DB_PATH, encoding="utf-8"))
    measured = json.load(open(MEASURED_PATH, encoding="utf-8"))["paints"]

    db_by_id = {p["paint_id"]: p for p in db}
    # Per-brand index of normalised name -> list of DB paints.
    db_by_brand_name: dict[str, dict[str, list]] = {}
    for p in db:
        db_by_brand_name.setdefault(p["brand"], {}).setdefault(normalise(p["name"]), []).append(p)

    recon: dict[str, str] = {}
    review_rows: list[dict] = []
    counts = {"matched_exact_id": 0, "matched_exact_name": 0,
              "matched_fuzzy": 0, "new_brand": 0, "review": 0}
    per_brand = {}

    for mid, rec in measured.items():
        mbrand = rec["brand"]
        per_brand.setdefault(mbrand, {"matched": 0, "new": 0, "review": 0})

        if mbrand in NEW_BRANDS:
            recon[mid] = "NEW"
            counts["new_brand"] += 1
            per_brand[mbrand]["new"] += 1
            continue

        db_brand = OVERLAP_BRANDS.get(mbrand)
        if db_brand is None:
            # Unknown brand — treat as a new addition rather than guessing.
            recon[mid] = "NEW"
            counts["new_brand"] += 1
            per_brand[mbrand]["new"] += 1
            continue

        # 1. exact paint_id
        if mid in db_by_id and db_by_id[mid]["brand"] == db_brand:
            recon[mid] = mid
            counts["matched_exact_id"] += 1
            per_brand[mbrand]["matched"] += 1
            continue

        name_index = db_by_brand_name.get(db_brand, {})
        norm_name = normalise(rec["name"])

        # 2. exact normalised-name (unique)
        exact = name_index.get(norm_name, [])
        if len(exact) == 1:
            recon[mid] = exact[0]["paint_id"]
            counts["matched_exact_name"] += 1
            per_brand[mbrand]["matched"] += 1
            continue

        # 3. fuzzy within brand
        best_pid, best_name, best_score = None, None, 0.0
        second = 0.0
        for cand_norm, paints in name_index.items():
            score = SequenceMatcher(None, norm_name, cand_norm).ratio()
            if score > best_score:
                second = best_score
                best_score, best_pid, best_name = score, paints[0]["paint_id"], paints[0]["name"]
            elif score > second:
                second = score

        unique_enough = (best_score - second) > 0.04
        if best_score >= AUTO_ACCEPT and unique_enough and len(exact) != 1:
            recon[mid] = best_pid
            counts["matched_fuzzy"] += 1
            per_brand[mbrand]["matched"] += 1
            continue

        # 4. review
        recon[mid] = "REVIEW"
        counts["review"] += 1
        per_brand[mbrand]["review"] += 1
        review_rows.append({
            "measured_paint_id": mid,
            "measured_name": rec["name"],
            "brand": db_brand,
            "best_db_paint_id": best_pid or "",
            "best_db_name": best_name or "",
            "score": f"{best_score:.3f}",
            "resolved_db_paint_id": "",  # Cam fills this in (or NEW / leave blank to skip)
        })

    json.dump(recon, open(MAP_PATH, "w", encoding="utf-8"), indent=2)

    with open(REVIEW_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "measured_paint_id", "measured_name", "brand",
            "best_db_paint_id", "best_db_name", "score", "resolved_db_paint_id"])
        w.writeheader()
        w.writerows(sorted(review_rows, key=lambda r: (r["brand"], -float(r["score"]))))

    matched_total = (counts["matched_exact_id"] + counts["matched_exact_name"]
                     + counts["matched_fuzzy"])
    print("=== Reconciliation summary ===")
    print(f"  measured paints : {len(measured)}")
    print(f"  matched (total) : {matched_total}")
    print(f"     - exact id   : {counts['matched_exact_id']}")
    print(f"     - exact name : {counts['matched_exact_name']}")
    print(f"     - fuzzy      : {counts['matched_fuzzy']}")
    print(f"  new_brand       : {counts['new_brand']}")
    print(f"  review          : {counts['review']}")
    print("  per measured brand:")
    for b in sorted(per_brand):
        d = per_brand[b]
        print(f"     {b:14s} matched={d['matched']:4d} new={d['new']:4d} review={d['review']:4d}")
    print(f"\n  wrote {os.path.relpath(MAP_PATH, ROOT)} and {os.path.relpath(REVIEW_CSV, ROOT)}")


if __name__ == "__main__":
    main()
