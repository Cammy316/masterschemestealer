// Programmatic Remotion render. Bundles the project ONCE per process and reuses the
// serve URL for both the MP4 encode and QA still frames. Deterministic options live
// here (not remotion.config.ts, which only the CLI preview path reads).
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));

let bundlePromise: Promise<string> | null = null;

function getBundle(): Promise<string> {
  if (!bundlePromise) {
    bundlePromise = bundle({
      entryPoint: resolve(HERE, 'index.ts'),
      // We write ESM-style `.js` import specifiers (resolved to .ts/.tsx by tsx in the
      // CLI). Teach Remotion's webpack the same mapping so the browser bundle resolves.
      webpackOverride: (config) => ({
        ...config,
        resolve: {
          ...config.resolve,
          extensionAlias: {
            ...(config.resolve?.extensionAlias ?? {}),
            '.js': ['.ts', '.tsx', '.js'],
          },
        },
      }),
    });
  }
  return bundlePromise;
}

export interface RenderArgs {
  compositionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps: Record<string, any>;
  outputLocation: string;
  onProgress?: (pct: number) => void;
}

export async function renderTemplate(args: RenderArgs): Promise<void> {
  const serveUrl = await getBundle();
  const composition = await selectComposition({
    serveUrl,
    id: args.compositionId,
    inputProps: args.inputProps,
  });
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: args.outputLocation,
    inputProps: args.inputProps,
    // 9:16 masters, MP4 with faststart so platforms accept them directly.
    muted: true,
    overwrite: true,
    onProgress: ({ progress }) => args.onProgress?.(progress),
  });
}

export interface StillArgs {
  compositionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputProps: Record<string, any>;
  frame: number;
  output: string;
}

export async function renderStillFrame(args: StillArgs): Promise<void> {
  const serveUrl = await getBundle();
  const composition = await selectComposition({
    serveUrl,
    id: args.compositionId,
    inputProps: args.inputProps,
  });
  await renderStill({
    composition,
    serveUrl,
    frame: args.frame,
    output: args.output,
    inputProps: args.inputProps,
    imageFormat: 'png',
    overwrite: true,
  });
}

export function durationLastFrame(durationInFrames: number): number {
  return durationInFrames - 1;
}
