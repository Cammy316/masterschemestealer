# 🧠 SCHEMESTEALER ML TRAINING PIPELINE
## Automated Image Scraping, Testing & Model Training

**Version:** 1.0.0  
**Created:** February 1, 2026  
**Purpose:** Dramatically improve colour detection accuracy through automated data collection and ML training

---

# 📊 THE PROBLEM

## Current State: Conditional Logic Limitations

Your current colour detection system uses HSV/LAB colour spaces with K-means clustering and Delta-E calculations. The conditional logic handles:

✅ **What works well:**
- Clear, saturated colours
- Standard paint schemes
- Good lighting conditions
- Primary colour identification

❌ **Where it struggles (the ~35% failure cases):**
- **Desaturated colours** (shaded blue armor appearing grey)
- **Zenithal highlights** (extreme light/dark gradients)
- **Weathering effects** (rust, verdigris, grime)
- **Metallic paints** (NMM vs TMM confusion)
- **Contrast/Speed paints** (unusual saturation profiles)
- **Camera variations** (phone cameras add colour casts)
- **Mixed lighting** (warm bulbs + daylight)
- **Shadow areas** (colours shift under shade washes)

## Target Accuracy Improvements

| Problem | Current | Target | ML Impact |
|---------|---------|--------|-----------|
| Colour Family Classification | ~65% | 90%+ | High |
| Paint Match Ranking | ~37% | 75%+ | Very High |
| Metallic Detection | ~80% | 95%+ | Medium |
| Shadow/Highlight Detection | ~60% | 85%+ | High |
| Desaturated Colour Recovery | ~40% | 80%+ | Very High |

---

# 🏗️ PIPELINE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ML TRAINING PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 1: DATA ACQUISITION                                           │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │   │
│  │  │ Reddit       │  │ Pinterest    │  │ Tutorial     │  │ User    │ │   │
│  │  │ Scraper      │  │ Scraper      │  │ Scraper      │  │ Feedback│ │   │
│  │  │              │  │              │  │ (BEST!)      │  │         │ │   │
│  │  │ r/minipainting│ │ "warhammer   │  │ Goonhammer   │  │ In-app  │ │   │
│  │  │ r/warhammer40k│ │  painting"   │  │ Warhammer    │  │ correct-│ │   │
│  │  │ r/killteam   │  │              │  │ Community    │  │ ions    │ │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────┬────┘ │   │
│  │         │                 │                 │                │      │   │
│  └─────────┼─────────────────┼─────────────────┼────────────────┼──────┘   │
│            │                 │                 │                │          │
│            └─────────────────┴────────┬────────┴────────────────┘          │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 2: IMAGE PROCESSING                                           │   │
│  │                                                                      │   │
│  │  1. Download images (deduplicate by hash)                           │   │
│  │  2. Quality filter (min 400x400, not blurry, good lighting)         │   │
│  │  3. Run through SchemeStealer API                                    │   │
│  │  4. Store: original image + detected colours + predictions          │   │
│  │  5. Flag low-confidence predictions for manual review               │   │
│  │                                                                      │   │
│  └─────────────────────────────────┬───────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 3: LABELLING (SEMI-AUTOMATED)                                 │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │ Option A: Tutorial-Sourced (HIGHEST VALUE)                    │   │   │
│  │  │ - Scrape tutorials WITH paint recipes in text                 │   │   │
│  │  │ - "I used Macragge Blue, Nuln Oil, Teclis Blue..."           │   │   │
│  │  │ - This IS the ground truth - no labelling needed!             │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │ Option B: Active Learning UI                                  │   │   │
│  │  │ - Model predicts → You verify/correct samples                 │   │   │
│  │  │ - Start with 200 manually verified                            │   │   │
│  │  │ - Prioritise UNCERTAIN predictions for labelling              │   │   │
│  │  │ - 10-20 labels per session, quick workflow                    │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────────┐   │   │
│  │  │ Option C: Clustering-Based                                    │   │   │
│  │  │ - Cluster similar colour patches                              │   │   │
│  │  │ - Label ONE per cluster                                       │   │   │
│  │  │ - Propagate labels to entire cluster                          │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  │                                                                      │   │
│  └─────────────────────────────────┬───────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ PHASE 4: MODEL TRAINING                                             │   │
│  │                                                                      │   │
│  │  Month 1-4: Random Forest (works with 500+ samples)                 │   │
│  │  Month 4-6: XGBoost (better with 2,000+ samples)                    │   │
│  │  Month 6+:  Neural Network (needs 10,000+ samples)                  │   │
│  │                                                                      │   │
│  │  Target: 90%+ colour family accuracy                                │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 📂 DIRECTORY STRUCTURE

```
ml-pipeline/
├── scrapers/
│   ├── reddit_scraper.py          # Scrape miniature images from Reddit
│   ├── pinterest_scraper.py       # Scrape from Pinterest boards
│   ├── tutorial_scraper.py        # Scrape tutorials with paint recipes (BEST)
│   ├── youtube_scraper.py         # Extract frames from painting tutorials
│   └── image_deduplicator.py      # Remove duplicate images by hash
│
├── processing/
│   ├── batch_processor.py         # Run images through SchemeStealer API
│   ├── quality_filter.py          # Filter out bad images
│   └── feature_extractor.py       # Extract ML features from results
│
├── labeller/
│   ├── app.py                     # Flask active learning UI
│   ├── templates/
│   │   └── label.html             # Labelling interface
│   └── static/
│       └── styles.css
│
├── training/
│   ├── prepare_dataset.py         # Clean and split data
│   ├── train_random_forest.py     # Train RF model
│   ├── train_xgboost.py           # Train XGBoost model
│   ├── evaluate_model.py          # Test and compare models
│   └── export_model.py            # Export for production
│
├── testing/
│   ├── accuracy_benchmark.py      # Run accuracy tests
│   ├── regression_tests.py        # Ensure no regressions
│   └── test_images/               # Known-good test cases
│
├── data/
│   ├── raw/                       # Downloaded images
│   │   ├── reddit/
│   │   ├── pinterest/
│   │   └── tutorials/
│   ├── processed/                 # Images run through API
│   ├── labelled/                  # Images with ground truth
│   ├── training/                  # Final training dataset
│   └── metadata/                  # Image metadata and sources
│
├── models/                        # Trained model files
│   ├── random_forest_v1.joblib
│   ├── xgboost_v1.joblib
│   └── model_metadata.json
│
├── config.py                      # Configuration settings
├── requirements.txt               # Python dependencies
└── README.md                      # Pipeline documentation
```

