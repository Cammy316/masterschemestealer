import hashlib
import json
import math
import os
import sys
from datetime import date, timedelta

# Ensure we can import from core
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from core.recipe_geometry import FAMILY_ADJACENCY

SALT = "SCHEMESTEALER_AUGURY_V1"

def get_chroma(lab):
    return math.hypot(lab[1], lab[2])

def is_eligible(paint):
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

def generate_puzzles():
    db_path = os.path.join(os.path.dirname(__file__), '..', 'paints_groundtruth.json')
    with open(db_path, 'r', encoding='utf-8') as f:
        paints = json.load(f)
        
    pool = sorted([p for p in paints if is_eligible(p)], key=lambda x: x['paint_id'])
    if not pool:
        raise ValueError("No eligible paints found!")
        
    days = {}
    used_60_days = []
    
    start_date = date.today()
    for i in range(400):
        current_date = start_date + timedelta(days=i)
        date_iso = current_date.isoformat()
        
        # Stable random choice avoiding the 60 day window.
        base_hash = int(hashlib.sha256((date_iso + SALT).encode('utf-8')).hexdigest(), 16)
        
        for offset in range(len(pool)):
            idx = (base_hash + offset) % len(pool)
            candidate = pool[idx]['paint_id']
            if candidate not in used_60_days:
                days[date_iso] = {"answer": candidate}
                used_60_days.append(candidate)
                if len(used_60_days) > 60:
                    used_60_days.pop(0)
                break
                
    output = {
        "salt_version": 1,
        "familyAdjacency": {k: list(v) for k, v in FAMILY_ADJACENCY.items()},
        "days": days
    }
    
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'schemestealer-react', 'lib', 'data'))
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "daily_puzzles.json")
    
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"Generated {len(days)} daily puzzles to {out_path}")

if __name__ == '__main__':
    generate_puzzles()
