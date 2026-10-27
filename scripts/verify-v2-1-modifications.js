const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_v2_1_modifications');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function checkOverlap(r1, r2) {
  return !(
    r1.right <= r2.left ||
    r1.left >= r2.right ||
    r1.bottom <= r2.top ||
    r1.top >= r2.bottom
  );
}

async function runVerification() {
  console.log('Launching Chrome for v2.1 Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // ==========================================
  // TEST 1: MOBILE (390 x 844)
  // ==========================================
  console.log('\n==========================================');
  console.log('TEST 1: MOBILE (390 x 844) VIEWPORT');
  console.log('==========================================');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 950));
  await new Promise(r => setTimeout(r, 1000));

  // Check collision in Hero stage
  const collisionReport = await page.evaluate(() => {
    const card = document.querySelector('.backdrop-blur-\\[24px\\]');
    const controls = document.querySelector('.space-x-2\\.5, .space-x-3');
    const counter = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('— 03'));
    const nextBtn = document.querySelector('button[aria-label="Next slide"]');

    if (!card || !nextBtn) return { error: 'Hero elements not found' };

    const cardRect = card.getBoundingClientRect();
    const nextRect = nextBtn.getBoundingClientRect();
    const counterRect = counter ? counter.getBoundingClientRect() : null;

    return {
      cardRect: { top: cardRect.top, bottom: cardRect.bottom, left: cardRect.left, right: cardRect.right },
      nextRect: { top: nextRect.top, bottom: nextRect.bottom, left: nextRect.left, right: nextRect.right },
      gapBetweenCardAndNext: nextRect.top - cardRect.bottom,
    };
  });

  console.log('Mobile Hero geometry:', collisionReport);
  if (collisionReport.cardRect && collisionReport.nextRect) {
    const isOverlapping = checkOverlap(collisionReport.cardRect, collisionReport.nextRect);
    console.log(`Mobile Hero Card vs Next Button Overlap: ${isOverlapping ? 'COLLISION DETECTED!' : 'PASS (No overlap, clean clearance)'}`);
  }

  await page.screenshot({ path: path.join(OUT_DIR, '01_mobile_hero_cleared.png') });

  // Test Mobile Next Button Click
  console.log('Testing mobile hero next button interaction...');
  await page.click('button[aria-label="Next slide"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '02_mobile_hero_slide2.png') });

  // Scroll to Curated Collections
  console.log('Scrolling to Curated Collections on Mobile...');
  await page.evaluate(() => {
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '03_mobile_collections_initial.png') });

  // Test Mobile Quick Nav Next on Curated Collections
  console.log('Testing mobile Curated Collections next chevron button...');
  const initialCollectionTitle = await page.evaluate(() => {
    const h3 = document.querySelector('#collection-section h3');
    return h3 ? h3.innerText : '';
  });

  await page.click('button[aria-label="Next collection"]');
  await new Promise(r => setTimeout(r, 600));

  const afterCollectionTitle = await page.evaluate(() => {
    const h3 = document.querySelector('#collection-section h3');
    return h3 ? h3.innerText : '';
  });
  console.log(`Collection before: "${initialCollectionTitle}" -> Collection after click: "${afterCollectionTitle}"`);
  await page.screenshot({ path: path.join(OUT_DIR, '04_mobile_collections_navigated.png') });

  // Scroll to Crafted for the Journey (The Craft Pinned)
  console.log('Scrolling to The Craft section on Mobile...');
  await page.evaluate(() => {
    const el = document.getElementById('craft-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '05_mobile_craft_section.png') });

  // Scroll to bottom of The Craft to inspect rounded bottom corners
  await page.evaluate(() => {
    const el = document.getElementById('craft-section');
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollBy(0, rect.bottom - window.innerHeight + 60);
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '06_mobile_craft_bottom_rounded.png') });

  // Scroll to Curated Gift Sets / Wallets Studio
  console.log('Scrolling to Curated Gift Sets / Wallets Studio on Mobile...');
  await page.evaluate(() => {
    const el = document.getElementById('wallets-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '07_mobile_wallet_section.png') });

  // Scroll to bottom of Wallets section to inspect rounded bottom corners
  await page.evaluate(() => {
    const el = document.getElementById('wallets-section');
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollBy(0, rect.bottom - window.innerHeight + 60);
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '08_mobile_wallet_bottom_rounded.png') });

  // ==========================================
  // TEST 2: TABLET (768 x 1024)
  // ==========================================
  console.log('\n==========================================');
  console.log('TEST 2: TABLET (768 x 1024) VIEWPORT');
  console.log('==========================================');
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 950));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '09_tablet_hero.png') });

  await page.evaluate(() => {
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '10_tablet_collections.png') });

  // ==========================================
  // TEST 3: DESKTOP (1440 x 900)
  // ==========================================
  console.log('\n==========================================');
  console.log('TEST 3: DESKTOP (1440 x 900) VIEWPORT');
  console.log('==========================================');
  await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 950));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '11_desktop_hero.png') });

  await page.evaluate(() => {
    const el = document.getElementById('collection-section');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '12_desktop_collections.png') });

  // Check section styles (border-radius and margin-bottom)
  const stylesReport = await page.evaluate(() => {
    const craft = document.getElementById('craft-section');
    const wallet = document.getElementById('wallets-section');
    return {
      craft: craft ? {
        borderRadius: window.getComputedStyle(craft).borderRadius,
        borderBottomWidth: window.getComputedStyle(craft).borderBottomWidth,
        marginBottom: window.getComputedStyle(craft).marginBottom,
      } : null,
      wallet: wallet ? {
        borderRadius: window.getComputedStyle(wallet).borderRadius,
        borderBottomWidth: window.getComputedStyle(wallet).borderBottomWidth,
        marginBottom: window.getComputedStyle(wallet).marginBottom,
      } : null,
    };
  });
  console.log('Section rounded bottom style verification:', stylesReport);

  await browser.close();
  console.log('\nVerification complete! All screenshots saved in docs/qa_v2_1_modifications/');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
