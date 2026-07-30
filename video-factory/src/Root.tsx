// Remotion root. Registers both compositions. This module is bundled for the BROWSER,
// so it must never import the data selectors (they use node:fs). Real renders pass
// `inputProps` from the CLI; the sample props below exist only so `remotion studio`
// has something to preview.
import React from 'react';
import { Composition } from 'remotion';
import { BudgetSwap, budgetSwapManifest } from './templates/BudgetSwap/BudgetSwap.js';
import { Swatchle, swatchleManifest } from './templates/Swatchle/Swatchle.js';
import { SchemeProof, schemeProofManifest } from './templates/SchemeProof/SchemeProof.js';
import type { SwapProps } from './data/selectSwap.js';
import type { AuguryProps } from './data/selectAugury.js';
import type { SchemeProps } from './data/selectScheme.js';

const SAMPLE_SWAP: SwapProps = {
  source: { name: 'Mephiston Red', brand: 'Citadel', hex: '#9a1115', price: 5.5 },
  match: {
    name: 'Gory Red',
    brand: 'Vallejo',
    hex: '#951216',
    slug: 'vallejo-gory-red',
    deltaE: 1.8,
    band: 'close',
    price: 3.5,
  },
  saving: 2.0,
  bait: false,
  convertSlug: 'vallejo-gory-red',
};

const SAMPLE_AUGURY: AuguryProps = {
  date: '2026-07-14',
  answer: {
    name: 'Sick Green',
    brand: 'Vallejo',
    hex: '#6f7a34',
    family: 'green',
    paintId: 'vallejo-game-color-sick-green',
  },
  wrongGuesses: [
    { name: 'Death World Forest', brand: 'Citadel' },
    { name: 'Militarum Green', brand: 'Citadel' },
    { name: 'Elysian Green', brand: 'Vallejo' },
  ],
  hints: { family: 'GREEN', tone: 'MIDTONE', neighbour: 'Elysian Green (Citadel)' },
};

const SAMPLE_SCHEME: SchemeProps = {
  model: 'Thousand Sons Rubric Marine',
  original: [
    { name: 'Ahriman Blue', brand: 'Citadel', hex: '#0f7ea8', price: 5.5 },
    { name: 'Gehenna’s Gold', brand: 'Citadel', hex: '#b98b3a', price: 5.5 },
    { name: 'Abaddon Black', brand: 'Citadel', hex: '#231f20', price: 5.5 },
  ],
  budget: [
    { name: 'Archaic Turquoise', brand: 'AK', hex: '#0e7ba4', price: 3.2 },
    { name: 'Old Gold', brand: 'AK', hex: '#b5883a', price: 3.2 },
    { name: 'Matt Black', brand: 'Army Painter', hex: '#232122', price: 4.0 },
  ],
  originalTotal: 16.5,
  budgetTotal: 10.4,
  saving: 6.1,
  slug: 'scheme-thousand-sons-rubric-marine',
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="SchemeProof"
      component={SchemeProof}
      durationInFrames={schemeProofManifest.durationInFrames}
      fps={schemeProofManifest.fps}
      width={1080}
      height={1920}
      defaultProps={{ props: SAMPLE_SCHEME }}
    />
    <Composition
      id="BudgetSwap"
      component={BudgetSwap}
      durationInFrames={budgetSwapManifest.durationInFrames}
      fps={budgetSwapManifest.fps}
      width={1080}
      height={1920}
      defaultProps={{ props: SAMPLE_SWAP }}
    />
    <Composition
      id="Swatchle"
      component={Swatchle}
      durationInFrames={swatchleManifest.durationInFrames}
      fps={swatchleManifest.fps}
      width={1080}
      height={1920}
      defaultProps={{ props: SAMPLE_AUGURY }}
    />
  </>
);
