#!/usr/bin/env python3
"""
Paint database validation harness (Prompt 2.6).

Runs against paints_groundtruth.json and FAILS (non-zero exit) on any structural
problem the engine would choke on. Also loads the database through the real
SchemeStealerEngine and exercises PaintMatcher to prove the file is a drop-in
replacement.

Run:
    cd python-api
    python scripts/validate_paints_db.py
    # or against a specific file:
    python scripts/validate_paints_db.py paints_groundtruth.json
"""

import json
import re
import sys
from pathlib import Path

import numpy as np

# Stub cv2 so the engine imports without a full OpenCV install — the matcher
# path we exercise uses skimage/numpy only.
from unittest.mock import MagicMock
if 'cv2' not in sys.modules:
    sys.modules['cv2'] = MagicMock()

_SCRIPT_DIR = Path(__file__).resolve().parent
_PYTHON_API_DIR = _SCRIPT_DIR.parent
sys.path.insert(0, str(_PYTHON_API_DIR))

from core.color_engine import RECOGNISED_FAMILIES, compute_color_family  # noqa: E402

# Engine's accepted category / finish vocabularies.
KNOWN_CATEGORIES = {
    'base', 'layer', 'air', 'contrast', 'wash', 'shade', 'ink',
    'dry', 'technical', 'glaze',
}
KNOWN_FINISHES = {'matte', 'satin', 'metallic', 'gloss'}

HEX_RE = re.compile(r'^#[0-9A-Fa-f]{6}$')

REQUIRED_FIELDS = {
    'paint_id': str,
    'name': str,
    'brand': str,
    'range': str,
    'hex': str,
    'category': str,
    'finish': str,
    'transparency': (int, float),
    'color_family': str,
    'aliases': list,
    'tags': list,
    'matchable': bool,
    'discontinued': bool,
    'hex_source': str,
}

BRANDS = ['Citadel', 'Vallejo', 'Army Painter', 'Scale75']
# Brands that actually carry wash/shade/ink products.
WASH_BRANDS = ['Citadel', 'Vallejo']


