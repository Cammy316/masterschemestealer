# SchemeStealer — Social Media & Growth Campaign

*Multi-channel plan targeting miniature painters, Warhammer hobbyists, and competition
(Golden Demon) painters. Written 2026-07-06, aligned with the revised roadmap: the
campaign assumes Phase 0 hardening is done (installable PWA, `/paints` SEO pages live)
and ramps alongside Phases 2–5. Scoped for a solo developer: every channel below states
its weekly time cost — cut from the bottom, never the top.*

---

## 1. Positioning & Voice

**One-liner:** *"Point your phone at any miniature and get the exact paint recipe — matched
against a physically measured database of 1,300+ paints across six brands."*

**What makes the claim defensible (say this constantly):** the recommendations come from
measured colour values and CIEDE2000 colour science, not name-matching or guesswork. Every
match shows its ΔE — we tell you *how close* the match is, including when it's only fair.
Honesty about imperfect matches is the brand.

**Voice:** the in-app Mechanicus/Warp theming carries into social copy — playful grimdark
("the Auspex has identified your pigments"), but always attached to a genuinely useful
result. British English throughout. Never name or credit any third-party swatch reference
source in any content, caption, or reply — the database is described only as "our measured
swatch database".

**Audience segments**
| Segment | Hook | Channel centre of gravity |
|---|---|---|
| New/returning painters ("what paints do I need?") | Scan a box-art photo → shopping list | TikTok, YouTube Shorts, Google search |
| Hobbyist regulars (batch painters, slap-choppers) | Budget swaps, inventory substitutions, speedpaint translator | Instagram, Reddit, Discord |
| Competition painters | NMM ramps, precise colour theory, ΔE rigour | Instagram, YouTube long-form, events |

---

## 2. Content Pillars (Instagram / TikTok / YouTube Shorts)

Rule of thumb: film once, cut for all three platforms. Target cadence at cruise:
**4 shorts + 1 carousel per week ≈ 4–5 h/week.**

