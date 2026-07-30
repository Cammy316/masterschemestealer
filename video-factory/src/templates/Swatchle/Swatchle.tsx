// T1 — Swatchle Quiz. Guess the paint from its swatch. The flagship pillar.
// Timeline (30fps, 840 frames = 28s): garble hook → three wrong-guess buzzers → hint
// cards → reveal at the loop point → CTA that returns to the opening frame.
import React from 'react';
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Backdrop, SwatchBlock, DisplayText, MonoText, Stamp, BrandPlate } from '../../components/atoms.js';
import { COLOURS } from '../../theme.js';
import type { AuguryProps } from '../../data/selectAugury.js';
import { swatchleManifest } from './timing.js';

const SKIN = 'imperial' as const;
export { swatchleManifest };

// Deterministic scramble so the opening frame is identical at t=0 and loop-close.
function garbleName(name: string): string {
  const glyphs = '█▓▒░#@%&';
  let out = '';
  for (let i = 0; i < name.length; i++) {
    const c = name[i];
    if (c === ' ') out += ' ';
    else out += glyphs[(name.charCodeAt(i) + i) % glyphs.length];
  }
  return out;
}

const OpeningFrame: React.FC<{ props: AuguryProps }> = ({ props }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 56 }}>
    <DisplayText size={62} colour={COLOURS.green}>
      NAME THIS PAINT
    </DisplayText>
    <MonoText size={30}>ONLY REAL PAINTERS GET IT IN 3</MonoText>
    <SwatchBlock hex={props.answer.hex} size={620} glow={props.answer.hex} />
    <DisplayText size={44} colour={COLOURS.inkDim} style={{ letterSpacing: '6px' }}>
      {garbleName(props.answer.name)}
    </DisplayText>
  </AbsoluteFill>
);

const DecoyBeat: React.FC<{ hex: string; guess: { name: string; brand: string }; n: number }> = ({
  hex,
  guess,
  n,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      <SwatchBlock hex={hex} size={440} glow={hex} />
      <div style={{ transform: `scale(${enter})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <MonoText size={30}>GUESS {n}</MonoText>
        <DisplayText size={64}>{guess.name}</DisplayText>
        <MonoText size={26}>{guess.brand.toUpperCase()}</MonoText>
        <Stamp colour={COLOURS.danger} size={64} rotate={-8}>
          WRONG
        </Stamp>
      </div>
    </AbsoluteFill>
  );
};

const HintCard: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 30 });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateX(${(1 - s) * 60}px)`,
        border: `2px solid ${COLOURS.greenDim}`,
        borderRadius: 18,
        padding: '26px 40px',
        backgroundColor: 'rgba(0,255,65,0.05)',
        width: 780,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <MonoText size={30} colour={COLOURS.greenDim} style={{ textAlign: 'left' }}>
        {label}
      </MonoText>
      <DisplayText size={44} colour={COLOURS.ink} style={{ textAlign: 'right' }}>
        {value}
      </DisplayText>
    </div>
  );
};

const HintsBeat: React.FC<{ props: AuguryProps }> = ({ props }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 40 }}>
    <SwatchBlock hex={props.answer.hex} size={360} glow={props.answer.hex} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <HintCard label="FAMILY" value={props.hints.family} delay={0} />
      <HintCard label="TONE" value={props.hints.tone} delay={25} />
      <HintCard label="SITS BESIDE" value={props.hints.neighbour} delay={50} />
    </div>
  </AbsoluteFill>
);

const RevealBeat: React.FC<{ props: AuguryProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 50 }}>
      <MonoText size={34} colour={COLOURS.green}>
        IT WAS…
      </MonoText>
      <div style={{ transform: `scale(${pop})` }}>
        <SwatchBlock hex={props.answer.hex} size={520} glow={props.answer.hex} />
      </div>
      <DisplayText size={78} colour={COLOURS.green}>
        {props.answer.name}
      </DisplayText>
      <MonoText size={34}>{props.answer.brand.toUpperCase()}</MonoText>
    </AbsoluteFill>
  );
};

const CtaBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 40, opacity: rise }}>
      <BrandPlate skin={SKIN} sub="daily paint quiz" />
      <MonoText size={34} colour={COLOURS.green}>
        schemestealer.com/daily
      </MonoText>
    </AbsoluteFill>
  );
};

export const Swatchle: React.FC<{ props: AuguryProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const loopFade = interpolate(frame, [760, 839], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Backdrop skin={SKIN}>
      <Sequence from={0} durationInFrames={90}>
        <OpeningFrame props={props} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <DecoyBeat hex={props.answer.hex} guess={props.wrongGuesses[0]} n={1} />
      </Sequence>
      <Sequence from={180} durationInFrames={90}>
        <DecoyBeat hex={props.answer.hex} guess={props.wrongGuesses[1]} n={2} />
      </Sequence>
      <Sequence from={270} durationInFrames={90}>
        <DecoyBeat hex={props.answer.hex} guess={props.wrongGuesses[2]} n={3} />
      </Sequence>
      <Sequence from={360} durationInFrames={200}>
        <HintsBeat props={props} />
      </Sequence>
      <Sequence from={560} durationInFrames={200}>
        <RevealBeat props={props} />
      </Sequence>
      <Sequence from={720} durationInFrames={120}>
        <CtaBeat />
      </Sequence>
      {/* Loop-close back to the opening frame. */}
      <AbsoluteFill style={{ opacity: loopFade }}>
        <Backdrop skin={SKIN}>
          <OpeningFrame props={props} />
        </Backdrop>
      </AbsoluteFill>
    </Backdrop>
  );
};
