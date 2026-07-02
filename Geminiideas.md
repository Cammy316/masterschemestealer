# SchemeStealer Product Roadmap: 12-18 Month Strategy

**Objective:** Map out the next 12 to 18 months of development for SchemeStealer, focusing on evolving the app from an on-demand utility to a daily companion, combatting subscription fatigue, and driving organic growth via user-generated content.

---

## 1. Feature Expansion (The Utility Loop)
*Goal: Evolve from an "on-demand scanner" to an "always-open companion app" at the painting desk.*

### 1.1 The "Alchemy Lab" (Subtractive Color Mixing)
* **The Concept:** Users frequently lack a specific paint. Using your physical $L^*a^*b^*$ ground-truth data, build a mixing simulator. A user selects two paints they own (e.g., *Mephiston Red* and *Corvus Black*), inputs a ratio (2:1), and the FastAPI engine calculates the resulting color using an approximation of Kubelka-Munk optical theory, outputting the closest single-pot match.
* **The "Why":** It solves an immediate mid-painting panic, increasing the app's utility during active hobby sessions.

### 1.2 The "Wet Palette" State Tracker
* **The Concept:** Painters close their wet palettes and forget what custom mixes they made three days later. Allow users to snap a photo of their physical wet palette. The app uses basic K-means to isolate the paint blobs, and the user tags them with the recipe. Next.js saves this session to local storage or the database.
* **The "Why":** Digitizes a physical pain point. When they sit down on a Tuesday night, they open SchemeStealer to remember what they were doing on Sunday, driving high retention.

### 1.3 Rapid Barcode Inventory (The "Auspex" Scanner)
* **The Concept:** Onboarding users to the Pro "Inventory" feature is high-friction if they have 150 paints. Integrate a lightweight client-side Web Barcode Detection API. They just hold their phone over their paint rack and the app rapidly logs the exact paints.
* **The "Why":** Removes the biggest barrier to Pro-tier adoption by making inventory management effortless.

---

## 2. Monetization Evolution
*Goal: Combat subscription fatigue without bankrupting Render/Vercel server costs.*

### 2.1 The "Data-Tether" Token Model (Pay-As-You-Go)
* **The Concept:** Subscriptions alienate casual hobbyists who only paint one weekend a month. Introduce a compute-token model. Sell a "Servitor Pack" of 50 High-Res Scans for £2.99. The base-color match remains free, but executing the heavy CIEDE2000 math for a full 4-step recipe costs 1 token.
* **The Tech:** Zustand manages the local token state, synced to a lightweight ledger in your database.

### 2.2 The "Tech-Priest" Lifetime License (Edge Compute)
* **The Concept:** Offer a premium £49.99 one-time lifetime license. To offset recurring server costs for lifetime users, push the compute to the edge. Ship a WebAssembly (WASM) version of your Python CIEDE2000 engine to the Next.js client. Their own phone’s CPU does the heavy math, dropping infrastructure costs to zero for your heaviest users.

### 2.3 B2B Paint Manufacturer Integration (White-labeling)
* **The Concept:** License an embedded API version of SchemeStealer to challenger brands (like Pro Acryl or Two Thin Coats) who struggle with adoption because hobbyists don't know how their ranges map to Citadel. They pay a monthly B2B SaaS fee to put your "Color Matcher Widget" directly on their Shopify stores.

---

## 3. Community & User-Generated Content (UGC)
*Goal: Turn your user base into a scalable marketing engine via organic SEO.*

### 3.1 Public "Data-Slate" Recipe Pages
* **The Concept:** When a user nails a paint job, they publish their recipe in the app. Next.js 15 App Router uses `generateStaticParams` to instantly spin up a blazing-fast, publicly accessible webpage (e.g., `schemestealer.com/recipes/grimdark-blood-angels`).
* **The "Why":** Miniature painters constantly Google *"How to paint [X]"*. Your app will naturally generate thousands of keyword-rich, programmatic SEO pages, driving zero-cost organic acquisition.

### 3.2 The "Kitbash" Remix Engine
* **The Concept:** Users can browse community Data-Slates and click "Fork/Remix." They inherit the original creator's recipe into their own Zustand state, but can tweak it (e.g., swapping the gold trim for silver). The UI maintains an attribution chain (*"Remixed from @MiniPainter99"*).

### 3.3 Creator Affiliate Revenue Splits
* **The Concept:** To attract elite, Golden Demon-level painters, offer a bounty. If a user publishes a highly popular recipe, they get a 50% split on any affiliate paint sales generated from their specific URL. This guarantees top-tier influencers will promote your app for you.

---

## 4. Effort vs. Impact Prioritization Matrix

| Feature / Initiative | Estimated Effort | Anticipated Impact | Technical Vector |
| :--- | :--- | :--- | :--- |
| **Public Data-Slate Pages** | Medium | Massive | Next.js Dynamic Routing / SEO |
| **Wet Palette Tracker** | Low | High | Frontend UI / Local Storage |
| **Data-Tether Tokens** | Medium | High | Stripe API / Zustand Ledger |
| **Kitbash Remix Engine** | Low | High | JSON State Duplication |
| **Rapid Barcode Scanner** | Medium | High | Client-side Web API |
| **Alchemy Lab** | High | Massive | Python Matrix Math (Kubelka-Munk) |
| **Lifetime License (WASM)** | High | High | Rust/WASM compilation |
| **Creator Revenue Splits** | High | Medium | Affiliate Tracking Logic |
| **B2B Integration** | High | Massive | API Rate Limiting / Sales |

> **Strategic Recommendation:** Begin with the **Public Data-Slate Recipe Pages**. It requires no new complex computer vision or advanced math — it solely utilizes Next.js routing patterns you already have in place. Getting user-generated recipes indexed by Google is the fastest way to build an organic marketing engine.