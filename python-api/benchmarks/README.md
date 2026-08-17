# Colour-accuracy benchmark (Phase 3)

This is the audit scoreboard. It does **not** use `1_synthetic_sweep.py`,
`baseline_harness.json`, or `2_distortion_robustness.py` — those cannot gate
anything (O-G9, O-G10, O-B6).

There is **no labelled photograph set**. `eval/fixtures/labels.json` is a
placeholder. Real photos in `Testimages/` are used only for *stability*
(LSB / JPEG / EV), not top-1 accuracy.

## What would make a claim fail

- A top-1 number quoted from the 9.4% HSV-oracle sweep.
- Scoring a wash by its stored swatch LAB instead of the colour it would
  make over primer (O-D2 / O-D3).
- Using the root `venv\` (skimage 0.26). This harness must run on
  `python-api\venv\Scripts\python.exe` (skimage 0.24.0).

## Run

From `python-api/`:

```
venv\Scripts\python.exe -m benchmarks.run
```

Or `make bench` if you have make.

Writes `benchmarks/out/scoreboard.json` and `benchmarks/out/scoreboard.md`.
