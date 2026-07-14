# 1.0 UI OVERHAUL HANDOFF — Swatchle · Home Screen · Scan Instructions
*Execution prompt for Gemini. Self-contained: read top to bottom before writing code.
Three workstreams (A: Swatchle redesign, B: home screen, C: instruction system) + a
docs rename. Design decisions are LOCKED — do not re-open them.*

## 0. Non-negotiable ground rules (violations = rejected work)
1. **Before EVERY commit, all three must pass — no exceptions:**
   `USE_REAL_CV2=1 python -m pytest tests` (from `python-api/`, venv python), AND
   `npm test`, AND `npm run build` (from `schemestealer-react/`). Phase 2 and Phase 3
   both shipped build-breaking errors to production because this was skipped
   (`NameError: Optional`, missing `trackNotificationOptIn`). Verify imports compile.
   Never run `npm run build` while a dev server is running on the same checkout.
2. **British English** in every user-facing string, comment and commit message.
3. **No new colour-space conversions in TypeScript.** Permitted: arithmetic over data
   already shipped (`lib/paintDatabase.ts` lab values, `lib/deltaE.ts`). The hue
   helper below is `atan2` over existing lab a/b — that is the ceiling.
4. **Do not touch** `python-api/core/*` engine logic. The only backend file in scope is
   `scripts/build_daily_puzzles.py` (+ its tests + regenerated JSON).
5. Generated files are committed, never hand-edited (`daily_puzzles.json` pattern).
6. Commit per workstream on `main`. **Do not push.**
7. Keep the localStorage key `schemestealer-daily-augury` (players' streaks survive).

## Why (one paragraph so the changes make sense)
Swatchle currently hides the target colour entirely — players guess blind from 1,312
paints and lose without agency (unwinnable ≠ viral). The board shows no actual colour.
The home screen has no value proposition and buries the primary CTA below two
equal-weight 60vh cards. The scan pages end in low-trust instruction boxes. All three
are fixed here.

---

## Workstream A — Swatchle "Swatch + Heat" redesign

### A1. Target swatch panel (new, `components/daily/DailyGameUI.tsx`)
During play (`status === 'playing'`), render a large target panel at the top: a big
swatch of `targetPaint.hex` (rounded-square, ~96px, themed frame), heading
"IDENTIFY THIS PAINT", subline "Swatchle #N · 6 guesses". No name/brand shown. The
completion screen's existing target reveal stays.

### A2. New guess-row layout (replaces the current 4-box grid)
Per committed guess:
- **Swatch pair**: two chips side by side — `[your paint | target]` (~28px each,
  labelled YOU/TARGET at 10px under, or a thin divider) — instant visual distance.
- **Name line**: paint name (truncate) + small family chip coloured by match
  (green exact / amber adjacent / red far — reuse existing `familyMatch`).
  **The BRAND cell is deleted entirely** (1-in-6 trivia, no deductive value).
- **Three clue cells**:
  1. **HUE** — "→ WARMER" / "← COOLER" / "✓ HUE" from a new helper
     `hueDirection(guessLab, targetLab)` in `lib/colourClues.ts`:
     hue angle `h = atan2(b, a)` for each; if either chroma
     (`hypot(a,b)`) < 8 → return `'achromatic'` (render greyed "—"); if shortest-arc
     |Δh| < 10° → `'match'`; else `'warmer'` when rotating the guess hue toward the
     target moves it closer to the warm pole (55°), `'cooler'` otherwise (handle
     wraparound via shortest signed arc).
  2. **LIGHT** — existing logic, relabelled "▲ LIGHTER" / "▼ DARKER" / "✓".
  3. **PROXIMITY** — a heat bar spanning remaining width:
     implement exactly `pct = 100 * Math.pow(Math.max(0, 1 - de / 40), 1.5)`;
     labels 🎯 (win), HOT (ΔE≤4), WARM (≤12), COLD (else); bar colour ramps
     red→amber→green; PLUS a trend chevron vs the previous guess's ΔE
     (▲ warmer / ▼ colder / — first guess).
Empty rows keep "TAP TO GUESS" → `PaintSearchModal` (unchanged).

### A3. Answer-pool curation (backend script)
- New committed `python-api/scripts/curated_pool.json`: ~300 recognisable paints —
  programmatically seed it with: all Citadel `category` base + layer paints, Vallejo
  Game Color mainline, Army Painter non-Speedpaint mainline, intersected with the
  existing eligibility filters (measured colour, not discontinued, chroma ≥ 12, no
  washes). Emit the chosen ids sorted; a human can prune later.
- `build_daily_puzzles.py`: answers drawn ONLY from the curated pool;
  `salt_version: 2`; regenerate `daily_puzzles.json` (400 days from today).
- `tests/test_daily_puzzles.py` additions: every answer ∈ curated pool; pool subset of
  eligibility; determinism + ≥180-day coverage guards stay green.
- Guess SEARCH still spans the full `PAINT_DATABASE` (only answers are curated).

### A4. Share redesign
- **Clipboard string**: header `Swatchle #N n/6 🔥streak` (loss: `X/6`), then per
  guess a 3-emoji row: hue (⬅️/➡️/🟩), light (🔼/🔽/🟩), heat (🧊 cold / 😐 warm /
  🔥 hot / 🎯 win), then `schemestealer.com/daily`.
- **Completion visual**: a **colour-journey strip** above the emoji grid — the guessed
  paints' actual hex chips in order flowing into the target chip (arrow or gradient
  join), sized to screenshot beautifully. Keep the glassmorphism card, SHARE / DOSSIER
  / SCAN YOUR MINIATURE actions.

