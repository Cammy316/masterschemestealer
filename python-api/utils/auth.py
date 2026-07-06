"""Lightweight admin gate for the aggregate-stats read endpoints.

These endpoints expose business metrics (scan counts, ratings, top pages) and are
NOT client-facing, so a shared secret is appropriate. The gate is opt-in: when
`ANALYTICS_ADMIN_KEY` is unset (local dev / tests) it is open so nothing breaks;
when set in production the caller must send a matching `X-Admin-Key` header.
"""
import os
from typing import Optional

from fastapi import Header, HTTPException


def require_admin_key(x_admin_key: Optional[str] = Header(default=None)) -> None:
    expected = os.getenv("ANALYTICS_ADMIN_KEY")
    if os.getenv("RENDER") == "true" and not expected:
        raise HTTPException(status_code=403, detail="Admin key not configured in production")
    
    if expected and x_admin_key != expected:
        raise HTTPException(status_code=403, detail="Forbidden")
