#!/usr/bin/env python3
"""
Deterministic paint-database builder (Prompt 2.6).

Consumes the verified reference files in scripts/sources/ (4 Vallejo + Army
Painter + Citadel) plus the preserved Scale75 entries from the current
paints.json, and emits a clean, schema-complete database.

NO SCRAPING. All paint data comes from the provided verified reference files.

Outputs (paints.json is NEVER overwritten — Cam reviews then swaps):
  - python-api/paints_rebuilt.json          (the rebuilt database)
  - scripts/sources/rebuild_report.md       (provenance + swatch worklist)
  - scripts/sources/name_aliases.json       (alias_name -> paint_id search map)

Run:
    cd python-api
    python scripts/build_paints_db.py
"""

import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path

# color_engine imports cv2 at module level; stub it so the builder runs without
# a full OpenCV install (we only need the colour-science / family classifier).
from unittest.mock import MagicMock
if 'cv2' not in sys.modules:
    sys.modules['cv2'] = MagicMock()

_SCRIPT_DIR = Path(__file__).resolve().parent
_PYTHON_API_DIR = _SCRIPT_DIR.parent
sys.path.insert(0, str(_PYTHON_API_DIR))

from core.color_engine import compute_color_family, RECOGNISED_FAMILIES  # noqa: E402

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

SOURCES_DIR = _SCRIPT_DIR / "sources"
PAINTS_JSON = _PYTHON_API_DIR / "paints.json"           # read-only (Scale75 source)
OUT_JSON = _PYTHON_API_DIR / "paints_rebuilt.json"
OUT_REPORT = SOURCES_DIR / "rebuild_report.md"
OUT_ALIASES = SOURCES_DIR / "name_aliases.json"

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Categories that are never a direct colour match (recommendation-only).
_NON_MATCHABLE_CATEGORIES = {'ink', 'technical', 'dry', 'glaze'}

# Name keywords marking a medium / auxiliary product (never a matchable paint).
_NON_PAINT_KEYWORDS = (
    'medium', 'thinner', 'varnish', 'primer', 'diluent', 'retarder',
    'flow improver', 'wet palette', 'mixing', 'sealer', 'remover',
)

# Known-discontinued Citadel paints (old wash range, replaced 2012).
_DISCONTINUED_CITADEL = {
    'Badab Black', 'Devlan Mud', 'Gryphonne Sepia', 'Thraka Green',
    'Asurmen Blue', 'Baal Red', 'Ogryn Flesh', 'Leviathan Purple',
}

_VALID_FINISHES = {'matte', 'satin', 'metallic', 'gloss'}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _slugify(*parts) -> str:
    """ASCII lowercase hyphenated slug, punctuation stripped."""
    raw = '-'.join(str(p) for p in parts if p)
    raw = unicodedata.normalize('NFKD', raw).encode('ascii', 'ignore').decode('ascii')
    raw = re.sub(r'[^A-Za-z0-9]+', '-', raw).strip('-').lower()
    return raw or 'paint'


class IdAllocator:
    """Allocates unique stable paint_ids; appends -2/-3 on collision."""

    def __init__(self):
        self._counts = {}
        self.collisions = []  # (slug, resolved_id)

    def make(self, *parts) -> str:
        base = _slugify(*parts)
        if base not in self._counts:
            self._counts[base] = 1
            return base
        self._counts[base] += 1
        resolved = f"{base}-{self._counts[base]}"
        self.collisions.append((base, resolved))
        return resolved


def _transparency_for(category: str) -> float:
    if category in ('wash', 'shade', 'ink'):
        return 0.85
    if category == 'contrast':
        return 0.7
    if category == 'glaze':
        return 0.9
    return 0.0


def _opacity_tag(transparency: float) -> str:
    if transparency == 0.0:
        return 'opaque'
    if transparency >= 0.7:
        return 'transparent'
    return 'semi-transparent'


def _build_tags(family: str, transparency: float, finish: str) -> list:
    tags = [_opacity_tag(transparency), f'family:{family}']
    if finish == 'metallic':
        tags.append('metallic')
    return tags


