---
name: schemestealer-core
description: The project constitution for SchemeStealer (schemestealer.com) — a mobile-first web app that photographs Warhammer/tabletop miniatures, detects dominant colours, and generates deterministic base→highlight→shade→wash painting recipes from a measured swatch database. ALWAYS load this skill first for ANY task touching this repository (Cammy316/masterschemestealer) — code changes, prompt authoring, copy writing, data edits, planning, or review. It defines the standing invariants that must never be violated, the architecture map, working rules, and licensing constraints. Load before any other SchemeStealer skill.
---

# SchemeStealer — Project Constitution

## What this product is

SchemeStealer photographs a painted (or reference) miniature, detects its dominant
colours, classifies each into a colour family, matches paints across six brands
(**Citadel, Vallejo, Army Painter, AK 3rd Gen, Pro Acryl, Two Thin Coats** — Scale75 is
dropped), and derives a deterministic four-step recipe: **base → highlight → shade → wash**.
The competitive moat is a ground-truth database of **1,300+ physically photographed paint
swatches** with measured LAB values, matched by CIEDE2000 — the highest-value features
distribute or monetise this data, not new compute.

Two scan modes with distinct visual identities:
- **Miniscan** — scan a painted model. Theme: Imperial Mechanicus (green/brass).
- **Inspiration** — scan any reference image. Theme: Chaos Warp (purple/pink/teal).

**Business model:** freemium. Free tier = base match only. Pro (£3.99/month) = full 4-step
recipes, brand-swapping, inventory tracking. Plus affiliate links. Target £1,000–2,000+/month.
Solo developer (Cam).

## Standing invariants — NEVER violate these

Check every change against this list before writing it. If a proposed change breaks one,
stop and say so instead of implementing.

1. **One canonical classifier.** `classify_family()` in `python-api/core/color_engine.py`
   is the only family algorithm. The frontend `classifyFamily` in
   `lib/offlineColorDetection.ts` is a faithful port over the same `color_anchors.json`.
   Never add a second classifier, an HSV gate, or family logic anywhere else.
2. **One canonical rgb→lab path.** Backend: skimage `rgb2lab` (D65) via
   `colour_maths.rgb_to_lab`. Frontend: hard-coded matching coefficients in
   `colorConversion.ts` so results agree bit-for-bit. No divergent conversions, ever.
3. **DB-family parity between backend and frontend.** Enforced by shared golden fixtures
   (`python-api/tests/color_family_fixtures.json`, ~450 cases, imported by both
   `test_color_classification.py` and `lib/__tests__/colorFamily.test.ts`) plus a
   2,142-combination agreement sweep. Any anchor or classifier change must keep both green.
4. **Matcher contract preserved.** `PaintMatcher.match_color()` — family gate + ΔE≤30
   ceiling. Do not change its signature or semantics without an explicit approved plan.
5. **Shared recipe card component with a `mode` prop.** Changes apply to both Miniscan and
   Inspiration simultaneously. Never fork the card per mode.
6. **British English throughout** — all code comments, UI copy, docs, error messages,
   commit messages ("colour", "optimise", "licence" as a noun).
7. **Zero Stahly attribution.** The swatch reference creator must never be credited,
   named, or attributed anywhere in any output — code, comments, docs, UI, metadata.
8. **One mixing authority (backend).** Any colour mix that feeds detection, matching, or
   recipes must live in the Python backend. Frontend mixing (The Forge preview) is
   display-only and must never feed matching.
9. **No colour maths reimplemented in TypeScript for SEO/data work.** All ΔE computation
   for generated pages (`conversions.json`, `/paints/[brand]/[slug]`,
   `/convert/...`) reuses the existing Python engine at build time.

## Licensing constraints (hard)

- **spectral.js** (Ronald van Wijnen, MIT, npm v3.0.0) — approved for production. Default
  choice for Kubelka–Munk pigment mixing.
- **Mixbox** (Secret Weapons, CC BY-NC 4.0) — must **NOT** ship in production without a
  paid commercial licence. Private benchmark use only. If you see Mixbox in a production
  import path, flag it as a release blocker.
- Asset generation via nanobanana pro adds a small watermark; branding badges are used to
  cover it — do not remove the badges.

