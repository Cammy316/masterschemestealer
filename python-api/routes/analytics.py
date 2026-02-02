"""
Analytics Routes
Endpoints for collecting and summarizing user analytics events
Stores events as daily CSV files for easy analysis
"""

import csv
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional
from collections import defaultdict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

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
# File Storage
# ============================================================================

DATA_DIR = Path(__file__).parent.parent / "data" / "analytics"


def ensure_directory():
    """Create analytics data directory if it doesn't exist"""
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def get_csv_path(date: datetime) -> Path:
    """Get path to CSV file for a given date"""
    return DATA_DIR / f"events_{date.strftime('%Y-%m-%d')}.csv"


def append_events_to_csv(events: List[AnalyticsEvent]):
    """Append events to daily CSV file"""
    ensure_directory()

    # Group events by date
    events_by_date: Dict[str, List[AnalyticsEvent]] = defaultdict(list)
    for event in events:
        try:
            event_date = datetime.fromisoformat(event.timestamp.replace('Z', '+00:00')).strftime('%Y-%m-%d')
        except Exception:
            event_date = datetime.utcnow().strftime('%Y-%m-%d')
        events_by_date[event_date].append(event)

    # Write to appropriate CSV files
    fieldnames = ['timestamp', 'event_name', 'session_id', 'page_path', 'user_agent', 'properties']

    for date_str, date_events in events_by_date.items():
        csv_path = DATA_DIR / f"events_{date_str}.csv"
        file_exists = csv_path.exists()

        with open(csv_path, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)

            if not file_exists:
                writer.writeheader()

            for event in date_events:
                writer.writerow({
                    'timestamp': event.timestamp,
                    'event_name': event.event_name,
                    'session_id': event.session_id,
                    'page_path': event.page_path,
                    'user_agent': event.user_agent[:200] if event.user_agent else '',  # Truncate long UAs
                    'properties': json.dumps(event.properties),
                })

    logger.info(f"Appended {len(events)} analytics events")


def read_events_from_csv(date: datetime) -> List[Dict[str, Any]]:
    """Read events from a daily CSV file"""
    csv_path = get_csv_path(date)
    if not csv_path.exists():
        return []

    events = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                row['properties'] = json.loads(row.get('properties', '{}'))
            except Exception:
                row['properties'] = {}
            events.append(row)

    return events


def calculate_summary(days: int = 30) -> AnalyticsSummary:
    """Calculate analytics summary for the past N days"""
    ensure_directory()

    total_events = 0
    sessions = set()
    events_today = 0
    sessions_today = set()
    events_by_type: Dict[str, int] = defaultdict(int)
    page_views: Dict[str, int] = defaultdict(int)
    scans_by_mode: Dict[str, int] = defaultdict(int)
    colours_detected = []
    ko_fi_clicks = 0
    feedback_count = 0
    ratings = []

    today = datetime.utcnow().date()

    # Read events from the past N days
    for i in range(days):
        date = datetime.utcnow() - timedelta(days=i)
        events = read_events_from_csv(date)

        for event in events:
            total_events += 1
            sessions.add(event.get('session_id', ''))
            events_by_type[event.get('event_name', 'unknown')] += 1

            # Check if today
            try:
                event_date = datetime.fromisoformat(event['timestamp'].replace('Z', '+00:00')).date()
                if event_date == today:
                    events_today += 1
                    sessions_today.add(event.get('session_id', ''))
            except Exception:
                pass

            # Track page views
            if event.get('event_name') == 'page_view':
                path = event.get('properties', {}).get('path', event.get('page_path', '/'))
                page_views[path] += 1

            # Track scans
            if event.get('event_name') == 'scan_completed':
                props = event.get('properties', {})
                mode = props.get('mode', 'unknown')
                scans_by_mode[mode] += 1
                if 'num_colours' in props:
                    colours_detected.append(props['num_colours'])

            # Track Ko-fi clicks
            if event.get('event_name') == 'ko_fi_clicked':
                ko_fi_clicks += 1

            # Track feedback
            if event.get('event_name') == 'feedback_submitted':
                feedback_count += 1
                props = event.get('properties', {})
                if 'rating' in props:
                    ratings.append(props['rating'])

    # Sort page views by count
    sorted_pages = dict(sorted(page_views.items(), key=lambda x: x[1], reverse=True)[:10])

    # Calculate averages
    avg_colours = sum(colours_detected) / len(colours_detected) if colours_detected else 0
    avg_rating = sum(ratings) / len(ratings) if ratings else 0

    return AnalyticsSummary(
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
        average_rating=round(avg_rating, 2)
    )


# ============================================================================
# Router
# ============================================================================

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.post("/events")
async def log_events(batch: EventsBatch):
    """
    Log a batch of analytics events
    Events are stored in daily CSV files
    """
    try:
        if not batch.events:
            return {"status": "success", "events_logged": 0}

        append_events_to_csv(batch.events)

        return {
            "status": "success",
            "events_logged": len(batch.events)
        }

    except Exception as e:
        logger.error(f"Error logging analytics events: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to log events: {str(e)}")


@router.get("/summary", response_model=AnalyticsSummary)
async def get_summary(days: int = 30):
    """
    Get analytics summary for the past N days
    Includes event counts, session counts, top pages, scan stats
    """
    try:
        summary = calculate_summary(days)
        return summary

    except Exception as e:
        logger.error(f"Error getting analytics summary: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")


@router.get("/health")
async def analytics_health():
    """Health check for analytics endpoints"""
    ensure_directory()
    return {
        "status": "ok",
        "data_directory": str(DATA_DIR),
        "directory_exists": DATA_DIR.exists()
    }
