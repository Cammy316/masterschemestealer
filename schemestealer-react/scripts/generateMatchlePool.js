/**
 * Matchle Pool Generator
 *
 * Copies the curated paint pool into the frontend so Matchle can pick daily
 * targets from it.
 *
 * The curation itself is NOT redone here. `python-api/scripts/curated_pool.json`
 * already encodes the rules that matter — washes, shades and inks excluded,
 * `color_source` restricted to measured or swatch-median, chroma >= 12 — and
 * re-deriving them in JavaScript would create a second definition of "a paint
 * fair to ask about" that could silently drift from the first.
 *
 * Every id is verified against PAINT_DATABASE before writing, because a pool
 * entry the frontend cannot resolve becomes a blank round at runtime rather
 * than a build error.
 *
 * Run with: node scripts/generateMatchlePool.js
 */

const fs = require('fs');
const path = require('path');

const SOURCE = path.resolve(__dirname, '../../python-api/scripts/curated_pool.json');
const TARGET = path.resolve(__dirname, '../lib/data/matchle_pool.json');
const PAINT_DB = path.resolve(__dirname, '../lib/paintDatabase.ts');

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`[matchle] curated pool not found at ${SOURCE}`);
    process.exit(1);
  }

  const pool = JSON.parse(fs.readFileSync(SOURCE, 'utf-8'));
  if (!Array.isArray(pool) || pool.length === 0) {
    console.error('[matchle] curated pool is not a non-empty array');
    process.exit(1);
  }

  // Resolve against the shipped database rather than trusting the source file.
  const db = fs.readFileSync(PAINT_DB, 'utf-8');
  const present = new Set();
  const re = /"paint_id":\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(db)) !== null) present.add(m[1]);

  const kept = pool.filter((id) => present.has(id));
  const dropped = pool.filter((id) => !present.has(id));

  if (kept.length === 0) {
    console.error('[matchle] no pool ids resolved against PAINT_DATABASE — refusing to write');
    process.exit(1);
  }

  fs.writeFileSync(TARGET, JSON.stringify(kept, null, 0) + '\n', 'utf-8');

  console.log(`[matchle] wrote ${kept.length} ids to lib/data/matchle_pool.json`);
  if (dropped.length) {
    console.warn(`[matchle] dropped ${dropped.length} unresolvable id(s):`, dropped.slice(0, 5));
  }
}

main();
