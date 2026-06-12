"""
Utility helper functions
"""

import cv2
import numpy as np
from typing import Tuple
import urllib.parse
from config import Affiliate

def apply_white_balance(img_rgb: np.ndarray,
                        alpha_mask: np.ndarray = None,
                        p: int = 6) -> np.ndarray:
    """Shades-of-Grey white balance (Finlayson & Trezzi, Minkowski norm p=6).

    img_rgb   – uint8 HxWx3 RGB array.
    alpha_mask – optional uint8 or bool HxW mask; when provided (e.g. for
                 miniature scans where the background was already removed),
                 the illuminant is estimated only over non-transparent pixels
                 (alpha >= 128) but the correction is applied to the whole image.
                 Both arrays must have the same spatial dimensions.
    p         – Minkowski norm (default 6 gives good results for hobby photos).
    """
    img = img_rgb.astype(np.float64) / 255.0
    flat = img.reshape(-1, 3)

    if alpha_mask is not None and alpha_mask.shape == img_rgb.shape[:2]:
        opaque = (alpha_mask.reshape(-1) >= 128)
        sample = flat[opaque]
        if len(sample) < 100:
            # Fall back to full image if almost no opaque pixels remain.
            sample = flat
    else:
        sample = flat

    # Estimate illuminant via Minkowski mean.
    illum = np.power(np.mean(np.power(sample, p), axis=0), 1.0 / p)
    # Normalise so neutral grey maps to grey (not white).
    illum = illum / (np.sqrt(np.sum(illum ** 2)) / np.sqrt(3.0))
    illum = np.clip(illum, 1e-6, None)

    corrected = np.clip(img / illum, 0.0, 1.0)
    return (corrected * 255.0).astype(np.uint8)


def increase_saturation(img: np.ndarray, scale: float = 1.3) -> np.ndarray:
    """
    Boost image saturation for visualization
    NOTE: This should ONLY be used for display, not color matching
    """
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV).astype("float32")
    h, s, v = cv2.split(hsv)
    s = np.clip(s * scale, 0, 255)
    hsv = cv2.merge([h, s, v])
    return cv2.cvtColor(hsv.astype("uint8"), cv2.COLOR_HSV2RGB)


def adjust_gamma(image: np.ndarray, gamma: float = 1.0) -> np.ndarray:
    """
    Apply gamma correction to image
    gamma < 1: brighten
    gamma > 1: darken
    """
    inv_gamma = 1.0 / gamma
    table = np.array([((i / 255.0) ** inv_gamma) * 255 
                     for i in np.arange(0, 256)]).astype("uint8")
    return cv2.LUT(image, table)


def compress_image_for_mobile(img: np.ndarray, max_width: int = 1200) -> np.ndarray:
    """
    Compress image for mobile bandwidth
    Reduces resolution while maintaining aspect ratio
    """
    height, width = img.shape[:2]
    
    if width > max_width:
        scale = max_width / width
        new_width = max_width
        new_height = int(height * scale)
        img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
    
    return img


def get_affiliate_link(brand: str, paint_name: str, region_key: str) -> str:
    """
    Generate affiliate link for paint purchase
    
    Args:
        brand: Paint brand (Citadel, Vallejo, etc.)
        paint_name: Name of paint
        region_key: Region from Affiliate.REGIONS
    
    Returns:
        Amazon affiliate URL
    """
    config = Affiliate.REGIONS[region_key]
    domain = config["domain"]
    tag = config["tag"]
    
    query = f"{brand} {paint_name} paint"
    encoded_query = urllib.parse.quote(query)
    
    return f"https://www.{domain}/s?k={encoded_query}&tag={tag}"


def calculate_color_distance_rgb(colour1: np.ndarray, colour2: np.ndarray) -> float:
    """
    Simple Euclidean distance in RGB space
    Used for quick similarity checks
    """
    return np.linalg.norm(colour1 - colour2)


def hex_to_rgb(hex_str: str) -> np.ndarray:
    """Convert hex color to RGB array (0-255)"""
    h = hex_str.lstrip('#')
    return np.array([int(h[i:i+2], 16) for i in (0, 2, 4)])


def rgb_to_hex(rgb: np.ndarray) -> str:
    """Convert RGB array (0-255) to hex string"""
    return '#{:02x}{:02x}{:02x}'.format(int(rgb[0]), int(rgb[1]), int(rgb[2]))


def format_paint_name(name: str) -> str:
    """
    Format paint name for display
    Removes brand prefixes, cleans up naming
    """
    # Remove common prefixes
    name = name.replace("Citadel ", "").replace("Vallejo ", "").replace("Army Painter ", "")
    return name.strip()