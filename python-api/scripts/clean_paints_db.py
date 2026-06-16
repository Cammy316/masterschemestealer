#!/usr/bin/env python3
"""
Paint database cleanup script.

Reads paints.json, applies fixes, and writes:
  - paints_cleaned.json  (fixed database — swap in when satisfied)
  - cleanup_report.md    (human-readable diff of every change)

The original paints.json is NEVER overwritten.

Usage (from project root or python-api directory):
    cd python-api
    python scripts/clean_paints_db.py
"""

import json
import math
import re
import sys
from pathlib import Path
from datetime import datetime

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

_SCRIPT_DIR = Path(__file__).resolve().parent
_PYTHON_API_DIR = _SCRIPT_DIR.parent
PAINTS_JSON = _PYTHON_API_DIR / "paints.json"
OUT_JSON = _PYTHON_API_DIR / "paints_cleaned.json"
OUT_REPORT = _PYTHON_API_DIR / "cleanup_report.md"

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Hex values that signal "placeholder — no real paint colour assigned"
PLACEHOLDER_HEXES = {"#ffffff", "#000000", "#010101", "#fffffe", "#fefefe"}

# White/black substitute hex values (real paint pigment, not paper white)
WHITE_SUBSTITUTE_HEX = "#F4F4F2"
BLACK_SUBSTITUTE_HEX = "#121212"

# Name keywords that indicate non-paint products (media / primers / varnishes)
NON_PAINT_KEYWORDS = [
    "medium", "thinner", "varnish", "primer", "diluent",
    "retarder", "flow improver", "airbrush flow", "wet palette",
    "lahmian", "contrast medium", "water pot", "mixing medium",
    "glaze medium", "texture medium", "technical medium",
]

# DB categories that are inherently non-matchable for colour-matching purposes
NON_MATCHABLE_CATEGORIES = {"technical", "dry", "basing", "glaze", "varnish"}

# Finish values that imply a category override to 'metallic' (for scoring)
METALLIC_FINISHES = {"metallic", "metal", "chrome"}

# Regex patterns that flag a name as a product code rather than a real name
_CODE_PATTERNS = [
    re.compile(r"^[A-Z]{2}\d{4}$"),            # WP1101, CP3001
    re.compile(r"^\d{2}\.\d{3}$"),              # 62.020  (Vallejo numeric)
    re.compile(r"^P3\s+\d{3,}$"),               # P3 + digits
    re.compile(r"^\d{4,}$"),                    # purely numeric
    re.compile(r"^[A-Z]{1,3}-\d{3,}$"),        # AP-xxx style
]


def _is_product_code(name: str) -> bool:
    return any(p.match(name.strip()) for p in _CODE_PATTERNS)


# ---------------------------------------------------------------------------
# Discontinued paint sets (names that are known to no longer be sold)
# ---------------------------------------------------------------------------

# Citadel washes replaced in the 2012 rebrand
_DISCONTINUED_CITADEL_WASHES = {
    "Badab Black", "Devlan Mud", "Gryphonne Sepia", "Thraka Green",
    "Asurmen Blue", "Baal Red", "Ogryn Flesh", "Leviathan Purple",
}

# Citadel 1st/2nd edition inks
_OLD_CITADEL_INKS = {
    "Chestnut Ink", "Flesh Ink", "Blue Ink", "Red Ink", "Green Ink",
    "Black Ink", "Purple Ink", "Dark Blue Ink", "Darkgreen Ink",
    "Enchanted Blue Ink", "Brown Ink",
}

# Citadel base/layer paints replaced in the 2012 "New Citadel Paints" rebrand
_DISCONTINUED_CITADEL_BASES = {
    "Skull White", "Chaos Black", "Mechrite Red", "Iyanden Darksun",
    "Mordian Blue", "Regal Blue", "Rotting Flesh", "Scorched Brown",
    "Tallarn Flesh", "Vermin Brown", "Blood Red", "Boltgun Metal",
    "Burnished Gold", "Chainmail", "Mithril Silver", "Shining Gold",
    "Bleached Bone", "Dark Flesh", "Elf Flesh", "Scab Red",
    "Tentacle Pink", "Warlock Purple", "Midnight Blue", "Necron Abyss",
    "Space Wolves Grey", "Shadow Grey", "Spacewolves Grey",
    "Camo Green", "Catachan Green", "Gretchin Green", "Goblin Green",
    "Knarloc Green", "Dark Angels Green", "Codex Grey", "Fortress Grey",
    "Astronomican Grey", "Dwarf Flesh", "Bronzed Flesh", "Tanned Flesh",
    "Sunburst Yellow", "Desert Yellow", "Vomit Brown",
    "Snakebite Leather", "Bestial Brown", "Bubonic Brown",
    "Kommando Khaki", "Tin Bitz", "Dwarf Bronze", "Brazen Bronze",
    "Ice Blue", "Liche Purple", "Red Gore", "Hawk Turquoise",
    "Orkhide Shade", "Charadon Granite", "Khemri Brown", "Dheneb Stone",
    "Hormagaunt Purple", "Adeptus Battlegrey", "Mechrite Red",
    "Tausept Ochre",
}

