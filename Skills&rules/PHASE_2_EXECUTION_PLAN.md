# Phase 2 Execution Plan — Complete the Core Loop

*The next build phase after Phase 0 (hardening — **done and verified live 2026-07-07**).
Phase 1 (SEO foundation) already shipped. This plan turns the roadmap's Phase 2 into
ordered, prompt-sized stages with acceptance criteria. Planning only — nothing here is
implemented yet. Companion docs: `SCHEMESTEALER_MEGA_ROADMAP.md` (strategy),
`NEW_IDEAS_IMPLEMENTATION.md` (per-feature technical designs — referenced, not repeated).*

---

## Why this phase, and what "done" means

The Forge already has inventory entry (HexGrid), custom mixes and a requisition cart —
but none of it feeds the product's core output. **Phase 2 makes the app know what you
own**: recipes prefer paints on your rack, missing steps show your closest owned
substitute with an honest ΔE, and the app can tell you which few purchases most expand
what you can paint. This is the retention keystone (the roadmap's "daily desk companion"
thesis) and the prerequisite for every monetisation idea in Phase 4 — affiliate kits and
"buy the missing paints" only work once the app knows the gap.

**Phase-2 exit criteria:** a user with a stocked inventory scans a miniature and sees
(1) owned paints marked and preferred in every recipe card, (2) an owned substitute
offered for any missing step within ΔE 6, (3) a Rack Gap panel scoring their collection's
coverage and naming the 3–5 best next purchases. All behind the existing free tier — no
auth, no payments in this phase.

---

## Stage 2.1 — Inventory-aware substitutions (the keystone)

**Design:** `NEW_IDEAS_IMPLEMENTATION.md` §1. Summary of the contract-safe approach:
- Scan endpoints accept an optional `inventory` form field (JSON list of `paint_id`s,
  validated against the DB, capped ~500, unknowns dropped).
- `PaintMatcher.match_color()` is **not** re-gated (invariant 4): a post-ranking
  annotation pass marks each candidate `owned` and picks `ownedAlternative` = best owned
  candidate within `config.Matching.OWNED_SUBSTITUTE_DELTA_E` (start 6.0 — the "close"
  badge band) of the recipe step's paint.
- Response per step gains `owned: bool` and optional `ownedAlternative: {paint, deltaE}`.
- Frontend: `useScan.ts` appends inventory ids from the Zustand store;
  `PaintRecipeCard` step rows get an OWNED chip and a swap affordance
  ("You own Bloody Red — ΔE 2.1 from Mephiston Red"); swapping is display state only.
- Offline path mirrors as a re-sort by `owned` over already-computed matches (no new
  colour maths in TS — invariant 9).

**Prompt boundary:** one backend prompt (field + annotation + tests), one frontend prompt
(store wiring + card UI + tests).

**Acceptance criteria**
- Ownership never changes the candidate *set* or order of non-owned results (unit test:
  same response ± inventory, modulo annotations).
- Substitute obeys the ΔE bound; unknown ids ignored; empty inventory = today's response
  byte-identical.
- Matcher-contract tests untouched and green; harness unchanged (matching itself is
  unmodified).
- E2E: scan capturepink with an inventory containing a near-match paint → OWNED chip and
  substitute copy render; playwright spec for the swap interaction.

**Effort:** ~2–3 sessions. **Risk:** low — additive scoring only.

---## Stage 2.2 — Rack Gap Analysis

