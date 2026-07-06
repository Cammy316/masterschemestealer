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

import gc
import io
import json
import base64
import sys
import threading
import asyncio
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from PIL import Image, UnidentifiedImageError
Image.MAX_IMAGE_PIXELS = 25_000_000  # Prevent Decompression Bomb OOM crashes (max ~25 megapixels)
import numpy as np
from typing import Optional
from pydantic import BaseModel, Field
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

# Bound concurrent CPU-bound scans so simultaneous uploads can't stack large image
# buffers and OOM the single ~512 MB Render worker (M-9). Default 1; override with
# MAX_CONCURRENT_SCANS if the instance has more headroom.
_MAX_CONCURRENT_SCANS = int(os.environ.get("MAX_CONCURRENT_SCANS", "1"))
_scan_semaphore = asyncio.Semaphore(_MAX_CONCURRENT_SCANS)


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


from utils.limiter import limiter  # shared instance — routers throttle on the same one

app = FastAPI(
    title="SchemeStealer API",
    description="Color detection and paint matching for miniature painters",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://schemestealer.com",
        "https://www.schemestealer.com",
        "https://schemestealer.vercel.app",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"^(http://(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+|localhost):\d+|https://.*\.vercel\.app)$",
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


@app.get("/health")
async def health():
    """Lightweight liveness probe used by the keep-warm workflow to defeat
    Render's cold start. Intentionally does no I/O or scanner work."""
    return {"status": "ok"}


@app.get("/api/ready")
async def readiness():
    """
    Readiness probe for the frontend warm-up screen.
    Returns ready=true once both scanners have finished initialising.
    """
    ready = _scanner_ready.is_set() and _miniature_scanner is not None
    from utils.supabase_client import supabase_enabled
    return {
        "ready": ready,
        "miniature_scanner": _miniature_scanner is not None,
        "inspiration_scanner": _inspiration_scanner is not None,
        "message": "Scanners ready" if ready else "Warming up machine spirit, please wait...",
        "persistence": "supabase" if supabase_enabled() else "ephemeral_files",
    }


_paints_cache: list | None = None

@app.get("/api/paints")
async def get_paints():
    global _paints_cache
    try:
        if _paints_cache is None:
            from core.schemestealer_engine import resolve_paint_db_path
            with open(resolve_paint_db_path(), 'r') as f:
                _paints_cache = json.load(f)
        return {"paints": _paints_cache}
    except Exception as e:
        logger.error(f"Error loading paints: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load paint database")


_MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


def _reject_oversize(request: Request) -> None:
    """Reject an over-limit upload from the Content-Length header BEFORE the body
    is buffered into memory — guards the single Render worker against OOM (H-2)."""
    cl = request.headers.get("content-length")
    if cl is not None and cl.isdigit() and int(cl) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit.")


def _validate_upload(file: UploadFile, contents: bytes) -> None:
    if not (file.content_type or "").startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")
    if len(contents) > _MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit.")


@app.post("/api/scan/miniature")
@limiter.limit("10/minute")
async def scan_miniature(request: Request, file: UploadFile = File(...)):
    """
    Scan a painted miniature to detect colors.
    Background removal is done client-side, so the upload must be a transparent
    (RGBA) PNG; detects 3-5 dominant colors.
    """
    await _await_scanner_ready()

    if _miniature_scanner is None:
        raise HTTPException(status_code=503, detail="Scanner failed to initialise. Please try again.")

    image = None
    contents = None
    try:
        _reject_oversize(request)
        contents = await file.read()
        _validate_upload(file, contents)

        try:
            image = Image.open(io.BytesIO(contents))
            # The engine requires a client-removed background (alpha channel). A
            # plain RGB image would crash downstream, so reject it cleanly (C-3).
            if image.mode != 'RGBA':
                raise HTTPException(
                    status_code=400,
                    detail="Miniature image must have its background removed (upload a transparent PNG).",
                )
            image.thumbnail((1024, 1024))  # optimise memory/CPU early
        except HTTPException:
            raise
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
            # Any PIL decode failure is a bad upload, not a server fault (H-4).
            logger.warning(f"Invalid image file uploaded: {file.filename}")
            raise HTTPException(status_code=400, detail="Invalid image file format.")

        logger.info(f"Processing miniature scan: {file.filename}, size: {image.size}, mode: {image.mode}")

        loop = asyncio.get_running_loop()
        async with _scan_semaphore:
            result = await loop.run_in_executor(None, _miniature_scanner.scan, image)

        logger.info(f"Miniature scan complete: {len(result['colors'])} colors detected")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Miniature scan error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Scan processing failed.")
    finally:
        # Aggressive memory cleanup
        image = None
        contents = None
        gc.collect()


@app.post("/api/scan/inspiration")
@limiter.limit("10/minute")
async def scan_inspiration(request: Request, file: UploadFile = File(...)):
    """
    Extract color palette from any image for inspiration.
    No background removal — analyses entire image.
    """
    await _await_scanner_ready()

    if _inspiration_scanner is None:
        raise HTTPException(status_code=503, detail="Scanner failed to initialise. Please try again.")

    image = None
    contents = None
    try:
        _reject_oversize(request)
        contents = await file.read()
        _validate_upload(file, contents)

        try:
            image = Image.open(io.BytesIO(contents))
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image.thumbnail((1024, 1024))  # optimise memory/CPU early
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
            # Any PIL decode failure is a bad upload, not a server fault (H-4).
            logger.warning(f"Invalid image file uploaded: {file.filename}")
            raise HTTPException(status_code=400, detail="Invalid image file format.")

        logger.info(f"Processing inspiration scan: {file.filename}, size: {image.size}")

        loop = asyncio.get_running_loop()
        async with _scan_semaphore:
            result = await loop.run_in_executor(None, _inspiration_scanner.scan, image)

        logger.info(f"Inspiration scan complete: {len(result['colors'])} colors detected")
        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Inspiration scan error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Scan processing failed.")
    finally:
        # Aggressive memory cleanup
        image = None
        contents = None
        gc.collect()


class SimpleFeedback(BaseModel):
    scanId: str
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = Field(default=None, max_length=2000)


@app.post("/api/feedback")
@limiter.limit("20/minute")
async def submit_feedback(request: Request, feedback: SimpleFeedback):
    # Validated payload + rate limited. Do NOT log the free-text comment (PII) —
    # record only that feedback arrived (M-2).
    logger.info(f"Feedback received for scan {feedback.scanId} (rating={feedback.rating})")
    return {"status": "success", "message": "Feedback recorded"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
