# SchemeStealer — Security & Tech-Debt Audit

> Prioritised findings from a read-only architecture & security audit of the current
> `main` branch. Companion: [`architecture.md`](./architecture.md).
> Severity reflects **realistic** impact for a solo-dev app on a Render free tier with a
> Supabase backend and affiliate monetisation — not a theoretical worst case.

## Executive Summary

The colour-science core is in good shape: the single-classifier and single rgb→lab
invariants hold, the matcher contract (family gate + ΔE ceiling + metallic flag) is intact,
and the backend recipe derivation has a real monotonicity guard. Image handling is
privacy-respecting — uploads are processed in memory and never persisted.

The material risk is **not** in the colour maths; it is in the **unauthenticated
data-collection surface** and a few **resource-exhaustion** gaps:

- The entire `/api/ml/*` and `/api/analytics/*` surface accepts writes with **no auth and
  no rate limit**, backed by a Supabase **service-role** key. This is the single most
  serious issue (training-data poisoning, analytics corruption, unbounded writes).
- The scan rate limit is **bypassable** (`X-Forwarded-For` spoofing), and the upload size
  cap is enforced **after** the whole body is buffered — both feed OOM on the single worker.
- User PII (emails, free-text comments, user-agents) is written to a **non-git-ignored**
  working-tree directory with no retention policy.

A correction to note: an earlier automated pass flagged a "CRITICAL undeclared `rembg`
dependency". That is **false** — there is no server-side `rembg`; background removal is
client-side and the engine hard-raises if a mini arrives without an alpha channel
(`core/schemestealer_engine.py:162-163`). The real issues are stale docs and a broken
RGB-only path, captured below.

| Severity | Count |
|----------|-------|
| CRITICAL | 1 |
| HIGH | 3 |
| MEDIUM | 6 |
| LOW | 8 |

---

## [CRITICAL]

### C1 — Unauthenticated writes to the production database
**Where:** `python-api/routes/ml_data.py:531-612`, `python-api/routes/analytics.py:250-259`;
key handling `python-api/utils/supabase_client.py:15-31`.

Every data-collection endpoint (`/api/ml/log-scan`, `log-feedback`,
`log-complete-feedback`, `log-behavior`, `batch-log`, `/api/analytics/events`) is open:
no authentication, no API key, no rate limit. They persist via a Supabase client built
from `SUPABASE_SERVICE_KEY` — the **service-role** key, which **bypasses Row-Level
Security**. The matching `GET` endpoints (`/api/ml/stats`, `/api/ml/feedback-stats`,
`/api/analytics/summary`) expose aggregate business metrics publicly.

**Impact:** anyone who finds the API URL can (a) poison the ML training set with crafted
`ground_truth_labels`, (b) inflate/forge analytics and rating data, (c) flood the database
or local disk unbounded, and (d) read aggregate usage stats. Because writes go through the
service-role key, there is no DB-side guard rail.

**Fix:** put these endpoints behind a shared secret (e.g. an `X-Ingest-Key` header checked
against an env var) or signed requests; add a per-IP rate limit; and ideally swap the
service-role key for an `anon` key plus Supabase RLS insert policies so the DB enforces
constraints even if the app layer is bypassed. Treat the `GET` stats endpoints as
admin-only.

---

## [HIGH]

### H1 — Scan rate limit is trivially bypassable
**Where:** `render.yaml:7` (`--forwarded-allow-ips="*"`) + `python-api/main.py:105`
(`Limiter(key_func=get_remote_address)`), applied at `main.py:192,238`.

uvicorn is told to trust `X-Forwarded-For` from *any* upstream, and slowapi keys its
`10/minute` limit on the resulting client address. A client that sets a random
`X-Forwarded-For` per request gets a fresh bucket each time, defeating the limit.

**Impact:** combined with H2 and the single worker, an attacker can drive unbounded
concurrent scans → CPU saturation and OOM. Also undermines the CORS allow-list as a
throttle.

**Fix:** restrict `--forwarded-allow-ips` to Render's proxy address(es), or derive the
rate-limit key from the real edge IP (Render sets a trustworthy header). Keep a global
fallback limit independent of client IP.

