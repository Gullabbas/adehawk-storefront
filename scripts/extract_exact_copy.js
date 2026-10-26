const fs = require('fs');
const home = fs.readFileSync('data/home.html', 'utf8');

// Full Trust row
const trustSection = home.match(/<div class="[^"]*shipping[^"]*"[\s\S]*?<\/section>/i) 
  || home.match(/Fast Shipping[\s\S]{0,2500}/i);
console.log('=== TRUST ROW ===');
const trustPoints = [
  'Fast Shipping',
  'Secure Checkout',
  'Premium Quality',
  'Customer Support'
];
for (let i = 0; i < trustPoints.length; i++) {
  const p = trustPoints[i];
  const nextP = trustPoints[i + 1] || 'ABOUT US';
  const regex = new RegExp(`${p}[\\s\\S]*?(?=${nextP})`, 'i');
  const m = home.match(regex);
  if (m) {
    console.log(p + ':\n', m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), '\n');
  }
}

// Full About Us
console.log('=== ABOUT US ===');
const aboutMatch = home.match(/ABOUT US[\s\S]*?(?:Copyright|Quick links|Information|Newsletter|Footer)/i);
if (aboutMatch) {
  console.log(aboutMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 600));
}

// Full Crafted with Character
console.log('=== CRAFTED WITH CHARACTER ===');
const craftMatch = home.match(/CRAFTED WITH CHARACTER[\s\S]*?(?:Shop the Look|SIGNATURE WALLETS)/i);
if (craftMatch) {
  console.log(craftMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 500));
}

// FAQ
console.log('=== FAQ ===');
const faqSection = home.match(/faq[\s\S]{0,3000}/i);
if (faqSection) {
  console.log(faqSection[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1000));
}
