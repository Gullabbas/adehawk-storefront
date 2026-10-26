const fs = require('fs');
const path = require('path');

const srcDir = '.';
const destProductsDir = 'public/assets/products';
const destBrandDir = 'public/assets/brand';

fs.mkdirSync(destProductsDir, { recursive: true });
fs.mkdirSync(destBrandDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

function toSlug(name) {
  return name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/-+/g, '-')
    .replace('-.', '.');
}

let copiedCount = 0;
files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  // Copy original filename
  fs.copyFileSync(srcPath, path.join(destProductsDir, file));
  
  // Copy clean slug filename
  const slug = toSlug(file);
  fs.copyFileSync(srcPath, path.join(destProductsDir, slug));
  
  copiedCount++;

  if (file === 'logo.png') {
    fs.copyFileSync(srcPath, path.join(destBrandDir, 'logo.png'));
  }
});

console.log(`Successfully copied ${copiedCount} assets with both raw and clean slug paths to public/assets/`);
