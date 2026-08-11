/**
 * Copy-ready share captions for an exported pict-cast — one per platform, never
 * identical (the algorithms penalise cross-posted identical text). British
 * English; honest origin only ("measured", never a spectrophotometer story);
 * never names the swatch source.
 */

export interface RevealCaptions {
  tiktok: string;
  reels: string;
  shorts: string;
}

const BASE_TAGS = ['#warhammer', '#minipainting', '#paintingwarhammer', '#warhammer40k', '#miniaturepainting'];

function tags(extra: string[]): string {
  return [...BASE_TAGS, ...extra].join(' ');
}

export interface RevealCaptionInput {
  colourCount: number;
  topFamily?: string;
  brandLabel?: string;
  /** Which clip these captions describe. The two are for different posts by
   *  different people: a painter showing off their own model, versus someone
   *  who found a colour scheme they want to steal. Reusing the miniature copy
   *  on an inspiration clip would promise a model that is not in the video. */
  mode?: 'miniature' | 'inspiration';
}

export function buildRevealCaptions(input: RevealCaptionInput): RevealCaptions {
  if (input.mode === 'inspiration') return buildInspirationCaptions(input);
  const n = input.colourCount;
  const family = (input.topFamily || '').toLowerCase();
  const familyBit = family ? ` The ${family} nailed it.` : '';

  return {
    tiktok:
      `I pointed a colour engine at my mini and it read every colour off the paint. 🎯\n` +
      `${n} colours identified, full recipe returned — measured, not guessed.${familyBit}\n` +
      `Scan yours free 👇\nschemestealer.com/daily\n\n` +
      tags(['#paintrecipe', '#howtopaint']),
    reels:
      `Every colour on this model, read by the machine spirit and matched to real paints. ${n} colours, one scan.\n` +
      `Free tool — link in bio. Play the daily paint quiz too.\n\n` +
      tags(['#miniaturepainting', '#warhammercommunity']),
    shorts:
      `TITLE: I Scanned My Mini and Got the Exact Paint Recipe (${n} Colours)\n\n` +
      `A colour engine built on physically measured paint swatches reads your model and returns a base→shade→highlight→wash recipe.\n` +
      `Try it free: schemestealer.com/daily\n\n` +
      tags(['#warhammertips', '#paintingtutorial']),
  };
}

/**
 * Inspiration-tab captions.
 *
 * Palette-focused rather than model-focused, and careful about what it claims:
 * the engine reads colours out of an image, so the copy never says what the
 * image IS, never names a subject, and never quotes a count of paints in the
 * database (that number changes, and a caption outlives the number).
 */
const INSPIRATION_TAGS = [
  '#minipainting',
  '#paintinginspiration',
  '#colourscheme',
  '#warhammer',
  '#miniaturepainting',
];

function inspirationTags(extra: string[]): string {
  return [...INSPIRATION_TAGS, ...extra].join(' ');
}

function buildInspirationCaptions(input: RevealCaptionInput): RevealCaptions {
  const n = input.colourCount;
  const family = (input.topFamily || '').toLowerCase();
  const familyBit = family ? ` That ${family} is the one I'm stealing.` : '';
  const brand = input.brandLabel || 'Citadel';

  return {
    tiktok:
      `Found a colour scheme in the wild and bound it to real paints. ✨\n` +
      `${n} colours pulled straight out of the image, every one matched to a paint I can actually buy — measured, not guessed.${familyBit}\n` +
      `Steal a scheme free 👇\nschemestealer.com/daily\n\n` +
      inspirationTags(['#paintrecipe', '#colourpalette']),
    reels:
      `Any image, any palette — read by the machine spirit and bound to real ${brand} paints. ${n} colours, one scan.\n` +
      `Free tool — link in bio. The daily paint quiz lives there too.\n\n` +
      inspirationTags(['#warhammercommunity', '#paintingideas']),
    shorts:
      `TITLE: I Turned a Random Image Into a Paint Scheme (${n} Colours)\n\n` +
      `A colour engine built on physically measured paint swatches reads any picture and binds every colour to the closest real paint, with the match distance shown.\n` +
      `Try it free: schemestealer.com/daily\n\n` +
      inspirationTags(['#paintingtutorial', '#colourtheory']),
  };
}
