/**
 * RecipeHistory - Displays saved scan results from localStorage
 * Allows users to revisit past scans
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { formatTimestamp } from '@/lib/utils';
import type { ScanResult } from '@/lib/types';

interface RecipeHistoryProps {
  mode?: 'miniature' | 'inspiration' | 'all';
  maxItems?: number;
  onSelectScan?: (scan: ScanResult) => void;
}

export function RecipeHistory({
  mode = 'all',
  maxItems = 10,
  onSelectScan,
}: RecipeHistoryProps) {
  const { scanHistory } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter by mode if specified
  const filteredHistory = scanHistory
    .filter((scan) => mode === 'all' || scan.mode === mode)
    .slice(0, maxItems);

  if (filteredHistory.length === 0) {
    return null;
  }

  const themeColors = mode === 'miniature'
    ? { border: 'border-green-500/30', text: 'text-green-500', bg: 'bg-green-600/20' }
    : mode === 'inspiration'
    ? { border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-600/20' }
    : { border: 'border-gray-600', text: 'text-gray-400', bg: 'bg-gray-700/30' };

  return (
    <div className={`rounded-lg border ${themeColors.border} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-900/80 hover:bg-gray-900 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={themeColors.text}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className={`font-semibold ${themeColors.text}`}>
            Recipe History
          </span>
          <span className="text-xs text-gray-500">
            ({filteredHistory.length} scan{filteredHistory.length !== 1 ? 's' : ''})
          </span>
        </div>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-400"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      {/* History List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="divide-y divide-gray-800">
              {filteredHistory.map((scan) => (
                <HistoryCard
                  key={scan.id}
                  scan={scan}
                  onSelect={onSelectScan}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface HistoryCardProps {
  scan: ScanResult;
  onSelect?: (scan: ScanResult) => void;
}

function HistoryCard({ scan, onSelect }: HistoryCardProps) {
  const modeColors = scan.mode === 'miniature'
    ? { badge: 'bg-green-600/20 text-green-400', icon: '🔬' }
    : { badge: 'bg-purple-600/20 text-purple-400', icon: '✨' };

  const colorCount = scan.detectedColors.length;
  const topColors = scan.detectedColors.slice(0, 4);

  return (
    <motion.button
      onClick={() => onSelect?.(scan)}
      className="w-full p-4 bg-gray-900/50 hover:bg-gray-800/50 transition-colors text-left"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      disabled={!onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Color Preview */}
        <div className="flex-shrink-0">
          <div className="flex -space-x-1">
            {topColors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-gray-800"
                style={{ backgroundColor: color.hex, zIndex: 4 - i }}
              />
            ))}
          </div>
        </div>

        {/* Scan Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded ${modeColors.badge}`}>
              {modeColors.icon} {scan.mode === 'miniature' ? 'Miniscan' : 'Inspiration'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimestamp(scan.timestamp)}
            </span>
          </div>
          <p className="text-sm text-white font-medium truncate">
            {colorCount} color{colorCount !== 1 ? 's' : ''} detected
          </p>
          <p className="text-xs text-gray-500 truncate">
            {topColors.map((c) => c.family || c.hex).join(', ')}
          </p>
        </div>

        {/* Arrow indicator if clickable */}
        {onSelect && (
          <div className="flex-shrink-0 text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default RecipeHistory;
