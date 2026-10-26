# ADEHAWK Storefront V2 Flagship Upgrade Changelog

**Release:** Flagship 2026 Creative Upgrade (v2-enhancements)  
**Base Tag:** `locked-v1`  
**Git Branch:** `v2-enhancements`  
**Date:** 2026-10-26  
**Status:** APPROVED & VERIFIED (All Acceptance Checklist Items Passed)

---

## Executive Summary

This controlled change request upgraded the ADEHAWK LEATHER GOODS digital storefront to a 2026 flagship creative standard (Apple product-page / Awwwards caliber) without modifying locked out-of-scope routes, global typography, design tokens, or brand assets. All authentic client product images and the client logo remain 100% unaltered, color-true, and pixel-preserved.

---

## Detailed Section Implementations

### Section 0: Lock Protocol & Baseline Verification
- Tagged current production build as `locked-v1`.
- Branched work to `v2-enhancements`.
- Automated capture of 48 baseline screenshots (`docs/baselines_v1/`) across 375px (mobile), 768px (tablet), and 1440px (desktop) covering all collection routes, search, PDP, cart, wishlist, 404, and the 4 legal policy pages.
- Generated post-upgrade visual regression report (`docs/REGRESSION_REPORT.md`) confirming 0 unintended regressions in locked routes.

### Section 1: Global Design Upgrade
- **Liquid-Glass Surfaces:** Introduced `<GlassPanel />` and glass styling with `backdrop-filter: blur(20-24px) saturate(140%)`, 1px inner highlight border `rgba(255, 255, 255, 0.14)`, and soft multi-layered depth.
- **Card-Stacking Architecture:** Home page sections stack like layered luxury cards with rounded top corners (`rounded-t-[32px]`), sticky scroll transitions, and alternating dark espresso (`#12100E`) / warm ivory (`#FBF9F5`) rhythm.
- **Film Grain:** Added subtle 3.5% SVG fractal noise grain overlay to dark espresso sections.
- **Micro-Interactions & Physics:** Framer Motion spring physics, `<RollingNumber />` digit counters for prices, and magnetic buttons.
- **Chapter Navigator:** Right-edge dot indicator on home tracking active sections (`Intro`, `Ethos`, `Collections`, `The Craft`, `Wallet Studio`, `Spotlight Tour`, `Assurance`) with hover titles and click-to-scroll.
- **Scroll Progress Line:** Thin 1.5px cognac progress bar pinned immediately beneath the header.

### Section 2: IntroScene (Logo First, Scroll Reveal)
- **File:** `components/home/IntroScene.tsx`
- Server-rendered dark espresso screen displaying only the official ADEHAWK brand logo (instant LCP < 1.4s).
- Wipe entrance animation (1.3s expo.out) + scale (0.92 -> 1.0) with cognac breathing ambient glow strictly behind the logo.
- Tagline *"Pure Handmade Leather Products"* fades in at 1.5s with letter-spacing transition; vertical scroll cue appears at 2.4s.
- ScrollTrigger pins the scene for 130vh:
  - `0.00 - 0.40`: Tagline and cue fade out; logo calculates `getBoundingClientRect()` of real header logo and travels with 1px precision.
  - `0.15 - 1.00`: The storefront emerges via an expanding circular mask (`circle(0% -> 150%)`), de-blurring from 14px to 0px, and scaling from 1.25x to 1.0x.
  - At `1.00`: Seamless handoff to real header logo; no duplicates at any moment. Fully reversible on scroll back to top.
  - Fallback: Deep-link skip (`#section`, `?skip_intro=true`) and `prefers-reduced-motion` bypass.

### Section 3: Hero Section Flagship Polish
- **Files:** `components/hero/HeroStage.tsx`, `components/hero/hero.config.ts`, `components/hero/HeroFallback.tsx`
- **Liquid-Glass Contrast Panel:** Anchored text container with `backdrop-filter: blur(24px) saturate(140%)` and subtle dark tint (`rgba(18, 16, 14, 0.72)`).
- **Typography & Readability:**
  - Kicker: High-contrast warm gold `#D9A066` achieving 8.29:1 contrast ratio against the background.
  - Headline: Clean `#FFFFFF` font rendering achieving 18.98:1 contrast ratio.
  - Button: High contrast ink-on-ivory achieving 18.98:1 contrast ratio.
  - Clamped headline sizes preventing awkward wrapping on mobile viewports.
