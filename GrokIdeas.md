# SchemeStealer 12–18 Month Product Roadmap

**Q3 2026 – Q4 2027**  
**Solo-dev | Next.js 15 + Tailwind CSS + Zustand + Python FastAPI**  
**Grimdark Aesthetic:** `bg-gray-950` with high-contrast neon green and purple accents  

**Core Product:** Photo-to-recipe generation using computer vision (Laplacian variance, Minkowski p=6 white balance) and CIEDE2000 math against a custom 1,200 physically photographed swatch ground-truth database. Generates deterministic 4-step painting recipes (Base → Layer/Highlight → Shade → Wash). Supported brands: Citadel, Vallejo, Army Painter, AK 3rd Gen, Pro Acryl, Two Thin Coats.

**Current Monetization:** Freemium (free exact Base paint match; Pro £3.99/mo unlocks full 4-step recipes, brand-swapping, and inventory tracking) + affiliate injection to hobby stores.

---

## Executive Vision

As a solo developer you already own the most accurate, deterministic color-to-recipe engine in the miniature painting niche. The next 12–18 months focus on three strategic pillars:

1. **Feature Expansion** — Turn the app from a “one-time inspiration lookup” into a **daily painting-desk operating system** that users keep open while physically painting.
2. **Monetization Evolution** — Move beyond subscription fatigue with usage-aligned token economics, one-time lifetime options, and high-margin B2B leverage of your unique ground-truth database.
3. **Community & UGC** — Build a self-scaling “Librarium” of public recipes that drives organic SEO traffic and lets users co-create the content moat.

All recommendations below are explicitly scoped for solo development: reuse and extend the existing `/analyze` FastAPI pipeline, Zustand state management, Tailwind components, and PWA capabilities. No new heavy ML models or dedicated GPU infrastructure required.

---

## 1. Feature Expansion – The Utility Loop (Daily Desk Companion)

Goal: Move users from occasional inspiration lookups to keeping the app open at the painting desk every session.

### The Armoury – Smart Paint Inventory + Live Recipe Matcher
**Description & Niche Fit:**  
Users photograph their paint rack or scan pot barcodes/labels (using browser BarcodeDetector API or lightweight zxing fallback). The app builds a personal owned-paint set. Every generated recipe now surfaces “You own 3/4 – missing Pro Acryl Titanium White (closest owned: Army Painter Matte White, ΔE 2.8)”. One-tap substitute suggestions using the existing CIEDE2000 engine.

**Why it works in the miniature niche:** Painters hate buying duplicate paints. This removes the #1 friction point right before they start painting.

**Effort vs Impact:**  
**Effort: Medium** (3–4 weeks solo)  
**Impact: Very High** (daily decision-friction killer; strongest Pro conversion lever after the core recipe itself)

**Tech Implementation Notes:**  
- Extend existing paint database with a user-owned junction table.  
- New Zustand `useInventory` store.  
- Barcode endpoint re-uses the current CV pipeline + simple OCR fallback.  
- Maintain grimdark aesthetic with neon-green “owned” badges and purple “missing/substitute” highlights.

**Target Timeline:** Q3 2026

---

### Session Forge – In-Painting Companion Mode
**Description & Niche Fit:**  
“Start Painting” button opens a persistent session UI:
- Recipe steps become a live checklist with per-layer timers (smart defaults: 12–25 min based on layer type).
- Progress photo capture at each stage.
- Wet-palette “check-in” button.
- Streak counter + “painted today” PWA notification.

**Why it works:** Turns SchemeStealer into a habit-forming desk tool instead of a lookup app. Army and batch painters especially love structured session tracking.

**Effort vs Impact:**  
**Effort: Low–Medium** (2–3 weeks)  
**Impact: Very High** (highest retention lever; dramatically increases daily active desk usage)

**Tech Implementation Notes:**  
- New Zustand session slice with local-first storage (IndexedDB) and optional backend sync.  
- Timers run in Web Workers to stay accurate even when tab is backgrounded.  
- Re-use existing recipe JSON structure.  
- Fully installable as PWA so it feels like a native desk companion.

