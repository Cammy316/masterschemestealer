# SchemeStealer — Launch Runbook (do this, then this)

*Written 2026-07-09. The literal operator guide from zero to launch week. Strategy
lives in `SOCIAL_MEDIA_CAMPAIGN.md`; build specs in `VIDEO_AUTOMATION_PIPELINE.md`;
this document is the checklist you actually work through. Estimated wall-clock to
first post: **~2 weeks of evenings + one footage afternoon.***

---

## Step 0 — Dress the accounts (one evening)

Same identity everywhere, so a viewer bouncing between platforms sees one brand.

- [ ] **Avatar:** the green Auspex reticle on void-black (crop of the PWA icon works
      at small sizes). Identical on all five platforms.
- [ ] **Banner (X/YouTube/Facebook):** dark gothic backdrop, tagline centre:
      *"Scan your mini → get the recipe"*, small `schemestealer.com` bottom-right.
- [ ] **Bio (copy-paste, tweak per char limit):**
      > Scan any miniature → exact paint recipe. 1,312 measured paints · 6 brands ·
      > free. Daily paint quiz ↓
      Link: `schemestealer.com` (TikTok/IG); X and YouTube can carry
      `schemestealer.com/daily` as a second link.
- [ ] **Handles note:** whatever was registered, keep display name "SchemeStealer"
      exactly, everywhere.
- [ ] **Pinned drafts saved (post them on day 1, not before):**
      TikTok/IG → the best scan-reveal clip; X → the founder thread (Step 3 hook);
      Facebook → intro post with the swap-chart image.
- [ ] Google Search Console: verify domain, submit `sitemap.xml` (one-off, 10 min).

## Step 1 — Footage afternoon (one session, ~3 hours)

Kit (~£30 if you own none of it): phone tripod or stack of books, cheap lazy susan,
one daylight (5000–6500K) bulb in a desk lamp, black A2 card or dark tee as backdrop.
Phone camera: 4K/30, **lock exposure/focus (tap-hold)**, wipe the lens.

**Shot list — name files exactly as below into `footage/YYYY-MM-DD/`:**

| # | Shot | How | Count |
|---|---|---|---|
| 1 | `mini-<name>-turn.mp4` — hero turntables | Mini centred on lazy susan, camera slightly above eye level, slow steady rotation, 15–20 s each | Your 8–12 best minis |
| 2 | `mini-<name>-macro.mp4` — detail pushes | Slow push-in on the best surface (NMM, face, freehand), 10 s | Top 4 minis |
| 3 | `scan-live-hands.mp4` — the money shot | Second person (or tripod overhead): your hands framing a mini with the phone, tapping scan, THE REVEAL PLAYING ON SCREEN. Repeat ×3 takes | 3 takes |
| 4 | `pots-<paintA>-vs-<paintB>.mp4` — swap pairs | Citadel pot + its match bottle side by side on the backdrop, one slow 8 s push | 6 pairs (use the top /convert searches) |
| 5 | `broll-rack-pan.mp4`, `broll-brush.mp4`, `broll-palette.mp4`, `broll-drawer.mp4` | 8–10 s generic cutaways, slightly overexposed-moody | 5–8 clips |
| 6 | `vo-roast-01..03.wav` — first three roast voiceovers | Quiet room, phone mic 20 cm away, duvet over head if echoey. Scripts below | 3 |

**Roast VO scripts (60–80 words each, conversational, don't read stiff):**
1. A scan that nailed it — walk the recipe, end on "and it's free, link in bio".
2. A scan that MISSED (pick one deliberately: gloss varnish or harsh lamp) — "here's
   why it read the bronze as leather — specular highlights lie to cameras" — end one
   beat early: "the fix costs nothing — guess what it is."
3. The honest origin: *"I built a colour engine on 1,312 physically measured paint
   swatches — so we never have to guess a match again."* Then one sentence on the
   maddest part of building it. (Never claim more than this — it's the canonical
   wording from the campaign doc.)

## Step 2 — Build the factory (2–3 evenings, delegate to Claude/Gemini)

Work through `VIDEO_AUTOMATION_PIPELINE.md` Engine B in this order. Hand each item to
an agent as one prompt; acceptance criteria are the campaign §1 table.

- [ ] **2a. Scaffold:** "Create `video-factory/` (own package.json, Remotion latest,
      TypeScript). One CLI entry `factory <template> [--flags]` that renders 1080×1920
      MP4 masters plus per-platform caption text files into `out/<date>-<slug>/`.
      Reuse `schemestealer-react/lib/data/*.json` read-only."
