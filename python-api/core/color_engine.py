"""
Complete Color Engine with Visualization - v2.1 PATCHED
Adds coverage-based chroma thresholds for small detail accuracy

CHANGES FROM v2.0:
- Added coverage parameter to _classify_warm_metals()
- Added coverage parameter to classify_color_family()
- Stricter thresholds for small details (<2% coverage)
- Reduced gold/red/rust confusion
"""

import cv2
import numpy as np
import colorsys
import json
from sklearn.cluster import KMeans
from skimage import color
from skimage.color import deltaE_ciede2000
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, field
from scipy import ndimage

from config import ColorDetection, Visualization, ShadeRules
from utils.logging_config import logger
from core.colour_maths import circular_mean_hue


# ============================================================================
# DATA STRUCTURES
# ============================================================================

@dataclass
class Paint:
    """Paint data structure"""
    name: str
    brand: str
    hex: str
    type: str

    # Curated metadata loaded from paints.json
    color_family: str = ''
    category: str = ''
    finish: str = ''
    transparency: float = 0.0
    matchable: bool = True
    discontinued: bool = False

    # Provenance / identity metadata (Prompt 2.6 rebuilt schema).
    # Defaults keep the OLD paints.json loadable without these keys.
    paint_id: str = ''
    range: str = ''
    aliases: List[str] = field(default_factory=list)
    citadel_equiv: Optional[str] = None
    hex_source: str = 'unknown'

    # Computed colour-space properties (populated by compute_properties)
    rgb: np.ndarray = None
    lab: np.ndarray = None
    hsv: np.ndarray = None
    chroma: float = None
    saturation: float = None
    brightness: float = None

    def compute_properties(self):
        """Compute colour properties from hex."""
        h = self.hex.lstrip('#')
        self.rgb = np.array([int(h[i:i+2], 16) for i in (0, 2, 4)]) / 255.0
        self.lab = color.rgb2lab(np.array([[self.rgb]]))[0][0]
        self.hsv = np.array(colorsys.rgb_to_hsv(*self.rgb))
        self.saturation = self.hsv[1]
        self.brightness = self.hsv[2]
        self.chroma = np.sqrt(self.lab[1]**2 + self.lab[2]**2)


# ============================================================================
# COLOR ANALYZER - COMPLETE FIX SUITE
# ============================================================================

