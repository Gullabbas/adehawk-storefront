const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('data/shopify_products_raw.json', 'utf8'));
const files = fs.readdirSync('.').filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

console.log('Total shopify products:', raw.products.length);

const productList = raw.products.map(p => {
  const title = p.title;
  const handle = p.handle;
  const price = parseFloat(p.variants[0]?.price || '0');
  const compareAtPrice = p.variants[0]?.compare_at_price ? parseFloat(p.variants[0].compare_at_price) : null;
  const description = p.body_html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const productType = p.product_type;
  const tags = p.tags;

  // Find best matching asset file
  // Match by exact filename similarity
  const lowerTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  let matchedFile = files.find(f => {
    const fBase = f.toLowerCase().replace(/\.[a-z]+$/, '').replace(/[^a-z0-9]/g, '');
    return fBase === lowerTitle;
  });

  if (!matchedFile) {
    // Try partial match
    matchedFile = files.find(f => {
      const fBase = f.toLowerCase().replace(/\.[a-z]+$/, '').replace(/[^a-z0-9]/g, '');
      return lowerTitle.includes(fBase) || fBase.includes(lowerTitle);
    });
  }

  return {
    id: p.id.toString(),
    title,
    handle,
    price,
    compareAtPrice,
    productType,
    tags,
    matchedFile: matchedFile || null,
    variants: p.variants.map(v => ({
      id: v.id.toString(),
      title: v.title,
      price: parseFloat(v.price),
      sku: v.sku,
      available: v.available !== false
    }))
  };
});

const matched = productList.filter(p => p.matchedFile);
const unmatched = productList.filter(p => !p.matchedFile);
console.log(`Matched: ${matched.length}/${productList.length}`);
console.log('Unmatched titles:', unmatched.map(u => u.title));
console.log('Unused asset files:', files.filter(f => !['logo.png', 'collection.webp', 'CRAFTED FOR THE JOURNEY.webp', 'Shop the Look bags.webp'].includes(f) && !matched.some(m => m.matchedFile === f)));
