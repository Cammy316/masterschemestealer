# SchemeSteal - React Migration

Mobile color detection application for Warhammer miniature painters. Scan painted miniatures or find color inspiration from any image, then get paint recommendations from major miniature paint brands.

**Project Status**: React/Next.js migration of existing Streamlit Python application
**Current User Base**: 0 users (learning/portfolio project)
**Primary Goal**: Build a polished, production-quality mobile app with excellent UX

---

## 📱 Two Core Modes

### 1️⃣ MINISCAN (Scan Your Miniature)
**Purpose**: Analyze a painted miniature to identify what paints were used

**Flow**:
1. User presses "Scan My Mini" button
2. Camera launches → take photo of their painted miniature
3. App removes background (using rembg)
4. Detects 3-5 dominant colors on the miniature
5. Shows paint recommendations that match those colors
6. User adds paints to shopping cart

**Use Cases**:
- "I painted this mini 2 years ago, what paints did I use?"
- "I bought a pre-painted mini, what paints should I buy to touch it up?"
- "I want to paint more minis in this same scheme, what colors are these?"

### 2️⃣ INSPIRATION MODE (Scan Anything for Color Ideas)
**Purpose**: Extract a color palette from ANY image to inspire miniature painting schemes

**Flow**:
1. User presses "Get Inspiration" button
2. Camera launches OR upload from gallery
3. Take/select photo of ANYTHING: artwork, sunset, movie poster, landscape, clothing, etc.
4. App extracts 5-8 dominant colors from the image (NO background removal)
5. Shows those colors as a palette
6. Recommends paints that match each color in the palette
7. User builds a shopping cart to recreate that color scheme

**Use Cases**:
- "I love the colors in this album cover, what paints can recreate this vibe?"
- "This sunset has beautiful oranges and purples, I want to paint my army in these colors"
- "This fantasy artwork has the perfect greens and golds for my Necrons"

---

## 🏗️ Project Structure

```
masterschemestealer/
├── schemestealer-react/          # Next.js frontend (NEW)
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx              # Home (mode selection)
│   │   ├── miniature/            # Miniscan flow
│   │   │   ├── page.tsx          # Camera/upload
│   │   │   └── results/page.tsx  # Results display
│   │   ├── inspiration/          # Inspiration flow
│   │   │   ├── page.tsx          # Camera/upload
│   │   │   └── results/page.tsx  # Results display
│   │   └── cart/page.tsx         # Shopping cart
│   ├── components/               # React components
│   │   ├── ModeSelector.tsx      # Home page mode selection
│   │   ├── Camera.tsx            # Camera/upload component
│   │   ├── ColorPalette.tsx      # Color swatches display
│   │   ├── PaintCard.tsx         # Paint recommendation cards
│   │   ├── ShoppingCart.tsx      # Cart functionality
│   │   ├── Navigation.tsx        # Bottom navigation bar
│   │   └── ui/                   # Reusable UI components
│   ├── lib/                      # Utilities and state
│   │   ├── store.ts              # Zustand state management
│   │   ├── types.ts              # TypeScript types
│   │   ├── utils.ts              # Utility functions
│   │   └── api.ts                # API client for backend
│   └── public/data/
│       └── paints.json           # Paint database (167 paints)
│
├── python-api/                    # FastAPI backend (NEW)
│   ├── main.py                   # FastAPI app entry point
│   ├── services/
│   │   ├── miniature_scanner.py  # Miniscan service (with bg removal)
│   │   └── inspiration_scanner.py # Inspiration service (no bg removal)
│   ├── core/                     # Core detection logic (from Streamlit app)
│   │   ├── schemestealer_engine.py
│   │   ├── smart_color_system.py
│   │   ├── color_engine.py
│   │   └── ...
│   └── paints.json               # Paint database
│
└── SchemeStealer/                 # Original Streamlit app (REFERENCE)
    ├── app.py
    ├── core/
    └── ...
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- npm or yarn

### 1. Start the Backend (FastAPI)

```bash
cd python-api

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Backend will run at `http://localhost:8000`

### 2. Start the Frontend (Next.js)

```bash
cd schemestealer-react

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run at `http://localhost:3000`

### 3. Open the App

Visit `http://localhost:3000` in your browser

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Headless UI / Radix UI
- **Animations**: Framer Motion (optional)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Image Processing**: OpenCV, PIL, rembg
- **Color Detection**: scikit-learn, scikit-image, scipy
- **Background Removal**: rembg

### Data
- **Paint Database**: 167 paints from Citadel, Vallejo, Army Painter, P3, Reaper, Scale75
- **Storage**: LocalStorage (via Zustand persist)
- **Future**: PostgreSQL via Supabase

---

## 🎨 Key Features

### ✅ Implemented
- [x] Two distinct scanning modes (Miniscan vs Inspiration)
- [x] Home page with clear mode selection
- [x] Camera/upload interface for both modes
- [x] FastAPI backend with two endpoints
- [x] Color detection with background removal (Miniscan)
- [x] Color palette extraction (Inspiration)
- [x] Paint matching algorithm
- [x] Shopping cart functionality
- [x] Mobile-first responsive design
- [x] Bottom navigation bar
- [x] Paint database (167 paints)

