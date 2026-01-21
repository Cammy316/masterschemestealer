# Warhammer 40K Transformation Guide

Complete guide for transforming SchemeSteal into an immersive W40K-themed experience.

## ✅ What's Been Built

### 1. **Complete Theme System** (`app/globals.css`)
- **Cogitator/Auspex Theme**: Green auspex displays, brass/bronze frames, gothic elements
- **Warp Portal Theme**: Purple/pink/teal chaos magic, ethereal glows, starfield backgrounds
- **Custom Fonts**: Cinzel (gothic), Rajdhani (tech), Orbitron (cyber)
- **CSS Animations**: Scanline effects, servo-skull spin, warp vortex, CRT flicker
- **Gothic Frame System**: Brass corners with imperial gold accents
- **Ethereal Effects**: Warp gradients, glows, and starfield backgrounds

### 2. **Hero Components**

#### **WarpPortal** (`components/inspiration/WarpPortal.tsx`)
The swirling magical portal for Inspiration mode:
- Multi-layered counter-rotating rings
- Pulsing ethereal core with energy bolts
- Floating particle effects
- "TOUCH THE VEIL" with gothic text
- Perfect centerpiece for Inspiration mode

#### **ReticleReveal** (`components/miniscan/ReticleReveal.tsx`)
The "magic moment" feature for Miniscan:
- **Hidden by default** - creates anticipation
- Smooth reveal animation with blur-to-focus
- Gothic frame with scanline effects
- Corner indicators when revealed
- **Viral potential** - perfect for sharing/screenshots

#### **LoadingAnimation** (`components/shared/LoadingAnimations.tsx`)
Theme-specific loaders:
- **ServoSkullLoading**: Spinning skull with rotating cogs, Gothic phrases
- **WarpVortexLoading**: Swirling vortex with mystical phrases
- Cycling phrases every 2 seconds
- Full-screen overlays with animations

---

## 🎯 How to Complete the Transformation

### Architecture Overview

```
schemestealer-react/
├── app/
│   ├── globals.css                    ✅ DONE - Complete theme system
│   ├── page.tsx                       📝 TODO - Add mode selector UI
│   ├── layout.tsx                     📝 TODO - Add themed layout
│   ├── miniature/
│   │   ├── page.tsx                   📝 TODO - Transform with Cogitator theme
│   │   └── results/page.tsx           📝 TODO - Add ReticleReveal integration
│   ├── inspiration/
│   │   ├── page.tsx                   📝 TODO - Add WarpPortal
│   │   └── results/page.tsx           📝 TODO - Add color palette display
│   └── cart/page.tsx                  📝 TODO - Add themed cart with affiliates
│
├── components/
│   ├── inspiration/
│   │   ├── WarpPortal.tsx             ✅ DONE
│   │   ├── ColorPalette.tsx           📝 TODO
│   │   └── PaintSuggestion.tsx        📝 TODO
│   ├── miniscan/
│   │   ├── ReticleReveal.tsx          ✅ DONE
│   │   ├── CogitatorUpload.tsx        📝 TODO
│   │   ├── ColorResult.tsx            📝 TODO
│   │   └── PaintFormulation.tsx       📝 TODO
│   ├── shared/
│   │   ├── LoadingAnimations.tsx      ✅ DONE
│   │   ├── Navigation.tsx             📝 TODO
│   │   ├── ThemedButton.tsx           📝 TODO
│   │   ├── BrandSelector.tsx          📝 TODO
│   │   └── RegionSelector.tsx         📝 TODO
│   └── ...existing components
```

---

## 📝 Component Patterns and Examples

### Pattern 1: Themed Button Component

