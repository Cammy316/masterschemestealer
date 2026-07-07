import os
import logging

logger = logging.getLogger(__name__)

_client = None


def log_persistence_mode() -> None:
    """Log which persistence backend is active. Called from the app's
    lifespan handler — at module import time logging.basicConfig has not run
    yet, so an import-time INFO line is silently dropped by the last-resort
    handler and the 'loud' observability goal is defeated."""
    if supabase_enabled():
        logger.info("PERSISTENCE: supabase")
    else:
        logger.warning(
            "PERSISTENCE: EPHEMERAL FILES — ML/analytics writes will be lost "
            "on the next deploy. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.")


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
