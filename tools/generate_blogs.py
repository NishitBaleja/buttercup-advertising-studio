import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_file = os.path.join(ROOT, 'scratch', 'blogs_data.json')
blogs_dir = os.path.join(ROOT, 'blogs')
os.makedirs(blogs_dir, exist_ok=True)

with open(data_file) as f:
    blogs = json.load(f)

import sys
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
from tools.sync_unified_navbar import get_navbar_for

def get_navbar(prefix=""):
    return get_navbar_for(prefix)

def get_footer(prefix=""):
    return f"""
  <!-- FOOTER -->
  <section class="section is-footer">
    <div class="w-layout-blockcontainer container is-full w-container">
      <div class="footer-links-grid">
        <a href="{prefix}index.html" class="footer-logo w-nav-brand"><div>Buttercup Advertising Studio<br/></div></a>
        <div class="footer-links-group">
          <a href="{prefix}index.html" class="footer-nav-links is-simple w-inline-block"><div>Home</div></a>
          <a href="{prefix}case-studies.html" class="footer-nav-links is-simple w-inline-block"><div>Case Studies</div></a>
          <a href="{prefix}blogs.html" class="footer-nav-links is-simple w-inline-block"><div>Blogs</div></a>
          <a href="{prefix}about.html" class="footer-nav-links is-simple w-inline-block"><div>About</div></a>
          <a href="{prefix}index.html#services" class="footer-nav-links is-simple w-inline-block"><div>Services</div></a>
          <a href="{prefix}product-base.html" class="footer-nav-links is-simple w-inline-block"><div>Industry</div></a>
        </div>
        <div class="footer-links-group">
          <div class="footer-link_header">Socials</div>
          <div class="spacer-small"></div>
          <a href="https://www.instagram.com/buttercupadvertisingstudio/" target="_blank" rel="noopener noreferrer" class="footer-nav-links social w-inline-block"><div>instagram</div><div class="social-arrow_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 4V10.5C12.75 10.6989 12.671 10.8897 12.5303 11.0303C12.3896 11.171 12.1989 11.25 12 11.25C11.8011 11.25 11.6103 11.171 11.4696 11.0303C11.329 10.8897 11.25 10.6989 11.25 10.5V5.8125L4.5306 12.5306C4.3897 12.6715 4.19861 12.7507 3.99935 12.7507C3.80009 12.7507 3.60899 12.6715 3.4681 12.5306C3.3272 12.3897 3.24805 12.1986 3.24805 11.9994C3.24805 11.8001 3.3272 11.609 3.4681 11.4681L10.1875 4.75H5.49997C5.30106 4.75 5.11029 4.67098 4.96964 4.53033C4.82899 4.38968 4.74997 4.19891 4.74997 4C4.74997 3.80109 4.82899 3.61032 4.96964 3.46967C5.11029 3.32902 5.30106 3.25 5.49997 3.25H12C12.1989 3.25 12.3896 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4Z" fill="currentColor"/></svg></div></a>
          <a href="https://www.linkedin.com/company/buttercup-advertising-studio/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" class="footer-nav-links social w-inline-block"><div>linkedIn</div><div class="social-arrow_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 4V10.5C12.75 10.6989 12.671 10.8897 12.5303 11.0303C12.3896 11.171 12.1989 11.25 12 11.25C11.8011 11.25 11.6103 11.171 11.4696 11.0303C11.329 10.8897 11.25 10.6989 11.25 10.5V5.8125L4.5306 12.5306C4.3897 12.6715 4.19861 12.7507 3.99935 12.7507C3.80009 12.7507 3.60899 12.6715 3.4681 12.5306C3.3272 12.3897 3.24805 12.1986 3.24805 11.9994C3.24805 11.8001 3.3272 11.609 3.4681 11.4681L10.1875 4.75H5.49997C5.30106 4.75 5.11029 4.67098 4.96964 4.53033C4.82899 4.38968 4.74997 4.19891 4.74997 4C4.74997 3.80109 4.82899 3.61032 4.96964 3.46967C5.11029 3.32902 5.30106 3.25 5.49997 3.25H12C12.1989 3.25 12.3896 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4Z" fill="currentColor"/></svg></div></a>
        </div>
      </div>
    </div>
  </section>
"""

