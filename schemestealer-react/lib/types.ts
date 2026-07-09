/**
 * TypeScript types for SchemeSteal React app
 */

export type ScanMode = 'miniature' | 'inspiration';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface LABColor {
  l: number;
  a: number;
  b: number;
}

export interface Color {
  rgb: [number, number, number];
  lab: [number, number, number];
  hex: string;
  percentage?: number; // % of image this color represents
  family?: string; // Color family (e.g., "Blue", "Gold", "Red")
  reticle?: string | null; // Legacy: Base64 encoded JPEG showing color location on miniature
  mask?: string | null; // Base64 encoded RGBA PNG whose ALPHA channel is the region (Auspex Reveal v2)
  position?: { x: number; y: number }; // Normalised (0-1) marker point on the FULL uploaded frame
  paintRecipe?: PaintRecipe; // Structured recipe per brand
  // Legacy support for old paint matches format (offline mode only)
  paintMatches?: {
    citadel: Paint[];
    vallejo: Paint[];
    armyPainter: Paint[];
  };
}

// NEW: Paint recipe types for structured paint recommendations
export interface PaintMatch {
  name: string;
  hex: string;
  type: string;
  deltaE?: number;
  discontinued?: boolean; // Whether this paint is no longer available
  alternativeName?: string; // For renamed paints
  // Relationship provenance for highlight/shade/wash slots from the backend
  // recipe graph: 'official' (curated chain) or 'computed' (algorithmic).
  source?: 'official' | 'computed';
  owned_alternative?: PaintMatch;
}

export interface BrandRecipe {
  base: PaintMatch | null;
  shade: PaintMatch | null;
  highlight: PaintMatch | null;
  wash: PaintMatch | null;
}

export interface PaintRecipe {
  citadel: BrandRecipe;
  vallejo: BrandRecipe;
  army_painter: BrandRecipe;
  // New measured-swatch brands (Prompt 6). Optional so scans that pre-date
  // these brands still satisfy the type. Scale75 was removed (Prompt 8) — it has
  // no measured ground truth, so the backend no longer returns a recipe for it.
  ak?: BrandRecipe;
  pro_acryl?: BrandRecipe;
  two_thin_coats?: BrandRecipe;
}

export interface Paint {
  id?: string;
  name: string;
  brand: string;
  hex: string;
  type: string;
  colorFamily?: string; // Canonical lowercase family from DB (matches backend color_family)
  rgb?: [number, number, number];
  lab?: [number, number, number];
  deltaE?: number; // Distance from detected color (when used as a match)
}

// Spatial geometry for compositing masks onto the uploaded image. Masks are
// analysis-resolution (width×height) and cover only the alpha-bbox CROP of
// the full frame — cropX/Y/W/H locate that crop in frame pixels and
// frameW/frameH are the full frame dims. Older responses lack the crop
// fields; consumers fall back to treating the mask as full-frame.
export interface MaskFrame {
  width: number;
  height: number;
  cropX?: number;
  cropY?: number;
  cropW?: number;
  cropH?: number;
  frameW?: number;
  frameH?: number;
}

export interface ScanResult {
  id: string;
  mode: ScanMode;
  imageUrl?: string; // Optional for persisted results (to save space)
  imageData?: string; // Base64 encoded image
  detectedColors: Color[];
  recommendedPaints: Paint[];
  timestamp: string; // ISO 8601 — survives JSON.stringify in persist without type drift
  // Mask alignment metadata so the frontend maps masks onto the image
  maskFrame?: MaskFrame;
  // Which engine produced this result. 'local' = in-browser fallback (reduced
  // accuracy); defaults to 'backend'. Used for the results badge and ML logging.
  analysisSource?: 'backend' | 'local';
  feedback?: {
    rating?: number;
    comment?: string;
  };
}

export interface CartItem {
  paint: Paint;
  quantity: number;
  addedFrom?: ScanMode; // Track which mode added this paint
  scanId?: string; // Reference to the scan that added this
}

export interface AppState {
  // Scan state
  currentMode: ScanMode | null;
  currentScan: ScanResult | null;
  scanHistory: ScanResult[];

  // Cart & Inventory state
  cart: CartItem[];
  inventory: Paint[]; // Full paint objects to render the Armoury grid

  // UI state
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
  offlineMode: boolean;
  preferredBrands: string[]; // ['all'], ['citadel'], ['vallejo'], ['army-painter'], or combinations
  preferredRegion: string; // 'uk', 'us', 'eu', 'au', 'global'

  // Session Forge state
  activeSession: {
    scanId: string;
    startedAt: string;
    colours: Array<{
      colourIndex: number;
      brand: string;
      steps: Array<{
        role: 'base' | 'highlight' | 'shade' | 'wash';
        paintName: string;
        status: 'pending' | 'painting' | 'drying' | 'done';
        dryUntil?: number;
      }>;
    }>;
    dryTimeOverrides: Partial<Record<'base' | 'highlight' | 'shade' | 'wash', number>>;
  } | null;
}

export interface AppActions {
  // Mode and scan actions
  setMode: (mode: ScanMode) => void;
  setScanResult: (result: ScanResult) => void;
  clearCurrentScan: () => void;

  // Cart & Inventory actions
  addToCart: (paint: Paint, mode?: ScanMode, scanId?: string) => void;
  removeFromCart: (paintId: string) => void;
  updateQuantity: (paintId: string, quantity: number) => void;
  clearCart: () => void;
  
  addToInventory: (paint: Paint) => void;
  removeFromInventory: (paintId: string) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setOfflineMode: (enabled: boolean) => void;
  setPreferredBrands: (brands: string[]) => void;
  setPreferredRegion: (region: string) => void;

  // Session Forge actions
  setActiveSession: (session: AppState['activeSession']) => void;
  updateSessionStep: (colourIndex: number, role: 'base' | 'highlight' | 'shade' | 'wash', status: 'pending' | 'painting' | 'drying' | 'done', dryUntil?: number) => void;
  updateSessionOverride: (role: 'base' | 'highlight' | 'shade' | 'wash', minutes: number) => void;
}

export type AppStore = AppState & AppActions;
