"""
Re-sample every paint swatch in the Stahly 7-in-1 comparison PDF.

The ground-truth labs in paints_groundtruth.json were originally extracted
from a SINGLE CENTRE POINT of each photographed swatch. A point sample is
noisy in general and unreliable for metallics, where one pixel is a random
draw from the sparkle distribution. This script re-samples each swatch as a
REGION MEDIAN and records the swatch's internal spread (the reliability
signal — high spread = metallic/gradient swatch where a point sample lies).

It produces a REVIEW REPORT ONLY — it never writes to the paint DB. The
patch step runs separately after human review.

Usage (dev venv; requires `pip install pymupdf`, not in requirements.txt):
    python scripts/resample_groundtruth_swatches.py
Outputs:
    swatch_resample.json         full per-swatch rows
    swatch_resample_report.md    human review report (sorted by drift)
"""

import difflib
import json
import os
import re
import sys
from collections import Counter, defaultdict

import numpy as np

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import fitz  # PyMuPDF — dev-only dependency
from skimage import color as skcolor

from core.colour_maths import ciede2000_single

PDF_PATH = r"E:\Git\masterschemestealer\Skills&rules\7-in-1_comparison_tool_stahly_V2.5.pdf"
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "paints_groundtruth.json")
OUT_JSON = os.path.join(os.path.dirname(__file__), "..", "swatch_resample.json")
OUT_MD = os.path.join(os.path.dirname(__file__), "..", "swatch_resample_report.md")

# Central crop of each 283x283 swatch photo: avoids borders/vignettes while
# keeping ~12k pixels for a robust median. The swatch photos are 3x3 grids of
# raised paint tiles with dark recessed grooves — the median lands on tile
# surface; a centre POINT lands on the groove intersection (the systematic
# dark bias found in the original extraction).
CROP_LO, CROP_HI = 0.30, 0.70
MATCH_THRESHOLD = 0.72       # fuzzy-match acceptance (difflib ratio)
DRIFT_FLAG = 3.0             # dE00 above which a stored lab is flagged
KNOWN_PREFIXES = {"GW", "TTC", "PA", "VGC", "VMC", "VMetC", "WPF", "WPH",
                  "AK", "AMP", "DA"}


def _norm(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9 ]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def collect_swatches():
    doc = fitz.open(PDF_PATH)
    swatches = []
    pix_cache = {}
    for pno in range(len(doc)):
        page = doc[pno]
        words = page.get_text("words")

        # Gather this page's swatch rects first, then assign each label word
        # to the NEAREST swatch centre. Long labels bleed horizontally under
        # the neighbouring swatch, so per-rect overlap windows mis-assigned
        # their tails ("TTC Flak | Gun Yellow" split across two swatches).
        rects = []
        for img in page.get_images(full=True):
            xref = img[0]
            for r in page.get_image_rects(xref):
                if 200 < r.width < 400 and 200 < r.height < 400:
                    rects.append((xref, r))
        if not rects:
            continue

        assigned = {i: [] for i in range(len(rects))}
        for w in words:
            cx = (w[0] + w[2]) / 2.0
            # Band: swatch rows are 400pt apart with 283pt swatches, so the
            # label zone is the ~117pt gap below each swatch — take nearly
            # all of it (labels wrap to 2-3 lines).
            # The first label line can start a few points ABOVE the swatch's
            # bottom edge (measured: 5.3pt on the Barak-Nar swatch), so the
            # band floor sits at -12.
            cands = [(i, r) for i, (_, r) in enumerate(rects)
                     if r.y1 - 12 <= w[1] <= r.y1 + 112
                     and r.x0 - 80 <= cx <= r.x1 + 80]
            if not cands:
                continue
            i_best = min(cands,
                         key=lambda ir: abs(cx - (ir[1].x0 + ir[1].x1) / 2))[0]
            assigned[i_best].append(w)

        for idx, (xref, r) in enumerate(rects):
            lbl = sorted(assigned[idx], key=lambda w: (round(w[1]), w[0]))
            label = " ".join(w[4] for w in lbl).strip()
            if not label:
                continue
            # Section headers ("Yellow", "Burgundy") sometimes sit inside
            # the label window. If a known brand prefix appears later in
            # the label, drop everything before it.
            toks = label.split()
            if toks[0] not in KNOWN_PREFIXES:
                for j, t in enumerate(toks[1:], start=1):
                    if t in KNOWN_PREFIXES:
                        label = " ".join(toks[j:])
                        break

            if xref not in pix_cache:
                pix = fitz.Pixmap(doc, xref)
                if pix.n > 3:               # drop alpha/CMYK extras
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                arr = np.frombuffer(pix.samples, dtype=np.uint8)
                arr = arr.reshape(pix.height, pix.width, pix.n)[:, :, :3]
                pix_cache[xref] = arr
            arr = pix_cache[xref]

            h, w = arr.shape[:2]
            crop = arr[int(h * CROP_LO):int(h * CROP_HI),
                       int(w * CROP_LO):int(w * CROP_HI)].reshape(-1, 3)
            med_rgb = np.median(crop, axis=0)
            lab_px = skcolor.rgb2lab((crop / 255.0).reshape(-1, 1, 3)
                                     ).reshape(-1, 3)
            med_lab = skcolor.rgb2lab(
                (med_rgb / 255.0).reshape(1, 1, 3)).reshape(3)
            # Scalar spread: mean Euclidean Lab distance from the median —
            # the swatch's internal variability (metallic signature).
            spread = float(np.mean(
                np.linalg.norm(lab_px - med_lab, axis=1)))

            swatches.append({
                "page": pno,
                "label": label,
                "prefix": label.split()[0],
                "name_raw": " ".join(label.split()[1:]),
                "hex": "#{:02X}{:02X}{:02X}".format(
                    *[int(round(v)) for v in med_rgb]),
                "lab": [round(float(v), 2) for v in med_lab],
                "spread": round(spread, 2),
            })
    return swatches