---

# 🕷️ SCRAPER SCRIPTS

## Configuration File

```python
# ml-pipeline/config.py
"""
Configuration for ML Training Pipeline
"""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
LABELLED_DIR = DATA_DIR / "labelled"
MODELS_DIR = BASE_DIR / "models"

# Create directories
for dir in [RAW_DIR, PROCESSED_DIR, LABELLED_DIR, MODELS_DIR]:
    dir.mkdir(parents=True, exist_ok=True)

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

# Labelling
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
```

---

## Reddit Scraper

```python
# ml-pipeline/scrapers/reddit_scraper.py
"""
Reddit Image Scraper for Miniature Painting Images
Collects high-quality images from painting subreddits
"""

import praw
import requests
import hashlib
import json
import time
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List
from PIL import Image
from io import BytesIO
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config import (
    REDDIT_SUBREDDITS, REDDIT_USER_AGENT, REDDIT_POSTS_PER_SUB,
    REDDIT_MIN_SCORE, RAW_DIR, MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT
)


class RedditScraper:
    """Scrape miniature painting images from Reddit"""
    
    def __init__(self, client_id: str, client_secret: str):
        """
        Initialize Reddit API connection.
        
        Get credentials at: https://www.reddit.com/prefs/apps
        Create a "script" type application
        """
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=REDDIT_USER_AGENT
        )
        self.output_dir = RAW_DIR / "reddit"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.metadata_file = self.output_dir / "metadata.json"
        self.seen_hashes = self._load_seen_hashes()
        
    def _load_seen_hashes(self) -> set:
        """Load previously downloaded image hashes to avoid duplicates"""
        hash_file = self.output_dir / "seen_hashes.txt"
        if hash_file.exists():
            return set(hash_file.read_text().strip().split("\n"))
        return set()
    
    def _save_seen_hash(self, img_hash: str):
        """Save hash to prevent re-downloading"""
        hash_file = self.output_dir / "seen_hashes.txt"
        with open(hash_file, "a") as f:
            f.write(f"{img_hash}\n")
        self.seen_hashes.add(img_hash)
    
    def _get_image_hash(self, image_data: bytes) -> str:
        """Generate hash of image content for deduplication"""
        return hashlib.md5(image_data).hexdigest()
    
    def _is_valid_image_url(self, url: str) -> bool:
        """Check if URL points to an image we can download"""
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        valid_domains = ['i.redd.it', 'i.imgur.com', 'preview.redd.it']
        
        url_lower = url.lower()
        has_valid_ext = any(ext in url_lower for ext in valid_extensions)
        has_valid_domain = any(domain in url_lower for domain in valid_domains)
        
        return has_valid_ext or has_valid_domain
    
    def _download_image(self, url: str) -> Optional[bytes]:
        """Download image from URL"""
        try:
            response = requests.get(url, timeout=30, headers={
                'User-Agent': REDDIT_USER_AGENT
            })
            response.raise_for_status()
            return response.content
        except Exception as e:
            print(f"  ⚠️ Download failed: {e}")
            return None
    
    def _validate_image(self, image_data: bytes) -> bool:
        """Check image meets quality requirements"""
        try:
            img = Image.open(BytesIO(image_data))
            width, height = img.size
            
            if width < MIN_IMAGE_WIDTH or height < MIN_IMAGE_HEIGHT:
                return False
            
            # Check it's not a meme/screenshot (usually has text)
            # This is a simple heuristic - could be improved
            if img.mode == 'P':  # Palette mode often indicates simple graphics
                return False
                
            return True
        except Exception:
            return False
    
    def _extract_metadata(self, submission) -> Dict:
        """Extract useful metadata from Reddit submission"""
        return {
            "source": "reddit",
            "subreddit": str(submission.subreddit),
            "post_id": submission.id,
            "title": submission.title,
            "author": str(submission.author) if submission.author else "[deleted]",
            "score": submission.score,
            "url": submission.url,
            "created_utc": submission.created_utc,
            "num_comments": submission.num_comments,
            "flair": submission.link_flair_text,
            "scraped_at": datetime.now().isoformat(),
        }
    
    def _extract_paint_mentions(self, text: str) -> List[str]:
        """
        Extract paint names mentioned in title/comments.
        This provides potential ground truth labels!
        """
        # Common paint name patterns
        citadel_paints = [
            "Mephiston Red", "Macragge Blue", "Caliban Green", "Averland Sunset",
            "Retributor Armour", "Leadbelcher", "Abaddon Black", "Corax White",
            "Nuln Oil", "Agrax Earthshade", "Reikland Fleshshade",
            # Add more from your paint database
        ]
        
        found = []
        text_lower = text.lower()
        
        for paint in citadel_paints:
            if paint.lower() in text_lower:
                found.append(paint)
        
        return found
    
    def scrape_subreddit(self, subreddit_name: str, limit: int = REDDIT_POSTS_PER_SUB) -> int:
        """
        Scrape images from a single subreddit.
        
        Returns number of new images downloaded.
        """
        print(f"\n📥 Scraping r/{subreddit_name}...")
        subreddit = self.reddit.subreddit(subreddit_name)
        downloaded = 0
        
        # Get hot and top posts
        posts = list(subreddit.hot(limit=limit // 2))
        posts += list(subreddit.top(time_filter="month", limit=limit // 2))
        
        for submission in posts:
            # Filter by score
            if submission.score < REDDIT_MIN_SCORE:
                continue
            
            # Check if image URL
            if not self._is_valid_image_url(submission.url):
                continue
            
            # Download image
            image_data = self._download_image(submission.url)
            if not image_data:
                continue
            
            # Check for duplicates
            img_hash = self._get_image_hash(image_data)
            if img_hash in self.seen_hashes:
                continue
            
            # Validate image quality
            if not self._validate_image(image_data):
                continue
            
            # Extract metadata
            metadata = self._extract_metadata(submission)
            
            # Look for paint mentions in title and comments
            all_text = submission.title + " "
            try:
                submission.comments.replace_more(limit=0)
                for comment in submission.comments[:10]:
                    all_text += comment.body + " "
            except Exception:
                pass
            
            metadata["paint_mentions"] = self._extract_paint_mentions(all_text)
            metadata["has_paint_info"] = len(metadata["paint_mentions"]) > 0
            
            # Save image
            filename = f"{subreddit_name}_{submission.id}.jpg"
            filepath = self.output_dir / filename
            
            with open(filepath, "wb") as f:
                f.write(image_data)
            
            # Save metadata
            metadata["local_filename"] = filename
            meta_file = self.output_dir / f"{subreddit_name}_{submission.id}.json"
            with open(meta_file, "w") as f:
                json.dump(metadata, f, indent=2)
            
            self._save_seen_hash(img_hash)
            downloaded += 1
            print(f"  ✓ Downloaded: {filename} (score: {submission.score})")
            
            # Rate limiting
            time.sleep(0.5)
        
        print(f"  Downloaded {downloaded} new images from r/{subreddit_name}")
        return downloaded
    
    def scrape_all(self) -> int:
        """Scrape all configured subreddits"""
        total = 0
        for subreddit in REDDIT_SUBREDDITS:
            try:
                total += self.scrape_subreddit(subreddit)
            except Exception as e:
                print(f"  ❌ Error scraping r/{subreddit}: {e}")
        
        print(f"\n✅ Total new images: {total}")
        return total


def main():
    """Run Reddit scraper"""
    import os
    
    # Get credentials from environment
    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")
    
    if not client_id or not client_secret:
        print("❌ Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables")
        print("   Get these from: https://www.reddit.com/prefs/apps")
        return
    
    scraper = RedditScraper(client_id, client_secret)
    scraper.scrape_all()


if __name__ == "__main__":
    main()
```

