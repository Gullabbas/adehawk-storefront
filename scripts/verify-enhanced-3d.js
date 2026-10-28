const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3004';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_3d_viewer');

async function verifyEnhanced3D() {
  console.log('Launching Chrome for Enhanced 3D Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Test 1: Desktop 1440x900
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Open 3D View Modal
  const btn3D = await page.$('button[aria-label="Open 3D 360 degree product view"]');
  if (!btn3D) throw new Error('3D View button not found');
  await btn3D.click();
  await new Promise(r => setTimeout(r, 800));

  // Screenshot 1: Desktop Initial Turntable
  await page.screenshot({ path: path.join(OUT_DIR, 'enhanced_01_desktop_front.png') });

  // Click Side Profile Pill
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('90° Profile'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'enhanced_02_desktop_side_profile.png') });

  // Click Rear Pill
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('180° Rear'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'enhanced_03_desktop_rear.png') });

  // Click Top Architecture
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Top View'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'enhanced_04_desktop_top_architecture.png') });

  // Test Mobile 390x844
  await page.setViewport({ width: 390, height: 844 });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'enhanced_05_mobile_top_view.png') });

  // Switch back to 360 Front on Mobile
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('0° Front'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, 'enhanced_06_mobile_front.png') });

  console.log('All Enhanced 3D screenshots captured successfully!');
  await browser.close();
}

verifyEnhanced3D().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
