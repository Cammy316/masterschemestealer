# SchemeStealer Colour Engine Test Harness

A fully-automated test harness for the colour-detection engine. **No hand-labelled
data required** — every test generates its own ground truth. This is the most
robustness you can verify *before* the Prompt 6 painted-swatch dataset exists.

It exists to answer one question objectively: **is the engine getting more robust,
or am I just tweaking hue ranges in circles?** Run it, bring back
`harness_report.json`, and Claude turns the findings into a Claude Code fix prompt.

---

## What it tests (three modules)

**Module 1 — Synthetic family sweep** (`1_synthetic_sweep.py`)
Generates colours spanning the whole HSV space and checks each lands in the right
family. Catches **categorical bugs**: a whole family with no code path (this is how
"missing Orange/Yellow" was found), wrong hue boundaries, and **disagreement
between the two classifiers** (`compute_color_family` vs the ensemble). Fast, and
it permanently locks the bugs we already found.

**Module 2 — Distortion robustness** (`2_distortion_robustness.py`)
The "real phone photo" test. Takes known paint hexes from your DB, renders each as
a swatch, then applies realistic camera/lighting distortions (white balance,
exposure, gamma, shadow gradient, sensor noise, JPEG, saturation shift, and a
compound "bad indoor phone photo") and checks the family stays stable and the
recovered colour stays within an acceptable CIEDE2000. **This is the core
robustness signal** — it measures whether the engine survives the conditions your
users actually shoot in. Reports which families are most fragile.

**Module 3 — Clustering / sampling** (`3_clustering_sampling.py`)
The **bronze-nose catcher**. The pink-Horror failures were sampling bugs, not
classification bugs — K-means blended small gold trim with neighbouring colours
into a colour that exists nowhere on the model. This module paints synthetic scenes
with known regions (including the `more_regions_than_clusters` scene, deliberately
built with more real colours than the engine's cluster count) and checks each
region is recovered as its own cluster instead of being blended away.

---

## Setup

```bash
# 1. Point at your engine (the folder containing the `core/` package)
export SS_ENGINE_ROOT=/path/to/masterschemestealer/python-api      # mac/linux
# set SS_ENGINE_ROOT=C:\path\to\masterschemestealer\python-api      # windows

# 2. Install dependencies
pip install numpy scipy scikit-image scikit-learn pillow

# 3. Run everything
python run_all.py
```

Output:
- `harness_report.json` ← **bring this back to Claude**
- `report_1_sweep.json`, `report_2_distortion.json`, `report_3_clustering.json` (per-module detail)
- `synthetic_scenes/*.png` (the generated test images, for your own eyeballing)
- Console summary (paste this too)

You can also run a single module directly, e.g. `python 2_distortion_robustness.py`.

---

## Important notes / likely snags

**The `core/core/` duplicate.** If the running API imports from a nested
`python-api/core/core/`, set `SS_ENGINE_ROOT` so `import core.color_engine`
resolves to the **live** copy, or fix the duplication first (Prompt 1.2 Task). If
imports fail, `harness_report.json` will say exactly which module/name failed.

**Module 3 needs the engine's extract entrypoint.** It auto-probes common method
names (`extract_colors`, `extract_dominant_colors`, `analyze`, etc.) on
`SmartColorSystem`. If none match, the report will list the methods it tried and
say "no usable extract method found" — in that case, **tell Claude the actual
method name/signature the engine uses to turn an image into colour clusters**, and
it'll wire it in. (This is the one place the harness can't fully auto-detect.)

**Module 2 prefers your rebuilt DB.** It reads `paints_rebuilt.json` then
`paints.json` from `SS_ENGINE_ROOT`; if neither is found it falls back to a
built-in spread of one tricky colour per family plus the two real failure hexes
(`#b2dfd1`, `#b6ce61`).

---

## How to read the results

- **Module 1 — `hard_miss_rate`** near 0 is the target. `missing_families` MUST be
  empty (a non-empty list is a categorical bug like the old missing-Orange).
  `classifier_disagreements` should trend to 0 after Prompt 1.2 unifies the
  boundaries.
- **Module 2 — `family_stability` per scenario.** Anything well below ~0.8 means
  that condition flips families; `most_fragile_families` is your priority list
  (expect desaturated families — grey/cyan/magenta — to be most fragile, which
  points at achromatic-boundary handling rather than hue tuning).
- **Module 3 — `small_region_recovery`.** This is the bronze-nose metric. If small
  high-chroma regions aren't recovered (especially in `more_regions_than_clusters`),
  the cluster count / merge logic is blending real trim — a sampling fix, not a
  classification one.

---

## What this can and can't tell you

**Can:** find missing/!mismatched families, classifier disagreements, fragility
under realistic photo conditions, and small-region blending — all automatically,
repeatably, with no labelling.

**Can't (until Prompt 6):** tell you whether a *real painted* colour matches the
*real paint pot* — that needs measured swatch ground truth. Chart hexes are
approximate. So treat Module 2's ΔE numbers as *relative* robustness indicators
(does distortion make it worse?), not absolute match-accuracy claims. Smartphone
colour is dominated by ambient light and camera hardware, so absolute ΔE to a pot
colour isn't meaningful yet — relative stability under distortion is.

This is the ceiling of pre-swatch testing, and it's a high ceiling: it will catch
essentially every *structural* and *robustness* bug. The remaining accuracy gain
after this comes from real swatch data (Prompt 6), not from more tuning.
