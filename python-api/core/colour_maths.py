"""
Shared colour-science helpers used across the matching and analysis pipeline.

Metric policy (Phase 2 of the colour-science overhaul):
  * OKLab Euclidean is the GEOMETRY metric — clustering, merging, nearest-
    anchor classification and candidate retrieval. It is a proper metric
    (triangle inequality holds), perceptually uniform, and cheap.
  * CIEDE2000 is the REPORTING metric — final small-distance ranking and the
    user-facing ΔE badge. It was fitted on JND-scale pairs and is only
    trustworthy there.
"""

import numpy as np
from typing import List
from skimage.color import deltaE_ciede2000, lab2rgb, lab2xyz, rgb2lab, xyz2lab


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


def lab_to_rgb(lab) -> np.ndarray:
    """CIELAB (D65) → sRGB 0-255 float triple via skimage (gamut-clipped).

    The inverse companion of rgb_to_lab, so a cluster can keep ONE colour
    representative (LAB) and derive its display RGB from it instead of
    maintaining two independent statistics (F3 fix).
    """
    lab_arr = np.asarray(lab, dtype=float).reshape(1, 1, 3)
    rgb = lab2rgb(lab_arr)[0][0]
    return np.clip(rgb, 0.0, 1.0) * 255.0


# Björn Ottosson's OKLab matrices (XYZ D65 → LMS, LMS' → OKLab). The XYZ path
# (rather than linear sRGB) keeps slightly out-of-sRGB measured paint colours
# convertible without gamut clipping.
_XYZ_TO_LMS = np.array([
    [0.8189330101, 0.3618667424, -0.1288597137],
    [0.0329845436, 0.9293118715, 0.0361456387],
    [0.0482003018, 0.2643662691, 0.6338517070],
])
_LMS_TO_OKLAB = np.array([
    [0.2104542553, 0.7936177850, -0.0040720468],
    [1.9779984951, -2.4285922050, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.8086757660],
])


def lab_to_oklab(lab: np.ndarray) -> np.ndarray:
    """CIELAB (D65) → OKLab. Accepts a single (3,) triple or an (N, 3) array;
    returns the same shape. OKLab L is in [0, 1]."""
    arr = np.asarray(lab, dtype=float)
    single = arr.ndim == 1
    xyz = lab2xyz(arr.reshape(1, -1, 3)).reshape(-1, 3)
    lms = xyz @ _XYZ_TO_LMS.T
    lms_p = np.cbrt(lms)          # sign-preserving cube root
    ok = lms_p @ _LMS_TO_OKLAB.T
    return ok[0] if single else ok


def oklab_to_lab(oklab: np.ndarray) -> np.ndarray:
    """OKLab → CIELAB (D65) — exact inverse of lab_to_oklab. Accepts a single
    (3,) triple or an (N, 3) array; returns the same shape."""
    arr = np.asarray(oklab, dtype=float)
    single = arr.ndim == 1
    lms_p = arr.reshape(-1, 3) @ np.linalg.inv(_LMS_TO_OKLAB).T
    lms = lms_p ** 3
    xyz = lms @ np.linalg.inv(_XYZ_TO_LMS).T
    lab = xyz2lab(xyz.reshape(1, -1, 3)).reshape(-1, 3)
    return lab[0] if single else lab


def rgb_to_oklab(rgb) -> np.ndarray:
    """sRGB (0-255 triple or (N, 3) array) → OKLab via the canonical
    rgb→lab→oklab chain, so there is exactly ONE path into OKLab."""
    arr = np.asarray(rgb, dtype=float)
    single = arr.ndim == 1
    lab = rgb2lab((arr.reshape(1, -1, 3)) / 255.0).reshape(-1, 3)
    ok = lab_to_oklab(lab)
    return ok[0] if single else ok


def oklab_distance(ok1: np.ndarray, ok2: np.ndarray) -> np.ndarray:
    """Euclidean distance in OKLab — the geometry metric. Broadcasts:
    (3,) vs (3,) → scalar; (3,) vs (N,3) → (N,)."""
    diff = np.asarray(ok1, dtype=float) - np.asarray(ok2, dtype=float)
    return np.linalg.norm(diff, axis=-1)


# ---------------------------------------------------------------------------
# CAM16-UCS (Phase 6a) — minimal forward transform under FIXED viewing
# conditions: D65 white, adapting luminance L_A = 64 cd/m², background
# Y_b = 20, "average" surround (c=0.69, N_c=1.0, F=1.0). A colour appearance
# model needs viewing-condition parameters a phone photo cannot supply, so we
# hold them at these standard defaults — CAM16-UCS then acts as a static
# uniform colour space whose Euclidean distance is the appearance-grade
# difference metric for FINAL ranking. Constants and formulation follow Li et
# al. (2017) / CIE 248:2022; validated against colour-science 0.4.7 reference
# values in tests/test_cam16.py.
# ---------------------------------------------------------------------------

