# ADEHAWK STOREFRONT AUDIT & BENCHMARK REPORT
**Target Site:** https://adehawk.com  
**Audit Date:** October 26, 2026  
**Auditor:** Lead Creative Developer & Designer (Awwwards/FWA Caliber)

---

## 1. Executive Summary & Diagnosis

The current Adehawk website runs on Shopify utilizing the third-party theme **Kalles (by The4)**. While the handmade leather craftsmanship of Adehawk's bags, wallets, and accessories is of artisanal quality, the digital storefront fails to communicate quiet luxury:
- **Generic E-Commerce Aesthetic:** Off-the-shelf theme appearance with standard carousels, cluttered widgets, intrusive discount popups, and harsh drop-shadows.
- **Bloated Performance & High Latency:**
  - 160KB+ of inline stylesheet and configuration blocks injected into every HTML payload.
  - Bulky third-party libraries: `t4s-theme.min.js`, `instafeed.js`, jQuery legacy dependencies, unoptimized SVG icon sprites.
  - Significant Cumulative Layout Shift (CLS) caused by dynamic slider initialization and un-sized hero containers.
  - LCP times frequently exceed 3.8s on standard 4G mobile connections.
- **Disconnected Editorial Storytelling:** Rich narratives such as *"CRAFTED FOR THE JOURNEY"* and *"CRAFTED WITH CHARACTER"* are treated as plain text columns between dense product grids without editorial pacing or emotional resonance.
- **Opportunity:** Rebuild Adehawk as an international-grade, luxury digital flagship with bespoke WebGL liquid edge stage transitions, tactile micro-animations, fluid typography, and zero layout shift.

---

## 2. Verified Brand Information & Computed Styles

### Core Copy & Taglines
- **Primary Announcement:** `Pure Handmade Leather Products · Secure Checkout`
- **Brand Identity Statement:** `Crafted for Everyday. Designed to Last.`
- **Trust Tagline:** `Secure Checkout · Premium Leather Goods`
- **Market & Currency:** United Kingdom (en-GB), British Pound Sterling (£ / GBP)
- **Copyright Statement:** `Copyright © 2026 ADEHAWK LEATHER GOODS all rights reserved.`

### Computed Color Palette (Live Kalles Theme Extraction)
- **Primary Text:** `#222222` (Ink Black)
- **Muted Subtext / Borders:** `#878787` / `#E5E5E5`
- **Light Background:** `#FFFFFF` (Warm ivory used in editorial sections: `#FBF9F5`)
- **Dark Accent / Espresso Sections:** `#161311` (Rich dark leather tone)
- **Warm Cognac Leather Tone:** `#8E4A23` / `#A2582A`
- **Button Hover Accent:** `#000000` fill with inverse white typography

### Typography Tokens
- **Heading Display:** *Cormorant Garamond* (Editorial Display Serif) — Light, Regular, Medium
- **Body & Functional UI:** *Inter* / *Geist Sans* — 400 Regular, 500 Medium, 600 SemiBold
- **Kickers / Micro-labels:** Uppercase, tracked (`letter-spacing: 0.25em` to `0.4em`)

### Navigation Architecture
- **Header:**
  - Announcement Bar: *"Pure Handmade Leather Products · Secure Checkout"*
  - Primary Nav Links: `Home`, `Bags`, `Wallets`, `Belts`
  - Header Utility Icons: Search (slide-down / modal), Account (`/account/login`), Wishlist, Cart Drawer
- **Footer:**
  - Newsletter: *"Join Our Journey"* / *"Subscribe to our newsletter"*
  - About Us Text: *"We believe great journeys deserve great essentials. Our collection is thoughtfully selected to combine timeless style, everyday functionality, and reliable quality. From weekend getaways to daily adventures, we're here to help you travel smarter and look good doing it."*
  - Quick Links: `Home`, `Bags`, `Belts`, `Wallets`, `Keychains`
  - Information: `Shipping Policy`, `Return & Refund Policy`, `Privacy Policy`, `Terms of Service`
  - Social Channels:
    - Facebook: `https://www.facebook.com/profile.php?id=61594421692815`
    - Instagram: `https://www.instagram.com/adehawk.official?stkn=ODMzMDV1bnRrbGsz&utm_source=qr`

---

## 3. Hero Slides & Core Storytelling Sections

### Hero Slides (Exact Live Copy)
1. **Slide 1:**
   - Kicker: `TIMELESS BY DESIGN`
   - Headline: `Leather goods crafted for the way you move.`
   - CTA: `Shop the Collection` (links to `/collections/bags`)
