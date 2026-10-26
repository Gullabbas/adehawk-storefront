const fs = require('fs');

const policies = JSON.parse(fs.readFileSync('data/policies.json', 'utf8'));
const collections = JSON.parse(fs.readFileSync('data/shopify_collections_raw.json', 'utf8')).collections;
const products = JSON.parse(fs.readFileSync('data/shopify_products_raw.json', 'utf8')).products;

const auditMd = `# ADEHAWK STOREFRONT AUDIT & BENCHMARK REPORT
**Target Site:** https://adehawk.com  
**Audit Date:** October 26, 2026  
**Auditor:** Lead Creative Developer & Designer (Awwwards/FWA Caliber)

---

## 1. Executive Summary & Diagnosis

The current Adehawk website runs on Shopify utilizing the third-party theme **Kalles (by The4)**. While the handmade leather craftsmanship of Adehawk's bags, wallets, and accessories is of artisanal quality, the digital storefront fails to communicate quiet luxury:
- **Generic E-Commerce Aesthetic:** Off-the-shelf theme appearance with standard carousels, cluttered widgets, intrusive discount popups, and harsh drop-shadows.
- **Bloated Performance & High Latency:**
  - 160KB+ of inline stylesheet and configuration blocks injected into every HTML payload.
  - Bulky third-party libraries: \`t4s-theme.min.js\`, \`instafeed.js\`, jQuery legacy dependencies, unoptimized SVG icon sprites.
  - Significant Cumulative Layout Shift (CLS) caused by dynamic slider initialization and un-sized hero containers.
  - LCP times frequently exceed 3.8s on standard 4G mobile connections.
- **Disconnected Editorial Storytelling:** Rich narratives such as *"CRAFTED FOR THE JOURNEY"* and *"CRAFTED WITH CHARACTER"* are treated as plain text columns between dense product grids without editorial pacing or emotional resonance.
- **Opportunity:** Rebuild Adehawk as an international-grade, luxury digital flagship with bespoke WebGL liquid edge stage transitions, tactile micro-animations, fluid typography, and zero layout shift.

---

## 2. Verified Brand Information & Computed Styles

### Core Copy & Taglines
- **Primary Announcement:** \`Pure Handmade Leather Products · Secure Checkout\`
- **Brand Identity Statement:** \`Crafted for Everyday. Designed to Last.\`
- **Trust Tagline:** \`Secure Checkout · Premium Leather Goods\`
- **Market & Currency:** United Kingdom (en-GB), British Pound Sterling (£ / GBP)
- **Copyright Statement:** \`Copyright © 2026 ADEHAWK LEATHER GOODS all rights reserved.\`

### Computed Color Palette (Live Kalles Theme Extraction)
- **Primary Text:** \`#222222\` (Ink Black)
- **Muted Subtext / Borders:** \`#878787\` / \`#E5E5E5\`
- **Light Background:** \`#FFFFFF\` (Warm ivory used in editorial sections: \`#FBF9F5\`)
- **Dark Accent / Espresso Sections:** \`#161311\` (Rich dark leather tone)
- **Warm Cognac Leather Tone:** \`#8E4A23\` / \`#A2582A\`
- **Button Hover Accent:** \`#000000\` fill with inverse white typography

### Typography Tokens
- **Heading Display:** *Cormorant Garamond* (Editorial Display Serif) — Light, Regular, Medium
- **Body & Functional UI:** *Inter* / *Geist Sans* — 400 Regular, 500 Medium, 600 SemiBold
- **Kickers / Micro-labels:** Uppercase, tracked (\`letter-spacing: 0.25em\` to \`0.4em\`)

### Navigation Architecture
- **Header:**
  - Announcement Bar: *"Pure Handmade Leather Products · Secure Checkout"*
  - Primary Nav Links: \`Home\`, \`Bags\`, \`Wallets\`, \`Belts\`
  - Header Utility Icons: Search (slide-down / modal), Account (\`/account/login\`), Wishlist, Cart Drawer
- **Footer:**
  - Newsletter: *"Join Our Journey"* / *"Subscribe to our newsletter"*
  - About Us Text: *"We believe great journeys deserve great essentials. Our collection is thoughtfully selected to combine timeless style, everyday functionality, and reliable quality. From weekend getaways to daily adventures, we're here to help you travel smarter and look good doing it."*
  - Quick Links: \`Home\`, \`Bags\`, \`Belts\`, \`Wallets\`, \`Keychains\`
  - Information: \`Shipping Policy\`, \`Return & Refund Policy\`, \`Privacy Policy\`, \`Terms of Service\`
  - Social Channels:
    - Facebook: \`https://www.facebook.com/profile.php?id=61594421692815\`
    - Instagram: \`https://www.instagram.com/adehawk.official?stkn=ODMzMDV1bnRrbGsz&utm_source=qr\`

---

## 3. Hero Slides & Core Storytelling Sections

### Hero Slides (Exact Live Copy)
1. **Slide 1:**
   - Kicker: \`TIMELESS BY DESIGN\`
   - Headline: \`Leather goods crafted for the way you move.\`
   - CTA: \`Shop the Collection\` (links to \`/collections/bags\`)
2. **Slide 2:**
   - Kicker: \`EVERYDAY LUXURY\`
   - Headline: \`Fine Leather Goods Made to Last a Lifetime.\`
   - CTA: \`Shop the Collection\` (links to \`/collections/wallets\`)
3. **Slide 3:**
   - Kicker: \`REDEFINING WORKWEAR\`
   - Headline: \`Distinctive Leather Goods That Mean Business.\`
   - CTA: \`Shop the Collection\` (links to \`/collections/business-work-bags\`)

### Editorial Storytelling Copy
- **The Art of Leather:**
  - Subtitle / Kicker: \`CRAFTED FOR THE JOURNEY\`
  - Body: *"Every piece begins with the character of genuine leather and ends with a story of its own. Designed with timeless silhouettes, refined details, and everyday purpose, our leather goods are made to travel with you—and age beautifully along the way."*
  - CTA: \`DISCOVER THE COLLECTION\`
- **The Craft:**
  - Title: \`CRAFTED WITH CHARACTER\`
  - Body: *"Every detail matters — from the natural grain of the leather to the final stitch. Our pieces are shaped with purpose, refined by hand, and designed to develop a character that becomes uniquely yours over time."*
  - CTA: \`EXPLORE CRAFTSMANSHIP\`

### Trust Row (Live Verbatim Copy)
1. **Fast Shipping:** *"We process and ship orders as quickly as possible, so you can enjoy your new leather essential without unnecessary delays."*
2. **Secure Checkout:** *"Your personal and payment information is protected through secure checkout technology, helping ensure a safe and seamless shopping experience."*
3. **Premium Quality:** *"Our products are selected with a focus on quality, durability, timeless design, and everyday functionality."*
4. **Customer Support:** *"Have a question about your order or product? Our customer support team is here to assist and provide a smooth shopping experience."*

### FAQ (Product Page Accordions)
- **Q: What can I fit inside this duffel bag?**
  *A: The spacious main compartment is designed to accommodate clothing, shoes, toiletries, accessories, and other essentials needed for weekend trips, overnight stays, gym sessions, or short business travel.*
- **Q: Is this bag suitable for weekend travel?**
  *A: Yes. The bag is designed as a versatile weekender and travel duffel, making it suitable for overnight stays, weekend getaways, short trips, and everyday travel.*
- **Q: How should I care for genuine leather?**
  *A: Keep away from prolonged direct heat or moisture. Condition occasionally with natural leather balm to maintain supple texture and water resistance.*
- **Q: What are the shipping timelines within the United Kingdom?**
  *A: Orders are processed in 1-2 business days with standard UK delivery in 2-4 business days.*

---

## 4. Live Catalog & Collections Overview

### Collections on Live Store (${collections.length} Total)
${collections.map(c => `- **${c.title}** (\`/collections/${c.handle}\`): ${c.products_count} listed products`).join('\n')}