ALL_DISCONTINUED_CITADEL = (
    _DISCONTINUED_CITADEL_WASHES | _OLD_CITADEL_INKS | _DISCONTINUED_CITADEL_BASES
)


# ---------------------------------------------------------------------------
# Colour-family validation via LAB hue
# ---------------------------------------------------------------------------

def _hex_to_lab(hex_color: str):
    """Convert hex to CIELAB (D65, skimage-compatible)."""
    h = hex_color.lstrip("#")
    if len(h) != 6:
        return None
    r, g, b = (int(h[i:i+2], 16) / 255.0 for i in (0, 2, 4))

    def linearise(c):
        return (c / 12.92) if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = linearise(r), linearise(g), linearise(b)
    x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
    z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

    ref_x, ref_y, ref_z = 0.95047, 1.00000, 1.08883

    def f(t):
        return t ** (1.0 / 3.0) if t > 0.008856 else 7.787 * t + 16 / 116

    fx, fy, fz = f(x / ref_x), f(y / ref_y), f(z / ref_z)
    L = 116 * fy - 16
    a = 500 * (fx - fy)
    b_ = 200 * (fy - fz)
    return L, a, b_


def _infer_family_from_lab(L, a, b):
    """Very rough LAB -> family name for validation cross-checks."""
    chroma = math.sqrt(a * a + b * b)
    if chroma < 8:
        if L > 85:
            return "white"
        if L < 20:
            return "black"
        return "grey"

    hue = math.degrees(math.atan2(b, a)) % 360

    if chroma < 18 and 15 < hue < 75:
        return "brown"  # desaturated warm = brown/skin/tan

    if hue < 25 or hue >= 340:
        return "red"
    if hue < 55:
        return "orange"
    if hue < 75:
        return "yellow"
    if hue < 165:
        return "green"
    if hue < 200:
        return "cyan"
    if hue < 265:
        return "blue"
    if hue < 310:
        return "purple"
    if hue < 340:
        return "pink"
    return "red"


# Pairs that don't need a family-mismatch warning (adjacent / aliased)
_ADJACENT_FAMILIES = {
    frozenset(["red", "orange"]),
    frozenset(["red", "pink"]),
    frozenset(["red", "brown"]),
    frozenset(["orange", "yellow"]),
    frozenset(["orange", "brown"]),
    frozenset(["orange", "gold"]),
    frozenset(["yellow", "green"]),
    frozenset(["yellow", "bone"]),
    frozenset(["yellow", "gold"]),
    frozenset(["green", "cyan"]),
    frozenset(["green", "teal"]),
    frozenset(["cyan", "blue"]),
    frozenset(["cyan", "teal"]),
    frozenset(["blue", "purple"]),
    frozenset(["blue", "grey"]),
    frozenset(["purple", "pink"]),
    frozenset(["purple", "magenta"]),
    frozenset(["pink", "magenta"]),
    frozenset(["brown", "tan"]),
    frozenset(["brown", "skin"]),
    frozenset(["brown", "gold"]),
    frozenset(["brown", "bronze"]),
    frozenset(["grey", "black"]),
    frozenset(["grey", "silver"]),
    frozenset(["grey", "white"]),
    frozenset(["white", "bone"]),
    frozenset(["white", "cream"]),
    frozenset(["bone", "yellow"]),
    frozenset(["bone", "cream"]),
    frozenset(["gold", "silver"]),  # mixed metallics
    frozenset(["gold", "bronze"]),
    frozenset(["silver", "metal"]),
    frozenset(["bronze", "copper"]),
    frozenset(["copper", "orange"]),
    frozenset(["skin", "pink"]),
    frozenset(["skin", "orange"]),
    frozenset(["flesh", "pink"]),
    frozenset(["flesh", "orange"]),
    frozenset(["flesh", "brown"]),
    frozenset(["teal", "blue"]),
    frozenset(["teal", "green"]),
    frozenset(["turquoise", "cyan"]),
    frozenset(["turquoise", "blue"]),
    frozenset(["turquoise", "green"]),
}

# Families that are aliases of each other
_FAMILY_ALIASES = {
    "flesh": "skin", "tan": "brown", "cream": "bone",
    "metal": "silver", "copper": "bronze",
}