class ColorAnalyzer:
    """Color classification and metallic detection - FINAL VERSION"""
    
    @staticmethod
    def classify_color_family(h: float, s: float, v: float, 
                             chroma: float, is_metallic: bool = False,
                             metallic_type: str = None) -> Tuple[str, float]:
        """
        Classify color with confidence score
        WITH COMPLETE FIX SUITE FOR ALL COLOR FAMILIES
        """
        h_deg = h * 360 if h <= 1 else h
        
        logger.debug(f"Classifying: h={h_deg:.1f}°, s={s:.2f}, v={v:.2f}, "
                    f"chroma={chroma:.1f}, metallic={is_metallic}, type={metallic_type}")
        
        # 1. SPECIAL METALLICS (High confidence) - WITH HUE-AWARE TYPING
        if is_metallic and metallic_type:
            if metallic_type == 'GOLD':
                return ('Gold/Brass', 0.95)
            elif metallic_type == 'COPPER':
                return ('Bronze/Copper', 0.92)
            elif metallic_type == 'SILVER':
                return ('Silver/Steel', 0.95)
            elif metallic_type == 'GUNMETAL':
                return ('Gunmetal/Iron', 0.95)
            else:
                # Fallback
                if chroma > 20:
                    if v > 0.65 and 35 < h_deg < 65:
                        return ('Gold/Brass', 0.95)
                    else:
                        return ('Bronze/Copper', 0.90)
                elif v > 0.65:
                    return ('Silver/Steel', 0.95)
                else:
                    return ('Gunmetal/Iron', 0.95)

        # 2. ACHROMATIC / NEAR-NEUTRAL - WITH ALL COLOR EXCEPTIONS
        is_blue_hue = 180 < h_deg < 260
        is_green_hue = 70 < h_deg < 170
        is_purple_hue = 270 < h_deg < 320
        
        if s < 0.15 or (s < 0.25 and v < 0.4):
            # EXCEPTION 1: Desaturated blues (Ultramarines, Space Wolves)
            if is_blue_hue and s > 0.05 and chroma > 3:
                return ('Blue', 0.75)
            
            # EXCEPTION 2: Desaturated greens (Dark Angels, Salamanders, Death Guard)
            if is_green_hue and s > 0.06 and chroma > 4:
                return ('Green', 0.75)
            
            # EXCEPTION 3: Desaturated purples (Emperor's Children, Drukhari)
            if is_purple_hue and s > 0.05 and chroma > 3:
                return ('Purple', 0.75)
            
            # Standard achromatic classification
            if v > 0.90: return ('Pure White', 0.95)
            elif v > 0.75: return ('Off-White/Bone', 0.85)
            elif v > 0.60: return ('Grey', 0.90)
            elif v > 0.15: return ('Gunmetal/Grey', 0.85)
            elif v > 0.10: return ('Black', 0.95)
            else: return ('Deep Shadow', 0.30)

        families = []
        
        # 3. CHROMATIC CLASSIFICATION - COMPLETE FIX SUITE
        
        # RED ZONE (0-25° and 330-360°)
        if h_deg > 330 or h_deg < 25:
            dist = min(abs(h_deg), abs(360 - h_deg), abs(h_deg - 360))
            conf = max(0, 1.0 - dist / 25)
            
            # Pink detection — pink is a LIGHT, comparatively desaturated
            # tint of red. Deep/bright saturated reds (Mephiston Red #9A1115:
            # s≈0.89; Evil Sunz #C21E10: s≈0.92) must stay Red even when their
            # value is moderate-to-high. Only treat as pink when saturation is
            # genuinely below the pure-red range.
            if v > 0.6 and s < 0.65:
                families.append(('Pink', conf))
            else:
                # Red vs Brown - USE CHROMA (FIX #8)
                if h_deg < 20:
                    if chroma < 15:
                        families.append(('Brown', conf))  # Low chroma = brown
                    elif s < 0.6 and v < 0.4:
                        families.append(('Brown', conf))
                    else:
                        families.append(('Red', conf))  # High chroma = dark red
                elif h_deg < 30 and s < 0.4:
                     families.append(('Gunmetal/Rust', 0.7))
                else:
                    families.append(('Red', conf))
        
        # GOLD/BRONZE/BROWN ZONE (10-60°) - IMPROVED
        if 10 < h_deg < 60:
            # True Gold: Yellow-ish (32-60°), bright, saturated
            if 32 < h_deg < 60 and v > 0.45 and s > 0.35:
                if v > 0.65 and s > 0.55:
                    families.append(('Gold/Yellow', 0.95))
                elif v > 0.50:
                    families.append(('Gold', 0.90))
                else:
                    families.append(('Bronze/Gold', 0.85))
            
            # Bronze/Copper: Redder or darker
            elif h_deg < 32 or (v < 0.45 and s > 0.35):
                if s < 0.40 and v < 0.50:
                    families.append(('Brown', 0.85))
                else:
                    families.append(('Bronze/Copper', 0.85))
            
            # Ochre/Tan: Desaturated
            elif s < 0.35:
                families.append(('Brown/Tan', 0.75))
            else:
                families.append(('Brown', 0.70))
        
        # YELLOW ZONE (45-95°) - EXPANDED (FIX #9)
        if 45 < h_deg < 95:
            if s > 0.50 and v > 0.65:
                families.append(('Yellow', 0.9))
            elif s > 0.30 and v > 0.75:
                families.append(('Yellow', 0.85))  # Pale yellow
            else:
                families.append(('Bone/Beige', 0.8))
        
        # GREEN ZONE (60-170°) - WITH CYAN DISAMBIGUATION (FIX #6)
        if 60 < h_deg < 170:
            # Check if it's actually cyan (165-180° overlap)
            if 165 < h_deg < 180 and chroma > 25:
                families.append(('Cyan/Turquoise', 0.9))
            else:
                conf = 1.0 - abs(h_deg - 110) / 50
                families.append(('Green', max(0, conf)))
        
        # CYAN ZONE (170-190°) - STRICT RANGE
        if 170 < h_deg < 190:
            conf = 1.0 - abs(h_deg - 180) / 10
            families.append(('Cyan/Turquoise', max(0, conf)))
        
        # BLUE ZONE (185-260°) - Starts later to avoid cyan overlap
        if 185 < h_deg < 260:
            conf = 1.0 - abs(h_deg - 220) / 40
            if s > 0.2:
                families.append(('Blue', max(0, conf)))
            else:
                families.append(('Grey/Blue', 0.6))
        
        # PURPLE ZONE (250-320°)
        if 250 < h_deg < 320:
            conf = 1.0 - abs(h_deg - 285) / 35
            if v < 0.6:
                families.append(('Purple', max(0, conf)))
            else:
                families.append(('Pink/Purple', max(0, conf)))
        
        # MAGENTA ZONE (290-340°)
        if 290 < h_deg < 340:
            conf = 1.0 - abs(h_deg - 315) / 25
            if v > 0.5:
                families.append(('Pink/Magenta', max(0, conf)))
            else:
                families.append(('Magenta', max(0, conf)))
        
        if families:
            best = max(families, key=lambda x: x[1])
            if best[1] > 0.15:
                return best
            else:
                return best
        
        # Improved fallback
        if s < 0.15:
            if v > 0.70: return ('Light Grey', 0.4)
            elif v > 0.40: return ('Grey', 0.4)
            elif v > 0.15: return ('Dark Grey', 0.4)
            else: return ('Near Black', 0.3)
        
        return ('Unknown', 0.0)
    
    @staticmethod
    def detect_metallic(pixels_hsv: np.ndarray) -> Tuple[bool, Optional[str]]:
        """
        Detect metallic surfaces AND determine type
        WITH HUE-AWARE TYPING
        """
        brightness_values = pixels_hsv[:, 2] * 255
        brightness_std = np.std(brightness_values)
        median_sat = np.median(pixels_hsv[:, 1])
        median_val = np.median(pixels_hsv[:, 2])
        # Use circular mean so red pixels near 0°/360° are not misclassified as cyan.
        median_hue = circular_mean_hue(pixels_hsv[:, 0]) * 360

        # Check if metallic.
        is_std_metallic = (brightness_std > 25)
        # Require meaningful brightness variance to avoid flagging flat dark-grey
        # surfaces (shaded armour, black cloaks) as gunmetal.
        is_dark_gunmetal = (brightness_std > 18) and (median_val < 0.65) and (median_sat < 0.25)
        is_metallic = is_std_metallic or is_dark_gunmetal
        
        logger.debug(f"Metallic check: std={brightness_std:.1f}, sat={median_sat:.2f}, "
                    f"val={median_val:.2f}, hue={median_hue:.1f}°")
        
        if not is_metallic:
            return False, None
        
        # DETERMINE METALLIC TYPE by hue and saturation
        
        # Gold: Yellow-orange (30-60°) with saturation
        if 30 < median_hue < 60 and median_sat > 0.25:
            logger.info("Metallic type: GOLD")
            return True, 'GOLD'
        
        # Copper/Bronze: Orange-red (5-30° or 340-360°)
        elif (5 < median_hue < 30 or median_hue > 340) and median_sat > 0.25:
            logger.info("Metallic type: COPPER")
            return True, 'COPPER'
        
        # Silver/Steel: Desaturated, bright
        elif median_sat < 0.20 and median_val > 0.45:
            logger.info("Metallic type: SILVER")
            return True, 'SILVER'
        
        # Gunmetal/Iron: Desaturated, dark
        elif median_sat < 0.20 and median_val < 0.45:
            logger.info("Metallic type: GUNMETAL")
            return True, 'GUNMETAL'
        
        # Unknown metallic
        else:
            logger.info("Metallic type: UNKNOWN")
            return True, 'UNKNOWN'
    
    @staticmethod
    def analyze_color_temperature(lab: np.ndarray) -> str:
        """
        Determine if color is warm, cool, or neutral
        """
        L, a, b = lab
        
        warmth_score = b * 0.7 + a * 0.3
        
        if warmth_score > 15:
            return 'warm'
        elif warmth_score < -15:
            return 'cool'
        else:
            return 'neutral'
    
    @staticmethod
    def classify_surface_type(brightness_std: float, edge_density: float = None) -> str:
        """
        Classify surface finish based on texture
        """
        if brightness_std > 35:
            return 'metallic'
        elif brightness_std > 20:
            return 'weathered'
        elif brightness_std < 10:
            return 'smooth'
        else:
            return 'textured'


