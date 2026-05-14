"""
Train Random Forest Model for Colour Classification
First ML model in the progression (works with 500+ samples)

Run with: python training/train_random_forest.py

Outputs:
- models/random_forest_YYYYMMDD_HHMMSS.joblib
- models/latest_model.json (metadata)
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


def hex_to_rgb(hex_code: str) -> tuple:
    """Convert hex colour to RGB tuple"""
    hex_code = hex_code.lstrip('#')
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))


def rgb_to_hsv(r: int, g: int, b: int) -> tuple:
    """Convert RGB to HSV"""
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    mx = max(r, g, b)
    mn = min(r, g, b)
    diff = mx - mn

    if mx == mn:
        h = 0
    elif mx == r:
        h = (60 * ((g - b) / diff) + 360) % 360
    elif mx == g:
        h = (60 * ((b - r) / diff) + 120) % 360
    else:
        h = (60 * ((r - g) / diff) + 240) % 360

    s = 0 if mx == 0 else (diff / mx) * 100
    v = mx * 100

    return h, s, v


def rgb_to_lab(r: int, g: int, b: int) -> tuple:
    """Convert RGB to LAB colour space"""
    # Normalize RGB
    r, g, b = r / 255.0, g / 255.0, b / 255.0

    # Apply gamma correction
    r = r / 12.92 if r <= 0.04045 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.04045 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.04045 else ((b + 0.055) / 1.055) ** 2.4

    # Convert to XYZ (D65 illuminant)
    x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
    z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

    # Normalize for D65 white point
    x, y, z = x / 0.95047, y / 1.0, z / 1.08883

    # Apply function
    def f(t):
        return t ** (1/3) if t > 0.008856 else (7.787 * t) + (16 / 116)

    l = (116 * f(y)) - 16
    a = 500 * (f(x) - f(y))
    b_val = 200 * (f(y) - f(z))

    return l, a, b_val


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
        print("  Loading API results...")
        with open(results_file) as f:
            for line in f:
                try:
                    data = json.loads(line)
                    filename = data.get("filename", "")

                    if "api_result" not in data:
                        continue

                    # API returns "colors" not "detectedColors"
                    colours = data["api_result"].get("colors", [])

                    for idx, colour in enumerate(colours):
                        sample_id = f"{filename}_{idx}"

                        # Get hex and convert to colour spaces
                        hex_code = colour.get("hex", "#000000")
                        try:
                            r, g, b = hex_to_rgb(hex_code)
                        except:
                            continue

                        h, s, v = rgb_to_hsv(r, g, b)
                        l, a, b_lab = rgb_to_lab(r, g, b)

                        records.append({
                            "sample_id": sample_id,
                            "r": r,
                            "g": g,
                            "b": b,
                            "h": h,
                            "s": s,
                            "v": v,
                            "l": l,
                            "a": a,
                            "b_lab": b_lab,
                            "coverage": colour.get("percentage", 0),
                            "predicted_family": colour.get("family", "Unknown"),
                            "confidence": colour.get("confidence", 0.5),
                            "is_metallic": 1 if colour.get("isMetallic", False) else 0,
                        })
                except json.JSONDecodeError:
                    continue

    df = pd.DataFrame(records)

    if len(df) == 0:
        return df

    # Load human labels
    labels_file = LABELLED_DIR / "labels.jsonl"
    if labels_file.exists():
        print("  Loading human labels...")
        labels = {}
        with open(labels_file) as f:
            for line in f:
                try:
                    label = json.loads(line)
                    labels[label["sample_id"]] = label.get("correct_family", label.get("predicted_family"))
                except:
                    continue

        print(f"    Found {len(labels)} human labels")

        # Apply corrections
        df["true_family"] = df.apply(
            lambda row: labels.get(row["sample_id"], row["predicted_family"]),
            axis=1
        )
    else:
        # Use predictions as labels (will be noisy!)
        print("  Warning: No human labels found, using API predictions as ground truth")
        df["true_family"] = df["predicted_family"]

    return df


def train_model(df: pd.DataFrame) -> dict:
    """Train Random Forest and evaluate"""

    print(f"\n  Dataset Statistics:")
    print(f"    Total samples: {len(df)}")
    print(f"    Unique classes: {df['true_family'].nunique()}")
    print(f"\n  Class distribution:")
    for family, count in df['true_family'].value_counts().head(15).items():
        print(f"    {family}: {count}")

    # Filter classes with too few samples
    class_counts = df['true_family'].value_counts()
    valid_classes = class_counts[class_counts >= 5].index
    df_filtered = df[df['true_family'].isin(valid_classes)]

    if len(df_filtered) < 50:
        print(f"\n  ERROR: Not enough samples after filtering ({len(df_filtered)} < 50)")
        print("         Need more data. Run scrapers and batch processor first!")
        return None

    print(f"\n  After filtering small classes: {len(df_filtered)} samples, {len(valid_classes)} classes")

    # Features
    feature_cols = ["r", "g", "b", "h", "s", "v", "l", "a", "b_lab", "coverage", "is_metallic"]
    X = df_filtered[feature_cols].values
    y = df_filtered["true_family"].values

    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TRAIN_TEST_SPLIT, random_state=RANDOM_SEED, stratify=y
    )

    print(f"\n  Training on {len(X_train)} samples, testing on {len(X_test)}...")

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

    print(f"\n  Results:")
    print(f"    Test Accuracy: {accuracy:.2%}")

    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5)
    print(f"    CV Score: {cv_scores.mean():.2%} (+/- {cv_scores.std()*2:.2%})")

    print(f"\n  Classification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # Feature importance
    importance = pd.DataFrame({
        "feature": feature_cols,
        "importance": model.feature_importances_
    }).sort_values("importance", ascending=False)

    print(f"\n  Feature Importance:")
    for _, row in importance.iterrows():
        bar = "#" * int(row['importance'] * 50)
        print(f"    {row['feature']:12} {bar} {row['importance']:.3f}")

    # Save model
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
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
        "n_samples": len(df_filtered),
        "n_features": len(feature_cols),
        "feature_names": feature_cols,
        "classes": list(model.classes_),
        "model_path": str(model_path),
    }

    meta_path = MODELS_DIR / "latest_model.json"
    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n  Model saved: {model_path}")
    print(f"  Metadata saved: {meta_path}")

    return metadata


def main():
    print("=" * 60)
    print("  SCHEMESTEALER - ML Training Pipeline")
    print("  Random Forest Classifier")
    print("=" * 60)

    # Load data
    print("\n  Loading training data...")
    df = load_training_data()

    if len(df) < 50:
        print(f"\n  ERROR: Only {len(df)} samples found. Need at least 50 for training.")
        print("         Run these steps first:")
        print("         1. python scrapers/tutorial_scraper.py")
        print("         2. python processing/batch_processor.py")
        print("         3. python labeller/app.py (label some samples)")
        return

    # Train
    metadata = train_model(df)

    if metadata:
        print(f"\n  Training complete!")
        print(f"    Accuracy: {metadata['accuracy']:.2%}")
        print(f"    Model: {metadata['model_path']}")
        print("\n  To use this model, copy it to python-api/models/")

    print("=" * 60)


if __name__ == "__main__":
    main()
