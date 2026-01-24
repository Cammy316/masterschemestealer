#!/usr/bin/env python3
"""
paints_v3_cleanup.py - Fix database issues in paints_v3.json

This script fixes:
1. Null/empty paint names
2. Washes incorrectly categorized
3. Color family mismatches for achromatic colors
4. Transparency values for known washes

Run this BEFORE using the database in production.

Usage:
    python paints_v3_cleanup.py [input_file] [output_file]

Defaults:
    input_file: paints_v3.json
    output_file: paints_v3_fixed.json
"""

import json
import colorsys
import sys


def hex_to_hsv(hex_color: str) -> tuple:
    """Convert hex color to HSV tuple"""
    h = hex_color.lstrip('#')
    if len(h) != 6:
        return (0, 0, 0)
    r, g, b = tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))
    return colorsys.rgb_to_hsv(r, g, b)


def hex_to_rgb(hex_color: str) -> tuple:
    """Convert hex color to RGB tuple (0-255)"""
    h = hex_color.lstrip('#')
    if len(h) != 6:
        return (0, 0, 0)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def fix_database(input_path: str = 'paints_v3.json',
                 output_path: str = 'paints_v3_fixed.json') -> dict:
    """
    Fix database issues in paints_v3.json

    Returns dict with fix statistics
    """
    with open(input_path, 'r') as f:
        paints = json.load(f)

    fixes_made = {
        'null_names': 0,
        'wrong_category': 0,
        'color_family_fixes': 0,
        'transparency_fixes': 0,
        'total_paints': len(paints)
    }

    # Known washes that must be marked correctly (lowercase for matching)
    KNOWN_WASHES = {
        # Citadel
        'nuln oil', 'agrax earthshade', 'reikland fleshshade', 'drakenhof nightshade',
        'biel-tan green', 'carroburg crimson', 'seraphim sepia', 'casandora yellow',
        'fuegan orange', 'druchii violet', 'coelia greenshade', 'athonian camoshade',
        'nuln oil gloss', 'agrax earthshade gloss', 'reikland fleshshade gloss',
        # Army Painter
        'red tone', 'blue tone', 'green tone', 'dark tone', 'strong tone',
        'soft tone', 'flesh wash', 'purple tone', 'light tone', 'military shader',
        'quickshade wash', 'dark quickshade', 'strong quickshade', 'soft quickshade',
        # Vallejo
        'red wash', 'blue wash', 'green wash', 'black wash', 'sepia wash',
        'umber shade', 'flesh wash', 'oiled earth', 'dark grey wash',
        # Generic
        'wash', 'shade', 'ink', 'glaze'
    }

    # Partial matches for wash detection
    WASH_KEYWORDS = ['wash', 'shade', 'tone', 'ink', 'glaze', 'quickshade']

    for paint in paints:
        name = paint.get('name', '') or ''
        name_lower = name.lower()
        hex_color = paint.get('hex', '#000000')

        # =====================================================================
        # Fix 1: Replace null/empty names with descriptive names
        # =====================================================================
        if name == 'null' or name is None or name == '' or name.strip() == '':
            brand = paint.get('brand', 'Unknown')
            family = paint.get('color_family', 'unknown')
            # Create a descriptive name
            paint['name'] = f"{brand} {family.title()} ({hex_color})"
            fixes_made['null_names'] += 1
            name = paint['name']
            name_lower = name.lower()

        # =====================================================================
        # Fix 2: Ensure known washes are marked correctly
        # =====================================================================
        is_known_wash = (
            name_lower in KNOWN_WASHES or
            any(kw in name_lower for kw in WASH_KEYWORDS)
        )

        if is_known_wash:
            # Fix category
            if paint.get('category') not in ['wash', 'shade', 'ink', 'contrast', 'glaze']:
                paint['category'] = 'wash'
                fixes_made['wrong_category'] += 1

            # Fix transparency
            if paint.get('transparency', 0) < 0.5:
                paint['transparency'] = 0.85
                fixes_made['transparency_fixes'] += 1

        # =====================================================================
        # Fix 3: Validate color_family based on HSV for achromatic colors
        # =====================================================================
        hsv = hex_to_hsv(hex_color)
        h, s, v = hsv[0] * 360, hsv[1], hsv[2]
        current_family = paint.get('color_family', '')

        # Check for achromatic colors that are mislabeled
        # Very low saturation should be grey/black/white
        if s < 0.12:
            if current_family not in ['grey', 'black', 'white', 'silver']:
                # Determine correct achromatic family based on value
                if v < 0.15:
                    new_family = 'black'
                elif v > 0.85:
                    new_family = 'white'
                else:
                    new_family = 'grey'

                paint['color_family'] = new_family
                fixes_made['color_family_fixes'] += 1

    # Save fixed database
    with open(output_path, 'w') as f:
        json.dump(paints, f, indent=2)

    return fixes_made


