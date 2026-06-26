"""
Build recipes.json (Phase 2 — recipe-graph edge regeneration).

- Regenerates this script's OWNED `algorithmic` highlight/shade edges for every
  base paint across all six brands via the shared LAB-geometry scorer
  (core.recipe_geometry — the same one the engine uses live), honouring
  is_eligible: same brand, base/layer/air category, same-or-adjacent colour
  family, candidate different / matchable / non-discontinued. Geometry is scored
  on each paint's MEASURED LAB (the engine's CIEDE2000 target).
- PRESERVES every other edge — curated (e.g. `citadel_official`) and `manual`
  wash edges (confidence 0.9) — but ONLY where both endpoints still exist in the
  ground-truth DB. Any edge referencing a removed/renamed paint (all Scale75,
  renamed IDs) is dropped and reported.
- Wash *derivation* (the always-fill ladder) is Phase 3's job in
  services/recipe_builder.py; this script no longer synthesises wash edges, it
  only carries forward the still-valid manual ones.

Idempotent: re-running keeps curated/manual edges and rebuilds only `algorithmic`.

Run:  python scripts/generate_algorithmic_edges.py
"""

import os
import sys
import json
import logging
from collections import Counter

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)  # python-api
sys.path.insert(0, _ROOT)

import numpy as np  # noqa: E402
from skimage import color as sk_color  # noqa: E402

from core.recipe_geometry import PaintNode, best_geometric_edges, CANDIDATE_CATEGORIES  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger("build_recipes")

CANONICAL_DB = os.path.join(_ROOT, "paints_groundtruth.json")
RECIPES_PATH = os.path.join(_ROOT, "recipes.json")

# Only this source is regenerated; everything else is preserved (if still valid).
OWNED_SOURCES = {"algorithmic"}


def _lab_from_hex(hex_str):
    h = hex_str.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]) / 255.0
    lab = sk_color.rgb2lab(np.array([[rgb]]))[0][0]
    return (float(lab[0]), float(lab[1]), float(lab[2]))


def _node(p):
    # Every ground-truth paint carries a measured `lab` — the engine's CIEDE2000
    # target — so score edge geometry on it (fall back to the hex only if absent).
    lab = p.get("lab")
    lab = tuple(float(x) for x in lab) if lab else _lab_from_hex(p["hex"])
    return PaintNode(
        paint_id=p["paint_id"], name=p["name"], brand=p["brand"],
        category=(p.get("category") or "").lower(),
        color_family=(p.get("color_family") or "").lower(),
        lab=lab,
        matchable=bool(p.get("matchable", True)),
        discontinued=bool(p.get("discontinued", False)),
    )


def main():
    if not os.path.exists(CANONICAL_DB):
        raise FileNotFoundError(f"Paint DB not found: {CANONICAL_DB}")
    paints = json.load(open(CANONICAL_DB, encoding="utf-8"))
    ids = {p["paint_id"] for p in paints}
    id_brand = {p["paint_id"]: p["brand"] for p in paints}
    nodes = [_node(p) for p in paints]

    existing = {"version": 1, "edges": []}
    if os.path.exists(RECIPES_PATH):
        existing = json.load(open(RECIPES_PATH, encoding="utf-8"))
    old_edges = existing.get("edges", [])

    # 1. Preserve non-owned edges (curated + manual), dropping any that dangle.
    #    Owned (algorithmic) edges are discarded here and rebuilt in step 3.
    dropped = []
    kept = []
    for e in old_edges:
        dangling = e["from_id"] not in ids or e["to_id"] not in ids
        if e.get("source") in OWNED_SOURCES:
            if dangling:
                dropped.append(e)   # report it; the rebuild won't recreate it
            continue
        (dropped if dangling else kept).append(e)

    # Curated/manual (from_id, rel) we must not override with an algorithmic edge.
    curated_keys = {(e["from_id"], e["rel"]) for e in kept}

    # 2. Per-brand base/layer/air candidate pools for the geometry.
    pools = {}
    for n in nodes:
        if n.matchable and not n.discontinued and n.category in CANDIDATE_CATEGORIES:
            pools.setdefault(n.brand, []).append(n)

    # 3. Regenerate algorithmic highlight/shade edges for every base paint.
    new_edges = []
    for n in nodes:
        if not n.matchable or n.discontinued:
            continue
        if n.category not in CANDIDATE_CATEGORIES:   # only recipe bases get HL/shade
            continue
        pool = pools.get(n.brand, [])
        for rel in ("highlight", "shade"):
            if (n.paint_id, rel) in curated_keys:
                continue
            for cand, _score in best_geometric_edges(n, pool, rel, top_n=2):
                new_edges.append({
                    "from_id": n.paint_id, "to_id": cand.paint_id,
                    "from": n.name, "to": cand.name,
                    "rel": rel, "source": "algorithmic", "confidence": 0.5,
                })

    # 4. Merge + dedupe on the full edge identity.
    merged, seen = [], set()
    for e in kept + new_edges:
        key = (e["from_id"], e["to_id"], e["rel"], e.get("source"))
        if key in seen:
            continue
        seen.add(key)
        merged.append(e)

    out = {"version": existing.get("version", 1), "edges": merged}
    json.dump(out, open(RECIPES_PATH, "w", encoding="utf-8"), indent=2)

    # 5. Report.
    by_rel = Counter(e["rel"] for e in merged)
    logger.info("recipes.json rebuilt: %d edges total (highlight=%d shade=%d wash=%d)",
                len(merged), by_rel["highlight"], by_rel["shade"], by_rel["wash"])
    logger.info("Preserved %d curated/manual edges; regenerated %d algorithmic HL/shade edges.",
                len(kept), len(new_edges))

    per_brand = {}
    for e in merged:
        per_brand.setdefault(id_brand.get(e["from_id"], "?"), Counter())[e["rel"]] += 1
    logger.info("Per-brand edge counts (final):")
    for b in sorted(per_brand):
        c = per_brand[b]
        logger.info("  %-16s highlight=%-4d shade=%-4d wash=%-4d",
                    b, c["highlight"], c["shade"], c["wash"])

    logger.info("Dropped %d edges referencing paints no longer in the DB:", len(dropped))
    for e in sorted(dropped, key=lambda x: (x.get("source", ""), x["rel"], x["from_id"])):
        miss = [i for i in (e["from_id"], e["to_id"]) if i not in ids]
        logger.info("  DROP [%s/%s] %s -> %s  (missing: %s)",
                    e.get("source"), e["rel"], e["from_id"], e["to_id"], ", ".join(miss))


if __name__ == "__main__":
    main()