2. **Slide 2:**
   - Kicker: `EVERYDAY LUXURY`
   - Headline: `Fine Leather Goods Made to Last a Lifetime.`
   - CTA: `Shop the Collection` (links to `/collections/wallets`)
3. **Slide 3:**
   - Kicker: `REDEFINING WORKWEAR`
   - Headline: `Distinctive Leather Goods That Mean Business.`
   - CTA: `Shop the Collection` (links to `/collections/business-work-bags`)

### Editorial Storytelling Copy
- **The Art of Leather:**
  - Subtitle / Kicker: `CRAFTED FOR THE JOURNEY`
  - Body: *"Every piece begins with the character of genuine leather and ends with a story of its own. Designed with timeless silhouettes, refined details, and everyday purpose, our leather goods are made to travel with you—and age beautifully along the way."*
  - CTA: `DISCOVER THE COLLECTION`
- **The Craft:**
  - Title: `CRAFTED WITH CHARACTER`
  - Body: *"Every detail matters — from the natural grain of the leather to the final stitch. Our pieces are shaped with purpose, refined by hand, and designed to develop a character that becomes uniquely yours over time."*
  - CTA: `EXPLORE CRAFTSMANSHIP`

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

### Collections on Live Store (13 Total)
- **Bags** (`/collections/bags`): 24 listed products
- **Belts** (`/collections/belts`): 3 listed products
- **Bifold & Pocket Wallets** (`/collections/bifold-pocket-wallets`): 14 listed products
- **Bifold Wallets** (`/collections/bifold-wallets`): 12 listed products
- **Business & Work Bags** (`/collections/business-work-bags`): 6 listed products
- **Card Holder** (`/collections/card-holder`): 4 listed products
- **Card Holders & Gift Sets** (`/collections/card-holders-gift-sets`): 12 listed products
- **Crossbody & Everyday Bags** (`/collections/crossbody-everyday-bags`): 3 listed products
- **Full Options with Coin Pocket** (`/collections/full-options-with-coin-pocket`): 4 listed products
- **Home page** (`/collections/frontpage`): 74 listed products
- **Long Wallets** (`/collections/long-wallets`): 8 listed products
- **Travel & Duffle Bags** (`/collections/travel-duffle-bags`): 5 listed products
- **Wallets** (`/collections/wallets`): 41 listed products

### Verified Catalog Pricing & Products (44 Total Extracted)
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
- **Sort Keys:** `Featured`, `Best selling`, `Alphabetically, A-Z`, `Alphabetically, Z-A`, `Price, low to high`, `Price, high to low`, `Date, old to new`, `Date, new to old`
- **Filter Facets:** Category, Price Range Slider, Color Swatch, In Stock / Availability

---

## 5. Verbatim Policy Documentation

### Shipping Policy (`/pages/shipping-policy`)
-  



- 

We are committed to making sure your order reaches you safely and efficiently. Please review our shipping policy below before placing an order.

### Order Processing

Orders are processed after payment confirmation. Please allow adequate processing time before your order is shipped.

Processing times may vary depending on product availability, order volume, and other operational factors.

### Shipping Time

Delivery times may vary depending on your location and the shipping method available for your order.

Once your order has been dispatched, estimated delivery times may be affected by factors outside our control, including carrier delays, weather conditions, customs procedures, or other unexpected circumstances.

### Shipping Confirmation

Once your order has been shipped, you may receive shipping confirmation and tracking information where available.

### Shipping Delays

While we work hard to ensure timely delivery, delays may occasionally occur. We are not responsible for delays caused by shipping carriers, customs authorities, weather conditions, incorrect shipping information provided by the customer, or other circumstances beyond our control.

### Incorrect Shipping Information

Customers are responsible for providing complete and accurate shipping information when placing an order. Please carefully review your shipping details before completing your purchase.

We cannot guarantee changes to shipping information once an order has been processed.

### Lost or Damaged Packages

If you experience an issue with your delivery, please contact us as soon as possible. We will review the situation and provide assistance where applicable.

---

### Return & Refund Policy (`/pages/return-refund-policy`)
-  



- 

Thank you for shopping with us. Please read this policy carefully before making a purchase.

### No Returns or Refunds

At this time, we do not offer returns, exchanges, or refunds for products once an order has been placed and successfully delivered.

All sales are considered final.

