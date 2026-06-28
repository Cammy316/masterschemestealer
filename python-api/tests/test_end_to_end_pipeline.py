import pytest
from fastapi.testclient import TestClient
import numpy as np
import cv2
import io
import sys
import os
from PIL import Image

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app, _prewarm, _scanner_ready

@pytest.fixture(scope="module", autouse=True)
def prewarm_scanners():
    # Pre-warm scanners synchronously for testing
    _prewarm()
    _scanner_ready.wait(timeout=10)
    yield

client = TestClient(app)

def create_synthetic_miniature(degradation="none"):
    """
    Generate a synthetic miniature image.
    Contains gradients (armor), thin details (highlights/chains), and background.
    """
    # 300x300 image
    img = np.zeros((300, 300, 3), dtype=np.uint8)
    
    # Background (white-ish)
    img[:] = [240, 240, 245]
    
    # Main body: Red gradient (left to right)
    for i in range(100, 200):
        # 50 to 200 intensity red
        intensity = int(50 + (i - 100) * 1.5)
        img[100:250, i] = [intensity, 20, 20]
        
    # Detail: Thin gold chain (1 pixel wide)
    for i in range(150, 180):
        img[i, 150] = [255, 215, 0] # Gold
        
    # Detail: Edge highlight on the red armor (bright red)
    img[100:250, 199] = [255, 80, 80]
    
    # Apply user/camera environmental factors
    if degradation == "blur":
        # Out of focus camera
        img = cv2.GaussianBlur(img, (5, 5), 0)
    elif degradation == "noise":
        # Low light high ISO noise
        noise = np.random.randint(-30, 30, img.shape, dtype=np.int16)
        img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    elif degradation == "tint":
        # Bad white balance (yellowish indoor lighting)
        img = img.astype(float)
        img[:, :, 0] += 30 # R
        img[:, :, 1] += 20 # G
        img = np.clip(img, 0, 255).astype(np.uint8)
        
    # Convert to RGBA bytes (as required by the engine's precomputed_rgba requirement)
    img_rgba = np.zeros((300, 300, 4), dtype=np.uint8)
    img_rgba[:, :, :3] = img
    img_rgba[:, :, 3] = 255 # fully opaque
    
    pil_img = Image.fromarray(img_rgba)
    buf = io.BytesIO()
    pil_img.save(buf, format='PNG')
    return buf.getvalue()

@pytest.mark.parametrize("degradation", ["none", "blur", "noise", "tint"])
def test_miniature_scan_pipeline(degradation):
    image_bytes = create_synthetic_miniature(degradation)
    
    # 1. Test the scan endpoint
    response = client.post(
        "/api/scan/miniature",
        files={"file": ("synthetic.png", image_bytes, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "colors" in data
    
    colors = data["colors"]
    assert len(colors) > 0, f"No colors extracted under {degradation} conditions"
    
    # Verify recipes are generated and mask strings are present
    for color in colors:
        assert "paintRecipe" in color
        assert "family" in color
        assert "reticle" in color
        assert color["reticle"] is None or color["reticle"].startswith("/9j/") or color["reticle"].startswith("iVBORw0KGgo") or len(color["reticle"]) > 10

    scan_id = data.get("scan_id", f"test_{degradation}")
    ml_payload = {
        "scan": {
            "scan_id": scan_id,
            "session_id": "test_session",
            "mode": "miniature",
            "timestamp": "2026-06-28T00:00:00Z",
            "processing_time_ms": 150,
            "image_width": 300,
            "image_height": 300,
            "image_size_bytes": len(image_bytes),
            "num_colours_detected": len(colors),
            "dominant_colour_hex": "#ff0000",
            "colour_harmony_type": "unknown",
            "overall_brightness": 0.5,
            "overall_contrast": 0.5
        },
        "colours": []
    }
    
    for idx, c in enumerate(colors):
        ml_payload["colours"].append({
            "scan_id": scan_id,
            "colour_index": idx,
            "r": c["rgb"][0], "g": c["rgb"][1], "b": c["rgb"][2],
            "h": 0.5, "s": 0.5, "v": 0.5,
            "l": c["lab"][0], "a": c["lab"][1], "b_lab": c["lab"][2],
            "chroma": 10.0,
            "coverage_percent": c.get("percentage", 10.0),
            "family_predicted": c["family"],
            "is_metallic": False,
            "is_detail": False,
            "confidence": 0.9,
        })
        
    ml_response = client.post("/api/ml/log-scan", json=ml_payload)
    assert ml_response.status_code == 200
    ml_data = ml_response.json()
    assert ml_data["status"] == "success"
    assert "colours_logged" in ml_data
    assert ml_data["colours_logged"] == len(colors)

def test_invalid_image_upload_returns_400():
    fake_image_bytes = b"This is not a real image file, just text data."
    
    response = client.post(
        "/api/scan/miniature",
        files={"file": ("fake.png", fake_image_bytes, "image/png")}
    )
    
    assert response.status_code == 400
    assert "Invalid image file format" in response.json()["detail"]
