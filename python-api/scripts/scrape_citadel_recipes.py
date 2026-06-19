"""
Citadel official paint-chain scraper (best-effort, polite, run-once).

Self-contained: no dependency on the removed Prompt-2.6 scraper machinery. It
politely fetches the Citadel Colour site (>=2s between requests, descriptive
User-Agent, on-disk cache so re-runs make zero network calls), tries to extract
ONLY structured paint-name relationships (paint A -> paint B + relationship),
resolves names to paint_id via paints.json, and merges any found
`citadel_official` edges idempotently into recipes.json.

Reality (verified June 2026): paint.warhammer.com is a WordPress site whose paint
/ recipe chains are NOT exposed in any structured endpoint — the custom
`citadelcolour/v1` REST namespace only has a pageviews tracker, there are no
paint custom post types, and the data is rendered by a client-side SPA. So this
script currently finds no structured chains and exits gracefully with manual-
entry instructions; the recipe graph runs on the hand-curated + algorithmic
edges alone. If GW later exposes a data endpoint, wire it into `extract_edges`.

Run:  python scripts/scrape_citadel_recipes.py
"""

import os
import re
import sys
import json
import time
import hashlib
import logging
import unicodedata
import urllib.request
import urllib.error

_HERE = os.path.dirname(os.path.abspath(__file__))
_ROOT = os.path.dirname(_HERE)  # python-api

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger("scrape_citadel_recipes")

PAINTS_PATH = os.path.join(_ROOT, "paints.json")
RECIPES_PATH = os.path.join(_ROOT, "recipes.json")
CACHE_DIR = os.path.join(_HERE, ".scrape_cache")

USER_AGENT = ("SchemeStealerRecipeBot/1.0 "
              "(+https://www.schemestealer.com; contact chume316@gmail.com)")
RATE_LIMIT_SECONDS = 2.0
BASE = "https://paint.warhammer.com"

_last_fetch = [0.0]


# ---------------------------------------------------------------------------
# Polite, cached fetch
# ---------------------------------------------------------------------------
def polite_get(url: str) -> str:
    """Fetch a URL, serving from the on-disk cache when present. Rate-limited and
    User-Agent identified. Returns '' on failure (logged, never raises)."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    key = hashlib.sha256(url.encode("utf-8")).hexdigest()[:24]
    cache_file = os.path.join(CACHE_DIR, f"{key}.cache")
    if os.path.exists(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            return f.read()

    # Rate-limit only real network requests.
    wait = RATE_LIMIT_SECONDS - (time.time() - _last_fetch[0])
    if wait > 0:
        time.sleep(wait)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read().decode("utf-8", "ignore")
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        logger.warning("fetch failed for %s: %s", url, e)
        return ""
    finally:
        _last_fetch[0] = time.time()

    with open(cache_file, "w", encoding="utf-8") as f:
        f.write(body)
    return body


# ---------------------------------------------------------------------------
# Name -> paint_id resolution (slugify mirrors the 2.6 builder for Citadel)
# ---------------------------------------------------------------------------
def slugify(*parts) -> str:
    raw = "-".join(str(p) for p in parts if p)
    raw = unicodedata.normalize("NFKD", raw).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^A-Za-z0-9]+", "-", raw).strip("-").lower() or "paint"


def build_name_index(paints):
    idx = {}
    for p in paints:
        if p["brand"] == "Citadel":
            idx.setdefault(p["name"].lower(), p["paint_id"])
    return idx


def resolve_name(name: str, name_index, unresolved: set):
    pid = name_index.get(name.strip().lower())
    if pid is None:
        unresolved.add(name)
    return pid


# ---------------------------------------------------------------------------
# Extraction (currently yields nothing — see module docstring)
# ---------------------------------------------------------------------------
def extract_edges(name_index, unresolved: set):
    """Attempt to pull structured (paint A -> paint B + rel) facts. Returns a list
    of edge dicts. Defensive: inspects what's actually served and fails per-page
    with a warning rather than crashing.

    No structured chain data is currently exposed by GW, so this returns []. The
    fetch is still exercised (cached) so the polite-fetch path is real and a
    future endpoint only needs wiring in here."""
    edges = []
    pages_fetched = 0

    # robots.txt courtesy check (informational).
    robots = polite_get(f"{BASE}/robots.txt")
    if robots:
        pages_fetched += 1
        if re.search(r"(?im)^\s*Disallow:\s*/\s*$", robots):
            logger.warning("robots.txt disallows crawling the root — aborting.")
            return [], pages_fetched

    # The custom app API namespace (only a pageviews tracker exists today).
    api = polite_get(f"{BASE}/wp-json/")
    if api:
        pages_fetched += 1
        try:
            routes = json.loads(api).get("routes", {})
            cc = [r for r in routes if "citadelcolour" in r and "pageview" not in r]
            if cc:
                logger.info("Found candidate app routes to inspect: %s", cc)
                # If a future data route appears, fetch + parse it into `edges`
                # here, resolving names via resolve_name(...).
        except Exception as e:  # noqa: BLE001
            logger.warning("could not parse wp-json index: %s", e)

    _ = (name_index, unresolved)  # used once real extraction is wired in
    return edges, pages_fetched


# ---------------------------------------------------------------------------
def merge_into_recipes(new_edges):
    """Idempotently merge citadel_official edges into recipes.json (dedupe on the
    full edge tuple). Never touches non-official edges."""
    data = {"version": 1, "edges": []}
    if os.path.exists(RECIPES_PATH):
        with open(RECIPES_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

    seen = {(e["from_id"], e["to_id"], e["rel"], e.get("source")) for e in data["edges"]}
    added = 0
    for e in new_edges:
        key = (e["from_id"], e["to_id"], e["rel"], e.get("source"))
        if key not in seen:
            data["edges"].append(e)
            seen.add(key)
            added += 1

    if added:
        with open(RECIPES_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    return added


def main():
    paints = json.load(open(PAINTS_PATH, encoding="utf-8"))
    name_index = build_name_index(paints)
    unresolved = set()

    edges, pages_fetched = extract_edges(name_index, unresolved)
    added = merge_into_recipes(edges) if edges else 0

    print("=" * 64)
    print("Citadel recipe scrape summary")
    print("=" * 64)
    print(f"  pages fetched (or cached): {pages_fetched}")
    print(f"  structured edges extracted: {len(edges)}")
    print(f"  edges merged into recipes.json: {added}")
    print(f"  names unresolved to a paint_id: {len(unresolved)}")
    if unresolved:
        for n in sorted(unresolved):
            print(f"    - {n}")

    if not edges:
        print()
        print("No structured official chains were extractable from GW's site")
        print("(its paint data lives behind a client-rendered SPA with no public")
        print("data endpoint). The recipe graph runs on hand-curated official")
        print("edges (recipes.json, source 'citadel_official') plus algorithmic")
        print("fallbacks. To add more official chains manually, append edges to")
        print("recipes.json like:")
        print('    {"from_id": "citadel-mephiston-red",')
        print('     "to_id": "citadel-evil-sunz-scarlet",')
        print('     "from": "Mephiston Red", "to": "Evil Sunz Scarlet",')
        print('     "rel": "highlight", "source": "citadel_official", "confidence": 1.0}')
        print("Then re-run scripts/generate_algorithmic_edges.py.")


if __name__ == "__main__":
    main()