_CAM16_M16 = np.array([
    [0.401288, 0.650173, -0.051461],
    [-0.250268, 1.204414, 0.045854],
    [-0.002079, 0.048952, 0.953127],
])
# skimage's D65 white (the same white every LAB in this codebase is defined
# against) — using any other D65 variant would silently shift J at the top.
_CAM16_XYZ_W = np.array([95.047, 100.0, 108.883])   # D65, Y=100
_CAM16_LA = 64.0
_CAM16_YB = 20.0
_CAM16_C = 0.69       # average surround
_CAM16_NC = 1.0
_CAM16_F = 1.0


def _cam16_constants():
    """Viewing-condition-derived constants (computed once)."""
    rgb_w = _CAM16_M16 @ _CAM16_XYZ_W
    d = _CAM16_F * (1.0 - (1.0 / 3.6) * np.exp((-_CAM16_LA - 42.0) / 92.0))
    d = float(np.clip(d, 0.0, 1.0))
    d_rgb = d * _CAM16_XYZ_W[1] / rgb_w + 1.0 - d

    k = 1.0 / (5.0 * _CAM16_LA + 1.0)
    f_l = (0.2 * k ** 4 * 5.0 * _CAM16_LA
           + 0.1 * (1.0 - k ** 4) ** 2 * (5.0 * _CAM16_LA) ** (1.0 / 3.0))

    n = _CAM16_YB / _CAM16_XYZ_W[1]
    z = 1.48 + np.sqrt(n)
    n_bb = 0.725 * n ** -0.2

    def adapt(rgb):
        x = (f_l * np.abs(rgb) / 100.0) ** 0.42
        return np.sign(rgb) * 400.0 * x / (x + 27.13) + 0.1

    rgb_aw = adapt(d_rgb * rgb_w)
    a_w = (2.0 * rgb_aw[0] + rgb_aw[1] + rgb_aw[2] / 20.0 - 0.305) * n_bb
    return d_rgb, f_l, n, z, n_bb, a_w, adapt


_CAM16_CONST = _cam16_constants()


def lab_to_cam16ucs(lab: np.ndarray) -> np.ndarray:
    """CIELAB (D65) → CAM16-UCS (J', a', b') under the fixed viewing
    conditions above. Accepts a (3,) triple or (N, 3) array; returns the same
    shape. Euclidean distance in the returned space is the CAM16-UCS colour
    difference."""
    d_rgb, f_l, n, z, n_bb, a_w, adapt = _CAM16_CONST

    arr = np.asarray(lab, dtype=float)
    single = arr.ndim == 1
    xyz = lab2xyz(arr.reshape(1, -1, 3)).reshape(-1, 3) * 100.0

    rgb_a = adapt((xyz @ _CAM16_M16.T) * d_rgb)
    r_a, g_a, b_a = rgb_a[:, 0], rgb_a[:, 1], rgb_a[:, 2]

    a_resp = (2.0 * r_a + g_a + b_a / 20.0 - 0.305) * n_bb
    big_j = 100.0 * np.clip(a_resp / a_w, 0.0, None) ** (_CAM16_C * z)

    a_comp = r_a - 12.0 * g_a / 11.0 + b_a / 11.0
    b_comp = (r_a + g_a - 2.0 * b_a) / 9.0
    h_rad = np.arctan2(b_comp, a_comp)

    e_t = 0.25 * (np.cos(h_rad + 2.0) + 3.8)
    denom = r_a + g_a + 21.0 * b_a / 20.0
    t = ((50000.0 / 13.0) * _CAM16_NC * n_bb * e_t
         * np.hypot(a_comp, b_comp) / np.where(denom == 0.0, 1e-9, denom))
    big_c = (np.clip(t, 0.0, None) ** 0.9 * np.sqrt(big_j / 100.0)
             * (1.64 - 0.29 ** n) ** 0.73)
    big_m = big_c * f_l ** 0.25

    j_ucs = 1.7 * big_j / (1.0 + 0.007 * big_j)
    m_ucs = np.log(1.0 + 0.0228 * big_m) / 0.0228
    out = np.column_stack([j_ucs, m_ucs * np.cos(h_rad), m_ucs * np.sin(h_rad)])
    return out[0] if single else out


def cam16ucs_distance(ucs1: np.ndarray, ucs2: np.ndarray) -> np.ndarray:
    """Euclidean distance in CAM16-UCS — the appearance-grade difference.
    Broadcasts like oklab_distance."""
    diff = np.asarray(ucs1, dtype=float) - np.asarray(ucs2, dtype=float)
    return np.linalg.norm(diff, axis=-1)


def circular_mean_hue(hues_01: np.ndarray) -> float:
    """Circular mean of hue values in [0, 1).  Returns hue in [0, 1).

    np.mean fails at the 0/360° boundary: a red cluster spanning 350°–10°
    would average to ~180° (cyan).  This converts to unit-circle vectors
    first so the wrap-around is handled correctly.
    """
    angles = hues_01 * 2 * np.pi
    mean_angle = np.arctan2(np.sin(angles).mean(), np.cos(angles).mean())
    return (mean_angle / (2 * np.pi)) % 1.0