**Target Timeline:** Q3 2026

---

### Wet Palette Oracle
**Description & Niche Fit:**  
Mid-session photo of the wet palette → k-means clustering in CIELAB space (extension of current dominant-color logic) + matching against both the official ground-truth database **and** the user’s own previously saved mixes. Returns actionable guidance such as:  
“This puddle is 87% match to your current Layer step – add 1 part Pro Acryl Ivory for highlight.”

**Why it works:** This is the only app in the space that understands *wet mixing live* at the desk. It directly supports the physical act of painting rather than just planning.

**Effort vs Impact:**  
**Effort: Medium–High** (5–6 weeks)  
**Impact: High** (unique “at the desk” magic; powerful differentiator and Pro upsell)

**Tech Implementation Notes:**  
- New `/analyze-palette` FastAPI endpoint.  
- Re-use existing Laplacian variance + white-balance front-end.  
- Add simple LAB-space k-means (pure numpy or scikit-learn – already compatible with current stack).  
- Cache frequent palette analyses.

**Target Timeline:** Q4 2026

---

### ForgeMix – Custom Ratio Calculator
**Description & Niche Fit:**  
Select 2–3 paints from personal inventory or the global database → pick a target color (eyedropper or photo) → receive deterministic mix ratios + predicted ΔE match to target. Output as a clean, printable recipe card.

**Why it works:** Power users and kitbashers constantly invent custom mixes. This extends the value of your deterministic engine far beyond pre-matched commercial paints.

**Effort vs Impact:**  
**Effort: Medium** (3–4 weeks)  
**Impact: High** (strong power-user retention and Pro conversion feature)

**Tech Implementation Notes:**  
- New Python mixing module using LAB linear interpolation (with optional simple Kubelka-Munk approximation for opacity).  
- Cache common mixes for speed.  
- Output re-uses the same grimdark recipe card component.

**Target Timeline:** Q4 2026

---

### Batch Auspex + Army Project Dashboard
**Description & Niche Fit:**  
Upload multiple photos (or one group shot with manual crop fallback) → auto-assign recipes to each miniature → add to a named project (“5th Company Intercessors – 87% complete”). Includes paint-usage estimator across the whole project.

**Why it works:** Army painters (core Warhammer 40k / Age of Sigmar audience) are the highest-LTV segment. Batch processing removes the biggest time sink when painting 10–30 models at once.

**Effort vs Impact:**  
**Effort: High** (6–8 weeks; start with manual multi-upload, defer advanced segmentation)  
**Impact: High** (transforms app for the highest-value user segment)

**Tech Implementation Notes:**  
- Extend `/analyze` endpoint to accept a list of images.  
- New project model + Zustand project store.  
- Keep v1 simple (user crops or uploads individually) to stay within solo-dev scope.

**Target Timeline:** Q1 2027

---

## 2. Monetization Evolution – Usage-Aligned + Ecosystem Revenue

Current freemium model works for launch but will hit subscription fatigue. Shift to **pay-for-compute + leverage of your unique 1,200-swatch ground-truth asset**.

### Auspex Token System (Hybrid Freemium + Usage)
**Mechanics:**  
- Base color match = **always free** (low compute, strong acquisition hook).  
- Full 4-step recipe + brand swap + inventory matching = **1 Auspex Charge**.  
- Free tier: 4 charges per month.  
- One-time packs: 20 charges for £1.99.  
- Pro subscription (£4.99/mo) = unlimited charges + priority queue + early feature access.

**Why it works:** Aligns cost directly with heavy usage. Casual users stay longer on free tier; serious painters happily pay for convenience.

**Effort vs Impact:**  
**Effort: Low** (1–2 weeks – Stripe integration + simple credit ledger)  
**Impact: High** (better LTV, lower churn for light users, higher perceived fairness)

