# Union-Median Representatives, Neutral Labels & Auspex Reveal v2

## Context

Post-deploy (1b67f84): pink capture perfect; chaplain much better but still wrong in two ways; pinkhorror's pink card matches grey paints. Plus a UX project: replace the v1.0 reveal overlay with a thematic paint-by-numbers experience (user chose: master numbered map + upgraded per-colour reveals, client-side mask compositing).

**Diagnosis (verified on the fixtures):**

1. **Pinkhorror "grey paints under pink"**: prod's Pink 42% card is `#bd99a0` (C≈13) matched at ΔE 15.5 — but the pre-dedup pinks are healthy (C 15–26). The ramp dedup **averages member medians** (coverage-weighted), producing a desaturated centroid that NO paint occupies — a lit-pink + shaded-pink average is nobody's base coat. This is the approximation F3 deferred, now demonstrably harmful.
2. **Chaplain Grey ×2 (should be "grey and black")**: photographed black armour genuinely centres at L≈31–37 (bounce light) — colorimetrically Grey; no pixel statistic alone makes it "Black". Two-part answer: (a) the union-median fix lands each card on its dominant band (darker than the average for dark surfaces); (b) **base-coat bias for dark neutrals** — a painter's base coat is the ramp's dark end; and (c) **qualified neutral labels** so two grey cards read "Dark Grey" / "Light Grey" instead of looking like a bug.

## Part 1 — Accuracy (P0)

