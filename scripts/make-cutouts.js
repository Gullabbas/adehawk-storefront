const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeBackgroundFloodFill(inputPath, outputPath, tolerance = 18) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Background color from top-left pixel
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  // We want an RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);
  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);

  function colorDist(r, g, b) {
    // Euclidean distance in RGB
    const dr = r - bgR;
    const dg = g - bgG;
    const db = b - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  // Queue for BFS flood fill
  // Start from all 4 borders
  const queue = [];

  function addPixel(x, y) {
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;

    const p = idx * channels;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];

    // If lightness is high and close to bg color
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum > 235 && colorDist(r, g, b) < tolerance) {
      isBg[idx] = 1;
      queue.push(idx);
    }
  }

  // Add all border pixels
  for (let x = 0; x < width; x++) {
    addPixel(x, 0);
    addPixel(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    addPixel(0, y);
    addPixel(width - 1, y);
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);

    // 4-way neighbors
    if (x > 0) addPixel(x - 1, y);
    if (x < width - 1) addPixel(x + 1, y);
    if (y > 0) addPixel(x, y - 1);
    if (y < height - 1) addPixel(x, y + 1);
  }

  // Construct RGBA buffer with feathering at the boundaries
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      rgba[dstIdx] = data[srcIdx];
      rgba[dstIdx + 1] = data[srcIdx + 1];
      rgba[dstIdx + 2] = data[srcIdx + 2];

      if (isBg[idx]) {
        rgba[dstIdx + 3] = 0; // Fully transparent
      } else {
        // Check if neighbor is background to soft-feather edge
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) bgNeighbors++;
            }
          }
        }
        if (bgNeighbors > 0) {
          const r = data[srcIdx];
          const g = data[srcIdx + 1];
          const b = data[srcIdx + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum > 220) {
            rgba[dstIdx + 3] = Math.round(255 * (1 - (bgNeighbors / 9) * 0.6));
          } else {
            rgba[dstIdx + 3] = 255;
          }
        } else {
          rgba[dstIdx + 3] = 255;
        }
      }
    }
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);

  console.log(`Generated transparent cutout: ${outputPath}`);
}

async function run() {
  const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
  
  // 1. Briefcase
  await removeBackgroundFloodFill(
    path.join(productsDir, 'black-leather-executive-briefcase.jpg'),
    path.join(productsDir, 'black-leather-executive-briefcase-transparent.png'),
    22
  );

  // 2. Wallets for Wallet Studio
  const walletFiles = [
    'ultra-slim-black-leather-long-wallet-and-keychain-gift-set.webp',
    'ultra-slim-brown-leather-long-wallet-and-keychain-gift-set.webp',
    'ultra-slim-olive-green-leather-long-wallet-and-keychain-gift-set.webp',
    'ultra-slim-red-leather-long-wallet-and-keychain-gift-set.webp',
    'thick-black-leather-long-wallet-and-keychain-gift-set.webp',
    'thick-brown-leather-long-wallet-and-keychain-gift-set.webp',
    'thick-forest-green-leather-long-wallet-and-keychain-gift-set.webp',
    'thick-red-genuine-leather-long-wallet-and-keychain-gift-set.webp',
  ];

  for (const f of walletFiles) {
    const baseName = f.replace('.webp', '');
    await removeBackgroundFloodFill(
      path.join(productsDir, f),
      path.join(productsDir, `${baseName}-transparent.png`),
      20
    );
  }
}

run().catch(console.error);
