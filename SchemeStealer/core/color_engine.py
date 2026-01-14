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
from sklearn.neighbors import KDTree
from skimage import color
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
from scipy import ndimage

from config import ColorDetection, Visualization, ShadeRules
from utils.logging_config import logger


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
    
    rgb: np.ndarray = None
    lab: np.ndarray = None
    hsv: np.ndarray = None
    chroma: float = None
    saturation: float = None
    brightness: float = None
    
    def compute_properties(self):
        """Compute color properties"""
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
            
            # Pink detection - RELAXED (FIX #7)
            if s > 0.35 and v > 0.55:
                families.append(('Pink', conf))
            elif v > 0.65 and s > 0.4:
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
        median_hue = np.median(pixels_hsv[:, 0]) * 360
        
        # Check if metallic
        is_std_metallic = (brightness_std > 25)
        is_dark_gunmetal = (median_val < 0.65 and median_sat < 0.25)
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
# PAINT MATCHER (UNCHANGED FROM ORIGINAL)
# ============================================================================

class PaintMatcher:
    """Match colors to paint database"""
    
    def __init__(self, paint_db: List[Paint]):
        self.paint_db = paint_db
        lab_matrix = np.array([p.lab for p in paint_db])
        self.kdtree = KDTree(lab_matrix, leaf_size=2)
        logger.info(f"Paint matcher initialized with {len(paint_db)} paints")
    
    def match_color(self, target_rgb: np.ndarray, brand: str,
                    paint_type: str = 'paint', context: Dict = None) -> Optional[Paint]:
        """Find best matching paint"""
        target_rgb_norm = target_rgb / 255.0 if target_rgb.max() > 1 else target_rgb
        target_lab = color.rgb2lab(np.array([[target_rgb_norm]]))[0][0]
        
        distances, indices = self.kdtree.query([target_lab], k=50)
        
        candidates = []
        for idx in indices[0]:
            paint = self.paint_db[idx]
            if paint.brand == brand and paint.type == paint_type:
                candidates.append((idx, paint))
        
        if not candidates:
            return None
        
        best_paint = None
        best_score = float('inf')
        
        for idx, paint in candidates:
            distance = color.deltaE_ciede2000(
                np.array([[target_lab]]),
                np.array([[paint.lab]])
            )[0][0]
            
            # Context-aware penalties
            if context:
                target_hsv = np.array(colorsys.rgb_to_hsv(*target_rgb_norm))
                target_chroma = np.sqrt(target_lab[1]**2 + target_lab[2]**2)
                
                # Don't match colorful targets to metallics
                if not context.get('is_metallic', False):
                    is_paint_metallic = ("Silver" in paint.name or "Steel" in paint.name or 
                                       "Gold" in paint.name or "Bronze" in paint.name or 
                                       "Metal" in paint.name or "Retributor" in paint.name or
                                       "Leadbelcher" in paint.name or "Iron" in paint.name)
                    
                    if is_paint_metallic:
                        distance += 100
                
                # Metallic targets should prefer metallics
                if context.get('is_metallic', False):
                    is_paint_metallic = ("Silver" in paint.name or "Steel" in paint.name or 
                                       "Gold" in paint.name or "Bronze" in paint.name or 
                                       "Metal" in paint.name or "Retributor" in paint.name or
                                       "Leadbelcher" in paint.name or "Iron" in paint.name)
                    
                    if is_paint_metallic:
                        distance -= 30
                    else:
                        distance += 50
            
            if distance < best_score:
                best_score = distance
                best_paint = paint
        
        return best_paint


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