"""
Security / penetration fuzzing of the FastAPI upload surface.

Simulates the chaotic and malicious uploads the prompt calls out — oversized
payloads, corrupted bytes, corrupted EXIF, and a 0-byte file — and pins that the
backend answers with the correct 4xx (never a 500/crash) and always runs its
aggressive memory cleanup (`gc.collect()` in the `finally`) so a hostile client
cannot exhaust the single Render worker's RAM.

Design notes (why it's structured this way):
  * We mock the scanner (`_miniature_scanner`) and pre-set `_scanner_ready` so the
    heavy ML stack never loads — these tests exercise the HTTP *contract*
    (validation + error handling + cleanup), not the colour engine.
  * TestClient is created WITHOUT the context manager on purpose, so the lifespan
    pre-warm thread never runs and never tries to build the real engine.
  * Rate limiting is disabled for the deterministic validation tests and exercised
    in one dedicated test, so slowapi's in-process counter cannot leak between tests.

Audit cross-refs (documented, not asserted here):
  * H2 — `await file.read()` buffers the whole body before the 10 MB check, so the
    413 below still fires but the body is already resident (an OOM vector).
  * H1 — the 10/min limit keys on a spoofable X-Forwarded-For.
"""

import io
import sys
from pathlib import Path
from unittest.mock import Mock

import pytest
from fastapi.testclient import TestClient
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import main  # noqa: E402

_CANNED_RESULT = {"mode": "miniature", "colors": [], "paints": [], "metadata": {}}


@pytest.fixture
def client(monkeypatch):
    """A TestClient with a mocked, ready scanner and rate limiting disabled.

    Restores the limiter's enabled flag AND resets its in-memory counter on
    teardown so this module never leaks rate-limit state into the shared app used
    by the other test files (e.g. test_end_to_end_pipeline)."""
    original_enabled = main.limiter.enabled
    main._scanner_ready.set()
    fake = Mock()
    fake.scan.return_value = _CANNED_RESULT
    monkeypatch.setattr(main, "_miniature_scanner", fake)
    monkeypatch.setattr(main, "_inspiration_scanner", fake)
    main.limiter.enabled = False
    # No `with` → lifespan/pre-warm never runs → real engine never loads.
    yield TestClient(main.app), fake
    main.limiter.enabled = original_enabled
    try:
        main.limiter.reset()  # clear flood counters so other modules start clean
    except Exception:
        pass


# --- image byte helpers -----------------------------------------------------

def _png(mode="RGB", size=(8, 8), colour=(10, 20, 30)) -> bytes:
    buf = io.BytesIO()
    Image.new(mode, size, colour).save(buf, "PNG")
    return buf.getvalue()


def _transparent_rgba_png() -> bytes:
    buf = io.BytesIO()
    Image.new("RGBA", (1, 1), (0, 0, 0, 0)).save(buf, "PNG")  # 0-alpha pixel
    return buf.getvalue()


def _jpeg() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (16, 16), (120, 40, 40)).save(buf, "JPEG")
    return buf.getvalue()


def _post(client, data: bytes, name: str, content_type: str, endpoint="/api/scan/miniature"):
    return client.post(endpoint, files={"file": (name, data, content_type)})


# ===========================================================================
# Ingestion validation — correct 4xx, never a crash
# ===========================================================================

def test_non_image_mime_is_rejected_400(client):
    c, _ = client
    r = _post(c, b"definitely not an image", "payload.txt", "text/plain")
    assert r.status_code == 400
    assert "image" in r.json()["detail"].lower()


def test_oversize_50mb_payload_is_rejected_413(client):
    """A 50 MB upload is refused with 413 (audit H2: the body is buffered first)."""
    c, fake = client
    big = b"\x00" * (50 * 1024 * 1024)
    r = _post(c, big, "huge.png", "image/png")
    assert r.status_code == 413
    fake.scan.assert_not_called()  # rejected before it ever reaches the scanner


