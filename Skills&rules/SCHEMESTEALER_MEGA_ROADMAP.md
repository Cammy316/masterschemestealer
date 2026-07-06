# SchemeStealer: The Mega Roadmap (12-18 Months)

*A synthesised master-plan, explicitly scoped for a solo developer. Updated 2026-07-06
after a full codebase audit (see `architecture.md` §9 for the findings register).*

---

## The Core Philosophy

The biggest untapped asset SchemeStealer has is the **1,312-paint measured ground-truth
database** (swatch-median LAB, six brands, CIEDE2000-matched). The next 12-18 months are
about leveraging that data to keep the app open at the painting desk (Retention),
monetising casual users without subscription fatigue (Revenue), and letting users build
the content moat for us (Growth). Every feature below should answer one question: *does
this distribute or monetise the measured data?* New compute is not the moat — the data is.

---

## State of the Union (2026-07-06 audit)

**What's genuinely strong right now:**
- Engine accuracy is measured and locked: synthetic-sweep hard-miss 9.4%, zero
  classifier disagreements between backend and offline frontend, clustering recovery 1.0.
  One classifier, one rgb→lab, golden parity fixtures on both sides, frozen harness
  baseline. This is a defensible core.
- The Forge (inventory HexGrid + spectral.js Kubelka–Munk mixing + requisition cart)
  **already shipped** — the old "Phase 2: build the Armoury" framing is out of date.
- `/convert/[slug]` programmatic SEO pages are live with structured data and OG images.
- Test culture is real: ~640 backend + ~616 frontend tests, Playwright E2E, CI parity gate.

**What's holding the strategy back (full detail in `architecture.md` §9):**
- **All monetisation is scaffolding.** No auth, no Stripe, no tokens; the premium gate is
  deliberately hidden; affiliate events exist with zero call sites; the only live money
  path is Ko-fi. Every revenue line below has Clerk + Stripe as a hard prerequisite.
- **Data collection can silently evaporate** (P0): Supabase secrets aren't in
  `render.yaml`; without them, ML/analytics writes land on Render's ephemeral disk and
  die on deploy. The accuracy flywheel (Wave 5) is running on sand until this is fixed.
- **The PWA manifest 404s** (P0) — the app literally cannot be installed, which
  contradicts the whole "daily desk companion" thesis.
- `/paints/[brand]/[slug]` SEO pages are a crawlable stub and missing from the sitemap —
  "Phase 1 SEO done" was only half true.
- Offline scans render a degraded legacy list instead of the recipe card.

---

## Phase 0 — Hardening Sprint (do first; days, not weeks)

Each item maps to an audit finding. Nothing here is speculative; it is repairing the
foundations the rest of the roadmap stands on.

| # | Item | Why it gates growth |
|---|------|---------------------|
| 0.1 | Set `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` on Render + log loudly (or fail `/health`) in file-fallback mode | Stops silent data loss; unblocks the accuracy flywheel |
| 0.2 | Ship `app/manifest.ts` (icons, theme colour, standalone display) | Installable PWA = desk companion becomes possible |
| 0.3 | Finish `/paints/[brand]/[slug]` pages; add them to `sitemap.ts` | Unlocks the long-tail SEO surface already generated |
| 0.4 | Wire `enhanceWithPaintRecipes` into the offline path (`useScan.ts`) | Offline users get the real recipe card, not the legacy list |
| 0.5 | Set `ANALYTICS_ADMIN_KEY` in prod | Closes world-readable metrics endpoints |
| 0.6 | Britishise SEO copy ("color" → "colour" on `/convert` + Forge label) | Brand-voice invariant on exactly the pages meant to rank |
| 0.7 | Add a proactive "USE LOCAL AUSPEX" skip during cold-start warm-up | Kills the worst first-run experience (120 s wait) |
| 0.8 | CI: run the full pytest + vitest suites, not just the parity fixture | Regressions currently only caught locally |
| 0.9 | Fix `healthCheck()` timeout + HTTPS-only `API_BASE_URL` fallback; basic security headers in `next.config.ts` | Robustness/security floor |