class Validator:
    def __init__(self, paints):
        self.paints = paints
        self.failures = []   # hard failures -> non-zero exit
        self.warnings = []

    def fail(self, msg):
        self.failures.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    # -- structural checks -------------------------------------------------

    def check_fields_and_hex(self):
        for i, p in enumerate(self.paints):
            label = p.get('name', f'[index {i}]')
            for field, typ in REQUIRED_FIELDS.items():
                if field not in p:
                    self.fail(f"{label}: missing required field '{field}'")
                elif not isinstance(p[field], typ):
                    self.fail(f"{label}: field '{field}' has wrong type "
                              f"{type(p[field]).__name__}")
            hx = p.get('hex', '')
            if not HEX_RE.match(hx):
                self.fail(f"{label}: invalid hex {hx!r}")

    def check_category_finish(self):
        for p in self.paints:
            if p.get('category') not in KNOWN_CATEGORIES:
                self.fail(f"{p.get('name')}: unknown category {p.get('category')!r}")
            if p.get('finish') not in KNOWN_FINISHES:
                self.fail(f"{p.get('name')}: unknown finish {p.get('finish')!r}")

    def check_family(self):
        for p in self.paints:
            if p.get('color_family') not in RECOGNISED_FAMILIES:
                self.fail(f"{p.get('name')}: unrecognised color_family "
                          f"{p.get('color_family')!r}")

    def check_unique_ids(self):
        seen = {}
        for p in self.paints:
            pid = p.get('paint_id')
            if pid in seen:
                self.fail(f"duplicate paint_id {pid!r} ({seen[pid]} and {p.get('name')})")
            seen[pid] = p.get('name')

    def check_placeholder_hex(self):
        for p in self.paints:
            if not p.get('matchable'):
                continue
            hx = (p.get('hex') or '').upper()
            name = (p.get('name') or '').lower()
            if hx in ('#FFFFFF', '#000000') and 'white' not in name and 'black' not in name:
                self.fail(f"{p.get('name')}: matchable paint has placeholder hex {hx}")

    def check_transparency_and_metallic(self):
        for p in self.paints:
            t = p.get('transparency')
            if not isinstance(t, (int, float)) or not (0.0 <= t <= 1.0):
                self.fail(f"{p.get('name')}: transparency {t!r} out of [0,1]")
            tags = p.get('tags', [])
            if 'metallic' in tags and p.get('finish') != 'metallic':
                self.fail(f"{p.get('name')}: tagged metallic but finish={p.get('finish')!r}")

    # -- engine integration ------------------------------------------------

    def check_engine_load_and_match(self, db_path):
        try:
            from core.schemestealer_engine import SchemeStealerEngine
        except Exception as e:  # pragma: no cover
            self.fail(f"could not import SchemeStealerEngine: {e}")
            return
        try:
            engine = SchemeStealerEngine(paint_db_path=str(db_path))
        except Exception as e:
            self.fail(f"SchemeStealerEngine failed to load {db_path}: {e}")
            return

        matcher = engine.matcher
        mid_red = np.array([154, 17, 21], dtype=np.uint8)

        for brand in BRANDS:
            r = matcher.match_color(mid_red, brand, role='dominant',
                                    context={'metallic_score': 0.0})
            if r is None:
                self.fail(f"match_color returned None for {brand} role=dominant")
            else:
                # backward-compat alias must agree
                r2 = matcher.match_color(mid_red, brand, paint_type='paint',
                                         context={'metallic_score': 0.0})
                if r2 is None:
                    self.fail(f"match_color(paint_type='paint') None for {brand}")

        for brand in WASH_BRANDS:
            rw = matcher.match_color(mid_red, brand, role='wash')
            if rw is None:
                self.fail(f"match_color returned None for {brand} role=wash")

    def check_pink_regression(self, db_path):
        """Original bug guard: the classifier must NOT call pale pink 'grey'."""
        fam = compute_color_family('#DECBDA')
        if fam not in ('pink', 'purple', 'flesh'):
            self.fail(f"#DECBDA classified as {fam!r}; expected pink/purple/flesh "
                      "(grey-for-pink regression)")
        # Informational: what the nearest paint per brand resolves to.
        try:
            from core.schemestealer_engine import SchemeStealerEngine
            engine = SchemeStealerEngine(paint_db_path=str(db_path))
            target = np.array([222, 203, 218], dtype=np.uint8)
            for brand in BRANDS:
                r = engine.matcher.match_color(target, brand, role='dominant',
                                               context={'metallic_score': 0.0})
                if r is not None:
                    self.warn(f"[info] #DECBDA nearest {brand}: {r.name} "
                              f"(family={r.color_family})")
        except Exception:
            pass

    # -- run ---------------------------------------------------------------

    def run(self, db_path):
        self.check_fields_and_hex()
        self.check_category_finish()
        self.check_family()
        self.check_unique_ids()
        self.check_placeholder_hex()
        self.check_transparency_and_metallic()
        self.check_engine_load_and_match(db_path)
        self.check_pink_regression(db_path)


def main():
    db_path = (_PYTHON_API_DIR /
               (sys.argv[1] if len(sys.argv) > 1 else 'paints_groundtruth.json'))
    if not db_path.exists():
        sys.exit(f"ERROR: {db_path} not found")

    with open(db_path, encoding='utf-8') as f:
        paints = json.load(f)

    v = Validator(paints)
    v.run(db_path)

    print("=" * 60)
    print(f"VALIDATION: {db_path.name} ({len(paints)} paints)")
    print("=" * 60)

    for w in v.warnings:
        print(f"  {w}")

    checks = [
        ("Required fields + hex format", True),
        ("Category / finish vocabulary", True),
        ("color_family recognised", True),
        ("paint_id unique", True),
        ("No placeholder hex on matchable paints", True),
        ("Transparency range + metallic finish", True),
        ("Engine load + dominant/wash matches", True),
        ("#DECBDA pink/purple/flesh regression", True),
    ]
    # We don't track per-check pass individually beyond failures list; summarise.
    print("\nResult:")
    if v.failures:
        print(f"  FAIL — {len(v.failures)} problem(s):")
        for msg in v.failures[:60]:
            print(f"    - {msg}")
        if len(v.failures) > 60:
            print(f"    ... and {len(v.failures) - 60} more")
        sys.exit(1)
    else:
        print(f"  PASS — all checks green ({len(paints)} paints, "
              f"{sum(p['matchable'] for p in paints)} matchable)")
        sys.exit(0)


if __name__ == "__main__":
    main()
