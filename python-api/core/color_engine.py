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
import os
from sklearn.cluster import KMeans
from skimage import color
from skimage.color import deltaE_ciede2000
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass, field
from scipy import ndimage

from config import ColorDetection, Visualization, ShadeRules
from utils.logging_config import logger
from core.colour_maths import circular_mean_hue
from core.recipe_geometry import allowed_families


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

    # Curated metadata loaded from paints_groundtruth.json
    color_family: str = ''
    category: str = ''
    finish: str = ''            # sheen: flat/matte/satin/glossy (no longer 'metallic')
    transparency: float = 0.0
    metallic: bool = False      # metallic-ness now carried by this flag, not finish
    matchable: bool = True
    discontinued: bool = False

    # Provenance / identity metadata. Defaults keep paints loadable when these
    # keys are absent (the lean paints_groundtruth.json omits most of them).
    paint_id: str = ''
    range: str = ''
    aliases: List[str] = field(default_factory=list)
    citadel_equiv: Optional[str] = None
    hex_source: str = 'unknown'

    # Measured-swatch integration (Prompt 6). When color_source == 'measured',
    # measured_lab is the applied-colour LAB and becomes the primary CIEDE2000
    # target; the chart hex is still used for the display swatch.
    measured_lab: Optional[list] = None
    measured_hex: str = ''
    color_source: str = 'chart'
    opacity: Optional[float] = None        # opacity_rating 0..3 (Phase 4 weighting)
    vibrancy: Optional[str] = None         # None | 'slight' | 'significant'

    # Computed colour-space properties (populated by compute_properties)
    rgb: np.ndarray = None
    lab: np.ndarray = None
    hsv: np.ndarray = None
    chroma: float = None
    saturation: float = None
    brightness: float = None

    def compute_properties(self):
        """Compute colour properties. The CIEDE2000 matching target is the
        measured applied-colour LAB when available, else the chart hex's LAB.
        rgb/hsv stay derived from the (display) hex."""
        h = self.hex.lstrip('#')
        self.rgb = np.array([int(h[i:i+2], 16) for i in (0, 2, 4)]) / 255.0
        self.hsv = np.array(colorsys.rgb_to_hsv(*self.rgb))
        self.saturation = self.hsv[1]
        self.brightness = self.hsv[2]
        if self.measured_lab is not None:
            self.lab = np.asarray(self.measured_lab, dtype=float)
        else:
            self.lab = color.rgb2lab(np.array([[self.rgb]]))[0][0]
        self.chroma = np.sqrt(self.lab[1]**2 + self.lab[2]**2)


# ============================================================================
# COLOR ANALYZER - COMPLETE FIX SUITE
# ============================================================================

class ColorAnalyzer:
    """Color classification and metallic detection - FINAL VERSION"""
    
    @staticmethod
    def analyze_color_temperature(lab: np.ndarray) -> str:
        """
        Determine if color is warm, cool, or neutral
        """
        L, a, b = lab
        
        warmth_score = b * 0.7 + a * 0.3
        
        if warmth_score > 15:
            return 'warm'
        elif warmth_score < -15:
            return 'cool'
        else:
            return 'neutral'
    
    @staticmethod
    def classify_surface_type(brightness_std: float, edge_density: float = None) -> str:
        """
        Classify surface finish based on texture
        """
        if brightness_std > 35:
            return 'metallic'
        elif brightness_std > 20:
            return 'weathered'
        elif brightness_std < 10:
            return 'smooth'
        else:
            return 'textured'


# ============================================================================
# CANONICAL COLOUR FAMILY — shared between the engine and the DB builder
# ============================================================================
#
# classify_color_family() returns composite display strings ("Gold/Brass",
# "Off-White/Bone", "Pink/Purple"). The DB and scan-time code agree on a flat
# lowercase vocabulary. _classify_family() is the SINGLE algorithm the DB
# builder, compute_color_family() and the scan ensemble all use, so DB families
# and detection families are produced by identical logic (the root-cause fix for
# the "grey that is actually pink" bug).

# Flat lowercase families the DB and engine recognise.
RECOGNISED_FAMILIES = {
    'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink',
    'magenta', 'brown', 'flesh', 'bone', 'white', 'grey', 'black',
    'gold', 'silver', 'bronze', 'copper',
}

