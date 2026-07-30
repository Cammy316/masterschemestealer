import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectSwap, listSwaps, selectSwapWith } from './selectSwap.js';
import { paints } from './loadData.js';

function sourceGroundTruth(name: string) {
  return paints().find(
    (p) => p.name === name && p.brand.startsWith('Citadel'),
  );
}

// Intent: a "Budget Swap" must always be BOTH cheaper AND visually equivalent — the
// whole pitch collapses if either is false.
test('clean auto-pick is a sub-2.0 ΔE match that is genuinely cheaper', () => {
  const p = selectSwap(undefined, false);
  assert.ok(p.match.deltaE < 2.0, `clean ΔE should be <2.0, got ${p.match.deltaE}`);
  assert.ok(p.saving > 0, 'a budget swap must save money');
  assert.equal(p.source.brand, 'Citadel');
  assert.ok(p.match.brand !== 'Citadel', 'match must be a different (cheaper) brand');
});

// Intent: an auto-picked source must carry an HONEST measured ΔE (never an "assumed"
// wash) and be chromatic enough to actually read on the dark backdrop.
test('auto-pick source is measured (swatch-median) and chromatic', () => {
  const p = selectSwap(undefined, false);
  const gt = sourceGroundTruth(p.source.name);
  assert.ok(gt, `source ${p.source.name} should resolve in groundtruth`);
  assert.equal(gt!.color_source, 'swatch-median', 'never claim ΔE on an assumed wash');
  const chroma = Math.hypot(gt!.lab[1], gt!.lab[2]);
  assert.ok(chroma >= 8, `source chroma ${chroma.toFixed(1)} too low to read on the backdrop`);
});

// Intent: the bait variant exists to farm "heresy?" comments — it must sit in the
// deliberately-arguable band, never a clean win dressed up as bait.
test('bait auto-pick lands in the 2.5–3.5 ΔE comment-bait window', () => {
  const p = selectSwap(undefined, true);
  assert.ok(p.match.deltaE >= 2.5 && p.match.deltaE <= 3.5, `bait ΔE out of band: ${p.match.deltaE}`);
  assert.equal(p.bait, true);
});

// Intent: an explicit paint with no qualifying match must fail loudly, not silently
// render a misleading clip.
test('explicit unknown paint id throws rather than guessing', () => {
  assert.throws(() => selectSwap('definitely-not-a-real-paint-id', false));
});

// Intent: a batch renders by index, so duplicate candidates would silently produce two
// identical clips in the bank — some Citadel paints appear under multiple source keys.
test('listSwaps returns no duplicate (source, match) clips', () => {
  const list = listSwaps({ bait: false });
  const ids = list.map((p) => `${p.source.name.toLowerCase()}::${p.match.name.toLowerCase()}`);
  assert.equal(new Set(ids).size, ids.length, 'duplicate swap clips in the ranked list');
});

// Intent: --min-de/--max-de must actually constrain the pool so a batch can pull variety.
test('band override keeps every match inside the requested ΔE window', () => {
  const list = listSwaps({ minDe: 1.2, maxDe: 1.9 });
  assert.ok(list.length > 0);
  assert.ok(list.every((p) => p.match.deltaE >= 1.2 && p.match.deltaE <= 1.9));
});

// Intent: --index selects deeper into the list for variety without re-rendering the top.
test('index selects the Nth ranked candidate', () => {
  const list = listSwaps({ bait: false });
  const picked = selectSwapWith(undefined, { bait: false, index: 3 });
  assert.equal(picked.match.name, list[3].match.name);
  assert.throws(() => selectSwapWith(undefined, { bait: false, index: 9999 }));
});
