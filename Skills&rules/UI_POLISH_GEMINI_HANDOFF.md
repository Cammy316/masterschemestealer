# 1.0 UI POLISH HANDOFF — Round 2: Swatchle Inline Play · Home Feedback · Scan-Page Fit
*Execution prompt for Gemini. Self-contained: read top to bottom before writing code.
Four workstreams = four commits. Design decisions are LOCKED — do not re-open them.
This round fixes issues found in review of the previous UI overhaul, including two
bugs from that round (a modal under the nav; skipped micro-hints) — read the ground
rules twice.*

## 0. Non-negotiable ground rules (violations = rejected work)
1. **Before EVERY commit, all three must pass — no exceptions:**
   `USE_REAL_CV2=1 python -m pytest tests` (from `python-api/`, venv python), AND
   `npm test`, AND `npm run build` (from `schemestealer-react/`). Phase 2 and Phase 3
   both shipped build-breaking errors to production because this was skipped
   (`NameError: Optional`, missing `trackNotificationOptIn`). Never run
   `npm run build` while a dev server is running on the same checkout.
2. **British English** in every user-facing string, comment and commit message
   (initialise, stabilising, colour, centred, channelling).
3. **No new colour-space conversions in TypeScript.** Arithmetic over shipped data
   (`lib/paintDatabase.ts` lab/hex, `lib/deltaE.ts`, stored `deltaE` on guesses) is
   the ceiling. The loss-screen "closest guess" MUST reuse the `deltaE` already stored
   on each Guess object — do not import culori or recompute anything from hex.
4. **z-index tokens only** on floating UI: Tailwind has no `z-dropdown` utility — use
   arbitrary-value syntax `z-[var(--z-dropdown)]` (200) / `z-[var(--z-modal)]` (1000).
   Never raw `z-50`/`z-[100]` on overlays. Tokens live in `app/globals.css:68-71`.
