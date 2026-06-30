"""Generate schemestealer-react/lib/washMapping.ts from the backend wash logic.

The offline (in-browser) recipe fallback used to hard-code its own family->wash
map in paintMatcher.ts, which could silently drift from the backend's
config.WashMapping. This pre-resolves the backend's guaranteed-fill wash ladder
(services.recipe_builder.get_wash_for_family) against the ground-truth DB for
every detected family and the offline brands, so the offline fallback uses the
SAME washes as the online path — one source of truth (the backend).

Re-run after changing WashMapping or the paint DB:

    python scripts/build_wash_mapping.py
"""
import json
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
sys.path.insert(0, _ROOT)

from core.color_engine import RECOGNISED_FAMILIES  # noqa: E402
from services.recipe_builder import get_wash_for_family  # noqa: E402

DB = os.path.join(_ROOT, "paints_groundtruth.json")
TS_OUT = os.path.normpath(os.path.join(
    _ROOT, "..", "schemestealer-react", "lib", "washMapping.ts"))

# Offline-recipe brand keys -> backend display names (the brands the offline
# getFullPaintRecipe renders). Mirrors paintMatcher's brand union.
BRANDS = {"citadel": "Citadel", "vallejo": "Vallejo", "army-painter": "Army Painter"}


def _load_wash_db(paints):
    """Same wash/shade/ink filter the scanner services use to build wash_db."""
    return [p for p in paints
            if p.get("category", "").lower() in ("wash", "shade", "ink")
            or "wash" in p.get("name", "").lower()
            or "shade" in p.get("name", "").lower()
            or "tone" in p.get("name", "").lower()]


def main():
    paints = json.load(open(DB, encoding="utf-8"))
    wash_db = _load_wash_db(paints)

    families = sorted(RECOGNISED_FAMILIES) + ["default"]
    table = {}
    for fam in families:
        # "default" -> an unknown family, which the ladder resolves to the
        # requested brand's universal dark wash.
        lookup_fam = "" if fam == "default" else fam
        row = {}
        for key, backend_brand in BRANDS.items():
            wash = get_wash_for_family(lookup_fam, backend_brand, None, wash_db)
            if wash:
                row[key] = {"name": wash["name"], "hex": wash.get("hex", "#000000")}
        if row:
            table[fam] = row

    ts = ("// AUTO-GENERATED from python-api/config.py (WashMapping) + "
          "paints_groundtruth.json\n"
          "// by python-api/scripts/build_wash_mapping.py — DO NOT EDIT.\n"
          "// Offline wash recommendations, pre-resolved by the backend's wash ladder\n"
          "// so the offline fallback can never drift from the online wash logic.\n\n"
          "export interface WashEntry {\n  name: string;\n  hex: string;\n}\n\n"
          "export const WASH_MAP: Record<string, Record<string, WashEntry>> = "
          + json.dumps(table, indent=2) + ";\n")
    with open(TS_OUT, "w", encoding="utf-8") as f:
        f.write(ts)
    print(f"Wrote {TS_OUT}: {len(table)} families x {len(BRANDS)} brands")


if __name__ == "__main__":
    main()
