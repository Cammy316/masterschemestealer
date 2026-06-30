"""Shared slowapi rate limiter.

Defined in one place so `main.py` and the data-collection routers throttle on the
SAME limiter instance (the one registered on `app.state.limiter`).
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
