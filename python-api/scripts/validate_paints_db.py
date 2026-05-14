"""
Paint Database Validator
Analyzes paints_v3.json for color_family misclassifications
"""
import json
import colorsys
from pathlib import Path
from typing import Dict, List, Tuple


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

    # Convert to XYZ
    def linearize(c):
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r_lin, g_lin, b_lin = linearize(r), linearize(g), linearize(b)

    x = r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375
    y = r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750
    z = r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041

    # D65 illuminant
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

    # Low saturation colors (check hue but be careful)
    if s < 0.20:
        # Could be desaturated chromatic
        if 180 < h < 260 and chroma > 3:
            return "blue"  # Desaturated blues
        if 70 < h < 170 and chroma > 4:
            return "green"  # Desaturated greens
        if 260 < h < 320 and chroma > 3:
            return "purple"  # Desaturated purples
        if v > 0.75:
            return "white"
        if v < 0.3:
            return "black"
        return "grey"

    # Brown detection (low saturation oranges/reds with low value)
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


def validate_database(db_path: str) -> Dict[str, List]:
    """Validate all paints and return issues"""
    with open(db_path, 'r', encoding='utf-8') as f:
        paints = json.load(f)

    issues = {
        'color_family_mismatch': [],
        'category_issues': [],
        'metallic_issues': [],
        'missing_name': [],
        'duplicate_entries': [],
        'invalid_hex': []
    }

    seen = set()

    for paint in paints:
        name = paint.get('name', '')
        brand = paint.get('brand', '')
        hex_color = paint.get('hex', '#000000')
        stated_family = paint.get('color_family', '').lower()
        category = paint.get('category', '')
        finish = paint.get('finish', '')
        transparency = paint.get('transparency', 0)

        # Validate hex format
        if not hex_color.startswith('#') or len(hex_color) != 7:
            issues['invalid_hex'].append({
                'name': name,
                'brand': brand,
                'hex': hex_color,
                'issue': 'Invalid hex format'
            })
            continue

        # Check for number-only names (likely codes not real names)
        if name and (name.startswith('CP') or (name[0].isdigit() and '.' in name)):
            issues['missing_name'].append({
                'name': name,
                'brand': brand,
                'hex': hex_color,
                'issue': 'Paint has code-style name instead of real name'
            })

        # Check for duplicates
        key = f"{brand}|{name}"
        if key in seen:
            issues['duplicate_entries'].append({
                'name': name,
                'brand': brand,
                'issue': 'Duplicate entry'
            })
        seen.add(key)

        # Validate color family
        expected_family = classify_color_family(hex_color)

        # Allow some flexibility for edge cases
        compatible_families = {
            'cyan': ['green', 'blue', 'grey'],
            'green': ['cyan', 'yellow', 'olive'],
            'brown': ['orange', 'red', 'yellow'],
            'flesh': ['orange', 'pink', 'brown', 'red'],
            'gold': ['yellow', 'orange', 'brown'],
            'silver': ['grey', 'white', 'blue'],
            'bronze': ['orange', 'brown', 'red', 'gold'],
            'olive': ['green', 'yellow', 'brown'],
            'bone': ['white', 'yellow', 'grey'],
            'tan': ['brown', 'orange', 'yellow'],
            'beige': ['brown', 'white', 'yellow'],
            'yellow': ['green', 'orange'],  # Yellow-greens can be tricky
            'orange': ['yellow', 'brown', 'red'],
            'pink': ['red', 'purple'],
            'purple': ['blue', 'pink', 'red'],
            'red': ['orange', 'pink', 'brown'],
            'blue': ['purple', 'cyan', 'grey'],
            'grey': ['blue', 'green', 'white', 'black'],
            'white': ['grey', 'bone', 'yellow'],
            'black': ['grey', 'blue', 'purple'],
        }

        is_compatible = (
            stated_family == expected_family or
            expected_family in compatible_families.get(stated_family, []) or
            stated_family in compatible_families.get(expected_family, [])
        )

        # Special families that have wide ranges
        special_families = ['flesh', 'gold', 'silver', 'bronze', 'bone', 'tan', 'beige', 'olive']

        if not is_compatible and stated_family not in special_families:
            h, s, v = hex_to_hsv(hex_color)
            issues['color_family_mismatch'].append({
                'name': name,
                'brand': brand,
                'hex': hex_color,
                'stated': stated_family,
                'expected': expected_family,
                'hsv': (round(h, 1), round(s, 3), round(v, 3))
            })

        # Check category/transparency consistency
        if category == 'wash' and transparency < 0.5:
            issues['category_issues'].append({
                'name': name,
                'brand': brand,
                'category': category,
                'transparency': transparency,
                'issue': f'Marked as wash but transparency={transparency}'
            })

        if category == 'base' and transparency > 0.5:
            issues['category_issues'].append({
                'name': name,
                'brand': brand,
                'category': category,
                'transparency': transparency,
                'issue': f'Marked as base but transparency={transparency}'
            })

        # Check metallic consistency
        if finish == 'metallic':
            h, s, v = hex_to_hsv(hex_color)
            # Metallics should typically be in gold/silver/bronze ranges or have specific hue
            if expected_family in ['green', 'blue', 'purple', 'pink', 'red'] and s > 0.5:
                issues['metallic_issues'].append({
                    'name': name,
                    'brand': brand,
                    'hex': hex_color,
                    'issue': f'Marked metallic but appears to be saturated {expected_family}'
                })

    return issues


