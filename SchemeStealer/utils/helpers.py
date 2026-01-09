"""
Utility helper functions
"""

import cv2
import numpy as np
from typing import Tuple
import urllib.parse
from config import Affiliate

def apply_white_balance(img: np.ndarray) -> np.ndarray:
    """
    Apply LAB-based auto white balance
    Corrects color casts (especially yellow indoor lighting)
    """
    result = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    avg_a = np.average(result[:, :, 1])
    avg_b = np.average(result[:, :, 2])
    
    result[:, :, 1] = result[:, :, 1] - ((avg_a - 128) * (result[:, :, 0] / 255.0) * 1.1)
    result[:, :, 2] = result[:, :, 2] - ((avg_b - 128) * (result[:, :, 0] / 255.0) * 1.1)
    
    return cv2.cvtColor(result, cv2.COLOR_LAB2RGB)


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


def calculate_color_distance_rgb(color1: np.ndarray, color2: np.ndarray) -> float:
    """
    Simple Euclidean distance in RGB space
    Used for quick similarity checks
    """
    return np.linalg.norm(color1 - color2)


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