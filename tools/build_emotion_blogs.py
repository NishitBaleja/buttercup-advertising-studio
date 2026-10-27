#!/usr/bin/env python3
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_file = os.path.join(ROOT, 'scratch', 'blogs_data.json')
output_file = os.path.join(ROOT, 'pages', 'blogs', 'index.html')

with open(data_file) as f:
    blogs = json.load(f)

# Sort or preserve blogs
# Build cards HTML
cards_html = []
for i, b in enumerate(blogs):
    slug = b['slug']
    title = b['title'].replace('"', '&quot;')
    category = b['category']
    date = b['date']
    read_time = b['read_time']
    desc = b['desc'].replace('"', '&quot;')
    image = f"../../{b['image']}"
    num_str = f"{i+1:02d}"

    cards_html.append(f"""
        <!-- Card {num_str} -->
        <div class="em-card" data-index="{i}" data-slug="{slug}" data-category="{category}" tabindex="0" role="button" aria-label="{title}">
          <div class="em-card-inner">
            <div class="em-card-media">
              <img src="{image}" alt="{title}" loading="{'eager' if i < 6 else 'lazy'}" class="em-card-img" />
              <div class="em-card-scanline"></div>
              <div class="em-card-glitch-layer"></div>
              <div class="em-card-vignette"></div>
            </div>
            <div class="em-card-badge">
              <span class="em-tag">{category}</span>
              <span class="em-time">{read_time}</span>
            </div>
            <div class="em-card-info">
              <div class="em-card-num">{num_str}</div>
              <h3 class="em-card-title">{title}</h3>
              <div class="em-card-action">
                <span>Explore Article</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </div>
            </div>
            <div class="em-card-neon-border"></div>
          </div>
          <!-- Real-time Floor Reflection -->
          <div class="em-card-reflection" aria-hidden="true">
            <div class="em-reflection-inner">
              <img src="{image}" alt="" class="em-reflection-img" />
              <div class="em-reflection-mask"></div>
              <div class="em-reflection-border"></div>
            </div>
          </div>
        </div>
    """)

cards_markup = "\n".join(cards_html)

# Build scrubber ticks
ticks_html = []
for i in range(len(blogs)):
    ticks_html.append(f'<button class="em-scrubber-tick{" is-active" if i == 0 else ""}" data-index="{i}" aria-label="Go to article {i+1:02d}"><span class="em-tick-bar"></span></button>')
ticks_markup = "\n".join(ticks_html)

# Categories
cats = sorted(list(set(b['category'] for b in blogs)))
filter_btns = [f'<button class="em-filter-item is-active" data-filter="all"><span>All Articles</span><span class="em-count">{len(blogs)}</span></button>']
for cat in cats:
    count = sum(1 for b in blogs if b['category'] == cat)
    filter_btns.append(f'<button class="em-filter-item" data-filter="{cat}"><span>{cat}</span><span class="em-count">{count}</span></button>')
filter_markup = "\n".join(filter_btns)

blogs_json_str = json.dumps(blogs).replace('</script>', '<\\/script>')

