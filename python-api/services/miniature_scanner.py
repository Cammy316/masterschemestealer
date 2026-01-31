"""
Miniature Scanner Service
Scans painted miniatures with background removal and color detection
"""

import numpy as np
from PIL import Image
import logging
from typing import Dict, List, Any, Optional
import base64
import io
import cv2

from core.schemestealer_engine import SchemeStealerEngine
from config import WashMapping

logger = logging.getLogger(__name__)


class MiniatureScannerService:
    """
    Service for scanning painted miniatures
    - Removes background using rembg
    - Detects 3-5 dominant colors on the miniature
    - Returns paint recommendations with full recipe structure
    """

    def __init__(self, paint_db_path: str = 'paints.json'):
        """Initialize the scanner with paint database"""
        logger.info("Initializing Miniature Scanner Service")
        self.engine = SchemeStealerEngine(paint_db_path=paint_db_path)
        self._load_wash_database(paint_db_path)
        logger.info("Miniature Scanner Service ready")

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
        Scan a painted miniature image

        Args:
            image: PIL Image of the painted miniature

        Returns:
            Dictionary containing:
            - colors: List of detected colors with RGB, LAB, hex, percentage, family, paintRecipe
            - paints: List of recommended paint matches (legacy)
            - metadata: Scan information
        """
        try:
            # Convert PIL to numpy array (RGB)
            img_rgb = np.array(image.convert('RGB'))

            logger.info("Analyzing miniature with background removal...")

            # Call the engine's analyze_miniature method
            # mode="mini" enables background removal
            recipes, cropped_rgba, quality_report = self.engine.analyze_miniature(
                img_np=img_rgb,
                mode="mini",  # Enable background removal
                remove_base=True,
                use_awb=True,
                sat_boost=1.3,
                detect_details=True,
                brands=['Citadel', 'Vallejo', 'Army Painter']  # Use main brands
            )

            logger.info(f"Detected {len(recipes)} color regions")

            # Format results for API response
            result = self._format_results(recipes, mode='miniature')

            return result

        except Exception as e:
            logger.error(f"Miniature scan failed: {str(e)}", exc_info=True)
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

            # Encode reticle image as base64 if available
            reticle_base64 = self._encode_reticle(recipe.get('reticle'), hex_color)

            # Build structured paint recipe for each brand
            paint_recipe = self._build_paint_recipe(recipe, family, lab)

            # Add color with reticle data and paintRecipe
            colors.append({
                'rgb': [int(rgb[0]), int(rgb[1]), int(rgb[2])],
                'lab': [float(lab[0]), float(lab[1]), float(lab[2])],
                'hex': hex_color,
                'percentage': float(recipe.get('dominance', 0)),
                'family': family,
                'reticle': reticle_base64,
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
                        delta_e = np.sqrt(sum((paint_lab[i] - lab[i])**2 for i in range(3)))

                        paints.append({
                            'name': match_data['name'],
                            'brand': brand,
                            'hex': paint_hex,
                            'type': match_data.get('type', 'paint'),
                            'deltaE': float(delta_e),
                            'rgb': paint_rgb,
                            'lab': paint_lab,
                        })

        # Limit results
        colors = colors[:5]  # Top 5 colors for miniatures
        paints = paints[:12]  # Top 12 paint recommendations (legacy)

        return {
            'mode': mode,
            'colors': colors,
            'paints': paints,  # Legacy format for backwards compatibility
            'metadata': {
                'color_count': len(colors),
                'paint_count': len(paints),
                'background_removed': True,
            }
        }

    def _build_paint_recipe(self, recipe: Dict, family: str, color_lab: List[float]) -> Dict:
        """
        Build structured paint recipe with base, shade, highlight, wash for each brand

        Args:
            recipe: Recipe dictionary from engine
            family: Color family name
            color_lab: LAB values of the detected color

        Returns:
            Dictionary with citadel, vallejo, army_painter keys
        """
        brand_mapping = {
            'Citadel': 'citadel',
            'Vallejo': 'vallejo',
            'Army Painter': 'army_painter'
        }

        paint_recipe = {}

        for brand, brand_key in brand_mapping.items():
            base_match = recipe.get('base', {}).get(brand)
            highlight_match = recipe.get('highlight', {}).get(brand)
            shade_match = recipe.get('shade', {}).get(brand)

            # Get appropriate wash for this color family
            wash_match = self._get_wash_for_family(family, brand, color_lab)

            paint_recipe[brand_key] = {
                'base': self._format_paint_match(base_match, color_lab) if base_match else None,
                'shade': self._format_paint_match(shade_match, color_lab) if shade_match else None,
                'highlight': self._format_paint_match(highlight_match, color_lab) if highlight_match else None,
                'wash': wash_match
            }

        return paint_recipe

    def _format_paint_match(self, match: Dict, color_lab: List[float] = None) -> Optional[Dict]:
        """Format a single paint match"""
        if not match:
            return None

        result = {
            'name': match.get('name'),
            'hex': match.get('hex'),
            'type': match.get('type', 'paint'),
        }

        # Calculate deltaE if we have the color LAB
        if color_lab and match.get('hex'):
            try:
                paint_rgb = self._hex_to_rgb(match['hex'])
                paint_lab = self._rgb_to_lab(paint_rgb)
                delta_e = np.sqrt(sum((paint_lab[i] - color_lab[i])**2 for i in range(3)))
                result['deltaE'] = round(float(delta_e), 1)
            except Exception:
                result['deltaE'] = 0

        return result

    def _get_wash_for_family(self, family: str, brand: str, color_lab: List[float] = None) -> Optional[Dict]:
        """
        Get recommended wash for color family and brand

        Args:
            family: Color family name (e.g., "Blue", "Gold/Brass")
            brand: Brand name (e.g., "Citadel", "Vallejo", "Army Painter")
            color_lab: LAB values for delta-E calculation

        Returns:
            Formatted wash dictionary or None
        """
        # Get recommended wash name from WashMapping
        wash_name = WashMapping.get_recommended_wash(family, brand)

        # Find matching wash in database
        matching_wash = None
        for wash in self.wash_db:
            if (wash.get('brand', '').lower() == brand.lower() and
                wash_name.lower() in wash.get('name', '').lower()):
                matching_wash = wash
                break

        if not matching_wash:
            # Try partial match
            for wash in self.wash_db:
                if wash.get('brand', '').lower() == brand.lower():
                    # Check if any part of the wash name matches
                    wash_name_parts = wash_name.lower().split()
                    db_name_lower = wash.get('name', '').lower()
                    if any(part in db_name_lower for part in wash_name_parts):
                        matching_wash = wash
                        break

        if not matching_wash:
            # Return basic info without hex
            return {
                'name': wash_name,
                'hex': '#000000',  # Placeholder
                'type': 'wash',
                'deltaE': 0
            }

        # Format the wash match
        result = {
            'name': matching_wash.get('name', wash_name),
            'hex': matching_wash.get('hex', '#000000'),
            'type': 'wash',
        }

        # Calculate deltaE if we have color LAB
        if color_lab and matching_wash.get('hex'):
            try:
                wash_rgb = self._hex_to_rgb(matching_wash['hex'])
                wash_lab = self._rgb_to_lab(wash_rgb)
                # Washes don't need precise color matching, so deltaE is informational
                delta_e = np.sqrt(sum((wash_lab[i] - color_lab[i])**2 for i in range(3)))
                result['deltaE'] = round(float(delta_e), 1)
            except Exception:
                result['deltaE'] = 0

        return result

    def _encode_reticle(self, reticle_img, hex_color: str) -> Optional[str]:
        """Encode reticle image as base64 JPEG"""
        if reticle_img is None:
            return None

        try:
            # Convert numpy array to JPEG bytes
            if isinstance(reticle_img, np.ndarray):
                # Ensure it's in BGR format for cv2
                if len(reticle_img.shape) == 3:
                    if reticle_img.shape[2] == 4:  # RGBA
                        reticle_bgr = cv2.cvtColor(reticle_img, cv2.COLOR_RGBA2BGR)
                    else:  # RGB
                        reticle_bgr = cv2.cvtColor(reticle_img, cv2.COLOR_RGB2BGR)
                else:
                    # Grayscale
                    reticle_bgr = reticle_img

                # Encode as JPEG
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
                _, buffer = cv2.imencode('.jpg', reticle_bgr, encode_param)
                reticle_base64 = base64.b64encode(buffer).decode('utf-8')
                logger.debug(f"Encoded reticle image ({len(reticle_base64)} bytes)")
                return reticle_base64
        except Exception as e:
            logger.warning(f"Failed to encode reticle for {hex_color}: {e}")

        return None

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
