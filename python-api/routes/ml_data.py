"""
ML Data Logging Routes
Endpoints for collecting training data for future ML models.

Storage strategy:
  - SUPABASE_URL + SUPABASE_SERVICE_KEY set → writes/reads go to Supabase (production)
  - env vars absent → writes/reads go to local JSON/CSV files (local dev)
"""

import os
import json
import csv
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
import logging

from utils.supabase_client import get_supabase, supabase_enabled
from utils.limiter import limiter
from utils.auth import require_admin_key

# Ingest endpoints are client-facing (the browser logs scans/feedback), so a
# secret can't protect them — a per-IP rate limit is the practical guard against
# flooding / training-data poisoning (C-2). The aggregate-stats reads are admin
# only and gated by require_admin_key.
_INGEST_LIMIT = "60/minute"

logger = logging.getLogger(__name__)


# ============================================================================
# Data Models
# ============================================================================

class ScanLevelFeatures(BaseModel):
    scan_id: str
    user_id: Optional[str] = None
    session_id: str
    mode: str
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
    # Which engine produced the scan: 'backend' (default) or 'local' (in-browser
    # fallback). Optional so older payloads without it still validate. Requires a
    # matching `analysis_source` column on the Supabase `ml_scans` table.
    analysis_source: Optional[str] = "backend"


class ColourFeatures(BaseModel):
    scan_id: str
    colour_index: int = Field(ge=0, le=20)
    r: int = Field(ge=0, le=255)
    g: int = Field(ge=0, le=255)
    b: int = Field(ge=0, le=255)
    h: float = Field(ge=0.0, le=1.0)
    s: float = Field(ge=0.0, le=1.0)
    v: float = Field(ge=0.0, le=1.0)
    l: float
    a: float
    b_lab: float
    chroma: float = Field(ge=0.0)
    coverage_percent: float = Field(ge=0.0, le=100.0)
    family_predicted: str
    is_metallic: bool
    is_detail: bool
    confidence: float = Field(ge=0.0, le=1.0)
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


class ColourCorrection(BaseModel):
    colour_index: int
    original_family: str
    was_correct: bool
    corrected_family: Optional[str] = None
    actual_paint_used: Optional[str] = None


FEEDBACK_TYPES = {"colour_correction", "paint_correction", "rating", "issue", "general"}


class FeedbackData(BaseModel):
    scan_id: str
    session_id: str
    colour_index: Optional[int] = Field(default=None, ge=0, le=20)
    feedback_type: str
    original_value: Optional[str] = Field(default=None, max_length=200)
    corrected_value: Optional[str] = Field(default=None, max_length=200)
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    comment: Optional[str] = Field(default=None, max_length=2000)
    timestamp: str


class CompleteFeedback(BaseModel):
    scan_id: str
    session_id: str
    rating: int = Field(ge=1, le=5)
    colour_corrections: List[ColourCorrection] = []
    issue_categories: List[str] = []
    experience_level: Optional[str] = Field(default=None, max_length=50)
    comment: Optional[str] = Field(default=None, max_length=2000)
    email: Optional[str] = Field(default=None, max_length=200)
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


class FeedbackStats(BaseModel):
    total_feedback: int
    feedback_rate: float
    average_rating: float
    rating_distribution: Dict[int, int]
    most_common_issues: Dict[str, int]
    colour_families_corrected: Dict[str, int]
    feedback_today: int
    feedback_with_corrections: int


# ============================================================================
# File storage helpers (local dev)
# ============================================================================

DATA_BASE_DIR = Path(__file__).parent.parent / "data" / "ml"
SCANS_DIR = DATA_BASE_DIR / "scans"
COLOURS_CSV = DATA_BASE_DIR / "colours" / "colours_training.csv"
FEEDBACK_DIR = DATA_BASE_DIR / "feedback"
BEHAVIOUR_DIR = DATA_BASE_DIR / "behaviour"


def _ensure_directories():
    SCANS_DIR.mkdir(parents=True, exist_ok=True)
    COLOURS_CSV.parent.mkdir(parents=True, exist_ok=True)
    FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
    BEHAVIOUR_DIR.mkdir(parents=True, exist_ok=True)


