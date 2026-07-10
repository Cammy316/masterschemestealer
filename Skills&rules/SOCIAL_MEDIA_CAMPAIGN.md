# SchemeStealer — Social Launch Plan v2 (Ground Zero → 90 Days)

*Rewritten 2026-07-09. Situation: every account exists (TikTok, Instagram, Facebook,
X/Twitter, YouTube), **zero posts anywhere**. The product is fully live (scans,
substitutions, Daily Augury, Session Forge, SEO pages). This is the from-nothing plan
to start marketing heavily, built on current-platform research (sources in the
appendix) and on the automated video factory specced in `VIDEO_AUTOMATION_PIPELINE.md`.
Solo-operator scoped: the factory produces; Cam fronts, engages and posts.*

---

## 0. The one-paragraph strategy

SchemeStealer's unfair advantage is that its **data can be turned into video by code**:
every scan is a cinematic reveal, every puzzle day is a quiz short, every conversion row
is a "budget swap" clip. Nobody else in the niche can generate a month of content in an
afternoon. So: bank two weeks of factory-made videos BEFORE the first post, launch on
TikTok+Reels with our five strongest clips (the first 3–5 posts define the account's
"content DNA" to the 2026 algorithm), convert viewers into daily players of the Augury
(a reason to return that no competitor has), and let the in-app share-video feature
(Phase 3.5) turn users themselves into the distribution network.

## 1. Algorithm rules — baked into every single video

These are the 2026 rules of the game; treat them as acceptance criteria per clip:

| Rule | Number | Applies as |
|---|---|---|
| Primary hook lands | ≤ 2.5–3.0 s | First frame = the payoff tease (swatch macro, price tag, scan flash) — never a logo card |
| Secondary hook | ~14 s | A twist, reveal-step or "but here's the weird part" |
| Completion bar for viral distribution | **≥ 70%** | Keep Shorts/Reels cuts at 20–35 s; TikTok can run 60–180 s ONLY when the format earns it (scan reactions, story posts) |
| Rewatch weighting | ~2× a view | **Loop endings**: last frame flows into the first (the reveal answer is visible on second watch behind the hook) |
| First 3–5 posts | Set the account's content DNA | Launch week = the five best clips, all on-niche; no "welcome to my channel" |
| Consistency > spikes | 3–5 posts/week minimum | The factory makes 1/day trivial on TikTok for the first 30 days |
| Original audio rewarded | — | Cam voiceover where possible; TTS acceptable for factory clips; never bare trending-audio reposts |
| Comment bait | — | Deliberate gaps: "name it before the reveal", a *slightly* imperfect swap ("ΔE 2.4 — close enough?"), unanswered "which brand wins?" |
| Cross-posting | No foreign watermarks, ever | Factory exports clean per-platform masters; hooks/captions re-written per platform (+40–60% reach vs identical posts); always native uploads |

## 2. Positioning & voice (unchanged, restated)

*"Point your phone at any miniature and get the exact paint recipe — matched against a
physically measured database of 1,300+ paints across six brands."* Honesty is the
brand: every match shows its ΔE, including the bad ones. Mechanicus/grimdark voice,
British English. **Never name or credit the swatch reference source anywhere** — it is
only ever "our measured swatch database". No GW imagery/logos in our own renders;
user-submitted and self-painted minis only, credited.

## 3. Content pillars → production source

