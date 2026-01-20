"""
Simple analytics for understanding user behavior
Prepares for Google Analytics / Mixpanel integration later
"""
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional


class SimpleAnalytics:
    """
    MVP analytics - logs events to JSON Lines format
    Easy to migrate to Mixpanel/Amplitude/PostHog later
    """
    
    def __init__(self, log_file: str = "analytics/events.jsonl"):
        """
        Initialize analytics logger
        
        Args:
            log_file: Path to event log file
        """
        self.log_path = Path(log_file)
        self.log_path.parent.mkdir(exist_ok=True)
    
    def track_event(self, event_name: str, properties: Optional[Dict] = None):
        """
        Log an analytics event
        
        Args:
            event_name: Name of the event (e.g., 'scan_completed')
            properties: Additional event properties
        """
        event = {
            'event': event_name,
            'timestamp': datetime.now().isoformat(),
            'properties': properties or {}
        }
        
        with open(self.log_path, 'a') as f:
            f.write(json.dumps(event) + '\n')
    
    def track_scan(self, mode: str, num_colors: int, quality_score: int, 
                   processing_time: Optional[float] = None):
        """
        Track a successful scan completion
        
        Args:
            mode: 'mini' or 'scene'
            num_colors: Number of colors detected
            quality_score: Photo quality score (0-100)
            processing_time: Time taken to process (seconds)
        """
        self.track_event('scan_completed', {
            'mode': mode,
            'num_colors': num_colors,
            'quality_score': quality_score,
            'processing_time': processing_time
        })
    
    def track_error(self, error_type: str, details: Optional[str] = None):
        """
        Track an error occurrence
        
        Args:
            error_type: Type of error
            details: Error details/message
        """
        self.track_event('error_occurred', {
            'error_type': error_type,
            'details': details
        })
    
    def track_conversion(self, num_paints: int, brands: list, 
                        total_value: Optional[float] = None):
        """
        Track when user clicks shop button (conversion intent)
        
        Args:
            num_paints: Number of paints in cart
            brands: List of brands selected
            total_value: Estimated cart value
        """
        self.track_event('conversion_attempt', {
            'num_paints': num_paints,
            'brands': brands,
            'total_value': total_value
        })
    
    def track_pro_interest(self, email: str, source: str = 'waitlist'):
        """
        Track Pro tier waitlist signup
        
        Args:
            email: User email
            source: Source of signup ('waitlist', 'popup', 'banner')
        """
        self.track_event('pro_waitlist', {
            'email': email,
            'source': source
        })
    
    def track_feature_usage(self, feature_name: str, details: Optional[Dict] = None):
        """
        Track specific feature usage
        
        Args:
            feature_name: Name of feature used
            details: Additional feature-specific data
        """
        self.track_event('feature_used', {
            'feature': feature_name,
            'details': details or {}
        })
    
    def get_stats(self, days: int = 7) -> Dict:
        """
        Get analytics summary for the last N days
        
        Args:
            days: Number of days to analyze
        
        Returns:
            Dict with key metrics
        """
        if not self.log_path.exists():
            return {
                'total_scans': 0,
                'total_conversions': 0,
                'conversion_rate': 0,
                'avg_colors_detected': 0
            }
        
        # Load events
        events = []
        cutoff_date = datetime.now().timestamp() - (days * 24 * 60 * 60)
        
        try:
            with open(self.log_path, 'r') as f:
                for line in f:
                    try:
                        event = json.loads(line)
                        event_time = datetime.fromisoformat(event['timestamp']).timestamp()
                        
                        if event_time >= cutoff_date:
                            events.append(event)
                    except (json.JSONDecodeError, ValueError):
                        continue
        except Exception:
            pass
        
        # Calculate metrics
        scans = [e for e in events if e['event'] == 'scan_completed']
        conversions = [e for e in events if e['event'] == 'conversion_attempt']
        
        total_scans = len(scans)
        total_conversions = len(conversions)
        
        avg_colors = 0
        if scans:
            # Handle both spellings for backward compatibility, prioritize 'num_colors'
            colors_list = []
            for s in scans:
                props = s.get('properties', {})
                colors_list.append(props.get('num_colors', props.get('num_colours', 0)))
                
            if colors_list:
                avg_colors = sum(colors_list) / len(colors_list)
        
        conversion_rate = (total_conversions / total_scans * 100) if total_scans > 0 else 0
        
        return {
            'total_scans': total_scans,
            'total_conversions': total_conversions,
            'conversion_rate': round(conversion_rate, 2),
            'avg_colors_detected': round(avg_colors, 1),
            'period_days': days
        }