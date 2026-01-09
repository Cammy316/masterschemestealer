"""
Smart Perceptual Color Clustering System
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
    No hardcoded thresholds - uses perceptual clustering
    """
    
    def __init__(self):
        self.min_cluster_size = 0.03  # 3% minimum (adaptive)
        self.detail_threshold = 0.05  # 5% maximum for details
    
    def extract_colors(self, img_rgb: np.ndarray, mask: np.ndarray) -> List[Dict]:
        """
        Main extraction pipeline - fully adaptive
        Returns both major colors and details in one pass
        """
        logger.info("Starting smart color extraction")
        
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
        
        # ===== STEP 1: Initial clustering in LAB space =====
        n_initial_clusters = 10
        logger.info(f"Initial clustering into {n_initial_clusters} clusters...")
        
        kmeans = KMeans(n_clusters=n_initial_clusters, n_init=10, random_state=42)
        labels = kmeans.fit_predict(pixels_lab)
        
        initial_clusters = []
        for i in range(n_initial_clusters):
            cluster_mask = labels == i
            size = np.sum(cluster_mask)
            coverage = (size / n_pixels) * 100
            
            if size < 10:  # Skip tiny clusters
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
        
        # ===== STEP 2: Perceptual merging =====
        merged_clusters = self._merge_perceptually_similar(initial_clusters, pixels_lab)
        
        # ===== STEP 3: Classify Families FIRST (Before splitting detail/major) =====
        # We classify early so we can deduplicate based on names
        for cluster in merged_clusters:
            family = self._classify_family_ensemble(cluster)
            cluster['family'] = family
        
        # ===== STEP 4: Deduplicate Families =====
        # This merges "Red" + "Red" into a single "Red" cluster using robust dict grouping
        deduplicated_clusters = self._deduplicate_by_family(merged_clusters)
        
        # ===== STEP 5: Classify Major vs Detail =====
        major_colors = []
        detail_colors = []
        
        for cluster in deduplicated_clusters:
            coverage = cluster['coverage']
            
            # Revised Threshold Logic
            num_colors = len(deduplicated_clusters)
            if num_colors <= 3:
                base_threshold = 3.0 # Few colors -> lower bar (3%)
            else:
                base_threshold = 5.0 # Normal -> standard bar (5%)
                
            if coverage >= base_threshold:
                cluster['is_detail'] = False
                major_colors.append(cluster)
            elif coverage >= 0.2:  # Min detail size (0.2%)
                cluster['is_detail'] = True
                if self._is_unique_from_majors(cluster, major_colors):
                    detail_colors.append(cluster)
        
        logger.info(f"Final: {len(major_colors)} major + {len(detail_colors)} details")
        for c in major_colors + detail_colors:
             logger.info(f"  {c['family']}: {c['coverage']:.1f}% (detail={c.get('is_detail', False)})")

        return major_colors + detail_colors

    def _deduplicate_by_family(self, clusters: List[Dict]) -> List[Dict]:
        """
        Merge clusters that share the exact same family name.
        Uses dictionary grouping for guaranteed merging.
        """
        if not clusters: return []
        
        # Group clusters by their family name
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
                # We have duplicates! Merge them.
                logger.info(f"Deduplicating {len(group)} clusters of family '{fam}'")
                combined = self._combine_clusters(group)
                combined['family'] = fam  # Ensure name persists
                final_clusters.append(combined)
                
        # Sort by size descending
        final_clusters.sort(key=lambda x: x['coverage'], reverse=True)
        return final_clusters

    def _merge_perceptually_similar(self, clusters: List[Dict], pixels_lab: np.ndarray) -> List[Dict]:
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
        if not majors: return True
        detail_lab = detail['median_lab']
        
        for major in majors:
            major_lab = major['median_lab']
            dist = color.deltaE_ciede2000(np.array([[detail_lab]]), np.array([[major_lab]]))[0][0]
            threshold = 20.0 - (detail['coverage'] * 2)
            if dist < threshold: return False
        return True
    
    def _classify_family_ensemble(self, cluster: Dict) -> str:
        hsv = cluster['median_hsv']
        chroma = cluster['chroma']
        lab = cluster['median_lab']
        h_deg = hsv[0] * 360
        s, v = hsv[1], hsv[2]
        
        votes = []
        votes.append(self._classify_by_hue(h_deg, s, v, chroma))
        votes.append(self._classify_by_lab_quadrant(lab, v))
        votes.append(self._classify_by_nearest_named_color(cluster['median_rgb']))
        
        from collections import Counter
        vote_counts = Counter(votes)
        
        # Priority check: If any method voted "Blue" and the result is "Grey",
        # check if it's a desaturated blue case.
        if "Blue" in votes and vote_counts.most_common(1)[0][0] == "Grey":
             # Force Blue if saturation is decent (e.g. > 5% for pale blue hair)
             if s > 0.05: return "Blue"

        return vote_counts.most_common(1)[0][0]
    
    def _classify_by_hue(self, h_deg: float, s: float, v: float, chroma: float) -> str:
        # 1. Achromatic Check with Blue exception
        is_blue_range = 180 < h_deg < 260
        min_sat = 0.05 if is_blue_range else 0.10
        
        if s < min_sat or chroma < 5: 
            if v > 0.90: return "White"
            elif v < 0.15: return "Black"
            else: return "Grey"
        
        # 2. Chromatic Logic
        if h_deg < 30 or h_deg > 330:
            # IMPROVED: Red vs Leather Brown separation
            if h_deg < 20 and s < 0.6 and v < 0.4: return "Brown" # Leather range
            if s < 0.5 and v > 0.8: return "Pink" # Pastel Pink
            if h_deg > 300: return "Magenta"      # Deep Pink/Magenta
            return "Red"                          # Standard Red
            
        elif h_deg < 70:
            return "Gold" if chroma > 30 else "Brown"
        elif h_deg < 160:
            return "Green"
        elif h_deg < 250:
            return "Blue"
        elif h_deg < 330:
            return "Purple" if v < 0.6 else "Pink"
        
        return "Unknown"
    
    def _classify_by_lab_quadrant(self, lab: np.ndarray, v: float) -> str:
        L, a, b = lab
        if abs(a) < 5 and abs(b) < 5: return "Grey"
        
        if a > abs(b): return "Pink" if L > 75 else "Red" # Pink is generally lighter
        elif a < -abs(b): return "Green"
        elif b > abs(a): return "Gold" if a > 0 else "Yellow"
        elif b < -abs(a): return "Blue"
        
        return "Unknown"
    
    def _classify_by_nearest_named_color(self, rgb: np.ndarray) -> str:
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