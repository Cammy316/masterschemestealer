import { useState, useCallback } from 'react';

interface CopyState {
  copied: boolean;
  copiedText: string | null;
}

export function useCopyToClipboard(resetDelay: number = 2000) {
  const [copyState, setCopyState] = useState<CopyState>({
    copied: false,
    copiedText: null,
  });

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState({ copied: true, copiedText: text });

      // Reset after delay
      setTimeout(() => {
        setCopyState({ copied: false, copiedText: null });
      }, resetDelay);

      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, [resetDelay]);

  return { ...copyState, copyToClipboard };
}