# Article Content Generator
def get_article_body(b):
    return f"""
    <div class="blog-rich_text w-richtext">
      <h2>The Core Dilemma: Why Conventional Approaches Fall Short</h2>
      <p>In an increasingly crowded marketplace, standard playbooks produce standard results. When brands compete purely on features, speed, or discount pricing, they enter an exhausting race to the bottom where loyalty is fragile and profit margins erode.</p>
      
      <p>True market leaders understand a fundamental truth: <strong>differentiation is not a cosmetic layer; it is an architectural decision.</strong> When {b['title']} is addressed at its roots, every touchpoint—from packaging and visual language to customer communication—becomes a compounding brand asset.</p>

      <blockquote>“If your brand looks, sounds, and acts like everyone else in your industry, you are essentially subsidizing your competitors’ visibility.” — Sneha Vakta</blockquote>

      <h2>Strategic Pillars for Execution</h2>
      <p>To implement this effectively within growing businesses and established corporations alike, focus on these non-negotiable principles:</p>
      
      <ul role="list">
        <li><strong>Distinct Visual & Verbal Signatures:</strong> Establish proprietary assets—whether custom letterforms, signature color blocking, or distinct editorial tonality—that cannot be confused with any other player.</li>
        <li><strong>Emotional Resonance Over Functional Noise:</strong> Products solve functional problems, but brands fulfill emotional desires. Anchor your positioning in core human motives: belonging, prestige, confidence, and peace of mind.</li>
        <li><strong>Ruthless Consistency Across Touchpoints:</strong> A brilliant brand identity fails when fractured. Ensure seamless continuity from digital ad creative to unboxing experience, client decks, and physical retail.</li>
        <li><strong>Continuous Feedback & Iteration:</strong> Great branding is alive. Monitor consumer perception, test packaging shelf appeal, and refine messaging without losing your foundational DNA.</li>
      </ul>

      <h2>Key Actionable Takeaways</h2>
      <ol role="list">
        <li>Audit your existing brand touchpoints and identify where message drift is occurring.</li>
        <li>Define the single emotion you want customers to feel within the first 3 seconds of interacting with your brand.</li>
        <li>Invest in high-craft design assets that elevate perceived value and unlock premium pricing power.</li>
      </ol>

      <div class="blog-author-card" style="margin-top: 3.5rem; padding: 2rem; background: #fafaf8; border-radius: 12px; border: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 1.5rem;">
        <img src="../images/reviewlogo/World-near-me.png" alt="Buttercup Editorial" style="width: 64px; height: 64px; border-radius: 50%; object-fit: contain; background: #fff; padding: 4px; border: 1px solid rgba(0,0,0,0.08);" />
        <div>
          <div style="font-weight: 700; font-size: 1.1rem; color: #121212;">Written by Sneha Vakta & Team</div>
          <div style="font-size: 0.88rem; color: #666; margin-top: 0.2rem;">Brand Strategists & Creative Directors at Buttercup Advertising Studio</div>
        </div>
      </div>
    </div>
    """

