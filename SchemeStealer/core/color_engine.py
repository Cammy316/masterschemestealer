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
# COLOR ANALYZER - v2.1 PATCHED
# ============================================================================

class ColorAnalyzer:
    """Color classification and metallic detection - v2.1"""
    
    @staticmethod
    def classify_color_family(h: float, s: float, v: float, 
                             chroma: float, is_metallic: bool = False,
                             lab: np.ndarray = None,
                             coverage: float = 100.0) -> Tuple[str, float]:  # NEW: coverage param
        """
        Classify color with confidence score
        
        v2.1 IMPROVEMENT: coverage parameter for small detail handling
        """
        h_deg = h * 360 if h <= 1 else h
        
        # Debug logging
        logger.debug(f"Classifying: h={h_deg:.1f}°, s={s:.2f}, v={v:.2f}, chroma={chroma:.1f}, metallic={is_metallic}, coverage={coverage:.1f}%")
        
        # --- STRATEGY: HIERARCHICAL CLASSIFICATION ---
        
        # 1. SPECIAL METALLICS (High confidence)
        if is_metallic:
            # Use NEW warm metal separation logic with coverage
            if chroma > 15:
                warm_metal_family = ColorAnalyzer._classify_warm_metals(
                    h_deg, s, v, chroma, lab, is_metallic=True, coverage=coverage  # Pass coverage
                )
                if warm_metal_family:
                    return (warm_metal_family, 0.95)
            
            # Achromatic metallics (Silver/Gunmetal)
            if v > 0.65:
                return ('Silver/Steel', 0.95)
            else:
                return ('Gunmetal/Iron', 0.95)

        # 2. ACHROMATIC / NEAR-NEUTRAL (Grey, Black, White)
        if s < 0.12 or (s < 0.18 and v < 0.35):
            if v > 0.90: return ('Pure White', 0.95)
            elif v > 0.75: return ('Off-White/Bone', 0.85)
            elif v > 0.60: 
                return ('Grey', 0.90)
            elif v > 0.08: 
                return ('Gunmetal/Grey', 0.85) 
            else: return ('Black', 0.95)

        families = []
        
        # 3. CHROMATIC CLASSIFICATION
        
        # Red
        if h_deg > 330 or h_deg < 25:
            dist = min(abs(h_deg), abs(360 - h_deg), abs(h_deg - 360))
            conf = max(0, 1.0 - dist / 25)
            
            if v > 0.65 and s > 0.4:
                families.append(('Pink', conf))
            else:
                # Deep/Dark Red vs Brown - Use chroma to separate
                if h_deg < 20 and v < 0.40 and chroma < 20:
                    families.append(('Brown', conf))
                elif h_deg < 30 and s < 0.4:
                     families.append(('Gunmetal/Rust', 0.7)) 
                else:
                    families.append(('Red', conf))
        
        # Orange/Brown/Gold Zone - IMPROVED WITH CHROMA + COVERAGE
        if 10 < h_deg < 50:
            warm_family = ColorAnalyzer._classify_warm_metals(
                h_deg, s, v, chroma, lab, is_metallic=False, coverage=coverage  # Pass coverage
            )
            if warm_family:
                families.append((warm_family, 0.85))
        
        # Yellow
        if 45 < h_deg < 80:
            if s > 0.5 and v > 0.7:
                families.append(('Yellow', 0.9))
            else:
                families.append(('Bone/Beige', 0.8))
        
        # Green
        if 60 < h_deg < 160:
            conf = 1.0 - abs(h_deg - 110) / 50
            families.append(('Green', max(0, conf)))
        
        # Cyan
        if 150 < h_deg < 190:
            conf = 1.0 - abs(h_deg - 170) / 20
            families.append(('Cyan/Turquoise', max(0, conf)))
        
        # Blue
        if 180 < h_deg < 260:
            conf = 1.0 - abs(h_deg - 220) / 40
            if s > 0.2:
                families.append(('Blue', max(0, conf)))
            else:
                families.append(('Grey/Blue', 0.6))
        
        # Purple
        if 250 < h_deg < 310:
            conf = 1.0 - abs(h_deg - 280) / 30
            families.append(('Purple', max(0, conf)))
        
        # Magenta
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
        
        # Fallback
        if s < 0.15:
            if v > 0.6: return ('Grey', 0.3)
            else: return ('Gunmetal/Grey', 0.3)
        return ('Unknown', 0.0)
    
    @staticmethod
    def _classify_warm_metals(h_deg: float, s: float, v: float, 
                             chroma: float, lab: np.ndarray = None,
                             is_metallic: bool = True,
                             coverage: float = 100.0) -> Optional[str]:  # NEW: coverage param
        """
        v2.1 IMPROVED: Separate Gold/Bronze/Brown/Red using chroma + hue + COVERAGE
        
        Key Insight: Small details need HIGHER chroma thresholds to avoid confusion
        
        Coverage-based thresholds:
        - Small details (<2%): Stricter requirements
        - Major colors (>2%): Standard requirements
        """
        
        # NEW: Adjust chroma thresholds based on coverage
        if coverage < 2.0:  # Small detail (<2%)
            gold_chroma_threshold = 35  # Raised from 30
            bronze_chroma_min = 18      # Raised from 15
            brown_chroma_max = 18       # Lowered from 20
            red_sat_threshold = 0.6     # Raised from 0.5
            logger.debug(f"Small detail detected ({coverage:.1f}%), using strict thresholds")
        else:
            gold_chroma_threshold = 30
            bronze_chroma_min = 15
            brown_chroma_max = 20
            red_sat_threshold = 0.5
        
        # Region 1: Pure Red (High Saturation + Extreme Hue)
        if (h_deg < 15 or h_deg > 345) and s > red_sat_threshold:
            return 'Red'
        
        # Region 2: Gold (Bright + Yellow + High Chroma)
        if 38 < h_deg < 62 and v > 0.6 and chroma > gold_chroma_threshold:
            logger.debug(f"Gold detected: chroma={chroma:.1f} > {gold_chroma_threshold}")
            return 'Gold/Brass'
        
        # Region 3: Bronze (Dark + Orange + Medium Chroma)
        if 20 < h_deg < 42 and v < 0.6 and bronze_chroma_min < chroma < 32:
            logger.debug(f"Bronze detected: chroma={chroma:.1f} in [{bronze_chroma_min}, 32]")
            return 'Bronze/Copper'
        
        # Region 4: Brown (Low Chroma Fallback)
        if 10 < h_deg < 50 and chroma < brown_chroma_max:
            # Sub-classify: Rusty Brown vs Leather Brown
            if h_deg < 25 and v < 0.5:
                return 'Rust/Brown'
            return 'Brown'
        
        # Region 5: Rust (Desaturated Red-Orange, metallic only)
        if is_metallic and h_deg < 25 and s < 0.4 and v < 0.5:
            return 'Rust/Bronze'
        
        return None
    
    @staticmethod
    def detect_metallic(pixels_hsv: np.ndarray, pixels_rgb: np.ndarray = None) -> Dict:
        """
        Multi-signal metallic detection (unchanged from v2.0)
        """
        brightness_values = pixels_hsv[:, 2] * 255
        brightness_std = np.std(brightness_values)
        median_sat = np.median(pixels_hsv[:, 1])
        median_val = np.median(pixels_hsv[:, 2])
        
        signals = {}
        
        # Signal 1: Brightness Variance
        signals['specular'] = brightness_std > 30
        
        # Signal 2: High-Frequency Texture
        if pixels_rgb is not None:
            n_pixels = len(pixels_rgb)
            side_len = int(np.sqrt(n_pixels))
            
            if side_len > 10:
                subset_size = side_len * side_len
                pixels_subset = pixels_rgb[:subset_size]
                pseudo_img = pixels_subset.reshape(side_len, side_len, 3).astype(np.uint8)
                
                gray = cv2.cvtColor(pseudo_img, cv2.COLOR_RGB2GRAY)
                laplacian = cv2.Laplacian(gray, cv2.CV_64F)
                edge_density = np.mean(np.abs(laplacian))
                
                signals['texture'] = edge_density > 12
                logger.debug(f"Texture edge density: {edge_density:.2f}")
            else:
                signals['texture'] = False
        else:
            signals['texture'] = False
        
        # Signal 3: Chroma-Saturation Relationship
        pixels_rgb_norm = pixels_rgb / 255.0 if pixels_rgb is not None else None
        if pixels_rgb_norm is not None:
            try:
                lab = color.rgb2lab(pixels_rgb_norm.reshape(-1, 1, 3)).reshape(-1, 3)
                chroma = np.sqrt(lab[:, 1]**2 + lab[:, 2]**2)
                median_chroma = np.median(chroma)
                
                is_metallic_color = (median_sat < 0.25 and median_chroma > 12)
                signals['chroma'] = is_metallic_color
                logger.debug(f"Chroma: {median_chroma:.1f}, Sat: {median_sat:.2f}")
            except:
                signals['chroma'] = False
        else:
            signals['chroma'] = False
        
        # Signal 4: Dark Gunmetal Heuristic
        is_dark_gunmetal = (
            median_val < 0.50 and
            median_sat < 0.15 and
            signals.get('chroma', True)
        )
        signals['dark_heuristic'] = is_dark_gunmetal
        
        # Voting System
        votes = sum([
            signals['specular'],
            signals['texture'],
            signals['chroma'],
            signals['dark_heuristic']
        ])
        
        confidence = votes / 4.0
        is_metallic = votes >= 2
        
        logger.debug(
            f"Metallic detection: votes={votes}/4, "
            f"specular={signals['specular']}, "
            f"texture={signals['texture']}, "
            f"chroma={signals['chroma']}, "
            f"dark={signals['dark_heuristic']} "
            f"-> metallic={is_metallic} (conf={confidence:.2f})"
        )
        
        return {
            'is_metallic': is_metallic,
            'confidence': confidence,
            'signals': signals
        }


