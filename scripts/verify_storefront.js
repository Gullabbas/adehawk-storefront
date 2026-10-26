const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'qa_screenshots');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function runQA() {
  console.log('--- STARTING STOREFRONT AUTOMATED QA ---');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-accelerated-2d-canvas',
    ],
  });

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(15000);

  // 1. Desktop 1440px Home Hero & Core Sections
  console.log('1. Checking Desktop 1440px Home...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2200));

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_desktop_hero_rest.png') });
  console.log('✓ Saved 01_desktop_hero_rest.png');

  // Verify Slide 1 LCP image exists
  const hasLcpImage = await page.evaluate(() => {
    const img = document.querySelector('img[fetchpriority="high"]') || document.querySelector('img[priority]');
    return !!img;
  });
  console.log('✓ Slide 1 LCP Element present in DOM:', hasLcpImage);

  // Check WebGL or Fallback active
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  console.log('✓ Hero stage visual layer active (canvas count):', canvasCount);

  // Click Next Button to trigger transition
  console.log('2. Triggering slide transition via Next button...');
  await page.click('button[aria-label="Next slide"]');
  await new Promise(r => setTimeout(r, 450));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_desktop_hero_transition_mid.png') });
  console.log('✓ Saved 02_desktop_hero_transition_mid.png');

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_desktop_hero_slide2.png') });
  console.log('✓ Saved 03_desktop_hero_slide2.png');

  // Test Pause / Play Button
  console.log('3. Testing Autoplay Pause / Play button...');
  const pauseBtn = await page.$('button[aria-label="Pause autoplay"]');
  if (pauseBtn) {
    await pauseBtn.click();
    console.log('✓ Clicked Pause button');
  }

  // Scroll down to check editorial sections
  console.log('4. Capturing homepage editorial sections...');
  await page.evaluate(() => window.scrollBy(0, 950));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_desktop_marquee_collections.png') });

  await page.evaluate(() => window.scrollBy(0, 1100));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_desktop_art_of_leather_bags.png') });

  await page.evaluate(() => window.scrollBy(0, 1100));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_desktop_the_craft_wallets.png') });

  await page.evaluate(() => window.scrollBy(0, 1100));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_desktop_shop_the_look_trust.png') });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_desktop_footer.png') });

  // 5. Tablet 768px Viewport
  console.log('5. Checking Tablet 768px Viewport...');
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_tablet_hero.png') });

  // 6. Mobile 375px Viewport
  console.log('6. Checking Mobile 375px Viewport...');
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_mobile_hero.png') });

  // Open mobile menu
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_mobile_menu_open.png') });
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await new Promise(r => setTimeout(r, 400));

  // 7. Collections Page
  console.log('7. Checking /collections/bags...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3001/collections/bags', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_collection_bags.png') });

  // 8. Product Detail Page
  console.log('8. Checking PDP /products/black-leather-executive-briefcase...');
  await page.goto('http://localhost:3001/products/black-leather-executive-briefcase', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_pdp_briefcase.png') });

  // Click Add to Bag
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Add to Bag')) {
      await b.click();
      console.log('✓ Clicked Add to Bag on PDP');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_cart_drawer_open.png') });

  // 9. Shipping Policy
  console.log('9. Checking /pages/shipping-policy...');
  await page.goto('http://localhost:3001/pages/shipping-policy', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15_shipping_policy.png') });

  // 10. Search Page
  console.log('10. Checking /search?q=briefcase...');
  await page.goto('http://localhost:3001/search?q=briefcase', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16_search_results.png') });

  // 11. Cart Page
  console.log('11. Checking /cart...');
  await page.goto('http://localhost:3001/cart', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '17_cart_page.png') });

  // 12. Wishlist Page
  console.log('12. Checking /wishlist...');
  await page.goto('http://localhost:3001/wishlist', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18_wishlist_page.png') });

  await browser.close();
  console.log('--- ALL VISUAL QA SCREENSHOTS CAPTURED SUCCESSFULLY ---');
}

runQA().catch(err => {
  console.error('QA Failed:', err);
  process.exit(1);
});
