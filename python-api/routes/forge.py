from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
import json
from skimage.color import deltaE_ciede2000

from core.schemestealer_engine import resolve_paint_db_path
from core.color_engine import _ciede2000_single

router = APIRouter(prefix="/api/forge", tags=["Forge"])

class RackAnalysisRequest(BaseModel):
    inventory: List[str]

_paints_cache = None

def get_opaque_paints():
    global _paints_cache
    if _paints_cache is None:
        with open(resolve_paint_db_path(), 'r') as f:
            raw = json.load(f)
        # Filter for standard opaque paints (no washes/shades/technical)
        _paints_cache = [
            p for p in raw
            if p.get('matchable', True) and not p.get('discontinued', False)
            and p.get('category', '').lower() not in ('wash', 'shade', 'contrast', 'technical')
        ]
    return _paints_cache

@router.post("/rack-analysis")
async def rack_analysis(req: RackAnalysisRequest) -> Dict[str, Any]:
    paints = get_opaque_paints()
    if not paints:
        raise HTTPException(status_code=500, detail="Paint DB empty")
        
    # Separate owned and unowned
    owned_ids = set(req.inventory)
    owned = [p for p in paints if p.get('paint_id') in owned_ids]
    unowned = [p for p in paints if p.get('paint_id') not in owned_ids]
    
    if not unowned:
        return {"coverage_pct": 100.0, "suggestions": []}
        
    is_empty = False
    if not owned:
        # If no inventory, coverage is 0. Suggest some maximal spread basics
        seed = unowned[0]
        owned = [seed]
        unowned = unowned[1:]
        is_empty = True

    # Extract LAB vectors
    owned_labs = np.array([p['lab'] for p in owned])
    unowned_labs = np.array([p['lab'] for p in unowned])
    
    # Precompute distances from unowned to owned
    min_dists = np.zeros(len(unowned))
    for i, u_lab in enumerate(unowned_labs):
        dists = deltaE_ciede2000(u_lab, owned_labs)
        min_dists[i] = np.min(dists)
        
    # Gamut coverage
    covered = np.sum(min_dists <= 4.0)
    total_space = len(paints)
    coverage_pct = round(((len(owned) + covered) / total_space) * 100, 1)
    if is_empty:
        coverage_pct = 0.0
        
    # Greedy K-Centre
    suggestions = []
    
    for _ in range(5):
        if len(unowned) == 0:
            break
        farthest_idx = np.argmax(min_dists)
        best_paint = unowned[farthest_idx]
        suggestions.append({
            "paint_id": best_paint.get("paint_id"),
            "name": best_paint.get("name"),
            "brand": best_paint.get("brand"),
            "hex": best_paint.get("hex"),
            "gap_size": round(float(min_dists[farthest_idx]), 1)
        })
        
        new_lab = unowned_labs[farthest_idx]
        new_dists = deltaE_ciede2000(unowned_labs, new_lab)
        min_dists = np.minimum(min_dists, new_dists)
        
        unowned.pop(farthest_idx)
        unowned_labs = np.delete(unowned_labs, farthest_idx, axis=0)
        min_dists = np.delete(min_dists, farthest_idx)

    if is_empty:
        suggestions.insert(0, {
            "paint_id": seed.get("paint_id"),
            "name": seed.get("name"),
            "brand": seed.get("brand"),
            "hex": seed.get("hex"),
            "gap_size": 100.0
        })
        suggestions = suggestions[:5]

    return {
        "coverage_pct": coverage_pct,
        "suggestions": suggestions
    }
