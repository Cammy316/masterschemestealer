/**
 * Custom hook for localStorage with SSR safety
 */

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize with initialValue for SSR, then sync with localStorage on mount
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  // Update localStorage when value changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook specifically for managing owned paints
 */
export function useOwnedPaints() {
  const [ownedPaints, setOwnedPaints] = useLocalStorage<string[]>('schemestealer-owned-paints', []);

  const addOwnedPaint = useCallback((paintId: string) => {
    setOwnedPaints((prev) => {
      if (prev.includes(paintId)) return prev;
      return [...prev, paintId];
    });
  }, [setOwnedPaints]);

  const removeOwnedPaint = useCallback((paintId: string) => {
    setOwnedPaints((prev) => prev.filter((id) => id !== paintId));
  }, [setOwnedPaints]);

  const toggleOwnedPaint = useCallback((paintId: string) => {
    setOwnedPaints((prev) => {
      if (prev.includes(paintId)) {
        return prev.filter((id) => id !== paintId);
      }
      return [...prev, paintId];
    });
  }, [setOwnedPaints]);

  const isOwned = useCallback((paintId: string) => {
    return ownedPaints.includes(paintId);
  }, [ownedPaints]);

  return {
    ownedPaints,
    addOwnedPaint,
    removeOwnedPaint,
    toggleOwnedPaint,
    isOwned,
  };
}

export default useLocalStorage;
