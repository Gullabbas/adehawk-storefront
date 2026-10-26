const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function crawl() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  for (const width of [1440, 375]) {
    console.log(`\n--- Crawling Home Page at width ${width} ---`);
    await page.setViewport({ width, height: 900 });
    await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll through the entire page so lazy-loaded images load
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 400;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });

    await new Promise(r => setTimeout(r, 1500));

    const imageReport = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        isBroken: !img.complete || img.naturalWidth === 0,
      }));
    });

    const broken = imageReport.filter(img => img.isBroken);
    console.log(`Total images detected: ${imageReport.length}`);
    console.log(`Broken images count: ${broken.length}`);
    if (broken.length > 0) {
      console.log('Broken images list:');
      broken.forEach(b => console.log(' - SRC:', b.src, '| ALT:', b.alt));
    } else {
      console.log('All images loaded with valid naturalWidth > 0!');
    }
  }

  await browser.close();
}

crawl().catch(console.error);
