import { describe, it, expect } from 'vitest';
import dataslateContent from '../data/dataslate_content.json';

// The Session Forge dataslate cycles this pool for hours during painting
// sessions — these guards keep the content genuinely varied. The previous
// generator padded 52 real tips with 350 clones of ONE sentence template,
// which players noticed immediately.
describe('dataslate content', () => {
  const tips = dataslateContent.painting_tips as string[];
  const quotes = dataslateContent.lore_quotes as { text: string; attribution: string }[];

  it('meets the variety floors', () => {
    expect(tips.length).toBeGreaterThanOrEqual(80);
    expect(quotes.length).toBeGreaterThanOrEqual(60);
  });

  it('every quote is attributed to a name', () => {
    for (const q of quotes) {
      expect(q.text.trim().length, 'quote text').toBeGreaterThan(0);
      expect(q.attribution?.trim().length, `attribution for "${q.text}"`).toBeGreaterThan(0);
    }
  });

  it('has no duplicate texts anywhere in the pool', () => {
    const all = [...tips, ...quotes.map((q) => q.text)];
    const seen = new Set<string>();
    const dupes = all.filter((t) => (seen.has(t) ? true : (seen.add(t), false)));
    expect(dupes).toEqual([]);
  });

  it('fits the dataslate panel (no over-long entries)', () => {
    const all = [...tips, ...quotes.map((q) => q.text)];
    for (const t of all) {
      expect(t.length, t.slice(0, 40)).toBeLessThanOrEqual(220);
    }
  });
});