def _is_matchable(category: str, subrange: str, name: str, discontinued: bool) -> bool:
    if discontinued:
        return False
    if (subrange or '').lower() == 'ink':
        return False
    if category in _NON_MATCHABLE_CATEGORIES:
        return False
    nl = name.lower()
    if any(kw in nl for kw in _NON_PAINT_KEYWORDS):
        return False
    return True


def _assemble(ids: IdAllocator, *, brand, range_, name, hex_, code,
              category, finish, subrange, hex_source,
              aliases=None, citadel_equiv=None,
              color_family=None, discontinued=None, force_unmatchable=False) -> dict:
    """Produce one schema-complete paint record."""
    aliases = list(aliases or [])
    transparency = _transparency_for(category)

    if discontinued is None:
        discontinued = (brand == 'Citadel' and name in _DISCONTINUED_CITADEL)

    family = color_family if color_family in RECOGNISED_FAMILIES else \
        compute_color_family(hex_, finish)

    matchable = _is_matchable(category, subrange, name, discontinued)
    if force_unmatchable:
        matchable = False

    # Placeholder-hex guard: a matchable paint with a pure #000000/#FFFFFF hex
    # whose name isn't legitimately Black/White is untrustworthy for matching.
    # Keep it in the DB for reference but exclude it from colour matches.
    hx_upper = hex_.upper()
    nl = name.lower()
    if matchable and hx_upper in ('#FFFFFF', '#000000') \
            and 'white' not in nl and 'black' not in nl:
        matchable = False

    if brand == 'Citadel':
        pid = ids.make('Citadel', name)
    elif brand == 'Army Painter':
        pid = ids.make('army-painter', name)
    else:
        pid = ids.make(brand, range_, name)

    return {
        'paint_id': pid,
        'name': name,
        'brand': brand,
        'range': range_ or '',
        'hex': hex_.upper(),
        'code': code,
        'category': category,
        'finish': finish,
        'transparency': transparency,
        'color_family': family,
        'aliases': aliases,
        'citadel_equiv': citadel_equiv,
        'tags': _build_tags(family, transparency, finish),
        'matchable': matchable,
        'discontinued': discontinued,
        'hex_source': hex_source,
        'layer_sequence': None,
    }


def _load(name: str):
    with open(SOURCES_DIR / name, encoding='utf-8') as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Per-source builders
# ---------------------------------------------------------------------------

def build_gamecolor(ids):
    out = []
    for r in _load('ref_gamecolor.json'):
        sub = r.get('subrange', 'standard')
        if sub == 'ink':
            category, finish = 'ink', 'matte'
        elif sub == 'metallic':
            category, finish = 'base', 'metallic'
        else:
            category, finish = 'base', 'matte'
        out.append(_assemble(
            ids, brand='Vallejo', range_='Game Color', name=r['name'],
            hex_=r['hex'], code=r.get('code'), category=category, finish=finish,
            subrange=sub, hex_source='vector',
        ))
    return out


def build_modelcolor(ids):
    out = []
    for r in _load('ref_modelcolor.json'):
        sub = r.get('subrange', 'standard')
        finish = 'metallic' if sub == 'metallic' else 'matte'
        out.append(_assemble(
            ids, brand='Vallejo', range_='Model Color', name=r['name'],
            hex_=r['hex'], code=r.get('code'), category='base', finish=finish,
            subrange=sub, hex_source='vector',
        ))
    return out


def build_modelwash(ids):
    out = []
    for r in _load('ref_modelwash.json'):
        out.append(_assemble(
            ids, brand='Vallejo', range_='Model Wash', name=r['name'],
            hex_=r['hex'], code=r.get('code'), category='wash', finish='matte',
            subrange=r.get('subrange', 'wash'), hex_source='vector',
        ))
    return out


def build_truemetal(ids):
    out = []
    for r in _load('ref_truemetal.json'):
        out.append(_assemble(
            ids, brand='Vallejo', range_='True Metallic', name=r['name'],
            hex_=r['hex'], code=r.get('code'), category='base', finish='metallic',
            subrange=r.get('subrange', 'metallic'), hex_source='aggregator',
        ))
    return out


