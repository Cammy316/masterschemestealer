"""
Smart Perceptual Color Clustering System - FINAL VERSION WITH ALL FIXES
No more HSV threshold hell - uses perceptual science instead
"""
import numpy as np
import cv2
from sklearn.cluster import DBSCAN, KMeans
from sklearn.preprocessing import StandardScaler
from skimage import color
from scipy.spatial.distance import cdist
from typing import List, Dict, Tuple
import colorsys
from utils.logging_config import logger


class SmartColorExtractor:
    """
    Intelligent color extraction that adapts to each image
    WITH COMPLETE FIX SUITE FOR WARHAMMER MINIATURES
    """
    
    # Percentile bounds for specular and deep-shadow filtering.
    # Applied before k-means so phantom "White" clusters from gloss varnish
    # and flash don't drag cluster medians lighter.
    _SPECULAR_L_HIGH = 98
    _SPECULAR_L_LOW = 2
    _MIN_PIXELS_AFTER_FILTER = 5000

    def __init__(self):
        self.min_cluster_size = 0.03
        self.detail_threshold = 0.05

        # Configurable thresholds
        self.SHADOW_V_THRESHOLD = 0.10
        self.GOLD_CHROMA_THRESHOLD = 22
        self.DETAIL_BASE_THRESHOLD = 3.0
    
    def extract_colors(self, img_rgb: np.ndarray, mask: np.ndarray) -> List[Dict]:
        """Main extraction pipeline - fully adaptive"""
        logger.info("Starting smart color extraction (FINAL VERSION)")
        
        # Get valid pixels
        pixels_rgb = img_rgb[mask]
        n_pixels = len(pixels_rgb)
        
        if n_pixels < 100:
            logger.warning("Too few pixels to analyze")
            return []
        
        # Convert to LAB (perceptually uniform)
        pixels_lab = color.rgb2lab(
            pixels_rgb.reshape(-1, 1, 3) / 255.0
        ).reshape(-1, 3)

        # Filter specular highlights (gloss varnish, flash) and deep shadows
        # before clustering so they don't form phantom clusters or drag medians.
        # surviving_indices maps filtered-array positions → original positions
        # so that pixel_indices stored in clusters still address valid_coords.
        L_vals = pixels_lab[:, 0]
        p_lo, p_hi = np.percentile(L_vals, [self._SPECULAR_L_LOW,
                                             self._SPECULAR_L_HIGH])
        keep = (L_vals >= p_lo) & (L_vals <= p_hi)
        if keep.sum() >= self._MIN_PIXELS_AFTER_FILTER:
            surviving_indices = np.where(keep)[0]
            pixels_rgb = pixels_rgb[keep]
            pixels_lab = pixels_lab[keep]
            n_pixels = len(pixels_rgb)
            logger.debug(f"Specular filter: kept {n_pixels} pixels "
                         f"(L* {p_lo:.1f}–{p_hi:.1f})")
        else:
            surviving_indices = np.arange(n_pixels)
            logger.warning("Specular filter skipped: too few pixels would remain")

        # STEP 1: Initial clustering in LAB space
        n_initial_clusters = self._determine_optimal_k(n_pixels)
        logger.info(f"Initial clustering into {n_initial_clusters} clusters...")
        
        kmeans = KMeans(n_clusters=n_initial_clusters, n_init=10, random_state=42)
        labels = kmeans.fit_predict(pixels_lab)
        
        initial_clusters = []
        for i in range(n_initial_clusters):
            cluster_mask = labels == i
            size = np.sum(cluster_mask)
            coverage = (size / n_pixels) * 100
            
            if size < 10:
                continue
            
            cluster_pixels_rgb = pixels_rgb[cluster_mask]
            cluster_pixels_lab = pixels_lab[cluster_mask]
            
            median_rgb = np.median(cluster_pixels_rgb, axis=0)
            median_lab = np.median(cluster_pixels_lab, axis=0)
            mean_lab = np.mean(cluster_pixels_lab, axis=0)
            std_lab = np.std(cluster_pixels_lab, axis=0)
            brightness = cluster_pixels_rgb.mean(axis=1)
            brightness_std = np.std(brightness)
            chroma = np.sqrt(median_lab[1]**2 + median_lab[2]**2)
            median_hsv = np.array(colorsys.rgb_to_hsv(*(median_rgb / 255.0)))
            
            # Remap local (post-filter) indices back to original pixel positions
            # so that spatial-mask reconstruction in the engine works correctly.
            local_indices = np.where(cluster_mask)[0]
            original_indices = surviving_indices[local_indices]

            initial_clusters.append({
                'id': i,
                'coverage': coverage,
                'median_rgb': median_rgb,
                'median_lab': median_lab,
                'mean_lab': mean_lab,
                'std_lab': std_lab,
                'chroma': chroma,
                'brightness_std': brightness_std,
                'median_hsv': median_hsv,
                'pixel_indices': original_indices,
            })
        
        # STEP 2: Perceptual merging
        merged_clusters = self._merge_perceptually_similar(initial_clusters, pixels_lab)
        
        # STEP 3: Classify Families WITH spatial shadow detection
        for cluster in merged_clusters:
            if self._is_likely_shadow(cluster, merged_clusters):
                cluster['family'] = "Shadow"
                cluster['confidence'] = 0.30
                logger.info(f"Cluster marked as shadow: coverage={cluster['coverage']:.1f}%")
            else:
                family, confidence = self._classify_family_ensemble_weighted(cluster, merged_clusters)
                cluster['family'] = family
                cluster['confidence'] = confidence
        
        # Filter out shadows
        merged_clusters = [c for c in merged_clusters if c['family'] != "Shadow"]
        logger.info(f"After shadow filtering: {len(merged_clusters)} clusters remain")
        
        # STEP 4: Deduplicate Families
        deduplicated_clusters = self._deduplicate_by_family(merged_clusters)
        
        # STEP 5: Classify Major vs Detail WITH confidence filtering
        major_colors = []
        detail_colors = []
        
        for cluster in deduplicated_clusters:
            coverage = cluster['coverage']
            cluster_chroma = cluster.get('chroma', 0)
            confidence = cluster.get('confidence', 1.0)
            
            # Filter very low confidence
            if confidence < 0.20:
                logger.info(f"Filtering low confidence: {cluster['family']} (conf={confidence:.2f})")
                continue
            
            # Adaptive threshold
            num_colors = len(deduplicated_clusters)
            if num_colors <= 3:
                base_threshold = 2.0
            else:
                base_threshold = self.DETAIL_BASE_THRESHOLD
            
            # High-chroma details
            if cluster_chroma > 40:
                base_threshold = 1.5
                logger.debug(f"High-chroma detail: chroma={cluster_chroma:.1f}")
            
            if coverage >= base_threshold:
                cluster['is_detail'] = False
                major_colors.append(cluster)
            elif coverage >= 0.2:
                cluster['is_detail'] = True
                if self._is_unique_from_majors(cluster, major_colors):
                    detail_colors.append(cluster)
            elif coverage >= 0.5 and cluster_chroma > 50:
                logger.info(f"Preserving micro-detail: {cluster['family']} ({coverage:.1f}%)")
                cluster['is_detail'] = True
                if self._is_unique_from_majors(cluster, major_colors):
                    detail_colors.append(cluster)
        
        logger.info(f"Final: {len(major_colors)} major + {len(detail_colors)} details")
        for c in major_colors + detail_colors:
             logger.info(f"  {c['family']}: {c['coverage']:.1f}% (conf={c.get('confidence', 1.0):.2f})")

        return major_colors + detail_colors
    
    def _determine_optimal_k(self, n_pixels: int) -> int:
        """Adaptive K based on image complexity"""
        if n_pixels < 5000:
            return 8
        elif n_pixels < 20000:
            return 10
        elif n_pixels < 50000:
            return 12
        else:
            return 15
    
    def _deduplicate_by_family(self, clusters: List[Dict]) -> List[Dict]:
        """Merge clusters that share the exact same family name"""
        if not clusters: return []
        
        groups = {}
        for c in clusters:
            fam = c['family']
            if fam not in groups:
                groups[fam] = []
            groups[fam].append(c)
        
        final_clusters = []
        
        for fam, group in groups.items():
            if len(group) == 1:
                final_clusters.append(group[0])
            else:
                logger.info(f"Deduplicating {len(group)} clusters of family '{fam}'")
                combined = self._combine_clusters(group)
                combined['family'] = fam
                combined['confidence'] = np.mean([c.get('confidence', 1.0) for c in group])
                final_clusters.append(combined)
        
        final_clusters.sort(key=lambda x: x['coverage'], reverse=True)
        return final_clusters

    # Small high-chroma trim protection thresholds (Prompt 1.3, Module 3).
    _TRIM_SMALL_COVERAGE = 8.0    # percent — "small" region
    _TRIM_HIGH_CHROMA = 30.0      # trim must be genuinely saturated to be protected
    _TRIM_LOW_CHROMA = 20.0       # neighbour must be dull to be the blend culprit

    def _would_blend_small_trim(self, c1: Dict, c2: Dict) -> bool:
        """True if merging c1 and c2 would absorb a small, high-chroma trim region
        (gold edge, gem, lens) into a large, low-chroma neighbour. Such pairings
        are kept separate even when their ΔE is under the merge threshold — this
        targets the bronze-nose class of bug without raising the global cluster
        count. Returns False for ordinary similar-colour merges."""
        def small_hi(c):
            return (c.get('coverage', 100.0) <= self._TRIM_SMALL_COVERAGE
                    and c.get('chroma', 0.0) > self._TRIM_HIGH_CHROMA)

        def large_lo(c):
            return (c.get('coverage', 0.0) > self._TRIM_SMALL_COVERAGE
                    and c.get('chroma', 999.0) < self._TRIM_LOW_CHROMA)

        return (small_hi(c1) and large_lo(c2)) or (small_hi(c2) and large_lo(c1))

    def _merge_perceptually_similar(self, clusters: List[Dict], pixels_lab: np.ndarray) -> List[Dict]:
        """Merge perceptually similar clusters using deltaE"""
        if len(clusters) <= 1: return clusters
        
        n = len(clusters)
        dist_matrix = np.zeros((n, n))
        
        for i in range(n):
            for j in range(i+1, n):
                c1_lab = clusters[i]['median_lab']
                c2_lab = clusters[j]['median_lab']
                dist = color.deltaE_ciede2000(np.array([[c1_lab]]), np.array([[c2_lab]]))[0][0]
                dist_matrix[i, j] = dist
                dist_matrix[j, i] = dist
        
        mean_distance = np.mean(dist_matrix[dist_matrix > 0])
        merge_threshold = min(15.0, mean_distance * 0.5)
        
        merged = []
        used = set()

        for i in range(n):
            if i in used: continue

            similar = [i]
            for j in range(i+1, n):
                if j not in used and dist_matrix[i, j] < merge_threshold:
                    # Protect small high-chroma trim (gold/gem) from being blended
                    # into a large low-chroma body — the bronze-nose failure class.
                    if self._would_blend_small_trim(clusters[i], clusters[j]):
                        continue
                    similar.append(j)
                    used.add(j)
            
            if len(similar) == 1:
                merged.append(clusters[i])
            else:
                merged_cluster = self._combine_clusters([clusters[idx] for idx in similar])
                merged.append(merged_cluster)
            used.add(i)
        
        return merged
    
    def _combine_clusters(self, clusters: List[Dict]) -> Dict:
        """Combine multiple clusters into one"""
        total_coverage = sum(c['coverage'] for c in clusters)
        weights = np.array([c['coverage'] for c in clusters])
        weights = weights / weights.sum()
        
        median_rgb = sum(c['median_rgb'] * w for c, w in zip(clusters, weights))
        median_lab = sum(c['median_lab'] * w for c, w in zip(clusters, weights))
        chroma = sum(c['chroma'] * w for c, w in zip(clusters, weights))
        all_indices = np.concatenate([c['pixel_indices'] for c in clusters])
        
        return {
            'coverage': total_coverage,
            'median_rgb': median_rgb,
            'median_lab': median_lab,
            'chroma': chroma,
            'brightness_std': np.mean([c['brightness_std'] for c in clusters]),
            'median_hsv': np.array(colorsys.rgb_to_hsv(*(median_rgb / 255.0))),
            'pixel_indices': all_indices
        }
    
    def _is_unique_from_majors(self, detail: Dict, majors: List[Dict]) -> bool:
        """Chroma-aware uniqueness checking"""
        if not majors: return True
        detail_lab = detail['median_lab']
        detail_chroma = detail.get('chroma', 0)
        
        for major in majors:
            major_lab = major['median_lab']
            dist = color.deltaE_ciede2000(
                np.array([[detail_lab]]), 
                np.array([[major_lab]])
            )[0][0]
            
            # Chroma-aware threshold
            if detail_chroma > 40:
                threshold = 25.0
            elif detail_chroma > 25:
                threshold = 20.0
            else:
                threshold = 15.0
            
            threshold -= (detail['coverage'] * 1.5)
            threshold = max(threshold, 10.0)
            
            if dist < threshold: 
                return False
        return True
    
    def _is_likely_shadow(self, cluster: Dict, all_clusters: List[Dict]) -> bool:
        """Detect if a dark cluster is likely a shadow"""
        coverage = cluster['coverage']
        hsv = cluster['median_hsv']
        v = hsv[2]
        
        if coverage > 5.0:
            return False
        
        if v > 0.20 or v < 0.05:
            return False
        
        cluster_lab = cluster['median_lab']
        
        for other in all_clusters:
            if other == cluster:
                continue
            
            other_lab = other['median_lab']
            other_v = other['median_hsv'][2]
            
            deltaE = color.deltaE_ciede2000(
                np.array([[cluster_lab]]), 
                np.array([[other_lab]])
            )[0][0]
            
            if deltaE < 40 and other_v > v + 0.20:
                logger.info(f"Shadow detected: similar to {other.get('family', 'unknown')}")
                return True
        
        return False
    
    def _classify_family_ensemble_weighted(self, cluster: Dict, all_clusters: List[Dict] = None) -> Tuple[str, float]:
        """Weighted ensemble voting around the canonical hue family.

        The hue vote is color_engine.hue_family() — the SAME single source of
        truth compute_color_family() uses — so the DB family and the scan family
        agree by construction. The LAB and named-colour votes are corroboration /
        tie-breakers only; they no longer define hue boundaries. The LAB vote
        defers to the hue family for chromatic colours and asserts itself only as
        a gold (metallic) overlay, which scan-time metallic detection relies on.
        """
        from collections import Counter
        from core.color_engine import hue_family

        hsv = cluster['median_hsv']
        chroma = cluster['chroma']
        lab = cluster['median_lab']
        h_deg = hsv[0] * 360
        s, v = hsv[1], hsv[2]

        # Vote 1: canonical hue family (flat lowercase → capitalised for voting).
        hue_vote = hue_family(h_deg, s, v, chroma, lab=lab).capitalize()

        # Vote 2: LAB defers to the hue family — it corroborates the hue boundary
        # rather than defining its own (this is what kills the cyan-as-green class
        # of disagreement). Its only assertion is the gold metallic overlay,
        # applied after the vote.
        lab_vote = hue_vote

        # Vote 3: nearest named colour (corroboration only).
        named_vote = self._classify_by_nearest_named_color(cluster['median_rgb'])

        # Confidence/agreement-based weights — the corrected hue vote is no longer
        # drowned by a single LAB vote (old lab_weight=30 fixed vs hue=s*20).
        hue_weight = int(np.clip(s * 25, 10, 25))
        lab_weight = 18
        named_weight = 8

        votes = ([hue_vote] * hue_weight
                 + [lab_vote] * lab_weight
                 + [named_vote] * named_weight)

        vote_counts = Counter(votes)
        winner, count = vote_counts.most_common(1)[0]
        confidence = count / len(votes)

        # If hue and named agree, that family wins — unless LAB strongly indicates
        # a (very neutral) achromatic colour. Stops a lone mis-quadranted LAB vote
        # from overriding two agreeing chromatic voters (the cyan-as-green case).
        L, a, b = lab
        lab_strongly_achromatic = abs(a) < 3 and abs(b) < 3
        if hue_vote == named_vote and not lab_strongly_achromatic:
            winner = hue_vote
            confidence = max(confidence, (hue_weight + named_weight) / len(votes))

        # Gold metallic overlay: a YELLOW carrying a strong gold LAB signature is
        # reported as "Gold" so scan-time metallic detection (which scans the
        # family string for "Gold") still fires. Gold is metallic-yellow, so it
        # normalises straight back to yellow for matte DB comparison — it never
        # creates a hue disagreement. Restricted to yellow so tans/ochres/bone
        # are not swept into gold.
        if hue_vote == "Yellow" and self._is_gold_in_lab(lab):
            return "Gold", confidence

        logger.debug(f"Ensemble: {winner} (conf={confidence:.2f})")

        return winner, confidence
    
    # _classify_by_hue() removed (Prompt 1.3): hue→family classification is now
    # the single canonical color_engine.hue_family(), called by the ensemble
    # above and by compute_color_family(), so the two can never disagree.

    def _classify_by_lab_quadrant(self, lab: np.ndarray, v: float) -> str:
            L, a, b = lab
            
            # Check for gold signature FIRST (already exists, but strengthen it)
            if self._is_gold_in_lab(lab):
                return "Gold"
            
            # Check for cyan signature
            if self._is_cyan_in_lab(lab):
                return "Cyan"
            
            # Check for pink signature
            if self._is_pink_in_lab(lab):
                return "Pink"
            
            if abs(a) < 5 and abs(b) < 5: 
                return "Grey"
            
            if a > abs(b): 
                return "Pink" if L > 75 else "Red"
            elif a < -abs(b): 
                return "Green"
            elif b > abs(a):
                # IMPROVED: More nuanced gold vs yellow
                if b > 25 and L > 50:  # Strong yellow component, bright
                    if a > -5:  # Even slightly red = gold
                        return "Gold"
                    else:
                        return "Yellow"  # True yellow (no red)
                else:
                    return "Yellow" if a < 0 else "Gold"
            elif b < -abs(a): 
                return "Blue"
            
            return "Unknown"
    
    def _is_gold_in_lab(self, lab: np.ndarray) -> bool:
            '''
            Gold detection in LAB space
            
            Gold signature:
            - L: 50-85 (bright but not white)
            - a: -8 to 20 (can be slightly green to moderately red)
            - b: 25+ (STRONG yellow component)
            '''
            L, a, b_val = lab
            
            is_gold = (
                50 < L < 85 and
                -8 < a < 20 and  # RELAXED: Allow slight green tint
                b_val > 25  # RELAXED: Catch darker golds too
            )
            
            if is_gold:
                logger.debug(f"LAB gold detected: L={L:.1f}, a={a:.1f}, b={b_val:.1f}")
            
            return is_gold
    
    def _is_cyan_in_lab(self, lab: np.ndarray) -> bool:
        """Cyan detection in LAB space (FIX #6)"""
        L, a, b_val = lab
        
        # Cyan: a < 0 (green-ish) AND b < -10 (blue-ish)
        is_cyan = (a < -5 and b_val < -10 and L > 40)
        
        if is_cyan:
            logger.debug(f"LAB cyan detected: L={L:.1f}, a={a:.1f}, b={b_val:.1f}")
        
        return is_cyan
    
    def _is_pink_in_lab(self, lab: np.ndarray) -> bool:
        """Pink detection in LAB space (FIX #7)"""
        L, a, b_val = lab
        
        # Pink: High L (light), high a (red), moderate b
        is_pink = (L > 60 and a > 20 and b_val > -5)
        
        if is_pink:
            logger.debug(f"LAB pink detected: L={L:.1f}, a={a:.1f}, b={b_val:.1f}")
        
        return is_pink
    
    def _classify_by_nearest_named_color(self, rgb: np.ndarray) -> str:
        """Classify by distance to named colors"""
        named_colors = {
            'Pink': [255, 192, 203],
            'Red': [255, 0, 0],
            'Gold': [255, 215, 0],
            'Yellow': [255, 255, 0],
            'Green': [0, 128, 0],
            'Cyan': [0, 255, 255],
            'Blue': [0, 0, 255],
            'Purple': [128, 0, 128],
            'Brown': [139, 69, 19],
            'White': [255, 255, 255],
            'Grey': [128, 128, 128],
            'Black': [0, 0, 0]
        }
        
        min_dist = float('inf')
        nearest = "Unknown"
        
        for name, ref_rgb in named_colors.items():
            dist = np.linalg.norm(rgb - np.array(ref_rgb))
            if dist < min_dist:
                min_dist = dist
                nearest = name
        
        return nearest