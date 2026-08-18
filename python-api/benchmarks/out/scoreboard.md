# Colour-accuracy scoreboard — 2026-08-18T15:27Z

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
| complex.PNG | 7 | 8 (changed) | 9 (changed) | 7 (changed) |
| ultra.jpg | 6 | 7 (changed) | 5 (changed) | 6 (changed) |
| pinkhorror2.webp | 7 | 8 (changed) | 8 (changed) | 6 (changed) |
| capturepink.PNG | 7 | 7 (same) | 7 (same) | 7 (changed) |
| Example.jpg | 6 | 6 (changed) | 5 (changed) | 7 (changed) |

### Graded instability

`n_unstable` above is saturated at 5/5 and is a headline, **not a gate**.
These are. Per cell: `J` = Jaccard distance of the card-family multiset,
`L1` = coverage points redistributed between families. Lower is stabler.

| Image | Retention % | LSB +1 J / L1 | JPEG 85 J / L1 | EV −0.3 J / L1 | Image score |
|---|---:|---|---|---|---:|
| complex.PNG | 70.36 | 0.3333 / 53.13 | 0.2222 / 34.07 | 0.2500 / 48.07 | 1.4819 |
| ultra.jpg | 80.00 | 0.1429 / 85.12 | 0.1667 / 11.40 | 0.2857 / 12.93 | 1.1425 |
| pinkhorror2.webp | 80.80 | 0.1250 / 24.17 | 0.1250 / 19.36 | 0.1429 / 63.54 | 0.9282 |
| capturepink.PNG | 80.75 | 0.0000 / 20.20 | 0.0000 / 13.40 | 0.2500 / 60.13 | 0.7186 |
| Example.jpg | 77.97 | 0.2857 / 37.01 | 0.1667 / 27.98 | 0.5556 / 104.74 | 1.8565 |

**Instability total: 6.127777** (sum over 5 images × 3 perturbations; 0 = every variant identical).

Silhouette retention (analysed px ÷ alpha px — the direct O-C8 number): 70.358–80.8%.

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
