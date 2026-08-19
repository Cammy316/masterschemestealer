# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-08-17 (colour accuracy: the first three items of the revised plan)

The 2026-08 colour-science audit produced seven P1s and a tiered plan. A first
implementation plan was drafted against the "next" tier only; it was then reviewed
adversarially and largely re-specified. Implementation has now started against the
revised plan, `docs/audit/COLOUR_PLAN_REVISED_2026-08.md` (local-only — see below).

### The defect class the review closed

Four of the five commits in the original plan sat behind gates that **could not fail**:
`n_unstable` was already saturated at 5/5, the ramp scene's `split_same_family` metric
structurally cannot see a cross-family card, the only "metallic" bench scene is a flat
block with zero texture, and the recipe commit's scoreboard has no recipe rows at all.

> Findings register #35 again, one level up: *a gate that cannot fail is worse than no
> gate.* The plan forbade the pattern in its own process rules and then shipped five
> instances of it.

Two of its commits were also measurably mis-specified. The ramp-merge fix gated on
`min(chroma) < 0.09`, which excludes **81.7% of chromatic paints' 4:1 ramps** — including
Macragge Blue, the paint in its own fixture. The white-balance fix required a threshold
band that is **empty**: keeping the existing AWB tests green needs a neutral admitted at
C\* 15.44, while excluding the pastel/bone cloud needs a floor below 12.

### Added — the bench can now fail (C1.1)

The Phase-3 harness had never been committed, so the verification model *"diff
`scoreboard.md` against the parent commit"* had **no parent**. It is now banked verbatim
(`d16b689`) and instrumented as a separate commit (`e8ca68e`) so the first instrumented
diff means something. No engine behaviour changed: nothing under `core/`, `services/`,
`utils/` or `schemestealer-react/` was touched.

Four metrics replace four gates that could not move. Each is recorded with what would
shift it and in which direction — a number nobody can move is decoration, not a gate:

| New metric | Today | Moved by |
|---|---|---|
| Silhouette retention (analysed px ÷ alpha px) — the direct O-C8 number | 69.37 / 72.74 / 75.12 / 75.59 / 70.75 % | C3.1 → **up** |
| Graded `instability` (family-multiset Jaccard + coverage L1) | **6.739269** | C4.4 → down · C4.6 → up |
| `largest_non_planted_card_pct`, `blue_ramp_4to1` | **27.481 %** | C4.4 → **down**; gate is < 10 |
| Warm bases w/ highlight key → chosen highlight cooler | **747 → 161 (21.55 %)** | C4.1 → down, ~13.8 % predicted |
| …**all** candidates cooler (the unfixable floor) | **59 (7.90 %)** | nothing in this plan |
| …highlight loses > 50 % OKLab chroma | **75 (10.04 %)** | C4.1 → down |
| `_monotonic_ok` inversions | **2 of 2,365** | C4.1 must **not** raise it |

Retention is measured by wrapping the engine's own `BaseDetector` and observing the
production call, **not** by replicating the crop/resize steps — a replica would silently
diverge the moment an EXIF transpose is inserted ahead of it. The graded scalar is not
`n_unstable` in disguise: `pinkhorror2` scores 0.1250/8.71 under +1 LSB and 0.2500/68.65
under −0.3 EV, which `n_unstable` records identically as "changed". Hue, chroma and the
warm/cool basin all come from the live `recipe_geometry`; the monotonicity guard is the
engine's own. Zero new colour maths.

**A constant the plan never pinned.** Its recipe baselines reproduce only under a
warm-base OKLab chroma floor of **0.02** — swept, 0.000 gives 809/188/73/85 and 0.040
gives 637/121/44/52, while 0.020 lands all four exactly. It is now a named constant
carrying that sensitivity table, because the population is otherwise unreproducible.

**Two defects the instrumentation exposed.** `benchmarks/stability.py` read card coverage
from `percentage`/`coverage`; served recipe dicts carry it as **`dominance`**
(`schemestealer_engine.py:485`), so every card had read `0.0` since the harness was
written. Nothing consumed it, so it stayed invisible — until the new L1 term returned
**0.00 in all fifteen cells**, i.e. the new gate could not fail either. Fixed, with a
guard that prints a warning into the scoreboard if the key moves again; no pre-existing
number changed, because `n_unstable` never read coverage. Separately, `gold_and_bone`'s
recovered coverage was not byte-stable across runs (`93.33333333333331` vs `…34`, a 3e-14
float reduction-order difference) and is now rounded to 6 dp — three orders below one
pixel of a 300 px scene — so the payload can actually be diffed.

### Changed

- **`_is_likely_shadow` self-skip is now an identity test** (`smart_color_system.py:552`,
  audit O-C14b). It compared cluster dicts with `==`; both hold NumPy arrays, so two
  *merged* clusters (nine keys led by `coverage`) with byte-identical coverage fell
  through to `median_rgb` and raised `ValueError`, aborting the scan. Un-merged clusters
  lead with an `id` int and short-circuit first, which is why it never fired in
  production. Measured latent rate: 1 collision in 2,109 merged pairs (0.047%).

- **Swatch-source attribution removed from tracked code** (core invariant 7). Three
  references in two committed scripts, one of them a hardcoded path whose *filename*
  carried the name. The path now resolves from `$SWATCH_SOURCE_PDF`, else a glob over the
  git-ignored `Skills&rules/_source/`, with a clear `SystemExit` when absent.
  `git grep` for the name now returns zero hits in tracked files.

