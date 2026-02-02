/**
 * ML Data Logger Service
 * Comprehensive logging system for collecting training data
 * Captures 35+ features per scan for future ML model training
 */

import { apiClient, API_BASE_URL } from './apiClient';
import type { ScanMode, ScanResult, Color, Paint } from './types';

// ============================================================================
// Types for ML Data Collection
// ============================================================================

export interface ScanLevelFeatures {
  scan_id: string;
  user_id: string | null;
  session_id: string;
  mode: ScanMode;
  timestamp: string;
  processing_time_ms: number;
  image_width: number;
  image_height: number;
  image_size_bytes: number;
  num_colours_detected: number;
  dominant_colour_hex: string;
  colour_harmony_type: string;
  overall_brightness: number;
  overall_contrast: number;
}

export interface ColourFeatures {
  scan_id: string;
  colour_index: number;
  // RGB values
  r: number;
  g: number;
  b: number;
  // HSV values
  h: number;
  s: number;
  v: number;
  // LAB values
  l: number;
  a: number;
  b_lab: number;
  // Derived
  chroma: number;
  coverage_percent: number;
  family_predicted: string;
  is_metallic: boolean;
  is_detail: boolean;
  confidence: number;
  // Top paint match
  top_paint_name: string | null;
  top_paint_brand: string | null;
  top_paint_delta_e: number | null;
}

export interface BehaviouralSignals {
  scan_id: string;
  session_id: string;
  time_on_results_ms: number;
  paints_added_to_cart: string[];
  paints_removed_from_cart: string[];
  affiliate_links_clicked: Array<{ retailer: string; paint_name: string; paint_brand: string }>;
  shared_scheme: boolean;
  saved_to_library: boolean;
  scanned_again_same_image: boolean;
}

export interface MLLogBatch {
  scan: ScanLevelFeatures;
  colours: ColourFeatures[];
  behaviour?: Partial<BehaviouralSignals>;
}

export interface FeedbackData {
  scan_id: string;
  session_id: string;
  colour_index?: number;
  feedback_type: 'accuracy' | 'correction' | 'rating';
  original_value?: string;
  corrected_value?: string;
  rating?: number;
  comment?: string;
  timestamp: string;
}

export interface ColourCorrection {
  colourIndex: number;
  originalFamily: string;
  wasCorrect: boolean;
  correctedFamily?: string;
  actualPaintUsed?: string;
}

export interface CompleteFeedback {
  scanId: string;
  sessionId: string;
  rating: number;
  colourCorrections: ColourCorrection[];
  issueCategories: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  comment: string;
  email: string;
  timestamp: string;
}

// ============================================================================
// Session Management
// ============================================================================

const SESSION_ID_KEY = 'schemestealer-session-id';
const ML_DATA_QUEUE_KEY = 'schemestealer-ml-queue';
const IMAGE_HASH_CACHE_KEY = 'schemestealer-image-hashes';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getSessionId(): string {
  if (typeof window === 'undefined') return generateUUID();

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  return sessionId;
}

// ============================================================================
// Colour Conversion Utilities
// ============================================================================

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

function calculateChroma(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

function calculateBrightness(colours: Color[]): number {
  if (colours.length === 0) return 50;

  const totalL = colours.reduce((sum, c) => sum + (c.lab?.[0] || 50), 0);
  return totalL / colours.length;
}

function calculateContrast(colours: Color[]): number {
  if (colours.length < 2) return 0;

  const luminances = colours.map(c => c.lab?.[0] || 50);
  const maxL = Math.max(...luminances);
  const minL = Math.min(...luminances);

  return maxL - minL;
}

function detectColourHarmony(colours: Color[]): string {
  if (colours.length < 2) return 'monochromatic';

  const hues = colours.map(c => {
    const hsv = rgbToHsv(c.rgb[0], c.rgb[1], c.rgb[2]);
    return hsv.h;
  });

  // Calculate hue differences
  const hueDiffs: number[] = [];
  for (let i = 0; i < hues.length - 1; i++) {
    const diff = Math.abs(hues[i + 1] - hues[i]);
    hueDiffs.push(Math.min(diff, 360 - diff));
  }

  const avgDiff = hueDiffs.reduce((a, b) => a + b, 0) / hueDiffs.length;
  const maxDiff = Math.max(...hueDiffs);

  // Simple harmony detection
  if (maxDiff < 30) return 'analogous';
  if (hueDiffs.some(d => d > 150 && d < 210)) return 'complementary';
  if (hueDiffs.some(d => d > 110 && d < 130)) return 'triadic';
  if (avgDiff > 70 && avgDiff < 100) return 'split-complementary';

  return 'mixed';
}

function isMetallicColour(family: string | undefined, hex: string): boolean {
  const metallicFamilies = ['gold', 'silver', 'bronze', 'copper', 'brass', 'metallic'];
  if (family && metallicFamilies.some(m => family.toLowerCase().includes(m))) {
    return true;
  }
  // Also check by colour characteristics (high luminance variation)
  return false;
}

// ============================================================================
// Image Hashing for Duplicate Detection
// ============================================================================

async function calculateImageHash(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Simple hash based on file size and first/last bytes
      const buffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(buffer);
      const size = bytes.length;

      // Create a simple hash from size + sample bytes
      let hash = size.toString(16);
      if (bytes.length > 100) {
        for (let i = 0; i < 50; i++) {
          hash += bytes[i].toString(16).padStart(2, '0');
        }
        for (let i = bytes.length - 50; i < bytes.length; i++) {
          hash += bytes[i].toString(16).padStart(2, '0');
        }
      }
      resolve(hash);
    };
    reader.onerror = () => resolve(generateUUID());
    reader.readAsArrayBuffer(file);
  });
}

