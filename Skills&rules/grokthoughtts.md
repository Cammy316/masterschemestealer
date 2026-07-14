Analysis of the Social Media Campaign, Video Automation Pipeline, and Mega Roadmap
These three documents form a coherent, ambitious but solo-dev-scoped plan. The core philosophy is excellent: the 1,312-paint measured LAB database is the true moat, and the video systems (Engine A + B) turn that data into scalable, algorithm-friendly content without needing to film brushstrokes. This creates a self-reinforcing loop — scans → shareable videos (users distribute) → social proof → more scans → better data via feedback.
Strengths Across All Three

Data leverage is best-in-class: Every pillar (Daily Augury puzzles, Budget Swaps, recipe cascades, scan reveals) is derivable from existing data + recipe engine. No other miniature tool can do this at volume.
Phased realism: Roadmap correctly delays heavy monetisation (Phase 4) until social traction exists. Social campaign's "bank 25 clips first" + native-upload discipline is smart (avoids watermark/algorithm penalties).
Algorithm-native design: Hook ≤3 s, loop endings, comment bait, per-platform rewritten copy, and 70%+ completion focus are spot-on for 2026 TikTok/Reels/Shorts.
Synergy: Engine B feeds the launch bank; Engine A (Phase 3.5) closes the UGC loop ("post yours with #SchemeStealer"). Daily Augury becomes both retention habit and content source.
Guardrails are strong: British English, no GW IP, honesty on ΔE, no auto-posting (manual via checklist), burnout minimums.

Risks and Gaps

Sequencing tension (biggest immediate issue): Roadmap says "Growth Sprint starts NOW, runs alongside" Phase 3.5. Video pipeline build order puts T2/T1 first (good), but social needs a full 25-clip bank before day 1. Parallelising factory + Engine A + daily engagement in week 1–2 is high burnout risk for solo dev. The "minimum viable week" (3 factory clips + X ritual) is defined but not stress-tested against real life.
Content authenticity vs scale: Heavy factory reliance is the unfair advantage, but the niche values hand-painted authenticity. T4 (real scans + Cam VO) is the honesty format — it should be weighted higher in the mix, not just "semi-automatic". Over-automated content risks feeling low-effort or spammy; algorithms reward original audio and genuine reaction.
Technical/quality risks in video systems:
Engine A (client-side canvas + MediaRecorder): Mobile performance, battery drain, iOS Safari quirks with captureStream, file-size bloat, and deterministic timeline vs real dropped frames. No mention of audio layer (even subtle scan hums would help immersion).
Engine B (Remotion): Excellent choice, but iteration speed depends on preview tooling. TTS quality (edge-tts) may undercut "premium cogitator" voice on winners. Loop-frame similarity check is manual QA only.
No automated QA beyond checklist.md (e.g., hook timing verification, thumbnail generation, legibility at phone size).

Monetisation bridge is thin: Ko-fi is the only current path, yet social KPIs treat it as "baseline for Phase 4 sizing". No plan to make supporting the measured database feel rewarding before tokens/Founders licence (e.g., early founder badge, public thank-you in Augury credits, or priority in community features).
Feedback/data flywheel is under-leveraged: Social comments ("wrong family", "ΔE feels off") and exported video reactions are gold for improving the engine/DB, but no closed loop back into feedback capture or manual review queue. UGC (Phase 6) depends on Phase 4 auth — a long wait.
Platform/SEO synergy missed: YouTube Shorts titles already mirror /convert pages (good), but no plan for a lightweight /videos or "featured reveals" page that could earn links. Video descriptions could drive more structured data or direct scan CTAs.
Burnout and ops: Daily TikTok + engagement SOP (reply within hour) for first 14 days + factory QA is heavy. Creator seeding wave (days 31–60) assumes time to vet 10 painters.

Improvement Ideas (Prioritised by Impact × Feasibility for Solo Dev)
High-impact, low-medium effort (do these first)

