"""
SchemeStealer Configuration
All magic numbers, thresholds, and settings in one place
"""

# ============================================================================
# APP CONFIGURATION
# ============================================================================

APP_NAME = "SchemeStealer"
APP_VERSION = "2.5.0"
APP_ICON = "🧬"

# ============================================================================
# COLOR DETECTION SETTINGS
# ============================================================================

class ColorDetection:
    """Color extraction settings.

    NOTE: the cluster count, detail-coverage and metallic thresholds are owned by
    the algorithms themselves (smart_color_system._determine_optimal_k / its
    adaptive detail logic, and color_engine.is_metallic_surface). The unused
    constants that used to live here were removed (M-4/M-5) because they did not
    drive behaviour and were misleading. Only values actually consumed remain.
    """
    # Image processing — analysis resolution (used by schemestealer_engine).
    RESIZE_WIDTH = 300


# ============================================================================
# COLOR FAMILY RANGES (for reference and debugging)
# ============================================================================

# ============================================================================
# PHOTO QUALITY SETTINGS
# ============================================================================

class PhotoQuality:
    """Photo preprocessing thresholds"""
    
    # Glare detection
    GLARE_THRESHOLD = 0.05          # % of blown-out pixels
    GLARE_BRIGHTNESS = 250          # Pixel brightness threshold (0-255)
    
    # Exposure detection
    UNDEREXPOSED_THRESHOLD = 80     # Average brightness minimum
    OVEREXPOSED_THRESHOLD = 200     # Average brightness maximum
    
    # Blur detection (Laplacian variance)
    BLUR_THRESHOLD = 100            # Lower = more blurry
    
    # Color cast detection
    COLOR_CAST_THRESHOLD = 15       # LAB a/b deviation from neutral
    
    # Quality score weights
    BLUR_PENALTY = 30
    GLARE_PENALTY = 20
    EXPOSURE_PENALTY = 25
    COLOR_CAST_PENALTY = 15


# ============================================================================
# BASE DETECTION SETTINGS
# ============================================================================

class BaseDetection:
    """Base removal configuration"""
    ALPHA_THRESHOLD = 50            # Background removal threshold
    MIN_REGULARITY = 0.3            # Geometric regularity of base shape
    BASE_EXPANSION = 20             # Pixels to expand base detection upward
    EXCLUSION_ZONE_TOP = 0.6        # Don't consider base colors above 60%
    
    # Base material color ranges (HSV)
    BASE_COLORS = {
        'stone_grey': [(0.0, 0.0, 0.3), (1.0, 0.3, 0.6)],
        'dirt_brown': [(0.05, 0.3, 0.2), (0.12, 0.7, 0.5)],
        'grass_green': [(0.25, 0.4, 0.2), (0.35, 0.9, 0.5)],
        'sand_tan': [(0.10, 0.2, 0.5), (0.15, 0.5, 0.8)],
        'black_base': [(0.0, 0.0, 0.0), (1.0, 0.3, 0.15)]
    }


# ============================================================================
# MATCHING CONFIGURATION
# ============================================================================

class Matching:
    """Color matching settings"""
    OWNED_SUBSTITUTE_DELTA_E = 6.0


# ============================================================================
# VISUALIZATION SETTINGS
# ============================================================================

class Visualization:
    """Reticle and overlay configuration"""
    RETICLE_COLOR = (0, 255, 100)   # RGB green
    RETICLE_RADIUS = 15
    RETICLE_GAP = 5
    RETICLE_LENGTH = 20
    BRACKET_SIZE = 25
    BRACKET_LENGTH = 8
    
    # Overlay settings
    GRAYSCALE_OPACITY = 0.4
    OVERLAY_OPACITY = 0.6
    GAUSSIAN_BLUR_KERNEL = 15
    GAUSSIAN_BLUR_SIGMA = 5
    
    # Styles
    STYLE_SOFT_GLOW = "soft_glow"
    STYLE_SEGMENTATION = "segmentation"
    STYLE_HEATMAP = "heatmap"


class Display:
    """Scanner display-cap rules — which detected colours the user sees.

    A vivid dropped card may reclaim a display slot from a dull DARK card of
    minor coverage (production: a shadow-artefact 'Brown' at 5.6% evicted the
    figure's vivid yellow beak). Genuine dark majors (black armour at 20-50%)
    sit above the coverage bound and are never displaced."""
    VIVID_MIN_CHROMA = 30.0        # LAB chroma above which a card is a real painted detail
    DULL_DARK_MAX_CHROMA = 15.0    # near-neutral ...
    DULL_DARK_MAX_L = 40.0         # ... and dark ...
    DULL_DARK_MAX_COVERAGE = 10.0  # ... at minor coverage may yield its slot


