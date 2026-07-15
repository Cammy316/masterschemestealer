import { motion, AnimatePresence } from 'framer-motion';

interface WarmupStripProps {
  theme: 'cogitator' | 'warp';
  onUseLocal: () => void;
}

export function WarmupStrip({ theme, onUseLocal }: WarmupStripProps) {
  const isWarp = theme === 'warp';
  
  const borderColor = isWarp ? 'border-[var(--warp-purple-light)]/50' : 'border-[var(--cogitator-green)]/50';
  const bgColor = isWarp ? 'bg-[var(--warp-purple)]/10' : 'bg-[var(--cogitator-green)]/10';
  const textColor = isWarp ? 'text-[var(--warp-purple-light)]' : 'text-[var(--cogitator-green)]';
  const glyph = isWarp ? '◆' : '⚙';
  const message = isWarp ? 'Warp conduit stabilising (~60s)' : 'Machine Spirit waking (~60s)';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full max-w-2xl mx-auto overflow-hidden"
      >
        <div className={`flex items-center justify-between py-2 px-3 border ${borderColor} ${bgColor} ${textColor} mb-4 rounded-md`}>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="text-sm drop-shadow-md inline-block"
            >
              {glyph}
            </motion.span>
            <span className="text-[11px] font-mono uppercase tracking-widest">{message}</span>
          </div>
          <button
            onClick={onUseLocal}
            className="touch-target text-[11px] font-bold underline font-mono uppercase tracking-widest text-[var(--imperial-gold)] hover:text-amber-400 transition-colors"
          >
            USE LOCAL AUSPEX
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