- **`docs/` is git-ignored.** The audit's research notes discuss the swatch source.
  Nothing under `docs/` had ever been committed, so no history rewrite was needed for it.
  Consequence: `docs/` is local-only and unbacked by the repo, as `Skills&rules/` already
  is.

### Added

`python-api/tests/test_shadow_detection.py` — three fixtures, each stating the input that
would make it fail. The first fails on the parent commit with the exact `ValueError`.
The merged nine-key dict shape is load-bearing: built on the un-merged shape the fixture
passes vacuously.

### Measured

| Gate | Result |
|---|---|
| Backend suite | 673 passed / 1 skipped (670 + 3 new) |
| Frontend suite | 854 passed, 27 files |
| `npm run build` | clean |
| `benchmarks.run` (O-C14b) | byte-identical to parent apart from timestamp |
| `benchmarks.run` (C1.1 determinism) | run twice: `scoreboard.md` byte-identical; every `scoreboard.json` field identical apart from `generated_at` **and `elapsed_s`** — a second varying field the plan did not name, now commented in `run.py` as the only two a diff may ignore |

Side measurement, folded back into the plan: `_is_likely_shadow`'s full condition fires on
only **79 of 79,971 real DB pairs (0.099%)**, so audit finding O-C16 is **narrower than
filed** — the V-gap requirement is far more restrictive than its ΔE 15 threshold implies.
Its sharpest real case is Dragon Blood → Basilisk Red at 14.90 ΔE00, two genuinely
different paints, one deleted as the other's shadow.

### Known / pending

- **The swatch-source name survives in committed history** (`d3bb52b`, `c1b2e00`) on the
  GitHub remote. Clearing it needs `filter-repo`/BFG plus a force-push — an open decision.
- **The `gold_and_bone` bench scene plants one paint, not two.**
  `benchmarks/synthetic_extract.py:110-116` builds `planted` as a dict keyed by family and
  `classify_family(gold.lab, is_metallic=False)` returns *bone*, so the gold entry is
  overwritten. Gold's block therefore counts as non-planted and reports 6.667 % for a
  reason unrelated to that metric's purpose. Left alone deliberately — fixing it moves
  `planted_families` and `family_hit`, and the instrumentation commit's job was a clean
  first diff. It belongs with the metallic commit, which already needs a real positive
  control.
- **No skeptic pass on the instrumentation.** Optional per the contract, and its C1.1
  brief is satisfied and evidenced above, but everything from the extraction commit onward
  is judged against these numbers.
- 14 of 17 planned commits outstanding, plus six decisions, two deferrals and three
  research spikes. One is blocked on a photograph of a known metallic region; the audit
  still has **no labelled photograph set**, so top-1 accuracy on real minis cannot be
  claimed.

## [Unreleased] - 2026-08-18 (colour accuracy: phase 2, the mechanical tier)

Five commits, one finding each, none of which moves a bench number. Phase 2 is complete;
8 of 17 planned commits have landed. All local — nothing pushed.

### The pattern worth keeping from this batch

**Three of the five specifications were wrong about the code, and each was caught by
opening the file rather than trusting the finding.** The audit's own most valuable output
was that every one of its seven refutations turned on *measuring a population the pipeline
never produces*; that failure mode reappeared inside its remediation plan.

- **C2.3's premise about the user is false.** Its finding says the UI tells the user the
  image is being brightened. It does not: `quality_report` is bound and then **discarded**
  in both scanners (`miniature_scanner.py:105,118`, `inspiration_scanner.py:77`),
  `_format_results(recipes, mode)` takes no quality argument, and the API response carries
  no quality field at all. The strings reach nobody. The reword still stands — it is the
  description the next reader trusts — but the honest claim is "dead copy asserting a
  correction that never happens".
- **C2.6's named hooks already pass.** It says to compute the ink in the shared card and
  `SwatchCompare`. Both put their labels on an opaque scrim, not on the swatch. The
  component that actually inks with a measured colour is `AuspexReveal`. Implementing it as
  written would have hardened two components that were never broken.
- **C2.2's audit wording would have deleted a live class.** `VisualizationEngine` is
  instantiated at `schemestealer_engine.py:188` and called at `:470`; only four of its
  methods were dead.

### Changed

- **The ΔE badge and the recipe card now share one vocabulary** (`0b2db3f`). The card had
  its own scale — `≤5 excellent · ≤15 loose · >15 poor` — against the fixed
  `perfect <2 · close <5 · fair <10 · distant ≤30`. **0 of 300,001 grid points across
  ΔE 0–30 shared a word.** `lib/deltaE.ts` now exports the vocabulary, a `deltaBand()`
  mirroring `build_conversions.py:17-26`, and the base-only badge gate as a named
  predicate. The SEO badge gained an explicit `none` case: its `default` branch used to
  render an unrecognised band as "DISTANT MATCH", asserting the paint is inside the ΔE 30
  ceiling — the one thing `none` means it is not.
- **Quality warnings state the fault and the remedy, not a fix** (`71bdfbc`). "Image is
  dark — brightening automatically" became "Low light detected — re-shoot brighter for a
  truer match". All three described an effect on `enhanced_image`, which has no reader.
- **Swatch ink is solved against the swatch** (`6f3a512`). 6 of 60 real cluster swatches
  failed WCAG 4.5:1, worst 2.85:1, with 2 below even the 3:1 large-text floor. The focused
  reveal chip hard-coded black type on the measured colour, which fails on **688 of the
  1,312** shipped paints. Now computed, by reusing the pict-cast's own hue-preserving
  `contrastTint` plus a new `readableInkOn` — which gives `getContrastRatio` and
  `getRelativeLuminance` their **first callers** after shipping with none. No new maths, no
  dependency. Only illegible ink moves; borders and glows stay true hex.