**Tech Implementation Notes:**  
- Add `auspex_credits` column and lightweight ledger table in backend.  
- Token UI uses existing neon-green accent colors.  
- Soft enforcement on the frontend with clear “you have X charges left” messaging.

**Target Timeline:** Q3 2026

---

### Grimdark Founder Lifetime License
**Mechanics:**  
- $59 one-time payment (or two-tier: $39 “Core Eternal” + $59 “Full Eternal”).  
- Includes: unlimited base analyses + 300 lifetime full recipes (fair-use cap) + “Founder” badge + early access to new CV features.  
- Positioned as “pay once, paint forever” for dedicated hobbyists.

**Why it works:** Gives solo developers predictable upfront cash while still protecting long-term infra costs via the fair-use cap.

**Effort vs Impact:**  
**Effort: Low–Medium** (Stripe one-time flow + user flag + soft cap enforcement)  
**Impact: Medium–High** (improves runway predictability; reduces monthly billing support burden)

**Tech Implementation Notes:**  
- Simple one-time payment flow via Stripe.  
- Database flag for lifetime status with usage counters.  
- Cap enforcement can be soft (warning + gentle upsell) initially.

**Target Timeline:** Q4 2026

---

### PaintForge B2B API & Database Licensing
**Mechanics:**  
Authenticated API endpoint: `POST` RGB or LAB values → returns closest matches + full 4-step recipe using the partner’s brand only. White-label option available.  
Pricing models: $299–799/month per manufacturer **or** revenue-share on referred paint sales.

**Why it works:** Your CIEDE2000 ground-truth database is a genuine industry moat. Paint manufacturers (Vallejo, Pro Acryl, AK Interactive, Two Thin Coats, etc.) already have websites and apps that would benefit from accurate cross-brand matching and recipe generation.

**Effort vs Impact:**  
**Effort: High** (API routes, JWT auth, Swagger docs, rate limiting, separate billing)  
**Impact: Very High** (recurring high-margin revenue + external validation of your data accuracy)

**Tech Implementation Notes:**  
- New versioned API routes under `/api/v1/paintforge`.  
- Separate auth layer and usage analytics.  
- Start with 1–2 pilot partners in Q1–Q2 2027.

**Target Timeline:** Q1–Q2 2027

---

### Deepened Affiliate + Sponsored “Official Schemes”
**Mechanics:**  
Recipe pages automatically surface “Buy missing paints” buttons with affiliate links (Element Games, Wayland Games, Amazon, etc.). Add paid/sponsored “Official Pro Acryl Scheme” cards for popular factions.

**Why it works:** Passive revenue stream that requires almost no new development once the core recipe engine exists.

**Effort vs Impact:**  
**Effort: Low** (mostly configuration + conversion tracking)  
**Impact: Medium–High** (steady passive income + new sponsorship revenue line)

**Target Timeline:** Ongoing from Q3 2026

---

## 3. Community & UGC – The Self-Scaling Librarium

Solo developers scale when users create the long-tail content. Public recipes will rank for highly specific search queries that no forum thread or YouTube video can answer with deterministic precision.

### The Librarium – Public Recipe Codex
**Description:**  
Every generated recipe includes an opt-in “Publish to Librarium” toggle. The system auto-generates clean, SEO-friendly URLs and meta tags such as:  
“4-step grimdark recipe: Citadel Base → Vallejo Layer for Ultramarines Intercessor using Pro Acryl substitutes”.

Public gallery supports filters: faction/system, brand combination, difficulty, model scale, painter level.

**Why it works:** Creates an ever-growing library of long-tail content that drives organic acquisition at near-zero marginal cost.

**Effort vs Impact:**  
**Effort: Medium** (3–4 weeks)  
**Impact: Very High** (organic SEO traffic + user acquisition flywheel)

**Tech Implementation Notes:**  
- New public `recipes` table (or database view).  
- Simple full-text or trigram search.  
- Shareable URLs with Open Graph images (re-use existing recipe card renderer).  
- Maintain grimdark card design with purple/neon accents.

