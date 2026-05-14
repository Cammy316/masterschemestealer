# ⚔️ SCHEMESTEALER ULTIMATE ROADMAP
## The Definitive 6-Month Implementation Plan

**Version:** 4.0.0 ULTIMATE  
**Created:** February 1, 2026  
**Target:** £0 → £2,000+/month in 6 months  
**Status:** 🟢 ACTIVE

---

# 📊 EXECUTIVE SUMMARY

## What Makes This Version Ultimate

This document merges V2.0 (execution-focused) and V3.0 (ML-focused) roadmaps into a single, streamlined plan with:

1. **Consolidated Claude Code Prompts** - Fewer, larger prompts covering multiple features
2. **ML Data Collection from Day 1** - Building training dataset alongside every feature
3. **Two-Tier Monetisation** - Free + Pro (£3.99/month) keeping it simple
4. **Automated Testing Pipeline** - Image scraping and ML training infrastructure
5. **Realistic Timelines** - Based on single developer capacity

---

## Current State Assessment

| Component | Status | Completion | Notes |
|-----------|--------|------------|-------|
| React Frontend | ✅ Working | 85% | Core scanning functional |
| FastAPI Backend | ✅ Working | 80% | Color detection algorithms complete |
| W40K Theming | ✅ Excellent | 95% | Cogitator/Warp themes polished |
| Shopping Cart | ✅ Working | 90% | Needs real affiliate links |
| Offline Matcher | ✅ Complete | 100% | Frontend paint matching works |
| Paint Database | ✅ Complete | 100% | 3,000+ paints in paints_v3.json |
| **Authentication** | ❌ None | 0% | Clerk integration needed |
| **Payments** | ❌ None | 0% | Stripe integration needed |
| **Analytics** | ⚠️ Partial | 30% | Backend class exists, not integrated |
| **Feedback System** | ❌ None | 0% | CRITICAL for ML training |
| **ML Pipeline** | ❌ None | 0% | Needs feedback data first |
| **Affiliate Links** | ⚠️ Placeholder | 20% | Placeholder URLs only |
| **Email Capture** | ❌ None | 0% | Not implemented |

---

## Project Structure Reference

```
schemestealer/
├── schemestealer-react/          # Next.js 15 Frontend
│   ├── app/                      # App router pages
│   │   ├── miniature/           # Miniscan mode
│   │   └── inspiration/         # Inspiration mode
│   ├── components/              # React components
│   ├── lib/                     # Utilities & stores
│   └── public/                  # Static assets
│
├── python-api/                   # FastAPI Backend
│   ├── main.py                  # Entry point
│   ├── config.py                # Configuration
│   ├── paints_v3.json          # Paint database
│   ├── core/                    # Detection algorithms
│   │   ├── color_engine.py     # Color classification
│   │   ├── schemestealer_engine.py
│   │   └── smart_color_system.py
│   ├── services/               # API services
│   └── routes/                 # API routes (to create)
│
└── ml-pipeline/                  # ML Training (to create)
    ├── scrapers/                # Image scrapers
    ├── labeller/                # Active learning UI
    ├── training/                # Model training
    └── data/                    # Collected data
```

---

## Two-Tier Revenue Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    REVENUE STREAMS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FREE TIER (Target: 90% of users)                              │
│  ✅ Unlimited basic scans                                       │
│  ✅ 3 paint matches per colour                                  │
│  ✅ Basic shopping cart with affiliate links                    │
│  ✅ 5 saved schemes maximum                                     │
│  ⚠️ Watermarked share images                                    │
│  ⚠️ Standard processing speed                                   │
│                                                                 │
│  PRO TIER - £3.99/month (Target: 5% conversion)                │
│  Everything Free PLUS:                                          │
│  ⭐ Paint Inventory Sync - Only show paints you own             │
│  ⭐ Full Painting Recipes with techniques                       │
│  ⭐ Cross-Brand Paint Translator                                │
│  ⭐ 5 paint matches per colour                                  │
│  ⭐ Unlimited scheme saves                                      │
│  ⭐ Watermark-free share images                                 │
│  ⭐ Batch scanning (10 images)                                  │
│  ⭐ PDF export with printing guides                             │
│  ⭐ Priority ML improvements                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

MONTH 6 TARGET BREAKDOWN:
├─ Pro Tier:     £960/month (240 subs × £3.99)
├─ Affiliates:   £250/month (passive from all users)
├─ Ko-fi:        £100/month (donations)
└─ TOTAL:        £1,310/month (conservative)
                 £2,000+/month (optimistic)
```

---

# 🗓️ 6-MONTH TIMELINE OVERVIEW

| Month | Focus | Key Deliverables | Revenue Target |
|-------|-------|------------------|----------------|
| **1** | Foundation & Launch | Error handling, Feedback system, ML logging, Ko-fi, Affiliate setup | £100 |
| **2** | Partnerships & Growth | Real affiliate links, Content marketing, Community building | £300 |
| **3** | Monetisation Infrastructure | Authentication (Clerk), Payments (Stripe), Email capture | £600 |
| **4** | Pro Tier Launch | Pro features, Batch scanning, PDF export, Cloud saves | £1,000 |
| **5** | ML Deployment | Train model, A/B testing, Deploy ML, Paint Inventory Sync | £1,500 |
| **6** | Scale & Optimise | Performance, CDN, Cross-brand translator, Mobile planning | £2,000+ |

---

# 🤖 CLAUDE CODE EXECUTION PROMPTS

## How to Use These Prompts

1. **Copy ONE phase prompt** into Claude Code
2. Let Claude Code complete all tasks in that phase
3. **Test everything thoroughly** before moving on
4. Check off completed items in this document
5. Move to the next phase

**Critical Rules:**
- Each phase builds on the previous - don't skip phases
- Test in browser after each phase
- Commit to git after each successful phase
- The ML data collection runs alongside ALL phases

---

# PHASE 1: FOUNDATION & ML DATA COLLECTION

**Estimated Time:** 12-16 hours  
**Priority:** 🔴 P0 - Must complete before anything else  
**Dependencies:** None

## Phase 1 Goals

- [ ] Robust error handling across the app
- [ ] Environment-based API configuration
- [ ] ML data logging from every scan (CRITICAL)
- [ ] User feedback collection system
- [ ] Analytics tracking foundation
- [ ] British English throughout UI
- [ ] Loading states and UX polish

---

### PROMPT 1A: Core Infrastructure & Error Handling

```markdown
# SCHEMESTEALER - PHASE 1A: Core Infrastructure

