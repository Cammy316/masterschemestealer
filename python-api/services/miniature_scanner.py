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
import math
from core.schemestealer_engine import SchemeStealerEngine
from core.colour_maths import ciede2000_single
from services.recipe_builder import build_paint_recipe
from config import Affiliate, Display
logger = logging.getLogger(__name__)


def _protect_vivid_details(colors: List[Dict], limit: int = 5) -> List[Dict]:
    """Apply the display cap, but never let a dull DARK card of minor
    coverage displace a vivid painted detail (production: a shadow-artefact
    'Brown' at 5.6% evicted the figure's yellow beak from the five shown).

    Vivid dropped cards reclaim slots from qualifying dull dark cards,
    weakest coverage first. Genuine dark majors sit above
    Display.DULL_DARK_MAX_COVERAGE and are never touched."""
    if len(colors) <= limit:
        return colors

    def _chroma(c: Dict) -> float:
        return math.hypot(float(c['lab'][1]), float(c['lab'][2]))

    def _is_dull_dark_minor(c: Dict) -> bool:
        return (_chroma(c) < Display.DULL_DARK_MAX_CHROMA
                and float(c['lab'][0]) < Display.DULL_DARK_MAX_L
                and float(c['percentage']) < Display.DULL_DARK_MAX_COVERAGE)

    kept = colors[:limit]
    for vivid in colors[limit:]:
        if _chroma(vivid) <= Display.VIVID_MIN_CHROMA:
            continue
        candidates = [k for k in kept if _is_dull_dark_minor(k)]
        if not candidates:
            break
        weakest = min(candidates, key=lambda c: float(c['percentage']))
        swapped_out = kept[kept.index(weakest)]
        kept[kept.index(weakest)] = vivid
        logger.info(
            f"Display cap: vivid {vivid['family']} ({vivid['percentage']:.1f}%) "
            f"reclaims the slot of dull dark {swapped_out['family']} "
            f"({swapped_out['percentage']:.1f}%)")
    return kept
