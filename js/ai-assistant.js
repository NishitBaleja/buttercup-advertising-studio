/**
 * BUTTERCUP ADVERTISING STUDIO - UNIVERSAL 3D AI ASSISTANT & RADIANT PARTICLE SYSTEM
 * Global Interactive Component & Conversational Intelligence Engine
 */

(function () {
  'use strict';

  // Prevent multiple initializations on the same page
  if (window.__BUTTERCUP_AI_INITIALIZED__) return;
  window.__BUTTERCUP_AI_INITIALIZED__ = true;

  // ==========================================================================
  // 1. AUTO-INJECT DOM ELEMENTS IF NOT ALREADY PRESENT
  // ==========================================================================
  function ensureAiElements() {
    // 1.1 Floating Trigger Widget (Bottom-Right)
    let widget = document.getElementById('btr-ai-orb-widget');
    if (!widget) {
      // Check if legacy toggle exists
      const legacyToggle = document.getElementById('orb-toggle');
      if (legacyToggle && legacyToggle.parentElement) {
        // Wrap existing or insert adjacent
        widget = document.createElement('div');
        widget.id = 'btr-ai-orb-widget';
        widget.className = 'btr-ai-orb-widget';
        legacyToggle.parentNode.insertBefore(widget, legacyToggle);
        widget.appendChild(legacyToggle);
      } else {
        widget = document.createElement('div');
        widget.id = 'btr-ai-orb-widget';
        widget.className = 'btr-ai-orb-widget';
        widget.innerHTML = `
          <canvas class="btr-ai-sparks-canvas" id="btr-ai-sparks-canvas" width="440" height="440"></canvas>
          <div class="btr-ai-orb-halo"></div>
          <button class="btr-ai-orb-button em-orb-toggle" id="orb-toggle" title="Chat with Buttercup AI" aria-label="Open Buttercup AI Assistant">
            <canvas id="orb-canvas" class="em-orb-canvas" width="160" height="160"></canvas>
          </button>
        `;
        document.body.appendChild(widget);
      }
    }

    // Ensure sparks canvas is present inside widget
    if (!document.getElementById('btr-ai-sparks-canvas')) {
      const sparksCv = document.createElement('canvas');
      sparksCv.id = 'btr-ai-sparks-canvas';
      sparksCv.className = 'btr-ai-sparks-canvas';
      sparksCv.width = 440;
      sparksCv.height = 440;
      widget.insertBefore(sparksCv, widget.firstChild);
    }

    // Ensure halo is present inside widget
    if (!widget.querySelector('.btr-ai-orb-halo')) {
      const halo = document.createElement('div');
      halo.className = 'btr-ai-orb-halo';
      widget.insertBefore(halo, widget.querySelector('.em-orb-toggle, .btr-ai-orb-button'));
    }

    // 1.2 Conversational Dynamic Pop Bubble
    let bubble = document.getElementById('em-ai-bubble');
    const bubbleMarkup = `
      <span class="btr-bubble-pulse" title="AI Online"></span>
      <span class="btr-bubble-text" id="btr-bubble-text">Click to talk with Buttercup AI</span>
      <span class="btr-bubble-spark">✦</span>
    `;
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.id = 'em-ai-bubble';
      bubble.className = 'btr-ai-bubble em-ai-bubble';
      bubble.setAttribute('role', 'tooltip');
      bubble.innerHTML = bubbleMarkup;
      widget.appendChild(bubble);
    } else {
      bubble.innerHTML = bubbleMarkup;
      if (bubble.parentElement !== widget) {
        widget.appendChild(bubble);
      }
    }

    // 1.3 Full-Screen AI Assistant Modal Overlay
    let overlay = document.getElementById('em-ai-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'em-ai-overlay';
      overlay.className = 'em-ai-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Buttercup AI Assistant');
      overlay.innerHTML = `
        <div class="em-ai-top-actions">
          <button class="em-ai-btn-icon" id="em-ai-sound-toggle" title="Toggle AI Voice" aria-label="Toggle Voice Sound">
            <svg id="em-icon-sound-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg id="em-icon-sound-off" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </button>
          <button class="em-ai-btn-icon em-ai-btn-close" id="em-ai-close" title="Close AI Assistant" aria-label="Close Assistant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="em-ai-container">
          <div class="em-ai-chat-col">
            <div class="em-ai-messages" id="em-ai-messages">
              <div class="em-ai-msg em-ai-msg-assistant">
                <div class="em-ai-bubble-content">
                  Hey, I'm Buttercup AI! Ask me anything or tap a chip below.
                </div>
              </div>
            </div>
            <div class="em-ai-chips-wrap" id="em-ai-chips">
              <button type="button" class="em-ai-chip" data-query="What do you do?">What do you do?</button>
              <button type="button" class="em-ai-chip" data-query="Show me your projects">Show me your projects</button>
              <button type="button" class="em-ai-chip" data-query="Services & Capabilities">Services &amp; Capabilities</button>
              <button type="button" class="em-ai-chip" data-query="How much does a project cost?">How much does a project cost?</button>
              <button type="button" class="em-ai-chip" data-query="Contact team">Contact team</button>
            </div>
            <form class="em-ai-input-bar" id="em-ai-form">
              <button type="button" class="em-ai-mic-btn" id="em-ai-mic-btn" title="Speak via Microphone" aria-label="Voice Dictation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
              <input type="text" id="em-ai-input" class="em-ai-input" placeholder="Ask me anything..." autocomplete="off" />
              <button type="submit" class="em-ai-send-btn" id="em-ai-send-btn" title="Send message" aria-label="Send">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
            </form>
            <div class="em-ai-api-status">
              <span class="em-ai-api-badge" id="em-ai-api-badge" title="Powered by Google Gemini conversational intelligence">
                <span class="em-ai-api-dot"></span>
                <span id="em-ai-status-text">Connected: Buttercup AI Engine</span>
              </span>
              <button type="button" class="em-ai-key-btn" id="em-ai-key-btn" title="Configure Google Gemini API Key">
                <span>Gemini API Key</span>
              </button>
            </div>
          </div>
          <div class="em-ai-orb-col">
            <div class="em-ai-large-orb-wrap">
              <canvas id="em-ai-large-orb" width="560" height="560" class="em-ai-large-canvas"></canvas>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAiSystem);
  } else {
    initAiSystem();
  }
  window.addEventListener('load', () => {
    initFooterBrandAnimation();
    initWidgetFooterCollision();
  });

  function initFooterBrandAnimation() {
    const brandEls = document.querySelectorAll('.footer-bottom-brand-text');
    brandEls.forEach(el => {
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';

      const text = el.textContent.trim();
      if (text.toLowerCase() === 'buttercup') {
        el.innerHTML = '';
        el.classList.add('has-split');
        text.split('').forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'btr-footer-char';
          span.style.setProperty('--i', i);
          span.textContent = char;
          el.appendChild(span);
        });
      }

      // Smooth interactive magnetic lift on mouse move
      el.addEventListener('mousemove', (e) => {
        const chars = el.querySelectorAll('.btr-footer-char');
        const rect = el.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        chars.forEach((c) => {
          const cRect = c.getBoundingClientRect();
          const charCenter = (cRect.left + cRect.right) / 2 - rect.left;
          const dist = Math.abs(mouseX - charCenter);
          const maxDist = 140; // Proximity field in px

          if (dist < maxDist) {
            const power = 1 - (dist / maxDist);
            const lift = Math.round(power * 28);
            const scale = 1 + (power * 0.12);
            c.style.transform = `translateY(-${lift}px) scale(${scale})`;
            c.classList.add('is-active-hover');
          } else {
            c.style.transform = '';
            c.classList.remove('is-active-hover');
          }
        });
      });

      el.addEventListener('mouseleave', () => {
        const chars = el.querySelectorAll('.btr-footer-char');
        chars.forEach((c) => {
          c.style.transform = '';
          c.classList.remove('is-active-hover');
        });
      });

      // Joyful ripple wave on click
      el.addEventListener('click', () => {
        const chars = el.querySelectorAll('.btr-footer-char');
        chars.forEach((c, i) => {
          setTimeout(() => {
            c.classList.add('is-clicked');
            setTimeout(() => c.classList.remove('is-clicked'), 500);
          }, i * 45);
        });
      });
    });
  }

  function initWidgetFooterCollision() {
    const widget = document.getElementById('btr-ai-orb-widget');
    if (!widget) return;

    let ticking = false;

    function updateCollision() {
      const footers = document.querySelectorAll('.section.is-footer, .footer-section, footer');
      if (!footers || footers.length === 0) {
        widget.style.transform = '';
        return;
      }
      const footer = footers[footers.length - 1];
      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const overlap = windowHeight - footerRect.top;

      if (overlap > 0) {
        // Footer section has entered viewport: push widget up in 1:1 sync with scroll
        widget.style.transform = `translate3d(0, -${Math.round(overlap)}px, 0)`;
      } else {
        widget.style.transform = '';
      }
    }

    function onScrollOrResize() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateCollision();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Native scroll & resize listeners
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Sync with Lenis smooth scroll if active
    if (window.lenis && typeof window.lenis.on === 'function') {
      window.lenis.on('scroll', onScrollOrResize);
    } else {
      let tries = 0;
      const lenisInterval = setInterval(() => {
        tries++;
        if (window.lenis && typeof window.lenis.on === 'function') {
          window.lenis.on('scroll', onScrollOrResize);
          clearInterval(lenisInterval);
        } else if (tries > 30) {
          clearInterval(lenisInterval);
        }
      }, 200);
    }

    // Run initial alignment
    updateCollision();
  }

  function initAiSystem() {
    ensureAiElements();
    initFooterBrandAnimation();
    initWidgetFooterCollision();

    // ==========================================================================
    // 2. ELEMENT REFERENCES & STATE
    // ==========================================================================
    const orbToggle = document.getElementById('orb-toggle');
    const aiBubble = document.getElementById('em-ai-bubble');
    const aiOverlay = document.getElementById('em-ai-overlay');
    const aiCloseBtn = document.getElementById('em-ai-close');
    const aiMessages = document.getElementById('em-ai-messages');
    const aiForm = document.getElementById('em-ai-form');
    const aiInput = document.getElementById('em-ai-input');
    const aiChips = document.getElementById('em-ai-chips');
    const aiSoundToggle = document.getElementById('em-ai-sound-toggle');
    const iconSoundOn = document.getElementById('em-icon-sound-on');
    const iconSoundOff = document.getElementById('em-icon-sound-off');
    const micBtn = document.getElementById('em-ai-mic-btn');
    const keyBtn = document.getElementById('em-ai-key-btn');
    const statusText = document.getElementById('em-ai-status-text');

    let isModalOpen = false;
    let isAiSoundEnabled = true;
    let isAiSpeaking = false;
    let isAiListening = false;
    let isAiThinking = false;
    let isHoveringOrb = false;
    let geminiApiKey = localStorage.getItem('buttercup_gemini_key') || '';
    let drawLargeOrb = null;

    if (geminiApiKey && statusText) {
      statusText.textContent = "Google Gemini: Active";
    }

    // ==========================================================================
    // 3. APPLE INTELLIGENCE / SIRI RESONANCE & DIAMOND STARDUST ENGINE
    //    Ethereal concentric harmonic rings & luxury diamond micro-stars (✦)
    // ==========================================================================
    const sparksCanvas = document.getElementById('btr-ai-sparks-canvas');
    if (sparksCanvas) {
      const sctx = sparksCanvas.getContext('2d');
      const harmonicRings = [];
      const diamondStars = [];
      const stardust = [];
      let auraFrame = 0;

      // Concentric Harmonic Resonance Waves (Siri Aura Ripples)
      class HarmonicRing {
        constructor(isBurst = false) {
          this.cx = 220;
          this.cy = 220;
          this.radius = 66; // Just outside the 64px button
          this.maxRadius = (isBurst ? 210 : 185) + Math.random() * 20;
          this.life = 0;
          this.maxLife = isBurst ? 70 : 85;
          this.speed = isBurst ? (2.2 + Math.random() * 0.8) : (1.35 + Math.random() * 0.4);
          this.angle = Math.random() * Math.PI * 2;
        }

        update() {
          this.life++;
          this.radius += this.speed;
          return this.life < this.maxLife;
        }

        draw(ctx) {
          const p = this.life / this.maxLife;
          const alpha = Math.sin(p * Math.PI) * 0.42;
          if (alpha <= 0.01) return;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.beginPath();
          ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);

          // Siri Chromatic Gradient Stroke (Cyan -> Violet -> Magenta)
          const gx1 = this.cx + Math.cos(this.angle) * this.radius;
          const gy1 = this.cy + Math.sin(this.angle) * this.radius;
          const gx2 = this.cx - Math.cos(this.angle) * this.radius;
          const gy2 = this.cy - Math.sin(this.angle) * this.radius;

          const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
          grad.addColorStop(0, `rgba(56, 189, 248, ${alpha * 0.95})`);  // Electric Cyan
          grad.addColorStop(0.5, `rgba(168, 85, 247, ${alpha})`);       // Radiant Violet
          grad.addColorStop(1, `rgba(244, 63, 94, ${alpha * 0.85})`);   // Neon Rose

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6 * (1 - p * 0.45);
          ctx.shadowColor = 'rgba(168, 85, 247, 0.7)';
          ctx.shadowBlur = 10;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Luxury 4-Pointed Diamond Stars (✦)
      class DiamondStar {
        constructor(isBurst = false) {
          const angle = Math.random() * Math.PI * 2;
          const dist = (isBurst ? 55 : 68) + Math.random() * (isBurst ? 120 : 90);
          this.x = 220 + Math.cos(angle) * dist;
          this.y = 220 + Math.sin(angle) * dist;
          this.life = 0;
          this.maxLife = isBurst ? (35 + Math.random() * 25) : (45 + Math.random() * 30);
          this.size = 2.4 + Math.random() * 3.6;
          this.rot = Math.random() * Math.PI;

          const PALETTE = [
            { r: 255, g: 255, b: 255 }, // Pure White
            { r: 240, g: 171, b: 252 }, // Soft Pink-Lavender
            { r: 56,  g: 189, b: 248 }, // Electric Cyan
            { r: 253, g: 224, b: 71  }  // Sunlight Gold
          ];
          this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        }

        update() {
          this.life++;
          this.rot += 0.015;
          return this.life < this.maxLife;
        }

        draw(ctx) {
          const p = this.life / this.maxLife;
          const alpha = Math.sin(p * Math.PI);
          if (alpha <= 0.01) return;
          const s = this.size * alpha;

          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rot);
          ctx.globalCompositeOperation = 'screen';

          // 4-Point Diamond Star Path
          ctx.beginPath();
          ctx.moveTo(0, -s * 2.2);
          ctx.lineTo(s * 0.45, -s * 0.45);
          ctx.lineTo(s * 2.2, 0);
          ctx.lineTo(s * 0.45, s * 0.45);
          ctx.lineTo(0, s * 2.2);
          ctx.lineTo(-s * 0.45, s * 0.45);
          ctx.lineTo(-s * 2.2, 0);
          ctx.lineTo(-s * 0.45, -s * 0.45);
          ctx.closePath();

          ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha * 0.95})`;
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
          ctx.shadowBlur = 10;
          ctx.fill();

          // Brilliant White Specular Glint
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.35, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // Micro Ambient Stardust (Soft drifting points of light, no trails)
      class AmbientDust {
        constructor() {
          const angle = Math.random() * Math.PI * 2;
          const dist = 65 + Math.random() * 85;
          this.x = 220 + Math.cos(angle) * dist;
          this.y = 220 + Math.sin(angle) * dist;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.r = 0.8 + Math.random() * 1.4;
          this.life = 0;
          this.maxLife = 50 + Math.random() * 40;
          this.color = Math.random() < 0.5 ? '240, 171, 252' : '56, 189, 248';
        }

        update() {
          this.life++;
          this.x += this.vx;
          this.y += this.vy;
          return this.life < this.maxLife;
        }

        draw(ctx) {
          const p = this.life / this.maxLife;
          const alpha = Math.sin(p * Math.PI) * 0.65;
          if (alpha <= 0.01) return;

          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      function triggerAuraBurst() {
        harmonicRings.push(new HarmonicRing(true));
        for (let i = 0; i < 8; i++) {
          diamondStars.push(new DiamondStar(true));
        }
      }

      function animateAura() {
        if (document.hidden) {
          requestAnimationFrame(animateAura);
          return;
        }
        auraFrame++;
        sctx.clearRect(0, 0, sparksCanvas.width, sparksCanvas.height);

        // 1. Periodic Siri Harmonic Rings
        const ringInterval = isHoveringOrb ? 45 : 75;
        if (auraFrame % ringInterval === 0) {
          harmonicRings.push(new HarmonicRing(false));
        }

        // 2. Periodic Diamond Star Twinkles
        const twinkleChance = isHoveringOrb ? 0.35 : 0.16;
        if (Math.random() < twinkleChance) {
          diamondStars.push(new DiamondStar(false));
        }

        // 3. Periodic Ambient Stardust
        if (stardust.length < 18 && Math.random() < 0.25) {
          stardust.push(new AmbientDust());
        }

        // Update and draw rings
        for (let i = harmonicRings.length - 1; i >= 0; i--) {
          if (!harmonicRings[i].update()) {
            harmonicRings.splice(i, 1);
          } else {
            harmonicRings[i].draw(sctx);
          }
        }

        // Update and draw stardust
        for (let i = stardust.length - 1; i >= 0; i--) {
          if (!stardust[i].update()) {
            stardust.splice(i, 1);
          } else {
            stardust[i].draw(sctx);
          }
        }

        // Update and draw diamond stars
        for (let i = diamondStars.length - 1; i >= 0; i--) {
          if (!diamondStars[i].update()) {
            diamondStars.splice(i, 1);
          } else {
            diamondStars[i].draw(sctx);
          }
        }

        requestAnimationFrame(animateAura);
      }

      requestAnimationFrame(animateAura);

      // Interactive hover hooks
      if (orbToggle) {
        orbToggle.addEventListener('mouseenter', () => {
          isHoveringOrb = true;
          triggerAuraBurst();
        });
        orbToggle.addEventListener('mouseleave', () => {
          isHoveringOrb = false;
        });
        orbToggle.addEventListener('click', () => {
          triggerAuraBurst();
        });
      }
    }

    // ==========================================================================
    // 3.1 EPHEMERAL POP ENGINE: Pops in every 4s for ~1.2s, then disappears
    // ==========================================================================
    const POP_MESSAGES = [
      "Click to talk with Buttercup AI ✦",
      "Need branding or packaging? Ask me ↗",
      "Explore 50+ landmark case studies ✦",
      "Calculate your project cost & timeline ↗",
      "Looking to elevate your brand? Let's chat ✦"
    ];

    let popIndex = 0;
    let isBubbleHovered = false;
    let popTimer = null;
    let hideTimer = null;

    function isModalCurrentlyOpen() {
      const overlay = document.getElementById('em-ai-overlay');
      return overlay && overlay.classList.contains('is-open');
    }

    function triggerPopIn() {
      if (!aiBubble || isModalCurrentlyOpen() || isHoveringOrb || isBubbleHovered) return;
      const textEl = document.getElementById('btr-bubble-text');
      if (textEl) {
        textEl.textContent = POP_MESSAGES[popIndex];
        popIndex = (popIndex + 1) % POP_MESSAGES.length;
      }
      aiBubble.classList.add('is-visible');
      aiBubble.classList.add('is-popping');
      setTimeout(() => {
        if (aiBubble) aiBubble.classList.remove('is-popping');
      }, 350);

      // Stay visible for 2 seconds, then smoothly pop out
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!isBubbleHovered && !isHoveringOrb) {
          triggerPopOut();
          scheduleNextPop(6000); // 6 seconds hidden pause
        }
      }, 2000);
    }

    function triggerPopOut() {
      if (!aiBubble) return;
      aiBubble.classList.remove('is-visible');
    }

    function scheduleNextPop(delayMs = 6000) {
      clearTimeout(popTimer);
      popTimer = setTimeout(() => {
        if (!isModalCurrentlyOpen()) {
          triggerPopIn();
        } else {
          scheduleNextPop(6000);
        }
      }, delayMs);
    }

    if (aiBubble) {
      aiBubble.addEventListener('mouseenter', () => {
        isBubbleHovered = true;
        clearTimeout(hideTimer);
        clearTimeout(popTimer);
        aiBubble.classList.add('is-visible');
      });
      aiBubble.addEventListener('mouseleave', () => {
        isBubbleHovered = false;
        triggerPopOut();
        scheduleNextPop(6000);
      });
    }

    if (orbToggle) {
      orbToggle.addEventListener('mouseenter', () => {
        clearTimeout(hideTimer);
        clearTimeout(popTimer);
        if (aiBubble && !isModalCurrentlyOpen()) {
          aiBubble.classList.add('is-visible');
        }
      });
      orbToggle.addEventListener('mouseleave', () => {
        if (!isBubbleHovered) {
          triggerPopOut();
          scheduleNextPop(6000);
        }
      });
    }

    // Start initial pop cycle 2.5 seconds after page load
    scheduleNextPop(2500);

    // ==========================================================================
    // 4 & 5. PROCEDURAL 3D IRIDESCENT HOLOGRAPHIC BUTTERFLY ENGINE
    //    Buttercup signature cyber-morpho / glasswing luxury butterfly
    // ==========================================================================
    function createButterflyParticles(count, cx, cy) {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push({
          x: cx + (Math.random() - 0.5) * 320,
          y: cy + (Math.random() - 0.5) * 320,
          vx: (Math.random() - 0.5) * 0.55,
          vy: -0.32 - Math.random() * 0.55,
          size: 1.5 + Math.random() * 2.8,
          alpha: 0.25 + Math.random() * 0.75,
          phase: Math.random() * Math.PI * 2
        });
      }
      return list;
    }

    function drawButterfly(ctx, w, h, t, particles, isSpeaking, isListening, isThinking, isHovering) {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = (w / 560);

      // Smooth hover bobbing and natural banking tilt
      const bobY = Math.sin(t * 1.6) * (10 * scale);
      const tilt = Math.sin(t * 0.9) * 0.035;
      const bodyY = cy + bobY;

      // Dynamic wing flapping perspective speed based on AI state
      const flapSpeed = isSpeaking ? 4.6 : (isThinking ? 3.8 : (isListening ? 3.2 : (isHovering ? 2.8 : 2.2)));
      const flapAngle = 0.45 + Math.sin(t * flapSpeed) * 0.42;
      const wingScaleX = Math.cos(flapAngle);

      ctx.save();
      ctx.translate(cx, bodyY);
      ctx.rotate(tilt);
      ctx.scale(scale, scale);

      // 1. Ambient Cosmic Aura (Dynamic state reflection)
      const auraRadius = 240;
      const auraGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, auraRadius);
      if (isListening) {
        auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.48)');
        auraGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.24)');
        auraGrad.addColorStop(1, 'transparent');
      } else if (isSpeaking) {
        auraGrad.addColorStop(0, 'rgba(244, 63, 94, 0.44)');
        auraGrad.addColorStop(0.45, 'rgba(168, 85, 247, 0.28)');
        auraGrad.addColorStop(1, 'transparent');
      } else if (isThinking) {
        auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.46)');
        auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.25)');
        auraGrad.addColorStop(1, 'transparent');
      } else {
        auraGrad.addColorStop(0, 'rgba(192, 132, 252, 0.38)');
        auraGrad.addColorStop(0.35, 'rgba(236, 72, 153, 0.24)');
        auraGrad.addColorStop(0.65, 'rgba(56, 189, 248, 0.14)');
        auraGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Floating Diamond Stardust Particles
      if (particles && particles.length > 0) {
        particles.forEach(p => {
          p.y += p.vy;
          p.x += p.vx;
          const limit = 240 * scale;
          if (p.y < cy - limit) p.y = cy + limit * 0.8 + Math.random() * 40;
          if (p.x < cx - limit) p.x = cx + limit;
          if (p.x > cx + limit) p.x = cx - limit;

          const alpha = (Math.sin(t * 3 + p.phase) * 0.35 + 0.65) * p.alpha;
          ctx.save();
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowColor = '#e879f9';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc((p.x - cx) / scale, (p.y - bodyY) / scale, p.size, 0, Math.PI * 2);
          ctx.fill();

          if (p.size > 2.5) {
            const s = p.size * 2;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo((p.x - cx) / scale - s, (p.y - bodyY) / scale);
            ctx.lineTo((p.x - cx) / scale + s, (p.y - bodyY) / scale);
            ctx.moveTo((p.x - cx) / scale, (p.y - bodyY) / scale - s);
            ctx.lineTo((p.x - cx) / scale, (p.y - bodyY) / scale + s);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // 3. Symmetrical 3D Perspective Wings
      function drawWingSide(side) {
        ctx.save();
        ctx.scale(side * wingScaleX, 1);

        // --- HINDWING (Lower Wing) ---
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(8, 20);
        ctx.bezierCurveTo(40, 60, 110, 150, 140, 130);
        ctx.bezierCurveTo(165, 110, 155, 60, 130, 25);
        ctx.bezierCurveTo(115, 5, 60, -5, 10, 5);
        ctx.closePath();

        const hGrad = ctx.createRadialGradient(50, 60, 10, 80, 80, 140);
        hGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        hGrad.addColorStop(0.2, 'rgba(244, 114, 182, 0.88)');
        hGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.9)');
        hGrad.addColorStop(0.8, 'rgba(99, 102, 241, 0.85)');
        hGrad.addColorStop(1, 'rgba(56, 189, 248, 0.8)');

        ctx.fillStyle = hGrad;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.55)';
        ctx.shadowBlur = 16;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.92)';
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Venation lines on hindwing
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(10, 15);
        ctx.quadraticCurveTo(60, 60, 140, 130);
        ctx.moveTo(10, 15);
        ctx.quadraticCurveTo(80, 50, 130, 25);
        ctx.moveTo(40, 45);
        ctx.quadraticCurveTo(90, 85, 120, 125);
        ctx.stroke();

        // Hindwing eye-spot
        ctx.beginPath();
        ctx.arc(105, 85, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(105, 85, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#9333ea';
        ctx.fill();
        ctx.restore();

        // --- FOREWING (Upper Wing) ---
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(5, -15);
        ctx.bezierCurveTo(45, -95, 130, -185, 215, -165);
        ctx.bezierCurveTo(240, -145, 220, -75, 185, -25);
        ctx.bezierCurveTo(160, 15, 120, 35, 10, 5);
        ctx.closePath();

        const fGrad = ctx.createLinearGradient(10, 10, 220, -170);
        fGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        fGrad.addColorStop(0.18, 'rgba(244, 114, 182, 0.92)');
        fGrad.addColorStop(0.42, 'rgba(168, 85, 247, 0.95)');
        fGrad.addColorStop(0.7, 'rgba(124, 58, 237, 0.92)');
        fGrad.addColorStop(0.9, 'rgba(56, 189, 248, 0.9)');
        fGrad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

        ctx.fillStyle = fGrad;
        ctx.shadowColor = 'rgba(236, 72, 153, 0.65)';
        ctx.shadowBlur = 22;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 2.6;
        ctx.stroke();

        // Intricate venation lines on forewing
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(8, -10);
        ctx.quadraticCurveTo(80, -90, 215, -165);
        ctx.moveTo(8, -10);
        ctx.quadraticCurveTo(100, -60, 195, -105);
        ctx.moveTo(8, -10);
        ctx.quadraticCurveTo(110, -25, 185, -25);
        ctx.moveTo(8, -10);
        ctx.quadraticCurveTo(80, 5, 140, 25);
        ctx.moveTo(60, -60);
        ctx.quadraticCurveTo(120, -130, 175, -150);
        ctx.moveTo(90, -45);
        ctx.quadraticCurveTo(145, -75, 185, -65);
        ctx.moveTo(50, -20);
        ctx.quadraticCurveTo(100, -10, 150, 10);
        ctx.stroke();

        // Wingtip Sparkles
        [
          { x: 215, y: -165, r: 4 },
          { x: 195, y: -105, r: 3 },
          { x: 185, y: -25, r: 3.5 }
        ].forEach(sp => {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
          ctx.fill();

          const cs = sp.r * 2.2;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sp.x - cs, sp.y);
          ctx.lineTo(sp.x + cs, sp.y);
          ctx.moveTo(sp.x, sp.y - cs);
          ctx.lineTo(sp.x, sp.y + cs);
          ctx.stroke();
        });

        ctx.restore();
        ctx.restore();
      }

      drawWingSide(-1);
      drawWingSide(1);

      // 4. Central Butterfly Body & Luminous Antennae
      ctx.save();
      const bodyGrad = ctx.createLinearGradient(0, -50, 0, 70);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(0.3, '#f472b6');
      bodyGrad.addColorStop(0.65, '#9333ea');
      bodyGrad.addColorStop(1, '#3b82f6');

      ctx.fillStyle = bodyGrad;
      ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.ellipse(0, -10, 7, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(0, 32, 5, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, -38, 7.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#e879f9';
      ctx.shadowBlur = 10;
      // Left Antenna
      ctx.beginPath();
      ctx.moveTo(-3, -42);
      ctx.bezierCurveTo(-14, -65, -35, -80, -42, -95);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-42, -95, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      // Right Antenna
      ctx.beginPath();
      ctx.moveTo(3, -42);
      ctx.bezierCurveTo(14, -65, 35, -80, 42, -95);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(42, -95, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
      ctx.restore();
    }

    // Mini Butterfly (Bottom Right Trigger Button)
    const orbCanvas = document.getElementById('orb-canvas');
    if (orbCanvas) {
      const orbCtx = orbCanvas.getContext('2d');
      const miniParticles = createButterflyParticles(12, 80, 80);
      let miniTime = 0;

      function drawMiniOrb() {
        if (document.hidden) {
          requestAnimationFrame(drawMiniOrb);
          return;
        }
        miniTime += isHoveringOrb ? 0.034 : 0.022;
        drawButterfly(orbCtx, orbCanvas.width, orbCanvas.height, miniTime, miniParticles, isAiSpeaking, isAiListening, isAiThinking, isHoveringOrb);
        requestAnimationFrame(drawMiniOrb);
      }

      requestAnimationFrame(drawMiniOrb);
    }

    // Large Holographic Butterfly (Inside Modal Overlay)
    const largeOrbCanvas = document.getElementById('em-ai-large-orb');
    if (largeOrbCanvas) {
      const lctx = largeOrbCanvas.getContext('2d');
      const largeParticles = createButterflyParticles(35, 280, 280);
      let largeTime = 0;

      drawLargeOrb = function() {
        if (!isModalOpen || document.hidden) {
          return;
        }
        const speed = isAiSpeaking ? 0.038 : (isAiThinking ? 0.032 : (isAiListening ? 0.028 : 0.02));
        largeTime += speed;
        drawButterfly(lctx, largeOrbCanvas.width, largeOrbCanvas.height, largeTime, largeParticles, isAiSpeaking, isAiListening, isAiThinking, false);

        if (isModalOpen && !document.hidden) {
          requestAnimationFrame(drawLargeOrb);
        }
      };

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isModalOpen && typeof drawLargeOrb === 'function') {
          requestAnimationFrame(drawLargeOrb);
        }
      });
    }

    // ==========================================================================
    // 6. MODAL INTERACTION, VOICE ENGINE & CONTROLS
    // ==========================================================================
    function updateModalUrl(open) {
      try {
        const url = new URL(window.location);
        if (open) {
          url.searchParams.set('ai', 'open');
        } else {
          url.searchParams.delete('ai');
          url.searchParams.delete('emi');
        }
        window.history.replaceState({}, '', url);
      } catch (e) {}
    }

    function openAiModal() {
      if (!aiOverlay) return;
      isModalOpen = true;
      if (aiBubble) aiBubble.classList.remove('is-visible');
      aiOverlay.classList.add('is-open');
      aiOverlay.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('em-modal-open');
      updateModalUrl(true);
      if (typeof drawLargeOrb === 'function') {
        requestAnimationFrame(drawLargeOrb);
      }
      setTimeout(() => {
        if (aiInput) aiInput.focus();
      }, 300);

      // Speak initial welcome if first opening
      if (aiMessages && aiMessages.children.length === 1 && isAiSoundEnabled) {
        setTimeout(() => {
          speakVoice("Hey! I'm Buttercup AI. Ask me anything or tap a chip below.");
        }, 350);
      }
    }

    function closeAiModal() {
      if (!aiOverlay) return;
      isModalOpen = false;
      aiOverlay.classList.remove('is-open');
      aiOverlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('em-modal-open');
      stopSpeech();
      updateModalUrl(false);
      scheduleNextPop(3000);
    }

    // Bind open/close triggers
    if (orbToggle) orbToggle.addEventListener('click', (e) => { e.stopPropagation(); openAiModal(); });
    if (aiBubble) aiBubble.addEventListener('click', (e) => { e.stopPropagation(); openAiModal(); });
    if (aiCloseBtn) aiCloseBtn.addEventListener('click', closeAiModal);

    // ESC key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeAiModal();
      }
    });

    // Check URL on load
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('ai') === 'open' || urlParams.get('emi') === 'open') {
        openAiModal();
      }
    } catch (e) {}

    // Sound Toggle inside AI Modal
    if (aiSoundToggle) {
      aiSoundToggle.addEventListener('click', () => {
        isAiSoundEnabled = !isAiSoundEnabled;
        if (iconSoundOn) iconSoundOn.style.display = isAiSoundEnabled ? 'block' : 'none';
        if (iconSoundOff) iconSoundOff.style.display = isAiSoundEnabled ? 'none' : 'block';
        if (!isAiSoundEnabled) stopSpeech();
      });
    }

    // Google Gemini API Key Setting
    if (keyBtn) {
      keyBtn.addEventListener('click', () => {
        const entered = prompt(
          "Enter your Google Gemini API Key (leaves live Google generative AI connected directly to Buttercup Studio):",
          geminiApiKey
        );
        if (entered !== null) {
          geminiApiKey = entered.trim();
          localStorage.setItem('buttercup_gemini_key', geminiApiKey);
          if (statusText) {
            statusText.textContent = geminiApiKey ? "Google Gemini: Active" : "Google Gemini: Default Engine";
          }
          alert(geminiApiKey ? "Google Gemini Key Saved! Live Google AI connected." : "Using Buttercup Native Studio Knowledge Engine.");
        }
      });
    }

    // ==========================================================================
    // 7. NATURAL VOICE SYNTHESIS ENGINE
    // ==========================================================================
    let preferredVoice = null;

    function loadBestVoice() {
      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const searchPatterns = [
        v => v.name === 'Google US English',
        v => v.name.includes('Google') && v.lang.startsWith('en'),
        v => v.name.includes('Samantha') && (v.name.includes('Enhanced') || v.name.includes('Premium')),
        v => v.name === 'Samantha',
        v => v.name.includes('Ava') && (v.name.includes('Enhanced') || v.name.includes('Premium')),
        v => v.name.includes('Serena'),
        v => v.name.includes('Karen'),
        v => v.name.includes('Victoria'),
        v => v.name.includes('Daniel'),
        v => v.name.includes('Natural') && v.lang.startsWith('en'),
        v => v.name.includes('Jenny') || v.name.includes('Aria') || v.name.includes('Guy'),
        v => v.lang === 'en-US' && !v.name.includes('Bad') && !v.name.includes('Zarvox'),
        v => v.lang.startsWith('en')
      ];

      for (const testFn of searchPatterns) {
        const match = voices.find(testFn);
        if (match) {
          preferredVoice = match;
          break;
        }
      }
    }

    if ('speechSynthesis' in window) {
      loadBestVoice();
      window.speechSynthesis.onvoiceschanged = loadBestVoice;
    }

    function stopSpeech() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      isAiSpeaking = false;
      if (aiSoundToggle) aiSoundToggle.classList.remove('is-speaking');
    }

    function speakVoice(text) {
      if (!isAiSoundEnabled || !('speechSynthesis' in window)) return;
      stopSpeech();

      const clean = text
        .replace(/[*_#`~>↗↳•\-]/g, ' ')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!clean) return;

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 0.98;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (!preferredVoice) loadBestVoice();
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => {
        isAiSpeaking = true;
        if (aiSoundToggle) aiSoundToggle.classList.add('is-speaking');
      };

      utterance.onend = utterance.onerror = () => {
        isAiSpeaking = false;
        if (aiSoundToggle) aiSoundToggle.classList.remove('is-speaking');
      };

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    }

    // Microphone Voice Input (Speech Recognition)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && micBtn) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = false;
      recognizer.lang = 'en-US';

      recognizer.onstart = () => {
        isAiListening = true;
        micBtn.classList.add('is-listening');
        if (aiInput) aiInput.placeholder = "Listening... Speak your question";
      };

      recognizer.onresult = (e) => {
        const text = e.results[0][0].transcript;
        if (aiInput) aiInput.value = text;
        handleUserSubmit(text);
      };

      recognizer.onend = recognizer.onerror = () => {
        isAiListening = false;
        micBtn.classList.remove('is-listening');
        if (aiInput) aiInput.placeholder = "Ask me anything...";
      };

      micBtn.addEventListener('click', () => {
        if (isAiListening) {
          recognizer.stop();
        } else {
          try { recognizer.start(); } catch(err) {}
        }
      });
    } else if (micBtn) {
      micBtn.style.opacity = '0.5';
      micBtn.title = "Voice dictation not supported in this browser";
    }

    // ==========================================================================
    // 8. BUTTERCUP STUDIO COMPREHENSIVE KNOWLEDGE ENGINE (60+ SPECIALIZED DOMAINS)
    // ==========================================================================

    function pickVariant(v, userQuery = '') {
      if (!Array.isArray(v)) return v;
      if (v.length === 1) return v[0];

      const lower = (userQuery || '').toLowerCase();
      const isHindi = /\b(kya|kaise|kaha|mujhe|hum|aap|batao|dikhao|karo|karna|chahiye|hai|hain|hota|baare|mein|se|ko|bhi|kitna|hoga|sirf|dabba|paise|kiska|doge|kitne|banta|milega|lagta|pura)\b/i.test(lower);

      if (isHindi && v.length > 1) {
        return v[1];
      }
      return v[0];
    }

    const STUDIO_KNOWLEDGE = [
      // =========================================================================
      // TIER 1: SPECIFIC CASE STUDIES (Checked FIRST to prevent umbrella hijacking)
      // =========================================================================
      {
        match: /\b(abode)\b/i,
        reply: [
          "Abode is our landmark luxury sustainable living project. We engineered a serene, architectural brand identity, tactile editorial brochure systems, and earthy brand narrative that established them as a pioneer in conscious residential architecture.",
          "Abode ke liye Buttercup ne complete sustainable brand architecture develop kiya—minimalist monogram, stone-textured print brochures, aur eco-conscious spatial storytelling residential buyers ke liye."
        ],
        chips: ["Real Estate Branding", "View Case Studies", "Book a discovery call"]
      },
      {
        match: /\b(vriksh)\b/i,
        reply: [
          "Vriksh is an artisan Ayurvedic botanical brand. We crafted their organic visual identity, holistic packaging architecture, sustainable glass bottle labels, and conscious retail brand story for pan-India distribution.",
          "Vriksh Ayurveda ke liye humne ancient botanical science aur modern luxury aesthetics ko combine kiya—frosted amber glass bottles, botanical leaf debossing, aur shelf-breaking cosmetic cartons ke saath."
        ],
        chips: ["Cosmetics & Skincare", "View Case Studies", "Packaging Design"]
      },
      {
        match: /\b(swaad)\b/i,
        reply: [
          "Swaad is an authentic gourmet food brand. We designed appetite-inducing packaging, custom vernacular letterforms, and vibrant shelf-breaking pouches that achieved instant retail dominance in FMCG.",
          "Swaad ke liye humne supermarket aisles me '3-Second Shelf Battle' jeeta—mouth-watering photography, custom spice gradients, aur FSSAI-compliant packaging architecture design karke."
        ],
        chips: ["FMCG Packaging details", "Crispo Snack Case Study", "Contact team"]
      },
      {
        match: /\b(aura)\b/i,
        reply: [
          "Aura is a modern smart-lifestyle technology brand. We built their futuristic visual language, sleek interface guidelines, and premium unboxing experience for next-gen consumer hardware.",
          "Aura Smart Tech ke liye humne kinetic brand identity design ki—sleek geometric letterforms, matte black rigid box packaging, aur living Figma design system hardware unboxing ke liye."
        ],
        chips: ["Tech Branding", "Web Design", "Let's talk"]
      },
      {
        match: /\b(jimmy)\b/i,
        reply: [
          "Jimmy is a premium cocktail and beverage mixer brand. We designed bold, charismatic packaging silhouettes, retro-modern typography, and eye-catching retail bottle labels engineered for nightlife and modern retail.",
          "Jimmy ke liye humne nightlife aur supermarket shelves dono ke liye bold packaging design ki—retro-modern typography, contrasting neck tags, aur vibrant color-blocking ke saath."
        ],
        chips: ["Packaging Design", "Explore Case Studies", "Book a discovery call"]
      },
      {
        match: /\b(titano)\b/i,
        reply: [
          "Titano LED is an architectural and industrial lighting leader. We built a high-precision corporate identity, technical product catalogue system, and trade exhibition graphics that elevated their commercial footprint.",
          "Titano LED ke liye humne technical lighting specifications ko sleek engineering catalogues aur high-converting B2B distributor decks me transform kiya."
        ],
        chips: ["B2B Branding", "Brochure Design", "Contact team"]
      },
      {
        match: /\b(polka tots|polkatots)\b/i,
        reply: [
          "Polka Tots is a beloved infant and toddler lifestyle brand. We crafted their playful yet trustworthy visual identity, joyful packaging systems, and digital social creative direction.",
          "Polka Tots ke liye humne baby-safe visual identity aur joyful packaging systems design kiye jo 40+ baby lifestyle SKUs me parent trust aur retail shelf appeal build karte hain."
        ],
        chips: ["Packaging Design", "Visual Identity", "Contact team"]
      },
      {
        match: /\b(shivala)\b/i,
        reply: [
          "Shivala is a luxury residential estate in Gujarat. We designed their heritage-meets-modern identity, gold-foiled sales decks, and environmental site hoardings that drove record pre-launch bookings.",
          "Shivala Estates ke liye humne aristocratic emblem, heavy textured linen brochures with gold foil, aur high-impact site hoardings deliver kiye jisne pre-launch sales boost ki."
        ],
        chips: ["Real Estate Branding", "Abode Case Study", "Contact team"]
      },
      {
        match: /\b(noir supply|noir)\b/i,
        reply: [
          "Noir Supply Co is an edgy, contemporary streetwear label. We created their brutalist typographic system, woven garment labels, bespoke apparel hangtags, and minimalist e-commerce digital branding.",
          "Noir Supply Co ke liye humne brutalist typographic branding, woven neck labels, thick matte black hangtags aur edgy streetwear unboxing experience create kiya."
        ],
        chips: ["Fashion Branding", "View Case Studies", "Contact team"]
      },
      {
        match: /\b(beatitude)\b/i,
        reply: [
          "Beatitude celebrates handcrafted Indian weaves and artisanal sarees. We shaped an evocative luxury heritage identity, regal editorial lookbooks, and luxury unboxing packaging honoring master weavers across India.",
          "Beatitude ke liye humne Indian textile heritage se rooted luxury identity aur gold-embossed keepsake garment boxes craft kiye jo har saree purchase ko timeless experience banate hain."
        ],
        chips: ["Luxury Branding", "Fashion Branding", "Contact team"]
      },
      {
        match: /\b(bigly|bigly agro)\b/i,
        reply: [
          "Bigly Agro is an agricultural science and bio-fertilizer innovator. We designed high-clarity vernacular agricultural packaging, durable outdoor bags, and farmer-friendly visual cues that built rapid rural trust.",
          "Bigly Agro ke liye humne farmer-friendly packaging architecture design ki—vernacular language cues, chemical dosage icons, aur weather-resistant outdoor bag prints."
        ],
        chips: ["Packaging Design", "B2B Branding", "Contact team"]
      },
      {
        match: /\b(crispo)\b/i,
        reply: [
          "Crispo is an artisan savory snack brand. We crafted high-energy packaging pouches with metallic finishes, appetite-stimulating photography, and bold flavor color codes for retail impulse purchase.",
          "Crispo ke liye humne high-energy metallic snack pouches design kiye jo supermarket snack aisles me instant visual punch aur impulse purchases create karte hain."
        ],
        chips: ["FMCG Food Strategy", "Swaad Case Study", "Contact team"]
      },
      {
        match: /\b(senal|senal diamonds)\b/i,
        reply: [
          "Senal Diamonds represents timeless luxury bridal diamonds. We crafted their delicate bespoke monogram, rich jewel-tone presentation boxes, and high-jewelry certificate booklets.",
          "Senal Diamonds ke liye humne ultra-refined luxury brand experience engineer kiya: velvet-lined jewelry boxes, micro-embossed authenticity cards, aur bridal diamond lookbooks."
        ],
        chips: ["Luxury Branding", "View Case Studies", "Contact team"]
      },

      // =========================================================================
      // TIER 2: SPECIFIC FOUNDER DILEMMAS & PRACTICAL COMMERCIAL FAQS
      // =========================================================================
      {
        match: /\b(already have a logo|logo already|sirf packaging|only packaging|sirf dabba|dabba design|sirf box|only box|already logo)\b/i,
        reply: [
          "Absolutely! You don't have to start from scratch. If your logo is already set, we can step in exclusively for Packaging Architecture, Brand Guidelines, tactile Brochure Collateral, or your Web Experience while seamlessly honoring your established mark.",
          "Haan, bilkul! Agar aapke paas logo already finalized hai, toh hum exclusively aapke packaging line, 3D bottle/pouch renders, print die-lines, aur regulatory FSSAI layouts par kaam kar sakte hain. Purane logo ko preserve karte hue hum complete retail presence elevate karte hain."
        ],
        chips: ["Packaging Design Process", "Print Proofing details", "Book a discovery call"]
      },
      {
        match: /\b(sirf website|only website|website only|sirf web)\b/i,
        reply: [
          "Yes! If your brand identity is already finalized, our digital studio can design and engineer a bespoke, high-performance website with custom micro-interactions, responsive mobile fluidity, and fast load speeds.",
          "Haan, bilkul! Agar aapka branding already complete hai, toh hum exclusively aapki flagship custom website design aur develop kar sakte hain—kinetic animations, mobile responsiveness, aur high-conversion layouts ke saath."
        ],
        chips: ["Web Capabilities", "Show Case Studies", "Schedule a call"]
      },
      {
        match: /\b(revision|revisions|kitni baar|badal|changes|iterations|kitne options|options milenge)\b/i,
        reply: [
          "We deliver 3 distinct strategic design directions in Stage 1, followed by up to 3 rounds of structured refinements on your chosen direction. Our deep whitespace discovery upfront ensures over 95% of our clients lock their final identity within round 2.",
          "Hum initial stage me 3 completely distinct design directions provide karte hain. Iske baad aapke chosen route par 3 focused rounds of revisions milte hain. Whitespace alignment ki wajah se humare 95% projects round 2 me hi finalize ho jaate hain."
        ],
        chips: ["Our 4-Stage Process", "What if I don't like it?", "Book a discovery call"]
      },
      {
        match: /\b(source files?|open files?|raw files?|ai files?|formats?|vector|cdr|eps|svg|handover|deliverables?|kya kya milega|file format)\b/i,
        reply: [
          "Upon final milestone completion, you receive complete master source files: 100% scalable vector artwork (Adobe Illustrator .AI, EPS, SVG), high-res transparent PNGs, CMYK/Pantone print-ready PDFs, typography hierarchy, and a living Figma design system link.",
          "Project complete hote hi aapko sabhi open master files milti hain: Adobe Illustrator (.AI), vector EPS, SVG, ultra-high-resolution PNGs, press-ready CMYK/Pantone PDFs, aur complete living Figma link—pure commercial rights ke saath."
        ],
        chips: ["Copyright & IP ownership", "Living Brand Guidelines", "Discovery call"]
      },
      {
        match: /\b(copyright|trademark|ipr|intellectual property|ownership|malik|legal rights?|legal protection|patent)\b/i,
        reply: [
          "100% Intellectual Property (IP) and commercial copyright transfer to you upon final invoice settlement. You own all brand marks, packaging artwork, and custom assets free and clear with full global commercialization rights.",
          "Final invoice clear hote hi 100% legal ownership aur commercial copyright aapka hota hai. Aapke paas brand marks aur packaging design ko India ya globally trademark register karne ka pura adhikar hota hai."
        ],
        chips: ["Source Files handover", "Trademark Search", "Book a discovery call"]
      },
      {
        match: /\b(trademark search|tm search|legal safety|tm check|class check)\b/i,
        reply: [
          "Yes! Every brand name and visual mark we craft undergoes phonetic memorability checks, class-specific preliminary trademark screening on the IP India / USPTO portals, and linguistic safety checks to ensure defensibility.",
          "Haan, hum har brand name aur custom logo mark ke liye IP India aur international databases par preliminary class-specific trademark screening karte hain, taaki aapko future me koi legal dispute ya objection face na karna pade."
        ],
        chips: ["Brand Naming Protocol", "Copyright Ownership", "Discovery Call"]
      },
      {
        match: /\b(advance|payment terms?|milestones?|installment|kist|advance kitna|payment schedule|kaise pay)\b/i,
        reply: [
          "We operate on a transparent 3-stage milestone model: 50% advance to initiate sprint kickoff and whitespace research, 30% upon approval of the visual direction, and 20% upon final master vector handover and production guidelines.",
          "Hum transparent milestone schedule par kaam karte hain: 50% advance project kickoff aur strategic discovery ke time, 30% visual design concept approval par, aur bacha 20% final master files aur print guidelines handover ke waqt."
        ],
        chips: ["How much does it cost?", "Our 4-Stage Process", "Discovery Call"]
      },
      {
        match: /\b(pasand na aaye|not like|dislike|agar achha na lage|agar pasand nahi|satisfaction guarantee|what if)\b/i,
        reply: [
          "We eliminate guesswork before sketching a single pixel. Stage 1 is deep discovery, competitive whitespace mapping, and visual moodboard signoff. If the initial 3 directions don't hit the bullseye, we deconstruct your feedback and deliver fresh strategic iterations until you're completely thrilled.",
          "Hum kabhi blind design nahi karte. Pehle hum moodboard, brand attributes aur competitor whitespace lock karte hain. Agar initial 3 options me se koi click na kare, toh hum strategic gap analyze karke fresh directions deliver karte hain jab tak aap 100% satisfied na hon."
        ],
        chips: ["Our 4-Stage Process", "How many revisions?", "Book a discovery call"]
      },
      {
        match: /\b(sample print|print proof|prototype|dummy|physical proof|mockup print|chhapega kaise)\b/i,
        reply: [
          "We provide photorealistic 3D digital renders from all angles. For physical production, we supply exact millimeter-precise vector die-cutter files and coordinate with your packaging manufacturer to inspect pre-press proofs, foil swatches, and paper stocks.",
          "Hum 3D photorealistic digital renders deliver karte hain. Physical print sampling ke liye hum exact die-line vector files prepare karte hain aur aapke printer ke saath paper stock, foil swatch, aur sample dummy verify karwate hain taaki batch production me zero error ho."
        ],
        chips: ["Packaging Design", "Print Technical specs", "Contact team"]
      },
      {
        match: /\b(barcode|qr code|fssai|legal compliance|regulatory|ingredients list|nutrition table|mrp grid)\b/i,
        reply: [
          "Yes! We engineer regulatory packaging elements with surgical precision: GS1 EAN/UPC barcode positioning, dynamic QR codes, FSSAI licensing boxes, veg/non-veg dots, batch/MRP grids, and legal typography that pass retail and export audits.",
          "Haan, packaging design me hum GS1 barcode, QR code, FSSAI logo, nutritional information table, manufacturing batch details, aur recycling symbols sabhi legal standards ke anusaar correctly position karte hain."
        ],
        chips: ["FMCG Packaging", "Swaad Case Study", "Contact team"]
      },
      {
        match: /\b(nda|confidential|secret|agreement|leak|non disclosure)\b/i,
        reply: [
          "Yes, absolutely. We routinely sign mutual Non-Disclosure Agreements (NDAs) before discovery calls to protect your unreleased formulas, trade secrets, patented hardware, or business strategies.",
          "Haan, bilkul! Hum discovery call se pehle mutual NDA (Non-Disclosure Agreement) execute karte hain taaki aapke proprietary business formulas, unreleased products aur ideas 100% confidential aur safe rahein."
        ],
        chips: ["Book a discovery call", "Contact team", "How we work"]
      },
      {
        match: /\b(freelancer|why buttercup|why hire you|differentiator|agency vs freelancer|generic ai)\b/i,
        reply: [
          "Freelancers often lack structural packaging engineering and strategic whitespace research; large advertising agencies charge massive monthly retainers with junior staff execution. Buttercup provides direct partner-level creative direction, proprietary human craft, trademarkable assets, and commercial ROI.",
          "Freelancers ke paas aksar technical print knowledge aur brand strategy depth nahi hoti, aur badi agencies expensive monthly retainers leti hain. Buttercup me aapko direct senior leadership craft, proprietary human intelligence, aur clear milestone delivery milti hai."
        ],
        chips: ["Our 4-Stage Process", "View Case Studies", "Book a discovery call"]
      },
      {
        match: /\b(ahmedabad|office|address|milna|in person|whiteboard|kaha ho|kaha hai|location|city|gujarat)\b/i,
        reply: [
          "Buttercup Advertising Studio is headquartered in Ahmedabad, Gujarat, India. We host founders at our studio for espresso and whiteboard brand sessions! We also partner globally with clients in the USA, UK, Dubai, and Singapore via agile virtual sprints.",
          "Humara main studio Ahmedabad, Gujarat me located hai! Agar aap Ahmedabad me hain, toh coffee aur whiteboard strategy session ke liye humare studio par zaroor aaiye. Baahar ke founders ke saath hum Google Meet par agile design sprints conduct karte hain."
        ],
        chips: ["Schedule Google Meet", "Go to Contact Page", "View Case Studies"]
      },
      {
        match: /\b(founder|ceo|director|leadership|owners|team members|who runs)\b/i,
        reply: [
          "Buttercup Advertising Studio was founded by visionary creative directors with over a decade of domain expertise in brand positioning, typography, packaging architecture, and omnichannel advertising. Our multidisciplinary team combines strategists, typographers, packaging engineers, and digital craftsmen.",
          "Buttercup ko lead karte hain senior creative directors jinke paas 10+ saal ka brand architecture aur packaging engineering experience hai. Humare studio me strategists, typographers, 3D visualizers aur print technical experts shamil hain."
        ],
        chips: ["Where is your office?", "What services do you offer?", "Contact leadership"]
      },

      // =========================================================================
      // TIER 3: SPECIFIC INDUSTRIES (Must precede generic service catch-alls)
      // =========================================================================
      {
        match: /\b(fmcg|food|snack|beverage|spices|tea|coffee|masala|organic food|grocery|kirana)\b/i,
        reply: [
          "In FMCG and Food, purchase decisions happen in under 3 seconds. We engineer appetite-inducing contrast, mouth-watering product renders, structural pouch die-lines, and FSSAI-compliant regulatory typography that break through grocery clutter.",
          "Food & FMCG me hum retail shelf breakout ke liye packaging design karte hain: appetite appeal, vibrant colors, structural matte/gloss finishes, aur FSSAI regulatory hierarchy. Swaad aur Crispo iske live examples hain."
        ],
        chips: ["Swaad FMCG Case Study", "Crispo Snacks Case Study", "Book a discovery call"]
      },
      {
        match: /\b(real estate|builder|property|architecture|architect|construction|flat|bungalow|plot|housing|infra)\b/i,
        reply: [
          "Real estate investments are high-emotion, high-ticket decisions. We craft signature estate identities, gold-foiled architectural sales decks, 3D floor plan brochures, and large-format site hoardings that inspire buyer trust and accelerate pre-launch sales.",
          "Real estate me hum premium architectural branding deliver karte hain: luxury logo monograms, textured linen brochures, site hoardings, aur digital sales kits. Abode aur Shivala Estates humare flagship projects hain."
        ],
        chips: ["Abode Architecture Case Study", "Shivala Estates Case Study", "Book a discovery call"]
      },
      {
        match: /\b(luxury|jewel|jewelry|diamond|gold|gemstone|bridal|high-end)\b/i,
        reply: [
          "Luxury branding commands restraint, tactile prestige, and emotional heart-share. We specialize in deep mineral palettes, micro-monograms, blind debossing, and bespoke unboxing packaging that justify premium price multiples.",
          "Luxury aur Jewelry branding me hum bespoke monograms, deep velvet unboxing boxes, gold foil stamping, aur editorial lookbooks design karte hain jo high price multiples justify karte hain (jaise Senal Diamonds)."
        ],
        chips: ["Senal Diamonds Case Study", "Beatitude Heritage Case Study", "Contact team"]
      },
      {
        match: /\b(cosmetic|cosmetics|skincare|beauty|makeup|serum|ayurveda|herbal|dermat|wellness|hair care)\b/i,
        reply: [
          "Beauty & Skincare consumers demand aesthetic ritual and clinical efficacy. We engineer frosted amber glass finishes, tactile botanical labels, clean ingredient storytelling, and Instagram-worthy bathroom counter presence.",
          "Beauty aur Ayurvedic skincare me packaging hi aapka silent salesman hota hai. Hum tactile finishes, frosted amber bottles, clean ingredient layouts aur luxury cartons engineer karte hain (jaise Vriksh Ayurveda)."
        ],
        chips: ["Vriksh Ayurveda Case Study", "Packaging Design", "Contact team"]
      },
      {
        match: /\b(fashion|apparel|clothing|streetwear|saree|garment|textile brand|wear)\b/i,
        reply: [
          "Fashion brands thrive on visual subculture. We develop iconic brand monograms, woven garment neck labels, thick matte hangtags, keepsake unboxing boxes, and editorial lookbooks that customers wear with pride.",
          "Fashion aur apparel me hum woven labels, luxury hangtags, unboxing packaging aur editorial campaign shoot direction provide karte hain (jaise Noir Supply Co aur Beatitude)."
        ],
        chips: ["Noir Supply Co", "Beatitude Sarees", "Contact team"]
      },
      {
        match: /\b(healthcare|hospital|clinic|pharma|medical|doctor|diagnostic)\b/i,
        reply: [
          "Healthcare branding requires a meticulous balance of clinical authority, modern cleanliness, and human empathy. We craft hospital identity systems, environmental wayfinding signage, and patient-first literature.",
          "Healthcare aur pharma me trust sabse zaroori hai. Hum clean hospital branding, modern patient literature, wayfinding signage aur compliant medical packaging engineer karte hain."
        ],
        chips: ["Brand Strategy", "Visual Identity", "Contact team"]
      },
      {
        match: /\b(tech\b|technology|saas|software|app\b|fintech|hardware|iot)\b/i,
        reply: [
          "Tech branding translates complex code and silicon into category-defining clarity. We engineer sleek geometric brandmarks, modern design tokens in Figma, kinetic digital interfaces, and packaging for hardware devices.",
          "Technology brands ke liye hum modern geometric logos, Figma design systems, sleek dark-mode UI/UX, aur hardware unboxing experiences craft karte hain (jaise Aura Smart Tech)."
        ],
        chips: ["Aura Tech Case Study", "Web Design", "Let's work together"]
      },
      {
        match: /\b(cafe|restaurant|hotel|hospitality|bar\b|dine|food chain|cloud kitchen)\b/i,
        reply: [
          "Hospitality is a multi-sensory brand experience. We design restaurant naming, bespoke menus, custom takeaway containers, interior environmental signage, and staff apparel that elevate the entire dining experience.",
          "Cafes aur restaurants ke liye hum complete dining identity design karte hain: naming, artisanal food menus, takeaway packaging pouches, signage, aur social media branding."
        ],
        chips: ["Packaging Design", "Brand Strategy", "Contact team"]
      },
      {
        match: /\b(b2b|manufacturing|industrial|factory|steel|chemical|textile b2b|distributor)\b/i,
        reply: [
          "B2B buyers are humans too. We help heavy manufacturing, chemical, and engineering firms transform dry technical specifications into authoritative brand leadership that commands enterprise trust.",
          "B2B aur manufacturing companies ke liye hum industrial corporate profiles, technical product catalogues, expo stall designs, aur high-trust digital presence craft karte hain (jaise Titano LED aur Bigly Agro)."
        ],
        chips: ["Titano LED Case Study", "Bigly Agro Case Study", "Contact team"]
      },

      // =========================================================================
      // TIER 4: CORE PILLAR SERVICES
      // =========================================================================
      {
        match: /\b(logo design|logo kaisa|logo banwana|logo kitne|nayi logo|logo process|logo concepts?|logo mark|brandmark|custom logo|logo)\b/i,
        reply: [
          "Our Logo Design process begins with strategic whitespace analysis. We deliver 3 distinct bespoke design directions featuring proprietary typography and scalable marks, test them on real mockups, and refine the chosen direction with complete vector master files.",
          "Logo design me hum 3 strategic design directions deliver karte hain custom typography aur vector marks ke saath. Har logo ko micro 16px favicon se lekar massive billboard tak test kiya jaata hai, aur complete master vector files provide ki jaati hain."
        ],
        chips: ["Brand Guidelines details", "See Logo Projects", "Packaging Design"]
      },
      {
        match: /\b(guideline|guidelines|style guide|brand book|color palette|design system|tokens|figma design)\b/i,
        reply: [
          "We build comprehensive 'Living Brand Guidelines' in Figma and PDF. This covers logo clear-space rules, responsive scaling, Pantone/CMYK/RGB/HEX color codes, typographic scales, icon sets, packaging specs, and do's and don'ts.",
          "Hum Figma aur PDF me comprehensive Brand Guidelines build karte hain: exact color codes (Pantone, CMYK, RGB, HEX), typography hierarchy, icon systems, packaging specs, aur visual do's & don'ts."
        ],
        chips: ["Visual Identity", "Packaging Design", "Discovery Call"]
      },
      {
        match: /\b(packag|box design|pouch|bottle|jar design|label design|carton|dabba|wrapper|shelf breakout|tin design)\b/i,
        reply: [
          "Our Packaging Design practice is engineered to win the '3-Second Shelf Battle'. We design tactile matte finishes, custom spot UV, structural die-lines, and clear nutritional/legal typography that turn ordinary consumer products into retail breakout hits.",
          "Packaging me hum shelf breakout par focus karte hain: 3D visual renders, structural die-cut templates, sensory finishes (foil, deboss, spot UV), aur FSSAI regulatory compliance. Swaad aur Vriksh iske live examples hain."
        ],
        chips: ["View Swaad Packaging", "View Vriksh Ayurvedic", "Packaging cost & timeline"]
      },
      {
        match: /\b(strategy|positioning|whitespace|differentiation|repositioning|archetype|brand narrative)\b/i,
        reply: [
          "Our Brand Strategy practice creates unassailable competitive moats. We uncover market whitespace, sculpt distinct narrative voices, define brand archetypes, and help businesses command premium pricing through emotional heart-share.",
          "Brand Strategy aapke business ko aam commodity se ek emotional choice banati hai. Hum competitor whitespace map karte hain, target audience ki subconscious desires decode karte hain, aur pricing power establish karte hain."
        ],
        chips: ["Brand Naming & Slogans", "Visual Identity Design", "Book a discovery call"]
      },
      {
        match: /\b(naming|brand name|naam|name suggestion|product name|naming process)\b/i,
        reply: [
          "Our Brand Naming protocol develops distinctive, legally trademarkable names. We conduct phonetic memorability tests, multi-language linguistic safety checks, and verify .com domain and category trademark availability.",
          "Brand Naming me hum memorable, legally trademarkable names craft karte hain. Phonetic analysis, international linguistic checks, aur domain/trademark availability screening humare process ka core part hai."
        ],
        chips: ["Brand Slogan & Taglines", "Brand Story", "How long does naming take?"]
      },
      {
        match: /\b(slogan|tagline|manifesto|brand voice|tone of voice|copywriting|storytelling|brand story)\b/i,
        reply: [
          "Words define how your brand sounds in a customer's mind. We author memorable brand taglines, emotional founder manifestos, website hero copy, and consistent tone-of-voice frameworks that convert casual visitors into loyal brand advocates.",
          "Hum memorable taglines, emotional founder manifestos, website hero copy, aur unified brand tone-of-voice frameworks author karte hain jo customer ke dil me jagah banate hain."
        ],
        chips: ["Brand Strategy", "Visual Identity", "Explore Case Studies"]
      },
      {
        match: /\b(rebrand|rebranding|reposition|brand refresh|purana brand|logo change|modernize)\b/i,
        reply: [
          "A rebrand is essential when you've outgrown your original identity, expanded into new markets, or when your visual image no longer reflects your product's premium quality. We protect your existing brand equity while elevating your brand to category leadership.",
          "Rebranding tab zaroori hota hai jab aapka business grow kar chuka ho par aapka visual branding purana lag raha ho. Hum aapke existing customer trust ko protect karte hue complete modern repositioning execute karte hain."
        ],
        chips: ["Book a discovery call", "View Case Studies", "Brand Guidelines"]
      },
      {
        match: /\b(brochure|catalogue|catalog|profile|lookbook|magazine|booklet|pamphlet|deck|corporate profile)\b/i,
        reply: [
          "In a screen-saturated world, bespoke physical print collateral leaves an indelible impression. We design luxury editorial brochures, tactile catalogues, and corporate magazines with curated paper stocks, foil stamping, and editorial typography.",
          "Corporate brochures aur product catalogues me hum tactile paper stocks, foil stamping, aur clean editorial layouts use karte hain jo B2B meetings aur sales pitches me multi-million deals convert karne me madad karte hain."
        ],
        chips: ["Pitch Deck Design", "Visual Identity", "Contact team"]
      },
      {
        match: /\b(pitch deck|presentation|investor deck|sales presentation|keynote)\b/i,
        reply: [
          "We design high-stakes investor pitch decks, corporate keynote presentations, and sales collateral in Figma, PowerPoint, or Keynote. We turn complex business metrics and growth roadmaps into clean, compelling visual narratives that win capital.",
          "Hum investor pitch decks aur corporate keynotes ko clean, data-driven visual stories me transform karte hain jo venture capital investors aur institutional buyers ko impress karti hain."
        ],
        chips: ["Brochure Design", "Brand Strategy", "Discovery Call"]
      },
      {
        match: /\b(marketing|campaign|campaigns|ad\b|ads\b|advertising|social media|creative direction|prachar)\b/i,
        reply: [
          "We direct high-impact omnichannel creative campaigns—from cinematic brand films and scroll-stopping social ad creatives to full-scale launch blitzes that drive measurable revenue and category dominance.",
          "Marketing campaigns me hum bold art direction aur human psychology use karte hain: high-converting Meta ads, thumb-stopping Instagram feeds, aur large-format outdoor billboards jo real revenue generate karein."
        ],
        chips: ["Social Media Creatives", "Brand Shoots", "Paid Campaigns"]
      },
      {
        match: /\b(social media|instagram|reels|content strategy|meta ads|facebook ads)\b/i,
        reply: [
          "We architect monthly content strategies, high-performing Instagram feed systems, motion graphic reels, and paid performance ad sets designed to stop thumbs and build a passionate brand community.",
          "Social media me hum monthly content strategy, aesthetic Instagram feeds, motion reels, aur paid performance ad creatives design karte hain jo brand community aur sales dono build karein."
        ],
        chips: ["Creative Campaigns", "Brand Shoots", "Book a discovery call"]
      },
      {
        match: /\b(brand shoot|photography|photoshoot|video shoot|commercial|ad film)\b/i,
        reply: [
          "We provide complete creative direction for brand photography and cinematic commercials—from moodboard creation, model casting, and location scouting to on-set art direction and final color grading.",
          "Photoshoots aur ad films ke liye hum complete creative direction provide karte hain: moodboards, model casting, set styling, on-shoot art direction, aur final high-end color grading."
        ],
        chips: ["Marketing Campaigns", "Packaging Design", "Contact team"]
      },
      {
        match: /\b(website|web design|web development|site banwana|web page|landing page|ui\b|ux\b)\b/i,
        reply: [
          "We design and build bespoke, award-winning digital experiences. From smooth kinetic micro-interactions and custom typography to high-performance responsive code, our websites feel alive and drive commercial conversion.",
          "Web design me hum bespoke digital experiences engineer karte hain: kinetic micro-animations, clean typography, lightning-fast speed, aur 100% responsive layouts jo visitors ko customers me convert karein."
        ],
        chips: ["Show case studies", "Brand Strategy", "Contact team"]
      },
      {
        match: /\b(cost|price|pricing|charge|budget|rate|fee|fees|kitna kharcha|kitna lagega|quotation|quote|estimate|package)\b/i,
        reply: [
          "Every brand partnership is tailored to growth milestones. We offer bespoke milestone-based packages: starting from focused Startup Brand Sprints to Full Enterprise Systems. Schedule a 20-minute discovery call to receive a transparent roadmap and quote.",
          "Hum project scope ke hisaab se fixed milestone pricing offer karte hain: jaise startup brand sprint, retail packaging rollout, ya full enterprise rebranding. 20-min free discovery call schedule karein jisme hum exact roadmap aur quotation deliver karte hain."
        ],
        chips: ["Book a discovery call", "Our 4-stage process", "Explore Case Studies"]
      },
      {
        match: /\b(timeline|how long|kitna time|duration|days|weeks|kitne din|kab tak|time frame)\b/i,
        reply: [
          "Project timelines depend on scope: 1) Lean Brand Identity Sprint: 3 to 4 weeks, 2) Comprehensive Brand Strategy & Identity: 5 to 7 weeks, 3) Packaging Design System: 3 to 5 weeks. We prioritize craft and velocity.",
          "Project duration scope par depend karta hai: Lean Brand Sprint 3-4 weeks me, Packaging System 3-5 weeks me, aur Full Strategic Rebrand 5-8 weeks me complete hota hai. Urgent launch deadlines ke liye hum accelerated sprints bhi schedule karte hain."
        ],
        chips: ["How much does it cost?", "Our 4-stage process", "Book a discovery call"]
      },
      {
        match: /\b(process|methodology|how do you work|steps|stages|phases|kaise kaam)\b/i,
        reply: [
          "Our 4-stage process guarantees clarity and velocity: 1) Deep Discovery & Whitespace Research, 2) Strategic Positioning & Narrative Architecture, 3) Visual Identity & Creative Crafting, and 4) Multi-channel Rollout & Production Guidelines.",
          "Humara 4-Stage Process: 1) Discovery & Whitespace Analysis, 2) Strategy & Brand Narrative, 3) Custom Visual Identity & Packaging Crafting, aur 4) Final Rollout Guidelines & Vector Master Files handover."
        ],
        chips: ["Book a discovery call", "Visual Identity", "Case Studies"]
      },
      {
        match: /\b(startup|seed|early stage|naya business|nayi company|new brand)\b/i,
        reply: [
          "We love partnering with ambitious founders from day zero! For early-stage startups, we offer high-velocity Brand Sprints that deliver an investor-ready identity, pitch deck, core packaging, and launch guidelines in 3-4 weeks.",
          "Early-stage startups ke liye hum high-velocity Brand Sprints run karte hain jo 3-4 weeks me investor-ready logo, pitch deck, initial packaging aur launch identity deliver karte hain taaki aap zero day se stand out karein."
        ],
        chips: ["Pitch Deck Design", "Brand Strategy", "Discovery Call"]
      },
      {
        match: /\b(print|printing|press|paper|vendor|print karate ho|chhapega)\b/i,
        reply: [
          "We engineer 100% press-ready artwork (CMYK + Pantone separations, vector die-lines, bleed margins). While we don't operate printing presses ourselves, we supervise printing vendors, approve paper stocks, and oversee print proofing to ensure flawless execution.",
          "Hum 100% press-ready artwork prepare karte hain: Pantone separations, vector die-lines, foil stamping masks, aur spot UV plates. Hum aapke printing vendors ke saath coordinate karke paper stock aur sample dummy proofs approve karte hain."
        ],
        chips: ["Packaging Design", "Brochure Design", "Contact team"]
      },

      // =========================================================================
      // TIER 5: GENERAL FALLBACK CATCH-ALLS (Placed LAST)
      // =========================================================================
      {
        match: /\b(projects?|portfolio|case stud(y|ies)|showcase|past work|samples|kaam dikhao|portfolio dikhao|show me your work)\b/i,
        reply: [
          "We've delivered transformational rebrands and campaigns across 50+ product categories and 30+ service industries, including Abode (Luxury Living), Vriksh (Ayurvedic Skincare), Swaad (Gourmet FMCG), Aura (Smart Tech), Jimmy (Beverages), Titano (Architectural Lighting), and Polka Tots. Tap below to explore!",
          "Humne 50+ product industries aur 30+ service sectors me landmark rebrands deliver kiye hain—jaise Abode, Vriksh Ayurveda, Swaad FMCG, Aura Tech, Titano LED, aur Polka Tots. Aap kis industry ka case study dekhna chahte hain?"
        ],
        chips: ["View Abode (Architecture)", "View Swaad (FMCG)", "View Vriksh (Ayurveda)", "View Aura (Tech)"]
      },
      {
        match: /\b(what do you do|what services|kya karte ho|services kya hai|kya service dete ho|capabilities)\b/i,
        reply: [
          "Buttercup Advertising Studio provides end-to-end creative solutions across 3 core pillars: 1) Brand Strategy & Naming, 2) Visual Identity & Packaging Architecture, and 3) Marketing Campaigns, Digital Experiences & Print Collateral.",
          "Buttercup Studio me hum 3 main areas me specialize karte hain: 1) Brand Strategy & Positioning, 2) Custom Logo, Packaging & Design Systems, aur 3) Advertising Campaigns, High-performance Websites & Print Collateral."
        ],
        chips: ["Brand Strategy details", "Packaging Design", "Show me your projects"]
      },
      {
        match: /\b(who are you|what are you|what is this|emi\b|buttercup ai|about buttercup|agency|about you|who is buttercup)\b/i,
        reply: [
          "I'm Buttercup AI, the conversational intelligence of Buttercup Advertising Studio. We are an award-winning creative brand consultancy partnering with ambitious founders to build category-leading brands across Brand Strategy, Visual Identity, and high-impact Marketing Campaigns.",
          "Buttercup Advertising Studio is a specialized branding, packaging, and creative consultancy. We help companies command premium pricing and emotional heart-share through strategic whitespace mapping and artisanal human intelligence."
        ],
        chips: ["What services do you offer?", "Show me your projects", "Book a discovery call"]
      },
      {
        match: /\b(contact|hire|talk|email|call|reach|phone|whatsapp|appointment|meeting|baat karni)\b/i,
        reply: [
          "You can connect directly with our leadership team: email info@buttercup.in, or click the 'Let's talk' button in the navigation to book a direct 20-minute discovery session with our senior creative directors.",
          "Aap humare leadership team se directly jud sakte hain: email info@buttercup.in par bhejkar ya website ke 'Let's talk' button par click karke direct discovery consultation book kar sakte hain!"
        ],
        chips: ["Go to Contact Page", "What do you do?", "Show projects"]
      },
      {
        match: /\b(job|jobs|career|careers|hiring|intern|internship|vacancy|join)\b/i,
        reply: [
          "We are always scouting for visionary brand strategists, art directors, and visual designers who push creative boundaries. Check out our Careers section or drop your portfolio to our team via the Contact page.",
          "Hum hamesha passionate brand strategists, graphic designers aur visual storytellers ki talaash me rehte hain. Contact page ke through apna portfolio humari team ko zaroor share karein!"
        ],
        chips: ["Contact team", "Explore Case Studies", "About Buttercup"]
      },
      {
        match: /\b(thank|thanks|dhanyawad|shukriya|nice|awesome|great|cool|mast|super|good|love it)\b/i,
        reply: [
          "You're most welcome! We love talking about brand craft. If you have an exciting venture in mind, let's bring it to life together.",
          "Shukriya! We take pride in building category-leading brands with meticulous human craft. Let us know when you're ready to create something iconic together!"
        ],
        chips: ["Book a discovery call", "Show Case Studies", "Explore Services"]
      },
      {
        match: /^(hi|hello|hey|hola|namaste|namaskar|pranam|kem cho|sup|yo|good morning|good evening|good afternoon)\b/i,
        reply: [
          "Namaste & Kem Cho! Welcome to Buttercup Advertising Studio. I'm Buttercup AI. How can I help elevate your brand today? Feel free to ask about our services, case studies, or pricing!",
          "Hello! Welcome to Buttercup Advertising Studio. Whether you're planning a new product launch, a complete rebrand, or scroll-stopping packaging, I'm here to assist!"
        ],
        chips: ["What do you do?", "Show me your projects", "How much does a project cost?"]
      }
    ];

    // ==========================================================================
    // MULTI-DIMENSIONAL SEMANTIC FALLBACK SYNTHESIZER
    // Analyzes user query across 10+ core intent vectors to ALWAYS provide distinct,
    // deeply relevant answers instead of repetitive boilerplate.
    // ==========================================================================
    function generateSmartFallback(rawQuery) {
      const q = rawQuery.trim();
      const lower = q.toLowerCase();

      const isHindi = /\b(kya|kaise|kaha|mujhe|hum|aap|batao|dikhao|karo|karna|chahiye|hai|hain|hota|baare|mein|se|ko|bhi|kitna|hoga)\b/i.test(lower);

      // Intent Vectors Mapping
      const VECTORS = {
        PACKAGING: /\b(package|packaging|pack|box|pouch|bottle|jar|label|carton|tin|wrapper|dabba|sticker|seal|unboxing|shelf)\b/i,
        VISUAL: /\b(logo|identity|visual|font|typography|color|palette|graphic|symbol|mark|emblem|icon|monogram|aesthetic)\b/i,
        STRATEGY: /\b(strategy|position|positioning|whitespace|narrative|story|voice|tone|slogan|tagline|rebrand|niche|audience|competitor)\b/i,
        CAMPAIGN: /\b(ad|ads|campaign|marketing|social|instagram|reels|media|content|billboard|outdoor|shoot|film|video|viral)\b/i,
        WEB_DIGITAL: /\b(web|website|digital|online|ui|ux|app|code|developer|landing|page|responsive|ecommerce|shop)\b/i,
        PRINT: /\b(print|printing|brochure|catalogue|catalog|magazine|profile|paper|foil|emboss|uv|cmyk|pantone|deck|flyer)\b/i,
        PRICING: /\b(cost|price|pricing|charge|budget|rate|fee|fees|kharcha|quote|quotation|estimate|package|money|paisa)\b/i,
        TIMELINE: /\b(time|duration|timeline|schedule|days|weeks|how long|kitna time|fast|urgent|deadline)\b/i,
        PROCESS: /\b(process|steps|how|methodology|stage|stages|deliverables|handover|figma|workflow|collaborate)\b/i,
        INDUSTRY_FOOD: /\b(food|snack|fmcg|beverage|spices|tea|coffee|masala|organic|grocery|restaurant|cafe)\b/i,
        INDUSTRY_BEAUTY: /\b(beauty|cosmetic|cosmetics|skincare|hair|oil|ayurveda|wellness|herbal|dermat|perfume)\b/i,
        INDUSTRY_REALTY: /\b(real estate|builder|property|infra|architecture|building|flat|housing|project)\b/i,
        INDUSTRY_LUXURY: /\b(luxury|diamond|jewelry|jewel|gold|premium|high-end|fashion|apparel|couture)\b/i,
        LOCATION: /\b(office|ahmedabad|gujarat|india|visit|address|map|place|location|city)\b/i
      };

      // Match strongest vector
      if (VECTORS.PACKAGING.test(lower)) {
        if (isHindi) {
          return {
            text: pickVariant([
              "Packaging design me hum shelf impact aur consumer psychology par focus karte hain. Hum 3D renders, vector die-cutter files, aur Pantone color separations deliver karte hain taaki printing me exact finish mile.",
              "Aapke packaging ke liye, hum tactile finishes (matte, spot UV, foil) aur clear FSSAI/nutrition layout design karte hain jo retail shelf par 3 second me customer ka attention capture kare."
            ]),
            chips: ["↳ Packaging portfolio dikhao", "↳ Print files me kya milta hai?", "↳ Discovery call book karein"]
          };
        }
        return {
          text: pickVariant([
            "For packaging, we focus on tactile shelf presence and the '3-Second Shelf Battle'. We design structural die-lines, 3D renders, and press-ready Pantone separations so your product breaks through the retail noise.",
            "Our packaging architecture blends food/cosmetic regulatory compliance with high-end sensory finishes like soft-touch lamination, metallic foils, and custom emboss plates."
          ]),
          chips: ["↳ View Swaad Case Study", "↳ View Vriksh Packaging", "↳ Packaging Timeline & Cost"]
        };
      }

      if (VECTORS.VISUAL.test(lower)) {
        if (isHindi) {
          return {
            text: pickVariant([
              "Visual Identity me hum custom logo marks, proprietary typography, aur Figma design systems craft karte hain. Stock templates use nahi karte—har curve aur letterform unique hota hai.",
              "Humare Visual Identity deliverables me vector master files (AI, EPS, SVG), complete brand guidelines, color palettes (Pantone, CMYK, HEX), aur real-life mockup applications shamil hote hain."
            ]),
            chips: ["↳ Logo design process", "↳ Brand guidelines details", "↳ Portfolio dikhao"]
          };
        }
        return {
          text: pickVariant([
            "Regarding Visual Identity, we craft custom brandmarks, bespoke typography, and living design systems in Figma. Zero generic templates—every mark is engineered for cross-media scalability and legal protection.",
            "Our visual deliverables include vector master source files (AI, EPS, SVG), complete typography hierarchy, Pantone/CMYK/RGB color codes, and comprehensive brand books."
          ]),
          chips: ["↳ Logo Design Process", "↳ Living Brand Guidelines", "↳ View Logo Case Studies"]
        };
      }

      if (VECTORS.STRATEGY.test(lower)) {
        if (isHindi) {
          return {
            text: "Brand Strategy aapke business ko aam commodity se ek emotional choice banati hai. Hum competitor whitespace map karte hain, tone of voice define karte hain, aur pricing power build karte hain.",
            chips: ["↳ Positioning details", "↳ Naming & Slogans", "↳ Discovery call"]
          };
        }
        return {
          text: "Brand Strategy is the foundation of competitive differentiation. We uncover category whitespace, define your brand archetype and voice, and build an emotional narrative that commands pricing power.",
          chips: ["↳ Category Whitespace", "↳ Brand Storytelling", "↳ Book a discovery call"]
        };
      }

      if (VECTORS.CAMPAIGN.test(lower)) {
        if (isHindi) {
          return {
            text: "Marketing campaigns me hum bold creative direction provide karte hain—scroll-stopping Instagram reels, Meta ad sets, aur high-impact outdoor billboards jo real revenue generate karein.",
            chips: ["↳ Campaign portfolio", "↳ Social media creatives", "↳ Discovery call"]
          };
        }
        return {
          text: "For Marketing Campaigns, we blend human storytelling with commercial conversion—producing scroll-stopping digital ad creatives, monthly social feeds, and cinematic campaign visuals.",
          chips: ["↳ Digital Ad Creatives", "↳ Campaign Case Studies", "↳ Schedule consultation"]
        };
      }

      if (VECTORS.WEB_DIGITAL.test(lower)) {
        if (isHindi) {
          return {
            text: "Website design me hum modern, fast aur interactive digital experiences build karte hain. Custom animations, clean typography, aur 100% responsive mobile layout ke saath.",
            chips: ["↳ Web portfolio", "↳ Visual Identity", "↳ Contact team"]
          };
        }
        return {
          text: "Our digital studio engineers bespoke web experiences with kinetic micro-interactions, responsive mobile fluidity, and fast load speeds that establish instant category leadership.",
          chips: ["↳ Explore Case Studies", "↳ Digital Capabilities", "↳ Talk to our team"]
        };
      }

      if (VECTORS.PRINT.test(lower)) {
        if (isHindi) {
          return {
            text: "Print collateral me hum luxury brochures, tactile product catalogues, aur corporate profiles design karte hain. Curated paper stocks aur gold/silver foil finishes ke saath.",
            chips: ["↳ Brochure samples", "↳ Packaging Design", "↳ Contact team"]
          };
        }
        return {
          text: "For print collateral, we design luxury editorial brochures, tactile lookbooks, and corporate catalogues using premium paper stocks, foil stamping, and editorial typography.",
          chips: ["↳ Brochure Design", "↳ Investor Decks", "↳ Contact team"]
        };
      }

      if (VECTORS.PRICING.test(lower)) {
        if (isHindi) {
          return {
            text: "Hum scope ke hisaab se fixed milestone pricing offer karte hain—startup brand sprints se lekar full enterprise systems tak. 20-min free discovery call me hum exact roadmap aur quotation share karte hain.",
            chips: ["↳ Discovery call book karein", "↳ Services kya hai?", "↳ Portfolio dikhao"]
          };
        }
        return {
          text: "Our pricing is structured around bespoke project milestones—from agile Startup Brand Sprints to Full Enterprise Transformations. Schedule a 20-minute discovery call for an accurate roadmap and quote.",
          chips: ["↳ Book Discovery Call", "↳ Scope of Services", "↳ Case Studies"]
        };
      }

      if (VECTORS.TIMELINE.test(lower)) {
        if (isHindi) {
          return {
            text: "Project duration scope par depend karta hai: Lean Brand Sprint 3-4 weeks me, Packaging System 3-5 weeks me, aur Full Strategic Rebrand 6-8 weeks me complete hota hai.",
            chips: ["↳ Process details", "↳ Discovery call", "↳ Services"]
          };
        }
        return {
          text: "Typical timelines: Lean Identity Sprints take 3-4 weeks; Packaging Systems take 3-5 weeks; Full Strategic Rebrands take 6-8 weeks. Urgent launch sprints can also be scheduled.",
          chips: ["↳ 4-Stage Process", "↳ Book a discovery call", "↳ Pricing"]
        };
      }

      if (VECTORS.INDUSTRY_FOOD.test(lower)) {
        return {
          text: "In the Food & FMCG space, we engineered iconic packaging for Swaad, Crispo, and Bigly Agro. We focus on appetite-inducing color psychology, structural pouches, and compliant FSSAI typography.",
          chips: ["↳ Swaad FMCG Case Study", "↳ Crispo Snacks Case Study", "↳ Packaging Design"]
        };
      }

      if (VECTORS.INDUSTRY_BEAUTY.test(lower)) {
        return {
          text: "For Beauty & Wellness, our work on Vriksh, Aloevella, and Glogeous blends clean botanical authority with frosted amber glass finishes and Instagram-worthy bathroom counter presence.",
          chips: ["↳ Vriksh Ayurvedic Case Study", "↳ Packaging Design", "↳ Brand Strategy"]
        };
      }

      if (VECTORS.INDUSTRY_REALTY.test(lower)) {
        return {
          text: "For Real Estate & Architecture, projects like Abode and Shivala showcase our craft in gold-foiled sales brochures, large-format site hoardings, and premium architectural storytelling.",
          chips: ["↳ Abode Living Case Study", "↳ Shivala Real Estate", "↳ Contact team"]
        };
      }

      if (VECTORS.INDUSTRY_LUXURY.test(lower)) {
        return {
          text: "In Luxury, Jewelry & Fashion (Senal Diamonds, Noir Supply Co, Beatitude), we craft bespoke monograms, deep mineral palettes, and tactile packaging that justify premium pricing.",
          chips: ["↳ Senal Diamonds", "↳ Noir Supply Co", "↳ Luxury Branding"]
        };
      }

      if (VECTORS.LOCATION.test(lower)) {
        return {
          text: "Buttercup Advertising Studio is headquartered in Ahmedabad, Gujarat, India. We partner locally for whiteboard sessions and globally (USA, UK, Dubai) via agile virtual sprints.",
          chips: ["↳ Schedule Google Meet", "↳ Go to Contact Page", "↳ Explore Services"]
        };
      }

      // Dynamic Contextual Extraction Fallback (when no specific vector triggered)
      const stopWords = new Set([
        'what', 'is', 'are', 'the', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'and', 'or', 'do',
        'does', 'did', 'can', 'could', 'would', 'should', 'how', 'why', 'who', 'where', 'when', 'which',
        'i', 'me', 'my', 'you', 'your', 'we', 'our', 'it', 'its', 'tell', 'about', 'explain', 'give',
        'show', 'kya', 'hai', 'hain', 'kaise', 'kaha', 'mujhe', 'aap', 'karo', 'batao', 'dikhao'
      ]);

      const words = lower.replace(/[^a-zA-Z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      const topic = words.slice(0, 3).join(' ');

      if (isHindi) {
        if (topic) {
          return {
            text: `Aapke sawaal (${topic}) ke context me, Buttercup Studio tailored brand strategy aur visual craft provide karta hai. Hum aapke business model ke anusaar specific solution design kar sakte hain.`,
            chips: ["↳ Discovery call schedule karein", "↳ Services kya hai?", "↳ Portfolio dikhao"]
          };
        }
        return {
          text: "Buttercup Advertising Studio me aapka swaagat hai! Hum brand strategy, custom logos, packaging design, aur creative campaigns me specialize karte hain. Aap kis service ke baare me jaanna chahte hain?",
          chips: ["↳ Services kya hai?", "↳ Portfolio dikhao", "↳ Contact karein"]
        };
      }

      if (topic) {
        return {
          text: `Regarding "${topic}", Buttercup Advertising Studio applies human intelligence and strategic whitespace mapping to design original brand solutions tailored precisely to lead that market space.`,
          chips: ["↳ Book a discovery call", "↳ Explore our services", "↳ View Case Studies"]
        };
      }

      return {
        text: "Welcome to Buttercup Advertising Studio! We engineer distinctive brand strategies, iconic visual identities, and category-defining campaigns. What would you like to explore next?",
        chips: ["↳ What do you do?", "↳ Show me your work", "↳ How much does a project cost?"]
      };
    }

    async function queryGoogleGemini(userText) {
      if (!geminiApiKey) return null;
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const systemContext = "You are Buttercup AI, the conversational intelligence for Buttercup Advertising Studio (an award-winning branding, design, and advertising studio specializing in Brand Strategy, Visual Identity, and Marketing Campaigns across 50+ product industries and 30+ service industries). Answer gracefully in 1 to 2 clear, elegant sentences. Tone: visionary, modern, warm, concise, and helpful. Always invite them to explore services or contact team.";

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemContext}\n\nUser Question: ${userText}` }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 140,
              temperature: 0.7
            }
          })
        });

        if (!res.ok) return null;
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return candidate ? candidate.trim() : null;
      } catch (err) {
        console.warn("Gemini API call failed, falling back to Studio Engine:", err);
        return null;
      }
    }

    // ==========================================================================
    // 9. CHAT SUBMISSION PIPELINE & UI RENDERING
    // ==========================================================================
    function appendMessage(role, text) {
      if (!aiMessages) return null;
      const msg = document.createElement('div');
      msg.className = `em-ai-msg em-ai-msg-${role}`;
      msg.innerHTML = `<div class="em-ai-bubble-content">${text}</div>`;
      aiMessages.appendChild(msg);
      aiMessages.scrollTop = aiMessages.scrollHeight;
      return msg;
    }

    function renderChips(chipList) {
      if (!aiChips) return;
      aiChips.innerHTML = '';
      if (!chipList || chipList.length === 0) return;

      chipList.forEach(c => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'em-ai-chip';
        btn.setAttribute('data-query', c);
        btn.textContent = c;
        btn.addEventListener('click', () => {
          handleUserSubmit(c);
        });
        aiChips.appendChild(btn);
      });
    }

    async function handleUserSubmit(rawText) {
      const text = (rawText || (aiInput ? aiInput.value : '')).trim();
      if (!text) return;

      if (aiInput) aiInput.value = '';
      appendMessage('user', text);

      // Emotion Agency style typing indicator
      isAiThinking = true;
      const searchBox = document.createElement('div');
      searchBox.className = 'em-ai-msg em-ai-msg-assistant';
      searchBox.innerHTML = `
        <div class="em-ai-bubble-content em-ai-searching-box">
          <div class="em-ai-searching-dots">
            <span class="em-ai-dot"></span>
            <span class="em-ai-dot"></span>
            <span class="em-ai-dot"></span>
          </div>
          <span class="em-ai-searching-label">Synthesizing studio intelligence...</span>
        </div>
      `;
      if (aiMessages) {
        aiMessages.appendChild(searchBox);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }

      // 1. Try Google Gemini live API first if key configured
      let answerText = await queryGoogleGemini(text);
      let nextChips = ["Show me your projects", "Brand Strategy", "How much does a project cost?"];

      if (!answerText) {
        // 2. Query Native Buttercup Studio Knowledge Engine
        let matched = STUDIO_KNOWLEDGE.find(item => item.match.test(text));
        if (matched) {
          answerText = pickVariant(matched.reply, text);
          nextChips = matched.chips;
        } else {
          // 3. Multi-dimensional Semantic Fallback
          const fallback = generateSmartFallback(text);
          answerText = fallback.text;
          nextChips = fallback.chips;
        }
      }

      // Natural conversational pacing delay
      setTimeout(() => {
        searchBox.remove();
        isAiThinking = false;
        appendMessage('assistant', answerText);
        renderChips(nextChips);
        speakVoice(answerText);
      }, 550);
    }

    if (aiForm) {
      aiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserSubmit();
      });
    }

    // Attach click listeners to default suggestion chips
    if (aiChips) {
      aiChips.querySelectorAll('.em-ai-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-query');
          if (q) handleUserSubmit(q);
        });
      });
    }
  }

})();
