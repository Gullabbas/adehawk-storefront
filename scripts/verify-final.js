const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_final_v2_1');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- TEST 1: HEADER LOGO VISIBILITY AFTER LOAD & SCROLL ---');
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  // Scroll down to scrub past intro
  await page.evaluate(() => window.scrollTo(0, 1500));
  await new Promise(r => setTimeout(r, 1200));

  const logoStatus = await page.evaluate(() => {
    const header = document.querySelector('header');
    const logoLink = document.querySelector('header a[aria-label="Adehawk Leather Goods Home"]');
    const logoImg = logoLink ? logoLink.querySelector('img') : null;
    return {
      headerVisible: header ? window.getComputedStyle(header).visibility : null,
      headerOpacity: header ? window.getComputedStyle(header).opacity : null,
      logoLinkVisible: logoLink ? window.getComputedStyle(logoLink).visibility : null,
      logoLinkOpacity: logoLink ? window.getComputedStyle(logoLink).opacity : null,
      logoImgVisible: logoImg ? window.getComputedStyle(logoImg).visibility : null,
      logoImgOpacity: logoImg ? window.getComputedStyle(logoImg).opacity : null,
      logoNaturalWidth: logoImg ? logoImg.naturalWidth : 0,
      logoSrc: logoImg ? logoImg.src : null,
    };
  });
  console.log('Header logo evaluation after scroll:', logoStatus);
  await page.screenshot({ path: path.join(OUT_DIR, 'header_logo_verified.png') });

  console.log('\n--- TEST 2: HERO SLIDER NEW IMAGES ---');
  const sliderStatus = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('#hero-section img')).map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      complete: img.complete,
    }));
    return imgs;
  });
  console.log('Hero slider images:', sliderStatus);
  await page.screenshot({ path: path.join(OUT_DIR, 'hero_slider_verified.png') });

  console.log('\n--- TEST 3: EXECUTIVE LOOKBOOK HOTSPOT POSITION ---');
  const lookbookSection = await page.$('#lookbook-section');
  if (lookbookSection) {
    await lookbookSection.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));

    const hotspotInfo = await page.evaluate(() => {
      // Find pulsing target marker
      const marker = document.querySelector('#lookbook-section .animate-ping')?.parentElement?.parentElement;
      return {
        markerLeft: marker ? marker.style.left : null,
        markerTop: marker ? marker.style.top : null,
      };
    });
    console.log('Hotspot marker coordinates on active Stop 1:', hotspotInfo);
    await page.screenshot({ path: path.join(OUT_DIR, 'lookbook_hotspot_verified.png') });
  }

  console.log('\n--- TEST 4: FOOTER WORDMARK TIMING ---');
  const footerSection = await page.$('footer');
  if (footerSection) {
    await footerSection.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, 'footer_wordmark_verified.png') });
  }

  await browser.close();
  console.log('\nAll checks complete. Screenshots saved to docs/qa_final_v2_1/');
}

verify().catch(console.error);
