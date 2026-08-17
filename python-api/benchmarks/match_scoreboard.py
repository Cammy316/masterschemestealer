"""Matcher-only scoreboard.

Scores ``PaintMatcher.match_color`` on the live DB. Detection is not involved.

Scoring rule (MERGED): for translucent paints, rank against the *achieved*
colour over a bone primer in linear sRGB, not the stored swatch LAB. Opaque
paints (opacity_rating 3) are unchanged.
"""

from __future__ import annotations

from collections import Counter, defaultdict
from typing import Any

import numpy as np

from benchmarks.engine_load import get_engine
from benchmarks.linear import linear_to_srgb, srgb_to_linear
from core.color_engine import classify_family
from core.colour_maths import ciede2000_single, lab_to_rgb, rgb_to_lab
from config import Affiliate


_DUMMY_RGB = np.array([128.0, 128.0, 128.0])


def _opacity_rating(paint) -> float:
    raw = paint.opacity
    if raw is None:
        return 3.0
    return float(raw)


def _achieved_lab(paint_lab, primer_lab, opacity_rating: float) -> np.ndarray:
    """Approximate a layer over primer. t = opacity/3. Linear sRGB mix.

    This is *not* Kubelka–Munk. It exists so translucent records are not
    scored as if they were opaque swatches (the distinction that killed
    O-D2 / O-D3). Fails as a claim if we treat t=0 the same as t=1.
    """
    t = float(np.clip(opacity_rating / 3.0, 0.0, 1.0))
    if t >= 1.0:
        return np.asarray(paint_lab, dtype=float)
    paint_lin = srgb_to_linear(np.asarray(lab_to_rgb(paint_lab), dtype=float) / 255.0)
    primer_lin = srgb_to_linear(np.asarray(lab_to_rgb(primer_lab), dtype=float) / 255.0)
    mixed = t * paint_lin + (1.0 - t) * primer_lin
    return np.asarray(rgb_to_lab(linear_to_srgb(mixed) * 255.0), dtype=float)


def _pick_primer(paints) -> Any:
    for needle in ("wraithbone", "grey seer", "off-white"):
        for p in paints:
            if needle in (p.name or "").lower() and not p.metallic:
                return p
    whites = [p for p in paints
              if (p.color_family or "").lower() in {"white", "bone"} and not p.metallic]
    if not whites:
        raise RuntimeError("no primer candidate in the paint DB")
    return max(whites, key=lambda p: float(p.lab[0]))


def _match(matcher, lab, brand: str, family: str, metallic: bool):
    return matcher.match_color(
        _DUMMY_RGB,
        brand=brand,
        role="dominant",
        target_lab=np.asarray(lab, dtype=float),
        target_family=family,
        context={"is_metallic": metallic},
    )


def _top3_ids(matcher, lab, brand: str, family: str) -> list[str]:
    pairs = matcher.match_top_n(
        np.asarray(lab, dtype=float),
        brand=brand,
        role="dominant",
        n=3,
        target_family=family,
    )
    return [p.paint_id for p, _de in pairs]


