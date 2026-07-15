import json
import os
import sys

# Ensure we can import from core
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from core.colour_maths import ciede2000_single

def build_schemes():
    groundtruth_path = os.path.join(os.path.dirname(__file__), '..', 'paints_groundtruth.json')
    with open(groundtruth_path, 'r', encoding='utf-8') as f:
        paints = json.load(f)

    # Filter only eligible paints (measured/swatch-median with LAB)
    valid_paints = []
    for p in paints:
        cat = p.get('category', '').lower()
        if cat in ('wash', 'shade', 'ink'):
            continue
        if p.get('discontinued', False):
            continue
        source = p.get('color_source', '')
        if source not in ('measured', 'swatch-median'):
            continue
        lab = p.get('lab') or p.get('measured_lab')
        if not lab:
            continue
        valid_paints.append(p)

    paint_dict = {p['paint_id']: p for p in valid_paints}

    schemes = [
        {"model": "Ultramarines Intercessor", "paints": ["citadel-macragge-blue", "citadel-calgar-blue", "citadel-abaddon-black"]},
        {"model": "Blood Angels Assault Intercessor", "paints": ["citadel-mephiston-red", "citadel-evil-sunz-scarlet", "citadel-abaddon-black"]},
        {"model": "Death Guard Plague Marine", "paints": ["citadel-death-guard-green", "citadel-balthasar-gold", "citadel-leadbelcher"]},
        {"model": "Ork Boyz Flesh", "paints": ["citadel-waaagh-flesh", "citadel-warboss-green", "citadel-skarsnik-green"]},
        {"model": "Necron Warrior", "paints": ["citadel-runelord-brass", "citadel-leadbelcher", "citadel-moot-green"]},
        {"model": "Stormcast Eternal Liberator", "paints": ["citadel-retributor-armour", "citadel-liberator-gold", "citadel-kantor-blue"]},
        {"model": "Night Lords Chaos Space Marine", "paints": ["citadel-night-lords-blue", "citadel-mephiston-red", "citadel-leadbelcher"]},
        {"model": "Imperial Fists Intercessor", "paints": ["citadel-averland-sunset", "citadel-yriel-yellow", "citadel-mephiston-red"]},
        {"model": "Adepta Sororitas Battle Sister", "paints": ["citadel-abaddon-black", "citadel-mephiston-red", "citadel-corax-white"]},
        {"model": "Tyranid Hive Fleet Leviathan", "paints": ["citadel-wraithbone", "citadel-naggaroth-night", "citadel-mephiston-red"]},
        {"model": "T'au Empire Fire Warrior", "paints": ["citadel-tau-light-ochre", "citadel-rhinox-hide", "citadel-abaddon-black"]},
        {"model": "Salamanders Intercessor", "paints": ["citadel-waaagh-flesh", "citadel-warpstone-glow", "citadel-moot-green"]},
        {"model": "Dark Angels Intercessor", "paints": ["citadel-caliban-green", "citadel-warpstone-glow", "citadel-mephiston-red"]},
        {"model": "Space Wolves Hunter", "paints": ["citadel-the-fang", "citadel-russ-grey", "citadel-fenrisian-grey"]},
        {"model": "Black Legion Marine", "paints": ["citadel-abaddon-black", "citadel-leadbelcher", "citadel-balthasar-gold"]},
        {"model": "Thousand Sons Rubric Marine", "paints": ["citadel-thousand-sons-blue", "citadel-ahriman-blue", "citadel-retributor-armour"]},
        {"model": "Word Bearers Legionary", "paints": ["citadel-word-bearers-red", "citadel-leadbelcher", "citadel-abaddon-black"]},
        {"model": "Alpha Legion Operative", "paints": ["citadel-stegadon-scale-green", "citadel-sotek-green", "citadel-temple-guard-blue"]},
        {"model": "Iron Hands Intercessor", "paints": ["citadel-abaddon-black", "citadel-leadbelcher", "citadel-corax-white"]},
        {"model": "Raven Guard Intercessor", "paints": ["citadel-corvus-black", "citadel-abaddon-black", "citadel-corax-white"]},
        {"model": "White Scars Intercessor", "paints": ["citadel-corax-white", "citadel-white-scar", "citadel-mephiston-red"]},
        {"model": "Cadian Shock Trooper", "paints": ["citadel-zandri-dust", "citadel-castellan-green", "citadel-cadian-fleshtone"]},
        {"model": "Death Korps of Krieg", "paints": ["citadel-death-korps-drab", "citadel-mechanicus-standard-grey", "citadel-leadbelcher"]},
        {"model": "Genestealer Cults Neophyte", "paints": ["citadel-mechanicus-standard-grey", "citadel-abaddon-black", "citadel-rakarth-flesh"]},
        {"model": "Adeptus Mechanicus Skitarii", "paints": ["citadel-mephiston-red", "citadel-leadbelcher", "citadel-rhinox-hide"]},
        {"model": "Aeldari Guardian", "paints": ["citadel-mephiston-red", "citadel-abaddon-black", "citadel-wraithbone"]},
        {"model": "Drukhari Kabalite", "paints": ["citadel-incubi-darkness", "citadel-kabalite-green", "citadel-sybarite-green"]},
        {"model": "Leagues of Votann Hearthkyn", "paints": ["citadel-the-fang", "citadel-zandri-dust", "citadel-leadbelcher"]},
        {"model": "Flesh Tearers Assault Marine", "paints": ["citadel-khorne-red", "citadel-abaddon-black", "citadel-leadbelcher"]},
        {"model": "Khorne Berzerker", "paints": ["citadel-mephiston-red", "citadel-runelord-brass", "citadel-abaddon-black"]}
    ]

    # Verify all paint IDs exist and get budget alternative
    output_schemes = []
    
    non_citadel = [p for p in valid_paints if p['brand'] != 'Citadel']

    for i, scheme in enumerate(schemes):
        budget_palette = []
        for pid in scheme["paints"]:
            if pid not in paint_dict:
                raise ValueError(f"Missing paint ID in scheme {scheme['model']}: {pid}")
                
            orig = paint_dict[pid]
            orig_lab = orig.get('lab') or orig.get('measured_lab')
            
            # find closest non-Citadel paint
            best_match = None
            best_dist = float('inf')
            
            for alt in non_citadel:
                alt_lab = alt.get('lab') or alt.get('measured_lab')
                dist = ciede2000_single(orig_lab, alt_lab)
                if dist < best_dist:
                    best_dist = dist
                    best_match = alt['paint_id']
                    
            budget_palette.append(best_match)
            
        output_schemes.append({
            "id": f"scheme-{i+1}",
            "model": scheme["model"],
            "originalPalette": scheme["paints"],
            "budgetPalette": budget_palette
        })

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'schemestealer-react', 'lib', 'data'))
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "proof_schemes.json")
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output_schemes, f, indent=2)
        
    print(f"Successfully generated {len(output_schemes)} proof schemes to {out_path}")

if __name__ == '__main__':
    build_schemes()
