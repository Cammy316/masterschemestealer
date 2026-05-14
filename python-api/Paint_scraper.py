#!/usr/bin/env python3
"""
SchemeStealer Paint Database Builder v2.0
=========================================

This script builds your paint database from multiple sources:

OPTION 1: Arcturus5404/miniature-paints (GitHub) - RECOMMENDED
- MIT Licensed, actively maintained
- 30+ brands including Citadel, Vallejo, Army Painter, Scale75
- Data in markdown tables with RGB values
- URL: https://github.com/Arcturus5404/miniature-paints

OPTION 2: Redgrimm paint-conversion (GitHub Pages)  
- Embedded in HTML tables
- Citadel, Vallejo Game, Vallejo Model, Army Painter, P3
- URL: https://redgrimm.github.io/paint-conversion/

OPTION 3: Manual Entry / Official Sources
- Games Workshop: https://citadel-colour.com/
- Vallejo: https://acrylicosvallejo.com/en/color-chart/
- Army Painter: https://www.thearmypainter.com/pages/colour-match
"""

import requests
import re
import json
import colorsys
from bs4 import BeautifulSoup
from collections import Counter
from typing import List, Dict, Tuple, Optional

# ============================================================================
# CONFIGURATION
# ============================================================================

OUTPUT_FILE = "paints_v3.json"

# Target brands for SchemeStealer
TARGET_BRANDS = ["Citadel", "Vallejo", "Army Painter", "Scale75"]

# Source URLs
SOURCES = {
    "arcturus_citadel": "https://raw.githubusercontent.com/Arcturus5404/miniature-paints/main/paints/Citadel_Colour.md",
    "arcturus_vallejo": "https://raw.githubusercontent.com/Arcturus5404/miniature-paints/main/paints/Vallejo.md",
    "arcturus_army_painter": "https://raw.githubusercontent.com/Arcturus5404/miniature-paints/main/paints/Army_Painter.md",
    "arcturus_scale75": "https://raw.githubusercontent.com/Arcturus5404/miniature-paints/main/paints/Scale75.md",
    "redgrimm_citadel": "https://redgrimm.github.io/paint-conversion/index.html",
    "redgrimm_vallejo_game": "https://redgrimm.github.io/paint-conversion/vallejo-game.html",
    "redgrimm_vallejo_model": "https://redgrimm.github.io/paint-conversion/vallejo-model.html",
    "redgrimm_army_painter": "https://redgrimm.github.io/paint-conversion/army-painter.html",
}

# ============================================================================
# COLOR ANALYSIS HELPERS
# ============================================================================

def hex_to_rgb(hex_code: str) -> Tuple[int, int, int]:
    """Convert hex to RGB tuple"""
    hex_code = hex_code.lstrip('#')
    if len(hex_code) != 6:
        return (128, 128, 128)  # Default grey
    try:
        return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
    except ValueError:
        return (128, 128, 128)

def hex_to_hsv(hex_code: str) -> Tuple[float, float, float]:
    """Convert hex to HSV (0-1 range)"""
    r, g, b = hex_to_rgb(hex_code)
    return colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)

def is_valid_hex(hex_code: str) -> bool:
    """Validate hex color format"""
    if not hex_code:
        return False
    hex_code = hex_code.lstrip('#')
    if len(hex_code) != 6:
        return False
    try:
        int(hex_code, 16)
        return True
    except ValueError:
        return False