def run_match_scoreboard() -> dict[str, Any]:
    engine = get_engine()
    matcher = engine.matcher
    brands = list(Affiliate.SUPPORTED_BRANDS)
    primer = _pick_primer(engine.paint_db)
    primer_lab = np.asarray(primer.lab, dtype=float)

    rows: list[dict[str, Any]] = []
    confusion: dict[str, Counter] = defaultdict(Counter)
    self_hits = []
    self_top3 = []
    opaque_self = []
    deltas: list[float] = []
    cross_deltas: list[float] = []
    silver_as_matte = {"n": 0, "self": 0, "grey_win": 0}
    grey_as_metal = {"n": 0, "silver_win": 0}
    contrast_vs_base = {"n": 0, "winner_is_base": 0, "winner_is_translucent": 0}

    for paint in engine.paint_db:
        if not paint.matchable or paint.lab is None:
            continue
        brand = paint.brand
        if brand not in brands:
            continue
        opacity = _opacity_rating(paint)
        target = _achieved_lab(paint.lab, primer_lab, opacity)
        family = classify_family(target, is_metallic=bool(paint.metallic))
        winner = _match(matcher, target, brand, family, bool(paint.metallic))
        de = (ciede2000_single(target, winner.lab) if winner is not None else None)

        row = {
            "paint_id": paint.paint_id,
            "brand": brand,
            "family": family,
            "winner_id": None if winner is None else winner.paint_id,
            "winner_family": None if winner is None else (winner.color_family or "").lower(),
            "delta_e": de,
            "self_hit": bool(winner is not None and winner.paint_id == paint.paint_id),
            "metallic": bool(paint.metallic),
            "category": (paint.type or "").lower(),
            "opacity_rating": opacity,
            "achieved": opacity < 3.0,
        }
        rows.append(row)
        if winner is not None:
            confusion[family][row["winner_family"]] += 1
            if de is not None:
                deltas.append(float(de))
        if (paint.type or "").lower() in {"base", "layer", "air"}:
            self_hits.append(row["self_hit"])
            top3 = _top3_ids(matcher, target, brand, family)
            self_top3.append(paint.paint_id in top3)
            if opacity >= 3.0 and not paint.metallic:
                opaque_self.append(row["self_hit"])

        if paint.metallic and (paint.color_family or "").lower() == "silver":
            silver_as_matte["n"] += 1
            matte_win = _match(matcher, target, brand, family, False)
            if matte_win is not None and matte_win.paint_id == paint.paint_id:
                silver_as_matte["self"] += 1
            if matte_win is not None and (matte_win.color_family or "").lower() == "grey":
                silver_as_matte["grey_win"] += 1

        if (not paint.metallic) and family == "grey" and (paint.type or "").lower() in {"base", "layer"}:
            grey_as_metal["n"] += 1
            met_win = _match(matcher, target, brand, "grey", True)
            if met_win is not None and (met_win.color_family or "").lower() == "silver":
                grey_as_metal["silver_win"] += 1

        if opacity <= 1.0 and (paint.type or "").lower() in {"base", "layer", "contrast", "ink", "wash"}:
            contrast_vs_base["n"] += 1
            if winner is not None:
                wcat = (winner.type or "").lower()
                if wcat in {"base", "layer"} and _opacity_rating(winner) >= 2.0:
                    contrast_vs_base["winner_is_base"] += 1
                if _opacity_rating(winner) <= 1.0:
                    contrast_vs_base["winner_is_translucent"] += 1

        for other in brands:
            if other == brand:
                continue
            other_win = _match(matcher, target, other, family, bool(paint.metallic))
            if other_win is not None:
                cross_deltas.append(ciede2000_single(target, other_win.lab))

    def _pct(xs: list[bool]) -> float | None:
        return None if not xs else round(100.0 * sum(xs) / len(xs), 2)

    def _pctile(xs: list[float], q: float) -> float | None:
        if not xs:
            return None
        return round(float(np.percentile(np.asarray(xs, dtype=float), q)), 3)

    by_brand: dict[str, dict[str, Any]] = {}
    by_family: dict[str, dict[str, Any]] = {}
    for key_fn, sink in ((lambda r: r["brand"], by_brand), (lambda r: r["family"], by_family)):
        groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
        for r in rows:
            groups[key_fn(r)].append(r)
        for key, grp in groups.items():
            des = [r["delta_e"] for r in grp if r["delta_e"] is not None]
            sink[key] = {
                "n": len(grp),
                "self_hit_pct": _pct([r["self_hit"] for r in grp]),
                "median_de": _pctile(des, 50),
                "p90_de": _pctile(des, 90),
            }

    return {
        "primer": {"paint_id": primer.paint_id, "name": primer.name, "lab": primer_lab.tolist()},
        "n_scored": len(rows),
        "top1_self_pct": _pct(self_hits),
        "top3_self_pct": _pct(self_top3),
        "opaque_matte_top1_self_pct": _pct(opaque_self),
        "opaque_matte_n": len(opaque_self),
        "median_de": _pctile(deltas, 50),
        "p90_de": _pctile(deltas, 90),
        "cross_brand_median_de": _pctile(cross_deltas, 50),
        "cross_brand_p90_de": _pctile(cross_deltas, 90),
        "by_brand": by_brand,
        "by_family": by_family,
        "family_confusion": {src: dict(dst) for src, dst in confusion.items()},
        "silver_vs_grey": silver_as_matte,
        "grey_as_metallic": grey_as_metal,
        "contrast_vs_base": contrast_vs_base,
        "honest_empty": sum(1 for r in rows if r["winner_id"] is None),
    }
