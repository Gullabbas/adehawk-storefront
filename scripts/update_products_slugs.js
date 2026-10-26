const fs = require('fs');

function toSlug(name) {
  const base = name.replace('/assets/products/', '');
  const clean = base.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace('-.', '.');
  return `/assets/products/${clean}`;
}

const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

products.forEach(p => {
  p.images = p.images.map(img => toSlug(img));
  p.colors = p.colors.map(c => ({
    ...c,
    image: toSlug(c.image)
  }));
});

fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
console.log('Successfully updated data/products.json with clean slug image URLs!');
