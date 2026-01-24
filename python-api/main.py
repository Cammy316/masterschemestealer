"""
FastAPI backend for SchemeStealer
Provides color detection endpoints for both Miniscan and Inspiration modes
"""

import io
import json
import base64
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
from typing import List, Dict, Any
import logging

from services.miniature_scanner import MiniatureScannerService
from services.inspiration_scanner import InspirationScannerService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Security Configuration
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_IMAGE_DIMENSION = 4096
ALLOWED_MIME_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/heic'}


async def validate_image_upload(file: UploadFile = File(...)) -> bytes:
    """Validate uploaded image for security"""

    # Check content type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(400, f"Invalid file type: {file.content_type}. Allowed: JPEG, PNG, WebP, HEIC")

    # Read with size limit
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(413, f"File too large. Max: {MAX_FILE_SIZE // (1024*1024)}MB")

    # Validate it's actually an image
    try:
        image = Image.open(io.BytesIO(contents))
        image.verify()

        # Re-open for dimension check (verify() closes the image)
        image = Image.open(io.BytesIO(contents))
        width, height = image.size

        if width > MAX_IMAGE_DIMENSION or height > MAX_IMAGE_DIMENSION:
            raise HTTPException(400, f"Image too large. Max: {MAX_IMAGE_DIMENSION}px")

        if width < 100 or height < 100:
            raise HTTPException(400, "Image too small. Min: 100px")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"Invalid image file: {str(e)}")

    return contents


# Initialize FastAPI app
app = FastAPI(
    title="SchemeStealer API",
    description="Color detection and paint matching for miniature painters",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://192.168.0.95:3000",  # Allow network access from frontend
        "*",  # Allow all origins for testing (remove in production)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
miniature_scanner = MiniatureScannerService()
inspiration_scanner = InspirationScannerService()


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
        with open('../SchemeStealer/paints.json', 'r') as f:
            paints = json.load(f)
        return {"paints": paints}
    except Exception as e:
        logger.error(f"Error loading paints: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load paint database")


@app.post("/api/scan/miniature")
async def scan_miniature(contents: bytes = Depends(validate_image_upload)):
    """
    Scan a painted miniature to detect colors
    - Removes background using rembg
    - Detects 3-5 dominant colors on the miniature
    - Returns paint recommendations (v3.0 with triads)
    """
    try:
        # Image already validated by dependency
        image = Image.open(io.BytesIO(contents))

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')

        logger.info(f"Processing miniature scan, size: {image.size}")

        # Process with miniature scanner (includes background removal)
        result = miniature_scanner.scan(image)

        logger.info(f"Miniature scan complete: {len(result['colors'])} colors detected")

        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"Miniature scan error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process miniature scan: {str(e)}"
        )


@app.post("/api/scan/inspiration")
async def scan_inspiration(contents: bytes = Depends(validate_image_upload)):
    """
    Extract color palette from any image for inspiration
    - NO background removal (analyzes entire image)
    - Detects 5-8 dominant colors
    - Returns paint recommendations (v3.0 with triads)
    """
    try:
        # Image already validated by dependency
        image = Image.open(io.BytesIO(contents))

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')

        logger.info(f"Processing inspiration scan, size: {image.size}")

        # Process with inspiration scanner (NO background removal)
        result = inspiration_scanner.scan(image)

        logger.info(f"Inspiration scan complete: {len(result['colors'])} colors detected")

        return JSONResponse(content=result)

    except Exception as e:
        logger.error(f"Inspiration scan error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process inspiration scan: {str(e)}"
        )


@app.post("/api/feedback")
async def submit_feedback(feedback: Dict[str, Any]):
    """
    Log user feedback about scan accuracy
    """
    try:
        logger.info(f"Feedback received: {feedback}")
        # TODO: Implement feedback logging to file or database
        return {"status": "success", "message": "Feedback recorded"}
    except Exception as e:
        logger.error(f"Feedback error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to record feedback")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