class MiniatureScannerService:
    """
    Service for scanning painted miniatures
    - Expects a client-removed background (a transparent RGBA PNG); there is no
      server-side rembg — removal happens in-browser before upload
    - Detects 3-5 dominant colors on the miniature
    - Returns paint recommendations with full recipe structure
    """
    def __init__(self, paint_db_path: str = 'paints_groundtruth.json'):
        """Initialize the scanner with paint database"""
        logger.info("Initializing Miniature Scanner Service")
        from core.schemestealer_engine import resolve_paint_db_path
        paint_db_path = resolve_paint_db_path(paint_db_path)
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
            if image.mode == 'RGBA':
                # Client already removed background — pass RGBA array directly
                img_rgba_np = np.array(image)
                img_rgb = img_rgba_np[:, :, :3]
                logger.info("Analyzing miniature (client-side background removal)...")
                recipes, cropped_rgba, quality_report = self.engine.analyze_miniature(
                    img_np=img_rgb,
                    mode="mini",
                    remove_base=True,
                    use_awb=True,
                    detect_details=True,
                    brands=Affiliate.SUPPORTED_BRANDS,
                    precomputed_rgba=img_rgba_np,
                )
            else:
                img_rgb = np.array(image.convert('RGB'))
                logger.info("Analyzing miniature with background removal...")
                recipes, cropped_rgba, quality_report = self.engine.analyze_miniature(
                    img_np=img_rgb,
                    mode="mini",
                    remove_base=True,
                    use_awb=True,
                    detect_details=True,
                    brands=Affiliate.SUPPORTED_BRANDS,
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
        Format scan results for API response with full recipe structure.
        Colours now carry a lightweight 1-bit PNG alpha mask instead of
        a full JPEG composite — the frontend composites client-side.
        """
        colors = []
        paints = []  # Legacy format
        seen_paints = set()
        # All recipes share the same analysis resolution and crop geometry
        analysis_shape = None
        crop_rect = None
        frame_shape = None
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
            # Encode spatial mask as a lightweight alpha PNG (replaces JPEG composite)
            mask_base64 = self._encode_mask(recipe.get('spatial_mask'), hex_color)
            # Capture spatial geometry from the first recipe (shared by all)
            if analysis_shape is None:
                analysis_shape = recipe.get('analysis_shape')
                crop_rect = recipe.get('crop_rect')
                frame_shape = recipe.get('frame_shape')
            # Build structured paint recipe for each brand
            paint_recipe = self._build_paint_recipe(recipe, family, lab)
            # Add color with mask data and paintRecipe
            colors.append({
                'rgb': [int(rgb[0]), int(rgb[1]), int(rgb[2])],
                'lab': [float(lab[0]), float(lab[1]), float(lab[2])],
                'hex': hex_color,
                'percentage': float(recipe.get('dominance', 0)),
                'family': family,
                'mask': mask_base64,
                # Normalised (0-1) centre of this colour's region, so the frontend
                # can draw a numbered chip at the real location on the image.
                'position': {
                    'x': float(recipe.get('reticle_x', recipe.get('position_x', 0.5))),
                    'y': float(recipe.get('reticle_y', recipe.get('position_y', 0.5))),
                },
                'paintRecipe': paint_recipe,
            })
            # Legacy: Extract paint recommendations from base matches
            base_matches = recipe.get('base', {})
            for brand, match_data in base_matches.items():
                if match_data:
                    paint_key = f"{brand}-{match_data['name']}"
                    if paint_key not in seen_paints:
                        seen_paints.add(paint_key)
                        paint_hex = match_data['hex']
                        paint_rgb = self._hex_to_rgb(paint_hex)
                        paint_lab = self._rgb_to_lab(paint_rgb)
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
        # Limit results (vivid painted details may not be displaced by
        # dull dark minor cards — see _protect_vivid_details)
        colors = _protect_vivid_details(colors, limit=5)
        paints = paints[:12]
        # Build mask_frame: full spatial geometry so the frontend can place
        # the analysis-resolution masks onto the user's uploaded image —
        # masks live in the alpha-bbox CROP, so the crop rect and the full
        # frame dims are required (the crop offset was previously dropped,
        # stretching masks across the whole frame).
        mask_frame = None
        if analysis_shape:
            mask_frame = {
                'height': int(analysis_shape[0]),
                'width': int(analysis_shape[1]),
            }
            if crop_rect and frame_shape:
                mask_frame.update({
                    'cropX': int(crop_rect[0]),
                    'cropY': int(crop_rect[1]),
                    'cropW': int(crop_rect[2]),
                    'cropH': int(crop_rect[3]),
                    'frameW': int(frame_shape[1]),
                    'frameH': int(frame_shape[0]),
                })
        return {
            'mode': mode,
            'colors': colors,
            'paints': paints,
            'mask_frame': mask_frame,
            'metadata': {
                'color_count': len(colors),
                'paint_count': len(paints),
                'background_removed': True,
            }
        }
    def _build_paint_recipe(self, recipe: Dict, family: str, color_lab: List[float]) -> Dict:
        """Build the structured per-brand recipe via the shared builder (graph-driven
        base/shade/highlight + graph-or-WashMapping wash)."""
        return build_paint_recipe(recipe, family, color_lab, self.wash_db)
    def _encode_mask(self, spatial_mask, hex_color: str) -> Optional[str]:
        """Encode a boolean spatial mask as an RGBA PNG (base64) whose ALPHA
        channel is the mask (opaque inside the region, transparent outside).

        The frontend clips its reveal/tint layers with canvas
        `destination-in`, which keys off alpha — the previous 1-bit encoding
        was opaque everywhere, so nothing was clipped and the whole frame got
        tinted. Binary-alpha PNGs still compress to a few KB."""
        if spatial_mask is None:
            return None
        try:
            if isinstance(spatial_mask, np.ndarray):
                mask_uint8 = (spatial_mask.astype(np.uint8)) * 255
                rgba = np.zeros((*spatial_mask.shape, 4), dtype=np.uint8)
                rgba[..., 0:3] = 255          # white — colour comes from compositing
                rgba[..., 3] = mask_uint8     # alpha IS the region
                img = Image.fromarray(rgba, mode='RGBA')
                buf = io.BytesIO()
                img.save(buf, format='PNG', optimize=True)
                mask_b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
                logger.debug(f"Encoded mask for {hex_color} ({len(mask_b64)} bytes)")
                return mask_b64
        except Exception as e:
            logger.warning(f"Failed to encode mask for {hex_color}: {e}")
        return None
    def _hex_to_rgb(self, hex_color: str) -> List[int]:
        """Convert hex color to RGB"""
        hex_color = hex_color.lstrip('#')
        return [int(hex_color[i:i+2], 16) for i in (0, 2, 4)]
    def _rgb_to_lab(self, rgb: List[int]) -> List[float]:
        """Convert RGB to LAB — delegates to the single shared helper (M-7)."""
        from core.colour_maths import rgb_to_lab
        return rgb_to_lab(rgb)