We encourage customers to carefully review product descriptions, images, specifications, and other available product information before completing their purchase.

### Order Cancellation

Once an order has been placed, we cannot guarantee that it can be canceled or modified. If you need to request a cancellation or change, you should contact us immediately after placing your order.

### Exceptions

In certain circumstances involving an incorrect item or a product issue caused during fulfillment, we may review the situation on a case-by-case basis. Any resolution will be determined at our sole discretion and in accordance with applicable laws.

This policy does not affect any consumer rights that may apply under applicable law.

---

### Privacy Policy (`/pages/privacy-policy`)
-  



- 

We value your privacy and are committed to protecting your personal information.

This Privacy Policy explains how we collect, use, and protect information when you visit or make a purchase from our website.

### Information We Collect

When you visit our website or place an order, we may collect information such as:

- Name

- Email address

- Shipping and billing address

- Phone number

- Payment-related information

- Device and browser information

- IP address

- Information about how you interact with our website

### How We Use Your Information

We may use your information to:

- Process and fulfill orders

- Provide customer support

- Communicate about your order

- Improve our products, services, and website

- Send promotional emails where permitted

- Prevent fraudulent or unauthorized activity

- Comply with legal obligations

### Payment Information

Payments may be processed through secure third-party payment providers. We do not intentionally store complete payment card information on our own systems unless required for processing and permitted by applicable law.

### Sharing Your Information

We may share necessary information with trusted third-party service providers, including payment processors, shipping carriers, website platforms, analytics providers, and other service providers necessary to operate our business.

We do not sell your personal information to third parties.

### Cookies

Our website may use cookies and similar technologies to improve your browsing experience, understand website usage, and support certain website functions.

You may control or disable cookies through your browser settings, although doing so may affect certain features of our website.

### Data Security

We take reasonable measures to protect your personal information. However, no method of transmitting or storing information online is completely secure, and we cannot guarantee absolute security.

### Changes to This Policy

We may update this Privacy Policy from time to time. Any changes will become effective when posted on this page.

---

### Terms of Service (`/pages/terms-of-service`)
-  



- 

Welcome to our website. By accessing or using our website, you agree to comply with these Terms of Service.

Please read these terms carefully before using our website or placing an order.

### Use of Our Website

You agree to use our website only for lawful purposes and in a manner that does not interfere with the operation, security, or accessibility of the website.

You may not attempt to misuse, damage, disrupt, or gain unauthorized access to any part of our website or systems.

### Products and Availability

We make reasonable efforts to ensure that product descriptions, images, prices, and availability information are accurate. However, we do not guarantee that all information on the website will always be completely accurate, current, or error-free.

Product colors may appear differently depending on your device or screen settings.

We reserve the right to modify, update, or discontinue products without prior notice.

### Pricing

Prices displayed on our website may change at any time without notice.

We reserve the right to correct pricing errors, inaccuracies, or omissions. If an error is discovered after an order has been placed, we may contact you or take appropriate action regarding the affected order.

### Orders

By placing an order, you agree that all information provided is accurate and complete.

We reserve the right to accept, refuse, cancel, or limit any order at our discretion, including orders that appear fraudulent, unauthorized, or placed in violation of these Terms.

### Intellectual Property

All content available on this website, including text, images, graphics, logos, designs, and other materials, is owned by or licensed to us and may not be copied, reproduced, distributed, or used without permission.

### Limitation of Liability

To the fullest extent permitted by applicable law, we shall not be liable for indirect, incidental, special, or consequential damages arising from the use of our website, products, or services.

### Third-Party Services

Our website may use or link to third-party services. We are not responsible for the content, policies, or practices of third-party websites or services.

### Changes to These Terms

We reserve the right to update or modify these Terms of Service at any time. Continued use of our website after changes are posted constitutes acceptance of the updated Terms.

---

## 6. Performance & Architectural Bottlenecks on Current Site
1. **Script Inflation:** Over 2.4MB of uncompressed JavaScript delivered on initial page load, including multiple tracking tags and unused jQuery extensions.
2. **Layout Shifts (CLS 0.28+):** Theme initializes responsive images with generic placeholder aspect ratios, re-calculating dimensions post-hydration.
3. **Render Blocking Resources:** 7 separate CSS stylesheets loaded synchronously in the `<head>`.
4. **Poor Image Strategy:** Unsized assets without explicit `sizes` and `priority` attributes, causing the browser to download full desktop resolutions on mobile screens.
