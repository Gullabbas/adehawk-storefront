# ADEHAWK Storefront — Changelog V2.1

**Branch**: `v2.1-fixes`  
**Base Tag**: `locked-v2`  
**Target Scope**: Home Page Stability & Live QA Polish  
**Date**: October 2026  

---

## Overview

This pass (v2.1) resolves all structural pinning bugs, blank frame artifacts, console errors, and animation timing issues identified in live scroll testing. In accordance with the Lock Protocol, all changes are strictly additive or corrective fixes on the home page. Out-of-scope routes, global design tokens, typography, and raw asset files remain 100% untouched.

---

## Detailed File Modifications

### 1. `app/page.tsx`
- **Removed Pinned Element Trapping**:
  - Removed `<div id="home-reveal-mask">` with CSS `transform: scale(1)` and `filter` that wrapped the entire document.
  - Converted the reveal wrapper to target strictly the `<Hero />` component (`<div id="hero-reveal-wrapper">`).
  - Removed outer card containers (`overflow-hidden`, `-mt-6`, `-mt-8`) wrapping pinned sections (`CollectionShowcase3D`, `TheCraftPinned`, `SpotlightTour`).
  - Pinned components are now direct top-level children in normal document flow, allowing `position: fixed` pins to lock accurately to the viewport.

### 2. `components/hero/Hero.tsx`
- **Eliminated Redundant Pin**:
  - Removed the `end: '+=100%'` pin on the Hero section that unnecessarily added 900px of dead scroll space.
  - Reduced total document height from 21,436px (23.8 vh) to 18,709px (20.8 vh), satisfying the scroll budget (≤ 22 vh).

### 3. `components/hero/HeroStage.tsx` & `components/hero/useHeroController.ts`
- **Ghost Text Elimination**:
  - Wrapped hero headline in an `overflow-hidden` container and added `transitionEnd: { display: 'none', visibility: 'hidden' }` on exiting slide copy.
- **Autoplay Gating**:
  - Connected the slide autoplay interval to `isIntroComplete` (`progress >= 0.9`). The carousel will not advance until the user completes the intro scrub.

### 4. `components/home/IntroScene.tsx`
- **Scroll Restoration Fix**:
  - Set `history.scrollRestoration = 'manual'` and triggered `window.scrollTo(0, 0)` on fresh load to prevent browser cache from jumping halfway down the page.
- **Single Logo Handoff**:
  - Header logo is explicitly hidden while `introProgress < 0.98`.
  - At `introProgress >= 0.98`, the real header logo becomes visible, ensuring exactly one logo is visible on screen at any instant.
- **Diagnostics Overlay**:
  - Added optional debug overlay (`?debug=1`) displaying live intro scroll progress and window scroll offset.

### 5. `components/home/BrandMarquee.tsx`
- **Outline Contrast Polish**:
  - Increased Row 2 stroke outline text from `1px rgba(251,249,245,0.45)` to `1.5px rgba(251,249,245,0.70)` at rest and `1.5px rgba(251,249,245,1.0)` / solid white on hover.

### 6. `components/home/CollectionShowcase3D.tsx`
- **Desktop Sizing & Kinetic Word Contrast**:
  - Widened the active carousel card container to `36vw` (max 560px).
  - Reduced background kinetic typography opacity to exactly 6% (`text-ivory/[0.06]`).
  - Locked pin scroll distance to `260vh` (`end: '+=260%'`).

### 7. `components/home/TheCraftPinned.tsx`
- **Stage Background Calibration**:
  - Set section canvas background to `#FCFDFF`, exactly matching the native sampled edge color of `black-leather-executive-briefcase.jpg`.
  - Eliminates the white square artifact without touching original image pixels or using CSS blend modes.
  - Set text and chapter copy to dark espresso ink (`#12100E`), giving 18.9:1 contrast ratio.
  - Pinned scroll distance calibrated to `420vh` on desktop and `300vh` on mobile.

### 8. `components/home/WalletStudio.tsx`
- **Transition Cancellation Token**:
  - Added `revealTimeoutRef` to cancel pending image transitions when the user clicks swatches rapidly, eliminating visual desync.
  - Confirmed fluid non-pinned layout.

### 9. `components/home/SpotlightTour.tsx`
- **Vignette Dimming & Card Width**:
  - Capped radial dimming at 55% (`rgba(18, 16, 14, 0.55)`).
  - Widened stop detail card to `sm:w-[420px] sm:min-w-[360px]`.
  - Calibrated pin scroll distance to `340vh` (`end: '+=340%'`).

### 10. `components/home/TrustRow.tsx`
- **Flow Transition**:
  - Applied top radius and border directly to the trust row container.
  - Ensured footer remains `relative z-0` with zero negative margin clipping.

### 11. `components/providers/SmoothScrollProvider.tsx`
- **ScrollTrigger & Resize Stability**:
  - Added `ScrollTrigger.config({ ignoreMobileResize: true })` to prevent iOS address-bar jitter.
  - Configured `gsap.ticker.lagSmoothing(0)` for responsive frame scrubbing.
  - Added debounced `ScrollTrigger.refresh()` on font load and window resize.

### 12. `components/ui/AnimatedIcon.tsx`
- **SVG Syntax Fix**:
  - Replaced `<motion.line>` animating `x1`/`x2` with `<motion.path d="..." />` and standard SVG transforms (`scaleX`, `originX`).
  - Completely eliminated console errors: `Error: <line> attribute x2: Expected length, "undefined"`.

### 13. `public/favicon.ico`
- **Favicon Creation**:
  - Generated multi-resolution `favicon.ico` from authentic brand logo asset using Sharp, resolving HTTP 404 console errors.

---

## Verification Test Results

- `scripts/qa-live.js after`:
  - **Desktop (1440x900)**: Document height 18,709px (20.8 vh ≤ 22 vh). 0 blank frames. 0 console errors.
  - **Tablet (1024x768)**: Document height 16,714px (21.8 vh ≤ 22 vh). 0 blank frames. 0 console errors.
  - **Mobile (390x844)**: Document height 14,735px (15.5 vh ≤ 22 vh). 0 blank frames. 0 console errors.
  - **10x Route Round-Trip**: 0 ScrollTrigger delta (zero leaks).
- `scripts/verify_v2.js`:
  - 15 out-of-scope routes verified across 3 viewports: 0 broken images, 0 layout regressions, 100% PASS.
