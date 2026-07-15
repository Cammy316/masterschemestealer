---
name: schemestealer-colour-science
description: Colour-science authority for SchemeStealer. Use this skill for ANY work touching colour detection, classification, paint matching, recipe derivation, white balance, sampling/clustering, ΔE metrics, colour anchors, pigment mixing (spectral.js / Kubelka–Munk / The Forge), or the known bugs A (gold/khaki→green), B (pale pink→grey/white), C (small-trim overlay not rendering). Also use when authoring diagnosis or implementation prompts about the colour pipeline. Load schemestealer-core first. Also load the repo-local skill at skill.color-expert/ before deep analysis — it is the colour-theory authority.
---

# SchemeStealer — Colour Science

**Ground rule:** the live code and the repo skill `skill.color-expert/` outrank your prior
beliefs and any cached summary of this codebase. This skill records the verified state as
of the last read-only diagnosis (`COLOUR_ANALYSIS_FINDINGS.md`); if the live code
disagrees, the live code wins — say so explicitly and cite `file:line`.

## The pipeline (verified, single source of truth at each stage)

```
scan(image)
└─ services/{miniature,inspiration}_scanner.py         thin wrappers, format JSON
   └─ SchemeStealerEngine.analyze_miniature()          core/schemestealer_engine.py:135
      1. quality + CLAHE on L*                         core/photo_processor.py
      2. white balance (alpha-aware)                   utils/helpers.py:11  ◄ Shades-of-Grey, sRGB domain
      3. crop (alpha bbox / full frame)                schemestealer_engine.py:160
      4. resize to 300 px                              ColorDetection.RESIZE_WIDTH = 300
      5. extract colours                               core/smart_color_system.py:38
         • 2–98th percentile L* trim (specular+shadow)
         • KMeans in LAB (k=8..15, random_state=42)
         • ΔE2000 perceptual merge + trim-protect
         • spatial shadow reject
         • classify each cluster — ONE call            :381 _classify_family_ensemble_weighted
      6. per-cluster recipe build                      schemestealer_engine.py:202
         • classify family                             color_engine.py:197 classify_family()  ◄ THE classifier
         • metallic flag                               color_engine.py:137 is_metallic_surface() (specular variance)
         • match base                                  color_engine.py:382 match_color() (family gate + ΔE≤30)
         • highlight/shade partner                     recipe_graph OR recipe_geometry.derive_partner
         • wash                                        services/recipe_builder.py:98 get_wash_for_family
         • reticle overlay                             color_engine.py:549 create_color_overlay
```

## The classifier — current, verified design

- **LAB nearest-exemplar by CIEDE2000** over `python-api/color_anchors.json`. There are
  **no HSV hue bands anywhere** — that design was removed. Do not reintroduce one, ever.
- Only hard threshold: black floor `L < black_l` (~10).
- `hue_family()` and `compute_color_family()` are thin adapters over `classify_family()`.
- Frontend `classifyFamily` (`lib/offlineColorDetection.ts`) ports the same algorithm over
  the same anchors; `lib/deltaE.ts` is a full manual CIEDE2000 port.
- Anchors are **built**, not hand-edited: `scripts/build_color_anchors.py` regenerates both
  `color_anchors.json` and `lib/colorAnchors.ts`, so parity is automatic. To change family
  behaviour, change the build inputs/curation, then rebuild — never patch one side.
- `achromatic_c` in `color_anchors.json` is **dead runtime config** (used only at build
  time). Do not write code that reads it at runtime.

## Known bugs and their TRUE mechanisms

These have been misdiagnosed before; the refuted hypotheses are listed so you do not
resurrect them.

### Bug A — gold/khaki misclassified as green (HIGH)
- ❌ Refuted: "HSV thresholds miscalibrated against LAB hue". No HSV code exists.
- ✅ Actual: two compounding causes.
  1. `is_metallic_surface()` (color_engine.py:137) keys on **specular brightness variance**
     (`brightness_std > 25`, or `>18` + dark + desaturated). Evenly lit matte gold/brass has
     low variance → gate never fires → falls to the chromatic path.
  2. In the warm-desaturated olive/khaki LAB region, yellow/green/brown/bronze exemplars
     overlap; the winner is decided by **anchor density**, not a clean boundary.
- Fix direction: curated khaki/brass/olive-gold exemplars on the correct side; optionally a
  chroma-aware metallic prior for warm low-variance regions. **No HSV gate** (invariant 1).

### Bug B — pale pink misclassified as grey/white/bone (HIGH)
- ❌ Refuted: "a flat chroma gate routes low-chroma to grey before hue logic". No such gate.
- ✅ Actual: total-ΔE-nearest is **lightness-weighted**. Near the neutral axis, CIEDE2000's
  ΔL term dominates because chroma/hue terms shrink with C. A pale pink at (L≈80, a≈12,
  b≈−3) sits closer to dense high-L white/bone anchors than to saturated pink anchors lower
  in L. Family is a question of **hue direction**, not total ΔE, in the low-chroma high-L
  corner.
- Fix direction: keep ONE classifier, but in the low-chroma region either (i) compare in
  LCh with a reduced ΔL weight, or (ii) densify pale-tint exemplars. Lock with fixtures.

### Bug C — magenta/gold trim detected but location overlay blank (MED, UX not colour)
- ✅ Actual: mask cleaning kills small regions. `_clean_mask` drops components `<5 px`
  (color_engine.py:601-623); rim contour floor `min_area = max(25, 0.0005·h·w)` (:588).
  Magenta/gold are typically tiny trims → mask cleaned to empty → overlay renders flat.
  The colour still appears in the recipe list (classification/matching are fine).