---

## Tutorial Scraper (HIGHEST VALUE!)

```python
# ml-pipeline/scrapers/tutorial_scraper.py
"""
Tutorial Scraper - Extracts images WITH paint recipes from painting guides.
This is the HIGHEST VALUE data source because we get ground truth labels!
"""

import requests
from bs4 import BeautifulSoup
import re
import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse
import time
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config import RAW_DIR, TUTORIAL_SOURCES


class TutorialScraper:
    """
    Scrapes painting tutorials that include paint recipes.
    The gold standard for training data!
    """
    
    def __init__(self):
        self.output_dir = RAW_DIR / "tutorials"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; SchemeStealer-Researcher/1.0)'
        })
        
        # Paint name patterns for extraction
        self.citadel_pattern = re.compile(
            r'\b(Mephiston|Macragge|Caliban|Averland|Retributor|Leadbelcher|'
            r'Abaddon|Corax|Nuln|Agrax|Reikland|Balthasar|Runelord|'
            r'Screamer|Daemonette|Genestealer|Temple Guard|Sotek|'
            r'Lothern|Alaitoc|Thousand Sons|Ahriman|Drakenhof|'
            r'Kantor|Ultramarines|Altdorf|Mournfang|Rhinox|'
            r'XV-88|Tau Light Ochre|Zandri|Ushabti|Screaming Skull|'
            r'Pallid Wych|Rakarth|Kislev|Cadian|Karak|Balor|'
            r'Yriel|Flash Gitz|Dorn|Ironbreaker|Stormhost|'
            r'Runefang|Gehenna|Troll Slayer|Fire Dragon|'
            r'Evil Sunz|Wild Rider|Jokaero|Word Bearers|'
            r'Wazdakka|Squig|Khorne|Mephiston|Blood Angels|'
            r'Phoenician|Gal Vorbak|Naggaroth|Xereus|Druchii|'
            r'Slaanesh|Warpfiend|Screamer Pink|Pink Horror|'
            r'Emperor\'s Children|Lugganath|Kabalite|Incubi|'
            r'Sybarite|Death Guard|Nurgle|Athonian|Biel-Tan|'
            r'Castellan|Loren|Warpstone|Moot|Warboss|'
            r'Skarsnik|Orruk|Waaagh|Barak-Nar|Skrag|'
            r'Plaguebearer|Ogryn|Militarum|Zandri|Tallarn|'
            r'Steel Legion|Tau Sept)\b'
            r'(\s+(Red|Blue|Green|Yellow|Orange|Brown|Black|White|Grey|Gray|'
            r'Gold|Silver|Bronze|Copper|Brass|Purple|Pink|Fleshshade|'
            r'Earthshade|Gloss|Contrast|Base|Layer|Shade|Edge|Technical|'
            r'Air|Dry))?',
            re.IGNORECASE
        )
        
        self.vallejo_pattern = re.compile(
            r'\bVallejo\s+(?:Model Color|Game Color|Model Air|Mecha Color)?\s*'
            r'[\d.]+\s*[\w\s]+',
            re.IGNORECASE
        )
        
        self.army_painter_pattern = re.compile(
            r'\bArmy\s+Painter\s+[\w\s]+',
            re.IGNORECASE
        )
    
    def _extract_paints(self, text: str) -> List[Dict]:
        """Extract all paint mentions from text"""
        paints = []
        
        # Find Citadel paints
        for match in self.citadel_pattern.finditer(text):
            paints.append({
                "brand": "Citadel",
                "name": match.group(0).strip(),
                "confidence": 0.9
            })
        
        # Find Vallejo paints
        for match in self.vallejo_pattern.finditer(text):
            paints.append({
                "brand": "Vallejo",
                "name": match.group(0).strip(),
                "confidence": 0.8
            })
        
        # Find Army Painter paints
        for match in self.army_painter_pattern.finditer(text):
            paints.append({
                "brand": "Army Painter",
                "name": match.group(0).strip(),
                "confidence": 0.8
            })
        
        # Deduplicate
        seen = set()
        unique_paints = []
        for paint in paints:
            key = f"{paint['brand']}:{paint['name'].lower()}"
            if key not in seen:
                seen.add(key)
                unique_paints.append(paint)
        
        return unique_paints
    
    def _extract_painting_steps(self, soup: BeautifulSoup) -> List[Dict]:
        """
        Extract step-by-step painting instructions with associated images.
        This is where the magic happens - we get image + paint associations!
        """
        steps = []
        
        # Look for numbered lists or step headers
        step_containers = soup.find_all(['ol', 'div', 'section'], 
            class_=re.compile(r'step|instruction|tutorial|guide', re.I))
        
        # Also look for "Step X:" patterns
        step_markers = soup.find_all(string=re.compile(r'Step\s*\d+', re.I))
        
        for marker in step_markers:
            parent = marker.find_parent(['div', 'p', 'li', 'section'])
            if not parent:
                continue
            
            # Get text content
            step_text = parent.get_text(separator=' ', strip=True)
            
            # Find associated image
            img = parent.find('img')
            if not img:
                # Look in sibling elements
                for sibling in parent.find_next_siblings():
                    img = sibling.find('img') if hasattr(sibling, 'find') else None
                    if img:
                        break
            
            # Extract paints mentioned
            paints = self._extract_paints(step_text)
            
            if paints:  # Only keep steps with paint info
                step = {
                    "text": step_text[:500],  # Truncate
                    "paints": paints,
                    "image_url": img.get('src') if img else None
                }
                steps.append(step)
        
        return steps
    
    def _download_tutorial_images(self, soup: BeautifulSoup, base_url: str, 
                                   tutorial_id: str) -> List[Dict]:
        """Download all relevant images from tutorial page"""
        downloaded = []
        
        # Find all images
        images = soup.find_all('img')
        
        for idx, img in enumerate(images):
            src = img.get('src') or img.get('data-src')
            if not src:
                continue
            
            # Make absolute URL
            full_url = urljoin(base_url, src)
            
            # Filter out icons, logos, etc.
            if any(x in full_url.lower() for x in ['logo', 'icon', 'avatar', 'sprite']):
                continue
            
            # Get alt text (often describes the image)
            alt = img.get('alt', '')
            
            try:
                response = self.session.get(full_url, timeout=30)
                response.raise_for_status()
                
                # Check size
                if len(response.content) < 10000:  # Skip tiny images
                    continue
                
                # Generate filename
                ext = Path(urlparse(full_url).path).suffix or '.jpg'
                filename = f"{tutorial_id}_{idx}{ext}"
                filepath = self.output_dir / filename
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                downloaded.append({
                    "filename": filename,
                    "url": full_url,
                    "alt_text": alt
                })
                
            except Exception as e:
                print(f"  ⚠️ Failed to download {full_url}: {e}")
        
        return downloaded
    
    def scrape_goonhammer(self) -> int:
        """
        Scrape Goonhammer's "How to Paint Everything" series.
        These are EXCELLENT - detailed paint lists with step photos!
        """
        print("\n📥 Scraping Goonhammer tutorials...")
        
        base_url = "https://www.goonhammer.com"
        index_url = f"{base_url}/how-to-paint-everything/"
        
        downloaded = 0
        
        try:
            # Get the index page
            response = self.session.get(index_url, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find tutorial links
            tutorial_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if '/how-to-paint-everything/' in href and href != index_url:
                    full_url = urljoin(base_url, href)
                    if full_url not in tutorial_links:
                        tutorial_links.append(full_url)
            
            print(f"  Found {len(tutorial_links)} tutorials")
            
            # Process each tutorial (limit for testing)
            for url in tutorial_links[:50]:  # Adjust limit as needed
                try:
                    print(f"  Processing: {url}")
                    
                    response = self.session.get(url, timeout=30)
                    response.raise_for_status()
                    soup = BeautifulSoup(response.text, 'html.parser')
                    
                    # Get article content
                    article = soup.find('article') or soup.find('main') or soup
                    
                    # Extract all text
                    text = article.get_text(separator=' ', strip=True)
                    
                    # Extract paints mentioned
                    paints = self._extract_paints(text)
                    
                    if not paints:
                        continue  # Skip if no paint info
                    
                    # Extract title
                    title = soup.find('h1')
                    title_text = title.get_text(strip=True) if title else "Unknown"
                    
                    # Generate tutorial ID
                    tutorial_id = hashlib.md5(url.encode()).hexdigest()[:12]
                    
                    # Download images
                    images = self._download_tutorial_images(soup, base_url, tutorial_id)
                    
                    if not images:
                        continue
                    
                    # Extract painting steps
                    steps = self._extract_painting_steps(soup)
                    
                    # Save metadata
                    metadata = {
                        "source": "goonhammer",
                        "url": url,
                        "title": title_text,
                        "paints": paints,
                        "steps": steps,
                        "images": images,
                        "scraped_at": datetime.now().isoformat(),
                        "has_ground_truth": True  # We have paint info!
                    }
                    
                    meta_file = self.output_dir / f"{tutorial_id}_meta.json"
                    with open(meta_file, 'w') as f:
                        json.dump(metadata, f, indent=2)
                    
                    downloaded += len(images)
                    print(f"    ✓ {len(images)} images, {len(paints)} paints found")
                    
                    time.sleep(1)  # Be respectful
                    
                except Exception as e:
                    print(f"    ❌ Error: {e}")
                    continue
        
        except Exception as e:
            print(f"  ❌ Failed to scrape index: {e}")
        
        return downloaded
    
    def scrape_warhammer_community(self) -> int:
        """
        Scrape Warhammer Community painting guides.
        Official source with excellent step-by-step photos!
        """
        print("\n📥 Scraping Warhammer Community tutorials...")
        
        # Note: Warhammer Community may require more sophisticated scraping
        # due to dynamic content loading. This is a basic implementation.
        
        base_url = "https://www.warhammer-community.com"
        # This URL structure may change - check the actual site
        search_url = f"{base_url}/en-gb/articles/?category=painting&page=1"
        
        downloaded = 0
        
        # Similar implementation to Goonhammer...
        # Add specific handling for Warhammer Community's page structure
        
        print("  ⚠️ Warhammer Community scraper needs site-specific implementation")
        return downloaded
    
    def scrape_all(self) -> int:
        """Run all tutorial scrapers"""
        total = 0
        total += self.scrape_goonhammer()
        total += self.scrape_warhammer_community()
        
        print(f"\n✅ Total tutorial images with paint data: {total}")
        return total


def main():
    scraper = TutorialScraper()
    scraper.scrape_all()


if __name__ == "__main__":
    main()
```

