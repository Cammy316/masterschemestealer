"""sRGB EOTF helpers. Mixing must happen in linear light (audit A3)."""

from __future__ import annotations

import numpy as np


def srgb_to_linear(srgb: np.ndarray) -> np.ndarray:
    x = np.clip(np.asarray(srgb, dtype=float), 0.0, 1.0)
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(lin: np.ndarray) -> np.ndarray:
    x = np.clip(np.asarray(lin, dtype=float), 0.0, 1.0)
    return np.where(x <= 0.0031308, 12.92 * x, 1.055 * np.power(x, 1.0 / 2.4) - 0.055)
