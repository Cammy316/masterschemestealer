/**
 * Persistent badge shown on results produced by the in-browser fallback engine
 * (analysisSource === 'local'), warning that accuracy is reduced. Compact enough
 * to hold at 320px width.
 */

'use client';

export function LocalAuspexBadge() {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2">
      <span className="text-amber-400 text-sm leading-none mt-0.5" aria-hidden>
        ⚠
      </span>
      <p className="text-amber-300/90 text-xs leading-relaxed tech-text">
        Local auspex reading — reduced accuracy. Rescan when the vox link returns.
      </p>
    </div>
  );
}

export default LocalAuspexBadge;
