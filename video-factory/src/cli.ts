// factory CLI — the single entry point.
//   factory t2 [--paint <citadel-id>] [--bait]     render one Budget Swap
//   factory t1 --date <YYYY-MM-DD>                  render one Swatchle
//   factory qa <clipDir>                            re-run QA on an existing clip
//   factory list-swaps [--bait] [--limit N]         preview auto-pick candidates
//
// Renders write out/<slug>/{master.mp4, tiktok.txt, reels.txt, shorts.txt,
// checklist.md, meta.json} then run QA into out/<slug>/qa/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { selectSwapWith, listSwaps, swapSlug, type SwapQuery } from './data/selectSwap.js';
import { selectAugury, augurySlug, puzzleDates } from './data/selectAugury.js';
import { selectScheme, listSchemes } from './data/selectScheme.js';
import { writeSwapCaptions, writeAuguryCaptions, writeSchemeCaptions } from './captions/writeCaptions.js';
import { renderTemplate } from './render.js';
import { runQa } from './qa/qa.js';
import { budgetSwapManifest } from './templates/BudgetSwap/timing.js';
import { swatchleManifest } from './templates/Swatchle/timing.js';
import { schemeProofManifest } from './templates/SchemeProof/timing.js';
import type { TemplateManifest } from './templates/manifest.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = resolve(HERE, '../out');

const MANIFESTS: Record<string, TemplateManifest> = {
  t1: swatchleManifest,
  t2: budgetSwapManifest,
  t3: schemeProofManifest,
};

// ---- tiny arg parser ---------------------------------------------------------
function parseFlags(args: string[]): { flags: Record<string, string>; bools: Set<string>; positional: string[] } {
  const flags: Record<string, string> = {};
  const bools = new Set<string>();
  const positional: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        bools.add(key);
      }
    } else {
      positional.push(a);
    }
  }
  return { flags, bools, positional };
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function progressBar(pct: number): void {
  const width = 24;
  const filled = Math.round(pct * width);
  process.stdout.write(`\r  render [${'█'.repeat(filled)}${'·'.repeat(width - filled)}] ${(pct * 100).toFixed(0)}%`);
  if (pct >= 1) process.stdout.write('\n');
}

interface Meta {
  compositionId: string;
  manifestId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps: Record<string, any>;
}

