"""
Task 5 — validate the canonical hue_family classifier against the measured
swatches' independent reference family labels.

The measured data carries an expert family label per paint (some carry 2+ at a
boundary). That is exactly the labelled ground truth the harness said it lacked.
This is a REPORT, not a hard gate: high agreement is strong validation of the
Prompt 1.3 classifier; specific families disagreeing is a tuning signal for Cam
to review (and a future ML training-label source). Boundaries are NOT auto-tuned
from this.

The reference taxonomy is finer (ochre/tan/ultramarine/teal-green/…) than the
coarse canonical families, so each reference label maps to the SET of canonical
families it can legitimately fall in; a paint passes if hue_family() lands in the
union of its labels' sets (multi-label tolerant).

Run:  python tests/test_family_against_reference.py
"""
from __future__ import annotations

import json
import os
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

from core.color_engine import compute_color_family  # noqa: E402

MEASURED_PATH = os.path.join(ROOT, "data", "measured_swatches_by_id.json")

# Fine reference family -> set of acceptable coarse canonical families.
# Metals map onto their hue neighbours too, because compute_color_family() runs
# the matte hue classifier (it never emits a metal family).
REF_TO_CANONICAL: dict[str, set[str]] = {
    "yellow": {"yellow", "bone"},
    "orange": {"orange", "brown", "red"},
    "ochre": {"yellow", "orange", "brown", "bone"},
    "tan": {"brown", "bone", "orange", "yellow"},
    "red": {"red", "orange", "brown"},
    "magenta": {"magenta", "pink", "purple", "red"},
    "pink-purple": {"pink", "purple", "magenta"},
    "blue-grey": {"blue", "grey", "cyan"},
    "lilac": {"purple", "pink", "blue", "magenta"},
    "blue": {"blue", "cyan"},
    "grey": {"grey", "white", "black"},
    "ultramarine": {"blue", "purple"},
    "sea-blue": {"blue", "cyan"},
    "turquoise": {"cyan", "green", "blue"},
    "warm-grey": {"grey", "brown", "bone"},
    "teal-green": {"cyan", "green", "blue"},
    "green": {"green", "cyan"},
    "army-green": {"green", "brown", "yellow"},
    "olive-green": {"green", "brown", "yellow", "bone"},
    "brown": {"brown", "orange", "red", "bone"},
    "bone": {"bone", "white", "grey", "yellow"},
    "rosy-flesh": {"pink", "bone", "brown", "orange", "red"},
    "golden-flesh": {"bone", "brown", "orange", "yellow"},
    "black": {"black", "grey"},
    "silver": {"silver", "grey", "white"},
    "gold": {"gold", "yellow", "brown", "bone"},
    "bronze-copper": {"bronze", "brown", "orange", "red"},
}


def build_report() -> dict:
    meas = json.load(open(MEASURED_PATH, encoding="utf-8"))["paints"]

    total = 0
    agree = 0
    unknown_ref = set()
    per_ref = defaultdict(lambda: [0, 0])  # ref_family -> [agree, total]
    disagreements: list[tuple] = []

    for rec in meas.values():
        refs = rec.get("reference_families") or []
        if not refs:
            continue
        canonical = compute_color_family(rec["measured_hex"], "matte")

        acceptable: set[str] = set()
        for r in refs:
            if r in REF_TO_CANONICAL:
                acceptable |= REF_TO_CANONICAL[r]
            else:
                unknown_ref.add(r)

        passed = canonical in acceptable
        total += 1
        agree += int(passed)
        primary = refs[0]
        per_ref[primary][1] += 1
        per_ref[primary][0] += int(passed)
        if not passed and len(refs) == 1:  # single-label genuine disagreement
            disagreements.append((rec["paint_id"], primary, canonical, rec["measured_hex"]))

    return {
        "total": total, "agree": agree,
        "per_ref": per_ref, "disagreements": disagreements,
        "unknown_ref": unknown_ref,
    }


def print_report() -> dict:
    rep = build_report()
    rate = rep["agree"] / rep["total"] if rep["total"] else 0.0
    print("=== hue_family vs reference-family agreement ===")
    print(f"  overall: {rep['agree']}/{rep['total']}  ({rate:.1%})")
    print("  per reference family (primary label):")
    for ref in sorted(rep["per_ref"]):
        a, t = rep["per_ref"][ref]
        print(f"     {ref:16s} {a:3d}/{t:3d}  ({(a/t if t else 0):.0%})")
    genuine = rep["disagreements"]
    print(f"\n  single-label disagreements (tuning signals): {len(genuine)}")
    for pid, ref, canon, hexv in sorted(genuine, key=lambda x: x[1])[:40]:
        print(f"     {hexv}  {pid:34s} ref={ref:14s} -> hue_family={canon}")
    if len(genuine) > 40:
        print(f"     ... and {len(genuine) - 40} more")
    if rep["unknown_ref"]:
        print(f"\n  NOTE unmapped reference labels: {sorted(rep['unknown_ref'])}")
    return rep


def test_family_agreement_report():
    """Report-only validation (no hard gate). A very loose floor guards against a
    classifier regression that breaks the mapping wholesale."""
    rep = build_report()
    rate = rep["agree"] / rep["total"] if rep["total"] else 0.0
    assert rate > 0.40, f"family agreement collapsed to {rate:.1%} — investigate"


if __name__ == "__main__":
    print_report()
