# SchemeStealer — Architecture Blueprint

> Technical map of how the Next.js UI, Zustand state, and FastAPI backend hang together.
> Companion document: [`audit-report.md`](./audit-report.md) (prioritised findings).
> Generated from a read-only audit of the codebase as of the current `main` branch.

---

## 1. System Overview

SchemeStealer is a mobile-first Warhammer paint-matching app. A painter photographs a
model, the app detects the dominant colours, and recommends matching paints across six
brands (Citadel, Vallejo, Army Painter, AK, Pro Acryl, Two Thin Coats) with a
base → highlight/layer → shade → wash recipe per colour.

There are two user flows, sharing one engine and one recipe card:

| Flow | Purpose | Background removal | Identity |
|------|---------|--------------------|----------|
| **Miniscan** | Photograph a painted miniature | Yes (client-side) | Green "Imperial" |
| **Inspiration** | Extract a palette from any image | No (whole image) | Purple "Warp" |

**Monorepo layout**

```
masterschemestealer/
├─ python-api/            FastAPI backend (colour engine, matcher, recipe graph)
│  ├─ main.py             ASGI entrypoint, scan endpoints, CORS, rate limiting
│  ├─ config.py           Thresholds, supported brands, wash mapping
│  ├─ routes/             ml_data.py, analytics.py  (data-collection side channels)
│  ├─ services/           miniature_scanner.py, inspiration_scanner.py, recipe_builder.py
│  ├─ core/               schemestealer_engine.py, color_engine.py, smart_color_system.py,
│  │                      photo_processor.py, recipe_geometry.py, recipe_graph.py,
│  │                      colour_maths.py, base_detector.py, paint_matcher.py
│  ├─ utils/              supabase_client.py, analytics, logging, session helpers
│  └─ paints_groundtruth.json   1,312 measured paints (authoritative DB)
└─ schemestealer-react/   Next.js 16 / React 19 / TS / Tailwind 4 / Zustand 5
   ├─ app/                App Router pages (miniature, inspiration, cart, results)
   ├─ components/         shared/PaintRecipeCard.tsx + miniscan/ + inspiration/ + ui/
   ├─ hooks/              useScan, useApiReady, useAnalytics, …
   └─ lib/                store.ts (Zustand), api/apiClient, colorConversion, deltaE,
                          paintMatcher, offlineColorDetection, colorAnchors, paintDatabase
```

---

## 2. Deploy Topology

```
            ┌──────────────────────────┐         ┌───────────────────────────┐
  Browser ──┤  Vercel (Next.js 16 SSR)  ├──HTTPS──┤  Render (FastAPI, 1 worker)│
            └──────────────────────────┘  CORS    └───────────────┬───────────┘
                       │                                          │
              NEXT_PUBLIC_API_URL                       Supabase (service-role key)
                                                          └─ or local data/ files
```

- **Frontend:** Vercel. Minimal `next.config.ts` (Turbopack only; no security headers, no
  `middleware.ts`).
- **Backend:** Render web service, configured by `render.yaml`:
  `gunicorn main:app --workers 1 --worker-class uvicorn.workers.UvicornWorker
  --forwarded-allow-ips="*" --timeout 300`. Single worker on a ~512 MB tier.
- **GPU disabled deliberately** (`main.py:8-16`, `render.yaml` env): `CUDA_VISIBLE_DEVICES=""`,
  `OMP_NUM_THREADS=1`, `ORT_DISABLE_PROVIDERS=…` — prevents an onnxruntime device-discovery
  hang on Render's shared Linux containers.
- **Cold start:** scanners pre-warm in a background thread started inside the ASGI worker
  via the `lifespan` handler (`main.py:98-102`), because threads do not survive gunicorn's
  fork. The frontend masks the cold start by polling `/api/ready`.

---

## 3. End-to-End Pipeline (the spine)

