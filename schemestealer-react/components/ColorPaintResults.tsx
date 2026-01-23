'use client';

import { BrandRecipeAccordion } from './BrandRecipeAccordion';

interface Paint {
  name: string;
  brand: string;
  type: string;
  hex: string;
  deltaE: number;
}

interface PaintsByBrand {
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

interface ColorPaintResultsProps {
  colorName: string;
  colorHex: string;
  colorPercentage: number;
  paintsByBrand: PaintsByBrand;
  mode: 'miniature' | 'inspiration';
  onAddToCart?: (paint: Paint) => void;
}

export function ColorPaintResults({
  colorName,
  colorHex,
  colorPercentage,
  paintsByBrand,
  mode,
  onAddToCart,
}: ColorPaintResultsProps) {
  const themeColors = mode === 'miniature'
    ? { text: 'text-green-500', font: 'font-imperial' }
    : { text: 'text-purple-400', font: 'font-warp' };

  const brands = [
    { name: 'Citadel', icon: '🏛️', key: 'citadel' as const },
    { name: 'Vallejo', icon: '🎨', key: 'vallejo' as const },
    { name: 'Army Painter', icon: '🖌️', key: 'armyPainter' as const },
  ];

  return (
    <div className="space-y-4">
      {/* Color header - NO DUPLICATE SWATCH, whole number percentage */}
      <div className="text-center">
        <h3 className={`text-xl font-bold ${themeColors.text} ${themeColors.font} mb-1`}>
          {colorName}
        </h3>
        <p className="text-sm text-gray-300">
          {colorHex} • {Math.round(colorPercentage)}%
        </p>
      </div>

      {/* Brand recipe accordions */}
      <div className="space-y-3">
        {brands.map((brand, index) => (
          <BrandRecipeAccordion
            key={brand.key}
            brandName={brand.name}
            brandIcon={brand.icon}
            paintsByStep={paintsByBrand[brand.key]}
            mode={mode}
            defaultOpen={index === 0}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