---

## 1. The Utility Loop (Daily Desk Companion)

*Goal: evolve from an occasional "lookup tool" to a persistent app that stays open during
3-hour painting sessions.*

### 1.1 The Armoury — COMPLETE THE LOOP (inventory shipped; intelligence missing)
* **Shipped:** inventory entry (HexGrid), custom mixes, requisition cart.
* **Missing (the actual keystone):** recipes do not yet re-rank against what you own.
  Build **inventory-aware substitutions**: *"You're missing Mephiston Red, but you own
  Vallejo Bloody Red (ΔE 2.1) — use that instead."* Plus a rapid client-side barcode
  scanner for bulk inventory entry.
* **Effort/Impact:** Medium / Massive. This converts the Forge from a toy into the reason
  the app stays installed.

### 1.2 Rack Gap Analysis (NEW — audit-driven)
* **The Concept:** compute how much of colour space the user's rack actually covers
  (nearest-owned-paint distance over the 1,312-paint cloud) and recommend the 3–5
  purchases that close the biggest gaps. *"Your 42 paints cover 61% of the gamut; adding
  these three lifts you to 78%."*
* **Why it wins:** it is the natural affiliate hook — "buy the missing kit" — and it is
  impossible to copy without measured LAB data.
* **Effort/Impact:** Low-Medium / High.

### 1.3 Session Forge (Interactive Recipe Runner)
* **The Concept:** a "Start Painting" mode that turns a recipe into a checklist with
  built-in dry-time timers (*Wash applied → 20 min timer starts*). PWA notifications when
  the model is ready for the next layer. Depends on Phase 0.2 (manifest).
* **Effort/Impact:** Low / High. Pure frontend state that drastically increases session length.

### 1.4 Wet Palette Oracle (Long-term)
* **The Concept:** snap a photo of a wet palette mid-session; the extraction pipeline
  identifies the puddles and tells you how to tweak them toward your target highlight.

---

## 2. Competition & Craft (NEW pillar — the Golden Demon wedge)

*Goal: own the high-end painter niche, where influence concentrates.*

### 2.1 NMM Ramp Forge (NEW)
* **The Concept:** non-metallic metal is the hardest, most prestigious technique in the
  hobby. Pick a metal target (gold/silver/bronze/steel); the engine derives a 5–6 step
  **matte** ramp in OKLCH (deep shadow → blazing specular) and matches each step to real
  paints across the six brands. Run the existing recipe geometry, just further and
  restricted to non-metallic pools.
* **Why it wins:** Golden Demon bait, endlessly shareable before/afters, and genuinely
  impossible without measured LAB. Nobody else can ship this honestly.
* **Effort/Impact:** Medium / Very High (prestige + marketing flywheel).

### 2.2 Contrast/Speedpaint Translator (NEW)
* **The Concept:** translate between one-coat paints (Citadel Contrast, Army Painter
  Speedpaint, Vallejo Xpress) and classic base→highlight→shade recipes, both directions.
  Requires flagging/measuring the one-coat ranges (data extension — honest cost).
* **Effort/Impact:** Medium (data collection dominates) / High — slap-chop is the
  fastest-growing painting style and nobody offers a rigorous translator.

### 2.3 Army Scheme Planner (NEW)
* **The Concept:** map one scheme across a whole army — troops/elites/vehicles get
  role-appropriate variations; output unit-by-unit recipe sheets with a printable/QR
  export for display boards and club nights.
* **Effort/Impact:** Medium / High. Also the natural bridge into UGC (§4).

---

## 3. Monetisation Evolution

*Goal: capture revenue from casual painters who hate subscriptions, while leveraging B2B
opportunities. **Hard prerequisite for 3.1–3.3: auth (Clerk) + payments (Stripe) — neither
exists yet.** The premium brand-gate in the recipe card is already built and documented;
it re-enables by dropping one filter.*

