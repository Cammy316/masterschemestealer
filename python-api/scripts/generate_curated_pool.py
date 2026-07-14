import json
import math
import os
import sys

def get_chroma(lab):
    return math.hypot(lab[1], lab[2])

def is_eligible_base(paint):
    cat = paint.get('category', '').lower()
    if cat in ('wash', 'shade', 'ink'):
        return False
    if paint.get('discontinued', False):
        return False
    source = paint.get('color_source', '')
    if source not in ('measured', 'swatch-median'):
        return False
    lab = paint.get('lab') or paint.get('measured_lab')
    if not lab:
        return False
    if get_chroma(lab) < 12:
        return False
    return True

def is_curated(paint):
    if not is_eligible_base(paint):
        return False
        
    brand = paint.get('brand', '')
    range_name = paint.get('range', '')
    cat = paint.get('category', '').lower()
    
    is_citadel = (brand == 'Citadel' and cat in ('base', 'layer'))
    is_vallejo = (brand == 'Vallejo' and range_name == 'Game Color')
    is_army_painter = (brand == 'Army Painter' and 'Speedpaint' not in range_name)
    
    return is_citadel or is_vallejo or is_army_painter

def main():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'paints_groundtruth.json')
    with open(db_path, 'r', encoding='utf-8') as f:
        paints = json.load(f)
        
    curated = [p['paint_id'] for p in paints if is_curated(p)]
    curated.sort()
    
    out_path = os.path.join(os.path.dirname(__file__), 'curated_pool.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(curated, f, indent=2)
        
    print(f"Generated curated_pool.json with {len(curated)} paints.")

if __name__ == '__main__':
    main()
