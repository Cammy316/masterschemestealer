# SchemeStealer — Pre-Production Audit & Implementation Plan

> Consolidated readiness review folding together the earlier architecture/security audit
> (`audit-report.md`, `architecture.md`), the test results (`TESTING_MATRIX.md`), and a fresh
> deep pass on the **colour engine and surrounding code** (dead code, missed pathways, sense
> checks) requested after the latest git pull. Doc-only deliverable — no source changed.

---

## 0. Remediation status (implemented & verified)

All **CRITICAL, HIGH, and MEDIUM** items below have now been fixed in code. Verified green:
backend `pytest` **577 passed / 1 skipped** (`USE_REAL_CV2=1`), frontend `vitest` **460 passed**
+ `tsc --noEmit` clean, Playwright **5/5** (run serially — see note in §6).

| ID | Fix | Status |
|----|-----|--------|
| C-1 | Frontend `nearestFamily` now uses CIEDE2000 (mirrors backend); "deltaE76" labels corrected | ✅ — the 23 `colorFamily` failures are green |
| C-2 | Per-IP rate limit on all `/api/ml/*` + `/api/analytics/*` ingest POSTs; admin-key gate (`ANALYTICS_ADMIN_KEY`) on the stats GETs | ✅ |
| C-3 | Miniature endpoint rejects non-RGBA uploads with a clear 400 | ✅ |
| H-1 | Documented the `--forwarded-allow-ips` trade-off in `render.yaml` (config-level; full fix needs Render's egress CIDR) | ✅ doc |
| H-2 | Oversize uploads rejected from `Content-Length` *before* buffering | ✅ |
| H-3 | `python-api/data/` added to `.gitignore` (retention purge still recommended as ops follow-up) | ✅ |
| H-4 | Scan handlers map all PIL decode errors (`OSError`/`DecompressionBombError`) → 400 | ✅ — former strict-xfail now passes |
| M-1 | Routes no longer echo `str(e)` to clients | ✅ |
| M-2 | `/api/feedback` typed (Pydantic), rate-limited, comment no longer logged | ✅ |
| M-3 | Offline `findClosestPaint` enforces highlight>base / shade<base | ✅ — test un-skipped |
| M-4/M-5 | Removed the dead/misleading `ColorDetection` + `BOTTOM_ZONE_START` config constants | ✅ |
| M-6 | `IDEAL_DL` now single-sourced from `recipe_geometry` | ✅ |
| M-7 | The three duplicate `rgb→lab` helpers delegate to one `colour_maths.rgb_to_lab` | ✅ |
| M-8 | Removed the dropped `scale75` brand from the offline matcher + types | ✅ |
| M-9 | Concurrent scans bounded by a semaphore (`MAX_CONCURRENT_SCANS`, default 1) | ✅ |

| MED-A | Removed the unreachable `flesh`/`copper` family vocabulary after confirming **0 of 1312** DB paints use them (`RECOGNISED_FAMILIES`, `_NON_METALLIC_REMAP`, `FAMILY_ADJACENCY`, `WASH_BY_FAMILY`); kept `flesh` as a valid wash *archetype* | ✅ |
| MED-B | Unified the wash mapping to a single backend source: `scripts/build_wash_mapping.py` pre-resolves the backend wash ladder into the generated `lib/washMapping.ts`; the offline matcher now reads it (deleted the hand-coded map + fuzzy DB lookup) | ✅ |

**Code-health cleanups (done):** corrected the backend `deltaE76`→`ciede2000` labels
(`color_engine` docstring, `color_anchors.json`, `build_color_anchors.py`); removed dead
imports (`main.py` slowapi/typing; `color_engine` KMeans/ndimage/circular_mean_hue), the unused
`ColorAnalyzer.analyze_color_temperature`, and the unused `deltaE.ts` exports; dropped the
f-string-without-placeholder error details in the routes; fixed **L1** (`.source_cache/` now in
`.gitignore`) and **L2** (stale `rembg` docs in `README.md` + `miniature_scanner` docstring).

**⏸ TEMPORARILY HIDDEN — premium brands (remember this!).** AK, Pro Acryl and Two Thin Coats
are marked `isPremium` and filtered out of the PaintRecipeCard brand selector (`visibleBrands`
in `components/shared/PaintRecipeCard.tsx`) because the premium subscription isn't set up yet —
we don't surface paints the user can't unlock. **They are NOT removed from the DB** and the
backend still returns recipes for them; only the selector hides them. **Re-enable** by dropping
the `!b.isPremium` filter in `visibleBrands` once the premium flow ships (the premium-gating
overlay in the same file then becomes reachable again).

**Remaining / deferred:** LOW items L3 (EXIF strip), L4 (broad CORS), L5 (security headers),
L7 (a couple of avoidable inline styles), L8 (cold-start skip button), and the numeric tuning
(K-means k-steps, specular-filter floor) remain open per scope. DB-side RLS + anon-key for C-2
and a data-retention purge are ops/Supabase tasks outside this repo.

---

## 1. Executive summary & verdict

**Original verdict (pre-fix): NOT production-ready — 3 CRITICAL blockers.**
**Current verdict: CRITICAL/HIGH/MEDIUM remediated and test-verified.** Remaining before ship:
the deferred items above, LOW polish, and the ops tasks (Supabase RLS, a retention purge job,
Render memory monitoring).

The colour science itself is sound — single classifier *per side*, correct rgb→lab, a real
backend monotonicity guard, deterministic clustering. The blockers are integration-level: a
**metric mismatch that silently broke frontend↔backend classifier parity** (the 23 failing
tests), the **unauthenticated data-collection endpoints**, and a **miniature upload path that
500s** on a foreseeable input. None are deep design flaws; all are well-scoped fixes.

| Severity | Count | Examples |
|----------|-------|----------|
| CRITICAL | 3 | classifier metric drift; unauth DB writes; RGB-miniature 500 |
| HIGH | 4 | rate-limit bypass; pre-read OOM; PII in git; malformed-image 500 |
| MEDIUM | 9 | exception leaks; dead config; duplication/drift; offline monotonicity; scale75 remnant |
| LOW | ~14 | dead imports/methods; numeric step-discontinuities; misleading docs; styling |

---

## 2. What changed since the pull (and reconciliation with the prior audit)

Git timeline of the colour-relevant churn:

| Date | Commit | Effect |
|------|--------|--------|
| 06-26 | `2995453` Colour-family classifier overhaul | Introduced the LAB nearest-exemplar classifier + `color_anchors.json` + frontend `colorAnchors.ts`, declared metric `deltaE76`, "parity-locked". |
| 06-27 | `eb5df56` Fix Vercel build | Hand-edited `colorAnchors.ts` types (not a regen). |
| 06-28 | `741e7bd` audit fixes | Landed gamut validation, the **Zustand race guard**, Tailwind refactors. |
| 06-28 | `5475ff8` backend pipeline fixes | Changed `color_engine.py` — **`_nearest_family` now computes CIEDE2000** (the metric drift's origin). |
| 06-28 | `0e264d4` update legacy tests | Regenerated `color_family_fixtures.json` from the new CIEDE2000 backend → exposed the 23-case frontend gap. |

**Prior-audit items now addressed (verified):** the Zustand mode-switch race guard
(`lib/store.ts:50-58`, landed `741e7bd`, proven by `store.test.ts`); gamut validation
(existing K-means neon test). **Still open:** all C1/H1/H2/H3 and most M-items below.

---

## 3. Issue register

### [CRITICAL]

**C-1 — Classifier metric mismatch breaks the single-classifier invariant (NEW; root cause of the 23 test failures).**
Backend `_nearest_family` ranks anchors by **CIEDE2000**
(`python-api/core/color_engine.py:207-213`); the frontend port `nearestFamily` ranks by
**squared-Euclidean ΔE76** (`schemestealer-react/lib/offlineColorDetection.ts:43-53`). The
anchor data is byte-identical, but the two metrics pick different nearest exemplars on ~23
brown↔yellow boundary colours (e.g. `#7C6A42` → backend `brown`, frontend `yellow`).
Compounding it, both the backend docstring (`color_engine.py:230`) and `color_anchors.json`
(`"metric": "deltaE76"`) **wrongly claim ΔE76**, which is what misled the port.
*Impact:* offline (in-browser) scans assign different paint families than the backend for
boundary colours — a correctness defect that violates the project's #1 invariant.
*Fix (decided): align the frontend to CIEDE2000* — see §6.

**C-2 — Unauthenticated writes to the production database (carried, still open).**
All `/api/ml/*` and `/api/analytics/*` POSTs have no auth and no rate limit
(`routes/ml_data.py:531-612`, `routes/analytics.py:250-259`) and persist via the Supabase
**service-role** key (`utils/supabase_client.py:16`, bypasses RLS). Anyone can poison the ML
training set, forge analytics, or flood the DB/disk.
*Fix:* shared-secret/auth header + rate limit on these routes; RLS + anon key DB-side.

**C-3 — Miniature upload crashes on a non-RGBA image (confirmed; was audit M3).**
`schemestealer_engine.analyze_miniature` requires `precomputed_rgba` for `mode="mini"` and
raises otherwise (`core/schemestealer_engine.py:161-163`); the RGB branch in
`services/miniature_scanner.py:89-99` passes none → `ValueError` → generic **500**. The happy
path always sends RGBA, so it's masked, but any RGB miniature (direct API call, or a
client-side removal failure that still uploads) 500s.
*Fix:* reject non-RGBA miniature uploads with a clear 400, or delete the dead RGB branch.

### [HIGH]

**H-1 — Rate-limit bypass.** `render.yaml:7` `--forwarded-allow-ips="*"` makes uvicorn trust
any `X-Forwarded-For`; slowapi keys the `10/min` limit on it (`main.py:105`) → trivially
spoofable. *Fix:* restrict trusted proxies / derive the key from the real edge IP.

**H-2 — Upload size checked after full buffering.** `await file.read()` (`main.py:204,250`)
loads the whole body before the 10 MB check → OOM vector on the single 512 MB worker. *Fix:*
reject on `Content-Length` / read in bounded chunks before buffering.

**H-3 — PII written to a non-git-ignored dir, no retention.** `python-api/data/ml/feedback/*`
(email + free-text) and `data/analytics/events_*.csv` (session/user-agent) are untracked but
**not** in `.gitignore`. *Fix:* git-ignore `python-api/data/`; add a retention purge; validate
the email field.

**H-4 — Malformed-but-signed image returns 500 (NEW, from tests; "T1").** A payload with a
valid PNG signature but bad chunks raises `OSError`; the scan handlers only map
`UnidentifiedImageError` to 400, so it leaks a 500 (`main.py` scan handlers). Pinned by
`test_api_security.py::test_truncated_signed_png_should_be_400_not_500` (strict xfail). *Fix:*
catch `OSError`/`Image.DecompressionBombError` → 400.

### [MEDIUM]

| ID | Issue | Where | Fix |
|----|-------|-------|-----|
| M-1 | Internal exception text leaked to clients (`detail=f"...{str(e)}"`) | `routes/ml_data.py`, `routes/analytics.py` | Generic client message; log detail server-side |
| M-2 | `/api/feedback` logs an arbitrary PII dict; untyped; unthrottled | `main.py:282-289` | Pydantic model; drop body from log; rate limit (or remove — duplicates `/api/ml/log-feedback`) |
| M-3 | Offline recipe lacks the backend monotonicity guard | `paintMatcher.ts:295-321` vs `recipe_geometry.py:261-262` | Mirror `_monotonic_ok` in `findClosestPaint`, or label offline recipes advisory |
| M-4 | Dead config constants masquerading as the source of truth | `config.py:23-28`, `:74` (`N_CLUSTERS`, `DETAIL_SATURATION_MIN`, `METALLIC_BRIGHTNESS_STD`, `METALLIC_SATURATION_MAX`, `BOTTOM_ZONE_START`) | Wire them up **or** delete; don't leave both |
| M-5 | Config↔code threshold drift | detail coverage `config.py:21-22` vs `smart_color_system.py:155-191`; metallic `config.py:27-28` vs hardcoded `color_engine.py:156-169` | Single source for each threshold |
| M-6 | `IDEAL_DL` defined twice | `recipe_geometry.py:26-27` vs `recipe_graph.py:25` | Import from one module |
| M-7 | rgb→lab reimplemented ~7× | color_engine, schemestealer_engine, recipe_builder, both scanners | Centralise in `colour_maths.py` |
| M-8 | `scale75` remnant — dropped brand still flows offline | `paintMatcher.ts:11-15,77-95,126-140` | Remove; offline should match the 3-brand online set |
| M-9 | Single worker + 512 MB → OOM under concurrency | `render.yaml:7`, `main.py:217` | Bound concurrency (semaphore) + memory monitoring |

Also MEDIUM: **unreachable families** — `classify_family` can never emit `flesh`/`copper`
(no anchors in `build_color_anchors.py` CHROMATIC) yet they appear in `RECOGNISED_FAMILIES`,
`FAMILY_ADJACENCY`, and `WashMapping`; and **`WASH_MAPPING` is duplicated** frontend
(`paintMatcher.ts:19-96`) vs backend `config.WashMapping` with no sync.

### [LOW]

- **Dead imports/methods (verified unused):** `color_engine.py:17` `KMeans`, `:22`
  `scipy.ndimage`, `:26` `circular_mean_hue` (runtime), `:100` `ColorAnalyzer.analyze_color_temperature`;
  unused `lib/deltaE.ts` exports `findClosestColor`/`areSimilar`/`groupBySimilarity`.
- **Numeric sense-checks:** `_determine_optimal_k` step jumps at 5k/20k/50k px
  (`smart_color_system.py`); specular filter fully bypassed when <5000 px survive
  (`smart_color_system.py:60-72`); highlight hue-shift target can exceed the documented 5–20°
  band (`recipe_geometry.py:48-49,122-127`).
- **Misleading "ΔE76" comments/labels:** `offlineColorDetection.ts:18-20`,
  `color_engine.py:230`, `color_anchors.json` metric field.
- **Carried from prior audit:** `.gitignore` lists `.scrape_cache/` but the real dir is
  `.source_cache/` (L1); stale `rembg` docs (L2); no EXIF strip (L3, mitigated); broad
  CORS+credentials (L4); no security headers (L5); premium-gate placeholder button (L6);
  avoidable inline styles (L7); no cold-start "skip/offline" affordance (L8).

### Verified good (no action)
Single classifier *within* each side (live scan routes through `classify_family` —
`smart_color_system.py:381-403`); rgb→lab parity (frontend uses skimage's exact coefficients);
backend monotonicity guard; deterministic seeded K-means + specular trim; decompression-bomb
guard; in-memory image handling with `gc.collect()`; Zustand race guard; client
AbortController/timeouts.

---

## 4. Colour-engine deep-dive (focus area)

- **Architecture is correct, the metric isn't.** There is genuinely one classifier surface:
  DB families, the live scan, and the offline scan all call the same nearest-exemplar logic
  over one shared anchor set. The defect is purely that the **backend and frontend disagree on
  the distance function** (C-1). `build_color_anchors.py` already emits both `color_anchors.json`
  and `colorAnchors.ts` from one source, so anchors can't drift — only the metric did.
- **Missed pathway:** the RGB miniature branch (C-3) is effectively dead-and-broken — it can
  only ever raise. Decide: support it (backend removal fallback) or reject it cleanly.
- **Dead code:** four unused `ColorDetection`/`BaseDetection` constants and four unused
  imports/methods in `color_engine.py`. These are dangerous precisely because they *look*
  authoritative (e.g. a maintainer tuning `METALLIC_BRIGHTNESS_STD = 50` would change nothing;
  the real value is `25`/`18` hardcoded in `is_metallic_surface`).
- **Sense checks:** the recipe geometry and ΔE maths are sound (corroborated by the new
  `test_boundary_math.py`); the soft spots are threshold *step* functions and the specular
  filter's all-or-nothing bypass on small images, not the core algebra.
- **Duplication risk:** `IDEAL_DL` (×2) and rgb→lab (×7) are the most likely future-drift
  sources — exactly the class of problem that produced C-1.

---

## 5. Test-suite reconciliation

- **Backend:** 576 passed, 1 xfail (H-4/T1), 1 skip — green.
- **Frontend unit:** the new `store.test.ts` (race guard) + `recipeMonotonicity.test.ts` pass;
  the **23 `colorFamily.test.ts` failures are C-1** and currently make `npm test` exit non-zero.
- **E2E:** 5 Playwright specs pass (cold-start, button-masher, back-button + 2 pre-existing).
- **M5** is documented as a skipped case; the authoritative backend guard is covered by
  `test_boundary_math.py::test_derive_partner_*`.

So the test suite already encodes the two most important findings: **C-1 (23 reds)** and
**H-4 (xfail)**. Fixing C-1 per §6 turns the frontend suite green with no fixture changes.

---

## 6. Implementation plan (phased; execute in a later approved turn)

**Phase 0 — Unblock the test suite (CRITICAL, smallest change).**
- C-1: in `offlineColorDetection.ts:43-53`, replace the inline squared-Euclidean with a call
  to `deltaE2000` from `lib/deltaE.ts` over the same anchors; correct the `"deltaE76"`
  labels → `ciede2000` in `color_engine.py:230` and `build_color_anchors.py`/`color_anchors.json`.
  Verify: `npm test` → 0 failures (no fixture regen needed). _Effort: S._

**Phase 1 — Security (CRITICAL/HIGH).**
- C-2: auth + rate-limit the `/api/ml/*` and `/api/analytics/*` writes; lock down the GET
  stats; plan RLS + anon key. _M._
- H-1: fix the rate-limit key / trusted-proxy config (`render.yaml`, `main.py`). _S._
- H-2: enforce upload size before buffering. _S._
- H-3: git-ignore `python-api/data/`; add retention purge; validate email. _S._

**Phase 2 — Robustness (CRITICAL/HIGH/MEDIUM).**
- C-3: clean 400 for non-RGBA miniatures (or remove the dead branch). _S._
- H-4: broaden the upload `except` to map PIL decode errors → 400 (removes the xfail). _S._
- M-1/M-2: stop leaking `str(e)`; type + de-PII the `/api/feedback` log. _S._
- M-3: add the offline monotonicity guard. _S._

**Phase 3 — Code health & cleanup (MEDIUM/LOW).**
- M-4..M-8: delete-or-wire the dead config; centralise `IDEAL_DL` and rgb→lab; remove the
  `scale75` remnant; de-duplicate the wash map. _M total._
- LOW batch: dead imports/methods, misleading comments, `.gitignore` typo, stale `rembg`
  docs, security headers, premium-gate, inline styles. _S each._

---

## 7. Improvement suggestions (beyond fixing issues)

1. **A CI parity gate so C-1 can never recur silently.** The golden-fixture test exists; run
   it (and the Python fixture test) in CI on every PR, and assert `color_anchors.json` /
   `colorAnchors.ts` are regenerated (fail if `build_color_anchors.py` output differs from the
   committed files). One shared metric constant referenced by both sides.
2. **Single sources of truth.** Centralise rgb→lab and `IDEAL_DL`; make `config.py` either the
   real source for every threshold or delete the unused ones — no "looks authoritative but
   isn't" constants.
3. **Data-endpoint hardening as a unit:** auth + rate-limit + retention + RLS for `/api/ml`
   and `/api/analytics` together, so the collection surface is consistently governed.
4. **Offline/online recipe parity:** either bring the offline generator up to the backend
   graph's guarantees (monotonicity, brand set) or clearly mark offline results "advisory".
5. **Memory headroom:** bound scan concurrency and add Render memory monitoring before any
   traffic, given the single 512 MB worker and resident models.

---

_No application source was modified in producing this document. File:line references were
verified first-hand for all CRITICAL/HIGH items and the dead-code list._
