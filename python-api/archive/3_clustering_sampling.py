"""
SchemeStealer Colour Engine Test Harness — Module 3: CLUSTERING / SAMPLING
==========================================================================

The BRONZE-NOSE catcher. The pink-Horror failures were not classification bugs
— they were SAMPLING bugs: K-means blended the small gold trim with adjacent
grass + skin and produced a colour (#b6ce61) that exists nowhere on the model.

This module synthesises images with KNOWN colour regions of known sizes, runs
the full extraction pipeline, and checks each planted region is recovered as
its own cluster with the correct colour — instead of being blended away.

Ground truth is known because we paint the regions ourselves. This is the only
harness that exercises the clustering/segmentation path end-to-end, and it's
the one that directly targets the class of bug you most want to find.

Run:  python 3_clustering_sampling.py
Output: report_3_clustering.json + synthetic_*.png (for eyeballing) + console
"""
import sys, os, json
import numpy as np

ENGINE_ROOT = os.environ.get("SS_ENGINE_ROOT", "../python-api")
sys.path.insert(0, os.path.abspath(ENGINE_ROOT))

from skimage import color as skcolor
from PIL import Image

IMPORT_ERRORS = []
extractor = None
extract_fn = None

# We need whatever function the engine uses to turn an image into clusters/colours.
# Try the most likely entrypoints; the runner prints what it found so you can
# tell me if the name differs and I'll adjust.
try:
    from core.smart_color_system import SmartColorExtractor as SmartColorSystem
    extractor = SmartColorSystem()
except Exception as e:
    IMPORT_ERRORS.append(f"SmartColorSystem: {e}")

try:
    from core.color_engine import compute_color_family
except Exception as e:
    compute_color_family = None
    IMPORT_ERRORS.append(f"compute_color_family: {e}")


def hex_to_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)], dtype=float)

def deltaE00_rgb(rgb_a, rgb_b):
    la = skcolor.rgb2lab((rgb_a/255).reshape(1,1,3)).reshape(3)
    lb = skcolor.rgb2lab((rgb_b/255).reshape(1,1,3)).reshape(3)
    return float(skcolor.deltaE_ciede2000(la.reshape(1,1,3), lb.reshape(1,1,3))[0,0])


# ---------------------------------------------------------------------------
# Synthetic mini-scenes. Each is a list of (hex, coverage_fraction, label).
# Coverage drives how big each region is. The hard cases mimic real minis:
# a dominant body colour + several SMALL high-chroma trim regions (the exact
# situation that blends in real scans).
# ---------------------------------------------------------------------------
SCENES = {
    "pink_horror_like": [
        ("#C9527F", 0.55, "pink_body"),
        ("#5BB9C9", 0.12, "blue_spikes"),
        ("#C9A227", 0.06, "gold_trim"),       # small — the blend culprit
        ("#6E8B3D", 0.15, "green_base"),
        ("#E8E0D0", 0.12, "bone_loincloth"),
    ],
    "space_marine_like": [
        ("#0D407F", 0.50, "blue_armour"),
        ("#C39E81", 0.08, "gold_trim"),        # small gold
        ("#9A1115", 0.07, "red_accent"),
        ("#231F20", 0.20, "black_join"),
        ("#888D8F", 0.15, "silver_metal"),
    ],
    "high_contrast_trim": [
        ("#1E1E1E", 0.60, "black_body"),
        ("#C9A227", 0.05, "gold_edge"),        # tiny gold edge highlight
        ("#C21E10", 0.05, "red_lens"),
        ("#3FB8C8", 0.05, "cyan_gem"),
        ("#E0E0E0", 0.25, "grey_trim"),
    ],
    "monochrome_greens": [   # tests over-segmentation: similar greens shouldn't fragment wildly
        ("#1E7B3F", 0.40, "mid_green"),
        ("#0E4D26", 0.30, "dark_green"),
        ("#4FA968", 0.30, "light_green"),
    ],
    # STRESS: 7 distinct regions, three of them tiny. If the engine's k is fixed
    # at 5 (the config default), it CANNOT represent all 7 — the small high-chroma
    # trim is what gets blended. This scene is designed to expose exactly the
    # bronze-nose failure: more real colours than clusters.
    "more_regions_than_clusters": [
        ("#C9527F", 0.38, "pink_body"),
        ("#6E8B3D", 0.20, "green_base"),
        ("#0D407F", 0.18, "blue_cloth"),
        ("#C9A227", 0.06, "gold_trim"),        # tiny
        ("#C21E10", 0.06, "red_gem"),          # tiny
        ("#3FB8C8", 0.06, "cyan_spike"),       # tiny
        ("#E8E0D0", 0.06, "bone_pouch"),       # tiny
    ],
}


