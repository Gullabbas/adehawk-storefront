const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3001';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'qa_v2_1');

fs.mkdirSync(OUT_DIR, { recursive: true });

// Blank frame detector
async function analyzeFrame(buffer) {
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const totalPixels = width * height;
  const colorBuckets = new Map();

  let edgeTransitions = 0;
  let prevLum = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i] >> 4;
    const g = data[i + 1] >> 4;
    const b = data[i + 2] >> 4;
    const key = (r << 8) | (g << 4) | b;
    colorBuckets.set(key, (colorBuckets.get(key) || 0) + 1);

    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (Math.abs(lum - prevLum) > 35) {
      edgeTransitions++;
    }
    prevLum = lum;
  }

  let maxBucketCount = 0;
  for (const count of colorBuckets.values()) {
    if (count > maxBucketCount) maxBucketCount = count;
  }

  const dominantShare = maxBucketCount / totalPixels;
  // Frame is blank if > 94% dominant single color and fewer than 400 edge transitions
  const isBlank = dominantShare > 0.94 && edgeTransitions < 400;

  return {
    dominantShare: Number((dominantShare * 100).toFixed(1)),
    edgeTransitions,
    isBlank,
  };
}

async function createContactSheet(framePaths, outputPath, cols = 5) {
  if (framePaths.length === 0) return;
  const thumbWidth = 280;
  const thumbHeight = 175;

  const rows = Math.ceil(framePaths.length / cols);
  const sheetWidth = cols * thumbWidth;
  const sheetHeight = rows * thumbHeight;

  const composites = [];
  for (let i = 0; i < framePaths.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const left = col * thumbWidth;
    const top = row * thumbHeight;

    const resized = await sharp(framePaths[i])
      .resize(thumbWidth, thumbHeight, { fit: 'cover' })
      .toBuffer();

    composites.push({
      input: resized,
      left,
      top,
    });
  }

  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
      background: { r: 18, g: 16, b: 14, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);

  console.log(`Generated contact sheet: ${outputPath} (${framePaths.length} frames)`);
}

