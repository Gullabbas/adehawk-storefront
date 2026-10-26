const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_section_clearance');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Loading page...');
  await page.goto(`${BASE_URL}`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Helper to scroll section into view and check clearance
  async function inspectSection(sectionId, screenshotName) {
    console.log(`\n--- Inspecting ${sectionId} ---`);
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, sectionId);

    await new Promise(r => setTimeout(r, 800));

    const metrics = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      const header = document.querySelector('header');
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      
      let headingEl = null;
      if (id === 'collection-section') {
        headingEl = sec.querySelector('h2');
      } else if (id === 'craft-section') {
        headingEl = sec.querySelector('h2');
      } else if (id === 'lookbook-section') {
        headingEl = sec.querySelector('h2');
      }

      const headingRect = headingEl ? headingEl.getBoundingClientRect() : null;
      const secRect = sec ? sec.getBoundingClientRect() : null;

      // Bottom elements check
      let bottomEl = null;
      if (id === 'collection-section') {
        bottomEl = sec.querySelector('a[href*="/collections/"]');
      } else if (id === 'craft-section') {
        bottomEl = sec.querySelector('.max-w-3xl');
      } else if (id === 'lookbook-section') {
        bottomEl = sec.querySelector('button[class*="bg-cognac"]');
      }
      const bottomRect = bottomEl ? bottomEl.getBoundingClientRect() : null;

      return {
        headerBottom,
        headingTop: headingRect ? headingRect.top : null,
        headingClearance: headingRect ? (headingRect.top - headerBottom) : null,
        bottomElBottom: bottomRect ? bottomRect.bottom : null,
        viewportHeight: window.innerHeight,
        bottomWithinViewport: bottomRect ? (bottomRect.bottom <= window.innerHeight) : null,
      };
    }, sectionId);

    console.log(`${sectionId} metrics:`, metrics);
    await page.screenshot({ path: path.join(OUT_DIR, screenshotName) });
  }

  // 1. Curated Collections
  await inspectSection('collection-section', '01_curated_collections.png');

  // 2. Crafted for the Journey
  await inspectSection('craft-section', '02_crafted_for_journey.png');

  // 3. The Executive Lookbook
  await inspectSection('lookbook-section', '03_executive_lookbook.png');

  await browser.close();
  console.log('\nClearance inspection complete!');
}

verify().catch(console.error);