```typescript
// components/shared/ThemedButton.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ThemedButtonProps {
  children: React.ReactNode;
  theme: 'cogitator' | 'warp' | 'neutral';
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function ThemedButton({
  children,
  theme = 'neutral',
  onClick,
  disabled = false,
  size = 'md',
  fullWidth = false,
}: ThemedButtonProps) {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  };

  const themeStyles = {
    cogitator: {
      background: 'linear-gradient(135deg, var(--cogitator-green-dark), var(--cogitator-green-dim))',
      border: '2px solid var(--cogitator-green)',
      color: 'var(--cogitator-green)',
      glow: '0 0 20px var(--cogitator-green-glow)',
    },
    warp: {
      background: 'linear-gradient(135deg, var(--warp-purple-dark), var(--warp-pink))',
      border: '2px solid var(--warp-purple-light)',
      color: 'white',
      glow: '0 0 20px var(--ethereal-glow)',
    },
    neutral: {
      background: 'linear-gradient(135deg, var(--charcoal), var(--dark-gothic))',
      border: '2px solid var(--brass)',
      color: 'var(--brass)',
      glow: '0 0 10px var(--brass)',
    },
  };

  const style = themeStyles[theme];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-bold cyber-text touch-target
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      style={{
        background: style.background,
        border: style.border,
        color: style.color,
      }}
      whileHover={disabled ? {} : {
        scale: 1.02,
        boxShadow: style.glow,
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.button>
  );
}
```

### Pattern 2: Cogitator Upload Area

```typescript
// components/miniscan/CogitatorUpload.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CogitatorUploadProps {
  onFileSelect: (file: File) => void;
  onCameraActivate: () => void;
}

export function CogitatorUpload({ onFileSelect, onCameraActivate }: CogitatorUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="relative">
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Gothic frame container */}
      <div className="gothic-frame rounded-lg p-1">
        <div className="bg-dark-gothic rounded-lg p-8">
          {/* Skull icon with glow */}
          <motion.div
            className="text-6xl text-center mb-4"
            animate={{
              textShadow: [
                '0 0 10px var(--cogitator-green-glow)',
                '0 0 20px var(--cogitator-green-glow)',
                '0 0 10px var(--cogitator-green-glow)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💀
          </motion.div>

          {/* Title */}
          <h2 className="auspex-text text-xl font-bold text-center mb-2 gothic-text">
            ◆ INITIALIZE AUSPEX SCAN ◆
          </h2>
          <p className="text-cogitator-green-dim text-sm text-center mb-6 tech-text">
            Upload cogitator data or activate pict-capture servo-skull
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <motion.button
              onClick={onCameraActivate}
              className="w-full py-4 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic/50 hover:bg-dark-gothic"
              whileHover={{
                boxShadow: '0 0 20px var(--cogitator-green-glow)',
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📸</span>
                <span className="auspex-text font-bold cyber-text">
                  ACTIVATE PICT-CAPTURE
                </span>
              </div>
            </motion.button>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-cogitator"
              />
              <label htmlFor="file-upload-cogitator">
                <motion.div
                  className="w-full py-4 px-6 rounded-lg border-2 border-brass bg-dark-gothic/50 hover:bg-dark-gothic cursor-pointer"
                  whileHover={{
                    boxShadow: '0 0 15px var(--brass)',
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">📁</span>
                    <span className="text-brass font-bold cyber-text">
                      UPLOAD FROM ARCHIVE
                    </span>
                  </div>
                </motion.div>
              </label>
            </div>
          </div>

          {/* Info text */}
          <p className="text-center text-xs text-text-tertiary mt-4 tech-text">
            Recommended: Clear lighting, miniature centered
          </p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-imperial-gold" />
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-imperial-gold" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-imperial-gold" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-imperial-gold" />
    </div>
  );
}
```

### Pattern 3: Themed Navigation Bar

