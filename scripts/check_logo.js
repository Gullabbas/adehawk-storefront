const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('public/assets/brand/logo.png');
// parse png chunks
let offset = 8;
const idatChunks = [];
let width = 0, height = 0;

while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
  }
  offset += 12 + len;
}

const idat = Buffer.concat(idatChunks);
zlib.inflate(idat, (err, raw) => {
  if (err) return console.error(err);
  // scanlines
  let darkPixels = 0, lightPixels = 0, totalOpaque = 0;
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1) + 1;
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + x * 4;
      const a = raw[idx + 3];
      if (a > 50) {
        totalOpaque++;
        const r = raw[idx], g = raw[idx + 1], b = raw[idx + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum < 100) darkPixels++;
        else lightPixels++;
      }
    }
  }
  console.log(`Logo: ${width}x${height}, opaque pixels: ${totalOpaque}, dark: ${darkPixels}, light: ${lightPixels}`);
});
