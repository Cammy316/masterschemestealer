"""
SchemeStealer v2.9.1 - Main Application
Mobile-optimized Streamlit MVP with Enhanced UI/UX
"""

import streamlit as st
import cv2
import numpy as np
import random
import time
import os
from PIL import Image
from typing import List
from datetime import datetime

from config import APP_NAME, APP_VERSION, APP_ICON, Mobile, Affiliate
from core.schemestealer_engine import SchemeStealerEngine
from core.photo_processor import PhotoProcessor
from utils.helpers import get_affiliate_link, compress_image_for_mobile
from utils.logging_config import logger

# NEW v2.6 IMPORTS
from utils.feedback_logger import EnhancedGSheetsLogger as FeedbackLogger
from utils.shopping_cart import ShoppingCart
from utils.analytics import SimpleAnalytics

# ============================================================================
# FLAVOUR TEXT & THEMES
# ============================================================================

class AuspexText:
    """Warhammer 40k/AoS Thematic Text Generator"""
    
    # STAGE-SPECIFIC MESSAGES (more immersive!)
    STAGE_MESSAGES = {
        'initializing': [
            "Awakening the Machine Spirit...",
            "Initializing Cogitator Arrays...",
            "Establishing Noospheric Link...",
            "Activating Auspex Protocols..."
        ],
        'preprocessing': [
            "Applying Sacred Unguents to Optics...",
            "Purging Heretical Color Casts...",
            "Recalibrating Lumen Receptors...",
            "Invoking the Rite of Clear Sight...",
            "Sanctifying Visual Data-Stream..."
        ],
        'background_removal': [
            "Purging Environmental Interference...",
            "Isolating Subject from the Warp...",
            "Removing Extraneous Data-Wraiths...",
            "Sanctifying Target Acquisition...",
            "Banishing Background Noise..."
        ],
        'base_detection': [
            "Identifying Foundational Substrate...",
            "Detecting Base Material Signatures...",
            "Scanning Terrain Composition...",
            "Analyzing Mounting Platform...",
            "Surveying Foundation Structure..."
        ],
        'color_extraction': [
            "Communing with the Machine Spirit...",
            "Auspex Scan Initializing...",
            "Scanning Biomass Pigmentation...",
            "Extracting Chromatic Data-Patterns...",
            "Analyzing Pigment Concentrations...",
            "Interpreting Spectral Signatures...",
            "Divining Color Harmonics...",
            "Processing Wavelength Frequencies..."
        ],
        'metallic_detection': [
            "Detecting Blessed Metallics...",
            "Identifying Auramite Signatures...",
            "Scanning for Sacred Golds...",
            "Analyzing Ferrous Compositions...",
            "Measuring Reflective Properties...",
            "Detecting Adamantium Traces..."
        ],
        'paint_matching': [
            "Consulting the Codex Astartes...",
            "Calculating Standard Template Construct Matches...",
            "Accessing Paint Archives...",
            "Cross-Referencing Holy Formulations...",
            "Querying the Librarius Database...",
            "Decoding Ancient Paint Scrolls...",
            "Communing with the Paint Vaults...",
            "Consulting Forge World Records..."
        ],
        'finalizing': [
            "Invoking the Omnissiah's Blessing...",
            "Filtering Warp Interference...",
            "Finalizing Ritual Calculations...",
            "Completing Sacred Rites...",
            "Sanctifying Results..."
        ]
    }
    
    SUCCESS_MESSAGES = [
        "The Emperor Protects, and Identifies!",
        "STC Pattern Recognized.",
        "Machine Spirit Appeased.",
        "Xenos/Heretic Pigment Identified.",
        "Cogitator Analysis Complete.",
        "Ritual Successful. Ave Imperator!",
        "Data-Hymns Processed Successfully.",
        "The Omnissiah Blesses This Scan."
    ]
    
    ERROR_MESSAGES = [
        "Machine Spirit Angered.",
        "Warp Storm Interference Detected.",
        "Heretical Data Corruption.",
        "Gellar Field Failure - Image Unclear.",
        "Cogitator Malfunction.",
        "Ritual Incomplete - Interference Detected."
    ]
    
    INSPIRATION_LOADING_MESSAGES = [
        "Consulting the Archives of History...",
        "Scanning Environmental Data...",
        "Analyzing Sector Terrain...",
        "Extracting Pigment Data from Pict-Feed...",
        "Harmonizing Color Palettes...",
        "Synthesizing Inspiration Protocols..."
    ]

    @staticmethod
    def get_loading_msg(mode="scan"):
        """Legacy method for compatibility"""
        if mode == "inspiration":
             return random.choice(AuspexText.INSPIRATION_LOADING_MESSAGES)
        # For scan mode, use color extraction messages as default
        return random.choice(AuspexText.STAGE_MESSAGES['color_extraction'])
    
    @staticmethod
    def get_stage_msg(stage: str):
        """Get random message for specific processing stage"""
        messages = AuspexText.STAGE_MESSAGES.get(stage, ["Processing..."])
        return random.choice(messages)

# ============================================================================
# PAGE CONFIGURATION
# ============================================================================

st.set_page_config(
    page_title=f"{APP_NAME} - Tactical Paint Auspex",
    page_icon=APP_ICON,
    layout="centered",
    initial_sidebar_state="collapsed",
    menu_items={
        'About': f"{APP_NAME} v{APP_VERSION} - Scan miniatures, find paints!"
    }
)

