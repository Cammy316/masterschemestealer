"""
SchemeStealer v2.5 - Main Application
Mobile-optimized Streamlit MVP
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

# NEW v2.1 IMPORTS
from utils.feedback_logger import FeedbackLogger
from utils.shopping_cart import ShoppingCart
from utils.analytics import SimpleAnalytics

# ============================================================================
# FLAVOUR TEXT & THEMES
# ============================================================================

class AuspexText:
    """Warhammer 40k/AoS Thematic Text Generator"""
    
    LOADING_MESSAGES = [
        "Communing with the Machine Spirit...",
        "Auspex Scan Initializing...",
        "Reciting the Litany of Recognition...",
        "Tech-Priest Enginseer Calibrating Sensors...",
        "Purging Heretical Color Casts...",
        "Consulting the Codex Astartes...",
        "Scanning Biomass Pigmentation...",
        "Calculating Standard Template Construct Matches...",
        "Invoking the Omnissiah's Blessing...",
        "Filtering Warp Interference..."
    ]
    
    SUCCESS_MESSAGES = [
        "The Emperor Protects, and Identifies!",
        "STC Pattern Recognized.",
        "Machine Spirit Appeased.",
        "Xenos/Heretic Pigment Identified.",
        "Cogitator Analysis Complete."
    ]
    
    ERROR_MESSAGES = [
        "Machine Spirit Angered.",
        "Warp Storm Interference Detected.",
        "Heretical Data Corruption.",
        "Gellar Field Failure - Image Unclear."
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
        if mode == "inspiration":
             return random.choice(AuspexText.INSPIRATION_LOADING_MESSAGES)
        return random.choice(AuspexText.LOADING_MESSAGES)

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

# Mobile-optimized CSS with Custom Fonts
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
        color: #fff; 
        text-shadow: 0 0 5px #fff; 
    }
    
    /* Headers - High Gothic Style */
    h1, h2, h3, h4 {
        font-family: 'Cinzel', serif !important;
        font-weight: 700 !important;
        letter-spacing: 0px;
        text-transform: uppercase;
    }
    
    /* Streamlit Expander Header */
    .streamlit-expanderHeader {
        font-family: 'Share Tech Mono', monospace !important;
        font-size: 16px !important;
    }
    
    /* Global text enhancement */
    p, li {
        font-family: sans-serif;
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
if 'scan_quality' not in st.session_state:
    st.session_state.scan_quality = None

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

# ============================================================================
# TAB 1: AUSPEX SCAN (Miniature Scanner)
# ============================================================================

with tab1:
    st.markdown("""
    **📸 Initialize Auspex Scan** Upload pict-capture of miniature. Receive sacred paint formulations from the archives of Citadel, Vallejo, and Army Painter.
    """)

    # File uploader
    uploaded_file = st.file_uploader(
        "📤 Upload Pict-Capture (Miniature)",
        type=["jpg", "jpeg", "png"],
        help=f"Max {Mobile.MAX_IMAGE_UPLOAD_SIZE}MB",
        key="uploader_auspex"
    )

    if uploaded_file is not None:
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
                # === SCAN BUTTON LOGIC ===
                # If button is clicked, RUN analysis and SAVE to session state
                if st.button("🧬 INITIATE AUSPEX SCAN", type="primary", key="btn_auspex"):
                    msg = AuspexText.get_loading_msg(mode="scan")
                    progress_bar = st.progress(0, text="Initializing...")
                    
                    try:
                        for i in range(1, 101, 20):
                            time.sleep(0.05) 
                            progress_bar.progress(i, text=msg)

                        # Run analysis
                        recipes, debug_img, quality_dict = st.session_state.engine.analyze_miniature(
                            raw_img,
                            mode=mode_key,
                            remove_base=remove_base,
                            use_awb=use_awb,
                            sat_boost=1.3 if use_sat else 1.0,
                            detect_details=detect_details
                        )
                        
                        progress_bar.progress(100, text=random.choice(AuspexText.SUCCESS_MESSAGES))
                        time.sleep(0.5)
                        progress_bar.empty()
                        
                        # === SAVE RESULTS TO SESSION STATE ===
                        st.session_state.scan_results = recipes
                        st.session_state.scan_quality = quality_report
                        
                        # LOGGING
                        if recipes:
                            # Sanitize for logs
                            log_recipes = []
                            for r in recipes:
                                r_copy = r.copy()
                                if 'reticle' in r_copy: del r_copy['reticle']
                                if 'rgb_preview' in r_copy: r_copy['rgb_preview'] = r_copy['rgb_preview'].tolist()
                                log_recipes.append(r_copy)

                            scan_id = st.session_state.feedback_logger.log_scan({
                                'image_size': raw_img.shape,
                                'quality_score': quality_report.score,
                                'recipes': log_recipes,
                                'mode': mode_key,
                                'brands': Affiliate.SUPPORTED_BRANDS
                            })
                            st.session_state.current_scan_id = scan_id
                            st.session_state.analytics.track_scan(mode=mode_key, num_colors=len(recipes), quality_score=quality_report.score)
                            
                    except Exception as e:
                        st.error(f"❌ Cogitator Error: {str(e)}")
                        logger.error(f"Analysis error: {e}", exc_info=True)

                # === DISPLAY LOGIC (RUNS IF RESULTS EXIST IN STATE) ===
                if st.session_state.scan_results:
                    recipes = st.session_state.scan_results
                    quality_score = st.session_state.scan_quality.score
                    
                    if not recipes:
                        st.warning("❌ No pigmentation detected.")
                    else:
                        st.success(f"✅ Cogitator Analysis Successful - {len(recipes)} Pigment Patterns Found")
                        show_smart_disclaimer(recipes, quality_score)
                        
                        # ===== COLOR PALETTE PREVIEW =====
                        st.markdown("### 🎨 Detected Pigments")
                        major_colors = [r for r in recipes if not r.get('is_detail', False)]
                        detail_colors = [r for r in recipes if r.get('is_detail', False)]
                        
                        # Major colors
                        if major_colors:
                            st.caption(f"**Primary Scheme Components ({len(major_colors)})**")
                            cols = st.columns(min(len(major_colors), 4))
                            for idx, recipe in enumerate(major_colors[:4]):
                                with cols[idx]:
                                    rgb = recipe['rgb_preview']
                                    color_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                                    st.markdown(f"""
                                        <div class="palette-box" style="background-color: {color_css};"></div>
                                        <div class="palette-label">{recipe['family']}</div>
                                        """, unsafe_allow_html=True)
                        
                        # Detail colors
                        if detail_colors:
                            st.caption(f"**Sub-Patterns / Details ({len(detail_colors)})**")
                            detail_cols = st.columns(min(len(detail_colors), 4))
                            for idx, recipe in enumerate(detail_colors[:4]):
                                with detail_cols[idx]:
                                    rgb = recipe['rgb_preview']
                                    color_css = f"rgb({rgb[0]},{rgb[1]},{rgb[2]})"
                                    st.markdown(f"""
                                        <div class="palette-box" style="background-color: {color_css}; height: 40px;"></div>
                                        <div class="palette-label">{recipe['family']}</div>
                                        """, unsafe_allow_html=True)
                        
                        st.divider()
                        
                        # ===== DETAILED RECIPES =====
                        st.markdown("### ✨ Sacred Formulations")
                        for recipe in recipes:
                            is_detail = recipe.get('is_detail', False)
                            header = f"#### {recipe['family']} ({recipe['dominance']:.1f}%)"
                            if is_detail: header += " <span class='detail-badge'>💎 DETAIL</span>"
                            st.markdown(header, unsafe_allow_html=True)
                            
                            col_vis, col_data = st.columns([1, 2])
                            with col_vis:
                                st.image(recipe['reticle'], caption="Target Location")
                            
                            with col_data:
                                def render_paint_layer(label, matches, badge=None):
                                    header_text = f"**{label}**"
                                    if badge: header_text += f" <span class='wash-badge'>{badge}</span>"
                                    st.markdown(header_text, unsafe_allow_html=True)
                                    for brand in Affiliate.SUPPORTED_BRANDS:
                                        css_class = f"brand-{brand.replace(' ', '_')}"
                                        match = matches.get(brand)
                                        if match:
                                            url = get_affiliate_link(brand, match['name'], region_option)
                                            st.markdown(f"<span class='{css_class}'>{brand}:</span> <a href='{url}' target='_blank'>{match['name']} 🛒</a>", unsafe_allow_html=True)
                                        else:
                                            st.markdown(f"<span class='{css_class}'>{brand}:</span> <span style='color:#666;'>[NO STC DATA]</span>", unsafe_allow_html=True)
                                    st.markdown("")
                                
                                render_paint_layer("🛡️ Base", recipe['base'])
                                render_paint_layer("✨ Highlight", recipe['highlight'])
                                shade_label = "💧 Wash" if recipe['shade_type'] == 'wash' else "🌑 Shade"
                                render_paint_layer(shade_label, recipe['shade'])
                            st.divider()

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
                            with st.expander("📝 Help Us Improve", expanded=True):
                                issues = st.multiselect("Select all issues:", ["Wrong color detected", "Missing accent colors", "Wrong paint recommendation", "Base not removed properly", "Metallic detection wrong"])
                                comments = st.text_area("Additional details:")
                                if st.button("✅ Submit Feedback"):
                                    scan_id = st.session_state.get('current_scan_id')
                                    if scan_id: st.session_state.feedback_logger.log_feedback(scan_id, 'correction', rating=2, corrections=[{'issues': issues}], comments=comments)
                                    st.success("Feedback submitted!")
                                    st.session_state.show_correction_form = False
                                    st.rerun()

                        # === SHOPPING CART ===
                        st.divider()
                        st.markdown("### 🛒 Build Your Shopping List")
                        st.info("💡 **Tip:** Select base paints for main colors, add highlights/shades as needed")
                        
                        selected_paints = []
                        for idx, recipe in enumerate(recipes):
                            is_detail = recipe.get('is_detail', False)
                            header = f"{recipe['family']} ({recipe['dominance']:.1f}%)"
                            if is_detail: header = "⭐ " + header
                            
                            with st.expander(f"📦 {header}", expanded=(idx < 3 and not is_detail)):
                                selected_brand = st.selectbox("Preferred brand:", options=Affiliate.SUPPORTED_BRANDS, index=0, key=f"brand_select_{idx}")
                                
                                base_match = recipe['base'].get(selected_brand)
                                if base_match:
                                    c1, c2 = st.columns([1,3])
                                    with c1: b_sel = st.checkbox("🛡️", value=True, key=f"chk_b_{idx}")
                                    with c2: st.markdown(f"**Base:** {base_match['name']}")
                                    if b_sel: selected_paints.append({'brand': selected_brand, 'name': base_match['name'], 'layer': 'Base', 'family': recipe['family']})
                                
                                high_match = recipe['highlight'].get(selected_brand)
                                if high_match:
                                    c1, c2 = st.columns([1,3])
                                    with c1: h_sel = st.checkbox("✨", value=False, key=f"chk_h_{idx}")
                                    with c2: st.markdown(f"**High:** {high_match['name']}")
                                    if h_sel: selected_paints.append({'brand': selected_brand, 'name': high_match['name'], 'layer': 'Highlight', 'family': recipe['family']})
                                
                                shade_match = recipe['shade'].get(selected_brand)
                                if shade_match:
                                    c1, c2 = st.columns([1,3])
                                    with c1: s_sel = st.checkbox("💧", value=False, key=f"chk_s_{idx}")
                                    with c2: st.markdown(f"**Wash:** {shade_match['name']}")
                                    if s_sel: selected_paints.append({'brand': selected_brand, 'name': shade_match['name'], 'layer': 'Wash', 'family': recipe['family']})

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
# TAB 2: INSPIRATION PROTOCOLS (General Image Scanner)
# ============================================================================

with tab2:
    st.markdown("**🌌 Inspiration Protocols Active** Upload environmental data (landscapes, artwork).")
    uploaded_inspiration = st.file_uploader("📸 Upload Reference Data", type=["jpg", "jpeg", "png"], key="uploader_inspiration")

    if uploaded_inspiration is not None:
        try:
            file_bytes = np.asarray(bytearray(uploaded_inspiration.read()), dtype=np.uint8)
            raw_img = cv2.imdecode(file_bytes, 1)
            raw_img = cv2.cvtColor(raw_img, cv2.COLOR_BGR2RGB)
            if Mobile.AUTO_COMPRESS_IMAGES:
                raw_img = compress_image_for_mobile(raw_img, Mobile.COMPRESSED_IMAGE_WIDTH)
            
            st.image(raw_img, caption="Reference Data Source")
            
            if st.button("🧬 GENERATE SCHEME", type="primary", key="btn_inspiration"):
                with st.spinner("Synthesizing..."):
                    recipes, _, _ = st.session_state.engine.analyze_miniature(raw_img, mode="scene", remove_base=False, use_awb=False, sat_boost=1.0, detect_details=False)
                    
                    if not recipes:
                        st.warning("❌ Data Insufficient.")
                    else:
                        st.success(f"✅ Scheme Synthesized - {len(recipes)} Colors Identified")
                        cols = st.columns(min(len(recipes), 4))
                        for idx, recipe in enumerate(recipes[:4]):
                            with cols[idx]:
                                rgb = recipe['rgb_preview']
                                st.markdown(f"<div class='palette-box' style='background-color: rgb({rgb[0]},{rgb[1]},{rgb[2]});'></div>", unsafe_allow_html=True)
                        
                        st.divider()
                        for recipe in recipes:
                            st.markdown(f"#### {recipe['family']} ({recipe['dominance']:.1f}%)")
                            col_vis, col_data = st.columns([1, 2])
                            with col_vis: st.image(recipe['reticle'], caption="Source")
                            with col_data:
                                def render_layer(label, matches):
                                    st.markdown(f"**{label}**")
                                    for brand in Affiliate.SUPPORTED_BRANDS:
                                        match = matches.get(brand)
                                        if match: 
                                            url = get_affiliate_link(brand, match['name'], region_option)
                                            st.markdown(f"- {brand}: [{match['name']}]({url})")
                                render_layer("Base", recipe['base'])
                                render_layer("Highlight", recipe['highlight'])
                                render_layer("Shade", recipe['shade'])
                            st.divider()
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")

# ============================================================================
# FOOTER
# ============================================================================

st.divider()
st.markdown(f"""
<div style='text-align: center; color: #666; font-size: 0.8em; font-family: monospace;'>
    {APP_NAME} v{APP_VERSION} | 
    Sanctioned by the Mechanicus | 
    <a href='#' style='color: #5DA153;'>Transmit Astropathic Feedback</a>
</div>
""", unsafe_allow_html=True)
