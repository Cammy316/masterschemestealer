import os
import logging

logger = logging.getLogger(__name__)

_client = None


def get_supabase():
    """Return a Supabase client if configured, else None (falls back to file storage)."""
    global _client
    if _client is not None:
        return _client

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        return None

    try:
        from supabase import create_client
        _client = create_client(url, key)
        logger.info("Supabase client initialised")
        return _client
    except Exception as e:
        logger.error(f"Failed to initialise Supabase client: {e}")
        return None


def supabase_enabled() -> bool:
    return bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_KEY"))
