"""
Enhanced Google Sheets Logger for ML Training Data Collection
Logs 22 features per detected color for machine learning
"""

import streamlit as st
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime
from typing import Dict, List, Optional
import numpy as np
from tenacity import retry, stop_after_attempt, wait_exponential


class EnhancedGSheetsLogger:
    """
    Advanced logging system with comprehensive ML feature capture
    
    Three sheets:
    1. Scans - High-level scan metadata
    2. Color_Features - Detailed ML features (22 per color)
    3. Feedback - User corrections (ground truth labels)
    """
    
    def __init__(self):
        self.connected = False
        self.sheet = None
        self.scans_sheet = None
        self.features_sheet = None
        self.feedback_sheet = None
        
        try:
            # print("🔧 Connecting to Google Sheets...")
            
            # Validate secrets exist
            if "gcp_service_account" not in st.secrets:
                print("❌ ERROR: 'gcp_service_account' not in secrets!")
                return
            if "gsheets" not in st.secrets:
                print("❌ ERROR: 'gsheets' not in secrets!")
                return
            
            # Create credentials
            scope = [
                'https://spreadsheets.google.com/feeds',
                'https://www.googleapis.com/auth/drive'
            ]
            creds = ServiceAccountCredentials.from_json_keyfile_dict(
                dict(st.secrets["gcp_service_account"]), 
                scope
            )
            client = gspread.authorize(creds)
            
            # Open spreadsheet
            sheet_url = st.secrets["gsheets"]["sheet_url"]
            self.spreadsheet = client.open_by_url(sheet_url)
            
            # Get or create sheets
            self.scans_sheet = self._get_or_create_sheet("Scans")
            self.features_sheet = self._get_or_create_sheet("Color_Features")
            self.feedback_sheet = self._get_or_create_sheet("Feedback")
            
            # Setup headers if needed
            self._setup_headers()
            
            self.connected = True
            # print("✅ Enhanced logger connected successfully!")
            
        except Exception as e:
            print(f"❌ Could not connect to Google Sheets: {e}")
            self.connected = False
    
    def _get_or_create_sheet(self, name: str):
        """Get worksheet or create if missing"""
        try:
            return self.spreadsheet.worksheet(name)
        except gspread.WorksheetNotFound:
            print(f"📄 Creating new sheet: {name}")
            return self.spreadsheet.add_worksheet(
                title=name, 
                rows=1000, 
                cols=30
            )
    
    def _setup_headers(self):
        """Setup column headers for all three sheets"""
        
        # Sheet 1: Scans (High-level metadata)
        try:
            if not self.scans_sheet.row_values(1):
                self.scans_sheet.update('A1:K1', [[
                    'Scan_ID',
                    'Timestamp',
                    'Quality_Score',
                    'Mode',
                    'Num_Colors',
                    'Has_Metallics',
                    'Has_Details',
                    'Processing_Time',
                    'Image_Width',
                    'Image_Height',
                    'Thumbs_Up'
                ]])
                print("✅ Scans sheet headers set")
        except Exception as e:
            print(f"⚠️ Could not set Scans headers: {e}")
        
        # Sheet 2: Color_Features (ML training data - MOST IMPORTANT!)
        try:
            if not self.features_sheet.row_values(1):
                self.features_sheet.update('A1:W1', [[
                    'Scan_ID',
                    'Color_Index',
                    'Detected_Family',
                    # Color features (9 values)
                    'R', 'G', 'B',
                    'L', 'A_LAB', 'B_LAB',
                    'H', 'S', 'V',
                    # Texture & coverage features (3 values)
                    'Chroma',
                    'Coverage_Pct',
                    'Brightness_STD',
                    # Context features (3 values)
                    'Is_Metallic',
                    'Is_Detail',
                    'Position_Y',
                    # Ground truth labels (4 values)
                    'User_Corrected',
                    'True_Family',
                    'Confusion_Notes',
                    'Confidence'
                ]])
                print("✅ Color_Features sheet headers set")
        except Exception as e:
            print(f"⚠️ Could not set Color_Features headers: {e}")
        
        # Sheet 3: Feedback (User corrections)
        try:
            if not self.feedback_sheet.row_values(1):
                self.feedback_sheet.update('A1:I1', [[
                    'Feedback_ID',
                    'Scan_ID',
                    'Timestamp',
                    'Feedback_Type',
                    'Issues',
                    'Expected_Colors',
                    'Comments',
                    'Rating',
                    'User_Email'
                ]])
                print("✅ Feedback sheet headers set")
        except Exception as e:
            print(f"⚠️ Could not set Feedback headers: {e}")
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def _append_row_with_retry(self, sheet, row):
        """Append row with automatic retry on failure"""
        sheet.append_row(row)
    
    def log_scan(self, scan_data: Dict) -> str:
        """
        Log scan with comprehensive ML features
        
        Args:
            scan_data: Must include:
                - recipes: List of detected colors with features
                - quality_score: Photo quality (0-100)
                - mode: 'mini' or 'scene'
                - processing_time: Seconds
                - image_size: (height, width)
        
        Returns:
            scan_id for linking feedback
        """
        if not self.connected:
            # print("⚠️ Skipping log (offline)")
            return "offline"
        
        # Generate unique scan ID
        scan_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:20]
        
        try:
            recipes = scan_data.get('recipes', [])
            image_size = scan_data.get('image_size', (0, 0))
            
            # Calculate metadata
            has_metallics = any(
                'Metal' in r.get('family', '') or 
                'Gold' in r.get('family', '') or
                'Silver' in r.get('family', '') or
                r.get('is_metallic', False)
                for r in recipes
            )
            has_details = any(r.get('is_detail', False) for r in recipes)
            
            # Log to Scans sheet
            scan_row = [
                scan_id,
                datetime.now().isoformat(),
                scan_data.get('quality_score', 0),
                scan_data.get('mode', 'mini'),
                len(recipes),
                'Yes' if has_metallics else 'No',
                'Yes' if has_details else 'No',
                scan_data.get('processing_time', 0),
                image_size[1] if len(image_size) > 1 else 0,  # width
                image_size[0] if len(image_size) > 0 else 0,  # height
                'Pending'
            ]
            
            self._append_row_with_retry(self.scans_sheet, scan_row)
            print(f"✅ Logged scan {scan_id} to Scans sheet")
            
            # Log detailed color features (ML DATA!)
            self._log_color_features(scan_id, recipes)
            
            return scan_id
            
        except Exception as e:
            print(f"❌ Error logging scan: {e}")
            return "error"
    
    def _log_color_features(self, scan_id: str, recipes: List[Dict]):
        """
        Log detailed ML features for each detected color
        
        This is the GOLD for machine learning!
        22 features per color logged to Color_Features sheet
        """
        if not self.connected:
            return
        
        for idx, recipe in enumerate(recipes):
            try:
                # Extract RGB
                rgb = recipe.get('rgb_preview', [0, 0, 0])
                if isinstance(rgb, np.ndarray):
                    rgb = rgb.tolist()
                
                # Extract or compute LAB
                lab = recipe.get('lab', [0, 0, 0])
                if isinstance(lab, np.ndarray):
                    lab = lab.tolist()
                elif isinstance(lab, dict):
                    lab = [lab.get('L', 0), lab.get('A', 0), lab.get('B', 0)]
                
                # Extract or compute HSV
                hsv = recipe.get('hsv', [0, 0, 0])
                if isinstance(hsv, np.ndarray):
                    hsv = hsv.tolist()
                elif isinstance(hsv, dict):
                    hsv = [hsv.get('H', 0), hsv.get('S', 0), hsv.get('V', 0)]
                
                # Extract other features
                chroma = recipe.get('chroma', 0)
                coverage = recipe.get('dominance', 0)
                brightness_std = recipe.get('brightness_std', 0)
                is_metallic = recipe.get('is_metallic', False)
                is_detail = recipe.get('is_detail', False)
                position_y = recipe.get('position_y', 0.5)
                
                # Build row (22 features total)
                feature_row = [
                    scan_id,
                    idx,
                    recipe.get('family', 'Unknown'),
                    # RGB (3)
                    rgb[0] if len(rgb) > 0 else 0,
                    rgb[1] if len(rgb) > 1 else 0,
                    rgb[2] if len(rgb) > 2 else 0,
                    # LAB (3)
                    lab[0] if len(lab) > 0 else 0,
                    lab[1] if len(lab) > 1 else 0,
                    lab[2] if len(lab) > 2 else 0,
                    # HSV (3)
                    hsv[0] if len(hsv) > 0 else 0,
                    hsv[1] if len(hsv) > 1 else 0,
                    hsv[2] if len(hsv) > 2 else 0,
                    # Texture (3)
                    chroma,
                    coverage,
                    brightness_std,
                    # Context (3)
                    'Yes' if is_metallic else 'No',
                    'Yes' if is_detail else 'No',
                    position_y,
                    # Ground truth (4) - will be filled when user corrects
                    'No',  # User_Corrected
                    '',    # True_Family
                    '',    # Confusion_Notes
                    ''     # Confidence
                ]
                
                self._append_row_with_retry(self.features_sheet, feature_row)
                
            except Exception as e:
                print(f"⚠️ Could not log color {idx}: {e}")
                continue
        
        print(f"✅ Logged {len(recipes)} colors to Color_Features sheet")
    
    def log_feedback(self, scan_id: str, feedback_type: str,
                     rating: Optional[int] = None,
                     issues: Optional[List[str]] = None,
                     expected_colours: Optional[str] = None,
                     comments: Optional[str] = None,
                     user_email: Optional[str] = None):
        """
        Log user feedback and optionally send email notification
        
        Args:
            scan_id: Scan identifier
            feedback_type: 'thumbs_up', 'thumbs_down', or 'correction'
            rating: 1-5 stars
            issues: List of issue categories
            expected_colours: What colors should have been detected (renamed from expected_colors)
            comments: Free-form user comments
            user_email: Optional email for follow-up
        """
        if not self.connected:
            print("⚠️ Skipping feedback log (offline)")
            return
        
        try:
            feedback_id = f"fb_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            
            feedback_row = [
                feedback_id,
                scan_id,
                datetime.now().isoformat(),
                feedback_type,
                ', '.join(issues) if issues else '',
                expected_colours if expected_colours else '',
                comments if comments else '',
                rating if rating else '',
                user_email if user_email else ''
            ]
            
            self._append_row_with_retry(self.feedback_sheet, feedback_row)
            print(f"✅ Logged feedback {feedback_id}")
            
            # Update Color_Features with corrections
            if feedback_type in ['correction', 'thumbs_down'] and expected_colours:
                self._update_color_corrections(
                    scan_id, 
                    expected_colours, 
                    feedback_type == 'thumbs_up',
                    comments
                )
            
            # Update Scans sheet thumbs up status
            if feedback_type in ['thumbs_up', 'thumbs_down']:
                self._update_scan_thumbs(scan_id, feedback_type == 'thumbs_up')
            
            # TODO: Send email notification
            # self._send_email_notification(feedback_type, scan_id, comments)
            
        except Exception as e:
            print(f"❌ Error logging feedback: {e}")
    
    def _update_color_corrections(self, scan_id: str, expected_colors: str, 
                                  thumbs_up: bool, comments: Optional[str] = None):
        """
        Update Color_Features sheet with user corrections
        
        This updates the ground truth labels for ML training!
        """
        try:
            # Find all rows for this scan_id
            scan_ids = self.features_sheet.col_values(1)  # Column A (Scan_ID)
            
            for row_num, cell_scan_id in enumerate(scan_ids[1:], start=2):  # Skip header
                if cell_scan_id == scan_id:
                    # Update ground truth columns
                    self.features_sheet.update(f'S{row_num}', 'Yes')  # User_Corrected
                    self.features_sheet.update(f'T{row_num}', expected_colors)  # True_Family
                    
                    if comments:
                        self.features_sheet.update(f'U{row_num}', comments)  # Confusion_Notes
                    
                    confidence = 5 if thumbs_up else 2
                    self.features_sheet.update(f'V{row_num}', str(confidence))  # Confidence
            
            print(f"✅ Updated corrections for scan {scan_id}")
                    
        except Exception as e:
            print(f"⚠️ Could not update corrections: {e}")
    
    def _update_scan_thumbs(self, scan_id: str, thumbs_up: bool):
        """Update the Thumbs_Up column in Scans sheet"""
        try:
            scan_ids = self.scans_sheet.col_values(1)  # Column A (Scan_ID)
            
            for row_num, cell_scan_id in enumerate(scan_ids[1:], start=2):
                if cell_scan_id == scan_id:
                    value = 'Yes' if thumbs_up else 'No'
                    self.scans_sheet.update(f'K{row_num}', value)
                    break
            
            print(f"✅ Updated thumbs for scan {scan_id}")
                    
        except Exception as e:
            print(f"⚠️ Could not update thumbs: {e}")
    
    def get_stats(self) -> Dict:
        """Get logging statistics for admin dashboard"""
        if not self.connected:
            return {
                'total_scans': 0,
                'total_feedback': 0,
                'ml_training_samples': 0,
                'satisfaction_rate': 0
            }
        
        try:
            total_scans = len(self.scans_sheet.get_all_values()) - 1
            total_feedback = len(self.feedback_sheet.get_all_values()) - 1
            ml_samples = len(self.features_sheet.get_all_values()) - 1
            
            # Calculate satisfaction rate
            thumbs_col = self.scans_sheet.col_values(11)  # Column K (Thumbs_Up)
            thumbs_up_count = thumbs_col.count('Yes')
            thumbs_down_count = thumbs_col.count('No')
            total_rated = thumbs_up_count + thumbs_down_count
            
            satisfaction = (thumbs_up_count / total_rated) if total_rated > 0 else 0
            
            return {
                'total_scans': total_scans,
                'total_feedback': total_feedback,
                'ml_training_samples': ml_samples,
                'satisfaction_rate': satisfaction
            }
        except Exception as e:
            print(f"⚠️ Could not get stats: {e}")
            return {
                'total_scans': 0,
                'total_feedback': 0,
                'ml_training_samples': 0,
                'satisfaction_rate': 0
            }
