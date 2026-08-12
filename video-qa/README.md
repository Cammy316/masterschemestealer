# video-qa — post-mux QA harness

Measures the **artefact**, not the render.

Every other video/audio gate in this repo runs before muxing — on `frameState`,
on an `OfflineAudioContext`, or on a canvas. Two shipped device exports failed
six gates that the pre-encode suite reported as passing, because nothing
measured the finished MP4. That is the class of bug this closes.

## Run

```bash
npm run qa:video -- Testimages/Mini2.0.mp4 Testimages/Insppiration2.0.mp4
npm run qa:video -- clip.mp4 --mode warp --json out/
```

Exits non-zero if any gate fails. Runs on `python-api/venv` (the ambient python
has no numpy/scipy).

## Tests

```bash
python-api/venv/Scripts/python.exe -m pytest video-qa/tests -q
```

Three groups:

- `test_controls.py` — synthetic signals engineered to break exactly one gate.
  The two loudness controls are the ones that would have caught the defect
  where both beds shipped ~3 dB hot.
- `test_video_controls.py` — injected frame sequences for the anti-freeze gate.
- `test_device_exports.py` — calibration against the two real exports, asserting
  **both** the gates that must fail and the figures that must stay passing.
  Skipped if the exports are absent.

## Two things worth knowing before you edit this

**Anti-freeze measures the coded Y plane, not RGB.** Decoding to RGB first lets
4:2:0 chroma upsampling invent inter-frame difference the encoder never coded.
The warp-cast reads 0.587 that way and 0.493 on the Y plane — the difference
between passing and failing a 0.5 floor.

**The `colr` atom and the H.264 SPS VUI are parsed independently.** ffprobe
collapses them into one reported value, and that collapse is exactly what hid a
file whose atom said BT.709 while its SPS said BT.601. Both are reported, with
an explicit agreement check.

## Vendored ffmpeg is decode-only

`video-factory/node_modules/@remotion/compositor-win32-x64-msvc/` supplies
`ffmpeg` and `ffprobe`, so this needs no new binary — but it is a stripped
build. It has **no** `rawvideo` muxer, **no** `rawvideo` demuxer and **no**
`lavfi` source filters, so synthetic clips cannot be generated with it. Decoding
uses `-f image2pipe -vcodec rawvideo`, and the video controls inject frames
directly rather than building files.
