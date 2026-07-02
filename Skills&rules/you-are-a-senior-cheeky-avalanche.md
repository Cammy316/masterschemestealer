# SchemeStealer Frontend Audit — Report & Fix Plan

## Context
Complete UI/UX + code-quality audit of `schemestealer-react/` (the Next.js frontend), performed with the `frontend-design-audit` skill methodology (15 usability principles, severity 0–4 mapped to Critical/High/Medium/Low). Explored via 3 parallel agents (app shell/routes, components/design-system/a11y, state/data/perf), then all high-severity claims verified directly against source. All 15 principles were assessed; findings below are the ones that survived verification.

**Stack reality:** Next **16.1.4** / React **19.2.3** / Tailwind **4** / Zustand 5 / framer-motion — CLAUDE.md says "Next.js 15" and "strict Tailwind utility classes only", both stale.

---

## Executive Summary

**Overall health: 6.5 / 10.** The app has unusually strong state hygiene (blob URL lifecycle, quota recovery, cold-start-aware error mapping, offline fallback) and a coherent, characterful visual identity with real loading/empty/error states. It is let down by systematic **keyboard/screen-reader inaccessibility** (zoom blocked, zero accessible modals, no `aria-current`, custom controls not keyboard-operable), **~1.1MB of static paint data in the `/forge` client bundle** (two overlapping databases), **missing route-level error/404/metadata infrastructure**, and a **duplicated design system** (dead `components/ui/` library + 175 inline styles).

**Top 5 priorities**
1. Accessibility floor: re-enable pinch-zoom, make the 3 modals real dialogs (Headless UI `Dialog` is already a dependency), keyboard support for custom controls.
2. `/forge` bundle: stop statically importing `paintDatabase.ts` (630KB) + `paints_groundtruth.json` (445KB); lazy-load one canonical dataset.
3. Route infrastructure: `error.tsx`, themed `not-found.tsx`, per-segment `layout.tsx` metadata for the client pages, OG tags, complete sitemap.
4. Design system consolidation: delete dead `components/ui/` pieces, one dropdown, one tooltip, migrate avoidable inline styles to the already-registered Tailwind tokens.
5. Cold-start UX: don't gate the entire scan pages behind `useApiReady` — let users pick/frame a photo while the backend warms.

Finding counts: **3 Critical · 8 High · 11 Medium · 6 Low**.

---

## Findings

### CRITICAL (severity 4 — users blocked / WCAG hard failures)

**C1. Pinch-zoom disabled app-wide** — `app/layout.tsx:16-17`
`viewport: { maximumScale: 1, userScalable: false }`. WCAG 2.1 AA 1.4.4 failure; low-vision users cannot zoom paint swatches/ΔE values — the core content of the app. *Fix: delete both lines.*

**C2. No modal in the app is an accessible dialog** — `FeedbackModal.tsx` (778 lines), `ShareModal.tsx`, `forge/AddPaintModal.tsx`
Verified by grep: zero `role="dialog"`, `aria-modal`, focus traps; only Escape handler in the codebase is `ui/DropdownMenu.tsx:67`. FeedbackModal **auto-opens 10s after results** — a screen-reader user gets silently hijacked; a keyboard user can't dismiss it with Esc and focus never moves into or returns from it. *Fix: wrap all three in Headless UI `<Dialog>` (already in package.json, currently unused) — gives focus trap, Esc, aria wiring for free.*

**C3. Custom controls not keyboard-operable** — FeedbackModal star rating & category "checkboxes" (styled divs, no native inputs; labels at :416/:432/:712 lack `htmlFor`), `shared/CustomDropdown.tsx` (no keyboard/Esc), `forge/InventoryHexGrid.tsx` (no keyboard nav, no list semantics, hover-only tooltips). Feedback submission and inventory management are mouse/touch-only. *Fix: native `<input type="checkbox/radio">` visually restyled; `htmlFor`/`id` pairs; roving tabindex or listbox pattern for dropdown.*

### HIGH (severity 3)

