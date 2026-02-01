"""
ML Data Logging Routes
Endpoints for collecting training data for future ML models
Captures scan features, colour features, and behavioural signals
"""

import os
import json
import csv
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

# ============================================================================
# Data Models
# ============================================================================

class ScanLevelFeatures(BaseModel):
    scan_id: str
    user_id: Optional[str] = None
    session_id: str
    mode: str  # 'miniature' | 'inspiration'
    timestamp: str
    processing_time_ms: int
    image_width: int
    image_height: int
    image_size_bytes: int
    num_colours_detected: int
    dominant_colour_hex: str
    colour_harmony_type: str
    overall_brightness: float
    overall_contrast: float


class ColourFeatures(BaseModel):
    scan_id: str
    colour_index: int
    # RGB
    r: int
    g: int
    b: int
    # HSV
    h: float
    s: float
    v: float
    # LAB
    l: float
    a: float
    b_lab: float
    # Derived
    chroma: float
    coverage_percent: float
    family_predicted: str
    is_metallic: bool
    is_detail: bool
    confidence: float
    # Top paint match
    top_paint_name: Optional[str] = None
    top_paint_brand: Optional[str] = None
    top_paint_delta_e: Optional[float] = None


class BehaviouralSignals(BaseModel):
    scan_id: str
    session_id: str
    time_on_results_ms: Optional[int] = None
    paints_added_to_cart: Optional[List[str]] = None
    paints_removed_from_cart: Optional[List[str]] = None
    affiliate_links_clicked: Optional[List[Dict[str, str]]] = None
    shared_scheme: Optional[bool] = None
    saved_to_library: Optional[bool] = None
    scanned_again_same_image: Optional[bool] = None


class FeedbackData(BaseModel):
    scan_id: str
    session_id: str
    colour_index: Optional[int] = None
    feedback_type: str  # 'accuracy' | 'correction' | 'rating'
    original_value: Optional[str] = None
    corrected_value: Optional[str] = None
    rating: Optional[int] = None
    comment: Optional[str] = None
    timestamp: str


class MLLogBatch(BaseModel):
    scan: ScanLevelFeatures
    colours: List[ColourFeatures]
    behaviour: Optional[BehaviouralSignals] = None


class BatchLogRequest(BaseModel):
    scans: Optional[List[MLLogBatch]] = []
    behaviours: Optional[List[BehaviouralSignals]] = []
    feedbacks: Optional[List[FeedbackData]] = []


class MLStats(BaseModel):
    total_scans: int
    total_colours: int
    total_feedback: int
    total_behaviour_logs: int
    scans_by_mode: Dict[str, int]
    scans_today: int
    unique_sessions: int


# ============================================================================
# File Storage Helpers
# ============================================================================

# Data directories
DATA_BASE_DIR = Path(__file__).parent.parent / "data" / "ml"
SCANS_DIR = DATA_BASE_DIR / "scans"
COLOURS_CSV = DATA_BASE_DIR / "colours" / "colours_training.csv"
FEEDBACK_DIR = DATA_BASE_DIR / "feedback"
BEHAVIOUR_DIR = DATA_BASE_DIR / "behaviour"


def ensure_directories():
    """Create data directories if they don't exist"""
    SCANS_DIR.mkdir(parents=True, exist_ok=True)
    COLOURS_CSV.parent.mkdir(parents=True, exist_ok=True)
    FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
    BEHAVIOUR_DIR.mkdir(parents=True, exist_ok=True)


def save_scan_json(scan_data: ScanLevelFeatures, colours: List[ColourFeatures]):
    """Save scan data as JSON file"""
    ensure_directories()

    filename = f"{scan_data.scan_id}.json"
    filepath = SCANS_DIR / filename

    data = {
        "scan": scan_data.model_dump(),
        "colours": [c.model_dump() for c in colours],
        "saved_at": datetime.utcnow().isoformat()
    }

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    logger.info(f"Saved scan data: {filepath}")


