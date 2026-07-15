import { PAINT_DATABASE, PaintData } from './paintDatabase';

export function searchPaints(query: string, limit = 8): PaintData[] {
  if (!query.trim()) return [];
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  
  return PAINT_DATABASE.filter((paint) => {
    if (!paint.matchable) return false;
    const searchString = `${paint.brand} ${paint.name} ${paint.aliases.join(' ')}`.toLowerCase();
    return searchTerms.every(term => searchString.includes(term));
  }).slice(0, limit);
}
