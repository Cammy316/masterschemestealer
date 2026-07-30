# SchemeStealer Video Factory (Engine B)

Local, batch content factory. Turns the app's shipped data files into 9:16 short-form
MP4 masters + per-platform captions. **Not part of the deployed app** — Vercel builds
`schemestealer-react`, Render builds `python-api`; this dir builds nothing that ships.
Its source is version-controlled; its outputs (`out/`, `footage/`, `node_modules/`) are
git-ignored.

Built per `Skills&rules/VIDEO_AUTOMATION_PIPELINE.md` (Engine B) and
`Skills&rules/LAUNCH_RUNBOOK.md` (Steps 2–4).

## Setup

```bash
cd video-factory
npm install          # first run also downloads a Chrome Headless Shell for rendering
```

## Render

```bash
# T2 — Budget Swap (premium Citadel paint → cheapest visual twin)
npm run factory -- t2                       # auto-pick the biggest-saving clean match
npm run factory -- t2 --bait                # a ΔE 2.5–3.5 "heresy?" pair
npm run factory -- t2 --index 4             # the 5th-ranked candidate (variety)
npm run factory -- t2 --min-de 1.2 --max-de 1.9   # constrain the ΔE band
npm run factory -- t2 --paint citadel-mephiston-red   # a specific Citadel source

# T1 — Swatchle (guess the paint from its swatch)
npm run factory -- t1 --date 2026-07-14

# T3 — Scheme Proof (famous scheme: official palette → budget palette, price saving)
npm run factory -- t3                        # auto-pick the biggest-saving scheme
npm run factory -- t3 --index 4              # the 5th-ranked scheme
npm run factory -- t3 --scheme "Necron Warrior"

# BANK — render the whole launch bank in one process (one bundle, QA each)
npm run factory -- bank                      # defaults: 10× T1, 5× T2 clean, 3× T2 bait
npm run factory -- bank --t1-start 2026-07-14 --t1-count 10 --t2-clean 5 --t2-bait 3 --t3-count 4
#   → writes out/bank-summary.csv and gates: post nothing until all pass

# Preview ranked candidates (pick an --index from here)
npm run factory -- list-swaps --limit 20
npm run factory -- list-swaps --min-de 1.2 --max-de 1.9
npm run factory -- list-schemes --limit 30

# Re-run QA on an already-rendered clip
npm run factory -- qa out/augury-2026-07-14
```

Each render writes `out/<slug>/`:

```
master.mp4        1080×1920 H.264 master
tiktok.txt        per-platform hook / caption / hashtags (REWRITTEN, never identical)
reels.txt
shorts.txt
checklist.md      upload order, pin comment, notes (T1: hidden answer)
meta.json         composition + inputProps (lets `factory qa` re-run)
qa/               report.md, frame-first/last.png, loop-diff.png, beat strip, thumbnails, titles.txt
```

## QA gates (automated)

`factory qa` runs after every render and:

- pixel-diffs the **last frame vs the first** — the clip must loop (≥97% similar);
- checks the **hook lands ≤3 s** and every manifest beat sits inside the composition;
- emits a beat contact-strip, hook/reveal thumbnails and title variants.

**Bank rule (runbook Step 4): post nothing until all 25 clips pass QA.** Always watch on
your phone before posting — never judge a vertical video on a monitor.

## Preview interactively

```bash
npm run studio       # Remotion Studio with sample props (real renders use --date/--paint)
```

## Tests

```bash
npm test             # pure-selector intent tests (node:test)
```

## Non-negotiables (from the runbook / project invariants)

- **British English** in every on-screen string and caption.
- **Never name the swatch source.** Honest origin only: "1,312 measured paints".
- **Never doctor a ΔE** or a price delta. Numbers come straight from `conversions.json`.
- Data files are read **read-only** — the factory never writes into
  `schemestealer-react/lib/data/`.
- No AI-generated minis, no foreign-platform watermarks, no auto-posting.

## What each template reads

| Template | Source data |
|---|---|
| T1 Swatchle | `daily_puzzles.json` (date → answer) · `paints_groundtruth.json` (swatch + hints) |
| T2 Budget Swap | `conversions.json` (source + cross-brand matches) · factory-local `BRAND_PRICES` |
| T3 Scheme Proof | `proof_schemes.json` (official vs budget palette) · `BRAND_PRICES` |

Prices live in `src/data/prices.ts` — edit when brand RRPs move.