# Mobile-optimized CSS with Custom Fonts & Enhanced UI
st.markdown("""
    <style>
    /* IMPORT FONTS */
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

    /* Mobile-first responsive design */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 100%;
    }
    
    /* Touch-friendly buttons - Tactical Green */
    .stButton>button {
        width: 100%;
        min-height: 50px;  /* iOS minimum touch target */
        background-color: #1a2e1a; /* Dark Green */
        color: #5DA153; /* Bright Green Text */
        border: 1px solid #5DA153;
        font-family: 'Share Tech Mono', monospace; /* TACTICAL FONT */
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 20px;
        transition: all 0.3s ease;
    }
    
    .stButton>button:hover {
        background-color: #5DA153;
        color: #000;
        border-color: #00FF00;
        box-shadow: 0 0 15px #5DA153;
    }
    
    /* Brand colors */
    .brand-Citadel { color: #5aa9e6; font-weight: bold; }
    .brand-Vallejo { color: #e6c25a; font-weight: bold; }
    .brand-Army_Painter { color: #e65a5a; font-weight: bold; }
    
    /* Wash badge */
    .wash-badge {
        background-color: #222;
        color: #aaa;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8em;
        margin-left: 5px;
        border: 1px solid #444;
        text-transform: uppercase;
        font-family: 'Share Tech Mono', monospace;
    }
    
    /* Detail badge */
    .detail-badge {
        background-color: #333;
        color: #FFD700;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.8em;
        margin-left: 5px;
        border: 1px solid #FFD700;
        text-transform: uppercase;
        font-family: 'Share Tech Mono', monospace;
    }
    
    /* Color palette boxes */
    .palette-box {
        height: 60px;
        width: 100%;
        border-radius: 2px; /* Sharper corners for tech look */
        border: 2px solid #333;
        margin-bottom: 5px;
        box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .palette-box:hover {
        transform: scale(1.05) translateY(-2px);
        box-shadow: 
            0 8px 16px rgba(0,0,0,0.4),
            0 0 20px rgba(93, 161, 83, 0.3);
    }
    
    .palette-label {
        text-align: center;
        font-size: 0.8em;
        font-weight: bold;
        color: #aaa;
        text-transform: uppercase;
        font-family: 'Share Tech Mono', monospace;
        letter-spacing: 1px;
    }
    
    /* Quality indicator */
    .quality-excellent { color: #00FF00; font-family: 'Share Tech Mono', monospace; }
    .quality-good { color: #5DA153; font-family: 'Share Tech Mono', monospace; }
    .quality-fair { color: #FFA500; font-family: 'Share Tech Mono', monospace; }
    .quality-poor { color: #FF4444; font-family: 'Share Tech Mono', monospace; }
    
    /* Mobile image optimization */
    img {
        max-width: 100%;
        height: auto;
        border: 1px solid #333;
    }
    
    /* Affiliate link styling */
    a { 
        text-decoration: none; 
        color: inherit; 
        transition: 0.3s; 
    }
    a:hover { 
        color: #7FC97F !important;
        text-shadow: 0 0 10px rgba(93, 161, 83, 0.6) !important;
        text-decoration: none !important;
    }
    
    /* Headers - High Gothic Style */
    h1, h2, h3, h4 {
        font-family: 'Cinzel', serif !important;
        font-weight: 700 !important;
        letter-spacing: 0px;
        text-transform: uppercase;
    }
    
    /* Improved expander styling */
    .streamlit-expanderHeader {
        font-family: 'Share Tech Mono', monospace !important;
        font-size: 16px !important;
        background-color: #1a1a1a !important;
        border: 1px solid #333 !important;
        border-radius: 6px !important;
        padding: 14px !important;
        transition: all 0.2s ease !important;
    }
    
    .streamlit-expanderHeader:hover {
        background-color: #252525 !important;
        border-color: #5DA153 !important;
        box-shadow: 0 2px 8px rgba(93, 161, 83, 0.2) !important;
    }
    
    /* Gradient dividers */
    hr {
        border: none !important;
        height: 2px !important;
        background: linear-gradient(90deg, 
            transparent 0%, 
            #5DA153 50%, 
            transparent 100%) !important;
        margin: 2.5rem 0 !important;
    }
    
    /* Enhanced metric cards */
    [data-testid="stMetricValue"] {
        font-size: 2.2em !important;
        color: #5DA153 !important;
        font-family: 'Share Tech Mono', monospace !important;
        text-shadow: 0 0 8px rgba(93, 161, 83, 0.3);
    }
    
    /* Loading spinner color */
    .stSpinner > div {
        border-top-color: #5DA153 !important;
    }
    
    /* Enhanced success messages */
    .element-container .stSuccess {
        background-color: rgba(93, 161, 83, 0.15) !important;
        border-left: 4px solid #5DA153 !important;
        padding: 12px !important;
        border-radius: 4px !important;
    }

    /* Global text enhancement */
    p, li {
        font-family: sans-serif;
    }
    
    /* Mobile improvements */
    @media (max-width: 768px) {
        .stButton>button {
            font-size: 16px !important;
            padding: 14px !important;
        }
        
        .palette-box {
            height: 90px !important;
        }
        
        [data-testid="stMetricValue"] {
            font-size: 1.8em !important;
        }
    }
    </style>
""", unsafe_allow_html=True)

# ============================================================================
# SESSION STATE INITIALIZATION
# ============================================================================

if 'engine' not in st.session_state:
    try:
        # === FIX FOR STREAMLIT CLOUD PATHS ===
        base_dir = os.path.dirname(os.path.abspath(__file__))
        paints_path = os.path.join(base_dir, 'paints.json')
        
        st.session_state.engine = SchemeStealerEngine(paints_path)
        logger.info(f"Engine loaded successfully from {paints_path}")
        
    except Exception as e:
        st.error(f"❌ Cogitator Failure: {e}")
        logger.error(f"Engine initialization failed: {e}", exc_info=True)
        st.stop()

if 'photo_processor' not in st.session_state:
    st.session_state.photo_processor = PhotoProcessor()

if 'feedback_logger' not in st.session_state:
    st.session_state.feedback_logger = FeedbackLogger()

if 'analytics' not in st.session_state:
    st.session_state.analytics = SimpleAnalytics()

if 'show_correction_form' not in st.session_state:
    st.session_state.show_correction_form = False

# === FIX: PERSISTENT RESULT STORAGE ===
if 'scan_results' not in st.session_state:
    st.session_state.scan_results = None
if 'inspiration_results' not in st.session_state:
    st.session_state.inspiration_results = None
if 'scan_quality' not in st.session_state:
    st.session_state.scan_quality = None
if 'processing_time' not in st.session_state:
    st.session_state.processing_time = 0.0
if 'first_visit' not in st.session_state:
    st.session_state.first_visit = True

# ============================================================================
# HEADER
# ============================================================================

