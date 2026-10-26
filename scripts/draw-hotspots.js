const sharp = require('sharp');
const path = require('path');

async function drawHotspots() {
  const imgPath = path.join(__dirname, '..', 'public', 'assets', 'products', 'shop-the-look-bags.webp');
  const metadata = await sharp(imgPath).metadata();
  const W = metadata.width;
  const H = metadata.height;

  // Let's refine coordinates based on the composition:
  // Look at image 2:
  // 1. Dark Brown Briefcase (foreground desk left):
  //    - Centered on the silver lock / middle of the bag: around x=38%, y=60%
  // 2. Premium Brown Briefcase (top left on wooden riser):
  //    - Lock is at x=41%, y=22%
  // 3. Premium Black Briefcase (top right on wooden riser):
  //    - Lock is at x=67%, y=25%
  // 4. Black Briefcase (foreground desk right):
  //    - Lock is at x=67%, y=61%
  // 5. Taupe Grey Laptop Sleeve (center bottom, handles facing up):
  //    - Center of sleeve is at x=53%, y=82%

  const spots = [
    { num: '01', name: 'Dark Brown Briefcase', x: 38, y: 58 },
    { num: '02', name: 'Premium Brown Briefcase', x: 41, y: 22 },
    { num: '03', name: 'Premium Black Briefcase', x: 67, y: 25 },
    { num: '04', name: 'Black Briefcase', x: 67, y: 61 },
    { num: '05', name: 'Taupe Grey Sleeve', x: 53, y: 82 },
  ];

  const svgCircles = spots.map(s => {
    const cx = (s.x / 100) * W;
    const cy = (s.y / 100) * H;
    return `
      <circle cx="${cx}" cy="${cy}" r="18" fill="#D9A066" stroke="#FFFFFF" stroke-width="3" />
      <text x="${cx}" y="${cy + 5}" font-size="14" font-weight="bold" fill="#12100E" text-anchor="middle" font-family="sans-serif">${s.num}</text>
    `;
  }).join('');

  const svgOverlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      ${svgCircles}
    </svg>
  `);

  await sharp(imgPath)
    .composite([{ input: svgOverlay }])
    .png()
    .toFile(path.join(__dirname, '..', 'docs', 'test_hotspots.png'));

  console.log('Saved docs/test_hotspots.png with candidate coordinates');
}

drawHotspots().catch(console.error);
