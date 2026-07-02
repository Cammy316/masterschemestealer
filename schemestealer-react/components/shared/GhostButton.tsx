/**
 * GhostButton — theme-aware low-noise action button.
 *
 * Default: near-transparent fill + 1px themed border + themed text.
 * Pressed / `active`: flashes to a solid themed fill with dark-on-light text.
 * Replaces the old solid neon "Add" buttons across the recipe matrices.
 */

'use client';

import { useState, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { getThemeColors, type UITheme } from './theme';

interface GhostButtonProps extends HTMLMotionProps<'button'> {
  theme: UITheme;
  /** Render permanently in the filled state (e.g. a toggled-on control). */
  active?: boolean;
  children: ReactNode;
}

export function GhostButton({
  theme,
  active = false,
  children,
  className = '',
  style,
  ...rest
}: GhostButtonProps) {
  const c = getThemeColors(theme);
  const [pressed, setPressed] = useState(false);
  const filled = active || pressed;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`rounded touch-target text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
      style={{
        background: filled ? c.primary : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${c.primary}`,
        color: filled ? c.onPrimary : c.primary,
        outlineColor: c.primary,
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export default GhostButton;
