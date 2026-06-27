"""Build color_anchors.json — the single reviewable exemplar set for the
nearest-exemplar colour-family classifier (Stage B).

Seeds each chromatic family from the ground-truth DB paints labelled that family
(k-medoids of their measured LAB), plus the metallic families from metallic
paints, plus a handful of CURATED exemplars for the edge classes we've fought
(olive→green, mauve→pink, leather→brown, teal→cyan …). The achromatic families
(grey/white/black) are NOT anchors — they're handled by the explicit gate in
color_engine.classify_family — so they never swallow a pale-but-chromatic colour.

Output (python-api/color_anchors.json) is consumed by the backend directly and
compiled into schemestealer-react/lib/colorAnchors.ts for the frontend, so both
classifiers share ONE exemplar set. Re-run after changing seeds or the DB:

    python scripts/build_color_anchors.py
"""
import json
import os
import sys

import numpy as np
from skimage import color
from sklearn.cluster import KMeans

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)
sys.path.insert(0, _ROOT)

DB = os.path.join(_ROOT, "paints_groundtruth.json")
OUT = os.path.join(_ROOT, "color_anchors.json")

# Tunables. black_l: a hard floor — anything darker is black (very dark colours
# carry no reliable hue). achromatic_c: chromatic-family anchors are built only
# from paints at or above this chroma, so the neutral families own the low-chroma
# region and a faint tint is still resolved by nearest-exemplar (not a boundary).
THRESHOLDS = {"black_l": 10.0, "achromatic_c": 6.0}

CHROMATIC = ["red", "orange", "yellow", "green", "cyan", "blue",
             "purple", "magenta", "pink", "brown", "bone"]
# Neutrals are nearest-exemplar anchors too (not a separate hard gate): low chroma
# greys and faint-hue pales overlap, so ΔE76 to real exemplars separates them far
# better than any single chroma cut-off could.
NEUTRALS = ["grey", "white", "black"]
METALS = ["gold", "silver", "bronze"]
# Coloured metallics (metallic blue/green/red…) keep their hue, so the metallic
# path also considers these VIVID families. Warm-pale families (orange/yellow/
# brown/bone) and neutrals are excluded so they can't steal gold/silver/bronze.
METALLIC_FALLBACK = ["green", "cyan", "blue"]
MAX_ANCHORS = 12  # per family


def _lab(hex_str):
    h = hex_str.lstrip("#")
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]) / 255.0
    return color.rgb2lab(np.array([[rgb]]))[0][0]


# Curated exemplars (hand-verified correct family) for the edge classes. These
# are added on top of the DB medoids so the hard cases always have a true anchor.
CURATED = {
    "green":   ["#808000", "#6B8E23", "#556B2F", "#4B5320", "#60664D"],
    "yellow":  ["#BDB76B", "#D4AF37", "#C9A227", "#FFD400"],
    "bone":    ["#C3B091", "#CABA8E", "#D2B48C", "#C19A6B", "#E8DCC0"],
    "pink":    ["#FFB6C1", "#E0B0FF", "#F4C2C2", "#DECBDA", "#C7AFBD", "#F2C2B6"],
    "brown":   ["#8B5A2B", "#654321", "#3B2F2F", "#5C4033", "#704214"],
    "cyan":    ["#008080", "#0FB8A0", "#89CFF0", "#B2DFD1", "#3FB8C8"],
    "blue":    ["#A7C7E7", "#1E3A8A", "#0D407F"],
    "red":     ["#9A1115", "#C21E10", "#C71585"],
    "orange":  ["#EF6E2E"],
    "purple":  ["#6A0DAD"],
    "magenta": ["#FF00FF", "#7D1846", "#90305D"],
    "gold":    ["#D4AF37", "#C69843"],
    "silver":  ["#B0B0B8", "#888D8F"],
    "bronze":  ["#B08D57", "#8C7853"],
    "grey":    ["#808080", "#A0A0A0", "#595959", "#2E2E2E", "#6E6E6E", "#C0C0C0"],
    "white":   ["#F5F5F5", "#FFFFFF", "#FAFAFA", "#ECECEC", "#EFEFE8"],
    "black":   ["#101010", "#0A0A0A", "#1A1A1A", "#050505", "#1C1C1C"],
}


