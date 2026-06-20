"""
Inspiration Scanner Service
Extracts color palettes from any image WITHOUT background removal
"""

import numpy as np
from PIL import Image
import logging
from typing import Dict, List, Any, Optional

from core.schemestealer_engine import SchemeStealerEngine
from core.colour_maths import ciede2000_single
from services.recipe_builder import build_paint_recipe

logger = logging.getLogger(__name__)


class InspirationScannerService:
    """
    Service for extracting color palettes from inspiration images
    - NO background removal (analyzes entire image)
    - Detects 5-8 dominant colors
    - Returns paint recommendations with full recipe structure
    """

    def __init__(self, paint_db_path: str = 'paints.json'):
        """Initialize the scanner with paint database"""
        logger.info("Initializing Inspiration Scanner Service")
        self.engine = SchemeStealerEngine(paint_db_path=paint_db_path)
        self._load_wash_database(paint_db_path)
        logger.info("Inspiration Scanner Service ready")

    def _load_wash_database(self, paint_db_path: str):
        """Load wash paints from the database for wash matching"""
        import json
        try:
            with open(paint_db_path, 'r', encoding='utf-8') as f:
                all_paints = json.load(f)

            # Filter for washes/shades only
            self.wash_db = [
                p for p in all_paints
                if p.get('category', '').lower() in ['wash', 'shade', 'ink']
                or 'wash' in p.get('name', '').lower()
                or 'shade' in p.get('name', '').lower()
                or 'tone' in p.get('name', '').lower()
            ]
            logger.info(f"Loaded {len(self.wash_db)} washes from database")
        except Exception as e:
            logger.warning(f"Failed to load wash database: {e}")
            self.wash_db = []

    def scan(self, image: Image.Image) -> Dict[str, Any]:
        """
        Extract color palette from an inspiration image

        Args:
            image: PIL Image (artwork, sunset, photo, etc.)

        Returns:
            Dictionary containing:
            - colors: List of detected colors with RGB, LAB, hex, percentage, family, paintRecipe
            - paints: List of recommended paint matches (legacy)
            - metadata: Scan information
        """
        try:
            # Convert PIL to numpy array (RGB)
            img_rgb = np.array(image.convert('RGB'))

            logger.info("Extracting color palette from inspiration image...")

            # Call the engine's analyze_miniature method
            # mode="inspiration" disables background removal
            recipes, _, quality_report = self.engine.analyze_miniature(
                img_np=img_rgb,
                mode="inspiration",  # NO background removal
                remove_base=False,
                use_awb=True,
                sat_boost=1.2,
                detect_details=False,
                brands=['Citadel', 'Vallejo', 'Army Painter', 'Scale75'],
            )

            logger.info(f"Detected {len(recipes)} colors")

            # Format results for API response
            result = self._format_results(recipes, mode='inspiration')

            return result

        except Exception as e:
            logger.error(f"Inspiration scan failed: {str(e)}", exc_info=True)
            raise

    def _format_results(self, recipes: List[Dict], mode: str) -> Dict[str, Any]:
        """
        Format scan results for API response with full recipe structure

        Args:
            recipes: List of recipe dictionaries from engine
            mode: 'miniature' or 'inspiration'

        Returns:
            Formatted API response with paintRecipe for each color
        """
        colors = []
        paints = []  # Legacy format
        seen_paints = set()

        for recipe in recipes:
            # Extract color info
            rgb = recipe.get('rgb', recipe.get('rgb_preview', [0, 0, 0]))
            if isinstance(rgb, np.ndarray):
                rgb = rgb.tolist()

            lab = recipe.get('lab', [0, 0, 0])
            if isinstance(lab, np.ndarray):
                lab = lab.tolist()

            # Create hex from RGB
            hex_color = '#{:02x}{:02x}{:02x}'.format(
                int(rgb[0]), int(rgb[1]), int(rgb[2])
            )

            family = recipe.get('family', 'Unknown')

            # Build structured paint recipe for each brand
            paint_recipe = self._build_paint_recipe(recipe, family, lab)

            # Add color with paintRecipe
            colors.append({
                'rgb': [int(rgb[0]), int(rgb[1]), int(rgb[2])],
                'lab': [float(lab[0]), float(lab[1]), float(lab[2])],
                'hex': hex_color,
                'percentage': float(recipe.get('dominance', 0)),
                'family': family,
                'position': {
                    'x': float(recipe.get('position_x', 0.5)),
                    'y': float(recipe.get('position_y', 0.5)),
                },
                'paintRecipe': paint_recipe,  # NEW: Structured recipe per brand
            })

            # Legacy: Extract paint recommendations from base matches
            base_matches = recipe.get('base', {})
            for brand, match_data in base_matches.items():
                if match_data:
                    paint_key = f"{brand}-{match_data['name']}"
                    if paint_key not in seen_paints:
                        seen_paints.add(paint_key)

                        # Get paint RGB from hex
                        paint_hex = match_data['hex']
                        paint_rgb = self._hex_to_rgb(paint_hex)
                        paint_lab = self._rgb_to_lab(paint_rgb)

                        # Calculate Delta-E
                        delta_e = ciede2000_single(paint_lab, lab)

                        paints.append({
                            'name': match_data['name'],
                            'brand': brand,
                            'hex': paint_hex,
                            'type': match_data.get('type', 'paint'),
                            'deltaE': float(delta_e),
                            'rgb': paint_rgb,
                            'lab': paint_lab,
                        })

        # Limit results - more colors for inspiration mode
        colors = colors[:8]  # Top 8 colors for inspiration
        paints = paints[:15]  # Top 15 paint recommendations (legacy)

        return {
            'mode': mode,
            'colors': colors,
            'paints': paints,  # Legacy format for backwards compatibility
            'metadata': {
                'color_count': len(colors),
                'paint_count': len(paints),
                'background_removed': False,
            }
        }

    def _build_paint_recipe(self, recipe: Dict, family: str, color_lab: List[float]) -> Dict:
        """Build the structured per-brand recipe via the shared builder (graph-driven
        base/shade/highlight + graph-or-WashMapping wash)."""
        return build_paint_recipe(recipe, family, color_lab, self.wash_db)

    def _hex_to_rgb(self, hex_color: str) -> List[int]:
        """Convert hex color to RGB"""
        hex_color = hex_color.lstrip('#')
        return [int(hex_color[i:i+2], 16) for i in (0, 2, 4)]

    def _rgb_to_lab(self, rgb: List[int]) -> List[float]:
        """Convert RGB to LAB (simplified)"""
        from skimage import color as sk_color
        rgb_norm = np.array(rgb) / 255.0
        lab = sk_color.rgb2lab(np.array([[rgb_norm]]))[0][0]
        return [float(lab[0]), float(lab[1]), float(lab[2])]
