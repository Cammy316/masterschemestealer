"""
SchemeStealer Colour Engine Test Harness — Module 1: SYNTHETIC FAMILY SWEEP
===========================================================================

Catches CATEGORICAL bugs: missing families (like Orange/Yellow were), wrong
hue boundaries, and disagreement between the two classifiers. No ground-truth
photos needed — the "correct" family for a generated colour is known by
construction.

This is the cheapest, fastest harness and it permanently locks the classes of
bug we already found (missing Orange, cyan-as-green, classifier disagreement).

Run:  python 1_synthetic_sweep.py
Output: report_1_sweep.json  +  console summary
"""
import sys, os, json, colorsys
import numpy as np

# --- Make the engine importable. Adjust ENGINE_ROOT if your layout differs. ---
ENGINE_ROOT = os.environ.get("SS_ENGINE_ROOT", "../python-api")
sys.path.insert(0, os.path.abspath(ENGINE_ROOT))

# These imports must resolve against the live engine. If the running API imports
# from core/core/, point ENGINE_ROOT or fix the duplicate per Prompt 1.2.
IMPORT_ERRORS = []
classify_hue = None
classify_engine = None
compute_family = None
try:
    from core.smart_color_system import SmartColorExtractor as SmartColorSystem  # noqa
except Exception as e:
    IMPORT_ERRORS.append(f"smart_color_system: {e}")
try:
    from core.color_engine import compute_color_family  # noqa
    compute_family = compute_color_family
except Exception as e:
    IMPORT_ERRORS.append(f"color_engine.compute_color_family: {e}")
try:
    from core.color_engine import ColorAnalyzer  # noqa  (optional, not required)
except Exception:
    ColorAnalyzer = None


# ---------------------------------------------------------------------------
# Reference families by hue. This is the GROUND TRUTH the engine is graded
# against. These boundaries match the unified `hue_family` spec from
# PROMPT_1.3 exactly, so a correctly-implemented engine should score ~0 hard
# misses post-fix. Saturation/value gates encode "is this colour chromatic
# enough to have a hue family at all". `lab` is optional; when provided it
# enables the pale-pink rescue that the engine also performs.
# ---------------------------------------------------------------------------
def expected_family(h, s, v, lab=None):
    """Return the family a well-calibrated engine SHOULD output for this HSV
    (mirrors hue_family in PROMPT_1.3)."""
    L = a = b = None
    if lab is not None:
        L, a, b = lab
    chroma = float((a**2 + b**2) ** 0.5) if lab is not None else (s * v * 100)
    # 1. Achromatic / pale-tint gate
    if v < 0.10:
        return "black"
    if s < 0.10 or chroma < 12:
        if lab is not None and (h < 24 or h >= 300) and L > 60 and a > 6 and v > 0.7:
            return "pink"
        if 195 <= h < 256 and s > 0.05 and chroma > 3:
            return "blue"
        if 74 <= h < 158 and s > 0.06 and chroma > 4:
            return "green"
        if 158 <= h < 195 and s > 0.06 and chroma > 3:
            return "cyan"
        if 256 <= h < 300 and s > 0.05 and chroma > 3:
            return "purple"
        if v > 0.85:
            return "white"
        if v > 0.18:
            return "grey"
        return "black"
    # 2. Chromatic by hue
    if h < 16 or h >= 336:
        if v > 0.72 and s < 0.55:
            return "pink"
        if chroma < 16 and v < 0.55:
            return "brown"
        if s < 0.45 and v < 0.4:
            return "brown"
        return "red"
    if 16 <= h < 40:
        if s < 0.45 or v < 0.45:
            return "brown"
        return "orange"
    if 40 <= h < 74:
        if s < 0.30 and v > 0.55:
            return "bone"
        if v < 0.30:
            return "brown"
        return "yellow"
    if 74 <= h < 158:
        return "green"
    if 158 <= h < 195:
        return "cyan"
    if 195 <= h < 256:
        return "blue"
    if 256 <= h < 292:
        return "purple"
    if 292 <= h < 336:
        if v > 0.72 and s < 0.55:
            return "pink"
        return "magenta"
    return "unknown"


# Families that are "adjacent enough" we won't fail a near-boundary miss.
# A miss between true neighbours (yellow<->green at the 74 line) is a soft warning;
# a miss between non-neighbours (gold-nose-as-green, orange-as-pink) is a hard fail.
NEIGHBOURS = {
    "red": {"orange", "pink", "magenta", "brown"},
    "orange": {"red", "yellow", "brown"},
    "yellow": {"orange", "green", "bone"},
    "green": {"yellow", "cyan"},
    "cyan": {"green", "blue"},
    "blue": {"cyan", "purple"},
    "purple": {"blue", "magenta", "pink"},
    "magenta": {"purple", "pink", "red"},
    "pink": {"red", "magenta", "purple", "white"},
    "brown": {"red", "orange", "yellow", "grey"},
    "bone": {"yellow", "white", "grey"},
    "grey": {"white", "black", "bone"},
    "white": {"grey", "bone"},
    "black": {"grey"},
}

