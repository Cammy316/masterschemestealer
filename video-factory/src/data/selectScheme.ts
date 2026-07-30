// T3 Scheme Proof selector: resolve a famous scheme's official vs budget palette to
// priced, index-aligned swatch chips. Deterministic — pure data, no model calls.
//
// The "proof" is visual (the swatches plainly match) plus the real price delta from
// BRAND_PRICES. T3 makes NO ΔE claim (the palettes are curated, not per-pair measured),
// so nothing here fabricates a colour-distance number.
import { proofSchemes, paintById, type ProofScheme } from './loadData.js';
import { priceFor, normaliseBrand } from './prices.js';

export interface SchemeChip {
  name: string;
  brand: string;
  hex: string;
  price: number;
}

export interface SchemeProps {
  model: string;
  original: SchemeChip[];
  budget: SchemeChip[];
  originalTotal: number;
  budgetTotal: number;
  saving: number;
  slug: string;
}

function resolveChip(paintId: string): SchemeChip {
  const p = paintById(paintId);
  if (!p) throw new Error(`Scheme references unknown paint_id "${paintId}".`);
  return { name: p.name, brand: normaliseBrand(p.brand), hex: p.hex, price: priceFor(p.brand) };
}

function toProps(s: ProofScheme): SchemeProps {
  const original = s.originalPalette.map(resolveChip);
  const budget = s.budgetPalette.map(resolveChip);
  const originalTotal = round2(original.reduce((a, c) => a + c.price, 0));
  const budgetTotal = round2(budget.reduce((a, c) => a + c.price, 0));
  return {
    model: s.model,
    original,
    budget,
    originalTotal,
    budgetTotal,
    saving: round2(originalTotal - budgetTotal),
    slug: schemeSlug(s.model),
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** All schemes with a positive saving, biggest saving first (strongest hook). */
export function listSchemes(): SchemeProps[] {
  return proofSchemes()
    .map(toProps)
    .filter((p) => p.saving > 0)
    .sort((a, b) => b.saving - a.saving || a.model.localeCompare(b.model));
}

/**
 * Select one Scheme Proof.
 * @param idOrModel  scheme id, model name, or slug; undefined → biggest-saving auto-pick
 * @param index      pick the Nth-ranked scheme instead (variety for a batch)
 */
export function selectScheme(idOrModel: string | undefined, index = 0): SchemeProps {
  const list = listSchemes();
  if (list.length === 0) throw new Error('No proof schemes with a positive saving.');
  if (idOrModel) {
    const needle = idOrModel.toLowerCase();
    const raw = proofSchemes().find(
      (s) => s.id.toLowerCase() === needle || s.model.toLowerCase() === needle || schemeSlug(s.model) === needle,
    );
    if (!raw) {
      throw new Error(`Scheme "${idOrModel}" not found. Try a model name, id, or slug from list-schemes.`);
    }
    return toProps(raw);
  }
  if (index < 0 || index >= list.length) {
    throw new Error(`--index ${index} out of range (0…${list.length - 1}).`);
  }
  return list[index];
}

export function schemeSlug(model: string): string {
  return (
    'scheme-' +
    model
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}
