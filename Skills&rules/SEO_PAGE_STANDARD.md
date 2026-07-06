# SchemeStealer SEO Page Design Standard

This document outlines the visual identity and structural layout requirements for any programmatic or static SEO-focused pages (e.g. `/convert/`, `/paints/`) in the application.

## 1. Page Background and Constraints
All SEO pages must be wrapped in a root `<main>` component with the following foundational Tailwind classes:
- `min-h-screen bg-void-black text-white pb-nav-safe`
- The inner content container should be clamped and centered using `max-w-4xl mx-auto px-4 py-12`.

## 2. Universal Header Branding (Double-Auspex)
At the very top of the content container, there must be a centered link returning to `/` featuring the dual auspex eye motif. This indicates the "cogitator" is watching.

```tsx
<div className="flex justify-center mb-12">
  <Link href="/" className="gothic-text text-2xl sm:text-3xl text-brass hover:text-imperial-gold transition-colors tracking-widest text-shadow flex items-center gap-3">
    {/* Left Auspex (Green) */}
    <div className="w-6 h-6 rounded-full border-2 border-brass flex items-center justify-center relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-brass/20"></div>
      <div className="w-2 h-2 bg-cogitator-green rounded-full shadow-[0_0_10px_#00ff41]"></div>
    </div>
    
    SCHEMESTEALER
    
    {/* Right Auspex (Red) */}
    <div className="w-6 h-6 rounded-full border-2 border-brass flex items-center justify-center relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-brass/20"></div>
      <div className="w-2 h-2 bg-error rounded-full shadow-[0_0_10px_#ff0000]"></div>
    </div>
  </Link>
</div>
```

## 3. Title Typography
The main H1 heading and its subtitles must follow the strict typography hierarchy below to maximize both readability and thematic impact:

- **Eyebrow / Brand Subtitle**: 
  - `text-brass uppercase tracking-widest text-sm md:text-base font-bold mb-3 drop-shadow-md`
- **Main Heading (H1)**: 
  - `text-5xl md:text-7xl gothic-text text-white mb-3 tracking-tight drop-shadow-lg`
- **Secondary Subtitle (Old Names, etc.)**: 
  - `text-gray-400 text-lg md:text-xl italic mb-6 font-serif`

## 4. Hex Badges
Do not use raw dynamic text colors for primary data points like Hex codes, as some paint colors (like deep reds or blacks) fail accessibility and contrast checks against the `bg-void-black` background.
Instead, use the standardized `CopyHexBadge` client component.

If replicating styling manually:
- Use `text-imperial-gold` and `drop-shadow-[0_0_8px_currentColor]`.

## 5. Call to Action (CTA)
The bottom of every SEO page must funnel the user back to the primary interactive utility (`/miniature`).

```tsx
<div className="mt-20 pt-10 border-t border-gray-800/50 text-center">
  <Link href="/miniature" className="inline-block bg-void-black border-2 border-brass text-brass hover:text-imperial-gold hover:border-imperial-gold font-bold tracking-widest uppercase px-8 py-4 rounded-sm hover:shadow-[0_0_15px_rgba(184,134,11,0.3)] transition-all text-shadow">
    Scan Your Own Miniature
  </Link>
</div>
```

*By adhering to this standard, all auto-generated content pages will maintain consistent UX and brand aesthetic without the need for isolated CSS tweaking.*
