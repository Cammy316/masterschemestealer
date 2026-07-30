// Per-platform caption/hook/hashtag files + a batch checklist. Copy is REWRITTEN per
// platform (never identical — the algorithms penalise cross-posted identical text).
// British English throughout; the honest origin only ("1,312 measured paints"); never
// name the swatch source (project invariant #9).
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { SwapProps } from '../data/selectSwap.js';
import type { AuguryProps } from '../data/selectAugury.js';
import type { SchemeProps } from '../data/selectScheme.js';

const BASE_TAGS = ['#warhammer', '#minipainting', '#paintingwarhammer', '#warhammer40k', '#miniaturepainting'];

function tagLine(extra: string[]): string {
  return [...BASE_TAGS, ...extra].join(' ');
}

function writeFile(dir: string, name: string, body: string): void {
  writeFileSync(resolve(dir, name), body.trimStart() + '\n', 'utf-8');
}

// ---- T2 Budget Swap ----------------------------------------------------------
export function writeSwapCaptions(dir: string, p: SwapProps): void {
  const save = `£${p.saving.toFixed(2)}`;
  const de = p.match.deltaE.toFixed(1);
  const bait = p.bait;

  writeFile(
    dir,
    'tiktok.txt',
    `
HOOK: £${p.source.price.toFixed(2)} for ${p.source.name}? 😤

${p.match.brand} ${p.match.name} matches it at ΔE ${de} — measured, not guessed. That's ${save} saved per pot.
${bait ? 'Close enough, or heresy? Tell me below. 👇' : 'Same colour on the model. Your wallet knows the difference.'}
Free scanner + every match at schemestealer.com

${tagLine(['#hobbybudget', `#${p.match.brand.replace(/\s+/g, '').toLowerCase()}`])}`,
  );

  writeFile(
    dir,
    'reels.txt',
    `
${p.source.name} vs ${p.match.name} — can you actually tell?

Measured colour distance: ΔE ${de}. ${bait ? 'Borderline — you decide.' : 'Below the threshold your eye can resolve.'}
${save} cheaper, every single pot. Full match list + free mini scanner in bio.

${tagLine(['#paintdupes', '#hobbyonabudget'])}`,
  );

  writeFile(
    dir,
    'shorts.txt',
    `
TITLE: ${p.source.name} Dupe — ${p.match.brand} ${p.match.name} (ΔE ${de}, save ${save})

The measured cross-brand match for ${p.source.name}. ${save} cheaper per pot at ΔE ${de}.
Compare them yourself: schemestealer.com/convert/${p.convertSlug}

${tagLine(['#warhammertips', '#paintingtutorial'])}`,
  );

  writeChecklist(dir, {
    title: `T2 Budget Swap — ${p.source.name} → ${p.match.name}`,
    order: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    pinComment: bait
      ? `"ΔE ${de} — close enough or heresy? ⚖️"`
      : `"First person to guess the saving gets pinned 👀 (it's ${save})"`,
    notes: [
      `Deep link: schemestealer.com/convert/${p.convertSlug}`,
      'Watch on your PHONE before posting (never judge vertical on a monitor).',
      'Upload NATIVELY per platform — no cross-posted watermark.',
    ],
  });
}

