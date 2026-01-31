/**
 * Skeleton loading components for smooth content appearance
 */

'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  mode?: 'miniature' | 'inspiration';
}

/**
 * Base skeleton with shimmer animation
 */
export function Skeleton({ className = '', mode = 'miniature' }: SkeletonProps) {
  const baseColor = mode === 'miniature' ? 'bg-gray-700' : 'bg-gray-800';
  const shimmerColor = mode === 'miniature'
    ? 'via-green-500/10'
    : 'via-purple-500/10';

  return (
    <div
      className={`relative overflow-hidden rounded ${baseColor} ${className}`}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r from-transparent ${shimmerColor} to-transparent`}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

/**
 * Skeleton for color cards in results
 */
export function ColorCardSkeleton({ mode = 'miniature' }: { mode?: 'miniature' | 'inspiration' }) {
  return (
    <div className="animate-pulse space-y-4 p-4 rounded-lg border border-gray-700 bg-gray-900/50">
      {/* Color swatch placeholder */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-lg" mode={mode} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-24" mode={mode} />
          <Skeleton className="h-4 w-32" mode={mode} />
        </div>
      </div>

      {/* Recipe steps placeholder */}
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="w-10 h-10 rounded" mode={mode} />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-16" mode={mode} />
              <Skeleton className="h-5 w-32" mode={mode} />
            </div>
            <Skeleton className="h-8 w-12 rounded" mode={mode} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for paint recipe card
 */
export function PaintRecipeCardSkeleton({ mode = 'miniature' }: { mode?: 'miniature' | 'inspiration' }) {
  const borderColor = mode === 'miniature' ? 'border-green-500/30' : 'border-purple-500/30';

  return (
    <div className={`rounded-lg border-2 ${borderColor} overflow-hidden`}>
      {/* Brand tabs skeleton */}
      <div className="flex bg-gray-900/80">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 py-3 px-2">
            <Skeleton className="h-5 w-full" mode={mode} />
          </div>
        ))}
      </div>

      {/* Recipe steps skeleton */}
      <div className="p-4 space-y-3 bg-gray-900/50">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded bg-gray-800/50">
            <Skeleton className="w-10 h-10 rounded flex-shrink-0" mode={mode} />
            <div className="flex-1 min-w-0 space-y-1">
              <Skeleton className="h-4 w-16" mode={mode} />
              <Skeleton className="h-5 w-28" mode={mode} />
            </div>
            <Skeleton className="h-8 w-12 rounded flex-shrink-0" mode={mode} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for the full results page
 */
export function ResultsPageSkeleton({ mode = 'miniature' }: { mode?: 'miniature' | 'inspiration' }) {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto" mode={mode} />
        <Skeleton className="h-4 w-64 mx-auto" mode={mode} />
      </div>

      {/* Color cards skeleton */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <ColorCardSkeleton mode={mode} />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Skeleton for color palette swatches
 */
export function ColorSwatchSkeleton({ mode = 'miniature' }: { mode?: 'miniature' | 'inspiration' }) {
  return (
    <div className="animate-pulse">
      <Skeleton className="w-full h-24 rounded-lg mb-3" mode={mode} />
      <div className="space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" mode={mode} />
          <Skeleton className="h-4 w-8" mode={mode} />
        </div>
        <Skeleton className="h-4 w-20" mode={mode} />
      </div>
    </div>
  );
}

export default Skeleton;
