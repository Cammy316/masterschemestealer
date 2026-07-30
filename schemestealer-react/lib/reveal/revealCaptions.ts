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
}

export function buildRevealCaptions(input: RevealCaptionInput): RevealCaptions {
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
      `A colour engine built on 1,312 measured paint swatches reads your model and returns a base→shade→highlight→wash recipe.\n` +
      `Try it free: schemestealer.com/daily\n\n` +
      tags(['#warhammertips', '#paintingtutorial']),
  };
}
