import os
import sys
import json
import re
from datetime import datetime
import logging

# Add python-api to sys.path so we can import core modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core.schemestealer_engine import resolve_paint_db_path
from core.color_engine import PaintMatcher, Paint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("build_conversions")

def get_band(delta_e: float) -> str:
    if delta_e < 2:
        return "perfect"
    elif delta_e < 5:
        return "close"
    elif delta_e < 10:
        return "fair"
    elif delta_e <= 30:
        return "distant"
    return "none"

def slugify(brand: str, name: str) -> str:
    """Deterministic kebab-case slug used identically across Python and Next.js."""
    combined = f"{brand}-{name}".lower()
    slug = re.sub(r'[^a-z0-9]+', '-', combined)
    return slug.strip('-')

OLD_CITADEL_NAMES = {
    "Abaddon Black": "Chaos Black",
    "White Scar": "Skull White",
    "Mephiston Red": "Blood Red",
    "Khorne Red": "Scab Red",
    "Wazdakka Red": "Red Gore",
    "Troll Slayer Orange": "Blazing Orange",
    "Fire Dragon Bright": "Fiery Orange",
    "Yriel Yellow": "Golden Yellow",
    "Flash Gitz Yellow": "Sunburst Yellow",
    "Moot Green": "Scorpion Green",
    "Warpstone Glow": "Snot Green",
    "Caliban Green": "Dark Angels Green",
    "Warboss Green": "Goblin Green",
    "Macragge Blue": "Ultramarines Blue",
    "Caledor Sky": "Enchanted Blue",
    "Lothern Blue": "Ice Blue",
    "Kantor Blue": "Regal Blue",
    "Sotek Green": "Hawk Turquoise",
    "Xereus Purple": "Liche Purple",
    "Screamer Pink": "Warlock Purple",
    "Emperor's Children": "Tentacle Pink",
    "Cadian Fleshtone": "Tallarn Flesh",
    "Kislev Flesh": "Elf Flesh",
    "Ratskin Flesh": "Dwarf Flesh",
    "Mournfang Brown": "Bestial Brown",
    "Rhinox Hide": "Scorched Brown",
    "Balor Brown": "Snakebite Leather",
    "Steel Legion Drab": "Graveyard Earth",
    "Karak Stone": "Kommando Khaki",
    "Tallarn Sand": "Desert Yellow",
    "Ushabti Bone": "Bleached Bone",
    "Dawnstone": "Codex Grey",
    "Administratum Grey": "Fortress Grey",
    "The Fang": "Space Wolves Grey",
    "Leadbelcher": "Boltgun Metal",
    "Ironbreaker": "Chainmail",
    "Runefang Steel": "Mithril Silver",
    "Gehenna's Gold": "Shining Gold",
    "Auric Armour Gold": "Burnished Gold",
    "Hashut Copper": "Dwarf Bronze",
    "Nuln Oil": "Badab Black",
    "Agrax Earthshade": "Devlan Mud",
    "Reikland Fleshshade": "Ogryn Flesh",
    "Seraphim Sepia": "Gryphonne Sepia"
}

def main():
    db_path = resolve_paint_db_path()
    with open(db_path, 'r') as f:
        paint_data = json.load(f)
    
    paint_db = []
    for p in paint_data:
        paint = Paint(
            name=p['name'],
            brand=p['brand'],
            hex=p['hex'],
            color_family=p.get('color_family'),
            lab=p['lab'],
            type=p.get('type', 'Base'),
            finish=p.get('finish', 'Matte'),
            metallic=p.get('metallic', False),
            transparency=p.get('transparency', 0.0),
            matchable=p.get('matchable', True)
        )
        # Using slugify as the canonical ID for routes
        paint.paint_id = p.get('paint_id') or slugify(p.get('brand', ''), p.get('name', ''))
        paint.slug = slugify(p['brand'], p['name'])
        paint_db.append(paint)

    matcher = PaintMatcher(paint_db)
    supported_brands = sorted(list(set(p.brand for p in paint_db if p.matchable)))
    
    conversions = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "paints": {}
    }
    
    conversion_paths = []

    # Get all matchable source paints
    source_paints = [p for p in paint_db if p.matchable]
    
    # We retrieve up to 5 matches to give users more choice, categorized by band
    N_MATCHES = 5
    
    logger.info(f"Generating conversions for {len(source_paints)} paints across {len(supported_brands)} brands...")
    
    for source in source_paints:
        source_slug = source.slug
        
        matches_by_brand = {}
        
        for target_brand in supported_brands:
            if target_brand == source.brand:
                continue
                
            matches = matcher.match_top_n(
                target_lab=source.lab,
                brand=target_brand,
                role='dominant',
                n=N_MATCHES,
                target_family=source.color_family
            )
            
            brand_matches = []
            for m_paint, dist in matches:
                # Skip anything beyond the strict ceiling
                if dist > 30:
                    continue
                    
                brand_matches.append({
                    "paint_id": getattr(m_paint, 'paint_id', slugify(m_paint.brand, m_paint.name)),
                    "name": m_paint.name,
                    "hex": m_paint.hex,
                    "slug": slugify(m_paint.brand, m_paint.name),
                    "delta_e": round(float(dist), 2),
                    "band": get_band(dist)
                })
            
            matches_by_brand[target_brand] = brand_matches
            
            if brand_matches:
                # Add path for the modern name
                conversion_paths.append({
                    "fromSlug": source_slug,
                    "toBrand": slugify(target_brand, "").strip("-")
                })
                
                # If this is a Citadel paint with a known old name, add an alias path
                old_name = OLD_CITADEL_NAMES.get(source.name) if source.brand.lower() == "citadel" else None
                if old_name:
                    old_slug = slugify(source.brand, old_name)
                    conversion_paths.append({
                        "fromSlug": old_slug,
                        "toBrand": slugify(target_brand, "").strip("-")
                    })
                
        # We store the source paint metadata plus its matches
        old_name_attr = OLD_CITADEL_NAMES.get(source.name) if source.brand.lower() == "citadel" else None
        
        source_payload = {
            "name": source.name,
            "brand": "Citadel / Warhammer Colour" if source.brand.lower() == "citadel" else source.brand,
            "hex": source.hex,
            "paint_id": getattr(source, 'paint_id', source_slug)
        }
        if old_name_attr:
            source_payload["old_name"] = old_name_attr

        conversions["paints"][source_slug] = {
            "source": source_payload,
            "matches": matches_by_brand
        }
        
        # Also map the old slug in the conversions dictionary to point to the same data
        if old_name_attr:
            old_slug = slugify(source.brand, old_name_attr)
            conversions["paints"][old_slug] = conversions["paints"][source_slug]

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'schemestealer-react', 'lib', 'data'))
    os.makedirs(out_dir, exist_ok=True)
    
    conv_file = os.path.join(out_dir, 'conversions.json')
    with open(conv_file, 'w') as f:
        json.dump(conversions, f, separators=(',', ':'))
        
    paths_file = os.path.join(out_dir, 'conversion_paths.json')
    with open(paths_file, 'w') as f:
        json.dump(conversion_paths, f, separators=(',', ':'))
        
    logger.info(f"Wrote conversions for {len(source_paints)} paints to {conv_file}")
    logger.info(f"Wrote {len(conversion_paths)} valid conversion paths to {paths_file}")

if __name__ == "__main__":
    main()
