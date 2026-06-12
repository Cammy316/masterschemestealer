"""
Shared colour-science helpers used across the matching and analysis pipeline.
"""

import numpy as np
from skimage.color import deltaE_ciede2000


def ciede2000_single(lab1, lab2) -> float:
    """CIEDE2000 distance between two LAB triples.

    Accepts any array-like of length 3.  Uses the (1, 1, 3) image-shaped
    broadcasting that skimage.color.deltaE_ciede2000 expects.
    """
    a = np.asarray(lab1, dtype=float).reshape(1, 1, 3)
    b = np.asarray(lab2, dtype=float).reshape(1, 1, 3)
    return float(deltaE_ciede2000(a, b)[0, 0])


def circular_mean_hue(hues_01: np.ndarray) -> float:
    """Circular mean of hue values in [0, 1).  Returns hue in [0, 1).

    np.mean fails at the 0/360° boundary: a red cluster spanning 350°–10°
    would average to ~180° (cyan).  This converts to unit-circle vectors
    first so the wrap-around is handled correctly.
    """
    angles = hues_01 * 2 * np.pi
    mean_angle = np.arctan2(np.sin(angles).mean(), np.cos(angles).mean())
    return (mean_angle / (2 * np.pi)) % 1.0
