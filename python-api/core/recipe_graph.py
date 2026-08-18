"""
Recipe relationship graph.

Loads recipes.json (curated + algorithmic edges), validates every id against the
paint database (unknown ids are logged and skipped, never fatal), and resolves a
paint's highlight/shade/wash partner. Curated edges win over algorithmic ones.
"""

import json
import os
import logging
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Lower number = higher priority when multiple edges exist for (from_id, rel).
SOURCE_PRIORITY = {"citadel_official": 0, "manual": 1, "tutorial": 2, "algorithmic": 3}
# Edge sources that count as an "official" recipe relationship (vs computed).
OFFICIAL_SOURCES = {"citadel_official", "manual", "tutorial"}

_DEFAULT_RECIPES = os.path.join(os.path.dirname(os.path.dirname(__file__)), "recipes.json")

# The edge-selection tie-break. `score_edge` is the SAME scorer that ranked these
# edges when scripts/generate_algorithmic_edges.py wrote them (top-2 per key), so
# using it here restores the generator's own ordering rather than adding a second
# opinion. The Lab-scale ideal deltas remain the tie-break for relationships the
# geometry does not model (M-6: one source of truth, in recipe_geometry).
from core.recipe_geometry import IDEAL_DL_HIGHLIGHT, IDEAL_DL_SHADE, score_edge
_IDEAL_DL = {"highlight": IDEAL_DL_HIGHLIGHT, "shade": IDEAL_DL_SHADE}
# recipe_geometry models exactly these two; every other rel (notably `wash`) would
# be scored as a shade, against a darker reverse-rotated target it never aimed at.
_GEOMETRIC_RELS = frozenset({"highlight", "shade"})


@dataclass
class RecipeEdge:
    from_id: str
    to_id: str
    rel: str
    source: str
    confidence: float
    from_name: str = ""
    to_name: str = ""

    @property
    def kind(self) -> str:
        """'official' for curated edges, 'computed' for algorithmic ones."""
        return "official" if self.source in OFFICIAL_SOURCES else "computed"


class RecipeGraph:
    """Indexed lookup of recipe edges keyed on paint_id."""

    def __init__(self, paints_by_id: Dict[str, object], recipes_path: str = _DEFAULT_RECIPES):
        self._paints = paints_by_id  # paint_id -> Paint
        self._index: Dict[Tuple[str, str], List[RecipeEdge]] = {}
        self._load(recipes_path)

    def _load(self, path: str) -> None:
        if not os.path.exists(path):
            logger.warning("RecipeGraph: %s not found — running on no curated edges", path)
            return
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:  # noqa: BLE001 — never fatal
            logger.error("RecipeGraph: failed to read %s: %s", path, e)
            return

        loaded = skipped = 0
        for e in data.get("edges", []):
            fid, tid, rel = e.get("from_id"), e.get("to_id"), e.get("rel")
            if not fid or not tid or not rel:
                skipped += 1
                continue
            # Validate against the live paint DB; log + skip unknown ids.
            if fid not in self._paints or tid not in self._paints:
                logger.warning("RecipeGraph: skipping edge with unknown id(s): %s -> %s (%s)", fid, tid, rel)
                skipped += 1
                continue
            edge = RecipeEdge(
                from_id=fid, to_id=tid, rel=rel,
                source=e.get("source", "manual"),
                confidence=float(e.get("confidence", 0.5)),
                from_name=e.get("from", ""), to_name=e.get("to", ""),
            )
            self._index.setdefault((fid, rel), []).append(edge)
            loaded += 1

        logger.info("RecipeGraph: loaded %d edges (%d skipped) from %s", loaded, skipped, path)

    # ------------------------------------------------------------------
    def _best_edge(self, paint_id: str, rel: str) -> Optional[RecipeEdge]:
        edges = self._index.get((paint_id, rel))
        if not edges:
            return None

        from_paint = self._paints.get(paint_id)
        l_from = self._lightness(from_paint)
        ideal_dl = _IDEAL_DL.get(rel, 0.0)
        from_lab = getattr(from_paint, "lab", None) if from_paint is not None else None
        # One metric per key, never a mix: geometry for highlight/shade, the Lab
        # lightness error for anything else, with the same sentinel for missing data.
        geometric = rel in _GEOMETRIC_RELS and from_lab is not None

        def tie_break(edge: RecipeEdge) -> float:
            to_paint = self._paints.get(edge.to_id)
            if geometric:
                to_lab = getattr(to_paint, "lab", None) if to_paint is not None else None
                return score_edge(from_lab, to_lab, rel) if to_lab is not None else 9_999.0
            l_to = self._lightness(to_paint)
            return abs((l_to - l_from) - ideal_dl) if (l_from is not None and l_to is not None) else 9_999.0

        def sort_key(edge: RecipeEdge):
            # source priority, then higher confidence, then the geometric score
            # (OKLab distance to the hue-rotated, chroma-preserving target plus the
            # soft monotonicity hinge) — hue and chroma, which dL* alone cannot see.
            return (SOURCE_PRIORITY.get(edge.source, 99), -edge.confidence, tie_break(edge))

        return min(edges, key=sort_key)

    @staticmethod
    def _lightness(paint) -> Optional[float]:
        lab = getattr(paint, "lab", None) if paint is not None else None
        if lab is None:
            return None
        try:
            return float(lab[0])
        except (TypeError, IndexError):
            return None

    # ------------------------------------------------------------------
    def get_edge(self, paint, rel: str) -> Optional[RecipeEdge]:
        """The chosen edge (carries source/kind) for paint's relationship `rel`."""
        pid = getattr(paint, "paint_id", None)
        if not pid:
            return None
        return self._best_edge(pid, rel)

    def get(self, paint, rel: str):
        """The target Paint for paint's relationship `rel`, or None."""
        edge = self.get_edge(paint, rel)
        return self._paints.get(edge.to_id) if edge else None

    def edge_count(self) -> int:
        return sum(len(v) for v in self._index.values())