# ============================================================================
# SHADE TYPE DECISION RULES
# ============================================================================

class ShadeRules:
    """Rules for wash vs paint shade selection"""
    HIGH_TEXTURE_THRESHOLD = 45     # Brightness std for texture detection
    DARK_VALUE_THRESHOLD = 0.2      # Very dark colors get washes
    
    # Keywords that trigger wash usage
    WASH_KEYWORDS = [
        'skin', 'flesh', 'bone',
        'brown', 'tan', 'leather',
        'gold', 'brass', 'copper'
    ]


# ============================================================================
# AFFILIATE CONFIGURATION
# ============================================================================

class Affiliate:
    """Affiliate link configuration"""
    REGIONS = {
        "🇺🇸 USA": {"domain": "amazon.com", "tag": "schemestealer-20"},
        "🇬🇧 UK": {"domain": "amazon.co.uk", "tag": "schemestealer-21"},
        "🇪🇺 DE/EU": {"domain": "amazon.de", "tag": "schemestealer-21"},
        "🇨🇦 CA": {"domain": "amazon.ca", "tag": "schemestealer-20"},
        "🇦🇺 AU": {"domain": "amazon.com.au", "tag": "schemestealer-22"}
    }
    
    # The single source of truth for which brands the app supports: the six with
    # measured-swatch ground truth. Scale75 is dropped (no measured data) until
    # measured swatches exist for it. Scanners pass this list to the engine, and
    # recipe_builder.BRAND_KEYS mirrors it, so a brand is never offered without a
    # matchable, measured base.
    SUPPORTED_BRANDS = ["Citadel", "Vallejo", "Army Painter",
                        "AK", "Pro Acryl", "Two Thin Coats"]


# ============================================================================
# MOBILE OPTIMIZATION
# ============================================================================

class Mobile:
    """Mobile-specific settings"""
    MIN_TOUCH_TARGET = 44           # Minimum button size (px)
    MAX_IMAGE_UPLOAD_SIZE = 10      # MB
    COMPRESSED_IMAGE_WIDTH = 1200   # Max width for mobile uploads
    
    # Mobile UI flags
    SHOW_ADVANCED_OPTIONS = False   # Hide by default on mobile
    AUTO_COMPRESS_IMAGES = True


# ============================================================================
# LOGGING CONFIGURATION
# ============================================================================

class Logging:
    """Logging settings"""
    LEVEL = "INFO"                  # DEBUG, INFO, WARNING, ERROR
    FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_FILE = "schemestealer.log"
    MAX_BYTES = 10_000_000          # 10MB
    BACKUP_COUNT = 3


# ============================================================================
# WASH-TO-COLOR MAPPING SYSTEM
# ============================================================================