```
[Camera/File]                                          schemestealer-react
     │  app/miniature/page.tsx  (capture="environment")
     ▼
[Client background removal]  @imgly/background-removal  lib/backgroundRemoval.ts
     │  → RGBA PNG (miniature only; inspiration sends original)
     ▼
[useScan] hooks/useScan.ts  → lib/api.ts → lib/apiClient.ts
     │  FormData POST, AbortController, 120 s timeout
     ▼  NEXT_PUBLIC_API_URL  ───────────────────────────────────────────────────►
┌──────────────────────────────────────────────────────────────────────────────┐
│ POST /api/scan/{miniature,inspiration}   main.py                              │ python-api
│   _await_scanner_ready() → file.read() → _validate_upload (MIME + 10 MB)       │
│   Image.open (PIL magic bytes, MAX_IMAGE_PIXELS=25M) → thumbnail(1024)         │
│   run_in_executor( scanner.scan )                                              │
│        │                                                                       │
│        ▼  services/{miniature,inspiration}_scanner.py                          │
│   SchemeStealerEngine.analyze_miniature   core/schemestealer_engine.py         │
│     1 quality check + CLAHE on L*        core/photo_processor.py               │
│     2 auto white balance (alpha-aware)                                         │
│     3 background crop via alpha bbox (mini) / full frame (inspiration)         │
│     4 resize to 300 px analysis width                                          │
│     5 seeded K-means in LAB + specular percentile trim  smart_color_system.py  │
│     6 per-colour recipe build  _build_recipes_with_ml_features                 │
│          • classify family        core/color_engine.py  (single classifier)    │
│          • match base/highlight/shade  matcher + recipe_geometry/recipe_graph   │
│          • wash derivation        config.WashMapping / recipe_builder           │
│   → colors[] {rgb, lab, hex, %, family, position, reticle?, paintRecipe}        │
└──────────────────────────────────────────────────────────────────────────────┘
     │  JSON response  ◄───────────────────────────────────────────────────────
     ▼
[Zustand commit]  lib/store.ts  setScanResult()  (mode-guarded; discards stale result)
     │
     ▼
[Results page]  app/{miniature,inspiration}/results/page.tsx
     │  per-colour reveal animation (reticle / orb)
     ▼
[Shared recipe card]  components/shared/PaintRecipeCard.tsx
        mode="miniature" → green Imperial   |   mode="inspiration" → purple Warp
```

**Key contract:** the backend returns a structured `paintRecipe` **per brand** for every
detected colour; the frontend renders it through one shared card driven by a `mode` prop.

---

## 4. Backend Module Map

| Module | Responsibility |
|--------|----------------|
| `main.py` | ASGI app, `lifespan` pre-warm, CORS, slowapi rate limiting, scan + feedback endpoints, `/health` + `/api/ready` probes, `/api/paints` (cached). |
| `core/schemestealer_engine.py` | Orchestrator. `analyze_miniature()` runs quality → AWB → crop → resize → extract → recipe build. **Requires `precomputed_rgba` for `mode="mini"`** (`:162-163`). |
| `core/photo_processor.py` | Quality assessment (blur/glare/exposure/colour-cast) and CLAHE enhancement applied to the L* channel only. |
| `core/smart_color_system.py` | Dominant-colour extraction via sklearn K-means in LAB with `random_state=42`; 2nd–98th percentile L* trim to drop specular highlights/shadows. |
| `core/color_engine.py` | **Single colour-family classifier** (nearest LAB exemplar by CIEDE2000 + metallic flag + black floor) and the `PaintMatcher` (family gate + ΔE ceiling 30 + metallic flag + dedup). |
| `core/recipe_geometry.py` | Explicit highlight/shade target-LAB derivation with a **hard monotonicity guard** and a tiered fallback ladder (`derive_partner`, `:245-299`). |
| `core/recipe_graph.py` | Curated official base→highlight/shade chains; authoritative source for recipes when present. |
| `core/colour_maths.py` | Shared `ciede2000_single()` (skimage) and circular hue mean. |
| `services/{miniature,inspiration}_scanner.py` | Thin wrappers that call the engine, format the API response, and load the wash DB. |
| `services/recipe_builder.py` | Assembles the per-brand recipe (graph-driven base/shade/highlight + graph-or-`WashMapping` wash). |
| `routes/ml_data.py` | `/api/ml/*` — logs scan features, colour features, behaviour, feedback to Supabase or local files. |
| `routes/analytics.py` | `/api/analytics/*` — logs page/scan/ko-fi events to Supabase or daily CSV. |
| `utils/supabase_client.py` | Lazy Supabase client built from `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`; absent → file fallback. |

