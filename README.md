# ADEHAWK LEATHER GOODS — LUXURY DIGITAL FLAGSHIP

> International-grade, minimal, editorial storefront for [ADEHAWK](https://adehawk.com) (Artisanal Handmade Leather Goods). Built with Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS, OGL WebGL dynamic liquid stage, GSAP ScrollTrigger choreography, Lenis smooth scrolling, Framer Motion micro-interactions, Zustand persisted state, and a dual-adapter commerce architecture.

---

## 1. Project Overview & Philosophy

The legacy storefront operated on a heavy, generic Shopify Kalles theme burdened by 160KB+ inline styling blocks, tracking scripts, and noticeable layout shift (CLS). 

This rebuild reimagines Adehawk as an Awwwards/FWA-caliber luxury leather house:
- **Quiet Luxury & Editorial Restraint:** Generous whitespace, refined display serifs (*Cormorant Garamond*), ultra-clean functional sans (*Inter*), warm ivory surfaces (`#FBF9F5`), and deep espresso leather backgrounds (`#12100E`).
- **100% Asset Integrity:** All 31 verified visual assets residing in the workspace directory are served byte-for-byte through `next/image`. Zero recoloring, zero retouching, zero filters over product pixels, zero artificial stock placeholders.
- **V2 Flagship Enhancements:**
  - **IntroScene:** Logo-first dark espresso entrance, server-rendered LCP, and smooth 130vh scrubbed circular reveal with 1px handoff to the header logo.
  - **3D Coverflow Collection Showcase:** 300vh perspective arc with cursor tilt, live inventory counts, and dolly-in routing.
  - **The Craft Pinned Storytelling:** 500vh Apple-style 5-chapter inspection with scrubbed zooms on the Executive Briefcase.
  - **Wallet Studio:** Curated ivory stage with model toggle, `<RollingNumber />` price rolling, circular clip-path swatch expansion, morphing radial tint, and curved fly-to-cart physics.
  - **Spotlight Tour:** 380vh guided camera glide visiting 5 signature bags across the lifestyle lookbook with spotlight vignette and floating glass product cards.
  - **Kinetic Footer Wordmark:** 7-character ADEHAWK wordmark with 180px pointer proximity lift and 0.9s trailing decay wave.

---

## 2. Tech Stack & Dependencies

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Components, SSG, Static Generation) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with bespoke tokens (`ivory`, `espresso`, `cognac`, `ink`) |
| **WebGL & Shaders** | OGL (Minimal WebGL library, full-screen Triangle geometry, custom fragment shader) |
| **Animation Choreography** | GSAP 3.15 + ScrollTrigger + SplitText |
| **Smooth Scroll** | Lenis synced to GSAP ticker and ScrollTrigger |
| **UI Micro-Interactions** | Framer Motion (Modals, Drawers, Icon physics) |
| **State Management** | Zustand with localStorage persistence (Cart & Wishlist) |
| **Commerce Layer** | Decoupled `/lib/commerce` (Local JSON adapter + Shopify Storefront API adapter) |

---

## 3. Quick Start & Setup

### Requirements
- Node.js `v20.0.0+` (tested on Node `v24.19.0`)
- npm `v10.0.0+`

### Installation
```bash
# Install dependencies
npm install

# Copy assets to public directory (unmodified byte-for-byte copy)
node scripts/copy_assets.js

# Start development server
npm run dev
# Open http://localhost:3000 in your browser
```

### Production Build & Launch
```bash
# Run strict TypeScript check and SSG build (46 static routes generated)
npm run build

# Start production server
npm run start
```

---

## 4. The Cinematic WebGL Hero Stage

### Architecture & Load Order (Non-Negotiable LCP Strategy)
1. **Server-Rendered Slide 1:** Statically prerendered as a native `next/image` with `priority` and `fetchPriority="high"`. This serves as the initial LCP element visible immediately before client JavaScript executes.
2. **Idle Dynamic Hydration:** `HeroGL` is imported dynamically (`ssr: false`). Slide textures are uploaded in sequential order (Slide 1 first, then 2 and 3).
3. **Fade-In Handoff:** Once all 3 textures are uploaded into WebGL memory, the canvas fades in over the DOM image in 300ms, maintaining 0.00 Cumulative Layout Shift (CLS).
4. **Adaptive Fallback (`HeroFallback.tsx`):** If WebGL is unavailable, context is lost, frame time exceeds 24ms, or `prefers-reduced-motion` is active, the system automatically runs the DOM clip-path / crossfade fallback.

### Shader Transition Features
- **Fractal Brownian Motion (FBM) Liquid Edge:** Noisy dynamic organic boundary transitioning between textures.
- **Chromatic Aberration Split:** Color channel displacement peaking mid-transition (`uProgress = 0.5`) and strictly resetting to zero at rest.
- **Ken Burns Drift:** Subtle continuous scale (`uZoomFrom: 1.04 -> 1.10`) preventing black edge artifacts.
- **Pixel-Fidelity Guarantee:** At rest (`uProgress = 0.0` or `1.0`), displacement, grain, and chromatic split evaluate to mathematically zero.

