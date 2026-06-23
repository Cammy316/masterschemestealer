"""
Prompt 8, Issue 3 — repair the corrupted `reference_families` labels.

Root cause: the measured->DB extraction merge misaligned `reference_families`
against the wrong paint rows in data/measured_swatches_by_id.json (e.g. a
near-white AK paint carrying ["brown"], golds carrying ["silver"]). The new-brand
rows in paints_measured.json / paints_groundtruth.json inherited that corruption
verbatim.

The labels are NOT positionally recoverable (no constant per-brand shift aligns
them, and the original page-attribution source isn't in the repo), so per the
prompt we re-derive each paint's family STRICTLY from its own measured colour —
a per-paint operation keyed by the paint itself, with zero positional joins — and
flag `reference_families_source: "derived"` so the validation report knows these
are no longer independent expert labels.

This field does not feed matching (the matcher's color_family comes from
compute_color_family already); the fix removes the corrupted/ latent-risk signal
and makes the validation honest.

Run:  python scripts/fix_reference_families.py
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

from core.color_engine import compute_color_family  # noqa: E402

BY_ID_PATH = os.path.join(ROOT, "data", "measured_swatches_by_id.json")
DB_PATHS = [
    os.path.join(ROOT, "paints_measured.json"),
    os.path.join(ROOT, "paints_groundtruth.json"),
]


def _derive(hex_str: str, finish: str) -> str:
    """Canonical family from the paint's own measured hex (per-paint, no joins)."""
    return compute_color_family(hex_str, finish or "matte")


def fix_by_id() -> int:
    data = json.load(open(BY_ID_PATH, encoding="utf-8"))
    paints = data["paints"]
    changed = 0
    for rec in paints.values():
        hexv = rec.get("measured_hex")
        if not hexv:
            continue
        fam = _derive(hexv, rec.get("finish", "matte"))
        rec["reference_families"] = [fam]
        rec["reference_families_source"] = "derived"
        changed += 1
    data["note"] = (
        "reference_families re-derived per-paint from each paint's own measured "
        "colour (Prompt 8, Issue 3); the original extraction labels were "
        "misaligned and are not recoverable from this file."
    )
    json.dump(data, open(BY_ID_PATH, "w", encoding="utf-8"), indent=2)
    return changed


def fix_db(path: str) -> int:
    db = json.load(open(path, encoding="utf-8"))
    changed = 0
    for p in db:
        if not p.get("reference_families"):
            continue
        hexv = p.get("measured_hex") or p.get("hex")
        if not hexv:
            continue
        fam = _derive(hexv, p.get("finish", "matte"))
        p["reference_families"] = [fam]
        p["reference_families_source"] = "derived"
        changed += 1
    json.dump(db, open(path, "w", encoding="utf-8"), indent=2)
    return changed


def main() -> None:
    n = fix_by_id()
    print(f"measured_swatches_by_id.json: re-derived {n} reference_families")
    for path in DB_PATHS:
        if os.path.exists(path):
            m = fix_db(path)
            print(f"{os.path.basename(path)}: re-derived {m} reference_families")


if __name__ == "__main__":
    main()