**HTTP surface**

| Method & path | Auth | Rate limit | Notes |
|---------------|------|-----------|-------|
| `GET /`, `/health`, `/api/ready` | none | none | Liveness/readiness probes. |
| `GET /api/paints` | none | none | Cached full paint DB. |
| `POST /api/scan/miniature` | none | 10/min | Upload → recipes (green flow). |
| `POST /api/scan/inspiration` | none | 10/min | Upload → palette (purple flow). |
| `POST /api/feedback` | none | none | Untyped `Dict[str, Any]`, logged at INFO. |
| `POST /api/ml/{log-scan,log-feedback,log-complete-feedback,log-behavior,batch-log}` | **none** | **none** | Writes to production DB. |
| `GET /api/ml/{stats,feedback-stats,health}` | none | none | Aggregate metrics exposed publicly. |
| `POST /api/analytics/events` | **none** | **none** | Writes to production DB. |
| `GET /api/analytics/{summary,health}` | none | none | Aggregate metrics exposed publicly. |

---

## 5. Colour-Science Core

The project enforces two hard invariants and they are upheld:

1. **One colour-family classifier.** `color_engine.classify_family()` is the single
   source of truth; the frontend mirror (`lib/offlineColorDetection.ts` →
   `lib/colorAnchors.ts`) is generated from the same exemplar set, so the two cannot
   silently diverge. DB families and detected families are produced by the same logic.
2. **One rgb→lab.** Backend uses skimage `rgb2lab` (D65); the frontend
   (`lib/colorConversion.ts`) deliberately hard-codes skimage's exact `xyz_from_rgb`
   coefficients and D65 white point so the conversions agree.

**Matcher contract** (`core/color_engine.py` `PaintMatcher`): family gate (detected family
+ adjacency) → ΔE ceiling (`BASE_MATCH_DELTA_E_CEILING = 30`) → metallic flag → same-brand
dedup within ΔE 2.0. An empty in-family pool returns `None` → "No match found", never a
far-off cross-family paint.

**Recipe monotonicity** (`core/recipe_geometry.py`): `target_lab()` lightens (+12 L*) for a
highlight or darkens (−12 L*) for a shade, with a small hue rotation toward yellow (warm) /
cyan (cool) and chroma preserved; hue shift is locked to 0 when chroma < 5 (neutral
stability). `derive_partner()` then enforces `_monotonic_ok` — a highlight candidate must be
strictly lighter than the base, a shade strictly darker — and walks in-family →
adjacent-family → relaxed → honest empty. **A highlight can never resolve to a darker paint.**

**ΔE note:** the backend computes CIEDE2000 via skimage; the frontend ships an *independent*
manual CIEDE2000 (`lib/deltaE.ts`). They are intended to agree, but they are two separate
implementations — see the audit report for the divergence/tech-debt detail.

---

## 6. Frontend Architecture

**App Router** (`schemestealer-react/app/`)

```
/                       home → ModeSelector
/miniature              upload + camera (warm-up gate via useApiReady)
/miniature/results      reticle reveals + PaintRecipeCard per colour
/inspiration            Warp Portal upload
/inspiration/results    colour orbs + PaintRecipeCard per colour
/forge                  Inventory (HexGrid), Forge Mix (Alchemy Crucible), Requisition Cart
```