**H1. ~1.1MB static data in the `/forge` client chunk — two overlapping paint databases**
- `app/forge/page.tsx:17` statically imports `PAINT_DATABASE` (`lib/paintDatabase.ts`, 630KB generated TS)
- `lib/colorMath.ts:3` imports `paints_groundtruth.json` (445KB), pulled in by `forge/page.tsx:16`, `AddPaintModal.tsx:7-8`, `InventoryHexGrid.tsx:6`
Mobile users on the Forge tab download + parse ~1.1MB of JS-embedded data before interaction. (Good news: the 5MB `conversions.json` is server-only, and `offlineColorDetection.ts` correctly `await import()`s the DB.) *Fix: one canonical dataset, loaded via `await import()` on first need (pattern already exists in `offlineColorDetection.ts:191`), or fetched from `/public` + cached.*

**H2. No `error.tsx`, no `not-found.tsx`, no route `loading.tsx` anywhere in `app/`**
Bad `/convert/*` slugs render the unthemed default Next 404 (breaks the visual language completely); server-side render errors have no themed recovery. The client `ErrorBoundary` in `ClientProvider` only covers client render errors. *Fix: add root `error.tsx` + `not-found.tsx` in the gothic theme; `loading.tsx` for `/convert`.*

**H3. Entire scan pages gated behind backend warm-up** — `app/miniature/page.tsx:81-113` (and inspiration equivalent)
`if (!apiReady) return <warmup screen>` — during a Render cold start (~60s, stated on screen) the user can do nothing, not even choose a photo. Most will bounce. *Fix: render the upload UI immediately; disable only the submit/scan action until ready (or queue the scan), keep the machine-spirit warm-up as a status banner.*

