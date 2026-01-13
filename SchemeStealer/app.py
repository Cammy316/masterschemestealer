"""
SchemeStealer v3.2.0 - Main Application
Mobile-optimised Streamlit MVP with Enhanced UI/UX
Features: Memory Management, Session Persistence, Machine Spirit Logging, Feedback System
"""

import streamlit as st
import cv2
import numpy as np
import random
import time
import os
import gc
import json
import urllib.parse
from datetime import datetime
from typing import List, Optional, Dict

from config import APP_NAME, APP_VERSION, APP_ICON, Mobile, Affiliate
from core.schemestealer_engine import SchemeStealerEngine
from core.photo_processor import PhotoProcessor
from utils.helpers import get_affiliate_link, compress_image_for_mobile
from utils.logging_config import logger

# NEW IMPORTS
from utils.feedback_logger import EnhancedGSheetsLogger as FeedbackLogger
from utils.shopping_cart import ShoppingCart
from utils.analytics import SimpleAnalytics
from utils.session_utils import safe_session_update

# ============================================================================
# PAGE CONFIGURATION (MUST BE FIRST)
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

def render_footer(theme="green"):
    """Render footer with theme-aware styling"""
    link_color = "#5DA153" if theme == "green" else "#A97BC4"
    st.markdown(f"""
    <div style='text-align: center; color: #666; font-size: 0.8em; font-family: monospace; margin-top: 50px;'>
        {APP_NAME} v{APP_VERSION} | 
        Sanctioned by the Mechanicus | 
        <a href='mailto:schemestealer@gmail.com?subject=SchemeStealer%20Feedback' style='color: {link_color}; text-decoration: none; font-weight: bold;'>
            Transmit Astropathic Feedback
        </a>
    </div>
    """, unsafe_allow_html=True)

def render_paint_list_ui(key_suffix="default"):
    """
    Render the collapsed Paint List (Cart) UI.
    Shared between Auspex and Inspiration tabs.
    Args:
        key_suffix: Unique string to prevent duplicate widget ID errors when rendered in multiple tabs.
    """
    items = []
    if 'shopping_cart' in st.session_state:
        items = st.session_state.shopping_cart.cart_items
    
    count = len(items)
    
    # Always show the expander so user knows where the list is
    label = f"📋 Your Paint List ({count} items)" if count > 0 else "📋 Your Paint List (Empty)"
    
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
                # FIXED: Uses stable key with suffix instead of time.time()
                if st.button("🛒 Find on Amazon", type="primary", use_container_width=True, key=f"shop_btn_{key_suffix}"):
                    cart_url = st.session_state.shopping_cart.generate_cart_url()
                    st.markdown(f"### [🔗 **Click to Open Amazon** →]({cart_url})", unsafe_allow_html=True)
            
            # Safe update wrapper for clearing cart
            def clear_cart_action(cart):
                cart.clear_cart()

            # FIXED: Uses stable key with suffix instead of time.time()
            if st.button("🗑️ Clear List", use_container_width=True, key=f"clear_btn_{key_suffix}"):
                safe_session_update('shopping_cart', clear_cart_action)
                st.rerun()

# ============================================================================
# FLAVOUR TEXT & THEMES (BRITISH ENGLISH + MACHINE SPIRIT)
# ============================================================================

