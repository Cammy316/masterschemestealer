#!/usr/bin/env node
/**
 * Thin shim so the post-mux harness joins the standard commit gate as
 * `npm run qa:video`.
 *
 * It runs on the python-api venv rather than the ambient interpreter: the
 * ambient python on this machine has no numpy/scipy (and no fastapi, which is
 * why `pytest` fails there too).
 */
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '..', '..');
const harness = path.join(repoRoot, 'video-qa', 'qa_video.py');

const candidates = [
  path.join(repoRoot, 'python-api', 'venv', 'Scripts', 'python.exe'),
  path.join(repoRoot, 'python-api', 'venv', 'bin', 'python'),
];
const python = candidates.find((p) => fs.existsSync(p));

if (!python) {
  console.error(
    'qa:video: no python-api virtualenv found. Expected one of:\n  ' +
      candidates.join('\n  ')
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    'usage: npm run qa:video -- <file.mp4> [more.mp4 ...] [--mode pict|warp] [--json DIR]'
  );
  process.exit(2);
}

// The harness runs from the repo root, so paths the user typed relative to
// schemestealer-react would resolve against the wrong directory. Rewrite any
// argument that names an existing file/dir here into an absolute path, and
// leave flags and their values alone.
const resolved = args.map((a) => {
  if (a.startsWith('-')) return a;
  const abs = path.resolve(process.cwd(), a);
  return fs.existsSync(abs) ? abs : a;
});

const res = spawnSync(python, [harness, ...resolved], {
  stdio: 'inherit',
  cwd: repoRoot,
});
process.exit(res.status === null ? 1 : res.status);