**Target Timeline:** Q4 2026

---

### Recipe Remixes & Substitutions
**Description:**  
On any public recipe, a “Remix for my paints” button lets users input their personal inventory. The app automatically suggests the closest owned substitutes with new ΔE scores. Users can publish the remixed version as a fork (with attribution to the original).

**Why it works:** Dramatically increases engagement and multiplies the amount of useful public content without you creating it.

**Effort vs Impact:**  
**Effort: Medium** (re-use existing matching engine)  
**Impact: High** (engagement loop + content variants)

**Tech Implementation Notes:**  
- Fork creates a new recipe row with `parent_recipe_id`.  
- Re-use the same CIEDE2000 substitution logic built for The Armoury.

**Target Timeline:** Q1 2027

---

### Swatch Exchange (Community DB Contributions)
**Description:**  
Users can photograph a physical painted swatch, declare the exact paint(s) and lighting conditions, and submit it. A moderation queue (or automated ΔE consistency check) decides whether it is added to the ground-truth database. Contributors receive a badge + 5 free Auspex charges.

**Why it works:** Expands your 1,200-swatch moat without you having to paint every new color release yourself. Builds genuine community ownership.

**Effort vs Impact:**  
**Effort: High** (moderation UI + validation pipeline)  
**Impact: High (long-term)** (stronger data moat + more supported brands)

**Tech Implementation Notes:**  
- New `user_swatches` table + simple admin moderation view.  
- Python validation script re-uses the existing CIEDE2000 comparison logic.  
- Versioned database so you can roll back bad contributions.

**Target Timeline:** Q2 2027

---

### Kitbash & Finished Model Showcase (Lightweight Feed)
**Description:**  
Lightweight tab where users post a finished model photo + linked recipe(s) used + short note. Includes likes and “Used this recipe” attribution. No comments (to minimize moderation overhead).

**Why it works:** Provides social proof and inspiration while keeping moderation load low.

**Effort vs Impact:**  
**Effort: Low–Medium** (2–3 weeks for basic feed)  
**Impact: Medium** (retention via social proof)

**Target Timeline:** Q2 2027 (after Librarium proves value)

---

## Recommended 18-Month Rollout Cadence (Solo-Dev Realistic)

| Quarter       | Focus Areas                                      | Key Deliverables                              |
|---------------|--------------------------------------------------|-----------------------------------------------|
| **Q3 2026**   | Daily hooks + token monetization                 | The Armoury, Session Forge, Auspex Token system |
| **Q4 2026**   | Wet-palette utility + public content launch      | Wet Palette Oracle, Public Librarium          |
| **Q1 2027**   | Power-user tools + lifetime pricing              | ForgeMix, Grimdark Founder License, Recipe Remixes |
| **Q2–Q4 2027**| Scale via community + B2B                        | Batch dashboard, Swatch Exchange, B2B API pilots, Sponsored schemes |

---

## Success Metrics to Track

- **Desk-time DAU** — Sessions occurring between 6pm–11pm local time (true painting-desk usage)
- **Inventory matching adoption rate** — % of recipes that flow through The Armoury
- **Public recipe indexation & organic traffic** — Google Search Console impressions for long-tail recipe queries
- **Auspex charge consumption vs subscription conversion** — Balance between one-time packs and recurring revenue
- **B2B pipeline health** — Number of manufacturer conversations and pilot sign-ups (target: 1–2 pilots live by end of 2027)

---

**Document generated:** 30 June 2026  
**Prepared for:** Solo developer of SchemeStealer  
**Next step recommendation:** Prioritize The Armoury + Session Forge + Auspex Token system in Q3 2026. These three changes will deliver the fastest lift in daily desk usage and paid conversion while staying fully within solo-dev scope.

*This roadmap respects the technical constraints of a Next.js/FastAPI architecture and the grimdark aesthetic while focusing exclusively on high-leverage features specific to the miniature painting hobby.*