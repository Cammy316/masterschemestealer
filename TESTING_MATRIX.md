# SchemeStealer — Testing Matrix

Test suite added to harden the app against chaotic users, edge-case colour maths, and
malicious payloads. Built on the **existing** infrastructure (pytest + `conftest.py` cv2
mock; vitest; Playwright) rather than reinventing it.

**Operating policy for this work:** _pin current behaviour, document known bugs as
`xfail`/`skip`, and make **no application-code changes**._ The self-healing loop therefore
only fixed flawed tests and test infrastructure; every real bug a test exposed is recorded
below for separate remediation.

---

## How to run

| Suite | Command (from repo root) | Notes |
|-------|--------------------------|-------|
| Backend | `cd python-api && USE_REAL_CV2=1 venv/Scripts/python -m pytest` | `USE_REAL_CV2=1` is required — the end-to-end pipeline tests need real OpenCV (the `conftest.py` cv2 mock is for pure-logic tests). |
| Frontend unit | `cd schemestealer-react && npm test` | vitest, node env + in-memory `localStorage` shim. |
| E2E | `cd schemestealer-react && npx playwright test` | Chromium; `playwright.config.ts` now auto-starts `npm run dev`. Run `npx playwright install chromium` once. |

---

## Coverage matrix

### 1. Colour maths & boundary-value analysis — `python-api/tests/test_boundary_math.py`

| Test | What it pins | Seam |
|------|--------------|------|
| `test_ciede2000_identity_is_zero_at_extremes` | ΔE(x,x)=0 even at L*=0/100 with a*=b*=0 (undefined hue) | `core/colour_maths.py:ciede2000_single` |
| `test_ciede2000_finite_and_nonneg_vs_grey` | No NaN/inf from hue/chroma terms near pure neutrals | same |
| `test_ciede2000_black_to_white_is_large_and_finite` | Max lightness excursion stays finite (~100) | same |
| `test_ciede2000_no_nan_on_full_neutral_sweep` | Achromatic L*=0→100 sweep never produces NaN | same |
| `test_kmeans_pure_white_field` / `…_pure_black_field_does_not_crash` | Degenerate/gamut-extreme fields cluster without NaN/crash | `core/smart_color_system.py:extract_colors` |
| `test_kmeans_is_deterministic` | Seeded clusterer (random_state=42) is reproducible — no flaky recipes | same |
| `test_target_lab_highlight_is_strictly_lighter` / `…_shade_is_darker` | Ideal targets move L* the correct direction across the full range | `core/recipe_geometry.py:target_lab` |
| `test_derive_partner_highlight_is_strictly_lighter_than_base` / `…_shade_…darker…` | **Monotonicity guard**: a highlight never resolves darker than base (and vice-versa) | `core/recipe_geometry.py:derive_partner` |
| `test_derive_partner_returns_empty_when_no_lighter_paint_exists` | Honest `(None,"empty")` rather than a wrong-direction paint | same |

_Complements existing `test_colour_science.py` (Sharma ΔE pairs) and
`test_color_classification.py` (neon `#00FF00` gamut case) — those are not duplicated._

### 2. Security & penetration fuzzing — `python-api/tests/test_api_security.py`

| Test | What it pins | Result |
|------|--------------|--------|
| `test_non_image_mime_is_rejected_400` | MIME gate rejects non-images | 400 |
| `test_oversize_50mb_payload_is_rejected_413` | 50 MB upload refused (audit H2 noted) | 413 |
| `test_unsigned_garbage_with_image_mime_rejected_400` | Unrecognisable bytes → `UnidentifiedImageError` | 400 |
| `test_corrupted_exif_does_not_crash_server` | Mangled JPEG/EXIF degrades gracefully, never 500 | 200/400 |
| `test_zero_byte_file_rejected_400` | 0-byte upload | 400 |
| `test_valid_transparent_rgba_png_is_accepted_200` | Valid 0-alpha RGBA (client-removed-bg path) accepted | 200 |
| `test_inspiration_endpoint_also_rejects_non_image` | Second endpoint validated too | 400 |
| `test_gc_collect_runs_after_successful_scan` / `…_after_failed_scan` | **OOM contract**: `gc.collect()` always runs in `finally` | spy asserted |
| `test_flooding_trips_rate_limit_429` | slowapi 10/min ceiling fires under a burst | 429 present |
| `test_truncated_signed_png_should_be_400_not_500` | **xfail (strict)** — pins NEW FINDING T1 (see below) | xfail |

Tests mock the scanner + pre-set `_scanner_ready`, so the HTTP contract is exercised
without loading the heavy ML stack.

### 3. Frontend state & race conditions — `schemestealer-react/lib/__tests__/store.test.ts`

| Test | What it pins | Seam |
|------|--------------|------|
| `discards a stale result when the user switched modes mid-scan` | The core anti-contamination guard: a late Miniscan result is dropped after the user flips to Inspiration | `lib/store.ts:setScanResult` (~50-58) |
| `commits a result that matches the current mode` | Normal path still commits | same |
| `commits the first scan when no mode is set yet` | Cold first-scan edge case | same |
| `keeps only the result matching the FINAL mode under rapid switching` | Rapid mode flips never cross-contaminate | same |
| `does not cross-contaminate scanHistory with a discarded result` | Discards don't leak into history | same |
| `clearCurrentScan resets both the scan and the mode` | Clean reset | `lib/store.ts:clearCurrentScan` |