def print_report(fixes: dict):
    """Print cleanup report"""
    print("=" * 60)
    print("PAINTS DATABASE CLEANUP REPORT")
    print("=" * 60)
    print(f"Total paints processed: {fixes['total_paints']}")
    print("-" * 60)
    print(f"Null/empty names fixed:    {fixes['null_names']}")
    print(f"Wrong categories fixed:    {fixes['wrong_category']}")
    print(f"Color family fixes:        {fixes['color_family_fixes']}")
    print(f"Transparency fixes:        {fixes['transparency_fixes']}")
    print("-" * 60)
    total_fixes = (fixes['null_names'] + fixes['wrong_category'] +
                   fixes['color_family_fixes'] + fixes['transparency_fixes'])
    print(f"TOTAL FIXES APPLIED:       {total_fixes}")
    print("=" * 60)


def validate_database(path: str) -> dict:
    """Validate database and return statistics"""
    with open(path, 'r') as f:
        paints = json.load(f)

    stats = {
        'total': len(paints),
        'null_names': 0,
        'by_category': {},
        'by_family': {},
        'washes_in_base': 0,
        'achromatic_mislabeled': 0
    }

    WASH_KEYWORDS = ['wash', 'shade', 'tone', 'ink', 'glaze']

    for paint in paints:
        name = paint.get('name', '') or ''

        # Count null names
        if name == 'null' or name is None or name == '':
            stats['null_names'] += 1

        # Count by category
        cat = paint.get('category', 'unknown')
        stats['by_category'][cat] = stats['by_category'].get(cat, 0) + 1

        # Count by family
        fam = paint.get('color_family', 'unknown')
        stats['by_family'][fam] = stats['by_family'].get(fam, 0) + 1

        # Check for washes in base category
        if cat == 'base' and any(kw in name.lower() for kw in WASH_KEYWORDS):
            stats['washes_in_base'] += 1

        # Check for mislabeled achromatic
        hsv = hex_to_hsv(paint.get('hex', '#000000'))
        if hsv[1] < 0.12 and fam not in ['grey', 'black', 'white', 'silver']:
            stats['achromatic_mislabeled'] += 1

    return stats


def print_validation(stats: dict):
    """Print validation report"""
    print("\n" + "=" * 60)
    print("DATABASE VALIDATION REPORT")
    print("=" * 60)
    print(f"Total paints: {stats['total']}")
    print(f"Null names: {stats['null_names']}")
    print(f"Washes incorrectly in base: {stats['washes_in_base']}")
    print(f"Achromatic colors mislabeled: {stats['achromatic_mislabeled']}")

    print("\nBy Category:")
    for cat, count in sorted(stats['by_category'].items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")

    print("\nBy Color Family (top 15):")
    for fam, count in sorted(stats['by_family'].items(), key=lambda x: -x[1])[:15]:
        print(f"  {fam}: {count}")


if __name__ == '__main__':
    input_file = sys.argv[1] if len(sys.argv) > 1 else 'paints_v3.json'
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'paints_v3_fixed.json'

    print(f"Input:  {input_file}")
    print(f"Output: {output_file}")
    print()

    # Validate before
    print("BEFORE CLEANUP:")
    stats_before = validate_database(input_file)
    print_validation(stats_before)

    # Run cleanup
    print("\n" + "-" * 60)
    print("RUNNING CLEANUP...")
    print("-" * 60)
    fixes = fix_database(input_file, output_file)
    print_report(fixes)

    # Validate after
    print("\nAFTER CLEANUP:")
    stats_after = validate_database(output_file)
    print_validation(stats_after)

    print(f"\n✓ Fixed database saved to: {output_file}")