html_content = f"""<!DOCTYPE html>
<html lang="en" class="w-mod-js" data-theme="dark">
<head>
<meta charset="utf-8">
<title>Buttercup Advertising Studio | Industry Insights & 3D Interactive Perspectives</title>
<meta name="description" content="Explore 20 curated branding, design, strategy, and packaging articles by Buttercup Advertising Studio in an award-winning 3D spatial experience.">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="icon" href="../../images/695d1ca93d6f12cb8592c30a_Favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=TASA+Orbiter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../css/site.css?v=37">

<style>
/* ==========================================================================
   EMOTION-AGENCY STYLE 3D CYLINDRICAL CAROUSEL (BUTTERCUP STUDIO EDITION)
   ========================================================================== */

:root {{
  --em-bg: #07050d;
  --em-primary: #9047ff;
  --em-primary-rgb: 144, 71, 255;
  --em-primary-glow: rgba(144, 71, 255, 0.65);
  --em-primary-soft: rgba(144, 71, 255, 0.15);
  --em-neon-cyan: #5ce1e6;
  --em-white: #ffffff;
  --em-white-rgb: 255, 255, 255;
  --em-text-muted: #8b8da6;
  --em-card-w: 320px;
  --em-card-h: 460px;
  --em-radius: 1250px;
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
}}

@media (max-width: 1200px) {{
  :root {{
    --em-card-w: 280px;
    --em-card-h: 410px;
    --em-radius: 1050px;
  }}
}}

@media (max-width: 768px) {{
  :root {{
    --em-card-w: 230px;
    --em-card-h: 340px;
    --em-radius: 760px;
  }}
}}

@media (max-width: 480px) {{
  :root {{
    --em-card-w: 200px;
    --em-card-h: 300px;
    --em-radius: 640px;
  }}
}}

* {{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}}

html, body {{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--em-bg);
  color: var(--em-white);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  user-select: none;
  -webkit-user-select: none;
}}

/* Deep Cosmic Container */
.em-viewport {{
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: radial-gradient(circle at 50% 45%, #130a24 0%, #07050d 70%, #030206 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}}

/* Ambient Background Canvas (Grid ceiling + cosmic stars + floor halo) */
.em-canvas-layer {{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}}

/* Top Ambient Grid Ceiling */
.em-ceiling-grid {{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 48%;
  pointer-events: none;
  z-index: 2;
  perspective: 600px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
}}

.em-ceiling-grid::after {{
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(144, 71, 255, 0.22) 1px, transparent 1px),
    linear-gradient(90deg, rgba(144, 71, 255, 0.22) 1px, transparent 1px);
  background-size: 64px 64px;
  transform: rotateX(75deg);
  transform-origin: 50% 100%;
}}

/* Floor Surface & Glow Ring */
.em-floor-layer {{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 52%;
  pointer-events: none;
  z-index: 2;
  overflow: hidden;
  perspective: 700px;
}}

.em-floor-grid {{
  position: absolute;
  bottom: -20%;
  left: -50%;
  width: 200%;
  height: 140%;
  background-image: 
    linear-gradient(rgba(144, 71, 255, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(144, 71, 255, 0.12) 1px, transparent 1px);
  background-size: 64px 64px;
  transform: rotateX(78deg);
  transform-origin: 50% 0%;
  mask-image: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 80%);
}}

/* Neon Ground Ring under Cards */
.em-floor-ring {{
  position: absolute;
  top: 18%;
  left: 50%;
  width: min(1500px, 92vw);
  height: 480px;
  transform: translate(-50%, -50%) rotateX(78deg);
  border-radius: 50%;
  border: 2px solid rgba(175, 105, 255, 0.7);
  box-shadow: 
    0 0 35px rgba(144, 71, 255, 0.65),
    0 0 80px rgba(144, 71, 255, 0.35),
    inset 0 0 40px rgba(144, 71, 255, 0.45);
  pointer-events: none;
}}

/* ==========================================================================
   TOP NAVIGATION BAR (FUTURISTIC DARK THEME)
   ========================================================================== */

.em-header {{
  position: relative;
  z-index: 50;
  width: 100%;
  padding: 1.25rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  background: rgba(7, 5, 13, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}}

@media (max-width: 768px) {{
  .em-header {{
    padding: 1rem 1.25rem;
  }}
}}

.em-logo {{
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: var(--em-white);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}}

.em-logo-dot {{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--em-primary);
  box-shadow: 0 0 10px var(--em-primary);
  display: inline-block;
}}

.em-nav-menu {{
  display: flex;
  align-items: center;
  gap: 2.2rem;
  list-style: none;
}}

@media (max-width: 900px) {{
  .em-nav-menu {{
    display: none;
  }}
}}

.em-nav-link {{
  color: var(--em-text-muted);
  text-decoration: none;
  font-size: 0.82rem;
  font-family: var(--font-mono);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  position: relative;
  padding: 0.35rem 0;
  transition: color 0.3s ease;
}}

.em-nav-link:hover, .em-nav-link.is-active {{
  color: var(--em-white);
}}

.em-nav-link.is-active::after {{
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--em-primary);
  box-shadow: 0 0 8px var(--em-primary);
}}

.em-header-actions {{
  display: flex;
  align-items: center;
  gap: 1.5rem;
}}

/* Sound Wave Visualizer in Header */
.em-sound-toggle {{
  display: flex;
  align-items: center;
  gap: 3px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--em-white);
}}

.em-sound-bar {{
  width: 3px;
  height: 14px;
  background: var(--em-white);
  border-radius: 2px;
  opacity: 0.45;
  transition: height 0.2s ease, opacity 0.2s ease, background 0.2s ease;
}}

.em-sound-toggle.is-playing .em-sound-bar {{
  opacity: 1;
  background: var(--em-primary);
  animation: em-sound-pulse 0.7s ease-in-out infinite alternate;
}}

.em-sound-toggle.is-playing .em-sound-bar:nth-child(2) {{ animation-delay: 0.15s; }}
.em-sound-toggle.is-playing .em-sound-bar:nth-child(3) {{ animation-delay: 0.35s; }}
.em-sound-toggle.is-playing .em-sound-bar:nth-child(4) {{ animation-delay: 0.2s; }}

@keyframes em-sound-pulse {{
  0% {{ height: 4px; }}
  100% {{ height: 18px; }}
}}

.em-btn-contact {{
  padding: 0.6rem 1.4rem;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--em-white);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
}}

.em-btn-contact:hover {{
  background: var(--em-primary);
  border-color: var(--em-primary);
  box-shadow: 0 0 20px var(--em-primary-glow);
  transform: translateY(-1px);
}}

/* ==========================================================================
   3D STAGE & CYLINDER CAROUSEL
   ========================================================================== */

.em-stage {{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  perspective: 1200px;
  perspective-origin: 50% 46%;
  overflow: visible;
  z-index: 10;
  cursor: grab;
}}

.em-stage.is-dragging {{
  cursor: grabbing;
}}

.em-carousel-track {{
  position: absolute;
  top: 48%;
  left: 50%;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}}

/* Single Card */
.em-card {{
  position: absolute;
  top: 0;
  left: 0;
  width: var(--em-card-w);
  height: var(--em-card-h);
  margin-left: calc(var(--em-card-w) / -2);
  margin-top: calc(var(--em-card-h) / -2);
  transform-style: preserve-3d;
  will-change: transform, opacity;
  cursor: pointer;
  outline: none;
}}

.em-card-inner {{
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 22px;
  background: #100b1d;
  overflow: hidden;
  border: 2px solid rgba(165, 85, 255, 0.65);
  box-shadow: 
    0 0 22px rgba(144, 71, 255, 0.4),
    0 18px 45px rgba(0, 0, 0, 0.85);
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease;
}}

.em-card.is-active .em-card-inner {{
  border-color: rgba(200, 140, 255, 0.95);
  box-shadow: 
    0 0 35px rgba(175, 105, 255, 0.8),
    0 0 70px rgba(144, 71, 255, 0.45),
    inset 0 0 20px rgba(144, 71, 255, 0.35),
    0 24px 60px rgba(0, 0, 0, 0.95);
}}

.em-card:hover .em-card-inner {{
  border-color: rgba(220, 170, 255, 1);
  box-shadow: 
    0 0 40px rgba(185, 115, 255, 0.9),
    0 0 80px rgba(144, 71, 255, 0.55),
    0 25px 65px rgba(0, 0, 0, 0.95);
}}

.em-card-media {{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}}

.em-card-img {{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
}}

.em-card:hover .em-card-img {{
  transform: scale(1.08);
}}

.em-card-vignette {{
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(7, 5, 13, 0.3) 0%,
    transparent 35%,
    rgba(7, 5, 13, 0.75) 75%,
    rgba(7, 5, 13, 0.95) 100%
  );
  pointer-events: none;
}}

/* Cybernetic Scanlines */
.em-card-scanline {{
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(255, 255, 255, 0.03) 3px,
    rgba(255, 255, 255, 0.03) 4px
  );
  pointer-events: none;
  opacity: 0.6;
}}

/* Card Top Badge */
.em-card-badge {{
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
}}

.em-tag {{
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.28rem 0.65rem;
  border-radius: 9999px;
  background: rgba(144, 71, 255, 0.4);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
}}

.em-time {{
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(0, 0, 0, 0.4);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
}}

/* Card Bottom Info */
.em-card-info {{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1.2rem;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}}

.em-card-num {{
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--em-primary);
  letter-spacing: 0.05em;
}}

.em-card-title {{
  font-family: var(--font-sans);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.28;
  color: var(--em-white);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}}

.em-card-action {{
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.3rem;
  transition: color 0.3s ease, transform 0.3s ease;
}}

.em-card:hover .em-card-action {{
  color: var(--em-neon-cyan);
  transform: translateX(3px);
}}

/* Floor Reflection of Card */
.em-card-reflection {{
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 55%;
  margin-top: 10px;
  pointer-events: none;
  transform: scaleY(-1);
  opacity: 0.45;
  filter: blur(1.5px);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 95%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 95%);
}}

.em-reflection-inner {{
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 22px;
  overflow: hidden;
}}

.em-reflection-img {{
  width: 100%;
  height: var(--em-card-h);
  object-fit: cover;
  display: block;
}}

/* ==========================================================================
   DYNAMIC BOTTOM-LEFT HEADLINE
   ========================================================================== */

.em-headline-panel {{
  position: fixed;
  bottom: 2.2rem;
  left: 3rem;
  max-width: 460px;
  z-index: 25;
  pointer-events: none;
  transition: opacity 0.3s ease, transform 0.3s ease;
}}

@media (max-width: 1024px) {{
  .em-headline-panel {{
    bottom: 8.5rem;
    left: 1.5rem;
    max-width: 320px;
  }}
}}

@media (max-width: 640px) {{
  .em-headline-panel {{
    display: none;
  }}
}}

.em-headline-meta {{
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--em-primary);
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}}

.em-headline-title {{
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3.2vw, 2.9rem);
  font-weight: 400;
  line-height: 1.1;
  color: var(--em-white);
  letter-spacing: -0.02em;
  margin-bottom: 0.65rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
}}

.em-headline-desc {{
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.7);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.9rem;
}}

.em-headline-btn {{
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--em-white);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  pointer-events: auto;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: rgba(144, 71, 255, 0.2);
  border: 1px solid rgba(144, 71, 255, 0.45);
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
}}

.em-headline-btn:hover {{
  background: var(--em-primary);
  border-color: var(--em-primary);
  box-shadow: 0 0 16px var(--em-primary-glow);
  transform: translateY(-1px);
}}

/* ==========================================================================
   BOTTOM CENTER CONTROLS (FILTER PILL + SCRUBBER PAGINATION)
   ========================================================================== */

.em-bottom-controls {{
  position: fixed;
  bottom: 1.4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  z-index: 30;
  pointer-events: auto;
}}

@media (max-width: 640px) {{
  .em-bottom-controls {{
    bottom: 1rem;
    width: 90%;
  }}
}}

/* Filter Pill Button */
.em-filter-pill {{
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, rgba(45, 37, 125, 0.65) 0%, rgba(142, 45, 226, 0.65) 100%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--em-white);
  font-family: var(--font-sans);
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(144, 71, 255, 0.35);
  transition: all 0.3s ease;
}}

.em-filter-pill:hover, .em-filter-pill.is-open {{
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 6px 28px rgba(144, 71, 255, 0.6);
  transform: translateY(-1px);
}}

.em-filter-icon {{
  font-size: 0.85rem;
}}

/* Filter Popover Drawer */
.em-filter-drawer {{
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: rgba(14, 10, 24, 0.88);
  border: 1px solid rgba(175, 105, 255, 0.35);
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75), 0 0 30px rgba(144, 71, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 1.25rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 240px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}}

.em-filter-drawer.is-open {{
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}}

.em-filter-item {{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem;
  border-radius: 0.85rem;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}}

.em-filter-item:hover, .em-filter-item.is-active {{
  background: rgba(144, 71, 255, 0.28);
  color: var(--em-white);
}}

.em-filter-item .em-count {{
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--em-primary);
  background: rgba(144, 71, 255, 0.2);
  padding: 0.15rem 0.45rem;
  border-radius: 9999px;
}}

/* Draggable Scrubber Bar */
.em-scrubber-wrap {{
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.4rem 0.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}}

.em-counter {{
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.85);
  min-width: 2ch;
  text-align: center;
}}

.em-counter-current {{
  color: var(--em-white);
}}

.em-counter-total {{
  color: rgba(255, 255, 255, 0.5);
}}

.em-scrubber-ticks {{
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 0.25rem;
}}

.em-scrubber-tick {{
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: transform 0.2s ease;
}}

.em-tick-bar {{
  width: 2px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
  transition: all 0.25s ease;
}}

.em-scrubber-tick:hover .em-tick-bar {{
  background: rgba(255, 255, 255, 0.85);
  height: 14px;
}}

.em-scrubber-tick.is-active .em-tick-bar {{
  background: transparent;
  border: 1.5px solid var(--em-white);
  border-radius: 3px;
  width: 12px;
  height: 16px;
  box-shadow: 0 0 10px var(--em-primary);
}}

/* ==========================================================================
   BOTTOM RIGHT IRIDESCENT AI / AUDIO ORB
   ========================================================================== */

.em-orb-toggle {{
  position: fixed;
  bottom: 2rem;
  right: 2.5rem;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  z-index: 30;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  outline: none;
}}

@media (max-width: 768px) {{
  .em-orb-toggle {{
    bottom: 1.25rem;
    right: 1.25rem;
    width: 44px;
    height: 44px;
  }}
}}

.em-orb-canvas {{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  box-shadow: 
    0 0 25px rgba(144, 71, 255, 0.7),
    0 0 50px rgba(92, 225, 230, 0.35);
  animation: em-orb-breathe 4s ease-in-out infinite alternate;
  transition: transform 0.3s ease;
}}

.em-orb-toggle:hover .em-orb-canvas {{
  transform: scale(1.12);
  box-shadow: 
    0 0 35px rgba(185, 115, 255, 0.9),
    0 0 70px rgba(92, 225, 230, 0.5);
}}

@keyframes em-orb-breathe {{
  0% {{ transform: scale(0.96); }}
  100% {{ transform: scale(1.04); }}
}}

/* Drag Hint for First-time Viewers */
.em-drag-hint {{
  position: absolute;
  top: 72%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  pointer-events: none;
  z-index: 15;
  transition: opacity 0.6s ease;
}}

.em-drag-hint.is-hidden {{
  opacity: 0;
}}

.em-drag-arrow {{
  animation: em-hint-slide 1.5s ease-in-out infinite alternate;
}}

@keyframes em-hint-slide {{
  0% {{ transform: translateX(-4px); }}
  100% {{ transform: translateX(4px); }}
}}
</style>
</head>
<body data-page="blogs">

<div class="em-viewport" id="em-viewport">
  
  <!-- Canvas Layer: Stars, Nebula & Space Horizon -->
  <canvas id="ambient-canvas" class="em-canvas-layer"></canvas>

  <!-- Perspective Ceiling Grid -->
  <div class="em-ceiling-grid" aria-hidden="true"></div>

  <!-- Perspective Floor Surface & Neon Ring -->
  <div class="em-floor-layer" aria-hidden="true">
    <div class="em-floor-grid"></div>
    <div class="em-floor-ring"></div>
  </div>

  <!-- Header -->
  <header class="em-header">
    <a href="../../index.html" class="em-logo">
      <span class="em-logo-dot"></span>
      <span>Buttercup Advertising Studio</span>
    </a>

    <nav>
      <ul class="em-nav-menu">
        <li><a href="../../index.html" class="em-nav-link">Home</a></li>
        <li><a href="../case-studies/index.html" class="em-nav-link">Case Studies</a></li>
        <li><a href="index.html" class="em-nav-link is-active">Blogs</a></li>
        <li><a href="../about/index.html" class="em-nav-link">About</a></li>
        <li><a href="../services/brand-strategy/index.html" class="em-nav-link">Services</a></li>
      </ul>
    </nav>

    <div class="em-header-actions">
      <button class="em-sound-toggle" id="sound-toggle" title="Toggle Spatial Audio" aria-label="Toggle Sound">
        <span class="em-sound-bar"></span>
        <span class="em-sound-bar"></span>
        <span class="em-sound-bar"></span>
        <span class="em-sound-bar"></span>
      </button>

      <a href="../contact/index.html" class="em-btn-contact">
        <span>Let's talk</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </a>
    </div>
  </header>

  <!-- 3D CAROUSEL STAGE -->
  <main class="em-stage" id="em-stage" aria-label="3D Cylindrical Blogs Carousel">
    <div class="em-carousel-track" id="em-track">
      {cards_markup}
    </div>

    <!-- Drag / Scroll Indicator Hint -->
    <div class="em-drag-hint" id="em-drag-hint">
      <span class="em-drag-arrow">←</span>
      <span>Drag or Scroll to Explore (20 Articles)</span>
      <span class="em-drag-arrow">→</span>
    </div>
  </main>

  <!-- Dynamic Bottom-Left Active Article Headline -->
  <aside class="em-headline-panel" id="em-headline-panel">
    <div class="em-headline-meta" id="headline-meta">01 / 20 • BRAND STRATEGY</div>
    <h2 class="em-headline-title" id="headline-title">The Modern Brand Positioning Playbook: Winning Heart Share in 2026</h2>
    <p class="em-headline-desc" id="headline-desc">Why competing on price or features is a race to the bottom, and how capturing emotional heart-share creates insurmountable brand moats.</p>
    <a href="../../blogs/brand-positioning-strategy-guide.html" class="em-headline-btn" id="headline-cta">
      <span>Read Full Article</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="7" y1="17" x2="17" y2="7"></line>
        <polyline points="7 7 17 7 17 17"></polyline>
      </svg>
    </a>
  </aside>

  <!-- Bottom Center Controls: Filter Pill + Scrubber Bar -->
  <div class="em-bottom-controls">
    
    <!-- Filter Popover & Trigger Button -->
    <div style="position: relative;">
      <div class="em-filter-drawer" id="filter-drawer">
        {filter_markup}
      </div>
      <button class="em-filter-pill" id="filter-pill" aria-expanded="false" aria-controls="filter-drawer">
        <span>Filter</span>
        <span class="em-filter-icon">☰</span>
      </button>
    </div>

    <!-- Draggable Scrubber Pagination -->
    <div class="em-scrubber-wrap" id="scrubber-wrap" role="slider" aria-valuemin="1" aria-valuemax="20" aria-valuenow="1">
      <span class="em-counter em-counter-current" id="scrubber-curr">01</span>
      <div class="em-scrubber-ticks" id="scrubber-ticks">
        {ticks_markup}
      </div>
      <span class="em-counter em-counter-total" id="scrubber-total">20</span>
    </div>

  </div>

  <!-- Iridescent AI Audio Orb in Bottom Right -->
  <button class="em-orb-toggle" id="orb-toggle" title="Interactive Audio Ambient Orb" aria-label="Toggle Spatial Audio">
    <canvas id="orb-canvas" class="em-orb-canvas" width="120" height="120"></canvas>
  </button>

</div>

<!-- Data & Logic -->
<script>
window.__BLOGS_DATA__ = {blogs_json_str};
</script>
<script src="../../js/vendor/gsap.min.js"></script>
<script>
(function() {{
  "use strict";

  const blogs = window.__BLOGS_DATA__ || [];
  const totalCards = blogs.length;
  if (!totalCards) return;

  const stage = document.getElementById('em-stage');
  const track = document.getElementById('em-track');
  const cards = Array.from(document.querySelectorAll('.em-card'));
  const scrubberTicks = Array.from(document.querySelectorAll('.em-scrubber-tick'));
  const scrubberCurr = document.getElementById('scrubber-curr');
  const dragHint = document.getElementById('em-drag-hint');

  const headlineMeta = document.getElementById('headline-meta');
  const headlineTitle = document.getElementById('headline-title');
  const headlineDesc = document.getElementById('headline-desc');
  const headlineCta = document.getElementById('headline-cta');

  const filterPill = document.getElementById('filter-pill');
  const filterDrawer = document.getElementById('filter-drawer');
  const filterItems = Array.from(document.querySelectorAll('.em-filter-item'));

  const soundToggle = document.getElementById('sound-toggle');
  const orbToggle = document.getElementById('orb-toggle');

  // Math & Config
  const angleStep = 360 / totalCards; // 18 degrees per card
  let radius = 1250;

  function updateRadius() {{
    const w = window.innerWidth;
    if (w < 480) {{
      radius = 640;
    }} else if (w < 768) {{
      radius = 760;
    }} else if (w < 1200) {{
      radius = 1050;
    }} else {{
      radius = 1250;
    }}
    // Apply initial transforms to cards
    cards.forEach((card, i) => {{
      const angle = i * angleStep;
      card.style.transform = `rotateY(${{angle}}deg) translateZ(${{radius}}px)`;
    }});
  }}

  updateRadius();
  window.addEventListener('resize', updateRadius);

  // Carousel State
  let currentAngle = 0;
  let targetAngle = 0;
  let velocity = 0;
  let isDragging = false;
  let startX = 0;
  let lastX = 0;
  let lastTime = 0;
  let activeIndex = 0;
  let hasInteracted = false;
  let isAudioActive = false;
  let audioCtx = null;

  // Check URL query for specific blog focus
  const urlParams = new URLSearchParams(window.location.search);
  const targetSlug = urlParams.get('blog');
  if (targetSlug) {{
    const foundIdx = blogs.findIndex(b => b.slug === targetSlug);
    if (foundIdx !== -1) {{
      targetAngle = -foundIdx * angleStep;
      currentAngle = targetAngle;
      activeIndex = foundIdx;
    }}
  }}

  // Position cards initially
  cards.forEach((card, i) => {{
    const angle = i * angleStep;
    card.style.transform = `rotateY(${{angle}}deg) translateZ(${{radius}}px)`;
  }});

  // Update Headline content
  function updateHeadline(idx) {{
    const b = blogs[idx];
    if (!b) return;

    const numStr = (idx + 1).toString().padStart(2, '0');
    headlineMeta.textContent = `${{numStr}} / ${{totalCards.toString().padStart(2, '0')}} • ${{b.category.toUpperCase()}}`;
    headlineTitle.textContent = b.title;
    headlineDesc.textContent = b.desc;
    headlineCta.href = `../../blogs/${{b.slug}}.html`;

    // Update scrubber counter
    scrubberCurr.textContent = numStr;

    // Update scrubber tick bars
    scrubberTicks.forEach((tick, i) => {{
      if (i === idx) {{
        tick.classList.add('is-active');
      }} else {{
        tick.classList.remove('is-active');
      }}
    }});

    // Update active class on cards
    cards.forEach((c, i) => {{
      if (i === idx) {{
        c.classList.add('is-active');
      }} else {{
        c.classList.remove('is-active');
      }}
    }});
  }}

  updateHeadline(activeIndex);

  // Audio Click Feedback
  function playClickSound() {{
    if (!isAudioActive) return;
    try {{
      if (!audioCtx) {{
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContextClass();
      }}
      if (audioCtx.state === 'suspended') {{
        audioCtx.resume();
      }}
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    }} catch(e) {{}}
  }}

  // Physics Animation Loop
  let lastReportedIdx = activeIndex;

  function render() {{
    if (!isDragging) {{
      targetAngle += velocity;
      velocity *= 0.92;
      if (Math.abs(velocity) < 0.001) velocity = 0;
    }}

    // Lerp rotation smoothly
    const diff = targetAngle - currentAngle;
    currentAngle += diff * 0.09;

    // Banking tilt when rotating fast
    const tilt = Math.max(-6, Math.min(6, diff * 0.35));

    track.style.transform = `translateZ(${{-radius}}px) rotateX(${{-tilt * 0.4}}deg) rotateY(${{currentAngle}}deg) rotateZ(${{tilt * 0.2}}deg)`;

    // Calculate nearest active index
    // Note: each step of angleStep rotates cards
    const rawIdx = Math.round(-currentAngle / angleStep);
    const normalizedIdx = ((rawIdx % totalCards) + totalCards) % totalCards;

    if (normalizedIdx !== lastReportedIdx && Math.abs(diff) < 25) {{
      lastReportedIdx = normalizedIdx;
      activeIndex = normalizedIdx;
      updateHeadline(activeIndex);
      playClickSound();
    }}

    requestAnimationFrame(render);
  }}

  requestAnimationFrame(render);

  // Snap to Nearest Card on Drag Release
  function snapToNearest() {{
    const rawIdx = Math.round(-targetAngle / angleStep);
    targetAngle = -rawIdx * angleStep;
  }}

  // Drag Interaction (Mouse / Pointer)
  stage.addEventListener('pointerdown', (e) => {{
    // Don't drag if clicking directly on a link or button
    if (e.target.closest('a') || e.target.closest('button')) return;

    isDragging = true;
    startX = e.clientX;
    lastX = e.clientX;
    lastTime = performance.now();
    velocity = 0;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(e.pointerId);

    if (!hasInteracted) {{
      hasInteracted = true;
      dragHint.classList.add('is-hidden');
    }}
  }});

  stage.addEventListener('pointermove', (e) => {{
    if (!isDragging) return;
    const now = performance.now();
    const deltaX = e.clientX - lastX;
    const dt = Math.max(1, now - lastTime);

    // Degree conversion factor
    const factor = (360 / (radius * 2 * Math.PI)) * 1.5;
    targetAngle += deltaX * factor;

    velocity = (deltaX / dt) * 8 * factor;
    lastX = e.clientX;
    lastTime = now;
  }});

  function endDrag(e) {{
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('is-dragging');
    try {{ stage.releasePointerCapture(e.pointerId); }} catch(err) {{}}
    snapToNearest();
  }}

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // Mouse Wheel Scroll (Horizontal & Vertical)
  window.addEventListener('wheel', (e) => {{
    // Ignore if modal open or hovering header
    if (e.target.closest('.em-header') || e.target.closest('.em-filter-drawer')) return;
    
    if (!hasInteracted) {{
      hasInteracted = true;
      dragHint.classList.add('is-hidden');
    }}

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    velocity -= delta * 0.035;
    
    // Debounce snap
    clearTimeout(window.__wheelSnapTimeout);
    window.__wheelSnapTimeout = setTimeout(snapToNearest, 250);
  }}, {{ passive: true }});

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {{
    if (e.key === 'ArrowLeft') {{
      targetAngle += angleStep;
      snapToNearest();
    }} else if (e.key === 'ArrowRight') {{
      targetAngle -= angleStep;
      snapToNearest();
    }}
  }});

  // Card Click: If active card -> open article; if other card -> rotate to it!
  cards.forEach((card) => {{
    card.addEventListener('click', (e) => {{
      const idx = parseInt(card.getAttribute('data-index'), 10);
      const slug = card.getAttribute('data-slug');

      if (idx === activeIndex) {{
        // Navigate to full article
        window.location.href = `../../blogs/${{slug}}.html`;
      }} else {{
        // Rotate carousel to center this card
        // Calculate shortest angular distance
        let diffIdx = idx - activeIndex;
        if (diffIdx > totalCards / 2) diffIdx -= totalCards;
        if (diffIdx < -totalCards / 2) diffIdx += totalCards;

        targetAngle -= diffIdx * angleStep;
        snapToNearest();
      }}
    }});
  }});

  // Scrubber Ticks Click
  scrubberTicks.forEach((tick) => {{
    tick.addEventListener('click', () => {{
      const idx = parseInt(tick.getAttribute('data-index'), 10);
      let diffIdx = idx - activeIndex;
      if (diffIdx > totalCards / 2) diffIdx -= totalCards;
      if (diffIdx < -totalCards / 2) diffIdx += totalCards;

      targetAngle -= diffIdx * angleStep;
      snapToNearest();
    }});
  }});

  // Filter Popover Drawer Toggle
  filterPill.addEventListener('click', (e) => {{
    e.stopPropagation();
    const isOpen = filterDrawer.classList.toggle('is-open');
    filterPill.classList.toggle('is-open', isOpen);
    filterPill.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }});

  document.addEventListener('click', (e) => {{
    if (!filterDrawer.contains(e.target) && !filterPill.contains(e.target)) {{
      filterDrawer.classList.remove('is-open');
      filterPill.classList.remove('is-open');
      filterPill.setAttribute('aria-expanded', 'false');
    }}
  }});

  // Filter Selection
  filterItems.forEach((btn) => {{
    btn.addEventListener('click', () => {{
      filterItems.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.getAttribute('data-filter');

      filterDrawer.classList.remove('is-open');
      filterPill.classList.remove('is-open');

      if (cat === 'all') {{
        cards.forEach(c => {{
          c.style.opacity = '1';
          c.style.pointerEvents = 'auto';
        }});
      }} else {{
        // Highlight matching cards & dim non-matching
        let firstMatchingIdx = -1;
        cards.forEach((c, i) => {{
          const cardCat = c.getAttribute('data-category');
          if (cardCat === cat) {{
            c.style.opacity = '1';
            c.style.pointerEvents = 'auto';
            if (firstMatchingIdx === -1) firstMatchingIdx = i;
          }} else {{
            c.style.opacity = '0.2';
            c.style.pointerEvents = 'none';
          }}
        }});

        // Rotate to first matching card
        if (firstMatchingIdx !== -1) {{
          let diffIdx = firstMatchingIdx - activeIndex;
          if (diffIdx > totalCards / 2) diffIdx -= totalCards;
          if (diffIdx < -totalCards / 2) diffIdx += totalCards;
          targetAngle -= diffIdx * angleStep;
          snapToNearest();
        }}
      }}
    }});
  }});

  // Audio Toggle
  function toggleAudio() {{
    isAudioActive = !isAudioActive;
    soundToggle.classList.toggle('is-playing', isAudioActive);
    playClickSound();
  }}

  soundToggle.addEventListener('click', toggleAudio);
  orbToggle.addEventListener('click', toggleAudio);

  // Unlock AudioContext on first touch / click
  ['click', 'touchstart', 'pointerdown'].forEach(ev => {{
    window.addEventListener(ev, () => {{
      if (isAudioActive && audioCtx && audioCtx.state === 'suspended') {{
        audioCtx.resume();
      }}
    }}, {{ once: true }});
  }});

  // ==========================================================================
  // BACKGROUND CANVAS (COSMIC PARTICLES & PERSPECTIVE STARS)
  // ==========================================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 85;

  function initCanvas() {{
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles.length = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {{
      particles.push({{
        x: (Math.random() - 0.5) * width * 1.6,
        y: (Math.random() - 0.5) * height * 1.6,
        z: Math.random() * 1000 + 100,
        size: Math.random() * 2 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(144, 71, 255, ' : 'rgba(92, 225, 230, '
      }});
    }}
  }}

  initCanvas();
  window.addEventListener('resize', initCanvas);

  function drawCanvas() {{
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height * 0.46;

    for (let i = 0; i < particles.length; i++) {{
      const p = particles[i];
      p.z -= 0.6;
      if (p.z <= 10) p.z = 1000;

      const k = 400 / p.z;
      const px = cx + p.x * k;
      const py = cy + p.y * k;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {{
        const alpha = Math.min(1, (1 - p.z / 1000) * 0.85);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.beginPath();
        ctx.arc(px, py, p.size * k, 0, Math.PI * 2);
        ctx.fill();
      }}
    }}

    requestAnimationFrame(drawCanvas);
  }}

  requestAnimationFrame(drawCanvas);

  // ==========================================================================
  // IRIDESCENT 3D ORB RENDERER
  // ==========================================================================
  const orbCanvas = document.getElementById('orb-canvas');
  const orbCtx = orbCanvas.getContext('2d');
  let orbAngle = 0;

  function drawOrb() {{
    const w = orbCanvas.width;
    const h = orbCanvas.height;
    orbCtx.clearRect(0, 0, w, h);

    orbAngle += 0.025;
    const cx = w / 2;
    const cy = h / 2;
    const r = w * 0.46;

    // Moving radial gradient
    const gx = cx + Math.cos(orbAngle) * (r * 0.35);
    const gy = cy + Math.sin(orbAngle) * (r * 0.35);

    const grad = orbCtx.createRadialGradient(gx, gy, 2, cx, cy, r);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.25, '#d488ff');
    grad.addColorStop(0.55, '#9047ff');
    grad.addColorStop(0.85, '#2a1254');
    grad.addColorStop(1, '#0e061c');

    orbCtx.fillStyle = grad;
    orbCtx.beginPath();
    orbCtx.arc(cx, cy, r, 0, Math.PI * 2);
    orbCtx.fill();

    // Specular highlight
    const hl = orbCtx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 1, cx, cy, r * 0.8);
    hl.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    hl.addColorStop(0.4, 'rgba(255, 255, 255, 0.15)');
    hl.addColorStop(1, 'transparent');

    orbCtx.fillStyle = hl;
    orbCtx.beginPath();
    orbCtx.arc(cx, cy, r, 0, Math.PI * 2);
    orbCtx.fill();

    requestAnimationFrame(drawOrb);
  }}

  requestAnimationFrame(drawOrb);

}})();
</script>
</body>
</html>
"""

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully generated {output_file} with {len(blogs)} blogs in 3D Emotion Agency style!")