Reprioritise build order and create a "Content Bank Sprint" (1–2 weeks dedicated)
Pause or de-scope non-critical parts of Phase 3.5 temporarily. Build T2 (Budget Swap — simplest data) + T1 (Daily Augury) first, render + QA the full 25-clip bank before any social posts. Use the exact checklist.md + §1 acceptance criteria.
Why it wins: Social launch fails without fuel. This de-risks the entire 90-day plan and gives you breathing room. Effort: Reprioritisation only; aligns with video pipeline's own suggested order.
Add lightweight automated QA to the factory pipeline
After each render: script to (a) extract first 3 s + last 3 s frames, (b) basic hook timing check via frame diff or metadata, (c) generate platform thumbnails + suggested title/caption variants, (d) flag if loop-frame similarity < threshold (simple pixel or perceptual hash).
Why: Reduces 2 min/clip manual QA to 30 s spot-check. Compounds daily output. Use existing FFmpeg + a small Node/Python helper. Low risk.
Strengthen the authenticity + feedback loop
Weight T4 (real scan + Cam VO) higher in the first 30 days (e.g., 2–3 per week).
After every P1/P3 post, auto-generate a pinned "community guesses" comment template that links back to in-app feedback flow.
Simple backend job (or manual weekly): surface high-engagement social comments that mention "wrong", "family", or specific paints → queue for engine review.
Why: Turns social into active data moat improvement. Builds trust ("we listen").

Make Engine A more virality-ready (small additions to Phase 3.5)
Optional subtle audio layer (cogitator boot + scan sweep tones) — keep toggleable and low-volume.
On export, offer 2–3 caption style presets (short hook, puzzle-style, recipe-focused) that auto-burn lightweight on-screen text.
After successful export, show a one-tap "post to TikTok/Reels inspiration" modal with pre-filled hashtag set + link to schemestealer.com/daily.
Why: Increases share rate and direct traffic. Small UX lift, high distribution impact.


Medium-impact ideas (queue for after bank is live)

Monetisation bridge pre-Phase 4
Add a subtle but persistent "Support the measured database" Ko-fi link in the recipe card footer, after successful scan, and in Daily Augury win screen (with founder badge preview). Track kofi_clicked more prominently. Consider a one-time "early supporter" digital badge visible on profile/stats once auth lands.
Why: Starts warming the audience for tokens/Founders without paywall friction. Converts goodwill into early cash signal.
YouTube + SEO amplification
Turn the best-performing 5–10 shorts into occasional 3–5 min compilations ("Top 7 Budget Swaps This Month — with ΔE proof") on the main YouTube channel. Descriptions link to matching /convert or /daily pages. Add a simple "Featured Reveals" section on the site (curated from high-engagement user exports, credited).
Why: YouTube search is under-used; compilations earn watch time and backlinks.
Burnout/ops hardening
Formalise a "content calendar" Notion/Google Sheet template with batch days, engagement time blocks (30–45 min max), and "skip day" rules. Add a simple dashboard (or even a text file) tracking weekly pillar mix vs performance. For creator seeding, create a lightweight application form (Google Form) instead of manual DMs.

Lower priority / longer-term

NMM Ramp Forge timing: Align launch teaser with real Golden Demon season or community challenges for maximum prestige flywheel.
Wet Palette Oracle or advanced UGC: These are fine where they are; don't accelerate.
B2B API: Once you have real usage data from social, the pitch to challenger brands becomes much stronger.

Top 3 Actionable Recommendations Right Now

This week: Lock the Content Bank Sprint. Build/render T2 + T1 until you have 25+ QA'd clips. Only then start the social launch sequence. This single decision de-risks the entire 90-day plan.
Parallel (low effort): Add the automated QA script + subtle audio hook to Engine A spec. Both pay dividends immediately.
Mindset shift: Treat the first 14 days of social as a product experiment, not just marketing. The real goal is learning which pillar + format combination drives the highest scan conversion and Daily Augury plays — then double down ruthlessly.

Overall, this is one of the strongest solo-dev growth plans I've seen in the niche space. The data-to-video leverage is genuinely differentiated. The main threats are execution bandwidth and content quality consistency under volume. Fix the sequencing and add light automation around QA/feedback, and the flywheel should spin cleanly.
You're in a strong position — the product is ahead of the audience, which is exactly where you want to be before turning on distribution. Execute the bank first, then launch with confidence. If you want me to sketch a sample factory CLI extension, a Notion content calendar template, or dive deeper into any specific template (T1/T2), just say the word.