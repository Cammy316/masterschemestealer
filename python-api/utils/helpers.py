"""
Utility helper functions
"""

import cv2
import numpy as np
from typing import Tuple
import urllib.parse
from config import Affiliate

# --- CAT16 white balance (Phase 6b) -----------------------------------------
# CAT16 chromatic-adaptation matrix (Li et al. 2017) and sRGB D65 matrices —
# the same primaries/white skimage uses, so the AWB and the LAB pipeline agree.
_CAT16_M16 = np.array([
    [0.401288, 0.650173, -0.051461],
    [-0.250268, 1.204414, 0.045854],
    [-0.002079, 0.048952, 0.953127],
])
_RGB_TO_XYZ = np.array([
    [0.412453, 0.357580, 0.180423],
    [0.212671, 0.715160, 0.072169],
    [0.019334, 0.119193, 0.950227],
])
_XYZ_TO_RGB = np.linalg.inv(_RGB_TO_XYZ)
_XYZ_D65 = np.array([0.95047, 1.0, 1.08883])

# Degree of adaptation (partial — full-strength correction is unbounded harm
# when the estimate is wrong), neutral-pixel qualification, and the minimum
# neutral evidence below which the image is returned untouched. The spread is
# judged on GAMMA-ENCODED values: gamma compresses channel ratios, so a grey
# under a realistic cast still qualifies as neutral evidence, while saturated
# paint does not.
_AWB_DEGREE = 0.7
_AWB_NEUTRAL_SPREAD = 0.40
_AWB_MIN_NEUTRAL_FRACTION = 0.02


def _srgb_to_linear(x: np.ndarray) -> np.ndarray:
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def _linear_to_srgb(x: np.ndarray) -> np.ndarray:
    x = np.clip(x, 0.0, 1.0)
    return np.where(x <= 0.0031308, 12.92 * x, 1.055 * x ** (1 / 2.4) - 0.055)


def apply_white_balance(img_rgb: np.ndarray,
                        alpha_mask: np.ndarray = None,
                        p: int = 6) -> np.ndarray:
    """Grey-pixel white balance with CAT16 partial adaptation (Phase 6b).

    The illuminant is estimated (Minkowski mean, norm `p`) from NEAR-NEUTRAL
    pixels only — primer, bases, metallics, desaturated shadows. Estimating
    from all pixels (classic shades-of-grey) reads a miniature's deliberately
    non-neutral paint palette as a colour cast and "corrects" it away:
    measured on synthetic paint scenes, the old full-strength corrector
    injected ~10 ΔE00 of error even on clean photos. When an image offers no
    neutral evidence (< 2% qualifying pixels) it is returned untouched —
    no estimate is better than a wrong one.

    The correction itself is a CAT16 chromatic adaptation toward D65 in
    LINEAR light (per-channel gains in gamma-encoded RGB are not a valid von
    Kries transform), at partial strength D=0.7 so a wrong estimate has
    bounded cost. Validated in tests/test_awb.py.

    img_rgb   – uint8 HxWx3 RGB array.
    alpha_mask – optional uint8 or bool HxW mask; when provided (e.g. for
                 miniature scans where the background was already removed),
                 the illuminant is estimated only over non-transparent pixels
                 (alpha >= 128) but the correction is applied to the whole image.
    p         – Minkowski norm (default 6).
    """
    img = img_rgb.astype(np.float64) / 255.0
    lin = _srgb_to_linear(img)
    flat = lin.reshape(-1, 3)

    candidates = np.ones(len(flat), dtype=bool)
    if alpha_mask is not None and alpha_mask.shape == img_rgb.shape[:2]:
        opaque = (alpha_mask.reshape(-1) >= 128)
        if opaque.sum() >= 100:
            candidates = opaque

    # Near-neutral pixels: small relative channel spread (in gamma-encoded
    # values — see note above), not near-black.
    flat_gamma = img.reshape(-1, 3)
    mx_g = flat_gamma.max(axis=1)
    spread = np.where(mx_g > 1e-6,
                      (mx_g - flat_gamma.min(axis=1)) / np.maximum(mx_g, 1e-6),
                      1.0)
    mx = flat.max(axis=1)
    neutral = candidates & (spread < _AWB_NEUTRAL_SPREAD) & (mx > 0.03)
    if neutral.sum() < _AWB_MIN_NEUTRAL_FRACTION * max(candidates.sum(), 1):
        return img_rgb.copy()

    illum = np.power(np.mean(np.power(flat[neutral], p), axis=0), 1.0 / p)
    illum = np.clip(illum, 1e-6, None)

    xyz_src = _RGB_TO_XYZ @ illum
    xyz_src /= max(xyz_src[1], 1e-6)
    lms_src = _CAT16_M16 @ xyz_src
    lms_dst = _CAT16_M16 @ _XYZ_D65
    gains = (_AWB_DEGREE * (lms_dst / np.clip(lms_src, 1e-6, None))
             + (1.0 - _AWB_DEGREE))

    lms = (flat @ _RGB_TO_XYZ.T @ _CAT16_M16.T) * gains
    lin_c = np.clip((lms @ np.linalg.inv(_CAT16_M16).T) @ _XYZ_TO_RGB.T, 0.0, 1.0)
    out = _linear_to_srgb(lin_c).reshape(img.shape)
    return (out * 255.0).astype(np.uint8)


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