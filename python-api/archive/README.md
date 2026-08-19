# Archived harnesses — NOT gates. Do not run them, do not fix them.

These four files were the colour-engine "accuracy harness". They were wired into
`run_all.py`, which `run_all_tests.ps1 -Harness` invoked, and their output was
compared by hand against `../baseline_harness.json`.

**Not one of them can fail in a way that means anything.** They are kept rather
than deleted for one reason: their numbers are still quoted in older documents
(`Skills&rules/context/architecture.md` §5 cites the 9.4%, and
`../baseline_harness.json` is still tracked), and a reader who finds one of those
figures needs to be able to reach this file and learn why it is void. A deleted
file teaches nothing.

The live scoreboard is **`python-api/benchmarks/`** — `python -m benchmarks.run`,
writing `benchmarks/out/scoreboard.{md,json}`. That is the only thing that gates
a colour change. See `benchmarks/README.md`.

---

## Why each one is void

### `1_synthetic_sweep.py` — grades the classifier against a design that was deleted

Reports a "hard miss rate" of **9.4%** (203 / 2,160). It computes the expected
family with an **HSV hue-band oracle** — the exact classifier design that was
removed twice and is forbidden by core invariant 1 / ledger D1. The live
classifier is LAB nearest-exemplar by CIEDE2000 over `color_anchors.json`.

So the 9.4% is not a defect rate. It is a **disagreement rate between the current
design and a superseded one**, and most of the disagreements are the current
design being right.

**This is the trap.** "Fixing" the sweep means making the LAB classifier agree
with the HSV oracle, which reintroduces the forbidden design through the anchor
build. That is why the file is archived rather than repaired. (Audit finding
O-G10.) **The 9.4% must never be quoted.**

### `2_distortion_robustness.py` — cannot fail

Zero assertions. It prints and always exits 0, so wiring it into a runner bought
nothing but runtime. It also never calls the real white-balance corrector, and
its own distortion model cannot reach ≤3000 K — the illuminant range the test is
nominally about. (Audit finding O-B6.) Ledger D4's stated gate named this
harness; that gate was therefore void as written.

### `3_clustering_sampling.py` — its baseline scores the wrong answer

Compared against `../baseline_harness.json`, frozen 2026-07-03, which predates
the union-median extraction rewrite. The recorded `region_recovery_rate = 1.0`
scores a blend **matching neither planted colour**; the current 0.96 scores a
real one. The metric penalises ledger D6 (ramp-aware merge) and D7 (union-median
representative) *by construction* — the engine got better and the number went
down. (Audit finding O-G9.)

`baseline_harness.json` is still tracked at `python-api/` and now has **no
consumer at all**. It is left in place because bootstrap invariant 11 names it;
retiring it is a separate decision, not this one. Do not compare anything
against it in the meantime.

### `run_all.py` — a runner for three things that cannot gate

It ran the three above and merged their reports into `harness_report.json`. With
all three archived it has no remaining purpose, so it is archived with them
rather than left as an empty shell. `run_all_tests.ps1`'s `-Harness` switch,
which was its only caller, is removed in the same commit.

---

## A note on Windows, so nobody mistakes it for the reason

Two of the three crash on Windows with `UnicodeEncodeError` on a `Δ` in their own
docstrings unless `PYTHONIOENCODING=utf-8` is set. With it, all three exit 0.

That is cosmetic and is **not** why they are archived. They are archived because
a harness that exits 0 regardless, a harness graded against a forbidden design,
and a harness with a refuted baseline are all worse than no harness — they read
as coverage.
