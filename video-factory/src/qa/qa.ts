// Automated QA (pipeline synthesis directive). For a rendered clip's composition it:
//  (a) renders the first + last frame and pixel-diffs them → loop-close score;
//  (b) checks the hook lands ≤3 s and every manifest beat sits inside the composition;
//  (c) renders a beat contact-strip + hook/reveal thumbnails and title variants.
// Uses Remotion's own renderStill (deterministic) — no external ffmpeg.
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { renderStillFrame, durationLastFrame } from '../render.js';
import type { TemplateManifest } from '../templates/manifest.js';

const LOOP_SIMILARITY_MIN = 0.97; // last frame must be ≥97% identical to the first

export interface QaResult {
  pass: boolean;
  loopSimilarity: number;
  beatChecks: { name: string; frame: number; ok: boolean; reason?: string }[];
  hookOk: boolean;
  qaDir: string;
}

function loadPng(file: string): PNG {
  return PNG.sync.read(readFileSync(file));
}

export async function runQa(
  compositionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps: Record<string, any>,
  manifest: TemplateManifest,
  clipDir: string,
): Promise<QaResult> {
  const qaDir = resolve(clipDir, 'qa');
  if (!existsSync(qaDir)) mkdirSync(qaDir, { recursive: true });

  const last = durationLastFrame(manifest.durationInFrames);
  const firstPath = resolve(qaDir, 'frame-first.png');
  const lastPath = resolve(qaDir, 'frame-last.png');

  await renderStillFrame({ compositionId, inputProps, frame: 0, output: firstPath });
  await renderStillFrame({ compositionId, inputProps, frame: last, output: lastPath });

  // (a) loop-close pixel diff
  const a = loadPng(firstPath);
  const b = loadPng(lastPath);
  const { width, height } = a;
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  writeFileSync(resolve(qaDir, 'loop-diff.png'), PNG.sync.write(diff));
  const loopSimilarity = 1 - mismatched / (width * height);

  // (b) beat checks + hook window; also render each beat for the contact strip
  const hookSeconds = manifest.hookEndFrame / manifest.fps;
  const hookOk = hookSeconds <= 3.0;
  const beatChecks: QaResult['beatChecks'] = [];
  for (const beat of manifest.beats) {
    const inRange = beat.frame >= 0 && beat.frame < manifest.durationInFrames;
    beatChecks.push({
      name: beat.name,
      frame: beat.frame,
      ok: inRange,
      reason: inRange ? undefined : 'beat frame outside composition',
    });
    await renderStillFrame({
      compositionId,
      inputProps,
      frame: Math.min(beat.frame, last),
      output: resolve(qaDir, `beat-${String(beat.frame).padStart(4, '0')}-${beat.name}.png`),
    });
  }

  // (c) thumbnails + title variants
  copyFileSync(firstPath, resolve(qaDir, 'thumb-hook.png'));
  const revealBeat = manifest.beats.find((x) => x.name === 'reveal') ?? manifest.beats[manifest.beats.length - 2];
  await renderStillFrame({
    compositionId,
    inputProps,
    frame: Math.min(revealBeat.frame, last),
    output: resolve(qaDir, 'thumb-reveal.png'),
  });
  writeTitleVariants(clipDir, qaDir, manifest);

  const pass = loopSimilarity >= LOOP_SIMILARITY_MIN && hookOk && beatChecks.every((c) => c.ok);
  writeReport(qaDir, { pass, loopSimilarity, beatChecks, hookOk, qaDir }, manifest, hookSeconds);
  return { pass, loopSimilarity, beatChecks, hookOk, qaDir };
}

function writeTitleVariants(clipDir: string, qaDir: string, manifest: TemplateManifest): void {
  // Seed from the shorts.txt TITLE line if present.
  let baseTitle = `${manifest.label}`;
  const shorts = resolve(clipDir, 'shorts.txt');
  if (existsSync(shorts)) {
    const m = readFileSync(shorts, 'utf-8').match(/TITLE:\s*(.+)/);
    if (m) baseTitle = m[1].trim();
  }
  const variants = [
    baseTitle,
    baseTitle.replace(/\s*\(.*\)$/, '') + ' — you won’t believe the match',
    'I measured it: ' + baseTitle,
  ];
  writeFileSync(resolve(qaDir, 'titles.txt'), variants.join('\n') + '\n', 'utf-8');
}

function writeReport(
  qaDir: string,
  r: Omit<QaResult, 'qaDir'>,
  manifest: TemplateManifest,
  hookSeconds: number,
): void {
  const lines = [
    `# QA — ${manifest.label} (${manifest.id})`,
    '',
    `Result: ${r.pass ? '✅ PASS' : '❌ FAIL'}`,
    '',
    `- Loop close: ${(r.loopSimilarity * 100).toFixed(2)}% similar (min ${LOOP_SIMILARITY_MIN * 100}%) — ${r.loopSimilarity >= LOOP_SIMILARITY_MIN ? 'ok' : 'FAIL'}`,
    `- Hook window: ${hookSeconds.toFixed(2)}s (must be ≤ 3.00s) — ${r.hookOk ? 'ok' : 'FAIL'}`,
    '',
    '## Beats',
    ...r.beatChecks.map((c) => `- ${c.ok ? 'ok' : 'FAIL'} \`${c.name}\` @ frame ${c.frame}${c.reason ? ` — ${c.reason}` : ''}`),
    '',
    '## Manual (30s)',
    '- [ ] Legible at phone size (open frame-first.png / thumb-reveal.png on your phone)',
    '- [ ] British English throughout',
    '- [ ] Loop actually feels seamless on a second watch',
    '',
  ].join('\n');
  writeFileSync(resolve(qaDir, 'report.md'), lines, 'utf-8');
}
