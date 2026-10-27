const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://127.0.0.1:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_3d_viewer');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function verify3DView() {
  console.log('Launching Chrome for 3D View Verification...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // ==========================================
  // TEST 1: DESKTOP (1440 x 900)
  // ==========================================
  console.log('\n--- TEST 1: DESKTOP HEADER & 3D MODAL ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Screenshot header showing 3D View button
  await page.screenshot({ path: path.join(OUT_DIR, '01_desktop_header_with_3d_link.png') });

  // Click 3D View in desktop header
  console.log('Clicking 3D View button...');
  const btn3D = await page.$('button[aria-label="Open 3D 360 degree product view"]');
  if (!btn3D) throw new Error('Desktop 3D View button not found in header');
  await btn3D.click();
  await new Promise(r => setTimeout(r, 800));

  // Screenshot open modal initial state
  await page.screenshot({ path: path.join(OUT_DIR, '02_desktop_3d_modal_opened.png') });

  // Click Hotspot on Front View
  console.log('Clicking craftsmanship hotspot...');
  const hotspotBtn = await page.$('button[aria-label^="Hotspot:"]');
  if (hotspotBtn) {
    await hotspotBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(OUT_DIR, '03_desktop_hotspot_tooltip.png') });
  }

  // Click 120° Profile angle pill
  console.log('Clicking 120° Profile pill...');
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'));
    const sidePill = pills.find(p => p.textContent && p.textContent.includes('120°'));
    if (sidePill) sidePill.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '04_desktop_side_profile_view.png') });

  // Click 180° Top angle pill
  console.log('Clicking 180° Top pill...');
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'));
    const topPill = pills.find(p => p.textContent && p.textContent.includes('180°'));
    if (topPill) topPill.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '05_desktop_top_view.png') });

  // Toggle Inspect Grain (Zoom)
  console.log('Activating Inspect Grain zoom mode...');
  await page.evaluate(() => {
    const zoomBtn = document.querySelector('button[aria-label="Toggle Magnifier Zoom"]');
    if (zoomBtn) zoomBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '06_desktop_zoom_inspect_mode.png') });

  // Close modal via Close button
  console.log('Closing 3D modal...');
  await page.click('button[aria-label="Close 3D View"]');
  await new Promise(r => setTimeout(r, 600));

  // ==========================================
  // TEST 2: MOBILE (390 x 844)
  // ==========================================
  console.log('\n--- TEST 2: MOBILE MENU & 3D MODAL ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Open mobile menu
  console.log('Opening mobile navigation menu...');
  await page.click('button[aria-label="Toggle Navigation Menu"]');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '07_mobile_menu_with_3d_link.png') });

  // Click 3D View in mobile menu
  console.log('Clicking mobile 3D View link...');
  await page.evaluate(() => {
    const mobileBtn = document.querySelector('button[aria-label="Open 3D 360 degree product view"]');
    if (mobileBtn) mobileBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT_DIR, '08_mobile_3d_modal_opened.png') });

  // Test angle pill click on mobile
  console.log('Tapping angle pill on mobile...');
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button'));
    const sidePill = pills.find(p => p.textContent && p.textContent.includes('120°'));
    if (sidePill) sidePill.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '09_mobile_3d_side_profile.png') });

  // Test Add to Bag on mobile
  console.log('Tapping Add to Bag on mobile...');
  await page.evaluate(() => {
    const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Add to Bag'));
    if (addBtn) addBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '10_mobile_added_to_bag_toast.png') });

  await browser.close();
  console.log('\n3D View verification complete! All captures saved in docs/qa_3d_viewer/');
}

verify3DView().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