def _save_scan_json(scan_data: ScanLevelFeatures, colours: List[ColourFeatures]):
    _ensure_directories()
    filepath = SCANS_DIR / f"{scan_data.scan_id}.json"
    data = {
        "scan": scan_data.model_dump(),
        "colours": [c.model_dump() for c in colours],
        "saved_at": datetime.utcnow().isoformat(),
    }
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    logger.info(f"Saved scan: {filepath}")


def _append_colours_csv(colours: List[ColourFeatures]):
    _ensure_directories()
    fieldnames = [
        'scan_id', 'colour_index', 'r', 'g', 'b', 'h', 's', 'v',
        'l', 'a', 'b_lab', 'chroma', 'coverage_percent', 'family_predicted',
        'is_metallic', 'is_detail', 'confidence',
        'top_paint_name', 'top_paint_brand', 'top_paint_delta_e',
    ]
    file_exists = COLOURS_CSV.exists()
    with open(COLOURS_CSV, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        for colour in colours:
            writer.writerow(colour.model_dump())
    logger.info(f"Appended {len(colours)} colours to CSV")


def _save_feedback_json(feedback: FeedbackData):
    _ensure_directories()
    filename = f"{feedback.scan_id}_{feedback.timestamp.replace(':', '-')}.json"
    data = feedback.model_dump()
    data['saved_at'] = datetime.utcnow().isoformat()
    with open(FEEDBACK_DIR / filename, 'w') as f:
        json.dump(data, f, indent=2)


def _save_complete_feedback_json(feedback: CompleteFeedback):
    _ensure_directories()
    ts = feedback.timestamp.replace(':', '-').replace('.', '-')
    filename = f"{feedback.scan_id}_{ts}_complete.json"
    ground_truth = [
        {
            'colour_index': c.colour_index,
            'original_family': c.original_family,
            'correct_family': c.corrected_family,
            'actual_paint': c.actual_paint_used,
        }
        for c in feedback.colour_corrections
        if not c.was_correct and c.corrected_family
    ]
    data = feedback.model_dump()
    data['saved_at'] = datetime.utcnow().isoformat()
    data['has_corrections'] = len(feedback.colour_corrections) > 0
    data['ground_truth_labels'] = ground_truth
    with open(FEEDBACK_DIR / filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    logger.info(f"Saved complete feedback with {len(ground_truth)} corrections")


def _save_behaviour_json(behaviour: BehaviouralSignals):
    _ensure_directories()
    ts = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
    filename = f"{behaviour.scan_id}_{ts}.json"
    data = behaviour.model_dump()
    data['saved_at'] = datetime.utcnow().isoformat()
    with open(BEHAVIOUR_DIR / filename, 'w') as f:
        json.dump(data, f, indent=2)


def _get_stats_from_files() -> MLStats:
    _ensure_directories()
    scan_files = list(SCANS_DIR.glob("*.json"))
    scans_by_mode = {"miniature": 0, "inspiration": 0}
    sessions: set = set()
    today = datetime.utcnow().date().isoformat()
    scans_today = 0
    for sf in scan_files:
        try:
            with open(sf) as f:
                data = json.load(f)
            scan = data.get('scan', {})
            mode = scan.get('mode', 'unknown')
            if mode in scans_by_mode:
                scans_by_mode[mode] += 1
            sessions.add(scan.get('session_id', ''))
            if scan.get('timestamp', '').startswith(today):
                scans_today += 1
        except Exception as e:
            logger.warning(f"Error reading {sf}: {e}")

    total_colours = 0
    if COLOURS_CSV.exists():
        with open(COLOURS_CSV, 'r', encoding='utf-8') as f:
            total_colours = max(0, sum(1 for _ in f) - 1)

    return MLStats(
        total_scans=len(scan_files),
        total_colours=total_colours,
        total_feedback=len(list(FEEDBACK_DIR.glob("*.json"))),
        total_behaviour_logs=len(list(BEHAVIOUR_DIR.glob("*.json"))),
        scans_by_mode=scans_by_mode,
        scans_today=scans_today,
        unique_sessions=len(sessions),
    )


def _get_feedback_stats_from_files() -> FeedbackStats:
    _ensure_directories()
    feedback_files = list(FEEDBACK_DIR.glob("*.json"))
    rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    issue_counts: Dict[str, int] = {}
    family_corrections: Dict[str, int] = {}
    sum_ratings = 0
    total_ratings = 0
    feedback_with_corrections = 0
    today = datetime.utcnow().date().isoformat()
    feedback_today = 0

    for fp in feedback_files:
        try:
            with open(fp, 'r', encoding='utf-8') as f:
                data = json.load(f)
            rating = data.get('rating')
            if rating and 1 <= rating <= 5:
                rating_distribution[rating] += 1
                sum_ratings += rating
                total_ratings += 1
            for issue in data.get('issue_categories', []):
                issue_counts[issue] = issue_counts.get(issue, 0) + 1
            for correction in data.get('colour_corrections', []):
                if not correction.get('was_correct') and correction.get('corrected_family'):
                    orig = correction.get('original_family', 'Unknown')
                    family_corrections[orig] = family_corrections.get(orig, 0) + 1
                    feedback_with_corrections += 1
            if data.get('timestamp', '').startswith(today):
                feedback_today += 1
        except Exception as e:
            logger.warning(f"Error reading {fp}: {e}")

    total_scans = len(list(SCANS_DIR.glob("*.json")))
    feedback_rate = (len(feedback_files) / total_scans * 100) if total_scans > 0 else 0

    return FeedbackStats(
        total_feedback=len(feedback_files),
        feedback_rate=round(feedback_rate, 2),
        average_rating=round(sum_ratings / total_ratings, 2) if total_ratings > 0 else 0,
        rating_distribution=rating_distribution,
        most_common_issues=dict(sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)),
        colour_families_corrected=dict(sorted(family_corrections.items(), key=lambda x: x[1], reverse=True)),
        feedback_today=feedback_today,
        feedback_with_corrections=feedback_with_corrections,
    )


# ============================================================================
# Supabase storage helpers (production)
# ============================================================================

def _insert_scan_supabase(scan: ScanLevelFeatures, colours: List[ColourFeatures]):
    sb = get_supabase()
    sb.table("ml_scans").upsert(scan.model_dump(), on_conflict="scan_id").execute()
    if colours:
        colour_rows = [c.model_dump() for c in colours]
        sb.table("ml_colours").insert(colour_rows).execute()
    logger.info(f"Inserted scan {scan.scan_id} to Supabase ({len(colours)} colours)")


def _insert_feedback_supabase(feedback: FeedbackData):
    sb = get_supabase()
    sb.table("ml_feedback").insert({
        **feedback.model_dump(),
        "is_complete": False,
        "has_corrections": False,
    }).execute()


def _insert_complete_feedback_supabase(feedback: CompleteFeedback):
    sb = get_supabase()
    ground_truth = [
        {
            'colour_index': c.colour_index,
            'original_family': c.original_family,
            'correct_family': c.corrected_family,
            'actual_paint': c.actual_paint_used,
        }
        for c in feedback.colour_corrections
        if not c.was_correct and c.corrected_family
    ]
    data = feedback.model_dump()
    sb.table("ml_feedback").insert({
        **data,
        "feedback_type": "complete",
        "is_complete": True,
        "has_corrections": len(feedback.colour_corrections) > 0,
        "ground_truth_labels": ground_truth,
    }).execute()
    logger.info(f"Inserted complete feedback for {feedback.scan_id} ({len(ground_truth)} corrections)")


def _insert_behaviour_supabase(behaviour: BehaviouralSignals):
    sb = get_supabase()
    sb.table("ml_behaviour").insert(behaviour.model_dump()).execute()


def _get_stats_from_supabase() -> MLStats:
    sb = get_supabase()
    scans_resp = sb.table("ml_scans").select("scan_id, mode, session_id, timestamp").execute()
    scans = scans_resp.data or []

    scans_by_mode = {"miniature": 0, "inspiration": 0}
    sessions: set = set()
    today = datetime.utcnow().date().isoformat()
    scans_today = 0
    for s in scans:
        mode = s.get("mode", "unknown")
        if mode in scans_by_mode:
            scans_by_mode[mode] += 1
        sessions.add(s.get("session_id", ""))
        if s.get("timestamp", "").startswith(today):
            scans_today += 1

    colours_resp = sb.table("ml_colours").select("id", count="exact").execute()
    feedback_resp = sb.table("ml_feedback").select("id", count="exact").execute()
    behaviour_resp = sb.table("ml_behaviour").select("id", count="exact").execute()

    return MLStats(
        total_scans=len(scans),
        total_colours=colours_resp.count or 0,
        total_feedback=feedback_resp.count or 0,
        total_behaviour_logs=behaviour_resp.count or 0,
        scans_by_mode=scans_by_mode,
        scans_today=scans_today,
        unique_sessions=len(sessions),
    )


def _get_feedback_stats_from_supabase() -> FeedbackStats:
    sb = get_supabase()
    feedback_resp = sb.table("ml_feedback").select("*").eq("is_complete", True).execute()
    feedback_data = feedback_resp.data or []

    scans_resp = sb.table("ml_scans").select("id", count="exact").execute()
    total_scans = scans_resp.count or 0

    rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    issue_counts: Dict[str, int] = {}
    family_corrections: Dict[str, int] = {}
    sum_ratings = 0
    total_ratings = 0
    feedback_with_corrections = 0
    today = datetime.utcnow().date().isoformat()
    feedback_today = 0

    for row in feedback_data:
        rating = row.get("rating")
        if rating and 1 <= rating <= 5:
            rating_distribution[rating] += 1
            sum_ratings += rating
            total_ratings += 1
        for issue in (row.get("issue_categories") or []):
            issue_counts[issue] = issue_counts.get(issue, 0) + 1
        corrections = row.get("colour_corrections") or []
        for correction in corrections:
            if not correction.get("was_correct") and correction.get("corrected_family"):
                orig = correction.get("original_family", "Unknown")
                family_corrections[orig] = family_corrections.get(orig, 0) + 1
                feedback_with_corrections += 1
        ts = row.get("timestamp", "")
        if isinstance(ts, str) and ts.startswith(today):
            feedback_today += 1

    feedback_rate = (len(feedback_data) / total_scans * 100) if total_scans > 0 else 0

    return FeedbackStats(
        total_feedback=len(feedback_data),
        feedback_rate=round(feedback_rate, 2),
        average_rating=round(sum_ratings / total_ratings, 2) if total_ratings > 0 else 0,
        rating_distribution=rating_distribution,
        most_common_issues=dict(sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)),
        colour_families_corrected=dict(sorted(family_corrections.items(), key=lambda x: x[1], reverse=True)),
        feedback_today=feedback_today,
        feedback_with_corrections=feedback_with_corrections,
    )