### A5. Fixes + copy
- Day number: derive from `puzzleKey` (the fallback key), NOT `localDateStr`
  (`DailyGameUI.tsx:236,412` currently produce "#0" outside the window).
- Confirm both share denominators render `/6` at runtime.
- Rewrite `HowToPlayModal` for the new mechanics: 3 worked examples (hue cell, light
  cell, heat bar), one line on the family chip, "new Swatchle daily".

### A6. Workstream A tests (write alongside)
Vitest: `hueDirection` (warm/cool both rotations, wraparound across 0°, achromatic
guard, match band); proximity mapping (monotonic decreasing in ΔE, 0→100, ≥40→0);
day-number fallback (mock out-of-window date); share-string golden (win + loss).

## Workstream B — Home screen (`components/ModeSelector.tsx`)

Restructure to (first viewport complete at 360×740 — verify in the responsive spec):
1. Header: ⚙ SCHEMESTEALER ⚙ kept; the status pill becomes a small inline
   "● ACTIVE" chip beside the tagline (loses its own row).
2. **Value proposition block** (new, directly under the header):
   line 1 (tech-text, white): "Photograph your miniature → get the exact paint recipe."
   line 2 (dim): "1,312 measured paints · six brands · free."
3. **HERO Miniscan card** (~45vh max): skull + INITIATE SCAN + new
   **`RecipeProofStrip`** component: cycles 2–3 schemes every ~4 s (framer crossfade):
   `[detected swatch] → [base][shade][highlight][wash]` chips with real paint names,
   sourced from a new committed `lib/data/proof_schemes.json` (generate its 3 entries
   OFFLINE by running the real engine on three iconic colours and pasting the JSON —
   include the generation command in a comment; no runtime backend calls).
4. **Secondary row** — two compact half-cards side by side even on mobile:
   Inspiration ("Extract a palette from any image" — replace the warp-flavour body
   copy; keep CHANNEL WARP CTA) + Swatchle badge card (pulse-dot logic from
   `DailyAuguryBanner` folded in or reused).
5. RESUME ACTIVE SESSION banner stays, above the hero.
Preserve entrance animations; delete the 60vh dual-card block and
"SELECT YOUR PROTOCOL" footer line.

## Workstream C — Scan-page instruction system

1. Delete both guidance blocks: `app/miniature/page.tsx:235-268` ("OPERATIONAL
   GUIDANCE") and `app/inspiration/page.tsx:223-265` ("CHANNELING GUIDANCE").
2. New shared `components/shared/HowToScanModal.tsx` (prop `mode: 'miniature' |
   'inspiration'`, theme-aware like the existing theme token pattern; style it after
   `HowToPlayModal`; z-token `z-[var(--z-modal)]`, 90dvh scroll region, scroll lock,
   44px close — copy the StatsModal conventions):
   - miniature copy: good even light · neutral background · avoid gloss glare ·
     fill the frame with the model; then "WHAT YOU GET": one line + a tiny 4-chip
     recipe illustration (base/shade/highlight/wash).
   - inspiration copy: any image works (art, sunsets, photos) · 5–8 dominant hues
     extracted · paint recommendations for each · no background removal.
3. **[?] button** (44px, themed, like Swatchle's) in each scan page's header row.
4. **In-frame micro-hint** (single line, tech-text, dim, INSIDE the upload frame):
   CogitatorUpload → "Good light · neutral background";
   WarpPortal → "Any image works — art, sunsets, photos".

## Docs rename (same commit as A)
Rename "Daily Augury"/"The Daily Augury" → **Swatchle** in:
`Skills&rules/SOCIAL_MEDIA_CAMPAIGN.md` (pillar P1, calendar, X ritual),
`Skills&rules/LAUNCH_RUNBOOK.md`, `Skills&rules/VIDEO_AUTOMATION_PIPELINE.md`
(T1 = "Swatchle short"), `Skills&rules/SCHEMESTEALER_MEGA_ROADMAP.md` (§4.1).
In-app lore subtitle ("the daily cogno-meme paint") may stay.

## Order of work & commits
1. Commit 1 — Workstream A + docs rename (+ regenerated puzzles + tests).
2. Commit 2 — Workstream B (+ `proof_schemes.json`).
3. Commit 3 — Workstream C.
Each commit: full gates from rule 1 + a CHANGELOG entry in the established format.

## Definition of done
- All suites green + `next build` clean at every commit.
- `tests/responsive.spec.ts` updated for the new home structure and daily flow;
  re-run at minimum home/daily/miniature at 360, 390, 1440 — screenshots eyeballed on
  a phone-sized view.
- Manual: play a full Swatchle round (win AND loss paths), copy both share formats;
  home first-viewport complete at 360×740; both [?] modals in both themes.
- Greps: no swatch-source name anywhere; British English in new copy; no raw `z-50`
  on any new overlay (use the tokens).

## Explicitly out of scope
Engine A video export, the video factory, monetisation, auth, any backend beyond the
puzzle generator script, changing the game's 6-guess count or daily cadence.
