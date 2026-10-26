const fs = require('fs');
const path = require('path');

const srcDir = '.';
const destProductsDir = 'public/assets/products';
const destBrandDir = 'public/assets/brand';

fs.mkdirSync(destProductsDir, { recursive: true });
fs.mkdirSync(destBrandDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f));

let copiedCount = 0;
files.forEach(file => {
  const srcPath = path.join(srcDir, file);
  // Also copy all into destProductsDir so products can refer to /assets/products/[filename]
  const destPath = path.join(destProductsDir, file);
  fs.copyFileSync(srcPath, destPath);
  copiedCount++;

  if (file === 'logo.png') {
    fs.copyFileSync(srcPath, path.join(destBrandDir, 'logo.png'));
  }
});

console.log(`Successfully copied ${copiedCount} assets byte-for-byte to public/assets/`);
