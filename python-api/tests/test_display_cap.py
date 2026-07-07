"""
Display-cap protection tests (production fix).

Production failure: the scanner shows the top five colours sorted majors-
first by coverage. A manufactured dark near-neutral card ("Brown" #50383f,
5.6%) outranked the vivid yellow beak (~3%) and evicted it from the display —
the user saw a dull shadow blob instead of a real painted detail.

The rule under test: a vivid card may not be displaced by a dull DARK card
of minor coverage. Genuine dark majors (black armour at 20-50%) are above
the coverage bound and are never touched.

conftest.py stubs cv2 unless USE_REAL_CV2 is set; the helper is pure list
logic and runs under either.
"""

import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.miniature_scanner import _protect_vivid_details  # noqa: E402


def _card(family: str, lab, pct: float) -> dict:
    return {
        "family": family,
        "lab": [float(v) for v in lab],
        "percentage": float(pct),
        "hex": "#000000",
    }


def test_vivid_detail_displaces_dull_dark_minor():
    """The exact production palette: the dark 'Brown' shadow card (L 26,
    chroma 12, 5.6%) must yield its display slot to the vivid yellow beak
    (chroma ~55, 3.2%)."""
    colors = [
        _card("Pink", (60.0, 35.0, 5.0), 49.5),
        _card("Magenta", (45.0, 40.0, -5.0), 28.0),
        _card("White", (85.0, 2.0, 2.0), 6.7),
        _card("Cyan", (65.0, -20.0, -15.0), 6.4),
        _card("Brown", (26.4, 11.9, -0.1), 5.6),   # manufactured shadow card
        _card("Yellow", (70.0, 5.0, 55.0), 3.2),   # the beak
    ]
    kept = _protect_vivid_details(colors, limit=5)

    families = [c["family"] for c in kept]
    assert len(kept) == 5
    assert "Yellow" in families, f"vivid detail evicted: {families}"
    assert "Brown" not in families, f"dull dark minor kept over vivid: {families}"
    # The dominant ordering of the survivors is untouched.
    assert families[:4] == ["Pink", "Magenta", "White", "Cyan"]


def test_genuine_dark_major_is_never_displaced():
    """Black armour at 35% is a real painted surface — the swap rule's
    coverage bound must protect it even when a vivid card is dropped."""
    colors = [
        _card("Black", (22.0, 2.0, 1.0), 35.0),
        _card("Red", (40.0, 45.0, 25.0), 25.0),
        _card("Grey", (55.0, 1.0, 0.0), 15.0),
        _card("Bone", (78.0, 4.0, 14.0), 10.0),
        _card("Silver", (60.0, 1.0, 2.0), 8.0),
        _card("Yellow", (70.0, 5.0, 55.0), 2.0),
    ]
    kept = _protect_vivid_details(colors, limit=5)
    families = [c["family"] for c in kept]
    assert "Black" in families, "genuine dark major displaced by the swap rule"


def test_no_dropped_vivid_leaves_order_unchanged():
    colors = [
        _card("Pink", (60.0, 35.0, 5.0), 50.0),
        _card("Blue", (40.0, 5.0, -40.0), 20.0),
        _card("Grey", (50.0, 1.0, 0.0), 15.0),
    ]
    assert _protect_vivid_details(list(colors), limit=5) == colors


def test_weakest_dull_dark_card_yields_first():
    """With two qualifying dull dark minors, the lower-coverage one is
    swapped out first (deterministic, coverage-ordered)."""
    colors = [
        _card("Pink", (60.0, 35.0, 5.0), 40.0),
        _card("Magenta", (45.0, 40.0, -5.0), 25.0),
        _card("White", (85.0, 2.0, 2.0), 10.0),
        _card("Brown", (28.0, 12.0, 0.0), 7.0),    # dull dark minor (stronger)
        _card("Grey", (24.0, 3.0, 1.0), 4.0),      # dull dark minor (weaker)
        _card("Yellow", (70.0, 5.0, 55.0), 3.0),   # one vivid dropped
    ]
    kept = _protect_vivid_details(colors, limit=5)
    families = [c["family"] for c in kept]
    assert "Yellow" in families
    assert "Grey" not in families, f"expected the weaker dull card to yield: {families}"
    assert "Brown" in families


def test_chroma_is_read_from_lab():
    """The helper derives vividness from the card's own lab — sanity-pin the
    maths so threshold edits in config keep meaning what they say."""
    vivid = _card("Yellow", (70.0, 5.0, 55.0), 3.0)
    a, b = vivid["lab"][1], vivid["lab"][2]
    assert math.hypot(a, b) > 30.0
