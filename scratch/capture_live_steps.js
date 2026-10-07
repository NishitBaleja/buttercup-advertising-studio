const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://oddlymade.webflow.io/', { waitUntil: 'networkidle2' });
  
  const servicesTop = await page.evaluate(() => document.getElementById('services').offsetTop);
  
  const steps = [0, 300, 600, 900, 1200, 1500];
  for (let i = 0; i < steps.length; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), servicesTop + steps[i]);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: `/Users/nishitbaleja/Desktop/web/scratch/live_step_${i}.png` });
  }
  
  console.log('Done capturing steps');
  await browser.close();
})();