---

## Batch Processor (Run through SchemeStealer API)

```python
# ml-pipeline/processing/batch_processor.py
"""
Batch Process Images Through SchemeStealer API
Generates predictions for all scraped images
"""

import requests
import json
import time
from pathlib import Path
from typing import Dict, Optional, List
from datetime import datetime
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config import (
    RAW_DIR, PROCESSED_DIR, SCHEMESTEALER_API_URL, 
    SCHEMESTEALER_SCAN_ENDPOINT
)


class BatchProcessor:
    """Process scraped images through SchemeStealer API"""
    
    def __init__(self, api_url: str = SCHEMESTEALER_API_URL):
        self.api_url = api_url
        self.scan_endpoint = f"{api_url}{SCHEMESTEALER_SCAN_ENDPOINT}"
        self.processed_dir = PROCESSED_DIR
        self.processed_dir.mkdir(parents=True, exist_ok=True)
        self.results_file = self.processed_dir / "all_results.jsonl"
        
        # Track what we've already processed
        self.processed_hashes = self._load_processed()
    
    def _load_processed(self) -> set:
        """Load set of already processed image filenames"""
        processed_file = self.processed_dir / "processed_files.txt"
        if processed_file.exists():
            return set(processed_file.read_text().strip().split("\n"))
        return set()
    
    def _mark_processed(self, filename: str):
        """Mark a file as processed"""
        processed_file = self.processed_dir / "processed_files.txt"
        with open(processed_file, "a") as f:
            f.write(f"{filename}\n")
        self.processed_hashes.add(filename)
    
    def _check_api_health(self) -> bool:
        """Verify API is running"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def process_image(self, image_path: Path) -> Optional[Dict]:
        """
        Send single image to SchemeStealer API for analysis.
        Returns the full scan result.
        """
        if not image_path.exists():
            return None
        
        try:
            with open(image_path, "rb") as f:
                files = {"file": (image_path.name, f, "image/jpeg")}
                response = requests.post(
                    self.scan_endpoint,
                    files=files,
                    timeout=60  # Color detection can take a while
                )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"  ⚠️ API error {response.status_code}: {response.text[:100]}")
                return None
                
        except Exception as e:
            print(f"  ❌ Request failed: {e}")
            return None
    
    def process_directory(self, source_dir: Path, limit: Optional[int] = None) -> int:
        """
        Process all images in a directory.
        
        Args:
            source_dir: Directory containing images
            limit: Maximum images to process (for testing)
        
        Returns:
            Number of successfully processed images
        """
        # Check API is running
        if not self._check_api_health():
            print("❌ SchemeStealer API is not running!")
            print(f"   Start it with: cd python-api && uvicorn main:app --reload")
            return 0
        
        # Find all images
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        images = [
            f for f in source_dir.iterdir() 
            if f.suffix.lower() in image_extensions
        ]
        
        # Filter already processed
        images = [
            f for f in images 
            if f.name not in self.processed_hashes
        ]
        
        if limit:
            images = images[:limit]
        
        print(f"📊 Processing {len(images)} images from {source_dir.name}...")
        
        processed = 0
        
        for idx, image_path in enumerate(images):
            print(f"  [{idx+1}/{len(images)}] {image_path.name}...", end=" ")
            
            # Process through API
            result = self.process_image(image_path)
            
            if result:
                # Load associated metadata if exists
                meta_path = image_path.with_suffix('.json')
                metadata = {}
                if meta_path.exists():
                    with open(meta_path) as f:
                        metadata = json.load(f)
                
                # Combine result with metadata
                full_record = {
                    "filename": image_path.name,
                    "source_dir": source_dir.name,
                    "api_result": result,
                    "source_metadata": metadata,
                    "processed_at": datetime.now().isoformat(),
                }
                
                # Append to results file (JSONL format)
                with open(self.results_file, "a") as f:
                    f.write(json.dumps(full_record) + "\n")
                
                # Save individual result too
                result_path = self.processed_dir / f"{image_path.stem}_result.json"
                with open(result_path, "w") as f:
                    json.dump(full_record, f, indent=2)
                
                self._mark_processed(image_path.name)
                processed += 1
                print("✓")
            else:
                print("✗")
            
            # Small delay to not overwhelm the API
            time.sleep(0.5)
        
        return processed
    
    def process_all_sources(self, limit_per_source: Optional[int] = None) -> int:
        """Process images from all source directories"""
        total = 0
        
        for source_name in ['reddit', 'pinterest', 'tutorials']:
            source_dir = RAW_DIR / source_name
            if source_dir.exists():
                total += self.process_directory(source_dir, limit_per_source)
        
        print(f"\n✅ Total processed: {total} images")
        return total
    
    def get_processing_stats(self) -> Dict:
        """Get statistics about processed images"""
        stats = {
            "total_processed": len(self.processed_hashes),
            "by_source": {},
            "by_confidence": {"high": 0, "medium": 0, "low": 0},
            "colours_detected": 0,
        }
        
        if self.results_file.exists():
            with open(self.results_file) as f:
                for line in f:
                    record = json.loads(line)
                    
                    # Count by source
                    source = record.get("source_dir", "unknown")
                    stats["by_source"][source] = stats["by_source"].get(source, 0) + 1
                    
                    # Count colours
                    if "api_result" in record and "detectedColors" in record["api_result"]:
                        colours = record["api_result"]["detectedColors"]
                        stats["colours_detected"] += len(colours)
                        
                        # Categorise by confidence
                        for colour in colours:
                            conf = colour.get("confidence", 0)
                            if conf >= 0.8:
                                stats["by_confidence"]["high"] += 1
                            elif conf >= 0.5:
                                stats["by_confidence"]["medium"] += 1
                            else:
                                stats["by_confidence"]["low"] += 1
        
        return stats


def main():
    processor = BatchProcessor()
    
    print("🚀 SchemeStealer Batch Processor\n")
    
    # Check API
    if not processor._check_api_health():
        print("❌ API not running. Start it first!")
        return
    
    # Process all sources
    processor.process_all_sources(limit_per_source=100)  # Limit for testing
    
    # Show stats
    stats = processor.get_processing_stats()
    print(f"\n📊 Processing Statistics:")
    print(f"   Total processed: {stats['total_processed']}")
    print(f"   Total colours detected: {stats['colours_detected']}")
    print(f"   By source: {stats['by_source']}")
    print(f"   By confidence: {stats['by_confidence']}")


if __name__ == "__main__":
    main()
```

