/**
 * Patches @tailwindcss/postcss to fix Turbopack + monorepo resolution issue.
 *
 * Root cause: When Turbopack runs PostCSS it doesn't set opts.from, so
 * @tailwindcss/postcss falls back to path.dirname(process.cwd()), which is
 * the repo root rather than the app directory. enhanced-resolve then looks for
 * tailwindcss in the repo root's node_modules (which doesn't exist).
 *
 * Fix: when opts.from is empty, use process.cwd() directly (the `r` variable
 * already in scope) instead of path.dirname(process.cwd()).
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../node_modules/@tailwindcss/postcss/dist/index.js');

if (!fs.existsSync(file)) {
  console.log('patch-tailwind-postcss: file not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(file, 'utf8');

const ORIGINAL = 'let c=$.default.dirname($.default.resolve(u))';
const PATCHED  = 'let c=u?$.default.dirname($.default.resolve(u)):r';

if (content.includes(PATCHED)) {
  console.log('patch-tailwind-postcss: already applied, skipping');
  process.exit(0);
} else if (content.includes(ORIGINAL)) {
  content = content.replace(ORIGINAL, PATCHED);
  fs.writeFileSync(file, content);
  console.log('patch-tailwind-postcss: applied successfully');
  process.exit(0);
} else {
  // Upstream changed the target string. Don't fail the build — the patch may no
  // longer be necessary (or needs revisiting), but a postinstall non-zero exit
  // would break every Vercel build. Log and exit 0.
  console.warn('patch-tailwind-postcss: target string not found — @tailwindcss/postcss may have been updated. Skipping (no-op). Check if the patch is still needed.');
  process.exit(0);
}