def detect_color_family(hex_code: str, name: str, finish: str) -> str:
    """
    Determine color family based on hex + name keywords
    Returns: red, blue, green, yellow, orange, purple, pink, brown, 
             flesh, bone, grey, black, white, gold, silver, bronze, copper, cyan
    """
    h, s, v = hex_to_hsv(hex_code)
    name_lower = name.lower()
    
    # 1. METALLICS (name-based priority)
    if finish == "metallic":
        if any(x in name_lower for x in ["gold", "retributor", "auric", "liberator", "gehenna", "balthasar"]):
            return "gold"
        if any(x in name_lower for x in ["silver", "leadbelcher", "iron", "steel", "runefang", "stormhost", "necron"]):
            return "silver"
        if any(x in name_lower for x in ["bronze", "brass", "hashut"]):
            return "bronze"
        if any(x in name_lower for x in ["copper", "fulgurite"]):
            return "copper"
        # Fallback metallic by hue
        h_deg = h * 360
        if 30 < h_deg < 60 and s > 0.25:
            return "gold"
        elif s < 0.2 and v > 0.5:
            return "silver"
        else:
            return "bronze"
    
    # 2. GREYSCALE
    if s < 0.10 and v > 0.90:
        return "white"
    if s < 0.10 and v < 0.15:
        return "black"
    if s < 0.15:
        return "grey"
    
    # 3. NAME-BASED OVERRIDES
    if any(x in name_lower for x in ["flesh", "skin", "cadian", "kislev", "ratskin", "bugman"]):
        return "flesh"
    if any(x in name_lower for x in ["bone", "ushabti", "wraithbone", "screaming skull", "zandri"]):
        return "bone"
    
    # 4. FLESH TONES by hex (peachy orange range)
    if (0.02 <= h <= 0.08) and (0.3 <= s <= 0.6) and (0.5 <= v <= 0.9):
        return "flesh"
    
    # 5. BROWNS (orange hue + low brightness/saturation)
    if (0.03 <= h <= 0.12) and (v < 0.5 or s < 0.5):
        return "brown"
    
    # 6. HUE WHEEL
    h_deg = h * 360
    if h_deg < 15 or h_deg >= 345:
        return "red"
    if 15 <= h_deg < 45:
        return "orange"
    if 45 <= h_deg < 70:
        return "yellow"
    if 70 <= h_deg < 160:
        return "green"
    if 160 <= h_deg < 200:
        return "cyan"
    if 200 <= h_deg < 260:
        return "blue"
    if 260 <= h_deg < 300:
        return "purple"
    if 300 <= h_deg < 345:
        return "pink"
    
    return "grey"

def analyze_paint_properties(name: str, range_name: str = "") -> Tuple[str, str, float, List[str]]:
    """
    Analyze paint name to determine category, finish, transparency, and tags
    
    Returns: (category, finish, transparency, tags)
    """
    n = name.lower()
    r = range_name.lower()
    combined = f"{n} {r}"
    
    category = "base"
    finish = "matte"
    transparency = 0.0
    tags = ["opaque"]
    
    # CATEGORY DETECTION
    if any(x in combined for x in ["shade", "wash", "tone ink"]):
        category = "wash"
        transparency = 0.85
        tags = ["transparent", "shade"]
    elif any(x in combined for x in ["contrast", "speedpaint", "xpress color"]):
        category = "contrast"
        transparency = 0.60
        tags = ["semi-transparent", "flow"]
        finish = "satin"
    elif any(x in combined for x in [" ink", "ink "]):
        category = "ink"
        transparency = 0.70
        tags = ["transparent", "vibrant"]
    elif any(x in combined for x in ["glaze"]):
        category = "glaze"
        transparency = 0.50
        tags = ["transparent"]
    elif any(x in combined for x in [" air", "air ", "model air"]):
        category = "air"
    elif any(x in combined for x in [" dry", "dry "]):
        category = "dry"
        tags = ["opaque", "texture"]
    elif any(x in combined for x in ["layer"]):
        category = "layer"
    elif any(x in combined for x in ["edge", "highlight"]):
        category = "layer"
        tags.append("highlight")
    elif any(x in combined for x in ["technical"]):
        category = "technical"
    elif any(x in combined for x in ["base"]):
        category = "base"
    
    # FINISH DETECTION
    if any(x in combined for x in ["gloss", "ardcoat", "'ard coat", "varnish"]):
        finish = "gloss"
    elif any(x in combined for x in [
        "metallic", "metal", "gold", "silver", "bronze", "copper",
        "leadbelcher", "iron", "steel", "retributor", "brass",
        "runefang", "stormhost", "gehenna", "balthasar", "auric",
        "liberator", "necron compound", "chrome", "gunmetal"
    ]):
        finish = "metallic"
        if category not in ["wash", "contrast"]:
            transparency = 0.0
            if "opaque" not in tags:
                tags.append("opaque")
    
    return category, finish, transparency, tags

# ============================================================================
# SCRAPERS
# ============================================================================

