"""
SchemeStealer v3.1.0 - Main Application
Mobile-optimized Streamlit MVP with Enhanced UI/UX
Features: Memory Management, Session Persistence, ML Logging, Feedback System, Themed UI
"""

import streamlit as st
import cv2
import numpy as np
import random
import time
import os
import gc
import json
import base64
from PIL import Image
from typing import List, Optional
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
# MEMORY MANAGEMENT & UTILS
# ============================================================================

def cleanup_opencv_image(img):
    """
    Force release of OpenCV image memory to prevent leaks on free-tier hosting.
    Critical for Streamlit apps handling large image arrays.
    """
    if img is not None:
        try:
            del img
        except Exception:
            pass
    gc.collect()

def get_cart_state_as_json():
    """Serialize shopping cart items to JSON string"""
    if 'shopping_cart' in st.session_state:
        return json.dumps(st.session_state.shopping_cart.cart_items)
    return "[]"

def render_paint_list_ui():
    """
    Render the collapsed Paint List (Cart) UI.
    Shared between Auspex and Inspiration tabs.
    """
    items = []
    if 'shopping_cart' in st.session_state:
        items = st.session_state.shopping_cart.cart_items
    
    count = len(items)
    
    # Always show the expander so user knows where the list is
    label = f"📋 Your Paint List ({count} items)" if count > 0 else "📋 Your Paint List (Empty)"
    
    # Auto-expand if items were just added (you can track this with a flag if needed)
    with st.expander(label, expanded=False):
        if count == 0:
            st.info("Your list is empty. Add paints from scan results!")
        else:
            summary = st.session_state.shopping_cart.get_cart_summary()
            costs = st.session_state.shopping_cart.estimate_cost()
            
            # Simple list view
            for item in items:
                st.caption(f"▫️ **{item['brand']}** - {item['name']}")
            
            st.divider()
            
            c1, c2 = st.columns(2)
            with c1:
                st.caption(f"**Est. Total:** ${costs['avg']:.0f}")
            with c2:
                # The only "loud" button, tucked away inside
                if st.button("🛒 Find on Amazon", type="primary", use_container_width=True, key=f"shop_btn_{int(time.time()*1000)}"):
                    cart_url = st.session_state.shopping_cart.generate_cart_url()
                    st.markdown(f"### [🔗 **Click to Open Amazon** →]({cart_url})", unsafe_allow_html=True)
            
            if st.button("🗑️ Clear List", use_container_width=True, key=f"clear_btn_{int(time.time()*1000)}"):
                st.session_state.shopping_cart.clear_cart()
                st.rerun()

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
            "Purging Heretical Colour Casts...",
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
            "Divining Colour Harmonics...",
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
        "Harmonizing Colour Palettes...",
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
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600&display=swap');

    /* ========================================================================
       CLEAN CUSTOM UPLOAD BOXES
       ======================================================================== */

    .auspex-upload-box,
    .inspiration-upload-box {
        position: relative !important;
        z-index: 1 !important;
    }

    .auspex-upload-box {
        min-height: 220px;
        border: 3px dashed #4A7C2C;
        border-radius: 6px;  /* Sharp corners */
        background: linear-gradient(135deg, 
            rgba(45, 80, 22, 0.12) 0%, 
            rgba(26, 48, 16, 0.25) 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        cursor: pointer;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
        margin: 30px 0;
    }

    .auspex-upload-box .upload-icon {
        font-size: 3.5em;
        margin-bottom: 20px;
        filter: drop-shadow(0 0 10px rgba(107, 159, 62, 0.4));
    }

    .auspex-upload-box .upload-main-text {
        color: #6B9F3E;
        font-family: 'Share Tech Mono', monospace;
        font-size: 1.4em;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 12px;
        text-shadow: 0 0 8px rgba(107, 159, 62, 0.3);
    }

    .auspex-upload-box .upload-sub-text {
        color: #8FD14F;
        font-family: 'Share Tech Mono', monospace;
        font-size: 1em;
        letter-spacing: 1px;
    }

    .auspex-upload-box .upload-file-types {
        color: #6B7C5F;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.85em;
        margin-top: 10px;
    }

    /* === INSPIRATION UPLOAD BOX === */
    .inspiration-upload-box {
        min-height: 220px;
        border: 3px dashed #6B2D7C;
        border-radius: 18px;  /* Rounded corners */
        background: linear-gradient(135deg, 
            rgba(107, 45, 124, 0.12) 0%, 
            rgba(58, 21, 69, 0.25) 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem;
        cursor: pointer;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.4);
        margin: 30px 0;
    }

    .inspiration-upload-box .upload-icon {
        font-size: 3.5em;
        margin-bottom: 20px;
        filter: drop-shadow(0 0 10px rgba(169, 123, 196, 0.4));
    }

    .inspiration-upload-box .upload-main-text {
        color: #A97BC4;
        font-family: 'Raleway', sans-serif;
        font-size: 1.4em;
        font-weight: 600;
        letter-spacing: 2px;
        margin-bottom: 12px;
        text-shadow: 0 0 10px rgba(169, 123, 196, 0.3);
    }

    .inspiration-upload-box .upload-sub-text {
        color: #D4A5FF;
        font-family: 'Raleway', sans-serif;
        font-size: 1em;
        letter-spacing: 0.5px;
        font-weight: 300;
    }

    .inspiration-upload-box .upload-file-types {
        color: #8B7E8B;
        font-family: 'Raleway', sans-serif;
        font-size: 0.85em;
        margin-top: 10px;
    }

    /* === STREAMLIT FILE UPLOADER OVERLAY - EXPANDED CLICK ZONE === */
    div[data-testid="stFileUploader"] {
        position: relative !important;
        margin-top: -360px !important; 
        height: 360px !important;
        width: 100% !important;
        z-index: 99999 !important;
        opacity: 0 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        overflow: hidden !important;
        display: block !important;
    }

    section[data-testid="stFileUploaderDropzone"] {
        min-height: 100% !important;
        height: 100% !important;
        width: 100% !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        align-items: stretch !important;
        display: flex !important;
    }

    section[data-testid="stFileUploaderDropzone"] > div {
        height: 100% !important;
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
    }

    input[type="file"] {
        display: block !important;
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        opacity: 0 !important;
        cursor: pointer !important;
        z-index: 100000 !important;
    }
    
    div[data-testid="stFileUploader"] button {
        pointer-events: none !important; 
    }

    /* Mobile-first responsive design */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 100%;
    }
    
    /* Touch-friendly buttons - Tactical Green */
    .stButton>button {
        width: 100%;
        min-height: 50px;
        background-color: #1a2e1a; 
        color: #5DA153; 
        border: 1px solid #5DA153;
        font-family: 'Share Tech Mono', monospace; 
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

        /* ========================================================================
       TAB-SPECIFIC ACTION BUTTONS - WORKING VERSION
       ======================================================================== */

    /* BASE BUTTON STYLING - All buttons full width */
    .stButton > button {
        width: 100% !important;
        height: 48px !important;
        font-size: 0.9em !important;
        font-weight: 600 !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        white-space: nowrap !important;
        border-radius: 6px !important;
        padding: 0 16px !important;
    }

    /* AUSPEX TAB - GREEN THEME */
    .auspex-tab-container .stButton > button,
    .auspex-tab-container button[kind="primary"],
    .auspex-tab-container button[kind="secondary"] {
        background: linear-gradient(135deg, #2D5016 0%, #1A3010 100%) !important;
        color: #6B9F3E !important;
        border: 2px solid #4A7C2C !important;
    }

    .auspex-tab-container .stButton > button:hover,
    .auspex-tab-container button:hover {
        background: linear-gradient(135deg, #4A7C2C 0%, #6B9F3E 100%) !important;
        color: #000000 !important;
        border-color: #8FD14F !important;
        box-shadow: 0 0 30px rgba(143, 209, 79, 0.4) !important;
        transform: translateY(-2px) !important;
    }

    /* AUSPEX SUCCESS MESSAGES */
    .auspex-tab-container .stSuccess {
        background-color: rgba(74, 124, 44, 0.15) !important;
        border-left: 4px solid #6B9F3E !important;
        color: #8FD14F !important;
    }

    /* AUSPEX EXPANDER */
    .auspex-tab-container .streamlit-expanderHeader {
        border-color: #4A7C2C !important;
    }

    /* INSPIRATION TAB - PURPLE THEME */
    /* Target all buttons inside inspiration container */
    .inspiration-tab-container .stButton > button,
    .inspiration-tab-container button[kind="primary"],
    .inspiration-tab-container button[kind="secondary"] {
        background: linear-gradient(135deg, #6B2D7C 0%, #3A1545 100%) !important;
        color: #A97BC4 !important;
        border: 2px solid #8B4FA8 !important;
        font-family: 'Raleway', sans-serif !important;
    }

    .inspiration-tab-container .stButton > button:hover,
    .inspiration-tab-container button:hover {
        background: linear-gradient(135deg, #8B4FA8 0%, #A97BC4 100%) !important;
        color: #FFFFFF !important;
        border-color: #D4A5FF !important;
        box-shadow: 0 0 40px rgba(212, 165, 255, 0.4) !important;
    }

    /* INSPIRATION SUCCESS MESSAGES */
    .inspiration-tab-container .stSuccess {
        background-color: rgba(107, 45, 124, 0.15) !important;
        border-left: 4px solid #A97BC4 !important;
        color: #D4A5FF !important;
    }

    /* INSPIRATION EXPANDER */
    .inspiration-tab-container .streamlit-expanderHeader {
        border-color: #6B2D7C !important;
    }

    /* === FALLBACK: Default GREEN for any unscoped buttons === */
    button[kind="primary"]:not(.inspiration-tab-container *) {
        background: linear-gradient(135deg, #2D5016 0%, #1A3010 100%) !important;
        color: #6B9F3E !important;
        border: 2px solid #4A7C2C !important;
    }

    /* === EXPANDERS (Shopping Cart) === */
    .streamlit-expanderHeader {
        font-family: 'Share Tech Mono', monospace !important;
        background-color: #1a1a1a !important;
        border: 2px solid #4A7C2C !important;
        border-radius: 6px !important;
        padding: 14px !important;
    }

    .streamlit-expanderHeader:hover {
        background-color: #252525 !important;
        border-color: #6B9F3E !important;
        box-shadow: 0 2px 8px rgba(107, 159, 62, 0.3) !important;
    }

    /* SUCCESS MESSAGES - Default GREEN */
    .stSuccess {
        background-color: rgba(74, 124, 44, 0.15) !important;
        border-left: 4px solid #6B9F3E !important;
        color: #8FD14F !important;
    }

    .stSuccess svg {
        color: #6B9F3E !important;
    }


    /* === DIVIDERS (HR) === */
    /* Default GREEN dividers */
    hr {
        border: none !important;
        height: 2px !important;
        background: linear-gradient(90deg, 
            transparent 0%, 
            #6B9F3E 50%, 
            transparent 100%) !important;
    }

    /* AUSPEX GREEN dividers */
    .auspex-tab-container hr {
        background: linear-gradient(90deg, 
            transparent 0%, 
            #6B9F3E 50%, 
            transparent 100%) !important;
    }

    /* INSPIRATION PURPLE dividers */
    .inspiration-tab-container hr {
        background: linear-gradient(90deg, 
            transparent 0%, 
            #A97BC4 50%, 
            transparent 100%) !important;
    }

    /* === METRICS === */
    /* Default GREEN metrics */
    [data-testid="stMetricValue"] {
        color: #6B9F3E !important;
    }

    /* AUSPEX GREEN metrics */
    .auspex-tab-container [data-testid="stMetricValue"] {
        color: #6B9F3E !important;
    }

    /* INSPIRATION PURPLE metrics */
    .inspiration-tab-container [data-testid="stMetricValue"] {
        color: #A97BC4 !important;
    }

    /* === INFO MESSAGES === */
    /* Default GREEN info */
    .stInfo {
        background-color: rgba(74, 124, 44, 0.1) !important;
        border-left: 4px solid #6B9F3E !important;
    }

    /* AUSPEX GREEN info */
    .auspex-tab-container .stInfo {
        background-color: rgba(74, 124, 44, 0.1) !important;
        border-left: 4px solid #6B9F3E !important;
    }

    /* INSPIRATION PURPLE info */
    .inspiration-tab-container .stInfo {
        background-color: rgba(107, 45, 124, 0.1) !important;
        border-left: 4px solid #A97BC4 !important;
    }


    /* SUCCESS MESSAGES - GREEN default */
    .stSuccess {
        background-color: rgba(74, 124, 44, 0.15) !important;
        border-left: 4px solid #6B9F3E !important;
    }

    /* EXPANDER - GREEN default */
    .streamlit-expanderHeader {
        border-color: #4A7C2C !important;
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
    
    /* Loading spinner colour */
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
        /* Fix Title Wrapping */
        h1 {
            font-size: 8vw !important; /* Scales with screen width (approx 30-35px) */
            white-space: normal !important; /* Allow text to wrap naturally */
            line-height: 1.2 !important; /* Prevent gaps if it wraps */
            text-align: center !important;
        }

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
# SESSION STATE INITIALIZATION & CACHING
# ============================================================================

# CACHING: Initialize heavy resources once per session
@st.cache_resource
def load_engine():
    """Initialize  Engine once"""
    try:
        # === FIX FOR STREAMLIT CLOUD PATHS ===
        base_dir = os.path.dirname(os.path.abspath(__file__))
        paints_path = os.path.join(base_dir, 'paints.json')
        engine = SchemeStealerEngine(paints_path)
        logger.info(f"Engine loaded successfully from {paints_path}")
        return engine
    except Exception as e:
        st.error(f"❌ Cogitator Failure: {e}")
        logger.error(f"Engine initialization failed: {e}", exc_info=True)
        return None

@st.cache_resource
def load_photo_processor():
    """Initialize Photo Processor once"""
    return PhotoProcessor()

# Initialize session state with cached resources
if 'engine' not in st.session_state:
    st.session_state.engine = load_engine()
    if st.session_state.engine is None:
        st.stop()

if 'photo_processor' not in st.session_state:
    st.session_state.photo_processor = load_photo_processor()

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

# === INSPIRATION TAB STATE VARIABLES (NEW) ===
if 'show_inspiration_correction' not in st.session_state:
    st.session_state.show_inspiration_correction = False

if 'show_inspiration_suggestion' not in st.session_state:
    st.session_state.show_inspiration_suggestion = False

if 'current_inspiration_scan_id' not in st.session_state:
    st.session_state.current_inspiration_scan_id = None

if 'inspiration_source_type' not in st.session_state:
    st.session_state.inspiration_source_type = None

# ============================================================================
# SIDEBAR SETTINGS (Shared)
# ============================================================================

with st.sidebar:
    st.header("🌍 Sector / Region")
    # DEFINED HERE - needed for ShoppingCart
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
    # UPDATED: Correct Ko-fi Link
    st.markdown("[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColour=white)](https://ko-fi.com/schemestealer)")
    
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
# SHOPPING CART PERSISTENCE (LocalStorage Sync)
# ============================================================================

# 1. On load, check for cart data passed via query param (from JS reload)
if 'cart_data' in st.query_params:
    try:
        cart_items = json.loads(st.query_params['cart_data'])
        if 'shopping_cart' not in st.session_state:
            st.session_state.shopping_cart = ShoppingCart(region_option)
        
        # Populate cart if it's empty but data came from URL
        if not st.session_state.shopping_cart.cart_items and cart_items:
            st.session_state.shopping_cart.cart_items = cart_items
            # Clear the query param to clean URL
            st.query_params.clear()
    except Exception as e:
        logger.error(f"Failed to restore cart: {e}")

# 2. Ensure cart exists
if 'shopping_cart' not in st.session_state:
    st.session_state.shopping_cart = ShoppingCart(region_option)

# 3. Inject JS to sync cart to LocalStorage (NO RELOADS - fixes page jump issue)
st.components.v1.html(
    f"""
    <script>
        const currentCart = {get_cart_state_as_json()};
        
        // SAVE: Update LocalStorage with current session state
        if (currentCart.length > 0) {{
            localStorage.setItem('schemestealer_cart', JSON.stringify(currentCart));
        }}
        
        // LOAD: On first visit only, log cart data but DON'T force reload
        // This prevents the page jump when uploading files
        const savedCart = localStorage.getItem('schemestealer_cart');
        
        if (currentCart.length === 0 && savedCart && savedCart !== '[]') {{
            console.log('Cart data found in localStorage:', savedCart);
            // Cart restoration happens naturally via Streamlit query params
            // NO FORCED RELOAD - this was causing the page jump bug
        }}
    </script>
    """,
    height=0,
    width=0
)

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
        warnings.append("🔎 **Tiny Details Alert**: We detected some very small details "
                       f"({len(small_details)} colours <2%). These may be approximate. "
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
        st.info("**👁️ Quick Heads Up:**\n\n" + "\n\n".join(warnings))

# Tabs for Main Scan and Inspiration Mode
# UPDATED: More balanced tab names
tab1, tab2 = st.tabs(["🧬 AUSPEX SCAN", "🌌 COLOUR INSPIRATION"])

# ============================================================================
# TAB 1: AUSPEX SCAN (Miniature Scanner)
# ============================================================================

with tab1:
    st.markdown('<div class="auspex-tab-container">', unsafe_allow_html=True)
    # === BIG HEADER ===
    st.markdown("""
        <h2 style='
            color: #6B9F3E; 
            font-family: "Cinzel", serif; 
            text-align: center;
            text-shadow: 0 0 15px rgba(107, 159, 62, 0.35);
            margin: 30px 0 15px 0;
            font-size: 2.2em;
            text-transform: uppercase;
            letter-spacing: 4px;
        '>
            ⚙️ TACTICAL AUSPEX
        </h2>
        <p style='
            text-align: center; 
            color: #8FD14F; 
            font-size: 0.95em; 
            margin-bottom: 25px;
            font-family: "Share Tech Mono", monospace;
            letter-spacing: 1px;
        '>
            Scan Target • Identify Paints • The Emperor Protects
        </p>
    """, unsafe_allow_html=True)
    
    # === COMBINED COLLAPSIBLE INFO ===
    with st.expander("💡 New to SchemeStealer? Quick Guide", expanded=False):
        st.markdown("""
        ### 👋 **Welcome to SchemeStealer!**
        
        **How it works:**
        1. Upload a photo of your painted miniature
        2. AI analyses the colours (10 seconds)
        3. Get exact paint matches from 3 brands
        4. Shop for the paints you need
        
        ---
        
        ### 📸 **Photo Tips for Best Results:**
        
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
    
    # === CUSTOM UPLOAD BOX ===
    st.markdown("""
    <div class="auspex-upload-box">
        <div class="upload-icon">⚙️</div>
        <div class="upload-main-text">CLICK TO UPLOAD</div>
        <div class="upload-sub-text">Drag and drop or click to initiate scan</div>
        <div class="upload-file-types">JPG, JPEG, PNG • Max 10MB</div>
    </div>
    """, unsafe_allow_html=True)

    # === STREAMLIT UPLOADER (Invisible overlay) ===
    uploaded_file = st.file_uploader(
        "Upload Miniature",
        type=["jpg", "jpeg", "png"],
        key="uploader_auspex",
        help="Upload miniature for analysis",
        label_visibility="collapsed"
    )

    if uploaded_file is not None:
        # Mark as visited after interaction
        st.session_state.first_visit = False
        
        # Initialize raw_img to None to ensure safe cleanup
        raw_img = None
        
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
                # UPDATED: Centered button
                if st.button("🧬 INITIATE AUSPEX SCAN", type="primary", key="btn_auspex", use_container_width=True):
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
                        
                        # Stage 5: Colour extraction (55-75%) - MAIN WORK HAPPENS HERE
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
                            st.session_state.analytics.track_scan(
                                mode=mode_key,
                                num_colors=len(recipes),
                                quality_score=quality_report.score
                            )
                        
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
                            st.caption(f"⏳ Analysis completed in {st.session_state.processing_time:.2f} seconds")
                        
                        # Add summary metrics
                        st.markdown("---")
                        col1, col2, col3, col4 = st.columns(4)

                        major_colours = [r for r in recipes if not r.get('is_detail', False)]
                        detail_colours = [r for r in recipes if r.get('is_detail', False)]
                        metallic_count = sum(1 for r in recipes if 'Metal' in r['family'] or 'Gold' in r['family'] or 'Silver' in r['family'])

                        with col1:
                            st.metric(
                                "Colours Detected",
                                len(recipes),
                                delta=f"{len(detail_colours)} details" if detail_colours else None
                            )

                        with col2:
                            st.metric(
                                "Metallic Colours",
                                metallic_count
                            )

                        with col3:
                            st.metric(
                                "Photo Quality",
                                f"{quality_score}/100",
                                delta="Excellent" if quality_score > 80 else ("Good" if quality_score > 60 else "Fair")
                            )

                        with col4:
                            total_paints_needed = len(major_colours) * 2  # Base + highlight for major colours
                            st.metric(
                                "Est. Paints",
                                f"{total_paints_needed}+ bottles"
                            )

                        st.markdown("---")

                        show_smart_disclaimer(recipes, quality_score)
                        
                        # ===== LIVE PALETTE PREVIEW STRIP =====
                        st.markdown("### 🎨 Your Colour Scheme Preview")
                        
                        # Create proportional colour bar (No spaces at start of lines!)
                        palette_html = "<div style='display: flex; height: 80px; border-radius: 12px; overflow: hidden; border: 3px solid #333; box-shadow: 0 4px 12px rgba(0,0,0,0.4); margin: 16px 0;'>"
                        
                        # Calculate total coverage for proportions
                        display_recipes = recipes[:6]  # Show up to 6 colours
                        total_coverage = sum([r['dominance'] for r in display_recipes])
                        
                        for recipe in display_recipes:
                            rgb = recipe['rgb_preview']
                            colour_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                            width_pct = (recipe['dominance'] / total_coverage) * 100
                            
                            # Choose text colour based on background brightness
                            brightness = sum(rgb) / 3
                            text_color = '#000' if brightness > 128 else '#fff'
                            text_shadow = '#fff' if brightness < 128 else '#000'
                            
                            # No indentation in the f-string to prevent code block rendering
                            palette_html += f"<div style='background: {colour_css}; width: {width_pct}%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: {text_color}; text-shadow: 0 0 3px {text_shadow}; padding: 8px; font-family: \"Share Tech Mono\", monospace; transition: all 0.2s; cursor: pointer;' onmouseover='this.style.transform=\"scale(1.05)\"; this.style.zIndex=\"10\";' onmouseout='this.style.transform=\"scale(1)\"; this.style.zIndex=\"1\";'><div style='font-size: 1.2em; font-weight: bold;'>{recipe['dominance']:.0f}%</div><div style='font-size: 0.85em;'>{recipe['family']}</div></div>"
                        
                        palette_html += "</div>"
                        st.markdown(palette_html, unsafe_allow_html=True)
                        
                        # Add caption
                        if len(recipes) > 6:
                            st.caption(f"**Showing top 6 of {len(recipes)} detected colours**")
                        
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
                                        value=(idx < 2 and not is_detail),  # First 2 major colours ON
                                        key=f"show_loc_{idx}",
                                        help="View where this colour appears on the miniature"
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
                                        use_container_width=True
                                    )
                                    st.caption("💡 Coloured border shows detected regions")
                                    st.markdown("---")
                                
                                # === ROW 3: Paint Recommendations ===
                                st.markdown("**🎨 Recommended Paints:**")
                                st.markdown("")  # Spacing
                                
                                # Base Paint
                                base_match = recipe['base'].get(selected_brand)
                                if base_match:
                                    col1, col2 = st.columns([3, 1])
                                    
                                    with col1:
                                        url = get_affiliate_link(selected_brand, base_match['name'], region_option)
                                        st.markdown(f"🛡️ **Base:** [{base_match['name']}]({url})")
                                    
                                    with col2:
                                        if st.button("➕", key=f"add_b_{idx}", help="Add to List"):
                                            st.session_state.shopping_cart.add_paint(selected_brand, base_match['name'])
                                            st.rerun()
                                
                                # Highlight Paint
                                high_match = recipe['highlight'].get(selected_brand)
                                if high_match:
                                    col1, col2 = st.columns([3, 1])
                                    
                                    with col1:
                                        url = get_affiliate_link(selected_brand, high_match['name'], region_option)
                                        st.markdown(f"✨ **Highlight:** [{high_match['name']}]({url})")
                                    
                                    with col2:
                                        if st.button("➕", key=f"add_h_{idx}", help="Add to List"):
                                            st.session_state.shopping_cart.add_paint(selected_brand, high_match['name'])
                                            st.rerun()
                                
                                # Shade/Wash Paint
                                shade_match = recipe['shade'].get(selected_brand)
                                if shade_match:
                                    col1, col2 = st.columns([3, 1])
                                    
                                    shade_icon = "💧" if recipe['shade_type'] == 'wash' else "🌑"
                                    shade_label = "Wash" if recipe['shade_type'] == 'wash' else "Shade"
                                    
                                    with col1:
                                        url = get_affiliate_link(selected_brand, shade_match['name'], region_option)
                                        st.markdown(f"{shade_icon} **{shade_label}:** [{shade_match['name']}]({url})")
                                    
                                    with col2:
                                        if st.button("➕", key=f"add_s_{idx}", help="Add to List"):
                                            st.session_state.shopping_cart.add_paint(selected_brand, shade_match['name'])
                                            st.rerun()
                                
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
                                        if base_match: st.session_state.shopping_cart.add_paint(selected_brand, base_match['name'])
                                        if high_match: st.session_state.shopping_cart.add_paint(selected_brand, high_match['name'])
                                        if shade_match: st.session_state.shopping_cart.add_paint(selected_brand, shade_match['name'])
                                        st.rerun()
                                
                                with col2:
                                    if st.button(
                                        "➕ Base Only",
                                        key=f"quick_base_{idx}",
                                        use_container_width=True,
                                        help="Add just the base paint"
                                    ):
                                        if base_match: 
                                            st.session_state.shopping_cart.add_paint(selected_brand, base_match['name'])
                                            st.rerun()

                        # === QUICK ACTIONS & FEEDBACK (RESTORED) ===
                        st.divider()
                        st.markdown("### 📋 Quick Actions")
                        col_qa1, col_qa2, col_qa3 = st.columns(3)
                        
                        # Generate list text
                        all_paints = []
                        for recipe in recipes:
                            # Try preferred brand, fallback to first available
                            base = recipe['base'].get(global_brand_pref)
                            if not base:
                                for b in Affiliate.SUPPORTED_BRANDS:
                                    if recipe['base'].get(b):
                                        base = recipe['base'][b]
                                        break
                            if base:
                                all_paints.append(f"{recipe['family']}: {base['name']}")
                        
                        paint_list_text = "\n".join(all_paints)

                        with col_qa1:
                            st.download_button(
                                "📥 Download List",
                                paint_list_text,
                                file_name=f"paint_list_{datetime.now().strftime('%Y%m%d')}.txt",
                                mime="text/plain",
                                use_container_width=True
                            )

                        with col_qa2:
                            if st.button("📋 Copy List", use_container_width=True):
                                st.code(paint_list_text, language=None)

                        with col_qa3:
                            if st.button("🔗 Share Results", use_container_width=True):
                                colours_text = ", ".join([r['family'] for r in recipes[:3]])
                                st.info(f"Share this: Analysed my miniature with SchemeStealer! Colours: {colours_text}")

                        # === FEEDBACK SYSTEM ===
                        st.markdown("### 📊 How Did We Do?")
                        col_fb1, col_fb2, col_fb3 = st.columns([1, 1, 2])
                        
                        with col_fb1:
                            if st.button("👍 Accurate", use_container_width=True):
                                scan_id = st.session_state.get('current_scan_id')
                                if scan_id: 
                                    st.session_state.feedback_logger.log_feedback(scan_id, 'thumbs_up', rating=5)
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
                                        "Wrong colour family (e.g. called Gold when it's Brown)",
                                        "Missed small details or trim",
                                        "Wrong paint brand match",
                                        "Base wasn't removed properly",
                                        "Detected metallic when it's not",
                                        "Didn't detect metallic when it is"
                                    ]
                                )
                                
                                expected_colours = st.text_area(
                                    "What should the colours be?",
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
                                        if scan_id and expected_colours:
                                            st.session_state.feedback_logger.log_feedback(
                                                scan_id=scan_id,
                                                feedback_type='correction',
                                                rating=2,
                                                issues=issues,
                                                expected_colours=expected_colours,
                                                comments=comments,
                                                user_email=user_email if user_email else None
                                            )
                                            st.success("✅ Thank you! Your correction helps train the AI! 🧠")
                                            st.balloons()
                                            st.session_state.show_correction_form = False
                                            st.rerun()
                                        elif not expected_colours:
                                            st.error("Please tell us what the colours should be!")
                                
                                with col_b:
                                    if st.button("Cancel", use_container_width=True):
                                        st.session_state.show_correction_form = False
                                        st.rerun()

        except Exception as e:
            st.error(f"❌ Failed to load image: {str(e)}")
            logger.error(f"Image load error: {e}", exc_info=True)
        finally:
            # MEMORY CLEANUP
            cleanup_opencv_image(raw_img)

    else:
        pass

    # === DISPLAY PAINT LIST (Collapsed at bottom) ===
    st.divider()
    render_paint_list_ui()

# ============================================================================
# TAB 2: INSPIRATION PROTOCOLS (COMPLETE REDESIGN)
# ============================================================================

    st.markdown('</div>', unsafe_allow_html=True)  # Close auspex wrapper

with tab2:
    st.markdown('<div class="inspiration-tab-container">', unsafe_allow_html=True)


    # === BIG HEADER ===
    st.markdown("""
        <h2 style='
            color: #A97BC4; 
            font-family: "Cinzel", serif; 
            text-align: center;
            text-shadow: 0 0 18px rgba(169, 123, 196, 0.4);
            margin: 30px 0 15px 0;
            font-size: 2.2em;
            text-transform: uppercase;
            letter-spacing: 4px;
        '>
            🌌 IDEA ENGINE
        </h2>
        <p style='
            text-align: center; 
            color: #D4A5FF; 
            font-size: 0.95em; 
            margin-bottom: 25px;
            font-family: "Raleway", sans-serif;
            font-weight: 300;
            letter-spacing: 0.5px;
        '>
            Extract paint schemes from any reference image.
        </p>
    """, unsafe_allow_html=True)
    
    # === COLLAPSIBLE INFO (with moved text) ===
    with st.expander("💡 Inspiration Ideas & Tips", expanded=False):
        st.markdown("""
        Perfect for creating custom army schemes inspired by nature, movies, or your favourite art.
        
        ---
        
        **Great sources for colour schemes:**
        - 🌅 Landscapes & nature (sunsets, forests, oceans)
        - 🎨 Artwork & paintings (your favourite pieces)
        - 🎬 Movie stills (sci-fi, fantasy scenes)
        - 🏛️ Architecture & buildings
        - 🦋 Animals & creatures (poison dart frogs, birds of paradise)
        - 🍕 Food (yes, really! Pizza Necrons, anyone?)
        - 🎮 Video game screenshots
        - 🌸 Flowers and plants
        
        **Pro Tips:**
        - Look for images with 3-5 distinct, contrasting colours
        - High contrast = striking schemes
        - Complementary colours = visual interest
        - Analogous colours = harmonious schemes
        """)
    
    # === CUSTOM UPLOAD BOX ===
    st.markdown("""
    <div class="inspiration-upload-box">
        <div class="upload-icon">🌌</div>
        <div class="upload-main-text">CLICK TO UPLOAD</div>
        <div class="upload-sub-text">Drag and drop or click to open cosmic portal</div>
        <div class="upload-file-types">Any image • JPG, JPEG, PNG • Max 10MB</div>
    </div>
    """, unsafe_allow_html=True)

    # === STREAMLIT UPLOADER (Invisible overlay) ===
    uploaded_inspiration = st.file_uploader(
        "Upload Inspiration Image",
        type=["jpg", "jpeg", "png"],
        key="uploader_inspiration",
        help="Upload any inspiration image",
        label_visibility="collapsed"
    )

    if uploaded_inspiration is not None:
        # Initialise raw_img for cleanup
        raw_img = None
        
        try:
            # Load image
            file_bytes = np.asarray(bytearray(uploaded_inspiration.read()), dtype=np.uint8)
            raw_img = cv2.imdecode(file_bytes, 1)
            raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
            if Mobile.AUTO_COMPRESS_IMAGES:
                raw_img = compress_image_for_mobile(raw_img, Mobile.COMPRESSED_IMAGE_WIDTH)
            
            # Show original image
            st.markdown("#### 🖼️ Your Inspiration Source")
            st.image(raw_img, use_container_width=True, caption="Original image")
            
            # === NEW: Source Type Selector ===
            st.markdown("**📂 What type of image is this?**")
            st.caption("Helps us improve colour extraction for different sources")
            
            source_type = st.selectbox(
                "Image Type:",
                [
                    "🌅 Landscape/Nature",
                    "🎨 Artwork/Painting", 
                    "🎬 Movie/Game Screenshot",
                    "🏛️ Architecture",
                    "🦋 Animal/Creature",
                    "🍕 Food",
                    "🌸 Flowers/Plants",
                    "📸 Photography",
                    "🎮 Other"
                ],
                index=0,
                key="inspiration_source_type_select",
                help="Select the type that best matches your inspiration image"
            )
            
            # Store source type
            st.session_state.inspiration_source_type = source_type
            
            st.markdown("---")
            
            # Wrap button in div for custom styling
            st.markdown('<div class="inspiration-tab-content"><div class="inspiration-action-button">', unsafe_allow_html=True)
            # UPDATED: Centered button
            search_clicked = st.button("🎨 EXTRACT COLOUR PALETTE", type="primary", key="btn_inspiration", use_container_width=True)
            st.markdown('</div></div>', unsafe_allow_html=True)
            
            if search_clicked:
                with st.spinner("Analyzing colour harmonies..."):
                    recipes, _, _ = st.session_state.engine.analyze_miniature(
                        raw_img, 
                        mode="scene", 
                        remove_base=False, 
                        use_awb=False, 
                        sat_boost=1.0, 
                        detect_details=False
                    )
                    
                    if not recipes:
                        st.warning("⚠️ Couldn't extract distinct colours. Try an image with more colour variety!")
                    else:
                        st.success(f"✅ Extracted {len(recipes)} colours from your inspiration!")
                        
                        # SAVE RESULTS to session state to handle reruns
                        st.session_state.inspiration_results = recipes
                        
                        # === NEW: LOG INSPIRATION SCAN ===
                        try:
                            # Sanitize recipes for logging (remove numpy arrays and images)
                            log_recipes = []
                            for r in recipes:
                                r_copy = r.copy()
                                # Remove non-serializable data
                                if 'reticle' in r_copy:
                                    del r_copy['reticle']
                                if 'rgb_preview' in r_copy and isinstance(r_copy['rgb_preview'], np.ndarray):
                                    r_copy['rgb_preview'] = r_copy['rgb_preview'].tolist()
                                if 'pixel_indices' in r_copy:
                                    del r_copy['pixel_indices']
                                log_recipes.append(r_copy)
                            
                            # Log to Google Sheets
                            inspiration_scan_id = st.session_state.feedback_logger.log_scan({
                                'mode': 'inspiration',
                                'source_type': st.session_state.inspiration_source_type,
                                'image_size': raw_img.shape,
                                'recipes': log_recipes,
                                'num_colours': len(recipes),
                                'brands': Affiliate.SUPPORTED_BRANDS
                            })
                            
                            # Store scan ID for feedback
                            st.session_state.current_inspiration_scan_id = inspiration_scan_id
                            
                            # Track in analytics
                            st.session_state.analytics.track_scan(
                                mode='inspiration',
                                num_colors=len(recipes),
                                quality_score=100  # No quality check for inspiration mode
                            )
                            
                            logger.info(f"Logged inspiration scan: {inspiration_scan_id}, source: {st.session_state.inspiration_source_type}")
                            
                        except Exception as e:
                            logger.error(f"Failed to log inspiration scan: {e}", exc_info=True)
                            # Don't show error to user - logging is non-critical
            
            # === DISPLAY LOGIC FOR INSPIRATION ===
            # Run this whenever results exist in session state (handles reruns)
            if st.session_state.inspiration_results:
                recipes = st.session_state.inspiration_results
                        
                # ===== BIG BEAUTIFUL PALETTE DISPLAY (NO RETICLES!) =====
                st.markdown("---")
                st.markdown("### 🎨 Your Custom Colour Palette")
                
                # Show up to 5 colours in nice big swatches
                num_colours = min(len(recipes), 5)
                cols = st.columns(num_colours)
                
                for idx, recipe in enumerate(recipes[:5]):
                    with cols[idx]:
                        rgb = recipe['rgb_preview']
                        colour_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                        
                        # Big beautiful colour swatch (NO RETICLE!)
                        st.markdown(f"""
                            <div style='
                                background: {colour_css};
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
                        
                        # Colour info
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
                    st.markdown("**🎨 Suggested Colour Roles:**")
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
                        st.info("💡 Upload an image with more distinct colours for better suggestions!")
                
                with col2:
                    st.markdown("**🎬 Example Applications:**")
                    st.markdown("""
                    - Space Marines chapter colours
                    - Chaos warband theme
                    - Necron dynasty scheme
                    - Tau sept colours
                    - Eldar craftworld
                    - Ork klan warpaint
                    - Terrain colour palette
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
                    colour_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                    
                    # Use simple emoji instead of HTML for title to avoid parsing errors
                    with st.expander(
                        f"🎨 {recipe['family']} ({recipe['dominance']:.0f}%)",
                        expanded=(idx == 0)  # First colour expanded by default
                    ):
                        col_swatch, col_paints = st.columns([1, 2])
                        
                        with col_swatch:
                            # Big swatch instead of messy reticle
                            st.markdown(f"""
                                <div style='
                                    background: linear-gradient(135deg, 
                                        {colour_css} 0%, 
                                        {colour_css} 60%, 
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
                                st.markdown(f"🛡️ **Base:** [{base['name']}]({url})")
                            
                            # Highlight
                            highlight = recipe['highlight'].get(preferred_brand)
                            if highlight:
                                url = get_affiliate_link(preferred_brand, highlight['name'], region_option)
                                st.markdown(f"✨ **Highlight:** [{highlight['name']}]({url})")
                            
                            # Shade
                            shade = recipe['shade'].get(preferred_brand)
                            if shade:
                                url = get_affiliate_link(preferred_brand, shade['name'], region_option)
                                shade_icon = "💧" if recipe['shade_type'] == 'wash' else "🌑"
                                st.markdown(f"{shade_icon} **Shade:** [{shade['name']}]({url})")
                            
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
                    palette_text = "MY CUSTOM COLOUR SCHEME\n"
                    palette_text += f"Generated: {datetime.now().strftime('%Y-%m-%d')}\n\n"
                    palette_text += "COLOURS:\n"
                    for r in recipes:
                        palette_text += f"- {r['family']}: {r['dominance']:.0f}%\n"
                    
                    st.download_button(
                        "📥 Download Palette",
                        palette_text,
                        file_name=f"colour_palette_{datetime.now().strftime('%Y%m%d')}.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                
                with col2:
                    # Shopping list
                    paint_list = f"{preferred_brand} Shopping List:\n\n"
                    for r in recipes:
                        base = r['base'].get(preferred_brand)
                        if base:
                            paint_list += f"▫ {base['name']}\n"
                    
                    st.download_button(
                        "🛒 Shopping List",
                        paint_list,
                        file_name=f"{preferred_brand.lower()}_paints.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                
                with col3:
                    if st.button("🔗 Share on Social", use_container_width=True):
                        colours_text = ", ".join([r['family'] for r in recipes[:3]])
                        share_text = f"Created a custom colour scheme with SchemeStealer! 🎨\nColours: {colours_text}"
                        st.info(f"**Copy to share:**\n\n{share_text}")

                # === NEW: INSPIRATION FEEDBACK SECTION ===
                st.markdown("---")
                st.markdown("### 📊 How Did We Do?")
                st.caption("Your feedback helps us improve colour extraction for different image types!")
                
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    if st.button(
                        "👍 Accurate Colours", 
                        use_container_width=True, 
                        key="insp_thumbs_up",
                        help="These colours match my image well"
                    ):
                        scan_id = st.session_state.get('current_inspiration_scan_id')
                        if scan_id:
                            try:
                                st.session_state.feedback_logger.log_feedback(
                                    scan_id,
                                    'thumbs_up',
                                    rating=5,
                                    comments=f"Source: {st.session_state.get('inspiration_source_type', 'Unknown')}"
                                )
                                st.success("Thanks for the feedback! 🎉")
                                logger.info(f"Positive feedback for inspiration scan {scan_id}")
                            except Exception as e:
                                logger.error(f"Failed to log feedback: {e}")
                                st.error("Couldn't save feedback, but noted!")
                
                with col2:
                    if st.button(
                        "👎 Colours Off", 
                        use_container_width=True, 
                        key="insp_thumbs_down",
                        help="The detected colours don't match well"
                    ):
                        st.session_state.show_inspiration_correction = True
                        st.rerun()
                
                with col3:
                    if st.button(
                        "💡 Suggest Use", 
                        use_container_width=True, 
                        key="insp_suggest",
                        help="Tell us how you'd use this scheme"
                    ):
                        st.session_state.show_inspiration_suggestion = True
                        st.rerun()

                # === CORRECTION FORM ===
                if st.session_state.get('show_inspiration_correction', False):
                    st.markdown("---")
                    with st.expander("✏️ Tell us what's wrong", expanded=True):
                        st.markdown("**What issues did you notice with the colour extraction?**")
                        
                        issues = st.multiselect(
                            "Select all that apply:",
                            [
                                "Missed a dominant colour",
                                "Detected background instead of subject",
                                "Too many similar colours",
                                "Colours don't match the image",
                                "Wrong colour names/families",
                                "Picked up shadows/highlights as colours",
                                "Other issue"
                            ],
                            key="insp_issues"
                        )
                        
                        comments = st.text_area(
                            "What colours should have been detected?",
                            key="insp_comments",
                            placeholder="E.g., 'Should have found the bright orange sunset, not the gray clouds' or 'Missed the vibrant purple flowers'",
                            help="Specific feedback helps us improve!"
                        )
                        
                        col_a, col_b = st.columns([1, 1])
                        
                        with col_a:
                            if st.button("✅ Submit Feedback", key="insp_submit", use_container_width=True):
                                scan_id = st.session_state.get('current_inspiration_scan_id')
                                if scan_id and (issues or comments):
                                    try:
                                        # Formatting source info into comments
                                        full_comments = f"Source Type: {st.session_state.get('inspiration_source_type')}\n{comments}"
                                        
                                        st.session_state.feedback_logger.log_feedback(
                                            scan_id,
                                            'correction',
                                            rating=2,
                                            issues=issues,
                                            comments=full_comments
                                        )
                                        st.success("Feedback submitted! This helps us improve! 🙏")
                                        logger.info(f"Correction feedback for inspiration scan {scan_id}: {issues}")
                                        st.session_state.show_inspiration_correction = False
                                        st.rerun()
                                    except Exception as e:
                                        logger.error(f"Failed to log correction: {e}")
                                        st.error("Couldn't save feedback, but we noted the issue!")
                                else:
                                    st.warning("Please select at least one issue or add a comment")
                        
                        with col_b:
                            if st.button("❌ Cancel", key="insp_cancel", use_container_width=True):
                                st.session_state.show_inspiration_correction = False
                                st.rerun()
                
                # === SUGGESTION FORM ===
                if st.session_state.get('show_inspiration_suggestion', False):
                    st.markdown("---")
                    with st.expander("💭 Share how you'd use this scheme", expanded=True):
                        st.markdown("**We'd love to know what you'd paint with these colours!**")
                        
                        use_case = st.text_area(
                            "Your army/project idea:",
                            placeholder="E.g., 'Perfect for my Chaos Space Marines!' or 'Would use this for my Necron dynasty' or 'Great for terrain bases'",
                            key="insp_use_case",
                            help="Your ideas help other users discover great schemes!"
                        )
                        
                        col_a, col_b = st.columns([1, 1])
                        
                        with col_a:
                            if st.button("✅ Share Idea", key="insp_share", use_container_width=True):
                                scan_id = st.session_state.get('current_inspiration_scan_id')
                                if scan_id and use_case:
                                    try:
                                        st.session_state.feedback_logger.log_feedback(
                                            scan_id,
                                            'usage_suggestion',
                                            rating=4,
                                            comments=f"Use case: {use_case} | Source: {st.session_state.get('inspiration_source_type')}"
                                        )
                                        st.success("Thanks for sharing your creativity! 💡")
                                        logger.info(f"Usage suggestion for inspiration scan {scan_id}")
                                        st.session_state.show_inspiration_suggestion = False
                                        st.rerun()
                                    except Exception as e:
                                        logger.error(f"Failed to log suggestion: {e}")
                                        st.error("Couldn't save suggestion, but we noted it!")
                                else:
                                    st.warning("Please share your idea before submitting")
                        
                        with col_b:
                            if st.button("❌ Cancel", key="insp_cancel_suggest", use_container_width=True):
                                st.session_state.show_inspiration_suggestion = False
                                st.rerun()
                
                st.markdown("---")
                        
        except Exception as e:
            st.error(f"❌ Error processing image: {str(e)}")
            logger.error(f"Inspiration error: {e}", exc_info=True)
            st.info("💡 Try a different image or check that the file isn't corrupted.")
        finally:
            # MEMORY CLEANUP
            cleanup_opencv_image(raw_img)

    else:
        pass

    # === DISPLAY PAINT LIST (Collapsed at bottom) ===
    st.divider()
    render_paint_list_ui()

    st.markdown('</div>', unsafe_allow_html=True)
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
