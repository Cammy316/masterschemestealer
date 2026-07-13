# SchemeStealer: Launch Strategy Synthesis & Document Update Directives

*This document synthesizes strategic analyses from both Grok and Gemini regarding the social media launch, video automation, and product roadmap. It serves as an authoritative directive to update the `SCHEMESTEALER_MEGA_ROADMAP.md`, `SOCIAL_MEDIA_CAMPAIGN.md`, and `VIDEO_AUTOMATION_PIPELINE.md` accordingly.*

---

## 1. Reprioritization: The "Content Bank Sprint"
**Directive:** Update the Roadmap and Video Pipeline sequences. We must avoid solo-dev burnout and ensure consistency before day one of the social launch.

*   **Pause Phase 3.5 Temporarily:** Do not build the in-app Engine A video export first. 
*   **Prioritize Engine B (`video-factory`):** Build the Remotion templates for **T2 (Budget Swap)** and **T1 (Daily Augury)** immediately.
*   **The 25-Clip Bank:** Render and QA a full 14-day runway of content (≥25 clips) *before* publishing the first social media post. 
*   **Sequencing Rule:** Launch channels only when the bank is full. This gives breathing room to finish Phase 3.5 without daily posting stress.

## 2. Technical Enhancements: Engine A & B
**Directive:** Update `VIDEO_AUTOMATION_PIPELINE.md` with the following requirements.

### Engine A (In-App Export)
*   **Audio Layer:** Silent videos are penalized on social. Add a subtle, low-volume audio layer (e.g., cogitator boot hum, scanning sweep beep).
*   **Virality UX:** Add a post-export modal offering 1-tap "Share to TikTok/Reels" with pre-filled hashtag sets and a link to `schemestealer.com/daily`. Provide 2-3 caption style presets that burn lightweight text onto the video.

### Engine B (Remotion Factory)
*   **Automated QA Script:** Add a post-render script to the pipeline that extracts the first 3s and last 3s frames, verifies hook timing, checks loop-frame similarity against a threshold, and auto-generates platform thumbnails and title variants. This reduces manual QA from 2 minutes to 30 seconds per clip.

## 3. The Social & Marketing Narrative
**Directive:** Update `SOCIAL_MEDIA_CAMPAIGN.md` to weight authenticity and community interaction higher.

*   **The "Honesty" Format & Roast My Scan (T4):** Weight T4 (real scan + Cam VO) much higher in the first 30 days. Specifically, invite the community to submit scans where the app "failed." Do a voiceover breakdown explaining the color science of *why* it failed (e.g., harsh lighting). Radical transparency builds absolute trust.
*   **The Underdog Hook:** Heavily lean into the solo-dev "sweat equity" story across X/Twitter and Reddit: *"I spent a year manually measuring 1,312 paints with a spectrophotometer so we never have to guess color matches again."*
*   **Comment Baiting Strategy:** Deliberately leave unresolved gaps in factory videos. End T2 budget swaps with: *"ΔE 2.8: Close enough or absolute heresy? Tell me below."* Pin the best guesses on T1 puzzle videos.
*   **YouTube SEO Amplification:** Turn the best-performing 5-10 Shorts into occasional 3-5 minute YouTube compilations (e.g., "Top 7 Budget Swaps This Month"). Add a "Featured Reveals" section to the website linking to high-engagement UGC.

## 4. Monetization & Community Bridges
**Directive:** Update `SCHEMESTEALER_MEGA_ROADMAP.md` to include pre-Phase 4 revenue and community hooks.

*   **The "Fuel the Auspex" Monetization Bridge:** Don't wait for Phase 4 (Stripe) to capture goodwill. Integrate a branded Ko-fi button ("Fuel the Auspex" / "Buy a pot of paint for the database") prominently on the Daily Augury win screen and recipe cards. Offer a preview of an "Early Founder" digital badge.
*   **Discord Webhooks:** Build a simple JSON webhook for community Discord servers to automatically post "Today's Daily Augury" puzzle at 8 AM. This creates zero-effort, recurring daily traffic from high-density painter hubs.
*   **Feedback Triage Dashboard:** Build a lightweight script or admin view to triage the incoming wave of Supabase feedback. Automatically flag feedback rated <3 stars or mentioning "wrong family" for manual anchor review.
*   **Ops Hardening:** Formalize a Notion/Google Sheet content calendar to enforce batch days and engagement time blocks (max 45 mins/day) to prevent burnout. Use a Google Form for creator seeding rather than manual DMs.
