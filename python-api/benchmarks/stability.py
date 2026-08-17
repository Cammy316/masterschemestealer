"""Stability of real, *unlabelled* photographs.

Cannot score top-1. Measures whether LSB / JPEG / −0.3 EV change the card
list — the property O-C15 and O-B3 claim. Fails as a confirmation if card
count and family multiset are identical under those perturbations.
"""

from __future__ import annotations

import os
from typing import Any

import cv2
import numpy as np
from PIL import Image

from benchmarks.engine_load import get_engine
from benchmarks.linear import linear_to_srgb, srgb_to_linear
from core.color_engine import classify_family


_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
_TESTIMAGES = os.path.join(_REPO_ROOT, "Testimages")
_REAL = (
    "complex.PNG",
    "ultra.jpg",
    "pinkhorror2.webp",
    "capturepink.PNG",
    "Example.jpg",
)


def _matte_rgb(path: str) -> tuple[np.ndarray, np.ndarray]:
    """RGB + alpha. White-corner flood fill when the file has no alpha."""
    pil = Image.open(path)
    arr = np.array(pil.convert("RGBA"))
    rgb = arr[:, :, :3]
    alpha = arr[:, :, 3]
    if float(alpha.mean()) > 250:
        # Unmatted photo: treat near-white corners as backdrop.
        h, w = alpha.shape
        seed = rgb[2, 2].astype(int)
        if seed.min() > 200:
            diff = np.abs(rgb.astype(int) - seed).sum(axis=2)
            alpha = np.where(diff < 40, 0, 255).astype(np.uint8)
            # Keep a filled interior so small holes do not punch the silhouette.
            mask = (alpha == 0).astype(np.uint8)
            flood = mask.copy()
            ff = np.zeros((h + 2, w + 2), dtype=np.uint8)
            cv2.floodFill(flood, ff, (2, 2), 2)
            alpha = np.where(flood == 2, 0, 255).astype(np.uint8)
    return rgb, alpha


def _cards(engine, rgb: np.ndarray, alpha: np.ndarray, use_awb: bool) -> list[dict]:
    rgba = np.dstack([rgb, alpha])
    recipes, _overlay, _quality = engine.analyze_miniature(
        rgb.copy(),
        mode="mini",
        remove_base=True,
        use_awb=use_awb,
        precomputed_rgba=rgba,
    )
    out = []
    for r in recipes or []:
        lab = r.get("lab")
        fam = (r.get("family") or r.get("heuristic_family") or "")
        if not fam and lab is not None:
            fam = classify_family(lab)
        out.append({
            "family": str(fam).lower(),
            "coverage": float(r.get("percentage") or r.get("coverage") or 0.0),
        })
    return out


def _lsb(rgb: np.ndarray, delta: int) -> np.ndarray:
    return np.clip(rgb.astype(np.int16) + delta, 0, 255).astype(np.uint8)


def _jpeg(rgb: np.ndarray, quality: int = 85) -> np.ndarray:
    ok, buf = cv2.imencode(".jpg", cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR),
                           [int(cv2.IMWRITE_JPEG_QUALITY), quality])
    if not ok:
        return rgb
    return cv2.cvtColor(cv2.imdecode(buf, cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)


def _ev(rgb: np.ndarray, stops: float) -> np.ndarray:
    lin = srgb_to_linear(rgb.astype(float) / 255.0)
    return np.clip(linear_to_srgb(lin * (2.0 ** stops)) * 255.0, 0, 255).astype(np.uint8)


def _signature(cards: list[dict]) -> tuple[int, tuple[str, ...]]:
    families = tuple(sorted(c["family"] for c in cards))
    return (len(cards), families)


def run_stability() -> dict[str, Any]:
    engine = get_engine()
    results = []
    for name in _REAL:
        path = os.path.join(_TESTIMAGES, name)
        if not os.path.isfile(path):
            results.append({"image": name, "error": "missing"})
            continue
        rgb, alpha = _matte_rgb(path)
        # Downscale large photos so four passes stay inside a request budget.
        h, w = rgb.shape[:2]
        if max(h, w) > 1024:
            scale = 1024 / max(h, w)
            rgb = cv2.resize(rgb, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
            alpha = cv2.resize(alpha, (rgb.shape[1], rgb.shape[0]), interpolation=cv2.INTER_NEAREST)
        base = _cards(engine, rgb, alpha, use_awb=True)
        variants = {
            "lsb_plus1": _cards(engine, _lsb(rgb, 1), alpha, use_awb=True),
            "jpeg85": _cards(engine, _jpeg(rgb, 85), alpha, use_awb=True),
            "ev_minus_0_3": _cards(engine, _ev(rgb, -0.3), alpha, use_awb=True),
        }
        base_sig = _signature(base)
        results.append({
            "image": name,
            "base_n": base_sig[0],
            "base_families": list(base_sig[1]),
            "variants": {
                k: {
                    "n": _signature(v)[0],
                    "families": list(_signature(v)[1]),
                    "card_count_changed": _signature(v)[0] != base_sig[0],
                    "family_set_changed": _signature(v)[1] != base_sig[1],
                }
                for k, v in variants.items()
            },
        })
    n_ok = [r for r in results if "error" not in r]
    flips = 0
    for r in n_ok:
        if any(v["card_count_changed"] or v["family_set_changed"] for v in r["variants"].values()):
            flips += 1
    return {
        "images": results,
        "n": len(n_ok),
        "n_unstable": flips,
    }