class WashMapping:
    """Family -> wash *archetype* -> each brand's real wash paint (Phase 3).

    A wash is never *detected* from a finished mini (it's contextual shading), so
    the wash slot is DERIVED from the detected base family, exactly like the
    highlight. The model has two layers:

      1. WASH_BY_FAMILY: detected family -> ordered list of canonical wash
         ARCHETYPES (flavours), most-appropriate first.
      2. BRAND_WASH_NAMES: archetype -> that brand's actual wash NAME present in
         paints_groundtruth.json.

    The resolution ladder lives in services/recipe_builder.get_wash_for_family and
    is guaranteed-fill (never None): brand's own wash -> brand's universal dark
    wash -> cross-brand universal (Citadel) -> name-only.
    """

    # Canonical wash archetypes (flavours). Every value below is one of these.
    ARCHETYPES = ('red', 'sepia', 'flesh', 'green', 'blue', 'violet', 'dark')

    # The universal "darkener" archetype every wash brand carries, and the brand
    # whose washes painters genuinely borrow across any base.
    UNIVERSAL_ARCHETYPE = 'dark'
    CROSS_BRAND_DONOR = 'Citadel'
    # Display-only fallback names if even the cross-brand lookup fails.
    UNIVERSAL_WASHES = ['Nuln Oil', 'Agrax Earthshade']

    # Detected family -> ordered wash archetypes. Covers EVERY family the
    # classifier emits (incl. cyan, magenta, bone, white and the three metals).
    WASH_BY_FAMILY = {
        # Reds / pinks / magentas -> crimson/red shade (violet as a soft backup)
        'red':     ['red', 'violet'],
        'pink':    ['red', 'violet'],
        'magenta': ['red', 'violet'],
        # Warm earths -> sepia/earth (Agrax/Seraphim/Strong Tone)
        'orange':  ['sepia', 'flesh'],
        'yellow':  ['sepia'],
        'brown':   ['sepia', 'dark'],
        'bone':    ['sepia', 'dark'],
        # Metals: gold/bronze -> warm earth; silver -> dark
        'gold':    ['sepia', 'flesh'],
        'bronze':  ['sepia', 'dark'],
        'silver':  ['dark'],
        # Greens -> green shade; cyan leans blue then green
        'green':   ['green', 'sepia'],
        'cyan':    ['blue', 'green'],
        # Cool -> blue/violet shade
        'blue':    ['blue', 'violet', 'dark'],
        'purple':  ['violet', 'blue'],
        # Neutrals -> dark/black (Nuln/Dark Tone)
        'grey':    ['dark'],
        'black':   ['dark'],
        'white':   ['dark'],
    }

    # archetype -> brand's ACTUAL wash name in paints_groundtruth.json.
    # Five brands carry washes; Pro Acryl has NO wash range, so it is absent here
    # and resolves entirely via the cross-brand fallback.
    BRAND_WASH_NAMES = {
        'Citadel': {
            'red': 'Carroburg Crimson', 'sepia': 'Agrax Earthshade',
            'flesh': 'Reikland Fleshshade', 'green': 'Biel-Tan Green',
            'blue': 'Drakenhof Nightshade', 'violet': 'Druchii Violet',
            'dark': 'Nuln Oil',
        },
        'Vallejo': {
            'red': 'Red', 'sepia': 'Sepia', 'flesh': 'Skin', 'green': 'Green',
            'blue': 'Blue', 'violet': 'Violet', 'dark': 'Black',
        },
        'Army Painter': {
            'red': 'Wash Red Tone', 'sepia': 'Wash Strong Tone',
            'flesh': 'Wash Strong Skin Shade', 'green': 'Wash Green Tone',
            'blue': 'Wash Blue Tone', 'violet': 'Wash Purple Tone',
            'dark': 'Wash Dark Tone',
        },
        'AK': {
            'red': 'Crimson Veil', 'sepia': 'Sepia Filth', 'flesh': 'Sepia Filth',
            'green': 'Green', 'blue': 'Blue Moon', 'violet': 'Invocation Purple',
            'dark': 'Black Night',
        },
        'Two Thin Coats': {
            'red': 'Hellion Red Wash', 'sepia': 'Archaic Sepia Wash',
            'flesh': 'Flesh Wash', 'green': 'Necrosis Green Wash',
            'blue': 'Tempest Blue Wash', 'violet': 'Magi Purple Wash',
            'dark': 'Oblivion Black Wash',
        },
    }

    @classmethod
    def archetypes_for_family(cls, family: str) -> list:
        """Ordered wash archetypes for a detected family. Unknown / achromatic
        families fall back to the universal dark wash so the slot is never empty."""
        fam = (family or '').lower().split('/')[0].strip()
        return cls.WASH_BY_FAMILY.get(fam, [cls.UNIVERSAL_ARCHETYPE])

    @classmethod
    def brand_wash_name(cls, brand: str, archetype: str):
        """That brand's real wash name for an archetype, or None if it has none."""
        return cls.BRAND_WASH_NAMES.get(brand, {}).get(archetype)

    @classmethod
    def get_recommended_wash(cls, family: str, brand: str) -> str:
        """Best-effort wash NAME for a family+brand (brand's own, else Citadel's).
        Kept for back-compat; the guaranteed-fill resolution that returns a real
        DB paint + provenance lives in recipe_builder.get_wash_for_family."""
        for arch in cls.archetypes_for_family(family) + [cls.UNIVERSAL_ARCHETYPE]:
            name = cls.brand_wash_name(brand, arch) or cls.brand_wash_name(cls.CROSS_BRAND_DONOR, arch)
            if name:
                return name
        return cls.UNIVERSAL_WASHES[0]