def scrape_arcturus_markdown(url: str, brand: str) -> List[Dict]:
    """
    Scrape paint data from Arcturus5404/miniature-paints markdown files
    Format: | Name | Range | R | G | B |
    """
    paints = []
    
    print(f"  📥 Fetching {brand} from Arcturus...")
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        content = response.text
    except Exception as e:
        print(f"  ❌ Failed to fetch {url}: {e}")
        return paints
    
    # Parse markdown table rows
    # Format: | Paint Name | Range | R | G | B |
    pattern = r'\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|'
    
    for match in re.finditer(pattern, content):
        name = match.group(1).strip()
        range_name = match.group(2).strip()
        r, g, b = int(match.group(3)), int(match.group(4)), int(match.group(5))
        
        # Skip header rows
        if name.lower() in ['name', 'paint', 'color', 'colour']:
            continue
        
        # Convert RGB to hex
        hex_code = f"#{r:02X}{g:02X}{b:02X}"
        
        if not is_valid_hex(hex_code):
            continue
        
        # Analyze properties
        category, finish, transparency, tags = analyze_paint_properties(name, range_name)
        color_family = detect_color_family(hex_code, name, finish)
        
        # Add family tag
        tags.append(f"family:{color_family}")
        if finish == "metallic":
            tags.append("metallic")
        
        paint = {
            "name": name,
            "brand": brand,
            "hex": hex_code,
            "category": category,
            "finish": finish,
            "transparency": transparency,
            "color_family": color_family,
            "tags": list(set(tags)),
            "layer_sequence": None,
            "source": "arcturus"
        }
        
        paints.append(paint)
    
    print(f"  ✅ Found {len(paints)} {brand} paints")
    return paints

def scrape_redgrimm_html(url: str, brand: str) -> List[Dict]:
    """
    Scrape paint data from Redgrimm's paint-conversion HTML tables
    Format: <strong>Paint Name</strong><br>Brand - Range - #hexcode
    """
    paints = []
    seen_names = set()
    
    print(f"  📥 Fetching {brand} from Redgrimm...")
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        content = response.text
    except Exception as e:
        print(f"  ❌ Failed to fetch {url}: {e}")
        return paints
    
    # Pattern to find: <strong>Paint Name</strong><br>Brand - Range - #hexcode
    pattern = r'<strong[^>]*>([^<]+)</strong><br>([^-]+)\s*-\s*([^-]+)\s*-\s*#([a-fA-F0-9]{6})'
    
    for match in re.finditer(pattern, content, re.IGNORECASE):
        name = match.group(1).strip()
        paint_brand = match.group(2).strip()
        range_name = match.group(3).strip()
        hex_code = f"#{match.group(4).upper()}"
        
        # Normalize brand name
        normalized_brand = normalize_brand(paint_brand)
        
        # Only process target brand
        if brand != "all" and normalized_brand != brand:
            continue
        
        # Skip duplicates
        paint_key = f"{normalized_brand}:{name}"
        if paint_key in seen_names:
            continue
        seen_names.add(paint_key)
        
        if not is_valid_hex(hex_code):
            continue
        
        # Analyze properties
        category, finish, transparency, tags = analyze_paint_properties(name, range_name)
        color_family = detect_color_family(hex_code, name, finish)
        
        # Add tags
        tags.append(f"family:{color_family}")
        if finish == "metallic":
            tags.append("metallic")
        
        paint = {
            "name": name,
            "brand": normalized_brand,
            "hex": hex_code,
            "category": category,
            "finish": finish,
            "transparency": transparency,
            "color_family": color_family,
            "tags": list(set(tags)),
            "layer_sequence": None,
            "source": "redgrimm"
        }
        
        paints.append(paint)
    
    print(f"  ✅ Found {len(paints)} {brand} paints")
    return paints

def normalize_brand(raw_brand: str) -> str:
    """Normalize brand names to standard format"""
    brand_map = {
        "citadel": "Citadel",
        "games workshop": "Citadel",
        "vallejo": "Vallejo",
        "vallejo game": "Vallejo",
        "vallejo model": "Vallejo",
        "army painter": "Army Painter",
        "the army painter": "Army Painter",
        "scale75": "Scale75",
        "scale 75": "Scale75",
        "p3": "P3",
        "p3 formula": "P3",
        "privateer": "P3",
    }
    
    raw_lower = raw_brand.lower().strip()
    for key, value in brand_map.items():
        if key in raw_lower:
            return value
    return raw_brand.strip()