### 1a. Union-median representative for merged clusters — `core/smart_color_system.py`
`_combine_clusters` recomputes `median_lab` from the **union of member pixels** instead of averaging member medians (rgb/hsv/chroma stay derived from it — F3 discipline). Plumbing: initial clusters additionally carry `local_indices` (positions into the filtered `pixels_lab`); merges concatenate them; `_combine_clusters(clusters, pixels_lab)` takes the array (both call sites are inside `extract_colors`, where it's in scope).
**Expected effect:** pinkhorror's merged pink card lands on the dominant bright-pink band (C≈20+) → real paint matches at ΔE ≈ 3–6; every merged card everywhere represents an actual paint band instead of an average.

### 1b. Base-coat bias for dark neutral clusters (evaluate after 1a on the fixtures)
For clusters with union-median L\* < 45 and OKLab chroma < ~0.05 (dark neutrals — photographed dark paint), the representative is the median of the **darker half** of member pixels (the base-coat band under the edge highlights). Acceptance is data-driven: the chaplain's dark card must yield dark recipe bases (Eshin/Abaddon-class, L ≤ ~25) while ultra/capturepink/pinkhorror stay unchanged. If 1a alone achieves it, skip 1b.

### 1c. Qualified neutral display labels — `core/schemestealer_engine.py` (+ scanner passthrough)
When the final result set contains ≥2 cards of the same neutral family, qualify the DISPLAY name by lightness: L\*<32 → "Dark Grey", 32–62 → "Grey", >62 → "Light Grey" (same pattern for multiple whites → "White"/"Off-White"). Canonical `family` (gating, wash mapping, ML logging vocab) is untouched — only the UI-facing label decorates. Chaplain then reads "Dark Grey" + "Light Grey" (or Black + Grey if 1b pushes the dark card across the floor).

### Tests
- Extend `test_real_scans.py`: pinkhorror test (pink card's best base-match ΔE < 8 and card chroma > 15); chaplain test gains "the two neutral cards carry distinct display labels".
- Unit: `_combine_clusters` union-median (two synthetic bands → representative inside the dominant band, not between bands).
- Full suite + harness ≥ baseline (unchanged classifier ⇒ expect identical).

## Part 2 — Auspex Reveal v2 (map + per-colour, client-side masks)

### Backend — ship masks, not composites
- `services/miniature_scanner.py`: per colour, replace the composited JPEG (`reticle`, via `_encode_reticle`/`VisualizationEngine.create_color_overlay`) with a **1-bit PNG alpha mask** (base64, ~1–4 KB at analysis resolution) from the existing `spatial_mask`; keep `position` (reticle point).
- Response gains alignment metadata `mask_frame`: the alpha-bbox crop rect (in the uploaded RGBA's coordinate space) + analysis size, so the client maps masks onto the image it already holds. Keep `VisualizationEngine.find_optimal_reticle_position` (positions still used); the compositing path and `_encode_reticle` are removed.
- Contract test: masks decode, dims match `mask_frame.size`, non-empty, positions inside frame; response payload measurably smaller than the JPEG-per-colour version.

### Frontend — one compositor, two modes — **MINISCAN ONLY**
The reveal experience is exclusive to the Miniscan tab (user decision: region overlays look messy on non-mini inspiration images). The Inspiration results page keeps its colour-orb presentation untouched; the backend can skip mask generation for inspiration scans entirely (payload win there too).

New `components/miniscan/AuspexReveal.tsx` (canvas-based, Imperial-green theme baked in — no theme prop needed):
- **Thematic integration** with the existing miniscan design language (reuse the idioms already shipped in `ActiveAuspexScan.tsx` and the results page): green phosphor palette (#00FF41-family), corner brackets, hex-code chatter labels (the random 4-hex seq codes ActiveAuspexScan already generates), "◆ TARGET LOCK ◆" typography matching the SCAN COMPLETE headers, scanline/CRT texture on the dimmed layer.
- **Mode "single"** (inside each `PaintRecipeCard`, replacing the static reticle JPEG): base photo dimmed + desaturated with scanline texture; the colour's region filled with its own hex at a pulsing alpha; glow rim from the mask (dilate-subtract drawImage passes); crosshair + corner brackets + auspex tag at `position`.
- **Mode "map"** — the **Tactical Readout** panel at the top of miniature results: all regions tinted with their colours (~45% alpha) + numbered auspex chips (1..N matching card order) at each colour's position; tapping a chip scrolls to its card (anchor ids). Auspex sweep animation on first render. Numbered chips double as colour-blind-safe identification (region identity never relies on hue alone).
- Pure mapping helpers (mask→canvas transform from `mask_frame`) extracted and unit-tested in vitest; canvas behaviour verified by hand on the four fixtures + prod.
- Wire-up: `app/miniature/results/page.tsx` only.

## Part 3 — FULL Animation & Rendering Performance Audit (mobile-first)

Audited per the frontend-design-audit framework (severity 0=catastrophe … 4=cosmetic; principles #1 status visibility, #13 accessibility, #14 perceptibility) + compositor-vs-main-thread performance discipline. Inventory: 23 CSS keyframe sets, **78 infinite Framer Motion animations** (FM animates on the main-thread rAF ticker — every one is per-frame JS style writes forever), 3 canvas/rAF loops, 7 animation `setInterval`s, 39 `backdrop-blur` + 30 `mix-blend` + 21 `blur()` surfaces.

### Findings (severity-ordered)

**S1 · Scan-line freeze** — `app/globals.css:706 @keyframes scan-line` animates `top` (LAYOUT → main-thread even as CSS; the code comment says "pure CSS to prevent freezing" — right instinct, wrong property). Scan stalls (imgly WASM + parsing the base64-JPEG response) freeze it mid-sweep. **Fix:** transform-only sweep (`translateY` over a full-height positioned track). Same fix for `energy-pulse` (`app/globals.css:754`, animates `height`, infinite).

**S1 · Portal particles fps-coupled** — `WarpPortal.tsx` rAF loop advances physics per FRAME (`time += 0.01`, `p.angle += p.speed`): 2× speed on the S25's 120 Hz display, wandering under throttle. **Fix:** delta-time normalisation (clamp dt ≤ 50 ms for tab-restore), honour `devicePixelRatio` (hardcoded ×2), pause via IntersectionObserver when offscreen.

**S1 · Forge ember restarts + GPU stack** — `ForgeBackground.tsx`: `Math.random()` in the render body regenerates all 25 ember configs on every re-render (the flare `setState` fires at 3 s and every 60–90 s) → embers teleport mid-flight. Plus: 55 individually-composited shadow+blend nodes, two 60–70 vw `blur(100–120px)` orbs, **full-screen SVG `feTurbulence numOctaves=4`**, color-dodge spotlight, and a `mousemove` listener that is dead weight on touch devices. **Fix:** `useMemo` ember configs; isolate the flare layer in its own component; migrate embers to ONE canvas layer (or CSS keyframes with pre-blurred gradient sprites — no box-shadow); replace turbulence with a tiny tiled pre-rendered noise PNG; drop the spotlight on touch; halve particle counts on small viewports.

**S2 · ScanReveal render storm** — `ScanReveal.tsx` bloom calls `setBloomProgress()` **per rAF frame for 1.5 s** (up to 120 React re-renders/s) exactly while the results page mounts its heaviest content. **Fix:** drive the bloom via a ref/canvas draw or a CSS transition; no per-frame setState.

**S2 · 150 JS-animated stars** — `CosmicBackground.tsx` (inspiration page): 150 star elements each running an infinite Framer animation (configs correctly memoised — good — but the ANIMATION is main-thread). The `starfield-twinkle`/`twinkle` CSS keyframes already exist. **Fix:** plain divs + CSS animation with per-star `animation-delay/duration` — zero JS, compositor-only.

**S2 · Home-page cog rotations** — `AdMechBackground.tsx`: 5+ infinite FM rotations (120–180 s durations) = perpetual main-thread writes for what `rotate-slow`/`rotate-reverse-medium` CSS keyframes (already defined!) do free. **Fix:** swap to the CSS classes.

**S3 · Systemic policy: 78 infinite FM animations** — ambient/infinite motion belongs in CSS (compositor); Framer Motion should be reserved for entrance/exit/interaction (where it excels). **Fix:** sweep the remaining infinite `repeat: Infinity` FM usages into CSS keyframe classes (the audit above covers the big clusters; the sweep catches stragglers in HexPalette, ColorPalette, ModeSelector, Navigation, KoFi etc.).

**S3 · Text-scramble setState storms** — `InventoryHexGrid.tsx` TextScramble (50 ms interval per hex label) + StatsOverlay, `miniature/results` DecryptionHeader (30 ms interval): each tick is a React re-render; several run concurrently on busy pages. **Fix:** mutate `textContent` via ref inside the interval (no setState), or CSS-only glitch effect.

**S3 · Paint-property keyframes** — `pulse-glow` (box-shadow/frame), `warp-vortex` (filter/frame), two `background-position` shimmers: repaint-per-frame on their elements. Acceptable on small elements; **fix opportunistically**: pre-blurred sprite + opacity for glow; `translateX` a gradient layer for shimmer.

**S4 · Reduced-motion coverage gap (#13)** — `useReducedMotion` honoured only in ForgeBackground + WarpPortal; CosmicBackground, AdMechBackground, ember/star/scan effects ignore it. **Fix:** a global `prefers-reduced-motion` CSS block disabling ambient keyframes + the hook in the remaining ambient components.

**S4 · Backdrop-blur density** — 39 usages; fine on fixed chrome, risky inside scrollable card lists on mobile. **Fix:** trace-verify; where cards stack, replace with semi-opaque solid fills.

### Strengths (keep)
Stable random memoisation via `useState(() => …)` initialisers (CosmicBackground); keyframes are 17/23 transform/opacity-clean; AnimatePresence page transitions; reduced-motion already respected in the two heaviest components; the scan-line author already knew main-thread freezing was the enemy.

### Fix batches & verification
- **Batch A (the three reported glitches + S1s):** scan-line + energy-pulse keyframes; WarpPortal delta-time/DPR/pause; ForgeBackground memo/isolate/canvas-embers/noise-PNG.
- **Batch B (render storms):** ScanReveal ref-driven bloom; text-scramble refs.
- **Batch C (CSS migration sweep):** stars, cogs, then the remaining infinite-FM stragglers; global reduced-motion block.
- **Verification:** DevTools performance traces (mobile CPU throttle 4×) before/after each batch — assertions: no animation frames on the main thread for ambient layers, no dropped-frame bursts on flare toggle/scan completion, scan line continuous through a real scan, portal speed identical at 60/120 Hz (frame-rate override), Forge scroll ≥ 55 fps throttled. Full `npm test` + `next build` after each batch; visual pass of every page (home, miniscan, results, inspiration, forge tabs).

## Order & Verification ("everything works afterwards")
0. Save the approved improvement-suggestions list to persistent memory (user request).
1. Part 1a → probe all four fixtures → 1b only if the chaplain dark card still needs it → 1c → tests → **full backend suite + harness ≥ baseline**.
2. Part 3 animation fixes (independent, low-risk, ships with the same deploy) → DevTools trace verification.
3. Part 2 backend (masks + contract test; inspiration path explicitly mask-free and its response verified unchanged) → frontend compositor + map → **`npm test` + `next build` clean** → manual visual pass on all four fixtures through the running app (`npm run dev` + local API), both tabs checked (miniature gets the new experience; inspiration renders exactly as before, portal/forge/scan animations smooth).
4. Commit, push (Render + Vercel deploy), re-scan all four photos in prod; verify payload size drop, animation smoothness on the S25, and that inspiration scans still work end-to-end.

## Suggested improvements (not in scope — pick any to green-light)

**Accuracy**
1. **Consume `swatch_spread` in the matcher**: high-spread paints (metallics/gradient swatches) get a small ranking penalty for base slots — their stored colour is less certain. The data is already in the DB, unconsumed.
2. **Primer anchoring**: let the user tag their primer (black/grey/white/zenithal) pre-scan; the engine anchors the dark end of every ramp accordingly — directly disambiguates the "photographed black armour reads grey" class.
3. **Multi-frame capture**: average 2–3 camera frames client-side before upload — cheap sensor-noise reduction that helps every downstream stat on phone photos.
4. **Fixture-driven QA loop**: every user-reported miss becomes a `real_scans` fixture + test (the chaplain/pink pipeline proved this catches what synthetics can't).
5. **Feedback → anchors**: colour-correction feedback now lands in Supabase (`ml_colours` fixed earlier); a periodic job could propose anchor adjustments from consistent corrections.

**UI/UX**
6. **Plain-language match quality**: the raw ΔE badges (a red "34.0" looks like an error code) become "Exact / Close / Nearest available" chips with the number on tap — painters don't speak ΔE.
7. **Tap-for-alternatives**: each recipe slot opens the top-3 alternatives with swatches (`match_top_n` already exists backend-side — pure UI affordance).
8. **Ramp strip on cards**: render base→shade→highlight as one continuous gradient strip (painters think in ramps; it also makes a bad partner instantly visible).
9. **Progressive reveal during scan**: stream the Tactical Readout as soon as masks arrive, regions materialising one by one — turns the cold-start wait into auspex theatre.
10. **Uncertainty styling**: cards with low classification margin (already computed) get a subtle "LOW SIGNAL" auspex tag instead of silently confident presentation.