# ============================================================================
# CANONICAL COLOUR FAMILY — shared between the engine and the DB builder
# ============================================================================
#
# classify_color_family() returns composite display strings ("Gold/Brass",
# "Off-White/Bone", "Pink/Purple"). The DB and scan-time code agree on a flat
# lowercase vocabulary. compute_color_family() is the SINGLE code path that both
# the engine and scripts/build_paints_db.py use, so DB families and detection
# families are produced by identical logic (the root-cause fix for the
# "grey that is actually pink" bug).

# Flat lowercase families the DB and engine recognise.
RECOGNISED_FAMILIES = {
    'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink',
    'magenta', 'brown', 'flesh', 'bone', 'white', 'grey', 'black',
    'gold', 'silver', 'bronze', 'copper',
}

# classify_color_family() composite output -> canonical flat family.
_FAMILY_NORMALISE = {
    'gold/brass': 'gold', 'gold/yellow': 'gold', 'gold': 'gold',
    'bronze/gold': 'bronze', 'bronze/copper': 'bronze',
    'silver/steel': 'silver', 'gunmetal/iron': 'silver',
    'gunmetal/grey': 'grey', 'gunmetal/rust': 'brown',
    'pure white': 'white', 'off-white/bone': 'bone', 'bone/beige': 'bone',
    'grey': 'grey', 'light grey': 'grey', 'dark grey': 'grey',
    'grey/blue': 'blue', 'black': 'black', 'deep shadow': 'black',
    'near black': 'black', 'blue': 'blue', 'green': 'green',
    'purple': 'purple', 'pink': 'pink', 'pink/purple': 'pink',
    'pink/magenta': 'pink', 'magenta': 'magenta', 'brown': 'brown',
    'brown/tan': 'brown', 'red': 'red', 'cyan/turquoise': 'cyan',
    'yellow': 'yellow', 'unknown': 'grey',
}

