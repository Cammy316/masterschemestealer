"""
SchemeStealer accuracy evaluation harness.

Usage:
    cd python-api
    python eval/run_eval.py [--fixtures eval/fixtures/labels.json]

For each fixture the appropriate scanner service is called directly (no HTTP).
Three metrics are reported per image and in aggregate:

  family_accuracy   – % of expected colour families found among detected families
  top3_paint_acc    – % of expected colours where any acceptable paint appears in
                      the top-3 matches for any brand of the corresponding cluster
  metallic_prec/rec – precision / recall for the optional 'metallic' flag
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any

# Make sure the python-api package root is on the path when running from any cwd.
_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_ROOT))

from PIL import Image


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _load_fixtures(labels_path: str) -> list[dict]:
    if not os.path.exists(labels_path):
        return []
    with open(labels_path, encoding="utf-8") as f:
        return json.load(f)


def _scan_image(image_path: str, mode: str) -> dict[str, Any]:
    """Run the appropriate scanner and return the raw result dict."""
    img = Image.open(image_path)

    if mode == "miniature":
        from services.miniature_scanner import MiniatureScannerService
        scanner = MiniatureScannerService()
        return scanner.scan(img)
    elif mode == "inspiration":
        from services.inspiration_scanner import InspirationScannerService
        scanner = InspirationScannerService()
        return scanner.scan(img)
    else:
        raise ValueError(f"Unknown mode: {mode!r}")


def _detected_families(scan_result: dict) -> list[str]:
    return [c.get("family", "").lower() for c in scan_result.get("colors", [])]


def _detected_top3_paints(scan_result: dict) -> list[set[str]]:
    """Per detected colour: set of paint names appearing in top-3 of any brand."""
    result = []
    for colour in scan_result.get("colors", []):
        names: set[str] = set()
        recipe = colour.get("paintRecipe", {})
        for brand_recipe in recipe.values():
            if isinstance(brand_recipe, dict):
                for slot in ("base", "highlight", "shade"):
                    paint = brand_recipe.get(slot)
                    if paint and paint.get("name"):
                        names.add(paint["name"].lower())
        result.append(names)
    return result


def _is_detected_metallic(colour: dict) -> bool:
    family = colour.get("family", "").lower()
    return any(kw in family for kw in ("gold", "silver", "metal", "bronze", "steel", "gunmetal", "copper"))


# ---------------------------------------------------------------------------
# Per-image evaluation
# ---------------------------------------------------------------------------

def evaluate_fixture(fixture: dict, fixture_dir: str) -> dict[str, Any]:
    image_path = os.path.join(fixture_dir, fixture["image"])
    if not os.path.exists(image_path):
        return {"error": f"Image not found: {image_path}"}

    mode = fixture.get("mode", "miniature")
    expected_colours = fixture.get("expected_colours", [])

    t0 = time.perf_counter()
    try:
        scan = _scan_image(image_path, mode)
    except Exception as exc:
        return {"error": str(exc)}
    elapsed_ms = (time.perf_counter() - t0) * 1000

    detected_families = _detected_families(scan)
    detected_top3 = _detected_top3_paints(scan)

    # Family accuracy: for each expected colour, was its family detected?
    family_hits = 0
    for exp in expected_colours:
        exp_fam = exp["family"].lower()
        if any(exp_fam in df or df in exp_fam for df in detected_families):
            family_hits += 1

    family_acc = family_hits / len(expected_colours) if expected_colours else 1.0

    # Top-3 paint accuracy: for each expected colour find the closest detected
    # cluster by family, then check if any acceptable paint is in its top-3.
    paint_hits = 0
    for exp in expected_colours:
        exp_fam = exp["family"].lower()
        acceptable = {a.lower() for a in exp.get("acceptable_paints", [])}
        if not acceptable:
            continue
        # Find best-matching detected cluster by family
        for i, df in enumerate(detected_families):
            if exp_fam in df or df in exp_fam:
                if i < len(detected_top3) and detected_top3[i] & acceptable:
                    paint_hits += 1
                break

    paint_acc = paint_hits / len(expected_colours) if expected_colours else 1.0

    # Metallic precision / recall
    expected_metallics = [e.get("metallic", False) for e in expected_colours]
    detected_metallic_flags = [_is_detected_metallic(c) for c in scan.get("colors", [])]

    tp = fp = fn = 0
    for exp_met, det_met in zip(expected_metallics, detected_metallic_flags):
        if exp_met and det_met:
            tp += 1
        elif not exp_met and det_met:
            fp += 1
        elif exp_met and not det_met:
            fn += 1

    metallic_prec = tp / (tp + fp) if (tp + fp) > 0 else None
    metallic_rec = tp / (tp + fn) if (tp + fn) > 0 else None

    return {
        "image": fixture["image"],
        "mode": mode,
        "lighting": fixture.get("lighting", "unknown"),
        "family_accuracy": round(family_acc, 3),
        "top3_paint_accuracy": round(paint_acc, 3),
        "metallic_precision": metallic_prec,
        "metallic_recall": metallic_rec,
        "elapsed_ms": round(elapsed_ms),
        "detected_families": detected_families,
    }


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def _render_markdown(results: list[dict], aggregate: dict) -> str:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        f"# SchemeStealer Eval Report — {ts}",
        "",
        "## Aggregate",
        "",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Fixtures evaluated | {aggregate['n']} |",
        f"| Family accuracy | {aggregate['family_accuracy']:.1%} |",
        f"| Top-3 paint accuracy | {aggregate['top3_paint_accuracy']:.1%} |",
        f"| Metallic precision | {aggregate.get('metallic_precision', 'n/a')} |",
        f"| Metallic recall | {aggregate.get('metallic_recall', 'n/a')} |",
        "",
        "## Per-image results",
        "",
        "| Image | Mode | Lighting | Family % | Paint % | ms |",
        "|-------|------|----------|----------|---------|-----|",
    ]
    for r in results:
        if "error" in r:
            lines.append(f"| {r.get('image', '?')} | — | — | ERROR: {r['error']} | — | — |")
        else:
            lines.append(
                f"| {r['image']} | {r['mode']} | {r['lighting']} "
                f"| {r['family_accuracy']:.0%} | {r['top3_paint_accuracy']:.0%} "
                f"| {r['elapsed_ms']} |"
            )
    return "\n".join(lines) + "\n"


def _compute_aggregate(results: list[dict]) -> dict:
    valid = [r for r in results if "error" not in r]
    if not valid:
        return {"n": 0}

    fam = sum(r["family_accuracy"] for r in valid) / len(valid)
    p3 = sum(r["top3_paint_accuracy"] for r in valid) / len(valid)

    prec_vals = [r["metallic_precision"] for r in valid if r["metallic_precision"] is not None]
    rec_vals = [r["metallic_recall"] for r in valid if r["metallic_recall"] is not None]

    return {
        "n": len(valid),
        "family_accuracy": fam,
        "top3_paint_accuracy": p3,
        "metallic_precision": f"{sum(prec_vals)/len(prec_vals):.1%}" if prec_vals else "n/a",
        "metallic_recall": f"{sum(rec_vals)/len(rec_vals):.1%}" if rec_vals else "n/a",
    }


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="SchemeStealer accuracy eval")
    parser.add_argument(
        "--fixtures",
        default=str(_ROOT / "eval" / "fixtures" / "labels.json"),
        help="Path to labels.json",
    )
    args = parser.parse_args()

    fixtures = _load_fixtures(args.fixtures)
    fixture_dir = str(Path(args.fixtures).parent)

    if not fixtures:
        print(
            "No fixtures found.\n"
            f"Add images to {fixture_dir}/ and populate labels.json.\n"
            "See eval/fixtures/README.md for the format."
        )
        return

    print(f"Evaluating {len(fixtures)} fixture(s) …")
    results = []
    for fix in fixtures:
        print(f"  {fix['image']} … ", end="", flush=True)
        r = evaluate_fixture(fix, fixture_dir)
        results.append(r)
        if "error" in r:
            print(f"ERROR: {r['error']}")
        else:
            print(
                f"family={r['family_accuracy']:.0%}  "
                f"paint={r['top3_paint_accuracy']:.0%}  "
                f"{r['elapsed_ms']}ms"
            )

    aggregate = _compute_aggregate(results)

    # Write markdown report
    results_dir = _ROOT / "eval" / "results"
    results_dir.mkdir(parents=True, exist_ok=True)
    ts_file = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_path = results_dir / f"{ts_file}.md"
    report_path.write_text(_render_markdown(results, aggregate))

    print(f"\nAggregate — family: {aggregate.get('family_accuracy', 0):.1%}  "
          f"paint top-3: {aggregate.get('top3_paint_accuracy', 0):.1%}")
    print(f"Report written to {report_path}")


if __name__ == "__main__":
    main()
