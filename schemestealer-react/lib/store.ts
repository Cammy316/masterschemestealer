/**
 * Zustand store for SchemeSteal app state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, ScanMode, ScanResult, Paint, CartItem } from './types';
import { mlLogger } from './mlDataLogger';

/** Revoke a blob: object URL safely (no-op on the server or for non-blob URLs). */
function revokeBlobUrl(url?: string): void {
  if (url && typeof window !== 'undefined' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Strip a scan to a slim, persistable shape: drop the in-memory object URL, the
 * legacy base64 image, and the per-colour reticle JPEGs (the heavy payload) so
 * localStorage never overflows. Colours and paint recipes are retained, so a
 * refresh restores the results; the image/reticle panels degrade gracefully.
 */
function toPersistableScan(result: ScanResult): ScanResult {
  return {
    ...result,
    imageUrl: undefined,
    imageData: undefined,
    detectedColors: result.detectedColors.map((c) => ({ ...c, reticle: undefined })),
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMode: null,
      currentScan: null,
      scanHistory: [],
      cart: [],
      isScanning: false,
      isLoading: false,
      error: null,
      offlineMode: false,
      preferredBrands: ['all'], // Default to showing all brands

      // Mode and scan actions
      setMode: (mode: ScanMode) => set({ currentMode: mode, error: null }),

      setScanResult: (result: ScanResult) => {
        // Revoke the previous scan's object URL before it is replaced so blob
        // URLs from earlier scans don't leak for the lifetime of the tab.
        revokeBlobUrl(get().currentScan?.imageUrl ?? undefined);
        try {
          const persistableResult = toPersistableScan(result);

          set((state) => ({
            currentScan: result, // Keep full result (image + reticles) in memory
            scanHistory: [persistableResult, ...state.scanHistory.slice(0, 9)], // Last 10, slim
            isScanning: false,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          // If still quota exceeded, clear history and try again
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            if (process.env.NODE_ENV === 'development') console.warn('LocalStorage quota exceeded, clearing scan history');
            set({
              currentScan: result,
              scanHistory: [], // Clear history to free space
              isScanning: false,
              isLoading: false,
              error: null,
            });
          } else {
            throw error;
          }
        }
      },

      clearCurrentScan: () => {
        // Release the current scan's blob URL before discarding it.
        revokeBlobUrl(get().currentScan?.imageUrl ?? undefined);
        set({
          currentScan: null,
          currentMode: null,
          error: null,
        });
      },

      // Cart actions
      addToCart: (paint: Paint, mode?: ScanMode, scanId?: string) =>
        set((state) => {
          // Log cart action for ML training
          mlLogger.logCartAction(scanId, 'add', paint.name, paint.brand);

          // Check if paint already exists in cart
          const existingItemIndex = state.cart.findIndex(
            (item) => item.paint.name === paint.name && item.paint.brand === paint.brand
          );

          if (existingItemIndex >= 0) {
            // Increase quantity
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += 1;
            return { cart: newCart };
          }

          // Add new item
          const newItem: CartItem = {
            paint,
            quantity: 1,
            addedFrom: mode,
            scanId,
          };

          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (paintId: string) =>
        set((state) => {
          // Find the item being removed to log it
          const removedItem = state.cart.find(
            (item) => `${item.paint.brand}-${item.paint.name}` === paintId
          );

          // Log cart removal for ML training (negative signal)
          if (removedItem) {
            mlLogger.logCartAction(
              removedItem.scanId,
              'remove',
              removedItem.paint.name,
              removedItem.paint.brand
            );
          }

          return {
            cart: state.cart.filter(
              (item) => `${item.paint.brand}-${item.paint.name}` !== paintId
            ),
          };
        }),

      updateQuantity: (paintId: string, quantity: number) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            `${item.paint.brand}-${item.paint.name}` === paintId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      // UI actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),

      // Offline mode
      setOfflineMode: (enabled: boolean) => set({ offlineMode: enabled }),

      // Brand preferences
      setPreferredBrands: (brands: string[]) => set({ preferredBrands: brands }),
    }),
    {
      name: 'schemestealer-storage', // LocalStorage key
      partialize: (state) => ({
        // Persist cart, scan history, a slim current scan (so results pages
        // survive a refresh), offline mode, and brand preferences. The current
        // scan is stripped of its image + reticles so it stays small.
        cart: state.cart,
        scanHistory: state.scanHistory,
        currentScan: state.currentScan ? toPersistableScan(state.currentScan) : null,
        preferredBrands: state.preferredBrands,
      }),
    }
  )
);
