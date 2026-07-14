# PHASE 3 IMPLEMENTATION HANDOFF — The Daily Habit
*Execution prompt for Gemini. Self-contained: read this top to bottom before writing any
code. Scope: "The Daily Augury" (guess-the-paint daily game) + "Session Forge"
(whole-scan painting session runner). Nothing else.*

## 0. Non-negotiable ground rules (violations = rejected work)
1. **British English** in every user-facing string, comment, and commit message
   ("colour", "optimise").
2. **No colour maths reimplemented in TypeScript.** Allowed TS sources: the existing
   sanctioned ports `lib/deltaE.ts`, `lib/colorConversion.ts`, and data already in
   `lib/paintDatabase.ts`. Anything new that relates colours (e.g. family adjacency) is
   computed in Python at build time and shipped as data.
3. **Do not touch** `python-api/core/color_engine.py` matcher logic,
   `core/smart_color_system.py`, classifier anchors, or `PaintRecipeCard`'s brand/recipe
   rendering contract (you may ADD a button to the card).
4. **Generated files are committed, never hand-edited** (follow the pattern of
   `lib/paintDatabase.ts` / `conversions.json`).
5. **Before every commit**: `USE_REAL_CV2=1 python -m pytest tests` (from `python-api/`,
   venv python) AND `npm test` AND `npm run build` (from `schemestealer-react/`) must all
   pass. Check your imports compile — Phase 2 shipped a `NameError: Optional` to
   production because this step was skipped. Never run `npm run build` while a dev
   server is running on the same checkout.
6. Commit per workstream on `main`. **Do not push.**

## Decisions already made (do not re-open)
- Puzzle pool: exclude washes/shades/inks (`category`), near-neutrals (LAB chroma < 12),
  discontinued paints, and paints without measured swatch colour.
- Feedback shows ΔE **bands** (perfect/close/fair/distant — same vocabulary as the app),
  never raw ΔE numbers.
- Session model: **whole-scan** with parallel drying timers (not one linear recipe).
- Dry-time defaults by role — wash/shade 20 min, base 7, layer/highlight 4 — user
  adjustable (±5 min), overrides persisted.
- Notifications passive-first: on-screen + tab-title countdown always; "Alert me when
  dry" button triggers the permission prompt; never prompt on session start.
- Daily entry point: home-screen banner + pulse dot when unplayed; nav stays 4 tabs.
- Share: standard emoji grid, spoiler-free, day number + streak + URL.

## Workstream A — The Daily Augury

### A1. `python-api/scripts/build_daily_puzzles.py` (NEW)
- Read `python-api/paints_groundtruth.json` directly; apply the eligibility filter above.
- Deterministic selection: `seed = SHA256(date_iso + SALT)` (SALT = a fixed string
  constant); no repeat within a 60-day rolling window; generate 400 consecutive days
  starting today.
- Output `schemestealer-react/lib/data/daily_puzzles.json`:
  `{ "salt_version": 1, "familyAdjacency": {…}, "days": { "YYYY-MM-DD": { "answer": "<paint_id>" } } }`
  where `familyAdjacency` is exported from `core/recipe_geometry.FAMILY_ADJACENCY`
  (lowercase family → list of adjacent families).
- New `python-api/tests/test_daily_puzzles.py`: (a) generator run twice → identical
  output; (b) no repeats in any 60-day window; (c) every answer passes the eligibility
  filter; (d) **coverage guard: the committed JSON must extend ≥ 180 days beyond today**
  (this test is the expiry alarm — do not weaken it).

