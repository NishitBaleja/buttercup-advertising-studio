/**
 * Buttercup Advertising Studio - Signature Page Transition & Loader System
 * Displays massive purple typography with luxury kinetic animation on white background
 * for Blogs, About Us, Services, and Industry links across all pages.
 */

(function () {
  'use strict';

  if (window.__btrLoaderInitialized) return;
  window.__btrLoaderInitialized = true;

  // 1. Configuration for the 4 Requested Transition Targets (At least 3 seconds)
  const LOADER_CONFIG = {
    blogs: {
      title: 'BLOGS',
      tag: 'BUTTERCUP PERSPECTIVES',
      duration: 3200
    },
    about: {
      title: 'ABOUT US',
      tag: 'OUR DNA & ORIGIN',
      duration: 3200
    },
    services: {
      title: 'SERVICES',
      tag: 'STRATEGY • IDENTITY • CAMPAIGNS',
      duration: 3200
    },
    industry: {
      title: 'INDUSTRY',
      tag: '50+ PRODUCT & SERVICE VERTICALS',
      duration: 3200
    }
  };

  let loaderEl = null;
  let titleBoxEl = null;
  let badgeTextEl = null;
  let barFillEl = null;
  let counterEl = null;
  let isNavigating = false;

  // Determine relative root prefix from current document location
  function getRootPrefix() {
    const scripts = document.querySelectorAll('script[src*="loader.js"]');
    if (scripts.length > 0) {
      const src = scripts[scripts.length - 1].getAttribute('src') || '';
      const match = src.match(/^((\.\.\/)+)/);
      if (match) return match[1];
    }
    return '';
  }

  // 2. Play Ultra-Subtle Harmonious Chime (Pure Web Audio)
  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      // Soft D5 sine chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.045, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.38);

      // Harmonious A5 shimmer
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.09);
      gain2.gain.setValueAtTime(0.038, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.48);
    } catch (e) {}
  }

  // 3. Ensure Loader DOM Element Exists
  function ensureLoaderDOM() {
    if (loaderEl && document.body.contains(loaderEl)) return loaderEl;

    let existing = document.getElementById('btr-page-loader');
    if (existing) {
      loaderEl = existing;
    } else {
      loaderEl = document.createElement('div');
      loaderEl.id = 'btr-page-loader';
      loaderEl.setAttribute('aria-hidden', 'true');
      loaderEl.innerHTML = `
        <div class="btr-loader-ambient-glow"></div>
        <div class="btr-loader-badge">
          <span class="btr-loader-dot"></span>
          <span class="btr-loader-badge-text">BUTTERCUP STUDIO</span>
        </div>
        <div class="btr-loader-title-box">
          <div class="btr-loader-title" id="btr-loader-title-inner"></div>
        </div>
        <div class="btr-loader-progress-wrap">
          <div class="btr-loader-bar-track">
            <div class="btr-loader-bar-fill"></div>
          </div>
          <div class="btr-loader-sub-info">
            <span>EXPERIENCE TRANSITION</span>
            <span class="btr-loader-counter">00</span>%
          </div>
        </div>
        <div class="btr-loader-brand-watermark">Buttercup Advertising Studio</div>
      `;
      document.body.appendChild(loaderEl);
    }

    titleBoxEl = loaderEl.querySelector('#btr-loader-title-inner');
    badgeTextEl = loaderEl.querySelector('.btr-loader-badge-text');
    barFillEl = loaderEl.querySelector('.btr-loader-bar-fill');
    counterEl = loaderEl.querySelector('.btr-loader-counter');

    return loaderEl;
  }

  // 4. Render Kinetic Stagger Characters
  function renderTitleCharacters(text) {
    if (!titleBoxEl) return;
    titleBoxEl.innerHTML = '';

    const chars = [...text];
    chars.forEach((ch, idx) => {
      const box = document.createElement('span');
      box.className = 'btr-loader-char-box';

      const span = document.createElement('span');
      span.className = 'btr-loader-char' + (ch === ' ' ? ' is-space' : '');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.transitionDelay = `${0.035 * idx}s`;

      box.appendChild(span);
      titleBoxEl.appendChild(box);
    });
  }

  // 5. Detect Loader Category for a given link or element
  function detectLoaderCategory(link) {
    if (!link) return null;

    // Explicit override attribute
    const explicit = link.getAttribute('data-loader');
    if (explicit && LOADER_CONFIG[explicit.toLowerCase()]) {
      return explicit.toLowerCase();
    }

    const rawHref = link.getAttribute('href') || '';
    const fullHref = (link.href || '').toLowerCase();
    const text = (link.textContent || '').trim().toLowerCase();

    // Text-based matching (captures dropdown triggers, footer links, etc.)
    if (text.startsWith('blog') || (text.includes('view all') && link.closest('.blog-header, .blog-section, [data-wf-target*="blogs"]'))) {
      return 'blogs';
    }
    if (text === 'about' || text === 'about us') {
      return 'about';
    }
    if (text === 'services' || text === 'our services' || text.startsWith('services')) {
      return 'services';
    }
    if (text === 'industry' || text === 'industries' || text.startsWith('industry')) {
      return 'industry';
    }

    // URL-based matching
    // A. BLOGS
    if (
      fullHref.includes('/blogs') ||
      fullHref.includes('blogs/index.html') ||
      fullHref.includes('blogs.html') ||
      fullHref.includes('blog=')
    ) {
      return 'blogs';
    }

    // B. ABOUT US
    if (
      fullHref.includes('/about') ||
      fullHref.includes('about/index.html') ||
      fullHref.includes('about.html')
    ) {
      return 'about';
    }

    // C. SERVICES
    if (
      fullHref.includes('/services/') ||
      fullHref.includes('brand-strategy') ||
      fullHref.includes('visual-identity') ||
      fullHref.includes('marketing-communication') ||
      fullHref.includes('services.html') ||
      fullHref.includes('#services')
    ) {
      return 'services';
    }

    // D. INDUSTRY
    if (
      fullHref.includes('/industries/') ||
      fullHref.includes('industries/index.html') ||
      fullHref.includes('product-base') ||
      fullHref.includes('service-base') ||
      fullHref.includes('industry.html')
    ) {
      return 'industry';
    }

    return null;
  }

  // 6. Resolve Destination URL for any link or dropdown trigger
  function resolveTargetUrl(link, category) {
    const rawHref = link.getAttribute('href') || '';
    const prefix = getRootPrefix();

    // If it's a void link or anchor without target page
    if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) {
      const dataHref = link.getAttribute('data-href');
      if (dataHref) return dataHref;

      // Check for first link inside parent dropdown
      const wrapper = link.closest('.nav-dropdown-wrapper');
      if (wrapper) {
        const sub = wrapper.querySelector('.industry-cat-card, .em-dropdown-link, a:not(.nav-dropdown-trigger)');
        if (sub && sub.href && !sub.href.startsWith('javascript:')) {
          return sub.href;
        }
      }

      // Default destinations
      if (category === 'services') return prefix + 'pages/services/brand-strategy/index.html';
      if (category === 'industry') return prefix + 'pages/industries/product-base/index.html';
      if (category === 'about') return prefix + 'pages/about/index.html';
      if (category === 'blogs') return prefix + 'pages/blogs/index.html';
    }

    return link.href;
  }

  // 7. Trigger Transition Animation
  function triggerLoader(categoryKey, targetUrl) {
    if (isNavigating) return;
    isNavigating = true;

    const config = LOADER_CONFIG[categoryKey] || LOADER_CONFIG.blogs;
    ensureLoaderDOM();

    // Record for incoming page reveal
    try {
      sessionStorage.setItem('btr_loader_transition', categoryKey);
    } catch (e) {}

    // Populate contents
    if (badgeTextEl) badgeTextEl.textContent = config.tag;
    renderTitleCharacters(config.title);

    // Reset progress
    if (barFillEl) {
      barFillEl.style.transition = 'none';
      barFillEl.style.width = '0%';
    }
    if (counterEl) counterEl.textContent = '00';

    // Activate overlay
    loaderEl.classList.remove('is-exiting', 'is-instant');
    loaderEl.classList.add('is-active');

    // Play micro chime
    playChime();

    // Animate progress bar & counter in next tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (barFillEl) {
          barFillEl.style.transition = `width ${config.duration * 0.88}ms cubic-bezier(0.22, 1, 0.36, 1)`;
          barFillEl.style.width = '100%';
        }

        const startTime = performance.now();
        const duration = config.duration * 0.85;

        function updateCounter(now) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          const currentVal = Math.floor(progress * 100);
          if (counterEl) {
            counterEl.textContent = String(currentVal).padStart(2, '0');
          }
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        requestAnimationFrame(updateCounter);
      });
    });

    // Execute navigation after duration
    setTimeout(() => {
      if (targetUrl) {
        window.location.href = targetUrl;
      } else {
        // If no target, simply reload current page
        window.location.reload();
      }
    }, config.duration);

    // Hard fallback failsafe
    setTimeout(() => {
      if (targetUrl && window.location.href !== targetUrl) {
        window.location.href = targetUrl;
      }
    }, config.duration + 1000);
  }

  // 8. Check for Incoming Page Curtain Exit Reveal
  function checkIncomingReveal() {
    try {
      const prevCategory = sessionStorage.getItem('btr_loader_transition');
      if (prevCategory && LOADER_CONFIG[prevCategory]) {
        sessionStorage.removeItem('btr_loader_transition');

        const config = LOADER_CONFIG[prevCategory];
        ensureLoaderDOM();

        if (badgeTextEl) badgeTextEl.textContent = config.tag;
        renderTitleCharacters(config.title);

        if (barFillEl) {
          barFillEl.style.transition = 'none';
          barFillEl.style.width = '100%';
        }
        if (counterEl) counterEl.textContent = '100';

        loaderEl.classList.add('is-instant');

        setTimeout(() => {
          loaderEl.classList.remove('is-instant');
          loaderEl.classList.add('is-exiting');

          setTimeout(() => {
            loaderEl.classList.remove('is-active', 'is-exiting');
            isNavigating = false;
          }, 650);
        }, 120);
      }
    } catch (e) {}
  }

  // 9. Global Click Delegation
  function initClickInterception() {
    document.addEventListener('click', (e) => {
      // Find closest anchor or button
      const link = e.target.closest('a, [data-loader]');
      if (!link) return;

      // Allow default behavior for new tabs or keyboard modifiers
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || link.target === '_blank') {
        return;
      }

      // Check for category match
      const category = detectLoaderCategory(link);
      if (!category) return;

      const targetHref = resolveTargetUrl(link, category);

      e.preventDefault();
      e.stopPropagation();

      triggerLoader(category, targetHref);
    }, true); // Capture phase to intercept before any other libraries
  }

  // 10. Back / Forward Cache Safety
  window.addEventListener('pageshow', (event) => {
    isNavigating = false;
    if (loaderEl) {
      loaderEl.classList.remove('is-active', 'is-instant', 'is-exiting');
    }
  });

  // 11. Public API
  window.triggerButtercupLoader = triggerLoader;

  // 12. Self-Initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureLoaderDOM();
      initClickInterception();
      checkIncomingReveal();
    });
  } else {
    ensureLoaderDOM();
    initClickInterception();
    checkIncomingReveal();
  }

  console.log('[Buttercup Loader] Active & listening on Blogs, About, Services, and Industry.');
})();
