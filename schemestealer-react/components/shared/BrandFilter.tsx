/**
 * BrandFilter - Multi-brand selection component
 * Allows filtering paint results by brand with persistent preferences
 */

'use client';

import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface BrandFilterProps {
  mode: 'miniature' | 'inspiration';
}

export function BrandFilter({ mode }: BrandFilterProps) {
  const { preferredBrands, setPreferredBrands } = useAppStore();

  const brands = [
    { id: 'all', name: 'All Brands', icon: '⚔️' },
    { id: 'citadel', name: 'Citadel', icon: '🏛️' },
    { id: 'vallejo', name: 'Vallejo', icon: '🎨' },
    { id: 'army-painter', name: 'Army Painter', icon: '🖌️' },
  ];

  const isActive = (brandId: string) => {
    if (brandId === 'all') {
      return preferredBrands.includes('all');
    }
    return preferredBrands.includes(brandId) || preferredBrands.includes('all');
  };

  const handleBrandToggle = (brandId: string) => {
    if (brandId === 'all') {
      setPreferredBrands(['all']);
    } else {
      // Remove 'all' if selecting specific brand
      const newBrands = preferredBrands.filter((b) => b !== 'all');

      if (newBrands.includes(brandId)) {
        // Remove this brand
        const filtered = newBrands.filter((b) => b !== brandId);
        setPreferredBrands(filtered.length === 0 ? ['all'] : filtered);
      } else {
        // Add this brand
        setPreferredBrands([...newBrands, brandId]);
      }
    }
  };

  const themeColors =
    mode === 'miniature'
      ? {
          border: 'border-green-500',
          text: 'text-green-500',
          bg: 'bg-green-600',
          hover: 'hover:bg-green-500/10',
        }
      : {
          border: 'border-purple-500',
          text: 'text-purple-500',
          bg: 'bg-purple-600',
          hover: 'hover:bg-purple-500/10',
        };

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {brands.map((brand) => (
        <motion.button
          key={brand.id}
          onClick={() => handleBrandToggle(brand.id)}
          className={`
            px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
            border-2 ${
              isActive(brand.id)
                ? `${themeColors.bg} text-white ${themeColors.border} shadow-lg`
                : `${themeColors.border} ${themeColors.text} ${themeColors.hover} bg-transparent`
            }
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">{brand.icon}</span>
          {brand.name}
        </motion.button>
      ))}
    </div>
  );
}