function writeMeta(dir: string, meta: Meta): void {
  writeFileSync(resolve(dir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf-8');
}

async function reportQa(compositionId: string, meta: Meta, manifest: TemplateManifest, dir: string): Promise<boolean> {
  console.log('  running QA…');
  const r = await runQa(compositionId, meta.inputProps, manifest, dir);
  console.log(
    `  QA ${r.pass ? '✅ PASS' : '❌ FAIL'} — loop ${(r.loopSimilarity * 100).toFixed(1)}%, ` +
      `hook ${r.hookOk ? 'ok' : 'FAIL'}, beats ${r.beatChecks.filter((c) => c.ok).length}/${r.beatChecks.length}`,
  );
  console.log(`  → ${resolve(dir, 'qa', 'report.md')}`);
  return r.pass;
}

// ---- produce helpers (render + captions + meta + QA) -------------------------
interface ProduceResult {
  dir: string;
  title: string;
  pass: boolean;
  loop: number;
}

function swapQueryFromFlags(flags: Record<string, string>, bait: boolean): SwapQuery & { index?: number; paint?: string } {
  return {
    bait,
    paint: flags.paint,
    minDe: flags['min-de'] !== undefined ? parseFloat(flags['min-de']) : undefined,
    maxDe: flags['max-de'] !== undefined ? parseFloat(flags['max-de']) : undefined,
    index: flags.index !== undefined ? parseInt(flags.index, 10) : undefined,
  };
}

async function produceT2(
  q: SwapQuery & { index?: number; paint?: string },
  showProgress: boolean,
): Promise<ProduceResult> {
  const props = selectSwapWith(q.paint, q);
  const dir = resolve(OUT_ROOT, swapSlug(props));
  ensureDir(dir);
  const inputProps = { props };
  await renderTemplate({
    compositionId: 'BudgetSwap',
    inputProps,
    outputLocation: resolve(dir, 'master.mp4'),
    onProgress: showProgress ? progressBar : undefined,
  });
  writeSwapCaptions(dir, props);
  writeMeta(dir, { compositionId: 'BudgetSwap', manifestId: 't2', inputProps });
  const r = await runQa('BudgetSwap', inputProps, budgetSwapManifest, dir);
  return {
    dir,
    title: `T2 ${props.source.name} → ${props.match.name} (ΔE ${props.match.deltaE.toFixed(1)}, £${props.saving.toFixed(2)} off)${q.bait ? ' [bait]' : ''}`,
    pass: r.pass,
    loop: r.loopSimilarity,
  };
}

async function produceT1(date: string, showProgress: boolean): Promise<ProduceResult> {
  const props = selectAugury(date);
  const dir = resolve(OUT_ROOT, augurySlug(date));
  ensureDir(dir);
  const inputProps = { props };
  await renderTemplate({
    compositionId: 'Swatchle',
    inputProps,
    outputLocation: resolve(dir, 'master.mp4'),
    onProgress: showProgress ? progressBar : undefined,
  });
  writeAuguryCaptions(dir, props);
  writeMeta(dir, { compositionId: 'Swatchle', manifestId: 't1', inputProps });
  const r = await runQa('Swatchle', inputProps, swatchleManifest, dir);
  return {
    dir,
    title: `T1 ${date} — ${props.answer.name} (${props.answer.brand})`,
    pass: r.pass,
    loop: r.loopSimilarity,
  };
}

async function produceT3(idOrModel: string | undefined, index: number, showProgress: boolean): Promise<ProduceResult> {
  const props = selectScheme(idOrModel, index);
  const dir = resolve(OUT_ROOT, props.slug);
  ensureDir(dir);
  const inputProps = { props };
  await renderTemplate({
    compositionId: 'SchemeProof',
    inputProps,
    outputLocation: resolve(dir, 'master.mp4'),
    onProgress: showProgress ? progressBar : undefined,
  });
  writeSchemeCaptions(dir, props);
  writeMeta(dir, { compositionId: 'SchemeProof', manifestId: 't3', inputProps });
  const r = await runQa('SchemeProof', inputProps, schemeProofManifest, dir);
  return {
    dir,
    title: `T3 ${props.model} (£${props.originalTotal.toFixed(2)} → £${props.budgetTotal.toFixed(2)}, £${props.saving.toFixed(2)} off)`,
    pass: r.pass,
    loop: r.loopSimilarity,
  };
}

// ---- commands ----------------------------------------------------------------
async function cmdT2(args: string[]): Promise<void> {
  const { flags, bools } = parseFlags(args);
  const q = swapQueryFromFlags(flags, bools.has('bait'));
  console.log('');
  const r = await produceT2(q, true);
  console.log(`  QA ${r.pass ? '✅ PASS' : '❌ FAIL'} — loop ${(r.loop * 100).toFixed(1)}%`);
  console.log(`Done → ${r.dir}${r.pass ? '' : '  (QA FAILED — do not post)'}`);
}

async function cmdT1(args: string[]): Promise<void> {
  const { flags } = parseFlags(args);
  if (!flags.date) throw new Error('factory t1 requires --date <YYYY-MM-DD>');
  console.log('');
  const r = await produceT1(flags.date, true);
  console.log(`  QA ${r.pass ? '✅ PASS' : '❌ FAIL'} — loop ${(r.loop * 100).toFixed(1)}%`);
  console.log(`Done → ${r.dir}${r.pass ? '' : '  (QA FAILED — do not post)'}`);
}

async function cmdT3(args: string[]): Promise<void> {
  const { flags } = parseFlags(args);
  const index = flags.index !== undefined ? parseInt(flags.index, 10) : 0;
  console.log('');
  const r = await produceT3(flags.scheme, index, true);
  console.log(`  QA ${r.pass ? '✅ PASS' : '❌ FAIL'} — loop ${(r.loop * 100).toFixed(1)}%`);
  console.log(`Done → ${r.dir}${r.pass ? '' : '  (QA FAILED — do not post)'}`);
}

function cmdListSchemes(args: string[]): void {
  const { flags } = parseFlags(args);
  const limit = flags.limit ? parseInt(flags.limit, 10) : 30;
  const list = listSchemes();
  console.log(`${list.length} schemes (positive saving). Top ${Math.min(limit, list.length)} by saving:`);
  list.slice(0, limit).forEach((p, i) =>
    console.log(
      `  [${String(i).padStart(2)}] ${p.model} — £${p.originalTotal.toFixed(2)} → £${p.budgetTotal.toFixed(2)} (save £${p.saving.toFixed(2)})`,
    ),
  );
  console.log(`\nRender one: factory t3 --index <n>   (or --scheme "<model name>")`);
}

async function cmdBank(args: string[]): Promise<void> {
  const { flags } = parseFlags(args);
  const int = (v: string | undefined, d: number) => (v !== undefined ? parseInt(v, 10) : d);
  const t1Count = int(flags['t1-count'], 10);
  const t2Clean = int(flags['t2-clean'], 5);
  const t2Bait = int(flags['t2-bait'], 3);
  const t3Count = int(flags['t3-count'], 0);
  const dates = puzzleDates(flags['t1-start'], t1Count);

  type Job =
    | { kind: 't1'; date: string }
    | { kind: 't2'; q: SwapQuery & { index?: number } }
    | { kind: 't3'; index: number };
  const jobs: Job[] = [
    ...dates.map((date): Job => ({ kind: 't1', date })),
    ...Array.from({ length: t2Clean }, (_, i): Job => ({ kind: 't2', q: { bait: false, index: i } })),
    ...Array.from({ length: t2Bait }, (_, i): Job => ({ kind: 't2', q: { bait: true, index: i } })),
    ...Array.from({ length: t3Count }, (_, i): Job => ({ kind: 't3', index: i })),
  ];

  console.log(
    `\nRendering bank: ${dates.length}× T1, ${t2Clean}× T2 clean, ${t2Bait}× T2 bait, ${t3Count}× T3 = ${jobs.length} clips`,
  );
  console.log('(one bundle, reused across every clip)\n');

  const results: (ProduceResult & { error?: string })[] = [];
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    const label =
      job.kind === 't1'
        ? `T1 ${job.date}`
        : job.kind === 't2'
          ? `T2 ${job.q.bait ? 'bait ' : ''}#${job.q.index}`
          : `T3 #${job.index}`;
    process.stdout.write(`  [${String(i + 1).padStart(2)}/${jobs.length}] ${label} … `);
    try {
      const r =
        job.kind === 't1'
          ? await produceT1(job.date, false)
          : job.kind === 't2'
            ? await produceT2(job.q, false)
            : await produceT3(undefined, job.index, false);
      results.push(r);
      console.log(`${r.pass ? '✅' : '❌'} loop ${(r.loop * 100).toFixed(0)}%  ${r.title}`);
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      results.push({ dir: '-', title: label, pass: false, loop: 0, error });
      console.log(`✖ ${error}`);
    }
  }

  writeBankSummary(results);
  const passed = results.filter((r) => r.pass).length;
  console.log(`\nBank: ${passed}/${results.length} passed QA.`);
  console.log(
    passed === results.length
      ? '✅ All clips passed — safe to start posting per the runbook calendar.'
      : '❌ Some clips failed QA — DO NOT POST until every clip is green (runbook Step 4).',
  );
  console.log(`Summary → ${resolve(OUT_ROOT, 'bank-summary.csv')}`);
}

function writeBankSummary(results: (ProduceResult & { error?: string })[]): void {
  const rows = [
    'title,dir,qa_pass,loop_pct,error',
    ...results.map((r) =>
      [
        JSON.stringify(r.title),
        JSON.stringify(r.dir),
        r.pass ? 'PASS' : 'FAIL',
        (r.loop * 100).toFixed(1),
        JSON.stringify(r.error ?? ''),
      ].join(','),
    ),
  ];
  writeFileSync(resolve(OUT_ROOT, 'bank-summary.csv'), rows.join('\n') + '\n', 'utf-8');
}

async function cmdQa(args: string[]): Promise<void> {
  const { positional } = parseFlags(args);
  const dir = positional[0] ? resolve(process.cwd(), positional[0]) : null;
  if (!dir || !existsSync(resolve(dir, 'meta.json'))) {
    throw new Error('factory qa <clipDir> — needs a clip directory containing meta.json');
  }
  const meta = JSON.parse(readFileSync(resolve(dir, 'meta.json'), 'utf-8')) as Meta;
  const manifest = MANIFESTS[meta.manifestId];
  if (!manifest) throw new Error(`Unknown manifest "${meta.manifestId}" in meta.json`);
  await reportQa(meta.compositionId, meta, manifest, dir);
}

function cmdListSwaps(args: string[]): void {
  const { bools, flags } = parseFlags(args);
  const bait = bools.has('bait');
  const limit = flags.limit ? parseInt(flags.limit, 10) : 15;
  const q = swapQueryFromFlags(flags, bait);
  const list = listSwaps(q);
  const band = q.minDe !== undefined || q.maxDe !== undefined
    ? `ΔE [${q.minDe ?? 0}, ${q.maxDe ?? '∞'}]`
    : bait ? 'bait ΔE 2.5–3.5' : 'clean ΔE <2.0';
  console.log(`${list.length} candidates (${band}). Top ${Math.min(limit, list.length)} by saving:`);
  list.slice(0, limit).forEach((p, i) =>
    console.log(
      `  [${String(i).padStart(2)}] ${p.source.name} → ${p.match.name} (${p.match.brand}) ` +
        `ΔE ${p.match.deltaE.toFixed(1)}, save £${p.saving.toFixed(2)}`,
    ),
  );
  console.log(`\nRender one: factory t2 --index <n>${bait ? ' --bait' : ''}`);
}

async function main(): Promise<void> {
  const [cmd, ...rest] = process.argv.slice(2);
  ensureDir(OUT_ROOT);
  switch (cmd) {
    case 't2':
      await cmdT2(rest);
      break;
    case 't1':
      await cmdT1(rest);
      break;
    case 'qa':
      await cmdQa(rest);
      break;
    case 't3':
      await cmdT3(rest);
      break;
    case 'bank':
      await cmdBank(rest);
      break;
    case 'list-swaps':
      cmdListSwaps(rest);
      break;
    case 'list-schemes':
      cmdListSchemes(rest);
      break;
    default:
      console.log(
        [
          'SchemeStealer video factory',
          '',
          '  factory t1 --date <YYYY-MM-DD>                       render one Swatchle',
          '  factory t2 [--paint <id>] [--bait] [--index N]       render one Budget Swap',
          '             [--min-de <n>] [--max-de <n>]             (ΔE band override for variety)',
          '  factory t3 [--scheme "<model>"] [--index N]          render one Scheme Proof',
          '  factory bank [--t1-start <date>] [--t1-count 10]     render the whole launch bank',
          '               [--t2-clean 5] [--t2-bait 3] [--t3-count 0]   (one bundle, QA each, CSV)',
          '  factory list-swaps [--bait] [--min-de/--max-de] [--limit N]   preview swap candidates',
          '  factory list-schemes [--limit N]                    preview scheme candidates',
          '  factory qa <clipDir>                                re-run QA on a clip',
        ].join('\n'),
      );
      process.exitCode = cmd ? 1 : 0;
  }
}

main().catch((err) => {
  console.error('\n✖', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
