/**
 * SurfaceCard — the standard grimdark panel.
 *
 * Dark themed surface + a single 1px tarnished/themed border + subtle inset depth
 * (reusing the existing .depth-* shadows). Replaces the rainbow / multi-stop
 * gradient borders. cogitator → brass frame; warp → purple frame.
 */

'use client';

import { type ReactNode } from 'react';
import { getThemeColors, type UITheme } from './theme';

interface SurfaceCardProps {
  theme: UITheme;
  children: ReactNode;
  /** Existing depth utility for the inset/drop shadow. */
  depth?: 'depth-1' | 'depth-2' | 'depth-3';
  /** Border tone: the themed card frame (default) or the bright primary accent. */
  tone?: 'frame' | 'primary';
  className?: string;
  style?: React.CSSProperties;
}

export function SurfaceCard({
  theme,
  children,
  depth = 'depth-2',
  tone = 'frame',
  className = '',
  style,
}: SurfaceCardProps) {
  const c = getThemeColors(theme);
  const borderColor = tone === 'primary' ? c.primary : c.frame;
  return (
    <div
      className={`rounded-lg ${depth} ${className}`}
      style={{
        background: c.surface,
        border: `1px solid ${borderColor}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default SurfaceCard;