st.title(f"{APP_ICON} {APP_NAME}")
st.caption(f"v{APP_VERSION} // M42 Pattern Paint Cogitator")

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def show_smart_disclaimer(recipes: List[dict], quality_score: int):
    """Show context-aware disclaimer based on scan results"""
    warnings = []
    
    # Check for small details
    small_details = [r for r in recipes if r.get('is_detail') and r['dominance'] < 2.0]
    if len(small_details) > 0:
        warnings.append("🔍 **Tiny Details Alert**: We detected some very small details "
                       f"({len(small_details)} colors <2%). These may be approximate. "
                       "Focus on the major armor panels for best accuracy.")
    
    # Check for warm metal confusion risk
    warm_metals = [r for r in recipes if any(m in r['family'] for m in ['Gold', 'Bronze', 'Brown', 'Rust'])]
    if len(warm_metals) >= 2:
        warnings.append("⚠️ **Warm Metals Note**: Multiple warm tones detected (gold/bronze/brown). "
                       "If these look similar, check the reticle images to verify placement.")
    
    # Check for photo quality
    if quality_score < 70:
        warnings.append("📸 **Photo Quality**: Your image quality is fair. "
                       "For best results, try better lighting and hold your phone steady.")
    
    if warnings:
        st.info("**👀 Quick Heads Up:**\n\n" + "\n\n".join(warnings))

# Tabs for Main Scan and Inspiration Mode
tab1, tab2 = st.tabs(["🧬 AUSPEX SCAN", "🌌 INSPIRATION PROTOCOLS"])

# ============================================================================
# SIDEBAR SETTINGS (Shared)
# ============================================================================

with st.sidebar:
    st.header("🌍 Sector / Region")
    region_option = st.selectbox(
        "Select Supply Drop Zone:",
        options=list(Affiliate.REGIONS.keys()),
        index=1,  # Default to UK
        help="Determines affiliate logistics"
    )
    
    st.divider()
    
    # === NEW GLOBAL PREFERENCE SELECTOR ===
    st.header("🎨 Logistics Preference")
    global_brand_pref = st.selectbox(
        "Preferred Paint Brand:",
        options=Affiliate.SUPPORTED_BRANDS,
        index=0,
        help="Sets the default brand for all recommendations"
    )
    
    st.divider()
    
    st.header("⚙️ Cogitator Settings")
    
    mode_select = st.radio(
        "Scan Protocol (Auspex Only):",
        ["Operative (Remove Background)", "Terrain (Full Image)"],
        help="Operative mode isolates the unit from the environment"
    )
    mode_key = "mini" if "Operative" in mode_select else "scene"
    
    if mode_key == "mini":
        remove_base = st.checkbox("Filter Base Materials", value=True)
    else:
        remove_base = False
    
    detect_details = st.checkbox("High-Res Sensor Sweep", value=True)
    
    with st.expander("🔬 Tech-Priest Override (Optional)", expanded=False):
        use_awb = st.checkbox("Auto-Lumen Calibration", value=True)
        use_sat = st.checkbox("Amplify Pigment Vibrance", value=True)
        gamma_val = st.slider("Gain Adjustment", 0.5, 2.0, 1.0, 0.1)
    
    st.divider()
    st.markdown("[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/YOUR_USERNAME_HERE)")
    
    # SECRET ADMIN DOWNLOADER
    st.divider()
    with st.expander("🔐 Admin Console"):
        if st.button("📥 Download Feedback Logs"):
            try:
                # Note: This checks the local file which might be empty if we rely only on GSheets
                # But the Enhanced logger still keeps track if configured to do so, or GSheets is primary
                with open('feedback_logs/feedback.jsonl', 'r') as f:
                    st.download_button(
                        label="Save Log File",
                        data=f,
                        file_name=f"feedback_backup_{datetime.now().strftime('%Y%m%d')}.jsonl",
                        mime="application/json"
                    )
            except FileNotFoundError:
                st.error("No feedback data found yet.")

# ============================================================================
# TAB 1: AUSPEX SCAN (Miniature Scanner)
# ============================================================================