# When a NON-metallic paint lands on a metallic-ish family via the hue zones
# (e.g. a dark warm brown returning "Bronze/Copper"), remap to the nearest
# non-metallic family so matte paints never carry a metal family.
_NON_METALLIC_REMAP = {
    'gold': 'yellow', 'bronze': 'brown', 'copper': 'brown', 'silver': 'grey',
}


def _metallic_type_from_hsv(h_deg: float, s: float, v: float) -> str:
    """Single-colour metallic typing — mirrors ColorAnalyzer.detect_metallic."""
    if 30 < h_deg < 60 and s > 0.25:
        return 'GOLD'
    if (5 < h_deg < 30 or h_deg > 340) and s > 0.25:
        return 'COPPER'
    if s < 0.20 and v > 0.45:
        return 'SILVER'
    if s < 0.20 and v < 0.45:
        return 'GUNMETAL'
    return 'UNKNOWN'


def compute_color_family(hex_str: str, finish: str = 'matte') -> str:
    """Compute a paint's canonical flat colour family from its hex.

    Uses ColorAnalyzer.classify_color_family (the same classifier the engine
    runs at scan time) and normalises the composite output to RECOGNISED_FAMILIES.
    finish='metallic' enables metallic typing so gold/silver/bronze are preserved.
    """
    h = hex_str.lstrip('#')
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]) / 255.0
    lab = color.rgb2lab(np.array([[rgb]]))[0][0]
    hsv = colorsys.rgb_to_hsv(*rgb)
    h_deg, s, v = hsv[0] * 360, hsv[1], hsv[2]
    chroma = float(np.sqrt(lab[1] ** 2 + lab[2] ** 2))

    is_metallic = (finish or '').lower() == 'metallic'
    metallic_type = _metallic_type_from_hsv(h_deg, s, v) if is_metallic else None

    display, _conf = ColorAnalyzer.classify_color_family(
        hsv[0], s, v, chroma,
        is_metallic=is_metallic, metallic_type=metallic_type,
    )
    canonical = _FAMILY_NORMALISE.get(display.lower(), 'grey')

    if not is_metallic and canonical in _NON_METALLIC_REMAP:
        canonical = _NON_METALLIC_REMAP[canonical]

    return canonical if canonical in RECOGNISED_FAMILIES else 'grey'