**H4. SEO/metadata gaps on an SEO-driven app**
- `/miniature`, `/inspiration`, `/forge` + both results pages: no title/description (client pages can't export metadata — needs per-segment `layout.tsx`)
- Zero Open Graph / Twitter tags anywhere, including `/convert/*` (a share-driven programmatic SEO play with no share preview)
- `app/sitemap.ts` omits `/inspiration`, `/forge`, `/paints/*`
- `/paints/[brand]/[slug]` is a live stub ("UI GENERATION PAUSED") with no schema. *Fix: segment layouts with metadata; `openGraph`/`twitter` in `generateMetadata`; extend sitemap; finish or noindex the paints stub.*

**H5. Render-blocking Google Fonts CSS `@import`** — `app/globals.css:1`
4 families × ~16 weights via `@import url(...)` — blocks first paint on mobile, no font-display control from Next, invisible-text risk. *Fix: `next/font/google` in `layout.tsx` with CSS variables; drop unused weights.*

**H6. Light-gray body under a dark app** — `app/layout.tsx:27`
`<body className="... bg-gray-50">` behind `--void-black` pages → white flash on load/overscroll/keyboard-open on iOS. *Fix: `bg-[#050505]` (matches `themeColor`).*

**H7. Two parallel component libraries**
`components/ui/` (generic blue/white: Button, Card never imported; DropdownMenu/Tooltip/Skeleton barely) vs `components/shared/` (theme-aware, actually used). Two dropdowns, two tooltips with different behavior/a11y. *Fix: delete `ui/Button`, `ui/Card`; merge dropdown + tooltip implementations into one accessible version each.*

**H8. `/convert` reads + parses the 5MB `conversions.json` twice per page** — `app/convert/[conversionSlug]/page.tsx:31-33` and `:61-63`
Runs in both `generateMetadata` and the page for every one of the statically generated conversion routes → multiplied build time/memory. *Fix: module-level memoized loader (`let cache; function getConversions()`).*

### MEDIUM (severity 2)

**M1. 175 inline `style={{}}` / 165 hardcoded hex-rgb instances** — worst: `ModeSelector.tsx` (20+), `ErrorBoundary.tsx:79`, `CogitatorUpload.tsx:56`, `forge/page.tsx:250,332`. Dynamic paint hexes are legitimately inline; static gradients/borders/glows are not — tokens are already registered in `@theme` (globals.css:75-124) so utilities exist. Also directly contradicts CLAUDE.md's own rule.

**M2. `app/forge/page.tsx` is a 689-line mega-component** — 19 `useState` + Zustand, three tabs (Inventory/Mix/Requisition), affiliate config, dev fixtures, SVG art in one file. *Fix: extract `ForgeInventoryTab` / `ForgeMixTab` / `ForgeRequisitionTab`.*

**M3. Navigation active state is visual-only** — `Navigation.tsx:168-207`: no `aria-current="page"`, icon SVGs unlabeled; plus an **infinite animated `boxShadow`** on the active tab (:194-205) — paint-heavy property animating forever on every page, a real battery/jank cost on low-end phones. *Fix: `aria-current`, `aria-hidden` on icons, animate opacity of a pre-rendered shadow layer instead.*

**M4. Touch targets under 44px** — `InfoTooltip.tsx:34` (20px icon), `HexChip.tsx:25` copy button (~32px), `CustomDropdown.tsx:32` (`text-[10px] py-1.5`), RecipeHistory expander — despite `--min-touch-target: 44px` existing as a token. *Fix: padding wrappers / `touch-target` class.*

**M5. Focus styles defined but not applied** — `.focus-visible`/`.focus-visible-warp` exist (globals.css:796-804) but are used once (WarpPortal). SlabButton, GhostButton, NavLink, modal buttons have no visible focus indicator. *Fix: add `focus-visible:outline-*` utilities to the shared button components — fixes the whole app in 3 files.*

**M6. framer-motion does not respect `prefers-reduced-motion` by default** — no `<MotionConfig reducedMotion="user">` anywhere; the globals.css kill-switch only covers CSS animations, not JS-driven Motion values or the canvas particle loops (WarpPortal, ModeSelector beams). *Fix: `MotionConfig` in `ClientProvider` + a `useReducedMotion()` early-return in canvas components.*

**M7. Interruption stacking on results pages** — FeedbackModal auto-opens at 10s (`miniature/results/page.tsx:74-78`), Ko-Fi prompt 20% chance at 15s (:109-120). Both can fire ~5s apart while the user is reading their recipe — the app's single payoff moment. *Fix: one interruption max per session; trigger feedback on exit-intent/2nd visit instead of a timer.*

**M8. Analytics + ML logger collect without consent UI** — `lib/analytics.ts` (no consent layer, UA + path on every event), `lib/mlDataLogger.ts` (803 lines: behavioral signals, optional email in feedback). UK/EU users → GDPR/PECR exposure, and the two systems run parallel queues with separate flush loops. *Fix: minimal consent gate; unify the two queue implementations.*

**M9. Type-safety escape hatches in the color engine** — `lib/colorMath.ts:36` (`as unknown as`), `:42` (`as any`), `:109` (`@ts-ignore` on spectral.js), `AddPaintModal.tsx:17` (`as any[]`). The mixing math CLAUDE.md calls out for care is the least-typed code. *Fix: `spectral.d.ts` (a `types/spectral.d.ts` already exists — extend it), zod-or-manual validation at the JSON boundary.*

**M10. FeedbackModal labels not programmatically associated** — `<label>` blocks at :416, :432, :712, :725 have no `htmlFor` and don't wrap their controls.

**M11. Scan results not shareable/bookmarkable** — results live only in Zustand memory (+localStorage history without images); refresh survives via history fallback (good) but a shared link is impossible; ShareModal shares an artifact, not a URL. Acceptable for v1 — flag as roadmap, ties into H4.

### LOW (severity 1)

- **L1.** Dead code: `ui/Button.tsx`, `ui/Card.tsx` (never imported), `@headlessui/react` dep unused — delete or adopt (C2 adopts it).
- **L2.** Error/help text at `text-xs` (`miniature/page.tsx:212-215`, instruction list :256) — small for the 40-something wargamer demographic; bump to `text-sm`.
- **L3.** Decorative fake telemetry ("SIG: 98.2%" `miniature/page.tsx:135-138`) — charming, but it's static; harmless, leave or randomize.
- **L4.** CLAUDE.md drift: "Next.js 15", "strict Tailwind only", missing backend run command — update so future agents stop fighting the theming reality.
- **L5.** `(p: any)` / `(m: any)` in convert page maps (:19, :177) — type the JSON shape once.
- **L6.** No unit tests for hooks (`useScan`, `useApiReady`) or components; E2E covers the happy paths well.

---

## Strengths (do not change)

1. **Blob URL + storage lifecycle** (`lib/store.ts:11-15,74-99`, `hooks/useScan.ts`): revocation on replace/clear/unmount, quota-exceeded recovery, race-condition guards, slim persistence. Better than most production apps.
2. **Error recovery UX** (`lib/errorMessages.ts`, `miniature/page.tsx:193-240`): status-code-mapped errors with flavour + plain-language pairs, retry AND offline-fallback actions. Textbook Nielsen H9.
3. **Cold-start awareness**: `useApiReady` polling with backoff, 120s scan timeouts, honest "takes ~60 seconds" copy.
4. **Design tokens + theming** (`globals.css:4-124`, `theme.ts`): coherent two-theme system registered into Tailwind 4, `clamp()` responsive type, high-contrast media queries, `.sr-only`, reduced-motion CSS layer.
5. **Loading/empty states everywhere themed** (warm-up screens, "ARCHIVE EMPTY", skeletons) — no blank screens.
6. **E2E tests target real risks**: cold-start, back-button, button-mashing, cart flows.

---

## Fix Plan (if approved)

### Phase 1 — Quick wins (~1 day, no structural change)
1. `layout.tsx`: remove `maximumScale`/`userScalable` (C1); body → `bg-[#050505]` (H6).
2. Fonts → `next/font/google`, trim weights (H5).
3. `Navigation.tsx`: `aria-current="page"`, `aria-hidden` icons, replace boxShadow keyframe animation with opacity cross-fade (M3).
4. Focus-visible utilities on SlabButton/GhostButton/NavLink (M5).
5. Module-level cache for `conversions.json` in convert page (H8).
6. Root `not-found.tsx` + `error.tsx` in theme (H2).
7. Delete `ui/Button.tsx`, `ui/Card.tsx` (L1); fix `htmlFor` pairs in FeedbackModal (M10).
8. Sitemap: add missing routes (part of H4).
9. `<MotionConfig reducedMotion="user">` in ClientProvider (M6, part 1).
10. Update CLAUDE.md to match reality (L4).

### Phase 2 — Accessibility overhaul (~2-3 days)
1. Migrate FeedbackModal, ShareModal, AddPaintModal to Headless UI `Dialog` (C2).
2. Native inputs for star rating + checkboxes; keyboard support in CustomDropdown; keyboard/list semantics for InventoryHexGrid (C3).
3. Touch-target fixes: InfoTooltip, HexChip, CustomDropdown, RecipeHistory (M4).
4. `useReducedMotion()` early-returns in canvas components (M6, part 2).

### Phase 3 — Performance & structure (~3-4 days)
1. Consolidate to ONE paint dataset; dynamic-import it in forge components, mirroring `offlineColorDetection.ts:191` (H1).
2. Un-gate scan pages: upload UI available during warm-up, scan button disabled with status banner (H3).
3. Split `forge/page.tsx` into three tab components (M2).
4. Per-segment `layout.tsx` metadata + OG/Twitter tags incl. `/convert` og:image (H4).
5. Inline-style migration for the static-value offenders (ModeSelector, ErrorBoundary, CogitatorUpload, forge) (M1).
6. Type the spectral.js boundary; remove `as any` chain in colorMath (M9).

### Deferred / product decisions
- Consent banner for analytics/ML logging (M8) — needs a product call on copy/placement.
- Shareable result URLs (M11) — roadmap item, pairs with backend persistence.
- Interruption-stacking policy (M7) — recommend: feedback prompt only on 2nd completed scan, Ko-Fi only when feedback wasn't shown.

## Verification
- `npm run lint && npm run test` + `npx playwright test` after each phase (existing suites cover back-button, cart, cold-start regressions).
- Bundle: `npx next build` and compare `/forge` first-load JS before/after Phase 3.1 (expect ≈1MB drop).
- A11y: keyboard-only walkthrough of upload → results → feedback modal; axe DevTools pass on `/`, `/miniature/results`, `/forge`, one `/convert/*` page; verify pinch-zoom on a real phone.
- Visual: confirm no white flash on load, themed 404 at `/convert/garbage-slug`, warm-up banner allows file selection with backend stopped.