5. **localStorage key `schemestealer-daily-augury` must appear character-for-character**
   in ModeSelector, DailyGameUI and the new Playwright seed — do not rename, namespace
   or "clean up" this key (players' streaks die if you do). The ONE new key permitted
   is `schemestealer-swatchle-help-seen` (first-visit help flag).
6. **Touch targets ≥44px** on every new interactive element (suggestion rows, badges,
   USE LOCAL AUSPEX) — apply `.touch-target` or explicit min-h/min-w. Inputs ≥16px
   font. Informational text ≥11px (this round RAISES many 8-10px strings).
7. Backend scope: ONLY the new `python-api/scripts/build_proof_schemes.py` (+ emitted
   JSON). Do not touch `python-api/core/*`.
8. Generated files are committed, never hand-edited. Commit per workstream on `main`.
   **Do not push.**
9. **Do not add `navigator.vibrate`** (unsupported on iOS Safari) — press feedback is
   scale-only.

## Why (context in one paragraph)
The new home tiles give zero press feedback on touch (hover-only styles — feels dead).
Swatchle's guess entry detours through a full-screen modal that also renders UNDER the
bottom nav (raw z-50 vs nav z-100). The completion card is ambushed 1.5s later by the
auto-opening Stats modal. The How-To-Play assumes too much. The backend warm-up pill
floats over the page title and sometimes never clears (4s fetch abort + per-mount
polling state means a slow-but-warm Render never satisfies it). The Miniscan idle card
overflows the fold by ~40px with nothing below it. The HowToScanModal is one generic
gold modal describing RESULTS interactions instead of scanning guidance, and the
in-frame micro-hints from the last handoff were never implemented.

---

## Workstream 1 — Swatchle: inline typing, completion card, idiot-proof help
*(Commit 1 — the biggest; isolate it)*

### 1.1 Shared search helper
New `lib/paintSearch.ts`: `export function searchPaints(query: string, limit = 8):
PaintData[]` — verbatim port of the filter in `components/daily/PaintSearchModal.tsx:20-28`
(matchable-only; lowercase space-split terms; every term must be a substring of
`brand + name + aliases` joined; slice to limit; empty query → `[]`).

### 1.2 Inline guess input (LOCKED design: type directly in the active row)
New `components/daily/InlineGuessInput.tsx`,
props `{ guessNumber: number; onSelect: (paint: PaintData) => void }`.
Rendered by DailyGameUI **in place of** the active-row button
(`DailyGameUI.tsx:246-259`), keyed `key={gameState.guesses.length}` so state resets
per guess. Inactive future rows stay as the current disabled placeholders.

Exact interaction script:
1. The row IS a real `<input>`: `h-14 w-full`, styled like the current active row
   (green border, `bg-[var(--cogitator-green)]/10`), **`text-base` (16px — iOS zoom
   guard, non-negotiable)**, placeholder `GUESS ${guessNumber} OF 6 — TYPE A PAINT
   NAME`, `autoComplete="off" spellCheck={false} enterKeyHint="go"`,
   `role="combobox"` + aria wiring. Wrapper div `relative` with `scroll-mt-4`.
2. **On focus:** after a ~300ms `setTimeout` (keyboard settle), call
   `wrapperRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })`; if
   `window.visualViewport` exists attach a **one-shot** `resize` listener re-running
   the same scroll (late keyboard animation), removed on blur. This pins the row near
   the viewport top so the dropdown always has room below.
3. Typing filters via `searchPaints(query, 8)` in `useMemo`; dropdown renders when
   `query.length > 0 && focused`.
4. **Dropdown:** `absolute top-full left-0 right-0 mt-1 z-[var(--z-dropdown)]` —
   always opens DOWNWARD (step 2 guarantees room; no flip logic). `max-h-[240px]
   overflow-y-auto`, `bg-[#0a0f0a]`, green border + shadow. Each option:
   `min-h-[44px]` touch-target, swatch dot + name (`text-base`) + brand
   (`text-[11px]` uppercase); highlighted state = green tint + left bar.
5. **Desktop keys:** ArrowDown/ArrowUp move highlight (clamped,
   `scrollIntoView({block:'nearest'})`), Enter selects highlighted (first result
   highlighted by default so type→Enter just works), Escape clears query and blurs.
6. **Mobile tap guard (CRITICAL):** option rows MUST call `e.preventDefault()` in
   `onMouseDown` and select in `onClick` — without this the input's blur unmounts the
   dropdown before the tap registers and taps silently do nothing.
7. **On select:** call `onSelect(paint)` then `inputRef.current?.blur()`. The row
   flips to a committed guess (existing rotateX animation). **The next row does NOT
   autofocus** (LOCKED: tap-to-continue — the keyboard drops so the player reads the
   clues; they tap the next row when ready).
8. Blur with no selection closes the dropdown but keeps the query (resume on
   re-focus). No results → single non-interactive "NO MATCHING PAINTS" row in the
   error style, ≥11px.

**Deletions:** `components/daily/PaintSearchModal.tsx` (verified: imported only by
DailyGameUI) plus DailyGameUI's `isSearchModalOpen` state (line 42), the import
(line 6) and the modal JSX (lines 446-453). This also removes the
modal-under-the-nav bug outright.

### 1.3 Board compaction (fits 360×740)
In `DailyGameUI.tsx`:
- Root (line 206): remove `min-h-dvh` (duplicate — `app/layout.tsx` main already has
  it); keep `flex flex-col`.
- Header `mb-8` → `mb-4`; title `text-4xl` → `text-3xl sm:text-4xl` (line 207-208).
- Target panel (229-236): once `guesses.length > 0`, switch to a compact horizontal
  layout — swatch `w-24 h-24` → `w-14 h-14` beside a single line "IDENTIFY THIS
  PAINT · Swatchle #N" + "X guesses left" (live count, British). Animate size/props
  on the existing elements — **no framer `layoutId`** (repo deliberately has none).
- Rows container `gap-3 mb-8` → `gap-2 mb-4` (line 239); remove the redundant `mb-2`
  on the guessed-row wrapper (line 289).

### 1.4 Completion card (LOCKED: card-first, no stats ambush)
- **Delete** `setTimeout(() => setShowStats(true), 1500)` (line 159). Stats open only
  via DOSSIER or the 📊 header button.
- New pure fn `formatTimeToMidnight(now: Date): string` in a new `lib/dailyStatus.ts`
  + hook `hooks/useTimeToMidnight.ts` (1s interval) — move the maths out of
  `StatsModal.tsx:24-45`; StatsModal consumes the hook too (single source).
- Card additions (inside the gold card, lines 344-419):
  - Streak line under the heading: `🔥 {streak}-day streak` (wins). On a loss, show
    the agency line instead: `CLOSEST ATTEMPT: {paint.name} — {proximityLabel(minDeltaE)}`
    using the minimum stored `deltaE` across guesses (rule 3: no recomputation), plus
    one flavour line ("Agonisingly close — return tomorrow." when HOT/WARM, neutral
    variant when COLD).
  - Countdown strip pinned at the card bottom: `NEXT SWATCHLE IN HH:MM:SS`, mono, ≥11px.
- **Win celebration (CSS/framer only, no deps):** stagger the card children
  (`variants` + `staggerChildren: 0.12`); colour-journey segments animate
  `scaleX 0→1` left-to-right (`delay: idx * 0.08`); heading enters with a spring
  `scale 0.8→1` plus a one-shot radial gold pulse div behind it (opacity 0.6→0,
  scale 1→1.6, ~0.8s, `pointer-events-none`).
- **Button hierarchy:** SHARE full-width primary (solid green, top); beneath it a
  two-up ghost row: DOSSIER (green ghost) + SCAN YOUR MINIATURE (gold ghost — convert
  the raw `<a href="/">` at line 411-416 to a Next `<Link>` for client-side nav).

### 1.5 How-To-Play: idiot-proof rewrite (`components/daily/HowToPlayModal.tsx`)
Keep the shell (scroll lock, z-token, 44px close — already correct). Replace the body
(lines 37-92) with:
1. Intro: "Guess the secret paint in six tries. Every guess must be a real paint —
   start typing in the empty row to search." *(references the NEW inline input)*
2. Numbered steps: ① "Look at the colour swatch at the top — that's the mystery
   paint." ② "Type a paint name into the empty row and pick it from the list."
   ③ "Use the clues after each guess to close in on the answer."
3. **One annotated example guess row** — a static mock reusing the real board cell
   styles, each part captioned:
   - Swatch bar: "Your guess on the left, the mystery paint on the right."
   - Family chip (promoted from italics): "green = same colour family, amber = a
     neighbouring family, red = far away."
   - Hue cell: "WARMER means the answer sits closer to red and orange than your
     guess; COOLER means closer to blue and green. A tick means the hue matches."
   - Lightness cell: "LIGHTER or DARKER — is the answer a lighter or darker shade?"
   - Heat bar: "How close your guess looks overall — the fuller and hotter the bar
     (COLD → WARM → HOT), the closer you are. The small arrow shows whether you're
     getting closer (▲) or further away (▼) than your previous guess. (For the
     curious: it's driven by the colour-difference score ΔE.)"
4. Footer: "A new Swatchle appears at midnight, local time." — raise to `text-[11px]`.
5. Fix "color family" → "colour family" (line 44-46); audit the file for American
   spellings.
6. **First-visit auto-open:** in DailyGameUI, if
   `localStorage.getItem('schemestealer-swatchle-help-seen')` is null, open the modal
   on mount and set the flag when it closes. This new key is the ONLY new key; the
   game key is untouched (rule 5).

### 1.6 Daily mobile fixes
- Share toast (line 438): `z-[100]` → `z-[var(--z-modal)]`; replace `bottom-24` with
  `style={{ bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 1rem)' }}`.
- Raise to `text-[11px]`: YOU/TARGET labels (293/297, from 8px), family chip (303,
  from 9px), all three clue cells (314/322/334-335, from 10px).
- **Achromatic share semantic** (`lib/colourClues.ts:58`): the board shows `—` but the
  share grid emits 🟩 (falsely claims a hue match). Split the branch: `achromatic` →
  ⬜, `match` keeps 🟩.

### 1.7 Workstream 1 tests
- Vitest `lib/__tests__/paintSearch.test.ts`: multi-term match, matchable=false
  exclusion, alias match, limit, empty query → [].
- Vitest: `formatTimeToMidnight` — 23:59:59 boundary, midday, zero-padding.
- `lib/__tests__/dailyGameUI.test.ts`: add achromatic case (share line starts ⬜);
  existing win/loss goldens updated only if the emoji change touches them.

## Workstream 2 — Home screen: press feedback, proof strip, played-today
*(Commit 2)*

### 2.1 Press feedback (the "dead buttons" fix)
`components/ModeSelector.tsx`: convert all three tiles to `motion.button` —
hero (line 91) `whileTap={{ scale: 0.98 }}` (SlabButton idiom,
`components/shared/SlabButton.tsx:24`); both half-cards (130, 153)
`whileTap={{ scale: 0.95 }}` (Navigation idiom). Keep every existing class and hover
style. `ScanMode` is `'miniature' | 'inspiration'` (`lib/types.ts:5`) — do NOT add
`setMode('daily')` to the Swatchle card; it will not typecheck.

### 2.2 RecipeProofStrip: extract, crossfade, real prices (LOCKED)
Extract lines 10-51 to new `components/shared/RecipeProofStrip.tsx`:
- **Crossfade:** `<AnimatePresence mode="wait">` + `motion.div key={scheme.id}`
  (opacity fade ~0.35s) inside a **fixed-height wrapper** — otherwise the hero button
  height pumps every 4 seconds (CLS).
- **Lookup:** module-level `Map` from `PAINT_DATABASE` (replace the O(n) `.find`s).
- **Prices:** delete the hardcoded `£11.35`/`£7.65` strings. Compute per scheme:
  sum `PAINT_PRICES[paint.brand]` (`lib/utils.ts:184`, with the same `|| 4.00`
  fallback used by the cart) across each palette. Render
  `CITADEL · £{x.toFixed(2)}` vs `BUDGET MATCH · £{y.toFixed(2)}` at `text-[11px]`
  (keep the gold glow on the budget side).
- **Rotation:** keep the 4s interval; pick a **random start index inside `useEffect`**
  (never `Math.random()` during render — hydration mismatch).

### 2.3 Proof pool: ≥30 official schemes (LOCKED — user asked for no visible repeats)
- New `python-api/scripts/build_proof_schemes.py`, following the
  `build_daily_puzzles.py` pattern (same paint-data loading, same paint_id space):
  the script contains a hand-authored list of **≥30 iconic schemes** (model label +
  exactly 3 Citadel paint_ids each — e.g. Ultramarines intercessor, Blood Angels,
  Death Guard, Ork flesh, Necron warrior, Stormcast, Night Lords, Imperial Fists,
  Sisters, Tyranid Leviathan, T'au Sept…). For each original paint it computes the
  **nearest non-Citadel paint by CIEDE2000** (existing Python implementation) as the
  budget palette. The script must **fail loudly if any listed paint_id is missing**
  from the database. Output overwrites
  `schemestealer-react/lib/data/proof_schemes.json` (same shape as today:
  `{ id, model, originalPalette: string[], budgetPalette: string[] }`).
- Commit the script AND the regenerated JSON (rule 8).
- **Vitest guard** `lib/__tests__/proofSchemes.test.ts`: ≥30 entries; every paint_id
  in both palettes exists in `PAINT_DATABASE`; budget palettes contain no Citadel
  paints; model labels non-empty and unique.

### 2.4 Swatchle card: played-today state restored
- New pure helper in `lib/dailyStatus.ts`:
  `hasPlayedToday(raw: string | null, todayStr: string): boolean` — port the logic
  from the orphaned `components/daily/DailyAuguryBanner.tsx:9-24`
  (`lastPlayedDate === todayStr && status !== 'playing'`, try/catch → false).
- ModeSelector: `useState(true)` default (prevents badge flash) + `useEffect` reading
  `localStorage.getItem('schemestealer-daily-augury')` with today via
  `new Date().toLocaleDateString('en-CA')`.
- States: **not played** → existing red LIVE pulse badge (raise `text-[9px]` →
  `text-[11px]`) + "Play Today's Puzzle"; **played** → static green `SOLVED ✓` badge
  (no pulse) + "View Your Result".
- **Delete** `components/daily/DailyAuguryBanner.tsx` (verified orphaned) and fix the
  stale comment in `app/page.tsx:12-13`.

### 2.5 First-viewport fit at 360×740 (mobile-base + `sm:` restore)
Root `py-8` → `py-5 sm:py-8`; header `mb-8` → `mb-5 sm:mb-8`; hero `min-h-[40vh]` →
`min-h-[min(38vh,300px)]`, `p-8` → `p-6 sm:p-8`; icon circle `mb-6` → `mb-4 sm:mb-6`;
"Initiate Auspex Protocol" `mb-8` → `mb-5 sm:mb-8`. Goal: header + full hero + the
top edge of both half-cards visible within 740px.

### 2.6 Text raises
Proof-strip labels (8px→11px), LIVE badge (9px→11px), the two half-card sublabels
("Immaterium Conduit" / "Play Today's Puzzle", 10px→11px).

### 2.7 Workstream 2 tests
Vitest `lib/__tests__/dailyStatus.test.ts`: played today, played yesterday,
`status:'playing'` today → false, null, malformed JSON. Plus the proofSchemes guard
(2.3).

## Workstream 3 — Scan pages: warm-up strip, viewport fit, themed help
*(Commit 3)*

### 3.1 Warm-up reliability (`hooks/useApiReady.ts`)
- Module-level `let sessionReady = false` + exported `markApiReady()`. Hook
  initialises `useState(sessionReady)` and **skips fetching entirely** when already
  true — once ready this session, every later mount is instantly ready (kills the
  "resets on every navigation" behaviour).
- `AbortSignal.timeout(4000)` → `8000` (a waking Render instance routinely exceeds
  4s TTFB, so the poll self-defeated).
- `hooks/useScan.ts`: in the **online** success branch (after `completeWith(...)`,
  ~line 108) call `markApiReady()` — a successful real scan is definitive proof.
  NOT in `fallbackToOffline`.
- The `/health` vs `/api/ready` keep-warm divergence is out of scope (backend).

### 3.2 Warm-up visual redesign
New `components/shared/WarmupStrip.tsx`, props
`{ theme: 'cogitator' | 'warp'; onUseLocal: () => void }`:
- **In-flow, not fixed** — rendered between the page header and the upload
  component/portal, `max-w-2xl mx-auto`. It physically cannot cover the title; no
  z-index needed.
- Slim single row (`py-2 px-3`, 1px themed border + tinted bg): rotating ⚙/◆ glyph,
  text "Machine Spirit waking (~60s)" / "Warp conduit stabilising (~60s)", and
  USE LOCAL AUSPEX right-aligned — raise to `text-[11px]` + `touch-target`.
- Mount/unmount inside `AnimatePresence` animating `height: 0 ↔ 'auto'` + opacity so
  the reflow is smooth.
- Both pages: delete the inline `apiWarmupBanner` blocks
  (`app/miniature/page.tsx:87-108`, `app/inspiration/page.tsx:73-94`) and render
  `<WarmupStrip theme={...} onUseLocal={() => setOfflineMode(true)} />` under the
  header, gated by the same `!apiReady && !isProcessing && !offlineMode`.

### 3.3 Miniscan idle-card compaction (`components/miniscan/CogitatorUpload.tsx`)
Mobile-base + `sm:` restore (desktop pixel-identical):

| Line | Current | Change to |
|---|---|---|
| 136 | skull wrapper `mb-6` | `mb-3 sm:mb-6` |
| 137 | ServoSkull `w-20 h-24` | `w-14 h-[4.2rem] sm:w-20 sm:h-24` |
| 112 | content `pt-6` | `pt-5 sm:pt-6` (keep clearance for the status plaque) |
| 143 | subtitle `mb-6` | `mb-3 sm:mb-6` |
| 148 | `space-y-3` | `space-y-2.5 sm:space-y-3` |
| 153, 183 | CTAs `py-4` | `py-3 sm:py-4` (still ≥44px with the 24px icon) |
| 205 | info line `mt-6` | `mt-3 sm:mt-6` |

(~90-110px saved → idle card + header fit `100dvh − nav` at 360×640.)
**Copy fixes:** line 141 `INITIALIZE` → `INITIALISE`; line 209 becomes the micro-hint
(two birds): `[ Good even light · neutral background · miniature centred ]`
(`text-[11px]`).

### 3.4 HowToScanModal: per-mode + themed (`components/shared/HowToScanModal.tsx`)
- Add prop `mode: 'miniature' | 'inspiration'`; derive a theme object internally —
  miniature: `--cogitator-green` accents; inspiration: `--warp-purple` /
  `--warp-purple-light`. Callers pass the mode
  (`app/miniature/page.tsx:239`, `app/inspiration/page.tsx:234`).
- z fix: `z-[100]` (line 20) → `z-[var(--z-modal)]`.
- **miniature — "HOW TO SCAN":** ① good, even light — daylight or a desk lamp, no
  harsh shadows ② plain, neutral background ③ avoid gloss glare — tilt the model or
  diffuse the light ④ fill the frame with the miniature. Then "WHAT YOU GET": the
  full paint recipe per colour with budget-brand matches.
- **inspiration — "CHANNELLING GUIDE"** (double-L): ① any image works — art, sunsets,
  screenshots, photographs ② the conduit extracts 5–8 dominant hues ③ each hue is
  matched to real paints across six brands ④ the whole image is read (no background
  removal) — crop to the region you love first.
- **Shared "AFTER THE SCAN" section** (both modes, bottom): the existing
  lock/brand/substitution tips (current lines 45-69) condensed to three one-liners —
  that content is useful but belongs after the scanning guidance, not instead of it.
- Footer (line 73) → `text-[11px]`.

### 3.5 WarpPortal micro-hint (skipped last round — must land)
`components/inspiration/WarpPortal.tsx`: caption below the portal button (after the
`</motion.button>`, inside the wrapper): "Any image works — art, sunsets, photos",
`text-[11px]`, warp-purple-light ~60% opacity, centred, hidden while
`isActive || hasUploaded` (same opacity-animation pattern as the centre text).

## Workstream 4 — Responsive spec + full verification
*(Commit 4 — `tests/responsive.spec.ts`)*

1. New seeded route `daily-complete`: `addInitScript` seeds EXACTLY the key
   `schemestealer-daily-augury` with a finished GameState (shape from
   `DailyGameUI.tsx:14-23`: 3 plausible guesses with `deltaE` values,
   `status:'won'`, `lastPlayedDate` computed as today `en-CA`) — screenshots the
   completion card at all 6 viewports.
2. New targeted test `daily-typing` at 360×740: focus the inline input, type "meph",
   assert ≥1 suggestion option is visible AND its bounding-box bottom ≤
   `innerHeight − 64` (proves the dropdown clears the nav).
3. Two first-viewport tests (separate `test()` blocks — do not destabilise the
   existing matrix): `/` at 360×740 — Swatchle half-card top edge within the
   viewport; `/miniature` at 360×640 — "UPLOAD FROM ARCHIVE" bottom edge ≤
   `innerHeight − 64`.
4. Re-run the FULL matrix (9 routes × 6 viewports); the blanket
   no-horizontal-scroll assertion is the regression gate. Fix fallout only.

## Order of work & commits
1. Commit 1 — Workstream 1 (Swatchle) + CHANGELOG.
2. Commit 2 — Workstream 2 (home) + CHANGELOG.
3. Commit 3 — Workstream 3 (scan pages) + CHANGELOG.
4. Commit 4 — Workstream 4 (responsive spec + matrix run) + CHANGELOG.
Every commit: the full rule-1 gates.

## Definition of done
- All suites green + `next build` clean at every commit.
- Manual on a phone-width window: play a full Swatchle round win AND loss using ONLY
  the inline input (type → tap suggestion → clue readable with keyboard dropped);
  copy both share formats; first-ever visit auto-opens How-To-Play once.
- Home: all three tiles visibly compress on press; proof strip crossfades with no
  height pump and shows different prices as schemes rotate; Swatchle badge flips to
  SOLVED ✓ after finishing the day's puzzle.
- Scan pages: warm-up strip sits under the header (never over the title) and
  disappears permanently once ready (including after navigating away and back);
  Miniscan idle screen fully visible without scrolling at 360×640; both [?] modals
  correctly themed per page.
- Greps: no swatch-source name anywhere; British English in all new copy
  (initialise/stabilising/colour/centred/channelling); no raw `z-50`/`z-[100]` on any
  new floating UI; no `navigator.vibrate`; no framer `layoutId`.

## Explicitly out of scope
The video factory / Engine A, monetisation, auth, keep-warm workflow changes, any
`python-api/core` engine logic, changing the 6-guess count, daily cadence, puzzle
generation or the curated answer pool.