# When a NON-metallic paint lands on a metallic-ish family via the hue zones
# (e.g. a dark warm brown returning "Bronze/Copper"), remap to the nearest
# non-metallic family so matte paints never carry a metal family.
_NON_METALLIC_REMAP = {
    'gold': 'yellow', 'bronze': 'brown', 'copper': 'brown', 'silver': 'grey',
}


def is_metallic_surface(brightness_std: float, median_sat: float,
                        median_val: float) -> bool:
    """The single metallic-SURFACE test (specular variance).

    Metallic paint scatters light unevenly, so a cluster's per-pixel brightness
    has high variance (specular highlights); a dark, desaturated surface with
    moderate variance reads as gunmetal/iron. This is the up-to-date detector
    that replaces the old `_is_gold_in_lab` hue hack — it is shared by
    `ColorAnalyzer.detect_metallic` (from a pixel array) and the live scan (from
    a cluster's stats) so there is exactly ONE metallic decision.
    """
    if brightness_std > 25:
        return True
    return brightness_std > 18 and median_val < 0.65 and median_sat < 0.25


_ANCHORS_PATH = os.path.join(os.path.dirname(__file__), '..', 'color_anchors.json')
_ANCHORS = None


def _load_anchors():
    """Load + cache color_anchors.json, pre-stacking each group into one (N,3)
    LAB array with an aligned family list for vectorised nearest-exemplar."""
    global _ANCHORS
    if _ANCHORS is None:
        with open(_ANCHORS_PATH, encoding='utf-8') as f:
            raw = json.load(f)

        def _stack(items):
            pts, fams = [], []
            for fam, labs in items:
                for lab in labs:
                    pts.append(lab)
                    fams.append(fam)
            return np.asarray(pts, dtype=float), fams

        fam_items = list(raw['families'].items())
        metal_items = list(raw['metallic'].items())
        fallback = set(raw.get('metallic_fallback', []))
        # Non-metallic path: every family (chromatic + neutral).
        chromatic = _stack(fam_items)
        # Metallic path: the three metals PLUS only the vivid fallback families,
        # so a coloured metallic keeps its hue while warm-pale / neutral families
        # can't steal gold/silver/bronze.
        metallic = _stack(metal_items + [(f, l) for f, l in fam_items
                                         if f in fallback])
        _ANCHORS = {'thresholds': raw['thresholds'],
                    'chromatic': chromatic, 'metallic': metallic}
    return _ANCHORS


def _nearest_family(group, L, a, b):
    """Family of the nearest exemplar by CIEDE2000."""
    pts, fams = group
    target = np.array([[[L, a, b]]])
    candidates = pts.reshape(-1, 1, 3)
    dists = deltaE_ciede2000(target, candidates).flatten()
    return fams[int(np.argmin(dists))]


def classify_family(lab, chroma: float = None, is_metallic: bool = False) -> str:
    """THE single colour-family classifier (Stage B: LAB nearest-exemplar).

    Input is CIELAB (D65), an optional precomputed chroma, and the metallic flag.
    `hue_family()` and `compute_color_family()` are thin adapters over this; the
    live scan calls it once per cluster (no voting); the frontend `classifyFamily`
    in offlineColorDetection.ts is its port over the SAME color_anchors.json — so
    the DB, the online scan and the offline scan can never disagree.

    Method (no hard hue bands anywhere — perceptually uniform, same LAB space as
    the matcher):
      1. metallic flag → nearest of the gold/silver/bronze metallic anchors.
      2. hard black floor: L < black_l → black (very dark colours carry no
         reliable hue). This is the ONLY explicit threshold.
      3. otherwise → nearest exemplar by ΔE76 over ALL families, neutrals
         included (grey/white/black are anchors too) — so a faint tint resolves
         to its hue and a true neutral resolves to grey, by distance not by
         boundary. You tune by moving / adding a clear exemplar in
         color_anchors.json, never by nudging a threshold.
    """
    L, a, b = float(lab[0]), float(lab[1]), float(lab[2])
    A = _load_anchors()

    if is_metallic:
        return _nearest_family(A['metallic'], L, a, b)
    if L < A['thresholds']['black_l']:
        return 'black'
    return _nearest_family(A['chromatic'], L, a, b)


def hue_family(h_deg: float, s: float, v: float, chroma: float = None,
               lab=None, finish: str = 'matte') -> str:
    """Back-compat shim → `classify_family` (non-metallic). The LAB drives the
    result; the legacy HSV args are ignored. Kept so existing callers/tests that
    still pass HSV keep working — new code should call `classify_family(lab)`."""
    if lab is None:
        return 'grey'
    return classify_family(lab, chroma, is_metallic=False)