# ============================================================================
# SHADE TYPE ANALYZER - ENHANCED (AMERICAN SPELLING)
# ============================================================================

class ShadeTypeAnalyser:
    """Determine wash vs paint for shading - ENHANCED"""
    
    @staticmethod
    def determine_shade_type(cluster_data: Dict, brightness_std: float, family: str) -> str:
        """
        Returns 'wash' or 'paint'
        WITH SURFACE TYPE CLASSIFICATION
        """
        
        # Use surface type
        surface_type = ColorAnalyzer.classify_surface_type(brightness_std)
        
        # Metallic/weathered surfaces → wash
        if surface_type in ['metallic', 'weathered']:
            return 'wash'
        
        # METALLICS ALWAYS GET WASHES
        if (cluster_data.get('is_metallic', False) or 
            "Silver" in family or "Gold" in family or 
            "Bronze" in family or "Gunmetal" in family or 
            "Iron" in family or "Rust" in family):
            return 'wash'
        
        # HIGH TEXTURE = WASH
        if brightness_std > 30:
            return 'wash'
        
        # KEYWORD CHECK
        family_lower = family.lower()
        for keyword in ShadeRules.WASH_KEYWORDS:
            if keyword in family_lower:
                return 'wash'
        
        # VERY DARK COLORS = WASH
        median_value = cluster_data.get('median_hsv', [0, 0, 0])[2]
        if median_value < ShadeRules.DARK_VALUE_THRESHOLD:
            return 'wash'
        
        # Default: paint shade (layering)
        return 'paint'


# ============================================================================
# PAINT MATCHER — vectorised CIEDE2000 (replaces Euclidean KDTree)
# ============================================================================

_METALLIC_KEYWORDS = ("Silver", "Steel", "Gold", "Bronze", "Metal",
                      "Retributor", "Leadbelcher", "Iron")

# Role → DB category sets.  Callers request a semantic role; the matcher
# expands it to the relevant DB category strings stored in Paint.type.
ROLE_CATEGORIES: Dict[str, set] = {
    'dominant':  {'base', 'layer', 'air', 'contrast'},
    'highlight': {'base', 'layer', 'air', 'contrast'},
    'shade':     {'wash', 'shade', 'ink', 'contrast'},
    'wash':      {'wash', 'shade', 'ink'},
}

# Backward-compat shim: old paint_type strings → new role names.
_TYPE_TO_ROLE: Dict[str, str] = {
    'paint': 'dominant',
    'wash':  'wash',
}

# ΔE penalty per unit transparency for dominant/highlight roles.
# Contrast paint with transparency=0.7 → +5.6 ΔE penalty.
TRANSPARENCY_PENALTY: float = 8.0

