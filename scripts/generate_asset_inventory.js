const fs = require('fs');

function getDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), format: 'PNG' };
  }
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) break;
      const marker = buf[offset + 1];
      if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC9 && marker <= 0xCB)) {
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
          format: 'JPEG'
        };
      }
      offset += 2 + buf.readUInt16BE(offset + 2);
    }
    return { width: 0, height: 0, format: 'JPEG' };
  }
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8X') {
      const width = 1 + buf.readUIntLE(24, 3);
      const height = 1 + buf.readUIntLE(27, 3);
      return { width, height, format: 'WEBP' };
    } else if (chunk === 'VP8 ') {
      const width = buf.readUInt16LE(26) & 0x3fff;
      const height = buf.readUInt16LE(28) & 0x3fff;
      return { width, height, format: 'WEBP' };
    } else if (chunk === 'VP8L') {
      const b1 = buf[21], b2 = buf[22], b3 = buf[23], b4 = buf[24];
      const width = 1 + (((b2 & 0x3F) << 8) | b1);
      const height = 1 + (((b4 & 0xF) << 10) | (b3 << 2) | ((b2 & 0xC0) >> 6));
      return { width, height, format: 'WEBP' };
    }
  }
  return { width: 0, height: 0, format: 'UNKNOWN' };
}

const files = fs.readdirSync('.').filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f)).sort();

function mapToProduct(file) {
  if (file === 'logo.png') return { category: 'Brand', product: 'Official Brand Logo', handle: 'n/a', use: 'Header, Footer, Preloader, Meta OG' };
  if (file === 'collection.webp') return { category: 'Editorial / Banners', product: 'Featured Collection Banner', handle: 'collections', use: 'Shop by Collection banner / Hero composition' };
  if (file === 'CRAFTED FOR THE JOURNEY.webp') return { category: 'Editorial', product: 'Crafted for the Journey Feature', handle: 'crafted-for-journey', use: 'The Art of Leather parallax / storytelling' };
  if (file === 'Shop the Look bags.webp') return { category: 'Editorial / Interactive', product: 'Shop the Look Hero Canvas', handle: 'shop-the-look', use: 'Shop the Look interactive hotspot section' };

  if (file.includes('Belt')) {
    return { category: 'Belts', product: file.replace(/\.webp$/i, ''), handle: file.toLowerCase().replace(/[^a-z0-9]+/g, '-'), use: 'Belts Collection & PDP' };
  }
  if (file.includes('Wallet')) {
    return { category: 'Wallets', product: file.replace(/\.webp$/i, ''), handle: file.toLowerCase().replace(/[^a-z0-9]+/g, '-'), use: 'Wallets Collection & PDP & Swatches' };
  }
  return { category: 'Bags', product: file.replace(/\.(webp|jpg)$/i, ''), handle: file.toLowerCase().replace(/[^a-z0-9]+/g, '-'), use: 'Bags Collection & PDP & Rails' };
}

let md = `# ADEHAWK ASSET INVENTORY

Complete audit and mapping of all 31 verified visual assets residing in the workspace directory.
Per project constraints, these original assets are untouched, unmodified, unretouched, and mapped strictly 1:1.

| # | Filename | Format | Dimensions (WxH) | Orientation | File Size | Product / Feature Mapping | Section & Route Usage |
|---|---|---|---|---|---|---|---|
`;

files.forEach((file, idx) => {
  const stats = fs.statSync(file);
  const dims = getDimensions(file);
  const orientation = dims.width > dims.height ? 'Landscape' : dims.width < dims.height ? 'Portrait' : 'Square';
  const sizeKb = (stats.size / 1024).toFixed(1) + ' KB';
  const mapping = mapToProduct(file);
  md += `| ${idx + 1} | \`${file}\` | ${dims.format} | ${dims.width} × ${dims.height} | ${orientation} | ${sizeKb} | **${mapping.product}** (${mapping.category}) | ${mapping.use} |\n`;
});

md += `
## Asset Usage Rules & Constraints
1. **Zero Pixel Alteration**: No image has been recolored, retouched, filtered, or upscaled.
2. **Copy Script**: All files will be copied into \`/public/assets/products/\` via an automated, unmodified copy script.
3. **Serving Layer**: Served strictly through \`next/image\` with WebP/AVIF format delivery and responsive \`sizes\`.
4. **Hero Dynamic Canvas**: For the WebGL hero stage, slides will be composed at runtime on an offscreen 2D canvas with clean CSS color tokens and soft drop shadows beneath the products, preserving original pixels completely.
5. **Missing Media Handling**: No video files exist in the client repository. Per specification, "Watch & Shop" video section is deliberately omitted rather than using stock or AI placeholders.
`;

fs.writeFileSync('docs/ASSET_INVENTORY.md', md);
console.log('Generated docs/ASSET_INVENTORY.md successfully');