def test_unsigned_garbage_with_image_mime_rejected_400(client):
    """Bytes with no recognisable image header → UnidentifiedImageError → 400."""
    c, _ = client
    r = _post(c, b"not really an image at all \x00\x01\x02", "evil.png", "image/png")
    assert r.status_code == 400
    assert "invalid image" in r.json()["detail"].lower()


def test_truncated_signed_png_is_now_400(client):
    """H-4 FIXED: a payload with a real PNG signature but malformed chunks raises
    OSError during decode; the handler now maps all PIL decode errors
    (UnidentifiedImageError/OSError/DecompressionBombError) to 400, not 500."""
    c, _ = client
    signed_but_malformed = b"\x89PNG\r\n\x1a\n garbage not a real png"
    r = _post(c, signed_but_malformed, "evil.png", "image/png")
    assert r.status_code == 400


def test_corrupted_exif_does_not_crash_server(client):
    """A JPEG whose bytes are mangled mid-stream must degrade to a clean 2xx/4xx,
    never a 500 — PIL must not be coerced into an unhandled exception."""
    c, _ = client
    jpeg = _jpeg()
    corrupted = jpeg[:30] + b"\xff\xe1\x00\x10Exif\x00\x00CORRUPTED" + jpeg[30:]
    r = _post(c, corrupted, "exif.jpg", "image/jpeg")
    assert r.status_code in (200, 400), f"unexpected {r.status_code}"
    assert r.status_code != 500


def test_zero_byte_file_rejected_400(client):
    c, _ = client
    r = _post(c, b"", "empty.png", "image/png")
    assert r.status_code == 400


def test_valid_transparent_rgba_png_is_accepted_200(client):
    """A valid (0-alpha) RGBA PNG — the client-removed-background path — is accepted
    and routed to the scanner."""
    c, fake = client
    r = _post(c, _transparent_rgba_png(), "mini.png", "image/png")
    assert r.status_code == 200
    assert r.json()["colors"] == []
    fake.scan.assert_called_once()


def test_inspiration_endpoint_also_rejects_non_image(client):
    c, _ = client
    r = _post(c, b"nope", "x.txt", "text/plain", endpoint="/api/scan/inspiration")
    assert r.status_code == 400


# ===========================================================================
# Memory-safety contract — gc.collect() always runs (OOM prevention)
# ===========================================================================

def test_gc_collect_runs_after_successful_scan(client, monkeypatch):
    c, _ = client
    spy = Mock()
    monkeypatch.setattr(main.gc, "collect", spy)
    r = _post(c, _transparent_rgba_png(), "mini.png", "image/png")
    assert r.status_code == 200
    assert spy.called, "gc.collect() not invoked after a successful scan"


def test_gc_collect_runs_after_failed_scan(client, monkeypatch):
    """Even when the upload is rejected, the `finally` cleanup must still fire —
    a hostile client spamming bad uploads must not leak memory."""
    c, _ = client
    spy = Mock()
    monkeypatch.setattr(main.gc, "collect", spy)
    r = _post(c, b"not an image", "evil.png", "image/png")
    assert r.status_code == 400
    assert spy.called, "gc.collect() not invoked after a rejected scan"


# ===========================================================================
# Rate limiting — flooding trips slowapi's 10/min ceiling
# ===========================================================================

def test_flooding_trips_rate_limit_429(client):
    """With the limiter enabled, a burst beyond 10/min must yield a 429. (Audit H1
    notes this key is spoofable via X-Forwarded-For — a separate, config-level
    weakness not exercised here.)"""
    c, _ = client
    main.limiter.enabled = True
    try:
        statuses = [
            _post(c, b"x", "x.txt", "text/plain").status_code
            for _ in range(15)
        ]
    finally:
        main.limiter.enabled = False
    assert 429 in statuses, f"no 429 after flooding; got {statuses}"
