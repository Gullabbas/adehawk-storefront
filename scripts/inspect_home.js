const fs = require('fs');

const home = fs.readFileSync('data/home.html', 'utf8');

// Find color styles or theme variables
const colorVars = [...home.matchAll(/--[a-zA-Z0-9_-]*(?:color|bg|text|accent)[a-zA-Z0-9_-]*:\s*[^;]+/gi)].map(m => m[0]);
console.log('Color vars sample:', colorVars.slice(0, 20));

// Find fonts
const fonts = [...home.matchAll(/font-family:\s*[^;]+/gi)].map(m => m[0]);
console.log('Font families sample:', [...new Set(fonts)].slice(0, 10));

// Find FAQ section in home.html
const faqMatches = [...home.matchAll(/faq|frequently/gi)];
console.log('FAQ matches:', faqMatches.length);

// Find exact trust row text
const trustRegex = /<(?:div|p|span|h3|h4)[^>]*>(Fast Shipping|Secure Checkout|Premium Quality|Customer Support)[\s\S]*?<\/(?:div|p|span|h3|h4)>/gi;
let match;
while ((match = trustRegex.exec(home)) !== null) {
  console.log('Trust point:', match[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// Find hero slide text
console.log('\n--- Hero Slides ---');
const slideRegex = /(TIMELESS BY DESIGN|EVERYDAY LUXURY|REDEFINING WORKWEAR)[\s\S]*?(?:Shop|Discover|Explore|<\/div>)/gi;
while ((match = slideRegex.exec(home)) !== null) {
  console.log('Slide match:', match[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 150));
}

// Find footer text / about us text
const aboutMatch = home.match(/(?:About Us|About Adehawk|Our Story)[\s\S]{0,500}/i);
console.log('\nAbout snippet:', aboutMatch ? aboutMatch[0].replace(/<[^>]+>/g, ' ').slice(0, 300) : 'none');
