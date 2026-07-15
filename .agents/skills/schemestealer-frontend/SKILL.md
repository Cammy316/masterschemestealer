---
name: schemestealer-frontend
description: Frontend and UI authority for SchemeStealer. Use this skill for ANY work in schemestealer-react/ — React components, Next.js pages, Tailwind styling, Zustand state, the Miniscan/Inspiration themes, recipe cards, the reticle overlay, The Forge mixer UI, UI copy, loading/error/empty states, Chromus mascot voice, or mobile layout. Also use when writing UI copy in prompts or reviewing frontend PRs. Load schemestealer-core first; load schemestealer-colour-science too if the change touches offline detection, deltaE.ts, colorConversion.ts, or colorAnchors.ts.
---

# SchemeStealer — Frontend & UI

## Stack (fixed — do not propose alternatives)

- **Next.js 15** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** for styling, **Zustand** for state
- Deployed on **Vercel**; monorepo root dir is `schemestealer-react/`
- Backend is FastAPI on Render **free tier** — cold starts are expected. Handle them in UX
  (loading states, optimistic UI, offline detection fallback), never with keep-alive hacks.
- **Mobile-first.** Primary use is a phone camera at a hobby desk. Design for narrow
  viewports, thumb reach, and camera capture flows first; desktop is the adaptation.

## Visual identity (grimdark, two sub-themes)

Global aesthetic: **grimdark** — dark backgrounds, neon accents, machined/ritual textures.
Never introduce light-mode-style flat pastel UI.

| Mode | Theme | Palette |
|---|---|---|
| **Miniscan** (scan a painted mini) | Imperial Mechanicus | green / brass |
| **Inspiration** (scan any reference) | Chaos Warp | purple / pink / teal |

- Accents: neon green (Mechanicus side), neon purple/pink (Warp side).
- Theme is selected by **mode**, not by page duplication — components take a `mode` prop
  and map it to theme tokens. Never hard-code a mode's colours inside a shared component.
- Asset language: warp-vortex, crates, eye/skull rating arrays, the **Chromus** mascot.
  Some assets are still pending generation (nanobanana pro, watermark covered by branding
  badges) — build components to accept the asset when it lands; use a themed placeholder,
  not a stock icon.

## Component invariants

1. **One shared recipe card** with a `mode` prop. Any change to recipe display applies to
   Miniscan and Inspiration simultaneously. Forking the card per mode is forbidden
   (core invariant 5).
2. **Offline colour detection must stay a faithful port.** `lib/offlineColorDetection.ts`,
   `lib/deltaE.ts` (manual CIEDE2000), `lib/colorConversion.ts` (skimage-matching D65
   coefficients) and `lib/colorAnchors.ts` mirror the Python engine bit-for-bit.
   - `colorAnchors.ts` is **generated** by `python-api/scripts/build_color_anchors.py` —
     never hand-edit it.
   - Any change here must keep `lib/__tests__/colorFamily.test.ts` (shared golden
     fixtures) green.
3. **No colour maths for content pages in TypeScript.** SEO/conversion pages consume
   pre-computed JSON (`conversions.json`) built by the Python engine.
4. **The Forge mixer** (`app/forge/page.tsx`, `lib/colorMath.ts`): the RMS
   `mixColorsWeighted` is a *preview-only* approximation. Do not extend it to feed
   matching or recipes; authoritative mixing is backend spectral (see colour-science
   skill). It is currently wired to `MOCK_PAINTS_TO_ADD` — real DB wiring is planned work.
5. **Reticle overlay** (`ReticleReveal.tsx`): renders masks from the backend. Known Bug C
   (small trims produce empty masks) is a backend mask-cleaning issue — do not "fix" it
   frontend-side by hiding empty overlays; surface it honestly until the backend fix lands.

## UI copy rules

1. **British English, always.** Colour, favourite, optimise, personalise, licence (noun) /
   license (verb), armour. Check every string.
2. **Tone: grimdark-playful, Warhammer-literate, never cringe.** Mechanicus flavour on
   Miniscan (cogitators, augurs, the Omnissiah at low intensity), Warp flavour on
   Inspiration. Flavour seasons the copy; it never obscures meaning. An error message must
   still tell the user exactly what went wrong and what to do.
3. **Chromus mascot voice** (pending rollout across loading/error/empty states, blocked on
   assets): short, wry, in-universe quips. One line max. Never blocks or delays
   information. When writing new loading/error/empty states, leave a clearly marked slot
   (e.g. a `chromusLine` prop) so personality copy can land later without refactoring.
4. **Freemium boundaries in copy:** free tier sees the base match only; Pro unlocks the
   full 4-step recipe, brand-swapping, and inventory. Upsell copy is honest and specific —
   name exactly what Pro adds. No dark patterns, no fake urgency.
5. **Zero swatch-source attribution** anywhere in UI, metadata, alt text, or page source
   (core invariant 7).

## Data display conventions

- Paint chips show name, brand, and hex-accurate swatch; measured colours
  (`measured_hex`) take precedence over legacy hex when present.
- ΔE quality bands used across the app: `perfect` / `close` / `fair` / `distant` —
  keep the vocabulary consistent everywhere a match quality is shown.
- Recipes are always rendered in the fixed order **base → highlight → shade → wash**.
- Family names are displayed Capitalised ("Magenta", "Gold"); internal values are
  lowercase. Conversion happens at the display boundary only.

## Step-by-step: any frontend change

1. Confirm which invariants above the change touches; list them.
2. If the change involves `lib/` colour files: treat it as a colour-science change —
   load that skill, follow its fixture-first workflow, and remember `colorAnchors.ts` is
   generated.
3. Build against the shared recipe card / `mode`-prop pattern; theme via tokens.
4. Write all user-facing strings in British English with the correct mode's flavour;
   include a `chromusLine` slot on any new loading/error/empty state.
5. Verify mobile layout first (≈380 px), then desktop.
6. Run `colorFamily.test.ts` if anything under `lib/` changed; run the app and click
   through **both** Miniscan and Inspiration for any shared-component change.
7. Self-check: British English? No swatch-source attribution? No forked components? No TS
   colour maths for content pages? Free/Pro gating respected?
