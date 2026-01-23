'use client';

import { BrandAccordionSection } from './BrandAccordionSection';

interface Paint {
  name: string;
  brand: string;
  type: string;
  hex: string;
  deltaE: number;
}

interface PaintsByBrand {
  citadel: Paint[];
  vallejo: Paint[];
  armyPainter: Paint[];
}

interface PaintResultsAccordionProps {
  colorName: string;
  colorHex: string;
  colorPercentage: number;
  paintsByBrand: PaintsByBrand;
  mode: 'miniature' | 'inspiration';
  onAddToCart?: (paint: Paint) => void;
}

export function PaintResultsAccordion({
  colorName,
  colorHex,
  colorPercentage,
  paintsByBrand,
  mode,
  onAddToCart,
}: PaintResultsAccordionProps) {
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
      {/* Color header - NO DUPLICATE SWATCH */}
      <div className="text-center">
        <h3 className={`text-xl font-bold ${themeColors.text} ${themeColors.font} mb-1`}>
          {colorName}
        </h3>
        <p className="text-sm text-gray-400">
          {colorHex} • {colorPercentage}% coverage
        </p>
      </div>

      {/* Brand accordion sections */}
      <div className="space-y-3">
        {brands.map((brand, index) => (
          <BrandAccordionSection
            key={brand.key}
            brandName={brand.name}
            brandIcon={brand.icon}
            paints={paintsByBrand[brand.key]}
            mode={mode}
            defaultOpen={index === 0} // First brand open by default
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