### 3.1 Auspex Token System (Pay-As-You-Go)
* **The Concept:** subscriptions alienate painters who hobby once a month. Base colour
  match stays free; sell "Auspex Charges" (e.g. 20 scans for £1.99) for full 4-step
  recipes. Pro (£3.99/mo) = unlimited.
* **Effort/Impact:** Low (once auth exists) / High. Captures the casual long tail.

### 3.2 Lifetime "Tech-Priest" Licence
* **The Concept:** £49.99 one-time for lifetime Pro, capped at the first 500 "Founders" —
  immediate cash flow without permanent server-cost exposure.

### 3.3 Smart Affiliates & B2B
* **Affiliates:** Rack Gap Analysis + inventory-aware recipes tell us exactly which paints
  a user is missing → one-tap "buy missing kit" via Element Games/Wayland. The analytics
  events (`affiliate_link_clicked`) already exist — they just need call sites and real URLs.
* **B2B API:** licence the conversion widget to challenger brands (Pro Acryl, AK) for
  their Shopify stores, proving their paints match Citadel with measured ΔE.

---

## 4. Community & UGC (The Self-Scaling Librarium)

*Goal: turn users into the marketing engine.*

### 4.1 "Guess the Recipe" Daily Challenge (NEW)
* **The Concept:** a daily Wordle-style puzzle — a zoomed swatch or mini crop; guess the
  paint with family/brand/ΔE-temperature feedback per guess; shareable spoiler-free score
  grid; local-storage streaks. Generated at build time from the paint DB — **no backend, no
  auth needed**, shippable early.
* **Why it wins:** daily-active habit + organic social sharing + doubles as the social
  content pillar (see `SOCIAL_MEDIA_CAMPAIGN.md`).
* **Effort/Impact:** Low / High.

### 4.2 The Public Librarium (User-Generated Recipes)
* **The Concept:** "Publish to Librarium" generates a public, SEO-indexed page
  (`/recipes/blood-angels-grimdark`). Thousands of organic landing pages from user content.
  Requires auth + moderation.

### 4.3 Recipe Kitbashing (Remixing)
* **The Concept:** browse public recipes, hit "Remix for my inventory" — automatic
  substitution to the closest paints the user owns (reuses the 1.1 substitution engine).

### 4.4 Swatch Exchange
* **The Concept:** users photograph their own painted test swatches to extend the
  measured database; moderated contributions earn Auspex tokens. Crowd-sources the moat.
  **Depends on Phase 0.1** — contributions must land in durable storage.

---

## Proposed Rollout Sequence (revised 2026-07-06)

| Phase | Focus | Key Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Hardening | Supabase persistence, PWA manifest, `/paints` pages + sitemap, offline recipe parity, admin key, full-suite CI | **NOT STARTED — do first** |
| **Phase 1** | SEO Foundation | `/convert` pages | Shipped; `/paints` completion moved to Phase 0 |
| **Phase 2** | Core Loop completion | Inventory-aware substitutions, barcode scanner, Rack Gap Analysis | Inventory/mix/cart shipped; intelligence missing |
| **Phase 3** | Early growth (no-auth) | "Guess the Recipe" daily, Session Forge timers, social launch (see campaign doc) | New |
| **Phase 4** | Monetisation | Clerk auth → Stripe → Auspex tokens + Founders licence → re-enable premium brands → real affiliate links | Blocked on auth |
| **Phase 5** | Craft prestige | NMM Ramp Forge, Contrast Translator, Army Scheme Planner | New |
| **Phase 6** | UGC scale | Public Librarium, Recipe Kitbashing, Swatch Exchange | Needs auth + Phase 0.1 |
| **Phase 7** | Advanced | Wet Palette Oracle, B2B API pilots | Long-term |

**Sequencing logic:** Phase 0 protects the data and the install path; Phase 2 makes the
app indispensable; Phase 3 builds an audience *before* the paywall exists (tokens sell
better to an audience that already loves the tool); Phases 4–6 convert that audience.
Engineering detail for the new items lives in `NEW_IDEAS_IMPLEMENTATION.md`.