def generate_report(issues: Dict[str, List]) -> str:
    """Generate human-readable report"""
    report = ["=" * 60, "PAINT DATABASE VALIDATION REPORT", "=" * 60, ""]

    total_issues = sum(len(items) for items in issues.values())
    report.append(f"Total issues found: {total_issues}\n")

    for category, items in issues.items():
        if items:
            report.append(f"\n### {category.upper().replace('_', ' ')} ({len(items)} issues)")
            report.append("-" * 40)
            for item in items[:30]:  # Limit to first 30 per category
                report.append(f"  - {item.get('brand', 'N/A')} | {item.get('name', 'N/A')}")
                if 'hex' in item:
                    report.append(f"    Hex: {item['hex']}")
                if 'stated' in item and 'expected' in item:
                    report.append(f"    Stated: {item['stated']} -> Expected: {item['expected']}")
                if 'hsv' in item:
                    h, s, v = item['hsv']
                    report.append(f"    HSV: H={h:.1f}, S={s:.2f}, V={v:.2f}")
                if 'issue' in item:
                    report.append(f"    Issue: {item['issue']}")
            if len(items) > 30:
                report.append(f"  ... and {len(items) - 30} more")

    return "\n".join(report)


def generate_summary_stats(db_path: str) -> str:
    """Generate summary statistics about the database"""
    with open(db_path, 'r', encoding='utf-8') as f:
        paints = json.load(f)

    brands = {}
    families = {}
    categories = {}
    finishes = {}

    for paint in paints:
        brand = paint.get('brand', 'Unknown')
        family = paint.get('color_family', 'Unknown')
        category = paint.get('category', 'Unknown')
        finish = paint.get('finish', 'Unknown')

        brands[brand] = brands.get(brand, 0) + 1
        families[family] = families.get(family, 0) + 1
        categories[category] = categories.get(category, 0) + 1
        finishes[finish] = finishes.get(finish, 0) + 1

    report = ["\n" + "=" * 60, "DATABASE SUMMARY STATISTICS", "=" * 60, ""]
    report.append(f"Total paints: {len(paints)}\n")

    report.append("By Brand:")
    for brand, count in sorted(brands.items(), key=lambda x: -x[1]):
        report.append(f"  {brand}: {count}")

    report.append("\nBy Color Family:")
    for family, count in sorted(families.items(), key=lambda x: -x[1]):
        report.append(f"  {family}: {count}")

    report.append("\nBy Category:")
    for category, count in sorted(categories.items(), key=lambda x: -x[1]):
        report.append(f"  {category}: {count}")

    report.append("\nBy Finish:")
    for finish, count in sorted(finishes.items(), key=lambda x: -x[1]):
        report.append(f"  {finish}: {count}")

    return "\n".join(report)


if __name__ == "__main__":
    db_path = Path(__file__).parent.parent / "paints_v3.json"

    if not db_path.exists():
        print(f"Error: Database not found at {db_path}")
        exit(1)

    print(f"Validating: {db_path}")

    # Generate summary stats first
    print(generate_summary_stats(str(db_path)))

    # Run validation
    issues = validate_database(str(db_path))
    print(generate_report(issues))

    # Save detailed JSON report
    output_path = Path(__file__).parent / "validation_report.json"
    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(issues, f, indent=2)
    print(f"\nDetailed report saved to {output_path}")