def build_scene(regions, W=300, H=300):
    """Lay regions as horizontal bands sized by coverage. Add a little noise so
    it's not a perfect synthetic (closer to a real photo)."""
    img = np.zeros((H, W, 3), dtype=float)
    x = 0
    layout = []
    for hexv, cov, label in regions:
        w = max(1, int(round(W * cov)))
        rgb = hex_to_rgb(hexv)
        img[:, x:x+w] = rgb
        layout.append({"hex": hexv, "label": label, "x0": x, "x1": min(x+w, W),
                       "coverage": cov, "rgb": rgb.tolist()})
        x += w
    if x < W:  # pad last
        img[:, x:W] = hex_to_rgb(regions[-1][0])
    img = np.clip(img + np.random.normal(0, 3, img.shape), 0, 255)
    return img.astype(np.uint8), layout


def try_extract(img_rgb):
    """Attempt to get the engine's detected colours for an image.
    Returns list of dicts: {rgb, coverage?, family?}. Adapts to whatever the
    SmartColorSystem exposes; records the method used."""
    methods_tried = []
    # Most likely: a method that takes an RGB image and returns clusters
    for name in ("extract_colors", "extract_dominant_colors", "analyze",
                 "extract", "cluster_colors", "process_image", "detect_colors"):
        fn = getattr(extractor, name, None)
        if callable(fn):
            methods_tried.append(name)
            try:
                # The engine's extract_colors(img_rgb, mask) needs a boolean mask
                # of valid pixels; a synthetic full-frame scene is all True. Fall
                # back to a single-arg call for any other entrypoint shape.
                mask = np.ones(img_rgb.shape[:2], dtype=bool)
                try:
                    res = fn(img_rgb, mask)
                except TypeError:
                    res = fn(img_rgb)
                clusters = _normalise_clusters(res)
                if clusters:
                    return clusters, name, methods_tried
            except Exception as e:
                methods_tried[-1] += f"(err:{type(e).__name__})"
    return None, None, methods_tried


def _normalise_clusters(res):
    """Coerce various possible return shapes into [{rgb, coverage, family}]."""
    out = []
    if res is None:
        return out
    seq = res
    if isinstance(res, dict):
        for k in ("clusters", "colors", "colours", "recipes", "results"):
            if k in res:
                seq = res[k]; break
    if not isinstance(seq, (list, tuple)):
        return out
    for c in seq:
        rgb = None; cov = None; fam = None
        if isinstance(c, dict):
            for k in ("median_rgb", "rgb", "color", "colour"):
                if k in c and c[k] is not None:
                    rgb = np.array(c[k], dtype=float)[:3]; break
            cov = c.get("coverage") or c.get("dominance") or c.get("percentage")
            fam = (c.get("family") or c.get("color_family") or
                   c.get("heuristic_family"))
        elif isinstance(c, (list, tuple, np.ndarray)) and len(c) >= 3:
            rgb = np.array(c[:3], dtype=float)
        if rgb is not None:
            if rgb.max() <= 1.01:
                rgb = rgb * 255
            out.append({"rgb": rgb, "coverage": cov, "family": fam})
    return out


