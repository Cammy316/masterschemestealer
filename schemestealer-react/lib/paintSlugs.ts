export function slugify(brand: string, name: string): string {
  const combined = `${brand}-${name}`.toLowerCase();
  return combined.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function slugifyBrand(brand: string): string {
  return brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
