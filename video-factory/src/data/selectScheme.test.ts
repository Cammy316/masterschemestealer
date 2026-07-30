import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectScheme, listSchemes, schemeSlug } from './selectScheme.js';

// Intent: a Scheme Proof only works if the budget palette is genuinely cheaper — the
// entire clip is a lie otherwise.
test('auto-pick scheme saves money and matches palette lengths', () => {
  const p = selectScheme(undefined);
  assert.ok(p.saving > 0, 'must save money');
  assert.ok(p.budgetTotal < p.originalTotal);
  assert.equal(p.original.length, p.budget.length, 'palettes must be index-aligned');
  assert.ok(p.original.every((c) => c.hex.startsWith('#')));
  assert.ok(p.budget.every((c) => c.hex.startsWith('#')));
});

// Intent: the arithmetic shown on screen must be internally consistent.
test('saving equals originalTotal minus budgetTotal', () => {
  const p = selectScheme(undefined);
  assert.equal(p.saving, Math.round((p.originalTotal - p.budgetTotal) * 100) / 100);
});

// Intent: ranked list drives batch variety — biggest saving first, no crashes.
test('listSchemes is sorted by saving, descending', () => {
  const list = listSchemes();
  assert.ok(list.length > 0);
  for (let i = 1; i < list.length; i++) {
    assert.ok(list[i - 1].saving >= list[i].saving, 'not sorted by saving');
  }
});

// Intent: naming a scheme explicitly must hit that exact model, and a bad name/index
// must fail loudly rather than render the wrong scheme.
test('select by model name resolves that scheme; bad index throws', () => {
  const top = listSchemes()[0];
  const byName = selectScheme(top.model);
  assert.equal(byName.model, top.model);
  assert.equal(byName.slug, schemeSlug(top.model));
  assert.throws(() => selectScheme(undefined, 9999));
  assert.throws(() => selectScheme('not-a-real-scheme'));
});
