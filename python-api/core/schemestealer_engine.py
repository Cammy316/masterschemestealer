"""
SchemeStealer Main Engine - ENHANCED FOR ML
Extracts comprehensive features for machine learning training
"""

import cv2
import numpy as np
import json
import re
import unicodedata
from PIL import Image
from typing import List, Dict, Tuple
from skimage import color as sk_color

from config import ColorDetection, Affiliate
from core.photo_processor import PhotoProcessor
from core.base_detector import BaseDetector
from core.color_engine import (
    Paint, ShadeTypeAnalyser,
    PaintMatcher, VisualizationEngine
)
from core.smart_color_system import SmartColorExtractor
from core.recipe_graph import RecipeGraph
from core.recipe_geometry import PaintNode, derive_partner, CANDIDATE_CATEGORIES
from utils.helpers import apply_white_balance
from utils.logging_config import logger


def _slugify(*parts) -> str:
    """ASCII lowercase hyphenated slug — used only as a defensive fallback when
    a paint record lacks an explicit paint_id (the ground-truth DB always has one)."""
    raw = '-'.join(str(p) for p in parts if p)
    raw = unicodedata.normalize('NFKD', raw).encode('ascii', 'ignore').decode('ascii')
    raw = re.sub(r'[^A-Za-z0-9]+', '-', raw).strip('-').lower()
    return raw or 'paint'

CANONICAL_PAINT_DB = 'paints_groundtruth.json'


def resolve_paint_db_path(path: str = CANONICAL_PAINT_DB) -> str:
    """Resolve the single source-of-truth paint DB: ``paints_groundtruth.json``.

    There are no fallbacks any more (the old ``paints_measured.json`` /
    ``paints.json`` chain is gone). A legacy caller still passing the old default
    ``'paints.json'`` is transparently redirected to the canonical DB; any other
    explicit path is honoured (test fixtures). If the resolved file is missing we
    raise ``FileNotFoundError`` rather than silently loading a stale DB.
    """
    import os
    candidate = CANONICAL_PAINT_DB if path in ('paints.json', CANONICAL_PAINT_DB) else path
    if not os.path.exists(candidate):
        raise FileNotFoundError(
            f"Paint DB not found: {candidate!r}. The canonical database is "
            f"'{CANONICAL_PAINT_DB}' in python-api/ — run from there or pass an "
            "explicit existing path."
        )
    logger.info(f"Loading ground-truth paint DB: {candidate}")
    return candidate