def compute_color_family(hex_str: str, finish: str = 'matte') -> str:
    """Hex adapter over `classify_family` (the single classifier). Used by the DB
    builder, scripts and display. `finish='metallic'` is the metallic cue."""
    h = hex_str.lstrip('#')
    rgb = np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)]) / 255.0
    lab = color.rgb2lab(np.array([[rgb]]))[0][0]
    return classify_family(lab, None, is_metallic=(finish or '').lower() == 'metallic')


# ============================================================================
# SHADE TYPE ANALYZER - ENHANCED (AMERICAN SPELLING)
# ============================================================================

class ShadeTypeAnalyser:
    """Determine wash vs paint for shading - ENHANCED"""
    
    @staticmethod
    def determine_shade_type(cluster_data: Dict, brightness_std: float, family: str) -> str:
        """
        Returns 'wash' or 'paint'
        WITH SURFACE TYPE CLASSIFICATION
        """
        
        # Use surface type
        surface_type = ColorAnalyzer.classify_surface_type(brightness_std)
        
        # Metallic/weathered surfaces → wash
        if surface_type in ['metallic', 'weathered']:
            return 'wash'
        
        # METALLICS ALWAYS GET WASHES
        if (cluster_data.get('is_metallic', False) or 
            "Silver" in family or "Gold" in family or 
            "Bronze" in family or "Gunmetal" in family or 
            "Iron" in family or "Rust" in family):
            return 'wash'
        
        # HIGH TEXTURE = WASH
        if brightness_std > 30:
            return 'wash'
        
        # KEYWORD CHECK
        family_lower = family.lower()
        for keyword in ShadeRules.WASH_KEYWORDS:
            if keyword in family_lower:
                return 'wash'
        
        # VERY DARK COLORS = WASH
        median_value = cluster_data.get('median_hsv', [0, 0, 0])[2]
        if median_value < ShadeRules.DARK_VALUE_THRESHOLD:
            return 'wash'
        
        # Default: paint shade (layering)
        return 'paint'


# ============================================================================
# PAINT MATCHER — vectorised CIEDE2000 (replaces Euclidean KDTree)
# ============================================================================

_METALLIC_KEYWORDS = ("Silver", "Steel", "Gold", "Bronze", "Metal",
                      "Retributor", "Leadbelcher", "Iron")

# Role → DB category sets.  Callers request a semantic role; the matcher
# expands it to the relevant DB category strings stored in Paint.type.
ROLE_CATEGORIES: Dict[str, set] = {
    'dominant':  {'base', 'layer', 'air', 'contrast'},
    'highlight': {'base', 'layer', 'air', 'contrast'},
    'shade':     {'wash', 'shade', 'ink', 'contrast'},
    'wash':      {'wash', 'shade', 'ink'},
}

# Backward-compat shim: old paint_type strings → new role names.
_TYPE_TO_ROLE: Dict[str, str] = {
    'paint': 'dominant',
    'wash':  'wash',
}

# ΔE penalty per unit transparency for dominant/highlight roles.
# Contrast paint with transparency=0.7 → +5.6 ΔE penalty.
TRANSPARENCY_PENALTY: float = 8.0

# ΔE threshold below which two same-brand paints are considered duplicates
# (used in match_top_n deduplication).
_DEDUP_THRESHOLD: float = 2.0

# Roles whose candidate pool is gated to the detected colour's family + adjacent
# families (Prompt 8, Issue 1). Shade/wash are family-keyed elsewhere and unchanged.
FAMILY_GATED_ROLES = {'dominant', 'highlight'}

# A base/highlight match beyond this CIEDE2000 distance is noise, not a
# recommendation — return None so the slot honestly shows "No match found"
# instead of a far-off (often cross-family) paint, e.g. a ΔE-44 grey for a pink.
BASE_MATCH_DELTA_E_CEILING: float = 30.0

from core.colour_maths import ciede2000_single as _ciede2000_single