# ΔE threshold below which two same-brand paints are considered duplicates
# (used in match_top_n deduplication).
_DEDUP_THRESHOLD: float = 2.0

from core.colour_maths import ciede2000_single as _ciede2000_single


class PaintMatcher:
    """Match colours to paint database using vectorised CIEDE2000."""

    def __init__(self, paint_db: List[Paint]):
        # Exclude non-matchable paints from the search index.
        matchable = [p for p in paint_db if p.matchable]
        self.paint_db = matchable
        # Precompute arrays once — rows correspond to paint_db order.
        self.lab_matrix = np.array([p.lab for p in matchable], dtype=float)   # (N, 3)
        self.brands_arr = np.array([p.brand for p in matchable])               # (N,)
        self.types_arr  = np.array([p.type.lower() for p in matchable])        # (N,) lowercase
        self.finish_arr = np.array([p.finish.lower() for p in matchable])      # (N,)
        self.transp_arr = np.array([p.transparency for p in matchable],
                                   dtype=float)                                 # (N,)
        logger.info(f"Paint matcher initialised: {len(matchable)}/{len(paint_db)} "
                    "matchable paints (vectorised CIEDE2000)")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _candidates_mask(self, brand: str, role: str) -> np.ndarray:
        cats = ROLE_CATEGORIES.get(role.lower(), {role.lower()})
        return (self.brands_arr == brand) & np.isin(self.types_arr, list(cats))

    @staticmethod
    def _ciede2000_vs_matrix(target_lab: np.ndarray,
                              candidate_labs: np.ndarray) -> np.ndarray:
        """Vectorised CIEDE2000 of one target against N candidates — returns (N,) array."""
        n = len(candidate_labs)
        t = np.tile(target_lab, (n, 1)).reshape(n, 1, 3)
        c = candidate_labs.reshape(n, 1, 3)
        return deltaE_ciede2000(t, c).flatten()

    @staticmethod
    def _is_metallic_paint(name: str) -> bool:
        return any(kw in name for kw in _METALLIC_KEYWORDS)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def match_color(self, target_rgb: np.ndarray, brand: str,
                    role: str = 'dominant',
                    context: Dict = None,
                    paint_type: str = None) -> Optional[Paint]:
        """Return the best-matching paint for target_rgb in the given brand/role.

        paint_type is accepted for backward compatibility and mapped to role.
        """
        if paint_type is not None:
            role = _TYPE_TO_ROLE.get(paint_type.lower(), paint_type.lower())

        target_rgb_norm = target_rgb / 255.0 if target_rgb.max() > 1 else target_rgb
        target_lab = color.rgb2lab(np.array([[target_rgb_norm]]))[0][0]

        mask = self._candidates_mask(brand, role)

        # ── Metallic finish gate (skip for shade/wash roles) ─────────────
        if role not in ('shade', 'wash') and context:
            # Accept both legacy bool and new float metallic_score
            raw = context.get('metallic_score')
            if raw is None:
                raw = float(bool(context.get('is_metallic', False)))
            metallic_score = float(raw)

            if metallic_score >= 0.5:
                metallic_mask = mask & (self.finish_arr == 'metallic')
                if metallic_mask.any():
                    mask = metallic_mask
                else:
                    logger.info(f"Metallic pool empty for {brand}/{role}, "
                                "falling back to unrestricted candidates")
            elif metallic_score == 0.0:
                mask = mask & (self.finish_arr != 'metallic')
        elif role not in ('shade', 'wash'):
            # No context → exclude metallics from opaque paint matches
            mask = mask & (self.finish_arr != 'metallic')

        candidate_indices = np.where(mask)[0]
        if len(candidate_indices) == 0:
            return None

        candidate_labs = self.lab_matrix[candidate_indices]
        distances = self._ciede2000_vs_matrix(target_lab, candidate_labs).copy()

        # ── Transparency penalty (dominant/highlight only) ────────────────
        if role in ('dominant', 'highlight'):
            distances += self.transp_arr[candidate_indices] * TRANSPARENCY_PENALTY

        # ── Legacy context-aware metallic name penalties ──────────────────
        if context and role not in ('shade', 'wash'):
            is_target_metallic = bool(context.get('metallic_score',
                                                   context.get('is_metallic', False)))
            for local_i, global_i in enumerate(candidate_indices):
                paint_metallic = self._is_metallic_paint(self.paint_db[global_i].name)
                if not is_target_metallic and paint_metallic:
                    distances[local_i] += 100
                elif is_target_metallic:
                    distances[local_i] += -30 if paint_metallic else 50

        best_local = int(np.argmin(distances))
        return self.paint_db[candidate_indices[best_local]]

    def match_top_n(self, target_lab: np.ndarray, brand: str = None,
                    role: str = None, n: int = 5,
                    paint_type: str = None) -> List[Tuple[Paint, float]]:
        """Return top-N closest paints by CIEDE2000, optionally filtered by brand/role.

        paint_type accepted for backward compatibility.
        Results within ΔE 2.0 of each other (same brand) are deduplicated.
        """
        if paint_type is not None and role is None:
            role = _TYPE_TO_ROLE.get(paint_type.lower(), paint_type.lower())

        if brand is not None and role is not None:
            mask = self._candidates_mask(brand, role)
        elif brand is not None:
            mask = self.brands_arr == brand
        elif role is not None:
            cats = ROLE_CATEGORIES.get(role.lower(), {role.lower()})
            mask = np.isin(self.types_arr, list(cats))
        else:
            mask = np.ones(len(self.paint_db), dtype=bool)

        candidate_indices = np.where(mask)[0]
        if len(candidate_indices) == 0:
            return []

        candidate_labs = self.lab_matrix[candidate_indices]
        distances = self._ciede2000_vs_matrix(
            np.asarray(target_lab, dtype=float), candidate_labs
        )

        # Deduplicate: skip same-brand candidates within ΔE 2.0 of an already-
        # included paint to avoid returning near-identical colours.
        results: List[Tuple[Paint, float]] = []
        included: List[Paint] = []  # paints already in results

        for local_i in np.argsort(distances):
            if len(results) >= n:
                break
            global_i = candidate_indices[local_i]
            paint = self.paint_db[global_i]
            dist = float(distances[local_i])

            too_similar = any(
                inc.brand == paint.brand
                and _ciede2000_single(paint.lab, inc.lab) < _DEDUP_THRESHOLD
                for inc in included
            )
            if not too_similar:
                results.append((paint, dist))
                included.append(paint)

        return results


