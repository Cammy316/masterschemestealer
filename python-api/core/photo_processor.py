"""
Photo Quality Assessment and Enhancement
Handles: glare, low light, blur detection, color casts
"""

import cv2
import numpy as np
from typing import Dict, Tuple, List
from dataclasses import dataclass
from config import PhotoQuality
from utils.logging_config import logger


@dataclass
class PhotoQualityReport:
    """Photo quality assessment result"""
    score: int  # 0-100
    quality_level: str  # 'Excellent', 'Good', 'Fair', 'Poor'
    can_process: bool
    issues: List[str]
    warnings: List[str]
    enhanced_image: np.ndarray


class PhotoProcessor:
    """
    Advanced photo preprocessing pipeline
    Handles common mobile photography issues
    """
    
    def __init__(self):
        self.clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    
    def process_and_assess(self, img: np.ndarray) -> PhotoQualityReport:
        """
        Main pipeline: assess quality + enhance image
        
        Args:
            img: RGB image array
        
        Returns:
            PhotoQualityReport with score, issues, and enhanced image
        """
        logger.info("Starting photo quality assessment")
        
        score = 100
        issues = []
        warnings = []
        enhanced = img.copy()
        
        # 1. Blur detection
        if self._is_blurry(img):
            score -= PhotoQuality.BLUR_PENALTY
            issues.append("📸 Photo is blurry - try holding phone steady")
            logger.warning("Blurry image detected")
        
        # 2. Glare detection & correction
        if self._has_glare(img):
            score -= PhotoQuality.GLARE_PENALTY
            warnings.append("✨ Glare detected - reducing brightness peaks")
            enhanced = self._reduce_glare(enhanced)
            logger.info("Glare detected and corrected")
        
        # 3. Exposure assessment & correction
        exposure_status = self._check_exposure(img)
        
        if exposure_status == 'underexposed':
            score -= PhotoQuality.EXPOSURE_PENALTY
            warnings.append("💡 Image is dark - brightening automatically")
            enhanced = self._enhance_exposure(enhanced)
            logger.info("Underexposure corrected")
        
        elif exposure_status == 'overexposed':
            score -= PhotoQuality.EXPOSURE_PENALTY
            warnings.append("☀️ Image is too bright - reducing exposure")
            enhanced = self._reduce_exposure(enhanced)
            logger.info("Overexposure corrected")
        
        # 4. Color cast detection (beyond white balance)
        if self._has_severe_color_cast(img):
            score -= PhotoQuality.COLOR_CAST_PENALTY
            warnings.append("🎨 Strong colour cast detected")
            logger.warning("Severe color cast detected")
        
        # 5. Determine quality level
        if score >= 80:
            quality_level = 'Excellent'
        elif score >= 60:
            quality_level = 'Good'
        elif score >= 40:
            quality_level = 'Fair'
        else:
            quality_level = 'Poor'
            issues.append("⚠️ Photo quality is poor - results may be inaccurate")
        
        can_process = score >= 40  # Minimum viable quality
        
        logger.info(f"Photo quality score: {score}/100 ({quality_level})")
        
        return PhotoQualityReport(
            score=score,
            quality_level=quality_level,
            can_process=can_process,
            issues=issues,
            warnings=warnings,
            enhanced_image=enhanced
        )
    
    def _is_blurry(self, img: np.ndarray) -> bool:
        """
        Detect blur using Laplacian variance method
        Lower variance = more blur
        """
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        
        is_blurry = laplacian_var < PhotoQuality.BLUR_THRESHOLD
        
        logger.debug(f"Blur check: Laplacian variance = {laplacian_var:.2f}, "
                    f"threshold = {PhotoQuality.BLUR_THRESHOLD}, "
                    f"blurry = {is_blurry}")
        
        return is_blurry
    
    def _has_glare(self, img: np.ndarray) -> bool:
        """
        Detect glare from reflective surfaces (metallics, varnish)
        Checks for blown-out highlights
        """
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        bright_pixels = np.sum(gray > PhotoQuality.GLARE_BRIGHTNESS)
        total_pixels = gray.size
        bright_ratio = bright_pixels / total_pixels
        
        has_glare = bright_ratio > PhotoQuality.GLARE_THRESHOLD
        
        logger.debug(f"Glare check: {bright_ratio*100:.2f}% bright pixels, "
                    f"threshold = {PhotoQuality.GLARE_THRESHOLD*100:.2f}%")
        
        return has_glare
    
    def _reduce_glare(self, img: np.ndarray) -> np.ndarray:
        """
        Reduce glare while preserving detail
        Uses adaptive histogram equalization in LAB space
        """
        # Convert to LAB for luminance-specific processing
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        # Apply CLAHE to L channel only
        l_equalized = self.clahe.apply(l)
        
        # Merge and convert back
        lab_equalized = cv2.merge([l_equalized, a, b])
        result = cv2.cvtColor(lab_equalized, cv2.COLOR_LAB2RGB)
        
        logger.debug("Glare reduction applied via CLAHE")
        
        return result
    
    def _check_exposure(self, img: np.ndarray) -> str:
        """
        Check if image is properly exposed
        Returns: 'normal', 'underexposed', or 'overexposed'
        """
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        avg_brightness = np.mean(gray)
        
        logger.debug(f"Average brightness: {avg_brightness:.2f}")
        
        if avg_brightness < PhotoQuality.UNDEREXPOSED_THRESHOLD:
            return 'underexposed'
        elif avg_brightness > PhotoQuality.OVEREXPOSED_THRESHOLD:
            return 'overexposed'
        else:
            return 'normal'
    
    def _enhance_exposure(self, img: np.ndarray) -> np.ndarray:
        """
        Brighten underexposed images
        Uses gamma correction to preserve highlights
        """
        gamma = 1.5  # Brightening factor
        inv_gamma = 1.0 / gamma
        table = np.array([((i / 255.0) ** inv_gamma) * 255 
                         for i in range(256)]).astype("uint8")
        
        result = cv2.LUT(img, table)
        
        logger.debug(f"Exposure enhanced with gamma={gamma}")
        
        return result
    
    def _reduce_exposure(self, img: np.ndarray) -> np.ndarray:
        """
        Darken overexposed images
        """
        gamma = 0.7  # Darkening factor
        inv_gamma = 1.0 / gamma
        table = np.array([((i / 255.0) ** inv_gamma) * 255 
                         for i in range(256)]).astype("uint8")
        
        result = cv2.LUT(img, table)
        
        logger.debug(f"Exposure reduced with gamma={gamma}")
        
        return result
    
    def _has_severe_color_cast(self, img: np.ndarray) -> bool:
        """
        Detect severe color casts beyond normal white balance
        Checks deviation in LAB a/b channels
        """
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        a_channel = lab[:, :, 1]
        b_channel = lab[:, :, 2]
        
        # Calculate deviation from neutral (128)
        a_deviation = abs(np.mean(a_channel) - 128)
        b_deviation = abs(np.mean(b_channel) - 128)
        
        max_deviation = max(a_deviation, b_deviation)
        
        has_cast = max_deviation > PhotoQuality.COLOR_CAST_THRESHOLD
        
        logger.debug(f"Color cast check: max deviation = {max_deviation:.2f}, "
                    f"threshold = {PhotoQuality.COLOR_CAST_THRESHOLD}")
        
        return has_cast
    
    def generate_quality_feedback_ui(self, report: PhotoQualityReport) -> Dict:
        """
        Generate user-friendly feedback for Streamlit UI
        
        Returns:
            Dict with emoji, color, and message for UI display
        """
        if report.quality_level == 'Excellent':
            return {
                'emoji': '✅',
                'colour': 'green',
                'message': f'Photo Quality: Excellent ({report.score}/100)',
                'show_details': False
            }
        elif report.quality_level == 'Good':
            return {
                'emoji': '👍',
                'colour': 'blue',
                'message': f'Photo Quality: Good ({report.score}/100)',
                'show_details': len(report.warnings) > 0
            }
        elif report.quality_level == 'Fair':
            return {
                'emoji': '⚠️',
                'colour': 'orange',
                'message': f'Photo Quality: Fair ({report.score}/100)',
                'show_details': True
            }
        else:
            return {
                'emoji': '❌',
                'colour': 'red',
                'message': f'Photo Quality: Poor ({report.score}/100)',
                'show_details': True
            }