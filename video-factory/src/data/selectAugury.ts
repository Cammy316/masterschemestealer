// T1 Swatchle selector: resolve a puzzle date to its answer paint, then build plausible
// decoy guesses and spoiler-light hints — all deterministic.
//
// Invariant #7 (no NEW colour-space conversions in TS): we do ONLY plain Euclidean
// distance over the paints' already-shipped `lab` arrays to rank "plausible" decoys and
// the nearest recognisable neighbour. No CIEDE2000 is reimplemented here and T1 makes NO
// numeric ΔE claim (numbers in the factory come straight from conversions.json in T2).
import { dailyPuzzles, paints, paintById, type Paint } from './loadData.js';

export interface AuguryProps {
  date: string;
  answer: { name: string; brand: string; hex: string; family: string; paintId: string };
  wrongGuesses: { name: string; brand: string }[];
  hints: { family: string; tone: string; neighbour: string };
}

function labDist2(a: [number, number, number], b: [number, number, number]): number {
  const dl = a[0] - b[0];
  const da = a[1] - b[1];
  const db = a[2] - b[2];
  return dl * dl + da * da + db * db;
}

function tone(L: number): string {
  if (L < 25) return 'DEEP SHADOW';
  if (L < 45) return 'SHADOW';
  if (L < 65) return 'MIDTONE';
  if (L < 82) return 'HIGHLIGHT';
  return 'NEAR-WHITE';
}

// Nearest same-or-adjacent-family paints to the answer (plausible near-misses).
function plausibleDecoys(answer: Paint, adjacency: Record<string, string[]>): Paint[] {
  const allowedFamilies = new Set<string>([
    answer.color_family,
    ...(adjacency[answer.color_family] ?? []),
  ]);
  return paints()
    .filter(
      (p) =>
        p.paint_id !== answer.paint_id &&
        p.name.toLowerCase() !== answer.name.toLowerCase() &&
        allowedFamilies.has(p.color_family),
    )
    .map((p) => ({ p, d: labDist2(p.lab, answer.lab) }))
    .sort((x, y) => x.d - y.d || x.p.paint_id.localeCompare(y.p.paint_id))
    .map((x) => x.p);
}

// Nearest recognisable (Citadel) paint that isn't the answer — the "sits beside…" hint.
function nearestRecognisable(answer: Paint): Paint | undefined {
  return paints()
    .filter(
      (p) =>
        p.brand === 'Citadel' &&
        p.paint_id !== answer.paint_id &&
        p.name.toLowerCase() !== answer.name.toLowerCase(),
    )
    .map((p) => ({ p, d: labDist2(p.lab, answer.lab) }))
    .sort((x, y) => x.d - y.d || x.p.paint_id.localeCompare(y.p.paint_id))[0]?.p;
}

/** Pick three decoys with distinct names AND distinct brands where possible. */
function pickThree(decoys: Paint[]): Paint[] {
  const chosen: Paint[] = [];
  const seenBrand = new Set<string>();
  for (const p of decoys) {
    if (chosen.some((c) => c.name.toLowerCase() === p.name.toLowerCase())) continue;
    if (seenBrand.has(p.brand) && chosen.length < decoys.length) {
      // prefer brand variety on the first pass
      continue;
    }
    chosen.push(p);
    seenBrand.add(p.brand);
    if (chosen.length === 3) return chosen;
  }
  // Second pass: fill remaining slots ignoring brand variety.
  for (const p of decoys) {
    if (chosen.length === 3) break;
    if (chosen.some((c) => c.name.toLowerCase() === p.name.toLowerCase())) continue;
    chosen.push(p);
  }
  return chosen.slice(0, 3);
}

export function selectAugury(date: string): AuguryProps {
  const file = dailyPuzzles();
  const day = file.days[date];
  if (!day) {
    const keys = Object.keys(file.days).sort();
    throw new Error(
      `No puzzle for "${date}". Range: ${keys[0]} … ${keys[keys.length - 1]}.`,
    );
  }
  const answer = paintById(day.answer);
  if (!answer) {
    throw new Error(`Puzzle answer "${day.answer}" not found in paints_groundtruth.json.`);
  }

  const decoys = pickThree(plausibleDecoys(answer, file.familyAdjacency));
  if (decoys.length < 3) {
    throw new Error(`Could not build three decoys for ${date} (${answer.name}).`);
  }
  const neighbour = nearestRecognisable(answer);

  return {
    date,
    answer: {
      name: answer.name,
      brand: answer.brand,
      hex: answer.hex,
      family: answer.color_family,
      paintId: answer.paint_id,
    },
    wrongGuesses: decoys.map((p) => ({ name: p.name, brand: p.brand })),
    hints: {
      family: answer.color_family.toUpperCase(),
      tone: tone(answer.lab[0]),
      neighbour: neighbour ? `${neighbour.name} (${neighbour.brand})` : '—',
    },
  };
}

export function augurySlug(date: string): string {
  return `augury-${date}`;
}

/** `count` consecutive puzzle dates from `start` (or the earliest date) for batch runs. */
export function puzzleDates(start: string | undefined, count: number): string[] {
  const all = Object.keys(dailyPuzzles().days).sort();
  const from = start ? all.indexOf(start) : 0;
  if (from < 0) {
    throw new Error(`Start date ${start} not in puzzle file (range ${all[0]}…${all[all.length - 1]}).`);
  }
  return all.slice(from, from + count);
}
