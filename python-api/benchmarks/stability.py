"""Stability of real, *unlabelled* photographs.

Cannot score top-1. Measures whether LSB / JPEG / −0.3 EV change the card
list — the property O-C15 and O-B3 claim. Fails as a confirmation if card
count and family multiset are identical under those perturbations.

C1.1 adds two things `n_unstable` could not give:

  * A GRADED per-image×variant scalar. `n_unstable` is saturated at 5 of 5
    — all fifteen image×perturbation cells already read "changed" — so it
    cannot fall, and a commit that halves the instability would score
    identically to one that does nothing. The graded scalar is the multiset
    Jaccard distance of the card families plus the L1 distance between the
    two per-family coverage distributions, so a partial improvement shows up
    as a partial fall.
  * SILHOUETTE RETENTION — analysed pixels ÷ alpha pixels, the direct O-C8
    measurement and the number C3.1 is judged on.
"""

from __future__ import annotations

import os
from collections import Counter
from typing import Any

import cv2
import numpy as np
from PIL import Image

from benchmarks.engine_load import get_engine
from benchmarks.linear import linear_to_srgb, srgb_to_linear
from config import BaseDetection
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
        # Served recipe dicts carry coverage as `dominance`
        # (`schemestealer_engine.py:485`). The original `percentage`/`coverage`
        # lookup matched no key and silently yielded 0.0 for every card — which
        # nothing consumed until C1.1's L1 term, whose first run came back
        # 0.00 across all fifteen cells. `_signature` and `n_unstable` never
        # read coverage, so correcting the key moves no pre-existing number.
        cov = r.get("dominance")
        if cov is None:
            cov = r.get("percentage") or r.get("coverage") or 0.0
        out.append({
            "family": str(fam).lower(),
            "coverage": float(cov),
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


# --------------------------------------------------------------------------
# Graded instability (C1.1). Two components, reported separately and summed.
# --------------------------------------------------------------------------

# Coverage is renormalised to sum to 100 over the served cards (O-C13), so the
# L1 distance between two per-family coverage distributions is bounded at 200
# (disjoint support). Dividing by that bound puts both components on [0, 1]
# with 1.0 = "nothing in common", which is where the 200 comes from — it is a
# derived normaliser, not a tuned constant. Both components stay in the JSON
# so the weighting can be revisited without re-running the bench.
_COVERAGE_L1_MAX_PP = 200.0


def _family_jaccard(a: list[dict], b: list[dict]) -> float:
    """Jaccard distance of the card-family MULTISETS: 0.0 identical, 1.0 disjoint.

    Multiset, not set, because "one Blue card" and "two Blue cards" is exactly
    the O-C5 ramp-split failure and a plain set cannot see it.

    What would make this non-zero on an identical pair: nothing — it is 0.0 by
    construction when the two family multisets are equal, which is the same
    condition `family_set_changed` already tests. It differs from that boolean
    by being graded in between.
    """
    ca = Counter(c["family"] for c in a)
    cb = Counter(c["family"] for c in b)
    union = sum((ca | cb).values())
    if union == 0:
        return 0.0
    return 1.0 - sum((ca & cb).values()) / union


def _family_coverage(cards: list[dict]) -> dict[str, float]:
    """Total coverage per family (a family may hold several cards)."""
    out: dict[str, float] = {}
    for c in cards:
        out[c["family"]] = out.get(c["family"], 0.0) + float(c["coverage"])
    return out


def _coverage_l1(a: list[dict], b: list[dict]) -> float:
    """L1 distance in coverage points between the two per-family distributions.

    Taken over the UNION of families with a missing family counted as 0, not
    over the matched families only: a family that vanishes entirely is the
    largest coverage change available and would contribute exactly zero to a
    matched-only L1. Because coverage renormalises to 100 over whatever
    survives (O-C13), the vanished family's mass provably reappears elsewhere,
    so the union form prices both halves of that move.

    Summed over a SORTED family list: Python randomises string hashing per
    process, so an unsorted set iteration would vary the float addition order
    between runs and the metric could not be a gate.
    """
    pa = _family_coverage(a)
    pb = _family_coverage(b)
    return sum(abs(pa.get(f, 0.0) - pb.get(f, 0.0))
               for f in sorted(set(pa) | set(pb)))


def _graded(base: list[dict], variant: list[dict]) -> dict[str, float]:
    jac = _family_jaccard(base, variant)
    l1 = _coverage_l1(base, variant)
    return {
        "family_jaccard": round(jac, 6),
        "coverage_l1_pp": round(l1, 4),
        "instability": round(jac + l1 / _COVERAGE_L1_MAX_PP, 6),
    }


class _RetentionProbe:
    """Wraps the engine's own `BaseDetector` and records what it kept.

    Deliberately NOT a replication of `schemestealer_engine.py:242-270`
    (crop to the alpha bbox → resize to 300 px → detect). A replica would
    silently diverge the moment C3.0 inserts `exif_transpose` ahead of it,
    and the retention number would then be measured on an array production
    never sees. This observes the production call instead, so it stays exact
    across every later commit in the plan.

    The denominator is the detector's OWN step-1 mask (`alpha > ALPHA_THRESHOLD`,
    `base_detector.py:48`), so the ratio is precisely "of the silhouette the
    detector started with, how much survived".
    """

    def __init__(self, inner):
        self._inner = inner
        self.last: tuple[int, int] | None = None

    def detect_base_region(self, img_rgba, alpha_threshold=None):
        mask = self._inner.detect_base_region(img_rgba, alpha_threshold)
        thr = BaseDetection.ALPHA_THRESHOLD if alpha_threshold is None else alpha_threshold
        self.last = (int(np.count_nonzero(mask)),
                     int(np.count_nonzero(img_rgba[:, :, 3] > thr)))
        return mask

    def __getattr__(self, name):
        return getattr(self._inner, name)


def run_stability() -> dict[str, Any]:
    engine = get_engine()
    real_detector = engine.base_detector
    probe = _RetentionProbe(real_detector)
    engine.base_detector = probe
    try:
        return _run_stability(engine, probe)
    finally:
        engine.base_detector = real_detector


def _run_stability(engine, probe: _RetentionProbe) -> dict[str, Any]:
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
        # Reset before the base pass: analyze_miniature can return early
        # (quality veto, empty alpha) without ever reaching the detector, and a
        # stale reading from the previous image would be silently wrong.
        probe.last = None
        base = _cards(engine, rgb, alpha, use_awb=True)
        retention = probe.last
        variants = {
            "lsb_plus1": _cards(engine, _lsb(rgb, 1), alpha, use_awb=True),
            "jpeg85": _cards(engine, _jpeg(rgb, 85), alpha, use_awb=True),
            "ev_minus_0_3": _cards(engine, _ev(rgb, -0.3), alpha, use_awb=True),
        }
        base_sig = _signature(base)
        row = {
            "image": name,
            "base_n": base_sig[0],
            "base_families": list(base_sig[1]),
            "variants": {
                k: {
                    "n": _signature(v)[0],
                    "families": list(_signature(v)[1]),
                    "card_count_changed": _signature(v)[0] != base_sig[0],
                    "family_set_changed": _signature(v)[1] != base_sig[1],
                    **_graded(base, v),
                }
                for k, v in variants.items()
            },
        }
        row["instability"] = round(
            sum(v["instability"] for v in row["variants"].values()), 6)
        # Guard against the L1 term going silently vacuous. Coverage is
        # renormalised to 100 over the served cards (O-C13), so anything far
        # from 100 means the coverage key moved again and every `coverage_l1_pp`
        # in this run is meaningless — surfaced, not swallowed.
        row["base_coverage_total"] = round(
            sum(c["coverage"] for c in base), 3)
        if retention is not None:
            kept, alpha_px = retention
            row["analysed_px"] = kept
            row["alpha_px"] = alpha_px
            row["retention_pct"] = (round(100.0 * kept / alpha_px, 3)
                                    if alpha_px else None)
        results.append(row)
    n_ok = [r for r in results if "error" not in r]
    flips = 0
    for r in n_ok:
        if any(v["card_count_changed"] or v["family_set_changed"] for v in r["variants"].values()):
            flips += 1
    retentions = [r["retention_pct"] for r in n_ok
                  if r.get("retention_pct") is not None]
    return {
        "images": results,
        "n": len(n_ok),
        # Kept as a headline. NOT a gate: saturated at 5 of 5 since the harness
        # was written, so it cannot fall and cannot fail a commit.
        "n_unstable": flips,
        # The gate. Sum over every image×variant cell; lower is more stable.
        "instability_total": round(sum(r["instability"] for r in n_ok), 6),
        "retention_min_pct": min(retentions) if retentions else None,
        "retention_max_pct": max(retentions) if retentions else None,
    }
