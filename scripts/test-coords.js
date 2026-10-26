const sharp = require('sharp');
const path = require('path');

async function testCoordinates() {
  const imgPath = path.join(__dirname, '..', 'public', 'assets', 'products', 'shop-the-look-bags.webp');
  const metadata = await sharp(imgPath).metadata();
  const W = metadata.width; // 1200
  const H = metadata.height; // 570

  console.log(`Image dimensions: ${W} x ${H}`);

  // Test candidate coordinates:
  // 1. Dark Brown Executive Briefcase (foreground left):
  // Let's sample x around 35-40%, y around 50-60%
  // 2. Premium Brown Executive Briefcase (background left/center on riser):
  // Let's sample x around 38-42%, y around 20-35%
  // 3. Premium Black Executive Briefcase (background right on riser):
  // Let's sample x around 68-72%, y around 20-35%
  // 4. Black Executive Briefcase (foreground right):
  // Let's sample x around 68-72%, y around 55-65%
  // 5. Taupe Grey Laptop Sleeve Bag (center foreground lying down):
  // Let's sample x around 50-55%, y around 75-85%

  const candidates = [
    { name: '1_Dark_Brown_Foreground', x: 38, y: 55 },
    { name: '2_Premium_Brown_Background_Riser', x: 38, y: 22 },
    { name: '3_Premium_Black_Background_Riser', x: 68, y: 22 },
    { name: '4_Black_Foreground', x: 68, y: 58 },
    { name: '5_Taupe_Laptop_Sleeve_Center', x: 52, y: 80 },
  ];

  for (const c of candidates) {
    const px = Math.round((c.x / 100) * W);
    const py = Math.round((c.y / 100) * H);
    console.log(`${c.name}: (${c.x}%, ${c.y}%) -> pixel (${px}, ${py})`);
  }
}

testCoordinates().catch(console.error);
