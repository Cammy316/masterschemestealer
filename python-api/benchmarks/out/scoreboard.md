# Colour-accuracy scoreboard — 2026-08-17T20:13Z

There is no labelled photograph set. Matcher numbers are identity /
cross-brand recovery on stored (or primer-composited) LABs. Real
photos contribute **stability only**. Do not quote `1_synthetic_sweep.py`.

Primer for translucent scoring: `Wraithbone` (`citadel-wraithbone`).

## Matcher

| Metric | Value |
|---|---|
| Paints scored | 1312 |
| Same-brand top-1 self (base/layer/air) | 65.46% |
| Same-brand top-3 self (base/layer/air) | 71.96% |
| Opaque matte top-1 self | 99.85% (n=649) |
| Median ΔE00 of winner | 0.0 |
| p90 ΔE00 of winner | 7.08 |
| Cross-brand median ΔE00 | 5.088 |
| Cross-brand p90 ΔE00 | 9.584 |
| Honest-empty slots | 0 |

### Per brand

| Brand | n | Self % | Median ΔE | p90 ΔE |
|---|---:|---:|---:|---:|
| AK | 235 | 60.43 | 0.0 | 7.45 |
| Army Painter | 249 | 58.63 | 0.0 | 5.627 |
| Citadel | 171 | 32.16 | 3.035 | 10.732 |
| Pro Acryl | 123 | 75.61 | 0.0 | 6.087 |
| Two Thin Coats | 196 | 68.37 | 0.0 | 6.235 |
| Vallejo | 338 | 66.86 | 0.0 | 5.616 |

### Silver vs grey

- Silver scored as matte: n=54, self=0, grey-win=47
- Grey scored as metallic: n=153, silver-win=29

### Contrast / translucent vs base

- n=236, winner is opaque base=206, winner still translucent=30

## Synthetic extraction

`split_same_family` counts cards *within* a planted family and cannot
see a cross-family invention; `largest_non_planted_card_pct` can.

| Scene | Planted | Split same family | Family hits | Cards | Largest non-planted % |
|---|---|---|---|---:|---:|
| flat_two_paints | blue, red | False | {'blue': True, 'red': True} | 3 | 6.22 |
| blue_ramp_4to1 | blue | False | {'blue': True} | 2 | 27.481 |
| gold_and_bone | bone | False | {'bone': True} | 2 | 6.667 |

## Real-photo stability (unlabelled)

Images scored: 5. Unstable under LSB/JPEG/−0.3 EV: 5.

| Image | Base cards | LSB +1 | JPEG 85 | EV −0.3 |
|---|---:|---|---|---|
| complex.PNG | 8 | 9 (changed) | 9 (changed) | 8 (changed) |
| ultra.jpg | 6 | 8 (changed) | 7 (changed) | 6 (changed) |
| pinkhorror2.webp | 8 | 7 (changed) | 7 (changed) | 6 (changed) |
| capturepink.PNG | 8 | 7 (changed) | 7 (changed) | 7 (changed) |
| Example.jpg | 6 | 5 (changed) | 7 (changed) | 6 (changed) |

### Graded instability

`n_unstable` above is saturated at 5/5 and is a headline, **not a gate**.
These are. Per cell: `J` = Jaccard distance of the card-family multiset,
`L1` = coverage points redistributed between families. Lower is stabler.

| Image | Retention % | LSB +1 J / L1 | JPEG 85 J / L1 | EV −0.3 J / L1 | Image score |
|---|---:|---|---|---|---:|
| complex.PNG | 69.37 | 0.1111 / 74.30 | 0.3000 / 62.69 | 0.4000 / 63.78 | 1.8150 |
| ultra.jpg | 72.74 | 0.2500 / 72.57 | 0.3750 / 77.00 | 0.2857 / 28.10 | 1.7990 |
| pinkhorror2.webp | 75.12 | 0.1250 / 8.71 | 0.1250 / 26.96 | 0.2500 / 68.65 | 1.0216 |
| capturepink.PNG | 75.59 | 0.1250 / 29.14 | 0.1250 / 9.32 | 0.1250 / 64.81 | 0.8914 |
| Example.jpg | 70.75 | 0.1667 / 24.82 | 0.1429 / 10.80 | 0.5000 / 44.93 | 1.2123 |

**Instability total: 6.739269** (sum over 5 images × 3 perturbations; 0 = every variant identical).

Silhouette retention (analysed px ÷ alpha px — the direct O-C8 number): 69.371–75.586%.

## Recipes (edge table × paint DB — detection not involved)

Warm base = OKLab hue in `_hue_shift_deg`'s warm basin **and** OKLab chroma ≥ 0.02. Cooler = the base→highlight rotation
opposes the rotation the geometry wants. Rates are DB-wide, **not** the
served-slot population MERGED reports at 44.44%.

| Metric | Value |
|---|---|
| `(from_id, rel)` keys | 2551 |
| …by rel | {'highlight': 1188, 'shade': 1177, 'wash': 186} |
| Candidate edges per key | {'1': 280, '2': 2271} |
| Edge sources | {'algorithmic': 4615, 'citadel_official': 30, 'manual': 177} |
| Warm bases with a highlight key | 747 |
| …chosen highlight is cooler | 161 (21.55%) |
| …**all** candidates cooler (unfixable floor) | 59 (7.9%) |
| …chosen highlight loses >50% OKLab chroma | 75 (10.04%) |
| `_monotonic_ok` inversions | 2 of 2365 guarded keys |
