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
    """Color extraction thresholds"""
    MIN_MAJOR_COVERAGE = 5.0        # Minimum % for major colors
    MIN_DETAIL_COVERAGE = 0.5       # Minimum % for accent colors
    MAX_DETAIL_COVERAGE = 5.0       # Maximum % for accent colors
    N_CLUSTERS = 5                  # K-means cluster count
    DETAIL_SATURATION_MIN = 0.4     # Lowered to catch golds
    
    # Metallic detection
    METALLIC_BRIGHTNESS_STD = 50    # Brightness variation threshold
    METALLIC_SATURATION_MAX = 0.3   # Max saturation for metallics
    
    # Image processing
    RESIZE_WIDTH = 300              # Analysis resolution (performance)
    SATURATION_BOOST = 1.3          # Visualization boost factor


# ============================================================================
# COLOR FAMILY RANGES (for reference and debugging)
# ============================================================================

class ColorRanges:
    """
    HSV hue ranges for color families (in degrees, 0-360)
    Used for classification - helps avoid overlaps
    """
    RED = (330, 20)          # Wraps around 0
    ORANGE = (10, 35)
    BROWN = (15, 50)         # Overlaps with orange (low saturation distinguishes)
    YELLOW = (40, 75)
    GOLD = (40, 70)          # Same as yellow but high chroma
    GREEN = (55, 90)
    CYAN = (160, 195)        # Tightened to not catch blues
    BLUE = (180, 250)        # Broad range for various blues
    PURPLE = (250, 290)      # Distinct from pink
    MAGENTA = (280, 340)     # Red-violet range
    PINK = (330, 20)         # Similar to red but high value/saturation
    
    # Special cases
    WHITE = "v > 0.90, s < 0.12"
    GREY = "0.40 < v < 0.90, s < 0.12"
    BLACK = "v < 0.15"
    SILVER = "metallic + high value"
    GUNMETAL = "metallic + low value"


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
    BOTTOM_ZONE_START = 0.70        # Start looking for base at 70% height
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
    
    SUPPORTED_BRANDS = ["Citadel", "Vallejo", "Army Painter"]


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
    """Maps color families to appropriate washes for each brand"""

    # Primary wash recommendations by color family
    # Each family maps to a list of wash names (in order of preference)
    WASH_BY_FAMILY = {
        # Warm colors
        'red': ['Carroburg Crimson', 'Red Tone', 'Reikland Fleshshade'],
        'orange': ['Reikland Fleshshade', 'Seraphim Sepia', 'Soft Tone'],
        'yellow': ['Casandora Yellow', 'Seraphim Sepia', 'Soft Tone'],
        'brown': ['Agrax Earthshade', 'Seraphim Sepia', 'Strong Tone'],

        # Cool colors
        'green': ['Biel-Tan Green', 'Athonian Camoshade', 'Green Tone'],
        'cyan': ['Coelia Greenshade', 'Drakenhof Nightshade', 'Blue Tone'],
        'blue': ['Drakenhof Nightshade', 'Blue Tone', 'Nuln Oil'],
        'purple': ['Druchii Violet', 'Purple Tone', 'Drakenhof Nightshade'],
        'pink': ['Carroburg Crimson', 'Druchii Violet', 'Red Tone'],

        # Skin tones
        'flesh': ['Reikland Fleshshade', 'Flesh Wash', 'Soft Tone'],

        # Neutrals
        'black': ['Nuln Oil', 'Dark Tone', 'Nuln Oil Gloss'],
        'grey': ['Nuln Oil', 'Dark Tone', 'Agrax Earthshade'],
        'white': ['Nuln Oil', 'Agrax Earthshade', 'Seraphim Sepia'],

        # Metallics
        'gold': ['Reikland Fleshshade', 'Agrax Earthshade', 'Seraphim Sepia'],
        'silver': ['Nuln Oil', 'Dark Tone', 'Agrax Earthshade'],
        'bronze': ['Agrax Earthshade', 'Reikland Fleshshade', 'Strong Tone'],
        'copper': ['Agrax Earthshade', 'Reikland Fleshshade', 'Strong Tone'],

        # Special
        'bone': ['Seraphim Sepia', 'Agrax Earthshade', 'Soft Tone'],
    }

    # Brand-specific wash name mappings
    # Maps generic wash names to actual paint names for each brand
    BRAND_WASH_NAMES = {
        'Citadel': {
            'Carroburg Crimson': 'Carroburg Crimson',
            'Reikland Fleshshade': 'Reikland Fleshshade',
            'Casandora Yellow': 'Casandora Yellow',
            'Seraphim Sepia': 'Seraphim Sepia',
            'Agrax Earthshade': 'Agrax Earthshade',
            'Biel-Tan Green': 'Biel-Tan Green',
            'Athonian Camoshade': 'Athonian Camoshade',
            'Coelia Greenshade': 'Coelia Greenshade',
            'Drakenhof Nightshade': 'Drakenhof Nightshade',
            'Druchii Violet': 'Druchii Violet',
            'Nuln Oil': 'Nuln Oil',
            'Nuln Oil Gloss': 'Nuln Oil Gloss',
        },
        'Vallejo': {
            'Carroburg Crimson': 'Red Shade',
            'Reikland Fleshshade': 'Flesh Wash',
            'Casandora Yellow': 'Yellow Shade',
            'Seraphim Sepia': 'Sepia Shade',
            'Agrax Earthshade': 'Umber Shade',
            'Biel-Tan Green': 'Green Shade',
            'Athonian Camoshade': 'Green Shade',
            'Coelia Greenshade': 'Green Shade',
            'Drakenhof Nightshade': 'Blue Shade',
            'Druchii Violet': 'Violet Shade',
            'Nuln Oil': 'Black Shade',
            'Dark Tone': 'Black Shade',
            'Soft Tone': 'Sepia Shade',
            'Strong Tone': 'Umber Shade',
            'Blue Tone': 'Blue Shade',
            'Green Tone': 'Green Shade',
            'Red Tone': 'Red Shade',
            'Purple Tone': 'Violet Shade',
            'Flesh Wash': 'Flesh Wash',
        },
        'Army Painter': {
            'Carroburg Crimson': 'Red Tone',
            'Reikland Fleshshade': 'Flesh Wash',
            'Casandora Yellow': 'Soft Tone',
            'Seraphim Sepia': 'Soft Tone',
            'Agrax Earthshade': 'Strong Tone',
            'Biel-Tan Green': 'Green Tone',
            'Athonian Camoshade': 'Military Shader',
            'Coelia Greenshade': 'Green Tone',
            'Drakenhof Nightshade': 'Blue Tone',
            'Druchii Violet': 'Purple Tone',
            'Nuln Oil': 'Dark Tone',
            'Nuln Oil Gloss': 'Dark Tone',
            'Dark Tone': 'Dark Tone',
            'Soft Tone': 'Soft Tone',
            'Strong Tone': 'Strong Tone',
            'Blue Tone': 'Blue Tone',
            'Green Tone': 'Green Tone',
            'Red Tone': 'Red Tone',
            'Purple Tone': 'Purple Tone',
            'Flesh Wash': 'Flesh Wash',
        },
    }

    # Universal washes that work on almost anything
    UNIVERSAL_WASHES = ['Nuln Oil', 'Agrax Earthshade']

    @classmethod
    def get_washes_for_family(cls, family: str, limit: int = 3) -> list:
        """Get recommended wash names for a color family"""
        family_lower = family.lower()

        # Handle composite family names (e.g., "Gold/Brass", "Silver/Steel")
        for key in cls.WASH_BY_FAMILY.keys():
            if key in family_lower or family_lower in key:
                return cls.WASH_BY_FAMILY[key][:limit]

        # Fallback to universal washes
        return cls.UNIVERSAL_WASHES[:limit]

    @classmethod
    def get_wash_name_for_brand(cls, generic_name: str, brand: str) -> str:
        """Convert generic wash name to brand-specific name"""
        brand_map = cls.BRAND_WASH_NAMES.get(brand, {})
        return brand_map.get(generic_name, generic_name)

    @classmethod
    def get_recommended_wash(cls, family: str, brand: str) -> str:
        """Get the best wash recommendation for a color family and brand"""
        washes = cls.get_washes_for_family(family, limit=1)
        if washes:
            return cls.get_wash_name_for_brand(washes[0], brand)
        # Ultimate fallback
        return cls.get_wash_name_for_brand('Nuln Oil', brand)