class PaintMatcher:
    """Match colours to paint database using vectorised CIEDE2000."""

    def __init__(self, paint_db: List[Paint]):
        # Exclude non-matchable paints from the search index.
        matchable = [p for p in paint_db if p.matchable]
        self.paint_db = matchable
        # Precompute arrays once — rows correspond to paint_db order.
        self.lab_matrix = np.array([p.lab for p in matchable], dtype=float)   # (N, 3)
        self.brands_arr = np.array([p.brand for p in matchable])               # (N,)
        self.types_arr  = np.array([p.type.lower() for p in matchable])        # (N,) lowercase
        self.finish_arr = np.array([p.finish.lower() for p in matchable])      # (N,) sheen only
        # Metallic-ness now comes from the `metallic` flag, NOT finish (sheen).
        self.metallic_arr = np.array([bool(p.metallic) for p in matchable],
                                     dtype=bool)                                # (N,)
        self.family_arr = np.array([(p.color_family or '').lower()
                                    for p in matchable])                        # (N,)
        self.transp_arr = np.array([p.transparency for p in matchable],
                                   dtype=float)                                 # (N,)
        logger.info(f"Paint matcher initialised: {len(matchable)}/{len(paint_db)} "
                    "matchable paints (vectorised CIEDE2000)")

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _candidates_mask(self, brand: str, role: str) -> np.ndarray:
        cats = ROLE_CATEGORIES.get(role.lower(), {role.lower()})
        return (self.brands_arr == brand) & np.isin(self.types_arr, list(cats))

    @staticmethod
    def _ciede2000_vs_matrix(target_lab: np.ndarray,
                              candidate_labs: np.ndarray) -> np.ndarray:
        """Vectorised CIEDE2000 of one target against N candidates — returns (N,) array."""
        n = len(candidate_labs)
        t = np.tile(target_lab, (n, 1)).reshape(n, 1, 3)
        c = candidate_labs.reshape(n, 1, 3)
        return deltaE_ciede2000(t, c).flatten()

    @staticmethod
    def _is_metallic_paint(name: str) -> bool:
        return any(kw in name for kw in _METALLIC_KEYWORDS)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def match_color(self, target_rgb: np.ndarray, brand: str,
                    role: str = 'dominant',
                    context: Dict = None,
                    paint_type: str = None,
                    target_family: str = None) -> Optional[Paint]:
        """Return the best-matching paint for target_rgb in the given brand/role.

        paint_type is accepted for backward compatibility and mapped to role.

        target_family (the detected colour's canonical family) gates base/highlight
        candidates to that family + its adjacent families and applies a ΔE ceiling,
        so a brand with no in-family paint returns None ("No match found") rather
        than a far-off cross-family paint (Prompt 8, Issue 1). When omitted, no
        family gate is applied (preserves legacy callers/tests).
        """
        if paint_type is not None:
            role = _TYPE_TO_ROLE.get(paint_type.lower(), paint_type.lower())

        target_rgb_norm = target_rgb / 255.0 if target_rgb.max() > 1 else target_rgb
        target_lab = color.rgb2lab(np.array([[target_rgb_norm]]))[0][0]

        mask = self._candidates_mask(brand, role)

        # ── Colour-family gate (base/highlight only) ─────────────────────────
        # Restrict to the detected family + adjacent families (shared adjacency
        # with the recipe graph). If the gated pool is empty, return None so the
        # slot honestly shows "No match found" instead of a cross-family paint.
        if target_family and role.lower() in FAMILY_GATED_ROLES:
            allowed = allowed_families(target_family)
            if allowed is not None:
                family_mask = mask & np.isin(self.family_arr, list(allowed))
                if not family_mask.any():
                    return None
                mask = family_mask

        # ── Metallic finish gate (skip for shade/wash roles) ─────────────
        if role not in ('shade', 'wash') and context:
            # Accept both legacy bool and new float metallic_score
            raw = context.get('metallic_score')
            if raw is None:
                raw = float(bool(context.get('is_metallic', False)))
            metallic_score = float(raw)

            if metallic_score >= 0.5:
                metallic_mask = mask & self.metallic_arr
                if metallic_mask.any():
                    mask = metallic_mask
                else:
                    logger.info(f"Metallic pool empty for {brand}/{role}, "
                                "falling back to unrestricted candidates")
            elif metallic_score == 0.0:
                mask = mask & ~self.metallic_arr
        elif role not in ('shade', 'wash'):
            # No context → exclude metallics from opaque paint matches
            mask = mask & ~self.metallic_arr

        candidate_indices = np.where(mask)[0]
        if len(candidate_indices) == 0:
            return None

        candidate_labs = self.lab_matrix[candidate_indices]
        # Keep the pure CIEDE2000 distances separate from the penalised ranking
        # distances, so the ΔE ceiling is judged on true colour distance (not on a
        # penalty-inflated score).
        raw_distances = self._ciede2000_vs_matrix(target_lab, candidate_labs)
        distances = raw_distances.copy()

        # ── Transparency penalty (dominant/highlight only) ────────────────
        if role in ('dominant', 'highlight'):
            distances += self.transp_arr[candidate_indices] * TRANSPARENCY_PENALTY

        # ── Legacy context-aware metallic name penalties ──────────────────
        if context and role not in ('shade', 'wash'):
            is_target_metallic = bool(context.get('metallic_score',
                                                   context.get('is_metallic', False)))
            for local_i, global_i in enumerate(candidate_indices):
                paint_metallic = self._is_metallic_paint(self.paint_db[global_i].name)
                if not is_target_metallic and paint_metallic:
                    distances[local_i] += 100
                elif is_target_metallic:
                    distances[local_i] += -30 if paint_metallic else 50

        best_local = int(np.argmin(distances))

        # ── ΔE ceiling (base/highlight only) ──────────────────────────────
        # A far-off winner is not a recommendation — return None so the slot
        # shows "No match found" rather than a misleading cross-family paint.
        if (role.lower() in FAMILY_GATED_ROLES
                and raw_distances[best_local] > BASE_MATCH_DELTA_E_CEILING):
            return None

        return self.paint_db[candidate_indices[best_local]]

    def match_top_n(self, target_lab: np.ndarray, brand: str = None,
                    role: str = None, n: int = 5,
                    paint_type: str = None,
                    target_family: str = None) -> List[Tuple[Paint, float]]:
        """Return top-N closest paints by CIEDE2000, optionally filtered by brand/role.

        paint_type accepted for backward compatibility.
        Results within ΔE 2.0 of each other (same brand) are deduplicated.

        target_family applies the same base/highlight family gate as match_color
        (detected family + adjacent families); omit it to leave candidates ungated.
        """
        if paint_type is not None and role is None:
            role = _TYPE_TO_ROLE.get(paint_type.lower(), paint_type.lower())

        if brand is not None and role is not None:
            mask = self._candidates_mask(brand, role)
        elif brand is not None:
            mask = self.brands_arr == brand
        elif role is not None:
            cats = ROLE_CATEGORIES.get(role.lower(), {role.lower()})
            mask = np.isin(self.types_arr, list(cats))
        else:
            mask = np.ones(len(self.paint_db), dtype=bool)

        # Colour-family gate (base/highlight only), shared with match_color.
        if target_family and role and role.lower() in FAMILY_GATED_ROLES:
            allowed = allowed_families(target_family)
            if allowed is not None:
                family_mask = mask & np.isin(self.family_arr, list(allowed))
                if family_mask.any():
                    mask = family_mask

        candidate_indices = np.where(mask)[0]
        if len(candidate_indices) == 0:
            return []

        candidate_labs = self.lab_matrix[candidate_indices]
        distances = self._ciede2000_vs_matrix(
            np.asarray(target_lab, dtype=float), candidate_labs
        )

        # Deduplicate: skip same-brand candidates within ΔE 2.0 of an already-
        # included paint to avoid returning near-identical colours.
        results: List[Tuple[Paint, float]] = []
        included: List[Paint] = []  # paints already in results

        for local_i in np.argsort(distances):
            if len(results) >= n:
                break
            global_i = candidate_indices[local_i]
            paint = self.paint_db[global_i]
            dist = float(distances[local_i])

            too_similar = any(
                inc.brand == paint.brand
                and _ciede2000_single(paint.lab, inc.lab) < _DEDUP_THRESHOLD
                for inc in included
            )
            if not too_similar:
                results.append((paint, dist))
                included.append(paint)

        return results


