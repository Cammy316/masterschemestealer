// Config for `remotion studio` / `remotion render` (the CLI preview path).
// The `factory` CLI renders programmatically via src/render.ts and does NOT read this
// file — render options are set there so batch renders stay deterministic.
import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
