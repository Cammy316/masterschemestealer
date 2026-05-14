"""
Tutorial Scraper - Extracts images WITH paint recipes from painting guides.
This is the HIGHEST VALUE data source because we get ground truth labels!

Run with: python scrapers/tutorial_scraper.py

Scrapes:
- Goonhammer "How to Paint Everything" series
- Warhammer Community painting guides
"""

import requests
from bs4 import BeautifulSoup
import re
import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })

        # Track seen URLs to avoid duplicates
        self.seen_urls_file = self.output_dir / "seen_urls.txt"
        self.seen_urls = self._load_seen_urls()

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
            r'Wazdakka|Squig|Khorne|Blood Angels|'
            r'Phoenician|Gal Vorbak|Naggaroth|Xereus|Druchii|'
            r'Slaanesh|Warpfiend|Screamer Pink|Pink Horror|'
            r"Emperor's Children|Lugganath|Kabalite|Incubi|"
            r'Sybarite|Death Guard|Nurgle|Athonian|Biel-Tan|'
            r'Castellan|Loren|Warpstone|Moot|Warboss|'
            r'Skarsnik|Orruk|Waaagh|Barak-Nar|Skrag|'
            r'Plaguebearer|Ogryn|Militarum|Tallarn|'
            r'Steel Legion|Tau Sept|Teclis|Caledor|Hoeth|'
            r'Fenrisian|Russ|Fang|Space Wolves|Celestra|Ulthuan|'
            r'White Scar|Pallid|Wraithbone|Grey Seer|Contrast|'
            r'Black Templar|Cygor Brown|Gore-Grunta|Guilliman|'
            r'Talassar|Terradon|Volupus|Magos|Skeleton Horde|'
            r'Snakebite|Nazdreg|Iyanden|Gryph-Hound|Apothecary|'
            r'Militarum|Aggaros|Wyldwood|Fyreslayer|Blood Angels|'
            r'Dark Angels|Ultramarine|Imperial Fist|Salamander)'
            r'(\s+(Red|Blue|Green|Yellow|Orange|Brown|Black|White|Grey|Gray|'
            r'Gold|Silver|Bronze|Copper|Brass|Purple|Pink|Fleshshade|'
            r'Earthshade|Gloss|Contrast|Base|Layer|Shade|Edge|Technical|'
            r'Air|Dry|Flesh))?',
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

    def _load_seen_urls(self) -> set:
        """Load previously processed URLs"""
        if self.seen_urls_file.exists():
            return set(self.seen_urls_file.read_text().strip().split("\n"))
        return set()

    def _mark_url_seen(self, url: str):
        """Mark URL as processed"""
        with open(self.seen_urls_file, "a") as f:
            f.write(f"{url}\n")
        self.seen_urls.add(url)

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

        # Look for "Step X:" patterns
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
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if not src:
                continue

            # Make absolute URL
            full_url = urljoin(base_url, src)

            # Filter out icons, logos, etc.
            skip_patterns = ['logo', 'icon', 'avatar', 'sprite', 'banner', 'ad-',
                             'widget', 'social', 'share', 'button', 'loading',
                             'placeholder', 'pixel', '1x1', 'tracking']
            if any(x in full_url.lower() for x in skip_patterns):
                continue

            # Get alt text (often describes the image)
            alt = img.get('alt', '')

            try:
                response = self.session.get(full_url, timeout=30)
                response.raise_for_status()

                # Check content type
                content_type = response.headers.get('content-type', '')
                if 'image' not in content_type:
                    continue

                # Check size (skip tiny images)
                if len(response.content) < 10000:  # Skip images < 10KB
                    continue

                # Generate filename
                ext = Path(urlparse(full_url).path).suffix or '.jpg'
                if ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                    ext = '.jpg'
                filename = f"{tutorial_id}_{idx}{ext}"
                filepath = self.output_dir / filename

                with open(filepath, 'wb') as f:
                    f.write(response.content)

                downloaded.append({
                    "filename": filename,
                    "url": full_url,
                    "alt_text": alt
                })

                time.sleep(0.2)  # Small delay between image downloads

            except Exception as e:
                # Silently skip failed downloads
                pass

        return downloaded

    def scrape_goonhammer(self, limit: int = 50) -> int:
        """
        Scrape Goonhammer's "How to Paint Everything" series.
        These are EXCELLENT - detailed paint lists with step photos!
        """
        print("\n  Scraping Goonhammer tutorials...")

        base_url = "https://www.goonhammer.com"
        index_url = f"{base_url}/how-to-paint-everything/"

        downloaded = 0

        try:
            # Get the index page
            response = self.session.get(index_url, timeout=30)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find tutorial links - look for actual article links
            tutorial_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                # Must be a Goonhammer URL with how-to-paint in the path
                if not href.startswith('https://www.goonhammer.com/how-to-paint'):
                    continue
                # Skip the index page and category pages
                if href == index_url or '/category/' in href:
                    continue
                # Skip external links
                if 'patreon' in href.lower() or 'twitter' in href.lower():
                    continue
                # Skip if already processed
                if href in self.seen_urls:
                    continue
                if href not in tutorial_links:
                    tutorial_links.append(href)

            # Deduplicate
            tutorial_links = list(set(tutorial_links))

            print(f"    Found {len(tutorial_links)} new tutorials")

            # Process each tutorial
            for url in tutorial_links[:limit]:
                try:
                    print(f"    Processing: {url[:60]}...")

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
                        self._mark_url_seen(url)
                        continue  # Skip if no paint info

                    # Extract title
                    title = soup.find('h1')
                    title_text = title.get_text(strip=True) if title else "Unknown"

                    # Generate tutorial ID
                    tutorial_id = hashlib.md5(url.encode()).hexdigest()[:12]

                    # Download images
                    images = self._download_tutorial_images(soup, base_url, tutorial_id)

                    if not images:
                        self._mark_url_seen(url)
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

                    self._mark_url_seen(url)
                    downloaded += len(images)
                    print(f"      -> {len(images)} images, {len(paints)} paints found")

                    time.sleep(1)  # Be respectful

                except Exception as e:
                    print(f"      Error: {e}")
                    continue

        except Exception as e:
            print(f"    Failed to scrape index: {e}")

        return downloaded

    def scrape_warhammer_community(self, limit: int = 30) -> int:
        """
        Scrape Warhammer Community painting guides.
        Official source with excellent step-by-step photos!
        """
        print("\n  Scraping Warhammer Community tutorials...")

        # Note: Warhammer Community uses JavaScript heavily
        # This basic implementation may need enhancement with Selenium/Playwright
        base_url = "https://www.warhammer-community.com"

        downloaded = 0

        # Try a few known painting article patterns
        paint_urls = [
            "/en-gb/articles/?category=painting",
            "/en-gb/articles/?category=hobby",
        ]

        for path in paint_urls:
            try:
                search_url = f"{base_url}{path}"
                response = self.session.get(search_url, timeout=30)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                # Find article links
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    if '/articles/' in href and href not in self.seen_urls:
                        full_url = urljoin(base_url, href)
                        if downloaded >= limit:
                            break

                        try:
                            article_resp = self.session.get(full_url, timeout=30)
                            article_soup = BeautifulSoup(article_resp.text, 'html.parser')

                            text = article_soup.get_text(separator=' ', strip=True)
                            paints = self._extract_paints(text)

                            if paints:
                                tutorial_id = hashlib.md5(full_url.encode()).hexdigest()[:12]
                                images = self._download_tutorial_images(article_soup, base_url, tutorial_id)

                                if images:
                                    title = article_soup.find('h1')
                                    title_text = title.get_text(strip=True) if title else "Unknown"

                                    metadata = {
                                        "source": "warhammer_community",
                                        "url": full_url,
                                        "title": title_text,
                                        "paints": paints,
                                        "images": images,
                                        "scraped_at": datetime.now().isoformat(),
                                        "has_ground_truth": True
                                    }

                                    meta_file = self.output_dir / f"{tutorial_id}_meta.json"
                                    with open(meta_file, 'w') as f:
                                        json.dump(metadata, f, indent=2)

                                    self._mark_url_seen(full_url)
                                    downloaded += len(images)
                                    print(f"    -> {len(images)} images from {title_text[:40]}...")

                            time.sleep(1)

                        except Exception:
                            continue

            except Exception as e:
                print(f"    Warning: Could not access {path}: {e}")

        print(f"    Note: Warhammer Community may require JavaScript rendering for full access")
        return downloaded

    def scrape_all(self) -> int:
        """Run all tutorial scrapers"""
        total = 0
        total += self.scrape_goonhammer()
        total += self.scrape_warhammer_community()

        print(f"\n  Total tutorial images with paint data: {total}")
        return total


def main():
    print("=" * 60)
    print("  SCHEMESTEALER - Tutorial Image Scraper")
    print("  HIGHEST VALUE DATA SOURCE - Includes paint recipes!")
    print("=" * 60)

    scraper = TutorialScraper()
    scraper.scrape_all()

    print("\n  Tutorial scraping complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
