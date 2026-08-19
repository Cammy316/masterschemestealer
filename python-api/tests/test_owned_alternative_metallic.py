"""
DEC-5 / O-D4 — a matte target must not be offered a metallic owned alternative.

WHY THIS MATTERS.

`match_color` already refuses to serve a metallic paint for a target the scan
has not flagged metallic (`color_engine.py`, `role not in ('shade','wash') and
not flagged_metallic`). The science half of O-D5 is the reason: metallics are
gonio-apparent — their appearance flops with viewing angle — so a single diffuse
LAB is not commensurable with a matte target's. The exclusion is correct colour
science, not a preference.

The owned-alternative lookup bypassed it. `_find_owned_alt` goes through
`match_top_n`, which by design has no ceiling, no transparency penalty and no
metallic logic, so a user who owns the wrong metal was told to substitute it
into a matte slot.

MEASURED 2026-08-19 over the live DB: 43 of 1,077 matte base-role paints
(3.99%) admit a metallic owned alternative within ΔE00 6.0 — reproducing
MERGED's O-D4 figure exactly. Preserve the finder's wording: that is an
EXPOSURE CEILING conditioned on the user owning that metallic, not an incidence
rate. The sharpest case is Citadel **Corax White** (family grey), whose nearest
candidate of any kind is **Stormhost Silver at ΔE00 2.28, rank 1 of 20** — a
matte off-white armour told to use a silver.

WHERE THE FILTER GOES, and why not in `match_top_n`.

The plan's stated reason for "call site only" is wrong and the conclusion is
still right. It says `match_top_n` is "shared with `routes/forge.py`"; verified
2026-08-19, `routes/forge.py` never references `PaintMatcher` at all — it is the
rack-analysis endpoint and uses its own `_ciede2000_single` over
`get_opaque_paints()`. `match_top_n` has exactly ONE production caller,
`schemestealer_engine._find_owned_alt`. The thing that must be protected is
`scripts/build_conversions.py`, which generates the SEO conversion pages: a user
searching for a Leadbelcher equivalent SHOULD be shown metals, and filtering
`match_top_n` itself would silently strip metallic conversions from 1,326
generated pages.

Filtering the RETURNED list rather than the pool costs nothing here: over all
1,077 matte targets, the post-filtered top-20 prefix is identical to a
pool-filtered one in 1,077 of 1,077 cases (0 differences), so no owned
alternative is lost to truncation.
"""

import sys
from pathlib import Path

import pytest

_PY_API = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_PY_API))

from benchmarks.engine_load import get_engine  # noqa: E402
from core.color_engine import flagged_metallic_for  # noqa: E402


@pytest.fixture(scope="module")
def engine():
    return get_engine()


def _paint(engine, brand, name):
    for p in engine.paint_db:
        if p.brand == brand and p.name == name:
            return p
    raise AssertionError(f"{brand} {name} not in the DB")


# ---------------------------------------------------------------------------
# The finding itself
# ---------------------------------------------------------------------------

def test_matte_target_is_not_offered_an_owned_metallic(engine):
    """Citadel Corax White is a matte grey. Its nearest candidate of any kind is
    Stormhost Silver at ΔE00 2.28. A user who owns that silver must NOT be told
    to substitute it.

    FAILS IF: the exclusion is removed from `_find_owned_alt`. Fails before this
    commit — the call returns Stormhost Silver.
    """
    target = _paint(engine, "Citadel", "Corax White")
    silver = _paint(engine, "Citadel", "Stormhost Silver")
    assert silver.metallic, "fixture precondition: Stormhost Silver is metallic"

    alt = engine._find_owned_alt(
        target, "Citadel", "dominant", (target.color_family or "").lower(),
        inventory={silver.paint_id},
        context=None,          # the scan did not flag this cluster metallic
    )

    assert alt is None, (
        f"a matte grey target was offered the metallic {alt['name']!r} as an "
        "owned alternative"
    )