def build_armypainter(ids):
    out = []
    for r in _load('ref_armypainter.json'):
        out.append(_assemble(
            ids, brand='Army Painter', range_='Warpaints Fanatic', name=r['name'],
            hex_=r['hex'], code=None, category='base', finish='matte',
            subrange=r.get('subrange', 'standard'),
            hex_source=r.get('hex_source', 'aggregator'),
            aliases=r.get('aliases', []),
            citadel_equiv=r.get('citadel_equiv'),
        ))
    return out


def build_citadel(ids):
    out = []
    data = _load('ref_citadel.json')
    for p in data['paints']:
        category = p['category']
        is_metallic = bool(p.get('is_metallic_flag'))
        finish = 'metallic' if is_metallic else 'matte'
        hex_source = 'approximate' if is_metallic else p.get('hex_source', 'gw_official')
        gloss = bool(p.get('gloss'))
        out.append(_assemble(
            ids, brand='Citadel', range_=p.get('range', ''), name=p['name'],
            hex_=p['hex'], code=p.get('code'), category=category, finish=finish,
            subrange='standard', hex_source=hex_source,
            # Include the (HandWiki/GW) display name as a searchable alias.
            aliases=[p['name']],
            # Matte/gloss shade duplicates: keep matte matchable, gloss variant not.
            force_unmatchable=gloss,
        ))
    return out


def build_scale75(ids):
    """Preserve existing Scale75 entries verbatim, re-tagged into the new schema."""
    if not PAINTS_JSON.exists():
        return []
    with open(PAINTS_JSON, encoding='utf-8') as f:
        current = json.load(f)
    out = []
    for p in current:
        if p.get('brand') != 'Scale75':
            continue
        name = p['name']
        hex_ = p['hex']
        category = p.get('category', 'base')
        finish = p.get('finish', 'matte')
        # Preserve existing family when valid; only recompute if out of vocabulary.
        existing_family = (p.get('color_family') or '').lower()
        color_family = existing_family if existing_family in RECOGNISED_FAMILIES else None
        out.append(_assemble(
            ids, brand='Scale75', range_='', name=name, hex_=hex_,
            code=p.get('code'), category=category, finish=finish,
            subrange='standard', hex_source='legacy',
            color_family=color_family,
        ))
    return out


# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------

def write_aliases(paints: list) -> int:
    alias_map = {}
    collisions = 0
    for p in paints:
        for alias in p.get('aliases', []):
            if not alias:
                continue
            if alias in alias_map and alias_map[alias] != p['paint_id']:
                collisions += 1
                continue  # keep first
            alias_map[alias] = p['paint_id']
    with open(OUT_ALIASES, 'w', encoding='utf-8') as f:
        json.dump(alias_map, f, ensure_ascii=False, indent=2, sort_keys=True)
    return len(alias_map), collisions


