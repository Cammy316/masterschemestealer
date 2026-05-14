"""
FastAPI backend for SchemeStealer
Provides color detection endpoints for both Miniscan and Inspiration modes
"""

import io
import json
import base64
import os
import sys
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

# Services are lazy-initialised on first request so uvicorn can bind to the
# port immediately without waiting for onnxruntime/rembg/opencv to load.
_miniature_scanner = None
_inspiration_scanner = None


def _get_miniature_scanner():
    global _miniature_scanner
    if _miniature_scanner is None:
        logger.info("Lazy-loading miniature scanner (first request)...")
        from services.miniature_scanner import MiniatureScannerService
        _miniature_scanner = MiniatureScannerService()
        logger.info("Miniature scanner ready")
    return _miniature_scanner


def _get_inspiration_scanner():
    global _inspiration_scanner
    if _inspiration_scanner is None:
        logger.info("Lazy-loading inspiration scanner (first request)...")
        from services.inspiration_scanner import InspirationScannerService
        _inspiration_scanner = InspirationScannerService()
        logger.info("Inspiration scanner ready")
    return _inspiration_scanner


# Initialize FastAPI app
app = FastAPI(
    title="SchemeStealer API",
    description="Color detection and paint matching for miniature painters",
    version="1.0.0",
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ml_data_router)
app.include_router(analytics_router)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "SchemeStealer API is running",
        "version": "1.0.0"
    }


@app.get("/api/paints")
async def get_paints():
    """Get all paints from the database"""
    try:
        with open('paints.json', 'r') as f:
            paints = json.load(f)
        return {"paints": paints}
    except Exception as e:
        logger.error(f"Error loading paints: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load paint database")


@app.post("/api/scan/miniature")
async def scan_miniature(file: UploadFile = File(...)):
    """
    Scan a painted miniature to detect colors.
    Removes background using rembg, detects 3-5 dominant colors.
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')

        logger.info(f"Processing miniature scan: {file.filename}, size: {image.size}")
        result = _get_miniature_scanner().scan(image)
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
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')

        logger.info(f"Processing inspiration scan: {file.filename}, size: {image.size}")
        result = _get_inspiration_scanner().scan(image)
        logger.info(f"Inspiration scan complete: {len(result['colors'])} colors detected")
        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"Inspiration scan error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process inspiration scan: {str(e)}")


@app.post("/api/feedback")
async def submit_feedback(feedback: Dict[str, Any]):
    """Log user feedback about scan accuracy"""
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