def _families_are_compatible(stored: str, inferred: str) -> bool:
    """Return True if stored and inferred families are compatible (no warning needed)."""
    s = stored.lower().strip()
    i = inferred.lower().strip()
    if not s or not i or s == "unknown" or i == "unknown":
        return True
    s = _FAMILY_ALIASES.get(s, s)
    i = _FAMILY_ALIASES.get(i, i)
    if s == i:
        return True
    return frozenset([s, i]) in _ADJACENT_FAMILIES


# ---------------------------------------------------------------------------
# Main audit logic
# ---------------------------------------------------------------------------

def audit_paints(paints: list) -> list:
    """
    Return a list of change records:
        {
            'index': int,
            'name': str,
            'brand': str,
            'action': str,       # 'fix' | 'flag' | 'set_unmatchable' | 'set_discontinued'
            'field': str,
            'old_value': any,
            'new_value': any,
            'reason': str,
        }
    """
    changes = []

    def record(idx, paint, action, field, old_val, new_val, reason):
        changes.append({
            "index": idx,
            "name": paint.get("name", f"[index {idx}]"),
            "brand": paint.get("brand", ""),
            "action": action,
            "field": field,
            "old_value": old_val,
            "new_value": new_val,
            "reason": reason,
        })

    for idx, p in enumerate(paints):
        name = p.get("name", "")
        brand = p.get("brand", "").lower()
        hex_val = p.get("hex", "").lower()
        category = p.get("category", "").lower()
        finish = p.get("finish", "").lower()
        stored_family = p.get("color_family", "")

        # ── 1. Placeholder hex fixes ──────────────────────────────────────
        if hex_val in PLACEHOLDER_HEXES:
            name_lower = name.lower()
            # True whites
            if any(w in name_lower for w in ("white", "skull", "ceramite", "snow", "ivory")):
                record(idx, p, "fix", "hex", p["hex"], WHITE_SUBSTITUTE_HEX,
                       "Placeholder hex for white paint — use off-white substitute")
                p["hex"] = WHITE_SUBSTITUTE_HEX
            # True blacks
            elif any(b in name_lower for b in ("black", "chaos", "abaddon", "shadow", "night", "dark")):
                record(idx, p, "fix", "hex", p["hex"], BLACK_SUBSTITUTE_HEX,
                       "Placeholder hex for black paint — use near-black substitute")
                p["hex"] = BLACK_SUBSTITUTE_HEX
            else:
                record(idx, p, "flag", "hex", p["hex"], None,
                       "Placeholder hex (#000000/#FFFFFF) on non-black/white paint — manual review needed")

        # ── 2. Product-code names ─────────────────────────────────────────
        if _is_product_code(name):
            record(idx, p, "flag", "name", name, None,
                   "Name looks like a product code rather than a descriptive name — verify or remove")
            p.setdefault("matchable", False)
            record(idx, p, "set_unmatchable", "matchable", True, False,
                   "Product-code names are not useful for matching — marked unmatchable")

        # ── 3. Non-paint media / technical products ───────────────────────
        name_lower = name.lower()
        if any(kw in name_lower for kw in NON_PAINT_KEYWORDS):
            if not p.get("matchable") is False:
                record(idx, p, "set_unmatchable", "matchable", p.get("matchable", True), False,
                       f"Name contains medium/varnish/primer keyword — not a matchable paint")
                p["matchable"] = False

        # ── 4. Non-matchable categories ───────────────────────────────────
        if category in NON_MATCHABLE_CATEGORIES:
            if p.get("matchable", True):
                record(idx, p, "set_unmatchable", "matchable", True, False,
                       f"Category '{category}' is inherently non-matchable (technical/dry/glaze/varnish)")
                p["matchable"] = False

        # ── 5. Discontinued detection (Citadel only) ──────────────────────
        if brand == "citadel" and name in ALL_DISCONTINUED_CITADEL:
            if not p.get("discontinued", False):
                record(idx, p, "set_discontinued", "discontinued", False, True,
                       "Known discontinued Citadel paint (pre-2012 range or old inks)")
                p["discontinued"] = True
            if p.get("matchable", True):
                record(idx, p, "set_unmatchable", "matchable", True, False,
                       "Discontinued paints excluded from matching by default")
                p["matchable"] = False

        # ── 6. Colour-family mismatch check ──────────────────────────────
        lab = _hex_to_lab(p.get("hex", ""))
        if lab is not None:
            L, a, b = lab
            inferred = _infer_family_from_lab(L, a, b)
            if stored_family and not _families_are_compatible(stored_family, inferred):
                record(idx, p, "flag", "color_family", stored_family, inferred,
                       f"Stored family '{stored_family}' conflicts with LAB hue "
                       f"-> inferred '{inferred}' (L={L:.0f}, a={a:.0f}, b={b:.0f})")

        # ── 7. Missing required fields ─────────────────────────────────────
        for required in ("name", "brand", "hex", "category"):
            if not p.get(required):
                record(idx, p, "flag", required, p.get(required), None,
                       f"Required field '{required}' is missing or empty")

        # ── 8. Ensure matchable / discontinued fields exist ───────────────
        p.setdefault("matchable", True)
        p.setdefault("discontinued", False)

    return changes


