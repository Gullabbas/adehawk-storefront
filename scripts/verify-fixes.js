const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_fixes_v2_1');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Testing ADEHAWK storefront fixes...');

  // 1. Header scroll progress bar
  await page.goto(`${BASE_URL}?skip_intro=true`, { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '01_header_progress_bar.png') });
  console.log('1. Saved 01_header_progress_bar.png');

  // 2. Curated Collections (CollectionShowcase3D)
  const colSection = await page.$('#collection-section');
  if (colSection) {
    await colSection.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, '03_curated_collections.png') });
    console.log('2. Saved 03_curated_collections.png');
  }

  // 3. The Craft (Crafted for the Journey)
  const craftSection = await page.$('#craft-section');
  if (craftSection) {
    await craftSection.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, '04_the_craft_chapter.png') });
    console.log('3. Saved 04_the_craft_chapter.png');
  }

  // 4. Wallet Studio (Variant Strip on the Right Side)
  const walletSection = await page.$('#wallets-section');
  if (walletSection) {
    await walletSection.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, '05_wallet_studio_side_by_side.png') });
    console.log('4. Saved 05_wallet_studio_side_by_side.png');
  }

  // 5. Executive Lookbook (High Quality)
  const lookbookSection = await page.$('#lookbook-section');
  if (lookbookSection) {
    await lookbookSection.scrollIntoView();
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, '06_executive_lookbook.png') });
    console.log('5. Saved 06_executive_lookbook.png');
  }

  await browser.close();
  console.log('All verification screenshots saved to docs/qa_fixes_v2_1/');
}

run().catch(console.error);
