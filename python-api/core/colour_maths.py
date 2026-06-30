"""
Shared colour-science helpers used across the matching and analysis pipeline.
"""

import numpy as np
from typing import List
from skimage.color import deltaE_ciede2000, rgb2lab


def ciede2000_single(lab1, lab2) -> float:
    """CIEDE2000 distance between two LAB triples.

    Accepts any array-like of length 3.  Uses the (1, 1, 3) image-shaped
    broadcasting that skimage.color.deltaE_ciede2000 expects.
    """
    a = np.asarray(lab1, dtype=float).reshape(1, 1, 3)
    b = np.asarray(lab2, dtype=float).reshape(1, 1, 3)
    return float(deltaE_ciede2000(a, b)[0, 0])


def rgb_to_lab(rgb) -> List[float]:
    """sRGB (a 0-255 r,g,b triple) → CIELAB (D65) via skimage. The single home for
    this conversion so the scanners and recipe builder can't drift (M-7)."""
    rgb_norm = np.asarray(rgb, dtype=float) / 255.0
    lab = rgb2lab(np.array([[rgb_norm]]))[0][0]
    return [float(lab[0]), float(lab[1]), float(lab[2])]


def circular_mean_hue(hues_01: np.ndarray) -> float:
    """Circular mean of hue values in [0, 1).  Returns hue in [0, 1).

    np.mean fails at the 0/360° boundary: a red cluster spanning 350°–10°
    would average to ~180° (cyan).  This converts to unit-circle vectors
    first so the wrap-around is handled correctly.
    """
    angles = hues_01 * 2 * np.pi
    mean_angle = np.arctan2(np.sin(angles).mean(), np.cos(angles).mean())
    return (mean_angle / (2 * np.pi)) % 1.0