```typescript
// components/shared/Navigation.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export function Navigation() {
  const pathname = usePathname();
  const cart = useAppStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isMiniscan = pathname.startsWith('/miniature');
  const isInspiration = pathname.startsWith('/inspiration');
  const isCart = pathname.startsWith('/cart');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      style={{
        background: 'linear-gradient(to top, var(--void-black), var(--dark-gothic))',
        borderTop: '2px solid var(--brass)',
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {/* Miniscan Tab */}
          <NavLink
            href="/miniature"
            icon="💀"
            label="Miniscan"
            isActive={isMiniscan}
            theme="cogitator"
          />

          {/* Cart Tab */}
          <NavLink
            href="/cart"
            icon="🛒"
            label="Cart"
            isActive={isCart}
            theme="neutral"
            badge={totalItems > 0 ? totalItems : undefined}
          />

          {/* Inspiration Tab */}
          <NavLink
            href="/inspiration"
            icon="✨"
            label="Inspiration"
            isActive={isInspiration}
            theme="warp"
          />
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  icon: string;
  label: string;
  isActive: boolean;
  theme: 'cogitator' | 'warp' | 'neutral';
  badge?: number;
}

function NavLink({ href, icon, label, isActive, theme, badge }: NavLinkProps) {
  const themeColors = {
    cogitator: {
      active: 'var(--cogitator-green)',
      bg: 'rgba(0, 255, 65, 0.1)',
    },
    warp: {
      active: 'var(--warp-purple-light)',
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    neutral: {
      active: 'var(--brass)',
      bg: 'rgba(184, 134, 11, 0.1)',
    },
  };

  const colors = themeColors[theme];

  return (
    <Link href={href} className="relative">
      <motion.div
        className={`
          flex flex-col items-center justify-center
          px-4 py-2 rounded-lg min-w-[64px] touch-target
          ${isActive ? 'font-bold' : 'opacity-70'}
        `}
        style={{
          backgroundColor: isActive ? colors.bg : 'transparent',
          color: isActive ? colors.active : 'var(--text-secondary)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-2xl mb-1">{icon}</div>
        <span className="text-xs cyber-text">{label}</span>
      </motion.div>

      {/* Badge */}
      {badge !== undefined && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          {badge > 9 ? '9+' : badge}
        </motion.div>
      )}
    </Link>
  );
}
```

---

## 🎨 Integration Examples

### Example 1: Update Miniature Page

```typescript
// app/miniature/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { scanMiniature } from '@/lib/api';
import { CogitatorUpload } from '@/components/miniscan/CogitatorUpload';
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';

export default function MiniscanPage() {
  const router = useRouter();
  const { setMode, setScanResult } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setMode('miniature');
  }, [setMode]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await scanMiniature(file);
      setScanResult(result);
      router.push('/miniature/results');
    } catch (err) {
      setError('Failed to scan miniature. Please try again.');
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return <LoadingAnimation mode="miniature" />;
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4" style={{ background: 'var(--void-black)' }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold gothic-text mb-2 auspex-text">
          ◆ MINISCAN PROTOCOL ◆
        </h1>
        <p className="text-cogitator-green-dim tech-text">
          Identify paint formulations from painted miniatures
        </p>
      </div>

      {/* Upload Area */}
      <div className="max-w-2xl mx-auto">
        <CogitatorUpload
          onFileSelect={handleFileSelect}
          onCameraActivate={() => {
            // Trigger camera
            document.getElementById('camera-input')?.click();
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="max-w-2xl mx-auto mt-4 p-4 rounded-lg bg-error/20 border border-error">
          <p className="text-error text-center">{error}</p>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Update Results Page with ReticleReveal

```typescript
// app/miniature/results/page.tsx
'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ReticleReveal } from '@/components/miniscan/ReticleReveal';
import { PaintCard } from '@/components/PaintCard';