with tab1:
    # First-time user onboarding
    if st.session_state.first_visit:
        st.info("""
        👋 **NEW HERE?** Welcome to SchemeStealer!
        
        **How it works:**
        1. Upload a photo of your painted miniature
        2. AI analyzes the colors (10 seconds)
        3. Get exact paint matches from 3 brands
        4. Shop for the paints you need
        
        **Ready? Upload your first miniature below! ↓**
        """)
    
    # Photo Tips Expander
    with st.expander("💡 Photo Tips for Best Results", expanded=False):
        st.markdown("""
        ### ✅ For Best Results:
        
        **Lighting:**
        - ✅ Use natural daylight or bright white LED
        - ❌ Avoid yellow indoor lighting
        - ❌ Avoid harsh shadows or glare
        
        **Camera:**
        - ✅ Hold phone steady (or use timer)
        - ✅ Focus on the miniature
        - ❌ Don't use flash
        
        **Composition:**
        - ✅ Fill the frame with your miniature
        - ✅ Plain background (white/black/grey)
        - ❌ Avoid cluttered backgrounds
        
        **Pro Tip:** Take photo from 45° angle for best depth perception!
        """)

    # Enhanced Upload Area
    st.markdown("""
        <div style='
            border: 3px dashed #5DA153;
            border-radius: 10px;
            padding: 40px;
            text-align: center;
            background: linear-gradient(135deg, #1a2e1a 0%, #0a1a0a 100%);
            margin: 20px 0;
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
        '>
            <h2 style='color: #5DA153; font-family: "Cinzel", serif; margin-bottom: 10px;'>
                📸 UPLOAD YOUR MINIATURE
            </h2>
            <p style='color: #999; font-size: 1.1em; margin-bottom: 8px;'>
                Drag and drop or click to browse
            </p>
            <p style='color: #666; font-size: 0.9em;'>
                Supports: JPG, PNG • Max 10MB
            </p>
        </div>
    """, unsafe_allow_html=True)

    uploaded_file = st.file_uploader(
        "Upload Miniature",
        type=["jpg", "jpeg", "png"],
        help=f"Max {Mobile.MAX_IMAGE_UPLOAD_SIZE}MB",
        key="uploader_auspex",
        label_visibility="collapsed"
    )

    if uploaded_file is not None:
        # Mark as visited after interaction
        st.session_state.first_visit = False
        
        try:
            # Load image
            file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
            raw_img = cv2.imdecode(file_bytes, 1)
            raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
            
            # Compress for mobile if needed
            if Mobile.AUTO_COMPRESS_IMAGES:
                raw_img = compress_image_for_mobile(raw_img, Mobile.COMPRESSED_IMAGE_WIDTH)
            
            # Photo quality check
            st.subheader("📊 Signal Quality Assessment")
            quality_report = st.session_state.photo_processor.process_and_assess(raw_img)
            feedback = st.session_state.photo_processor.generate_quality_feedback_ui(quality_report)
            
            # Display quality score
            quality_class = f"quality-{quality_report.quality_level.lower()}"
            st.markdown(
                f"<span class='{quality_class}'>{feedback['emoji']} {feedback['message']}</span>",
                unsafe_allow_html=True
            )
            
            # Show enhanced preview
            preview = quality_report.enhanced_image
            if gamma_val != 1.0:
                from utils.helpers import adjust_gamma
                preview = adjust_gamma(preview, gamma=gamma_val)
            st.image(preview, caption="Enhanced Visual Feed")
            
            st.divider()
            
            if not quality_report.can_process:
                st.error("⚠️ **Signal too degraded for logic engines.**")
            else:
                # === ENHANCED SCAN BUTTON LOGIC ===
                if st.button("🧬 INITIATE AUSPEX SCAN", type="primary", key="btn_auspex"):
                    # Create progress display containers
                    status_text = st.empty()
                    progress_bar = st.empty()
                    
                    try:
                        # START TIMER
                        start_time = time.time()
                        
                        def update_progress(stage_key, progress_pct):
                            """Update progress with stage-appropriate thematic message"""
                            msg = AuspexText.get_stage_msg(stage_key)
                            status_text.markdown(f"### ⚙️ {msg}")
                            progress_bar.progress(progress_pct / 100, text=f"{progress_pct}%")
                        
                        # Stage 1: Initialize (0-10%)
                        update_progress('initializing', 5)
                        time.sleep(0.2)
                        
                        # Stage 2: Preprocessing (10-25%)
                        update_progress('preprocessing', 15)
                        time.sleep(0.2)
                        
                        # Stage 3: Background removal (25-45%) - only if needed
                        if mode_key == "mini":
                            update_progress('background_removal', 35)
                            time.sleep(0.2)
                        
                        # Stage 4: Base detection (45-55%) - only if needed
                        if mode_key == "mini" and remove_base:
                            update_progress('base_detection', 50)
                            time.sleep(0.2)
                        
                        # Stage 5: Color extraction (55-75%) - MAIN WORK HAPPENS HERE
                        update_progress('color_extraction', 65)
                        
                        # Run actual analysis
                        recipes, debug_img, quality_dict = st.session_state.engine.analyze_miniature(
                            raw_img,
                            mode=mode_key,
                            remove_base=remove_base,
                            use_awb=use_awb,
                            sat_boost=1.3 if use_sat else 1.0,
                            detect_details=detect_details
                        )
                        
                        # Stage 6: Metallic detection (75-85%)
                        update_progress('metallic_detection', 80)
                        time.sleep(0.2)
                        
                        # Stage 7: Paint matching (85-95%)
                        update_progress('paint_matching', 90)
                        time.sleep(0.2)
                        
                        # Stage 8: Finalizing (95-100%)
                        update_progress('finalizing', 98)
                        time.sleep(0.2)
                        
                        # Complete!
                        progress_bar.progress(100)
                        
                        # Success message
                        success_msg = random.choice(AuspexText.SUCCESS_MESSAGES)
                        status_text.success(f"✅ {success_msg}")
                        time.sleep(0.5)
                        
                        # Clear progress displays
                        status_text.empty()
                        progress_bar.empty()
                        
                        processing_time = time.time() - start_time
                        
                        # Continue with existing logging code...
                        if recipes:
                            # Sanitize for logs (recipes now contain ML features like numpy arrays)
                            log_recipes = []
                            for r in recipes:
                                r_copy = r.copy()
                                if 'reticle' in r_copy: del r_copy['reticle']
                                # Convert numpy arrays to lists for JSON serialization
                                for k, v in r_copy.items():
                                    if isinstance(v, np.ndarray):
                                        r_copy[k] = v.tolist()
                                log_recipes.append(r_copy)

                            scan_id = st.session_state.feedback_logger.log_scan({
                                'image_size': raw_img.shape,
                                'quality_score': quality_report.score,
                                'recipes': log_recipes,  # Now includes lab, hsv, chroma, position!
                                'mode': mode_key,
                                'brands': Affiliate.SUPPORTED_BRANDS,
                                'processing_time': processing_time
                            })
                            st.session_state.current_scan_id = scan_id
                            st.session_state.processing_time = processing_time
                            st.session_state.analytics.track_scan(mode=mode_key, num_colors=len(recipes), quality_score=quality_report.score)
                        
                        # Save results to session state
                        st.session_state.scan_results = recipes
                        st.session_state.scan_quality = quality_report
                        
                    except Exception as e:
                        status_text.error(f"❌ {random.choice(AuspexText.ERROR_MESSAGES)}")
                        progress_bar.empty()
                        st.error(f"⚠️ Cogitator Error: {str(e)}")
                        logger.error(f"Analysis error: {e}", exc_info=True)

                # === DISPLAY LOGIC (RUNS IF RESULTS EXIST IN STATE) ===
                if st.session_state.scan_results:
                    recipes = st.session_state.scan_results
                    quality_score = st.session_state.scan_quality.score
                    
                    if not recipes:
                        st.warning("❌ No pigmentation detected.")
                    else:
                        st.success(f"✅ Cogitator Analysis Successful - {len(recipes)} Pigment Patterns Found")
                        
                        # Show processing time
                        if 'processing_time' in st.session_state and st.session_state.processing_time > 0:
                            st.caption(f"⏱️ Analysis completed in {st.session_state.processing_time:.2f} seconds")
                        
                        # Add summary metrics
                        st.markdown("---")
                        col1, col2, col3, col4 = st.columns(4)

                        major_colors = [r for r in recipes if not r.get('is_detail', False)]
                        detail_colors = [r for r in recipes if r.get('is_detail', False)]
                        metallic_count = sum(1 for r in recipes if 'Metal' in r['family'] or 'Gold' in r['family'] or 'Silver' in r['family'])

                        with col1:
                            st.metric(
                                "Colors Detected",
                                len(recipes),
                                delta=f"{len(detail_colors)} details" if detail_colors else None
                            )

                        with col2:
                            st.metric(
                                "Metallic Colors",
                                metallic_count
                            )

                        with col3:
                            st.metric(
                                "Photo Quality",
                                f"{quality_score}/100",
                                delta="Excellent" if quality_score > 80 else ("Good" if quality_score > 60 else "Fair")
                            )

                        with col4:
                            total_paints_needed = len(major_colors) * 2  # Base + highlight for major colors
                            st.metric(
                                "Est. Paints",
                                f"{total_paints_needed}+ bottles"
                            )

                        st.markdown("---")

                        show_smart_disclaimer(recipes, quality_score)
                        
                        # ===== LIVE PALETTE PREVIEW STRIP =====
                        st.markdown("### 🎨 Your Color Scheme Preview")
                        
                        # Create proportional color bar (No spaces at start of lines!)
                        palette_html = "<div style='display: flex; height: 80px; border-radius: 12px; overflow: hidden; border: 3px solid #333; box-shadow: 0 4px 12px rgba(0,0,0,0.4); margin: 16px 0;'>"
                        
                        # Calculate total coverage for proportions
                        display_recipes = recipes[:6]  # Show up to 6 colors
                        total_coverage = sum([r['dominance'] for r in display_recipes])
                        
                        for recipe in display_recipes:
                            rgb = recipe['rgb_preview']
                            color_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                            width_pct = (recipe['dominance'] / total_coverage) * 100
                            
                            # Choose text color based on background brightness
                            brightness = sum(rgb) / 3
                            text_color = '#000' if brightness > 128 else '#fff'
                            text_shadow = '#fff' if brightness < 128 else '#000'
                            
                            # No indentation in the f-string to prevent code block rendering
                            palette_html += f"<div style='background: {color_css}; width: {width_pct}%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: {text_color}; text-shadow: 0 0 3px {text_shadow}; padding: 8px; font-family: \"Share Tech Mono\", monospace; transition: all 0.2s; cursor: pointer;' onmouseover='this.style.transform=\"scale(1.05)\"; this.style.zIndex=\"10\";' onmouseout='this.style.transform=\"scale(1)\"; this.style.zIndex=\"1\";'><div style='font-size: 1.2em; font-weight: bold;'>{recipe['dominance']:.0f}%</div><div style='font-size: 0.85em;'>{recipe['family']}</div></div>"
                        
                        palette_html += "</div>"
                        st.markdown(palette_html, unsafe_allow_html=True)
                        
                        # Add caption
                        if len(recipes) > 6:
                            st.caption(f"**Showing top 6 of {len(recipes)} detected colors**")
                        
                        st.markdown("---")
                        
                        # ===== DETAILED RECIPES =====
                        st.markdown("### ✨ Sacred Formulations")
                        
                        selected_paints = []
                        
                        for idx, recipe in enumerate(recipes):
                            is_detail = recipe.get('is_detail', False)
                            rgb = recipe['rgb_preview']
                            
                            header = f"{recipe['family']} ({recipe['dominance']:.1f}%)"
                            if is_detail: header = "⭐ " + header
                            
                            # Determine brand index from global preference
                            try:
                                brand_index = Affiliate.SUPPORTED_BRANDS.index(global_brand_pref)
                            except ValueError:
                                brand_index = 0
                            
                            # Expander with EMOJI instead of HTML (Fixes "span" text showing up)
                            with st.expander(f"🎨 {header}", expanded=(idx < 3 and not is_detail)):
                                
                                # === ROW 1: Reticle Toggle + Brand Selector ===
                                col_toggle, col_brand = st.columns([1, 2])
                                
                                with col_toggle:
                                    show_location = st.checkbox(
                                        "📍 Show location",
                                        value=(idx < 2 and not is_detail),  # First 2 major colors ON
                                        key=f"show_loc_{idx}",
                                        help="View where this color appears on the miniature"
                                    )
                                
                                with col_brand:
                                    selected_brand = st.selectbox(
                                        "Preferred brand:", 
                                        options=Affiliate.SUPPORTED_BRANDS, 
                                        index=brand_index, 
                                        key=f"brand_select_{idx}"
                                    )
                                
                                # === ROW 2: Reticle Image (if toggled ON) ===
                                if show_location:
                                    st.image(
                                        recipe['reticle'], 
                                        caption=f"Areas containing {recipe['family']} ({recipe['dominance']:.1f}%)",
                                        use_column_width=True
                                    )
                                    st.caption("💡 Colored border shows detected regions")
                                    st.markdown("---")
                                
                                # === ROW 3: Paint Recommendations ===
                                st.markdown("**🎨 Recommended Paints:**")
                                st.markdown("")  # Spacing
                                
                                # Base Paint
                                base_match = recipe['base'].get(selected_brand)
                                if base_match:
                                    col1, col2, col3 = st.columns([2, 1, 1])
                                    
                                    with col1:
                                        st.markdown(f"🛡️ **Base:** {base_match['name']}")
                                    
                                    with col2:
                                        url = get_affiliate_link(selected_brand, base_match['name'], region_option)
                                        st.markdown(f"<a href='{url}' target='_blank'><button style='width:100%; padding:8px; background:#5DA153; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;'>🛒 Buy</button></a>", unsafe_allow_html=True)
                                    
                                    with col3:
                                        if st.button("➕", key=f"add_b_{idx}", help="Add to cart", use_container_width=True):
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': base_match['name'], 
                                                'layer': 'Base', 
                                                'family': recipe['family']
                                            })
                                
                                # Highlight Paint
                                high_match = recipe['highlight'].get(selected_brand)
                                if high_match:
                                    col1, col2, col3 = st.columns([2, 1, 1])
                                    
                                    with col1:
                                        st.markdown(f"✨ **Highlight:** {high_match['name']}")
                                    
                                    with col2:
                                        url = get_affiliate_link(selected_brand, high_match['name'], region_option)
                                        st.markdown(f"<a href='{url}' target='_blank'><button style='width:100%; padding:8px; background:#5DA153; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;'>🛒 Buy</button></a>", unsafe_allow_html=True)
                                    
                                    with col3:
                                        if st.button("➕", key=f"add_h_{idx}", help="Add to cart", use_container_width=True):
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': high_match['name'], 
                                                'layer': 'Highlight', 
                                                'family': recipe['family']
                                            })
                                
                                # Shade/Wash Paint
                                shade_match = recipe['shade'].get(selected_brand)
                                if shade_match:
                                    col1, col2, col3 = st.columns([2, 1, 1])
                                    
                                    shade_icon = "💧" if recipe['shade_type'] == 'wash' else "🌑"
                                    shade_label = "Wash" if recipe['shade_type'] == 'wash' else "Shade"
                                    
                                    with col1:
                                        st.markdown(f"{shade_icon} **{shade_label}:** {shade_match['name']}")
                                    
                                    with col2:
                                        url = get_affiliate_link(selected_brand, shade_match['name'], region_option)
                                        st.markdown(f"<a href='{url}' target='_blank'><button style='width:100%; padding:8px; background:#5DA153; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;'>🛒 Buy</button></a>", unsafe_allow_html=True)
                                    
                                    with col3:
                                        if st.button("➕", key=f"add_s_{idx}", help="Add to cart", use_container_width=True):
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': shade_match['name'], 
                                                'layer': 'Shade', 
                                                'family': recipe['family']
                                            })
                                
                                # === ROW 4: Quick Add Buttons ===
                                st.markdown("---")
                                st.markdown("**⚡ Quick Actions:**")
                                
                                col1, col2 = st.columns(2)
                                
                                with col1:
                                    if st.button(
                                        "➕ Add All 3 Layers", 
                                        key=f"quick_all_{idx}",
                                        use_container_width=True,
                                        help="Add base, highlight, and shade all at once"
                                    ):
                                        added_count = 0
                                        
                                        if base_match:
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': base_match['name'], 
                                                'layer': 'Base', 
                                                'family': recipe['family']
                                            })
                                            added_count += 1
                                        
                                        if high_match:
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': high_match['name'], 
                                                'layer': 'Highlight', 
                                                'family': recipe['family']
                                            })
                                            added_count += 1
                                        
                                        if shade_match:
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': shade_match['name'], 
                                                'layer': 'Shade', 
                                                'family': recipe['family']
                                            })
                                            added_count += 1
                                        
                                        if added_count > 0:
                                            st.success(f"✅ Added {added_count} paint{'s' if added_count != 1 else ''} for {recipe['family']}!")
                                        else:
                                            st.warning("No paints available for this brand")
                                
                                with col2:
                                    if st.button(
                                        "➕ Base Only",
                                        key=f"quick_base_{idx}",
                                        use_container_width=True,
                                        help="Add just the base paint"
                                    ):
                                        if base_match:
                                            selected_paints.append({
                                                'brand': selected_brand, 
                                                'name': base_match['name'], 
                                                'layer': 'Base', 
                                                'family': recipe['family']
                                            })
                                            st.success(f"✅ Added {base_match['name']}!")
                                        else:
                                            st.warning("No base paint available for this brand")

                        if selected_paints:
                            st.divider()
                            st.markdown("#### 🛍️ Your Shopping Cart")
                            cart = ShoppingCart(region_option)
                            for p in selected_paints: cart.add_paint(p['brand'], p['name'])
                            summary = cart.get_cart_summary()
                            costs = cart.estimate_cost()
                            
                            c1, c2, c3 = st.columns(3)
                            with c1: st.metric("🎨 Paints", summary['total_bottles'])
                            with c2: st.metric("💰 Est. Cost", f"${costs['avg']:.0f}")
                            with c3: st.caption("Estimated based on region")
                            
                            c1, c2 = st.columns([2, 1])
                            with c1:
                                if st.button("🛍️ Shop on Amazon", type="primary", use_container_width=True):
                                    cart_url = cart.generate_cart_url()
                                    st.markdown(f"### [🔗 **Open Amazon** →]({cart_url})", unsafe_allow_html=True)
                            with c2:
                                paint_list = "\n".join([f"{i}. {p['brand']} - {p['name']}" for i, p in enumerate(selected_paints, 1)])
                                st.download_button("📄 Export List", data=paint_list, file_name="paint_list.txt", mime="text/plain", use_container_width=True)

                        # === QUICK ACTIONS (NEW) ===
                        st.divider()
                        st.markdown("### 📋 Quick Actions")
                        col1, col2, col3 = st.columns(3)
                        
                        # Generate list text once
                        all_paints = []
                        # Use the first brand available for the quick list if nothing selected
                        default_brand = Affiliate.SUPPORTED_BRANDS[0]
                        for recipe in recipes:
                            # Try to find a base match from ANY available brand if preferred not selected
                            base = recipe['base'].get(global_brand_pref, None)
                            if not base:
                                # Fallback to first available
                                for b in Affiliate.SUPPORTED_BRANDS:
                                    if recipe['base'].get(b):
                                        base = recipe['base'][b]
                                        break
                            
                            if base: 
                                all_paints.append(f"{recipe['family']}: {base['name']}")
                        
                        paint_list_text = "\n".join(all_paints)

                        with col1:
                            st.download_button(
                                "📥 Download Paint List",
                                paint_list_text,
                                file_name=f"paint_list_{datetime.now().strftime('%Y%m%d')}.txt",
                                mime="text/plain",
                                use_container_width=True
                            )

                        with col2:
                            if st.button("📋 Copy to Clipboard", use_container_width=True):
                                st.code(paint_list_text, language=None)
                                st.caption("👆 Select and copy with Ctrl+C")

                        with col3:
                            if st.button("🔗 Share Results", use_container_width=True):
                                colors_text = ", ".join([r['family'] for r in recipes[:3]])
                                st.info(f"Share this: Analyzed my miniature with SchemeStealer! Colors: {colors_text}")

                        # === FEEDBACK SYSTEM ===
                        st.markdown("### 📊 How Did We Do?")
                        col_fb1, col_fb2, col_fb3 = st.columns([1, 1, 2])
                        with col_fb1:
                            if st.button("👍 Accurate", use_container_width=True):
                                scan_id = st.session_state.get('current_scan_id')
                                if scan_id: st.session_state.feedback_logger.log_feedback(scan_id, 'thumbs_up', rating=5)
                                st.success("Thanks! 🎉")
                        with col_fb2:
                            if st.button("👎 Needs Work", use_container_width=True):
                                st.session_state.show_correction_form = True
                                st.rerun()
                        
                        if st.session_state.get('show_correction_form', False):
                            st.divider()
                            with st.expander("🔧 Help Us Improve", expanded=True):
                                st.markdown("**Your corrections train our AI!** Be as specific as possible.")
                                
                                issues = st.multiselect(
                                    "What went wrong?", 
                                    [
                                        "Wrong color family (e.g. called Gold when it's Brown)",
                                        "Missed small details or trim",
                                        "Wrong paint brand match",
                                        "Base wasn't removed properly",
                                        "Detected metallic when it's not",
                                        "Didn't detect metallic when it is"
                                    ]
                                )
                                
                                expected_colors = st.text_area(
                                    "What should the colors be?",
                                    placeholder="e.g. 'Gold not Brown' or 'Missed the silver trim'",
                                    help="Be specific - this helps train the AI!"
                                )
                                
                                comments = st.text_area(
                                    "Any other details?",
                                    placeholder="e.g. lighting conditions, photo quality, etc."
                                )
                                
                                # Optional email for follow-up
                                user_email = st.text_input(
                                    "Email (optional - for follow-up on your feedback)",
                                    placeholder="your@email.com"
                                )
                                
                                col_a, col_b = st.columns([1, 1])
                                with col_a:
                                    if st.button("✅ Submit Correction", use_container_width=True, type="primary"):
                                        scan_id = st.session_state.get('current_scan_id')
                                        if scan_id and expected_colors:
                                            st.session_state.feedback_logger.log_feedback(
                                                scan_id=scan_id,
                                                feedback_type='correction',
                                                rating=2,
                                                issues=issues,
                                                expected_colors=expected_colors,
                                                comments=comments,
                                                user_email=user_email if user_email else None
                                            )
                                            st.success("✅ Thank you! Your correction helps train the AI! 🧠")
                                            st.balloons()
                                            st.session_state.show_correction_form = False
                                            st.rerun()
                                        elif not expected_colors:
                                            st.error("Please tell us what the colors should be!")
                                
                                with col_b:
                                    if st.button("Cancel", use_container_width=True):
                                        st.session_state.show_correction_form = False
                                        st.rerun()

        except Exception as e:
            st.error(f"❌ Failed to load image: {str(e)}")
            logger.error(f"Image load error: {e}", exc_info=True)

    else:
        st.info("👆 Awaiting Pict-Capture Upload...")
        st.markdown("""
        ---
        ### 🎯 Operational Protocols
        1. **📸 Acquire Target:** Capture image of unit.
        2. **🔬 Upload Data:** Use the uplink above.
        3. **🧬 Analyse:** Cogitator extracts pigmentation.
        4. **🎨 Requisition:** Receive paint supply list.
        """)

