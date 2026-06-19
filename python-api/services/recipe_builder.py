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

import numpy as np
from skimage import color as sk_color

from core.colour_maths import ciede2000_single
from config import WashMapping

logger = logging.getLogger(__name__)

BRAND_KEYS = {
    'Citadel': 'citadel',
    'Vallejo': 'vallejo',
    'Army Painter': 'army_painter',
    'Scale75': 'scale75',
}
WASH_CATEGORIES = ('wash', 'shade', 'ink')


def hex_to_rgb(hex_color: str) -> List[int]:
    hex_color = hex_color.lstrip('#')
    return [int(hex_color[i:i + 2], 16) for i in (0, 2, 4)]


def rgb_to_lab(rgb: List[int]) -> List[float]:
    rgb_norm = np.array(rgb) / 255.0
    lab = sk_color.rgb2lab(np.array([[rgb_norm]]))[0][0]
    return [float(lab[0]), float(lab[1]), float(lab[2])]


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


def get_wash_for_family(family: str, brand: str, color_lab: List[float],
                        wash_db: List[Dict]) -> Optional[Dict]:
    """Fallback wash lookup: family -> WashMapping name -> matching wash in DB."""
    wash_name = WashMapping.get_recommended_wash(family, brand)

    matching = None
    for wash in wash_db:
        if (wash.get('brand', '').lower() == brand.lower()
                and wash_name.lower() in wash.get('name', '').lower()):
            matching = wash
            break
    if not matching:
        for wash in wash_db:
            if wash.get('brand', '').lower() == brand.lower():
                parts = wash_name.lower().split()
                db_name = wash.get('name', '').lower()
                if any(part in db_name for part in parts):
                    matching = wash
                    break

    if not matching:
        return {'name': wash_name, 'hex': '#000000', 'type': 'wash', 'deltaE': 0}

    result = {'name': matching.get('name', wash_name),
              'hex': matching.get('hex', '#000000'), 'type': 'wash'}
    if color_lab and matching.get('hex'):
        try:
            delta_e = ciede2000_single(rgb_to_lab(hex_to_rgb(matching['hex'])), color_lab)
            result['deltaE'] = round(float(delta_e), 1)
        except Exception:
            result['deltaE'] = 0
    return result


def build_paint_recipe(recipe: Dict, family: str, color_lab: List[float],
                       wash_db: List[Dict]) -> Dict:
    """Build the per-brand {base, shade, highlight, wash} recipe.

    base/shade/highlight come from the graph-driven engine output; the wash slot
    prefers the engine's graph wash (recipe['wash'][brand]) and otherwise falls
    back to the family-based WashMapping lookup.
    """
    paint_recipe = {}
    for brand, brand_key in BRAND_KEYS.items():
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