# ============================================================================
# MAIN BUILD FUNCTION
# ============================================================================

def build_paint_database():
    """Main function to build the comprehensive paint database"""
    
    print("=" * 60)
    print("🎨 SCHEMESTEALER PAINT DATABASE BUILDER v2.0")
    print("=" * 60)
    
    all_paints = []
    
    # -------------------------------------------------------------------------
    # OPTION 1: Try Arcturus repository first (best structured data)
    # -------------------------------------------------------------------------
    print("\n📦 OPTION 1: Arcturus5404/miniature-paints Repository")
    print("-" * 50)
    
    arcturus_paints = []
    arcturus_paints.extend(scrape_arcturus_markdown(SOURCES["arcturus_citadel"], "Citadel"))
    arcturus_paints.extend(scrape_arcturus_markdown(SOURCES["arcturus_vallejo"], "Vallejo"))
    arcturus_paints.extend(scrape_arcturus_markdown(SOURCES["arcturus_army_painter"], "Army Painter"))
    arcturus_paints.extend(scrape_arcturus_markdown(SOURCES["arcturus_scale75"], "Scale75"))
    
    if arcturus_paints:
        print(f"\n✅ Arcturus source: {len(arcturus_paints)} total paints")
        all_paints.extend(arcturus_paints)
    else:
        print("\n⚠️  Arcturus source returned no data")
    
    # -------------------------------------------------------------------------
    # OPTION 2: Supplement with Redgrimm data
    # -------------------------------------------------------------------------
    print("\n📦 OPTION 2: Redgrimm Paint Conversion Tables")
    print("-" * 50)
    
    # Get existing paint names to avoid duplicates
    existing_names = {f"{p['brand']}:{p['name']}" for p in all_paints}
    
    redgrimm_paints = []
    
    # Scrape Citadel (primary source)
    citadel_paints = scrape_redgrimm_html(SOURCES["redgrimm_citadel"], "Citadel")
    for p in citadel_paints:
        key = f"{p['brand']}:{p['name']}"
        if key not in existing_names:
            redgrimm_paints.append(p)
            existing_names.add(key)
    
    # Scrape Vallejo Game
    vallejo_game = scrape_redgrimm_html(SOURCES["redgrimm_vallejo_game"], "Vallejo")
    for p in vallejo_game:
        key = f"{p['brand']}:{p['name']}"
        if key not in existing_names:
            redgrimm_paints.append(p)
            existing_names.add(key)
    
    # Scrape Vallejo Model
    vallejo_model = scrape_redgrimm_html(SOURCES["redgrimm_vallejo_model"], "Vallejo")
    for p in vallejo_model:
        key = f"{p['brand']}:{p['name']}"
        if key not in existing_names:
            redgrimm_paints.append(p)
            existing_names.add(key)
    
    # Scrape Army Painter
    army_painter = scrape_redgrimm_html(SOURCES["redgrimm_army_painter"], "Army Painter")
    for p in army_painter:
        key = f"{p['brand']}:{p['name']}"
        if key not in existing_names:
            redgrimm_paints.append(p)
            existing_names.add(key)
    
    if redgrimm_paints:
        print(f"\n✅ Redgrimm source: {len(redgrimm_paints)} unique paints added")
        all_paints.extend(redgrimm_paints)
    
    # -------------------------------------------------------------------------
    # DEDUPLICATE AND VALIDATE
    # -------------------------------------------------------------------------
    print("\n🔍 Deduplicating and validating...")
    
    # Remove exact duplicates
    seen = set()
    unique_paints = []
    for p in all_paints:
        key = f"{p['brand']}:{p['name']}:{p['hex']}"
        if key not in seen:
            seen.add(key)
            # Remove source field (internal only)
            p.pop('source', None)
            unique_paints.append(p)
    
    # Sort by brand, then name
    unique_paints.sort(key=lambda x: (x['brand'], x['name']))
    
    # -------------------------------------------------------------------------
    # STATISTICS
    # -------------------------------------------------------------------------
    print("\n" + "=" * 60)
    print("📊 DATABASE STATISTICS")
    print("=" * 60)
    
    brands = Counter(p['brand'] for p in unique_paints)
    categories = Counter(p['category'] for p in unique_paints)
    finishes = Counter(p['finish'] for p in unique_paints)
    families = Counter(p['color_family'] for p in unique_paints)
    
    print(f"\n🏭 BRANDS ({len(brands)} total):")
    for brand, count in sorted(brands.items(), key=lambda x: -x[1]):
        print(f"   {brand}: {count} paints")
    
    print(f"\n📦 CATEGORIES:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"   {cat}: {count}")
    
    print(f"\n✨ FINISHES:")
    for fin, count in sorted(finishes.items(), key=lambda x: -x[1]):
        print(f"   {fin}: {count}")
    
    print(f"\n🎨 COLOR FAMILIES (Top 10):")
    for fam, count in families.most_common(10):
        print(f"   {fam}: {count}")
    
    # -------------------------------------------------------------------------
    # SAVE OUTPUT
    # -------------------------------------------------------------------------
    print(f"\n💾 Saving to {OUTPUT_FILE}...")
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(unique_paints, f, indent=2)
    
    print(f"\n✅ SUCCESS! Saved {len(unique_paints)} paints to {OUTPUT_FILE}")
    print("\n" + "=" * 60)
    
    return unique_paints

# ============================================================================
# FALLBACK: MANUAL ENTRY TEMPLATE
# ============================================================================

MANUAL_CITADEL_PAINTS = """
If automated scraping fails, here's a template for manual entry.
You can copy hex codes from:
- https://citadel-colour.com/ (official)
- https://www.dakkadakka.com/wiki/en/Paint_Range_Compatibility_Chart
- https://bolterandchainsword.com/topic/352780-paint-color-hexadecimal-codes/

Example format for paints.json:
[
  {"name": "Abaddon Black", "brand": "Citadel", "hex": "#231F20", "category": "base", "finish": "matte", "transparency": 0.0, "color_family": "black", "tags": ["opaque"]},
  {"name": "Corax White", "brand": "Citadel", "hex": "#FFFFFF", "category": "base", "finish": "matte", "transparency": 0.0, "color_family": "white", "tags": ["opaque"]},
  {"name": "Mephiston Red", "brand": "Citadel", "hex": "#9A1115", "category": "base", "finish": "matte", "transparency": 0.0, "color_family": "red", "tags": ["opaque"]},
  {"name": "Macragge Blue", "brand": "Citadel", "hex": "#0D407F", "category": "base", "finish": "matte", "transparency": 0.0, "color_family": "blue", "tags": ["opaque"]},
  {"name": "Caliban Green", "brand": "Citadel", "hex": "#003B1D", "category": "base", "finish": "matte", "transparency": 0.0, "color_family": "green", "tags": ["opaque"]},
  {"name": "Retributor Armour", "brand": "Citadel", "hex": "#C69843", "category": "base", "finish": "metallic", "transparency": 0.0, "color_family": "gold", "tags": ["opaque", "metallic"]},
  {"name": "Leadbelcher", "brand": "Citadel", "hex": "#888D8F", "category": "base", "finish": "metallic", "transparency": 0.0, "color_family": "silver", "tags": ["opaque", "metallic"]},
  {"name": "Nuln Oil", "brand": "Citadel", "hex": "#101010", "category": "wash", "finish": "matte", "transparency": 0.85, "color_family": "black", "tags": ["transparent", "shade"]},
  {"name": "Agrax Earthshade", "brand": "Citadel", "hex": "#26190D", "category": "wash", "finish": "matte", "transparency": 0.85, "color_family": "brown", "tags": ["transparent", "shade"]}
]
"""

# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    import sys
    
    # Check for required packages
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("\nInstall with:")
        print("  pip install requests beautifulsoup4")
        sys.exit(1)
    
    # Run the builder
    paints = build_paint_database()
    
    # If no paints found, print manual instructions
    if len(paints) < 50:
        print("\n⚠️  WARNING: Very few paints found!")
        print("The scrapers may have failed. Consider:")
        print("1. Check your internet connection")
        print("2. Verify the source URLs are accessible")
        print("3. Use the manual entry template below")
        print(MANUAL_CITADEL_PAINTS)