---

# 🏷️ ACTIVE LEARNING LABELLER

```python
# ml-pipeline/labeller/app.py
"""
Active Learning Labelling UI
A simple Flask app for manually labelling colour samples
Prioritises uncertain predictions to maximise learning
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
from pathlib import Path
from typing import Dict, List, Optional
import random
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config import PROCESSED_DIR, LABELLED_DIR, COLOUR_FAMILIES

app = Flask(__name__)

# Load all processed results
RESULTS_FILE = PROCESSED_DIR / "all_results.jsonl"
LABELS_FILE = LABELLED_DIR / "labels.jsonl"
LABELLED_DIR.mkdir(parents=True, exist_ok=True)


def load_labelled_ids() -> set:
    """Load IDs of already labelled samples"""
    labelled = set()
    if LABELS_FILE.exists():
        with open(LABELS_FILE) as f:
            for line in f:
                record = json.loads(line)
                labelled.add(record.get("sample_id"))
    return labelled


def get_samples_to_label(limit: int = 50) -> List[Dict]:
    """
    Get samples that need labelling.
    Prioritises LOW confidence predictions (active learning!)
    """
    if not RESULTS_FILE.exists():
        return []
    
    labelled_ids = load_labelled_ids()
    candidates = []
    
    with open(RESULTS_FILE) as f:
        for line in f:
            record = json.loads(line)
            filename = record.get("filename", "")
            
            if "api_result" not in record:
                continue
            
            colours = record["api_result"].get("detectedColors", [])
            
            for idx, colour in enumerate(colours):
                sample_id = f"{filename}_{idx}"
                
                if sample_id in labelled_ids:
                    continue
                
                confidence = colour.get("confidence", 0.5)
                
                candidates.append({
                    "sample_id": sample_id,
                    "filename": filename,
                    "colour_index": idx,
                    "colour": colour,
                    "confidence": confidence,
                    "source_metadata": record.get("source_metadata", {}),
                })
    
    # Sort by confidence (low first = most uncertain = most valuable to label)
    candidates.sort(key=lambda x: x["confidence"])
    
    return candidates[:limit]


@app.route("/")
def index():
    """Main labelling page"""
    samples = get_samples_to_label(50)
    labelled_count = len(load_labelled_ids())
    
    return render_template("label.html", 
        samples=samples,
        labelled_count=labelled_count,
        families=COLOUR_FAMILIES
    )


@app.route("/api/label", methods=["POST"])
def submit_label():
    """Submit a label for a sample"""
    data = request.json
    
    sample_id = data.get("sample_id")
    correct_family = data.get("correct_family")
    is_correct = data.get("is_correct", False)
    notes = data.get("notes", "")
    
    if not sample_id or (not is_correct and not correct_family):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Save label
    label_record = {
        "sample_id": sample_id,
        "is_correct": is_correct,
        "predicted_family": data.get("predicted_family"),
        "correct_family": correct_family if not is_correct else data.get("predicted_family"),
        "notes": notes,
        "labelled_at": datetime.now().isoformat(),
    }
    
    with open(LABELS_FILE, "a") as f:
        f.write(json.dumps(label_record) + "\n")
    
    return jsonify({"success": True})


@app.route("/api/stats")
def get_stats():
    """Get labelling statistics"""
    labels = []
    if LABELS_FILE.exists():
        with open(LABELS_FILE) as f:
            labels = [json.loads(line) for line in f]
    
    correct = sum(1 for l in labels if l.get("is_correct"))
    total = len(labels)
    
    family_counts = {}
    for label in labels:
        fam = label.get("correct_family", "Unknown")
        family_counts[fam] = family_counts.get(fam, 0) + 1
    
    return jsonify({
        "total_labelled": total,
        "correct_predictions": correct,
        "accuracy": correct / total if total > 0 else 0,
        "by_family": family_counts,
    })


# HTML Template (inline for simplicity)
LABEL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>SchemeStealer - Colour Labeller</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
            background: #1a1a2e;
            color: #ffd700;
        }
        h1 { color: #ffd700; }
        .stats { 
            background: #16213e; 
            padding: 15px; 
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .sample { 
            background: #0f3460; 
            padding: 20px; 
            margin: 10px 0; 
            border-radius: 8px;
            display: flex;
            gap: 20px;
            align-items: center;
        }
        .colour-swatch {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            border: 2px solid #ffd700;
        }
        .sample-info { flex: 1; }
        .actions { display: flex; gap: 10px; }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .correct { background: #4caf50; color: white; }
        .wrong { background: #f44336; color: white; }
        select {
            padding: 10px;
            border-radius: 4px;
            font-size: 14px;
        }
        .confidence { 
            font-size: 12px; 
            color: #888; 
        }
        .low-conf { color: #f44336; }
        .high-conf { color: #4caf50; }
    </style>
</head>
<body>
    <h1>⚔️ SchemeStealer Colour Labeller</h1>
    
    <div class="stats">
        <strong>Labelled:</strong> {{ labelled_count }} samples |
        <a href="/api/stats" target="_blank">View Stats</a>
    </div>
    
    <p>Review predictions below. Click ✓ if correct, or select the correct family if wrong.</p>
    
    {% for sample in samples %}
    <div class="sample" id="sample-{{ sample.sample_id }}">
        <div class="colour-swatch" style="background-color: {{ sample.colour.hex }}"></div>
        
        <div class="sample-info">
            <strong>{{ sample.colour.hex }}</strong><br>
            Predicted: <strong>{{ sample.colour.family }}</strong><br>
            <span class="confidence {% if sample.confidence < 0.5 %}low-conf{% elif sample.confidence > 0.8 %}high-conf{% endif %}">
                Confidence: {{ "%.1f"|format(sample.confidence * 100) }}%
            </span><br>
            <small>{{ sample.filename }}</small>
        </div>
        
        <div class="actions">
            <button class="correct" onclick="labelCorrect('{{ sample.sample_id }}', '{{ sample.colour.family }}')">
                ✓ Correct
            </button>
            
            <select id="family-{{ sample.sample_id }}">
                <option value="">Select correct family...</option>
                {% for family in families %}
                <option value="{{ family }}">{{ family }}</option>
                {% endfor %}
            </select>
            
            <button class="wrong" onclick="labelWrong('{{ sample.sample_id }}', '{{ sample.colour.family }}')">
                ✗ Wrong
            </button>
        </div>
    </div>
    {% endfor %}
    
    <script>
        function labelCorrect(sampleId, predictedFamily) {
            fetch('/api/label', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sample_id: sampleId,
                    is_correct: true,
                    predicted_family: predictedFamily
                })
            }).then(() => {
                document.getElementById('sample-' + sampleId).style.opacity = '0.3';
            });
        }
        
        function labelWrong(sampleId, predictedFamily) {
            const select = document.getElementById('family-' + sampleId);
            const correctFamily = select.value;
            
            if (!correctFamily) {
                alert('Please select the correct family first');
                return;
            }
            
            fetch('/api/label', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sample_id: sampleId,
                    is_correct: false,
                    predicted_family: predictedFamily,
                    correct_family: correctFamily
                })
            }).then(() => {
                document.getElementById('sample-' + sampleId).style.opacity = '0.3';
            });
        }
    </script>
</body>
</html>
"""

# Create template file
@app.before_request
def setup():
    template_dir = Path(__file__).parent / "templates"
    template_dir.mkdir(exist_ok=True)
    template_file = template_dir / "label.html"
    if not template_file.exists():
        template_file.write_text(LABEL_TEMPLATE)


from datetime import datetime

if __name__ == "__main__":
    print("🏷️ Starting Active Learning Labeller...")
    print("   Open http://localhost:5001 in your browser")
    app.run(port=5001, debug=True)
```

