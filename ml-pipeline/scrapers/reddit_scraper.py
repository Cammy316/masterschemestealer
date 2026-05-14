"""
Reddit Image Scraper for Miniature Painting Images
Collects high-quality images from painting subreddits

Run with: python scrapers/reddit_scraper.py
Requires: REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables
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
import os

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
            print(f"  Warning: Download failed: {e}")
            return None

    def _validate_image(self, image_data: bytes) -> bool:
        """Check image meets quality requirements"""
        try:
            img = Image.open(BytesIO(image_data))
            width, height = img.size

            if width < MIN_IMAGE_WIDTH or height < MIN_IMAGE_HEIGHT:
                return False

            # Check it's not a meme/screenshot (usually has text)
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
            "Balthasar Gold", "Screamer Pink", "Daemonette Hide", "Genestealer Purple",
            "Temple Guard Blue", "Sotek Green", "Lothern Blue", "Teclis Blue",
            "Kantor Blue", "Ultramarines Blue", "Thousand Sons Blue", "Ahriman Blue",
            "Mournfang Brown", "Rhinox Hide", "XV-88", "Zandri Dust", "Ushabti Bone",
            "Screaming Skull", "Pallid Wych Flesh", "Rakarth Flesh", "Kislev Flesh",
            "Cadian Fleshtone", "Yriel Yellow", "Flash Gitz Yellow",
            "Ironbreaker", "Stormhost Silver", "Runefang Steel",
            "Evil Sunz Scarlet", "Wild Rider Red", "Khorne Red",
            "Naggaroth Night", "Xereus Purple", "Druchii Violet",
            "Warpstone Glow", "Moot Green", "Warboss Green", "Skarsnik Green",
            "Castellan Green", "Loren Forest", "Biel-Tan Green",
            "Drakenhof Nightshade", "Carroburg Crimson", "Casandora Yellow",
            "Fuegan Orange", "Coelia Greenshade", "Seraphim Sepia",
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
        print(f"\n  Scraping r/{subreddit_name}...")
        subreddit = self.reddit.subreddit(subreddit_name)
        downloaded = 0

        try:
            # Get hot and top posts
            posts = list(subreddit.hot(limit=limit // 2))
            posts += list(subreddit.top(time_filter="month", limit=limit // 2))
        except Exception as e:
            print(f"    Error fetching posts: {e}")
            return 0

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
            print(f"    Downloaded: {filename} (score: {submission.score})")

            # Rate limiting
            time.sleep(0.5)

        print(f"    Downloaded {downloaded} new images from r/{subreddit_name}")
        return downloaded

    def scrape_all(self) -> int:
        """Scrape all configured subreddits"""
        total = 0
        for subreddit in REDDIT_SUBREDDITS:
            try:
                total += self.scrape_subreddit(subreddit)
            except Exception as e:
                print(f"    Error scraping r/{subreddit}: {e}")

        print(f"\n  Total new images: {total}")
        return total


def main():
    """Run Reddit scraper"""
    print("=" * 60)
    print("  SCHEMESTEALER - Reddit Image Scraper")
    print("=" * 60)

    # Get credentials from environment
    client_id = os.environ.get("REDDIT_CLIENT_ID")
    client_secret = os.environ.get("REDDIT_CLIENT_SECRET")

    if not client_id or not client_secret:
        print("\n  ERROR: Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET environment variables")
        print("         Get these from: https://www.reddit.com/prefs/apps")
        print("\n  On Windows:")
        print("    set REDDIT_CLIENT_ID=your_client_id")
        print("    set REDDIT_CLIENT_SECRET=your_client_secret")
        print("\n  On Linux/Mac:")
        print("    export REDDIT_CLIENT_ID=your_client_id")
        print("    export REDDIT_CLIENT_SECRET=your_client_secret")
        return

    scraper = RedditScraper(client_id, client_secret)
    scraper.scrape_all()

    print("\n  Reddit scraping complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