function getRecentImageHashes(): string[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(IMAGE_HASH_CACHE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function addImageHash(hash: string): void {
  if (typeof window === 'undefined') return;
  const hashes = getRecentImageHashes();
  hashes.unshift(hash);
  // Keep last 20 hashes
  localStorage.setItem(IMAGE_HASH_CACHE_KEY, JSON.stringify(hashes.slice(0, 20)));
}

function wasImageScannedRecently(hash: string): boolean {
  return getRecentImageHashes().includes(hash);
}

// ============================================================================
// Queue Management for Offline Support
// ============================================================================

interface QueuedData {
  type: 'scan' | 'behaviour' | 'feedback';
  data: MLLogBatch | Partial<BehaviouralSignals> | FeedbackData;
  timestamp: number;
  retryCount: number;
}

function getQueue(): QueuedData[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(ML_DATA_QUEUE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveQueue(queue: QueuedData[]): void {
  if (typeof window === 'undefined') return;
  // Limit queue size to prevent localStorage overflow
  const limitedQueue = queue.slice(-100);
  localStorage.setItem(ML_DATA_QUEUE_KEY, JSON.stringify(limitedQueue));
}

function addToQueue(item: QueuedData): void {
  const queue = getQueue();
  queue.push(item);
  saveQueue(queue);
}

// ============================================================================
// ML Logger Class
// ============================================================================

class MLDataLogger {
  private sessionId: string;
  private activeScan: {
    scanId: string;
    mode: ScanMode;
    startTime: number;
    imageHash?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageSizeBytes?: number;
  } | null = null;

  private resultsViewStartTime: number | null = null;
  private cartActions: { scanId: string; action: 'add' | 'remove'; paintName: string; brand: string }[] = [];
  private affiliateClicks: Array<{ retailer: string; paint_name: string; paint_brand: string }> = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    this.sessionId = getSessionId();
  }

  /**
   * Initialize the logger - call once on app start
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;

    // Set up periodic flush
    this.flushInterval = setInterval(() => {
      this.flushQueue();
    }, 30000); // Every 30 seconds

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushQueue();
    });

    // Also try to flush on visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushQueue();
      }
    });

    // Initial flush attempt for any queued data
    this.flushQueue();
  }

  /**
   * Start tracking a new scan
   */
  async startScan(mode: ScanMode, file?: File): Promise<string> {
    const scanId = generateUUID();
    const startTime = Date.now();

    let imageHash: string | undefined;
    let imageWidth: number | undefined;
    let imageHeight: number | undefined;
    let imageSizeBytes: number | undefined;

    if (file) {
      imageSizeBytes = file.size;
      imageHash = await calculateImageHash(file);

      // Get image dimensions
      const dimensions = await this.getImageDimensions(file);
      imageWidth = dimensions.width;
      imageHeight = dimensions.height;
    }

    this.activeScan = {
      scanId,
      mode,
      startTime,
      imageHash,
      imageWidth,
      imageHeight,
      imageSizeBytes,
    };

    return scanId;
  }

  /**
   * Get image dimensions from file
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 });
      };

      img.src = url;
    });
  }

  /**
   * Log completed scan with all features
   */
  logScanComplete(scanResult: ScanResult): void {
    if (!this.activeScan) {
      console.warn('MLLogger: No active scan to complete');
      return;
    }

    const processingTime = Date.now() - this.activeScan.startTime;
    const colours = scanResult.detectedColors;

    // Check if this was a rescan of the same image
    const scannedAgain = this.activeScan.imageHash
      ? wasImageScannedRecently(this.activeScan.imageHash)
      : false;

    if (this.activeScan.imageHash) {
      addImageHash(this.activeScan.imageHash);
    }

    // Build scan-level features
    const scanFeatures: ScanLevelFeatures = {
      scan_id: scanResult.id,
      user_id: null, // To be filled when auth is added
      session_id: this.sessionId,
      mode: this.activeScan.mode,
      timestamp: new Date().toISOString(),
      processing_time_ms: processingTime,
      image_width: this.activeScan.imageWidth || 0,
      image_height: this.activeScan.imageHeight || 0,
      image_size_bytes: this.activeScan.imageSizeBytes || 0,
      num_colours_detected: colours.length,
      dominant_colour_hex: colours[0]?.hex || '#000000',
      colour_harmony_type: detectColourHarmony(colours),
      overall_brightness: calculateBrightness(colours),
      overall_contrast: calculateContrast(colours),
    };

    // Build per-colour features
    const colourFeatures: ColourFeatures[] = colours.map((colour, index) => {
      const hsv = rgbToHsv(colour.rgb[0], colour.rgb[1], colour.rgb[2]);
      const topPaint = this.getTopPaintMatch(colour);

      return {
        scan_id: scanResult.id,
        colour_index: index,
        r: colour.rgb[0],
        g: colour.rgb[1],
        b: colour.rgb[2],
        h: hsv.h,
        s: hsv.s,
        v: hsv.v,
        l: colour.lab[0],
        a: colour.lab[1],
        b_lab: colour.lab[2],
        chroma: calculateChroma(colour.lab[1], colour.lab[2]),
        coverage_percent: colour.percentage || 0,
        family_predicted: colour.family || 'unknown',
        is_metallic: isMetallicColour(colour.family, colour.hex),
        is_detail: (colour.percentage || 0) < 10, // Small coverage = detail colour
        confidence: 1.0, // Placeholder - would come from ML model
        top_paint_name: topPaint?.name || null,
        top_paint_brand: topPaint?.brand || null,
        top_paint_delta_e: topPaint?.deltaE || null,
      };
    });

    // Create batch data
    const batchData: MLLogBatch = {
      scan: scanFeatures,
      colours: colourFeatures,
      behaviour: {
        scan_id: scanResult.id,
        session_id: this.sessionId,
        scanned_again_same_image: scannedAgain,
      },
    };

    // Queue for sending
    addToQueue({
      type: 'scan',
      data: batchData,
      timestamp: Date.now(),
      retryCount: 0,
    });

    // Reset active scan
    this.activeScan = null;

    // Start tracking results view time
    this.resultsViewStartTime = Date.now();
    this.cartActions = [];
    this.affiliateClicks = [];
  }

  /**
   * Get top paint match from colour data
   */
  private getTopPaintMatch(colour: Color): { name: string; brand: string; deltaE: number } | null {
    // Check new format first
    if (colour.paintRecipe) {
      const citadelBase = colour.paintRecipe.citadel?.base;
      if (citadelBase) {
        return {
          name: citadelBase.name,
          brand: 'Citadel',
          deltaE: citadelBase.deltaE || 0,
        };
      }
    }

    // Fallback to legacy format
    if (colour.paintMatches?.citadel?.[0]) {
      const match = colour.paintMatches.citadel[0];
      return {
        name: match.name,
        brand: match.brand,
        deltaE: match.deltaE || 0,
      };
    }

    return null;
  }

  /**
   * Log cart action
   */
  logCartAction(scanId: string | undefined, action: 'add' | 'remove', paintName: string, brand: string): void {
    if (!scanId) return;

    this.cartActions.push({ scanId, action, paintName, brand });

    // Queue behavioural update
    const behaviourData: Partial<BehaviouralSignals> = {
      scan_id: scanId,
      session_id: this.sessionId,
      paints_added_to_cart: this.cartActions.filter(a => a.action === 'add').map(a => `${a.brand} - ${a.paintName}`),
      paints_removed_from_cart: this.cartActions.filter(a => a.action === 'remove').map(a => `${a.brand} - ${a.paintName}`),
    };

    addToQueue({
      type: 'behaviour',
      data: behaviourData,
      timestamp: Date.now(),
      retryCount: 0,
    });
  }

  /**
   * Log affiliate link click
   */
  logAffiliateClick(scanId: string | undefined, retailer: string, paintName: string, paintBrand: string): void {
    if (!scanId) return;

    this.affiliateClicks.push({ retailer, paint_name: paintName, paint_brand: paintBrand });

    const behaviourData: Partial<BehaviouralSignals> = {
      scan_id: scanId,
      session_id: this.sessionId,
      affiliate_links_clicked: this.affiliateClicks,
    };

    addToQueue({
      type: 'behaviour',
      data: behaviourData,
      timestamp: Date.now(),
      retryCount: 0,
    });
  }

  /**
   * Log share action
   */
  logShare(scanId: string | undefined): void {
    if (!scanId) return;

    const behaviourData: Partial<BehaviouralSignals> = {
      scan_id: scanId,
      session_id: this.sessionId,
      shared_scheme: true,
    };

    addToQueue({
      type: 'behaviour',
      data: behaviourData,
      timestamp: Date.now(),
      retryCount: 0,
    });
  }

  /**
   * Log save to library action
   */
  logSaveToLibrary(scanId: string | undefined): void {
    if (!scanId) return;

    const behaviourData: Partial<BehaviouralSignals> = {
      scan_id: scanId,
      session_id: this.sessionId,
      saved_to_library: true,
    };

    addToQueue({
      type: 'behaviour',
      data: behaviourData,
      timestamp: Date.now(),
      retryCount: 0,
    });
  }

  /**
   * Log user leaving results page (captures time spent)
   */
  logResultsPageExit(scanId: string | undefined): void {
    if (!scanId || !this.resultsViewStartTime) return;

    const timeOnResults = Date.now() - this.resultsViewStartTime;

    const behaviourData: Partial<BehaviouralSignals> = {
      scan_id: scanId,
      session_id: this.sessionId,
      time_on_results_ms: timeOnResults,
    };

    addToQueue({
      type: 'behaviour',
      data: behaviourData,
      timestamp: Date.now(),
      retryCount: 0,
    });

    this.resultsViewStartTime = null;
  }

  /**
   * Log user feedback/correction
   */
  logFeedback(feedback: Omit<FeedbackData, 'session_id' | 'timestamp'>): void {
    const feedbackData: FeedbackData = {
      ...feedback,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
    };

    addToQueue({
      type: 'feedback',
      data: feedbackData,
      timestamp: Date.now(),
      retryCount: 0,
    });
  }

  /**
   * Submit complete feedback with colour corrections
   * Sends directly to backend (not queued) for immediate processing
   */
  async submitCompleteFeedback(feedback: CompleteFeedback): Promise<boolean> {
    try {
      // Convert camelCase to snake_case for backend
      const payload = {
        scan_id: feedback.scanId,
        session_id: feedback.sessionId,
        rating: feedback.rating,
        colour_corrections: feedback.colourCorrections.map(c => ({
          colour_index: c.colourIndex,
          original_family: c.originalFamily,
          was_correct: c.wasCorrect,
          corrected_family: c.correctedFamily || null,
          actual_paint_used: c.actualPaintUsed || null,
        })),
        issue_categories: feedback.issueCategories,
        experience_level: feedback.experienceLevel,
        comment: feedback.comment || null,
        email: feedback.email || null,
        timestamp: feedback.timestamp,
      };

      await apiClient.post('/api/ml/log-complete-feedback', payload);
      console.log('MLLogger: Complete feedback submitted successfully');
      return true;
    } catch (error) {
      console.error('MLLogger: Failed to submit complete feedback:', error);

      // Queue for retry if direct submission fails
      addToQueue({
        type: 'feedback',
        data: {
          scan_id: feedback.scanId,
          session_id: feedback.sessionId,
          feedback_type: 'rating',
          rating: feedback.rating,
          comment: feedback.comment,
          timestamp: feedback.timestamp,
        } as FeedbackData,
        timestamp: Date.now(),
        retryCount: 0,
      });

      return false;
    }
  }

  /**
   * Flush queued data to backend
   */
  async flushQueue(): Promise<void> {
    const queue = getQueue();
    if (queue.length === 0) return;

    const scanData: MLLogBatch[] = [];
    const behaviourData: Partial<BehaviouralSignals>[] = [];
    const feedbackData: FeedbackData[] = [];
    const failedItems: QueuedData[] = [];

    // Categorise queue items
    for (const item of queue) {
      if (item.type === 'scan') {
        scanData.push(item.data as MLLogBatch);
      } else if (item.type === 'behaviour') {
        behaviourData.push(item.data as Partial<BehaviouralSignals>);
      } else if (item.type === 'feedback') {
        feedbackData.push(item.data as FeedbackData);
      }
    }

    // Try to send batch
    try {
      if (scanData.length > 0 || behaviourData.length > 0 || feedbackData.length > 0) {
        await apiClient.post('/api/ml/batch-log', {
          scans: scanData,
          behaviours: behaviourData,
          feedbacks: feedbackData,
        });

        // Success - clear queue
        saveQueue([]);
        console.log(`MLLogger: Flushed ${queue.length} items to backend`);
      }
    } catch (error) {
      // Backend unavailable - keep items in queue with retry count
      console.warn('MLLogger: Failed to flush queue, will retry later', error);

      for (const item of queue) {
        if (item.retryCount < 5) {
          failedItems.push({
            ...item,
            retryCount: item.retryCount + 1,
          });
        }
        // Items with 5+ retries are dropped
      }

      saveQueue(failedItems);
    }
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Clean up on app shutdown
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushQueue();
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const mlLogger = new MLDataLogger();

export default mlLogger;
