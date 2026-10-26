const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASELINE_DIR = path.join(__dirname, '..', 'docs', 'baselines_v1');

fs.mkdirSync(BASELINE_DIR, { recursive: true });

const ROUTES = [
  { name: 'col_bags', path: '/collections/bags' },
  { name: 'col_wallets', path: '/collections/wallets' },
  { name: 'col_belts', path: '/collections/belts' },
  { name: 'col_business', path: '/collections/business-work-bags' },
  { name: 'col_all', path: '/collections/all' },
  { name: 'col_keychains', path: '/collections/keychains' },
  { name: 'search', path: '/search' },
  { name: 'pdp', path: '/products/black-leather-executive-briefcase' },
  { name: 'cart', path: '/cart' },
  { name: 'wishlist', path: '/wishlist' },
  { name: 'not_found', path: '/_not-found' },
  { name: 'shipping_policy', path: '/pages/shipping-policy' },
  { name: 'return_policy', path: '/pages/return-refund-policy' },
  { name: 'privacy_policy', path: '/pages/privacy-policy' },
  { name: 'terms_of_service', path: '/pages/terms-of-service' },
];

const VIEWPORTS = [
  { width: 1440, height: 900, name: '1440' },
  { width: 768, height: 1024, name: '768' },
  { width: 375, height: 812, name: '375', isMobile: true, hasTouch: true },
];

async function capture() {
  console.log('--- CAPTURING V1 LOCKED BASELINES ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(20000);

  for (const vp of VIEWPORTS) {
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: !!vp.isMobile,
      hasTouch: !!vp.hasTouch,
    });

    for (const r of ROUTES) {
      const url = `http://localhost:3001${r.path}`;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await new Promise(res => setTimeout(res, 600));
        const filename = `${r.name}_${vp.name}.png`;
        await page.screenshot({ path: path.join(BASELINE_DIR, filename) });
        console.log(`Saved baseline: ${filename}`);
      } catch (err) {
        console.error(`Error on ${r.name} ${vp.name}:`, err.message);
      }
    }

    // Capture Cart Drawer
    try {
      await page.goto('http://localhost:3001/collections/bags', { waitUntil: 'domcontentloaded' });
      await new Promise(res => setTimeout(res, 600));
      // Click first cart icon
      const cartBtn = await page.$('button[aria-label*="Shopping Cart"]');
      if (cartBtn) {
        await cartBtn.click();
        await new Promise(res => setTimeout(res, 600));
        await page.screenshot({ path: path.join(BASELINE_DIR, `cart_drawer_${vp.name}.png`) });
        console.log(`Saved baseline: cart_drawer_${vp.name}.png`);
      }
    } catch (e) {
      console.error(`Cart drawer error ${vp.name}:`, e.message);
    }

    // Capture Mobile Menu on 375
    if (vp.name === '375') {
      try {
        await page.goto('http://localhost:3001/collections/bags', { waitUntil: 'domcontentloaded' });
        await new Promise(res => setTimeout(res, 600));
        const menuBtn = await page.$('button[aria-label="Toggle Navigation Menu"]');
        if (menuBtn) {
          await menuBtn.click();
          await new Promise(res => setTimeout(res, 600));
          await page.screenshot({ path: path.join(BASELINE_DIR, `mobile_menu_${vp.name}.png`) });
          console.log(`Saved baseline: mobile_menu_${vp.name}.png`);
        }
      } catch (e) {
        console.error('Menu capture error:', e.message);
      }
    }
  }

  await browser.close();
  console.log('--- ALL BASELINES CAPTURED SUCCESSFULLY ---');
}

capture().catch(console.error);