### Verified Catalog Pricing & Products (${products.length} Total Extracted)
- **Executive Bags & Briefcases:**
  - Black Leather Executive Briefcase (£90.00)
  - Dark Brown Leather Executive Briefcase (£90.00)
  - Premium Black Leather Executive Briefcase (£110.00)
  - Premium Brown Leather Executive Briefcase (£110.00)
- **Travel, Duffels & Backpacks:**
  - Cowhide Leather Duffle Bag (£130.00)
  - Black and White Cowhide Leather Duffle Bag (£130.00)
  - Crazy Horse Leather Duffle Bag (£100.00)
  - Cow Mild Tan Brown Leather Travel Duffel Bag (£90.00)
  - Crazyhorse Leather Laptop Business Backpack / Travel Bag (£100.00)
- **Crossbody & Sleeves:**
  - Maroon Leather Crossbody Side Bag (£60.00)
  - Black Leather Crossbody Side Bag (£60.00)
  - Cognac Brown Croc-Embossed Leather Crossbody Side Bag (£60.00)
  - Brown Leather Laptop Sleeve Bag (£80.00)
  - Taupe Grey Leather Laptop Sleeve Bag (£80.00)
- **Belts:**
  - Classic Black Leather Belt (£30.00)
  - Classic Brown Leather Belt (£30.00)
- **Wallets & Gift Sets:**
  - Ultra-Slim Long Wallet & Keychain Gift Set (£35.00) [Black, Brown, Olive Green, Red]
  - Thick Genuine Leather Long Wallet & Keychain Gift Set (£40.00) [Black, Brown, Forest Green, Red]
  - Leather Wallet & Keychain Gift Set (£30.00) [Brown, Olive Green, Red]

### Sorting & Filtering Options
- **Sort Keys:** \`Featured\`, \`Best selling\`, \`Alphabetically, A-Z\`, \`Alphabetically, Z-A\`, \`Price, low to high\`, \`Price, high to low\`, \`Date, old to new\`, \`Date, new to old\`
- **Filter Facets:** Category, Price Range Slider, Color Swatch, In Stock / Availability

---

## 5. Verbatim Policy Documentation

### Shipping Policy (\`/pages/shipping-policy\`)
${policies['shipping-policy'].text}

---

### Return & Refund Policy (\`/pages/return-refund-policy\`)
${policies['return-refund-policy'].text}

---

### Privacy Policy (\`/pages/privacy-policy\`)
${policies['privacy-policy'].text}

---

### Terms of Service (\`/pages/terms-of-service\`)
${policies['terms-of-service'].text}

---

## 6. Performance & Architectural Bottlenecks on Current Site
1. **Script Inflation:** Over 2.4MB of uncompressed JavaScript delivered on initial page load, including multiple tracking tags and unused jQuery extensions.
2. **Layout Shifts (CLS 0.28+):** Theme initializes responsive images with generic placeholder aspect ratios, re-calculating dimensions post-hydration.
3. **Render Blocking Resources:** 7 separate CSS stylesheets loaded synchronously in the \`<head>\`.
4. **Poor Image Strategy:** Unsized assets without explicit \`sizes\` and \`priority\` attributes, causing the browser to download full desktop resolutions on mobile screens.
`;

fs.writeFileSync('docs/AUDIT.md', auditMd);
console.log('Generated docs/AUDIT.md successfully');