def load_db():
    with open(DB_PATH, encoding="utf-8") as f:
        paints = json.load(f)
    by_brand = defaultdict(list)
    for p in paints:
        names = [p["name"]] + list(p.get("aliases") or [])
        by_brand[p["brand"]].append(
            {"paint": p, "keys": [_norm(n) for n in names if n]})
    return paints, by_brand


def best_match(name_raw, brand_entries):
    """(paint, confidence) of the best fuzzy match within one brand."""
    target = _norm(name_raw)
    if not target:
        return None, 0.0
    best, best_score = None, 0.0
    for e in brand_entries:
        for key in e["keys"]:
            score = difflib.SequenceMatcher(None, target, key).ratio()
            if score > best_score:
                best, best_score = e["paint"], score
    return best, best_score


def assign_prefix_brands(swatches, by_brand):
    """Empirical prefix -> DB brand: the brand whose names match the prefix's
    labels best wins. Prefixes matching no brand are reported as outside the
    tracked range."""
    labels_by_prefix = defaultdict(list)
    for s in swatches:
        labels_by_prefix[s["prefix"]].append(s["name_raw"])

    mapping = {}
    for prefix, names in labels_by_prefix.items():
        if len(names) < 5:
            continue
        sample = names[:: max(1, len(names) // 40)][:40]
        scores = {}
        for brand, entries in by_brand.items():
            hits = sum(1 for n in sample
                       if best_match(n, entries)[1] >= MATCH_THRESHOLD)
            scores[brand] = hits / len(sample)
        brand, rate = max(scores.items(), key=lambda kv: kv[1])
        mapping[prefix] = (brand, rate) if rate >= 0.5 else (None, rate)
    return mapping


def main():
    print("Collecting swatches from PDF...")
    swatches = collect_swatches()
    print(f"  {len(swatches)} labelled swatches")

    paints, by_brand = load_db()
    prefix_map = assign_prefix_brands(swatches, by_brand)
    print("Prefix -> brand:")
    for pre, (brand, rate) in sorted(prefix_map.items(),
                                     key=lambda kv: -kv[1][1]):
        print(f"  {pre:12s} -> {brand or 'OUTSIDE RANGE':15s} ({rate:.0%})")

    # Vallejo ships three sub-ranges with COLLIDING paint names (VMC/VGC both
    # have an "Off-White", a "Turquoise", a "Silver"...). The prefix
    # disambiguates; the paint_id encodes the range.
    VALLEJO_RANGE = {"VMC": "vallejo-model-color",
                     "VGC": "vallejo-game-color",
                     "VMetC": "vallejo-metal-color"}

    # Match every swatch; keep the best swatch per paint_id.
    rows = []
    for s in swatches:
        brand, _ = prefix_map.get(s["prefix"], (None, 0.0))
        paint, conf = (None, 0.0)
        if brand:
            entries = by_brand[brand]
            id_prefix = VALLEJO_RANGE.get(s["prefix"])
            if id_prefix:
                entries = [e for e in entries
                           if e["paint"]["paint_id"].startswith(id_prefix)]
            paint, conf = best_match(s["name_raw"], entries)
        if conf < MATCH_THRESHOLD and len(s["label"].split()) >= 2:
            # Second chance: wrapped labels can lose their first line (and
            # with it the brand prefix) to the swatch above — "Vorbak Red"
            # is GW Gal Vorbak Red. Retry the FULL label against every
            # brand. Single-word labels are excluded: those are the PDF's
            # section-navigation tabs ("Blue", "Burgundy"), which would
            # otherwise name-match real paints and displace their genuine
            # swatches.
            for b, entries in by_brand.items():
                p2, c2 = best_match(s["label"], entries)
                if c2 > conf and c2 >= 0.75:
                    paint, conf, brand = p2, c2, b
        row = dict(s)
        row["brand"] = brand
        if paint is not None and conf >= MATCH_THRESHOLD:
            drift = ciede2000_single(np.array(paint["lab"], float),
                                     np.array(s["lab"], float))
            row.update({
                "paint_id": paint["paint_id"],
                "paint_name": paint["name"],
                "metallic": bool(paint.get("metallic")),
                "stored_lab": paint["lab"],
                "stored_hex": paint["hex"],
                "confidence": round(conf, 3),
                "drift_de00": round(float(drift), 2),
            })
        else:
            row.update({"paint_id": None, "confidence": round(conf, 3)})
        rows.append(row)

    # Deduplicate: one swatch per paint (highest name confidence wins).
    by_paint = {}
    for r in rows:
        pid = r.get("paint_id")
        if not pid:
            continue
        if pid not in by_paint or r["confidence"] > by_paint[pid]["confidence"]:
            by_paint[pid] = r

    matched = list(by_paint.values())
    unmatched = [r for r in rows if not r.get("paint_id")]
    db_ids = {p["paint_id"] for p in paints}
    missing = sorted(db_ids - set(by_paint))

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump({"matched": matched, "unmatched_swatches": unmatched,
                   "db_paints_without_swatch": missing,
                   "prefix_map": {k: v[0] for k, v in prefix_map.items()}},
                  f, indent=1)

    # ---- review report ----
    matched.sort(key=lambda r: -r["drift_de00"])
    drifted = [r for r in matched if r["drift_de00"] > DRIFT_FLAG]
    metallics = [r for r in matched if r.get("metallic")]
    spreads = np.array([r["spread"] for r in matched])
    met_spread = np.array([r["spread"] for r in metallics]) if metallics else np.array([0])
    matte_spread = np.array([r["spread"] for r in matched
                             if not r.get("metallic")])

    lines = [
        "# Swatch Re-sample Review Report",
        "",
        f"- swatches labelled in PDF: **{len(rows)}**",
        f"- matched to DB paints: **{len(matched)}** / {len(db_ids)} DB paints",
        f"- DB paints with no swatch found: **{len(missing)}**",
        f"- unmatched swatch labels: **{len(unmatched)}**",
        f"- drift > {DRIFT_FLAG} dE00 (stored vs region median): "
        f"**{len(drifted)}** paints",
        f"- median swatch spread: matte {np.median(matte_spread):.1f} / "
        f"metallic {np.median(met_spread):.1f} Lab units "
        "(spread = how much a centre-point sample can lie)",
        "",
        "## Top 40 drifted paints (stored lab vs region median)",
        "",
        "| paint | brand | met | drift dE00 | stored hex | resampled hex | spread | conf |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for r in matched[:40]:
        lines.append(
            f"| {r['paint_name']} | {r['brand']} | "
            f"{'Y' if r.get('metallic') else ''} | {r['drift_de00']} | "
            f"{r['stored_hex']} | {r['hex']} | {r['spread']} | "
            f"{r['confidence']} |")

    lines += ["", "## Drift distribution", ""]
    drifts = np.array([r["drift_de00"] for r in matched])
    for lo, hi in ((0, 1), (1, 2), (2, 3), (3, 5), (5, 10), (10, 1000)):
        n = int(((drifts >= lo) & (drifts < hi)).sum())
        lines.append(f"- dE00 {lo}-{hi if hi < 1000 else '+'}: {n}")

    lines += ["", f"## Unmatched swatch labels ({len(unmatched)})", ""]
    for r in unmatched[:60]:
        lines.append(f"- p{r['page']}: `{r['label']}` "
                     f"(best conf {r['confidence']})")
    lines += ["", f"## DB paints without a swatch ({len(missing)})", ""]
    for pid in missing[:60]:
        lines.append(f"- {pid}")

    with open(OUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"\n-> {OUT_JSON}\n-> {OUT_MD}")
    print(f"matched {len(matched)}, drifted>{DRIFT_FLAG} {len(drifted)}, "
          f"missing {len(missing)}, unmatched {len(unmatched)}")


if __name__ == "__main__":
    main()
