// T3 — Scheme Proof. A famous scheme's official palette vs a budget palette that matches
// it, with the real price saving. Proof is visual (swatches match) + price, no ΔE claim.
// Timeline (30fps, 720 frames = 24s): model + official palette hook → budget swatches
// rise beneath each colour → saving stamp → CTA → loop-close.
import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { Backdrop, SwatchBlock, DisplayText, MonoText, Stamp, BrandPlate } from '../../components/atoms.js';
import { COLOURS } from '../../theme.js';
import type { SchemeProps, SchemeChip } from '../../data/selectScheme.js';
import { schemeProofManifest } from './timing.js';

const SKIN = 'imperial' as const;
export { schemeProofManifest };

function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

// swatch size scales down as the palette grows so 3–5 colours still fit 1080 wide.
function chipSize(count: number): number {
  return Math.min(260, Math.floor(940 / count) - 30);
}

const ChipLabel: React.FC<{ chip: SchemeChip; size: number }> = ({ chip, size }) => (
  <div style={{ width: size, textAlign: 'center' }}>
    <DisplayText size={26} colour={COLOURS.ink} style={{ marginTop: 12 }}>
      {chip.name}
    </DisplayText>
    <MonoText size={20} style={{ marginTop: 4 }}>
      {chip.brand.toUpperCase()}
    </MonoText>
  </div>
);

// STATIC opening frame — reused at t=0 and loop-close so first ≈ last frame.
const OpeningFrame: React.FC<{ props: SchemeProps }> = ({ props }) => {
  const size = chipSize(props.original.length);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 50 }}>
      <Stamp colour={COLOURS.gold} size={54} rotate={-4}>
        {gbp(props.originalTotal)} TO PAINT THIS?
      </Stamp>
      <DisplayText size={64} colour={COLOURS.ink}>
        {props.model}
      </DisplayText>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center' }}>
        {props.original.map((chip, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SwatchBlock hex={chip.hex} size={size} glow={chip.hex} />
            <ChipLabel chip={chip} size={size} />
          </div>
        ))}
      </div>
      <MonoText size={28} colour={COLOURS.gold}>
        THE OFFICIAL PALETTE · {gbp(props.originalTotal)}
      </MonoText>
    </AbsoluteFill>
  );
};

const SwapBeat: React.FC<{ props: SchemeProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const size = chipSize(props.original.length);
  const budgetTotal = interpolate(frame, [30, 100], [props.originalTotal, props.budgetTotal], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 44 }}>
      <MonoText size={32} colour={COLOURS.green}>
        THE SAME SCHEME — FOR LESS
      </MonoText>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center' }}>
        {props.original.map((orig, i) => {
          const rise = spring({ frame: frame - 10 - i * 12, fps, config: { damping: 200 }, durationInFrames: 30 });
          const budget = props.budget[i];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <SwatchBlock hex={orig.hex} size={size} radius={20} />
              <div style={{ fontSize: 34, color: COLOURS.greenDim, lineHeight: 1 }}>↓</div>
              <div style={{ opacity: rise, transform: `translateY(${(1 - rise) * 40}px)` }}>
                <SwatchBlock hex={budget.hex} size={size} radius={20} glow={budget.hex} />
                <ChipLabel chip={budget} size={size} />
              </div>
            </div>
          );
        })}
      </div>
      <DisplayText size={120} colour={COLOURS.green} style={{ letterSpacing: '2px' }}>
        {gbp(budgetTotal)}
      </DisplayText>
    </AbsoluteFill>
  );
};

const SavingBeat: React.FC<{ props: SchemeProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const size = chipSize(props.budget.length) - 60;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 54 }}>
      <div style={{ display: 'flex', gap: 18 }}>
        {props.budget.map((c, i) => (
          <SwatchBlock key={i} hex={c.hex} size={size} radius={16} />
        ))}
      </div>
      <div style={{ transform: `scale(${pop})` }}>
        <Stamp colour={COLOURS.green} size={78} rotate={-5}>
          SAVE {gbp(props.saving)}
        </Stamp>
      </div>
      <MonoText size={34}>PER MODEL · SAME LOOK</MonoText>
    </AbsoluteFill>
  );
};

const CtaBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 44, opacity: rise }}>
      <DisplayText size={58} colour={COLOURS.ink}>
        MATCH YOUR WHOLE ARMY
      </DisplayText>
      <BrandPlate skin={SKIN} sub="measured, not guessed" />
      <MonoText size={32} colour={COLOURS.green}>
        schemestealer.com
      </MonoText>
    </AbsoluteFill>
  );
};

export const SchemeProof: React.FC<{ props: SchemeProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const loopFade = interpolate(frame, [660, 719], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Backdrop skin={SKIN}>
      <Sequence from={0} durationInFrames={90}>
        <OpeningFrame props={props} />
      </Sequence>
      <Sequence from={90} durationInFrames={240}>
        <SwapBeat props={props} />
      </Sequence>
      <Sequence from={330} durationInFrames={150}>
        <SavingBeat props={props} />
      </Sequence>
      <Sequence from={480} durationInFrames={120}>
        <CtaBeat />
      </Sequence>
      <AbsoluteFill style={{ opacity: loopFade }}>
        <Backdrop skin={SKIN}>
          <OpeningFrame props={props} />
        </Backdrop>
      </AbsoluteFill>
    </Backdrop>
  );
};
