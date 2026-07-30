// Timing manifest kept free of React/font imports so the Node CLI + QA can import it
// without booting the browser-only font loader.
import type { TemplateManifest } from '../manifest.js';

export const swatchleManifest: TemplateManifest = {
  id: 't1',
  label: 'Swatchle',
  durationInFrames: 840,
  fps: 30,
  hookEndFrame: 90,
  loopCloses: true,
  // Frames chosen at the SETTLED state of each beat (past the entrance springs) so QA
  // thumbnails capture the real content, not a mid-animation scale-0.
  beats: [
    { name: 'hook-garble', frame: 40 },
    { name: 'decoy-1', frame: 150 },
    { name: 'decoy-2', frame: 240 },
    { name: 'decoy-3', frame: 330 },
    { name: 'hints', frame: 500 },
    { name: 'reveal', frame: 640 },
    { name: 'loop-close', frame: 800 },
  ],
};
