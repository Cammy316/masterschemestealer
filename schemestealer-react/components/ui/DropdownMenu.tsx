/**
 * Portal-based dropdown menu.
 *
 * Renders the open menu into document.body so it escapes any ancestor stacking
 * context (e.g. a framer-motion `transform` wrapper or a gradient-bordered card),
 * which otherwise traps an absolutely-positioned menu under sibling panels. The
 * menu is fully opaque, sits at --z-dropdown (above content + nav, below modals),
 * tracks the trigger on scroll/resize, and closes on outside-click or Esc.
 */

'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

interface DropdownMenuProps {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  align?: 'left' | 'right';
  width?: number;
}

export function DropdownMenu({
  anchorRef,
  open,
  onClose,
  children,
  align = 'right',
  width = 224,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Portal target (document.body) only exists on the client; defer until mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const reposition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rawLeft = align === 'right' ? r.right - width : r.left;
    const left = Math.max(8, Math.min(rawLeft, window.innerWidth - width - 8));
    setCoords({ top: r.bottom + 8, left });
  }, [anchorRef, align, width]);

  useLayoutEffect(() => {
    if (open) reposition();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;

    const onScrollResize = () => reposition();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || anchorRef.current?.contains(target)) return;
      onClose();
    };

    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open, onClose, reposition, anchorRef]);

  if (!mounted || !open || !coords) return null;

  return createPortal(
    <div
      ref={menuRef}
      role="listbox"
      className="rounded-lg overflow-hidden"
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        width,
        zIndex: 'var(--z-dropdown)',
        background: 'var(--dark-gothic)',
        border: '2px solid var(--brass)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
      }}
    >
      {children}
    </div>,
    document.body
  );
}

export default DropdownMenu;
