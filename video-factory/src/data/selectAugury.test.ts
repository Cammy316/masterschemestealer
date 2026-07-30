import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectAugury } from './selectAugury.js';
import { dailyPuzzles, paintById } from './loadData.js';

// Intent: the rendered quiz answer must be EXACTLY the puzzle file's answer — a drift
// here would post a clip whose reveal contradicts the live /daily game.
test('date resolves to the puzzle file answer paint, verbatim', () => {
  const days = dailyPuzzles().days;
  const firstDate = Object.keys(days).sort()[0];
  const expected = paintById(days[firstDate].answer);
  const p = selectAugury(firstDate);
  assert.ok(expected, 'fixture answer must exist in groundtruth');
  assert.equal(p.answer.paintId, expected!.paint_id);
  assert.equal(p.answer.name, expected!.name);
});

// Intent: three DISTINCT decoys that are never the answer — a decoy equal to the answer
// makes the "wrong!" buzzer a lie.
test('produces three distinct decoys, none equal to the answer', () => {
  const firstDate = Object.keys(dailyPuzzles().days).sort()[0];
  const p = selectAugury(firstDate);
  assert.equal(p.wrongGuesses.length, 3);
  const names = new Set(p.wrongGuesses.map((g) => g.name.toLowerCase()));
  assert.equal(names.size, 3, 'decoys must be distinct');
  assert.ok(!names.has(p.answer.name.toLowerCase()), 'no decoy may equal the answer');
});

test('unknown date throws with the valid range', () => {
  assert.throws(() => selectAugury('1999-01-01'), /Range:/);
});
