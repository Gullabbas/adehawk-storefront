const fs = require('fs');

const home = fs.readFileSync('data/home.html', 'utf8');

// Title
const titleMatch = home.match(/<title>([^<]+)<\/title>/);
console.log('Title:', titleMatch ? titleMatch[1].trim() : '');

// Headings
const h1s = [...home.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
const h2s = [...home.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
const h3s = [...home.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log('H1:', h1s);
console.log('H2:', h2s);
console.log('H3 sample:', h3s.slice(0, 15));

// Social links
const socials = [...home.matchAll(/href="(https?:\/\/(?:www\.)?(?:instagram|facebook|tiktok|pinterest|twitter)[^"]+)"/gi)].map(m => m[1]);
console.log('Socials:', Array.from(new Set(socials)));

// Find text around trust points or guarantee
const trustMatches = [...home.matchAll(/(fast shipping|secure checkout|premium quality|customer support|free shipping|handmade)/gi)].map(m => m[0]);
console.log('Trust keywords count:', trustMatches.length);

// Extract Policy text
const policies = ['shipping-policy', 'return-refund-policy', 'privacy-policy', 'terms-of-service'];
for (const pol of policies) {
  if (fs.existsSync(`data/${pol}.html`)) {
    const html = fs.readFileSync(`data/${pol}.html`, 'utf8');
    // In shopify themes, policy content is in rte or page-content or .shopify-policy__container or article
    const contentMatch = html.match(/<div class="[^"]*(?:rte|shopify-policy__container|page-content|entry-content)[^"]*">([\s\S]*?)<\/div>/i)
      || html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    console.log(`Policy ${pol} length:`, html.length, 'Matched content length:', contentMatch ? contentMatch[1].length : 'none');
  }
}