## Architecture map

```
Repo: Cammy316/masterschemestealer (monorepo)
├── schemestealer-react/       Next.js 15 + React + TypeScript + Tailwind + Zustand
│   │                          Deployed on Vercel (root dir = schemestealer-react/)
│   ├── app/                   App-router pages (incl. app/forge/ — The Forge mixer)
│   ├── lib/                   colour ports, paintDatabase.ts, offlineColorDetection.ts,
│   │                          deltaE.ts (CIEDE2000 port), colorConversion.ts, data/
│   └── lib/__tests__/         colorFamily.test.ts (parity fixtures)
├── python-api/                FastAPI backend, deployed on Render free tier
│   │                          (cold-start latency is accepted — never "fix" it with hacks)
│   ├── core/                  schemestealer_engine.py, smart_color_system.py,
│   │                          color_engine.py, recipe_geometry.py, photo_processor.py
│   ├── services/              miniature_scanner.py, inspiration_scanner.py, recipe_builder.py
│   ├── utils/helpers.py       white balance (Shades-of-Grey)
│   ├── color_anchors.json     classifier exemplars (built, not hand-edited at runtime)
│   ├── scripts/build_color_anchors.py  → also regenerates lib/colorAnchors.ts (parity)
│   ├── paints_measured.json   ground-truth DB
│   └── tests/ + 1_synthetic_sweep.py, 2_distortion_robustness.py, 3_clustering_sampling.py
├── skill.color-expert/        local colour-science skill — load before colour analysis
└── CLAUDE.md                  repo working rules (read it; it wins on conflicts)
```

## Working rules (how Cam operates)

1. **Prompts, not surprise code.** Cam reviews and approves prompts collaboratively, then
   executes via Claude Code. When asked for a plan or prompt, author the prompt — do not
   start editing files unless explicitly executing an approved prompt.
2. **Read-only diagnosis before implementation.** Analysis passes must not change code.
   Findings go to a named findings file (e.g. `COLOUR_ANALYSIS_FINDINGS.md`); separate
   implementation prompts follow after approval.
3. **Live files beat indexed snippets.** Conclusions drawn from search-index snippets have
   been wrong before. Always load the live file (with line numbers) before asserting what
   the code does, and cite `file:line` evidence for every claim.
4. **Consolidate prompts.** Fewer, larger, well-structured prompts over many small ones —
   the token/credit economy matters to a solo developer.
5. **Fixture-first changes.** For classifier/anchor work: add failing golden fixtures
   first, watch them fail, then change logic/anchors until green on BOTH Python and
   TypeScript sides.
6. **Concise, high-signal output.** No padding, no restating the question, no emoji.

## Step-by-step: starting any task in this repo

1. Read `CLAUDE.md` at the repo root.
2. Identify which invariants (above) the task could touch; list them.
3. Load the relevant sibling skill:
   - Colour detection/classification/matching/mixing → `schemestealer-colour-science`
   - UI, components, theme, copy → `schemestealer-frontend`
   - Paint DB, JSON data, SEO page generation → `schemestealer-data`
4. Open the live files involved; quote `file:line` before proposing changes.
5. If changing classifier/anchor/matching behaviour: write fixtures first (Working rule 5).
6. Run the relevant tests/harnesses before declaring done:
   - `pytest python-api/tests/test_color_classification.py`
   - frontend `colorFamily.test.ts`
   - harnesses `1_synthetic_sweep.py`, `2_distortion_robustness.py`,
     `3_clustering_sampling.py` for anything touching detection.
7. Final self-check: British English? No Stahly? No Mixbox in prod paths? Parity green?

## Roadmap context (so you don't build the wrong thing)

- Active: colour-accuracy overhaul (see colour-science skill for the staged plan).
- Wave 3: monetisation (Stripe, Pro gating). Wave 4: growth/SEO. Wave 5: accuracy flywheel
  (user swatch logger as a distributed measurement device).
- Planned: "Auspex Scans" token model; B2B conversion-chart licensing; Founders' lifetime
  licence; inventory-aware recipes; barcode scanning; interactive recipe runner with
  dry-time timers; Chromus mascot personality copy (blocked on asset generation).
