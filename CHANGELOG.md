# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-08-11 (Inspiration upload: camera only, on mobile)

Tapping the inspiration portal on a phone opened the camera and offered nothing
else — no photo library, no file browser.

### Cause
`capture="environment"` on the file input. The attribute does not mean "offer
the camera", it means **use** the camera: mobile browsers honour it by skipping
the Photo Library / Take Photo / Browse chooser entirely.

That made the tab's primary flow unreachable on its primary device. The
inspiration tab exists to steal a colour scheme out of an image you already have
— a screenshot, a saved photo, a poster someone sent you — and none of those
were selectable.

### Fixed
Attribute removed. The OS now shows its normal chooser, with the camera still
one tap away. `accept="image/*"` stays, so the picker is still filtered to
images.

### Test
`tests/upload-source.spec.ts`, at a phone viewport. This defect is **invisible on
desktop** — the chooser is a file dialog either way — so nobody developing on a
laptop would notice it return. Verified by reintroducing the attribute: the test
fails, and passes again once removed.

### Not changed
`app/miniature/page.tsx:148` still carries `capture="environment"`. The case for
it is stronger there (you photograph the model in front of you), but it has the
same consequence: a painter cannot upload an existing photo of their miniature
from the gallery. Flagged rather than changed, since only the inspiration tab
was reported.

## [Unreleased] - 2026-08-11 (Warp-Cast — inspiration-tab shareable video)

The inspiration tab can now export a shareable clip. It could not before for a
structural reason: inspiration scans return colours and full per-brand recipes
but **no segmentation masks**, and the miniature storyboard is mask-gated end to
end. Sixteen commits; five visual iterations against user feedback and a
reference image (`Testimages/Example.jpg`).

### What it is
A **Cinema Palettes poster**, 14 s, 1080×1920: the photograph full-bleed with a
row of solid colour swatches beneath it on an off-white ground, and no permanent
type anywhere. The clip earns that poster one colour at a time — each colour
blooms at the place it actually occurs in the image, lifts as a droplet, falls,
and its swatch pours in from the bottom — then holds it and loops.

### Architecture
- **`revealStoryboard.ts`** — `RevealStoryboard { mode, buildSpec, prepare,
  composeAt, audioSchedule? }`. Both engines take one, so the encode path (frame
  pacing, BT.709, the `colr` byte patch, backpressure, abort) has exactly ONE
  implementation. A second copy of the encoder would have meant a second place
  for the colr bug to come back.
- **`warpTimeline.ts`** — the warp-cast's own 14 s phase table. v1 reused the
  miniature's, and that single decision is what made it "the pict-cast wearing
  purple": proof → smash → sweep → slam is a scan narrative, and inheriting it
  meant inheriting its beats and its cuts. The encode path needed MACHINERY from
  the miniature; the clip took its GRAMMAR.
- **`warpCompose.ts`** · **`warpAudio.ts`** · **`warpOrigins.ts`** ·
  **`revealTheme.ts`**
- `RevealSpec` gains optional `wall`; `revealLayout` gains wall-row derivations.

### Notable decisions
- **Origins are scanned from pixels**, using summed-area tables and plain
  squared-RGB distance — "which part of the picture is most this colour" is not
  a perceptual-difference question, and CIEDE2000 stays reserved for paint
  matching. Separation between orbs is a PREFERENCE, not a constraint: when a
  photo genuinely has one region of a colour, inventing a second location
  elsewhere would be a lie.
- **Swatches are ordered by tone, decoupled from pour order.** Colours pour in
  coverage order because that drives the audio beats; position is a design
  decision.
- **Labels are transient.** Each paint name and ΔE appears as its colour lands,
  stays while the palette assembles, then fades. The finished poster — the frame
  people screenshot — carries nothing but a faint `schemestealer` mark.
- **ΔE is a quiet figure, never a coloured alarm.** A hard-to-match photo
  legitimately returns several values above 10; rendering that as red pills reads
  as the product failing rather than being honest. Numbers never altered.
- **Filling a 9:16 frame from a 4:3 reference is a real geometric conflict.**
  Holding the reference's 73/24 split at 1080 wide needs a portrait image. So the
  photo crops no further than **4:5** and the swatch row absorbs the remainder.

### Defects found and fixed
- **The video was 3 seconds shorter than its own soundtrack.** A device export
  measured an 11.000 s video track against 14.016 s of audio: the payoff hold and
  the entire loop dissolve were never rendered. Two sources of truth for
  duration — the frame loop used the requested length, the audio used
  `spec.durationMs`. The spec is now authoritative.
- **Warp exports drew imperial-green scanlines**; `buildBaseLayer` had no skin
  parameter.
- **Every orb rim rendered green** — `labelTint` returned `rgb(...)`, which
  `hexToRgba` cannot parse, silently falling back to imperial green.
- **The inspiration tab was covered in imperial-green badges**, because the ΔE
  ramp used a THEME colour to carry SEMANTIC meaning. `qualityColour(deltaE,
  skin)` now separates them; thresholds stay shared so the same measurement never
  reads differently between tabs.
- **The loop seam was not pixel-exact** — the blurred backdrop had sub-opaque
  edge pixels, so the loop-target blit did not fully replace the frame.
- **Frame 0 cropped the photo**; **paint names vanished into light swatches**;
  the watermark sat below the safe floor.

### Two things worth remembering
**A test that supplies the value under test cannot see the bug.** The warp encode
test passed `durationMs: 2000` to stay quick, which made the requested and chosen
lengths agree — and that agreement was the entire defect.

**A guard that cannot fail is worse than no guard.** The first imperial-green
sweep passed on a page that was still green: it parsed `getComputedStyle` with an
`rgb()` regex, and Tailwind v4 emits `lab()`, so every class-based colour was
invisible to it. Found only by deliberately reverting the fix and checking the
guard failed. It did not. Both guards are now verified against the defect they
exist for.

### The landing beat took three attempts to make honest
A wash across the whole frame tinted the PHOTOGRAPH — the one thing a
colour-accuracy tool must not do, and something the miniature clip already
refuses. Confining it to the palette but drawing it on top tinted the
neighbouring SWATCHES, which are paint colours we claim to have measured. It is
now drawn underneath, surviving only in the gutters, plus a geometric overshoot
of the landing swatch that cannot misrepresent a colour at all.

### Measured (warp bed, all six gates)
| gate | value | threshold |
|---|---|---|
| bed energy < 250 Hz | 99.9% | > 60% |
| bed energy > 3 kHz | 9.6e-9 | < 10% |
| HF within ±60 ms of a beat | 78.7% | > 65% |
| integrated loudness | −14.79 LUFS | −14 ±1 |
| true peak | −1.30 dBFS | < −1 |
| crest factor | 12.52 dB | > 12 |

Anti-freeze quietest 0.4 s window **0.653** (floor 0.5). Watermark luma spread
50 on a white photo / 102 on a dark one, at 40% opacity.

The warp encode is also **smaller** than the miniature's — flat colour bands
compress far better than a full-photo field.

### Verification
`vitest` 792 · `tsc` clean · `pytest` 670 passed 1 skipped · `next build` exit 0 ·
`reveal-export` 4/4 · `warp-export` 6/6 · `reveal-encode` 2/2, both modes
`bt709,bt709,bt709`, warp streams `[14, 14.016]`.

### Still unverified
No device export of the current build. Open questions: whether the pours land on
recognisable parts of a real photograph, and whether the landing flash — kept
deliberately restrained — reads at all on a phone.

## [Unreleased] - 2026-08-08 (Pict-Cast v5.3 — corrective pass)

Driven by measuring a real device export (`MobileV6.mp4`, exported 14 hours after
v5.2 shipped, so unlike the v5.2 brief this one analysed the right code).

**Three of the defects below were introduced by v5.2's own fixes.** The pattern is
worth stating plainly: several v5.2 acceptance criteria measured a *proxy* instead
of the property, and the cheapest way to satisfy them made the video worse. Every
replacement gate here measures the thing itself.

### Fixed
- **The BT.709 fix from v5.2 never landed.** Root cause found in the muxer
  (`mediabunny.cjs:27416`): the `colr` atom is written from
  `decoderConfig.colorSpace` — the ENCODER'S output metadata — not from the input
  `VideoSample` that v5.2 tagged. A hardware encoder reports BT.601 and the muxer
  faithfully writes it. New `lib/reveal/mp4ColrPatch.ts` rewrites the atom in the
  muxed bytes: encoder-independent, idempotent, and it logs what the atom said
  before, which is the only signal we get about what a device actually reported.
  The end-to-end ffprobe assertion is **structurally incapable** of catching this
  — headless Chrome uses the software encoder and has emitted bt709 throughout the
  bug's life — so the patcher has a unit test against the exact bytes a device
  shipped (5, 6, 6). That test caught a real loop-bound bug in the patcher on its
  first run.
