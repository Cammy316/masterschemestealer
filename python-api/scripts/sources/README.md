# Paint Database Rebuild Pipeline (Prompt 2.6)

This directory holds the **verified reference files** the paint database is built
from, plus the build outputs. There is **no scraping** — all paint data is
hand-checked and committed here.

## Reference files (inputs — committed)

| File | Brand / range | Count | Notes |
|------|---------------|-------|-------|
| `ref_gamecolor.json` | Vallejo — Game Color | 90 | `standard`→base, `ink`→ink (unmatchable), `metallic`→base+metallic |
| `ref_modelcolor.json` | Vallejo — Model Color | 108 | base; `metallic`→metallic finish |
| `ref_modelwash.json` | Vallejo — Model Wash | 18 | wash, transparency 0.85 |
| `ref_truemetal.json` | Vallejo — True Metallic | 20 | base + metallic finish; `hex_source: aggregator` |
| `ref_armypainter.json` | Army Painter — Warpaints Fanatic | 197 | base; carries `aliases` (old names) + `citadel_equiv` |
| `ref_citadel.json` | Citadel | 190 | `{brand, source_urls, scraped_at, paints[]}`; categories pre-lowercased |

Scale75 is **parked** — its existing entries are preserved verbatim from the
current `paints.json` and re-tagged into the new schema with `hex_source: legacy`.

### Reference entry schemas

Vallejo: `{ "code", "name", "hex", "subrange" }` (`subrange ∈ standard|metallic|wash|ink`)

Army Painter: `{ "name", "hex", "aliases", "citadel_equiv", "hex_source", "subrange" }`

Citadel paint: `{ "name", "code", "range", "category", "hex", "is_metallic_flag", "gloss", "hex_source" }`

## Pipeline

```bash
cd python-api

# 1. Build the rebuilt DB (never overwrites paints.json)
python scripts/build_paints_db.py
#   -> paints_rebuilt.json
#   -> scripts/sources/rebuild_report.md
#   -> scripts/sources/name_aliases.json

# 2. Validate it (structural + loads through the real engine + regression checks)
python scripts/validate_paints_db.py        # must print PASS

# 3. Review rebuild_report.md — family distribution + swatch worklist

# 4. Swap it in when satisfied (manual — Cam does this)
#    mv paints_rebuilt.json paints.json   (keep a backup first)

# 5. Regenerate the frontend offline DB
cd ../schemestealer-react
node scripts/generatePaintDatabase.js       # reads paints_rebuilt.json if present,
                                             # else paints.json

# 6. Run the eval harness (optional — needs fixture images)
cd ../python-api
python eval/run_eval.py
```

## Output schema (`paints_rebuilt.json`)

Every record:

```json
{
  "paint_id": "vallejo-game-color-dead-white",
  "name": "Dead White", "brand": "Vallejo", "range": "Game Color",
  "hex": "#FFFFFF", "code": "72.001",
  "category": "base", "finish": "matte", "transparency": 0.0,
  "color_family": "white", "aliases": [], "citadel_equiv": null,
  "tags": ["opaque", "family:white"],
  "matchable": true, "discontinued": false,
  "hex_source": "vector", "layer_sequence": null
}
```

- **`paint_id`** — stable slug `{brand}-{range}-{name}` (Citadel: `{brand}-{name}`;
  Army Painter: `army-painter-{name}`). The durable join key for recipes (Prompt 5)
  and appearance samples / feedback (Prompt 6). **Never changes** even if the
  display name does.
- **`color_family`** — computed from the hex by the engine's own classifier
  (`core.color_engine.compute_color_family`), never taken from a source. DB and
  scan-time families come from one code path.
- **`matchable: false`** — inks, technical/dry/glaze categories, mediums/primers/
  varnishes, discontinued paints, and the gloss variant of duplicate Citadel
  shades. Kept in the DB for reference + alias search, excluded from matching.

### `hex_source` semantics

| Value | Meaning | Swatch worklist? |
|-------|---------|------------------|
| `gw_official` | Official GW table hex | No |
| `vector` | Vallejo vector chart | No |
| `aggregator` | Pixel-sampled from an aggregator | **Yes** |
| `approximate` | Approximate (Citadel metallics) | **Yes** |
| `legacy` | Carried from the old DB (Scale75) | **Yes** |

`aggregator` / `approximate` / `legacy` are the **Prompt 6 swatch-photography
worklist** (see `rebuild_report.md`). Ingesting a real measured swatch for one of
these upgrades its hex and flips `hex_source`.

## `name_aliases.json`

Flat `alias_name → paint_id` map (Army Painter old Warpaints names, Citadel
display names). Used so customers with OLD pots can search by the name on their
pot. Consumed client-side via `findPaintsByNameOrAlias()` in
`schemestealer-react/lib/paintMatcher.ts`; aliases are also served verbatim by
the backend `/api/paints` endpoint (it returns the full `paints.json`, every
record of which carries `aliases`).

`citadel_equiv` is stored **per-paint** (not in the flat alias map, to avoid
key collisions with the real Citadel paint) for a future "show the GW equivalent"
feature and cross-brand recipe suggestions (Prompt 5).

## Accepted gaps

- **Citadel Contrast range** is not in `ref_citadel.json` (the source table
  omitted it). ~35 Contrast paints can be added later via the same
  reference-file mechanism without disturbing anything.