# ============================================================================
# TAB 2: INSPIRATION PROTOCOLS (COMPLETE REDESIGN)
# ============================================================================

with tab2:
    st.markdown("### 🌌 Color Scheme Inspiration")
    st.markdown("""
    Extract color palettes from **any image** - landscapes, artwork, photos, or Pinterest finds!
    Perfect for creating custom army schemes inspired by nature, movies, or your favorite art.
    """)
    
    # Inspiration ideas expander
    with st.expander("💡 Inspiration Ideas & Tips", expanded=False):
        st.markdown("""
        **Great sources for color schemes:**
        - 🌅 Landscapes & nature (sunsets, forests, oceans)
        - 🎨 Artwork & paintings (your favorite pieces)
        - 🎬 Movie stills (sci-fi, fantasy scenes)
        - 🏛️ Architecture & buildings
        - 🦋 Animals & creatures (poison dart frogs, birds of paradise)
        - 🍕 Food (yes, really! Pizza Necrons, anyone?)
        - 🎮 Video game screenshots
        - 🌸 Flowers and plants
        
        **Pro Tips:**
        - Look for images with 3-5 distinct, contrasting colors
        - High contrast = striking schemes
        - Complementary colors = visual interest
        - Analogous colors = harmonious schemes
        """)
    
    # Upload area
    uploaded_inspiration = st.file_uploader(
        "📸 Upload Inspiration Image",
        type=["jpg", "jpeg", "png"],
        key="uploader_inspiration",
        help="Any image with colors you like - doesn't have to be a miniature!"
    )

    if uploaded_inspiration is not None:
        try:
            # Load image
            file_bytes = np.asarray(bytearray(uploaded_inspiration.read()), dtype=np.uint8)
            raw_img = cv2.imdecode(file_bytes, 1)
            raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
            if Mobile.AUTO_COMPRESS_IMAGES:
                raw_img = compress_image_for_mobile(raw_img, Mobile.COMPRESSED_IMAGE_WIDTH)
            
            # Show original image
            st.markdown("#### 🖼️ Your Inspiration Source")
            st.image(raw_img, use_column_width=True, caption="Original image")
            
            if st.button("🎨 EXTRACT COLOR PALETTE", type="primary", key="btn_inspiration"):
                with st.spinner("Analyzing color harmonies..."):
                    recipes, _, _ = st.session_state.engine.analyze_miniature(
                        raw_img, 
                        mode="scene", 
                        remove_base=False, 
                        use_awb=False, 
                        sat_boost=1.0, 
                        detect_details=False
                    )
                    
                    if not recipes:
                        st.warning("⚠️ Couldn't extract distinct colors. Try an image with more color variety!")
                    else:
                        st.success(f"✅ Extracted {len(recipes)} colors from your inspiration!")
                        # SAVE RESULTS to session state to handle reruns
                        st.session_state.inspiration_results = recipes
            
            # === DISPLAY LOGIC FOR INSPIRATION ===
            # Run this whenever results exist in session state (handles reruns)
            if st.session_state.inspiration_results:
                recipes = st.session_state.inspiration_results
                        
                # ===== BIG BEAUTIFUL PALETTE DISPLAY (NO RETICLES!) =====
                st.markdown("---")
                st.markdown("### 🎨 Your Custom Color Palette")
                
                # Show up to 5 colors in nice big swatches
                num_colors = min(len(recipes), 5)
                cols = st.columns(num_colors)
                
                for idx, recipe in enumerate(recipes[:5]):
                    with cols[idx]:
                        rgb = recipe['rgb_preview']
                        color_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                        
                        # Big beautiful color swatch (NO RETICLE!)
                        st.markdown(f"""
                            <div style='
                                background: {color_css};
                                height: 130px;
                                border-radius: 12px;
                                border: 3px solid #333;
                                box-shadow: 
                                    0 6px 16px rgba(0,0,0,0.5),
                                    inset 0 -4px 8px rgba(0,0,0,0.3);
                                margin-bottom: 12px;
                                transition: transform 0.2s;
                            ' onmouseover='this.style.transform="scale(1.05)"' 
                               onmouseout='this.style.transform="scale(1)"'>
                            </div>
                        """, unsafe_allow_html=True)
                        
                        # Color info
                        st.markdown(f"""
                            <div style='text-align: center;'>
                                <p style='font-weight: bold; font-size: 1.15em; margin-bottom: 4px; color: #ddd;'>
                                    {recipe['family']}
                                </p>
                                <p style='color: #888; font-size: 0.95em;'>
                                    {recipe['dominance']:.0f}% of image
                                </p>
                            </div>
                        """, unsafe_allow_html=True)
                
                st.markdown("---")
                
                # ===== USAGE SUGGESTIONS =====
                st.markdown("### 💡 How to Use This Scheme")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.markdown("**🎨 Suggested Color Roles:**")
                    if len(recipes) >= 3:
                        st.markdown(f"""
                        - **🛡️ Primary Armor:** {recipes[0]['family']} ({recipes[0]['dominance']:.0f}%)
                        - **👕 Secondary/Cloth:** {recipes[1]['family']} ({recipes[1]['dominance']:.0f}%)
                        - **⚔️ Accent/Weapons:** {recipes[2]['family']} ({recipes[2]['dominance']:.0f}%)
                        """)
                        if len(recipes) >= 4:
                            st.markdown(f"- **✨ Details/Trim:** {recipes[3]['family']} ({recipes[3]['dominance']:.0f}%)")
                        if len(recipes) >= 5:
                            st.markdown(f"- **👁️ Eyes/Gems:** {recipes[4]['family']} ({recipes[4]['dominance']:.0f}%)")
                    else:
                        st.info("💡 Upload an image with more distinct colors for better suggestions!")
                
                with col2:
                    st.markdown("**🎭 Example Applications:**")
                    st.markdown("""
                    - Space Marines chapter colors
                    - Chaos warband theme
                    - Necron dynasty scheme
                    - Tau sept colors
                    - Eldar craftworld
                    - Ork klan warpaint
                    - Terrain color palette
                    - Display base theme
                    """)
                
                st.markdown("---")
                
                # ===== PAINT RECOMMENDATIONS (SIMPLIFIED) =====
                st.markdown("### 🛡️ Paint Recommendations")
                st.caption(f"Showing matches for: **{global_brand_pref}** (Change in Sidebar)")
                
                # Use global preference
                preferred_brand = global_brand_pref
                
                # Show paints in expandable sections
                for idx, recipe in enumerate(recipes):
                    rgb = recipe['rgb_preview']
                    color_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                    
                    # Use simple emoji instead of HTML for title to avoid parsing errors
                    with st.expander(
                        f"🎨 {recipe['family']} ({recipe['dominance']:.0f}%)",
                        expanded=(idx == 0)  # First color expanded by default
                    ):
                        col_swatch, col_paints = st.columns([1, 2])
                        
                        with col_swatch:
                            # Big swatch instead of messy reticle
                            st.markdown(f"""
                                <div style='
                                    background: linear-gradient(135deg, 
                                        {color_css} 0%, 
                                        {color_css} 60%, 
                                        rgba(0,0,0,0.4) 100%);
                                    height: 160px;
                                    border-radius: 10px;
                                    border: 3px solid #333;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 3em;
                                    box-shadow: inset 0 -3px 6px rgba(0,0,0,0.3);
                                '>
                                    🎨
                                </div>
                            """, unsafe_allow_html=True)
                            
                            st.caption(f"Represents {recipe['dominance']:.0f}% of your image")
                        
                        with col_paints:
                            st.markdown(f"**{preferred_brand} Paint Matches:**")
                            st.markdown("")  # Spacing
                            
                            # Base
                            base = recipe['base'].get(preferred_brand)
                            if base:
                                url = get_affiliate_link(preferred_brand, base['name'], region_option)
                                st.markdown(f"🛡️ **Base:** [{base['name']}]({url}) 🛒")
                            
                            # Highlight
                            highlight = recipe['highlight'].get(preferred_brand)
                            if highlight:
                                url = get_affiliate_link(preferred_brand, highlight['name'], region_option)
                                st.markdown(f"✨ **Highlight:** [{highlight['name']}]({url}) 🛒")
                            
                            # Shade
                            shade = recipe['shade'].get(preferred_brand)
                            if shade:
                                url = get_affiliate_link(preferred_brand, shade['name'], region_option)
                                shade_icon = "💧" if recipe['shade_type'] == 'wash' else "🌑"
                                st.markdown(f"{shade_icon} **Shade:** [{shade['name']}]({url}) 🛒")
                            
                            st.markdown("---")
                            
                            # Show other brands (NO NESTED EXPANDER)
                            st.markdown("**🔍 Alternatives:**")
                            for brand in Affiliate.SUPPORTED_BRANDS:
                                if brand != preferred_brand:
                                    base_alt = recipe['base'].get(brand)
                                    if base_alt:
                                        st.caption(f"**{brand}:** {base_alt['name']}")
                
                # ===== EXPORT & SHARE =====
                st.markdown("---")
                st.markdown("### 💾 Save & Share Your Palette")
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    # Palette summary
                    palette_text = "MY CUSTOM COLOR SCHEME\n"
                    palette_text += f"Generated: {datetime.now().strftime('%Y-%m-%d')}\n\n"
                    palette_text += "COLORS:\n"
                    for r in recipes:
                        palette_text += f"- {r['family']}: {r['dominance']:.0f}%\n"
                    
                    st.download_button(
                        "📥 Download Palette",
                        palette_text,
                        file_name=f"color_palette_{datetime.now().strftime('%Y%m%d')}.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                
                with col2:
                    # Shopping list
                    paint_list = f"{preferred_brand} Shopping List:\n\n"
                    for r in recipes:
                        base = r['base'].get(preferred_brand)
                        if base:
                            paint_list += f"☐ {base['name']}\n"
                    
                    st.download_button(
                        "🛒 Shopping List",
                        paint_list,
                        file_name=f"{preferred_brand.lower()}_paints.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                
                with col3:
                    if st.button("🔗 Share on Social", use_container_width=True):
                        colors_text = ", ".join([r['family'] for r in recipes[:3]])
                        share_text = f"Created a custom color scheme with SchemeStealer! 🎨\nColors: {colors_text}"
                        st.info(f"**Copy to share:**\n\n{share_text}")
                        
        except Exception as e:
            st.error(f"❌ Error processing image: {str(e)}")
            logger.error(f"Inspiration error: {e}", exc_info=True)
            st.info("💡 Try a different image or check that the file isn't corrupted.")

# ============================================================================
# FOOTER
# ============================================================================

st.divider()
st.markdown(f"""
<div style='text-align: center; color: #666; font-size: 0.8em; font-family: monospace;'>
    {APP_NAME} v{APP_VERSION} | 
    Sanctioned by the Mechanicus | 
    <a href='mailto:schemestealer@gmail.com?subject=SchemeStealer%20Feedback' style='color: #5DA153; text-decoration: none;'>
        Transmit Astropathic Feedback
    </a>
</div>
""", unsafe_allow_html=True)