## Context
You are working on SchemeStealer, a React/Next.js app for Warhammer 40K miniature painters. The app detects colours from images and recommends paints.

**Tech Stack:**
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Framer Motion
- Backend: FastAPI (Python) running at http://localhost:8000
- Theming: W40K Imperial (Cogitator green) and Chaos (Warp purple) aesthetic

**Project Paths:**
- Frontend: `schemestealer-react/`
- Backend: `python-api/`

## TASKS

### 1. Error Boundary Component
Create a React error boundary component at `components/ErrorBoundary.tsx`:
- Class component using getDerivedStateFromError
- W40K themed error display ("Machine Spirit Malfunction")
- Retry button that reloads the page
- Logs errors to console (future: send to analytics)
- Wrap the app in layout.tsx with this boundary

### 2. Environment Configuration
Create environment files for API URL:
- `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
- `.env.production` with `NEXT_PUBLIC_API_URL=https://your-production-url.com`
- Update any hardcoded API URLs in `lib/api.ts` or similar to use the env variable
- Create an `apiClient` utility that handles base URL and common headers

### 3. Loading States Component
Create a reusable loader component at `components/shared/PageLoader.tsx`:
- Animated cogwheel/warp portal based on theme prop
- Customisable loading message
- Framer Motion entrance/exit animations
- Use in scan pages during image processing

### 4. British English Audit
Search ALL frontend files and convert user-visible text:
- "color" → "colour" (in UI strings only, not code variables)
- "Color" → "Colour"
- "analyze" → "analyse"
- DO NOT change: variable names, CSS classes, library imports

### 5. Toast/Notification System
Create a simple toast notification system:
- `components/shared/Toast.tsx` - individual toast component
- `lib/useToast.ts` - Zustand store or hook for managing toasts
- Success, error, warning, info variants
- Auto-dismiss after 5 seconds
- W40K themed styling

## Testing Checklist
- [ ] Temporarily throw error in component - error boundary catches it
- [ ] API calls use environment variable
- [ ] Loading states appear during scan processing
- [ ] All UI text uses British English
- [ ] Toast notifications display correctly
```

---

### PROMPT 1B: ML Data Logging Pipeline (CRITICAL)

```markdown
# SCHEMESTEALER - PHASE 1B: ML Data Logging Pipeline

## Context
This is the MOST CRITICAL phase for long-term accuracy improvement. We're building a comprehensive data logging system that captures 35+ features per scan to train ML models later.

**Why This Matters:**
- Current colour detection is ~65% accurate (conditional logic)
- Target: 90%+ accuracy with ML
- Need 500+ labelled samples for basic model
- Need 5,000+ samples for production-quality model
- Every scan from day one should contribute training data

## TASKS

### 1. Frontend ML Logger Service
Create `lib/mlDataLogger.ts` - a comprehensive logging service:

**Scan-Level Features to Capture (13):**
- scan_id (UUID)
- user_id (null if not logged in)
- session_id (from localStorage or generate)
- mode ('miniature' | 'inspiration')
- timestamp (ISO format)
- processing_time_ms
- image_width, image_height, image_size_bytes
- num_colours_detected
- dominant_colour_hex
- colour_harmony_type
- overall_brightness (0-100)
- overall_contrast (0-100)

**Per-Colour Features to Capture (22):**
- scan_id (link to parent)
- colour_index (0, 1, 2...)
- RGB values (r, g, b)
- HSV values (h, s, v)
- LAB values (l, a, b_lab)
- chroma (sqrt(a² + b²))
- coverage_percent
- family_predicted
- is_metallic, is_detail
- confidence
- top_paint_name, top_paint_brand, top_paint_delta_e

**Behavioural Signals to Capture:**
- time_on_results_ms (how long user views results)
- paints_added_to_cart (array of paint names)
- paints_removed_from_cart (array - negative signal)
- affiliate_links_clicked (array with retailer info)
- shared_scheme (boolean)
- saved_to_library (boolean)
- scanned_again_same_image (dissatisfaction signal)

**Implementation:**
- Queue data in localStorage to handle offline/failures
- Batch send to backend every 30 seconds or on page unload
- Graceful degradation if backend unavailable

### 2. Backend ML Data Endpoints
Create `routes/ml_data.py` with FastAPI routes:

**Endpoints:**
- `POST /api/ml/log-scan` - Log scan + colours in one request
- `POST /api/ml/log-feedback` - Log user feedback with corrections
- `POST /api/ml/log-behavior` - Log behavioural signals
- `POST /api/ml/batch-log` - Batch endpoint for queued data
- `GET /api/ml/stats` - Return counts for monitoring

**Storage:**
- Create `data/ml/scans/` - JSON files per scan
- Create `data/ml/colours/` - Append-only CSV for ML training
- Create `data/ml/feedback/` - JSON files per feedback submission
- Create `data/ml/behavior/` - JSON files for behavioural data

Add the router to `main.py`.

### 3. Integrate ML Logger into Scan Flow
In `app/miniature/page.tsx` and `app/inspiration/page.tsx`:
- Import mlLogger
- Call `mlLogger.startScan(mode)` before scan
- Call `mlLogger.logScanComplete(...)` after results received
- Pass scanId through to results for feedback linking

### 4. Integrate ML Logger into Cart/Actions
In the Zustand store or wherever cart actions live:
- Log `mlLogger.logCartAction(scanId, 'add', paintName, brand)` on add
- Log `mlLogger.logCartAction(scanId, 'remove', paintName, brand)` on remove
- Log affiliate clicks with retailer and paint info

### 5. Session and Time Tracking
- Generate/retrieve session_id on app load
- Track time_on_results using a timer started when results display
- Track if user scans same image again (hash comparison)

