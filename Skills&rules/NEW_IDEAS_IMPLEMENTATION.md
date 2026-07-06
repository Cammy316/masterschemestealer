# New Ideas — Engineering Execution Plan

*Companion to `SCHEMESTEALER_MEGA_ROADMAP.md` (revised 2026-07-06). Each section is a
self-contained build plan: data flow, component structure, backend maths, and the
invariants it must not break (see `schemestealer-core/SKILL.md`). Ordered by the revised
rollout sequence.*

**Global rules for every feature below**
- All colour maths lives in the Python backend or is generated from it at build time
  (invariants 8–9). No new ΔE implementations in TypeScript.
- The matcher contract (`PaintMatcher.match_color()`: family gate + ΔE≤30 ceiling) is
  never bypassed or re-gated — new behaviour is added as *post-ceiling scoring*, not gate
  changes (invariant 4).
- New endpoints: `async def`, Pydantic v2 request/response models, in-memory processing,
  slowapi rate limits, British English copy.
- Classifier/anchor-adjacent changes are fixture-first: add failing golden fixtures, watch
  them fail, then implement (working rule 5).

---

## 0. Phase 0 Hardening — exact targets

| Item | File(s) | Change |
|------|---------|--------|
| 0.1 Supabase persistence | Render dashboard; `render.yaml` (comment documenting the required secrets); `utils/supabase_client.py` | Set `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`. Add a startup log line `PERSISTENCE: supabase|EPHEMERAL FILES` and surface the mode in `/api/ready`'s JSON so the ops state is observable. |
| 0.2 PWA manifest | new `app/manifest.ts` | Name/short_name, `display: "standalone"`, theme `#0a0a0a`, icons (192/512 PNG in `public/icons/`). `layout.tsx:38` already points at `/manifest.json` — Next serves `app/manifest.ts` there automatically. |
| 0.3 `/paints` SEO pages | `app/paints/[brand]/[slug]/page.tsx`; `app/sitemap.ts` | Replace the "UI GENERATION PAUSED" stub with the same `SwatchCompare`/`DeltaEBadge` components `/convert` already uses; append the `/paints` URL set in `sitemap.ts` (params already exist via `generateStaticParams`). |
| 0.4 Offline recipe parity | `hooks/useScan.ts:137`; `lib/paintMatcher.ts` | Call `enhanceWithPaintRecipes` (exists, zero call sites) so offline results carry `paintRecipe` and render through `PaintRecipeCard`. Delete the stale "3,022-paint" comment at `paintMatcher.ts:228` while there. |
| 0.5 Admin key | Render dashboard; `utils/auth.py` | Set `ANALYTICS_ADMIN_KEY`; optionally flip `require_admin_key` to fail-closed in production (`RENDER` env var is present on Render). |
| 0.6 British English | `app/convert/[conversionSlug]/page.tsx` + `opengraph-image.tsx`; `components/forge/ForgeMixTab.tsx:397` | Prose only: "color" → "colour". Code identifiers stay American. |
| 0.7 Proactive offline skip | `hooks/useApiReady.ts` consumers (`app/miniature/page.tsx`, `app/inspiration/page.tsx`) | Render the existing "USE LOCAL AUSPEX" button inside the warm-up overlay (currently only in the `error.retryable` branch), wired to the same `fallbackToOffline`. |
| 0.8 Full-suite CI | `.github/workflows/color-classifier.yml` (or a new `tests.yml`) | Run `pytest tests` (with the headless cv2 mocks from `conftest.py`) + `npm test`. Note `jimp` is a declared dependency — CI must `npm ci`. |
| 0.9 Client robustness | `lib/apiClient.ts` | Add an 8 s `AbortController` to `healthCheck()`; make the no-env fallback `https`-only outside `localhost`; add `headers()` (HSTS, nosniff, frame-deny) to `next.config.ts`. |

