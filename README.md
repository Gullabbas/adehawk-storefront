# ADEHAWK LEATHER GOODS — LUXURY DIGITAL FLAGSHIP

> International-grade, minimal, editorial storefront for [ADEHAWK](https://adehawk.com) (Artisanal British Handmade Leather Goods). Built with Next.js 15 App Router, React 19, TypeScript (strict), Tailwind CSS, OGL WebGL dynamic liquid stage, GSAP ScrollTrigger choreography, Lenis smooth scrolling, Framer Motion micro-interactions, Zustand persisted state, and a dual-adapter commerce architecture.

---

## 1. Project Overview & Philosophy

The legacy storefront operated on a heavy, generic Shopify Kalles theme burdened by 160KB+ inline styling blocks, tracking scripts, and noticeable layout shift (CLS). 

This rebuild reimagines Adehawk as an Awwwards/FWA-caliber luxury leather house:
- **Quiet Luxury & Editorial Restraint:** Generous whitespace, refined display serifs (*Cormorant Garamond*), ultra-clean functional sans (*Inter*), warm ivory surfaces (`#FBF9F5`), and deep espresso leather backgrounds (`#161311`).
- **100% Asset Integrity:** 31 verified visual assets residing in the workspace directory are served byte-for-byte through `next/image`. Zero recoloring, zero retouching, zero filters over product pixels, zero artificial stock placeholders.
- **Cinematic WebGL Stage:** Full-viewport (100svh) WebGL hero featuring custom FBM noise liquid transitions, drag-scrubbed physics, SplitText line choreography, and ScrollTrigger scale-to-card handoff.
- **Micro-Interaction System:** Custom `<AnimatedIcon />` component providing physics-based spring animations for search tilt, cart bag bump, heart pulse, account nod, and contact ring-shake while honoring `prefers-reduced-motion`.

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

### Interaction Modes
- **Drag Scrubbing:** Pointer capture allows dragging horizontally to scrub the transition in real time with velocity-based commitment thresholds (0.3 progress or 0.5 px/ms release).
- **Autoplay Loop:** 6500ms duration driving an SVG circular progress ring and right-hand vertical label rail.
- **Accessibility:** Pauses automatically on hover, tab blur, keyboard focus, and explicit WCAG Pause/Play toggle.

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

## 6. How to Add New Products & Assets

Strict adherence to the zero-pixel-alteration rules is maintained:
1. Place original product imagery (`.webp`, `.jpg`, `.png`) in `/public/assets/products/`.
2. Do **not** apply destructive image filters or overlays.
3. Open `/data/products.json` and append a product entry:
```json
{
  "id": "bag-new-piece",
  "title": "Natural Tan Leather Travel Tote",
  "handle": "natural-tan-leather-travel-tote",
  "price": 95,
  "compareAtPrice": 120,
  "currency": "GBP",
  "category": "bags",
  "collectionHandles": ["bags", "all"],
  "featured": true,
  "images": ["/assets/products/New Bag Image.webp"],
  "colors": [
    { "name": "Natural Tan", "hex": "#8C5A37", "image": "/assets/products/New Bag Image.webp" }
  ],
  "description": "Handcrafted full-grain leather tote designed for daily commuting.",
  "specs": {
    "Material": "100% Full Grain Cowhide Leather",
    "Dimensions": "42cm x 32cm x 12cm",
    "Origin": "Handcrafted in UK"
  },
  "features": [
    "Reinforced rolled leather handles",
    "Internal zippered security pocket"
  ]
}
```
4. Run `npm run build` to statically generate the new PDP route.

---

## 7. Documentation Index

- [`/docs/AUDIT.md`](./docs/AUDIT.md): Comprehensive benchmark audit of adehawk.com, computed styles, fonts, verbatim policies, and performance bottlenecks.
- [`/docs/ASSET_INVENTORY.md`](./docs/ASSET_INVENTORY.md): Full inventory of all 31 visual assets (dimensions, orientations, product mapping, and usage).
- [`/docs/DESIGN_SYSTEM.md`](./docs/DESIGN_SYSTEM.md): Design tokens, typography clamp scales, motion physics, and WCAG AA guidelines.

---

## 8. Acceptance Checklist Results

| Specification Item | Status | Verification Evidence |
|---|---|---|
| **Hero Slide 1 LCP Server-Rendered** | **PASS** | Verified in initial HTML payload with `fetchPriority="high"` before client JS |
| **Canvas Fade-in Post Texture Upload** | **PASS** | Verified via `onReady` hook fading canvas over DOM; 0 CLS |
| **1.4s Liquid Shader Transition** | **PASS** | Captured mid-transition screenshot (`02_desktop_hero_transition_mid.png`) |
| **Drag Scrub Physics** | **PASS** | Pointer event capture with velocity and distance commit thresholds |
| **SplitText Choreography** | **PASS** | Masked line translateY reveals and tracking kicker expansion |
| **Autoplay with Circular Ring Progress** | **PASS** | SVG stroke-dashoffset linked to GSAP tween; pauses on hover & button |
| **Keyboard Accessibility** | **PASS** | ArrowLeft / ArrowRight navigation with loop support |
| **Scroll Handoff Pin & Scale** | **PASS** | ScrollTrigger scales stage from 1.0 to 0.88 with rounded corners |
| **Accessible Fallback** | **PASS** | Gracefully activates when WebGL is absent or reduced-motion is requested |
| **Zero Pixel Alteration** | **PASS** | Client imagery untouched in source and served 1:1 |
| **All Required Routes Exist** | **PASS** | All 46 SSG routes built and verified with HTTP 200 OK |
| **Production Build Pass** | **PASS** | `next build` passes clean with zero lint or TypeScript warnings |

---
*ADEHAWK LEATHER GOODS Flagship Storefront — Rebuilt with craft, precision, and quiet luxury.*