# ============================================================================
# Public write helpers (route handlers call these)
# ============================================================================

def save_scan(scan: ScanLevelFeatures, colours: List[ColourFeatures]):
    if supabase_enabled():
        try:
            _insert_scan_supabase(scan, colours)
            return
        except Exception as e:
            logger.error(f"Supabase scan insert failed, falling back to files: {e}")
    _save_scan_json(scan, colours)
    _append_colours_csv(colours)


def save_feedback(feedback: FeedbackData):
    if supabase_enabled():
        try:
            _insert_feedback_supabase(feedback)
            return
        except Exception as e:
            logger.error(f"Supabase feedback insert failed, falling back to files: {e}")
    _save_feedback_json(feedback)


def save_complete_feedback(feedback: CompleteFeedback):
    if supabase_enabled():
        try:
            _insert_complete_feedback_supabase(feedback)
            return
        except Exception as e:
            logger.error(f"Supabase complete feedback insert failed, falling back to files: {e}")
    _save_complete_feedback_json(feedback)


def save_behaviour(behaviour: BehaviouralSignals):
    if supabase_enabled():
        try:
            _insert_behaviour_supabase(behaviour)
            return
        except Exception as e:
            logger.error(f"Supabase behaviour insert failed, falling back to files: {e}")
    _save_behaviour_json(behaviour)