---

# 🧪 MODEL TRAINING

```python
# ml-pipeline/training/train_random_forest.py
"""
Train Random Forest Model for Colour Classification
First ML model in the progression
"""

import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import joblib
from pathlib import Path
from datetime import datetime
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config import PROCESSED_DIR, LABELLED_DIR, MODELS_DIR, TRAIN_TEST_SPLIT, RANDOM_SEED


def load_training_data() -> pd.DataFrame:
    """
    Load and combine:
    1. API predictions
    2. Human labels (corrections)
    3. Tutorial data (ground truth from paint mentions)
    """
    records = []
    
    # Load API results
    results_file = PROCESSED_DIR / "all_results.jsonl"
    if results_file.exists():
        with open(results_file) as f:
            for line in f:
                data = json.loads(line)
                filename = data.get("filename", "")
                
                if "api_result" not in data:
                    continue
                
                colours = data["api_result"].get("detectedColors", [])
                
                for idx, colour in enumerate(colours):
                    sample_id = f"{filename}_{idx}"
                    
                    # Extract features
                    rgb = colour.get("rgb", [0, 0, 0])
                    hsv = colour.get("hsv", [0, 0, 0])
                    lab = colour.get("lab", [0, 0, 0])
                    
                    records.append({
                        "sample_id": sample_id,
                        "r": rgb[0] if len(rgb) > 0 else 0,
                        "g": rgb[1] if len(rgb) > 1 else 0,
                        "b": rgb[2] if len(rgb) > 2 else 0,
                        "h": hsv[0] if len(hsv) > 0 else 0,
                        "s": hsv[1] if len(hsv) > 1 else 0,
                        "v": hsv[2] if len(hsv) > 2 else 0,
                        "l": lab[0] if len(lab) > 0 else 0,
                        "a": lab[1] if len(lab) > 1 else 0,
                        "b_lab": lab[2] if len(lab) > 2 else 0,
                        "coverage": colour.get("percentage", 0),
                        "predicted_family": colour.get("family", "Unknown"),
                        "confidence": colour.get("confidence", 0.5),
                        "is_metallic": colour.get("isMetallic", False),
                    })
    
    df = pd.DataFrame(records)
    
    # Load human labels
    labels_file = LABELLED_DIR / "labels.jsonl"
    if labels_file.exists():
        labels = {}
        with open(labels_file) as f:
            for line in f:
                label = json.loads(line)
                labels[label["sample_id"]] = label.get("correct_family", label.get("predicted_family"))
        
        # Apply corrections
        df["true_family"] = df.apply(
            lambda row: labels.get(row["sample_id"], row["predicted_family"]),
            axis=1
        )
    else:
        # Use predictions as labels (will be noisy!)
        df["true_family"] = df["predicted_family"]
    
    return df


def train_model(df: pd.DataFrame) -> dict:
    """Train Random Forest and evaluate"""
    
    print(f"📊 Dataset size: {len(df)} samples")
    print(f"   Classes: {df['true_family'].nunique()}")
    print(f"   Class distribution:\n{df['true_family'].value_counts()}")
    
    # Features
    feature_cols = ["r", "g", "b", "h", "s", "v", "l", "a", "b_lab", "coverage"]
    X = df[feature_cols].values
    y = df["true_family"].values
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TRAIN_TEST_SPLIT, random_state=RANDOM_SEED, stratify=y
    )
    
    print(f"\n🔧 Training on {len(X_train)} samples...")
    
    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight="balanced",  # Handle class imbalance
        random_state=RANDOM_SEED,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = (y_pred == y_test).mean()
    
    print(f"\n📈 Results:")
    print(f"   Accuracy: {accuracy:.2%}")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"   CV Score: {cv_scores.mean():.2%} (+/- {cv_scores.std()*2:.2%})")
    
    print(f"\n📊 Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Feature importance
    importance = pd.DataFrame({
        "feature": feature_cols,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)
    
    print(f"\n🎯 Feature Importance:")
    print(importance.to_string(index=False))
    
    # Save model
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_path = MODELS_DIR / f"random_forest_{timestamp}.joblib"
    joblib.dump(model, model_path)
    
    # Save metadata
    metadata = {
        "model_type": "RandomForestClassifier",
        "timestamp": timestamp,
        "accuracy": float(accuracy),
        "cv_score": float(cv_scores.mean()),
        "cv_std": float(cv_scores.std()),
        "n_samples": len(df),
        "n_features": len(feature_cols),
        "feature_names": feature_cols,
        "classes": list(model.classes_),
        "model_path": str(model_path),
    }
    
    meta_path = MODELS_DIR / "latest_model.json"
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)
    
    print(f"\n✅ Model saved: {model_path}")
    
    return metadata


def main():
    print("🚀 SchemeStealer ML Training Pipeline\n")
    
    # Load data
    df = load_training_data()
    
    if len(df) < 100:
        print(f"⚠️ Only {len(df)} samples. Need at least 100 for training.")
        print("   Run scrapers and batch processor first!")
        return
    
    # Train
    metadata = train_model(df)
    
    print(f"\n🎉 Training complete!")
    print(f"   Accuracy: {metadata['accuracy']:.2%}")
    print(f"   Model: {metadata['model_path']}")


if __name__ == "__main__":
    main()
```