## Testing Checklist
- [ ] Perform a scan - check `data/ml/scans/` for JSON file
- [ ] Check `data/ml/colours/` CSV has entries
- [ ] Add/remove items from cart - behavioural data logged
- [ ] Call `GET /api/ml/stats` - returns counts
- [ ] Reload page - session_id persists
- [ ] Disable backend - frontend queues data gracefully
```

---

### PROMPT 1C: Feedback System with Colour Corrections

```markdown
# SCHEMESTEALER - PHASE 1C: Feedback System

## Context
User feedback with colour-level corrections is essential for ML training. We need to know not just "this scan was bad" but WHICH colours were wrong and what they SHOULD have been.

## TASKS

### 1. Feedback Modal Component
Create `components/FeedbackModal.tsx`:

**UI Requirements:**
- W40K themed modal ("Rate This Colour Analysis")
- 1-5 star rating (skull icons for stars?)
- If rating ≤ 3, show expandable section:
  - List each detected colour with:
    - Colour swatch
    - Predicted family
    - ✓/✗ toggle ("Was this correct?")
    - Dropdown to select correct family if wrong
    - Optional: text field for actual paint used
- Issue categories (checkboxes):
  - "Wrong colours detected"
  - "Poor paint recommendations"
  - "Missing colours"
  - "Too many colours"
  - "Metallics detected incorrectly"
- Optional comment field
- Optional email field (for follow-up)
- Experience level selector (beginner/intermediate/advanced)

