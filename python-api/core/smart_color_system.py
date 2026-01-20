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
                'pixel_indices': np.where(cluster_mask)[0]
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
        """Weighted ensemble voting - LAB is most reliable"""
        hsv = cluster['median_hsv']
        chroma = cluster['chroma']
        lab = cluster['median_lab']
        h_deg = hsv[0] * 360
        s, v = hsv[1], hsv[2]
        
        votes = []
        
        # Vote 1: HSV-based (weighted by saturation)
        hue_vote = self._classify_by_hue(h_deg, s, v, chroma)
        hue_weight = int((s * 20) if s > 0.2 else 5)
        votes.extend([hue_vote] * hue_weight)
        
        # Vote 2: LAB-based (always highly weighted)
        lab_vote = self._classify_by_lab_quadrant(lab, v)
        lab_weight = 30
        votes.extend([lab_vote] * lab_weight)
        
        # Vote 3: Named color (moderate weight)
        named_vote = self._classify_by_nearest_named_color(cluster['median_rgb'])
        named_weight = 10
        votes.extend([named_vote] * named_weight)
        
        from collections import Counter
        vote_counts = Counter(votes)
        winner, count = vote_counts.most_common(1)[0]
        confidence = count / len(votes)
        
        # Special case: Blue detection
        if "Blue" in votes and winner == "Grey" and s > 0.05:
            return "Blue", 0.70
        
        logger.debug(f"Ensemble: {winner} (conf={confidence:.2f})")
        
        return winner, confidence
    
    def _classify_by_hue(self, h_deg: float, s: float, v: float, chroma: float) -> str:
        """
        HSV-based classification with COMPLETE FIX SUITE
        ALL 7 COLOR FAMILY EXCEPTIONS APPLIED
        """
        # Define all special hue ranges
        is_blue_range = 180 < h_deg < 260
        is_green_range = 70 < h_deg < 170
        is_purple_range = 270 < h_deg < 320
        
        # Adjust minimum saturation for families that desaturate easily
        if is_blue_range or is_green_range or is_purple_range:
            min_sat = 0.05
        else:
            min_sat = 0.10
        
        # ===== ACHROMATIC CHECK WITH ALL EXCEPTIONS =====
        if s < min_sat or chroma < 5:
            # EXCEPTION 1: Desaturated blues (Ultramarines, Space Wolves)
            if is_blue_range and s > 0.05 and chroma > 3:
                return "Blue"
            
            # EXCEPTION 2: Desaturated greens (Dark Angels, Salamanders, Death Guard, Orks)
            if is_green_range and s > 0.06 and chroma > 4:
                return "Green"
            
            # EXCEPTION 3: Desaturated purples (Emperor's Children, Drukhari)
            if is_purple_range and s > 0.05 and chroma > 3:
                return "Purple"
            
            # Standard achromatic
            if v > 0.90: return "White"
            elif v < self.SHADOW_V_THRESHOLD: return "Black"
            elif v < 0.20 and chroma < 3: return "Shadow"
            else: return "Grey"
        
        # ===== CHROMATIC CLASSIFICATION =====
        
        # RED ZONE (0-30° and 330-360°)
        if h_deg < 30 or h_deg > 330:
            # Warm gold detection (20-30°)
            if 20 < h_deg < 30 and v > 0.50 and chroma > 25 and s > 0.40:
                return "Gold"
            
            # Red vs Brown - USE CHROMA (FIX #8)
            if h_deg < 20:
                if chroma < 15:
                    return "Brown"  # Low chroma = brown (leather)
                elif s < 0.6 and v < 0.4:
                    return "Brown"  # Dark desaturated = brown
                else:
                    return "Red"  # High chroma = dark red (Blood Angels)
            
            # Pink detection - RELAXED (FIX #7)
            if s > 0.35 and v > 0.55:
                return "Pink"
            elif s < 0.5 and v > 0.8:
                return "Pink"
            
            # Magenta
            if h_deg > 300:
                return "Magenta"
            
            return "Red"
        
        # GOLD/BRONZE/BROWN ZONE (30-70°)
        elif h_deg < 70:
            # Improved gold detection
            if chroma > self.GOLD_CHROMA_THRESHOLD and v > 0.45 and s > 0.35:
                if v > 0.70 and s > 0.60:
                    return "Gold"
                elif v > 0.50:
                    return "Gold"
                else:
                    return "Bronze"
            else:
                return "Brown"
        
        # YELLOW ZONE (70-95°) - EXPANDED (FIX #9)
        elif h_deg < 95:
            if s > 0.50 and v > 0.65:
                return "Yellow"
            elif s > 0.30 and v > 0.75:
                return "Yellow"  # Pale yellow
            else:
                return "Bone"
        
        # GREEN ZONE (95-170°)
        elif h_deg < 170:
            # Cyan disambiguation (FIX #6)
            if 165 < h_deg < 180 and chroma > 25:
                return "Cyan"  # High chroma cyan
            else:
                return "Green"
        
        # CYAN ZONE (170-190°) - STRICT RANGE
        elif h_deg < 190:
            return "Cyan"
        
        # BLUE ZONE (190-260°) - Starts later to avoid cyan
        elif h_deg < 260:
            return "Blue"
        
        # PURPLE ZONE (260-320°)
        elif h_deg < 320:
            return "Purple" if v < 0.6 else "Pink"
        
        # MAGENTA ZONE (320-330°)
        elif h_deg < 330:
            return "Magenta"
        
        return "Unknown"
    
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