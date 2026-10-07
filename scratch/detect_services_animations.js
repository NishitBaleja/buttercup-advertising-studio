const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.evaluateOnNewDocument(() => {
    window.__mutations = [];
    window.addEventListener('DOMContentLoaded', () => {
      const target = document.getElementById('services');
      if (!target) return;
      const obs = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === 'attributes') {
            window.__mutations.push({
              target: m.target.className || m.target.tagName,
              attr: m.attributeName,
              val: m.target.getAttribute(m.attributeName)
            });
          }
        }
      });
      obs.observe(target, { attributes: true, subtree: true });
    });
  });

  await page.goto('https://oddlymade.webflow.io/', { waitUntil: 'networkidle2' });
  
  // Smoothly scroll down through the whole page to trigger all animations
  await page.evaluate(async () => {
    const totalHeight = document.body.scrollHeight;
    for (let y = 0; y < totalHeight; y += 200) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  const report = await page.evaluate(() => {
    // Check ScrollTriggers
    let stData = [];
    if (window.ScrollTrigger) {
      stData = window.ScrollTrigger.getAll().map(st => ({
        trigger: st.trigger ? (st.trigger.className || st.trigger.id || st.trigger.tagName) : null,
        start: st.start,
        end: st.end,
        vars: st.vars ? Object.keys(st.vars) : []
      }));
    }
    
    // Check elements inside services that got styles
    const s = document.getElementById('services');
    const styledElements = Array.from(s.querySelectorAll('*')).map(el => {
      return {
        tag: el.tagName,
        class: el.className,
        styleAttr: el.getAttribute('style'),
        transform: window.getComputedStyle(el).transform,
        opacity: window.getComputedStyle(el).opacity,
        filter: window.getComputedStyle(el).filter
      };
    }).filter(x => x.styleAttr);

    return {
      scrollTriggers: stData,
      styledElements,
      mutations: window.__mutations.slice(0, 30)
    };
  });

  console.log('Services report on live site:', JSON.stringify(report, null, 2));
  await browser.close();
})();
