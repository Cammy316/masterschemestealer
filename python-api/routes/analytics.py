"""
Analytics Routes
Endpoints for collecting and summarizing user analytics events.

Storage strategy:
  - SUPABASE_URL + SUPABASE_SERVICE_KEY set → writes/reads go to Supabase (production)
  - env vars absent → writes/reads go to local daily CSV files (local dev)
"""

import csv
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any
from collections import defaultdict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

from utils.supabase_client import get_supabase, supabase_enabled

logger = logging.getLogger(__name__)


# ============================================================================
# Data Models
# ============================================================================

class AnalyticsEvent(BaseModel):
    event_name: str
    properties: Dict[str, Any] = {}
    session_id: str
    timestamp: str
    user_agent: str
    page_path: str


class EventsBatch(BaseModel):
    events: List[AnalyticsEvent]


class AnalyticsSummary(BaseModel):
    total_events: int
    total_sessions: int
    events_today: int
    sessions_today: int
    events_by_type: Dict[str, int]
    top_pages: Dict[str, int]
    scans_by_mode: Dict[str, int]
    average_colours_detected: float
    ko_fi_clicks: int
    feedback_count: int
    average_rating: float


# ============================================================================
# File storage (local dev)
# ============================================================================

DATA_DIR = Path(__file__).parent.parent / "data" / "analytics"


def _ensure_directory():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _get_csv_path(date: datetime) -> Path:
    return DATA_DIR / f"events_{date.strftime('%Y-%m-%d')}.csv"


