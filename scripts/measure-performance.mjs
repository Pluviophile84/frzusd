import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
    (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
});
const results = [];
for (let run = 1; run <= 3; run++) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        window.__metrics.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(process.env.PERF_URL ?? 'http://127.0.0.1:4321');
  await page.waitForTimeout(4000);
  results.push({
    run,
    ...(await page.evaluate(() => ({
      ...window.__metrics,
      transferBytes: performance
        .getEntriesByType('resource')
        .reduce((n, r) => n + r.transferSize, 0),
    }))),
  });
  await context.close();
}
await browser.close();
console.log(
  JSON.stringify(
    {
      method:
        'Chromium, 390x844 @2x, cold cache, 1.6 Mbps down / 750 Kbps up, 150ms latency, 4x CPU slowdown; local production preview, 4s observation',
      results,
    },
    null,
    2,
  ),
);
