"""
Miniature Scanner Service
Scans painted miniatures with background removal and color detection
"""

import numpy as np
from PIL import Image
import logging
from typing import Dict, List, Any
from rembg import remove

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
            # Convert PIL to numpy array
            img_array = np.array(image)

            # Remove background using rembg
            logger.info("Removing background from miniature...")
            img_no_bg = remove(img_array)

            # Convert back to PIL for engine processing
            img_pil = Image.fromarray(img_no_bg)

            # Process with SchemeStealerEngine
            logger.info("Detecting colors on miniature...")
            scan_results = self.engine.scan_image(img_pil)

            # Format results for API response
            result = self._format_results(scan_results, mode='miniature')

            return result

        except Exception as e:
            logger.error(f"Miniature scan failed: {str(e)}", exc_info=True)
            raise

    def _format_results(self, scan_results: Dict, mode: str) -> Dict[str, Any]:
        """Format scan results for API response"""
        colors = []
        paints = []

        # Extract colors
        if 'colors' in scan_results:
            for color_data in scan_results['colors']:
                colors.append({
                    'rgb': [int(color_data['rgb'][0]), int(color_data['rgb'][1]), int(color_data['rgb'][2])],
                    'lab': [float(color_data['lab'][0]), float(color_data['lab'][1]), float(color_data['lab'][2])],
                    'hex': color_data['hex'],
                    'percentage': float(color_data.get('coverage', 0)),
                    'family': color_data.get('family', 'Unknown'),
                })

        # Extract paint recommendations
        if 'paint_recommendations' in scan_results:
            for paint_data in scan_results['paint_recommendations']:
                paints.append({
                    'name': paint_data['name'],
                    'brand': paint_data['brand'],
                    'hex': paint_data['hex'],
                    'type': paint_data.get('type', 'paint'),
                    'deltaE': float(paint_data.get('delta_e', 0)),
                    'rgb': [int(paint_data['rgb'][0]), int(paint_data['rgb'][1]), int(paint_data['rgb'][2])],
                    'lab': [float(paint_data['lab'][0]), float(paint_data['lab'][1]), float(paint_data['lab'][2])],
                })

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
