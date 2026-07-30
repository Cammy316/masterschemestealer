// Deterministic web fonts bundled at render time via @remotion/google-fonts.
// loadFont() registers the font and handles Remotion's delayRender internally, so the
// returned family is safe to use directly in styles.
import { loadFont as loadOswald } from '@remotion/google-fonts/Oswald';
import { loadFont as loadShareTechMono } from '@remotion/google-fonts/ShareTechMono';

// Pin weights/subset so each render makes a couple of font requests, not 30 per tab.
// Signature is loadFont(style, options) — style first.
const oswald = loadOswald('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});
const shareTechMono = loadShareTechMono('normal', {
  weights: ['400'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

// Display: heavy condensed grotesque for hooks/verdicts. Mono: terminal/cogitator.
export const DISPLAY_FONT = oswald.fontFamily;
export const MONO_FONT = shareTechMono.fontFamily;
