"""
Configuration for ML Training Pipeline
SchemeStealer - Colour Detection ML Training
"""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
LABELLED_DIR = DATA_DIR / "labelled"
TRAINING_DIR = DATA_DIR / "training"
MODELS_DIR = BASE_DIR / "models"

# Create directories
for dir in [RAW_DIR, PROCESSED_DIR, LABELLED_DIR, TRAINING_DIR, MODELS_DIR]:
    dir.mkdir(parents=True, exist_ok=True)

# Create source directories
for source in ["reddit", "pinterest", "tutorials"]:
    (RAW_DIR / source).mkdir(parents=True, exist_ok=True)

# API Configuration
SCHEMESTEALER_API_URL = "http://localhost:8000"
SCHEMESTEALER_SCAN_ENDPOINT = "/api/scan/miniature"

# Scraping Configuration
REDDIT_SUBREDDITS = [
    "minipainting",
    "Warhammer40k",
    "killteam",
    "ageofsigmar",
    "WarhammerCompetitive",
    "TheAstraMilitarum",
    "SpaceMarines",
]

REDDIT_USER_AGENT = "SchemeStealer-DataCollector/1.0"
REDDIT_POSTS_PER_SUB = 100  # Per scraping session
REDDIT_MIN_SCORE = 10       # Filter low-quality posts

PINTEREST_SEARCH_TERMS = [
    "warhammer 40k painted miniatures",
    "space marine paint scheme",
    "miniature painting tutorial",
    "citadel paint scheme",
    "vallejo miniature painting",
]

TUTORIAL_SOURCES = [
    {
        "name": "Goonhammer",
        "base_url": "https://www.goonhammer.com",
        "paint_guides_path": "/how-to-paint-everything/",
    },
    {
        "name": "Warhammer Community",
        "base_url": "https://www.warhammer-community.com",
        "paint_guides_path": "/en-gb/articles/?category=painting",
    },
]

# Image Quality Thresholds
MIN_IMAGE_WIDTH = 400
MIN_IMAGE_HEIGHT = 400
MAX_IMAGE_SIZE_MB = 10
BLUR_THRESHOLD = 100  # Laplacian variance

# Colour Families for Labelling
COLOUR_FAMILIES = [
    "Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Pink",
    "Brown", "Tan", "Bone", "Flesh",
    "Grey", "Black", "White",
    "Silver", "Gold", "Bronze", "Copper",
]

# Training
TRAIN_TEST_SPLIT = 0.2
RANDOM_SEED = 42
MIN_SAMPLES_PER_CLASS = 20
