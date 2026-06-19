"""
Generate algorithmic recipe edges and merge them into recipes.json.

For every matchable, non-discontinued paint lacking a CURATED (non-algorithmic)
edge for a relationship, compute fallback highlight/shade edges using the shared
LAB-geometry scorer (core.recipe_geometry — the same one the engine uses live).
Also emits the config WashMapping into the graph as `manual` wash edges so the
wash slot can flow through a single graph lookup too.

Idempotent: re-running keeps curated edges (citadel_official / tutorial) and
replaces only this script's own `algorithmic` and `manual` edges.

Run:  python scripts/generate_algorithmic_edges.py
"""

import os
import sys
import json
import logging

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)  # python-api
sys.path.insert(0, _ROOT)

import numpy as np  # noqa: E402
from skimage import color as sk_color  # noqa: E402

from core.recipe_geometry import PaintNode, best_geometric_edges, CANDIDATE_CATEGORIES  # noqa: E402
from config import WashMapping  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger("generate_algorithmic_edges")

PAINTS_PATH = os.path.join(_ROOT, "paints.json")
RECIPES_PATH = os.path.join(_ROOT, "recipes.json")

# Sources this script owns and regenerates; everything else is curated and kept.
OWNED_SOURCES = {"algorithmic", "manual"}
WASH_CATEGORIES = {"wash", "shade", "ink"}


def _lab_from_hex(hex_str):
    h = hex_str.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]) / 255.0
    lab = sk_color.rgb2lab(np.array([[rgb]]))[0][0]
    return (float(lab[0]), float(lab[1]), float(lab[2]))


def _node(p):
    return PaintNode(
        paint_id=p["paint_id"], name=p["name"], brand=p["brand"],
        category=(p.get("category") or "").lower(),
        color_family=(p.get("color_family") or "").lower(),
        lab=_lab_from_hex(p["hex"]),
        matchable=bool(p.get("matchable", True)),
        discontinued=bool(p.get("discontinued", False)),
    )


def _resolve_wash(brand, wash_name, paints):
    """Find a wash/shade/ink paint of this brand matching the wash name."""
    wl = wash_name.lower()
    cands = [
        p for p in paints
        if p["brand"] == brand and (p.get("category") or "").lower() in WASH_CATEGORIES
    ]
    for p in cands:  # exact-ish containment
        if wl in p["name"].lower() or p["name"].lower() in wl:
            return p["paint_id"], p["name"]
    parts = wl.split()
    for p in cands:  # partial token match
        if any(part in p["name"].lower() for part in parts):
            return p["paint_id"], p["name"]
    return None, None


def main():
    paints = json.load(open(PAINTS_PATH, encoding="utf-8"))
    nodes = [_node(p) for p in paints]
    nodes_by_id = {n.paint_id: n for n in nodes}

    # Load existing recipes, keep curated edges, drop this script's owned ones.
    existing = {"version": 1, "edges": []}
    if os.path.exists(RECIPES_PATH):
        existing = json.load(open(RECIPES_PATH, encoding="utf-8"))
    kept = [e for e in existing.get("edges", []) if e.get("source") not in OWNED_SOURCES]

    # Which (from_id, rel) already have a curated edge → don't override.
    curated_keys = {(e["from_id"], e["rel"]) for e in kept}

    # Per-brand candidate pools (base/layer/air paints) for geometry.
    pools = {}
    for n in nodes:
        if n.matchable and not n.discontinued and n.category in CANDIDATE_CATEGORIES:
            pools.setdefault(n.brand, []).append(n)

    new_edges = []
    hl = sh = wash = 0

    for n in nodes:
        if not n.matchable or n.discontinued:
            continue
        pool = pools.get(n.brand, [])

        # Highlight / shade algorithmic edges (skip if curated already exists).
        for rel in ("highlight", "shade"):
            if (n.paint_id, rel) in curated_keys:
                continue
            for cand, _score in best_geometric_edges(n, pool, rel, top_n=2):
                new_edges.append({
                    "from_id": n.paint_id, "to_id": cand.paint_id,
                    "from": n.name, "to": cand.name,
                    "rel": rel, "source": "algorithmic", "confidence": 0.5,
                })
                if rel == "highlight":
                    hl += 1
                else:
                    sh += 1

        # Wash edge from WashMapping (only for recipe-base roles; skip if curated).
        if n.category in CANDIDATE_CATEGORIES and (n.paint_id, "wash") not in curated_keys:
            wash_name = WashMapping.get_recommended_wash(n.color_family, n.brand)
            if wash_name:
                wid, wname = _resolve_wash(n.brand, wash_name, paints)
                if wid and wid != n.paint_id:
                    new_edges.append({
                        "from_id": n.paint_id, "to_id": wid,
                        "from": n.name, "to": wname,
                        "rel": "wash", "source": "manual", "confidence": 0.9,
                    })
                    wash += 1

    # Dedupe on the full edge tuple, then write.
    merged, seen = [], set()
    for e in kept + new_edges:
        key = (e["from_id"], e["to_id"], e["rel"], e.get("source"))
        if key in seen:
            continue
        seen.add(key)
        merged.append(e)

    out = {"version": existing.get("version", 1), "edges": merged}
    json.dump(out, open(RECIPES_PATH, "w", encoding="utf-8"), indent=2)

    logger.info("Kept %d curated edges; added algorithmic highlight=%d shade=%d wash=%d",
                len(kept), hl, sh, wash)
    logger.info("recipes.json now has %d edges total", len(merged))


if __name__ == "__main__":
    main()