def test_a_flagged_metallic_target_is_still_offered_the_metal(engine):
    """The counterpart guard. When the scan HAS flagged the cluster metallic,
    the metal is a legitimate substitute and must still be offered — this is a
    filter conditioned on the target, not a blanket ban.

    FAILS IF: the exclusion is unconditional, i.e. `context` is ignored and
    metals are dropped for every target. That is the most likely over-application
    of this commit and it would break genuine metal-to-metal substitution.
    """
    target = _paint(engine, "Citadel", "Corax White")
    silver = _paint(engine, "Citadel", "Stormhost Silver")

    alt = engine._find_owned_alt(
        target, "Citadel", "dominant", (target.color_family or "").lower(),
        inventory={silver.paint_id},
        context={"is_metallic": True},
    )

    assert alt is not None, "a flagged-metallic target lost its metallic alternative"
    assert alt["name"] == "Stormhost Silver"


def test_an_owned_matte_alternative_still_comes_through(engine):
    """The filter must not break the feature. An owned MATTE paint near a matte
    target is exactly what the owned-alternative lookup exists to surface.

    FAILS IF: the filter drops every candidate rather than the metallic ones —
    e.g. inverting the predicate. Without this, a bug that returns None for
    everything would pass the two tests above.
    """
    target = _paint(engine, "Citadel", "Corax White")
    # Nearest matte in-family Citadel candidate, whatever it is.
    cands = engine.matcher.match_top_n(
        target.lab, "Citadel", role="dominant",
        target_family=(target.color_family or "").lower(), n=20)
    matte = next(c for c, _d in cands
                 if not c.metallic and c.paint_id != target.paint_id)

    alt = engine._find_owned_alt(
        target, "Citadel", "dominant", (target.color_family or "").lower(),
        inventory={matte.paint_id},
        context=None,
    )

    assert alt is not None, "an owned matte alternative was filtered out too"
    assert alt["name"] == matte.name


# ---------------------------------------------------------------------------
# The conversion pages must keep their metals
# ---------------------------------------------------------------------------

def test_match_top_n_itself_still_returns_metallics(engine):
    """`scripts/build_conversions.py:132` calls `match_top_n` to generate the
    SEO conversion pages. Someone searching for a Leadbelcher equivalent SHOULD
    be shown metals, so the matcher primitive must stay unfiltered.

    FAILS IF: the metallic filter is pushed down into `match_top_n` instead of
    living at the owned-alternative call site — which would silently strip
    metallic conversions from 1,326 generated pages.
    """
    leadbelcher = _paint(engine, "Citadel", "Leadbelcher")
    assert leadbelcher.metallic

    matches = engine.matcher.match_top_n(
        leadbelcher.lab, "Vallejo", role="dominant", n=20)

    assert any(p.metallic for p, _d in matches), (
        "match_top_n stopped returning metallics — the conversion pages for "
        "metallic paints would lose their cross-brand equivalents"
    )


# ---------------------------------------------------------------------------
# The shared flag derivation
# ---------------------------------------------------------------------------

def test_the_metallic_flag_is_derived_in_one_place():
    """`match_color` and `_find_owned_alt` must read the scan's metallic flag
    the same way or they will drift. `flagged_metallic_for` is that one
    derivation; these cases pin its contract, including the shade/wash carve-out
    that is the reason it is per-role rather than per-cluster.

    FAILS IF: the shade/wash carve-out is dropped, the float `metallic_score`
    form stops being honoured, or the 0.5 threshold moves.
    """
    assert flagged_metallic_for("dominant", {"is_metallic": True}) is True
    assert flagged_metallic_for("dominant", {"is_metallic": False}) is False
    assert flagged_metallic_for("dominant", None) is False
    # Float score form, threshold at 0.5.
    assert flagged_metallic_for("dominant", {"metallic_score": 0.5}) is True
    assert flagged_metallic_for("dominant", {"metallic_score": 0.49}) is False
    # Shade and wash are family-keyed and never metallic-gated.
    assert flagged_metallic_for("shade", {"is_metallic": True}) is False
    assert flagged_metallic_for("wash", {"metallic_score": 1.0}) is False
