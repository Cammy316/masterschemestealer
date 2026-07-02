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
from typing import List, Dict, Tuple, Optional
import colorsys
from core.colour_maths import lab_to_oklab, lab_to_rgb
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
        # Speculars are BRIGHT AND DESATURATED (surface reflection carries the
        # light's colour, not the paint's) — the joint L/C condition trims
        # them while letting legitimately bright saturated paint (yellows,
        # bone) survive, which the old pure-percentile trim ate.
        # surviving_indices maps filtered-array positions → original positions
        # so that pixel_indices stored in clusters still address valid_coords.
        L_vals = pixels_lab[:, 0]
        C_vals = np.hypot(pixels_lab[:, 1], pixels_lab[:, 2])
        p_lo, p_hi = np.percentile(L_vals, [self._SPECULAR_L_LOW,
                                             self._SPECULAR_L_HIGH])
        desaturated = C_vals < max(0.5 * float(np.median(C_vals)), 5.0)
        specular = (L_vals > p_hi) & desaturated
        keep = ~specular & (L_vals >= p_lo)
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

        # STEP 1: Spatially coherent over-segmentation, then K-means in OKLab.
        #
        # SLIC superpixels restore the spatial information a bag-of-pixels
        # clustering throws away: each superpixel is a contiguous patch, so
        # sensor noise is averaged out per-patch and small physical details
        # (gold trim, gems) survive as their own samples instead of being
        # statistically swamped. K-means then runs on ~10² superpixel means
        # instead of ~10⁵ pixels — in OKLab, where Euclidean distance IS
        # perceptual distance — deliberately over-segmented (K=20); the
        # complete-linkage merge consolidates. Cluster statistics stay in
        # CIELAB for the classifier and matcher downstream.
        pixels_oklab = lab_to_oklab(pixels_lab)
        seg_flat = self._superpixel_labels(img_rgb, mask, surviving_indices)

        uniq, inv = np.unique(seg_flat, return_inverse=True)
        counts = np.bincount(inv).astype(float)
        sp_means = np.zeros((len(uniq), 3))
        for ch in range(3):
            sp_means[:, ch] = np.bincount(inv, weights=pixels_oklab[:, ch]) / counts

        n_initial_clusters = min(self.OVERSEGMENT_K, len(uniq), n_pixels)
        logger.info(f"Clustering {len(uniq)} superpixels into "
                    f"{n_initial_clusters} clusters (OKLab)...")

        kmeans = KMeans(n_clusters=n_initial_clusters, n_init=10, random_state=42)
        kmeans.fit(sp_means, sample_weight=counts)
        labels = kmeans.labels_[inv]

        # Per-superpixel brightness std — the LOCAL variance signal for the
        # metallic detector. Metallic flake sparkles WITHIN a superpixel-sized
        # patch; matte shading is smooth locally even when a cluster spans the
        # full lit-to-shadow range. Cluster-wide brightness_std stops being a
        # metallic signal once superpixels blend thin details into their
        # patches (the prod bronze/silver misfire), so it is kept only as a
        # texture feature.
        brightness_all = pixels_rgb.mean(axis=1)
        seg_mean = np.bincount(inv, weights=brightness_all) / counts
        seg_meansq = np.bincount(inv, weights=brightness_all ** 2) / counts
        seg_std = np.sqrt(np.maximum(seg_meansq - seg_mean ** 2, 0.0))

        initial_clusters = []
        for i in range(n_initial_clusters):
            cluster_mask = labels == i
            size = np.sum(cluster_mask)
            coverage = (size / n_pixels) * 100

            if size < 10:
                continue

            cluster_pixels_rgb = pixels_rgb[cluster_mask]
            cluster_pixels_lab = pixels_lab[cluster_mask]

            # ONE colour representative per cluster: the LAB median. RGB, HSV
            # and chroma are DERIVED from it so every statistic describes the
            # same colour (F3 fix) — the classifier and the matcher can no
            # longer see two different colours for one cluster.
            median_lab = np.median(cluster_pixels_lab, axis=0)
            median_rgb = lab_to_rgb(median_lab)
            mean_lab = np.mean(cluster_pixels_lab, axis=0)
            std_lab = np.std(cluster_pixels_lab, axis=0)
            brightness = cluster_pixels_rgb.mean(axis=1)
            brightness_std = np.std(brightness)
            chroma = np.sqrt(median_lab[1]**2 + median_lab[2]**2)
            median_hsv = np.array(colorsys.rgb_to_hsv(*(median_rgb / 255.0)))

            # Clusters are unions of whole superpixels, so the cluster's local
            # variance is the size-weighted mean of its superpixels' stds.
            seg_in_cluster = kmeans.labels_ == i
            local_brightness_std = float(np.average(
                seg_std[seg_in_cluster], weights=counts[seg_in_cluster]))

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
                'local_brightness_std': local_brightness_std,
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
                is_unique, conflicting_major = self._is_unique_from_majors(cluster, major_colors)
                if is_unique:
                    detail_colors.append(cluster)
                elif conflicting_major is not None:
                    # Not unique: merge pixels into the conflicting major cluster so they aren't lost from the mask
                    conflicting_major['pixel_indices'] = np.concatenate([
                        conflicting_major['pixel_indices'], cluster['pixel_indices']
                    ])
                    conflicting_major['coverage'] += cluster['coverage']
            elif coverage >= 0.5 and cluster_chroma > 50:
                logger.info(f"Preserving micro-detail: {cluster['family']} ({coverage:.1f}%)")
                cluster['is_detail'] = True
                is_unique, conflicting_major = self._is_unique_from_majors(cluster, major_colors)
                if is_unique:
                    detail_colors.append(cluster)
                elif conflicting_major is not None:
                    conflicting_major['pixel_indices'] = np.concatenate([
                        conflicting_major['pixel_indices'], cluster['pixel_indices']
                    ])
                    conflicting_major['coverage'] += cluster['coverage']
        
        logger.info(f"Final: {len(major_colors)} major + {len(detail_colors)} details")
        for c in major_colors + detail_colors:
             logger.info(f"  {c['family']}: {c['coverage']:.1f}% (conf={c.get('confidence', 1.0):.2f})")

        return major_colors + detail_colors
    
    # Deliberate over-segmentation: K is fixed and generous — the old
    # pixel-count heuristic proxied chromatic complexity with resolution.
    # The order-independent merge consolidates whatever K splits too finely.
    OVERSEGMENT_K = 20

    def _superpixel_labels(self, img_rgb: np.ndarray, mask: np.ndarray,
                           surviving_indices: np.ndarray) -> np.ndarray:
        """SLIC superpixel id for each surviving (masked, filtered) pixel.

        Falls back to one-pixel-one-segment if SLIC cannot run (degenerate
        mask shapes) — clustering then behaves exactly like pixel K-means.
        """
        from skimage.segmentation import slic

        n_masked = int(mask.sum())
        # ~40 px per superpixel (≈6×6 patches at analysis scale): fine enough
        # that painted detail (stripes, trim, panel lines) is not blended into
        # its surroundings — at //80 a small figure got ~9×9 patches that
        # mixed lit/shadow/detail pixels and corrupted every per-cluster
        # statistic downstream.
        n_segments = int(np.clip(n_masked // 40, 128, 1600))
        try:
            seg2d = slic(img_rgb, n_segments=min(n_segments, max(n_masked // 4, 1)),
                         compactness=10.0, mask=mask, start_label=1,
                         enforce_connectivity=True)
            return seg2d[mask][surviving_indices]
        except (ValueError, TypeError) as e:
            logger.warning(f"SLIC failed ({e}) — falling back to per-pixel clustering")
            return np.arange(len(surviving_indices))
    
    # Same-family clusters farther than this (OKLab Euclidean) from the
    # family group's coverage-weighted centre are NOT merged — merging, say,
    # seven scattered "Silver" clusters spanning L* 10–80 produces one blob
    # with a meaningless average colour and a reveal mask covering half the
    # model (the prod scattered-targeting failure).
    _DEDUP_SPREAD_OK = 0.12

    def _deduplicate_by_family(self, clusters: List[Dict]) -> List[Dict]:
        """Merge clusters that share the exact same family name — but only
        those that are also perceptually close; outliers stay separate."""
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
                continue

            # Coverage-weighted family centre in OKLab; members beyond the
            # spread radius are kept as their own clusters.
            oks = lab_to_oklab(np.array([c['median_lab'] for c in group]))
            weights = np.array([c['coverage'] for c in group], dtype=float)
            centre = np.average(oks, axis=0, weights=weights)
            dists = np.linalg.norm(oks - centre, axis=1)

            core = [c for c, d in zip(group, dists) if d <= self._DEDUP_SPREAD_OK]
            outliers = [c for c, d in zip(group, dists) if d > self._DEDUP_SPREAD_OK]

            if len(core) > 1:
                logger.info(f"Deduplicating {len(core)} clusters of family '{fam}'"
                            + (f" ({len(outliers)} kept separate)" if outliers else ""))
                combined = self._combine_clusters(core)
                combined['family'] = fam
                combined['confidence'] = np.mean([c.get('confidence', 1.0) for c in core])
                final_clusters.append(combined)
            else:
                final_clusters.extend(core)
            final_clusters.extend(outliers)

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

    # Complete-linkage merge threshold in OKLab Euclidean distance —
    # calibrated to the old CIEDE2000-6 merge distance (median equivalence
    # ≈ 0.053). Fixed, not data-dependent: the old min(6, mean/2) rule shrank
    # on monochrome scenes and under-merged them.
    _MERGE_THRESHOLD_OK = 0.055

    def _merge_perceptually_similar(self, clusters: List[Dict], pixels_lab: np.ndarray) -> List[Dict]:
        """Merge perceptually similar clusters — order-independent.

        Complete-linkage agglomerative grouping in OKLab: two clusters end up
        together only if EVERY pair in the group is within the threshold, so
        there is no greedy chaining and the result cannot depend on K-means
        label numbering (the old single-pass loop absorbed neighbours in
        visit order — audit F7).
        """
        if len(clusters) <= 1:
            return clusters

        from scipy.cluster.hierarchy import fcluster, linkage
        from scipy.spatial.distance import pdist

        medians_ok = lab_to_oklab(np.array([c['median_lab'] for c in clusters]))
        groups = fcluster(linkage(pdist(medians_ok), method='complete'),
                          t=self._MERGE_THRESHOLD_OK, criterion='distance')

        by_group: Dict[int, List[Dict]] = {}
        for cluster, g in zip(clusters, groups):
            by_group.setdefault(int(g), []).append(cluster)

        merged = []
        for members in by_group.values():
            # Protect small high-chroma trim (gold/gem) from being blended
            # into a large low-chroma body — the bronze-nose failure class.
            if len(members) > 1:
                protected = [m for m in members
                             if any(self._would_blend_small_trim(m, other)
                                    for other in members if other is not m)
                             and m.get('coverage', 100.0) <= self._TRIM_SMALL_COVERAGE]
                for p in protected:
                    members.remove(p)
                    merged.append(p)
            if not members:
                continue
            merged.append(members[0] if len(members) == 1
                          else self._combine_clusters(members))

        return merged
    
    def _combine_clusters(self, clusters: List[Dict]) -> Dict:
        """Combine multiple clusters into one.

        The combined representative is the coverage-weighted LAB blend; RGB,
        HSV and chroma are DERIVED from it (F3 fix). Averaging the parents'
        scalar chroma fields is wrong — opposing hues cancel in (a*, b*) but
        not in their chroma scalars, leaving a 'chroma' that describes no
        actual colour.
        """
        total_coverage = sum(c['coverage'] for c in clusters)
        weights = np.array([c['coverage'] for c in clusters])
        weights = weights / weights.sum()

        median_lab = sum(c['median_lab'] * w for c, w in zip(clusters, weights))
        median_rgb = lab_to_rgb(median_lab)
        chroma = float(np.hypot(median_lab[1], median_lab[2]))
        all_indices = np.concatenate([c['pixel_indices'] for c in clusters])

        combined = {
            'coverage': total_coverage,
            'median_rgb': median_rgb,
            'median_lab': median_lab,
            'chroma': chroma,
            'brightness_std': np.mean([c['brightness_std'] for c in clusters]),
            'local_brightness_std': float(sum(
                c.get('local_brightness_std', c['brightness_std']) * w
                for c, w in zip(clusters, weights))),
            'median_hsv': np.array(colorsys.rgb_to_hsv(*(median_rgb / 255.0))),
            'pixel_indices': all_indices
        }
        # Preserve the metallic decision through merges (coverage-weighted
        # majority) — previously the flag was silently dropped, so merged
        # clusters always read as non-metallic downstream.
        if all('is_metallic' in c for c in clusters):
            combined['is_metallic'] = bool(sum(
                w for c, w in zip(clusters, weights) if c['is_metallic']) >= 0.5)
        return combined
    
    def _is_unique_from_majors(self, detail: Dict, majors: List[Dict]) -> Tuple[bool, Optional[Dict]]:
        """Chroma-aware uniqueness checking. Returns (is_unique, conflicting_major)"""
        if not majors: return True, None
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
                return False, major
        return True, None
    
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
            
            if deltaE < 15.0 and other_v > v + 0.20:
                logger.info(f"Shadow detected: similar to {other.get('family', 'unknown')}")
                return True
        
        return False
    
    def _classify_family_ensemble_weighted(self, cluster: Dict, all_clusters: List[Dict] = None) -> Tuple[str, float]:
        """The single scan-time classification (Stage A consolidation).

        ONE call to color_engine.classify_family_margin() on the cluster's
        median LAB, with the metallic flag from the specular-variance detector
        (is_metallic_surface). There is no voting, no nearest-named-colour table
        and no gold/cyan LAB overlays any more — the scan family is produced by the
        exact SAME function as the DB family, so they cannot diverge. The metallic
        decision is stored on the cluster for the matcher's metallic gate.
        """
        from core.color_engine import (black_floor_l, classify_family_margin,
                                       is_metallic_surface)

        lab = cluster['median_lab']
        hsv = cluster.get('median_hsv', [0.0, 0.0, 0.0])
        median_sat = hsv[1] if len(hsv) > 1 else 0.0
        median_val = hsv[2] if len(hsv) > 2 else 0.0

        # The metallic detector reads the LOCAL (within-superpixel) brightness
        # variance: metallic sparkle is high-frequency, matte shading is
        # locally smooth. Cluster-wide std spans lit-to-shadow and fires on
        # any 3D form (the prod bronze/silver misfire).
        variance_signal = cluster.get('local_brightness_std',
                                      cluster.get('brightness_std', 0.0))
        is_metallic = is_metallic_surface(variance_signal,
                                          median_sat, median_val)

        # A scan-INFERRED metallic flag on a near-black cluster is
        # unfalsifiable (at that lightness "silver" and "black" look the
        # same) and routes classification to the metals-only anchors — black
        # armour must never come back as Silver. The DB path is untouched:
        # a curated dark-gunmetal paint keeps its metallic flag.
        if is_metallic and float(lab[0]) < black_floor_l():
            is_metallic = False
        cluster['is_metallic'] = is_metallic

        chroma = float(cluster.get('chroma') or 0.0)
        family_lc, margin = classify_family_margin(lab, chroma, is_metallic)
        family = family_lc.capitalize()

        # Confidence from the classification MARGIN — how much closer the
        # winning family's anchor is than the nearest rival family's. An
        # unambiguous grey is now as confident as an unambiguous red; the old
        # chroma ramp permanently capped neutrals at ~0.55.
        confidence = float(np.clip(0.5 + 0.45 * min(margin, 1.0), 0.5, 0.95))
        logger.debug(f"Classify: {family} (metallic={is_metallic}, "
                     f"margin={margin:.2f}, conf={confidence:.2f})")
        return family, confidence