### 🔄 In Progress
- [ ] Connect frontend to backend (currently using API)
- [ ] Error handling and loading states
- [ ] Image optimization
- [ ] PWA setup (installable on home screen)

### 📝 Future Enhancements
- [ ] User accounts and authentication
- [ ] Scan history with cloud sync
- [ ] Feedback system with ratings
- [ ] Machine learning improvements
- [ ] Google Vision API integration (premium)
- [ ] Batch scanning
- [ ] Scheme sharing with community
- [ ] Affiliate links for paint retailers
- [ ] Offline mode with service worker

---

## 📊 API Endpoints

### GET /
Health check

### GET /api/paints
Get all paints from database

### POST /api/scan/miniature
Scan a painted miniature (with background removal)

**Request**: multipart/form-data with `file` field
**Response**:
```json
{
  "mode": "miniature",
  "colors": [...],
  "paints": [...],
  "metadata": {
    "color_count": 3,
    "paint_count": 4,
    "background_removed": true
  }
}
```

### POST /api/scan/inspiration
Extract color palette from any image (no background removal)

**Request**: multipart/form-data with `file` field
**Response**: Same format as `/api/scan/miniature` but with 5-8 colors

### POST /api/feedback
Submit user feedback about scan accuracy

---

## 🔬 Color Detection Algorithm

The app uses sophisticated color detection from the original Streamlit app:

1. **Dual Color Space Analysis**: HSV and LAB color spaces with ensemble voting
2. **Hue-Range Exceptions**: Critical for handling desaturated colors (blues, greens, purples after shading/weathering)
3. **Achromatic Detection**: Checks hue-range exceptions BEFORE achromatic (grey/black/white) classification
4. **Background Removal**: Uses rembg library to isolate miniature from background (Miniscan only)
5. **Dominant Color Extraction**: K-means clustering to find primary colors
6. **Paint Matching**: Delta-E distance in LAB color space for perceptually accurate matches

**Accuracy Target**: ~37% correct classification for primary armor colors (current benchmark from Streamlit app)

---

## 📱 Mobile-First Design

- Touch targets min 44x44px (iOS standard)
- Bottom navigation bar for easy thumb access
- Responsive layout: Mobile → Tablet → Desktop
- PWA-ready (installable on home screen)
- Offline capable (coming soon)
- Fast loading with image optimization
- Pull-to-refresh on scan results

---

## 🧪 Development Workflow

### Frontend Development
```bash
cd schemestealer-react
npm run dev      # Development server
npm run build    # Production build
npm run lint     # ESLint
```

### Backend Development
```bash
cd python-api
python main.py   # Run with auto-reload
# OR
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testing
```bash
# Frontend
cd schemestealer-react
npm run build    # Test production build

# Backend
cd python-api
pytest           # Run tests (once implemented)
```

---

## 🐛 Known Issues

- [ ] Desaturated blues sometimes classified as grey (fix implemented in Python, needs testing)
- [ ] Gold trim can be detected as yellow in certain lighting
- [ ] Cyan/turquoise ambiguity in some cases

---

## 📖 Documentation

- [Frontend README](schemestealer-react/README.md) - Next.js app details
- [Backend README](python-api/README.md) - FastAPI server details
- [Original Streamlit App](SchemeStealer/app.py) - Reference implementation

---

## 🤝 Contributing

This is a personal learning project, but suggestions are welcome! Areas for improvement:

1. Color detection accuracy
2. UI/UX enhancements
3. Mobile performance optimization
4. PWA features
5. Additional paint brands

---

## 📝 License

MIT License - Feel free to use this for learning

---

## 🎯 Success Metrics

### Core Functionality
- [x] App launches on mobile device
- [ ] Camera works smoothly
- [ ] Miniscan mode: Can scan a miniature and get color detection
- [ ] Inspiration mode: Can scan ANY image and extract color palette
- [x] Both modes display detected colors clearly
- [x] Both modes show paint recommendations
- [x] Can add paints to cart from either mode
- [x] Feels like a native mobile app (not a clunky website)

### User Experience
- [x] It's OBVIOUS which mode to use for which purpose
- [x] Switching between modes is intuitive
- [x] Results are presented beautifully for both modes
- [x] Shopping cart seamlessly combines paints from both modes

---

## 🔗 Key Differences: Miniscan vs Inspiration

| Feature | Miniscan | Inspiration |
|---------|----------|-------------|
| **Input** | Painted miniature | Literally anything |
| **Background Removal** | ✅ YES (isolate mini) | ❌ NO (analyze whole image) |
| **Use Case** | "What paints are on this mini?" | "I want to paint using these colors" |
| **Color Count** | 3-5 (main colors on mini) | 5-8 (palette from image) |
| **Backend Processing** | rembg → smart_color_system → paint_matcher | smart_color_system → paint_matcher |

---

Built with ❤️ for the Warhammer and miniature painting community
