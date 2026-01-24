/**
 * Transform backend v3.0 triad format to frontend array format
 *
 * Backend sends triads with single paint + alternatives:
 * {
 *   "Citadel": {
 *     "base": {...},
 *     "layer": {...},
 *     "alternatives": {base: [], layer: []}
 *   }
 * }
 *
 * Frontend expects arrays:
 * {
 *   citadel: {
 *     base: [main, ...alternatives],
 *     layer: [main, ...alternatives]
 *   }
 * }
 */

import type { Paint } from './types';

interface BackendTriad {
  base: Paint | null;
  layer: Paint | null;
  shade: Paint | null;
  highlight: Paint | null;
  alternatives?: {
    base?: Paint[];
    layer?: Paint[];
  };
}

interface BackendTriadsByBrand {
  Citadel?: BackendTriad | null;
  Vallejo?: BackendTriad | null;
  'Army Painter'?: BackendTriad | null;
  Scale75?: BackendTriad | null;
}

interface RecipePaintsByBrand {
  citadel: {
    base: Paint[];
    layer: Paint[];
    shade: Paint[];
    highlight: Paint[];
  };
  vallejo: {
    base: Paint[];
    layer: Paint[];
    shade: Paint[];
    highlight: Paint[];
  };
  armyPainter: {
    base: Paint[];
    layer: Paint[];
    shade: Paint[];
    highlight: Paint[];
  };
}

/**
 * Convert backend triad format to frontend array format
 * Combines main paint with alternatives into arrays
 */
export function transformToRecipeStructure(triads: BackendTriadsByBrand): RecipePaintsByBrand {
  const convertTriad = (triad: BackendTriad | null | undefined) => {
    if (!triad) {
      return {
        base: [],
        layer: [],
        shade: [],
        highlight: [],
      };
    }

    return {
      base: triad.base ? [triad.base, ...(triad.alternatives?.base || [])] : [],
      layer: triad.layer ? [triad.layer, ...(triad.alternatives?.layer || [])] : [],
      shade: triad.shade ? [triad.shade] : [],
      highlight: triad.highlight ? [triad.highlight] : [],
    };
  };

  return {
    citadel: convertTriad(triads.Citadel),
    vallejo: convertTriad(triads.Vallejo),
    armyPainter: convertTriad(triads['Army Painter']),
  };
}