- Not the cause: family-name gating (none exists), capitalisation (correct).
- Fix direction: scale `min_area` down for low-coverage details, or fall back to the raw
  pre-clean mask when cleaning empties it. Verify the contour-draw path on an all-zero
  mask (previously unverified).

## Other verified findings

- **F3 White balance (MED):** Shades-of-Grey (Finlayson–Trezzi, Minkowski p=6) dividing in
  **gamma-encoded sRGB**, no linearisation, no Bradford/CAT to D65. Grey-world also fails on
  single-hue-dominated minis (mostly-red model → cyan cast). Fix: linearise → estimate
  illuminant → Bradford-adapt to D65 → re-encode. High blast radius: touches every LAB
  value; gate behind `2_distortion_robustness.py`.
- **F4 Sampling (MED):** the 2–98th percentile L* trim is global and not gloss-aware; a
  coloured specular below the 98th percentile survives. Per-cluster **median** LAB collapses
  smooth base→highlight gradients inside one cluster. Fix: saturation-aware specular
  reject; consider mode/peak-density sampling for textured clusters.
- **F6 Metric drift (LOW):** `recipe_geometry.derive_partner` ranks by **Euclidean ΔE76**
  (:284) while everything else uses CIEDE2000; and `match_color` re-derives target LAB from
  `median_rgb` (color_engine.py:401) while the classifier used the cluster's `median_lab` —
  median(RGB) ≠ median(LAB), so the classified colour and the matched colour differ
  slightly. Fix: rank by CIEDE2000; pass `median_lab` into the matcher.
- Matchable paints always match on **measured LAB**, never hex (`compute_properties` sets
  `self.lab = measured_lab`; `lab_matrix` built from it).

## Pigment mixing — spectral.js / Kubelka–Munk

**Physics you must respect:** additive sRGB averaging is wrong for paint
(blue + yellow → grey, not green). Genuine subtractive mixing needs Kubelka–Munk. White is
not a neutral lightener — it shifts hue and kills chroma. Tinting strength varies per
pigment. Washes behave as **low-concentration layering**, not a 50/50 mix.

**Current state:** The Forge (`app/forge/page.tsx` + `lib/colorMath.ts:53-87`) is
frontend-only, hex-only, wired to a hardcoded `MOCK_PAINTS_TO_ADD` array, using an RMS
(≈gamma-2.0) additive approximation. It has no access to `opacity_rating`/`transparency`
and there is no backend mix endpoint.

**Rules:**
1. Frontend RMS mixer may survive **only** as The Forge's instant preview. Anything that
   feeds detection, matching, or recipes must be a **backend** spectral mix (one mixing
   authority — core invariant 8).
2. Use **spectral.js (MIT)**. **Never** ship Mixbox (CC BY-NC) in production.
3. Planned integration order (approved roadmap): reflectance cache in the DB build →
   tinting strength from `opacity_rating` → replace `recipe_geometry.target_lab`'s
   geometric ±12 L* nudge with `spectral.mix(base, white|black, t)` (hook at
   recipe_geometry.py:209, keep `derive_partner` search unchanged) → mix-to-match on the
   `match_color` ΔE>30 `None` branch (color_engine.py:469-471; needs combinatorial search
   + cache).

## Step-by-step: making any colour-behaviour change

1. Load `skill.color-expert/SKILL.md` from the repo.
2. Open the live files; confirm the code still matches the pipeline map above. If not,
   update your mental model from the code and note the drift.
3. **Fixtures first.** Add golden cases for the exact colours in question to
   `python-api/tests/color_family_fixtures.json` (they are shared with
   `lib/__tests__/colorFamily.test.ts`). Run both suites; watch the new cases fail.
4. Make the change at the single canonical site (classifier → anchor build inputs;
   matching → `color_engine.py`; recipes → `recipe_geometry.py`/`recipe_builder.py`).
5. Rebuild anchors if touched (`build_color_anchors.py`) so `lib/colorAnchors.ts`
   regenerates — never hand-edit either anchors file.
6. Re-run: `pytest python-api/tests/test_color_classification.py`,
   `test_color_science.py`, frontend `colorFamily.test.ts`, and the 2,142-combo sweep.
7. For detection-stage changes (white balance, sampling, clustering), run the three
   harnesses and diff `report_*.json` before/after:
   `1_synthetic_sweep.py`, `2_distortion_robustness.py`, `3_clustering_sampling.py`.
8. Manual smoke: khaki/brass mini (Bug A), pale-pink mini (Bug B), magenta/gold trim
   (Bug C) through the live app — family AND overlay.

## Staged remediation plan (approved sequence)

- **Stage 0** — lock Bugs A/B/C as failing fixtures (no behaviour change). Highest leverage.
- **Stage 1** — Bug A + B via anchors/decision only (LCh weighting or exemplar curation).
  Lowest-risk high-impact; no code-path changes.
- **Stage 2** — Bug C overlay (`_clean_mask` min-area / raw-mask fallback). Pure
  visualisation; cannot affect classification.
- **Stage 3** — metric/target consistency (CIEDE2000 in `derive_partner`; `median_lab`
  into matcher; document/remove `achromatic_c`).
- **Stage 4** — white balance (linearise + Bradford) + saturation-aware specular reject.
  Gated behind the harnesses.
- **Stage 5** — spectral mixing track (order above), only after detection is solid.

Never merge stages, and never let a later stage start before the earlier stage's fixtures
are green on both sides.
