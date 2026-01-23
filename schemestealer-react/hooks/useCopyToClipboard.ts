import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetDelay: number = 2000) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch (error) {
      console.error('Copy failed:', error);
      return false;
    }
  }, [resetDelay]);

  return { copied, copyToClipboard };
}