def build_cleaned_db(original: list, changes: list) -> list:
    """
    Apply all 'fix', 'set_unmatchable', and 'set_discontinued' changes to a
    deep copy of the original database and return the cleaned list.

    The audit() function already mutated the dicts in place — so this just
    ensures every entry has matchable/discontinued defaults written.
    """
    for p in original:
        p.setdefault("matchable", True)
        p.setdefault("discontinued", False)
    return original


def write_report(changes: list, total: int, out_path: Path) -> None:
    fixes = [c for c in changes if c["action"] == "fix"]
    flags = [c for c in changes if c["action"] == "flag"]
    unmatchable = [c for c in changes if c["action"] == "set_unmatchable"]
    discontinued = [c for c in changes if c["action"] == "set_discontinued"]

    lines = [
        f"# Paint Database Cleanup Report",
        f"",
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"",
        f"## Summary",
        f"",
        f"| Metric | Count |",
        f"|--------|-------|",
        f"| Total paints in source | {total} |",
        f"| Hex fixes applied | {len(fixes)} |",
        f"| Paints marked unmatchable | {len(unmatchable)} |",
        f"| Paints marked discontinued | {len(discontinued)} |",
        f"| Items flagged for manual review | {len(flags)} |",
        f"",
    ]

    if fixes:
        lines += [
            f"## Hex Fixes Applied ({len(fixes)})",
            f"",
            f"These were automatically corrected in `paints_cleaned.json`.",
            f"",
        ]
        for c in fixes:
            lines.append(f"- **{c['brand']} / {c['name']}** — `hex`: `{c['old_value']}` -> `{c['new_value']}` _{c['reason']}_")
        lines.append("")

    if unmatchable:
        lines += [
            f"## Paints Marked `matchable: false` ({len(unmatchable)})",
            f"",
            f"These paints will be excluded from colour matching (they remain in the database for reference).",
            f"",
        ]
        for c in unmatchable:
            lines.append(f"- **{c['brand']} / {c['name']}** — _{c['reason']}_")
        lines.append("")

    if discontinued:
        lines += [
            f"## Discontinued Paints ({len(discontinued)})",
            f"",
            f"Known discontinued products. They are also marked `matchable: false`.",
            f"",
        ]
        for c in discontinued:
            lines.append(f"- **{c['brand']} / {c['name']}**")
        lines.append("")

    if flags:
        lines += [
            f"## Items Flagged for Manual Review ({len(flags)})",
            f"",
            f"These were NOT automatically changed — Cam should review.",
            f"",
        ]
        for c in flags:
            old = f"`{c['old_value']}`" if c["old_value"] is not None else "_missing_"
            new = f"-> suggested `{c['new_value']}`" if c["new_value"] is not None else ""
            lines.append(
                f"- **{c['brand']} / {c['name']}** — `{c['field']}`: {old} {new}  \n"
                f"  _{c['reason']}_"
            )
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    if not PAINTS_JSON.exists():
        sys.exit(f"ERROR: paints.json not found at {PAINTS_JSON}")

    print(f"Reading {PAINTS_JSON} ...")
    with open(PAINTS_JSON, encoding="utf-8") as f:
        paints = json.load(f)

    total = len(paints)
    print(f"Loaded {total} paints.")

    print("Running audit...")
    changes = audit_paints(paints)

    # paints list has been mutated in place by audit_paints
    cleaned = build_cleaned_db(paints, changes)

    print(f"Writing cleaned database -> {OUT_JSON}")
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

    print(f"Writing cleanup report  -> {OUT_REPORT}")
    write_report(changes, total, OUT_REPORT)

    fixes = sum(1 for c in changes if c["action"] == "fix")
    flags = sum(1 for c in changes if c["action"] == "flag")
    unm = sum(1 for c in changes if c["action"] == "set_unmatchable")
    disc = sum(1 for c in changes if c["action"] == "set_discontinued")
    print(
        f"\nDone — {fixes} hex fixes, {unm} unmatchable, {disc} discontinued, "
        f"{flags} flagged for review."
    )
    print(f"Review {OUT_REPORT} and swap paints_cleaned.json -> paints.json when satisfied.")


if __name__ == "__main__":
    main()