async function runSuite(mode = 'after') {
  console.log(`\n======================================================`);
  console.log(`   RUNNING ADEHAWK LIVE SCROLL QA SUITE (${mode.toUpperCase()})   `);
  console.log(`======================================================\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=swiftshader',
      '--enable-unsafe-swiftshader',
      '--disable-dev-shm-usage',
    ],
  });

  const VIEWPORTS = [
    { name: 'desktop', width: 1440, height: 900, isMobile: false, throttle: 1 },
    { name: 'tablet', width: 1024, height: 768, isMobile: false, throttle: 1 },
    { name: 'mobile', width: 390, height: 844, isMobile: true, throttle: 4 },
  ];

  const suiteResults = {};

  for (const vp of VIEWPORTS) {
    console.log(`\n--- VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}, Throttle: ${vp.throttle}x) ---`);
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();

    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));

    // Install FPS / Raf monitor in browser
    await page.evaluate(() => {
      window.__frameDeltas = [];
      window.__longTasks = [];
      let lastTime = performance.now();
      function tick(now) {
        const delta = now - lastTime;
        lastTime = now;
        window.__frameDeltas.push(delta);
        if (delta > 50) {
          window.__longTasks.push({ time: now, delta });
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });

    // Apply CPU throttle right before scroll loop to accurately measure scroll/animation FPS
    if (vp.throttle > 1) {
      await client.send('Emulation.setCPUThrottlingRate', { rate: vp.throttle });
    }

    // Measure total document scroll height
    const docMetrics = await page.evaluate(() => {
      return {
        docHeight: document.body.scrollHeight,
        vh: window.innerHeight,
        budgetRatio: Number((document.body.scrollHeight / window.innerHeight).toFixed(1)),
      };
    });
    console.log(`Document Height: ${docMetrics.docHeight}px (${docMetrics.budgetRatio} vh). Budget max: 22 vh.`);

    const vpFrameDir = path.join(OUT_DIR, `frames_${vp.name}_${mode}`);
    fs.mkdirSync(vpFrameDir, { recursive: true });

    const framePaths = [];
    const frameLogs = [];
    let blankFramesCount = 0;
    let nextSampleScroll = 0;

    // Scroll step parameters
    const scrollStep = 120;
    const sampleInterval = 300;
    let currentScroll = 0;
    const maxScroll = docMetrics.docHeight - vp.height;

    while (currentScroll <= maxScroll) {
      // Execute scroll
      if (vp.isMobile) {
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchStart',
          touchPoints: [{ x: 195, y: 500 }],
        });
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: 195, y: 500 - scrollStep }],
        });
        await client.send('Input.dispatchTouchEvent', {
          type: 'touchEnd',
          touchPoints: [],
        });
      } else {
        await page.mouse.wheel({ deltaY: scrollStep });
      }

      currentScroll += scrollStep;
      await new Promise((r) => setTimeout(r, 60));

      // Check if we reached sample threshold
      if (currentScroll >= nextSampleScroll || currentScroll >= maxScroll) {
        const scrollY = await page.evaluate(() => window.scrollY);
        const frameName = `frame_${String(Math.round(scrollY)).padStart(5, '0')}px.png`;
        const framePath = path.join(vpFrameDir, frameName);

        const screenshotBuf = await page.screenshot({ path: framePath, fullPage: false });
        framePaths.push(framePath);

        const frameAnalysis = await analyzeFrame(screenshotBuf);

        // Allow blank frames only for initial intro logo frames (scrollY <= 400)
        const isIntro = scrollY <= 400;
        const failedBlank = frameAnalysis.isBlank && !isIntro;

        if (failedBlank) {
          blankFramesCount++;
          console.warn(`[BLANK FRAME DETECTED] ${frameName} at scrollY: ${scrollY}px (Dominant color share: ${frameAnalysis.dominantShare}%, edgeTransitions: ${frameAnalysis.edgeTransitions})`);
        }

        // Sample ScrollTrigger status
        const stStatus = await page.evaluate(() => {
          const triggers = (window.ScrollTrigger && window.ScrollTrigger.getAll()) || [];
          return triggers.map((st) => ({
            id: st.trigger ? st.trigger.id || st.trigger.className : 'unknown',
            start: st.start,
            end: st.end,
            progress: Number(st.progress.toFixed(3)),
            pinned: !!st.pin,
          }));
        });

        frameLogs.push({
          scrollY,
          frameName,
          dominantShare: frameAnalysis.dominantShare,
          edgeTransitions: frameAnalysis.edgeTransitions,
          isBlank: frameAnalysis.isBlank,
          triggers: stStatus,
        });

        nextSampleScroll += sampleInterval;
      }
    }

    // Retrieve FPS metrics
    const fpsMetrics = await page.evaluate(() => {
      const deltas = window.__frameDeltas || [];
      if (deltas.length === 0) return { p50: 16.6, p95: 16.6, longTasks: 0 };
      deltas.sort((a, b) => a - b);
      const p50 = deltas[Math.floor(deltas.length * 0.5)];
      const p95 = deltas[Math.floor(deltas.length * 0.95)];
      return {
        p50: Number(p50.toFixed(1)),
        p95: Number(p95.toFixed(1)),
        longTasksCount: (window.__longTasks || []).length,
      };
    });

    console.log(`Captured ${framePaths.length} frames.`);
    console.log(`Blank frames detected: ${blankFramesCount}`);
    console.log(`FPS: p50 = ${fpsMetrics.p50}ms, p95 = ${fpsMetrics.p95}ms, Long Tasks (>50ms): ${fpsMetrics.longTasksCount}`);
    console.log(`Console Errors: ${consoleErrors.length}`);

    // Create contact sheet
    const contactSheetPath = path.join(OUT_DIR, `contact_sheet_${vp.name}_${mode}.png`);
    await createContactSheet(framePaths, contactSheetPath, vp.isMobile ? 4 : 5);

    suiteResults[vp.name] = {
      viewport: `${vp.width}x${vp.height}`,
      docHeight: docMetrics.docHeight,
      budgetRatio: docMetrics.budgetRatio,
      framesSampled: framePaths.length,
      blankFramesCount,
      fps: fpsMetrics,
      consoleErrors,
    };

    await page.close();
  }

  // 10x Route Round-Trip Memory & Trigger Leak Test
  console.log(`\n--- 10X ROUTE ROUND-TRIP INTEGRITY TEST ---`);
  const roundTripPage = await browser.newPage();
  await roundTripPage.setViewport({ width: 1440, height: 900 });
  await roundTripPage.goto(BASE_URL, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1000));

  const initialTriggers = await roundTripPage.evaluate(() => {
    return (window.ScrollTrigger && window.ScrollTrigger.getAll().length) || 0;
  });
  console.log(`Initial Home ScrollTriggers: ${initialTriggers}`);

  for (let cycle = 1; cycle <= 10; cycle++) {
    await roundTripPage.goto(`${BASE_URL}/collections/bags`, { waitUntil: 'networkidle2' });
    await roundTripPage.goto(`${BASE_URL}/products/black-leather-executive-briefcase`, { waitUntil: 'networkidle2' });
    await roundTripPage.goto(BASE_URL, { waitUntil: 'networkidle2' });
  }

  const finalTriggers = await roundTripPage.evaluate(() => {
    return (window.ScrollTrigger && window.ScrollTrigger.getAll().length) || 0;
  });
  console.log(`Post 10x Round-Trip Home ScrollTriggers: ${finalTriggers}`);
  const triggerDifference = finalTriggers - initialTriggers;
  console.log(`ScrollTrigger count delta: ${triggerDifference} (${triggerDifference === 0 ? 'PASS ✓ Zero Leaks' : 'FAIL ✗'})`);
  await roundTripPage.close();

  suiteResults.roundTripTest = {
    initialTriggers,
    finalTriggers,
    delta: triggerDifference,
    pass: triggerDifference === 0,
  };

  await browser.close();

  const reportJsonPath = path.join(OUT_DIR, `metrics_${mode}.json`);
  fs.writeFileSync(reportJsonPath, JSON.stringify(suiteResults, null, 2));
  console.log(`Saved metrics report: ${reportJsonPath}\n`);

  return suiteResults;
}

const targetMode = process.argv[2] || 'after';
runSuite(targetMode).catch((err) => {
  console.error('QA Suite error:', err);
  process.exit(1);
});
