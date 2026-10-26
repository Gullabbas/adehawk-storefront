const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_footer');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Scrolling to footer...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 1000));

  const footerData = await page.evaluate(() => {
    const fiverrLink = document.querySelector('a[href*="fiverr.com/muhammadraza707"]');
    const linkedinLink = document.querySelector('a[href*="linkedin.com/in/muhammadraza707"]');
    const behanceLink = document.querySelector('a[href*="behance.net/muhammadrazaa707"]');

    return {
      fiverr: fiverrLink ? {
        text: fiverrLink.innerText,
        href: fiverrLink.getAttribute('href'),
        target: fiverrLink.getAttribute('target'),
      } : null,
      linkedin: linkedinLink ? {
        href: linkedinLink.getAttribute('href'),
        target: linkedinLink.getAttribute('target'),
        svgPresent: !!linkedinLink.querySelector('svg'),
      } : null,
      behance: behanceLink ? {
        href: behanceLink.getAttribute('href'),
        target: behanceLink.getAttribute('target'),
        svgPresent: !!behanceLink.querySelector('svg'),
      } : null,
    };
  });

  console.log('Footer attribution data:', JSON.stringify(footerData, null, 2));

  // Screenshot footer area
  const footerEl = await page.$('footer');
  if (footerEl) {
    await footerEl.screenshot({ path: path.join(OUT_DIR, 'footer_attribution.png') });
  }

  await browser.close();
  console.log('Footer verification complete!');
}

verify().catch(console.error);