| # | Pillar | Made by | Cadence at cruise |
|---|---|---|---|
| P1 | **Guess the Paint** — daily quiz short; answer at the loop point; "beat me at schemestealer.com/daily" | Factory T1 (auto from `daily_puzzles.json`) | Daily on TikTok, 3×/wk elsewhere |
| P2 | **Budget Swap** — "Citadel charges £4.75 for this. This is ΔE 1.8 away for £2.60." | Factory T2 (auto from `conversions.json`) | 3×/wk |
| P3 | **Scan Reveals** — real minis (Cam's, community-submitted with credit, famous studio schemes) going through the Auspex; honest misses included | Engine A exports + Playwright screen-records | 2–3×/wk |
| P4 | **Recipe in 15 Seconds** — famous scheme as a base→shade→highlight→wash swatch cascade | Factory T3 | 2×/wk |
| P5 | **Build-in-public** — "I measured 1,300 paints so you don't have to"; solo-dev story, feature drops, honest metrics | Cam, manual (X-first, clipped for TikTok) | 2×/wk |

Formats proven in the painttok niche that these map onto: speed-paint satisfaction,
brand-specific recipes, grimdark scheme storytelling, beginner tips — P1–P4 hit all of
them without filming a single brushstroke.

## 4. Per-platform playbooks (ground zero)

### TikTok — primary channel
- **Cadence:** 1/day for the first 30 days (batched), then 5/wk.
- **Launch five (in order):** P1 Augury (strongest puzzle), P3 scan reveal of a
  showstopper mini, P2 budget swap on the most-searched Citadel paint, P1 again,
  P5 founder story ("I spent a year measuring 1,300 paints…").
- Native captions + 3–5 niche hashtags (#paintingwarhammer #miniaturepainting
  #warhammer40k + one format tag); keyword-rich on-screen text (TikTok search indexes it).
- **Engagement SOP week 1–2:** reply to EVERY comment within the hour where feasible
  (new-account engagement compounding); pin the best guess on P1 posts; follow/engage
  20 niche accounts daily from the account (genuine comments, no spam).
- Duet/stitch ON — invite painters to duet their own mini being scanned.

### Instagram (Reels + grid + Stories)
- Same masters, **rewritten captions/hooks**, IG hashtag sets per pillar; 4–5 Reels/wk.
- Grid rhythm: P3 beauty frame / P2 swap card / P1 puzzle — so the profile reads as a
  painter's tool, not a spam feed. Stories: daily Augury result reshares (players tag
  us), polls ("which swap wins?"), behind-the-scenes.
- Never upload a TikTok download (watermark suppression + IG's 2026 unoriginal-content
  penalty) — factory masters only.

### YouTube Shorts — the search channel
- 4–5/wk, **keyword-first titles** that mirror our SEO pages: "Citadel Mephiston Red
  Vallejo equivalent (ΔE-matched)", "What paint is this? Daily paint quiz #41".
  Shorts search is real discovery; each description links the matching /convert page.
- 20–35 s cuts here (completion bar); loop endings mandatory.

### X/Twitter — build-in-public HQ
- 2 threads/wk (P5): metrics, failures, colour-science nuggets ("why your gold reads
  brown on camera"); daily ritual: quote-post the Augury share grid each morning.
- Clips attached natively; link once per thread, not every tweet.

### Facebook — lowest effort, real reach in this hobby's demographics
- Crosspost Reels natively 3×/wk; join the 3 largest miniature-painting groups and the
  main Warhammer buy/sell/trade groups — value-first posts (a genuinely useful swap
  chart screenshot beats a link), one soft link per week max, per group rules.

### Reddit + Discord (unchanged from v1 — they are launch beats, not feeds)
- Week 2: "I built a thing" maker post — r/minipainting first (honest write-up: what it
  does, what it can't, the measuring story), then spaced cross-posts (r/Warhammer40k,
  r/ageofsigmar). Reply to everything for 48 h.
- Discords: participate as Cam-the-painter; run "guess the paint" nights with mod
  blessing; never drive-by link.

## 5. The 90-day calendar

**Days −14 → 0 (the bank):** factory templates T1+T2 built; ≥ 25 clips rendered and
QA'd against §1 acceptance criteria; profiles dressed (bio: "Scan your mini → get the
recipe · 1,300 measured paints · free", link → schemestealer.com; matching avatars/
banners); pinned-post drafts ready; Search Console verified + sitemap submitted.

**Days 1–14 (soft launch):** TikTok daily + IG 4/wk + Shorts 4/wk from the bank; the
launch-five in order; engagement SOP daily (30–45 min); X founder thread on day 3;
Reddit maker post day 10–12 (after the accounts look alive, not empty).

**Days 15–30 (first signal):** double down on the best-performing pillar (kill/scale
call at day 21); Facebook groups begin; first community scan-submission call-to-action
("send me your mini, I'll scan it live"); baseline metrics recorded.

**Days 31–60 (share loop):** Phase 3.5 ships → every P3 post ends with "made with the
in-app share button — post yours with #SchemeStealer"; creator seeding wave (10 painters
5k–100k, early access + founders promise, no strings); duet/stitch prompts weekly;
first "most-scanned paints this month" data post (link-earning asset).

**Days 61–90 (compound):** UGC reshares become a sixth content source; NMM/prestige
teasers if Phase 5 starts; assess for Phase 4 go/no-go against the KPI gate below.

## 6. Measurement (first-party + native, weekly 30-min ritual)

| KPI | Source | 90-day healthy signal |
|---|---|---|
| Completion rate per clip | platform natives | ≥ 60% avg, ≥ 70% on winners |
| Follower growth | natives | TikTok 1k+, combined 2.5k+ |
| Site sessions from social | referrers in first-party analytics | ≥ 25% of traffic |
| Daily Augury players + share rate | `daily_played` / `daily_shared` | 100+ DAU, share ≥ 8% |
| Scan conversion (visit → scan) | `page_view` → `scan_completed` | > 25% mobile |
| Reveal videos exported (post-3.5) | `reveal_video_exported` | The share loop's pulse |
| Ko-fi clicks | `kofi_clicked` | Baseline for Phase 4 sizing |

Kill/double-down: any pillar below the account average for 6 consecutive weeks is cut;
the best pillar gets its cadence doubled. **Phase 4 gate:** ≥ 100 daily Augury players
+ ≥ 500 combined followers + rising scan counts = start Clerk/Stripe.

## 7. Guardrails (hard)
- Zero swatch-source attribution, in any channel, ever — including casual replies.
- No GW-owned imagery/marks in our renders; "Warhammer" used descriptively only.
- Honesty beats reach: never doctor a match; the ΔE badge is the brand.
- British English everywhere.
- Burnout floor: if life happens, the minimum viable week is 3 factory clips on TikTok
  + the daily X Augury ritual. Everything else is additive.

## Appendix — research sources (July 2026)
- TikTok algorithm/completion/new-account meta: socialync.io (2026 what-works +
  new-account tips), sproutsocial.com/insights/tiktok-algorithm, mickyweis.com.
- Rewatch/loop weighting + viral tactics: darkroomagency.com "How TikTok's algorithm
  works in 2026 and 15 tactics", joyspace.ai looping guide.
- Hooks/timing/Shorts: vidiq.com viral-hooks-youtube-shorts, prapermedia.com,
  posteverywhere.ai how-to-go-viral-on-tiktok.
- Cross-posting/watermark penalties: shortsync.app, gpt.social repurposing guide,
  tubefilter.com (Instagram's 2026 unoriginal-content de-recommendation).
- Niche formats: tiktok.com/tag/paintingwarhammer + discover pages for
  warhammer-painting content.
- Automation stack: remotion (programmatic React video, Claude Code skill available),
  dev.to self-hosted faceless-shorts pipelines (FFmpeg + faster-whisper captions).