Navigation is a fixed bottom bar (`components/Navigation.tsx`); the app uses linear
`router.push()` only (no `router.back()`). Both results pages are refresh-safe: if the
in-memory `currentScan` is lost on hard reload they fall back to persisted `scanHistory`,
else a themed empty state (never a 404).

**Zustand store** (`lib/store.ts`)

State: `currentMode`, `currentScan`, `scanHistory` (last 10, persisted), `cart`,
`isScanning`/`isLoading`, `error`, `offlineMode`, `preferredBrands`, `preferredRegion`, `inventory`, `customMixes`.
Notable hygiene:
- `setScanResult()` **discards a result whose `mode` no longer matches `currentMode`** —
  the core guard against mode-switch races.
- Blob object URLs are revoked before replacement and on clear; `toPersistableScan()`
  strips `imageUrl`/`imageData`/reticles before writing to localStorage.
- `QuotaExceededError` is caught and history cleared/retried.

**Scan orchestration** (`hooks/useScan.ts` → `lib/api.ts` → `lib/apiClient.ts`)

`AbortController` cancels in-flight scans on unmount; `apiClient` enforces per-request
timeouts (120 s for scans to cover cold start) and raises a typed `ApiError`. On backend
failure the hook can fall back to in-browser offline detection
(`lib/offlineColorDetection.ts` + `lib/paintMatcher.ts`).

**Cold-start gate** (`hooks/useApiReady.ts`)

Polls `/api/ready` every 5 s, backing off to 30 s after 5 minutes, with a 4 s per-poll
timeout and continue-on-error. Pages render a themed "machine spirit awakening" /
"warp conduit stabilising" overlay until ready — no indefinite hang, but no manual
"skip / go offline" button on that screen.

**Shared recipe card** (`components/shared/PaintRecipeCard.tsx`)

One component, `mode` prop drives the two visual identities (green Imperial vs purple
Warp): difficulty pill, compare toggle, brand selector (six tabs, swipe to switch),
per-step rows (role spine + swatch + ΔE badge + owned/cart toggles), copy-recipe, and a
premium-gate overlay. Theme-dependent colours use inline `style` (dynamic hex/gradients
that Tailwind cannot express); structural layout uses Tailwind utilities.

---

## 7. Data & Analytics Side-Channels

Both routers follow the same pattern: **Supabase if `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`
are set, else local files.**

- `routes/ml_data.py` writes scan-level features, per-colour features, behaviour, and
  feedback (including an optional **`email`** field and free-text comments) to Supabase
  tables `ml_scans`/`ml_colours`/`ml_behaviour`/`ml_feedback`, or to
  `python-api/data/ml/{scans,colours,feedback,behaviour}/`.
- `routes/analytics.py` writes page/scan/ko-fi/feedback events to `analytics_events` or to
  daily `python-api/data/analytics/events_YYYY-MM-DD.csv`.
- Uploaded **images are never persisted** — read into memory, thumbnailed, analysed, then
  `image = None; contents = None; gc.collect()` in a `finally`. Only derived colour data
  (rgb/lab/hex/family/etc.) leaves the request.

The frontend logs these via `lib/mlDataLogger.ts` / `lib/analytics.ts` / `useAnalytics.ts`,
keyed by a client-generated `session_id`.

---

## 8. Cross-Cutting Notes

- **Supported brands** are centralised in `config.Affiliate.SUPPORTED_BRANDS` (six measured
  brands; Scale75 dropped for lack of measured data). The frontend offline fallback
  (`lib/paintMatcher.ts`) still references a `scale75` brand path — a stale remnant.
- **British English** throughout UI copy (project invariant).
- **Offline fallback is a parallel, simpler implementation** of detection + recipe
  derivation; it is explicitly non-authoritative and carries its own (looser) recipe logic.
  See the audit report for where it diverges from the backend.
