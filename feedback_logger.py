"""
Feedback logging system for ML training data collection
Stores user feedback and scan data for future improvements
"""
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


class FeedbackLogger:
    """
    Logs user feedback for future ML training
    Stores in JSON Lines format (for MVP) - migrate to PostgreSQL for production
    """
    
    def __init__(self, log_dir: str = "feedback_logs"):
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(exist_ok=True)
        self.session_file = self.log_dir / "sessions.jsonl"
        self.feedback_file = self.log_dir / "feedback.jsonl"
    
    def log_scan(self, scan_data: Dict) -> str:
        """
        Log a scan session
        
        Args:
            scan_data: Dictionary containing scan results
        
        Returns:
            scan_id: UUID for linking feedback to this scan
        """
        scan_id = str(uuid.uuid4())
        
        log_entry = {
            'scan_id': scan_id,
            'timestamp': datetime.now().isoformat(),
            'image_size': scan_data.get('image_size'),
            'quality_score': scan_data.get('quality_score'),
            'colors_detected': len(scan_data.get('recipes', [])),
            'recipes': scan_data.get('recipes'),  # Full recipe data for ML training
            'mode': scan_data.get('mode', 'mini'),
            'brands': scan_data.get('brands', [])
        }
        
        # Append to JSONL (one JSON object per line - easy to stream)
        with open(self.session_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
        
        return scan_id
    
    def log_feedback(self, scan_id: str, feedback_type: str, 
                     rating: Optional[int] = None,
                     corrections: Optional[List[Dict]] = None,
                     comments: Optional[str] = None):
        """
        Log user feedback on a scan
        
        Args:
            scan_id: UUID from log_scan()
            feedback_type: 'thumbs_up', 'thumbs_down', 'correction', 'conversion_attempt'
            rating: 1-5 stars (optional)
            corrections: List of {issues, details}
            comments: Free-form user comments
        """
        feedback_entry = {
            'feedback_id': str(uuid.uuid4()),
            'scan_id': scan_id,
            'timestamp': datetime.now().isoformat(),
            'type': feedback_type,
            'rating': rating,
            'corrections': corrections or [],
            'comments': comments
        }
        
        with open(self.feedback_file, 'a') as f:
            f.write(json.dumps(feedback_entry) + '\n')
    
    def get_scan_stats(self) -> Dict:
        """
        Get overall statistics for display
        
        Returns:
            Dict with total scans, feedback counts, satisfaction rate
        """
        scans = []
        feedbacks = []
        
        # Load scan data
        if self.session_file.exists():
            with open(self.session_file, 'r') as f:
                scans = [json.loads(line) for line in f]
        
        # Load feedback data
        if self.feedback_file.exists():
            with open(self.feedback_file, 'r') as f:
                feedbacks = [json.loads(line) for line in f]
        
        # Calculate metrics
        thumbs_up = sum(1 for f in feedbacks if f['type'] == 'thumbs_up')
        thumbs_down = sum(1 for f in feedbacks if f['type'] == 'thumbs_down')
        conversions = sum(1 for f in feedbacks if f['type'] == 'conversion_attempt')
        
        return {
            'total_scans': len(scans),
            'total_feedback': len(feedbacks),
            'thumbs_up': thumbs_up,
            'thumbs_down': thumbs_down,
            'conversions': conversions,
            'satisfaction_rate': thumbs_up / (thumbs_up + thumbs_down) if (thumbs_up + thumbs_down) > 0 else 0,
            'conversion_rate': conversions / len(scans) if scans else 0
        }
    
    def export_training_data(self, output_file: str = "training_data.json"):
        """
        Export labeled data for ML training
        Combines scans with their feedback for supervised learning
        
        Returns:
            Path to exported file
        """
        scans = {}
        feedbacks_by_scan = {}
        
        # Load all data
        if self.session_file.exists():
            with open(self.session_file, 'r') as f:
                for line in f:
                    scan = json.loads(line)
                    scans[scan['scan_id']] = scan
        
        if self.feedback_file.exists():
            with open(self.feedback_file, 'r') as f:
                for line in f:
                    feedback = json.loads(line)
                    scan_id = feedback['scan_id']
                    if scan_id not in feedbacks_by_scan:
                        feedbacks_by_scan[scan_id] = []
                    feedbacks_by_scan[scan_id].append(feedback)
        
        # Combine scan + feedback
        training_data = []
        for scan_id, scan in scans.items():
            feedbacks = feedbacks_by_scan.get(scan_id, [])
            
            # Only export scans with user feedback
            if feedbacks:
                training_data.append({
                    'scan': scan,
                    'feedback': feedbacks
                })
        
        # Export as JSON
        output_path = self.log_dir / output_file
        with open(output_path, 'w') as f:
            json.dump(training_data, f, indent=2)
        
        return str(output_path)