def run():
    results = {"module": "clustering_sampling", "scenes": {},
               "import_errors": IMPORT_ERRORS}
    if extractor is None:
        results["error"] = "could not init SmartColorSystem"
        return results

    np.random.seed(7)
    method_used = None
    os.makedirs("synthetic_scenes", exist_ok=True)

    for scene_name, regions in SCENES.items():
        img, layout = build_scene(regions)
        Image.fromarray(img).save(f"synthetic_scenes/synthetic_{scene_name}.png")

        clusters, method, tried = try_extract(img)
        method_used = method or method_used

        scene_result = {"planted_regions": [r["label"] for r in layout],
                        "extract_method": method, "methods_tried": tried,
                        "regions": []}

        if clusters is None:
            scene_result["error"] = ("no usable extract method found; "
                                     f"tried: {tried}")
            results["scenes"][scene_name] = scene_result
            continue

        # For each planted region, find the nearest detected cluster by ΔE.
        for reg in layout:
            true_rgb = np.array(reg["rgb"])
            best = None; best_dE = 1e9
            for cl in clusters:
                dE = deltaE00_rgb(true_rgb, cl["rgb"])
                if dE < best_dE:
                    best_dE = dE; best = cl
            detected = best is not None
            rec_hex = ("#%02X%02X%02X" % tuple(int(round(c)) for c in best["rgb"])
                       if best is not None else None)
            # A region is "recovered" if some cluster is within ΔE ~10 of it.
            recovered = detected and best_dE <= 10
            scene_result["regions"].append({
                "label": reg["label"], "true_hex": reg["hex"],
                "coverage": reg["coverage"],
                "nearest_cluster_hex": rec_hex,
                "nearest_deltaE": round(best_dE, 2),
                "recovered": recovered,
                "detected_family": best.get("family") if best else None,
            })

        n = len(layout)
        rec = sum(1 for r in scene_result["regions"] if r["recovered"])
        scene_result["recovery_rate"] = round(rec/max(n,1), 3)
        # Highlight small regions that got blended (the bronze-nose signature)
        scene_result["blended_small_regions"] = [
            r for r in scene_result["regions"]
            if not r["recovered"] and r["coverage"] <= 0.08]
        results["scenes"][scene_name] = scene_result

    # Roll-up
    all_regions = [r for s in results["scenes"].values()
                   for r in s.get("regions", [])]
    if all_regions:
        results["overall_recovery_rate"] = round(
            sum(1 for r in all_regions if r["recovered"])/len(all_regions), 3)
        results["small_region_recovery"] = round(
            sum(1 for r in all_regions if r["recovered"] and r["coverage"] <= 0.08) /
            max(1, sum(1 for r in all_regions if r["coverage"] <= 0.08)), 3)
    results["extract_method_used"] = method_used
    return results


if __name__ == "__main__":
    rep = run()
    with open("report_3_clustering.json", "w") as f:
        json.dump(rep, f, indent=2)
    print("=== MODULE 3: CLUSTERING / SAMPLING ===")
    if rep.get("error"):
        print("ERROR:", rep["error"])
        print("import errors:", rep.get("import_errors"))
        print("\n** Tell Claude which method SmartColorSystem exposes to extract "
              "colours from an image, and I'll wire it in. **")
    else:
        print(f"extract method used: {rep.get('extract_method_used')}")
        print(f"overall region recovery: {rep.get('overall_recovery_rate')}  "
              f"small-region (<=8%) recovery: {rep.get('small_region_recovery')}")
        for sname, s in rep["scenes"].items():
            print(f"\n  scene: {sname}  recovery={s.get('recovery_rate')}")
            for r in s.get("regions", []):
                flag = "" if r["recovered"] else "  <-- BLENDED/MISSED"
                print(f"    {r['label']:16} {r['true_hex']} "
                      f"nearest ΔE={r['nearest_deltaE']:5.1f}{flag}")
            if s.get("blended_small_regions"):
                print(f"    !! small regions blended away: "
                      f"{[r['label'] for r in s['blended_small_regions']]}")
    print("\n-> report_3_clustering.json + synthetic_scenes/*.png written")