def get_stats() -> MLStats:
    if supabase_enabled():
        try:
            return _get_stats_from_supabase()
        except Exception as e:
            logger.error(f"Supabase stats query failed, falling back to files: {e}")
    return _get_stats_from_files()


def get_feedback_stats() -> FeedbackStats:
    if supabase_enabled():
        try:
            return _get_feedback_stats_from_supabase()
        except Exception as e:
            logger.error(f"Supabase feedback stats query failed, falling back to files: {e}")
    return _get_feedback_stats_from_files()


# ============================================================================
# Router
# ============================================================================

router = APIRouter(prefix="/api/ml", tags=["ML Data Collection"])


@router.post("/log-scan")
@limiter.limit(_INGEST_LIMIT)
async def log_scan(request: Request, data: MLLogBatch):
    try:
        save_scan(data.scan, data.colours)
        if data.behaviour:
            save_behaviour(data.behaviour)
        return {
            "status": "success",
            "scan_id": data.scan.scan_id,
            "colours_logged": len(data.colours),
        }
    except Exception as e:
        logger.error(f"Error logging scan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to log scan")


@router.post("/log-feedback")
@limiter.limit(_INGEST_LIMIT)
async def log_feedback(request: Request, feedback: FeedbackData):
    try:
        save_feedback(feedback)
        return {"status": "success", "scan_id": feedback.scan_id, "feedback_type": feedback.feedback_type}
    except Exception as e:
        logger.error(f"Error logging feedback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to log feedback")