---

# 📋 USAGE GUIDE

## Quick Start

### 1. Set Up Environment

```bash
# Create ML pipeline directory
mkdir -p ml-pipeline
cd ml-pipeline

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install praw requests beautifulsoup4 pillow pandas scikit-learn flask joblib
```

### 2. Configure Reddit API

```bash
# Get credentials from https://www.reddit.com/prefs/apps
export REDDIT_CLIENT_ID="your_client_id"
export REDDIT_CLIENT_SECRET="your_client_secret"
```

### 3. Run Scrapers

```bash
# Scrape Reddit images
python scrapers/reddit_scraper.py

# Scrape tutorials (highest value!)
python scrapers/tutorial_scraper.py
```

### 4. Process Through API

```bash
# Make sure SchemeStealer API is running
cd ../python-api
uvicorn main:app --reload &

# Process scraped images
cd ../ml-pipeline
python processing/batch_processor.py
```

### 5. Label Samples (Semi-Automated)

```bash
# Start labelling UI
python labeller/app.py

# Open http://localhost:5001 in browser
# Label ~200 samples focusing on low-confidence predictions
```

### 6. Train Model

```bash
# Train Random Forest
python training/train_random_forest.py

# Model saved to models/random_forest_YYYYMMDD_HHMMSS.joblib
```