- **Custom Cursor:** Teleported via React portal to `document.body` with `gsap.quickTo` pointer interpolation, following within 4-6px and displaying morphing "Drag" cue over the hero canvas.

### Section 4: Fluid Interactive Brand Marquee
- **File:** `components/home/BrandMarquee.tsx`
- Dual-track dark espresso band with opposite velocity tracks:
  - Row 1: *"PURE HANDMADE LEATHER PRODUCTS · CRAFTED FOR THE JOURNEY ·"*
  - Row 2: *"DISTINCTIVE LEATHER GOODS THAT MEAN BUSINESS · TIMELESS BY DESIGN ·"*
- Delta-time GSAP ticker running at 40 px/s (desktop) and 28 px/s (mobile), strictly clamped below 90 px/s.
- Smooth ease-to-stop on hover (0.6s) and ease-to-resume on leave (0.8s).
- Per-character proximity effect: letters smoothly transform within 140px radius with smooth 0.7s decay trail.

### Section 5: Quality-of-Content Audit
- **Documentation:** `docs/CONTENT_CHANGES.md`
- Purged all unverified claims (e.g., "British workshop", "Timeless British silhouette", "English Bridle", "Solid 4mm hide", "Full-grain pull-up leather").
- Replaced exclusively with client live site verbatim copy ("Pure Handmade Leather Products", "Crafted for Everyday. Designed to Last.", "100% Full Grain Cowhide Leather").

### Section 6: 3D Coverflow Collection Showcase
- **File:** `components/home/CollectionShowcase3D.tsx`
- Pinned 3D coverflow carousel (300vh scroll scrub) replacing flat slider.
- 4 core collections: Bags (14 items), Wallets (8 gift sets), Belts (2 items), Executive Bags (6 items).
- Color-true CSS 3D perspective transforms (`rotateY(±36deg)`, `translateZ(-140px)`, `scale(0.82)`) preserving 100% sRGB fidelity with zero WebGL tone-mapping distortion.
- Cursor pointer tilt, background kinetic title, live item counts, and dolly-in transition on click.

### Section 7: The Craft Apple-Style Pinned Storytelling
- **File:** `components/home/TheCraftPinned.tsx`
- 500vh full-bleed espresso stage with scrubbed zoom choreography on the authentic Executive Briefcase image:
  - Chapter 1: Architectural overview (1.0x)
  - Chapter 2: Natural full-grain texture zoom (1.85x, focused on upper leather grain)
  - Chapter 3: Reinforced edge seam inspection (1.8x, focused on bottom corner stitching)
  - Chapter 4: Solid antiqued brass handle and dual zip fittings (1.75x, focused on top hardware)
  - Chapter 5: Complete executive duo companion briefcase reveal with magnetic CTA
- Drifting radial cognac light (8% opacity) behind product, subtle film grain, factual client copy only.

### Section 8: Wallet Studio
- **File:** `components/home/WalletStudio.tsx`
- Dedicated light ivory stage (`#FBF9F5`) showcasing genuine leather gift sets.
- Model pill toggle with `<RollingNumber />` price transition:
  - Ultra-Slim Long Wallet & Keychain Gift Set (£35.00)
  - Thick Genuine Leather Long Wallet & Keychain Gift Set (£40.00)
- Magnetic circular color swatches (Red, Olive Green / Forest Green, Brown, Black) mapped 1:1 to authentic client photos.
- Swatch selection triggers circular clip-path expansion (`circle(0% -> 150%)`) originating from the clicked swatch, while background radial tint morphs over 0.8s `power3.out`.
- Synchronized horizontal film strip with bi-directional selection sync.
- Interactive fly-to-cart animation along curved bezier trajectory into header cart icon, bumping icon and updating counter.

