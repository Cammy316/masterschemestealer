# Real-photo regression fixtures

`test_real_scans.py` runs these two photographs through the full engine —
they exposed the production metallic misclassification that synthetic scenes
missed (pink figure returned "Bronze 56.8%", black-armoured model "Silver
71.5%").

Place here (skipped when absent):

- `capturepink.png` — the bright pink striped figure (raw photo on its grey
  backdrop is fine; the test derives a foreground mask with grabCut).
- `complex.png` — the Black Templars chaplain (busy model: black armour,
  red cloak, white heraldry, silver/gold trim).

The image binaries are intentionally NOT committed (large, and the chaplain
is a Games Workshop product photo — this repo is public). Keep local copies;
the tests activate automatically when the files exist.
