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

## State of the Union (updated 2026-07-09 — everything below SHIPPED)

**Live in production:**
- **Phase 0 hardening complete and verified against prod** (2026-07-07): Supabase
  persistence confirmed (`/api/ready` → `"persistence": "supabase"`), admin endpoints
  fail closed with the key configured, CORS pinned to our origins, PWA manifest + icons
  serving, security headers live, offline scans render the real recipe card, full-suite
  CI, backend test suite fully green.
- **Phase 1 SEO complete**: `/convert` + `/paints` programmatic pages live with
  structured data and OG images, all in the sitemap.
- **Phase 2 core loop complete (except barcode — see Debt & Deferred)**:
  inventory-aware substitutions in scans, owned-alternative swaps on the recipe card,
  Rack Gap Analysis endpoint + Forge panel.
- **Phase 3 daily-habit complete**: The Daily Augury (`/daily`, 400-day puzzle file,
  streaks/stats/share) and the Session Forge (whole-scan sessions, parallel drying
  timers with global reconciliation, notifications, wake lock).
- **Mobile optimisation sprint complete** (2026-07-09): 52-finding responsive audit
  fixed across the whole UI; `tests/responsive.spec.ts` guards 9 routes × 6 viewports
  with screenshots; desktop results are two-column; Auspex Reveal redesigned (rail
  callouts, greyscale focus, themed backdrop) with its spatial contract locked by tests.
- Engine accuracy measured and locked: hard-miss 9.4%, zero cross-stack classifier
  disagreements, parity fixtures green, frozen harness baseline.

**What's still holding the strategy back:**
- **All monetisation remains scaffolding** — no auth, no Stripe, no tokens; Ko-fi is
  the only money path. Phase 4's hard prerequisite is unchanged: Clerk + Stripe.
- **Zero marketing has ever run.** Accounts exist on every platform with no posts —
  the growth sprint (see `SOCIAL_MEDIA_CAMPAIGN.md` v2) is now the critical path.

---

## Phase 0 — Hardening Sprint ✅ COMPLETE (2026-07-07, verified live)

Kept for the record; every row landed.

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

### 1.1 The Armoury ✅ SHIPPED (2026-07-08, except barcode)
* **Shipped:** inventory entry (HexGrid), custom mixes, requisition cart, and the
  keystone — **inventory-aware substitutions** ("you own Vallejo Bloody Red at ΔE 2.1 —
  use that instead") wired through scans and the recipe card's owned-swap chips.
* **Deferred:** the client-side barcode scanner (see Debt & Deferred — blocked on EAN
  data collection, not code).

### 1.2 Rack Gap Analysis ✅ SHIPPED (2026-07-08)
* **The Concept:** compute how much of colour space the user's rack actually covers
  (nearest-owned-paint distance over the 1,312-paint cloud) and recommend the 3–5
  purchases that close the biggest gaps. *"Your 42 paints cover 61% of the gamut; adding
  these three lifts you to 78%."*
* **Why it wins:** it is the natural affiliate hook — "buy the missing kit" — and it is
  impossible to copy without measured LAB data.
* **Effort/Impact:** Low-Medium / High.

### 1.3 Session Forge ✅ SHIPPED (2026-07-08/09)
* Whole-scan painting sessions with parallel drying timers (globally reconciled — a
  timer finishes even while you work another target), "while that dries" batching
  suggestions, notification opt-in via the service worker, wake-lock toggle, reload
  resume. Entry from every recipe card and the results page.

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

### 4.1 "The Daily Augury" ✅ SHIPPED (2026-07-08/09)
* Live at `/daily`: 400-day deterministic puzzle file, four-cell feedback grid
  (brand/family/lightness/ΔE band), streaks + stats + guess distribution, spoiler-free
  emoji share, win-screen funnel to the `/paints` dossier + scan CTA, home-screen entry
  banner in the first viewport. The flagship social content pillar.

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

## Rollout Sequence (revised 2026-07-09)

| Phase | Focus | Key Deliverables | Status |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Hardening | Supabase persistence, PWA, `/paints` + sitemap, offline parity, admin key, full-suite CI | ✅ **DONE — verified live 2026-07-07** |
| **Phase 1** | SEO Foundation | `/convert` + `/paints` programmatic pages | ✅ **DONE** |
| **Phase 2** | Core Loop | Inventory-aware substitutions, Rack Gap Analysis | ✅ **DONE** (barcode → Debt & Deferred) |
| **Phase 3** | Daily habit | Daily Augury, Session Forge, mobile-optimisation sprint | ✅ **DONE 2026-07-09** |
| **Phase 3.5** | The Broadcast Update | In-app scan-reveal **video export** (the marketing feature), Search Console submission, OG polish | **NEXT BUILD (~1 week)** — spec in `VIDEO_AUTOMATION_PIPELINE.md` |
| **Growth Sprint** | Marketing execution | 90-day from-zero social launch + automated video factory | **STARTS NOW, runs alongside** — `SOCIAL_MEDIA_CAMPAIGN.md` v2 |
| **Phase 4** | Monetisation | Clerk auth → Stripe → Auspex tokens + Founders licence → premium brands → real affiliate links | Next-but-one: start once socials show a returning audience |
| **Phase 5** | Craft prestige | NMM Ramp Forge, Contrast Translator, Army Scheme Planner | Queued (NMM Forge times with a Golden Demon season push) |
| **Phase 6** | UGC scale | Public Librarium, Recipe Kitbashing, Swatch Exchange | Needs Phase 4 auth |
| **Phase 7** | Advanced | Wet Palette Oracle, B2B API pilots | Long-term |

**Sequencing logic:** the product is ahead of its audience — every retention feature is
live and nobody knows the app exists. Phase 3.5 turns scans into shareable video (users
become the ad network) while the Growth Sprint runs the channels; Phase 4's paywall
waits for fans because tokens sell to fans, not strangers. **SEO:** no further SEO
build is needed — `/convert`, `/paints`, `/daily` and the sitemap cover the surface;
remaining work is Search Console monitoring and link-earning content, and the next real
SEO unlock is the Librarium's UGC pages in Phase 6.

---

## Debt & Deferred (called out, not forgotten)

| Item | Why deferred | Unblocks when |
| :--- | :--- | :--- |
| **Barcode scanner** (Phase 2.3) | Code is small (`BarcodeDetector` + zxing fallback); the real cost is sourcing EAN→paint_id data per brand | Start with Citadel/Vallejo published EANs; graceful name-search fallback already exists |
| Card-hover ↔ tactical-map focus sync | Stretch goal from the reveal redesign, skipped for scope | Any polish pass on the results page |
| PWA icons are generated placeholders | Awaiting real brand art | Cam supplies art (or a commissioned set) |
| Ingest rate limits spoofable via X-Forwarded-For; file-fallback blocking I/O | Largely moot with Supabase live; small prompt when touched next | Any backend hardening pass |
| Module-3 harness baseline stale (`region_recovery` 0.96 vs recorded 1.0) | Pre-dates the neutral fixes; the greens scene arguably tests against the deliberate ramp-merge design | Decide: re-freeze baseline or adjust the scene |
| `run_all_tests.ps1` is PowerShell-7-only | Em-dash encoding breaks PS 5.1's parser | One-line re-save as UTF-8-BOM |
| Next dev-overlay reports "1 Issue" in dev | Dev-only indicator, invisible in production; likely a hydration warning | Identify next time the dev server is open |
| Full details | — | `architecture.md` §9 register |

Engineering detail for future feature items lives in `NEW_IDEAS_IMPLEMENTATION.md`.
