import json
import os
import streamlit as st
from datetime import datetime
import gspread
from oauth2client.service_account import ServiceAccountCredentials

class FeedbackLogger:
    def __init__(self):
        # Local backup path
        self.log_dir = "feedback_logs"
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)
            
        self.scan_file = os.path.join(self.log_dir, "sessions.jsonl")
        self.feedback_file = os.path.join(self.log_dir, "feedback.jsonl")
        
        # Initialize Google Sheets Connection
        self.sheet = None
        self._connect_to_sheets()

    def _connect_to_sheets(self):
        """Attempts to connect to Google Sheets using Streamlit Secrets"""
        try:
            if "gcp_service_account" in st.secrets and "gsheets" in st.secrets:
                # Create a credential object from the secrets dictionary
                scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
                creds = ServiceAccountCredentials.from_json_keyfile_dict(dict(st.secrets["gcp_service_account"]), scope)
                client = gspread.authorize(creds)
                
                # Open the sheet
                self.sheet = client.open_by_url(st.secrets["gsheets"]["sheet_url"]).sheet1
                # print("✅ Connected to Google Sheets")
        except Exception as e:
            print(f"⚠️ Could not connect to Google Sheets: {e}")
            self.sheet = None

    def log_scan(self, scan_data):
        """
        Logs a new scan session.
        Returns the unique scan_id.
        """
        scan_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamp = datetime.now().isoformat()
        
        # 1. Prepare data for JSON log (Full Detail)
        log_entry = {
            'scan_id': scan_id,
            'timestamp': timestamp,
            'data': scan_data
        }

        # 2. Save to Local JSONL (Backup)
        with open(self.scan_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
            
        # 3. Save to Google Sheet (Summary Only)
        if self.sheet:
            try:
                # Extract top colors for the spreadsheet (max 3)
                recipes = scan_data.get('recipes', [])
                top_colors = [f"{r['family']} ({r.get('dominance',0):.0f}%)" for r in recipes[:3]]
                top_colors_str = ", ".join(top_colors)
                
                # Append row: [ID, Timestamp, Quality Score, Mode, Top Colors]
                self.sheet.append_row([
                    scan_id, 
                    timestamp, 
                    scan_data.get('quality_score', 0),
                    scan_data.get('mode', 'unknown'),
                    top_colors_str
                ])
            except Exception as e:
                print(f"⚠️ Failed to upload to sheet: {e}")

        return scan_id

    def log_feedback(self, scan_id, feedback_type, rating=None, corrections=None, comments=None):
        """
        Logs user feedback for a specific scan.
        """
        timestamp = datetime.now().isoformat()
        
        # 1. Local JSONL Log
        log_entry = {
            'timestamp': timestamp,
            'scan_id': scan_id,
            'type': feedback_type,
            'rating': rating,
            'corrections': corrections,
            'comments': comments
        }
        
        with open(self.feedback_file, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')

        # 2. Google Sheet Log
        # We append feedback to the SAME sheet, but we might mark it differently
        # Or ideally, you'd use a second tab (worksheet) for feedback.
        # For simplicity, we will just try to find the row and update it, or add a new line.
        if self.sheet:
            try:
                # Simple append for feedback [ID, "FEEDBACK", Type, Rating, Comment]
                self.sheet.append_row([
                    scan_id,
                    "FEEDBACK_RECEIVED",
                    feedback_type,
                    rating if rating else "",
                    comments if comments else ""
                ])
            except Exception as e:
                print(f"⚠️ Failed to upload feedback: {e}")

    def get_scan_stats(self):
        """Returns basic stats from local logs"""
        total_scans = 0
        positive_feedback = 0
        total_feedback = 0
        
        if os.path.exists(self.scan_file):
            with open(self.scan_file, 'r') as f:
                total_scans = sum(1 for line in f)
                
        if os.path.exists(self.feedback_file):
            with open(self.feedback_file, 'r') as f:
                for line in f:
                    data = json.loads(line)
                    total_feedback += 1
                    if data.get('type') == 'thumbs_up':
                        positive_feedback += 1
                        
        satisfaction = (positive_feedback / total_feedback) if total_feedback > 0 else 1.0
        
        return {
            'total_scans': total_scans,
            'satisfaction_rate': satisfaction
        }