**Behaviour:**
- Auto-prompt after 10 seconds on results page
- Can be dismissed (don't show again this session)
- Can be triggered manually via "Give Feedback" button
- Submit sends to `/api/ml/log-feedback`
- Show thank you message with Ko-fi prompt

### 2. Feedback Prompt Hook
Create `hooks/useFeedbackPrompt.ts`:
- Accepts scanId and delay (default 10 seconds)
- Tracks if already shown for this scan
- Returns { shouldShow, dismiss, triggerManually }

### 3. Backend Feedback Processing
Enhance `/api/ml/log-feedback` endpoint:
- Store complete feedback with colour corrections
- Flag scans with feedback for priority in ML training
- Extract "ground truth" labels from corrections

### 4. Feedback Integration
In results pages (`miniature/page.tsx`, `inspiration/page.tsx`):
- Import FeedbackModal and useFeedbackPrompt
- Display modal when shouldShow is true
- Add "Give Feedback" button in results UI
- Pass detected colours and scanId to modal

### 5. Admin Stats Endpoint
Add to `/api/ml/stats`:
- Total scans logged
- Total feedback submissions
- Feedback rate percentage
- Most common issues reported
- Colour families most often corrected

## Testing Checklist
- [ ] Complete scan - feedback modal appears after 10s
- [ ] Rate 2 stars - colour correction UI appears
- [ ] Mark a colour as wrong - dropdown appears
- [ ] Submit feedback - check `data/ml/feedback/` JSON
- [ ] Dismiss modal - doesn't reappear same session
- [ ] Manual trigger via button works
- [ ] `/api/ml/stats` returns feedback counts
```

---

### PROMPT 1D: Analytics & Ko-fi Integration

```markdown
# SCHEMESTEALER - PHASE 1D: Analytics & Ko-fi

## Context
Basic analytics help us understand user behaviour. Ko-fi provides immediate (small) revenue while we build the Pro tier.

## TASKS

### 1. Analytics Service
Create `lib/analytics.ts`:

**Events to Track:**
- page_view (path, referrer)
- scan_started (mode)
- scan_completed (mode, num_colours, processing_time)
- paint_added_to_cart (paint_name, brand, price)
- paint_removed_from_cart (paint_name)
- affiliate_link_clicked (retailer, paint_name)
- share_initiated (method: copy/download/social)
- feedback_submitted (rating, has_corrections)
- pro_upgrade_clicked
- ko_fi_clicked

**Implementation:**
- Store events in localStorage queue
- Batch send to backend `/api/analytics/events`
- Include session_id, timestamp, user_agent

### 2. Analytics Backend
Create `routes/analytics.py`:
- `POST /api/analytics/events` - Store events
- `GET /api/analytics/summary` - Basic dashboard data
- Store in `data/analytics/` as daily CSV files

### 3. Ko-fi Integration
Create a Ko-fi "Buy me a Recaf" prompt:
- After successful scan (20% chance)
- After feedback submission (always show)
- In footer/sidebar permanently
- Link to your Ko-fi page
- W40K themed: "Fuel the Machine Spirit" / "Buy me a Recaf"

### 4. Analytics Hook
Create `hooks/useAnalytics.ts`:
- Wraps the analytics service
- Provides typed methods: `trackEvent(name, properties)`
- Auto-tracks page views on route change

### 5. Integration
- Add useAnalytics to key pages
- Track all the events listed above
- Add Ko-fi prompt component to layout or results pages

## Testing Checklist
- [ ] Navigate between pages - page_view events logged
- [ ] Complete scan - scan_completed event logged
- [ ] Click affiliate link - event logged with details
- [ ] Ko-fi prompt appears after scans/feedback
- [ ] Check `data/analytics/` for event files
- [ ] `/api/analytics/summary` returns data
```

---

### PHASE 1 COMPLETION CHECKLIST

Before moving to Phase 2, verify:

**Infrastructure:**
- [ ] Error boundary catches and displays errors gracefully
- [ ] API URL comes from environment variables
- [ ] Loading states display during processing
- [ ] Toast notifications work for all variants
- [ ] All UI text is British English

**ML Data Pipeline:**
- [ ] Every scan logs 35+ features to backend
- [ ] Colours logged to append-only CSV
- [ ] Behavioural signals (cart, clicks) logged
- [ ] Session tracking works across page loads
- [ ] Queue handles offline gracefully

**Feedback System:**
- [ ] Feedback modal appears after 10s on results
- [ ] Colour-level corrections can be submitted
- [ ] Feedback stored with scanId linking
- [ ] Manual feedback trigger works
- [ ] `/api/ml/stats` shows collection progress

**Analytics & Monetisation:**
- [ ] Key events tracked (scans, carts, clicks)
- [ ] Ko-fi prompts display appropriately
- [ ] Analytics summary endpoint works

**Data Collection Targets (Month 1):**
| Week | Scans | Feedback (15%) | ML Samples |
|------|-------|----------------|------------|
| 1 | 100 | 15 | 15 |
| 2 | 200 | 30 | 45 |
| 3 | 300 | 45 | 90 |
| 4 | 400 | 60 | 150 |

---

# PHASE 2: PARTNERSHIPS & MARKETING

**Estimated Time:** 8-12 hours (plus ongoing marketing)  
**Priority:** 🟠 P1 - Revenue foundation  
**Dependencies:** Phase 1 complete

## Phase 2 Goals

- [ ] Real affiliate links with tracking
- [ ] Affiliate partner applications submitted
- [ ] SEO optimisation for discoverability
- [ ] Social media presence established
- [ ] Community engagement started

---

### PROMPT 2A: Affiliate System & SEO

```markdown
# SCHEMESTEALER - PHASE 2A: Affiliates & SEO

## Context
Affiliate revenue is our first monetisation stream. We need proper tracking and real partner links.

## TASKS

### 1. Affiliate Link Service
Create `lib/affiliates.ts`:

**Retailer Configuration:**
```typescript
const RETAILERS = {
  element_games: {
    name: 'Element Games',
    baseUrl: 'https://elementgames.co.uk',
    searchPath: '/search?q=',
    affiliateParam: '?aff=SCHEMESTEALER', // Apply when approved
    commission: '5-8%',
    region: 'UK',
  },
  wayland_games: {
    name: 'Wayland Games',
    baseUrl: 'https://www.waylandgames.co.uk',
    searchPath: '/search/',
    affiliateParam: '?utm_source=schemestealer',
    commission: '5-10%',
    region: 'UK',
  },
  amazon_uk: {
    name: 'Amazon UK',
    baseUrl: 'https://www.amazon.co.uk',
    searchPath: '/s?k=',
    affiliateParam: '&tag=schemestealer-21', // Apply when approved
    commission: '3-5%',
    region: 'UK/Global',
  },
};
```

**Functions:**
- `generateAffiliateLink(paintName: string, brand: string, retailer: string)` → URL
- `trackAffiliateClick(paintName, brand, retailer, scanId)` → logs to analytics

### 2. Shopping Cart Enhancement
Update the shopping cart component:
- Display multiple retailer options per paint
- Show estimated prices (from paint database or lookup)
- "Buy All" button that opens retailer with all items
- Track all affiliate clicks

### 3. SEO Optimisation
Update Next.js metadata in relevant pages:

**Homepage:**
- Title: "SchemeStealer - Paint Colour Detector for Warhammer 40K Miniatures"
- Description: "Identify colours on painted miniatures and get exact paint recommendations. Free colour detection tool for Warhammer, Age of Sigmar, and miniature painters."
- Keywords: warhammer paint detector, miniature colour matcher, citadel paint finder

**Miniscan Page:**
- Title: "Identify Miniature Paint Colours | SchemeStealer"
- Description: "Upload a photo of any painted miniature and instantly identify the colours used. Get exact Citadel, Vallejo, and Army Painter matches."

**Inspiration Page:**
- Title: "Extract Paint Palettes from Any Image | SchemeStealer"
- Description: "Turn any image into a miniature painting palette. Extract colours from artwork, photos, or screenshots and get matching miniature paints."

### 4. Sitemap & Robots
- Create `public/sitemap.xml` with all public pages
- Create `public/robots.txt` allowing search engine crawling
- Add structured data (JSON-LD) for the app

### 5. Open Graph & Social Cards
- Create OG images for social sharing
- Set up og:title, og:description, og:image in metadata
- Twitter card metadata

## Testing Checklist
- [ ] Affiliate links generate correctly for each retailer
- [ ] Clicking affiliate link logs to analytics
- [ ] Shopping cart shows multiple retailer options
- [ ] Meta tags appear correctly (use browser dev tools)
- [ ] Sharing to Twitter/Facebook shows proper card
- [ ] sitemap.xml accessible at /sitemap.xml
```

---

### PROMPT 2B: Social & Community Setup

```markdown
# SCHEMESTEALER - PHASE 2B: Social & Community

## Context
Community presence drives organic growth. We need accounts, initial content, and engagement strategy.

## TASKS (Manual + Technical)

### 1. Social Account Setup (Manual)
Create accounts for SchemeStealer:
- [ ] Twitter/X: @SchemeStealer
- [ ] Reddit: u/SchemeStealer (follow r/minipainting, r/Warhammer40k rules)
- [ ] Discord: SchemeStealer server
- [ ] YouTube: SchemeStealer (for future tutorials)
- [ ] Ko-fi: kofi.com/schemestealer

### 2. Discord Server Structure (Manual)
Create channels:
- #welcome-rules
- #announcements
- #show-your-scans
- #paint-help
- #feature-requests
- #bug-reports

### 3. Social Share Feature
Create `components/SocialShare.tsx`:
- Share to Twitter with pre-filled text + image
- Copy shareable link
- Download share image
- Share to Discord (copy with Discord formatting)

### 4. Share Image Generator
Enhance or create share image generation:
- Include app branding/watermark (removable for Pro)
- Show colour palette nicely
- Include detected paints list
- Different styles for Miniscan vs Inspiration
- Mobile-optimised dimensions

### 5. Launch Announcement Posts (Manual)
Draft posts for:
- Reddit r/minipainting announcement
- Reddit r/Warhammer40k announcement
- Twitter launch thread
- Discord server announcement

**Key Messages:**
- Free tool to identify paints on miniatures
- Upload photo → get exact paint matches
- Supports Citadel, Vallejo, Army Painter
- Built by a hobbyist, for hobbyists
- Feedback wanted to improve accuracy

## Testing Checklist
- [ ] Social share buttons work correctly
- [ ] Share images generate with branding
- [ ] Twitter share opens with pre-filled text
- [ ] Discord copy includes proper formatting
- [ ] All social accounts created and branded
```

---

### PHASE 2 COMPLETION CHECKLIST

**Affiliates:**
- [ ] Affiliate links generate correctly
- [ ] Multiple retailers shown per paint
- [ ] Click tracking working
- [ ] Partner applications submitted (Element, Wayland, Amazon)

**SEO:**
- [ ] Meta tags on all pages
- [ ] Sitemap accessible
- [ ] Structured data added
- [ ] OG/Twitter cards working

**Social:**
- [ ] All social accounts created
- [ ] Discord server set up
- [ ] Share functionality working
- [ ] Launch posts drafted

**Marketing Targets (Month 2):**
| Metric | Target |
|--------|--------|
| Total Users | 1,500 |
| Monthly Scans | 3,000 |
| Email Subscribers | 100 |
| Discord Members | 50 |
| Affiliate Revenue | £100 |

---

# PHASE 3: AUTHENTICATION & PAYMENTS

**Estimated Time:** 16-20 hours  
**Priority:** 🟠 P1 - Required for Pro tier  
**Dependencies:** Phase 2 complete

## Phase 3 Goals

- [ ] User authentication with Clerk
- [ ] User profiles and saved data
- [ ] Payment processing with Stripe
- [ ] Pro tier subscription flow
- [ ] Email capture and list building

---

### PROMPT 3A: Clerk Authentication

```markdown
# SCHEMESTEALER - PHASE 3A: Authentication with Clerk

## Context
We're using Clerk for authentication because it's fast to implement, has great React/Next.js support, and handles all the security concerns.

## TASKS

### 1. Clerk Setup
- Create Clerk account at clerk.com
- Create new application "SchemeStealer"
- Enable sign-in methods: Email, Google, Discord (painters love Discord)
- Get API keys and add to `.env.local`:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`

### 2. Clerk Provider Setup
- Install `@clerk/nextjs`
- Wrap app in `ClerkProvider` in `layout.tsx`
- Create sign-in and sign-up pages using Clerk components
- Style Clerk components to match W40K theme (custom appearance)

### 3. Protected Routes
Create middleware to protect certain routes:
- `/account/*` - requires auth
- `/pro/*` - requires auth + Pro subscription
- Public routes: `/`, `/miniature`, `/inspiration`, `/sign-in`, `/sign-up`

### 4. User Profile Page
Create `app/account/page.tsx`:
- Display user info (avatar, email, name)
- Subscription status (Free/Pro)
- Saved schemes count
- Usage statistics
- Account settings link

### 5. Auth Integration in Existing Pages
Update scan pages:
- If logged in, associate scans with user_id
- If not logged in, prompt to sign up after scan (subtle, not blocking)
- "Sign in to save your schemes" messaging

### 6. Backend Auth Verification
Create middleware for FastAPI:
- Verify Clerk JWT tokens
- Extract user_id from token
- Add user context to requests
- Routes that require auth: saving schemes, Pro features

## Testing Checklist
- [ ] Can sign up with email
- [ ] Can sign in with Google
- [ ] Can sign in with Discord
- [ ] Protected routes redirect to sign-in
- [ ] User profile page displays correctly
- [ ] Backend verifies Clerk tokens
- [ ] Scan associates with user_id when logged in
```

---

### PROMPT 3B: Stripe Payments & Pro Tier

```markdown
# SCHEMESTEALER - PHASE 3B: Stripe Payments

## Context
Stripe handles subscription billing for Pro tier. We'll use Stripe Checkout for the payment flow and webhooks for subscription status.

## TASKS

### 1. Stripe Setup
- Create Stripe account at stripe.com
- Create Product: "SchemeStealer Pro"
- Create Price: £3.99/month recurring
- Get API keys for `.env.local`:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRO_PRICE_ID`

### 2. Checkout Flow
Create `app/api/stripe/create-checkout/route.ts`:
- Create Stripe Checkout session
- Include customer email from Clerk
- Set success/cancel URLs
- Enable customer portal for subscription management

Create upgrade button component:
- "Upgrade to Pro - £3.99/month"
- Redirects to Stripe Checkout
- W40K themed styling

### 3. Webhook Handler
Create `app/api/stripe/webhook/route.ts`:
- Handle `checkout.session.completed` - activate Pro
- Handle `customer.subscription.deleted` - deactivate Pro
- Handle `customer.subscription.updated` - update status
- Store subscription status in database

### 4. Database for Subscriptions
Create simple subscription storage:
- Could use Supabase, or simple JSON/SQLite for now
- Store: user_id, stripe_customer_id, subscription_status, pro_until
- Backend endpoint to check subscription status

### 5. Pro Status Checking
Create `lib/useSubscription.ts` hook:
- Fetches user's subscription status
- Returns { isPro, isLoading, subscription }
- Cache status to avoid constant API calls

### 6. Feature Gating
Create `components/ProGate.tsx`:
- Wraps Pro-only features
- If not Pro, shows upgrade prompt instead
- Smooth, non-annoying UX

Update features with Pro gating:
- Batch scanning → Pro only
- PDF export → Pro only
- Unlimited saves → Pro only (Free = 5 max)
- Watermark-free images → Pro only

## Testing Checklist
- [ ] Stripe test mode checkout works
- [ ] Webhook receives events (use Stripe CLI)
- [ ] Subscription status stored correctly
- [ ] Pro features accessible after payment
- [ ] Cancellation removes Pro access
- [ ] Pro gate shows upgrade prompt to free users
```

---

### PROMPT 3C: Email Capture & User Database

```markdown
# SCHEMESTEALER - PHASE 3C: Email & Database

## Context
Email list is valuable for announcements, marketing, and retention. We also need persistent storage for user data.

## TASKS

### 1. Email Capture Modal
Create `components/EmailCaptureModal.tsx`:
- Trigger: After 3rd scan OR after feedback submission
- Headline: "Get Painting Tips & App Updates"
- Offer: "Join 500+ painters improving their craft"
- Single email input + consent checkbox
- W40K themed: "Join the Chapter" / "Receive Transmissions"

### 2. Email Storage
Options (choose one):
- **Simple**: Store in `data/emails.json` 
- **Better**: Supabase table
- **Best**: Direct integration with email service (ConvertKit, Mailchimp)

Backend endpoint:
- `POST /api/email/subscribe` - Add email with consent timestamp
- Validate email format
- Check for duplicates

### 3. Supabase Setup (Recommended)
- Create Supabase project
- Create tables:
  - `users` (id, clerk_id, email, created_at)
  - `subscriptions` (id, user_id, stripe_customer_id, status, pro_until)
  - `schemes` (id, user_id, scan_data, name, created_at)
  - `email_subscribers` (id, email, consented_at, source)
- Add Supabase keys to `.env.local`

### 4. User Data Migration
- On sign-up, create user record in Supabase
- Link Clerk user_id to Supabase user
- Store subscription data in Supabase

### 5. Saved Schemes Feature
Backend endpoints:
- `POST /api/schemes/save` - Save a scheme (limit 5 for free)
- `GET /api/schemes` - List user's schemes
- `DELETE /api/schemes/:id` - Delete a scheme

Frontend:
- "Save Scheme" button on results page
- Saved schemes list on profile page
- Scheme limit indicator for free users

## Testing Checklist
- [ ] Email capture modal appears at right times
- [ ] Emails stored with consent timestamp
- [ ] Supabase tables created and accessible
- [ ] User created in Supabase on Clerk sign-up
- [ ] Schemes save and load correctly
- [ ] Free users limited to 5 saves
- [ ] Pro users have unlimited saves
```

---

### PHASE 3 COMPLETION CHECKLIST

**Authentication:**
- [ ] Clerk fully integrated
- [ ] Sign in/up with Email, Google, Discord
- [ ] Protected routes working
- [ ] User profile page complete

**Payments:**
- [ ] Stripe test payments working
- [ ] Webhooks handling subscription events
- [ ] Pro status stored and accessible
- [ ] Feature gating implemented

**Database & Email:**
- [ ] Supabase set up with tables
- [ ] Email capture working
- [ ] Saved schemes functional
- [ ] Free tier limits enforced

**Targets (Month 3):**
| Metric | Target |
|--------|--------|
| Total Users | 3,000 |
| Registered Users | 500 |
| Email Subscribers | 300 |
| ML Feedback Samples | 600 |
| Revenue | £600 |

---

# PHASE 4: PRO FEATURES LAUNCH

**Estimated Time:** 16-20 hours  
**Priority:** 🟡 P2 - Revenue growth  
**Dependencies:** Phase 3 complete

## Phase 4 Goals

- [ ] Batch scanning (10 images)
- [ ] PDF export with printing guides
- [ ] Enhanced share images (watermark-free for Pro)
- [ ] Full painting recipes
- [ ] Pro marketing campaign

---

### PROMPT 4A: Batch Scanning & PDF Export

```markdown
# SCHEMESTEALER - PHASE 4A: Batch Scanning & PDF Export

## Context
Batch scanning and PDF export are key Pro features that add real value for serious hobbyists.

## TASKS

### 1. Batch Upload Component
Create `components/BatchUploader.tsx`:
- Accept up to 10 images (Pro only)
- Drag and drop zone
- Image preview grid with remove option
- Progress indicator during processing
- Process images sequentially or in parallel

### 2. Batch Processing Backend
Create `routes/batch.py`:
- `POST /api/scan/batch` - Accept multiple images
- Process each through existing scan logic
- Return array of results
- Include total processing time
- Require Pro authentication

### 3. Batch Results Display
Create `components/BatchResults.tsx`:
- Tabbed interface for each scanned image
- Summary view showing all palettes together
- Combined shopping list (deduplicated paints)
- Export all as single PDF

### 4. PDF Export Service
Create `lib/pdfExport.ts` using jsPDF or similar:
- Generate painting guide PDF from scan results
- Include:
  - Original image thumbnail
  - Colour palette visualisation
  - Paint list with brands
  - Recommended painting order (BASE → SHADE → LAYER → HIGHLIGHT)
  - Optional: blank notes section for user annotations
- W40K themed header/footer
- Pro branding (not watermarked)

Backend alternative - create `routes/pdf.py`:
- `POST /api/export/pdf` - Generate PDF server-side
- Use reportlab or weasyprint
- Return PDF file

### 5. Painting Recipe Logic
Create `lib/paintingRecipes.ts`:
- Given a colour and its paint match, suggest:
  - Primer recommendation
  - Base coat paint
  - Shade/wash to use
  - Layer/highlight paint
  - Optional edge highlight
- Use paint database relationships (same colour family)
- Rule-based for now, ML-enhanced later

## Testing Checklist
- [ ] Can upload 10 images in batch
- [ ] All images process correctly
- [ ] Combined shopping list deduplicates
- [ ] PDF generates with all information
- [ ] PDF opens correctly in viewer
- [ ] Painting recipes make sense
- [ ] Free users blocked from batch/PDF
```

---

### PROMPT 4B: Enhanced Share Images & Pro Polish

```markdown
# SCHEMESTEALER - PHASE 4B: Share Images & Polish

## Context
Share images drive organic growth. Pro users get premium, watermark-free versions.

## TASKS

### 1. Share Image Generator Service
Create `lib/shareImageGenerator.ts`:
- Use HTML Canvas or server-side image generation
- Different templates:
  - Miniscan: Original image + detected colours + paints
  - Inspiration: Mood board style with palette
  - Batch: Grid of all scanned images with combined palette

**Free version:**
- "Created with SchemeStealer" watermark
- Smaller resolution

**Pro version:**
- No watermark
- Higher resolution
- Optional custom branding

### 2. Share Flow Enhancement
Create `components/SharePanel.tsx`:
- Preview of share image
- Download button
- Copy link button
- Direct share buttons (Twitter, Discord)
- For Pro: option to customise/remove watermark

### 3. Pro Dashboard
Create `app/pro/dashboard/page.tsx`:
- Usage statistics
  - Scans this month
  - Saved schemes count
  - Storage used
- Quick access to Pro features
- Subscription management link

### 4. Pro Onboarding
Create onboarding flow for new Pro subscribers:
- Welcome modal explaining features
- Quick tour of Pro-only capabilities
- Link to Discord for Pro members

### 5. Upgrade Prompts (Non-Annoying)
Strategically place upgrade prompts:
- After 5th scan: "You've done 5 scans! Pro gives you batch scanning"
- When trying Pro feature: Smooth "Unlock with Pro" overlay
- In share flow: "Remove watermark with Pro"
- Never block core functionality

## Testing Checklist
- [ ] Share images generate correctly
- [ ] Free version has watermark
- [ ] Pro version is watermark-free
- [ ] Social sharing works
- [ ] Pro dashboard accessible and accurate
- [ ] Upgrade prompts non-intrusive
- [ ] Onboarding flow smooth for new Pro users
```

---

### PHASE 4 COMPLETION CHECKLIST

**Batch Scanning:**
- [ ] 10 image batch upload works
- [ ] Processing completes reliably
- [ ] Combined results display properly
- [ ] Free users see upgrade prompt

**PDF Export:**
- [ ] PDF generates correctly
- [ ] Includes all scan information
- [ ] Painting recipes included
- [ ] Branded appropriately

**Share Images:**
- [ ] High quality generation
- [ ] Watermark for free, clean for Pro
- [ ] Social sharing functional

**Pro Experience:**
- [ ] Dashboard accessible
- [ ] Onboarding flow complete
- [ ] Usage stats accurate
- [ ] Upgrade prompts strategic

**Targets (Month 4):**
| Metric | Target |
|--------|--------|
| Total Users | 4,000 |
| Pro Subscribers | 50+ |
| Revenue | £1,000 |
| ML Samples | 1,500 |

---

# PHASE 5: ML DEPLOYMENT

**Estimated Time:** 20-24 hours  
**Priority:** 🟡 P2 - Accuracy improvement  
**Dependencies:** Phase 4 complete + 500+ ML samples

## Phase 5 Goals

- [ ] Export and clean training data
- [ ] Train Random Forest model
- [ ] Deploy ML model to production
- [ ] A/B test ML vs rules
- [ ] Paint Inventory Sync feature

---

### PROMPT 5A: ML Training Pipeline

```markdown
# SCHEMESTEALER - PHASE 5A: ML Model Training

## Context
With 1,000+ samples collected, we can train a meaningful ML model for colour classification.

## TASKS

### 1. Training Data Export
Create `scripts/export_training_data.py`:
- Read from `data/ml/colours/` CSV
- Read from `data/ml/feedback/` for corrections
- Join feedback corrections to create ground truth labels
- Export clean CSV with:
  - Features: R, G, B, H, S, V, L, A, B, chroma, coverage
  - Label: family (corrected if available, else predicted)
- Split: 80% train, 20% test
- Report class distribution

### 2. Model Training Script
Create `scripts/train_colour_model.py`:
- Load training data
- Train Random Forest classifier
- Hyperparameter tuning with cross-validation
- Evaluate on test set
- Report:
  - Overall accuracy
  - Per-class precision/recall
  - Confusion matrix
  - Feature importance
- Save model as joblib file

### 3. Model Integration
Create `core/ml_classifier.py`:
- Load trained model on startup
- Classify method: RGB → family prediction + confidence
- Fallback to rule-based if model unavailable
- A/B flag to switch between ML and rules

### 4. A/B Testing Infrastructure
Modify colour classification to support A/B:
- 50% of scans use ML model
- 50% use existing rules
- Log which method used
- Track feedback correlation

Create endpoint:
- `GET /api/ml/ab-stats` - Compare accuracy between methods

### 5. Model Versioning
Create model management:
- Store models in `models/` directory
- Metadata file with training date, accuracy, sample count
- Easy rollback to previous model
- Auto-load latest model on startup

## Testing Checklist
- [ ] Training data exports correctly
- [ ] Model trains without errors
- [ ] Accuracy ≥ 75% on test set
- [ ] Model loads on API startup
- [ ] ML classification works in API
- [ ] A/B split functions correctly
- [ ] Stats endpoint shows comparison
```

---

### PROMPT 5B: Paint Inventory Sync

```markdown
# SCHEMESTEALER - PHASE 5B: Paint Inventory Sync (Pro Feature)

## Context
"Only show paints I own" is the #1 requested Pro feature. Users hate seeing recommendations for paints they don't have.

## TASKS

### 1. Inventory Database Schema
Add to Supabase:
- `paint_inventory` table:
  - id, user_id
  - paint_name, paint_brand
  - quantity (full/partial/empty)
  - added_at
  - notes

### 2. Inventory Management UI
Create `app/pro/inventory/page.tsx`:
- Searchable list of all paints in database
- Quick add/remove toggle
- Filter by brand
- Import from common formats (if any exist)
- Manual add with autocomplete

Create `components/PaintInventoryManager.tsx`:
- Grid or list view of owned paints
- Easy quantity adjustment
- "Add from scan" button (adds recommended paints)

### 3. Inventory-Aware Recommendations
Modify colour matching logic:
- Accept optional user_inventory parameter
- Filter/sort results to prioritise owned paints
- Show "Best match you own" vs "Best match overall"
- Indicate owned status in results UI

### 4. Smart Suggestions
Based on inventory:
- "You might want to add these paints" (commonly paired)
- "This paint is similar to [owned paint]"
- "Complete your collection" prompts

### 5. Inventory Quick Add
In scan results:
- "I have this" button next to each paint recommendation
- Batch add all recommended paints
- Remember choices for future scans

## Testing Checklist
- [ ] Inventory saves and loads per user
- [ ] Paint search and add works
- [ ] Scan results filter to owned paints
- [ ] "Best match you own" displays correctly
- [ ] Quick add from results works
- [ ] Free users see feature preview with upgrade prompt
```

---

### PHASE 5 COMPLETION CHECKLIST

**ML Training:**
- [ ] Training data exported and cleaned
- [ ] Model trained with acceptable accuracy
- [ ] Model deployed and running
- [ ] A/B testing active
- [ ] Stats show ML improvement

**Paint Inventory:**
- [ ] Inventory database working
- [ ] Management UI complete
- [ ] Recommendations filter to inventory
- [ ] Quick add functional

**Targets (Month 5):**
| Metric | Target |
|--------|--------|
| Total Users | 5,000 |
| Pro Subscribers | 150+ |
| Revenue | £1,500 |
| ML Accuracy | 80%+ |
| ML Samples | 3,000 |

---

# PHASE 6: SCALE & OPTIMISE

**Estimated Time:** 16-20 hours  
**Priority:** 🟢 P3 - Growth & stability  
**Dependencies:** Phase 5 complete

## Phase 6 Goals

- [ ] Performance optimisation
- [ ] CDN for images
- [ ] Cross-brand paint translator
- [ ] Advanced ML (XGBoost)
- [ ] Mobile app planning

---

### PROMPT 6A: Performance & Infrastructure

```markdown
# SCHEMESTEALER - PHASE 6A: Performance Optimisation

## Context
With growing traffic, we need to optimise performance and prepare for scale.

## TASKS

### 1. Image Optimisation
- Use Next.js Image component everywhere
- Set up image CDN (Cloudinary or similar)
- Compress uploaded images before processing
- Lazy load images in lists
- Implement image caching

### 2. API Performance
- Add response caching where appropriate
- Rate limiting: 60 scans/hour for free, 200 for Pro
- Connection pooling for database
- Optimise paint database loading (cache in memory)

### 3. Error Monitoring
- Set up Sentry for frontend and backend
- Configure error alerts
- Track performance metrics
- Create error dashboards

### 4. Analytics Dashboard
Create internal admin dashboard:
- User growth over time
- Scan volume and patterns
- Revenue metrics
- ML accuracy trends
- Error rates

### 5. Database Optimisation
- Add indexes to frequently queried columns
- Archive old scan data
- Optimise feedback storage
- Clean up orphaned records

## Testing Checklist
- [ ] Page load times < 2 seconds
- [ ] Image uploads optimised
- [ ] Rate limiting functional
- [ ] Sentry captures errors
- [ ] Admin dashboard accessible
- [ ] Database queries fast
```

---

### PROMPT 6B: Cross-Brand Translator & Final Features

```markdown
# SCHEMESTEALER - PHASE 6B: Cross-Brand & Final Features

## Context
Cross-brand translation is highly valuable for painters who switch between Citadel, Vallejo, and Army Painter.

## TASKS

### 1. Cross-Brand Translation Service
Create `lib/paintTranslator.ts`:
- Given a paint name and brand, find equivalent in other brands
- Use colour distance (Delta-E) in LAB space
- Match by:
  - Exact name match (e.g., "Mephiston Red" → "Bloody Red")
  - Colour similarity (find closest match)
  - Paint type similarity (base, layer, shade)
- Return top 3 alternatives per brand

### 2. Translation UI
Create `app/pro/translator/page.tsx`:
- Search/select a paint
- Show side-by-side comparison with alternatives
- Include colour swatches
- Note any differences (coverage, finish)

### 3. Translation in Results
Enhance scan results:
- "Also try" section with cross-brand alternatives
- Toggle to show results in different brands
- "I prefer [Brand]" setting

### 4. Advanced ML: XGBoost
With 3,000+ samples:
- Train XGBoost model
- Compare to Random Forest
- Implement ensemble (both models voting)
- Deploy winner

### 5. Mobile App Planning
Document for future development:
- React Native feasibility study
- Shared component analysis
- Camera integration requirements
- Offline mode design
- App store requirements

## Testing Checklist
- [ ] Paint translation returns accurate alternatives
- [ ] Translation UI works smoothly
- [ ] Results show cross-brand options
- [ ] XGBoost trained and compared
- [ ] Mobile planning document complete
```

---

### PHASE 6 COMPLETION CHECKLIST

**Performance:**
- [ ] Sub-2-second page loads
- [ ] Image CDN configured
- [ ] Rate limiting active
- [ ] Error monitoring live
- [ ] Admin dashboard functional

**Features:**
- [ ] Cross-brand translator working
- [ ] XGBoost model trained
- [ ] All Pro features polished

**Planning:**
- [ ] Mobile app requirements documented
- [ ] 6-month retrospective complete
- [ ] Next phase roadmap drafted

**Final Targets (Month 6):**
| Metric | Target |
|--------|--------|
| Total Users | 6,000 |
| Pro Subscribers | 200+ |
| Monthly Revenue | £2,000+ |
| ML Accuracy | 85%+ |
| ML Samples | 5,000 |

---

# 📋 MASTER PROGRESS TRACKER

## Weekly Checklist Template

```markdown
## WEEK [N] - [DATE RANGE]

### Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

### Completed
- [x] Task completed

### Metrics
| Metric | Start | End | Target |
|--------|-------|-----|--------|
| Users | | | |
| Scans | | | |
| Revenue | £ | £ | £ |
| Feedback | | | |
| Pro Subs | | | |

### Blockers
- 

### Learnings
- 

### Next Week Priorities
1. 
2. 
3. 
```

---

## Month-by-Month Summary

| Month | Users | Revenue | Key Milestone |
|-------|-------|---------|---------------|
| **1** | 500 | £100 | Launch + ML logging |
| **2** | 1,500 | £300 | Partnerships + community |
| **3** | 3,000 | £600 | Auth + Payments ready |
| **4** | 4,000 | £1,000 | Pro tier live |
| **5** | 5,000 | £1,500 | ML deployed |
| **6** | 6,000 | £2,000+ | Scale + optimise |

---

## Key Success Metrics

### ML Quality
- Colour Family Accuracy: 65% → 90%
- Paint Match Relevance: 37% → 75%
- User Satisfaction: Track via feedback

### Business Health
- Pro Conversion Rate: Target 5%+
- Pro Churn Rate: Target <10%/month
- NPS Score: Target 40+

### Data Collection
- Scans with Feedback: 10%+ rate
- Colour-Level Corrections: Critical for ML
- Behavioural Signals: Every interaction logged

---

# 🎯 QUICK REFERENCE

## File Locations

**Frontend (schemestealer-react/):**
- Pages: `app/[page]/page.tsx`
- Components: `components/`
- Utilities: `lib/`
- Hooks: `hooks/`
- Styles: `app/globals.css`
- Store: `lib/store.ts` (Zustand)

**Backend (python-api/):**
- Entry: `main.py`
- Config: `config.py`
- Routes: `routes/`
- Core Logic: `core/`
- Data: `data/`
- Models: `models/`

## Environment Variables

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Backend (.env)
CLERK_SECRET_KEY=sk_...
SUPABASE_URL=https://...
SUPABASE_SERVICE_KEY=...
```

## Useful Commands

```bash
# Frontend
cd schemestealer-react
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check for issues

# Backend
cd python-api
uvicorn main:app --reload --port 8000
python scripts/train_colour_model.py
python scripts/export_training_data.py

# Stripe CLI (for webhook testing)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

**Document Version:** 4.0.0 ULTIMATE  
**Last Updated:** February 1, 2026  

*"The data you collect today trains the Machine Spirit of tomorrow."*

**Ave Imperator! ⚔️🤖**