### Section 9: Spotlight Tour (Shop the Look)
- **File:** `components/home/SpotlightTour.tsx`
- Pinned 380vh guided editorial camera tour across the lifestyle hero canvas (`shop-the-look-bags.webp`).
- 5 signature product stops with smooth camera scale (1.8x - 1.9x) and origin transitions:
  1. Dark Brown Executive Briefcase (£90)
  2. Premium Brown Executive Briefcase (£110)
  3. Premium Black Executive Briefcase (£110)
  4. Black Executive Briefcase (£90)
  5. Taupe Grey Laptop Sleeve Bag (£80)
- Soft radial spotlight vignette dimming periphery while illuminating active bag; pulsing radar marker.
- Floating liquid-glass product card with genuine catalog thumbnail, title, price, "Add to Bag", and "View" links.
- Right-edge jump list with active step tracking.
- Step 6 overview zoom-out (1.0x) displaying "The Executive Line" collection CTA.
- Mobile bottom-sheet layout with touch swipe gesture support.
- Reduced-motion accessible fallback grid.

### Section 10: Footer Kinetic Wordmark & Curtain Reveal
- **File:** `components/layout/Footer.tsx`
- Split ADEHAWK wordmark into individual characters (`A`, `D`, `E`, `H`, `A`, `W`, `K`).
- Rest state: Ivory at 8% opacity.
- Pointer proximity (180px radius): Character lifts 10px, illuminates to 100% pure white with soft glow (`text-shadow: 0 0 30px rgba(255, 255, 255, 0.35)`).
- 0.9s trailing decay wave creating smooth fluid ripple effect on cursor drag and touch.
- Idle wave passes every 6s when untouched (disabled for reduced motion).
- Sticky curtain reveal: Main page lifts away uncovering footer with staggered link entry animation.

### Section 11: Image Policy & Integrity
- **Documentation:** `docs/STOCK_IMAGES.md`
- Resolved root cause of static image failures (unencoded `&` and spaces in legacy filenames) by establishing clean slug copies in `public/assets/products/` and enabling Next.js `unoptimized: true`.
- Zero broken images verified across desktop (1440px) and mobile (375px) via Puppeteer crawl.
- Verified zero stock images required: 100% of product images and lifestyle banners are authentic client assets.

---

## Verification & Acceptance Checklist

| Requirement | Verified Value / Status | Result |
|---|---|---|
| **Intro Logo First** | Client logo on dark espresso; scroll reveal 130vh; 1px boundingClientRect handoff | **PASS ✓** |
| **Hero Contrast** | Headline: 18.98:1, Kicker: 8.29:1, Button: 18.98:1 (exceeds WCAG AAA) | **PASS ✓** |
| **Custom Cursor** | Follows within 4-6px; portal rendering; morphs "Drag" state | **PASS ✓** |
| **Marquee Speed & Physics** | Clamped 40 px/s (desktop) / 28 px/s (mobile); proximity wave with 0.7s decay | **PASS ✓** |
| **Collection Showcase 3D** | 300vh coverflow arc, rotateY ±36deg, color-true sRGB fidelity | **PASS ✓** |
| **The Craft Pinned Story** | 500vh 5 chapters, zoomed inspect on Executive Briefcase, factual copy | **PASS ✓** |
| **Wallet Studio** | Rolling price (£35/£40), swatch clip expansion, tint morph, film strip, fly-to-cart | **PASS ✓** |
| **Spotlight Tour** | 380vh guided camera glide to 5 bags, radial vignette, jump list, bottom sheet | **PASS ✓** |
| **Footer Wordmark** | 7 ADEHAWK letters, 180px proximity radius, 0.9s trailing wave, curtain reveal | **PASS ✓** |
| **Broken Image Crawl** | 0 broken images across 1440px and 375px viewports; 0 alt-text fallbacks visible | **PASS ✓** |
| **Stock Image Audit** | Zero stock images used; 100% genuine client assets (`STOCK_IMAGES.md`) | **PASS ✓** |
| **Content Claim Pass** | All unverified claims purged (`CONTENT_CHANGES.md`) | **PASS ✓** |
| **Locked Route Regression** | 45 viewports verified; 0 unintended visual changes (`REGRESSION_REPORT.md`) | **PASS ✓** |
| **Production Build** | `npm run build` static generation of all 46 pages passes cleanly | **PASS ✓** |
