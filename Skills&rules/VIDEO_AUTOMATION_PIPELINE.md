# SchemeStealer — Automated Video Pipeline (Engines A + B)

*Written 2026-07-09. Two systems that turn the app's data into short-form video:
**Engine A** ships in the app (Phase 3.5 "Broadcast Update") and lets every user export
their scan as a share-ready vertical clip; **Engine B** is Cam's local content factory
that batch-renders channel content straight from the data files. Both obey the
campaign's acceptance criteria (hook ≤3 s, loop ending, 9:16 masters, no foreign
watermarks — see `SOCIAL_MEDIA_CAMPAIGN.md` §1).*

---

## Engine A — In-app scan-reveal video export (Phase 3.5 build item)

**Why:** every painter who scans a mini gets a cinematic clip of THEIR model being
"read by the machine spirit" — posting it is showing off their own work, and every post
carries the brand. Users become the distribution network.

### What the clip is (~12–15 s, 1080×1920)
1. 0.0–0.8 s — cogitator boot flicker over the user's mini **already faintly visible**
   (the hook IS the model; no logo cards).
2. 0.8–3 s — greyscale model on the gridded backdrop, scan-sweep pass.
3. 3–10 s — regions pulse in one-by-one in true colour with leader lines + family
   labels (existing reveal visuals, timed for video).
4. 10–13 s — recipe outro: four swatches cascade in (base→shade→highlight→wash, best
   brand) with paint names.
5. 13–15 s — brand plate ("SchemeStealer · scan yours free") composed so the final
   frame dissolves back into frame 1's faint-model state — **the loop point**.

### Implementation (all client-side, no backend)
- **Renderer:** a dedicated `renderRevealVideo()` beside `AuspexReveal` that reuses the
  existing cached layers (`buildBaseLayer`, `buildRegionLayer`, `maskDestRect`) on an
  **offscreen 1080×1920 canvas** — portrait composition: model centred, letterbox areas
  filled by the `auspex-backdrop` look painted in-canvas (the CSS backdrop must be
  re-drawn here; canvas capture sees only the canvas).
- **Capture:** `canvas.captureStream(30)` → `MediaRecorder`; prefer
  `video/mp4;codecs=avc1` where `isTypeSupported` (Safari 17+/Chrome 126+), else
  `video/webm;codecs=vp9`. Every target platform accepts both. Drive the animation with
  a deterministic timeline (t-parameterised, not rAF-dependent) so dropped frames don't
  desync audio-free output.
- **UI:** "EXPORT PICT-CAST" button in the existing `ShareModal` (both modes) →
  progress ring while recording (~real-time 15 s) → `navigator.share({ files })` where
  supported, download fallback. Disabled gracefully when `MediaRecorder` is absent.
- **Analytics:** `reveal_video_exported` (+ duration, format) via the existing
  consent-gated pipeline.
- **Guardrails:** our own small brand plate is fine (penalties target *other*
  platforms' watermarks); no GW marks; British English copy ("PICT-CAST READY").

### Tests
- Vitest: timeline function (deterministic frame states at t=0/3s/loop-point; loop
  frame ≈ first frame within tolerance); format-selection helper.
- Playwright: export on a seeded scan produces a Blob > 500 KB with the chosen MIME;
  share fallback path renders.

### Effort: ~4–6 sessions. No backend changes.

---

## Engine B — The content factory (local, batch, data-driven)

**Stack** (all free/self-hosted; researched July 2026):
- **Remotion** — React components → MP4; official Claude Code skill exists, so
  templates can be built/iterated conversationally. One repo dir: `video-factory/`
  (own package.json; NOT inside schemestealer-react to keep bundles clean).
- **FFmpeg** — post-processing (loudness normalise, faststart, per-platform trims).
- **faster-whisper** (local) — word-level timestamps → karaoke captions for VO clips.
- **TTS**: start with edge-tts (free, decent neural voices) for factory drafts; Cam
  records VO over winners (original audio is algorithm-rewarded). Optional later:
  ElevenLabs for a consistent "Cogitator" voice.
- Optional AI b-roll (fal.ai image/video gen) — **not needed for v1**; our data renders
  are the visuals.

### Templates (each = one Remotion composition + a data selector)

**T1 — Daily Augury Quiz (the flagship, fully automatic)**
- Input: `daily_puzzles.json` day + `paintDatabase` row.
- Structure (24–30 s): swatch macro fills frame with garble-text hook ("Only real
  painters name this in 3 guesses") → three plausible wrong guesses tick past with
  buzzer stamps (comment bait: viewers beat the ticker) → hint cards (family, ΔE band
  vs a famous paint) → reveal AT THE LOOP POINT (name + brand + swatch) so second-watch
  viewers see the answer under the hook → CTA end-frame "today's puzzle:
  schemestealer.com/daily" that visually matches frame 1.
- Fully unattended: `npm run factory -- t1 --date 2026-07-10` renders the day's clip.

**T2 — Budget Swap (fully automatic)**
- Input: a `conversions.json` row (source paint + best cross-brand match) + the
  existing `PAINT_PRICES` map.
- Structure (20–25 s): price-tag hook ("£4.75 for THIS?") → split-screen swatches
  slide together until they visually merge → ΔE badge stamps ("ΔE 1.8 — your eyes
  can't tell") → price delta counter rolls down → CTA to the matching /convert page.
  Comment bait variant: pick a ΔE 2.5–3.5 pair and ask "close enough or heresy?".

**T3 — Recipe in 15 Seconds (automatic once schemes are listed)**
- Input: a curated list of famous schemes (name + detected-colour LABs) run through the
  recipe engine offline; renders the 4-step swatch cascade per colour with role labels.

**T4 — Scan Reaction (semi-automatic)**
- Playwright drives the real app (`page.video` recording) scanning a supplied photo;
  FFmpeg crops the reveal segment to 9:16; Cam adds VO reacting to hits/misses
  ("it read the NMM as leather — here's why that's actually correct behaviour").
  The honesty format.

### Pipeline CLI (`video-factory/`)
```
factory t1 --date …            → out/2026-07-10-augury/{master.mp4, captions.srt,
factory t2 --paint mephiston…     tiktok.txt, reels.txt, shorts.txt, checklist.md}
```
- Per-platform text files carry the REWRITTEN hook/caption/hashtags per platform
  (never identical), plus a Shorts keyword title mirroring the /convert page.
- `checklist.md` per batch: upload natively, platform order, pin-comment text.
- QA gate (manual, 2 min/clip): §1 acceptance criteria — hook timing, loop join,
  legibility at phone size, British English.

### Build order
1. `video-factory` scaffold + **T2** (simplest data, instant launch content) — 1–2 sessions.
2. **T1** (needs the garble/ticker components) — 1–2 sessions.
3. Engine A (with Phase 3.5) — 4–6 sessions.
4. T3, then T4 — 1–2 sessions each.
The day the factory renders its first T2 batch, the 14-day content bank starts filling.

### Non-goals (v1)
Auto-POSTING (every platform punishes or gates API posting for new accounts — uploads
stay native/manual via the checklist); AI-generated minis (authenticity is the niche's
currency); paid ads (revisit at Phase 4 with revenue).
