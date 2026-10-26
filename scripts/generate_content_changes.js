const fs = require('fs');

const changes = [
  {
    location: 'components/home/BrandMarquee.tsx',
    original: 'PURE HANDMADE LEATHER GOODS · CRAFTED FOR EVERYDAY · DESIGNED TO LAST · TIMELESS BRITISH SILHOUETTES ·',
    replacement: 'PURE HANDMADE LEATHER GOODS · CRAFTED FOR EVERYDAY · DESIGNED TO LAST · TIMELESS BY DESIGN · EVERYDAY LUXURY · REDEFINING WORKWEAR ·',
    reason: 'Removed unverified claim "Timeless British silhouettes"; replaced with verified client taglines.'
  },
  {
    location: 'components/home/ShopByCollection.tsx',
    original: 'English Bridle Belts (kicker: Solid 4mm Hide)',
    replacement: 'Belts (kicker: Genuine Leather)',
    reason: 'Removed unverified claims "English Bridle" and "Solid 4mm Hide"; adopted factual neutral client terminology.'
  },
  {
    location: 'components/home/TheCraft.tsx',
    original: '"British workshop · Guaranteed quality", "Full-Grain Pull-Up Leather", "Develops rich patina and amber tones", "Solid 4mm English Bridle"',
    replacement: 'Client paragraph fragments from "Crafted with Character": "Every detail matters — from the natural grain of the leather to the final stitch. Shaped with purpose, refined by hand. Designed to develop a character that becomes uniquely yours over time."',
    reason: 'Removed all invented descriptions and guarantees; replaced with exact verbatim client copy from live store.'
  },
  {
    location: 'components/ui/Preloader.tsx & app/layout.tsx',
    original: 'Handmade Leather Goods · Great Britain / British workshop',
    replacement: 'Pure Handmade Leather Products · Crafted for Everyday. Designed to Last.',
    reason: 'Substituted geographic and workshop claims with verified client tagline.'
  },
  {
    location: 'components/search/SearchClient.tsx & SearchOverlay.tsx',
    original: 'English Belts',
    replacement: 'Belts',
    reason: 'Replaced with verified collection name from live Shopify catalog.'
  },
  {
    location: 'data/products.json & lib/commerce/local.ts',
    original: '100% Full Grain Vegetable-Tanned English Bridle Leather / Great Britain',
    replacement: '100% Genuine Leather / Handcrafted',
    reason: 'Standardized specifications to client product descriptions.'
  }
];

let md = `# CONTENT QUALITY AUDIT & REVISION LOG (V2)

In accordance with Section 5 of the V2 specification, all claims not explicitly made by the client on https://adehawk.com have been removed or replaced with verified client copy.

## Summary of Replaced Claims

| File / Component | Unverified Original Claim | Verified Client Replacement | Rationale |
|---|---|---|---|
`;

changes.forEach(c => {
  md += `| \`${c.location}\` | "${c.original}" | "${c.replacement}" | ${c.reason} |\n`;
});

md += `
## Verified Client Copy Bank (Ground Truth)
1. **Primary Announcement**: "Pure Handmade Leather Products · Secure Checkout"
2. **Brand Statement**: "Crafted for Everyday. Designed to Last."
3. **Hero Slide 1**: "TIMELESS BY DESIGN" / "Leather goods crafted for the way you move."
4. **Hero Slide 2**: "EVERYDAY LUXURY" / "Fine Leather Goods Made to Last a Lifetime."
5. **Hero Slide 3**: "REDEFINING WORKWEAR" / "Distinctive Leather Goods That Mean Business."
6. **Crafted for the Journey**: "Every piece begins with the character of genuine leather and ends with a story of its own. Designed with timeless silhouettes, refined details, and everyday purpose, our leather goods are made to travel with you—and age beautifully along the way."
7. **Crafted with Character**: "Every detail matters — from the natural grain of the leather to the final stitch. Our pieces are shaped with purpose, refined by hand, and designed to develop a character that becomes uniquely yours over time."
8. **Trust Assurances**:
   - Fast Shipping: "We process and ship orders as quickly as possible, so you can enjoy your new leather essential without unnecessary delays."
   - Secure Checkout: "Your personal and payment information is protected through secure checkout technology, helping ensure a safe and seamless shopping experience."
   - Premium Quality: "Our products are selected with a focus on quality, durability, timeless design, and everyday functionality."
   - Customer Support: "Have a question about your order or product? Our customer support team is here to assist and provide a smooth shopping experience."
9. **Collection Counts (Data-driven)**:
   - Bags: 14 pieces
   - Executive Bags: 6 pieces
   - Wallets: 28 pieces (live catalog including colorways) / 11 gift sets
   - Belts: 2 pieces
`;

fs.writeFileSync('docs/CONTENT_CHANGES.md', md);
console.log('Generated docs/CONTENT_CHANGES.md');