### Removed

- **The dead server-side overlay path** (`6b3bd7e`) — `create_color_overlay`, `_clean_mask`,
  `_draw_minimal_reticle`, `draw_enhanced_reticle`. Zero callers, including tests; the last
  three reachable only from the first. This is the code the Bug C diagnosis kept landing
  on: `_clean_mask`'s 5 px floor is its *documented* mechanism, and it has been unreachable
  for as long as the alpha-PNG client-side composite has shipped. Two stale references were
  swept with it, one of them in a **tracked, agent-loaded** skill file that still taught the
  dead mechanism as the confirmed cause.
- **Two unreachable branches and a stale docstring** (`afe50e7`). `smart_color_system.py`'s
  micro-detail branch sat behind a strictly weaker coverage test; `determine_shade_type`'s
  `> 30` branch sat behind a surface classifier that already returns 'wash' above 20. Three
  numbers existed for one decision — dead 45, unreachable 30, live 20 — with the live one
  on the next config line, which is exactly why the dead one read as live. The branch was
  **not** reordered to make it live: that adds cards, and it is an open decision.
  `build_color_anchors.py`'s docstring claimed neutrals are not anchors and are handled by
  a gate the classifier does not have; the code 30 lines below builds them as anchors. Last
  open ledger row.

### Measured

- Backend **673 → 711** tests, frontend **854 → 888**. `npm run build` and `tsc --noEmit`
  clean throughout.
- **Every commit's bench run was identical to `e8ca68e` apart from `generated_at` and
  `elapsed_s`**, the only two fields a diff may ignore. For the deletion commit that is not
  a formality but the gate itself: a behaviour-neutral change that moved a number would be
  wrong by definition. The artefacts are therefore left pinned at `e8ca68e` rather than
  re-committed with a fresh timestamp each time.

### Known / pending

- **A third ΔE vocabulary exists and the audit never found it.** `lib/colorMath.ts:183-189`
  `getDeltaEBand` returns `Identical <1 · Excellent ≤2 · Good ≤3 · Acceptable ≤5 · Poor >5`
  in The Forge. Same defect as the card's, but user-facing copy in a surface the plan does
  not name and whose semantics differ (mix accuracy, not match distance) — so it was flagged
  rather than folded into a commit scoped to one finding.
- `lib/reveal/revealCompose.ts`'s `deltaBandName` has the right words with `≤` bounds, so it
  disagrees with the canonical `<` at exactly 2.0 / 5.0 / 10.0. `lib/reveal/` is an explicit
  non-goal of the audit and was left alone.
- The rest of `.agents/skills/schemestealer-colour-science/SKILL.md` is a stale mirror of the
  corrected local skill set. Only its references to deleted symbols were fixed.

## [Unreleased] - 2026-08-18 (colour accuracy: phase 3, the upstream input and extraction tier)

Two behaviour changes and one repair to the measuring instrument. The first commit in
this whole plan that moves a bench number lands here — everything before it was
byte-identical by design.

### The pattern worth keeping from this batch

**Three of the specification's claims were wrong about live code, and the fourth was
wrong about itself.** The plan's EXIF fix was "one line in `main.py`"; it is two call
sites, and missing the second leaves the defect in the mode the finding is actually
about. The plan's three photograph fixtures for the plinth mask do not reproduce on any
rig that still exists. And the plan's own gate for that commit — "silhouette retention
rises on all five photographs; if one regresses, stop" — **cannot fail**: the mask only
ever entered as an AND-NOT term and the only operator downstream is a monotone closing,
so retention is non-decreasing by construction. Measured: zero old-only pixels on all
five.

> Findings register #35 for the third time: *a gate that cannot fail is worse than no
> gate.* This one was written by the plan that exists to stop exactly that.

A fourth, found by measuring rather than reading: **the suite's real-photo tests were
non-deterministic and had been passing by chance.**

### Changed

- **EXIF orientation is applied before anything measures the array** (`c27a221`). Phones
  store a landscape sensor array plus a rotation tag and leave the turn to the viewer;
  `Image.open` does not apply it. The analysis width is fixed at 300 px, so a sideways
  frame changes the analysis pixel budget by up to 1.74×, and that budget sets superpixel
  granularity — the lever that flips metallic flags on real photographs. Applied on both
  scan endpoints. Uses the in-place form, because the plain call returns a full-frame copy
  on every upload when there is nothing to correct, and the backend runs on a 512 MB tier.
- **The HSV plinth colour mask is deleted** (`6efeeb3`). `_detect_base_colors` accepted a
  geometric argument and never read it, applying hue bands to everything below a fixed
  height. `stone_grey` was the full hue circle at low saturation — a description of any
  desaturated mid-tone, not of a base material. A colour test for a geometric property
  cannot be repaired by tuning, so it is deleted rather than retuned; the geometric
  flood-fill is untouched and is byte-identical.

### Fixed — the measuring instrument

- **`tests/test_real_scans.py` drew a new foreground mask on every run** (`f6a22b1`).
  `cv2.grabCut` seeds its GMM from OpenCV's global RNG; unseeded drift between two
  consecutive calls in one process is **40,819 px** on one photograph. Every assertion in
  the file moved with the mask, so a green run proved nothing about the engine. Pinned.
  The docstring now records what pinning does not buy: across five draws on unmodified
  `main`, one of those tests holds on only two of them.

