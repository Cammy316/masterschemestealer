/**
 * SlabButton — heavy primary CTA.
 *
 * A dark obsidian/void slab with a 1px themed border and an ETHEREAL text-shadow
 * on the label itself (so the text glows like a rune) rather than a big neon
 * background glow. Replaces the bright multi-stop gradient CTAs.
 */

'use client';

import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { getThemeColors, type UITheme } from './theme';

interface SlabButtonProps extends HTMLMotionProps<'button'> {
  theme: UITheme;
  children: ReactNode;
}

export function SlabButton({ theme, children, className = '', style, ...rest }: SlabButtonProps) {
  const c = getThemeColors(theme);
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ borderColor: c.primaryLight }}
      className={`w-full rounded-lg py-4 px-6 touch-target font-bold gothic-text tracking-wider ${className}`}
      style={{
        background: c.surfaceDeep,
        border: `1px solid ${c.primary}`,
        color: c.primaryLight,
        textShadow: `0 0 8px ${c.glow}, 0 0 18px ${c.glow}`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export default SlabButton;