### A2. Frontend game (`app/daily/page.tsx` + `components/daily/`)
- `DailyGameUI.tsx`: 6 guesses; state in localStorage
  (`daily-augury`: today's guesses, streak, maxStreak, played, won, guessDistribution).
  Day key = player's local `YYYY-MM-DD`.
- Per-guess feedback row, four cells, computed from `paintDatabase.ts` entries + the
  puzzle file's adjacency map + `lib/deltaE.ts`:
  1. Brand ✓/✗;  2. Family exact ✓ / adjacent ◐ / far ✗;
  3. Lightness ✓ / ▲ "go lighter" / ▼ "go darker" (compare `lab[0]`);
  4. ΔE band chip (reuse the app's band thresholds/colours — grep `DeltaEBadge`).
- `GuessAutocomplete.tsx`: search bounded to `paintDatabase` (name + brand), keyboard
  navigable, invalid free text cannot be submitted.
- `StatsModal.tsx`: played, win %, guess distribution bars, current/max streak, and a
  live countdown to local midnight ("Next Augury in 07:41:12").
- Win/lose reveal: answer swatch + name + link to
  `/paints/[brand]/[slug]` ("Full dossier on this paint") + "Scan your own miniature"
  CTA → `/miniature`. This funnel is mandatory.
- Share button: emoji grid (one row per guess, the four cells as emoji), header
  `The Daily Augury #N  X/6  🔥streak`, plus `https://schemestealer.com/daily`;
  `navigator.share` with clipboard fallback + "Copied" toast.
- Theming: Miniscan cogitator-green (use existing tokens/utilities in `globals.css` —
  `.auspex-text`, `--cogitator-green`, `.gothic-frame`). Feature name in copy:
  **"The Daily Augury"**.
- Home banner: compact card on `app/page.tsx` under the mode selector; pulse dot when
  today unplayed (localStorage check, client-only, no layout shift).
- SEO: page metadata + a static OG image (asset or `opengraph-image.tsx` — copy the
  `/convert` pattern) that never reveals the answer; add `/daily` to `app/sitemap.ts`.
- Analytics via the existing consent-gated pipeline (`lib/analytics.ts` — follow the
  existing event-name union + tracker-function pattern): `daily_played`, `daily_won`
  (guess count), `daily_shared`, `daily_streak_continued`.

## Workstream B — Session Forge

### B1. Store slice (`lib/store.ts`, persisted via the existing `partialize`)
```ts
activeSession: {
  scanId: string; startedAt: string;
  colours: Array<{ colourIndex: number; brand: string;   // brand from the card's selector
    steps: Array<{ role: 'base'|'highlight'|'shade'|'wash'; paintName: string;
                   status: 'pending'|'painting'|'drying'|'done'; dryUntil?: number }> }>;
  dryTimeOverrides: Partial<Record<'base'|'highlight'|'shade'|'wash', number>>;
} | null
```
- All countdowns derive from `dryUntil` epochs recomputed on render/wake — never
  accumulate ticks (must survive reload and tab suspension by construction).
- Multiple steps may be `drying` at once. One active session; starting another asks to
  replace (confirm dialog).
- Vitest: reload-resilience (recompute from dryUntil), parallel timers, override
  persistence, replace-session flow. Mirror the style of `lib/__tests__/store.test.ts`
  (note: node env — stub `window` where browser APIs are involved, see the blob-URL
  tests there).

### B2. Runner UI (`components/session/SessionRunner.tsx`, `TimerControls.tsx`)
- Full-screen overlay; colours as collapsible groups (swatch + family name), steps with
  status controls: start painting → mark applied (starts dry timer for that role) → done.
- **"WHILE THAT DRIES…" banner**: when ≥1 timer runs, suggest the earliest actionable
  step in another colour. This parallel-batching hint is the core of the feature.
- `TimerControls`: mm:ss from `dryUntil`, ±5 min, role default shown and editable.
  Tab-title countdown while any timer runs (restore title on close). "Alert me when
  dry" → request Notification permission; fire via the service-worker registration
  (`navigator.serviceWorker.ready` → `showNotification`) when available (next-pwa is
  configured), falling back to `new Notification`. Themed copy ("The wash is curing…").
- Optional wake-lock toggle (`navigator.wakeLock`, feature-detect, release on close).
- Completion: "Battle Record" (elapsed time, steps completed) + share text + trigger the
  existing Ko-fi prompt component if present on results.
- Entry points: "START PAINTING" button on `PaintRecipeCard` (adds/joins session with
  that colour + currently selected brand); "Paint this scheme" button on
  `app/miniature/results/page.tsx` (whole scan).
- Analytics: `session_started`, `session_step_completed`, `session_completed` (duration
  minutes), `session_notification_optin`.

## Order of work & commits
1. Commit 1: A1 generator + pytest + committed JSON.
2. Commit 2: A2 game UI + funnel + banner + analytics + vitest.
3. Commit 3: B1 slice + tests.
4. Commit 4: B2 runner + entry points + analytics.
Each commit: full test gates from rule 5, CHANGELOG entry under
`## [Unreleased] - <date> (Phase 3 …)` following the existing format.

## Definition of done
- All new pytest + vitest green alongside the existing suites; `next build` clean.
- Playwright (add specs): complete a daily round and verify the clipboard share string;
  start a session, reload mid-timer, timer resumes correctly.
- Manual: unplayed pulse behaviour; notification opt-in; mobile layout at ~380 px;
  British English sweep of new copy.
- Update `Skills&rules/SCHEMESTEALER_MEGA_ROADMAP.md` Phase 3 row to "shipped" parts.

## Explicitly out of scope
Accounts/cloud streaks, puzzle archive, leaderboards, hard mode, monetisation hooks
(Phase 4), any backend endpoint (the daily game is fully static; Session Forge is pure
frontend state).
