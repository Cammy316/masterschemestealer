"""
Neutral display-label distinctness (production fix).

Production failure: the chaplain scan showed TWO cards labelled 'White'
(L* 98.7 heraldry and L* 77.1 trim) — indistinguishable on the results
screen. Root causes: (a) the subdivision gate keyed on the raw is_metallic
flag, which over-triggers on edge-dense armour, instead of on whether the
metallic display relabel actually won; (b) L* banding alone cannot
guarantee distinct labels when two cards fall in the same band.

The invariant under test: same-family neutral cards NEVER display identical
labels, and a metallic relabel ('Silver' etc.) is never overwritten.

Pure list logic — runs under the cv2 stub or real OpenCV alike.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.schemestealer_engine import _dedupe_neutral_display_labels  # noqa: E402


def _card(display: str, classifier: str, l_star: float) -> dict:
    return {'family': display, 'heuristic_family': classifier,
            'lab': [l_star, 0.5, 0.5]}


def test_same_band_whites_become_distinct():
    """The chaplain case: two White-family cards both banded 'White'
    (well, one should have been Off-White — but even two genuine L*>=85
    whites must come out distinct)."""
    bright = _card('White', 'White', 98.7)
    dimmer = _card('White', 'White', 88.0)
    _dedupe_neutral_display_labels([bright, dimmer])
    assert dimmer['family'] == 'Off-White', dimmer['family']
    assert bright['family'] == 'White', bright['family']


def test_same_band_greys_become_distinct_preserving_lightness_order():
    dark = _card('Grey', 'Grey', 40.0)
    light = _card('Grey', 'Grey', 50.0)
    _dedupe_neutral_display_labels([dark, light])
    labels = {dark['family'], light['family']}
    assert len(labels) == 2, f"labels still collide: {labels}"
    # The darker card must never carry the lighter label than its partner.
    order = ['Dark Grey', 'Grey', 'Light Grey']
    assert order.index(dark['family']) < order.index(light['family'])


def test_already_distinct_labels_are_untouched():
    a = _card('Dark Grey', 'Grey', 25.0)
    b = _card('Light Grey', 'Grey', 70.0)
    _dedupe_neutral_display_labels([a, b])
    assert a['family'] == 'Dark Grey' and b['family'] == 'Light Grey'


def test_singleton_neutral_keeps_its_plain_label():
    """A lone Grey card has nothing to be distinguished from — no spurious
    'Dark Grey' qualifier."""
    only = _card('Grey', 'Grey', 40.7)
    _dedupe_neutral_display_labels([only])
    assert only['family'] == 'Grey'


def test_metallic_relabel_is_never_overwritten():
    """A card whose metallic competition WON displays 'Silver' — it is not
    in the neutral band set and must not be dragged back to a grey label,
    nor counted when de-duplicating the remaining greys."""
    silver = _card('Silver', 'Grey', 55.0)
    grey_a = _card('Grey', 'Grey', 40.0)
    grey_b = _card('Grey', 'Grey', 48.0)
    _dedupe_neutral_display_labels([silver, grey_a, grey_b])
    assert silver['family'] == 'Silver'
    assert grey_a['family'] != grey_b['family']


def test_three_greys_fill_all_three_bands_in_order():
    cards = [_card('Grey', 'Grey', 45.0), _card('Grey', 'Grey', 50.0),
             _card('Grey', 'Grey', 55.0)]
    _dedupe_neutral_display_labels(cards)
    got = sorted(cards, key=lambda c: c['lab'][0])
    assert [c['family'] for c in got] == ['Dark Grey', 'Grey', 'Light Grey']
