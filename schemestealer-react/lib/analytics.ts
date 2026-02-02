/**
 * Analytics Service
 * Tracks user behaviour for understanding app usage
 * Stores events in localStorage queue, batch sends to backend
 */

import { apiClient } from './apiClient';

// ============================================================================
// Types
// ============================================================================

export type AnalyticsEventName =
  | 'page_view'
  | 'scan_started'
  | 'scan_completed'
  | 'paint_added_to_cart'
  | 'paint_removed_from_cart'
  | 'affiliate_link_clicked'
  | 'share_initiated'
  | 'feedback_submitted'
  | 'pro_upgrade_clicked'
  | 'ko_fi_clicked';

export interface AnalyticsEvent {
  event_name: AnalyticsEventName;
  properties: Record<string, string | number | boolean | null>;
  session_id: string;
  timestamp: string;
  user_agent: string;
  page_path: string;
}

interface QueuedEvent extends AnalyticsEvent {
  retry_count: number;
}

// ============================================================================
// Constants
// ============================================================================

const ANALYTICS_QUEUE_KEY = 'schemestealer-analytics-queue';
const SESSION_ID_KEY = 'schemestealer-session-id';
const FLUSH_INTERVAL_MS = 30000; // 30 seconds
const MAX_QUEUE_SIZE = 100;
const MAX_RETRIES = 3;

// ============================================================================
// Session Management
// ============================================================================

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
// Queue Management
// ============================================================================

function getQueue(): QueuedEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ANALYTICS_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedEvent[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Limit queue size
    const limitedQueue = queue.slice(-MAX_QUEUE_SIZE);
    localStorage.setItem(ANALYTICS_QUEUE_KEY, JSON.stringify(limitedQueue));
  } catch (error) {
    console.warn('Analytics: Failed to save queue', error);
  }
}

function addToQueue(event: AnalyticsEvent): void {
  const queue = getQueue();
  queue.push({ ...event, retry_count: 0 });
  saveQueue(queue);
}

// ============================================================================
// Analytics Service Class
// ============================================================================

class AnalyticsService {
  private sessionId: string;
  private flushInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    this.sessionId = getSessionId();
  }

  /**
   * Initialize the analytics service
   * Call once on app start
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;

    // Set up periodic flush
    this.flushInterval = setInterval(() => {
      this.flush();
    }, FLUSH_INTERVAL_MS);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });

    // Flush on visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });

    // Initial flush attempt
    this.flush();
  }

  /**
   * Track an analytics event
   */
  track(eventName: AnalyticsEventName, properties: Record<string, string | number | boolean | null> = {}): void {
    if (typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      event_name: eventName,
      properties,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_path: window.location.pathname,
    };

    addToQueue(event);
  }

  /**
   * Track page view
   */
  trackPageView(path: string, referrer?: string): void {
    this.track('page_view', {
      path,
      referrer: referrer || document.referrer || null,
    });
  }

  /**
   * Track scan started
   */
  trackScanStarted(mode: 'miniature' | 'inspiration'): void {
    this.track('scan_started', { mode });
  }

  /**
   * Track scan completed
   */
  trackScanCompleted(mode: 'miniature' | 'inspiration', numColours: number, processingTimeMs: number): void {
    this.track('scan_completed', {
      mode,
      num_colours: numColours,
      processing_time_ms: processingTimeMs,
    });
  }

  /**
   * Track paint added to cart
   */
  trackPaintAddedToCart(paintName: string, brand: string, price?: number): void {
    this.track('paint_added_to_cart', {
      paint_name: paintName,
      brand,
      price: price || null,
    });
  }

  /**
   * Track paint removed from cart
   */
  trackPaintRemovedFromCart(paintName: string, brand: string): void {
    this.track('paint_removed_from_cart', {
      paint_name: paintName,
      brand,
    });
  }

  /**
   * Track affiliate link clicked
   */
  trackAffiliateLinkClicked(retailer: string, paintName: string, paintBrand: string): void {
    this.track('affiliate_link_clicked', {
      retailer,
      paint_name: paintName,
      paint_brand: paintBrand,
    });
  }

  /**
   * Track share initiated
   */
  trackShareInitiated(method: 'copy' | 'download' | 'social'): void {
    this.track('share_initiated', { method });
  }

  /**
   * Track feedback submitted
   */
  trackFeedbackSubmitted(rating: number, hasCorrections: boolean): void {
    this.track('feedback_submitted', {
      rating,
      has_corrections: hasCorrections,
    });
  }

  /**
   * Track pro upgrade clicked
   */
  trackProUpgradeClicked(): void {
    this.track('pro_upgrade_clicked', {});
  }

  /**
   * Track Ko-fi clicked
   */
  trackKoFiClicked(source: string): void {
    this.track('ko_fi_clicked', { source });
  }

  /**
   * Flush queued events to backend
   */
  async flush(): Promise<void> {
    const queue = getQueue();
    if (queue.length === 0) return;

    try {
      await apiClient.post('/api/analytics/events', {
        events: queue.map(({ retry_count, ...event }) => event),
      });

      // Success - clear queue
      saveQueue([]);
      console.log(`Analytics: Flushed ${queue.length} events`);
    } catch (error) {
      console.warn('Analytics: Failed to flush events, will retry', error);

      // Increment retry count and keep events that haven't exceeded max retries
      const updatedQueue = queue
        .map(event => ({ ...event, retry_count: event.retry_count + 1 }))
        .filter(event => event.retry_count < MAX_RETRIES);

      saveQueue(updatedQueue);
    }
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Clean up
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

// ============================================================================
// Export Singleton
// ============================================================================

export const analytics = new AnalyticsService();

export default analytics;
