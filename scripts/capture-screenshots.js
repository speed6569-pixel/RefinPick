const { chromium } = require('playwright');
const path = require('path');

const baseUrl = 'http://127.0.0.1:3001';
const shots = [
  { url: '/', file: 'docs/screenshots/home.png' },
  { url: '/features', file: 'docs/screenshots/dashboard.png' },
  { url: '/scenario', file: 'docs/screenshots/ai-chat.png' },
  { url: '/transfer', file: 'docs/screenshots/transfer.png' },
  { url: '/overview', file: 'docs/screenshots/products.png' },
  { url: '/login', file: 'docs/screenshots/login.png' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 }, deviceScaleFactor: 1 });

  for (const shot of shots) {
    await page.goto(`${baseUrl}${shot.url}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.resolve(shot.file), fullPage: true });
    console.log(`saved ${shot.file}`);
  }

  await browser.close();
})();