# ============================================================================
# SHADE TYPE ANALYSER (unchanged)
# ============================================================================

class ShadeTypeAnalyser:
    """Determine wash vs paint for shading"""
    
    @staticmethod
    def determine_shade_type(cluster_data: Dict, brightness_std: float, family: str) -> str:
        """Returns 'wash' or 'paint'"""
        
        if (cluster_data.get('is_metallic', False) or 
            "Silver" in family or "Gold" in family or 
            "Bronze" in family or "Gunmetal" in family or 
            "Iron" in family or "Rust" in family):
            return 'wash'
        
        if brightness_std > 30:
            return 'wash'
        
        family_lower = family.lower()
        for keyword in ShadeRules.WASH_KEYWORDS:
            if keyword in family_lower:
                return 'wash'
        
        median_value = cluster_data.get('median_hsv', [0, 0, 0])[2]
        if median_value < ShadeRules.DARK_VALUE_THRESHOLD:
            return 'wash'
        
        return 'paint'


# ============================================================================
# PAINT MATCHER (unchanged)
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
            
            if context:
                target_hsv = np.array(colorsys.rgb_to_hsv(*target_rgb_norm))
                target_chroma = np.sqrt(target_lab[1]**2 + target_lab[2]**2)
                
                if not context.get('is_metallic', False):
                    is_paint_metallic = ("Silver" in paint.name or "Steel" in paint.name or 
                                       "Gold" in paint.name or "Bronze" in paint.name or 
                                       "Metal" in paint.name or "Retributor" in paint.name or
                                       "Leadbelcher" in paint.name or "Iron" in paint.name)
                    
                    if is_paint_metallic:
                        distance += 100
                
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
# VISUALIZATION ENGINE (unchanged)
# ============================================================================

