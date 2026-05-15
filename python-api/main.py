"""
FastAPI backend for SchemeStealer
Provides color detection endpoints for both Miniscan and Inspiration modes
"""

import os

# Force onnxruntime to use CPU only — prevents device_discovery.cc from
# hanging indefinitely on Render's shared Linux containers which have no GPU
# but expose partial /sys/class/drm paths that cause the C++ scan to block.
os.environ.setdefault("CUDA_VISIBLE_DEVICES", "")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault(
    "ORT_DISABLE_PROVIDERS",
    "TensorrtExecutionProvider,CUDAExecutionProvider,MIGraphXExecutionProvider",
)

import io
import json
import base64
import sys
import threading
import asyncio
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
from typing import List, Dict, Any
import logging

# Ensure CWD is the directory containing main.py so relative paths work
os.chdir(Path(__file__).parent)

from routes.ml_data import router as ml_data_router
from routes.analytics import router as analytics_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# Scanner pre-warm
# Both scanners are initialised in a background thread immediately at startup
# so the port binds instantly but the scanners are ready before any user scans.
# Scan endpoints wait on _scanner_ready before proceeding.
# ============================================================================

_miniature_scanner = None
_inspiration_scanner = None
_scanner_ready = threading.Event()


def _prewarm():
    global _miniature_scanner, _inspiration_scanner
    try:
        logger.info("Pre-warming miniature scanner...")
        from services.miniature_scanner import MiniatureScannerService
        _miniature_scanner = MiniatureScannerService()
        logger.info("Miniature scanner ready")

        logger.info("Pre-warming inspiration scanner...")
        from services.inspiration_scanner import InspirationScannerService
        _inspiration_scanner = InspirationScannerService()
        logger.info("Inspiration scanner ready")
    except Exception as e:
        logger.error(f"Scanner pre-warm failed: {e}", exc_info=True)
    finally:
        _scanner_ready.set()


async def _await_scanner_ready(timeout: int = 250):
    """Yield to the event loop while waiting for the background init thread."""
    if not _scanner_ready.is_set():
        logger.info("Scan requested while scanner still initialising — waiting...")
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _scanner_ready.wait, timeout)


# ============================================================================
# App
# lifespan ensures the pre-warm thread starts inside the ASGI worker process,
# not in the gunicorn master. Threads do not survive a fork, so starting the
# thread at module level (which runs in the master) means the worker never
# has a warm scanner.
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    t = threading.Thread(target=_prewarm, daemon=True, name="scanner-prewarm")
    t.start()
    yield


app = FastAPI(
    title="SchemeStealer API",
    description="Color detection and paint matching for miniature painters",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ml_data_router)
app.include_router(analytics_router)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "SchemeStealer API is running",
        "version": "1.0.0",
    }


@app.get("/api/ready")
async def readiness():
    """
    Readiness probe for the frontend warm-up screen.
    Returns ready=true once both scanners have finished initialising.
    """
    ready = _scanner_ready.is_set() and _miniature_scanner is not None
    return {
        "ready": ready,
        "miniature_scanner": _miniature_scanner is not None,
        "inspiration_scanner": _inspiration_scanner is not None,
        "message": "Scanners ready" if ready else "Warming up machine spirit, please wait...",
    }


_paints_cache: list | None = None

@app.get("/api/paints")
async def get_paints():
    global _paints_cache
    try:
        if _paints_cache is None:
            with open('paints.json', 'r') as f:
                _paints_cache = json.load(f)
        return {"paints": _paints_cache}
    except Exception as e:
        logger.error(f"Error loading paints: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load paint database")


@app.post("/api/scan/miniature")
async def scan_miniature(file: UploadFile = File(...)):
    """
    Scan a painted miniature to detect colors.
    Removes background using rembg, detects 3-5 dominant colors.
    """
    await _await_scanner_ready()

    if _miniature_scanner is None:
        raise HTTPException(status_code=503, detail="Scanner failed to initialise. Please try again.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')

        logger.info(f"Processing miniature scan: {file.filename}, size: {image.size}")
        result = _miniature_scanner.scan(image)
        logger.info(f"Miniature scan complete: {len(result['colors'])} colors detected")
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"Miniature scan error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process miniature scan: {str(e)}")


@app.post("/api/scan/inspiration")
async def scan_inspiration(file: UploadFile = File(...)):
    """
    Extract color palette from any image for inspiration.
    No background removal — analyses entire image.
    """
    await _await_scanner_ready()

    if _inspiration_scanner is None:
        raise HTTPException(status_code=503, detail="Scanner failed to initialise. Please try again.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')

        logger.info(f"Processing inspiration scan: {file.filename}, size: {image.size}")
        result = _inspiration_scanner.scan(image)
        logger.info(f"Inspiration scan complete: {len(result['colors'])} colors detected")
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"Inspiration scan error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process inspiration scan: {str(e)}")


@app.post("/api/feedback")
async def submit_feedback(feedback: Dict[str, Any]):
    try:
        logger.info(f"Feedback received: {feedback}")
        return {"status": "success", "message": "Feedback recorded"}
    except Exception as e:
        logger.error(f"Feedback error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to record feedback")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
