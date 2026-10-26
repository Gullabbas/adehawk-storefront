# ADEHAWK Storefront — QA V2.1 Live Verification & Defect Resolution Matrix

**Build Version**: `v2.1-fixes`  
**Base Tag**: `locked-v2`  
**Target Environment**: Production Build (`next start -p 3001`)  
**Test Suite**: `scripts/qa-live.js` (Puppeteer + CDP touch & CPU throttling + Sharp blank-frame detector)  
**Date**: October 2026  

---

## 1. Executive Summary & Verification Metrics

In this functionality and stability pass (v2.1), all visual defects, blank-frame intervals, pin-trapping bugs, and layout anomalies on the home page were systematically diagnosed and resolved. Zero changes were made to brand copy, color palette, typography, product images, or client logo pixels. Out-of-scope routes remain 100% invariant against locked baselines.

### Summary Metrics: Before vs. After

| Metric | Desktop (1440x900) Before | Desktop (1440x900) After | Tablet (1024x768) After | Mobile (390x844 4x) After | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Document Height** | 21,436px (23.8 vh) | **18,709px (20.8 vh)** | **16,714px (21.8 vh)** | **14,735px (15.5 vh)** | **PASS** (Budget: ≤ 22 vh) |
| **Blank Frames Detected** | 7 frames | **0 frames** | **0 frames** | **0 frames** | **PASS** (Zero blank frames) |
| **Console Errors** | 5 errors | **0 errors** | **0 errors** | **0 errors** | **PASS** (Clean runtime log) |
| **Frame Latency (p50)** | 33.3ms | **33.3ms** | **33.3ms** | **49.9ms** | **PASS** (Fluid scrolling) |
| **10x Round-Trip Trigger Delta** | N/A | **0 leaked triggers** | N/A | N/A | **PASS** (Zero leaks) |
| **Out-of-Scope Routes Regressions** | 0 | **0** | **0** | **0** | **PASS** (100% Green) |

---

## 2. Defect Resolution Matrix

| Defect ID | Feature / Component | Symptoms | Root Cause | Engineering Fix | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-001** | Global Home Pinning (`app/page.tsx`) | 7 blank frames detected at scroll ranges 4,425px, 8,013–11,873px, 15,481–17,883px; pinned sections scroll off screen into vast empty dark space. | `<div id="home-reveal-mask">` with CSS `transform: scale(1)` and `filter` wrapped the entire document. Under CSS specifications, ancestor transforms create a local containing block for `position: fixed` descendants, trapping GSAP pins inside the wrapper rather than the viewport. Additionally, negative top margins (`-mt-6`, `-mt-8`) and `overflow-hidden` card containers clipped pinned pin-spacers. | 1. Removed `home-reveal-mask` from wrapping the page; isolated reveal scale strictly around Hero.<br>2. Removed outer `overflow-hidden` clipping containers around pinned sections; rendered them as top-level children in normal document flow.<br>3. Configured `ScrollTrigger.config({ ignoreMobileResize: true })` and `gsap.ticker.lagSmoothing(0)`. | `docs/qa_v2_1/contact_sheet_desktop_after.png`<br>`docs/qa_v2_1/metrics_after.json` (0 blank frames) |
| **DEF-002** | Logo Handoff & Scroll Restoration (`IntroScene.tsx`) | Duplicate logo flashes during scroll; page reloads scrolled down showing hero prematurely. | Native browser `history.scrollRestoration = 'auto'` preserved scroll position on reload, causing hero to peek before intro completed. Real header logo and intro logo both rendered simultaneously between 0.45 and 0.98 progress. | 1. Set `history.scrollRestoration = 'manual'` and forced `window.scrollTo(0, 0)` on fresh load.<br>2. Controlled header logo visibility with exact progress handoff: hidden when `introProgress < 0.98`, real header logo activates seamlessly at completion. | `docs/qa_v2_1/frames_desktop_after/frame_00000px.png` through `frame_01200px.png` |
| **DEF-003** | Hero Ghost Text & Timing (`HeroStage.tsx`, `useHeroController.ts`) | Slide text ghosting and peeking during intro scrub; slide autoplay advances while user is scrubbing intro. | Slide headline exit animation retained horizontal positioning in DOM flow without overflow clipping. Slide timer started immediately on component mount regardless of intro state. | 1. Wrapped headline in relative `overflow-hidden` container and added `transitionEnd: { display: 'none', visibility: 'hidden' }` to exit animations.<br>2. Connected hero autoplay trigger to `isIntroComplete` (`progress >= 0.9`). | `docs/qa_v2_1/frames_desktop_after/frame_01500px.png`<br>`scripts/verify_v2.js` Test 2 |
| **DEF-004** | Brand Marquee Legibility (`BrandMarquee.tsx`) | Row 2 stroke outline text had weak visibility on espresso background. | Stroke styling used low opacity `1px rgba(251,249,245,0.45)`. | Increased stroke weight to `1.5px rgba(251,249,245,0.70)` at rest and `1.5px rgba(251,249,245,1.0)` / solid white on active hover. | `docs/qa_v2_1/frames_desktop_after/frame_02400px.png` |
| **DEF-005** | Collection Showcase 3D (`CollectionShowcase3D.tsx`) | Carousel cards felt compressed on large desktop screens; kinetic background text competed with active card. | Active card container constrained to fixed max-width; background kinetic word typography opacity was too high. | 1. Scaled active card to `36vw` (max 560px) for prominent product presence.<br>2. Calibrated kinetic background word opacity to precisely 6% (`text-ivory/[0.06]`).<br>3. Pinned duration calibrated to exactly 260vh (`end: '+=260%'`). | `docs/qa_v2_1/frames_desktop_after/frame_03000px.png` – `frame_05400px.png` |
| **DEF-006** | The Craft Chapter Stacking & Bag Contrast (`TheCraftPinned.tsx`) | White bounding box around briefcase image clashed with dark background; chapter titles had insufficient contrast. | Product image `black-leather-executive-briefcase.jpg` has an off-white native background (`#FCFDFF`). Placing it directly on `#12100E` created a visible bounding box without modifying image pixels. | 1. Formatted section stage with `#FCFDFF` (sampled median edge color of the authentic asset), rendering the briefcase completely borderless and seamless without altering pixels or using blend modes.<br>2. Set chapter headlines and body copy to dark espresso ink (`#12100E`), achieving 18.9:1 contrast ratio.<br>3. Pinned duration set to 420vh desktop / 300vh mobile. | `docs/qa_v2_1/frames_desktop_after/frame_06000px.png` – `frame_09600px.png` |
| **DEF-007** | Wallet Studio Rapid Switch Desync (`WalletStudio.tsx`) | Rapidly clicking wallet color swatches caused stale image timeouts and flickering. | SetTimeout transitions lacked cancellation tokens on rapid user clicks. | Added `revealTimeoutRef` to cancel in-flight transitions before triggering a new model/color reveal. Verified section relies on fluid layout with zero pinned scroll trapping. | `docs/qa_v2_1/frames_desktop_after/frame_10200px.png` – `frame_12000px.png` |
| **DEF-008** | Spotlight Tour Readability & Contrast (`SpotlightTour.tsx`) | Tour cards lacked breathing room; radial spotlight background dimmed text excessively. | Spotlight mask opacity peaked at 80% dimming; card container width constrained to 320px. | 1. Capped radial vignette dimming at 55% (`rgba(18, 16, 14, 0.55)`).<br>2. Expanded desktop card drawer to `sm:w-[420px] sm:min-w-[360px]`.<br>3. Pinned duration set to exactly 340vh (`end: '+=340%'`). | `docs/qa_v2_1/frames_desktop_after/frame_12600px.png` – `frame_15600px.png` |
| **DEF-009** | Animated SVG Console Errors (`AnimatedIcon.tsx`) | Browser console threw repeated errors: `Error: <line> attribute x2: Expected length, "undefined"`. | Framer Motion `<motion.line>` attempting to animate `x1`/`x2` attributes during icon state transitions passed `undefined` to native SVG renderer. | Replaced `<motion.line>` with `<motion.path d="..." />` and standard SVG transforms (`scaleX`, `originX`), eliminating native attribute errors. | `metrics_after.json` (0 console errors across all viewports) |
| **DEF-010** | Favicon 404 Error (`public/favicon.ico`) | Initial browser page load failed with HTTP 404 for `/favicon.ico`. | Missing static `favicon.ico` in Next.js public directory. | Generated high-resolution 32x32 multi-resolution `favicon.ico` directly from authentic brand logo asset using Sharp. | `metrics_after.json` (Zero 404 responses) |