- **The audio bed sounded like tape noise.** v5.2 was asked for "≥15% of energy
  above 1 kHz" as a stand-in for "audible on a phone speaker"; the cheapest way to
  pass was a continuous 2–7 kHz hiss plus a free-running tick every 0.31 s, with
  the hum cut 0.3 → 0.05. The hiss and the metronome are gone and the hum is the
  bed again. Highs are now EVENTS: a 130→58 Hz sine sweep plus a ~40 ms noise
  crack, fired on the storyboard beats. Loudness had to be rebuilt too — a rumble
  bed and −14 LUFS pull in opposite directions because K-weighting discounts the
  sub band, so a 70 Hz high-pass, a +10 dB bell at 1.4 kHz and a +6 dB shelf above
  2.6 kHz now supply it. Measured: **−14.72 LUFS, −1.27 dBTP, 12.49 dB crest,
  bed 90.5% below 250 Hz and ~0% above 3 kHz, 87.0% of HF energy within ±60 ms of
  a scheduled beat** (those windows cover only 9.3% of the runtime).
- **The layout was asymmetric.** `SAFE_RECT` spanned x 40–900 (centre 470) and
  text centred on 505, while the corner brackets, scan sweep and model all centre
  on the frame — every heading sat 35 px left of the furniture around it. Now
  x 180–900: centre exactly 540, right edge exactly 900. Symmetry and clearing the
  action rail together FORCE this; the brief's proposed x 90–990 is symmetric but
  puts content back under the rail. 540 is asserted as a literal, because deriving
  it from `SAFE_RECT` would agree with any future rect.
- **The watermark flickered.** Gated on `phase !== 'proof' && hud > 0`, it was
  absent from frame 0 and absent again under the end card — the two frames most
  likely to be screenshotted. Now drawn every frame at constant position, size and
  opacity.
- **Three seconds of the clip were a still image.** Measured properly — compose at
  30 Hz, diff consecutive frames, slide a 0.4 s window — the calmest window scored
  a mean channel delta of **0.012** against a floor of 0.5. A hold is by definition
  the absence of phase change, so no phase-driven animation can fix it; there is
  now a continuous ambient layer (deterministic sensor grain + a refresh band)
  that never asks what phase it is, both periodic in elapsed fraction so the loop
  seam survives. After: **1.016** worst window, 1.503 overall.
- **The ΔE badge shared the base row**, right-aligned, squeezing the paint name
  into a 332 px box and making the one MEASUREMENT in the clip read as a suffix on
  a product name. It now has its own bordered pill on its own line.
- **The loop dissolve was 0.4 s**, short enough to read as a cut rather than a
  return. Now 0.6 s.
- **Leader lines** are extracted from between the `ctx.moveTo` calls into a pure
  `calloutLeaderPath()`, so the two properties that matter can be asserted: the
  path ends ON its anchor, and it is long enough to see.

### Added
- **Pixel-level anti-freeze gate.** Replaces a test that could not fail: it
  serialised `frameState` fields and then explicitly skipped both holds, and
  camera drift mutates `frameState` every frame anyway (~0.1 px on a 780 px model
  during the payoff hold).
- **The loop seam is asserted.** This has been a comment since v5 and nothing
  compared the frames, so every layer added since could have broken the loop
  silently.
- **Bed-isolation audio rendering** (`scheduleRevealAudio(..., { layers: 'bed' })`)
  and `revealAudioBeats(spec)`, so the alignment gate reads the real schedule
  rather than a copy that could drift out of sync.
- **The symbol cipher now runs on the caption, the colour counter and the paint
  names**, not only region labels. Bursts are 180 ms, must be readable 80 ms
  before the next, and never fire inside a hold. `cipherBeats()` collapses
  colliding beats — at five regions the last counter tick and the phase change to
  "n COLOURS IDENTIFIED" are 15 ms apart.
- **Deterministic noise.** Both the audio bed and the video grain use mulberry32
  instead of `Math.random()`. The visual timeline has been deterministic since v3;
  the audio quietly was not, so loudness/peak/crest drifted every render — and the
  crest gate sits close enough to its threshold that noise alone could flip it.
- **The band below the safe area** (490 px, a quarter of the frame) was plain
  black. It now carries decoration only, so a caption bar can cover all of it at
  no cost to the viewer.

### Deliberately NOT done
- **The end card's paint count stays removed.** The brief asked to restore
  "1,312 measured paints", reversing a decision made one commit earlier. A number
  burned into an exported video cannot be corrected once the database changes.
- **The payoff hold stays at 3.0 s.** The brief specified 2.8 s. The hold was
  never too LONG, it was too STILL — trimming 200 ms would only have made the
  defect briefer, and 3.0 s came from direct feedback that this is the frame
  people screenshot.

## [Unreleased] - 2026-08-06 (Pict-Cast v5.2 — correctness & delivery)

Driven by a measured analysis of a real device export. Every item below was
measured from a shipped file, not guessed. Note the analysed export predated
v5.1 by 36 minutes, so three of its nine findings were already partly addressed
— the rest were real and are fixed here.

### Fixed
- **The MP4 was tagged BT.601.** Measured: desktop shipped
  `smpte170m,smpte170m,smpte170m` and mobile `bt470bg,smpte170m,smpte170m` on a
  1080×1920 file. Players and platform transcoders assume BT.709 for HD, so the
  same frame decoded under the wrong matrix drifts by up to **ΔE 4.9 — a full
  band — while the card claims ΔE 0.8**. A colour-accuracy product cannot ship a
  file that contradicts its own measurement. Nothing in our path ever stated a
  colour space; `CanvasSource` gave no injection point, so the renderer now uses
  `VideoSampleSource` and tags every frame explicitly.
- **Half the recipe sat under platform UI.** The SHADE and WASH rows were
  entirely inside TikTok's caption zone, the ΔE badge under the action rail, and
  the watermark at y≈1880 where nobody has ever seen it. New
  `lib/reveal/revealLayout.ts` owns a `SAFE_RECT` and a declared rect for every
  element that carries information. **The previous pass only considered the
  bottom edge — the right-hand action rail was never accounted for**, which is
  how the badge and both callout rails ended up underneath it.
- **The payoff was the shortest-lived state in the video.** All four rows plus
  the coloured model existed for 1.4 s of 11, while 4.0 s of the clip was
  frame-identical and the hook showed the proof for 0.6 s — not long enough to
  read a headline plus four paint names. Retimed at the same 11 s: proof holds
  2.0 s, five uniform 0.40 s region locks, and the complete state **holds for
  3.0 s** before a clean end card.
- **The end card was a ghost** — 0.5 s, never at full opacity, overlapping the
  rows fading beneath it. It now owns a clean frame for a full second.
- **The audio was physically inaudible on a phone.** 99% of its energy sat below
  1 kHz with literally nothing above 2 kHz, and phone speakers roll off hard
  below ~500 Hz. Hum cut, continuous 2–7 kHz cogitator hiss added, motion-tracker
  ticks throughout. Measured: **23.5% of energy above 1 kHz (was 1.0%),
  −14.5 LUFS (was −16.2), −1.9 dBTP (was −0.5)** — it was being clipped by the
  platforms' own normalisation.
- **A green wash over the hero.** The smash cut drew the model twice under
  `hue-rotate(±120°)`; rotating red by 120° yields green, measured as G exceeding
  R by 22 levels. Tinting the subject is the one thing this product must never
  do. The glitch moved to the backdrop and chrome.
- **A one-frame red pop.** `snapFlicker` returned 0.85 → 0 → 0.35, flashing the
  colour model back *after* it had gone grey. Now monotonically non-increasing.
- **The model's base stayed grey** through the reveal then popped back at the
  loop, reading as "the app missed half the model". The whole image now restores
  at the slam; the numbered callouts carry the detection message.

### Changed
- Model held at 40.1% of frame height (it had regressed while buying margin), and
  the dead band above the recipe closed.