### Pillar A — "Guess the Recipe" (flagship, feeds the app feature)
Show a gorgeous painted mini (with the painter's permission and credit), freeze on one
surface: *"What's the base coat?"* — 3-second countdown — reveal the app's scan with ΔE
badges. Viewers comment guesses before the reveal; engagement bait that is also a product
demo. When the `/daily` puzzle ships (Phase 3), every clip ends with "play today's round —
link in bio", converting a content format into a retention loop.

### Pillar B — "Scan my mini" (reaction/UGC format)
Followers submit photos; we scan them live and react to the results — including the misses
("the Auspex read this weathered bronze as leather — here's why: chipped metallics scatter
the specular signature"). Publishing honest failure analysis builds more trust than a
highlight reel, and the explanations write themselves from the colour science.

### Pillar C — Budget Swap / "Same colour, half the price"
Side-by-side: a Citadel paint vs its ΔE<2 equivalent from Army Painter/Vallejo, with the
price difference on screen. Pure value content, endlessly repeatable (the conversion DB is
the script), and it points straight at the `/convert` SEO pages. This is also the affiliate
revenue pillar once real retailer links exist (Phase 4).

### Pillar D — Kitbash & Scheme Showcases
Take a famous scheme (Ultramarines, Death Guard, Blood Angels grimdark) or a community
kitbash and break it into the four-step recipe card, then show the *same scheme in another
brand entirely*. When the Army Scheme Planner ships, this pillar demos mapping one scheme
across a whole army.

### Pillar E — Craft/Competition (NMM & colour theory)
Golden Demon-adjacent content: what makes NMM read as metal (lightness ramps, not colour),
warm vs cool highlights, why pure black is almost never the answer. Launches properly with
the NMM Ramp Forge (Phase 5): before/after ramps are the most shareable asset the product
can generate. Longer YouTube cuts live here (one 8–12 min video/month, only at cruise).

---

## 3. Organic SEO (the compounding channel)

The programmatic pages are the landing surface; social exists to feed them authority.

- **Keyword families:** "X paint equivalent" / "X vallejo equivalent" (per-paint,
  `/convert/...` — live), "X vs Y paint" comparisons, "what colour is [unit] painted",
  "[scheme] paint recipe", "contrast paint equivalent of X" (Phase 6 translator pages).
- **Finish the `/paints/[brand]/[slug]` pages first** (Phase 0.3) — thin stub pages that
  are indexed *hurt* ranking; complete them or `noindex` until complete. Add them to
  `sitemap.ts` at the same time.
- **On-page trust:** every page shows measured swatch, ΔE table, FAQ JSON-LD (already
  built on `/convert`). British English (Phase 0.6) — the target audience notices.
- **Link-earning assets:** the daily puzzle (`/daily`) and the NMM ramp results are the
  two page types hobby sites and Discords will link to organically. Publish a monthly
  "most-scanned paints" mini-report post once analytics data is durable (Phase 0.1) —
  original data earns links.

---

## 4. Community Channels (Reddit / Discord / Forums)

**Norms first: these communities ban drive-by promotion.** The account posts as Cam the
painter-developer, not as a brand. Value-first ratio ~10:1.

- **Reddit** (r/minipainting 1M+, r/Warhammer40k, r/ageofsigmar, r/PaintSlam): answer
  "what paint is this?" threads with a genuinely helpful reply *including the reasoning*;
  the tool link goes in a comment only when asked or clearly welcome. One "I built a
  thing" launch post per subreddit per major release (see §6) — these perform when they
  read as a maker's story with honest limitations, not a pitch.
- **Discords** (painting servers, GW store communities, slap-chop groups): be a resident
  expert; run "guess the recipe" nights with mod blessing. Later: a lightweight bot that
  answers `!match <paint>` with the conversion table is a Phase 6+ idea — only into
  servers that invite it.
- **Forums/blogs** (Dakka, Bolter & Chainsword): a signature link and participation in
  colour-theory threads; slow-burn but high-trust audience that overlaps with judges and
  event organisers.

**Time cost: ~2 h/week**, folded into normal hobby participation.

---

## 5. Creator Seeding & Partnerships

- **Target tier:** 5k–100k-subscriber painting channels (mid-tier converts better and
  actually replies). Shortlist ~20; offer early access + a founders' licence, ask for
  nothing beyond honest use — if the tool is good it appears in their workflow videos
  naturally.
- **The demo that sells itself:** creator films scanning *their own* display piece and the
  app returning a credible recipe. Provide a one-page "how to get a good scan" sheet
  (lighting, background removal behaviour) so first impressions aren't sabotaged by a bad
  photo.
- **Event angle:** Golden Demon / Armies on Parade seasons — printable QR recipe cards for
  display boards (Army Scheme Planner output, Phase 5+) put the product physically at
  events without a booth.
- **B2B seeds:** the same outreach list doubles for Phase 4 B2B — challenger paint brands'
  community managers see the creator content before the sales email arrives.

---

## 6. Launch Sequences (repeat per major release)

Each launch follows the same four-beat pattern over ~2 weeks:

1. **Quiet beta** — 2 painting Discords, feedback channel open, fix the top 3 complaints.
2. **Reddit maker post** — "I spent a year measuring 1,300 paints so you don't have to" —
   honest write-up: what it does, what it can't, what's next. Cross-post spaced across
   subreddits (per-sub rules), reply to every comment for 48 h.
3. **Social burst** — the launch feature cut into the relevant pillar for 10 consecutive
   days (e.g. NMM Forge → Pillar E daily ramps).
4. **Creator wave** — early-access creators are unembargoed the same week; their videos
   land while search interest from beats 2–3 is warm.

**Calendar (aligned to roadmap phases):**
| Release | Beat-2 headline |
|---|---|
| Phase 0/2: substitutions + rack analysis | "The app now tells you what you can paint with what you already own" |
| Phase 3: `/daily` puzzle | "Wordle for paint nerds" |
| Phase 4: tokens/founders | "Free stays free; power users can now fund the servers" (soft touch — never lead with monetisation) |
| Phase 5: NMM Forge | "A colour-science engine that teaches you NMM" |

---

## 7. Measurement (first-party only)

All measurable with the existing consent-gated analytics pipeline once persistence is
durable (Phase 0.1). No third-party pixels.

| Metric | Event source | Healthy signal (first 6 months) |
|---|---|---|
| Scan conversion (visit → scan) | `page_view` → `scan_completed` | >25% on mobile |
| D7 return rate | session_id recurrence | >10%, rising after Session Forge |
| SEO landings | referrer on `/convert` + `/paints` | Doubling quarter-on-quarter |
| Daily puzzle plays + share rate | new `daily_played`, `daily_shared` events | Share rate >8% |
| Ko-fi / (later) token conversion | `kofi_clicked`, `pro_upgrade_clicked` (event exists — needs call sites) | Establish baseline first |
| Affiliate clicks | `affiliate_link_clicked` (event exists — needs call sites + real URLs) | Phase 4 KPI |

**Weekly ritual (30 min):** one dashboard pass — which pillar drove scans, which SEO pages
gained impressions (Search Console), one experiment queued for next week. Kill any pillar
that underperforms for 6 consecutive weeks; double down on the best one.

---

## 8. Risks & Guardrails

- **IP care:** never use Games Workshop imagery/logos in ads or thumbnails; user-submitted
  and self-painted minis only, with credit. "Warhammer" is used descriptively, never in
  the product name.
- **Attribution rule (hard):** the measured swatch database is never attributed to any
  third-party source, in any channel, ever — including casual replies.
- **Honesty beats reach:** never post a doctored "perfect match". The ΔE badge is the
  brand; a faked demo that a 100k-sub creator debunks would be terminal.
- **Solo-dev burnout:** the cadence above is the *ceiling*. The minimum viable presence is
  Pillar C (budget swaps — cheapest to produce, best search overlap) plus the Reddit
  launch beats. Everything else is additive.
