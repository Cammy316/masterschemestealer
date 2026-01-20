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
}

export interface Paint {
  id?: string;
  name: string;
  brand: string;
  hex: string;
  type: string;
  rgb?: [number, number, number];
  lab?: [number, number, number];
  deltaE?: number; // Distance from detected color (when used as a match)
}

export interface ScanResult {
  id: string;
  mode: ScanMode;
  imageUrl: string;
  imageData?: string; // Base64 encoded image
  detectedColors: Color[];
  recommendedPaints: Paint[];
  timestamp: Date;
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

  // Cart state
  cart: CartItem[];

  // UI state
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AppActions {
  // Mode and scan actions
  setMode: (mode: ScanMode) => void;
  setScanResult: (result: ScanResult) => void;
  clearCurrentScan: () => void;

  // Cart actions
  addToCart: (paint: Paint, mode?: ScanMode, scanId?: string) => void;
  removeFromCart: (paintId: string) => void;
  updateQuantity: (paintId: string, quantity: number) => void;
  clearCart: () => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export type AppStore = AppState & AppActions;
