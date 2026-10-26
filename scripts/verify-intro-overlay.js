const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_intro_overlay');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- TEST 1: INITIAL LOAD (SCROLLY = 0) ---');
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500)); // allow logo entrance wipe

  const loadState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    return {
      introVisible: introWrapper ? window.getComputedStyle(introWrapper).display !== 'none' : false,
      headerLogoOpacity: headerLogo ? window.getComputedStyle(headerLogo).opacity : null,
    };
  });
  console.log('Initial load state:', loadState);
  await page.screenshot({ path: path.join(OUT_DIR, '01_on_load_center_logo_only.png') });

  console.log('\n--- TEST 2: MID SCROLL (SCROLLY = 200) ---');
  await page.evaluate(() => window.scrollTo(0, 200));
  await new Promise(r => setTimeout(r, 400));

  const midState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const introLogo = introWrapper ? introWrapper.querySelector('.relative.w-44') : null;
    return {
      introBgColor: introWrapper ? window.getComputedStyle(introWrapper).backgroundColor : null,
      introLogoTransform: introLogo ? introLogo.style.transform : null,
      introLogoOpacity: introLogo ? introLogo.style.opacity : null,
    };
  });
  console.log('Mid scroll state:', midState);
  await page.screenshot({ path: path.join(OUT_DIR, '02_mid_scroll_dissolving_over_slider.png') });

  console.log('\n--- TEST 3: INTRO COMPLETE (SCROLLY = 500) ---');
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise(r => setTimeout(r, 400));

  const completeState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    return {
      introDisplay: introWrapper ? introWrapper.style.display : null,
      headerLogoOpacity: headerLogo ? window.getComputedStyle(headerLogo).opacity : null,
      heroTop: document.getElementById('hero-section')?.getBoundingClientRect().top,
    };
  });
  console.log('Complete state:', completeState);
  await page.screenshot({ path: path.join(OUT_DIR, '03_header_logo_active_slider_at_top.png') });

  await browser.close();
  console.log('\nVerification complete! Screenshots saved to docs/qa_intro_overlay/');
}

verify().catch(console.error);