def _append_events_to_csv(events: List[AnalyticsEvent]):
    _ensure_directory()
    events_by_date: Dict[str, List[AnalyticsEvent]] = defaultdict(list)
    for event in events:
        try:
            date_str = datetime.fromisoformat(event.timestamp.replace('Z', '+00:00')).strftime('%Y-%m-%d')
        except Exception:
            date_str = datetime.utcnow().strftime('%Y-%m-%d')
        events_by_date[date_str].append(event)

    fieldnames = ['timestamp', 'event_name', 'session_id', 'page_path', 'user_agent', 'properties']
    for date_str, date_events in events_by_date.items():
        csv_path = DATA_DIR / f"events_{date_str}.csv"
        file_exists = csv_path.exists()
        with open(csv_path, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            for e in date_events:
                writer.writerow({
                    'timestamp': e.timestamp,
                    'event_name': e.event_name,
                    'session_id': e.session_id,
                    'page_path': e.page_path,
                    'user_agent': e.user_agent[:200] if e.user_agent else '',
                    'properties': json.dumps(e.properties),
                })
    logger.info(f"Appended {len(events)} analytics events to CSV")


def _load_events_from_files(days: int) -> List[Dict]:
    _ensure_directory()
    all_events = []
    for i in range(days):
        date = datetime.utcnow() - timedelta(days=i)
        csv_path = _get_csv_path(date)
        if not csv_path.exists():
            continue
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                try:
                    row['properties'] = json.loads(row.get('properties', '{}'))
                except Exception:
                    row['properties'] = {}
                all_events.append(row)
    return all_events


# ============================================================================
# Supabase storage (production)
# ============================================================================

def _insert_events_supabase(events: List[AnalyticsEvent]):
    sb = get_supabase()
    rows = [
        {
            "timestamp": e.timestamp,
            "event_name": e.event_name,
            "session_id": e.session_id,
            "page_path": e.page_path,
            "user_agent": e.user_agent[:200] if e.user_agent else "",
            "properties": e.properties,
        }
        for e in events
    ]
    sb.table("analytics_events").insert(rows).execute()
    logger.info(f"Inserted {len(rows)} analytics events to Supabase")


def _load_events_from_supabase(days: int) -> List[Dict]:
    sb = get_supabase()
    cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
    response = sb.table("analytics_events").select("*").gte("created_at", cutoff).execute()
    return response.data or []


# ============================================================================
# Shared aggregation
# ============================================================================

def _aggregate_events(events: List[Dict]) -> dict:
    total_events = 0
    sessions: set = set()
    events_today = 0
    sessions_today: set = set()
    events_by_type: Dict[str, int] = defaultdict(int)
    page_views: Dict[str, int] = defaultdict(int)
    scans_by_mode: Dict[str, int] = defaultdict(int)
    colours_detected = []
    ko_fi_clicks = 0
    feedback_count = 0
    ratings = []
    today = datetime.utcnow().date()

    for event in events:
        total_events += 1
        sessions.add(event.get('session_id', ''))
        events_by_type[event.get('event_name', 'unknown')] += 1

        try:
            event_date = datetime.fromisoformat(
                event['timestamp'].replace('Z', '+00:00')
            ).date()
            if event_date == today:
                events_today += 1
                sessions_today.add(event.get('session_id', ''))
        except Exception:
            pass

        if event.get('event_name') == 'page_view':
            props = event.get('properties') or {}
            path = props.get('path', event.get('page_path', '/'))
            page_views[path] += 1

        if event.get('event_name') == 'scan_completed':
            props = event.get('properties') or {}
            mode = props.get('mode', 'unknown')
            scans_by_mode[mode] += 1
            if 'num_colours' in props:
                colours_detected.append(props['num_colours'])

        if event.get('event_name') == 'ko_fi_clicked':
            ko_fi_clicks += 1

        if event.get('event_name') == 'feedback_submitted':
            feedback_count += 1
            props = event.get('properties') or {}
            if 'rating' in props:
                ratings.append(props['rating'])

    sorted_pages = dict(sorted(page_views.items(), key=lambda x: x[1], reverse=True)[:10])
    avg_colours = sum(colours_detected) / len(colours_detected) if colours_detected else 0
    avg_rating = sum(ratings) / len(ratings) if ratings else 0

    return dict(
        total_events=total_events,
        total_sessions=len(sessions),
        events_today=events_today,
        sessions_today=len(sessions_today),
        events_by_type=dict(events_by_type),
        top_pages=sorted_pages,
        scans_by_mode=dict(scans_by_mode),
        average_colours_detected=round(avg_colours, 2),
        ko_fi_clicks=ko_fi_clicks,
        feedback_count=feedback_count,
        average_rating=round(avg_rating, 2),
    )


def _calculate_summary(days: int = 30) -> AnalyticsSummary:
    if supabase_enabled():
        events = _load_events_from_supabase(days)
    else:
        events = _load_events_from_files(days)
    return AnalyticsSummary(**_aggregate_events(events))


# ============================================================================
# Public write helpers (used by route handlers)
# ============================================================================

def append_events(events: List[AnalyticsEvent]):
    if supabase_enabled():
        try:
            _insert_events_supabase(events)
            return
        except Exception as e:
            logger.error(f"Supabase insert failed, falling back to CSV: {e}")
    _append_events_to_csv(events)


# ============================================================================
# Router
# ============================================================================

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.post("/events")
async def log_events(batch: EventsBatch):
    try:
        if not batch.events:
            return {"status": "success", "events_logged": 0}
        append_events(batch.events)
        return {"status": "success", "events_logged": len(batch.events)}
    except Exception as e:
        logger.error(f"Error logging analytics events: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to log events: {str(e)}")


@router.get("/summary", response_model=AnalyticsSummary)
async def get_summary(days: int = 30):
    try:
        return _calculate_summary(days)
    except Exception as e:
        logger.error(f"Error getting analytics summary: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")


@router.get("/health")
async def analytics_health():
    if supabase_enabled():
        return {"status": "ok", "storage": "supabase"}
    _ensure_directory()
    return {
        "status": "ok",
        "storage": "local_csv",
        "data_directory": str(DATA_DIR),
        "directory_exists": DATA_DIR.exists(),
    }
