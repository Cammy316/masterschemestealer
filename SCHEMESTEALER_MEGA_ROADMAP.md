# SchemeStealer: The Mega Roadmap (12-18 Months)

*A synthesized master-plan combining the best strategic insights from Grok, Claude, and Gemini, explicitly scoped for a solo developer.*

---

## The Core Philosophy
The biggest untapped asset SchemeStealer has is the **1,200-swatch CIEDE2000 ground-truth database**. The next 12-18 months are about leveraging that data to keep the app open at the painting desk (Retention), monetizing casual users without subscription fatigue (Revenue), and letting users build the content moat for us (Growth).

---

## 1. The Utility Loop (Daily Desk Companion)
*Goal: Evolve from an occasional "lookup tool" to a persistent app that stays open during 3-hour painting sessions.*

### 1.1 The Armoury (Inventory & Smart Substitutions) 
* **The Concept:** Users log the paints they own (via manual entry or a rapid client-side barcode scanner). 
* **The Magic:** Recipes now dynamically re-rank to prefer paints the user already owns. It tells you: *"You're missing Mephiston Red, but you own Vallejo Bloody Red (ΔE 2.1) - use that instead."*
* **Effort/Impact:** Medium Effort / Massive Impact. This is the keystone feature that makes the app a daily necessity.

### 1.2 ForgeMix / The Alchemy Lab (Custom Mixing)
* **The Concept:** Run the CIEDE2000 engine in reverse. A user selects a target color and 2-3 paints they own. The app calculates the exact mixing ratio (e.g., 2:1) to achieve the target color using LAB interpolation.
* **Effort/Impact:** Medium-High Effort / Very High Impact. Power-user feature that is highly defensible because it requires our ground-truth data.

### 1.3 Session Forge (Interactive Recipe Runner)
* **The Concept:** A "Start Painting" mode that turns a recipe into a checklist with built-in dry-time timers (e.g., *Wash applied -> 20 min timer starts*). Sends PWA notifications when the model is ready for the next layer.
* **Effort/Impact:** Low Effort / High Impact. Pure frontend state that drastically increases session length.

### 1.4 Wet Palette Oracle (Long-term)
* **The Concept:** Snap a photo of a wet palette mid-session. The app uses K-means clustering to identify the puddles and tells you how to tweak them to reach your target highlight color.

---

## 2. Monetization Evolution
*Goal: Capture revenue from casual painters who hate subscriptions, while leveraging B2B opportunities.*

### 2.1 Auspex Token System (Pay-As-You-Go)
* **The Concept:** Subscriptions alienate painters who only hobby once a month. Keep the base color match free, but sell "Auspex Charges" (e.g., 20 scans for £1.99) for full 4-step recipes. Pro users (£3.99/mo) get unlimited scans. 
* **Effort/Impact:** Low Effort / High Impact. Captures the massive long-tail of casual users.

### 2.2 Lifetime "Tech-Priest" License
* **The Concept:** A £49.99 one-time payment for lifetime access to current Pro features. Capped to the first 500 "Founders" to inject immediate cash flow for runway without ruining long-term server costs.
* **Effort/Impact:** Low Effort / High Impact (Short term cash).

### 2.3 B2B Licensing & Smart Affiliates
* **The Concept:** 
  * **Affiliates:** Once *The Armoury* knows what paints a user is missing for a recipe, offer a one-tap "Buy missing paints kit" via Element Games/Wayland.
  * **B2B API:** License our conversion widget to challenger brands (Pro Acryl, AK) so they can embed it on their Shopify stores to prove their paints match Citadel.

---

## 3. Community & UGC (The Self-Scaling Librarium)
*Goal: Turn users into a marketing engine. (Note: We have already successfully implemented the baseline Programmatic SEO for direct conversions!)*

### 3.1 The Public Librarium (User-Generated Recipes)
* **The Concept:** When a user nails a paint job, they can hit "Publish to Librarium". This generates a public, SEO-indexed page (`/recipes/blood-angels-grimdark`). 
* **Effort/Impact:** Medium Effort / Massive Impact. Next.js creates thousands of organic landing pages from user content.

### 3.2 Recipe Kitbashing (Remixing)
* **The Concept:** Users can browse public recipes and hit "Remix for my inventory". The app automatically substitutes the original paints for the closest matches the user actually owns, creating a new "forked" recipe.

### 3.3 Swatch Exchange
* **The Concept:** Users photograph their own painted test swatches to feed our machine learning pipeline. Moderated contributions earn the user free Auspex tokens, crowd-sourcing the expansion of our database.

---

## Proposed Rollout Sequence

| Phase | Focus | Key Deliverables |
| :--- | :--- | :--- |
| **Phase 1 (Done)** | SEO Foundation | Programmatic Conversion Pages (Just shipped!) |
| **Phase 2 (Next)** | The Core Loop | The Armoury (Inventory) & Barcode Scanner |
| **Phase 3** | Monetization | Auspex Token System & Smart Affiliate Kits |
| **Phase 4** | Desk Utility | Session Forge (Timers) & ForgeMix (Custom Ratios) |
| **Phase 5** | UGC Scale | The Public Librarium & Recipe Kitbashing |
| **Phase 6** | Advanced | Wet Palette Oracle & B2B API Pilots |
