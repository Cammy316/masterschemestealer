"""Planted-LAB scenes through the live extractor.

Tests whether a known paint region is recovered as one card of the right
family. Shading ramps are the O-C5 case. Does *not* run the plinth HSV
path — that is O-C8 and would eat neutrals by colour.
"""

from __future__ import annotations

from typing import Any

import cv2
import numpy as np

from benchmarks.engine_load import get_engine
from benchmarks.linear import linear_to_srgb, srgb_to_linear
from core.color_engine import classify_family
from core.colour_maths import lab_to_rgb
from config import ColorDetection


def _lab_to_bgr_u8(lab) -> np.ndarray:
    rgb = np.clip(lab_to_rgb(lab), 0, 255).astype(np.uint8)
    return rgb[::-1]


def _paint_block(engine, name_substr: str):
    hits = [p for p in engine.paint_db
            if name_substr.lower() in (p.name or "").lower() and not p.metallic]
    if not hits:
        raise RuntimeError(f"no paint matching {name_substr!r}")
    return hits[0]


def _resize_like_engine(rgb: np.ndarray, alpha: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    coords = cv2.findNonZero(alpha)
    x, y, w, h = cv2.boundingRect(coords)
    crop_rgb = rgb[y:y + h, x:x + w]
    crop_a = alpha[y:y + h, x:x + w]
    new_w = ColorDetection.RESIZE_WIDTH
    new_h = int(new_w * (h / w))
    return (
        cv2.resize(crop_rgb, (new_w, new_h), interpolation=cv2.INTER_LINEAR),
        cv2.resize(crop_a, (new_w, new_h), interpolation=cv2.INTER_LINEAR),
    )


def _shade_ramp(rgb_u8: np.ndarray, y0: int, y1: int, x0: int, x1: int) -> None:
    """Vertical 4:1 linear-light ramp — the physical ratio O-C5 re-measured."""
    h = y1 - y0
    lin = srgb_to_linear(rgb_u8[y0:y1, x0:x1].astype(float) / 255.0)
    scale = np.linspace(1.0, 0.25, h, dtype=float).reshape(h, 1, 1)
    rgb_u8[y0:y1, x0:x1] = np.clip(linear_to_srgb(lin * scale) * 255.0, 0, 255).astype(np.uint8)


def _extract(engine, rgb_bgr: np.ndarray, alpha: np.ndarray) -> list[dict]:
    resized, a = _resize_like_engine(rgb_bgr, alpha)
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    mask = a >= 128
    return engine.smart_extractor.extract_colors(rgb, mask)


def run_synthetic_extract() -> dict[str, Any]:
    engine = get_engine()
    blue = _paint_block(engine, "Macragge Blue")
    red = _paint_block(engine, "Mephiston Red")
    gold = next(
        (p for p in engine.paint_db
         if p.metallic and (p.color_family or "").lower() == "gold"),
        None,
    )
    bone = _paint_block(engine, "Ushabti Bone")

    scenes: list[dict[str, Any]] = []

    def _blank() -> tuple[np.ndarray, np.ndarray]:
        img = np.zeros((400, 400, 3), dtype=np.uint8)
        img[:] = (32, 32, 32)
        alpha = np.zeros((400, 400), dtype=np.uint8)
        return img, alpha

    # Scene 1: two flat regions, no ramp.
    img, alpha = _blank()
    img[40:200, 40:200] = _lab_to_bgr_u8(blue.lab)
    img[40:200, 220:360] = _lab_to_bgr_u8(red.lab)
    alpha[40:200, 40:360] = 255
    clusters = _extract(engine, img, alpha)
    planted = {
        classify_family(blue.lab): blue,
        classify_family(red.lab): red,
    }
    scenes.append(_score_scene("flat_two_paints", clusters, planted))

    # Scene 2: one paint with a 4:1 shading ramp (O-C5).
    img, alpha = _blank()
    img[40:360, 80:320] = _lab_to_bgr_u8(blue.lab)
    _shade_ramp(img, 40, 360, 80, 320)
    alpha[40:360, 80:320] = 255
    clusters = _extract(engine, img, alpha)
    scenes.append(_score_scene("blue_ramp_4to1", clusters, {classify_family(blue.lab): blue}))

    # Scene 3: gold + bone, metallic planted but extractor classifies chromatically (D9).
    if gold is not None:
        img, alpha = _blank()
        img[60:200, 60:200] = _lab_to_bgr_u8(gold.lab)
        img[60:200, 220:360] = _lab_to_bgr_u8(bone.lab)
        alpha[60:200, 60:360] = 255
        clusters = _extract(engine, img, alpha)
        scenes.append(_score_scene(
            "gold_and_bone",
            clusters,
            {
                classify_family(gold.lab, is_metallic=False): gold,
                classify_family(bone.lab): bone,
            },
        ))

    return {"scenes": scenes}


def _score_scene(name: str, clusters: list[dict], planted: dict) -> dict[str, Any]:
    recovered = []
    for c in clusters:
        lab = c.get("median_lab")
        if lab is None:
            lab = c.get("lab")
        fam = (c.get("family") or classify_family(lab)).lower() if lab is not None else "?"
        recovered.append({
            "family": fam,
            "coverage": float(c.get("percentage") or c.get("coverage") or 0.0),
            "lab": [float(x) for x in lab] if lab is not None else None,
        })
    families = [r["family"] for r in recovered]
    splits = {fam: families.count(fam) for fam in planted}
    hits = {fam: splits.get(fam, 0) >= 1 for fam in planted}
    return {
        "name": name,
        "planted_families": list(planted),
        "recovered": recovered,
        "family_hit": hits,
        "same_family_card_count": splits,
        "split_same_family": any(n > 1 for n in splits.values()),
    }
