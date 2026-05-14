"""
Paint Database Auto-Fix Script
Fixes identified issues in paints_v3.json and outputs paints_v3_fixed.json
"""
import json
import colorsys
from pathlib import Path
from typing import Dict, List, Tuple, Set
import re


def hex_to_hsv(hex_color: str) -> Tuple[float, float, float]:
    """Convert hex to HSV (h: 0-360, s: 0-1, v: 0-1)"""
    hex_color = hex_color.lstrip('#')
    r, g, b = [int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4)]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    return (h * 360, s, v)


def hex_to_lab(hex_color: str) -> Tuple[float, float, float]:
    """Convert hex to LAB color space"""
    hex_color = hex_color.lstrip('#')
    r, g, b = [int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4)]

    def linearize(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r_lin, g_lin, b_lin = linearize(r), linearize(g), linearize(b)

    x = r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375
    y = r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750
    z = r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041

    x /= 0.95047
    y /= 1.00000
    z /= 1.08883

    def f(t):
        return t ** (1/3) if t > 0.008856 else (7.787 * t) + (16 / 116)

    L = 116 * f(y) - 16
    a = 500 * (f(x) - f(y))
    b_val = 200 * (f(y) - f(z))

    return (L, a, b_val)


def get_chroma(hex_color: str) -> float:
    """Calculate chroma from LAB color space"""
    L, a, b = hex_to_lab(hex_color)
    return (a ** 2 + b ** 2) ** 0.5


def classify_color_family(hex_color: str) -> str:
    """Determine color family from hex code using HSV analysis"""
    h, s, v = hex_to_hsv(hex_color)
    chroma = get_chroma(hex_color)

    # Achromatic detection
    if s < 0.10:
        if v > 0.90:
            return "white"
        if v < 0.15:
            return "black"
        return "grey"

    # Low saturation colors
    if s < 0.20:
        if 180 < h < 260 and chroma > 3:
            return "blue"
        if 70 < h < 170 and chroma > 4:
            return "green"
        if 260 < h < 320 and chroma > 3:
            return "purple"
        if v > 0.75:
            return "white"
        if v < 0.3:
            return "black"
        return "grey"

    # Brown detection
    if 10 < h < 50 and s < 0.6 and v < 0.5:
        return "brown"

    # Chromatic classification by hue
    if h < 15 or h >= 345:
        if s > 0.35 and v > 0.55:
            return "pink"
        return "red"
    if 15 <= h < 35:
        if s < 0.5 and v < 0.5:
            return "brown"
        return "orange"
    if 35 <= h < 70:
        if v > 0.45 and s > 0.35:
            return "yellow"
        if s < 0.4:
            return "brown"
        return "yellow"
    if 70 <= h < 150:
        return "green"
    if 150 <= h < 180:
        return "cyan"
    if 180 <= h < 260:
        return "blue"
    if 260 <= h < 290:
        return "purple"
    if 290 <= h < 330:
        if v > 0.5 and s > 0.3:
            return "pink"
        return "purple"
    if 330 <= h < 345:
        return "red"

    return "unknown"


def is_family_reasonably_close(stated: str, computed: str, hex_color: str) -> bool:
    """
    Determine if stated family is reasonably close to computed family.
    Some flexibility is allowed for edge cases.
    """
    if stated == computed:
        return True

    h, s, v = hex_to_hsv(hex_color)

    # Define reasonable transitions
    close_families = {
        'brown': {'orange', 'red', 'yellow', 'grey'},
        'flesh': {'orange', 'pink', 'brown', 'red', 'white'},
        'gold': {'yellow', 'orange', 'brown'},
        'silver': {'grey', 'white', 'blue'},
        'bronze': {'orange', 'brown', 'red', 'gold', 'copper'},
        'copper': {'orange', 'brown', 'red', 'bronze'},
        'bone': {'white', 'yellow', 'grey', 'brown'},
        'tan': {'brown', 'orange', 'yellow'},
        'beige': {'brown', 'white', 'yellow'},
        'olive': {'green', 'yellow', 'brown'},
        'cyan': {'green', 'blue'},
        'yellow': {'green', 'orange'},
        'orange': {'yellow', 'brown', 'red'},
        'pink': {'red', 'purple', 'white'},
        'purple': {'blue', 'pink', 'red'},
        'red': {'orange', 'pink', 'brown'},
        'blue': {'purple', 'cyan', 'grey'},
        'green': {'cyan', 'yellow'},
        'grey': {'white', 'black', 'blue', 'brown'},
        'white': {'grey', 'bone'},
        'black': {'grey'},
    }

    # Check bidirectional compatibility
    if computed in close_families.get(stated, set()):
        return True
    if stated in close_families.get(computed, set()):
        return True

    return False


def should_fix_color_family(paint: Dict) -> Tuple[bool, str]:
    """
    Determine if a paint's color family should be fixed.
    Returns (should_fix, new_family)
    """
    hex_color = paint.get('hex', '#000000')
    stated_family = paint.get('color_family', '').lower()
    computed_family = classify_color_family(hex_color)

    # Don't touch special families that are hard to auto-classify
    special_families = {'flesh', 'gold', 'silver', 'bronze', 'copper', 'bone', 'tan', 'beige', 'olive'}

    if stated_family in special_families:
        return False, stated_family

    # Check if the families are reasonably close
    if is_family_reasonably_close(stated_family, computed_family, hex_color):
        return False, stated_family

    # Fix the family
    return True, computed_family


def fix_database(db_path: str) -> Tuple[List[Dict], Dict[str, int]]:
    """
    Fix issues in the paint database.
    Returns (fixed_paints, stats)
    """
    with open(db_path, 'r', encoding='utf-8') as f:
        paints = json.load(f)

    stats = {
        'total_paints': len(paints),
        'color_family_fixed': 0,
        'duplicates_removed': 0,
        'code_names_marked': 0,
        'transparency_fixed': 0,
    }

    # Track seen paints for duplicate removal
    seen: Set[str] = set()
    fixed_paints: List[Dict] = []

    for paint in paints:
        name = paint.get('name', '')
        brand = paint.get('brand', '')
        category = paint.get('category', '')
        transparency = paint.get('transparency', 0)

        # Create unique key for duplicate detection
        key = f"{brand}|{name}"

        # Skip duplicates
        if key in seen:
            stats['duplicates_removed'] += 1
            continue
        seen.add(key)

        # Make a copy to modify
        fixed_paint = paint.copy()

        # Fix color family if needed
        should_fix, new_family = should_fix_color_family(paint)
        if should_fix:
            old_family = fixed_paint.get('color_family', '')
            fixed_paint['color_family'] = new_family
            # Also update tags if present
            if 'tags' in fixed_paint:
                fixed_paint['tags'] = [
                    t if not t.startswith('family:') else f'family:{new_family}'
                    for t in fixed_paint['tags']
                ]
            stats['color_family_fixed'] += 1

        # Mark paints with code-style names
        if name.startswith('CP') or (name and name[0].isdigit() and '.' in name):
            if 'tags' not in fixed_paint:
                fixed_paint['tags'] = []
            if 'needs-name' not in fixed_paint['tags']:
                fixed_paint['tags'].append('needs-name')
            stats['code_names_marked'] += 1

        # Fix transparency inconsistencies
        if category == 'wash' and transparency < 0.5:
            fixed_paint['transparency'] = 0.7
            stats['transparency_fixed'] += 1
        elif category in ['base', 'layer'] and transparency > 0.5:
            fixed_paint['transparency'] = 0.1
            stats['transparency_fixed'] += 1

        fixed_paints.append(fixed_paint)

    return fixed_paints, stats


def main():
    db_path = Path(__file__).parent.parent / "paints_v3.json"

    if not db_path.exists():
        print(f"Error: Database not found at {db_path}")
        return

    print(f"Processing: {db_path}")

    # Fix the database
    fixed_paints, stats = fix_database(str(db_path))

    # Save the fixed database
    output_path = db_path.parent / "paints_v3_fixed.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(fixed_paints, f, indent=2)

    print(f"\nFixed database saved to: {output_path}")
    print("\n" + "=" * 50)
    print("FIX SUMMARY")
    print("=" * 50)
    print(f"Total paints processed: {stats['total_paints']}")
    print(f"Color families fixed: {stats['color_family_fixed']}")
    print(f"Duplicates removed: {stats['duplicates_removed']}")
    print(f"Code names marked: {stats['code_names_marked']}")
    print(f"Transparency values fixed: {stats['transparency_fixed']}")
    print(f"\nFinal paint count: {len(fixed_paints)}")


if __name__ == "__main__":
    main()
