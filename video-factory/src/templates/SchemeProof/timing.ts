// Timing manifest kept free of React/font imports so the Node CLI + QA can import it
// without booting the browser-only font loader.
import type { TemplateManifest } from '../manifest.js';

export const schemeProofManifest: TemplateManifest = {
  id: 't3',
  label: 'Scheme Proof',
  durationInFrames: 720,
  fps: 30,
  hookEndFrame: 90,
  loopCloses: true,
  // Settled frames (past entrance springs) so QA thumbnails capture real content.
  beats: [
    { name: 'hook', frame: 40 },
    { name: 'swap-settled', frame: 300 },
    { name: 'saving', frame: 430 },
    { name: 'cta', frame: 560 },
    { name: 'loop-close', frame: 660 },
  ],
};