### Measured

| | before | after |
|---|---|---|
| Silhouette retention, 5 photos | 69.37 / 72.74 / 75.12 / 75.59 / 70.75 | 70.36 / 80.00 / 80.80 / 80.75 / 77.97 |
| Graded instability total | 6.739269 | **6.127777** |
| `capturepink.PNG` under LSB / JPEG | changed / changed | **unchanged / unchanged** |
| `Example.jpg` image score | 1.2123 | **1.8565** (worse) |

Matcher and synthetic-extraction rows are unchanged. The retention row is reported
because it is the direct measurement, not because it is a gate — see above, and see the
caveat below about what those pixels actually are.

### Known / pending

- **Two tests are now `xfail(strict=True)`, and that is the real cost of the plinth
  commit.** Recovering the surface the mask was deleting hands more of a shading ramp to
  a merge threshold that cannot span it, so one photograph's armour returns as two cards
  and another's cloak fragments out of the visible five, with a spurious metallic card
  taking a slot. Both tests were written after a production incident and both still
  encode the behaviour we want — the engine is wrong, not the assertions. The two merge
  and metallic commits later in the plan own the fixes. Strict, so they break the suite
  the moment they pass and force the markers off rather than letting them rot.
- **The bench's real photographs are largely not miniatures.** The harness only mattes
  when it finds a white corner, which happens on one of the five; on the rest the
  "silhouette" is the whole frame, so the recovered pixels are studio table and
  out-of-focus backdrop. One of the five is not a miniature at all — it is a film still
  with a palette strip. Re-matting the set is now a prerequisite for the three later
  commits that calibrate thresholds against real-photo numbers.
- **HSV is not gone from the colour path.** The plan claimed this commit removed the last
  of it; shadow deletion still keys on HSV value and the metallic flag on HSV saturation
  and value. The family classifier remains free of it, which is what the invariant
  actually requires.

## [Unreleased] - 2026-08-18 (colour accuracy: phase 4, the first three of the surviving "next" tier)

Three commits: the recipe graph's edge selection, the offline matcher's metallic leak,
and the paint database's provenance. The remaining four of Phase 4 are **blocked** on
photographs — see Known / pending.

### The pattern worth keeping from this batch

**Check whether the data is wrong before deciding to rebuild it.** The recipe fix looked
like it might need the 4,822-edge graph regenerating. It did not: the generator writes
the top two candidates per relationship, ranked by the geometry scorer, and all 2,344
algorithmic-only keys still hold exactly that pair with the scorer's winner still ranked
first. The runtime was simply discarding the ranking the file was built with and
re-picking on lightness alone. A one-line consumer fix, not a data migration — and the
difference was one measurement away.

**A commit can make a neighbouring comment dangerous.** The provenance fix left a
dataclass comment asserting that a paint's colour source selects its matching target.
That was already false, but after the fix no paint carries the value the comment names,
so anyone trusting it would conclude the measured colours had stopped being used
entirely. Corrected in the same commit, with a test pinning the real coupling.

### Changed

- **Recipe edges are chosen by the geometry that generated them.** The graph's final
  tie-break was the lightness error against a fixed ideal step — no hue, no chroma — so a
  warm base could be handed a highlight that went cooler and washed its colour out. It
  now uses the same scorer that wrote the edges, for highlight and shade only. Curated
  chains are untouched: every one is the only edge on its relationship, so the tie-break
  never runs on one.
- **The offline matcher no longer serves metallic paints for matte targets.** The backend
  has always excluded them — a metal's single flat colour reading is not comparable with
  a matte surface's, which is why the online path drops them outright — and the offline
  fallback did not. A mid grey previously came back with two different metals in one
  recipe. Metals remain reachable by name search and on explicit request.
- **Paints keep the provenance the database records.** Every paint was being relabelled
  "measured" at load, including the 96 washes and inks whose colour was never measured at
  all. No badge, no ΔE and no match changes — the field is not read yet, which is exactly
  why it was safe to fix now.

### Measured

- Highlights losing more than half their colour intensity: **75 → 48** across the graph,
  and **12 → 5** of the highlight slots actually served on the five test photographs.
- Highlights going the wrong way round the colour wheel: **161 → 134** across the graph
  (21.55% → 17.94%), net of 58 fixes against 31 regressions. **On served slots this did
  not move** — 19 before, 19 after. The colour-intensity half is the real user-facing
  effect and the other half must not be quoted as one.
- Lightness-inversion guard unchanged at 2 of 2,365; extraction, stability and matcher
  scores byte-identical.
- Backend tests 717 → 720, frontend 888 → 893.

### Known / pending

- **The remaining four Phase-4 commits are blocked on photographs.** All of them calibrate
  thresholds against real-photo numbers, and the bench's photographs are still largely
  unmatted (recorded last batch). Nothing further can be tuned honestly until the set is
  replaced, and one of the four additionally needs a photograph containing a known
  metallic region. This is a hard stop, not a scheduling preference.
- **The recipe finding is not closed.** 59 warm bases have every stored candidate on the
  wrong side of the wheel and no re-ordering can help them; the finding's own headline
  example is one of them. The lever that would move it is the generator's cap of two
  candidates per relationship — 45 of the 59 have a better option just outside it —
  which means regenerating the edge file, deliberately out of scope here.
- **Two divergences from the backend in the offline recipe path**, recorded rather than
  smoothed over: the metallic filter also strips metals from the offline shade slot,
  where the backend allows them; and the offline generator can hand back the same paint
  for both the base and its highlight, because it has no "must differ from the base"
  rule. The second is pre-existing and was only exposed by the filter.
