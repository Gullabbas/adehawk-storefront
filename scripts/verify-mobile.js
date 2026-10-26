const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_intro_overlay');

async function verifyMobile() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('--- MOBILE TEST 1: INITIAL LOAD ---');
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_01_on_load.png') });

  console.log('--- MOBILE TEST 2: MID SCROLL (400px) ---');
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_02_mid_scroll.png') });

  console.log('--- MOBILE TEST 3: INTRO COMPLETE (850px) ---');
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, 'mobile_03_intro_complete.png') });

  await browser.close();
  console.log('Mobile verification complete!');
}

verifyMobile().catch(console.error);