export default function MiniscanResults() {
  const { currentScan } = useAppStore();

  if (!currentScan) {
    return <div>No scan data available</div>;
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4" style={{ background: 'var(--void-black)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold gothic-text mb-6 auspex-text text-center">
          ◆ SCAN COMPLETE ◆
        </h1>

        {/* Detected Colors */}
        <div className="space-y-6">
          {currentScan.detectedColors.map((color, index) => (
            <div key={index} className="gothic-frame rounded-lg p-1">
              <div className="bg-dark-gothic rounded-lg p-4">
                {/* Color Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-cogitator-green auspex-glow"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <h3 className="text-xl font-bold auspex-text gothic-text">
                      {color.family}
                    </h3>
                    <p className="text-sm text-cogitator-green-dim">
                      Coverage: {color.percentage.toFixed(1)}% | {color.hex}
                    </p>
                  </div>
                </div>

                {/* Reticle Reveal - THE MAGIC MOMENT */}
                <ReticleReveal
                  colorName={color.family}
                  colorHex={color.hex}
                  reticleImage={currentScan.reticleImages?.[index]}
                />

                {/* Paint Recommendations */}
                <div className="mt-6">
                  <h4 className="text-sm font-bold auspex-text mb-3 gothic-text">
                    ◆ SACRED FORMULATIONS ◆
                  </h4>
                  <div className="space-y-2">
                    {/* Add PaintCard components here */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 Remaining Tasks Checklist

### High Priority (Core Experience)
- [ ] Update `/miniature/page.tsx` with Cogitator theme
- [ ] Update `/inspiration/page.tsx` with Warp Portal
- [ ] Update `/miniature/results/page.tsx` with ReticleReveal
- [ ] Update `/inspiration/results/page.tsx` with color palette
- [ ] Create themed Navigation component
- [ ] Update home page with mode selector

### Medium Priority (Polish)
- [ ] Create CogitatorUpload component
- [ ] Create ColorPalette component (Inspiration)
- [ ] Create PaintFormulation component (Miniscan)
- [ ] Update PaintCard with theme variants
- [ ] Create BrandSelector with localStorage
- [ ] Create RegionSelector with localStorage

### Low Priority (Nice to Have)
- [ ] Add affiliate links section to cart
- [ ] Add scan history with localStorage
- [ ] Add share feature for results
- [ ] Add feedback system
- [ ] Add PWA manifest with W40K icons

---

## 📱 Testing Checklist

### Visual/Theme
- [ ] Cogitator theme displays correctly (green, brass, gothic)
- [ ] Warp Portal animates smoothly (60fps)
- [ ] Scanline effects visible but not distracting
- [ ] Gothic frames render with corners
- [ ] Fonts load correctly (Cinzel, Rajdhani, Orbitron)

### Functionality
- [ ] Warp Portal responds to touch
- [ ] ReticleReveal expands/collapses smoothly
- [ ] Loading animations cycle through phrases
- [ ] Navigation shows correct active state
- [ ] Cart badge updates with item count

### Performance
- [ ] Animations run at 60fps on mobile
- [ ] No janky scrolling
- [ ] Images load progressively
- [ ] Reduced motion respects user preference

### Mobile
- [ ] Works on 375px viewport (iPhone SE)
- [ ] Touch targets are 44px minimum
- [ ] No horizontal scroll
- [ ] Safe area insets respected
- [ ] Bottom nav doesn't overlap content

---

## 💡 Pro Tips

1. **Use the Theme Classes**: Don't reinvent - use `.auspex-text`, `.warp-text`, `.gothic-text`, etc.

2. **Leverage Framer Motion**: All hero components use it - consistent animation API

3. **Test on Real Device**: Emulators don't show true animation performance

4. **Mobile First**: Design for 375px, then scale up

5. **Don't Overdo Gothic**: Less is more - clean functional UI with W40K flavor

6. **The Portal is the Hero**: Spend extra time making it magical

7. **Reticle Reveal is the Viral Moment**: Make it feel special and shareable

---

## 🎯 Success Metrics

**Core Experience:**
- ✅ Cogitator theme feels immersive but not cluttered
- ✅ Warp Portal feels magical and alive
- ✅ Reticle Reveal creates a "wow" moment
- ✅ Loading animations prevent boredom
- ✅ Navigation makes mode switching clear

**Technical:**
- ✅ Animations run at 60fps
- ✅ No layout shift during load
- ✅ Works offline (with PWA)
- ✅ Accessible (keyboard nav, reduced motion)

**Viral Potential:**
- ✅ Reticle reveal is screenshot-worthy
- ✅ Color palettes are shareable
- ✅ Unique W40K aesthetic stands out

---

Built with ❤️ for the Emperor and the Warhammer community!