- [ ] **2b. T2 Budget Swap** template per the pipeline doc structure (20–25 s,
      price-tag hook ≤3 s, ΔE stamp, price counter, loop end-frame, comment-bait
      variant flag `--bait`).
- [ ] **2c. T1 Swatchle** template (24–30 s, garble hook, wrong-guess ticker,
      reveal at loop point, `--date` flag).
- [ ] **2d. `factory qa`** script (first/last-3 s strips, loop-frame pixel diff,
      hook-beat check, thumbnails + title variants).
- [ ] **2e. Test render** one of each; run `factory qa`; watch both ON YOUR PHONE
      (never judge a vertical video on a monitor).

## Step 3 — Produce the launch five (one evening)

These five define the account's content DNA — best first, no intro posts.

| Order | Clip | Source | Hook (first words on screen) |
|---|---|---|---|
| 1 | Augury quiz (pick the most guessable famous paint in the bank window) | T1 render | "Only real painters name this in 3 guesses" |
| 2 | Scan reveal of your best mini | OBS screen-record of the app + `scan-live-hands.mp4` intro cut + VO-roast-01 | "I pointed maths at my Stormcast" |
| 3 | Budget swap on the most-searched Citadel paint | T2 render | "£4.75 for THIS?" |
| 4 | Augury quiz #2 (harder paint, bait pin ready) | T1 render | "Nobody got yesterday's. Try this one" |
| 5 | Founder story | Phone-to-camera 45 s OR b-roll montage + VO-roast-03 | "I built a colour engine on 1,312 measured paints" |

Assembly for clips 2 & 5: OBS captures the app at 390×844 device emulation (crisp
phone UI); cut in CapCut or any free editor — **export clean, no template overlays or
watermarks** — captions burned via the editor or `factory qa`'s caption pass.

## Step 4 — Fill the 25-clip bank (~4 evenings, batch by template)

| Template | Count | Notes |
|---|---|---|
| T1 Augury | 10 | One render command per date; QA in one sitting |
| T2 Budget Swap | 8 | Mix 5 clean wins (ΔE <2) + 3 bait clips (ΔE 2.5–3.5, "heresy?" ending) |
| Roast/reveal (T4-style via OBS) | 4 | Your turntable footage + remaining VOs; include ONE honest miss |
| P5 story clips | 3 | B-roll montage + text-on-screen; one is the Reddit-post teaser |

Bank rule: **do not post anything until all 25 pass QA.** Log every clip as a row in
the calendar sheet (Step 5) the moment it's rendered.

## Step 5 — Calendar + daily ops (30 min setup)

One Google Sheet, one tab, these columns — nothing fancier:

`date | platform | clip file | hook | caption file | posted? | 24h views | 24h completion % | comments | note`

- Pre-fill 14 days: TikTok daily; IG Reels + Shorts on alternating days (4–5/wk each);
  X founder thread day 3; Facebook from day 15.
- Time blocks in your actual calendar: **posting window (15 min, same time daily —
  consistency matters more than the exact hour; UK evening 17:00–19:00 is a sane
  default for hobby audiences)** + **one 30 min engagement sweep** (reply everything,
  pin the best Augury guess, log stats). Hard cap 45 min/day total.
- Creator-seeding Google Form made now (name / channel / a mini you'd scan / email) —
  you'll share it in week 3.

## Step 6 — Launch week SOP (days 1–7)

Daily checklist (photograph this):
1. Post today's clip(s) natively, per-platform caption from the factory files.
2. Set the pinned comment (T1: "first correct guess gets pinned"; T2: the heresy question).
3. Reply to **every** comment in the first hour where possible; again in the evening sweep.
4. Log 24 h stats for yesterday's row.
5. One genuine comment on 5 niche accounts' posts per platform (be a painter, not a brand).

- Day 3: X founder thread (honest wording, screenshots, link once at the end).
- Day 10–12: **Reddit maker post** on r/minipainting, only once the profiles look
  alive. Template: honest title (*"I built a free tool that scans your mini and gives
  you the paint recipe — measured, not guessed"*), body = what it does, what it CAN'T
  do (one real failure screenshot), the origin sentence, link at the bottom, reply to
  everything for 48 h.
- Day 21: kill/double-down review against the sheet — the weakest pillar loses its
  slot to the strongest.

## What you never do
Post a watermarked download to another platform · claim the spectrophotometer story or
any embellished origin · name the swatch source · use GW imagery in our renders ·
doctor a ΔE · skip the bank to "just post something".