- Copy: the counter never renders `0/n`; `DOMINANT · 5 RED` → `DOMINANT · RED`
  (it parsed as "five red" — the owning callout's pulse carries the link);
  `ΔE 0.8` → `ΔE 0.8 · PERFECT`, band word computed from the value.
- **The hardcoded paint count is gone from all public-facing copy.** A burned-in
  number in an exported video can never be corrected once the database changes;
  the honest claim ("physically measured") survives without it. Guarded by a test.

### Added
- Permanent ffprobe colour assertion, a layout-containment suite, an anti-freeze
  timeline guard, and FFT + BS.1770 loudness gates.

## [Unreleased] - 2026-08-06 (Pict-Cast v5.1 — legibility and weight)

Follow-up on the first v5 device export (`MobileV5.mp4` — verified as a genuine
v5 build: 11.03 s, 330 frames, H.264). A reviewer reported the cipher garble as
"missing" and the leaders as still crossing the model; extracting the callout
row at 30 fps showed the cipher working exactly as built (`Y><▓` → `YEL>▓` →
`YELLOW`), so the report was wrong on the mechanism but right that something was
off. Two real defects were behind it, plus three genuine catches.

### Fixed
- **The leader line was drawn straight through the label text.** On long labels
  like `DARK GREY` nearly the whole leader was buried under the glyphs, which is
  why those callouts looked attached to nothing — the geometry was fine, the
  z-order was not. Leaders now start clear of the measured label width.
- **Leaders drove to the region's centroid**, ploughing across the model to get
  there. Region masks are now measured for their normalised extent
  (`measureMaskBounds`, sampled at low resolution) and the leader stops at the
  region's NEAR EDGE.
- **The cipher was too fast to read.** Compressing extraction left the resolve at
  40 % of a much shorter bloom — ~0.23 s, present but subliminal. The label
  resolve is now decoupled from bloom length (~0.39 s, clamped so every label
  still lands by the end of the reveal).
- **The watermark sat in the platform's dead zone** at y=1874 (97.6 % down),
  where TikTok and Reels bury it under the caption and action rail. The whole
  lower block is now laid out against the safe area: everything that must be
  read finishes above ~82 %, and the empty band beneath is deliberate margin.
- **The slam had no sound.** The model resolving to full colour is the biggest
  visual beat in the clip and measured a −25 dBFS hole right before the payoff;
  it now lands on a sub impact with body and air (that bucket: −20.1 → −11.5).

### Changed
- **Region hits are mechanical clacks, not chimes.** Clean sine pips read as
  generic UI; a cogitator tearing data off a model should sound industrial. Each
  strike is a tight noise crack plus a low body, with only a trace of pitch so
  successive hits still climb.
- Pacing deliberately unchanged — the rapid extraction is doing its job, and
  missing a label on first watch is what earns the rewatch.

## [Unreleased] - 2026-08-06 (Pict-Cast v5 — proof-first restructure)

v4 fixed the machine: both device exports measured **390/390 frames, every frame
gap identical, H.264 MP4 + AAC**. Three independent critiques then agreed the
*content* still failed as short-form — it read as a polite diagnostic tool. This
is the content rebuild. No pipeline work.

### Changed
- **The clip now opens on the answer.** Frame 0 is the painter's model in full
  colour with the finished recipe already stamped over it, held ~0.6 s, then a
  glitch smash-cut to greyscale. The old opening asked "CAN THE MACHINE READ
  THIS PAINT JOB?" over a static model for two seconds — a yes/no question whose
  answer the viewer already assumed, spending the scroll decision on nothing.
  Keeping the *model* in the proof frame (rather than a bare recipe card) means
  painters are still posting their own work, which is the entire reason Engine A
  exists — and it makes the loop perfect for free, since the clip already ends
  on model + recipe.
- **Extraction compressed from ~6 s to ~2.2 s.** Five callouts landing one at a
  time was where mid-clip retention died. Labels persist once landed, so fast
  entries cost nothing in legibility.
- **Clip length 13 s → 11 s** — shorter loop, higher completion, and it stops the
  recipe phase padding once extraction is tightened. Every boundary is a fraction
  of the duration and the audio bed schedules off the same fractions, so both
  rebalanced automatically.
- **Model stays large in the outro** (~52 % frame height, was ~30 %) and the dead
  band above the recipe is closed.
- **Audio envelope inverted**: the recipe cascade is now the loudest passage,
  with a rising bed and a stamp per chip. It previously troughed at −24.6 dBFS
  exactly at the emotional peak while peaking mid-reveal.
- **Caption presets sell the result**: `THE EXACT PAINTS ON THIS MODEL`,
  `NEVER GUESS A RECIPE AGAIN`, `ΔE {n}. MEASURED, NOT GUESSED.` (real measured
  value only). None asserts anything the engine cannot know — no auto-generated
  chapter or army names, because it detects colours, not factions.

### Fixed
- **Garble no longer spells fake words.** Real exports rendered `CYSJ`,
  `SCGRBP`, `MAGENR9`, `BLASH`, `REB` — held long enough to read at 30 fps. A
  product selling measured accuracy cannot look like it can't spell. Unresolved
  characters are now block/symbol glyphs only, so a wrong-looking word is
  impossible by construction; the test asserts every intermediate character is
  either the true prefix or a non-letter.
- **Leaders no longer cross the model** — they run along the rail, turn at the
  model's edge, then make the final hop to the anchor.
- **Callouts for dark families are visible again.** The leader line and anchor
  dot were drawn in the region's true hex, so `BLACK` rendered as `#141414` on a
  void backdrop — a label connected to nothing. All callout chrome now uses the
  lightness-lifted tint; the honest colour story is carried by the revealed
  region on the model, which shows the actual paint.
- **The loop seam no longer doubles text.** `hudFade` now completes *before*
  `loopCrossfade` starts; they previously overlapped for ~0.26 s and the outgoing
  caption ghosted through the incoming one. The old test only checked
  `hudFade == 1` once `crossfade >= 0.5`, so it passed while the defect was on
  screen — it now asserts for any `crossfade > 0`.
- Recipe block gains a scrim so the heading is readable where it lands over the
  model during the proof stamp.

### Added
- **Export quality gate.** The share modal now names the dominant match and its
  ΔE band before you export, and warns plainly when it is `fair` or `distant`.
  A real export shipped with `ΔE 10.2` — distant, in red — as its climax and
  nothing objected. The honesty invariant is absolute: no ΔE is ever altered and
  the recipe still goes to the genuinely dominant colour. Export is never
  blocked; the user decides.
- `color-scheme: dark` on `:root` and via the viewport meta, with
  `tests/color-scheme.spec.ts` guarding six routes. An auto-dark extension was
  inverting the already-dark UI (CIELAB lightness flip — hues survived, so green
  stayed green); the declaration is the standards-level opt-out for any
  extension or browser auto-dark, and it fixes native scrollbars and controls.

## [Unreleased] - 2026-08-05 (Pict-Cast v4 — offline render: real MP4, no dropped frames)

Two device exports and the browser's own codec-support map settled both open
questions. Frame timings, parsed out of the WebM containers directly:

| Export | frames | fps | median gap | worst gap |
|---|---|---|---|---|
| v3 desktop (Firefox) | 170 | 12.8 | 83 ms | 217 ms |
| v3.1 desktop, after the perf pass | 378 | **28.4** | 33 ms | 231 ms |
| v3.1 **mobile** (Firefox Android) | 67 | **5.0** | 66 ms | **575 ms** |

The perf pass did land on desktop (median gap 33 ms = textbook 30 fps) but left
13 dropped frames and a 231 ms freeze, and mobile was untouched at 5 fps. Those
half-second mobile stalls are far longer than compose takes, which puts the
blame on the encoder, not the drawing.

**MediaRecorder cannot do this job.** It is a real-time, wall-clock recorder: if
a frame can't be encoded in time it drops it and moves on — there is a standing
W3C request (mediacapture-record#213) for the frame-by-frame recording we need
and it does not exist. On a phone, *software* VP8 encoding of a 1080×1920 frame
is itself slower than the frame budget. **And it can never give us MP4 here:** the
support map came back false for every MP4 and VP9 candidate and true only for
bare `video/webm` — that is Firefox, whose MediaRecorder does VP8/Opus and
nothing else. Three rounds of codec-string tuning were never going to work.

### Added
- **Offline WebCodecs renderer** (`lib/reveal/renderRevealOffline.ts`). Each
  frame is composed at its exact timeline position and handed to a `VideoEncoder`
  with an explicit timestamp, muxed with **Mediabunny** (MPL-2.0). There is no
  clock, so a slow frame makes the export take longer and can never make it
  stutter. Verified output: **H.264/AAC MP4, 1080×1920, exactly 60/60 frames for
  a 2 s clip, every frame gap identical, real duration metadata** — and rendered
  in 1.0 s, i.e. faster than real time. Codec ladder avc→vp9→vp8 (WebM still gets
  perfect pacing where H.264 is unavailable); mediabunny's probes run a real
  encoder configure, which matters because Firefox reports H.264 as supported and
  then throws.
- **Perf gate** (`tests/reveal-export.spec.ts`): composes at 2400×3200 — a real
  phone photo — and fails if any storyboard phase exceeds the frame budget. This
  is the hole the stutter fell through twice: the seed fixture is 400×600 and
  composes in 0.2 ms, so a 70 ms/frame regression was invisible to a green suite.
- **End-to-end encode test** (`tests/reveal-encode.spec.ts`). Unlike
  MediaRecorder, the offline pipeline has no real-time requirement, so the whole
  encode is testable. It runs in *real* Chrome: Playwright's bundled Chromium
  crashes its renderer the moment `VideoEncoder.encode()` is called (confirmed
  with raw WebCodecs, no library involved).

### Changed
- **Output scale knob.** Composition still happens in logical 1080×1920; the
  physical canvas and a context transform carry the scale, so no layout, font
  size or geometry constant changes.
- **The MediaRecorder path is now the fallback only**, for browsers with no
  WebCodecs at all (notably Firefox Android). It renders at **720×1280 and
  24 fps** — 2.25× fewer pixels for the software encoder, the difference between
  5 fps and something watchable — and the share modal says plainly that the clip
  was captured live at reduced size and that Chrome or Safari export a
  full-resolution MP4.
- Export analytics carry `engine`, `codec` and `resolution` alongside the codec
  support map, so a single export reports which pipeline ran.

## [Unreleased] - 2026-08-05 (Pict-Cast — smooth playback)

The exported clip played back stuttery. Measured cause, not the container: the
v3 device export contains **170 frames across 13.5 s — 12.6 fps** against a
requested 30. Timing `composeReveal` against realistic source photos showed why,
and showed why QA never caught it:

| Source photo | reveal | recipe | loop | (budget 33.3 ms) |
|---|---|---|---|---|
| 400×600 (the QA fixture) | 0.2 ms | 0.3 ms | 0.1 ms | 100× under |
| 1200×1800 (real phone) | 63 ms | 28 ms | 70 ms | **2× over** |
| 2400×3200 (real phone) | 70 ms | 31 ms | 76 ms | **2.3× over** |

Half the frames were never drawn in time, and MediaRecorder faithfully recorded
that. The Playwright fixture is 400×600 — 200× cheaper than a real scan — so
every frame rendered in 0.2 ms and the problem was structurally invisible to the
test suite.

### Fixed
- **Layers were kept at the source photo's native resolution.** A
  background-removed phone photo is ~12 MP, and a dozen layers of it (hero,
  greyscale, per-region, per-rim) were rescaled several times per frame. Layers
  are now built once at composition scale — the largest size the camera can ever
  draw them (`MAX_CAMERA_SCALE`), so they are never upscaled either.
- **The rim glow ran a full gaussian blur per region per frame.** The glow is
  now baked into the rim layer once; the identification pulse animates alpha
  over a pre-blurred layer, which looks the same and costs nothing.
- **The backdrop was repainted from scratch every frame** — three full-canvas
  gradients plus ~116 grid strips, and twice per frame during the loop
  crossfade — despite being fully determined by (size, skin). Rendered once and
  blitted.
- **The loop dissolve re-composed the entire frame-1 hero every frame.** It is
  `frameState(0)`, which never changes: baked once at prepare time. The seam is
  now provably exact — frame 0 and the final frame differ by **0 pixels**.
- **The outro re-drew the model from seven layers every frame** although the
  blooms had settled and only the camera was moving. Grey base plus all revealed
  regions are flattened into one layer and drawn once.
- **The draw loop free-ran on `setInterval`**, beating against `captureStream`'s
  own clock. It now draws on `requestAnimationFrame` (gated near the capture
  rate so a 120 Hz display doesn't draw four times per captured frame), with the
  timer retained as a watchdog so a backgrounded tab can't stall a recording.

Result at realistic source resolution: reveal 63→**19 ms**, recipe 28→**0.2 ms**,
loop 70→**0 ms**. The worst phase now uses 63% of the frame budget instead of
210% of it.

### Added
- `frame0` in the storyboard QA frames. `frame0` and `loop` must be
  pixel-identical — that pair *is* the loop seam; the existing `hero` frame is
  sampled mid-pull-back and legitimately differs from both.

## [Unreleased] - 2026-08-05 (Pict-Cast v3 — the hero stops the scroll)

Frame-by-frame review of the first two on-device v2 exports (desktop + mobile,
incl. a real red-marine scan) against scroll-stopping research: the outro and
loop were strong, but the first five seconds lost the viewer — a small static
product shot, then the dominant region blooming alone for 2.6 s right on the
3–6 s retention cliff. The mobile scan also exposed two real-scheme bugs the
synthetic QA masks could never show.

### Changed
- **The hero now fights for the scroll.** Frame 0 opens punched in at 1.35×
  (the model fills the frame) and pulls back as visible motion, with a gentle
  turntable-style rock, a breathing backlight tinted from the dominant colour,
  and the question hook "CAN THE MACHINE READ THIS PAINT JOB?" burned into the
  first frame. The snap lands with a chromatic-glitch strobe. The outro camera
  dives from the compact framing back into the same close-up, so the loop's
  final frame IS frame 1 (`drawLoopTarget` now derives from `frameState(0)` —
  the two can never drift).
- **The reveal escalates instead of sagging**: regions bloom smallest-coverage
  first so the dominant colour ignites last as the finale (on a marine: helmet
  → trims → the whole armour), blooms are capped at ~1.1 s (the first bloom
  previously ran 2.6 s alone), and the finale gets a stronger rim pulse plus a
  chord-and-thump audio beat.
- **Rim glow flashes instead of scribbling**: the rim now appears only during
  the identification pulse and is built from a smoothed (¼-scale round-trip)
  mask — real grabCut masks are full of pinholes, and v2's permanent outline
  traced every one of them like crayon.
- Recipe heading fades in with the box morph (it drew over the model's feet),
  and the ΔE badge follows the app's band colours (perfect/close/fair/distant)
  instead of flattering every match with green.

### Fixed
- **Dark schemes no longer scan as silhouettes**: greyscale base brightness now
  adapts to the model's measured luma (`adaptiveVideoDim`). The red marine's
  scan phase was a black cut-out; the pink test mini had only looked right
  because pink is light.
- **Dark-family callouts are readable**: label text, chip ring and number use
  `labelTint` — plain sRGB lift toward white to a luma floor — while leader
  lines and anchor dots stay true-hex. BLACK and BROWN callouts were invisible
  on the void backdrop.
- MP4 candidate list gains Opus-paired profiles (`avc1+opus`) — Chrome encodes
  Opus, not AAC, so the AAC pairings could never match there.

### Added
- **Container telemetry**: every export logs and attaches the full
  `isTypeSupported` verdict map to the `reveal_video_exported` event
  (`videoMimeSupport`). Two device exports in a row landed on VP8 WebM with no
  way to know why; the next one settles it with data instead of a third guess.
- Tests: hero motion + punched-in frame 0, loop camera parity incl. rotation,
  coverage-ordered blooms with caps, label tint floor, ΔE band mapping, MIME
  support map; the Playwright seed scan gains a near-black region so the
  dark-scheme paths are exercised by real frames.

## [Unreleased] - 2026-08-05 (Pict-Cast v2 — the export becomes postable)

Reviewing the first real export against the campaign's acceptance criteria
(`SOCIAL_MEDIA_CAMPAIGN.md` §1) found it failed nearly all of them. The
storyboard, composition, audio mix and container were reworked around one rule:
the painter's own model is the hook, and the clip has to survive a bright feed at
thumbnail size.

### Fixed
- **Exports were VP8 WebM** — a file Instagram refuses on upload and iOS cannot
  play. Both MP4 candidates were failing `MediaRecorder.isTypeSupported` because
  Chrome rejects the bare `avc1` shorthand; the candidate list now leads with
  full profile strings (`avc1.640028` / `avc1.42E01E` + `mp4a.40.2`) and WebM is
  a genuine last resort.
- **The loop never made it onto the tape.** Recording stopped the instant
  `t >= duration`, cutting the dissolve mid-crossfade; the recorder now holds the
  completed final frame for 320 ms. The crossfade also alpha-blended over
  still-drawn caption/labels/recipe/plate, ghosting them through the seam — HUD
  chrome now fades out fully *before* the dissolve carries any weight. Measured
  seam: mean pixel difference 0.012 between the first and last frames.
- **The audio bed was inaudible** — 40.3 dBFS RMS, flat, no transients, on
  platforms that normalise toward 14 LUFS and demote silent clips. Restaged
  gains, added attack transients (boot thud, charge riser, snap hit, per-region
  hits, loop swell) and a soft-knee tanh limiter: now 19.1 dBFS RMS, 1.1 dBFS
  peak, non-clipping.
- **Region blooms flattened the paint job.** The reveal drew real photo pixels
  correctly, but a shadow blur of up to 73 px was applied to the whole region
  layer, washing hex over the painter's blending. The glow moved to a dedicated
  hollow rim layer (dilate the mask, punch the original out); region pixels are
  now drawn clean.
- Recipe cascade order corrected to base→highlight→shade→wash, matching the app's
  recipe card instead of teaching a different sequence.

### Changed
- **New storyboard**: hero (full-colour model, slow push-in) → flicker-snap to
  greyscale → sweep that lights the model up behind the scan line → accelerating
  region blooms → recipe outro → plate → dissolve back to the hero. **The loop
  target is now the hero frame**, so a rewatch replays the snap-to-grey as its own
  hook. First colour is on screen at frame 0 (was 3.0 s, past the scroll
  decision).
- **The camera moves**: Ken Burns push-in with a micro-punch toward each blooming
  region, and the model eases into a compact framing for the outro so the recipe
  owns the lower frame. Camera returns home before the dissolve so the seam has
  no jump.
- **The outro says what it is for.** Five regions get called out but only one gets
  a breakdown — the heading now reads `{BRAND} RECIPE` over
  `DOMINANT · {n} {FAMILY}`, and that region's callout stays lit during the
  cascade. A ΔE badge is drawn on the **base step only**: ΔE measures distance
  from the detected colour, which derived partners do not, and labelling both
  "ΔE" would compare two different quantities.
- **Legibility at feed size**: family labels 24→36 px, chips and anchors enlarged,
  model box grown, sweep now drawn in the active skin's accent (it was hard-coded
  imperial green even on the Warp skin).
- **Caption counts up** — `SCANNING…` → `READING… k/n COLOURS` → `n COLOURS
  IDENTIFIED` — instead of stating the total from the first second.
- **Branding shrank**: a small persistent `schemestealer.com` corner watermark
  plus a reduced end plate, so the clip reads as the painter's flex rather than an
  advert they are posting for us.
- `buildBaseLayer` takes an explicit dim level. The exported clip needs a much
  brighter greyscale base than the on-screen reveal (thumbnail on a bright feed vs
  up close on a dark screen), so `SCREEN_BASE_DIM` / `VIDEO_BASE_DIM` are named
  constants rather than a forked layer builder — the shared look stays shared.
- `createRevealAudioBed` split into `scheduleRevealAudio` (graph) + the
  MediaStream plumbing, so the identical graph renders in an OfflineAudioContext
  and its loudness can be measured.

### Added
- Loudness regression gate in `tests/reveal-export.spec.ts`: renders the bed
  offline and asserts RMS > 26 dBFS and a non-clipping peak. The silent-audio
  bug shipped precisely because nothing ever checked.
- Timeline tests for the hook frame, the camera returning home for the loop, the
  HUD leading the dissolve, bloom acceleration, and the counting caption.

## [Unreleased] - 2026-07-30 (Content Bank Sprint + Broadcast Update)
### Added
- **Engine A — in-app scan-reveal video export ("pict-cast")**: from a Miniscan
  result, Share → EXPORT PICT-CAST records a ~13s 1080×1920 clip of the user's own
  model being read region-by-region by the machine spirit — greyscale→colour region
  blooms with hex-glow rims, garbling leader-line labels, a base→shade→highlight→wash
  recipe cascade, and a brand plate that dissolves back to frame 1 (seamless loop),
  over a synthesised cogitator audio bed. Deterministic, t-parameterised timeline;
  MP4 (avc1) with WebM/vp9 fallback; `navigator.share({files})` with a download
  fallback; per-platform copy-ready captions; three burned-in caption presets.
  Reuses the AuspexReveal visual language via shared layers, so an exported clip
  always matches the on-screen reveal. Gated on backend masks + MediaRecorder
  support; degrades gracefully otherwise. New `reveal_video_exported` analytics
  event. Miniature (green) flow first; Inspiration is a fast follow.
- **`video-factory/` — Engine B local content factory** (Remotion): batch-renders
  the launch content bank straight from the shipped data files. Three templates —
  T1 Swatchle (guess-the-paint), T2 Budget Swap (premium→cheapest measured match),
  T3 Scheme Proof (famous scheme's official vs budget palette) — plus a one-command
  `factory bank` runner (one bundle, QA each, summary CSV) and automated QA
  (loop-close pixel diff, hook-beat checks, thumbnails, title variants). Reads
  `schemestealer-react/lib/data/*.json` read-only; outputs git-ignored. Not part of
  the deployed app.
- **Footage capture plan** (`Skills&rules/FOOTAGE_CAPTURE_PLAN.md`): the desk-side
  shoot guide for the ~7 footage-based launch clips (the other 18 are data renders).
- Tests: `lib/__tests__/revealTimeline.test.ts` + `lib/__tests__/revealExport.test.ts`
  (timeline determinism + loop seam, MP4-first format selection, caption rules, spec
  building); `tests/reveal-export.spec.ts` (Playwright — export UI wiring + a
  deterministic 5-frame storyboard render). video-factory ships node:test selector
  tests.

### Changed
- **`components/ShareModal.tsx` reworked** from the placeholder swatch-grid image
  export into the pict-cast export flow, themed to the cogitator/warp tokens.
- **`AuspexReveal` now imports its base/region layer builders from the shared
  `lib/reveal/revealLayers` module** — a single source of truth for the reveal look,
  so the live reveal and the exported clip can never drift. Behaviour unchanged.

## [Unreleased] - 2026-07-16 (Dataslate Overhaul + Reveal Fix)
### Fixed
- **Miniscan reveal stuck on the wireframe (dev)**: StrictMode's mount-cleanup left
  the new unmount guard permanently true, so the wipe chain bailed thinking the
  component had unmounted. Guard now resets on (re)mount.

### Changed
- **Dataslate content curated**: the old generator padded 52 real tips with 350
  clones of one sentence template (87% of the pool — the repetition players
  noticed). Replaced with 98 hand-curated painting tips and 87 W40K/Fantasy quotes,
  **every quote attributed to a named character or canonical in-universe source**,
  rendered as its own right-aligned line. Tips display plain (advice isn't a
  quotation); quotes keep their quote marks. Scraper dependency removed; the
  generator validates (no dupes, all attributed, length caps) and fails loudly.
- **No-repeat rotation**: the ticker steps through a shuffled deck instead of
  picking randomly — nothing repeats until the whole pool has been shown.

### Added
- `lib/__tests__/dataslateContent.test.ts`: variety floors (≥80 tips, ≥60 quotes),
  every quote attributed, zero duplicate texts, length cap.

## [Unreleased] - 2026-07-16 (Pre-Launch Audit Batch 5: App-Wide Tightening)
### Removed
- **Four dead loader components deleted** (`LoadingAnimations`, `PageLoader`,
  `ModelDownloadProgress`, `ScanReveal` — imported but never rendered anywhere) plus
  the orphaned `CartBadge`; stale imports cleaned up.

### Changed
- **Inspiration results de-cluttered**: the two primary actions stay full-width and
  the four secondary buttons form a 2-up grid (was six stacked full-width buttons —
  a wall of scroll); the forced auto-scroll to the orbs on page load removed
  (it yanked refresh/deep-link visitors past their source image).
- **Colour-orb animations pause off-screen** (`whileInView`) — the always-on
  infinite float/glow loops burnt CPU in proportion to colour count.
- Forge tabs show a themed "CONSULTING THE COGITATOR…" fallback instead of a blank
  flash while their chunks load; cart quantity/remove buttons raised to 44px;
  requisition stamp counts line items, matching the nav badge and manifest.

### Added
- Responsive spec: tall-phone 412×915 added to the matrix (the worst dead-space
  case was previously untested); four "miniature idle vertical fit" assertions
  (no page scroll at any phone size); a `miniature-warmup` screenshot variant —
  the warm-up strip was invisible in every previous screenshot because the shared
  seed forces offline mode.

## [Unreleased] - 2026-07-16 (Pre-Launch Audit Batch 4: Round-2 Regression Fixes)
### Fixed
- **WarpPortal hint had the wrong copy**: showed the Miniscan light/background hint
  on the any-image-works Inspiration page — corrected, and it now hides while the
  portal is active or fed.
- **Swatchle completion**: unused empty guess rows no longer stack as dead boxes
  above the completion card; the win-celebration stagger actually fires (the parent
  never orchestrated its children's variants).
- **HowToScanModal theming ran deeper than the title**: frame border and footer now
  follow the page palette (warp purple + "Warp-Divination Protocol" on Inspiration).
- Miniscan idle hint raised to 11px on mobile; reticle fallback label "Color N" →
  "Colour N"; inline guess placeholder shortened so it no longer clips at 320px;
  the two inspiration burst overlays moved off raw z-50 onto the modal token.

### Added
- `lib/__tests__/dailyStatus.test.ts` — the two test groups skipped in Round 2:
  `hasPlayedToday` (badge correctness) and `formatTimeToMidnight` (countdown).

## [Unreleased] - 2026-07-16 (Pre-Launch Audit Batch 3: Session Forge Polish)
### Fixed
- **ABORT button clipped off-screen at ≤340px**: the sticky header row's title +
  buttons exceeded narrow viewports and the root `overflow-hidden` (now removed)
  silently clipped them — the row now wraps. Found via the no-horizontal-scroll gate
  the moment the mask came off.
- **Mission Success screen clipping**: the celebration now centres when there's room
  and body-scrolls on short/landscape viewports instead of clipping RETURN TO BASE
  behind the nav.
- **Notification burst on reopen**: timers that expired while the tab was closed
  reconcile silently — only timers finishing within the last minute notify.
- **Wake lock never retried after a failed initial request** — now re-requested
  (idempotently) on every return to visibility.

### Changed
- Desktop no longer a phone-width strip: checklist widens to `max-w-2xl`, idle
  dataslate to `max-w-xl` at `lg:`.
- Idle-curing screen fills the real remaining height (dead `min-h-[60vh]` zone gone);
  checklist bottom padding defers to the layout's nav-safe padding.
- All eight sub-11px labels raised to 11px.

## [Unreleased] - 2026-07-16 (Pre-Launch Audit Batch 2: Miniscan Layout + Height System)
### Changed
- **One viewport-height owner**: `<main>` in the root layout now owns the height floor
  (`min-h-svh` — stable when the mobile URL bar toggles) and the nav-safe padding;
  ten page roots dropped their own `min-h-dvh`, removing the ~88px dead scroll that
  every route carried and the "breathing" CRT on phones.
- **Content-hugging cogitator**: the Miniscan CRT no longer stretches to fill the
  screen (up to ~350px of empty green on tall phones, a huge empty box on desktop) —
  the card hugs its content and the page centres it. The ~96-128px dead band below
  the card is gone.
- **Technogargle moved inside the CRT** (was viewport-fixed over the page title on
  narrow phones; also raised to 11px text) and the leftover fixed targeting brackets
  were deleted.

### Fixed
- **Processing-state clipping on short phones**: both scan-image layers now share one
  height budget (`min(45svh, 420px)`) — the 60vh image no longer overflows the CRT at
  360×640, and sharing a single class guarantees the reticle overlay stays registered.
- **Skull jump at scan start**: one persistent servo-skull morphs between idle and
  scanning sizes instead of two different instances swapping (which restarted the
  float animation mid-air).
- **Warm-up strip pop-out**: the strip now animates its own exit (the AnimatePresence
  previously lived inside the component the pages unmounted, so the collapse
  jump-cut).
- **Reveal wipe over an undecoded image**: the wipe now waits (max 1.5s) for the
  result image to decode before sliding.

## [Unreleased] - 2026-07-16 (Pre-Launch Audit Batch 1: P0 Fixes)
### Fixed
- **Session Forge crash on finish/abort**: the `allSteps` memo sat below the
  no-session early return, so ending a session changed the hook count mid-render and
  React threw "Rendered fewer hooks". Hook hoisted; a `mounted` gate also fixes the
  SSR/hydration mismatch on reload, and empty-step sessions no longer render `NaN%`
  completion with an instant MISSION SUCCESS.
- **Miniscan model-download readout showed up to 10000%**: the progress callback
  emits 0-100 integers but the UI multiplied by 100. New pure `formatModelProgress`
  (clamped, renders 0% correctly) + unit tests.
- **Idle-screen flash mid-scan**: scan completion dropped `isProcessing` one render
  before the reveal flag rose, flashing the upload buttons between the processing and
  reveal states. The CRT branch (and the buttons' disabled state) now also key off
  `result`.
- **Broken responsive-spec seed**: the `daily-complete` Playwright route seeded a
  wrong-shaped GameState (no `paint_id`s, missing stats fields), screenshotting a
  completion card that rendered "undefined-day streak" — false confidence. Seed now
  matches the real GameState/Guess shapes.

## [Unreleased] - 2026-07-15 (Session Forge Gamification & UI Refactor)
### Added
- **Dataslate Content Generator**: Added `python-api/scripts/generate_dataslate_content.py` to compile 400+ advanced painting tips and lore quotes from Warhammer 40k and Fantasy.
- **Dataslate Ticker**: Added an active Dataslate ticker to the bottom of the Session Forge checklist that constantly rotates tips and quotes.
- **Mission Accomplished Screen**: Added a new celebration overlay when completing the final Phase III task, tracking the total session time.

### Changed
- **Session Forge Workflow**: Completely refactored `SessionRunner.tsx` from a horizontal Target-based carousel to a vertical Phase-Based Workflow (Phase I: Foundation, Phase II: Depth, Phase III: Brilliance).
- **Gamified UI**: Added a "Mission Readiness" progress bar that climbs to 100% as tasks are marked applied.
- **Drying Timers**: Added a 3-minute rapid cure timer for Phase I Base Coats, and grouped the 15-minute timers for Phase II Washes & Shades to encourage smart batch painting.

## [Unreleased] - 2026-07-15 (Miniscan UI Polish)
### Fixed
- **Miniscan Layout & Overflow**: Rewrote the vertical flex layout of the `CogitatorUpload` component to correctly expand into the remaining viewport height without causing scroll on any device.
- **Targeting Bracket Overlaps**: Removed conflicting corner target brackets from the global overlay that previously overlapped with the brass Miniscan corners.
- **Component Centering**: Centered the floating Servo Skull, Title, and Action Buttons vertically within the dynamic CRT window to utilize dead space intelligently on tall aspect ratios.

### Changed
- **Dynamic Technogargle**: Replaced static status text in the top right with an animated "Technogargle" component that randomly cycles hex addresses and signal strengths.
- **Machine Spirit LED**: Removed the distracting "M.SPIRIT" pill and LED from the CRT frame to achieve a cleaner aesthetic that emphasizes the hovering Servo Skull.

## [Unreleased] - 2026-07-14 (Swatchle UI Overhaul)
### Changed
- **Rebranded The Daily Augury to Swatchle**: Updated naming across the app banner, stats modal, share grid text, and game identifiers.
- **Mobile Grid Redesign**: Removed the header row and stacked paint names *above* clue boxes for each guess. Clue boxes are now completely visual (square icons, colors, arrows, and Delta E values without large labels), eliminating text crushing and overflow on mobile viewports.
- **Completion Screen Overhauled**: Replaced the bulky "Mission Failed/Successful" text and buttons with a sleek glassmorphism card, centered target paint visual, and streamlined side-by-side action buttons.
- **Visual Share Grid**: Replaced the raw emoji text block in the UI with a real CSS grid visual for the share graphic (clipboard copy remains emojis for cross-platform sharing).
- **Home Screen Overhaul**: completely redesigned `ModeSelector` to feature a premium Miniscan Hero card containing an automated recipe proof strip. Added premium-styled gallery buttons for Inspiration and Swatchle modes.
- **Scan Page Instructions**: Removed bulky instruction blocks at the bottom of the Miniscan and Inspiration upload screens. Integrated subtle, thematic `[ ? ]` text links under the main headers that trigger a new unified `HowToScanModal`.

### Added
- **CleanThematicBackground**: Created a new vignette/tech-grid background specifically for Swatchle to reduce visual noise compared to the heavy spinning AdMech background.
- **PaintSearchModal**: Replaced the clunky bottom-anchored autocomplete with a full-screen, mobile-friendly Wordle-style search modal (triggered by tapping an active guess row).
- **HowToPlayModal**: Added a dedicated `[ ? ]` button and modal explaining the game rules, clue colors, and Delta E mechanics for new users.
- **Share Toast Notification**: Replaced the cheap browser `alert()` with a sleek sliding toast notification when the tactical report is copied.

## [Unreleased] - 2026-07-09 (Launch Synthesis + Runbook)
### Added
- **`LAUNCH_RUNBOOK.md`**: the step-by-step operator guide from zero to launch week —
  account dressing, a literal footage-afternoon shot list (turntables, swap pot pairs,
  the hands-in-frame live scan, first roast voiceovers), factory build order with
  delegation prompts, the launch five with drafted hooks, the 25-clip bank mix, the
  content-calendar template and the daily launch-week SOP.
- `LAUNCH_STRATEGY_SYNTHESIS.md` committed as the Grok/Gemini feedback provenance.

### Changed
- Growth docs updated per the synthesis: **Content Bank Sprint** now precedes
  Phase 3.5 (build the factory and bank 25 clips before the first post; Engine A ships
  while posts run from the bank); Engine A gains a WebAudio-synthesised audio bed and a
  post-export virality modal; Engine B gains an automated `factory qa` script (loop
  similarity, hook timing, thumbnails); "Roast My Scan" promoted to a headline format
  including community-submitted failures; a Launch Support Sprint added (Ko-fi "Fuel
  the Auspex" placements, answer-free Discord daily-puzzle webhook, feedback triage
  script, Featured Reveals section post-Engine-A); ops hardening (calendar, 45-min
  engagement cap, seeding form). **Corrected the synthesis' fabricated
  spectrophotometer origin claim** to the honest canonical hook ("a colour engine on
  1,312 physically measured paint swatches") — now a hard guardrail.

## [Unreleased] - 2026-07-09 (Roadmap Sync + Growth Plan)
### Changed
- **Roadmap trued up**: Phases 0–3 marked shipped (with verification dates); a
  Debt & Deferred table calls out the skipped barcode scanner (blocked on EAN data),
  the reveal hover-sync stretch goal, placeholder PWA icons and the remaining register
  items; next stages re-sequenced — Phase 3.5 "Broadcast Update" (in-app scan-reveal
  video export) + a 90-day Growth Sprint before Phase 4 monetisation. SEO assessed:
  no further SEO build needed until the Phase 6 Librarium.
- **`SOCIAL_MEDIA_CAMPAIGN.md` v2**: complete ground-zero launch plan for the empty
  accounts, built on July-2026 platform research (70% completion bar, first-five-posts
  content DNA, loop/rewatch mechanics, cross-posting watermark penalties), with content
  pillars mapped to automated production, per-platform playbooks, a 90-day calendar,
  KPI gates and a Phase 4 go/no-go rule.

### Added
- **`VIDEO_AUTOMATION_PIPELINE.md`**: Engine A — in-app scan-reveal video export
  (MediaRecorder over the existing reveal layers, loop-ending 9:16 composition,
  share-sheet integration) as the Phase 3.5 build spec; Engine B — a local Remotion +
  FFmpeg + faster-whisper content factory rendering Daily-Augury quiz shorts, Budget
  Swap clips, recipe cascades and Playwright scan-reactions straight from the app's
  data files, with per-platform caption variants and a manual-native-upload checklist.

## [Unreleased] - 2026-07-09 (Mobile Optimisation Audit)
### Fixed
- **Full-app responsive audit (52 findings, 5 batches).** Highlights:
  - `viewport-fit=cover` was missing, so every iOS safe-area inset resolved to zero (the
    nav sat under the home indicator despite all the `pb-nav-safe` plumbing).
  - All modals (Share/Feedback/Ko-fi/AddPaint/Stats) rendered *under* the bottom nav
    (raw `z-50` vs the nav's 100) — now on the `--z-modal` token, with scroll regions,
    body-scroll locks and 44px close targets where missing.
  - Requisition cart rows crushed paint names to ~2px at 360px (fixed stepper/remove
    cluster) — rows now wrap with a minimum name width; same wrap treatment for the
    recipe card's step rows, whose 44px action buttons broke names mid-word.
  - iOS input auto-zoom eliminated (16px form controls everywhere).
  - Auspex Reveal: rail chips no longer clip at the frame edge or sit on the model
    (26px minimum edge inset for the real 44px targets); portrait photos height-capped
    without breaking overlay anchors; garble text no longer jitters layout.
  - Daily Augury: autocomplete flips upward instead of opening into the keyboard/nav;
    guess cells no longer overflow at ≤400px; board capped on desktop; entry banner
    hoisted into the home page's first viewport (it sat below the fold on all devices);
    nearest-day puzzle fallback replaces the dead "INITIALISING AUSPEX" screen.
  - Session Forge: drying timers now complete and notify for ALL targets, not just the
    focused one (the batching flow was broken); CONCLUDE MISSION no longer hidden
    behind the nav; target cards capped at 420px on desktop and show the real detected
    colour; `updateSessionStep` made immutable; missing
    `analytics.trackNotificationOptIn` defined (it broke the production build).
  - Desktop: results pages gain a two-column colour-card grid ≥1024px; nested `<main>`
    landmarks removed from the SEO pages; 10Hz `crt-flicker` removed from body copy
    (photosensitivity); sub-11px informational text raised app-wide; Forge touch
    targets brought to standard.
- New `tests/responsive.spec.ts`: screenshots every key route at 320/360/390/768/1440
  (+ landscape) with a blanket no-horizontal-scroll assertion; store seeding covers the
  cart and a running session.

## [Unreleased] - 2026-07-09 (Phase 3 The Daily Augury)
### Added
- **Daily Puzzle Generator**: Added Python script to pre-generate 400 days of Daily Augury Wordle-style puzzles deterministically. Puzzles avoid repeats within 60 days and omit washes/neutrals.
- **Generated Puzzles**: Output `daily_puzzles.json` with puzzle metadata, answers, and family adjacency matrices for frontend feedback.

## [Unreleased] - 2026-07-08 (Phase 2 Forge Integration)
- **Forge Inventory Integration**: Complete Phase 2. Integrated the Forge inventory system directly into the miniature and inspiration scan pipelines. 
- **Owned Paint Prioritization**: The backend ML engine now intelligently retrieves and prioritizes user-owned alternative paints when finding colour matches.
- **Frontend Inventory Sync**: The frontend `useScan` hook automatically includes the user's saved inventory set in API requests.

## [Unreleased] - 2026-07-07 (UI Polish)
### Fixed
- **Framer Motion Crash**: Replaced a `spring` physics transition with an `easeOut` tween that supports an array of multiple keyframes in `AuspexReveal` (fixing a crash that broke the interactive UI).
- **Blob URL Lifecycle bug**: Prevented the local storage engine from accidentally revoking the exact same image Blob URL when committing a scan result multiple times.
- **Servo Skull Animation Conflict**: Nested the float and patrol animations into separate wrappers in `ServoSkull` to prevent CSS transform overwrites, so the skull now smoothly hovers and patrols simultaneously.
- **Top Swatches Interactive State**: Restored the spinning `rotate: [0, 360]` and hover pulse to the `HexPalette` chips, and made them clickable shortcuts to the corresponding paint cards.

### Changed
- **Unified Cogitator Theme**: Purged the old parchment style from the final Cogitator Report summary, bringing it strictly in line with the high-fidelity dark gothic `var(--void-black)` and `var(--cogitator-green)` aesthetics.
- **Double Tap Scroll Interaction**: Implemented a two-step "focus then scroll" behaviour on the mini chips for mobile UX to ensure users see the active placement highlight before being jumped down the page.
- **Dynamic Decryption Labels**: Added `DecryptionText` techno-garble typewriting effects to the labels and the name markers.
- **Dynamic Reveal Reticle**: Updated the selected chip visual on the image. It now spawns an animated neon green dashed ring around the target when tapped.


## [Unreleased] - 2026-07-07 (reveal redesign)
### Fixed
- **Blank Tactical Readout in local dev**: React StrictMode's double-invoked effects made
  the reveal complete twice, committing the same scan twice — and the store's
  revoke-previous step then revoked the very blob URL it was storing, leaving the results
  image permanently dark (prod builds were unaffected). Fixed three ways: the revoke is
  identity-guarded, the reveal-wipe timeout chain is single-shot and cleared on unmount
  only, and a dead image now shows a themed "PICT-FEED LOST" panel instead of an endless
  skeleton. Locked by two new store lifecycle tests.

### Changed
- **Tactical Readout redesign**: the numbered chips no longer sit on (and hide) the
  model — they dock on the left/right rails with colour-coded leader lines and pulsing
  anchor dots pointing at each region. Hovering or focusing a chip drops the model to
  greyscale and pulses that region in its true colour; tapping focuses the region and
  jumps to its paint card. The flat black background is now a themed cogitator screen
  (targeting grid, vignette) behind the model, whose backdrop shows through the canvas.
  The per-colour "LOCATION ACTIVE" view uses the same greyscale-focus treatment for
  consistency. Rail layout is a pure helper (`lib/maskGeometry.layoutRailCallouts`) with
  its own collision tests.

## [Unreleased] - 2026-07-07 (later)
### Fixed
- **Duplicate neutral display labels**: the chaplain scan showed two indistinguishable
  "White" cards (L\* 98.7 heraldry and L\* 77.1 trim). The neutral subdivision gate keyed
  on the raw `is_metallic` flag — which over-triggers on edge-dense armour — instead of
  on whether the metallic Silver/Gold relabel actually won; and L\* banding alone could
  not guarantee distinct labels. The gate now checks the display family, and a
  lightness-ordered tie-break (`_dedupe_neutral_display_labels`) guarantees same-family
  neutral cards never share a label. `test_complex_neutral_display_labels` rewritten to
  assert the real invariant (its two-Grey premise never matched this fixture) —
  **the backend suite is now fully green**.
- **Keep-warm workflow default URL** pointed at `schemestealer-api.onrender.com`, which
  has no server behind it (the live service is `schemestealer.onrender.com`) — cold-start
  pings were hitting a dead host unless the `KEEP_WARM_URL` repo variable was set.

### Verified (live, 2026-07-07)
- `/api/ready` reports `"persistence": "supabase"`; admin endpoints fail closed (403,
  key configured); CORS blocks foreign `*.vercel.app` origins and admits
  `schemestealer-*` previews; `manifest.webmanifest` + icons serve 200; security headers
  present on the production site.

## [Unreleased] - 2026-07-07
### Fixed
- **Yellow-detail regression (Pink Horror beak)**: the darker-half base-coat bias in
  `_combine_clusters` fired on dark *chromatic* shadow merges and manufactured a spurious
  dark "Brown" card that evicted vivid painted details from the five displayed colours.
  The bias now requires the union median to classify as a neutral family via the single
  canonical classifier, and a vividness-protected display cap (`config.Display` +
  `_protect_vivid_details`) stops dull dark minor cards displacing vivid details.
- **Auspex Reveal spatial contract**: reticle coordinates were axis-swapped and normalised
  by the wrong dimension (markers left the frame on portrait crops); masks were opaque
  1-bit PNGs so the alpha-keyed clip tinted the whole frame; and the alpha-bbox crop
  offset was never transmitted, stretching masks over the uncropped photo. The backend now
  emits full-frame normalised positions (`reproject_to_frame`), RGBA alpha masks, and a
  `mask_frame` carrying crop geometry; the frontend composites masks into the crop rect
  (`lib/maskGeometry.ts`).
- **CORS**: narrowed the preview-origin regex from any `*.vercel.app` (any Vercel site
  could make credentialed calls) to this project's preview hostnames.
- **PWA icons**: generated the missing `public/icons/` PNGs referenced by `manifest.ts`
  (placeholder reticle art — swap for brand art when available).
- **Persistence-mode log** now emitted from the lifespan handler so the INFO line is
  visible; required Render dashboard secrets documented in `render.yaml`.
- **Frontend `.gitignore` encoding**: the playwright-report/test-results patterns had been
  appended as UTF-16 (unparseable by git — why test artifacts kept getting committed);
  rewritten as UTF-8.

### Changed
- **Auspex Reveal redesign**: regions now reveal the user's *actual paint* at full
  brightness out of a dimmed tactical frame with a hue-matched rim glow and settle pulse
  (pre-rendered layers + rAF); numbered DOM chips with staggered pop-in replace the
  canvas-drawn chips.
- Untracked runtime/PII artefacts (`python-api/data/ml`, `data/analytics`, backend log,
  playwright-report, test-results); removed the stray `fix.js` codemod.

### Added
- Tests locking the fixes: `test_spatial_contract.py`, `test_display_cap.py`,
  `maskGeometry.test.ts`, extraction-bias tests, a yellow-beak assertion on the synthetic
  scene, and displayed-five guards on the real photo fixtures (production-like flood-key
  masks).
- `Skills&rules/` planning docs: `NEW_IDEAS_IMPLEMENTATION.md`, `SOCIAL_MEDIA_CAMPAIGN.md`,
  updated `SCHEMESTEALER_MEGA_ROADMAP.md` and `architecture.md` (issue register §9).

### Removed
- Untracked the swatch-source reference PDF (local working material — must never be
  published; note it remains in earlier git history) and a stale embedded-repo gitlink;
  superseded prompt/role docs moved to the local-only `Skills&rules/OLS/` archive.
- Skill docs now refer to "the swatch source" generically — the attribution invariant now
  applies to its own wording.

## [Unreleased] - 2026-07-06
### Added
- **PWA & Offline Readiness**: Added `manifest.ts` and `next-pwa` configuration to support local installation and caching.
- **Offline Machine Spirit**: Added offline support in `useScan.ts`, allowing users to optionally skip the backend and use the local on-device K-Means engine.
- **CI/CD Workflows**: Added comprehensive `.github/workflows/ci.yml` for automated testing.
- **Automated Tests**: Added Python API tests (`test_auth.py`) to verify the new Analytics Admin Key enforcement.
- **Consent Banner**: Added a non-intrusive toast-style consent banner (`ConsentBanner.tsx`) to manage telemetry opt-in for analytics.
- **Dynamic Exit-Intent Feedback**: Implemented interruption stacking in `useFeedbackPrompt.ts` with a 30s delay, firing once per session to improve UX without being annoying.
- **Metadata Generation**: Added dynamic OpenGraph image generation (`opengraph-image.tsx`) and enhanced Twitter metadata tags for `/convert` routes.

### Changed
- **SEO & Layout**: Completely overhauled the Paint Hub pages (`/paints/[brand]/[slug]`) with double-auspex branding, cross-brand comparisons sorted by `ΔE`, and glowing Hex Badges (`CopyHexBadge.tsx`).
- **Performance & Asset Loading**:
  - Dynamically imported `paints_groundtruth.json` in Forge components to reduce the initial bundle size by over ~600KB.
  - Implemented module-level caching for `conversions.json` in `/convert/[conversionSlug]` to prevent redundant parsing.
  - Replaced standard font `@import` rules with `next/font/google` for optimal web font loading.
  - Added `<MotionConfig reducedMotion="user">` for `framer-motion` to respect OS-level accessibility preferences.
- **Accessibility Enhancements**:
  - Migrated `FeedbackModal`, `ShareModal`, and `AddPaintModal` to Headless UI `<Dialog>` for robust focus trapping and screen-reader support.
  - Increased touch target sizes on `InfoTooltip`, `HexChip`, `CustomDropdown`, and `RecipeHistory`.
  - Added `aria-current` and `aria-hidden` attributes to Navigation icons.
- **UI & Styling Refinements**:
  - Migrated extensive inline styles (e.g. `style={{ backgroundColor: ... }}`) to utility Tailwind tokens across global components and the Forge interface.
  - Changed root background color to `bg-[#050505]` to eliminate white flashes on route transitions.
  - Replaced infinite CSS `boxShadow` pulse animations with performant GPU-accelerated opacity cross-fades.
- **Code Organization (Rules & Skills)**:
  - Consolidating agent behaviors into the `Skills&rules/` directory (e.g. `GEMINI.md`, `Next.js 15 & Tailwind Strict.md`, `architecture.md`, `you-are-a-senior-cheeky-avalanche.md`).
- **Playwright Configuration**: Updated Playwright config to isolate `*.spec.ts` files from Vitest tests.

### Fixed
- Fixed Next.js 15 React hooks purity errors in `ActiveAuspexScan` by properly wrapping `Math.random` generated IDs in `React.useMemo`.
- Fixed `ReferenceError: dataSeq is not defined` missing variable declarations after purity refactor.
- Fixed hydration mismatches in `InventoryHexGrid` caused by nesting standard `<button>` tags within `framer-motion` `<motion.button>` elements.
- Corrected type mismatches in `lib/colorMath.ts` by defining `types/spectral.d.ts` and removing dirty `any` casts.
- Fixed prop inconsistencies between `Forge` page and `AddPaintModal`.

### Removed
- Removed the deprecated and broken `Camera.tsx` component.
- Removed unused UI primitives (`Button.tsx` and `Card.tsx`).
- Removed the outdated "MACHINE SPIRIT AWAKENING" cold-start theatre delay to ungate upload interaction directly upon load.
