"""
Shared recipe assembly for the scanner services.

Both MiniatureScannerService and InspirationScannerService had near-identical
recipe-building code; it now lives here. Base/highlight/shade come from the
graph-driven engine output (already resolved Paint matches carrying an optional
`source`); the wash slot prefers the engine's graph-resolved wash and falls back
to the family-based WashMapping lookup.
"""

import logging
from typing import Dict, List, Optional

from core.colour_maths import ciede2000_single, rgb_to_lab
from config import WashMapping

logger = logging.getLogger(__name__)

# Brand display name -> frontend recipe key. Mirrors Affiliate.SUPPORTED_BRANDS
# (the six brands with measured ground truth). Scale75 is intentionally absent —
# it has no measured data, so it must never surface a (wash-only) recipe.
BRAND_KEYS = {
    'Citadel': 'citadel',
    'Vallejo': 'vallejo',
    'Army Painter': 'army_painter',
    'AK': 'ak',
    'Pro Acryl': 'pro_acryl',
    'Two Thin Coats': 'two_thin_coats',
}
WASH_CATEGORIES = ('wash', 'shade', 'ink')


def hex_to_rgb(hex_color: str) -> List[int]:
    hex_color = hex_color.lstrip('#')
    return [int(hex_color[i:i + 2], 16) for i in (0, 2, 4)]


def format_paint_match(match: Optional[Dict], color_lab: List[float] = None) -> Optional[Dict]:
    """Format a single paint match dict for the API, carrying through `source`."""
    if not match:
        return None

    result = {
        'name': match.get('name'),
        'hex': match.get('hex'),
        'type': match.get('type', 'paint'),
    }
    # Relationship provenance: 'official' | 'computed' (absent for the base slot).
    if match.get('source'):
        result['source'] = match['source']

    if color_lab and match.get('hex'):
        try:
            delta_e = ciede2000_single(rgb_to_lab(hex_to_rgb(match['hex'])), color_lab)
            result['deltaE'] = round(float(delta_e), 1)
        except Exception:
            result['deltaE'] = 0

    return result


def _find_wash_paint(wash_db: List[Dict], brand: str, name: str) -> Optional[Dict]:
    """A wash/shade/ink paint of `brand` whose name matches `name` — exact
    (case-insensitive) first, then containment as a defensive fallback."""
    if not name:
        return None
    bl, nl = brand.lower(), name.lower()
    cands = [w for w in wash_db
             if w.get('brand', '').lower() == bl
             and (w.get('category', '').lower() in WASH_CATEGORIES
                  or not w.get('category'))]
    for w in cands:
        if w.get('name', '').lower() == nl:
            return w
    for w in cands:
        if nl in w.get('name', '').lower():
            return w
    return None


def _wash_result(paint: Dict, color_lab: List[float], source: str) -> Dict:
    """Assemble the API wash dict, tagging provenance ('official' | 'cross-brand')."""
    result = {
        'name': paint.get('name'),
        'hex': paint.get('hex', '#000000'),
        'type': 'wash',
        'source': source,
    }
    if color_lab and paint.get('hex'):
        try:
            delta_e = ciede2000_single(rgb_to_lab(hex_to_rgb(paint['hex'])), color_lab)
            result['deltaE'] = round(float(delta_e), 1)
        except Exception:
            result['deltaE'] = 0
    return result


def get_wash_for_family(family: str, brand: str, color_lab: List[float],
                        wash_db: List[Dict]) -> Dict:
    """Derive the wash slot from the detected base family — guaranteed-fill,
    NEVER returns None (a wash is implied by the base, like the highlight).

    Ladder (Phase 3.2):
      1. family -> archetype -> the REQUESTED brand's matching wash  -> 'official'
      2. the requested brand's universal dark/earth wash             -> 'official'
      3. cross-brand universal (Citadel Nuln Oil / archetype)        -> 'cross-brand'
      4. name-only display fallback (should never be reached)        -> 'cross-brand'
    """
    archetypes = WashMapping.archetypes_for_family(family)

    # 1. The requested brand's own wash for the best-matching archetype.
    for arch in archetypes:
        name = WashMapping.brand_wash_name(brand, arch)
        paint = _find_wash_paint(wash_db, brand, name)
        if paint:
            return _wash_result(paint, color_lab, 'official')

    # 2. The requested brand's universal dark/earth wash.
    name = WashMapping.brand_wash_name(brand, WashMapping.UNIVERSAL_ARCHETYPE)
    paint = _find_wash_paint(wash_db, brand, name)
    if paint:
        return _wash_result(paint, color_lab, 'official')

    # 3. Cross-brand universal — the donor brand's archetype wash, then its dark.
    donor = WashMapping.CROSS_BRAND_DONOR
    for arch in list(archetypes) + [WashMapping.UNIVERSAL_ARCHETYPE]:
        name = WashMapping.brand_wash_name(donor, arch)
        paint = _find_wash_paint(wash_db, donor, name)
        if paint:
            return _wash_result(paint, color_lab, 'cross-brand')

    # 4. Last-ditch fallback (no wash data loaded at all).
    return None


def build_paint_recipe(recipe: Dict, family: str, color_lab: List[float],
                       wash_db: List[Dict]) -> Dict:
    """Build the per-brand {base, shade, highlight, wash} recipe.

    base/shade/highlight come from the graph-driven engine output; the wash slot
    prefers the engine's graph wash (recipe['wash'][brand]) and otherwise falls
    back to the family-based WashMapping lookup.
    """
    paint_recipe = {}
    for brand, brand_key in BRAND_KEYS.items():
        # Only emit brands the engine actually matched against (its base dict is
        # keyed by every brand it processed). This guards against ever surfacing a
        # wash-only recipe for an unsupported brand the engine never scored.
        if brand not in recipe.get('base', {}):
            continue
        base_match = recipe.get('base', {}).get(brand)
        highlight_match = recipe.get('highlight', {}).get(brand)
        shade_match = recipe.get('shade', {}).get(brand)

        graph_wash = recipe.get('wash', {}).get(brand)
        if graph_wash:
            wash_match = format_paint_match(graph_wash, color_lab)
        else:
            wash_match = get_wash_for_family(family, brand, color_lab, wash_db)

        paint_recipe[brand_key] = {
            'base': format_paint_match(base_match, color_lab),
            'shade': format_paint_match(shade_match, color_lab),
            'highlight': format_paint_match(highlight_match, color_lab),
            'wash': wash_match,
        }
    return paint_recipe
