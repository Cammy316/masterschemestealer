/**
 * Transform paint matches to recipe structure grouped by type
 */

import type { Paint } from './types';

interface PaintsByBrand {
  citadel: Paint[];
  vallejo: Paint[];
  armyPainter: Paint[];
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
 * Groups paints by type (base, layer, shade, highlight) within each brand
 * Sorts by deltaE (lowest first) within each type
 */
export function transformToRecipeStructure(paintsByBrand: PaintsByBrand): RecipePaintsByBrand {
  const groupByType = (paints: Paint[]) => {
    const grouped = {
      base: [] as Paint[],
      layer: [] as Paint[],
      shade: [] as Paint[],
      highlight: [] as Paint[],
    };

    paints.forEach((paint) => {
      const type = paint.type || 'layer'; // Default to layer if no type
      if (type === 'base') {
        grouped.base.push(paint);
      } else if (type === 'layer') {
        grouped.layer.push(paint);
      } else if (type === 'shade') {
        grouped.shade.push(paint);
      } else if (type === 'highlight') {
        grouped.highlight.push(paint);
      } else {
        // Unknown type, default to layer
        grouped.layer.push(paint);
      }
    });

    // Sort each group by deltaE (lowest first)
    Object.keys(grouped).forEach((key) => {
      grouped[key as keyof typeof grouped].sort((a, b) => {
        const deltaA = a.deltaE ?? Infinity;
        const deltaB = b.deltaE ?? Infinity;
        return deltaA - deltaB;
      });
    });

    return grouped;
  };

  return {
    citadel: groupByType(paintsByBrand.citadel || []),
    vallejo: groupByType(paintsByBrand.vallejo || []),
    armyPainter: groupByType(paintsByBrand.armyPainter || []),
  };
}