### H2 — Upload size is checked only after the whole body is buffered
**Where:** `python-api/main.py:204-205` and `:250-251` (`contents = await file.read()`
then `_validate_upload`), limit defined `main.py:181`, check `main.py:184-188`.

`await file.read()` pulls the **entire** request body into memory before the 10 MB check
runs. The `Image.MAX_IMAGE_PIXELS = 25M` guard (`main.py:34`) protects against
decompression bombs but does nothing for raw upload size.

**Impact:** a single large POST (hundreds of MB) is fully resident before rejection →
OOM on the ~512 MB single worker; trivially repeatable given H1.

**Fix:** enforce a size cap *before* buffering — reject on `Content-Length`, and/or read
the stream in bounded chunks and abort once `_MAX_UPLOAD_BYTES` is exceeded. Consider a
reverse-proxy / ASGI body-size limit as defence in depth.

### H3 — User PII written to a non-git-ignored directory, no retention
**Where:** `python-api/routes/ml_data.py:203-243` (feedback/behaviour JSON),
`python-api/routes/analytics.py:71-98` (events CSV); `email` field
`routes/ml_data.py:117`; root `.gitignore` (no `python-api/data/` entry).

In file-storage mode, feedback JSON can contain a user-supplied **email** and free-text
comments, and analytics CSVs contain `session_id` + `user_agent`. These land in
`python-api/data/ml/…` and `python-api/data/analytics/…`, which are **not** in
`.gitignore` (they appear as untracked files in `git status`). There is no TTL or deletion
path.

**Impact:** real risk of committing user PII into git history; indefinite retention is a
privacy/compliance liability.

**Fix:** add `python-api/data/` to `.gitignore`; confirm none of it is already tracked;
add a retention/purge job (e.g. delete feedback/analytics files older than N days);
validate/normalise the email field and consider not collecting it at all.

---

## [MEDIUM]

### M1 — Internal exception text leaked to clients
**Where:** `python-api/routes/ml_data.py:544,554,574,584,612,621,630` and
`routes/analytics.py:259,268` (`detail=f"...: {str(e)}"`).

Handlers echo the raw exception string into the HTTP response. This can disclose Supabase
errors, schema details, or file paths.

**Fix:** return a generic message to the client; log the detail server-side only.

### M2 — `/api/feedback` logs an arbitrary dict (incl. PII) at INFO; untyped, unthrottled
**Where:** `python-api/main.py:282-289` (`logger.info(f"Feedback received: {feedback}")`).

The endpoint accepts `Dict[str, Any]` with no schema, no rate limit, and logs the whole
payload — any email/comment a client sends is emitted to stdout (captured by Render/log
aggregation). It also overlaps confusingly with the typed `/api/ml/log-feedback`.

**Fix:** type the payload with a Pydantic model, drop the body from the log line (or move
to DEBUG with PII masked), add a rate limit, or remove the endpoint in favour of
`/api/ml/log-feedback`.

### M3 — Miniature endpoint accepts RGB but the engine requires an alpha channel
**Where:** `python-api/services/miniature_scanner.py:88-99` (RGB branch omits
`precomputed_rgba`) → `core/schemestealer_engine.py:162-163` (`raise ValueError` when
`mode="mini"` and `precomputed_rgba is None`); upload converts to RGB at `main.py:207-208`.

If a miniature is uploaded without an alpha channel (e.g. a direct JPEG, or if client-side
removal is skipped/fails and the original is sent), the engine raises `ValueError`, which
surfaces as a generic **500** ("Scan processing failed"). The normal app path always sends
RGBA so this is usually masked, but the endpoint contract and the scanner's RGB branch are
inconsistent.

