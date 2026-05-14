# SchemeStealer ML Training Pipeline

Automated image scraping, processing, labelling, and model training for improving colour detection accuracy.

## Quick Start

### 1. Install Dependencies

```bash
cd ml-pipeline
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run Tutorial Scraper (Highest Value Data!)

```bash
python scrapers/tutorial_scraper.py
```

This scrapes Goonhammer tutorials which include paint recipes - ground truth labels!

### 3. Run Reddit Scraper (Optional - requires API keys)

```bash
# Get credentials from https://www.reddit.com/prefs/apps
export REDDIT_CLIENT_ID="your_client_id"
export REDDIT_CLIENT_SECRET="your_client_secret"
python scrapers/reddit_scraper.py
```

### 4. Process Images Through API

Make sure SchemeStealer API is running first:

```bash
cd ../python-api
uvicorn main:app --reload
```

Then process:

```bash
cd ../ml-pipeline
python processing/batch_processor.py
```

### 5. Label Samples (Semi-Automated)

```bash
python labeller/app.py
# Open http://localhost:5001
```

Label 100-200 samples, focusing on low-confidence predictions.

### 6. Train Model

```bash
python training/train_random_forest.py
```

## Directory Structure

```
ml-pipeline/
├── scrapers/           # Data collection scripts
│   ├── reddit_scraper.py
│   └── tutorial_scraper.py
├── processing/         # API processing
│   └── batch_processor.py
├── labeller/           # Active learning UI
│   └── app.py
├── training/           # ML training
│   └── train_random_forest.py
├── data/
│   ├── raw/            # Downloaded images
│   ├── processed/      # API results
│   └── labelled/       # Human labels
└── models/             # Trained models
```

## Data Sources

| Source | Value | Ground Truth |
|--------|-------|--------------|
| Tutorials (Goonhammer) | ⭐⭐⭐⭐⭐ | Paint names in text |
| Reddit with paint mentions | ⭐⭐⭐⭐ | Comments/titles |
| Reddit images only | ⭐⭐ | Needs labelling |

## Recommended Workflow

1. **Week 1**: Scrape tutorials + Reddit → ~500 images
2. **Week 2**: Process through API → Label 100 samples
3. **Week 3**: Continue scraping → 1,500+ images
4. **Week 4**: Train Random Forest → ~75% accuracy
5. **Month 2+**: Reach 3,000+ samples → Train XGBoost

## Model Progression

- **Month 1-4**: Random Forest (500+ samples)
- **Month 4-6**: XGBoost (2,000+ samples)
- **Month 6+**: Neural Network (10,000+ samples)

---

*"The data you collect today trains the Machine Spirit of tomorrow."*

**Ave Imperator! ⚔️**
