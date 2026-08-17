"""Load the production engine once. Always from python-api/ so the canonical DB resolves."""

from __future__ import annotations

import os
import sys
from functools import lru_cache

_API_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if _API_ROOT not in sys.path:
    sys.path.insert(0, _API_ROOT)
os.chdir(_API_ROOT)


@lru_cache(maxsize=1)
def get_engine():
    from core.schemestealer_engine import SchemeStealerEngine

    return SchemeStealerEngine()
