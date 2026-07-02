"""
Batch-log contract test (production regression fix).

The frontend's mlDataLogger builds ColourFeatures from a scan response and
POSTs them to /api/ml/batch-log. In production every scan/colour batch
returned 422 — the logger sent h in degrees and s/v in percent while the
schema demands 0-1 fractions — so colour features were never logged (the
retry queue burned 6 attempts per batch, the exact pattern in the Render
logs). This test walks the full path with the FIXED field mapping: real
scan through the API → payload built exactly as mlDataLogger builds it →
batch-log must accept it and log every colour.

Requires real OpenCV (full scan pipeline): run with USE_REAL_CV2=1.
"""

import colorsys
import io
import os
import sys
from pathlib import Path

import numpy as np
import pytest

if not os.environ.get("USE_REAL_CV2"):
    pytest.skip("requires real OpenCV — run the suite with USE_REAL_CV2=1",
                allow_module_level=True)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient  # noqa: E402
from PIL import Image  # noqa: E402

import main  # noqa: E402
from tests.test_end_to_end_pipeline import create_synthetic_miniature  # noqa: E402


@pytest.fixture(scope="module")
def client():
    main._prewarm()
    main._scanner_ready.wait(timeout=30)
    return TestClient(main.app)


def _scan_colours(client) -> list:
    png_bytes = create_synthetic_miniature()
    arr = np.asarray(Image.open(io.BytesIO(png_bytes)).convert("RGB"))
    rgba = np.dstack([arr, np.full(arr.shape[:2], 255, dtype=np.uint8)])
    buf = io.BytesIO()
    Image.fromarray(rgba, "RGBA").save(buf, format="PNG")
    buf.seek(0)
    r = client.post("/api/scan/miniature",
                    files={"file": ("t.png", buf, "image/png")})
    assert r.status_code == 200
    colours = r.json().get("colors", [])
    assert colours, "scan produced no colours — cannot exercise batch-log"
    return colours


def _frontend_payload(colours: list) -> dict:
    """The batch payload EXACTLY as lib/mlDataLogger.ts builds it (with the
    0-1 h/s/v fix). If this drifts from the frontend, update both together."""
    colour_features = []
    for i, c in enumerate(colours):
        rgb = c.get("rgb", [0, 0, 0])
        lab = c.get("lab", [50.0, 0.0, 0.0])
        h, s, v = colorsys.rgb_to_hsv(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
        colour_features.append({
            "scan_id": "test-batchlog", "colour_index": i,
            "r": rgb[0], "g": rgb[1], "b": rgb[2],
            "h": h, "s": s, "v": v,
            "l": lab[0], "a": lab[1], "b_lab": lab[2],
            "chroma": float(np.hypot(lab[1], lab[2])),
            "coverage_percent": c.get("percentage") or 0,
            "family_predicted": c.get("family") or "unknown",
            "is_metallic": False,
            "is_detail": (c.get("percentage") or 0) < 10,
            "confidence": 1.0,
            "top_paint_name": None, "top_paint_brand": None,
            "top_paint_delta_e": None,
        })
    return {"scans": [{
        "scan": {
            "scan_id": "test-batchlog", "user_id": None,
            "session_id": "test-session", "mode": "miniature",
            "timestamp": "2026-07-02T20:00:00Z", "processing_time_ms": 1234,
            "image_width": 300, "image_height": 300,
            "image_size_bytes": 10000,
            "num_colours_detected": len(colours),
            "dominant_colour_hex": colours[0].get("hex", "#000000"),
            "colour_harmony_type": "complementary",
            "overall_brightness": 50.0, "overall_contrast": 10.0,
            "analysis_source": "backend",
        },
        "colours": colour_features,
        "behaviour": {"scan_id": "test-batchlog",
                      "session_id": "test-session",
                      "scanned_again_same_image": False},
    }], "behaviours": [], "feedbacks": []}


def test_scan_batch_log_round_trip_is_accepted(client):
    """Why it matters: a schema mismatch here silently destroys the ML data
    collection pipeline — every colour of every scan is rejected with 422
    and dropped after the retry budget."""
    colours = _scan_colours(client)
    payload = _frontend_payload(colours)

    r = client.post("/api/ml/batch-log", json=payload)
    assert r.status_code == 200, f"batch-log rejected the payload: {r.text}"
    body = r.json()
    assert body["scans_logged"] == 1
    assert body["colours_logged"] == len(colours)
    assert body["behaviours_logged"] == 1


def test_hsv_boundary_values_are_accepted(client):
    """h/s/v are 0-1 fractions; the exact boundaries must validate (a pure
    red has h=0.0, a fully saturated bright colour has s=v=1.0)."""
    colours = _scan_colours(client)
    payload = _frontend_payload(colours)
    payload["scans"][0]["colours"][0].update(h=1.0, s=1.0, v=1.0)
    payload["scans"][0]["scan"]["scan_id"] = "test-batchlog-bounds"
    for c in payload["scans"][0]["colours"]:
        c["scan_id"] = "test-batchlog-bounds"
    payload["scans"][0]["behaviour"]["scan_id"] = "test-batchlog-bounds"

    r = client.post("/api/ml/batch-log", json=payload)
    assert r.status_code == 200, f"boundary h/s/v rejected: {r.text}"
