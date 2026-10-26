# ADEHAWK DESIGN SYSTEM: QUIET LUXURY

A bespoke, editorial design language engineered for **ADEHAWK LEATHER GOODS** — an artisanal British handmade leather house. Inspired by European high-fashion editorial houses, minimalist typography, tactile materials, and organic liquid motion.

---

## 1. Principles

1. **Material Truth**: Leather has grain, weight, and history. The design reflects this with warm earthen tones, spacious margins, and unhurried motion.
2. **Restraint over Clutter**: Every element on screen must earn its place. No unnecessary badges, no aggressive popups, no garish countdown timers.
3. **Pixel Fidelity**: Authentic client product images and logo remain untouched in their original colors, lighting, and textures.
4. **Cinematic Motion**: Transitions feel physical, organic, and fluid — using fluid noise shader reveals, masked text choreography, and inertial magnetic interactions.
5. **Universal Accessibility**: WCAG 2.2 AA compliant, full keyboard traversal, zero wheel hijacking, and strict respect for `prefers-reduced-motion`.

---

## 2. Color Palette & Semantic Tokens

### Color Tokens (CSS Variables)

| Token | Hex / Value | Semantic Role |
|---|---|---|
| `--color-ivory` | `#FBF9F5` | Base page background, canvas default |
| `--color-ivory-subtle` | `#F4EFEA` | Elevated card background, alternating rows |
| `--color-espresso` | `#161311` | Dark editorial section background, footer |
| `--color-espresso-surface` | `#211D1A` | Elevated dark cards, borders on dark |
| `--color-ink` | `#12100E` | Primary high-contrast text |
| `--color-ink-muted` | `#6E6862` | Secondary captions, breadcrumbs, descriptions |
| `--color-cognac` | `#8E4A23` | Signature leather accent, active indicators |
| `--color-cognac-hover` | `#A2582A` | Interactive hover highlights |
| `--color-border` | `rgba(18, 16, 14, 0.08)` | Light hairline borders |
| `--color-border-dark` | `rgba(251, 249, 245, 0.12)` | Dark mode hairline borders |

### Contrast & Legibility
All text pairings exceed WCAG 2.2 AA contrast ratios:
- Light mode (`--color-ink` on `--color-ivory`): **14.8:1** (AAA standard)
- Dark mode (`--color-ivory` on `--color-espresso`): **16.1:1** (AAA standard)
- Cognac accent (`--color-cognac` on `--color-ivory`): **5.6:1** (AA standard)

---

## 3. Typography Hierarchy

### Typefaces
- **Editorial Display Serif**: *Cormorant Garamond* (or *Fraunces*). Graceful serifs, high contrast strokes, romantic capitals.
- **Modern Functional Sans**: *Geist* / *Inter*. Neutral, highly legible at micro-scales, tabular figure support for prices.

### Fluid Type Scale (`clamp()`)

| Level | Size Definition | Line Height | Letter Spacing | Font Family |
|---|---|---|---|---|
| **Display 1 (Hero)** | `clamp(2.75rem, 7vw, 7.5rem)` | `1.02` | `-0.02em` | Serif |
| **Heading 1** | `clamp(2.25rem, 5vw, 4.5rem)` | `1.08` | `-0.015em` | Serif |
| **Heading 2** | `clamp(1.75rem, 3.5vw, 3rem)` | `1.15` | `-0.01em` | Serif |
| **Heading 3** | `clamp(1.25rem, 2vw, 1.75rem)` | `1.25` | `0em` | Serif |
| **Subhead** | `clamp(1.125rem, 1.5vw, 1.35rem)` | `1.45` | `0em` | Sans |
| **Body Large** | `1.125rem (18px)` | `1.6` | `0em` | Sans |
| **Body Regular** | `1rem (16px)` | `1.6` | `0em` | Sans |
| **Caption / Meta** | `0.875rem (14px)` | `1.5` | `0.02em` | Sans |
| **Micro Kicker** | `0.75rem (12px)` | `1.4` | `0.3em` | Sans Uppercase |

---

## 4. Iconography & Animated Micro-Interactions

Icons are strictly limited to functional actions. Every icon is wrapped in the universal `<AnimatedIcon />` component, triggering bespoke SVG spring animations on hover/focus/tap:
1. **Search**: Lens tilts at 18° and vibrates gently.
2. **Cart Bag**: Bag drops with an inertia bounce, and badge count springs scale `0 -> 1.25 -> 1.0`.
3. **Wishlist Heart**: Heart fills from center with a soft heartbeat expansion.
4. **Account**: Silhouette nods smoothly.
5. **Arrow Right / Left**: Shaft lengthens by 4px while tip translates forward.
6. **Plus / Cross**: Rotates 45° with a bounce to transform into a dismiss cross.
7. **Contact / Phone / Mail**: Subtle ring-shake keyframe vibration.
8. **Menu / Drawer Hamburger**: Top and bottom bars fold cleanly into an 'X'.

---

## 5. Motion Tokens & Physics

### Timing & Curves
- **Standard Ease**: `cubic-bezier(0.22, 1, 0.36, 1)` (Smooth decelerating natural stop)
- **Fast Micro Interaction**: `250ms - 350ms`
- **Container / Drawer Reveal**: `500ms - 650ms`
- **Editorial Section Unveil**: `800ms - 1200ms`
- **SplitText Headline Choreography**:
  - Outgoing lines: `yPercent 0 -> -110`, `0.6s`, `stagger: 0.05`, `power3.in`
  - Incoming lines: `yPercent 110 -> 0`, `0.9s`, `stagger: 0.08`, `expo.out`

### Accessibility & Reduced Motion
When `prefers-reduced-motion: reduce` is detected:
- WebGL shader distortion, grain, and displacement are completely disabled.
- Transitions default to an accessible `400ms` linear opacity crossfade.
- Autoplay in Hero and carousels is permanently paused.
- Parallax transforms and cursor magnetic physics are bypassed.
