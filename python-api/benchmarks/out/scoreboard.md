# Colour-accuracy scoreboard — 2026-08-17T19:36Z

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

| Scene | Planted | Split same family | Family hits |
|---|---|---|---|
| flat_two_paints | blue, red | False | {'blue': True, 'red': True} |
| blue_ramp_4to1 | blue | False | {'blue': True} |
| gold_and_bone | bone | False | {'bone': True} |

## Real-photo stability (unlabelled)

Images scored: 5. Unstable under LSB/JPEG/−0.3 EV: 5.

| Image | Base cards | LSB +1 | JPEG 85 | EV −0.3 |
|---|---:|---|---|---|
| complex.PNG | 8 | 9 (changed) | 9 (changed) | 8 (changed) |
| ultra.jpg | 6 | 8 (changed) | 7 (changed) | 6 (changed) |
| pinkhorror2.webp | 8 | 7 (changed) | 7 (changed) | 6 (changed) |
| capturepink.PNG | 8 | 7 (changed) | 7 (changed) | 7 (changed) |
| Example.jpg | 6 | 5 (changed) | 7 (changed) | 6 (changed) |
