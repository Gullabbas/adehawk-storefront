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

  console.log('--- TEST 1: INITIAL LOAD (scrollY = 0) ---');
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500)); // allow entrance wipe

  const loadState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    const heroSection = document.getElementById('hero-section');
    return {
      introVisible: introWrapper ? window.getComputedStyle(introWrapper).display !== 'none' : false,
      headerLogoOpacity: headerLogo ? window.getComputedStyle(headerLogo).opacity : null,
      heroTop: heroSection ? heroSection.getBoundingClientRect().top : null,
    };
  });
  console.log('Initial load state:', loadState);
  await page.screenshot({ path: path.join(OUT_DIR, '01_on_load_center_logo_only.png') });

  console.log('\n--- TEST 2: MID SCROLL (scrollY = 400 - PIN ACTIVE, SLIDER STILL AT TOP: 0) ---');
  await page.evaluate(() => window.scrollTo(0, 400));
  await new Promise(r => setTimeout(r, 600));

  const midState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const introLogo = introWrapper ? introWrapper.querySelector('.relative.w-44, .relative.w-56') : null;
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    const heroSection = document.getElementById('hero-section');
    return {
      introBgColor: introWrapper ? window.getComputedStyle(introWrapper).backgroundColor : null,
      introLogoTransform: introLogo ? introLogo.style.transform : null,
      introLogoOpacity: introLogo ? window.getComputedStyle(introLogo).opacity : null,
      headerLogoOpacity: headerLogo ? window.getComputedStyle(headerLogo).opacity : null,
      heroTop: heroSection ? heroSection.getBoundingClientRect().top : null,
    };
  });
  console.log('Mid scroll state (400px):', midState);
  await page.screenshot({ path: path.join(OUT_DIR, '02_mid_scroll_slider_pinned_at_top.png') });

  console.log('\n--- TEST 3: NEAR HEADER HANDOFF (scrollY = 720) ---');
  await page.evaluate(() => window.scrollTo(0, 720));
  await new Promise(r => setTimeout(r, 600));

  const nearState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const introLogo = introWrapper ? introWrapper.querySelector('.relative.w-44, .relative.w-56') : null;
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    const heroSection = document.getElementById('hero-section');
    return {
      introLogoTransform: introLogo ? introLogo.style.transform : null,
      introLogoOpacity: introLogo ? window.getComputedStyle(introLogo).opacity : null,
      headerLogoOpacity: headerLogo ? window.getComputedStyle(headerLogo).opacity : null,
      heroTop: heroSection ? heroSection.getBoundingClientRect().top : null,
    };
  });
  console.log('Near handoff state (720px):', nearState);
  await page.screenshot({ path: path.join(OUT_DIR, '03_near_handoff_logo_at_header.png') });

  console.log('\n--- TEST 4: INTRO COMPLETE (scrollY = 850) ---');
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise(r => setTimeout(r, 600));

  const completeState = await page.evaluate(() => {
    const introWrapper = document.getElementById('intro-scene-wrapper');
    const headerLogo = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    const heroSection = document.getElementById('hero-section');
    return {
      introDisplay: introWrapper ? introWrapper.style.display : null,
      headerLogoOpacity: headerLogo ? window.getComputedStyle(headerLogo).opacity : null,
      heroTop: heroSection ? heroSection.getBoundingClientRect().top : null,
    };
  });
  console.log('Complete state (850px):', completeState);
  await page.screenshot({ path: path.join(OUT_DIR, '04_intro_complete_header_logo_active.png') });

  console.log('\n--- TEST 5: NORMAL PAGE SCROLL (scrollY = 1300 - SLIDER SCROLLS UP NATURALLY) ---');
  await page.evaluate(() => window.scrollTo(0, 1300));
  await new Promise(r => setTimeout(r, 600));

  const postPinState = await page.evaluate(() => {
    const heroSection = document.getElementById('hero-section');
    return {
      heroTop: heroSection ? heroSection.getBoundingClientRect().top : null,
    };
  });
  console.log('Post-pin state (1300px):', postPinState);
  await page.screenshot({ path: path.join(OUT_DIR, '05_normal_page_scroll_hero_moves_up.png') });

  await browser.close();
  console.log('\nVerification complete! All 5 screenshots saved to docs/qa_intro_overlay/');
}

verify().catch(console.error);