def append_colours_csv(colours: List[ColourFeatures]):
    """Append colour features to CSV for ML training"""
    ensure_directories()

    # CSV columns
    fieldnames = [
        'scan_id', 'colour_index', 'r', 'g', 'b', 'h', 's', 'v',
        'l', 'a', 'b_lab', 'chroma', 'coverage_percent', 'family_predicted',
        'is_metallic', 'is_detail', 'confidence',
        'top_paint_name', 'top_paint_brand', 'top_paint_delta_e'
    ]

    file_exists = COLOURS_CSV.exists()

    with open(COLOURS_CSV, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        if not file_exists:
            writer.writeheader()

        for colour in colours:
            row = colour.model_dump()
            writer.writerow(row)

    logger.info(f"Appended {len(colours)} colours to CSV")


def save_feedback_json(feedback: FeedbackData):
    """Save feedback as JSON file"""
    ensure_directories()

    filename = f"{feedback.scan_id}_{feedback.timestamp.replace(':', '-')}.json"
    filepath = FEEDBACK_DIR / filename

    data = feedback.model_dump()
    data['saved_at'] = datetime.utcnow().isoformat()

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    logger.info(f"Saved feedback: {filepath}")


def save_behaviour_json(behaviour: BehaviouralSignals):
    """Save behavioural data as JSON file"""
    ensure_directories()

    # Use scan_id + timestamp for unique filename
    timestamp = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    filename = f"{behaviour.scan_id}_{timestamp}.json"
    filepath = BEHAVIOUR_DIR / filename

    data = behaviour.model_dump()
    data['saved_at'] = datetime.utcnow().isoformat()

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

    logger.info(f"Saved behaviour: {filepath}")


def get_stats() -> MLStats:
    """Calculate statistics about collected ML data"""
    ensure_directories()

    # Count scans
    scan_files = list(SCANS_DIR.glob("*.json"))
    total_scans = len(scan_files)

    # Count by mode and unique sessions
    scans_by_mode = {"miniature": 0, "inspiration": 0}
    sessions = set()
    today = datetime.utcnow().date().isoformat()
    scans_today = 0

    for scan_file in scan_files:
        try:
            with open(scan_file, 'r') as f:
                data = json.load(f)
                scan = data.get('scan', {})
                mode = scan.get('mode', 'unknown')
                if mode in scans_by_mode:
                    scans_by_mode[mode] += 1
                sessions.add(scan.get('session_id', ''))

                # Check if scan was today
                timestamp = scan.get('timestamp', '')
                if timestamp.startswith(today):
                    scans_today += 1
        except Exception as e:
            logger.warning(f"Error reading scan file {scan_file}: {e}")

    # Count colours from CSV
    total_colours = 0
    if COLOURS_CSV.exists():
        with open(COLOURS_CSV, 'r', encoding='utf-8') as f:
            total_colours = sum(1 for _ in f) - 1  # Subtract header
            if total_colours < 0:
                total_colours = 0

    # Count feedback files
    feedback_files = list(FEEDBACK_DIR.glob("*.json"))
    total_feedback = len(feedback_files)

    # Count behaviour files
    behaviour_files = list(BEHAVIOUR_DIR.glob("*.json"))
    total_behaviour = len(behaviour_files)

    return MLStats(
        total_scans=total_scans,
        total_colours=total_colours,
        total_feedback=total_feedback,
        total_behaviour_logs=total_behaviour,
        scans_by_mode=scans_by_mode,
        scans_today=scans_today,
        unique_sessions=len(sessions)
    )


# ============================================================================
# Router
# ============================================================================

router = APIRouter(prefix="/api/ml", tags=["ML Data Collection"])


@router.post("/log-scan")
async def log_scan(data: MLLogBatch):
    """
    Log a complete scan with all features
    - Saves scan metadata as JSON
    - Appends colour features to CSV for ML training
    """
    try:
        # Save scan data
        save_scan_json(data.scan, data.colours)

        # Append colours to CSV
        append_colours_csv(data.colours)

        # Save behaviour if present
        if data.behaviour:
            save_behaviour_json(data.behaviour)

        return {
            "status": "success",
            "scan_id": data.scan.scan_id,
            "colours_logged": len(data.colours)
        }

    except Exception as e:
        logger.error(f"Error logging scan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to log scan: {str(e)}")


@router.post("/log-feedback")
async def log_feedback(feedback: FeedbackData):
    """
    Log user feedback about scan accuracy
    - Corrections to colour family predictions
    - Ratings of paint recommendations
    """
    try:
        save_feedback_json(feedback)

        return {
            "status": "success",
            "scan_id": feedback.scan_id,
            "feedback_type": feedback.feedback_type
        }

    except Exception as e:
        logger.error(f"Error logging feedback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to log feedback: {str(e)}")


@router.post("/log-behavior")
async def log_behaviour(behaviour: BehaviouralSignals):
    """
    Log behavioural signals
    - Time on results page
    - Cart actions (add/remove)
    - Affiliate link clicks
    - Share/save actions
    """
    try:
        save_behaviour_json(behaviour)

        return {
            "status": "success",
            "scan_id": behaviour.scan_id
        }

    except Exception as e:
        logger.error(f"Error logging behaviour: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to log behaviour: {str(e)}")


@router.post("/batch-log")
async def batch_log(request: BatchLogRequest):
    """
    Batch endpoint for logging multiple items at once
    Used by frontend to flush queued data
    """
    try:
        results = {
            "scans_logged": 0,
            "colours_logged": 0,
            "behaviours_logged": 0,
            "feedbacks_logged": 0
        }

        # Process scans
        for scan_batch in (request.scans or []):
            save_scan_json(scan_batch.scan, scan_batch.colours)
            append_colours_csv(scan_batch.colours)
            results["scans_logged"] += 1
            results["colours_logged"] += len(scan_batch.colours)

            if scan_batch.behaviour:
                save_behaviour_json(scan_batch.behaviour)
                results["behaviours_logged"] += 1

        # Process standalone behaviours
        for behaviour in (request.behaviours or []):
            save_behaviour_json(behaviour)
            results["behaviours_logged"] += 1

        # Process feedbacks
        for feedback in (request.feedbacks or []):
            save_feedback_json(feedback)
            results["feedbacks_logged"] += 1

        logger.info(f"Batch log results: {results}")

        return {
            "status": "success",
            **results
        }

    except Exception as e:
        logger.error(f"Error in batch log: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to batch log: {str(e)}")


@router.get("/stats", response_model=MLStats)
async def get_ml_stats():
    """
    Get statistics about collected ML training data
    - Total scans, colours, feedback entries
    - Breakdown by mode
    - Today's activity
    """
    try:
        stats = get_stats()
        return stats

    except Exception as e:
        logger.error(f"Error getting stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")


@router.get("/health")
async def ml_health():
    """Health check for ML data endpoints"""
    ensure_directories()
    return {
        "status": "ok",
        "directories_exist": {
            "scans": SCANS_DIR.exists(),
            "colours": COLOURS_CSV.parent.exists(),
            "feedback": FEEDBACK_DIR.exists(),
            "behaviour": BEHAVIOUR_DIR.exists()
        }
    }
