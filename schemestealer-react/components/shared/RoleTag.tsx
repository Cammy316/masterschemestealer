/**
 * RoleTag — thin-bordered, low-weight badge for BASE / SHADE / HIGHLIGHT / WASH.
 * Replaces the old heavy solid-block role labels.
 */

'use client';

import { type ReactNode } from 'react';
import { getThemeColors, type UITheme } from './theme';

interface RoleTagProps {
  theme: UITheme;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function RoleTag({ theme, children, className = '', style }: RoleTagProps) {
  const c = getThemeColors(theme);
  return (
    <span
      className={`inline-block text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${className}`}
      style={{
        border: `1px solid ${c.primary}`,
        color: c.primary,
        background: 'transparent',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export default RoleTag;