Also open (from the audit, decide-then-fix): `tests/test_real_scans.py::
test_complex_neutral_display_labels` fails on current `main` (single Grey card, so neutral
subdivision never fires) — decide whether extraction or the assertion is wrong before
touching either.

---

## 1. Inventory-Aware Substitutions (completes The Armoury)

**Goal:** recipes re-rank to prefer paints the user owns; missing steps show the closest
owned substitute with an honest ΔE.

**Data flow**
```
Zustand store.inventory (paint_ids) ──┐
                                      ▼
POST /api/scan/{mode}  multipart + `inventory` field (JSON array of paint_ids, optional)
   └─ engine._build_recipes_with_ml_features(..., owned_ids: set[str])
        └─ PaintMatcher.match_color(...)  → ranked candidates (unchanged contract)
             └─ NEW post-ranking pass: annotate each candidate with owned=True/False;
                choose `recommended` = best candidate; `owned_alternative` = best owned
                candidate within OWNED_SUBSTITUTE_DELTA_E (suggest 6.0) of the target
   └─ response per step: { paint, deltaE, owned, ownedAlternative?: {paint, deltaE} }
```

**Backend**
- `main.py`: accept an optional `inventory` form field on both scan endpoints (JSON list,
  cap length ~500, validate ids against the DB, silently drop unknowns).
- `core/color_engine.py`: no gate changes. Add
  `annotate_ownership(candidates, owned_ids)` — pure post-processing over the already
  ranked list. The ΔE ceiling and family gate decide *eligibility*; ownership only decides
  *presentation order between eligible candidates*.
- Threshold as config: `config.Matching.OWNED_SUBSTITUTE_DELTA_E = 6.0` (visually "close"
  band already used by the ΔE badges).

**Frontend**
- `useScan.ts`: append `JSON.stringify(inventoryIds)` to the FormData when inventory is
  non-empty.
- `PaintRecipeCard.tsx`: per-step row gains an "OWNED" chip (already has owned/cart
  toggles) and, when `ownedAlternative` exists, a swap affordance:
  *"You own Bloody Red — ΔE 2.1 from Mephiston Red. Use it?"* Swapping is display-state
  only (Zustand), never re-queries.
- Offline path: mirror in `lib/paintMatcher.ts` as a re-sort of its existing results by
  `owned` flag — no new colour maths (ΔE values come from the existing generated data).

**Barcode scanner (bulk inventory entry)**
- Client-only: `BarcodeDetector` API where available, fallback `@zxing/browser` (MIT).
- New `components/forge/BarcodeCapture.tsx` inside the Inventory tab; maps EAN → paint via
  a `barcode` field to be added to `paints_groundtruth.json` **as data collection permits**
  (start with Citadel/Vallejo, the two with published EANs; unknown barcode → name search).
- DB schema addition is generated-file territory: extend the build scripts, never
  hand-edit (data skill rule).

**Tests:** pytest — ownership annotation never changes the candidate *set*, only labels;
substitute must obey the 6.0 threshold; unknown ids ignored. Vitest — store round-trip of
swapped steps; card renders chip/swap states.

---

## 2. Rack Gap Analysis

**Goal:** "your rack covers X% of colour space; buy these 3 to close the biggest gaps."

**Backend maths** (pure NumPy over the loaded DB — no new deps)
1. Represent the reachable gamut by the 1,216 opaque paints' OKLab points (washes
   excluded). Precompute once at startup next to the matcher's existing arrays.
