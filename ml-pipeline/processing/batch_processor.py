"""
Batch Process Images Through SchemeStealer API
Generates predictions for all scraped images

Run with: python processing/batch_processor.py

Requires: SchemeStealer API running at localhost:8000
Start API with: cd python-api && uvicorn main:app --reload
"""

import requests
import json
import time
from pathlib import Path
from typing import Dict, Optional, List
from datetime import datetime
import sys
from tqdm import tqdm

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
        self.processed_files = self._load_processed()

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
        self.processed_files.add(filename)

    def _check_api_health(self) -> bool:
        """Verify API is running"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=5)
            return response.status_code == 200
        except Exception:
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
                    timeout=120  # Colour detection can take a while
                )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"    API error {response.status_code}: {response.text[:100]}")
                return None

        except requests.exceptions.Timeout:
            print(f"    Timeout processing {image_path.name}")
            return None
        except Exception as e:
            print(f"    Request failed: {e}")
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
            print("    ERROR: SchemeStealer API is not running!")
            print(f"           Start it with: cd python-api && uvicorn main:app --reload")
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
            if f.name not in self.processed_files
        ]

        if limit:
            images = images[:limit]

        if not images:
            print(f"    No new images to process in {source_dir.name}")
            return 0

        print(f"    Processing {len(images)} images from {source_dir.name}...")

        processed = 0

        for image_path in tqdm(images, desc=f"    {source_dir.name}", unit="img"):
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

            # Small delay to not overwhelm the API
            time.sleep(0.3)

        return processed

    def process_all_sources(self, limit_per_source: Optional[int] = None) -> int:
        """Process images from all source directories"""
        total = 0

        for source_name in ['reddit', 'pinterest', 'tutorials']:
            source_dir = RAW_DIR / source_name
            if source_dir.exists():
                count = self.process_directory(source_dir, limit_per_source)
                total += count
                print(f"    Processed {count} images from {source_name}")

        print(f"\n  Total processed: {total} images")
        return total

    def get_processing_stats(self) -> Dict:
        """Get statistics about processed images"""
        stats = {
            "total_processed": len(self.processed_files),
            "by_source": {},
            "by_confidence": {"high": 0, "medium": 0, "low": 0},
            "colours_detected": 0,
        }

        if self.results_file.exists():
            with open(self.results_file) as f:
                for line in f:
                    try:
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
                                conf = colour.get("confidence", 0.5)
                                if conf >= 0.8:
                                    stats["by_confidence"]["high"] += 1
                                elif conf >= 0.5:
                                    stats["by_confidence"]["medium"] += 1
                                else:
                                    stats["by_confidence"]["low"] += 1
                    except json.JSONDecodeError:
                        continue

        return stats


def main():
    print("=" * 60)
    print("  SCHEMESTEALER - Batch Image Processor")
    print("=" * 60)

    processor = BatchProcessor()

    # Check API
    if not processor._check_api_health():
        print("\n  ERROR: SchemeStealer API is not running!")
        print("         Start it with:")
        print("         cd python-api && uvicorn main:app --reload")
        return

    print("\n  API is running - starting batch processing...")

    # Process all sources
    processor.process_all_sources(limit_per_source=None)  # No limit

    # Show stats
    stats = processor.get_processing_stats()
    print("\n  Processing Statistics:")
    print(f"    Total processed: {stats['total_processed']}")
    print(f"    Total colours detected: {stats['colours_detected']}")
    print(f"    By source: {stats['by_source']}")
    print(f"    By confidence: {stats['by_confidence']}")

    print("\n  Batch processing complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