def _medoids(labs, k):
    """k medoids: KMeans centroids snapped to the nearest real LAB sample."""
    labs = np.asarray(labs, dtype=float)
    if len(labs) <= k:
        return [list(map(float, x)) for x in labs]
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(labs)
    out = []
    for c in km.cluster_centers_:
        i = int(np.argmin(((labs - c) ** 2).sum(axis=1)))
        out.append(list(map(float, labs[i])))
    return out


def main():
    paints = json.load(open(DB, encoding="utf-8"))
    ac = THRESHOLDS["achromatic_c"]

    by_fam = {f: [] for f in CHROMATIC + NEUTRALS}
    by_metal = {f: [] for f in METALS}
    for p in paints:
        lab = p.get("lab") or list(_lab(p["hex"]))
        c = float(np.hypot(lab[1], lab[2]))
        fam = p.get("color_family")
        if p.get("metallic"):
            if fam in by_metal:
                by_metal[fam].append(lab)
        elif fam in NEUTRALS:
            by_fam[fam].append(lab)                  # neutrals: no chroma filter
        elif fam in by_fam and c >= ac:              # chromatic anchors stay chromatic
            by_fam[fam].append(lab)

    families = {}
    for fam in CHROMATIC + NEUTRALS:
        seeds = [list(map(float, _lab(h))) for h in CURATED.get(fam, [])]
        medoids = _medoids(by_fam[fam], MAX_ANCHORS) if by_fam[fam] else []
        anchors = seeds + medoids
        # round for a readable, reviewable file
        families[fam] = [[round(v, 2) for v in a] for a in anchors]

    metallic = {}
    for fam in METALS:
        seeds = [list(map(float, _lab(h))) for h in CURATED.get(fam, [])]
        medoids = _medoids(by_metal[fam], 8) if by_metal[fam] else []
        metallic[fam] = [[round(v, 2) for v in a] for a in (seeds + medoids)]

    out = {
        "version": 1,
        "metric": "deltaE76",
        "thresholds": THRESHOLDS,
        "neutrals": NEUTRALS,      # which family names are achromatic
        "metallic_fallback": METALLIC_FALLBACK,  # vivid families a coloured metallic may take
        "families": families,      # chromatic + neutral anchors (non-metallic path)
        "metallic": metallic,      # gold/silver/bronze (metallic path adds these)
    }
    json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1)

    # Emit the frontend's bundled copy so both classifiers share ONE exemplar set.
    ts_path = os.path.normpath(os.path.join(
        _ROOT, "..", "schemestealer-react", "lib", "colorAnchors.ts"))
    if os.path.isdir(os.path.dirname(ts_path)):
        ts = ("// AUTO-GENERATED from python-api/color_anchors.json by\n"
              "// python-api/scripts/build_color_anchors.py — DO NOT EDIT.\n"
              "// The single colour-family exemplar set, shared with the backend.\n\n"
              "export interface ColorAnchors {\n"
              "  thresholds: Record<string, number>;\n"
              "  neutrals: string[];\n"
              "  metallic_fallback: string[];\n"
              "  families: Record<string, number[][]>;\n"
              "  metallic: Record<string, number[][]>;\n"
              "}\n\n"
              "export const COLOR_ANCHORS: ColorAnchors = "
              + json.dumps({k: out[k] for k in
                            ("thresholds", "neutrals", "metallic_fallback",
                             "families", "metallic")}, indent=1)
              + ";\n")
        open(ts_path, "w", encoding="utf-8").write(ts)
        print(f"Wrote {ts_path}")

    tot = sum(len(v) for v in families.values()) + sum(len(v) for v in metallic.values())
    print(f"Wrote {OUT}: {tot} anchors "
          f"({', '.join(f'{f}={len(families[f])}' for f in CHROMATIC + NEUTRALS)}; "
          f"{', '.join(f'{f}={len(metallic[f])}' for f in METALS)})")


if __name__ == "__main__":
    main()
