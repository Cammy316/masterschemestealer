"""
Advanced Base Detection System v2.0 - IMPROVED
Hybrid approach with flood-fill to prevent leg clipping
Changes:
1. Bottom zone moved from 70% to 85% (only bottom 15%)
2. Added safety buffer to prevent cutting legs
3. Implemented flood-fill downward expansion
4. Added geometric validation (aspect ratio check)
"""

import cv2
import numpy as np
from skimage import measure
from typing import Tuple
from config import BaseDetection
from utils.logging_config import logger


class BaseDetector:
    """
    Intelligent base detection for miniatures
    Handles elevated poses, scenic bases, and various base shapes
    v2.0: Prevents leg clipping with conservative detection
    """
    
    def __init__(self):
        self.base_colors = BaseDetection.BASE_COLORS
    
    def detect_base_region(self, img_rgba: np.ndarray, 
                          alpha_threshold: int = None) -> np.ndarray:
        """
        Detect and return mask of miniature (True = keep, False = base)
        
        Args:
            img_rgba: RGBA image with alpha channel
            alpha_threshold: Threshold for alpha mask (default from config)
        
        Returns:
            Boolean mask where True = miniature pixels to analyze
        """
        if alpha_threshold is None:
            alpha_threshold = BaseDetection.ALPHA_THRESHOLD
        
        height, width = img_rgba.shape[:2]
        alpha = img_rgba[:, :, 3]
        
        logger.info(f"Starting base detection v2.0 on {width}x{height} image")
        
        # Step 1: Basic alpha mask
        mini_mask = alpha > alpha_threshold
        logger.debug(f"Alpha mask: {np.sum(mini_mask)} pixels above threshold")
        
        # Step 2: Find physical base platform (IMPROVED)
        base_platform = self._find_base_platform_v2(mini_mask, height, width, img_rgba)
        logger.debug(f"Base platform: {np.sum(base_platform)} pixels detected")
        
        # Step 3: Detect base material colors
        base_colors = self._detect_base_colors(img_rgba, base_platform)
        logger.debug(f"Base colors: {np.sum(base_colors)} pixels matched")
        
        # Step 4: Combine exclusions
        final_mini_mask = mini_mask & ~base_platform & ~base_colors
        
        # Step 5: Morphological cleanup
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
        final_mini_mask = cv2.morphologyEx(
            final_mini_mask.astype(np.uint8),
            cv2.MORPH_CLOSE,
            kernel
        ).astype(bool)
        
        kept_pixels = np.sum(final_mini_mask)
        total_alpha_pixels = np.sum(mini_mask)
        removed_pct = ((total_alpha_pixels - kept_pixels) / total_alpha_pixels * 100) if total_alpha_pixels > 0 else 0
        
        logger.info(f"Base detection complete: removed {removed_pct:.1f}% as base material")
        
        return final_mini_mask
    
    def _find_base_platform_v2(self, mask: np.ndarray, 
                               height: int, width: int,
                               img_rgba: np.ndarray) -> np.ndarray:
        """
        IMPROVED: Find the physical base platform using geometric analysis
        
        Key Improvements:
        1. Only look in BOTTOM 15% (was 30%)
        2. Validate with aspect ratio (bases are WIDE, not tall)
        3. Add 40px safety buffer to prevent cutting legs
        4. Use flood-fill downward expansion instead of blanket masking
        
        Strategy:
        1. Look in extreme bottom zone only
        2. Find largest connected component
        3. Check if it's geometrically regular AND wide (bases are flat)
        4. Expand ONLY downward using flood-fill (preserves legs)
        """
        # CRITICAL CHANGE: Only look in bottom 15% (was 70% -> now 85%)
        bottom_zone_start = int(height * 0.85)
        bottom_zone = mask[bottom_zone_start:, :]
        
        if not np.any(bottom_zone):
            logger.debug("No pixels in bottom zone")
            return np.zeros_like(mask, dtype=bool)
        
        # Label connected components
        labeled = measure.label(bottom_zone, connectivity=2)
        regions = measure.regionprops(labeled)
        
        if not regions:
            logger.debug("No regions found in bottom zone")
            return np.zeros_like(mask, dtype=bool)
        
        # Find largest region (likely the base)
        largest_region = max(regions, key=lambda r: r.area)
        
        # === GEOMETRIC VALIDATION ===
        
        # 1. Check regularity (bases are regular shapes)
        bbox_area = largest_region.bbox_area
        region_area = largest_region.area
        regularity = region_area / bbox_area if bbox_area > 0 else 0
        
        logger.debug(f"Base candidate regularity: {regularity:.2f}")
        
        if regularity < BaseDetection.MIN_REGULARITY:
            logger.debug("Region too irregular to be base")
            return np.zeros_like(mask, dtype=bool)
        
        # 2. NEW: Check aspect ratio (bases are WIDE, not tall)
        minr, minc, maxr, maxc = largest_region.bbox
        bbox_width = maxc - minc
        bbox_height = maxr - minr
        aspect_ratio = bbox_width / bbox_height if bbox_height > 0 else 0
        
        logger.debug(f"Base candidate aspect ratio: {aspect_ratio:.2f} (w={bbox_width}, h={bbox_height})")
        
        # Bases should be wider than they are tall (aspect ratio > 1.2)
        if aspect_ratio < 1.2:
            logger.debug("Region too tall to be a base (likely feet/legs)")
            return np.zeros_like(mask, dtype=bool)
        
        # 3. NEW: Check if region is TOO SMALL to be a base
        min_base_width = width * 0.15  # Base should be at least 15% of image width
        if bbox_width < min_base_width:
            logger.debug(f"Region too narrow ({bbox_width}px < {min_base_width}px)")
            return np.zeros_like(mask, dtype=bool)
        
        # === BASE MASK CREATION WITH FLOOD-FILL ===
        
        # Create seed mask from detected region
        base_seed = np.zeros_like(mask, dtype=bool)
        region_mask_local = labeled == largest_region.label
        base_seed[bottom_zone_start:, :] = region_mask_local
        
        # CRITICAL: Add safety buffer (40px instead of 20px)
        # This prevents cutting into legs/feet
        base_top = max(0, bottom_zone_start + minr - 40)
        
        logger.debug(f"Base top boundary: {base_top} (zone starts at {bottom_zone_start}, minr={minr})")
        
        # Use flood-fill to expand ONLY downward (preserves upper body)
        final_base_mask = self._flood_fill_downward(base_seed, mask, base_top)
        
        return final_base_mask
    
    def _flood_fill_downward(self, seed_mask: np.ndarray, 
                            valid_mask: np.ndarray,
                            top_boundary: int) -> np.ndarray:
        """
        Expand base mask ONLY in downward direction
        This prevents removing legs while still catching the full base
        
        Args:
            seed_mask: Initial base detection
            valid_mask: Valid pixels from alpha mask
            top_boundary: Y-coordinate above which we don't expand
        
        Returns:
            Expanded base mask
        """
        h, w = seed_mask.shape
        expanded = seed_mask.copy()
        
        # Morphological kernel that only expands DOWN and SIDES
        # Row 0 (top): No expansion
        # Row 1 (middle): Expand left/center/right
        # Row 2 (bottom): Expand left/center/right
        kernel = np.array([
            [0, 0, 0],
            [1, 1, 1],
            [1, 1, 1]
        ], dtype=np.uint8)
        
        # Iteratively expand downward (max 15 iterations)
        for iteration in range(15):
            dilated = cv2.dilate(expanded.astype(np.uint8), kernel, iterations=1)
            expanded_new = dilated.astype(bool) & valid_mask
            
            # Don't expand above the top boundary (safety zone)
            expanded_new[:top_boundary, :] = expanded[:top_boundary, :]
            
            # Check if we've stopped expanding
            if np.array_equal(expanded_new, expanded):
                logger.debug(f"Flood-fill converged after {iteration+1} iterations")
                break
            
            expanded = expanded_new
        
        return expanded
    
    def _detect_base_colors(self, img_rgba: np.ndarray, 
                           suspected_base: np.ndarray) -> np.ndarray:
        """
        Detect pixels matching common base material colors
        (stone grey, dirt brown, grass green, etc.)
        
        UNCHANGED from original - this logic is still good
        """
        img_rgb = img_rgba[:, :, :3]
        
        # Convert to HSV for color filtering
        img_hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV).astype(float)
        img_hsv[:, :, 0] /= 180.0  # Normalize hue to 0-1
        img_hsv[:, :, 1] /= 255.0  # Normalize saturation
        img_hsv[:, :, 2] /= 255.0  # Normalize value
        
        base_color_mask = np.zeros(img_rgb.shape[:2], dtype=bool)
        
        # Check each base color range
        for color_name, (hsv_min, hsv_max) in self.base_colors.items():
            in_range = np.all([
                (img_hsv[:, :, 0] >= hsv_min[0]) & (img_hsv[:, :, 0] <= hsv_max[0]),
                (img_hsv[:, :, 1] >= hsv_min[1]) & (img_hsv[:, :, 1] <= hsv_max[1]),
                (img_hsv[:, :, 2] >= hsv_min[2]) & (img_hsv[:, :, 2] <= hsv_max[2])
            ], axis=0)
            
            colour_pixels = np.sum(in_range)
            if colour_pixels > 0:
                logger.debug(f"Found {colour_pixels} {color_name} pixels")
            
            base_color_mask |= in_range
        
        # Only consider base colors in bottom portion of image
        # (Don't remove grey armor just because it looks like stone!)
        height = img_rgb.shape[0]
        exclusion_top = int(height * BaseDetection.EXCLUSION_ZONE_TOP)
        base_color_mask[:exclusion_top, :] = False
        
        return base_color_mask