// ---- T1 Swatchle -------------------------------------------------------------
export function writeAuguryCaptions(dir: string, p: AuguryProps): void {
  writeFile(
    dir,
    'tiktok.txt',
    `
HOOK: Only real painters name this in 3 guesses.

Family: ${p.hints.family.toLowerCase()}. Tone: ${p.hints.tone.toLowerCase()}. Sits beside ${p.hints.neighbour}.
Drop your guess before the reveal 👇
Today's puzzle: schemestealer.com/daily

${tagLine(['#paintquiz', '#namethatpaint'])}`,
  );

  writeFile(
    dir,
    'reels.txt',
    `
Name that paint. You get three guesses. 🎨

Hint: it's a ${p.hints.tone.toLowerCase()} ${p.hints.family.toLowerCase()}, shelf neighbour of ${p.hints.neighbour}.
Play the daily in bio — streaks, stats, the lot.

${tagLine(['#guessthepaint', '#warhammerpainting'])}`,
  );

  writeFile(
    dir,
    'shorts.txt',
    `
TITLE: Name That Paint #${p.date} — ${p.hints.family} ${p.hints.tone} (3 guesses)

Guess the miniature paint from its swatch. Family: ${p.hints.family.toLowerCase()}. Answer at the loop.
New puzzle daily: schemestealer.com/daily

${tagLine(['#warhammerquiz', '#hobbychallenge'])}`,
  );

  writeChecklist(dir, {
    title: `T1 Swatchle — ${p.date} (answer hidden in checklist below)`,
    order: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    pinComment: '"First correct guess gets pinned 📌"',
    notes: [
      `ANSWER (do not reveal in the caption): ${p.answer.name} — ${p.answer.brand}`,
      'Reveal lands at the loop point so second-watch viewers see it under the hook.',
      'Upload NATIVELY per platform.',
    ],
  });
}

// ---- T3 Scheme Proof ---------------------------------------------------------
export function writeSchemeCaptions(dir: string, p: SchemeProps): void {
  const save = `£${p.saving.toFixed(2)}`;
  const budgetBrands = [...new Set(p.budget.map((c) => c.brand))].join(' + ');

  writeFile(
    dir,
    'tiktok.txt',
    `
HOOK: £${p.originalTotal.toFixed(2)} to paint one ${p.model}? 😤

Same scheme, ${budgetBrands} instead of the official pots: £${p.budgetTotal.toFixed(2)}. That's ${save} saved PER MODEL — measured matches, not guesses.
Now multiply that by a whole army. 👀
Free scanner + every match at schemestealer.com

${tagLine(['#hobbybudget', '#armypainting'])}`,
  );

  writeFile(
    dir,
    'reels.txt',
    `
The official ${p.model} palette costs £${p.originalTotal.toFixed(2)}. Here's the same look for £${p.budgetTotal.toFixed(2)}.

${save} a model adds up fast across a unit. Full measured match list + free mini scanner in bio.

${tagLine(['#paintdupes', '#warhammerarmy'])}`,
  );

  writeFile(
    dir,
    'shorts.txt',
    `
TITLE: ${p.model} on a Budget — Same Scheme, Save ${save}/Model

The official palette vs a measured cheaper one for ${p.model}. ${save} per model, same look.
Match any scheme free: schemestealer.com

${tagLine(['#warhammertips', '#paintingtutorial'])}`,
  );

  writeChecklist(dir, {
    title: `T3 Scheme Proof — ${p.model} (save ${save}/model)`,
    order: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    pinComment: `"How big is your army? That's ${save} × how many models 👀"`,
    notes: [
      `Official £${p.originalTotal.toFixed(2)} → budget £${p.budgetTotal.toFixed(2)} (${budgetBrands}).`,
      'Proof is visual + price — no ΔE number claimed for the whole scheme.',
      'Upload NATIVELY per platform.',
    ],
  });
}

// ---- shared checklist --------------------------------------------------------
interface Checklist {
  title: string;
  order: string[];
  pinComment: string;
  notes: string[];
}

function writeChecklist(dir: string, c: Checklist): void {
  const body = [
    `# ${c.title}`,
    '',
    '## Upload order',
    ...c.order.map((p, i) => `${i + 1}. ${p} — native upload, caption from ${p.toLowerCase().split(' ')[0]}.txt`),
    '',
    '## Pinned comment',
    `- ${c.pinComment}`,
    '',
    '## Notes',
    ...c.notes.map((n) => `- ${n}`),
    '',
    '## QA',
    '- [ ] `factory qa` passed (loop close + hook beats + British English eyeball)',
    '- [ ] Watched on phone at full size',
    '- [ ] Logged as a row in the calendar sheet',
    '',
  ].join('\n');
  writeFileSync(resolve(dir, 'checklist.md'), body, 'utf-8');
}
