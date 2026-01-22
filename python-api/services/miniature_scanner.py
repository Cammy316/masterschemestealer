"""
Miniature Scanner Service
Scans painted miniatures with background removal and color detection
"""

import numpy as np
from PIL import Image
import logging
from typing import Dict, List, Any
import base64
import io
import cv2

from core.schemestealer_engine import SchemeStealerEngine

logger = logging.getLogger(__name__)


class MiniatureScannerService:
    """
    Service for scanning painted miniatures
    - Removes background using rembg
    - Detects 3-5 dominant colors on the miniature
    - Returns paint recommendations
    """

    def __init__(self, paint_db_path: str = 'paints.json'):
        """Initialize the scanner with paint database"""
        logger.info("Initializing Miniature Scanner Service")
        self.engine = SchemeStealerEngine(paint_db_path=paint_db_path)
        logger.info("Miniature Scanner Service ready")

    def scan(self, image: Image.Image) -> Dict[str, Any]:
        """
        Scan a painted miniature image

        Args:
            image: PIL Image of the painted miniature

        Returns:
            Dictionary containing:
            - colors: List of detected colors with RGB, LAB, hex, percentage, family
            - paints: List of recommended paint matches with deltaE scores
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
        Format scan results for API response

        Args:
            recipes: List of recipe dictionaries from engine
            mode: 'miniature' or 'inspiration'

        Returns:
            Formatted API response
        """
        colors = []
        paints = []
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

            # Encode reticle image as base64 if available
            reticle_base64 = None
            if 'reticle' in recipe and recipe['reticle'] is not None:
                try:
                    reticle_img = recipe['reticle']
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

                        # Encode as JPEG (smaller than PNG, good for base64)
                        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
                        _, buffer = cv2.imencode('.jpg', reticle_bgr, encode_param)
                        reticle_base64 = base64.b64encode(buffer).decode('utf-8')
                        logger.debug(f"Encoded reticle image ({len(reticle_base64)} bytes)")
                except Exception as e:
                    logger.warning(f"Failed to encode reticle for {hex_color}: {e}")
                    reticle_base64 = None

            # Add color with reticle data
            colors.append({
                'rgb': [int(rgb[0]), int(rgb[1]), int(rgb[2])],
                'lab': [float(lab[0]), float(lab[1]), float(lab[2])],
                'hex': hex_color,
                'percentage': float(recipe.get('dominance', 0)),
                'family': recipe.get('family', 'Unknown'),
                'reticle': reticle_base64,  # ✅ Include reticle data
            })

            # Extract paint recommendations from base matches
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

                        # Calculate Delta-E (simplified - using Euclidean distance in LAB)
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
        paints = paints[:12]  # Top 12 paint recommendations

        return {
            'mode': mode,
            'colors': colors,
            'paints': paints,
            'metadata': {
                'color_count': len(colors),
                'paint_count': len(paints),
                'background_removed': True,
            }
        }

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
