// T2 Budget Swap selector: resolve a premium (Citadel) source paint to its cheapest
// visually-equivalent cross-brand match. Deterministic — no model calls, pure data.
import { conversions, paintById, type ConversionEntry, type ConversionMatch } from './loadData.js';
import { priceFor, normaliseBrand } from './prices.js';

export interface SwapProps {
  source: { name: string; brand: string; hex: string; price: number };
  match: {
    name: string;
    brand: string;
    hex: string;
    slug: string;
    deltaE: number;
    band: string;
    price: number;
  };
  saving: number; // source.price - match.price, GBP (>= 0)
  bait: boolean; // true = ΔE 2.5–3.5 "close enough or heresy?" variant
  convertSlug: string; // /convert/<slug> deep link
}

const PREMIUM_BRAND = 'Citadel';
// Clean win vs comment-bait ΔE windows (campaign §1 / runbook Step 4).
const CLEAN_MAX = 2.0;
const BAIT_MIN = 2.5;
const BAIT_MAX = 3.5;
// Auto-pick only surfaces sources that make good TV AND carry an honest measured ΔE:
// a measured swatch (never an "assumed" wash/ink) with enough chroma to read on the
// dark backdrop. Chroma is plain arithmetic over the shipped lab (invariant #7-safe).
const MIN_CHROMA = 8;

function isInterestingSource(sourcePaintId: string): boolean {
  const gt = paintById(sourcePaintId);
  if (!gt) return false;
  if (gt.color_source !== 'swatch-median') return false; // exclude assumed washes/inks
  const chroma = Math.hypot(gt.lab[1], gt.lab[2]);
  return chroma >= MIN_CHROMA;
}

interface Candidate {
  key: string;
  entry: ConversionEntry;
  match: ConversionMatch;
  saving: number;
}

// Best CHEAPER cross-brand match for one source, within a ΔE window.
function bestCheaperMatch(
  entry: ConversionEntry,
  minDE: number,
  maxDE: number,
): { match: ConversionMatch; saving: number } | null {
  const sourcePrice = priceFor(entry.source.brand);
  let best: { match: ConversionMatch; saving: number } | null = null;
  for (const brand of Object.keys(entry.matches)) {
    const brandPrice = priceFor(brand);
    const saving = sourcePrice - brandPrice;
    if (saving <= 0) continue; // budget swap = must be cheaper
    for (const m of entry.matches[brand]) {
      if (m.delta_e < minDE || m.delta_e > maxDE) continue;
      // A same-name match reads as the same product, not a swap — skip it.
      if (m.name.toLowerCase() === entry.source.name.toLowerCase()) continue;
      // Prefer the lowest ΔE; break ties on the bigger saving.
      if (
        !best ||
        m.delta_e < best.match.delta_e ||
        (m.delta_e === best.match.delta_e && saving > best.saving)
      ) {
        best = { match: m, saving };
      }
    }
  }
  return best;
}

// Selection controls. `bait` drives the template's "heresy?" copy; the ΔE band selects
// the pool. minDe/maxDe override the band (e.g. to pull mid-ΔE variety for a batch).
export interface SwapQuery {
  bait?: boolean;
  minDe?: number;
  maxDe?: number;
}

function resolveBand(q: SwapQuery): [number, number] {
  if (q.minDe !== undefined || q.maxDe !== undefined) {
    return [q.minDe ?? 0, q.maxDe ?? BAIT_MAX];
  }
  return q.bait ? [BAIT_MIN, BAIT_MAX] : [0, CLEAN_MAX];
}

function buildCandidates(minDE: number, maxDE: number): Candidate[] {
  const all = conversions().paints;
  const out: Candidate[] = [];
  for (const key of Object.keys(all)) {
    const entry = all[key];
    if (normaliseBrand(entry.source.brand) !== PREMIUM_BRAND) continue;
    if (!isInterestingSource(entry.source.paint_id)) continue;
    const found = bestCheaperMatch(entry, minDE, maxDE);
    if (found) out.push({ key, entry, match: found.match, saving: found.saving });
  }
  // The hook is the saving ("£5.50 for THIS?"), so lead with the biggest saving; break
  // ties on the tightest ΔE, then id for deterministic stability.
  out.sort(
    (a, b) =>
      b.saving - a.saving ||
      a.match.delta_e - b.match.delta_e ||
      a.key.localeCompare(b.key),
  );
  // Some Citadel paints appear under multiple conversions.json keys; a clip's identity is
  // (source paint, match paint), so collapse duplicates — keep the best-ranked one.
  const seen = new Set<string>();
  const deduped: Candidate[] = [];
  for (const c of out) {
    const id = `${c.entry.source.name.toLowerCase()}::${c.match.paint_id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    deduped.push(c);
  }
  return deduped;
}

function toProps(c: Candidate, bait: boolean): SwapProps {
  return {
    source: {
      name: c.entry.source.name,
      brand: normaliseBrand(c.entry.source.brand),
      hex: c.entry.source.hex,
      price: priceFor(c.entry.source.brand),
    },
    match: {
      name: c.match.name,
      brand: brandOfMatch(c.entry, c.match),
      hex: c.match.hex,
      slug: c.match.slug,
      deltaE: c.match.delta_e,
      band: c.match.band,
      price: priceFor(brandOfMatch(c.entry, c.match)),
    },
    saving: Math.round(c.saving * 100) / 100,
    bait,
    convertSlug: c.match.slug,
  };
}

function brandOfMatch(entry: ConversionEntry, match: ConversionMatch): string {
  for (const brand of Object.keys(entry.matches)) {
    if (entry.matches[brand].some((m) => m.paint_id === match.paint_id)) return brand;
  }
  return 'Unknown';
}

/** The full ranked candidate list as props — used by the batch runner to spread picks. */
export function listSwaps(q: SwapQuery = {}): SwapProps[] {
  const [minDE, maxDE] = resolveBand(q);
  return buildCandidates(minDE, maxDE).map((c) => toProps(c, q.bait === true));
}

/**
 * Select one Budget Swap.
 * @param paintId  explicit source paint_id (Citadel), or undefined to auto-pick top
 * @param q        selection controls (bait copy, ΔE band, index into the ranked list)
 */
export function selectSwapWith(
  paintId: string | undefined,
  q: SwapQuery & { index?: number },
): SwapProps {
  const [minDE, maxDE] = resolveBand(q);
  const candidates = buildCandidates(minDE, maxDE);
  if (candidates.length === 0) {
    throw new Error(`No Budget Swap candidate found in ΔE [${minDE}, ${maxDE}].`);
  }
  if (paintId) {
    const hit = candidates.find((c) => c.key === paintId);
    if (!hit) {
      throw new Error(
        `Paint "${paintId}" has no cheaper match in ΔE [${minDE}, ${maxDE}]. ` +
          `Try --paint on a Citadel id, widen --min-de/--max-de, or drop --paint to auto-pick.`,
      );
    }
    return toProps(hit, q.bait === true);
  }
  const i = q.index ?? 0;
  if (i < 0 || i >= candidates.length) {
    throw new Error(`--index ${i} out of range (0…${candidates.length - 1}).`);
  }
  return toProps(candidates[i], q.bait === true);
}

/** Back-compat convenience: auto-pick (or explicit paint) at the default band. */
export function selectSwap(paintId: string | undefined, bait: boolean): SwapProps {
  return selectSwapWith(paintId, { bait });
}

/** Human-readable slug for the output folder name. */
export function swapSlug(props: SwapProps): string {
  return `swap-${props.convertSlug}`.replace(/[^a-z0-9-]/gi, '').toLowerCase();
}
