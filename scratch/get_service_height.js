const puppeteer = require('/Users/nishitbaleja/Desktop/web/node_modules/puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://oddlymade.webflow.io/', { waitUntil: 'networkidle2' });
  const dims = await page.evaluate(() => {
    const el = document.querySelector('.service-elements._1st');
    const img = document.querySelector('.service-img');
    return {
      elHeight: el ? el.getBoundingClientRect().height : null,
      imgHeight: img ? img.getBoundingClientRect().height : null,
      elStyle: el ? window.getComputedStyle(el).height : null,
      imgStyle: img ? window.getComputedStyle(img).height : null
    };
  });
  console.log(JSON.stringify(dims, null, 2));
  await browser.close();
})();
