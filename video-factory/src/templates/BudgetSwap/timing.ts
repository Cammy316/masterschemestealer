// Timing manifest kept free of React/font imports so the Node CLI + QA can import it
// without booting the browser-only font loader.
import type { TemplateManifest } from '../manifest.js';

export const budgetSwapManifest: TemplateManifest = {
  id: 't2',
  label: 'Budget Swap',
  durationInFrames: 660,
  fps: 30,
  hookEndFrame: 90,
  loopCloses: true,
  // Frames chosen at the SETTLED state of each beat (past the entrance springs) so QA
  // thumbnails capture the real content, not a mid-animation scale-0.
  beats: [
    { name: 'hook-price-tag', frame: 30 },
    { name: 'merge-settled', frame: 150 },
    { name: 'verdict-stamp', frame: 260 },
    { name: 'price-counter', frame: 430 },
    { name: 'cta', frame: 540 },
    { name: 'loop-close', frame: 645 },
  ],
};
