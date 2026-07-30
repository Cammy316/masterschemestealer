// Per-pot list prices (GBP), factory-local. The app's PAINT_PRICES (lib/utils.ts) only
// carries the three brands the cart prices; Budget Swap needs all six to roll a price
// delta. These are marketing list figures — edit when brand RRPs move. NEVER doctor a
// delta to look better than reality (runbook: "What you never do").
export const BRAND_PRICES: Record<string, number> = {
  Citadel: 5.5,
  Vallejo: 3.5,
  'Army Painter': 4.0,
  AK: 3.2,
  'Pro Acryl': 4.5,
  'Two Thin Coats': 5.0,
};

// conversions.json labels Citadel *sources* "Citadel / Warhammer Colour" while its
// *matches* (and these price keys) use the short "Citadel". Normalise to the short form.
const BRAND_ALIASES: Record<string, string> = {
  'Citadel / Warhammer Colour': 'Citadel',
};

export function normaliseBrand(brand: string): string {
  return BRAND_ALIASES[brand] ?? brand;
}

export function priceFor(brand: string): number {
  return BRAND_PRICES[normaliseBrand(brand)] ?? 4.0;
}
