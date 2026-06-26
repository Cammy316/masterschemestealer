"""
Print graph-driven recipes for ten well-known Citadel bases, so recipe quality
can be eyeballed before deploy.

Run:  python scripts/recipe_report.py
"""

import os
import sys
import logging

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
sys.path.insert(0, _ROOT)

logging.disable(logging.INFO)  # quiet the engine's startup logs

from core.schemestealer_engine import SchemeStealerEngine  # noqa: E402

BASES = [
    "Mephiston Red", "Macragge Blue", "Caliban Green", "Retributor Armour",
    "Leadbelcher", "Corax White", "Abaddon Black", "Zandri Dust",
    "Kantor Blue", "Castellan Green",
]


def main():
    eng = SchemeStealerEngine(paint_db_path=os.path.join(_ROOT, "paints_groundtruth.json"))
    by_name = {p.name.lower(): p for p in eng.paint_db if p.brand == "Citadel"}

    print("=" * 68)
    print("Recipe report — Citadel bases (graph-driven)")
    print("=" * 68)
    for name in BASES:
        p = by_name.get(name.lower())
        if p is None:
            print(f"\n{name}: NOT FOUND in DB")
            continue
        hp, hs = eng._recipe_partner(p, "highlight", "Citadel")
        sp, ss = eng._recipe_partner(p, "shade", "Citadel")
        wp, ws = eng._recipe_wash(p)
        print(f"\n{name}  ({p.color_family})")
        print(f"   base       {p.name}")
        print(f"   highlight  {hp.name if hp else '-':<24} [{hs or '-'}]")
        print(f"   shade      {sp.name if sp else '-':<24} [{ss or '-'}]")
        print(f"   wash       {(wp.name if wp else '(WashMapping fallback)'):<24} [{ws or '-'}]")


if __name__ == "__main__":
    main()