# ============================================================================
# VISUALIZATION ENGINE (UNCHANGED FROM ORIGINAL)
# ============================================================================

class VisualizationEngine:
    """Create tactical reticle overlays"""
    
    @staticmethod
    def create_color_overlay(img: np.ndarray, color_mask: np.ndarray,
                            color_rgb: np.ndarray, reticle_pos: Tuple[int, int],
                            rim_rgb: Tuple[int, int, int] = (0, 255, 100)) -> np.ndarray:
        """Single-colour highlight composite.

        Dims + desaturates the WHOLE image except this colour's mask, where the
        ORIGINAL full-colour pixels are revealed — so you can see exactly *where*
        the colour appears on the mini. The mask is first cleaned (speckle removed,
        tiny components dropped) and the rim is drawn ONLY on the OUTER contours of
        the surviving regions — never internal Canny edges, which previously lit up
        the whole figure's edge web. `rim_rgb` is the per-mode accent (green
        Imperial by default; pass purple for Warp).
        """
        h, w = color_mask.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        gray_rgb = cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)

        # Dim, desaturated backdrop for everything outside the mask.
        overlay = gray_rgb.astype(float) * 0.32

        # Clean the mask so scattered noise doesn't read as highlight.
        clean = VisualizationEngine._clean_mask(color_mask)

        if np.any(clean):
            mask_float = clean.astype(float)

            # Feather the mask so the reveal blends rather than aliases.
            soft = np.clip(cv2.GaussianBlur(mask_float, (9, 9), 0), 0.0, 1.0)
            soft3 = soft[:, :, None]

            # Reveal the original full-colour pixels inside the mask.
            img_f = img.astype(float)
            overlay = overlay * (1.0 - soft3) + img_f * soft3

            # Thin rim on the OUTER contours of the cleaned regions only.
            overlay = np.clip(overlay, 0, 255).astype(np.uint8)
            contours, _ = cv2.findContours(
                (mask_float * 255).astype(np.uint8),
                cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            min_area = max(25.0, 0.0005 * h * w)
            keep = [c for c in contours if cv2.contourArea(c) >= min_area]
            cv2.drawContours(overlay, keep, -1,
                             tuple(int(x) for x in rim_rgb), 2, lineType=cv2.LINE_AA)
        else:
            overlay = np.clip(overlay, 0, 255).astype(np.uint8)

        # Single, light centre reticle (no heavy HUD text/brackets).
        return VisualizationEngine._draw_minimal_reticle(
            overlay, reticle_pos[0], reticle_pos[1], rim_rgb
        )

    @staticmethod
    def _clean_mask(mask: np.ndarray) -> np.ndarray:
        """Morphological open (drop speckle) + keep connected components above a
        small area, so 'where the colour is' reads as coherent regions, not a
        dusting of single pixels. Falls back to the largest blob if the area
        filter would otherwise remove everything."""
        m = (np.asarray(mask).astype(np.uint8) > 0).astype(np.uint8)
        if not m.any():
            return m.astype(bool)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, kernel, iterations=1)
        n, labels, stats, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
        if n <= 1:
            return m.astype(bool)
        h, w = m.shape
        min_area = max(20, int(0.0004 * h * w))
        out = np.zeros_like(m)
        for i in range(1, n):
            if stats[i, cv2.CC_STAT_AREA] >= min_area:
                out[labels == i] = 1
        if not out.any():
            largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
            out[labels == largest] = 1
        return out.astype(bool)

    @staticmethod
    def _draw_minimal_reticle(img: np.ndarray, x: int, y: int,
                              color: Tuple[int, int, int]) -> np.ndarray:
        """A restrained reticle: a thin ring, four outward ticks, a white pip."""
        result = img.copy()
        c = (int(color[0]), int(color[1]), int(color[2]))
        r = 22
        cv2.circle(result, (x, y), r, c, 2, lineType=cv2.LINE_AA)
        for ex, ey in ((0, -1), (0, 1), (-1, 0), (1, 0)):
            p1 = (x + ex * (r + 3), y + ey * (r + 3))
            p2 = (x + ex * (r + 10), y + ey * (r + 10))
            cv2.line(result, p1, p2, c, 1, lineType=cv2.LINE_AA)
        cv2.circle(result, (x, y), 2, (255, 255, 255), -1, lineType=cv2.LINE_AA)
        return result

    @staticmethod
    def draw_enhanced_reticle(img: np.ndarray, x: int, y: int,
                             target_color_rgb: np.ndarray = None) -> np.ndarray:
        """Draw sci-fi / Warhammer auspex style reticle"""
        
        if target_color_rgb is not None:
             hud_color = (0, 255, 100)
        else:
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
    def find_optimal_reticle_position(color_mask: np.ndarray, 
                                     exclude_bottom_pct: float = 0.2) -> Tuple[int, int]:
        """Find optimal reticle position using distance transform"""
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