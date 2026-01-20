"""
Inspiration Scanner Service
Extracts color palettes from any image WITHOUT background removal
"""

import numpy as np
from PIL import Image
import logging
from typing import Dict, List, Any

from core.smart_color_system import SmartColorExtractor
from core.color_engine import Paint, PaintMatcher
import json

logger = logging.getLogger(__name__)


class InspirationScannerService:
    """
    Service for extracting color palettes from inspiration images
    - NO background removal (analyzes entire image)
    - Detects 5-8 dominant colors
    - Returns paint recommendations
    """

    def __init__(self, paint_db_path: str = 'paints.json'):
        """Initialize the scanner with paint database"""
        logger.info("Initializing Inspiration Scanner Service")

        # Load paint database
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

        self.color_extractor = SmartColorExtractor()
        self.paint_matcher = PaintMatcher(self.paint_db)

        logger.info("Inspiration Scanner Service ready")

    def scan(self, image: Image.Image) -> Dict[str, Any]:
        """
        Extract color palette from an inspiration image

        Args:
            image: PIL Image (artwork, sunset, photo, etc.)

        Returns:
            Dictionary containing:
            - colors: List of detected colors with RGB, LAB, hex, percentage, family
            - paints: List of recommended paint matches with deltaE scores
            - metadata: Scan information
        """
        try:
            # Convert PIL to numpy array (RGB)
            img_rgb = np.array(image)

            # Create full mask (no background removal for inspiration mode)
            mask = np.ones(img_rgb.shape[:2], dtype=bool)

            # Extract colors using smart color system
            logger.info("Extracting color palette from inspiration image...")
            detected_colors = self.color_extractor.extract_colors(img_rgb, mask)

            # Limit to top 5-8 colors by coverage
            detected_colors = sorted(
                detected_colors,
                key=lambda x: x['coverage'],
                reverse=True
            )[:8]

            # Get paint recommendations for each color
            logger.info(f"Finding paint matches for {len(detected_colors)} colors...")
            paint_recommendations = []

            for color in detected_colors:
                # Get top 2 matches for each detected color
                matches = self.paint_matcher.find_closest_paints(
                    color['median_lab'],
                    top_n=2
                )
                paint_recommendations.extend(matches)

            # Remove duplicates and limit total recommendations
            seen_paints = set()
            unique_paints = []
            for paint in paint_recommendations:
                paint_key = f"{paint['brand']}-{paint['name']}"
                if paint_key not in seen_paints:
                    seen_paints.add(paint_key)
                    unique_paints.append(paint)

            paint_recommendations = unique_paints[:12]  # Limit to top 12 paints

            # Format results
            result = self._format_results(detected_colors, paint_recommendations)

            return result

        except Exception as e:
            logger.error(f"Inspiration scan failed: {str(e)}", exc_info=True)
            raise

    def _format_results(self, colors: List[Dict], paints: List[Dict]) -> Dict[str, Any]:
        """Format scan results for API response"""
        formatted_colors = []
        formatted_paints = []

        # Format colors
        for color_data in colors:
            rgb = color_data['median_rgb']
            lab = color_data['median_lab']
            hex_color = '#{:02x}{:02x}{:02x}'.format(
                int(rgb[0]), int(rgb[1]), int(rgb[2])
            )

            formatted_colors.append({
                'rgb': [int(rgb[0]), int(rgb[1]), int(rgb[2])],
                'lab': [float(lab[0]), float(lab[1]), float(lab[2])],
                'hex': hex_color,
                'percentage': float(color_data['coverage']),
                'family': color_data.get('family', 'Unknown'),
            })

        # Format paints
        for paint_data in paints:
            formatted_paints.append({
                'name': paint_data['name'],
                'brand': paint_data['brand'],
                'hex': paint_data['hex'],
                'type': paint_data.get('type', 'paint'),
                'deltaE': float(paint_data.get('delta_e', 0)),
                'rgb': [int(paint_data['rgb'][0]), int(paint_data['rgb'][1]), int(paint_data['rgb'][2])],
                'lab': [float(paint_data['lab'][0]), float(paint_data['lab'][1]), float(paint_data['lab'][2])],
            })

        return {
            'mode': 'inspiration',
            'colors': formatted_colors,
            'paints': formatted_paints,
            'metadata': {
                'color_count': len(formatted_colors),
                'paint_count': len(formatted_paints),
                'background_removed': False,
            }
        }
