const fs = require('fs');

function extractMainContent(html) {
  // Extract between <div class="sp-page-content"> or <div class="rte"> or <div class="page-content">
  let match = html.match(/<div class="[^"]*shopify-section[^"]*sp-page-content[^"]*">([\s\S]*?)<\/div>\s*<\/section>/i)
    || html.match(/<div class="entry-content[^"]*">([\s\S]*?)<\/div>/i)
    || html.match(/<div class="rte[^"]*">([\s\S]*?)<\/div>/i);
  
  if (!match) {
    // Look for article or main
    match = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  }
  return match ? match[1] : '';
}

const policies = ['shipping-policy', 'return-refund-policy', 'privacy-policy', 'terms-of-service'];
const policyData = {};

for (const pol of policies) {
  const html = fs.readFileSync(`data/${pol}.html`, 'utf8');
  // extract h1
  const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || ['',''])[1].replace(/<[^>]+>/g, '').trim();
  const raw = extractMainContent(html);
  policyData[pol] = {
    title,
    rawHtml: raw,
    // also extract text
    text: raw.replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n### $1\n\n')
             .replace(/<p[^>]*>/gi, '\n\n')
             .replace(/<\/p>/gi, '')
             .replace(/<li[^>]*>/gi, '\n- ')
             .replace(/<\/li>/gi, '')
             .replace(/<br\s*[\/]?>/gi, '\n')
             .replace(/<[^>]+>/g, '')
             .replace(/&amp;/g, '&')
             .replace(/&nbsp;/g, ' ')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/\n{3,}/g, '\n\n')
             .trim()
  };
}

fs.writeFileSync('data/policies.json', JSON.stringify(policyData, null, 2));
console.log('Policy titles:', Object.keys(policyData).map(k => ({ id: k, title: policyData[k].title, textLength: policyData[k].text.length })));