class SchemeStealerEngine:
    def __init__(self, paint_db_path: str = CANONICAL_PAINT_DB):
        logger.info(f"Initializing SchemeStealer Engine v2.6 (ML-Enhanced)")
        paint_db_path = resolve_paint_db_path(paint_db_path)

        with open(paint_db_path, 'r') as f:
            paint_data = json.load(f)
        
        self.paint_db = []
        for p in paint_data:
            # paint_id is always present in the ground-truth DB; derive from
            # name as a defensive fallback.
            paint_id = p.get('paint_id') or _slugify(p.get('brand', ''), p.get('name', ''))
            # Every paint in the new DB is deterministically measured, so its
            # stored `lab` IS the applied-colour LAB → it becomes the CIEDE2000
            # matching target (measured_lab) and color_source is always 'measured'.
            paint = Paint(
                name=p['name'],
                brand=p['brand'],
                hex=p['hex'],
                type=p.get('type', p.get('category', 'base')),
                color_family=p.get('color_family', ''),
                category=p.get('category', 'base'),
                finish=p.get('finish', 'matte'),                       # sheen, not metallic
                # Transparency penalty input derived from measured opacity:
                # opacity_rating 0 (translucent) → 1.0; 3 (opaque) → 0.0.
                transparency=1.0 - (float(p.get('opacity_rating', 3)) / 3.0),
                metallic=bool(p.get('metallic', False)),
                matchable=bool(p.get('matchable', True)),
                discontinued=bool(p.get('discontinued', False)),
                paint_id=paint_id,
                range=p.get('range', ''),
                aliases=list(p.get('aliases', []) or []),
                measured_lab=p.get('lab'),
                color_source='measured',
                opacity=p.get('opacity_rating'),
                vibrancy=p.get('vibrancy'),
            )
            paint.compute_properties()
            self.paint_db.append(paint)

        # Family is DERIVED, not trusted: the stored color_family drifted from
        # the canonical classifier for ~100 paints (F8), which corrupts the
        # matcher's family gate and the recipe pools. The single classifier
        # applied to the paint's own matching LAB is authoritative — the same
        # invariant the scan side already obeys.
        from core.color_engine import classify_family
        overridden = 0
        for paint in self.paint_db:
            derived = classify_family(paint.lab, paint.chroma, paint.metallic)
            if derived != (paint.color_family or '').lower():
                overridden += 1
            paint.color_family = derived
        if overridden:
            logger.info(f"Recomputed color_family from matching LAB for "
                        f"{overridden} paints (stored value had drifted)")

        matchable_count = sum(1 for p in self.paint_db if p.matchable)
        logger.info(f"Loaded {len(self.paint_db)} paints from {paint_db_path} "
                    f"({matchable_count} matchable)")
        
        self.photo_processor = PhotoProcessor()
        self.base_detector = BaseDetector()
        self.smart_extractor = SmartColorExtractor()
        self.matcher = PaintMatcher(self.paint_db)
        self.viz_engine = VisualizationEngine()

        # Recipe relationship graph (curated + algorithmic edges) keyed on paint_id,
        # plus per-brand PaintNode pools for the live LAB-geometry fallback.
        self._paints_by_id = {p.paint_id: p for p in self.paint_db if p.paint_id}
        self.recipe_graph = RecipeGraph(self._paints_by_id)
        self._recipe_nodes = {}
        self._recipe_pools = {}
        for p in self.paint_db:
            if p.lab is None or not p.paint_id:
                continue
            node = PaintNode(
                paint_id=p.paint_id, name=p.name, brand=p.brand,
                category=(p.type or '').lower(), color_family=(p.color_family or '').lower(),
                lab=(float(p.lab[0]), float(p.lab[1]), float(p.lab[2])),
                matchable=p.matchable, discontinued=p.discontinued,
                opacity_rating=p.opacity, vibrancy=p.vibrancy,
            )
            self._recipe_nodes[p.paint_id] = node
            if node.matchable and not node.discontinued and node.category in CANDIDATE_CATEGORIES:
                self._recipe_pools.setdefault(p.brand, []).append(node)

        logger.info("Engine initialization complete - ML features enabled "
                    f"({self.recipe_graph.edge_count()} recipe edges)")

    def analyze_miniature(self, img_np: np.ndarray, mode: str = "mini",
                         remove_base: bool = True, use_awb: bool = True,
                         detect_details: bool = True,
                         brands: List[str] = None,
                         precomputed_rgba: np.ndarray = None) -> Tuple[List[dict], np.ndarray, Dict]:

        if brands is None:
            brands = Affiliate.SUPPORTED_BRANDS

        # 1. Quality Check. The CLAHE-enhanced image exists for quality
        #    assessment and segmentation decisions ONLY — colour statistics
        #    must be measured from the un-enhanced photograph, or every
        #    cluster's L* inherits the local contrast redistribution and no
        #    longer matches the measured paint DB (dual-image invariant, F1).
        quality_report = self.photo_processor.process_and_assess(img_np)
        if not quality_report.can_process:
            return [], None, quality_report.__dict__

        # 2. Preprocessing — pass alpha mask when available so the illuminant
        #    estimate is computed only over non-transparent foreground pixels.
        if use_awb:
            alpha_for_awb = None
            if (precomputed_rgba is not None
                    and precomputed_rgba.shape[:2] == img_np.shape[:2]):
                alpha_for_awb = precomputed_rgba[:, :, 3]
            img_np = apply_white_balance(img_np, alpha_mask=alpha_for_awb)
        
        # 3. Background Removal
        if mode == "mini":
            if precomputed_rgba is None:
                raise ValueError("precomputed_rgba is required — background must be removed client-side")
            img_rgba = precomputed_rgba
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
            
            shade_type = ShadeTypeAnalyser.determine_shade_type(
                color_data, color_data.get('brightness_std', 30), family
            )

            # Metallic flag from the specular-variance detector run during
            # classification (is_metallic_surface), NOT a family-string match.
            # The old "Gold" in family / _is_gold_in_lab heuristic is gone.
            is_metallic = bool(color_data.get('is_metallic', False))

            context = {
                'is_metallic': is_metallic,
                'is_saturated': median_hsv[1] > 0.5 if len(median_hsv) > 1 else False,
                'high_chroma': chroma > 30
            }

            # Recipe assembly: base = the dominant-role colour match; highlight,
            # shade and wash come from the recipe graph (curated edges first, then
            # a live LAB-geometry fallback) — no synthetic-colour maths.
            base_matches, highlight_matches, shade_matches, wash_matches = {}, {}, {}, {}
            # Gate base matches to the detected colour's canonical family (+ adjacent
            # families) so a brand with no in-family measured paint returns an honest
            # "No match found" rather than a far-off cross-family paint (Prompt 8).
            target_family = (family or '').lower()
            for b in brands:
                # The cluster's LAB representative is authoritative (F3): pass
                # it directly so the matcher never re-derives a second colour
                # from the RGB view of the same cluster.
                base_paint = self.matcher.match_color(median_rgb, b, role='dominant',
                                                      context=context,
                                                      target_family=target_family,
                                                      target_lab=median_lab)
                base_matches[b] = self._format_paint(base_paint)
                if base_paint is not None:
                    hp, hs = self._recipe_partner(base_paint, 'highlight', b)
                    sp, ss = self._recipe_partner(base_paint, 'shade', b)
                    wp, ws = self._recipe_wash(base_paint)
                    highlight_matches[b] = self._format_paint(hp, hs)
                    shade_matches[b] = self._format_paint(sp, ss)
                    wash_matches[b] = self._format_paint(wp, ws, is_wash=True)
                else:
                    highlight_matches[b] = shade_matches[b] = wash_matches[b] = None

            # Display the DETECTED colour's own canonical family (Prompt 7, Issue 1).
            # The old paint_derived_family override inherited the nearest base
            # paint's curated family, which corrupts pale/desaturated colours whose
            # closest paint by ΔE sits across a family line (e.g. #c7afbd is pink but
            # matched "Mourn Mountain Snow" -> showed White; baby-blue -> Green). The
            # canonical hue_family classifier (already in `family`) is authoritative.
            # The wash mapping downstream keys on recipe['family'], so it now also
            # selects on the detected colour's family rather than a neighbour paint's.
            display_family = family

            # ONE exception: a metallic-flagged cluster whose matches WON the
            # metallic ΔE competition displays the winning metal family
            # (Silver/Gold/Bronze). The scan classifies metallic surfaces
            # chromatically (silver blade → Grey), but when the majority of
            # brands' best paints are metallic, the DB's curated knowledge is
            # the better display answer — this is matcher evidence, not an
            # image heuristic.
            if is_metallic:
                # UNANIMITY required: silver paints are colorimetrically
                # near-identical to grey paints, so a mere majority relabels
                # mid-grey armour panels "Silver". Only when EVERY brand's
                # best paint is metallic is the evidence decisive.
                winners = []
                n_matched = 0
                for b in brands:
                    m = base_matches.get(b)
                    if m:
                        n_matched += 1
                        if m.get('metallic'):
                            winners.append((m.get('color_family') or '').lower())
                if n_matched and len(winners) == n_matched:
                    modal = max(set(winners), key=winners.count)
                    if modal in ('gold', 'silver', 'bronze'):
                        display_family = modal.capitalize()

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
                'family': display_family,          # detected colour's canonical hue_family
                'heuristic_family': family,         # same value, kept for internal callers
                'dominance': color_data['coverage'],
                'base': base_matches,
                'highlight': highlight_matches,
                'shade': shade_matches,
                'wash': wash_matches,          # graph-driven wash (None -> scanner fallback)
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

    def _format_paint(self, paint, source: str = None, is_wash: bool = False):
        """Format a Paint for the recipe dict (incl. optional relationship source)."""
        if paint is None:
            return None
        out = {
            'name': paint.name,
            'hex': paint.hex,
            'type': 'wash' if is_wash else paint.type,
            'color_family': paint.color_family,
            'metallic': bool(paint.metallic),
        }
        if source:
            out['source'] = source   # 'official' | 'computed'
        return out

    @staticmethod
    def _monotonic_ok(rel: str, base_lab, target_paint) -> bool:
        """Phase 4 guard: a highlight must be strictly lighter than the base, a
        shade strictly darker. Rejects inverted recipes (incl. stale graph edges)."""
        if base_lab is None or target_paint is None or target_paint.lab is None:
            return False  # Missing data fails the guard safely
        bl, tl = float(base_lab[0]), float(target_paint.lab[0])
        return tl > bl if rel == 'highlight' else tl < bl

    def _recipe_partner(self, base_paint, rel: str, brand: str):
        """Resolve a highlight/shade partner for base_paint (Phase 4).

        A curated/algorithmic graph edge is used only if it respects the
        monotonicity guard; otherwise the partner is DERIVED from an explicit
        target LAB via the tiered ladder (in-family → adjacent → relaxed → empty),
        weighted by opacity/vibrancy. Returns (Paint|None, source_kind|None) and
        logs the resolution tier."""
        base_lab = getattr(base_paint, 'lab', None)

        edge = self.recipe_graph.get_edge(base_paint, rel)
        if edge is not None:
            target = self._paints_by_id.get(edge.to_id)
            if target is not None and self._monotonic_ok(rel, base_lab, target):
                logger.debug("recipe %s for %s: tier=graph(%s) -> %s",
                             rel, base_paint.paint_id, edge.kind, target.paint_id)
                return target, edge.kind  # 'official' or 'computed'

        from_node = self._recipe_nodes.get(getattr(base_paint, 'paint_id', None))
        if from_node is None:
            return None, None
        node, tier = derive_partner(from_node, self._recipe_pools.get(brand, []), rel)
        logger.debug("recipe %s for %s: tier=%s -> %s", rel, base_paint.paint_id,
                     tier, node.paint_id if node else None)
        if node is not None:
            return self._paints_by_id.get(node.paint_id), 'computed'
        return None, None

    def _recipe_wash(self, base_paint):
        """Wash partner from the graph (None -> the scanner's WashMapping fallback)."""
        edge = self.recipe_graph.get_edge(base_paint, 'wash')
        if edge is not None:
            target = self._paints_by_id.get(edge.to_id)
            if target is not None:
                return target, edge.kind
        return None, None