- **The lightness step drifted and nothing gates it.** Dropping the lightness tie-break
  moved the median highlight step from 1.4 to 2.1 lightness units. Defensible — the
  replacement models a highlight better — but unmeasured by any gate, and the inversion
  guard is now the only lightness check on that path.

## [Unreleased] - 2026-08-19 (colour accuracy: the twelve decisions, answered)

Not a tier of the plan. Twelve open judgement calls — the plan's `DEC-1…DEC-5` plus seven
raised while implementing — were all decided, and these seven commits execute them. One
decision per commit, in risk-ascending order: documentation, then small code, then product
surface, then infrastructure.

### Changed — the wash slot stops publishing a meaningless number (DEC-8)

A wash is chosen by **family archetype**, never by colour: white maps to "dark", so a white
card is correctly washed with Nuln Oil. The code then scored the wash paint's own colour
against the *card* and published it under the same field name the base slot uses for a real
match distance. Measured across 198 served wash slots: median 27.1, max 76.6, and **44.9%
beyond the matcher's own ceiling of 30** — which is the proof it was never a match distance.

This does not hide a ΔE. It removes a number that was never a ΔE against the thing its name
claimed. Highlight and shade are untouched; whether they keep a renamed score is a separate,
unmade call.

**Two corrections to the brief, both load-bearing.** The wash slot has *two* builders, not
one — 34 of 198 served slots come from the recipe graph and 164 from the archetype fallback,
so fixing one would have left a sixth of wash rows still publishing a score. And "not
user-visible" was false: the copy-recipe export prints the number for every slot that
carries one, and the card's "✓ Perfect" chip is **not** gated to the base row the way the ΔE
badge is. Offline that chip fired on *every* wash row on *every* scan, driven by a hardcoded
zero that was a placeholder, not a measurement.

### Added — paints with no measured colour now say so (DEC-2)

96 of 1,312 paints have no measured colour; their value is inferred. They are not even 96
independent estimates — **12 colours are each shared by two or more of them, covering 71% of
the 96**, one shared by seventeen paints across four brands. The card now marks these
"Estimated colour" with a tooltip explaining the difference.

This **qualifies** a number rather than hiding one: no ΔE is altered, suppressed or
re-banded, and no recipe changes. Read together with the wash change above, the wash row
loses a number that meant nothing and gains a qualifier that means something.

Keyed on provenance, deliberately **not** on the row being the wash. Every unmeasured paint
today happens to be a wash, so the two rules agree on the whole database — right by accident,
and wrong the moment a wash is measured, which is exactly what the accuracy roadmap intends
to do.

**Found by measuring the wrong thing first.** An earlier draft asserted against the engine's
internal dict, passed, and would have shipped a field the API still dropped — the response is
rebuilt field by field one layer further out. The audit's own recurring failure class,
caught inside the commit that committed it.

### Fixed — three recommendations that could not be acted on

- **A partner slot can no longer be the base paint again** (DEC-11, offline). The backend has
  always forbidden this; the offline fallback did not, because its lightness test compared
  against the *target* colour rather than the *chosen* paint. Measured along the neutral
  axis: 5 of 228 highlights and 4 of 228 shades came back as the base paint — recipes
  instructing the painter to do nothing. The brief named the highlight case only; the shade
  case was found by measuring.
- **A matte colour is no longer offered a metallic substitute** (DEC-5). Metallics change
  appearance with viewing angle, so recommending one for a flat surface is a category error
  the main matcher already refuses to make; the "you already own this" lookup bypassed it.
  43 of 1,077 matte paints could be substituted this way — an off-white armour's nearest
  candidate of *any* kind was a silver.
- **The plan's stated reason for where to put that filter was wrong**, and the conclusion
  survived anyway: the code it said to protect does not use this lookup at all. The code that
  genuinely needed protecting is the one generating 1,326 cross-brand conversion pages, where
  someone searching for a metallic equivalent *should* be shown metals.

### Documented — three decisions the code could not explain (DEC-3 / DEC-7 / DEC-1)

No behaviour change; the benchmark returning byte-identical output **is** the gate.

- The matcher's "no match found" path for base colours is unreachable and is **kept anyway**,
  now with the measurement beside it: every one of the 204 gated pools is non-empty and the
  worst distance achievable anywhere is well inside the ceiling. It stays because it bounds
  what the matcher may return if the database ever thins out, and lowering it to make it bite
  would be a contract change.
- The Forge keeps its own quality wording, because it measures **mix accuracy** and the rest
  of the app measures **match distance**. Forcing one vocabulary onto both would make the
  numbers agree and the meaning wrong.
- The extraction bias toward darker pixels is **renamed, not changed**. It was called a
  "base-coat bias"; on a miniature the tonal range runs shade → base → highlight, so what it
  actually lands on is the **shade**. Its cost is now recorded next to it: it fires on 21% of
  merged colours and changes the recommended paint in 37% of cases.

### Fixed — CI was not running twelve of its own tests (DEC-9)

The test suite substitutes a fake image library unless told otherwise, so CI could run
without OpenCV installed. It never was told otherwise. **719 tests ran in CI against 736
locally** — the missing twelve include the entire real-photograph scan suite.

Two of the guards that skip those tests are **load-bearing and must stay**: under the fake
library one of them passes on the exact code it was written to catch, and another errors
outright. The fix is to give CI the real library, not to delete the guards. The runner also
needed two system packages the image never carried, added CI-side so the deployed
dependency set is untouched.

