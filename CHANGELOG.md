# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-07-07
### Fixed
- **Yellow-detail regression (Pink Horror beak)**: the darker-half base-coat bias in
  `_combine_clusters` fired on dark *chromatic* shadow merges and manufactured a spurious
  dark "Brown" card that evicted vivid painted details from the five displayed colours.
  The bias now requires the union median to classify as a neutral family via the single
  canonical classifier, and a vividness-protected display cap (`config.Display` +
  `_protect_vivid_details`) stops dull dark minor cards displacing vivid details.
- **Auspex Reveal spatial contract**: reticle coordinates were axis-swapped and normalised
  by the wrong dimension (markers left the frame on portrait crops); masks were opaque
  1-bit PNGs so the alpha-keyed clip tinted the whole frame; and the alpha-bbox crop
  offset was never transmitted, stretching masks over the uncropped photo. The backend now
  emits full-frame normalised positions (`reproject_to_frame`), RGBA alpha masks, and a
  `mask_frame` carrying crop geometry; the frontend composites masks into the crop rect
  (`lib/maskGeometry.ts`).
- **CORS**: narrowed the preview-origin regex from any `*.vercel.app` (any Vercel site
  could make credentialed calls) to this project's preview hostnames.
- **PWA icons**: generated the missing `public/icons/` PNGs referenced by `manifest.ts`
  (placeholder reticle art — swap for brand art when available).
- **Persistence-mode log** now emitted from the lifespan handler so the INFO line is
  visible; required Render dashboard secrets documented in `render.yaml`.
- **Frontend `.gitignore` encoding**: the playwright-report/test-results patterns had been
  appended as UTF-16 (unparseable by git — why test artifacts kept getting committed);
  rewritten as UTF-8.

### Changed
- **Auspex Reveal redesign**: regions now reveal the user's *actual paint* at full
  brightness out of a dimmed tactical frame with a hue-matched rim glow and settle pulse
  (pre-rendered layers + rAF); numbered DOM chips with staggered pop-in replace the
  canvas-drawn chips.
- Untracked runtime/PII artefacts (`python-api/data/ml`, `data/analytics`, backend log,
  playwright-report, test-results); removed the stray `fix.js` codemod.

### Added
- Tests locking the fixes: `test_spatial_contract.py`, `test_display_cap.py`,
  `maskGeometry.test.ts`, extraction-bias tests, a yellow-beak assertion on the synthetic
  scene, and displayed-five guards on the real photo fixtures (production-like flood-key
  masks).
- `Skills&rules/` planning docs: `NEW_IDEAS_IMPLEMENTATION.md`, `SOCIAL_MEDIA_CAMPAIGN.md`,
  updated `SCHEMESTEALER_MEGA_ROADMAP.md` and `architecture.md` (issue register §9).

### Removed
- Untracked the swatch-source reference PDF (local working material — must never be
  published; note it remains in earlier git history) and a stale embedded-repo gitlink;
  superseded prompt/role docs moved to the local-only `Skills&rules/OLS/` archive.
- Skill docs now refer to "the swatch source" generically — the attribution invariant now
  applies to its own wording.

## [Unreleased] - 2026-07-06
### Added
- **PWA & Offline Readiness**: Added `manifest.ts` and `next-pwa` configuration to support local installation and caching.
- **Offline Machine Spirit**: Added offline support in `useScan.ts`, allowing users to optionally skip the backend and use the local on-device K-Means engine.
- **CI/CD Workflows**: Added comprehensive `.github/workflows/ci.yml` for automated testing.
- **Automated Tests**: Added Python API tests (`test_auth.py`) to verify the new Analytics Admin Key enforcement.
- **Consent Banner**: Added a non-intrusive toast-style consent banner (`ConsentBanner.tsx`) to manage telemetry opt-in for analytics.
- **Dynamic Exit-Intent Feedback**: Implemented interruption stacking in `useFeedbackPrompt.ts` with a 30s delay, firing once per session to improve UX without being annoying.
- **Metadata Generation**: Added dynamic OpenGraph image generation (`opengraph-image.tsx`) and enhanced Twitter metadata tags for `/convert` routes.

### Changed
- **SEO & Layout**: Completely overhauled the Paint Hub pages (`/paints/[brand]/[slug]`) with double-auspex branding, cross-brand comparisons sorted by `ΔE`, and glowing Hex Badges (`CopyHexBadge.tsx`).
- **Performance & Asset Loading**:
  - Dynamically imported `paints_groundtruth.json` in Forge components to reduce the initial bundle size by over ~600KB.
  - Implemented module-level caching for `conversions.json` in `/convert/[conversionSlug]` to prevent redundant parsing.
  - Replaced standard font `@import` rules with `next/font/google` for optimal web font loading.
  - Added `<MotionConfig reducedMotion="user">` for `framer-motion` to respect OS-level accessibility preferences.
- **Accessibility Enhancements**:
  - Migrated `FeedbackModal`, `ShareModal`, and `AddPaintModal` to Headless UI `<Dialog>` for robust focus trapping and screen-reader support.
  - Increased touch target sizes on `InfoTooltip`, `HexChip`, `CustomDropdown`, and `RecipeHistory`.
  - Added `aria-current` and `aria-hidden` attributes to Navigation icons.
- **UI & Styling Refinements**:
  - Migrated extensive inline styles (e.g. `style={{ backgroundColor: ... }}`) to utility Tailwind tokens across global components and the Forge interface.
  - Changed root background color to `bg-[#050505]` to eliminate white flashes on route transitions.
  - Replaced infinite CSS `boxShadow` pulse animations with performant GPU-accelerated opacity cross-fades.
- **Code Organization (Rules & Skills)**:
  - Consolidating agent behaviors into the `Skills&rules/` directory (e.g. `GEMINI.md`, `Next.js 15 & Tailwind Strict.md`, `architecture.md`, `you-are-a-senior-cheeky-avalanche.md`).
- **Playwright Configuration**: Updated Playwright config to isolate `*.spec.ts` files from Vitest tests.

### Fixed
- Fixed Next.js 15 React hooks purity errors in `ActiveAuspexScan` by properly wrapping `Math.random` generated IDs in `React.useMemo`.
- Fixed `ReferenceError: dataSeq is not defined` missing variable declarations after purity refactor.
- Fixed hydration mismatches in `InventoryHexGrid` caused by nesting standard `<button>` tags within `framer-motion` `<motion.button>` elements.
- Corrected type mismatches in `lib/colorMath.ts` by defining `types/spectral.d.ts` and removing dirty `any` casts.
- Fixed prop inconsistencies between `Forge` page and `AddPaintModal`.

### Removed
- Removed the deprecated and broken `Camera.tsx` component.
- Removed unused UI primitives (`Button.tsx` and `Card.tsx`).
- Removed the outdated "MACHINE SPIRIT AWAKENING" cold-start theatre delay to ungate upload interaction directly upon load.