**Fix:** either reject non-RGBA miniature uploads with a clear 400 ("background must be
removed first"), or have the backend perform a fallback removal for the RGB case. Remove
the dead RGB branch in `miniature_scanner.scan` if it can never succeed.

### M4 — Two independent CIEDE2000 implementations
**Where:** backend skimage via `python-api/core/colour_maths.py:6-17`; frontend manual JS
`schemestealer-react/lib/deltaE.ts:33-137`.

The frontend reimplements CIEDE2000 by hand rather than mirroring a single source. It is
broadly correct, but near pure neutrals it leaves `hMeanPrime = 0` when one chroma is zero
(`deltaE.ts:95-105`) instead of using the hue-sum as in the Sharma reference — a small
deviation in the `T`/`SH` weighting. The practical numerical impact is negligible because
the hue-difference term vanishes as chroma → 0, but it is a genuine divergence risk: the ΔE
shown on the online (backend) path and the offline path can differ.

**Fix:** treat this as tech debt — document that `deltaE.ts` must track the skimage result,
add a golden-vector parity test (a handful of LAB pairs incl. neutrals compared against
skimage), or generate the frontend from a single spec.

### M5 — Offline recipe fallback lacks the backend's monotonicity guard
**Where:** `schemestealer-react/lib/paintMatcher.ts:249-321` (`getRecipeForColor` +
`findClosestPaint`) vs backend guard `python-api/core/recipe_geometry.py:261-262`.

The offline generator shifts L* by ±12 then picks the nearest paint by ΔE with **no**
guard that a highlight ends up lighter than the base (or a shade darker). If the candidate
pool lacks a lighter option, the "highlight" can be darker than the base — the exact bug
the backend prevents. The code comments acknowledge it is a non-primary fallback.

**Fix:** mirror `_monotonic_ok` in `findClosestPaint` (filter to strictly lighter/darker
candidates with a tiered fallback), or clearly label offline recipes as advisory in the UI.

### M6 — Single worker + tight memory + resident models → OOM under concurrency
**Where:** `render.yaml:7` (`--workers 1`), `python-api/main.py:217,262`
(`run_in_executor` on the default thread pool).

Scans are CPU-bound (OpenCV, sklearn, numpy) and offloaded to the default executor, but the
GIL serialises them and a single worker holds the engine + paint DB resident. Concurrent
scans queue and stack memory.

**Fix:** keep one worker (correct for the memory budget) but bound concurrency explicitly
(a semaphore around the executor), size the thread pool to 1, and/or move heavy work to a
queue. At minimum, document the concurrency ceiling and add memory monitoring.

---

## [LOW]

### L1 — `.gitignore` ignores the wrong scraper-cache directory
Root `.gitignore` ends with `.scrape_cache/`, but the actual untracked directory is
`.source_cache/` (see `git status`). The cache is therefore not ignored. **Fix:** correct
the entry to `.source_cache/`.

### L2 — Stale docs claim a server-side `rembg` that does not exist
`python-api/main.py:196`, `services/miniature_scanner.py:25`, and `python-api/README.md`
("Background removal using rembg", `rembg==2.0.59`) describe a server-side removal that was
removed; `requirements.txt` has no `rembg`. **Fix:** update the docstrings/README to state
removal is client-side (`@imgly/background-removal`).

### L3 — EXIF not explicitly stripped
Uploads aren't explicitly EXIF-scrubbed. Mitigated in practice: `image.convert('RGB')`
(`main.py:208,254`) discards EXIF and images are never persisted, so GPS data does not
leave the request. **Fix (defence in depth):** drop EXIF on open and apply EXIF-orientation
before analysis (also fixes sideways phone photos).

### L4 — Broad CORS with credentials
`main.py:116-128` sets `allow_credentials=True` with an allow-list plus a wide private-IP
regex (`192.168/10/172.16-31` + localhost). Low risk (private ranges, no cookie auth in
use), but broad. **Fix:** gate the private-IP regex behind a dev-only flag.

### L5 — No security headers on the frontend
`schemestealer-react/next.config.ts` is minimal and there is no `middleware.ts`; no CSP,
`X-Frame-Options`, `Referrer-Policy`, etc. **Fix:** add a `headers()` block or middleware
with a baseline security-header set.

### L6 — Premium-gate overlay is a non-functional placeholder
`components/shared/PaintRecipeCard.tsx` renders a "sealed formulation / unlock premium"
overlay whose button does nothing. **Fix:** hide behind a feature flag until the unlock
flow exists, or remove.

### L7 — Avoidable inline styles in a few spots
Most inline `style={{…}}` is justified (dynamic hex, radial gradients, clip-paths). A few
are not, e.g. `style={{ background: 'var(--void-black)' }}` in `app/miniature/page.tsx` and
`app/inspiration/page.tsx` where a `bg-…` utility exists. **Fix:** replace the static cases
with Tailwind utilities; keep the dynamic ones.

### L8 — Cold-start screen has no manual escape; offline brand list is stale
`hooks/useApiReady.ts` offers no "skip / go offline" affordance during warm-up, and the
offline `lib/paintMatcher.ts` still references a `scale75` brand that
`config.Affiliate.SUPPORTED_BRANDS` dropped. **Fix:** add a skip-to-offline button; prune
`scale75` from the offline path.

---

## Verified Good (no action needed)

- **Decompression-bomb guard:** `Image.MAX_IMAGE_PIXELS = 25M` (`main.py:34`).
- **Images never persisted:** in-memory only, with `image = None; contents = None;
  gc.collect()` in `finally` (`main.py:230-234,275-279`); no disk writes of image bytes.
- **Magic-byte validation:** `Image.open` rejects non-images via `UnidentifiedImageError`
  (handled `main.py:222-224,267-269`) — defends past the client-supplied MIME header.
- **Single-classifier & single rgb→lab invariants hold** (`core/color_engine.py` ↔
  `lib/colorAnchors.ts`; skimage ↔ `lib/colorConversion.ts`).
- **Matcher contract intact:** family gate + ΔE ceiling (30) + metallic flag + dedup;
  empty pool → "No match found".
- **Backend recipe monotonicity guard is real** (`recipe_geometry.py:261-262`); neutral
  hue-shift locked when chroma < 5 (`:220`).
- **Deterministic K-means in LAB** with specular percentile trimming
  (`smart_color_system.py`, `random_state=42`).
- **Frontend state hygiene:** mode-guarded scan commit, blob-URL revocation, localStorage
  quota handling (`lib/store.ts`); client `AbortController` + timeouts
  (`lib/apiClient.ts`); refresh-safe results pages.

---

## Prioritised Remediation Checklist

Ordered by impact ÷ effort. No code has been changed yet — approve items individually.

| # | Finding | Action | Files | Effort |
|---|---------|--------|-------|--------|
| 1 | C1 | Add shared-secret auth + rate limit to all `/api/ml/*` & `/api/analytics/*` writes; lock down `GET` stats | `routes/ml_data.py`, `routes/analytics.py`, `main.py` | M |
| 2 | H3 | `.gitignore` `python-api/data/`; verify nothing tracked; add retention purge | `.gitignore`, small util | S |
| 3 | H1 | Restrict `--forwarded-allow-ips` to Render proxy / fix rate-limit key | `render.yaml`, `main.py` | S |
| 4 | H2 | Reject oversize uploads before buffering (Content-Length / chunked read) | `main.py` | S |
| 5 | M1 | Stop echoing `str(e)` to clients; log server-side only | `routes/ml_data.py`, `routes/analytics.py` | S |
| 6 | M2 | Type `/api/feedback`, drop PII from log, add limit (or remove) | `main.py` | S |
| 7 | M3 | Clear 400 for non-RGBA mini uploads; remove dead RGB branch | `main.py`, `miniature_scanner.py` | S |
| 8 | C1/L1 | RLS insert policies + swap service-role for anon key (DB-side guard) | Supabase, `supabase_client.py` | M |
| 9 | M5 | Add monotonicity guard to offline `findClosestPaint` | `lib/paintMatcher.ts` | S |
| 10 | M4 | Golden-vector ΔE parity test (skimage vs `deltaE.ts`, incl. neutrals) | new test, `lib/deltaE.ts` | M |
| 11 | M6 | Bound scan concurrency (semaphore / pool size 1) + memory monitoring | `main.py`, `render.yaml` | M |
| 12 | L2,L1,L4–L8 | Doc/cleanup batch: stale rembg docs, scrape-cache path, headers, premium gate, inline styles, offline `scale75`, warm-up skip | various | S each |

_Effort: S ≈ < 1 h, M ≈ a few hours._