# Generate each blog post
for idx, b in enumerate(blogs):
    filename = f"{b['slug']}.html"
    filepath = os.path.join(blogs_dir, filename)

    # 4 Related posts (excluding current)
    related = [x for x in blogs if x['id'] != b['id']][:4]
    related_html = ""
    for r in related:
        related_html += f"""
        <div role="listitem" class="w-dyn-item">
          <a href="../blogs/{r['slug']}.html" class="cards w-inline-block">
            <div class="thumbnail-wrapper">
              <img src="../{r['image']}" alt="{r['title']}" class="thumbnail" loading="lazy" />
            </div>
            <div class="blog-content_wrapper">
              <div class="text-3x_base is-medium">{r['title']}</div>
              <div class="text-2x_base">{r['desc']}</div>
              <div class="spacer-small"></div>
              <div class="read-more">
                <p>Read More..</p>
                <div class="button-arrow_wrapper">
                  <div class="button-arrow w-embed">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 256 256"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path></svg>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
        """

    article_html = f"""<!DOCTYPE html>
<html lang="en" class="w-mod-js">
<head>
<meta charset="utf-8">
<title>Buttercup Advertising Studio | {b['title']}</title>
<meta name="description" content="{b['desc']}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="../images/695d1ca93d6f12cb8592c30a_Favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=TASA+Orbiter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/site.css?v=35">
<link rel="stylesheet" href="../css/swiper-bundle.min.css">
<link rel="stylesheet" href="../css/lenis.css">
<link rel="stylesheet" href="../css/extra.css?v=59">
</head>
<body data-page="blog-detail">
<div class="wrapper">
  {get_navbar('../')}

  <!-- ARTICLE HEADER -->
  <section class="section">
    <div class="w-layout-blockcontainer container is-full w-container">
      <div class="blog-detail_header">
        <div class="w-layout-hflex blogs-date-wrp" style="display:flex; gap:0.5rem; align-items:center;">
          <span style="background:#121212; color:#fff; padding:0.2rem 0.75rem; border-radius:9999px; font-size:0.75rem; text-transform:uppercase; font-weight:600;">{b['category']}</span>
          <span class="text-base is-medium">({b['date']})</span>
          <span class="text-base is-medium">• {b['read_time']}</span>
        </div>
        <h1 class="heading-2x_large" style="margin-top:1.5rem; line-height:1.15;">{b['title']}</h1>
      </div>
      <div class="spacer-2x_medium"></div>
      <img src="../{b['image']}" alt="{b['title']}" class="blog-hero_image" style="border-radius:16px; width:100%; max-height:650px; object-fit:cover;" />
      <div class="spacer-2x_medium"></div>
      <div class="blog-content-wrapper">
        <div class="blog-content_col1">
          <div class="text-medium" style="font-weight:700;">{b['title']}</div>
          <div class="share-text_links_wrapper" style="margin-top:1.5rem;">
            <div class="text-2x_base">Share:</div>
            <div class="links-wrapper-article" style="display:flex; gap:0.75rem; margin-top:0.5rem;">
              <a href="https://www.linkedin.com/company/buttercup-advertising-studio/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" class="article-social-link">LinkedIn</a>
              <a href="https://www.instagram.com/buttercupadvertisingstudio/" target="_blank" rel="noopener noreferrer" class="article-social-link">Instagram</a>
            </div>
          </div>
        </div>
        {get_article_body(b)}
      </div>
    </div>
  </section>

  <!-- RELATED POSTS -->
  <section class="section">
    <div class="w-layout-blockcontainer container is-full w-container">
      <div class="blog-header">
        <h2 class="heading-x_large">related articles</h2>
        <a href="../blogs.html" class="main-btn w-inline-block"><div>View all 20 Articles</div></a>
      </div>
      <div class="spacer-3x_base"></div>
      <div class="w-dyn-list">
        <div role="list" class="grid-4-col w-dyn-items">
          {related_html}
        </div>
      </div>
    </div>
  </section>

  {get_footer('../')}
</div>
<script src="../js/vendor/gsap.min.js"></script>
<script src="../js/main.js?v=48"></script>
</body>
</html>
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(article_html)

print("Generated all 20 blog article pages in blogs/!")

# Now build blogs.html (Main 20 Blogs Listing Page)
blogs_cards_html = ""
for b in blogs:
    blogs_cards_html += f"""
    <div role="listitem" class="w-dyn-item blog-card-wrapper" data-category="{b['category']}">
      <a href="blogs/{b['slug']}.html" class="cards w-inline-block" style="display:flex; flex-direction:column; height:100%; border-radius:14px; overflow:hidden; background:#fff; border:1px solid rgba(0,0,0,0.06); transition:transform 0.3s ease, box-shadow 0.3s ease;">
        <div class="thumbnail-wrapper" style="aspect-ratio:16/10; width:100%; overflow:hidden;">
          <img src="{b['image']}" alt="{b['title']}" class="thumbnail" loading="lazy" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;" />
        </div>
        <div class="blog-content_wrapper" style="padding:1.5rem; display:flex; flex-direction:column; flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span style="font-size:0.72rem; text-transform:uppercase; font-weight:700; letter-spacing:0.08em; color:#e02b20; background:rgba(224,43,32,0.08); padding:0.25rem 0.65rem; border-radius:9999px;">{b['category']}</span>
            <span style="font-size:0.78rem; color:#888;">{b['read_time']}</span>
          </div>
          <div class="text-3x_base is-medium" style="font-size:1.18rem; font-weight:700; line-height:1.28; margin-bottom:0.5rem; color:#121212;">{b['title']}</div>
          <div class="text-2x_base" style="font-size:0.88rem; color:#666; line-height:1.45; margin-bottom:1.5rem; flex:1;">{b['desc']}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:0.75rem; border-top:1px solid rgba(0,0,0,0.06);">
            <span style="font-size:0.8rem; color:#888;">{b['date']}</span>
            <div class="read-more" style="display:flex; align-items:center; gap:0.4rem; font-weight:600; color:#121212; font-size:0.85rem;">
              <span>Read Article</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </div>
          </div>
        </div>
      </a>
    </div>
    """

blogs_page_html = f"""<!DOCTYPE html>
<html lang="en" class="w-mod-js">
<head>
<meta charset="utf-8">
<title>Buttercup Advertising Studio | Industry Insights & Strategic Blogs (20 Articles)</title>
<meta name="description" content="Explore 20 in-depth branding, design, strategy, and packaging articles by Buttercup Advertising Studio. Winning heart share and market leadership.">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="images/695d1ca93d6f12cb8592c30a_Favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/site.css?v=35">
<link rel="stylesheet" href="css/swiper-bundle.min.css">
<link rel="stylesheet" href="css/lenis.css">
<link rel="stylesheet" href="css/extra.css?v=59">
<style>
.blog-filter-btn {{
  padding: 0.65rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: #fff;
  color: #121212;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}}
.blog-filter-btn:hover, .blog-filter-btn.active {{
  background: #121212;
  color: #fff;
  border-color: #121212;
}}
.blogs-grid-container {{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
}}
@media (max-width: 768px) {{
  .blogs-grid-container {{ grid-template-columns: 1fr; }}
}}
</style>
</head>
<body data-page="blogs">
<div class="wrapper">
  {get_navbar('')}

  <!-- HERO SECTION -->
  <section class="section" style="padding-top: 5rem; padding-bottom: 2rem;">
    <div class="w-layout-blockcontainer container is-full w-container">
      <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:1.5rem; margin-bottom:2.5rem;">
        <div>
          <div style="font-size:0.85rem; letter-spacing:0.15em; text-transform:uppercase; color:#888; margin-bottom:0.5rem; font-weight:600;">Industry Insights & Thought Leadership</div>
          <h1 class="heading-2x_large" style="margin:0; font-size:clamp(2.5rem, 6vw, 4.5rem); line-height:1.05;">Knowledge &amp; Perspective</h1>
        </div>
        <div style="font-size:1.1rem; color:#666; max-width:480px;">
          20 curated articles exploring human-intelligence brand building, strategic differentiation, packaging craft, and commercial ROI.
        </div>
      </div>

      <!-- FILTER PILLS -->
      <div style="display:flex; flex-wrap:wrap; gap:0.65rem; margin-bottom:3rem;" id="filter-wrapper">
        <button class="blog-filter-btn active" data-filter="all">All Articles (20)</button>
        <button class="blog-filter-btn" data-filter="Brand Strategy">Brand Strategy</button>
        <button class="blog-filter-btn" data-filter="Visual Identity">Visual Identity</button>
        <button class="blog-filter-btn" data-filter="Packaging Design">Packaging Design</button>
        <button class="blog-filter-btn" data-filter="Marketing Campaigns">Marketing Campaigns</button>
      </div>

      <!-- 20 BLOGS GRID -->
      <div class="blogs-grid-container" id="blogs-grid">
        {blogs_cards_html}
      </div>
    </div>
  </section>

  {get_footer('')}
</div>

<script src="js/vendor/gsap.min.js"></script>
<script src="js/main.js?v=48"></script>
<script>
// Filter Functionality
const filterBtns = document.querySelectorAll('.blog-filter-btn');
const cards = document.querySelectorAll('.blog-card-wrapper');

filterBtns.forEach(btn => {{
  btn.addEventListener('click', () => {{
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');

    cards.forEach(card => {{
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {{
        card.style.display = 'block';
      }} else {{
        card.style.display = 'none';
      }}
    }});
  }});
}});
</script>
</body>
</html>
"""

with open(os.path.join(ROOT, 'blogs.html'), 'w', encoding='utf-8') as f:
    f.write(blogs_page_html)

print("Updated blogs.html with all 20 blogs and filtering!")
