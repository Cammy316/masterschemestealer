// T2 — Budget Swap. Premium Citadel paint vs its cheapest visual twin.
// Timeline (30fps, 660 frames = 22s): hook price-tag → swatches merge → ΔE verdict →
// price counter rolls down → CTA → loop-close back to the opening frame.
import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { Backdrop, SwatchBlock, DisplayText, MonoText, Stamp } from '../../components/atoms.js';
import { COLOURS, bandVerdict } from '../../theme.js';
import type { SwapProps } from '../../data/selectSwap.js';
import { budgetSwapManifest } from './timing.js';

const SKIN = 'imperial' as const;
export { budgetSwapManifest };

function gbp(n: number): string {
  return `£${n.toFixed(2)}`;
}

// STATIC opening frame — reused at t=0 and at the loop-close so first ≈ last frame.
const OpeningFrame: React.FC<{ props: SwapProps }> = ({ props }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 60 }}>
    <div
      style={{
        fontFamily: 'inherit',
        transform: 'rotate(-4deg)',
      }}
    >
      <Stamp colour={COLOURS.gold} size={64} rotate={-4}>
        {gbp(props.source.price)} FOR THIS?
      </Stamp>
    </div>
    <SwatchBlock hex={props.source.hex} size={560} glow={props.source.hex} />
    <DisplayText size={52} colour={COLOURS.ink}>
      {props.source.name}
    </DisplayText>
    <MonoText size={30}>{props.source.brand.toUpperCase()}</MonoText>
  </AbsoluteFill>
);

const MergeBeat: React.FC<{ props: SwapProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 0..135 local. Slide the two swatches from the sides toward centre and settle side-by-side.
  const slide = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 60 });
  const gap = interpolate(slide, [0, 1], [700, 24]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', gap, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <SwatchBlock hex={props.source.hex} size={420} glow={props.source.hex} />
          <DisplayText size={34} style={{ marginTop: 22 }}>
            {props.source.name}
          </DisplayText>
          <MonoText size={24} style={{ marginTop: 6 }}>
            {props.source.brand.toUpperCase()} · {gbp(props.source.price)}
          </MonoText>
        </div>
        <div style={{ textAlign: 'center' }}>
          <SwatchBlock hex={props.match.hex} size={420} glow={props.match.hex} />
          <DisplayText size={34} style={{ marginTop: 22 }}>
            {props.match.name}
          </DisplayText>
          <MonoText size={24} style={{ marginTop: 6 }}>
            {props.match.brand.toUpperCase()} · {gbp(props.match.price)}
          </MonoText>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VerdictBeat: React.FC<{ props: SwapProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 200 } });
  const verdict = bandVerdict(props.match.deltaE);
  const colour = verdict.heresy ? COLOURS.pink : COLOURS.green;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 70 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <SwatchBlock hex={props.source.hex} size={330} radius={24} />
        <SwatchBlock hex={props.match.hex} size={330} radius={24} />
      </div>
      <div style={{ transform: `scale(${pop})` }}>
        <Stamp colour={colour} size={72} rotate={-6}>
          ΔE {props.match.deltaE.toFixed(1)}
        </Stamp>
      </div>
      <DisplayText size={54} colour={colour}>
        {verdict.label}
      </DisplayText>
    </AbsoluteFill>
  );
};

const PriceBeat: React.FC<{ props: SwapProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  // roll from source price down to match price across 0..70
  const rolled = interpolate(frame, [0, 70], [props.source.price, props.match.price], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const saveIn = interpolate(frame, [75, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <MonoText size={34}>SAME COLOUR. NOT THE SAME PRICE.</MonoText>
      <DisplayText size={200} colour={COLOURS.gold} weight={700} style={{ letterSpacing: '2px' }}>
        {gbp(rolled)}
      </DisplayText>
      <div style={{ opacity: saveIn, transform: `translateY(${(1 - saveIn) * 30}px)` }}>
        <Stamp colour={COLOURS.green} size={70} rotate={-4}>
          SAVE {gbp(props.saving)} / POT
        </Stamp>
      </div>
    </AbsoluteFill>
  );
};

const CtaBeat: React.FC<{ props: SwapProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  return (
    <AbsoluteFill
      style={{ alignItems: 'center', justifyContent: 'center', gap: 46, opacity: rise }}
    >
      <SwatchBlock hex={props.match.hex} size={360} glow={props.match.hex} />
      <DisplayText size={58}>
        USE {props.match.name}
      </DisplayText>
      <MonoText size={30} colour={COLOURS.green}>
        schemestealer.com/convert/{props.convertSlug}
      </MonoText>
    </AbsoluteFill>
  );
};

export const BudgetSwap: React.FC<{ props: SwapProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const loopFade = interpolate(frame, [600, 659], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Backdrop skin={SKIN}>
      <Sequence from={0} durationInFrames={90}>
        <OpeningFrame props={props} />
      </Sequence>
      <Sequence from={75} durationInFrames={135}>
        <MergeBeat props={props} />
      </Sequence>
      <Sequence from={210} durationInFrames={120}>
        <VerdictBeat props={props} />
      </Sequence>
      <Sequence from={330} durationInFrames={150}>
        <PriceBeat props={props} />
      </Sequence>
      <Sequence from={480} durationInFrames={120}>
        <CtaBeat props={props} />
      </Sequence>
      {/* Loop-close: fade the static opening frame back to full for a seamless second watch. */}
      <AbsoluteFill style={{ opacity: loopFade }}>
        <Backdrop skin={SKIN}>
          <OpeningFrame props={props} />
        </Backdrop>
      </AbsoluteFill>
    </Backdrop>
  );
};