**Design:** `NEW_IDEAS_IMPLEMENTATION.md` §2. Summary:
- Coverage = fraction of the 1,216 opaque-paint OKLab cloud within `R = 0.045` of an
  owned paint (family-weighted so near-duplicate reds don't dominate); suggestions via
  greedy k-centre over uncovered points; pure NumPy beside the matcher's existing
  precomputed arrays; LRU-cached per inventory hash.
- `POST /api/forge/rack-analysis` (Pydantic in/out, async, rate limit 20/min) →
  `{coveragePct, byFamily, suggestions: [{paint, coverageGainPct, closesGapNear}]}`.
- UI: a panel in `ForgeInventoryTab` — coverage meter + suggestion cards with
  "add to requisition" (existing cart action). This is also where
  `trackAffiliateLinkClicked` finally gets call sites — wired but pointing at the cart
  until real retailer URLs exist (Phase 4).

**Acceptance criteria**
- Deterministic (ties broken by `paint_id`); empty inventory → 0% + maximal-spread picks;
  full-DB inventory → 100% + no suggestions.
- Response under 150 ms warm (it's microseconds of NumPy — the bound is serialisation).
- Coverage number is explainable: the panel shows per-family bars, not just one opaque
  percentage.

**Effort:** ~2 sessions. **Risk:** low; the only judgement call is the coverage radius —
keep it a named config constant and tune against a handful of real racks.

---

## Stage 2.3 — Barcode scanner (bulk inventory entry)

**Design:** `NEW_IDEAS_IMPLEMENTATION.md` §1 (barcode subsection). Client-only:
`BarcodeDetector` API with `@zxing/browser` (MIT) fallback, a `BarcodeCapture` component
in the Inventory tab, EAN → `paint_id` via a new `barcode` field in the generated DB.

**Data prerequisite (the real work):** barcodes are not in `paints_groundtruth.json`.
Roll out by brand as data is sourced — Citadel and Vallejo first (published EANs),
unknown barcode falls back to the existing name-search-and-add flow so the feature
degrades gracefully from day one. DB schema changes go through the build scripts
(generated files are never hand-edited — data skill rule).

**Acceptance criteria**
- Scanning a known pot adds it to inventory in <2 s with a confirm toast; unknown
  barcode lands in name search pre-filtered by brand guess.
- Zero bundle-size impact for non-users (dynamic import, camera permission only on tap).

**Effort:** ~2 sessions code + ongoing data collection. **Risk:** medium — data
sourcing, and BarcodeDetector's uneven browser support (hence the zxing fallback).
Ship 2.1/2.2 first; this stage must not block them.

---

## Stage 2.4 — Loop polish + measurement (closes the phase)

- Wire the funnel: `inventory_size`, `substitution_shown/accepted`,
  `rack_analysis_viewed`, suggestion→cart conversions through the existing consent-gated
  analytics (events land in Supabase — persistence verified live).
- Results-page nudge for empty-inventory users ("Tell the Forge what you own — recipes
  adapt"), one-time, dismissible.
- Update `architecture.md` (§4 HTTP surface, §6 store/scan flow) and the roadmap table
  when the stages land.

**Acceptance criteria:** each 2.1–2.3 feature emits its events; a week of real usage can
answer "do substitutions increase recipe copies / cart adds?".

---

## Sequencing & discipline

**Order: 2.1 → 2.2 → 2.4, with 2.3 parallel-tracked behind its data.** Each stage is a
separate approved prompt (or two) with its own suite-green + harness-unchanged gate; the
matcher contract, classifier parity and Forge display-only invariants are restated in
each prompt. No auth, no payments, no premium unhiding in this phase — those are
Phase 4, and Phase 3 (Guess-the-Recipe daily, Session Forge timers, social launch per
`SOCIAL_MEDIA_CAMPAIGN.md`) should start as soon as 2.1 ships, since it shares no code
with Phase 2 and builds the audience the monetisation phase needs.

**Carry-over watch-list from Phase 0/1 (unblocked, low priority):**
- Replace placeholder PWA icons with real brand art (register item 26).
- Confirm the CORS preview regex against a real preview URL on the next PR deploy
  (item 21 note).
- Stale-baseline decision for module-3 clustering recovery (item 25).
- Spoofable ingest rate limits + blocking file-fallback I/O (items 4–5) — largely moot
  now Supabase persistence is confirmed live, but still worth a small prompt.