def severity(expected, got):
    if expected == got:
        return "ok"
    e = expected.lower(); g = (got or "").lower()
    # normalise composite engine strings e.g. "cyan/turquoise"
    g = g.split("/")[0].strip()
    if e == g:
        return "ok"
    if g in NEIGHBOURS.get(e, set()):
        return "soft"   # neighbour miss — boundary tuning, low priority
    return "hard"        # non-neighbour miss — real bug


def run_sweep():
    if compute_family is None:
        return {"error": "engine import failed", "import_errors": IMPORT_ERRORS}

    # Build the system once if available (production ensemble path)
    smart = None
    try:
        smart = SmartColorSystem()
    except Exception as e:
        IMPORT_ERRORS.append(f"SmartColorSystem init: {e}")

    rows = []
    hard = soft = ok = 0
    family_seen = set()        # which families the engine EVER produces
    disagreements = []         # hue where the two classifiers differ

    # Sweep a dense grid across hue, plus representative saturation/value levels.
    from skimage import color as skcolor
    for h in range(0, 360, 2):
        for s in (0.25, 0.5, 0.8, 1.0):
            for v in (0.4, 0.7, 0.95):
                r, g, b = colorsys.hsv_to_rgb(h/360.0, s, v)
                hexv = "#%02X%02X%02X" % (round(r*255), round(g*255), round(b*255))
                # Re-derive actual HSV/LAB FROM THE HEX so both classifiers see
                # identical input (nominal grid values round-trip imperfectly at
                # exact hue boundaries, which would otherwise create false
                # "disagreements"). Both paths must be graded on the same colour.
                rr, gg, bb = [int(hexv[i:i+2], 16)/255 for i in (1, 3, 5)]
                ah, as_, av = colorsys.rgb_to_hsv(rr, gg, bb)
                ah_deg = ah * 360
                lab = skcolor.rgb2lab(np.array([[[rr, gg, bb]]]))[0, 0]
                chroma = float(np.sqrt(lab[1]**2 + lab[2]**2))

                exp = expected_family(ah_deg, as_, av, lab=lab)
                if exp in ("unknown",):
                    continue

                # --- compute_family is the shared DB+engine path ---
                got_cf = compute_family(hexv).lower()
                family_seen.add(got_cf.split("/")[0])

                # --- production ensemble (smart) if available ---
                got_smart = None
                if smart is not None:
                    try:
                        hsv = np.array([ah, as_, av])
                        rgb = np.array([rr*255, gg*255, bb*255])
                        cluster = {"median_hsv": hsv, "chroma": chroma,
                                   "median_lab": lab, "median_rgb": rgb}
                        fam, _conf = smart._classify_family_ensemble_weighted(cluster)
                        got_smart = fam.lower().split("/")[0]
                    except Exception:
                        got_smart = None

                sev = severity(exp, got_cf)
                if sev == "hard": hard += 1
                elif sev == "soft": soft += 1
                else: ok += 1

                if got_smart and got_smart != got_cf.split("/")[0]:
                    disagreements.append({"hex": hexv, "h": round(ah_deg, 1),
                                          "s": round(as_, 2), "v": round(av, 2),
                                          "compute_family": got_cf,
                                          "ensemble": got_smart})

                if sev != "ok":
                    rows.append({"hex": hexv, "h": round(ah_deg, 1),
                                 "s": round(as_, 2), "v": round(av, 2),
                                 "expected": exp, "got": got_cf,
                                 "ensemble": got_smart, "severity": sev})

    # Which expected families NEVER appear in the engine's output → missing-family bug
    all_expected = {expected_family(h, .8, .7) for h in range(0,360,2)}
    all_expected = {f for f in all_expected if f not in ("unknown",)}
    missing_families = sorted(all_expected - family_seen)

    total = ok + soft + hard
    return {
        "module": "synthetic_sweep",
        "total_samples": total,
        "ok": ok, "soft_misses": soft, "hard_misses": hard,
        "hard_miss_rate": round(hard / max(total,1), 4),
        "missing_families": missing_families,
        "classifier_disagreements": len(disagreements),
        "disagreement_examples": disagreements[:40],
        "hard_miss_examples": [r for r in rows if r["severity"]=="hard"][:60],
        "soft_miss_examples": [r for r in rows if r["severity"]=="soft"][:20],
        "import_errors": IMPORT_ERRORS,
    }


if __name__ == "__main__":
    rep = run_sweep()
    with open("report_1_sweep.json", "w") as f:
        json.dump(rep, f, indent=2)
    print("=== MODULE 1: SYNTHETIC FAMILY SWEEP ===")
    if rep.get("error"):
        print("ERROR:", rep["error"]); print(rep.get("import_errors"))
    else:
        print(f"samples: {rep['total_samples']}  ok: {rep['ok']}  "
              f"soft: {rep['soft_misses']}  HARD: {rep['hard_misses']} "
              f"(rate {rep['hard_miss_rate']})")
        print(f"missing families (never produced): {rep['missing_families'] or 'none'}")
        print(f"classifier disagreements: {rep['classifier_disagreements']}")
        if rep["hard_miss_examples"]:
            print("\nworst hard misses (non-neighbour):")
            for r in rep["hard_miss_examples"][:12]:
                print(f"  {r['hex']} h={r['h']} s={r['s']} v={r['v']}  "
                      f"expected {r['expected']} got {r['got']} (ensemble {r['ensemble']})")
    print("\n-> report_1_sweep.json written")