### Removed — three test harnesses that could not fail (DEC-10)

Archived, not deleted, along with their runner and its `-Harness` switch:

- one grades the colour classifier against a **design that was deleted twice** and is
  explicitly forbidden; its headline "9.4% miss rate" is a disagreement rate with that dead
  design, and most of the disagreements are the current code being right;
- one has **no assertions at all** and always reports success;
- one is compared against a frozen baseline that scores the **wrong answer** — the engine
  improved and the number went down.

They are archived rather than deleted because their numbers are still quoted elsewhere, and
someone who finds the 9.4% needs to be able to reach an explanation. The likely response to a
missing explanation is to "fix" the harness, which would reintroduce the forbidden design
through the back door. A README beside them says exactly that.

A stale manual for these three was also sitting in the directory of *live* scripts, teaching
several things that stopped being true some time ago; it moves to the archive under a
warning banner.

### Known and deliberately not actioned

- **Raising the recipe generator's candidate cap was investigated and refuted.** Storing more
  candidates per colour moves a diagnostic number and changes **nothing a user receives** —
  see `docs/audit/STATUS.md`.
- The frozen harness baseline is still tracked and now has **zero consumers**. Retiring it is
  a separate decision.
- The offline path ships no provenance, so the "Estimated colour" marker is online-only.
  Recorded rather than faked — inferring it from the row would be the accidental rule the
  commit explicitly rejects.

## [Unreleased] - 2026-08-12 (video-qa: a harness that measures the artefact)

Phase 0 of the v6 corrective pack. Nothing user-facing changes; this exists so
that everything after it can be honestly verified.

### The defect class this closes

Every video and audio gate in the repo runs **before** muxing — on `frameState`,
on an `OfflineAudioContext`, or on a canvas. Two device exports downloaded from
the live site fail six gates the pre-encode suite reports as passing:

> The gate measures the render. The user receives the artefact. Nobody measured
> the artefact.

This is the sibling of findings register #35 ("a gate that cannot fail is worse
than no gate"): **a gate that measures the wrong object.**

### Added

`video-qa/` at repo root, mirroring `video-factory/`'s separation. Python, run
on `python-api/venv`, exposed as `npm run qa:video` so it joins the commit gate.
Non-zero exit on failure; JSON per file plus a table naming the measured value,
the threshold, and the timestamp of the worst window. Per ground rule 8 every
gate carries a one-sentence "fails when" string, printed on failure.

Uses the `ffmpeg`/`ffprobe` already vendored with Remotion — no new dependency.

### Measured, against the two shipped exports

Reproduces the forensic analysis independently. Failing:

| Gate | Mini | Inspiration | Threshold |
|---|---|---|---|
| SPS VUI colour | 6/6/5 | 6/6/5 | 1/1/1 |
| Integrated loudness | -10.72 LUFS | -11.20 LUFS | -14 +/-1 |
| True peak | -1.26 | **-0.84 dBTP** | <= -1 |
| Crest, min windowed | **8.97 dB** | 9.92 dB | >= 12 |
| Anti-freeze, quietest 0.4 s | 0.583 | **0.493** | >= 0.5 |
| Sharpness dip | 0.23 s | **1.87 s at 47%** | <= 0.35 s |

Still passing, and asserted so miscalibration is visible: frame counts 330/420,
PTS median 33.333 ms (std 0.0005) = exactly 30 fps, loop seam 1.43/1.13, stereo
correlation 0.906/0.823, mono retention 0.976/0.955, frame luma 23.0/131.9.

### Two findings that only appear when you measure bytes

**The `colr` atom and the H.264 SPS VUI disagree, and ffprobe believes the SPS.**
`mp4ColrPatch.ts` is working — the atom reads 1/1/1 on both files. The SPS VUI
reads 6/6/5, and that is the layer every platform transcoder reads. The harness
parses both independently rather than trusting ffprobe's single collapsed value,
because that collapse is exactly what hid this. Phase 1's fix; the SPS bit
offset (94 on both files) is already reported to make the patch straightforward.

**Anti-freeze must be measured on the coded Y plane.** Decoding to RGB first
lets 4:2:0 chroma upsampling invent inter-frame difference the encoder never
coded. The warp-cast reads 0.587 that way and 0.493 on the Y plane — the
difference between passing and failing the 0.5 floor.

### Corrections to the corrective pack

The pack was written without repo access. Verified against source:

- **Its Phase 2 diagnosis is wrong about the mechanism.** It says the loudness
  gate averages channel energies and the fix is one line inside the loudness
  function. `integratedLufs` (`tests/reveal-export.spec.ts:219`) takes a single
  array and aggregates nothing. The real defect is the call site: `render()`
  builds `new OfflineAudioContext(1, ...)`, a **mono** render, and measures
  that. WebAudio downmixes stereo to `(L+R)/2`, landing 3.01 dB below the
  BS.1770 sum. Same magnitude, different location — and `peakDb`/`crestDb` are
  measured on the same mono downmix, so those move too, which the pack does not
  anticipate.
- `GRAIN_ALPHA` does not exist; grain is pre-baked tiles (`GRAIN_TILES = 4`,
  `revealCompose.ts:1102`).
- Phase 5's blur is `warpCompose.ts:325`, not a `warpTimeline.ts` constant.

### Still unverified