2. Coverage: for every DB paint `p`, `covered(p) = min_{o ∈ owned} d_OKLab(p, o) ≤ R`
   with `R = 0.045` (just under the extraction merge threshold 0.055 — "a paint you could
   substitute without anyone noticing"). Coverage % = covered / total, weighted by family
   so 200 near-identical reds don't dominate.
3. Recommendations: greedy k-centre — repeatedly pick the *owned-candidate* paint that
   covers the most currently-uncovered points; return top N=5 with per-pick coverage
   delta. O(owned × 1,216) per iteration — microseconds at this scale; cache per inventory
   hash (LRU 128).

**Endpoint:** `POST /api/forge/rack-analysis`
`{ inventory: [paint_id], brands?: [brand_key] }` →
`{ coveragePct, byFamily: {...}, suggestions: [{paint, coverageGainPct, closesGapNear: family}] }`
Rate limit 20/min. `async def`, executor for the NumPy pass (it's trivial, but keep the
loop clean).

**Frontend:** panel in `ForgeInventoryTab` — a coverage meter + suggestion cards with
"add to requisition" (existing cart action). This is also where the **affiliate call
sites** finally go: suggestion cards emit `trackAffiliateLinkClicked` (event exists,
currently zero call sites) once real retailer URLs are configured.

**Tests:** empty inventory → 0% + top-5 = maximal-spread picks; full DB inventory → 100%
+ empty suggestions; determinism (greedy ties broken by paint_id).

---

## 3. "Guess the Recipe" Daily Challenge

**Goal:** Wordle-style daily habit with zero backend and zero auth.

**Build-time generation** (invariant 9 — Python computes, TS consumes)
- New `python-api/scripts/build_daily_puzzles.py`: deterministic
  `seed = SHA256(date + salt)` selects one eligible paint/day (opaque, non-neutral,
  distinct from the previous 60 days); emits `schemestealer-react/lib/data/daily_puzzles.json`
  — a year of `{dateISO, answerPaintId, decoyIds[5]}` — plus, per candidate guess, nothing:
  guess feedback is computed from the paint DB the client already ships.
- Feedback per guess (client, using **existing generated data only** — `lib/paintDatabase.ts`
  hex/lab/family and the generated ΔE bands): brand match ✓/✗, family match/adjacent/far,
  lightness warmer/cooler + lighter/darker arrows, and the badge band (perfect/close/fair/
  distant) from the *pre-computed* ΔE — computed via the existing `lib/deltaE.ts` port
  (already parity-locked; no new maths).

**Frontend**
- Route `app/daily/page.tsx`; components `DailySwatch` (the mystery colour, large),
  `GuessRow` (paint-name autocomplete over `paintDatabase`), `ResultGrid`
  (emoji share string, spoiler-free: 🟩🟨⬛ per attribute), streak in localStorage.
- Share via `navigator.share` with clipboard fallback. Add `/daily` to `sitemap.ts` and a
  static OG image ("Today's mystery paint").

**Tests:** puzzle file has no repeats within 60 days and only eligible paints; feedback
function golden-tested against a fixture of known guess/answer pairs.

---

## 4. NMM Ramp Forge

**Goal:** given a metal target, derive a 5–6 step **matte** ramp painters can follow for
non-metallic metal.

**Backend maths** (reuses `core/recipe_geometry.py` machinery — same OKLCH field)
1. Metal archetypes as OKLCH anchor ramps (curated constants, e.g. gold:
   L 0.25→0.95 with hue drifting brown→yellow→near-white, chroma peaking mid-ramp then
   collapsing at the specular; silver/steel: near-neutral with a cool cast; bronze: warm,
   lower peak L).
2. Sample K=5–6 targets along the archetype spline (denser near the specular end, where
   painters need the most help). This is `target_lab()` generalised from one ±ΔL step to a
   parametric curve — new function `nmm_ramp_targets(metal: str, k: int) -> list[Lab]` in
   `recipe_geometry.py`.
3. Match each target with the existing `PaintMatcher` **restricted to
   `metallic == False`** (the flag already exists on every paint) and the standard ΔE≤30
   ceiling; enforce strict L* monotonicity *across the returned sequence* (sort +
   reject-duplicate ladder — a sequence-level guard, not a matcher change).
4. Response includes per-step `role` copy ("shadow core", "mid tone", "edge light",
   "specular point") and the mix hint when adjacent steps are >12 ΔE apart ("glaze the
   transition 1:1").

**Endpoint:** `POST /api/forge/nmm-ramp`
`{ metal: "gold"|"silver"|"bronze"|"steel", brand?: brand_key, steps?: 5|6 }` →
`{ steps: [{targetHex, paint, deltaE, role}], brand }`. Rate limit 20/min.

**Frontend:** fourth Forge tab `NmmForgeTab` — metal selector (reuse brand-tab pattern
from `PaintRecipeCard`), vertical ramp of swatch rows (reuse the card's step-row visual
language), "add all to requisition". Before/after showcase imagery belongs to the
marketing plan, not the app.

**Tests:** every returned ramp strictly increases in L*; all steps non-metallic; gold ramp
hue stays in the warm band; empty-pool honesty (a brand with no dark warm paint returns a
shorter ramp + `gaps` field, never a metallic or cross-family filler).

---

## 5. Session Forge (Recipe Runner)

Pure frontend state — no backend work.

- `lib/store.ts`: new slice `activeSession: { scanId, steps: [{stepKey, status:
  'pending'|'painting'|'drying'|'done', dryUntil?: epochMs}] }`, persisted so a page
  reload mid-session resumes.
- `components/session/SessionRunner.tsx`: full-screen checklist launched from
  `PaintRecipeCard` ("START PAINTING"); per-step dry timers (wash 20 min default,
  configurable); `setTimeout` while foregrounded + Notification API (permission-gated)
  when installed as PWA (depends on 0.2). Timers recompute from `dryUntil` on wake —
  never accumulate drift.
- Copy in-theme: "Auspex indicates the wash is curing… 14:32 remaining."

**Tests:** store slice transitions; timer recomputation after simulated reload.

---

## 6. Contrast/Speedpaint Translator (data-gated — schedule honestly)

- **Blocker:** one-coat ranges (Citadel Contrast, AP Speedpaint, Vallejo Xpress) are not
  in the measured DB. Extend the DB via the existing generated pipeline with
  `one_coat: true` + measured over-white LAB (and ideally over-grey, giving a slope field
  for undercoat sensitivity). No hand-edited data.
- Translation A (one-coat → classic): the one-coat's over-white LAB is the *composite*
  result; find the classic base via the matcher, then derive highlight/shade with the
  existing geometry — i.e. it is a normal recipe build seeded from the measured composite.
- Translation B (classic → one-coat): nearest one-coat by CIEDE2000 to the recipe's
  mid-tone, plus honesty copy when the best ΔE is poor ("no one-coat reaches this — use
  the 3-step recipe").
- Ships as a mode toggle on the recipe card (invariant 5 — one card, no fork) and a
  `/convert`-style SEO surface (`/convert/contrast/...`), generated at build time by the
  Python engine like the existing conversions.

---

## 7. Army Scheme Planner (design sketch — build after 1–4)

- Input: a saved scan (or manual palette) + unit roles (infantry/elite/vehicle/character).
- Backend: one endpoint that, per role, re-weights the existing recipe derivation
  (vehicles: base+shade only at battle standard; characters: add the NMM ramp option).
  All existing machinery; the new logic is a role→depth mapping table in `config.py`.
- Output: printable sheet route (`app/scheme/[id]/print`) with QR linking back — static
  CSS print stylesheet, no new rendering tech.
- Becomes UGC-ready later: the printable page is the natural "Publish to Librarium" unit.

---

## Sequencing note

Build order within this document = roadmap order: **0 → 1 → 2 → 3 → 5 → 4 → 6 → 7.**
(Session Forge before NMM because it is a week of pure frontend with immediate retention
payoff; NMM Forge lands with the marketing push in `SOCIAL_MEDIA_CAMPAIGN.md`.)
Monetisation plumbing (Clerk → Stripe → tokens) is deliberately excluded here — it is a
separate, well-understood integration effort that should get its own approved plan once
Phase 3 traffic justifies it.