class VisualizationEngine:
    """Create tactical reticle overlays"""
    
    @staticmethod
    def create_color_overlay(img: np.ndarray, color_mask: np.ndarray,
                            color_rgb: np.ndarray, reticle_pos: Tuple[int, int]) -> np.ndarray:
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        gray_rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)
        base = (gray_rgb * 0.3).astype(np.uint8)
        overlay = base.copy().astype(float)
        
        if np.any(color_mask):
            mask_float = color_mask.astype(float)
            blur_size = 3
            soft_mask = cv2.GaussianBlur(mask_float, (blur_size, blur_size), 1)
            
            for c in range(3):
                overlay[:, :, c] += (color_rgb[c] * soft_mask * 0.7 * 255)
            
            mask_uint8 = (mask_float * 255).astype(np.uint8)
            edges = cv2.Canny(mask_uint8, 100, 200)
            edge_mask = edges > 0
            overlay[edge_mask] = color_rgb * 255 
            
        overlay = np.clip(overlay, 0, 255).astype(np.uint8)
        overlay = VisualizationEngine.draw_enhanced_reticle(overlay, reticle_pos[0], reticle_pos[1], color_rgb)
        return overlay
    
    @staticmethod
    def draw_enhanced_reticle(img: np.ndarray, x: int, y: int, target_color_rgb: np.ndarray = None) -> np.ndarray:
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
    def find_optimal_reticle_position(color_mask: np.ndarray, exclude_bottom_pct: float = 0.2) -> Tuple[int, int]:
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