- **Safe-area occupancy below y=1430 reads 29.7% on the warp-cast where the
  pack measured 15.3%.** Both fail the gate and the qualitative finding is
  unchanged (warp violates heavily, mini is clean at 1.0%), but the absolute
  figure is sensitive to the detail-classification kernel and the two do not
  agree. Right-of-x=900 does agree (10.8% vs 9.8%, and mini 1.8% vs 1.7%).
- Onset detection finds 21/22 onsets where the pack lists 10/5. The onsets the
  pack names are all present within ~20 ms; this detector is simply more
  sensitive. It feeds only the reported HF-on-beat figure, no gate.
- The harness has never run on a freshly exported device file — only on the two
  captured 2026-08-12. Definition of done requires a new capture from a real
  phone after the Phase 1-2 fixes land.
- Synthetic *video* controls inject frame sequences rather than building MP4s:
  the vendored ffmpeg is a decode-only build with no `rawvideo` muxer or
  demuxer and no `lavfi` source filters. The end-to-end path is covered only by
  the two device exports.


## [Unreleased] - 2026-08-12 (Swatchle replaced by Matchle)

Swatchle was well-built and landed for expert painters, but it was a **recall
quiz wearing a deduction puzzle's clothes**. The target swatch was on screen, so
the warmer/darker/ΔE clues only quantified what the eye had already reported.
The hard part was remembering which of 1,312 pot names maps to a colour — and no
clue narrowed the *name* space, so there was no convergence and a loss read as
arbitrary. With answers drawn from all six brands, a Citadel-only painter had no
path on an AK day, which broke the streak, which was the only retention
mechanic.

`/daily` is now **Matchle**: five rounds of "which of these four paints is the
closest match?", one tap each. It demonstrates the product instead of testing
trivia, a wrong answer still teaches a number, and it produces the argument
("ΔE 2.8 — close enough or heresy?") that actually spreads.

### The bug this deletes rather than fixes
All 400 future answers shipped in the client bundle, readable in thirty seconds.
Matchle **cannot be spoiled**: all four candidate hexes are on screen and
ΔE2000 is public maths, so the answer is computable from what the player can
already see — that is the whole game. Rounds are therefore generated
client-side from the date (`hash(dateISO + salt)`), which also removes the
"runs out after 400 days and silently repeats the last puzzle forever" bug, and
adds no bundle weight since `PAINT_DATABASE` and `deltaE2000` were already
client-side.

### Fairness, enforced at generation rather than hoped for
Wordle's fairness comes from answers being narrow while guesses stay wide.
Matchle's equivalent is a set of hard constraints, with the seed bumped and the
round regenerated until all hold: target from the 379-paint curated pool; true
best ΔE ≤ 6; winner beats the runner-up by ≥ 1.5 ΔE; all candidates from other
brands and mutually distinct; no metallics.

**Every candidate is within ΔE 14 of the target.** This was the change that
turned it into a game. Drawing distractors uniformly gave rounds like
*Averland Sunset → 0.8 / 25.9 / 26.9 / 35.4*, which is not a question. It was
caught by printing real rounds, not by a test — the tests were all passing.
The same constraint fixed a variety problem: a global runner-up margin had
rejected 76% of the pool, leaving ~82 usable targets.

A property test generates 365 consecutive days and asserts every constraint on
every round. That is the test that would have caught Swatchle's actual problem.

### Added
- `lib/matchle.ts` — seeded generator, scoring, share grid. No React or DOM, so
  the year-long fairness test runs in milliseconds.
- `lib/matchleState.ts` — persistence split out of the component so rollover and
  streak rules are testable. `loadState` tolerates junk **and** leftover
  Swatchle state; `/daily` is a TikTok landing target and must never render a
  crash.
- `lib/data/matchle_pool.json` + `scripts/generateMatchlePool.js`, copied from
  the existing `curated_pool.json` so curation stays single-sourced.
- `tests/matchle.spec.ts` — a full daily at 390×844, the clipboard payload, and
  a device still holding Swatchle's state.
- Analytics `daily_started`, fired on first tap.

### Changed
- **No losing condition.** The streak advances on completion regardless of
  score. Finishing is the habit worth rewarding; hits and ΔE cost express skill.
  Breaking a streak on a 3/5 would reintroduce the anxiety that made Swatchle's
  wide answer pool feel unfair. NYT's newest hit ships the same way.
- **Share grid has colour in it.** The old grid was arrows with variation
  selectors that misaligned across clients and contained no colour at all — for
  a colour game. It is now two rows: the five target colours as emoji squares,
  then 🟩/🟨/🟥 for how it went. Someone scrolling past sees a colour puzzle
  without reading a word. The header reads "ΔE cost 32.8", not "ΔE 32.8";
  printing a real payload showed the bare number next to "1/5" reads like a
  score when lower is better.
- How To Play now states the pool size. Knowing the answer list is narrow is
  what makes a streak feel worth keeping; Swatchle never said so.
- Stats distribution is hits-per-game (0–5) plus best ΔE cost. The old one
  measured turns, and there are none now.
- `/daily` metadata is plain English. The old line —"Identify the daily target
  cogno-meme paint in 6 guesses or fewer" — was on every share and link preview
  and let flavour obscure meaning.
- New localStorage key `schemestealer-matchle`. `schemestealer-daily-augury` is
  a declared frozen key holding an incompatible shape; reusing it would hide the
  change rather than record it. Invariant 6 updated in the same commit. Existing
  Swatchle streaks end — they measure a game that no longer exists.
- Phase 4 monetisation gate corrected to count `daily_started`. `daily_played`
  only ever fired on completion, so the gate was counting finishers, not
  players.