# ============================================================================
# VISUALIZATION ENGINE (UNCHANGED FROM ORIGINAL)
# ============================================================================

class VisualizationEngine:
    """Create tactical reticle overlays"""
    
    @staticmethod
    def create_color_overlay(img: np.ndarray, color_mask: np.ndarray,
                            color_rgb: np.ndarray, reticle_pos: Tuple[int, int]) -> np.ndarray:
        """Create tactical HUD overlay"""
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        gray_rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)
        
        base = (gray_rgb * 0.3).astype(np.uint8)
        overlay = base.copy().astype(float)
        
        if np.any(color_mask):
            mask_float = color_mask.astype(float)
            
            blur_size = 3
            soft_mask = cv2.GaussianBlur(
                mask_float, 
                (blur_size, blur_size),
                1
            )
            
            for c in range(3):
                overlay[:, :, c] += (color_rgb[c] * soft_mask * 0.7 * 255)
            
            mask_uint8 = (mask_float * 255).astype(np.uint8)
            edges = cv2.Canny(mask_uint8, 100, 200)
            edge_mask = edges > 0
            overlay[edge_mask] = color_rgb * 255 
            
        overlay = np.clip(overlay, 0, 255).astype(np.uint8)
        
        overlay = VisualizationEngine.draw_enhanced_reticle(
            overlay, reticle_pos[0], reticle_pos[1], color_rgb
        )
        
        return overlay
    
    @staticmethod
    def draw_enhanced_reticle(img: np.ndarray, x: int, y: int,
                             target_color_rgb: np.ndarray = None) -> np.ndarray:
        """Draw sci-fi / Warhammer auspex style reticle"""
        
        if target_color_rgb is not None:
             hud_color = (0, 255, 100)
        else:
             hud_color = (0, 255, 100)
             
        result = img.copy()
        
        radius = 25
        cv2.ellipse(result, (x, y), (radius, radius), 0, 0, 70, hud_color, 2)
        cv2.ellipse(result, (x, y), (radius, radius), 0, 90, 160, hud_color, 2)
        cv2.ellipse(result, (x, y), (radius, radius), 0, 180, 250, hud_color, 2)
        cv2.ellipse(result, (x, y), (radius, radius), 0, 270, 340, hud_color, 2)
        
        cv2.circle(result, (x, y), 2, (255, 255, 255), -1)
        
        bracket_dist = 40
        bracket_len = 10
        
        cv2.line(result, (x - bracket_dist, y - bracket_dist), (x - bracket_dist + bracket_len, y - bracket_dist), hud_color, 1)
        cv2.line(result, (x - bracket_dist, y - bracket_dist), (x - bracket_dist, y - bracket_dist + bracket_len), hud_color, 1)
        
        cv2.line(result, (x + bracket_dist, y - bracket_dist), (x + bracket_dist - bracket_len, y - bracket_dist), hud_color, 1)
        cv2.line(result, (x + bracket_dist, y - bracket_dist), (x + bracket_dist, y - bracket_dist + bracket_len), hud_color, 1)

        cv2.line(result, (x - bracket_dist, y + bracket_dist), (x - bracket_dist + bracket_len, y + bracket_dist), hud_color, 1)
        cv2.line(result, (x - bracket_dist, y + bracket_dist), (x - bracket_dist, y + bracket_dist - bracket_len), hud_color, 1)
        
        cv2.line(result, (x + bracket_dist, y + bracket_dist), (x + bracket_dist - bracket_len, y + bracket_dist), hud_color, 1)
        cv2.line(result, (x + bracket_dist, y + bracket_dist), (x + bracket_dist, y + bracket_dist - bracket_len), hud_color, 1)
        
        cv2.line(result, (x - radius, y), (x - radius - 10, y), hud_color, 1)
        cv2.line(result, (x + radius, y), (x + radius + 10, y), hud_color, 1)
        
        cv2.putText(result, "TRGT_LOCK", (x + bracket_dist - 40, y + bracket_dist + 15), 
                   cv2.FONT_HERSHEY_PLAIN, 0.8, hud_color, 1)
        
        return result
    
    @staticmethod
    def find_optimal_reticle_position(color_mask: np.ndarray, 
                                     exclude_bottom_pct: float = 0.2) -> Tuple[int, int]:
        """Find optimal reticle position using distance transform"""
        if not np.any(color_mask):
            height, width = color_mask.shape
            return (width // 2, height // 2)
        
        height, width = color_mask.shape
        
        search_mask = color_mask.copy()
        cutoff_y = int(height * (1.0 - exclude_bottom_pct))
        search_mask[cutoff_y:, :] = False
        
        if not np.any(search_mask):
            search_mask = color_mask
        
        mask_u8 = search_mask.astype(np.uint8) * 255
        dist_transform = cv2.distanceTransform(mask_u8, cv2.DIST_L2, 5)
        _, max_val, _, max_loc = cv2.minMaxLoc(dist_transform)
        
        if max_val > 0:
            return max_loc
        
        coords = cv2.findNonZero(mask_u8)
        if coords is not None:
            x, y, w, h = cv2.boundingRect(coords)
            return (x + w//2, y + h//2)
        
        return (width // 2, height // 2)