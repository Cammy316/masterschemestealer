# SchemeSteal FastAPI Backend

Python microservice for color detection and paint matching.

## Features

- **Miniature Scanning** (`/api/scan/miniature`): Scans painted miniatures with background removal
- **Inspiration Mode** (`/api/scan/inspiration`): Extracts color palettes from any image (no background removal)
- **Paint Database** (`/api/paints`): Access to 167 paints from major brands

## Setup

1. **Create virtual environment**:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the server**:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### GET /
Health check endpoint

### GET /api/paints
Get all paints from the database

**Response**:
```json
{
  "paints": [
    {
      "name": "Macragge Blue",
      "brand": "Citadel",
      "hex": "#0D407F",
      "type": "paint"
    }
  ]
}
```

### POST /api/scan/miniature
Scan a painted miniature (with background removal)

**Request**: Multipart form data with `file` field
**Response**:
```json
{
  "mode": "miniature",
  "colors": [
    {
      "rgb": [13, 64, 127],
      "lab": [27.5, 18.2, -47.3],
      "hex": "#0D407F",
      "percentage": 45.2,
      "family": "Blue"
    }
  ],
  "paints": [
    {
      "name": "Macragge Blue",
      "brand": "Citadel",
      "hex": "#0D407F",
      "type": "paint",
      "deltaE": 0.8,
      "rgb": [13, 64, 127],
      "lab": [27.5, 18.2, -47.3]
    }
  ],
  "metadata": {
    "color_count": 3,
    "paint_count": 4,
    "background_removed": true
  }
}
```

### POST /api/scan/inspiration
Extract color palette from any image (no background removal)

**Request**: Multipart form data with `file` field
**Response**: Same format as `/api/scan/miniature` but with more colors (5-8 instead of 3-5)

### POST /api/feedback
Submit user feedback about scan accuracy

**Request**:
```json
{
  "scan_id": "scan-123",
  "rating": 4,
  "comment": "Good match!"
}
```

## Architecture

- **FastAPI**: Modern Python web framework
- **rembg**: Background removal (miniature mode only)
- **OpenCV + scikit-learn**: Image processing and color clustering
- **Smart Color System**: Perceptual color detection from existing codebase

## Key Differences: Miniscan vs Inspiration

| Feature | Miniscan | Inspiration |
|---------|----------|-------------|
| Background Removal | ✅ Yes (rembg) | ❌ No |
| Target Input | Painted miniatures | Any image |
| Color Count | 3-5 colors | 5-8 colors |
| Use Case | "What paints are on this mini?" | "I want to paint using these colors" |

## Development

The core color detection logic is in:
- `core/schemestealer_engine.py` - Main scanning engine
- `core/smart_color_system.py` - Color extraction
- `core/color_engine.py` - Paint matching
- `services/miniature_scanner.py` - Miniature scan service (with bg removal)
- `services/inspiration_scanner.py` - Inspiration scan service (no bg removal)

## CORS Configuration

The API allows requests from:
- `http://localhost:3000` (Next.js dev server)
- `http://localhost:3001`
- `http://127.0.0.1:3000`

Update `main.py` to add additional origins if needed.
