"""
SchemeStealer Main Engine - ENHANCED FOR ML
Extracts comprehensive features for machine learning training
"""

import cv2
import numpy as np
import colorsys
import json
from PIL import Image
from rembg import remove
from typing import List, Dict, Tuple
from skimage import color as sk_color

from config import ColorDetection, Affiliate
from core.photo_processor import PhotoProcessor
from core.base_detector import BaseDetector
from core.color_engine import (
    Paint, ShadeTypeAnalyzer, 
    PaintMatcher, VisualizationEngine
)
from core.smart_color_system import SmartColorExtractor 
from utils.helpers import apply_white_balance, increase_saturation
from utils.logging_config import logger

class SchemeStealerEngine:
    def __init__(self, paint_db_path: str = 'paints.json'):
        logger.info(f"Initializing SchemeStealer Engine v2.6 (ML-Enhanced)")
        
        with open(paint_db_path, 'r') as f:
            paint_data = json.load(f)
        
        self.paint_db = []
        for p in paint_data:
            paint = Paint(
                name=p['name'],
                brand=p['brand'],
                hex=p['hex'],
                type=p.get('type', 'paint')
            )
            paint.compute_properties()
            self.paint_db.append(paint)
        
        self.photo_processor = PhotoProcessor()
        self.base_detector = BaseDetector()
        self.smart_extractor = SmartColorExtractor()
        self.matcher = PaintMatcher(self.paint_db)
        self.viz_engine = VisualizationEngine()
        
        logger.info("Engine initialization complete - ML features enabled")

    def analyze_miniature(self, img_np: np.ndarray, mode: str = "mini",
                         remove_base: bool = True, use_awb: bool = True,
                         sat_boost: float = 1.3, detect_details: bool = True,
                         brands: List[str] = None) -> Tuple[List[dict], np.ndarray, Dict]:
        
        if brands is None:
            brands = Affiliate.SUPPORTED_BRANDS
        
        # 1. Quality Check
        quality_report = self.photo_processor.process_and_assess(img_np)
        if not quality_report.can_process:
            return [], None, quality_report.__dict__
        
        img_np = quality_report.enhanced_image
        
        # 2. Preprocessing
        if use_awb:
            img_np = apply_white_balance(img_np)
        
        # 3. Background Removal
        if mode == "mini":
            img_pil = Image.fromarray(img_np)
            no_bg_image = remove(img_pil)
            img_rgba = np.array(no_bg_image)
            alpha = img_rgba[:, :, 3]
            coords = cv2.findNonZero(alpha)
            if coords is None: return [], None, quality_report.__dict__
            
            x, y, w, h = cv2.boundingRect(coords)
            cropped_rgba = img_rgba[y:y+h, x:x+w]
            cropped_original = img_np[y:y+h, x:x+w]
        else:
            h, w = img_np.shape[:2]
            alpha = np.ones((h, w), dtype=np.uint8) * 255
            cropped_rgba = np.dstack([img_np, alpha])
            cropped_original = img_np

        # 4. Resize for analysis
        height, width = cropped_rgba.shape[:2]
        new_w = ColorDetection.RESIZE_WIDTH
        new_h = int(new_w * (height / width))
        resized_rgba = cv2.resize(cropped_rgba, (new_w, new_h))
        resized_original = cv2.resize(cropped_original, (new_w, new_h))

        # 5. Base Detection
        if mode == "mini" and remove_base:
            mini_mask = self.base_detector.detect_base_region(resized_rgba)
        else:
            mini_mask = np.ones((new_h, new_w), dtype=bool)

        # 6. Smart Color Extraction
        colors = self.smart_extractor.extract_colors(resized_original, mini_mask)
        
        # 7. Build Recipes with FULL ML FEATURES
        recipes = self._build_recipes_with_ml_features(
            colors, resized_original, mini_mask, brands, new_w, new_h
        )
        recipes.sort(key=lambda x: (x.get('is_detail', False), -x['dominance']))
        
        return recipes, cropped_rgba, quality_report.__dict__

    def _build_recipes_with_ml_features(self, colors: List[Dict], img_rgb: np.ndarray,
                      mini_mask: np.ndarray, brands: List[str],
                      width: int, height: int) -> List[dict]:
        """
        Build recipes with comprehensive ML features
        
        Returns 22 features per color:
        - RGB (3), LAB (3), HSV (3) = 9 color space values
        - Chroma, Coverage, Brightness_STD = 3 texture features
        - Position_Y, Is_Metallic, Is_Detail = 3 context features
        - Plus all the UI/matching data for display
        """
        recipes = []
        
        for color_data in colors:
            family = color_data.get('family', 'Unknown')
            
            # Extract base color features
            median_rgb = color_data['median_rgb']
            median_hsv = color_data.get('median_hsv', np.array([0, 0, 0]))
            
            # Compute LAB if not already present
            median_lab = color_data.get('median_lab', None)
            if median_lab is None:
                # Convert RGB to LAB
                rgb_norm = median_rgb / 255.0
                median_lab = sk_color.rgb2lab(np.array([[rgb_norm]]))[0][0]
            
            # Compute chroma (saturation in LAB space)
            if isinstance(median_lab, np.ndarray):
                chroma = np.sqrt(median_lab[1]**2 + median_lab[2]**2)
            else:
                chroma = color_data.get('chroma', 0)
            
            # Extract layers for paint matching
            layers = self._extract_layers(color_data)
            shade_type = ShadeTypeAnalyzer.determine_shade_type(
                color_data, color_data.get('brightness_std', 30), family
            )

            # Metallic detection
            is_metallic = (
                "Gold" in family or 
                "Silver" in family or 
                "Metal" in family or
                "Bronze" in family or
                "Brass" in family or
                "Copper" in family or
                "Gunmetal" in family or
                "Steel" in family
            )
            
            context = {
                'is_metallic': is_metallic,
                'is_saturated': median_hsv[1] > 0.5 if len(median_hsv) > 1 else False,
                'high_chroma': chroma > 30
            }

            # Match paints
            base_matches = {b: self._match_and_format(layers['base'], b, 'paint', context) for b in brands}
            highlight_matches = {b: self._match_and_format(layers['highlight'], b, 'paint', context) for b in brands}
            shade_matches = {b: self._match_and_format(layers['shade'], b, shade_type, context) for b in brands}

            # Calculate spatial features
            spatial_mask = np.zeros(img_rgb.shape[:2], dtype=bool)
            indices = color_data.get('pixel_indices')
            if indices is not None:
                mask_flat = mini_mask.flatten()
                valid_coords = np.argwhere(mask_flat).flatten()
                if len(indices) > 0 and len(valid_coords) > 0:
                    actual_indices = valid_coords[indices]
                    spatial_mask.ravel()[actual_indices] = True

            # Calculate position (normalized 0-1)
            y_coords, x_coords = np.where(spatial_mask)
            if len(y_coords) > 0:
                position_y = float(np.mean(y_coords) / height)
                position_x = float(np.mean(x_coords) / width)
            else:
                position_y = 0.5
                position_x = 0.5

            # Create visualization
            reticle_pos = self.viz_engine.find_optimal_reticle_position(spatial_mask)
            reticle_img = self.viz_engine.create_color_overlay(
                img_rgb, spatial_mask, median_rgb / 255.0, reticle_pos
            )

            # Build comprehensive recipe with ML features
            recipe = {
                # UI/Display data
                'family': family,
                'dominance': color_data['coverage'],
                'base': base_matches,
                'highlight': highlight_matches,
                'shade': shade_matches,
                'shade_type': shade_type,
                'reticle': reticle_img,
                'rgb_preview': median_rgb.astype(int),
                'is_detail': color_data.get('is_detail', False),
                
                # ML FEATURES (for logging to Google Sheets)
                # Color spaces (9 features)
                'rgb': median_rgb.tolist() if isinstance(median_rgb, np.ndarray) else median_rgb,
                'lab': median_lab.tolist() if isinstance(median_lab, np.ndarray) else median_lab,
                'hsv': median_hsv.tolist() if isinstance(median_hsv, np.ndarray) else median_hsv,
                
                # Texture features (3 features)
                'chroma': float(chroma),
                'brightness_std': float(color_data.get('brightness_std', 0)),
                
                # Spatial features (2 features)
                'position_x': position_x,
                'position_y': position_y,
                
                # Context features (2 features)
                'is_metallic': is_metallic
                # is_detail already included above
            }
            
            recipes.append(recipe)
        
        return recipes

    def _extract_layers(self, cluster: Dict) -> Dict:
        """Extract base, highlight, and shade colors"""
        rgb, hsv = cluster['median_rgb'], cluster['median_hsv']
        h, s, v = hsv[0], hsv[1], hsv[2]
        
        # Generate highlight (lighter, less saturated)
        highlight_rgb = np.array(colorsys.hsv_to_rgb(
            h, 
            max(0.3, s * 0.9),  # Slightly desaturate
            min(1.0, v * 1.4)    # Brighten
        )) * 255
        
        # Generate shade (darker, more saturated)
        shade_rgb = np.array(colorsys.hsv_to_rgb(
            h,
            min(1.0, s * 1.1),   # Slightly saturate
            max(0.0, v * 0.6)    # Darken
        )) * 255
        
        return {
            'base': rgb,
            'highlight': np.clip(highlight_rgb, 0, 255),
            'shade': np.clip(shade_rgb, 0, 255)
        }

    def _match_and_format(self, rgb, brand, p_type, context):
        """Match color to paint and format for UI"""
        match = self.matcher.match_color(rgb, brand, p_type, context)
        return {'name': match.name, 'hex': match.hex, 'type': match.type} if match else None