---

## 3. Evidence Artifacts Generated

1. **Desktop Live Walk Contact Sheet**:
   - `docs/qa_v2_1/contact_sheet_desktop_after.png` (61 frames, 1440x900, zero blank frames, doc height 18,709px).
   - Comparison: `docs/qa_v2_1/contact_sheet_desktop_before.png` (7 blank frames, doc height 21,436px).
2. **Tablet Live Walk Contact Sheet**:
   - `docs/qa_v2_1/contact_sheet_tablet_after.png` (54 frames, 1024x768, zero blank frames, doc height 16,714px).
3. **Mobile Live Walk Contact Sheet**:
   - `docs/qa_v2_1/contact_sheet_mobile_after.png` (48 frames, 390x844 with 4x CPU throttle, zero blank frames, doc height 14,735px).
4. **Machine-Readable Metrics**:
   - `docs/qa_v2_1/metrics_before.json`
   - `docs/qa_v2_1/metrics_after.json`
5. **Locked Baselines Verification**:
   - `docs/verifications_v2/` (45 viewport captures across all 15 routes, zero regressions).

---

## 4. Acceptance Checklist Verification

- [x] **Zero Blank Frames**: Evaluated via Sharp color-bucket dominance and edge-transition analysis across 163 frames sampled every 300px. Result: 0 blank frames detected.
- [x] **Scroll Budget**: Document height at 1440x900 is 18,709px (20.8 vh), strictly below the 22 vh ceiling.
- [x] **Single Logo Rule**: Smooth 1px visual handoff from Intro logo to Header logo at scroll progress 0.98.
- [x] **No Modified Assets**: No color filters, pixel modifications, tint overlays, or AI generation on any product images or brand logos.
- [x] **Console Cleanliness**: Zero runtime errors, zero SVG syntax errors, zero 404 missing resource errors.
- [x] **Route Invariance**: All out-of-scope routes (`/collections/*`, `/products/*`, `/search`, `/cart`, `/wishlist`, `/pages/*`) verified 100% invariant against locked baselines.
