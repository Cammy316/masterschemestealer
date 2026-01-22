# SchemeSteal FastAPI Backend

FastAPI microservice for color detection and paint matching for miniature painters.

**Status**: ✅ **FULLY REFACTORED** - No Streamlit dependencies, production-ready

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Start the Server

```bash
# Development mode (with auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# OR use the Python script
python main.py
```

### 3. Open the Docs

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation

---

## 📁 Project Structure

```
python-api/
├── main.py                      # FastAPI app entry point
├── config.py                    # Configuration & thresholds
├── paints.json                  # Paint database (149 paints)
├── requirements.txt             # Python dependencies
│
├── core/                        # Core color detection logic (NO Streamlit)
│   ├── schemestealer_engine.py  # Main scanning engine
│   ├── smart_color_system.py    # Color extraction with ensemble voting
│   ├── color_engine.py          # Paint matching with Delta-E
│   ├── photo_processor.py       # Image preprocessing & quality checks
│   ├── base_detector.py         # Base/platform detection
│   └── visualization.py         # Visualization utilities
│
├── services/                    # FastAPI service layer
│   ├── miniature_scanner.py     # Miniscan service (WITH bg removal)
│   └── inspiration_scanner.py   # Inspiration service (NO bg removal)
│
└── utils/                       # Utility functions (NO Streamlit)
    ├── helpers.py               # Image processing helpers
    ├── logging_config.py        # Logging configuration
    └── analytics.py             # Analytics tracking
```

---

## 🎯 API Endpoints

### Health Check
```bash
GET /
```
Returns API status and version.

**Example:**
```bash
curl http://localhost:8000/
```

**Response:**
```json
{
  "status": "ok",
  "message": "SchemeSteal API is running",
  "version": "1.0.0"
}
```

---

### Get All Paints
```bash
GET /api/paints
```
Returns the complete paint database.

---

### Scan Miniature (Miniscan Mode)
```bash
POST /api/scan/miniature
```
Scan a painted miniature with background removal.

**Features:**
- ✅ Background removal using rembg
- ✅ Detects 3-5 dominant colors on the miniature
- ✅ Returns paint recommendations with Delta-E scores

**Example:**
```bash
curl -X POST "http://localhost:8000/api/scan/miniature" \
  -F "file=@space_marine.jpg"
```

---

### Scan Inspiration (Inspiration Mode)
```bash
POST /api/scan/inspiration
```
Extract color palette from any image (NO background removal).

**Features:**
- ❌ NO background removal (analyzes entire image)
- ✅ Detects 5-8 dominant colors
- ✅ Returns paint recommendations for each color

---

## 🔬 Color Detection Algorithm

The backend uses sophisticated color detection from the original Streamlit app:

### Key Features

1. **Dual Color Space Analysis**: HSV and LAB with ensemble voting
2. **Hue-Range Exceptions**: Handles desaturated colors correctly
3. **Achromatic Detection**: Prevents grey/black/white misclassifications
4. **Background Removal**: rembg for miniature isolation (Miniscan only)
5. **Dominant Color Extraction**: K-means clustering with coverage ranking
6. **Paint Matching**: Delta-E distance in LAB color space

### Accuracy
- **Target**: ~37% correct classification for primary armor colors
- **Benchmark**: Matches original Streamlit app accuracy

---

## 🔍 Key Differences: Miniscan vs Inspiration

| Feature | Miniscan | Inspiration |
|---------|----------|-------------|
| **Background Removal** | ✅ YES (rembg) | ❌ NO (full image) |
| **Color Count** | 3-5 colors | 5-8 colors |
| **Use Case** | "What paints are on this mini?" | "I want these colors!" |
| **Processing** | isolate → detect → match | extract → match |

---

## 📦 Dependencies

All dependencies in `requirements.txt` (NO Streamlit):

```
fastapi==0.115.0              # Web framework
uvicorn[standard]==0.32.0     # ASGI server
python-multipart==0.0.16      # File upload support
opencv-python==4.10.0.84      # Image processing
numpy==1.26.4                 # Numerical operations
Pillow==11.0.0                # Image manipulation
rembg==2.0.59                 # Background removal
scikit-learn==1.5.2           # K-means clustering
scikit-image==0.24.0          # Color space conversions
scipy==1.14.1                 # Delta-E calculations
python-dotenv==1.0.1          # Environment variables
```

---

## ✅ Refactor Completed

This backend has been **completely refactored** from the original Streamlit app:

### What Was Removed:
- ❌ All Streamlit imports and dependencies
- ❌ Session state management
- ❌ Shopping cart logic (frontend handles this)
- ❌ Feedback logger with Google Sheets

### What Was Kept:
- ✅ All core color detection algorithms
- ✅ Dual color space analysis (HSV + LAB)
- ✅ Hue-range exceptions
- ✅ Paint matching with Delta-E
- ✅ Background removal with rembg

### What Was Added:
- ✅ FastAPI REST API endpoints
- ✅ Swagger UI documentation
- ✅ CORS support for frontend
- ✅ Proper error handling
- ✅ Production-ready structure

---

Built with ❤️ for the Warhammer and miniature painting community