def write_report(paints: list, ids: IdAllocator, alias_count: int,
                 alias_collisions: int) -> None:
    total = len(paints)
    by_brand = Counter(p['brand'] for p in paints)
    by_range = Counter(f"{p['brand']} — {p['range'] or '(no range)'}" for p in paints)
    by_family = Counter(p['color_family'] for p in paints)
    by_hex_source = Counter(p['hex_source'] for p in paints)
    by_category = Counter(p['category'] for p in paints)
    matchable = sum(1 for p in paints if p['matchable'])
    discontinued = [p for p in paints if p['discontinued']]

    # Swatch-photography worklist: hexes that are not measured/official.
    worklist_sources = {'aggregator', 'approximate', 'legacy'}
    worklist = defaultdict(list)
    for p in paints:
        if p['hex_source'] in worklist_sources:
            worklist[p['brand']].append(p)

    L = []
    A = L.append
    A("# Paint Database Rebuild Report")
    A("")
    A(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    A("")
    A("## Totals")
    A("")
    A("| Metric | Count |")
    A("|--------|-------|")
    A(f"| Total paints | {total} |")
    A(f"| Matchable | {matchable} |")
    A(f"| Unmatchable | {total - matchable} |")
    A(f"| Discontinued | {len(discontinued)} |")
    A(f"| paint_id collisions resolved | {len(ids.collisions)} |")
    A(f"| Aliases indexed (name_aliases.json) | {alias_count} |")
    A(f"| Alias collisions skipped | {alias_collisions} |")
    A("")

    A("## By brand")
    A("")
    A("| Brand | Count |")
    A("|-------|-------|")
    for b, c in by_brand.most_common():
        A(f"| {b} | {c} |")
    A("")

    A("## By range")
    A("")
    A("| Range | Count |")
    A("|-------|-------|")
    for r, c in by_range.most_common():
        A(f"| {r} | {c} |")
    A("")

    A("## By category")
    A("")
    A("| Category | Count |")
    A("|----------|-------|")
    for cat, c in by_category.most_common():
        A(f"| {cat} | {c} |")
    A("")

    A("## subrange → category mapping")
    A("")
    A("- Game Color `standard` → base; `ink` → ink (unmatchable); `metallic` → base + metallic finish")
    A("- Model Color `standard` → base; `metallic` → base + metallic finish")
    A("- Model Wash `wash` → wash (transparency 0.85)")
    A("- True Metallic `metallic` → base + metallic finish (hex_source aggregator)")
    A("- Army Painter `standard` → base (hex_source aggregator)")
    A("- Citadel: category provided by source; `is_metallic_flag` → metallic finish; `gloss` variant → unmatchable")
    A("")

    A("## Family distribution")
    A("")
    A("| Family | Count |")
    A("|--------|-------|")
    for fam, c in by_family.most_common():
        A(f"| {fam} | {c} |")
    A("")

    A("## hex_source breakdown")
    A("")
    A("| hex_source | Count |")
    A("|------------|-------|")
    for src, c in by_hex_source.most_common():
        A(f"| {src} | {c} |")
    A("")

    if discontinued:
        A(f"## Discontinued flagged ({len(discontinued)})")
        A("")
        for p in discontinued:
            A(f"- {p['brand']} / {p['name']} (`{p['paint_id']}`)")
        A("")

    if ids.collisions:
        A(f"## paint_id collisions resolved ({len(ids.collisions)})")
        A("")
        for base, resolved in ids.collisions:
            A(f"- `{base}` → `{resolved}`")
        A("")

    # The worklist is the Prompt 6 buy/photograph priority list.
    worklist_total = sum(len(v) for v in worklist.values())
    A(f"## Swatch-photography worklist ({worklist_total})")
    A("")
    A("Paints whose hex is **not** measured/official (`aggregator`/`approximate`/"
      "`legacy`). These are the priority list for Prompt 6 swatch photography — "
      "ingesting a real swatch upgrades the hex and `hex_source`.")
    A("")
    for brand in sorted(worklist):
        items = worklist[brand]
        A(f"### {brand} ({len(items)})")
        A("")
        for p in sorted(items, key=lambda x: x['name']):
            A(f"- {p['name']} — `{p['hex']}` ({p['hex_source']})")
        A("")

    OUT_REPORT.write_text("\n".join(L), encoding='utf-8')


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if not SOURCES_DIR.exists():
        sys.exit(f"ERROR: sources directory not found at {SOURCES_DIR}")

    ids = IdAllocator()
    paints = []
    paints += build_gamecolor(ids)
    paints += build_modelcolor(ids)
    paints += build_modelwash(ids)
    paints += build_truemetal(ids)
    paints += build_armypainter(ids)
    paints += build_citadel(ids)
    paints += build_scale75(ids)

    with open(OUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(paints, f, ensure_ascii=False, indent=2)

    alias_count, alias_collisions = write_aliases(paints)
    write_report(paints, ids, alias_count, alias_collisions)

    matchable = sum(1 for p in paints if p['matchable'])
    by_brand = Counter(p['brand'] for p in paints)
    print(f"Built {len(paints)} paints ({matchable} matchable) -> {OUT_JSON.name}")
    for b, c in by_brand.most_common():
        print(f"  {b}: {c}")
    print(f"Report  -> {OUT_REPORT.relative_to(_PYTHON_API_DIR)}")
    print(f"Aliases -> {OUT_ALIASES.relative_to(_PYTHON_API_DIR)} ({alias_count} entries)")
    print("Review the report, then swap paints_rebuilt.json -> paints.json.")


if __name__ == "__main__":
    main()