### Removed
`DailyGameUI.tsx`, `InlineGuessInput.tsx`, `colourClues.ts` and their tests.
This also deletes, rather than fixes, the hue "warm pole" ambiguity at 55°, the
unreachable `|ΔL| < 1.0` lightness threshold, and the in-place
`guessDistribution[...] += 1` mutation.

`lib/data/daily_puzzles.json` **stays on disk** — `video-factory` reads it at
render time; only the app-side import is gone.

### Also fixed (unrelated, found by the pre-ship sweep)
`forge-mix` and `requisitions-cart` had been failing to a 120s timeout since
86746b5 added `aria-label` to the modal close and cart quantity buttons, which
replaced each glyph as the button's accessible name. The app was never broken;
the selectors were.

### Known gap
Ten of the 25 launch clips render from `daily_puzzles.json` via
`video-factory/src/templates/Swatchle/`. They still render and their `/daily`
CTA still resolves, but they advertise a game that no longer exists. **Must be
addressed before the launch bank is finalised.**

## [Unreleased] - 2026-08-11 (Audio: both soundtracks rebuilt)

Both beds were flat lists of oscillators and band-passed noise wired straight to
a limiter — dry, mono, and pitched on arbitrary Hz values (`96 + i * 5`) so
nothing agreed with anything. Good placeholders; not good audio.

### The licensing finding, which decided the approach
The obvious fix — buy a royalty-free bed — does not survive contact with how
this product works, because **our users redistribute the file**. A royalty-free
licence covers the licensee, not everyone who later posts the export; the
licence does not transfer between platforms; and a track can be royalty-free and
still trigger Content ID, landing a claim on *the painter's* video. AI music is
worse: paid tiers grant a commercial-use licence rather than copyright, with
active litigation.

Meanwhile the platforms now weight **original** audio above borrowed sound.

So synthesis is not the cheap option here, it is the correct one: it is ours to
grant unconditionally, and it is the algorithmically favoured category.

### Added
`revealAudioEngine.ts` — the machinery both beds lacked:
- **Convolution reverb from a generated impulse.** No asset files,
  deterministic. Every previous version was bone dry, which is the most reliable
  tell of cheap synthesis: real sounds happen somewhere.
- Separate bed / transient / harmony buses with real compression.
- **Scheduled ducking.** WebAudio has no sidechain and does not need one — every
  beat time is known before a sample renders, which is cheaper, exact, and
  deterministic where a level-follower would not be.
- Inharmonic struck-metal and bowed-glass timbres; a key per skin.

### The two voices
**Miniature — a ritual machine in D minor.** A low drone under servo whirs and
relay clacks, resolving to a struck bell at the slam. Chords Dm → C → F across
the three acts.

**Warp — glass and breath in A major.** A detuned pad under bowed-glass tones
climbing the scale as each colour pours. Major rather than menacing: the clip
became a gallery poster, and a dissonant bed would fight it.

### One gate corrected, with proof
The HF-on-beat gate required 65% of energy above 3 kHz within **±60 ms** of a
beat. It exists to catch a continuous hiss bed, and it catches that by measuring
concentration — but a reverb tail is also energy after a beat, so the reverb
this rebuild is built around would have failed it for a reason unrelated to the
defect.

Window is now 60 ms before a beat, 400 ms after. The leading edge stays tight:
HF arriving *before* its beat is a smear, not a tail. Each suite now scores a
synthetic continuous-hiss signal through the identical function and asserts it
still fails — **0.30 and 0.31 against a 0.65 threshold**. A correction, not a
weakening.

### The crest lesson
Reverb raises RMS between hits, so a reverberant mix sits closer to its crest
floor than a dry one. Four passes of cutting the bed got to 11.0 dB with the bed
nearly inaudible — and the real cause was elsewhere: **the limiter was
saturating**, clipping every transient to one ceiling, so crest could not rise
however quiet the bed became. Backing the drive off and setting the ceiling with
trim freed the peaks.

### Measured
| | miniature | warp |
|---|---|---|
| integrated loudness | −13.90 LUFS | −13.53 LUFS |
| true peak | −1.61 dBFS | −1.29 dBFS |
| crest factor | 12.23 dB | 12.25 dB |
| bed < 250 Hz | 99.7% | 99.9% |
| HF at a beat *(hiss control)* | 0.81 *(0.30)* | 0.96 *(0.31)* |
| stereo correlation | 0.909 | 0.820 |
| mono retention | 0.977 | 0.954 |

### Stereo, and why the mono gate matters more
The reverb is the only stereo source — independent noise per channel, so width
comes without phase trickery. That distinction is the point: width built from
phase inversion sounds impressive on headphones and **cancels on the single
phone speaker most people watch on**. Both gates carry controls — a
phase-inverted pair must collapse below 0.05, and reports 0.

### Verification
`vitest` 808 · `tsc` clean · `next build` exit 0 · all four Playwright suites
13/13.

### Still unverified
Nobody has heard either of these. Every number above is a measurement, and none
of them says whether it sounds good — that needs a phone speaker.

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

### Not changed, and correctly so
`app/miniature/page.tsx:148` keeps `capture="environment"`, and that is right:
the miniature tab has TWO inputs — a dedicated camera button (`cameraInputRef`,
where forcing the camera is the point) and a separate file input in
`CogitatorUpload` with no `capture`. Nothing is blocked there.

The inspiration tab has one control, so that control has to offer both. The bug
was never the attribute in isolation — it was one entry point wearing an
attribute that only makes sense when there are two.

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