Plus `lib/__tests__/recipeMonotonicity.test.ts`: structural coverage of the offline
`getRecipeForColor`, with the M5 gap documented as a skipped case (see below).

### 4. UI robot / chaos — `schemestealer-react/tests/*.spec.ts` (Playwright)

| Spec | What it pins |
|------|--------------|
| `cold-start.spec.ts` | `/api/ready` held "asleep" then woken → "MACHINE SPIRIT AWAKENING" theatre renders, then hands off to the real UI; latency masked, no hang |
| `button-masher.spec.ts` | Hammering the brand dropdown never locks the UI; recipe content stays visible, control stays interactive, no error boundary |
| `back-button.spec.ts` | Browser Back from results restores `/miniature` with its layout intact (no white screen / 404) |

Network is stubbed via `page.route`; results pages are seeded via `localStorage`
(`tests/fixtures/seed.ts`) to avoid the heavy `@imgly` background-removal path and a live
backend.

---

## Results

_Updated after the CRITICAL/HIGH/MEDIUM remediation (see `PRE_PROD_AUDIT.md` §0)._

| Suite | Outcome |
|-------|---------|
| Backend (`USE_REAL_CV2=1`) | **577 passed, 1 skipped** — all green (the former T1 strict-xfail now passes after the H-4 fix) |
| Frontend (`vitest`) | **460 passed** — incl. the 23 `colorFamily` cases (fixed by C-1) and the now-active M-3 monotonicity test; `tsc --noEmit` clean |
| E2E (Playwright) | **5 passed** — 3 new specs + 2 pre-existing (`tests/e2e.spec.ts`); run serially (`workers: 1`) to avoid dev-server contention flakes |

---

## Vulnerabilities & bugs surfaced

### NEW — T1: malformed-but-PNG-signed upload returns 500 (should be 400)
A payload carrying a valid PNG signature but malformed chunks raises
`OSError: Truncated File Read`. The scan handler only maps `UnidentifiedImageError` to 400,
so this falls through to the generic `except` and returns **500**.
- **Where:** `python-api/main.py` (scan handlers' `except UnidentifiedImageError`).
- **Pinned by:** `test_api_security.py::test_truncated_signed_png_should_be_400_not_500`
  (`xfail(strict=True)` — flips to a suite failure if the bug is fixed, prompting removal).
- **Recommended fix (deferred):** catch broad PIL decode errors
  (`OSError`, `Image.DecompressionBombError`) → 400.

### PRE-EXISTING (high priority) — frontend↔backend classifier drift
`colorFamily.test.ts` runs the **shared** golden fixtures
(`python-api/tests/color_family_fixtures.json`) through the frontend `classifyFamily` and
asserts parity with the backend. **23 of ~451 cases now disagree** (e.g. `#7C6A42`: backend
`brown`, frontend `yellow`). The backend ran the same fixtures **green**, so the **frontend
classifier has drifted** — most likely a stale generated `lib/colorAnchors.ts` vs the
current backend anchors. This violates the project's single-classifier invariant.
- **Not introduced by this work** (the new test files pass in isolation; these failures
  reproduce alone).
- **Not fixed here** — the fix is application/generated-data
  (`lib/colorAnchors.ts` via `scripts/build_color_anchors.py`), which is out of scope under
  the no-app-change policy.
- **Action:** regenerate `colorAnchors.ts` from the current backend and re-run; if the
  divergence is intentional, update the fixtures on both sides together.

### Documented, not asserted (cross-refs to `audit-report.md`)
- **M5** — offline `getRecipeForColor` lacks the backend's monotonicity guard; captured as a
  skipped case in `recipeMonotonicity.test.ts`. The authoritative backend guard is fully
  covered by `test_boundary_math.py::test_derive_partner_*`.
- **M3** — the RGB (non-alpha) miniature path raises in the engine; the security tests mock
  the scanner, so this is referenced, not exercised end-to-end.
- **H1 / H2** — the spoofable rate-limit key and the buffer-before-size-check are noted in
  test comments; the 413 and 429 tests pass at the HTTP layer regardless.

---

## Changes made (test + infra only — NO application source modified)

**New test files**
- `python-api/tests/test_boundary_math.py`, `python-api/tests/test_api_security.py`
- `schemestealer-react/lib/__tests__/store.test.ts`, `…/recipeMonotonicity.test.ts`
- `schemestealer-react/tests/{cold-start,button-masher,back-button}.spec.ts`,
  `schemestealer-react/tests/fixtures/seed.ts`

**Test infrastructure / config**
- `python-api/pytest.ini` (testpaths, markers), `python-api/requirements-dev.txt`
  (`pytest`, `httpx`)
- `schemestealer-react/vitest.config.ts` (added `setupFiles`) +
  `schemestealer-react/vitest.setup.ts` (in-memory `localStorage`)
- `schemestealer-react/playwright.config.ts` (enabled `webServer`, fixed port 5173→3000)
- `npm install` installed the already-declared `@playwright/test` (it was missing from
  `node_modules`); `package-lock.json` updated accordingly. `package.json` unchanged.

No `.py`, `.tsx`, or store/engine logic was changed. The one production-code issue the
suite found (T1) and the pre-existing classifier drift are documented above for separate,
explicitly-approved remediation.