class AuspexText:
    """Warhammer 40k/AoS Thematic Text Generator"""
    
    # STAGE-SPECIFIC MESSAGES (more immersive!)
    STAGE_MESSAGES = {
        'initializing': [
            "Awakening the Machine Spirit...",
            "Initialising Cogitator Arrays...",
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
            "Analysing Mounting Platform...",
            "Surveying Foundation Structure..."
        ],
        'color_extraction': [
            "Communing with the Machine Spirit...",
            "Auspex Scan Initialising...",
            "Scanning Biomass Pigmentation...",
            "Extracting Chromatic Data-Patterns...",
            "Analysing Pigment Concentrations...",
            "Interpreting Spectral Signatures...",
            "Divining Colour Harmonics...",
            "Processing Wavelength Frequencies..."
        ],
        'metallic_detection': [
            "Detecting Blessed Metallics...",
            "Identifying Auramite Signatures...",
            "Scanning for Sacred Golds...",
            "Analysing Ferrous Compositions...",
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
            "Finalising Ritual Calculations...",
            "Completing Sacred Rites...",
            "Sanctifying Results..."
        ]
    }
    
    SUCCESS_MESSAGES = [
        "The Emperor Protects, and Identifies!",
        "STC Pattern Recognised.",
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
        "Analysing Sector Terrain...",
        "Extracting Pigment Data from Pict-Feed...",
        "Harmonising Colour Palettes...",
        "Synthesising Inspiration Protocols..."
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
# CSS STYLING (ISOLATED MARKERS & HIGH GOTHIC UI)
# ============================================================================

st.markdown("""
    <style>
    /* IMPORT FONTS */
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600&display=swap');

/* ========================================================================
    1. THE COGITATOR SCROLLBAR (GLOBAL & DYNAMIC)
 ======================================================================== */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background: #0e0e0e;
    }
    
    /* DEFAULT (AUSPEX) GREEN SCROLLBAR */
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #4A7C2C 0%, #1a2e1a 100%);
        border-radius: 5px;
        border: 1px solid #000;
    }
    ::-webkit-scrollbar-track {
        background: #000;
        border-left: 1px solid #333;
    }
    ::-webkit-scrollbar-corner {
        background: #000;
    }

    /* DYNAMIC OVERRIDE: WHEN INSPIRATION TAB (2nd Tab) IS SELECTED */
    /* Target the root when the 2nd tab (Inspiration) is active */
    /* We look for the aria-selected="true" on the tab containing "IDEA ENGINE" */
    
    /* This complex selector checks if the tab list has the second tab selected */
    /* Note: :has() support is required (Chrome/Edge/Safari/FF) */
    body:has(div[data-baseweb="tab-list"] button:nth-of-type(2)[aria-selected="true"]) ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #8B4FA8 0%, #3A1545 100%) !important;
        border: 1px solid #2D0D35 !important;
    }
    
    /* ========================================================================
       2. TACTICAL HUD GRID (CUSTOM METRIC REPLACEMENT)
       ======================================================================== */
    .hud-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 12px;
        margin: 15px 0;
    }
    
    /* Auspex HUD Card */
    .hud-card-auspex {
        background-color: rgba(10, 20, 10, 0.75);
        border: 1px solid #4A7C2C;
        border-radius: 4px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        backdrop-filter: blur(4px);
        box-shadow: 0 0 10px rgba(74, 124, 44, 0.2);
        min-height: 100px;
    }
    
    .hud-label-auspex {
        color: #8FD14F;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.8em;
        text-transform: uppercase;
        margin-bottom: 5px;
        letter-spacing: 1px;
    }
    
    .hud-value-auspex {
        color: #fff;
        font-family: 'Share Tech Mono', monospace;
        font-size: 1.6em;
        font-weight: bold;
        text-shadow: 0 0 8px #5DA153;
        line-height: 1.2;
    }
    
    .hud-sub-auspex {
        color: #fff !important; 
        font-size: 0.75em;
        margin-top: 5px;
        font-weight: 500;
        font-family: 'Share Tech Mono', monospace;
        opacity: 0.9;
    }

    /* Inspiration HUD Card */
    .hud-card-inspiration {
        background-color: rgba(30, 10, 35, 0.75);
        border: 1px solid #8B4FA8;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        backdrop-filter: blur(4px);
        box-shadow: 0 0 15px rgba(139, 79, 168, 0.2);
        min-height: 100px;
    }
    
    .hud-label-inspiration {
        color: #D4A5FF;
        font-family: 'Raleway', sans-serif;
        font-size: 0.8em;
        text-transform: uppercase;
        margin-bottom: 5px;
        letter-spacing: 1px;
    }
    
    .hud-value-inspiration {
        color: #fff;
        font-family: 'Raleway', sans-serif;
        font-size: 1.6em;
        font-weight: bold;
        text-shadow: 0 0 10px #A97BC4;
        line-height: 1.2;
    }
    
    .hud-sub-inspiration {
        color: #fff !important; 
        font-size: 0.75em;
        margin-top: 5px;
        font-weight: 500;
        font-family: 'Raleway', sans-serif;
        opacity: 0.9;
    }

    /* ========================================================================
       3. UNIFIED BUTTON GEOMETRY (PREVENTS UNEVEN SIZES/CUTOFFS)
       ======================================================================== */
    /* Target ALL actionable buttons: regular, download, and link buttons */
    .stButton>button, 
    .stDownloadButton>button, 
    .stLinkButton>a {
        box-sizing: border-box !important;
        width: 100% !important;
        min-height: 60px !important;       /* Increased for 2-line comfort */
        height: auto !important;           /* Allow growing if text wraps */
        font-weight: bold !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;    /* Reduced from 2px to fit more text */
        font-size: 16px !important;        /* Reduced from 20px to prevent cutoff */
        white-space: normal !important;    /* Allow text to wrap! Critical for mobile */
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        padding: 8px 12px !important;      /* Consistent padding */
        line-height: 1.1 !important;       /* Tight line height for wrapped text */
        display: flex !important;          /* Flexbox alignment */
        align-items: center !important;    /* Vertically center text */
        justify-content: center !important;/* Horizontally center text */
        text-align: center !important;
        transition: all 0.3s ease !important;
        border-radius: 4px !important;
    }
    
    /* Popover Button Targeting - Explicit Container Width Force */
    div[data-testid="stPopover"] {
        width: 100% !important;
    }
    
    div[data-testid="stPopover"] > button {
        box-sizing: border-box !important;
        width: 100% !important;
        min-height: 60px !important;
        height: auto !important;
        font-weight: bold !important;
        text-transform: uppercase !important;
        font-size: 16px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 4px !important;
        padding: 8px 12px !important;
        line-height: 1.1 !important;
    }

    /* Mobile Media Query for extra small screens */
    @media (max-width: 640px) {
        .stButton>button, 
        .stDownloadButton>button, 
        .stLinkButton>a,
        div[data-testid="stPopover"] > button {
            font-size: 14px !important;   /* Smaller font on mobile */
            letter-spacing: 0.5px !important;
            min-height: 64px !important;   /* Taller touch target/wrapping room */
            padding: 4px 8px !important;
            white-space: normal !important;  /* Allow wrapping */
            line-height: 1.3 !important;  /* Tighter line spacing */
            word-break: break-word !important;  /* Break long words */
        }
        
        /* Make titles responsive - ADAPTIVE SINGLE LINE */
        h1, [data-testid="stHeader"] h1 {
            /* Force single line, but shrink font aggressively to fit */
            white-space: nowrap !important;
            overflow: visible !important;
            font-size: clamp(1.0rem, 5.5vw, 2.5rem) !important; /* Aggressive shrink */
        }
        
        h2 {
            font-size: clamp(1.2rem, 6vw, 1.8rem) !important;
        }
        
        h3 {
            font-size: clamp(1rem, 5vw, 1.5rem) !important;
        }
        
        /* Prevent expander text wrapping issues */
        .streamlit-expanderHeader {
            white-space: normal !important;
            word-wrap: break-word !important;
        }
        
        /* Make sure metrics don't overflow */
        [data-testid="stMetricValue"] {
            font-size: clamp(1rem, 5vw, 1.5rem) !important;
        }
        
        /* Reduce padding on small screens */
        .block-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
        }
        
        /* Fix Upload Box Padding on Mobile */
        .auspex-upload-box, 
        .inspiration-upload-box {
            padding: 1.5rem 1rem !important; /* Reduced padding for mobile centering */
            min-height: 180px !important;
        }
        
        .auspex-upload-box .upload-main-text,
        .inspiration-upload-box .upload-main-text {
            font-size: 1.1rem !important;
            width: 100% !important;
            text-align: center !important;
        }
    }

    /* Extra small screens (iPhone SE, etc) */
    @media (max-width: 375px) {
        .stButton>button {
            font-size: 12px !important;
            padding: 6px 4px !important;
            min-height: 56px !important;
        }
        
        h1 {
            font-size: 1.1rem !important;
        }
        
        h2 {
            font-size: 1.0rem !important;
        }
    }        


    /* ========================================================================
       STRICT THEME ISOLATION USING MARKERS
       We look for a parent tab-panel that contains the unique marker class.
       ======================================================================== */

    /* --- AUSPEX THEME (GREEN - TACTICAL) --- */
    
    /* Overlay: CRT Scanlines */
    div[data-baseweb="tab-panel"]:has(.auspex-marker)::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
        z-index: 0;
        background-size: 100% 3px, 3px 100%;
        pointer-events: none;
    }

    /* Hazard Stripe Progress Bar */
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stProgress > div > div {
        background-color: #5DA153 !important;
        background-image: repeating-linear-gradient(
            -45deg,
            #4A7C2C,
            #4A7C2C 10px,
            #1a2e1a 10px,
            #1a2e1a 20px
        ) !important;
        box-shadow: 0 0 10px #5DA153;
    }

    /* Terminal Inputs */
    div[data-baseweb="tab-panel"]:has(.auspex-marker) input,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stSelectbox > div > div {
        background-color: #050a05 !important;
        color: #5DA153 !important;
        border: 1px solid #4A7C2C !important;
        font-family: 'Share Tech Mono', monospace !important;
    }

    /* Buttons (Green) */
    div[data-baseweb="tab-panel"]:has(.auspex-marker) button[kind="primary"] {
        background-color: #1a2e1a !important; 
        color: #5DA153 !important; 
        border: 1px solid #5DA153 !important;
        box-shadow: none !important;
        font-family: 'Share Tech Mono', monospace !important;
    }
    div[data-baseweb="tab-panel"]:has(.auspex-marker) button[kind="primary"]:hover {
        background-color: #5DA153 !important;
        color: #000 !important;
        box-shadow: 0 0 15px #5DA153 !important;
    }
    /* Target all button types in Auspex */
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stButton > button,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stDownloadButton > button,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stLinkButton > a,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) div[data-testid="stPopover"] > button,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) div[data-testid="stPopover"] button {
        background-color: #1a2e1a !important;
        color: #5DA153 !important;
        border: 1px solid #5DA153 !important;
        font-family: 'Share Tech Mono', monospace !important;
        text-decoration: none !important;
    }
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stButton > button:hover,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stDownloadButton > button:hover,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) .stLinkButton > a:hover,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) div[data-testid="stPopover"] > button:hover,
    div[data-baseweb="tab-panel"]:has(.auspex-marker) div[data-testid="stPopover"] button:hover {
        border-color: #00FF00 !important;
        color: #00FF00 !important;
        box-shadow: 0 0 10px rgba(93, 161, 83, 0.4) !important;
    }
    div[data-baseweb="tab-panel"]:has(.auspex-marker) hr {
        background: linear-gradient(90deg, transparent 0%, #5DA153 50%, transparent 100%) !important;
        height: 2px !important;
        border: none !important;
    }


    /* --- INSPIRATION THEME (PURPLE - COSMIC) --- */

    /* Overlay: Cosmic Nebula */
    div[data-baseweb="tab-panel"]:has(.inspiration-marker)::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: radial-gradient(circle at 20% 30%, rgba(107, 45, 124, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 70%, rgba(60, 20, 80, 0.08) 0%, transparent 50%);
        z-index: 0;
        pointer-events: none;
    }

    /* Warp Energy Progress Bar */
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stProgress > div > div {
        background: linear-gradient(90deg, #3A1545, #6B2D7C, #A97BC4, #6B2D7C) !important;
        background-size: 200% 100% !important;
        animation: warpFlow 3s ease infinite !important;
        box-shadow: 0 0 12px rgba(169, 123, 196, 0.5);
    }
    @keyframes warpFlow {
        0% {background-position: 0% 50%}
        50% {background-position: 100% 50%}
        100% {background-position: 0% 50%}
    }

    /* Navigational Console Inputs */
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) input,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stSelectbox > div > div {
        background-color: #1a0a20 !important;
        color: #D4A5FF !important;
        border: 1px solid #6B2D7C !important;
        font-family: 'Raleway', sans-serif !important;
    }

    /* Buttons (Purple) */
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) button[kind="primary"] {
        background: linear-gradient(135deg, #6B2D7C 0%, #3A1545 100%) !important;
        color: #A97BC4 !important;
        border: 2px solid #8B4FA8 !important;
        font-family: 'Raleway', sans-serif !important;
        text-shadow: none !important;
    }
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) button[kind="primary"]:hover {
        background: linear-gradient(135deg, #8B4FA8 0%, #A97BC4 100%) !important;
        color: #FFFFFF !important;
        border-color: #D4A5FF !important;
        box-shadow: 0 0 20px rgba(212, 165, 255, 0.4) !important;
    }
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stButton > button,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stDownloadButton > button,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stLinkButton > a,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) div[data-testid="stPopover"] > button,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) div[data-testid="stPopover"] button {
        background: linear-gradient(135deg, #4A1545 0%, #2D0D35 100%) !important;
        color: #D4A5FF !important;
        border: 1px solid #6B2D7C !important;
        font-family: 'Raleway', sans-serif !important;
        text-decoration: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stButton > button:hover,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stDownloadButton > button:hover,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) .stLinkButton > a:hover,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) div[data-testid="stPopover"] > button:hover,
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) div[data-testid="stPopover"] button:hover {
        border-color: #A97BC4 !important;
        color: #FFF !important;
        box-shadow: 0 0 10px rgba(169, 123, 196, 0.3) !important;
    }
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) hr {
        background: linear-gradient(90deg, transparent 0%, #A97BC4 50%, transparent 100%) !important;
        height: 2px !important;
        border: none !important;
    }

    /* Custom Purple Success Box */
    .inspiration-success-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: rgba(107, 45, 124, 0.15);
        border-left: 5px solid #A97BC4;
        color: #D4A5FF;
        margin-bottom: 1rem;
        font-family: 'Raleway', sans-serif;
    }

    /* === UPLOAD BOXES (Common) === */
    .auspex-upload-box,
    .inspiration-upload-box {
        position: relative !important;
        z-index: 1 !important;
    }

    .auspex-upload-box {
        min-height: 220px;
        border: 3px dashed #4A7C2C;
        border-radius: 6px;
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
        font-size: clamp(1rem, 4vw, 1.4em);  /* ← ADDED: Responsive */
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: clamp(1px, 0.5vw, 3px);  /* ← ADDED: Responsive */
        margin-bottom: 12px;
        text-shadow: 0 0 8px rgba(107, 159, 62, 0.3);
        white-space: normal;  /* ← ADDED: Allow wrapping */
        text-align: center;  /* ← ADDED: Center text */
        word-break: break-word;  /* ← ADDED: Break long words */
    }

    .auspex-upload-box .upload-sub-text {
        color: #8FD14F;
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(0.75rem, 3vw, 1em);  /* ← ADDED: Responsive */
        letter-spacing: clamp(0.5px, 0.3vw, 1px);  /* ← ADDED: Responsive */
        white-space: normal;  /* ← ADDED: Allow wrapping */
        text-align: center;  /* ← ADDED: Center text */
    }

    .auspex-upload-box .upload-file-types {
        color: #6B7C5F;
        font-family: 'Share Tech Mono', monospace;
        font-size: clamp(0.7rem, 2.5vw, 0.85em);  /* ← ADDED: Responsive */
        margin-top: 10px;
        white-space: normal;  /* ← ADDED: Allow wrapping */
        text-align: center;  /* ← ADDED: Center text */
    }

    /* === INSPIRATION UPLOAD BOX === */
    .inspiration-upload-box {
        min-height: 220px;
        border: 3px dashed #6B2D7C;
        border-radius: 18px;
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
        font-size: clamp(1rem, 4vw, 1.4em);  /* ← ADDED: Responsive */
        font-weight: 600;
        letter-spacing: clamp(1px, 0.5vw, 2px);  /* ← ADDED: Responsive */
        margin-bottom: 12px;
        text-shadow: 0 0 10px rgba(169, 123, 196, 0.3);
        white-space: normal;  /* ← ADDED: Allow wrapping */
        text-align: center;  /* ← ADDED: Center text */
        word-break: break-word;  /* ← ADDED: Break long words */
    }

    .inspiration-upload-box .upload-sub-text {
        color: #D4A5FF;
        font-family: 'Raleway', sans-serif;
        font-size: clamp(0.75rem, 3vw, 1em);  /* ← ADDED: Responsive */
        letter-spacing: clamp(0.3px, 0.2vw, 0.5px);  /* ← ADDED: Responsive */
        font-weight: 300;
        white-space: normal;  /* ← ADDED: Allow wrapping */
        text-align: center;  /* ← ADDED: Center text */
    }

    .inspiration-upload-box .upload-file-types {
        color: #8B7E8B;
        font-family: 'Raleway', sans-serif;
        font-size: clamp(0.7rem, 2.5vw, 0.85em);  /* ← ADDED: Responsive */
        margin-top: 10px;
        white-space: normal;  /* ← ADDED: Allow wrapping */
        text-align: center;  /* ← ADDED: Center text */
    }

    /* === STREAMLIT FILE UPLOADER OVERLAY (STRICTLY SCOPED) === */
    
    /* 1. Auspex Uploader Scoping */
    div[data-baseweb="tab-panel"]:has(.auspex-marker) div[data-testid="stFileUploader"] {
        position: relative !important;
        margin-top: -300px !important;
        height: 300px !important;
        width: 100% !important;
        z-index: 5 !important;
        opacity: 0 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        overflow: hidden !important;
    }
    
    div[data-baseweb="tab-panel"]:has(.auspex-marker) input[type="file"] {
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
        z-index: 6 !important;
    }

    /* 2. Inspiration Uploader Scoping */
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) div[data-testid="stFileUploader"] {
        position: relative !important;
        margin-top: -300px !important; /* Reduced height */
        height: 300px !important;
        width: 100% !important;
        z-index: 5 !important; /* Reduced Z-index */
        opacity: 0 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        overflow: hidden !important;
    }
    
    div[data-baseweb="tab-panel"]:has(.inspiration-marker) input[type="file"] {
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
        z-index: 6 !important;
    }
    
    /* Common cleanup */
    div[data-testid="stFileUploader"] button {
        pointer-events: none !important; 
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

    /* Mobile-first responsive design */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        max-width: 100%;
    }
    
    /* CODE BLOCK (HEX CODE) STYLING */
    .stCode {
        margin-top: -5px !important;
    }

    /* Headers - High Gothic Style */
    h1, h2, h3, h4 {
        font-family: 'Cinzel', serif !important;
        font-weight: 700 !important;
        letter-spacing: 0px;
        text-transform: uppercase;
    }
    </style>
""", unsafe_allow_html=True)

# ============================================================================
# SESSION STATE INITIALIZATION & CACHING
# ============================================================================

# CACHING: Initialize heavy resources once per session
@st.cache_resource
def load_engine():
    """Initialize SchemeStealer Engine once"""
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

if 'shopping_cart' not in st.session_state:
    st.session_state.shopping_cart = ShoppingCart()

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
    region_option = st.selectbox(
        "Select Supply Drop Zone:",
        options=list(Affiliate.REGIONS.keys()),
        index=1,  # Default to UK
        key="region_selector",
        help="Determines affiliate logistics"
    )
    
    st.divider()
    
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
    # KO-FI LINK
    st.markdown("[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/schemestealer)")
    st.caption("☕ Buy me a recaf if SchemeStealer helped you!")
    
    # SECRET ADMIN DOWNLOADER
    st.divider()
    with st.expander("🔐 Admin Console"):
        if st.button("📥 Download Feedback Logs"):
            try:
                with open('feedback_logs/feedback.jsonl', 'r') as f:
                    st.download_button(
                        label="Save Log File",
                        data=f,
                        file_name=f"feedback_backup_{datetime.now().strftime('%Y%m%d')}.jsonl",
                        mime="application/json"
                    )
            except FileNotFoundError:
                st.error("No feedback data found yet.")
    
    st.divider()
    debug_mode = st.toggle("🛠️ DEBUG MODE", value=False)

# ============================================================================
# SHOPPING CART PERSISTENCE (LocalStorage Sync)
# ============================================================================

# 1. On load, check for cart data passed via query param (from JS reload)
# NOTE: Removed explicit clear() to avoid refresh loops that snap back tabs
if 'cart_data' in st.query_params:
    try:
        cart_items = json.loads(st.query_params['cart_data'])
        if 'shopping_cart' not in st.session_state:
            st.session_state.shopping_cart = ShoppingCart(region_option)
        
        # Populate cart if it's empty but data came from URL
        if not st.session_state.shopping_cart.cart_items and cart_items:
            st.session_state.shopping_cart.cart_items = cart_items
            # Don't clear immediately to allow stability
    except Exception as e:
        logger.error(f"Failed to restore cart: {e}")

# 2. Ensure cart exists (Safe check)
if 'shopping_cart' not in st.session_state:
    st.session_state.shopping_cart = ShoppingCart(region_option)

# 3. Inject JS to sync cart to LocalStorage
st.components.v1.html(
    f"""
    <script>
        const currentCart = {get_cart_state_as_json()};
        if (currentCart.length > 0) {{
            localStorage.setItem('schemestealer_cart', JSON.stringify(currentCart));
        }}
        const savedCart = localStorage.getItem('schemestealer_cart');
        if (currentCart.length === 0 && savedCart && savedCart !== '[]') {{
            console.log('Cart data found in localStorage:', savedCart);
            // Cart restoration via query params happens naturally
        }}
    </script>
    """,
    height=0,
    width=0
)

# ============================================================================
# HEADER
# ============================================================================

# Mobile-responsive title with text scaling (UPDATED FOR NO WRAPPING AND CENTERING)
st.markdown(f"""
<h1 style='
    font-family: "Cinzel", serif;
    font-size: clamp(1.2rem, 5.5vw, 2.5rem);  /* Aggressive scaling */
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
    padding: 0.5rem 0;
    white-space: nowrap;  /* Force single line */
    overflow: visible;    /* Prevent clipping */
    line-height: 1.2;
    width: 100%;
'>
    {APP_ICON} {APP_NAME}
</h1>
<div style='
    text-align: center; 
    width: 100%; 
    font-size: clamp(0.7rem, 2.5vw, 1rem);
    color: #888;
    margin-top: -5px;
    font-family: "Share Tech Mono", monospace;
'>
    v{APP_VERSION} // M42 Pattern Paint Cogitator
</div>
""", unsafe_allow_html=True)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def show_smart_disclaimer(recipes: List[dict], quality_score: int):
    """Show context-aware disclaimer based on scan results"""
    warnings = []
    
    small_details = [r for r in recipes if r.get('is_detail') and r['dominance'] < 2.0]
    if len(small_details) > 0:
        warnings.append("🔎 **Tiny Details Alert**: We detected some very small details "
                       f"({len(small_details)} colours <2%). These may be approximate. "
                       "Focus on the major armour panels for best accuracy.")
    
    warm_metals = [r for r in recipes if any(m in r['family'] for m in ['Gold', 'Bronze', 'Brown', 'Rust'])]
    if len(warm_metals) >= 2:
        warnings.append("⚠️ **Warm Metals Note**: Multiple warm tones detected (gold/bronze/brown). "
                       "If these look similar, check the reticle images to verify placement.")
    
    if quality_score < 70:
        warnings.append("📸 **Photo Quality**: Your image quality is fair. "
                       "For best results, try better lighting and hold your phone steady.")
    
    if warnings:
        st.info("**👁️ Quick Heads Up:**\n\n" + "\n\n".join(warnings))
# ============================================================================
# TAB STATE PERSISTENCE
# ============================================================================

# Track active tab to prevent snap-back on first interaction
if 'active_tab_index' not in st.session_state:
    st.session_state.active_tab_index = 0  # Default to first tab

# Check URL fragment for tab selection (allows deep linking)
if 'tab' in st.query_params:
    tab_param = st.query_params['tab']
    if tab_param == 'inspiration':
        st.session_state.active_tab_index = 1
    elif tab_param == 'scanner':
        st.session_state.active_tab_index = 0
# Tabs for Main Scan and Inspiration Mode
tab1, tab2 = st.tabs(["⚙️ MINI SCANNER", "🌌 IDEA ENGINE"])

# ============================================================================
# TAB 1: AUSPEX SCAN (Miniature Scanner)
# ============================================================================

with tab1:
    # MARKER FOR CSS ISOLATION (Critical: Must be first element in tab)
    st.markdown('<span class="auspex-marker"></span>', unsafe_allow_html=True)
    
    st.markdown('<div class="auspex-tab-container">', unsafe_allow_html=True)
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
            Upload Miniature • Analyse Colours • Knowledge is Power
        </p>
    """, unsafe_allow_html=True)
    
    with st.expander("💡 New to SchemeStealer? Quick Guide", expanded=False):
        st.markdown("""
        ### 👋 **Welcome to SchemeStealer!**
        
        **How it works:**
        1. Upload a photo of your painted miniature
        2. The Machine Spirit analyses the colours (10 seconds)
        3. Get exact paint matches from 3 brands
        4. Shop for the paints you need
        
        ---
        
        ### 📸 **Photo Tips for Best Results:**
        - ✅ Use natural daylight or bright white LED
        - ❌ Avoid yellow indoor lighting
        - ✅ Fill the frame with your miniature
        - ✅ Plain background (white/black/grey)
        """)
    
    st.markdown("""
    <div class="auspex-upload-box">
        <div class="upload-icon">⚙️</div>
        <div class="upload-main-text">CLICK TO UPLOAD</div>
        <div class="upload-sub-text">Drag and drop or click to initiate scan</div>
        <div class="upload-file-types">JPG, JPEG, PNG • Max 10MB</div>
    </div>
    """, unsafe_allow_html=True)

    uploaded_file = st.file_uploader(
        "Upload Miniature",
        type=["jpg", "jpeg", "png"],
        key="uploader_auspex",
        help="Upload miniature for analysis",
        label_visibility="collapsed"
    )

    if uploaded_file is not None:
        st.session_state.first_visit = False
        raw_img = None
        
        try:
            file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
            raw_img = cv2.imdecode(file_bytes, 1)
            
            if raw_img is None:
                st.error("⚠️ **Could not decode image.** Please upload a valid JPG or PNG file.")
            else:
                raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
                
                if Mobile.AUTO_COMPRESS_IMAGES:
                    raw_img = compress_image_for_mobile(raw_img, Mobile.COMPRESSED_IMAGE_WIDTH)
                
                st.subheader("📊 Signal Quality Assessment")
                quality_report = st.session_state.photo_processor.process_and_assess(raw_img)
                feedback = st.session_state.photo_processor.generate_quality_feedback_ui(quality_report)
                
                quality_class = f"quality-{quality_report.quality_level.lower()}"
                st.markdown(
                    f"<span class='{quality_class}'>{feedback['emoji']} {feedback['message']}</span>",
                    unsafe_allow_html=True
                )
                
                preview = quality_report.enhanced_image
                if gamma_val != 1.0:
                    from utils.helpers import adjust_gamma
                    preview = adjust_gamma(preview, gamma=gamma_val)
                st.image(preview, caption="Enhanced Visual Feed")
                
                st.divider()
                
                if not quality_report.can_process:
                    st.error("⚠️ **Signal too degraded for logic engines.**")
                else:
                    # BUTTON: Auspex Scan (Forced Green by CSS)
                    if st.button("🧬 INITIATE AUSPEX SCAN", type="primary", key="btn_auspex", use_container_width=True):
                        status_text = st.empty()
                        progress_bar = st.empty()
                        
                        try:
                            start_time = time.time()
                            
                            def update_progress(stage_key, progress_pct):
                                msg = AuspexText.get_stage_msg(stage_key)
                                status_text.markdown(f"### ⚙️ {msg}")
                                progress_bar.progress(progress_pct / 100, text=f"{progress_pct}%")
                            
                            update_progress('initializing', 5)
                            time.sleep(0.2)
                            
                            update_progress('preprocessing', 15)
                            time.sleep(0.2)
                            
                            if mode_key == "mini":
                                update_progress('background_removal', 35)
                                time.sleep(0.2)
                            
                            if mode_key == "mini" and remove_base:
                                update_progress('base_detection', 50)
                                time.sleep(0.2)
                            
                            update_progress('color_extraction', 65)
                            
                            recipes, debug_img, quality_dict = st.session_state.engine.analyze_miniature(
                                raw_img,
                                mode=mode_key,
                                remove_base=remove_base,
                                use_awb=use_awb,
                                sat_boost=1.3 if use_sat else 1.0,
                                detect_details=detect_details
                            )
                            
                            update_progress('metallic_detection', 80)
                            time.sleep(0.2)
                            
                            update_progress('paint_matching', 90)
                            time.sleep(0.2)
                            
                            update_progress('finalizing', 98)
                            time.sleep(0.2)
                            progress_bar.progress(100)
                            
                            success_msg = random.choice(AuspexText.SUCCESS_MESSAGES)
                            status_text.success(f"✅ {success_msg}")
                            time.sleep(0.5)
                            
                            status_text.empty()
                            progress_bar.empty()
                            
                            processing_time = time.time() - start_time
                            
                            if recipes:
                                log_recipes = []
                                for r in recipes:
                                    r_copy = r.copy()
                                    if 'reticle' in r_copy: del r_copy['reticle']
                                    for k, v in r_copy.items():
                                        if isinstance(v, np.ndarray):
                                            r_copy[k] = v.tolist()
                                    log_recipes.append(r_copy)

                                scan_id = st.session_state.feedback_logger.log_scan({
                                    'image_size': raw_img.shape,
                                    'quality_score': quality_report.score,
                                    'recipes': log_recipes,
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
                            
                            st.session_state.scan_results = recipes
                            st.session_state.scan_quality = quality_report
                            
                        except Exception as e:
                            status_text.error(f"❌ {random.choice(AuspexText.ERROR_MESSAGES)}")
                            progress_bar.empty()
                            st.error(f"⚠️ Cogitator Error: {str(e)}")
                            logger.error(f"Analysis error: {e}", exc_info=True)

                    # === DISPLAY LOGIC ===
                    if st.session_state.scan_results:
                        recipes = st.session_state.scan_results
                        quality_score = st.session_state.scan_quality.score
                        
                        if not recipes:
                            st.warning("❌ No pigmentation detected.")
                        else:
                            st.success(f"✅ Cogitator Analysis Successful - {len(recipes)} Pigment Patterns Found")
                            
                            if 'processing_time' in st.session_state and st.session_state.processing_time > 0:
                                st.caption(f"⏳ Analysis completed in {st.session_state.processing_time:.2f} seconds")
                            
                            st.markdown("---")
                            
                            # === NEW: TACTICAL HUD GRID (Replaces old st.metric columns) ===
                            major_colours = [r for r in recipes if not r.get('is_detail', False)]
                            detail_colours = [r for r in recipes if r.get('is_detail', False)]
                            metallic_count = sum(1 for r in recipes if 'Metal' in r['family'] or 'Gold' in r['family'] or 'Silver' in r['family'])
                            total_paints_needed = len(major_colours) * 2

                            # Determine Quality Text
                            q_text = "Excellent" if quality_score > 80 else ("Good" if quality_score > 60 else "Fair")
                            
                            # Determine Details Text
                            details_text = f"{len(detail_colours)} details" if detail_colours else "No details"

                            st.markdown(f"""
                            <div class="hud-grid">
                                <div class="hud-card-auspex">
                                    <div class="hud-label-auspex">COLOURS DETECTED</div>
                                    <div class="hud-value-auspex">{len(recipes)}</div>
                                    <div class="hud-sub-auspex">{details_text}</div>
                                </div>
                                <div class="hud-card-auspex">
                                    <div class="hud-label-auspex">METALLICS</div>
                                    <div class="hud-value-auspex">{metallic_count}</div>
                                    <div class="hud-sub-auspex">Pigments</div>
                                </div>
                                <div class="hud-card-auspex">
                                    <div class="hud-label-auspex">SIGNAL QUALITY</div>
                                    <div class="hud-value-auspex">{quality_score}%</div>
                                    <div class="hud-sub-auspex">{q_text}</div>
                                </div>
                                <div class="hud-card-auspex">
                                    <div class="hud-label-auspex">EST. PAINTS</div>
                                    <div class="hud-value-auspex">{total_paints_needed}+</div>
                                    <div class="hud-sub-auspex">Bottles</div>
                                </div>
                            </div>
                            """, unsafe_allow_html=True)

                            st.markdown("---")
                            show_smart_disclaimer(recipes, quality_score)
                            
                            # === REVISED PALETTE: EQUAL WIDTH DATA CHIPS ===
                            st.markdown("### 🎨 Your Colour Scheme Preview")
                            # We use flex:1 to ensure equal width for all chips, ensuring visibility of small details
                            palette_html = "<div style='display: flex; height: 80px; border-radius: 12px; overflow: hidden; border: 3px solid #333; box-shadow: 0 4px 12px rgba(0,0,0,0.4); margin: 16px 0;'>"
                            display_recipes = recipes[:8] # Show up to 8
                            
                            for recipe in display_recipes:
                                rgb = recipe['rgb_preview']
                                colour_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                                # CHANGED: removed width_pct logic, used flex: 1 for equal width
                                brightness = sum(rgb) / 3
                                text_color = '#000' if brightness > 128 else '#fff'
                                # Reduced glow effect for clarity (text-shadow: 0 0 1px)
                                text_shadow = '#fff' if brightness < 128 else '#000'
                                palette_html += f"""<div style='
                                    flex: 1; 
                                    background: {colour_css}; 
                                    display: flex; 
                                    flex-direction: column; 
                                    align-items: center; 
                                    justify-content: center; 
                                    color: {text_color}; 
                                    text-shadow: 0 0 1px {text_shadow}; 
                                    padding: 4px; 
                                    border-right: 1px solid rgba(0,0,0,0.2); 
                                    font-family: "Share Tech Mono", monospace; 
                                    transition: all 0.2s; 
                                    cursor: pointer;
                                    min-width: 40px;  /* Prevent too narrow on mobile */
                                    font-size: clamp(0.7rem, 2vw, 0.9rem);  /* Responsive font */
                                ' 
                                onmouseover='this.style.flex="1.5";' 
                                onmouseout='this.style.flex="1";'>
                                    <div style='font-size: 1.1em; font-weight: bold;'>{recipe['dominance']:.0f}%</div>
                                    <div style='font-size: 0.7em; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 100%;'>{recipe['family']}</div>
                                </div>"""
                            palette_html += "</div>"
                            st.markdown(palette_html, unsafe_allow_html=True)
                            
                            if len(recipes) > 8:
                                st.caption(f"**Showing top 8 of {len(recipes)} detected colours**")
                            
                            st.markdown("---")
                            
                            # ===== DETAILED RECIPES (UPDATED WITH HEX COPY) =====
                            st.markdown("### ✨ Sacred Formulations")
                            
                            for idx, recipe in enumerate(recipes):
                                is_detail = recipe.get('is_detail', False)
                                header = f"{recipe['family']} ({recipe['dominance']:.1f}%)"
                                if is_detail: header = "⭐ " + header
                                
                                try:
                                    brand_index = Affiliate.SUPPORTED_BRANDS.index(global_brand_pref)
                                except ValueError:
                                    brand_index = 0
                                
                                with st.expander(f"🎨 {header}", expanded=(idx < 3 and not is_detail)):
                                    col_toggle, col_brand = st.columns([1, 2])
                                    with col_toggle:
                                        show_location = st.checkbox("📍 Show location", value=(idx < 2 and not is_detail), key=f"show_loc_{idx}")
                                    with col_brand:
                                        selected_brand = st.selectbox("Preferred brand:", options=Affiliate.SUPPORTED_BRANDS, index=brand_index, key=f"brand_select_{idx}")
                                    
                                    if show_location:
                                        st.image(recipe['reticle'], caption=f"Areas containing {recipe['family']} ({recipe['dominance']:.1f}%)", use_container_width=True)
                                        st.caption("💡 Coloured border shows detected regions")
                                        st.markdown("---")
                                    
                                    st.markdown("**🎨 Recommended Paints:**")
                                    
                                    # Function to render a paint row with Hex Copy
                                    def render_paint_row(label, paint, icon, unique_key):
                                        if paint:
                                            c_info, c_hex, c_add = st.columns([4, 2, 1])
                                            with c_info:
                                                url = get_affiliate_link(selected_brand, paint['name'], region_option)
                                                st.markdown(f"{icon} **{label}:** [{paint['name']}]({url})")
                                            with c_hex:
                                                # Clickable copy hex code
                                                if 'hex' in paint:
                                                    st.code(paint['hex'], language=None)
                                                else:
                                                    st.caption("No Hex")
                                            with c_add:
                                                # Safe cart update
                                                def add_to_cart_action(cart):
                                                    cart.add_paint(selected_brand, paint['name'])
                                                
                                                if st.button("➕", key=unique_key, help="Add to List"):
                                                    safe_session_update('shopping_cart', add_to_cart_action)
                                                    st.rerun()

                                    # Base Paint
                                    base_match = recipe['base'].get(selected_brand)
                                    render_paint_row("Base", base_match, "🛡️", f"add_b_{idx}")
                                    
                                    # Highlight Paint
                                    high_match = recipe['highlight'].get(selected_brand)
                                    render_paint_row("Highlight", high_match, "✨", f"add_h_{idx}")
                                    
                                    # Shade Paint
                                    shade_match = recipe['shade'].get(selected_brand)
                                    shade_icon = "💧" if recipe['shade_type'] == 'wash' else "🌑"
                                    render_paint_row("Wash" if recipe['shade_type'] == 'wash' else "Shade", shade_match, shade_icon, f"add_s_{idx}")
                                    
                                    # Quick Add Buttons
                                    st.markdown("---")
                                    col1, col2 = st.columns(2)
                                    
                                    with col1:
                                        def add_all_action(cart):
                                            if base_match: cart.add_paint(selected_brand, base_match['name'])
                                            if high_match: cart.add_paint(selected_brand, high_match['name'])
                                            if shade_match: cart.add_paint(selected_brand, shade_match['name'])

                                        if st.button("➕ Add All 3 Layers", key=f"quick_all_{idx}", use_container_width=True):
                                            safe_session_update('shopping_cart', add_all_action)
                                            st.rerun()
                                    
                                    with col2:
                                        def add_base_action(cart):
                                            if base_match: cart.add_paint(selected_brand, base_match['name'])

                                        if st.button("➕ Base Only", key=f"quick_base_{idx}", use_container_width=True):
                                            safe_session_update('shopping_cart', add_base_action)
                                            st.rerun()

                            # === QUICK ACTIONS (REVISED: 2 Buttons + Popover) ===
                            st.divider()
                            st.markdown("### 📋 Quick Actions")
                            
                            # Prepare Data
                            all_paints = []
                            for recipe in recipes:
                                base = recipe['base'].get(global_brand_pref)
                                if not base:
                                    for b in Affiliate.SUPPORTED_BRANDS:
                                        if recipe['base'].get(b):
                                            base = recipe['base'][b]
                                            break
                                if base:
                                    all_paints.append(f"{recipe['family']}: {base['name']}")
                            paint_list_text = "\n".join(all_paints)
                            
                            # Row 1: Download & Copy (Equal Width)
                            row1_col1, row1_col2 = st.columns(2)
                            with row1_col1:
                                st.download_button(
                                    "📥 Download List",
                                    paint_list_text,
                                    file_name=f"paint_list_{datetime.now().strftime('%Y%m%d')}.txt",
                                    mime="text/plain",
                                    use_container_width=True
                                )
                            with row1_col2:
                                if st.button("📋 Copy List", use_container_width=True):
                                    st.code(paint_list_text, language=None)
                            
                            # Row 2: Smart Share Popover (Full Width)
                            colours_text = ", ".join([r['family'] for r in recipes[:3]])
                            share_text = f"I scanned my mini with SchemeStealer! Found: {colours_text}. Check it out!"
                            encoded_text = urllib.parse.quote(share_text)
                            
                            with st.popover("📤 Share Results", use_container_width=True):
                                st.markdown("### Share via:")
                                st.link_button("✖️ X (Twitter)", f"https://twitter.com/intent/tweet?text={encoded_text}", use_container_width=True)
                                st.link_button("💬 WhatsApp", f"https://wa.me/?text={encoded_text}", use_container_width=True)
                                st.link_button("👽 Reddit", f"https://www.reddit.com/submit?title=SchemeStealer%20Scan&text={encoded_text}", use_container_width=True)
                                st.link_button("📧 Email", f"mailto:?subject=My%20Paint%20Scheme&body={encoded_text}", use_container_width=True)


                            # === FEEDBACK (REVISED EQUAL WIDTH) ===
                            st.divider()
                            st.markdown("### 📊 How Did We Do?")
                            col_fb1, col_fb2 = st.columns(2) # Changed to 2 equal columns
                            
                            with col_fb1:
                                if st.button("👍 Accurate", use_container_width=True):
                                    scan_id = st.session_state.get('current_scan_id')
                                    if scan_id: st.session_state.feedback_logger.log_feedback(scan_id, 'thumbs_up', rating=5)
                                    st.success("Thanks! 🎉")
                            
                            with col_fb2:
                                if st.button("👎 Needs Work", use_container_width=True):
                                    st.session_state.show_correction_form = True
                                    st.rerun()
                            
                            # Correction Form Logic (unchanged but using safe naming)
                            if st.session_state.get('show_correction_form', False):
                                st.divider()
                                with st.expander("🔧 Help Us Improve", expanded=True):
                                    st.markdown("**Your corrections train the Machine Spirit!** Be as specific as possible.")
                                    issues = st.multiselect("What went wrong?", ["Wrong colour family", "Missed small details", "Wrong paint brand match", "Base wasn't removed properly", "Detected metallic incorrectly"])
                                    expected_colours = st.text_area("What should the colours be?", placeholder="e.g. 'Gold not Brown'")
                                    comments = st.text_area("Any other details?")
                                    user_email = st.text_input("Email (optional)")
                                    
                                    col_a, col_b = st.columns(2)
                                    with col_a:
                                        if st.button("✅ Submit Correction", use_container_width=True, type="primary"):
                                            scan_id = st.session_state.get('current_scan_id')
                                            if scan_id and expected_colours:
                                                st.session_state.feedback_logger.log_feedback(scan_id, 'correction', rating=2, issues=issues, expected_colours=expected_colours, comments=comments, user_email=user_email)
                                                st.success("✅ Thank you! The Machine Spirit learns from your wisdom! 🧠")
                                                st.session_state.show_correction_form = False
                                                st.rerun()
                                    with col_b:
                                        if st.button("Cancel", use_container_width=True):
                                            st.session_state.show_correction_form = False
                                            st.rerun()

        except Exception as e:
            st.error(f"❌ Failed to load image: {str(e)}")
            logger.error(f"Image load error: {e}", exc_info=True)
        finally:
            cleanup_opencv_image(raw_img)

    st.divider()
    # FIXED: Pass unique suffix for Tab 1
    render_paint_list_ui(key_suffix="auspex")

    st.markdown('</div>', unsafe_allow_html=True)
    # Render footer inside tab to inherit green theme
    render_footer(theme="green")

# ============================================================================
# TAB 2: INSPIRATION PROTOCOLS
# ============================================================================

with tab2:
    # MARKER FOR CSS ISOLATION (Critical: Must be first element in tab)
    st.markdown('<span class="inspiration-marker"></span>', unsafe_allow_html=True)
    
    st.markdown('<div class="inspiration-tab-container">', unsafe_allow_html=True)
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
    
    with st.expander("💡 Inspiration Ideas & Tips", expanded=False):
        st.markdown("""
        Perfect for creating custom army schemes inspired by nature, movies, or your favourite art.
        
        **Great sources for colour schemes:**
        - 🌅 Landscapes & nature
        - 🎨 Artwork & paintings
        - 🎬 Movie stills
        """)
    
    st.markdown("""
    <div class="inspiration-upload-box">
        <div class="upload-icon">🌀</div>
        <div class="upload-main-text">CLICK TO UPLOAD</div>
        <div class="upload-sub-text">Drag and drop or click to open cosmic portal</div>
        <div class="upload-file-types">Any image • JPG, JPEG, PNG • Max 10MB</div>
    </div>
    """, unsafe_allow_html=True)

    def handle_inspiration_upload():
        """Callback to handle file upload without triggering tab reset"""
        # This empty callback prevents Streamlit from resetting tab on first upload
        pass

    uploaded_inspiration = st.file_uploader(
        "Upload Inspiration Image",
        type=["jpg", "jpeg", "png"],
        key="uploader_inspiration",
        help="Upload any inspiration image",
        label_visibility="collapsed",
        on_change=handle_inspiration_upload  # ← This prevents tab reset!
    )

    if uploaded_inspiration is not None:
        raw_img = None
        try:
            file_bytes = np.asarray(bytearray(uploaded_inspiration.read()), dtype=np.uint8)
            raw_img = cv2.imdecode(file_bytes, 1)
            raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
            if Mobile.AUTO_COMPRESS_IMAGES:
                raw_img = compress_image_for_mobile(raw_img, Mobile.COMPRESSED_IMAGE_WIDTH)
            
            st.markdown("#### 🖼️ Your Inspiration Source")
            st.image(raw_img, use_container_width=True, caption="Original image")
            
            st.markdown("**📂 What type of image is this?**")
            @st.fragment
            def source_type_selector():
                """Fragment to prevent selectbox from triggering full rerun"""
                return st.selectbox(
                    "Image Type:", 
                    ["🌅 Landscape/Nature", "🎨 Artwork/Painting", "🎬 Movie/Game Screenshot", 
                    "🏛️ Architecture", "🦋 Animal/Creature", "🍕 Food", "🌸 Flowers/Plants", 
                    "📸 Photography", "🎮 Other"], 
                    index=0, 
                    key="inspiration_source_type_select"
                )
            
            source_type = source_type_selector()
            
            st.markdown("---")
            st.markdown('<div class="inspiration-tab-content"><div class="inspiration-action-button">', unsafe_allow_html=True)
            search_clicked = st.button("🎨 EXTRACT COLOUR PALETTE", type="primary", key="btn_inspiration", use_container_width=True)
            st.markdown('</div></div>', unsafe_allow_html=True)
            
            if search_clicked:
                # === NEW LOADING BAR FOR INSPIRATION ===
                status_text = st.empty()
                progress_bar = st.empty()
                
                try:
                    def update_insp_progress(stage_key, progress_pct):
                        msg = AuspexText.get_stage_msg(stage_key)
                        status_text.markdown(f"### 🔮 {msg}")
                        progress_bar.progress(progress_pct / 100, text=f"{progress_pct}%")

                    update_insp_progress('initializing', 10)
                    time.sleep(0.3)
                    
                    update_insp_progress('preprocessing', 30)
                    time.sleep(0.3)
                    
                    update_insp_progress('color_extraction', 60)
                    
                    recipes, _, _ = st.session_state.engine.analyze_miniature(raw_img, mode="scene", remove_base=False, use_awb=False, sat_boost=1.0, detect_details=False)
                    
                    update_insp_progress('finalizing', 90)
                    time.sleep(0.3)
                    progress_bar.progress(100)
                    status_text.empty()
                    progress_bar.empty()
                    
                    if not recipes:
                        st.warning("⚠️ Couldn't extract distinct colours. Try an image with more colour variety!")
                    else:
                        st.session_state.inspiration_results = recipes
                        
                        try:
                            log_recipes = []
                            for r in recipes:
                                r_copy = r.copy()
                                if 'reticle' in r_copy: del r_copy['reticle']
                                if 'rgb_preview' in r_copy and isinstance(r_copy['rgb_preview'], np.ndarray):
                                    r_copy['rgb_preview'] = r_copy['rgb_preview'].tolist()
                                if 'pixel_indices' in r_copy: del r_copy['pixel_indices']
                                log_recipes.append(r_copy)
                            
                            inspiration_scan_id = st.session_state.feedback_logger.log_scan({
                                'mode': 'inspiration',
                                'source_type': st.session_state.get('inspiration_source_type_select', 'Unknown'),
                                'image_size': raw_img.shape,
                                'recipes': log_recipes,
                                'num_colours': len(recipes),
                                'brands': Affiliate.SUPPORTED_BRANDS
                            })
                            st.session_state.current_inspiration_scan_id = inspiration_scan_id
                            st.session_state.analytics.track_scan(mode='inspiration', num_colors=len(recipes), quality_score=100)
                        except Exception as e:
                            logger.error(f"Failed to log inspiration scan: {e}", exc_info=True)
                except Exception as e:
                    status_text.error(f"❌ Error processing image: {str(e)}")
                    logger.error(f"Inspiration error: {e}", exc_info=True)
            
            if st.session_state.inspiration_results:
                recipes = st.session_state.inspiration_results
                
                # Custom Success Message for Purple Theme
                st.markdown(f"""
                    <div class="inspiration-success-box">
                        🎇 <b>IDEA ENGINE SYNCHRONISED</b><br>
                        {len(recipes)} pigment patterns extracted from visual data.
                    </div>
                """, unsafe_allow_html=True)

                st.markdown("---")
                
                # === NEW: INSPIRATION HUD GRID (Replaces old logic if any, creates consistency) ===
                # Note: Inspiration mode has less metadata (no quality score from engine), so we adapt.
                # We'll show: Colours, Primary Mood, Source Type, Est Paints.
                
                total_paints_insp = len(recipes) * 3 # Base, layer, shade
                primary_mood = recipes[0]['family'] if recipes else "Unknown"

                st.markdown(f"""
                <div class="hud-grid">
                    <div class="hud-card-inspiration">
                        <div class="hud-label-inspiration">COLOURS EXTRACTED</div>
                        <div class="hud-value-inspiration">{len(recipes)}</div>
                        <div class="hud-sub-inspiration">Harmonies Found</div>
                    </div>
                    <div class="hud-card-inspiration">
                        <div class="hud-label-inspiration">PRIMARY MOOD</div>
                        <div class="hud-value-inspiration" style="font-size: 1.2em; margin-top: 5px;">{primary_mood}</div>
                        <div class="hud-sub-inspiration">Dominant Tone</div>
                    </div>
                    <div class="hud-card-inspiration">
                        <div class="hud-label-inspiration">SOURCE DATA</div>
                        <div class="hud-value-inspiration" style="font-size: 1.0em; margin-top: 8px;">{st.session_state.get('inspiration_source_type_select', 'ðŸŒ… Landscape/Nature').split(' ')[1] if ' ' in st.session_state.get('inspiration_source_type_select', 'ðŸŒ… Landscape/Nature') else 'Image'}</div>
                        <div class="hud-sub-inspiration">Classification</div>
                    </div>
                    <div class="hud-card-inspiration">
                        <div class="hud-label-inspiration">EST. PAINTS</div>
                        <div class="hud-value-inspiration">{total_paints_insp}</div>
                        <div class="hud-sub-inspiration">Bottles Needed</div>
                    </div>
                </div>
                """, unsafe_allow_html=True)

                st.markdown("---")
                st.markdown("### 🎨 Your Custom Colour Palette")
                
                # === REVERTED TO VERTICAL CARDS (Original Inspiration Look) ===
                num_colours = min(len(recipes), 5)
                cols = st.columns(num_colours)
                for idx, recipe in enumerate(recipes[:5]):
                    with cols[idx]:
                        rgb = recipe['rgb_preview']
                        colour_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                        # Simple vertical card style
                        st.markdown(f"<div style='background: {colour_css}; height: 130px; border-radius: 12px; border: 3px solid #333; margin-bottom: 12px;'></div>", unsafe_allow_html=True)
                        st.markdown(f"<div style='text-align: center;'><p style='font-weight: bold; margin-bottom: 4px;'>{recipe['family']}</p><p style='color: #888; font-size: 0.9em;'>{recipe['dominance']:.0f}%</p></div>", unsafe_allow_html=True)
                
                st.markdown("---")
                st.markdown("### 🛡️ Paint Recommendations")
                preferred_brand = global_brand_pref
                
                for idx, recipe in enumerate(recipes):
                    rgb = recipe['rgb_preview']
                    colour_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                    
                    with st.expander(f"🎨 {recipe['family']} ({recipe['dominance']:.0f}%)", expanded=(idx == 0)):
                        col_swatch, col_paints = st.columns([1, 2])
                        with col_swatch:
                            st.markdown(f"<div style='background: linear-gradient(135deg, {colour_css} 0%, {colour_css} 60%, rgba(0,0,0,0.4) 100%); height: 160px; border-radius: 10px; border: 3px solid #333; display: flex; align-items: center; justify-content: center; font-size: 3em;'>🎨</div>", unsafe_allow_html=True)
                        
                        with col_paints:
                            st.markdown(f"**{preferred_brand} Paint Matches:**")
                            
                            # Helper to render row with hex copy
                            def render_insp_row(label, paint, icon):
                                if paint:
                                    c_info, c_hex = st.columns([4, 2])
                                    with c_info:
                                        url = get_affiliate_link(preferred_brand, paint['name'], region_option)
                                        st.markdown(f"{icon} **{label}:** [{paint['name']}]({url})")
                                    with c_hex:
                                        if 'hex' in paint:
                                            st.code(paint['hex'], language=None)
                                        else:
                                            st.caption("-")

                            # Base
                            base = recipe['base'].get(preferred_brand)
                            render_insp_row("Base", base, "🛡️")
                            
                            # Highlight
                            highlight = recipe['highlight'].get(preferred_brand)
                            render_insp_row("Highlight", highlight, "✨")
                            
                            # Shade
                            shade = recipe['shade'].get(preferred_brand)
                            render_insp_row("Shade", shade, "💧" if recipe['shade_type'] == 'wash' else "🌑")
                
                # === RESTORED SOCIAL BUTTONS FOR INSPIRATION (2 Buttons + Popover) ===
                st.markdown("---")
                st.markdown("### 💾 Save & Share Your Palette")
                
                # Prepare data
                palette_text = "MY CUSTOM COLOUR SCHEME\n"
                palette_text += f"Generated: {datetime.now().strftime('%Y-%m-%d')}\n"
                for r in recipes:
                    palette_text += f"- {r['family']} ({r['dominance']:.0f}%)\n"

                # Row 1: Download & Copy
                row1_col1, row1_col2 = st.columns(2)
                with row1_col1:
                    st.download_button(
                        "📥 Download", 
                        palette_text, 
                        file_name="palette.txt",
                        mime="text/plain",
                        use_container_width=True
                    )
                with row1_col2:
                    if st.button("📋 Copy List", key="insp_copy", use_container_width=True):
                        st.code(palette_text, language=None)

                # Row 2: Share Popover
                share_text_insp = f"Check out this paint scheme I made with SchemeStealer! Extracted from {st.session_state.get('inspiration_source_type_select', 'inspiration')}."
                encoded_text_insp = urllib.parse.quote(share_text_insp)
                
                with st.popover("📤 Share Results", use_container_width=True):
                    st.markdown("### Share via:")
                    st.link_button("✖️ X (Twitter)", f"https://twitter.com/intent/tweet?text={encoded_text_insp}", use_container_width=True)
                    st.link_button("💬 WhatsApp", f"https://wa.me/?text={encoded_text_insp}", use_container_width=True)
                    st.link_button("👽 Reddit", f"https://www.reddit.com/submit?title=SchemeStealer%20Palette&text={encoded_text_insp}", use_container_width=True)
                    st.link_button("📧 Email", f"mailto:?subject=My%20Paint%20Scheme&body={encoded_text_insp}", use_container_width=True)


                # Feedback Section
                st.markdown("---")
                col1, col2 = st.columns(2)
                with col1:
                     if st.button("👍 Good Match", key="insp_up", use_container_width=True):
                         st.success("Feedback Recorded!")
                with col2:
                     if st.button("👎 Poor Match", key="insp_down", use_container_width=True):
                         st.session_state.show_inspiration_correction = True
                         st.rerun()

        except Exception as e:
            st.error(f"❌ Error processing image: {str(e)}")
            logger.error(f"Inspiration error: {e}", exc_info=True)
        finally:
            cleanup_opencv_image(raw_img)

    st.divider()
    # FIXED: Pass unique suffix for Tab 2
    render_paint_list_ui(key_suffix="insp")

    st.markdown('</div>', unsafe_allow_html=True)
    # Render footer inside tab to inherit purple theme
    render_footer(theme="purple")
    # === ADDED DEBUG OUTPUT AT THE VERY END ===
    if debug_mode:
        st.divider()
        st.error("🛠️ DEBUG MODE ACTIVE")
        st.write(f"**Session ID:** {st.session_state.get('current_scan_id', 'N/A')}")
        st.write(f"**Last Run:** {datetime.now()}")
        st.write("**Session State:**")
        st.json(st.session_state)
        st.write("**Query Params:**")
        st.write(st.query_params)
