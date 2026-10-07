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
  
  // Scroll to services
  await page.evaluate(() => {
    document.getElementById('services').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: '/Users/nishitbaleja/Desktop/web/scratch/live_services_view.png' });
  
  // Hover over the first service element
  const card1 = await page.$('.service-elements._1st');
  if (card1) {
    await card1.hover();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: '/Users/nishitbaleja/Desktop/web/scratch/live_services_hover.png' });
  }

  // Hover over tool item
  const toolItem = await page.$('.tool-text_wrapper');
  if (toolItem) {
    await toolItem.hover();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: '/Users/nishitbaleja/Desktop/web/scratch/live_services_tool_hover.png' });
  }

  // Check all CSS rules matching service in all stylesheets
  const matchedRules = await page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('service')) {
            rules.push({ selector: rule.selectorText, css: rule.cssText });
          }
        }
      } catch (e) {}
    }
    return rules;
  });
  console.log('All CSS rules for service:');
  matchedRules.forEach(r => console.log(r.css));

  // Also check if any animation / transition styles exist on any service elements
  const computedInfo = await page.evaluate(() => {
    const card = document.querySelector('.service-elements._1st');
    const img = document.querySelector('.service-elements._1st .service-img');
    const header = document.querySelector('.service-header-sticky');
    const group = document.querySelector('.service-group');
    const sCard = window.getComputedStyle(card);
    const sImg = window.getComputedStyle(img);
    return {
      card: {
        transition: sCard.transition,
        animation: sCard.animation,
        top: sCard.top,
        position: sCard.position
      },
      img: {
        transition: sImg.transition,
        animation: sImg.animation
      },
      group: {
        display: window.getComputedStyle(group).display,
        gap: window.getComputedStyle(group).gap
      }
    };
  });
  console.log('Computed Info on live site:', JSON.stringify(computedInfo, null, 2));

  await browser.close();
})();