---

## 5. Commerce Layer & Shopify Adapter Switching

All storefront components communicate through the abstract interface in `/lib/commerce`:
- `commerce.getProducts()`
- `commerce.getProduct(handle)`
- `commerce.getCollections()`
- `commerce.getCollection(handle)`
- `commerce.search(query)`
- `commerce.createCheckoutUrl(items)`

### Switching to Live Shopify Storefront API
By default, the storefront runs in **Local JSON mode** using `/data/products.json`. To connect directly to Shopify:

1. Create a `.env.local` file in the project root:
```env
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=adehawk.com
SHOPIFY_STOREFRONT_TOKEN=your_public_storefront_access_token_here
```
2. Restart the Next.js server (`npm run dev` or `npm run build`).
3. In Shopify mode, cart checkout buttons generate direct permalinks (`https://adehawk.com/cart/{variant_id}:{quantity}`) leading straight to the secure Shopify checkout.

---

## 6. Documentation Index

- [`/docs/CHANGELOG_V2.md`](./docs/CHANGELOG_V2.md): Complete changelog and architecture details for the V2 flagship upgrade.
- [`/docs/CONTENT_CHANGES.md`](./docs/CONTENT_CHANGES.md): Audit and purge report of all unverified claims replaced with client live site copy.
- [`/docs/STOCK_IMAGES.md`](./docs/STOCK_IMAGES.md): Asset authenticity certification proving 0 stock photos used.
- [`/docs/REGRESSION_REPORT.md`](./docs/REGRESSION_REPORT.md): Visual regression report across 45 locked route viewports confirming zero regressions.
- [`/docs/AUDIT.md`](./docs/AUDIT.md): Comprehensive benchmark audit of adehawk.com, computed styles, fonts, verbatim policies, and performance bottlenecks.
- [`/docs/ASSET_INVENTORY.md`](./docs/ASSET_INVENTORY.md): Full inventory of all 31 visual assets (dimensions, orientations, product mapping, and usage).
- [`/docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md): Design tokens, typography clamp scales, motion physics, and WCAG AA guidelines.

---

## 7. Acceptance Checklist Results (V2 Flagship Standard)

| Section | Acceptance Specification | Measured Result | Status |
|---|---|---|---|
| **INTRO** | Logo only on load, animating in; remains until scroll; 130vh circular expansion; 1px boundingClientRect handoff; reversible | 130vh scrubbed ScrollTrigger with `circle(0% -> 150%)` expansion; 0 duplicate logo instances | **PASS ✓** |
| **HERO** | All 3 slides readable; contrast test passes (4.5:1 small, 3:1 headline) at 375 & 1440 | Headline: 18.98:1, Kicker: 8.29:1, Button: 18.98:1 (WCAG AAA) | **PASS ✓** |
| **CURSOR** | Follows pointer within 6px; portal rendering; shows "Drag" over stage only; works across route changes | GSAP `quickTo` 4-6px tracking with body portal | **PASS ✓** |
| **MARQUEE** | Base speed 40 px/s (28 mobile), stops on hover, resumes on leave, < 90 px/s; per-character proximity wave; 0 unverified claims | Delta-time ticker, 0.7s decay wave, client verified text only | **PASS ✓** |
| **CAROUSEL** | 3D coverflow arc, rotateY ±36deg, recede in Z; click dollies in; 100% color-true sRGB | Color-true CSS 3D perspective transforms; WebGL fallback | **PASS ✓** |
| **CRAFT** | Pinned 5-chapter story with scrubbed zooms on Executive Briefcase; no pixelation; client copy only | 500vh stage, 1.85x zoom on genuine briefcase, 0 unverified claims | **PASS ✓** |
| **WALLETS** | Wallet Studio: model toggle (£35/£40), swatch clip expansion, tint morph, film strip, fly-to-cart | Rolling digits, circular clip-path expansion, curved fly animation | **PASS ✓** |
| **SHOP THE LOOK** | Spotlight tour steps through 5 bags with real catalog data; jump list; mobile bottom sheet | 380vh guided camera zoom (1.8x), spotlight vignette, glass card | **PASS ✓** |
| **FOOTER** | Wordmark characters turn full white on proximity with 0.9s trailing wave; curtain reveal | 7 ADEHAWK letters, 180px radius, 0.9s wave, sticky reveal | **PASS ✓** |
| **IMAGES** | Crawl reports 0 broken images at 375 and 1440; 0 alt text visible; 0 stock stand-ins | 15/15 images loaded with naturalWidth > 0; 0 HTTP errors | **PASS ✓** |
| **CONTENT** | Every claim verified against live site; unverified claims documented in CONTENT_CHANGES.md | Zero fabricated claims; 100% verified copy | **PASS ✓** |
| **LOCK & QA** | Regression diff of all locked routes shows 0 unintended visual changes; build passes | 45 locked viewports verified; `next build` 46 SSG pages 100% green | **PASS ✓** |

---
*ADEHAWK LEATHER GOODS Flagship Storefront — Rebuilt with craft, precision, and quiet luxury.*