### 7. Deploy Model

Copy the model file to your python-api:

```bash
cp models/random_forest_*.joblib ../python-api/models/
```

Then integrate with your colour classification code.

---

## Recommended Workflow

| Week | Activity | Expected Output |
|------|----------|-----------------|
| 1 | Run Reddit scraper daily | 500+ images |
| 1 | Run tutorial scraper | 200+ images with paint info |
| 2 | Process all through API | 700+ processed |
| 2 | Label 100 low-confidence samples | 100 labelled |
| 3 | Continue scraping + processing | 1,500+ total |
| 3 | Label 100 more samples | 200 labelled |
| 4 | Train first Random Forest | ~75% accuracy |
| 4-8 | Continue data collection | 3,000+ samples |
| 8 | Train XGBoost model | ~85% accuracy |

---

## Key Insights

### Why Tutorial Scraping is Best

Tutorials from Goonhammer, Warhammer Community, and YouTube often include:

- "Step 1: Base coat with Macragge Blue"
- "Step 2: Shade with Nuln Oil"
- "Step 3: Layer with Caledor Sky"

This text IS your ground truth labels! No manual labelling needed.

### Active Learning Strategy

The labeller prioritises low-confidence predictions because:

- These are where the model is most uncertain
- Labelling these gives maximum information gain
- High-confidence predictions are likely already correct

### Data Quality > Quantity

- 200 well-labelled samples beats 2,000 noisy ones
- Focus on diverse, high-quality images
- Tutorial images > random Reddit posts

---

**Document Version:** 1.0.0  
**Last Updated:** February 1, 2026  

*"The data you collect today trains the Machine Spirit of tomorrow."*

**Ave Imperator! ⚔️🧠**