@router.post("/log-complete-feedback")
@limiter.limit(_INGEST_LIMIT)
async def log_complete_feedback(request: Request, feedback: CompleteFeedback):
    try:
        save_complete_feedback(feedback)
        corrections_count = sum(
            1 for c in feedback.colour_corrections
            if not c.was_correct and c.corrected_family
        )
        return {
            "status": "success",
            "scan_id": feedback.scan_id,
            "rating": feedback.rating,
            "corrections_logged": corrections_count,
            "issues_logged": len(feedback.issue_categories),
        }
    except Exception as e:
        logger.error(f"Error logging complete feedback: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to log feedback")


@router.post("/log-behavior")
@limiter.limit(_INGEST_LIMIT)
async def log_behaviour(request: Request, behaviour: BehaviouralSignals):
    try:
        save_behaviour(behaviour)
        return {"status": "success", "scan_id": behaviour.scan_id}
    except Exception as e:
        logger.error(f"Error logging behaviour: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to log behaviour")


@router.post("/batch-log")
@limiter.limit(_INGEST_LIMIT)
async def batch_log(request: Request, payload: BatchLogRequest):
    try:
        results = {"scans_logged": 0, "colours_logged": 0, "behaviours_logged": 0, "feedbacks_logged": 0}

        for scan_batch in (payload.scans or []):
            save_scan(scan_batch.scan, scan_batch.colours)
            results["scans_logged"] += 1
            results["colours_logged"] += len(scan_batch.colours)
            if scan_batch.behaviour:
                save_behaviour(scan_batch.behaviour)
                results["behaviours_logged"] += 1

        for behaviour in (payload.behaviours or []):
            save_behaviour(behaviour)
            results["behaviours_logged"] += 1

        for feedback in (payload.feedbacks or []):
            save_feedback(feedback)
            results["feedbacks_logged"] += 1

        logger.info(f"Batch log: {results}")
        return {"status": "success", **results}
    except Exception as e:
        logger.error(f"Error in batch log: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to batch log")


@router.get("/stats", response_model=MLStats, dependencies=[Depends(require_admin_key)])
async def get_ml_stats():
    try:
        return get_stats()
    except Exception as e:
        logger.error(f"Error getting stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get stats")


@router.get("/feedback-stats", response_model=FeedbackStats, dependencies=[Depends(require_admin_key)])
async def get_ml_feedback_stats():
    try:
        return get_feedback_stats()
    except Exception as e:
        logger.error(f"Error getting feedback stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get feedback stats")


@router.get("/health")
async def ml_health():
    if supabase_enabled():
        return {"status": "ok", "storage": "supabase"}
    _ensure_directories()
    return {
        "status": "ok",
        "storage": "local_files",
        "directories_exist": {
            "scans": SCANS_DIR.exists(),
            "colours": COLOURS_CSV.parent.exists(),
            "feedback": FEEDBACK_DIR.exists(),
            "behaviour": BEHAVIOUR_DIR.exists(),
        },
    }
