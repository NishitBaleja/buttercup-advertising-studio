#!/usr/bin/env python3
"""
Updates all social links across all production HTML files:
- Instagram: https://www.instagram.com/buttercupadvertisingstudio/
- LinkedIn: https://www.linkedin.com/company/buttercup-advertising-studio/?originalSubdomain=in
- Removes X/Twitter completely from all footers, navbars, and article share bars
- Ensures target="_blank" rel="noopener noreferrer" on external social links
- Replaces lingering PixyBits branding in project footers with Buttercup Advertising Studio
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INSTAGRAM_URL = "https://www.instagram.com/buttercupadvertisingstudio/"
LINKEDIN_URL = "https://www.linkedin.com/company/buttercup-advertising-studio/?originalSubdomain=in"

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    rel_path = os.path.relpath(filepath, ROOT)
    is_subfolder = '/' in rel_path

    # 1. Remove X/Twitter links
    # 1a. In nav-social-links: <a href="...x.com..." class="footer-nav-links">x/twitter</a>
    content = re.sub(
        r'<a\s+href="https?://x\.com/[^"]*"\s+class="footer-nav-links">x/twitter</a>',
        '',
        content,
        flags=re.IGNORECASE
    )

    # 1b. In footer socials: <a href="...x.com..." ... class="footer-nav-links social ...">.*?</a>
    # Matches both <div>x/twitter</div> and <div>X/Twitter</div>
    content = re.sub(
        r'<a\s+[^>]*?href="https?://(?:x\.com|twitter\.com)/[^"]*"[^>]*?class="footer-nav-links social[^"]*"[^>]*?>.*?</a>',
        '',
        content,
        flags=re.DOTALL | re.IGNORECASE
    )
    # Also in case class comes before href:
    content = re.sub(
        r'<a\s+class="footer-nav-links social[^"]*"[^>]*?href="https?://(?:x\.com|twitter\.com)/[^"]*"[^>]*?>.*?</a>',
        '',
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 1c. In article social share links: <a href="...x.com..." class="article-social-link ...">.*?</a>
    content = re.sub(
        r'<a\s+[^>]*?href="https?://(?:x\.com|twitter\.com)/[^"]*"[^>]*?class="article-social-link[^"]*"[^>]*?>.*?</a>',
        '',
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # Any remaining twitter/x links to pixybits
    content = re.sub(
        r'<a\s+[^>]*?href="https?://x\.com/pixybits_co"[^>]*?>.*?</a>',
        '',
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 2. Update Instagram links
    # 2a. Mobile navbar: <a href="..." class="footer-nav-links">instagram</a>
    def replace_nav_ig(m):
        return f'<a href="{INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="footer-nav-links">instagram</a>'

    content = re.sub(
        r'<a\s+href="https?://(?:www\.)?instagram\.com/[^"]*"\s+class="footer-nav-links">instagram</a>',
        replace_nav_ig,
        content,
        flags=re.IGNORECASE
    )

    # 2b. Footer social link: update href and ensure target="_blank" rel="noopener noreferrer"
    # Matches <a href="...instagram..." ... class="footer-nav-links social ...">
    def update_footer_ig(m):
        full_tag = m.group(0)
        # Replace href
        full_tag = re.sub(r'href="https?://(?:www\.)?instagram\.com/[^"]*"', f'href="{INSTAGRAM_URL}"', full_tag, flags=re.IGNORECASE)
        # Ensure target="_blank"
        if 'target="_blank"' not in full_tag:
            full_tag = re.sub(r'<a\s+', '<a target="_blank" rel="noopener noreferrer" ', full_tag, count=1)
        elif 'rel="noopener' not in full_tag:
            full_tag = re.sub(r'target="_blank"', 'target="_blank" rel="noopener noreferrer"', full_tag, count=1)
        return full_tag

    content = re.sub(
        r'<a\s+[^>]*?href="https?://(?:www\.)?instagram\.com/[^"]*"[^>]*?class="footer-nav-links social[^"]*"[^>]*?>.*?</a>',
        update_footer_ig,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )
    content = re.sub(
        r'<a\s+class="footer-nav-links social[^"]*"[^>]*?href="https?://(?:www\.)?instagram\.com/[^"]*"[^>]*?>.*?</a>',
        update_footer_ig,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 2c. Team socialmedia link (about.html):
    def update_team_ig(m):
        full_tag = m.group(0)
        full_tag = re.sub(r'href="https?://(?:www\.)?instagram\.com/[^"]*"', f'href="{INSTAGRAM_URL}"', full_tag, flags=re.IGNORECASE)
        if 'target="_blank"' not in full_tag:
            full_tag = re.sub(r'<a\s+', '<a target="_blank" rel="noopener noreferrer" ', full_tag, count=1)
        return full_tag

    content = re.sub(
        r'<a\s+[^>]*?href="https?://(?:www\.)?instagram\.com/[^"]*"[^>]*?class="team-socialmedia-link[^"]*"[^>]*?>.*?</a>',
        update_team_ig,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 2d. Article social links (blogs/*.html):
    content = re.sub(
        r'<a\s+href="https?://(?:www\.)?instagram\.com/[^"]*"\s+target="_blank"\s+class="article-social-link">Instagram</a>',
        f'<a href="{INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="article-social-link">Instagram</a>',
        content,
        flags=re.IGNORECASE
    )

    # 3. Update LinkedIn links
    # 3a. Mobile navbar: <a href="..." class="footer-nav-links">linkedIn</a>
    def replace_nav_li(m):
        return f'<a href="{LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" class="footer-nav-links">linkedIn</a>'

    content = re.sub(
        r'<a\s+href="https?://(?:www\.)?linkedin\.com/[^"]*"\s+class="footer-nav-links">linkedIn</a>',
        replace_nav_li,
        content,
        flags=re.IGNORECASE
    )

    # 3b. Footer social link:
    def update_footer_li(m):
        full_tag = m.group(0)
        # Replace href
        full_tag = re.sub(r'href="https?://(?:www\.)?linkedin\.com/[^"]*"', f'href="{LINKEDIN_URL}"', full_tag, flags=re.IGNORECASE)
        # Ensure target="_blank"
        if 'target="_blank"' not in full_tag:
            full_tag = re.sub(r'<a\s+', '<a target="_blank" rel="noopener noreferrer" ', full_tag, count=1)
        elif 'rel="noopener' not in full_tag:
            full_tag = re.sub(r'target="_blank"', 'target="_blank" rel="noopener noreferrer"', full_tag, count=1)
        return full_tag

    content = re.sub(
        r'<a\s+[^>]*?href="https?://(?:www\.)?linkedin\.com/[^"]*"[^>]*?class="footer-nav-links social[^"]*"[^>]*?>.*?</a>',
        update_footer_li,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )
    content = re.sub(
        r'<a\s+class="footer-nav-links social[^"]*"[^>]*?href="https?://(?:www\.)?linkedin\.com/[^"]*"[^>]*?>.*?</a>',
        update_footer_li,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 3c. Team socialmedia link (about.html):
    def update_team_li(m):
        full_tag = m.group(0)
        full_tag = re.sub(r'href="https?://(?:www\.)?linkedin\.com/[^"]*"', f'href="{LINKEDIN_URL}"', full_tag, flags=re.IGNORECASE)
        if 'target="_blank"' not in full_tag:
            full_tag = re.sub(r'<a\s+', '<a target="_blank" rel="noopener noreferrer" ', full_tag, count=1)
        return full_tag

    content = re.sub(
        r'<a\s+[^>]*?href="https?://(?:www\.)?linkedin\.com/[^"]*"[^>]*?class="team-socialmedia-link[^"]*"[^>]*?>.*?</a>',
        update_team_li,
        content,
        flags=re.DOTALL | re.IGNORECASE
    )

    # 3d. Article social links (blogs/*.html):
    content = re.sub(
        r'<a\s+href="https?://(?:www\.)?linkedin\.com/[^"]*"\s+target="_blank"\s+class="article-social-link">LinkedIn</a>',
        f'<a href="{LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" class="article-social-link">LinkedIn</a>',
        content,
        flags=re.IGNORECASE
    )

    # 4. Clean up any remaining pixybits URLs in <a> tags
    # Replace branding link PixyBits in legal-wrp
    prefix = '../' if is_subfolder else ''
    content = re.sub(
        r'<a\s+href="https?://(?:www\.)?pixybits\.com/?"\s+target="_blank"\s+class="branding-links">PixyBits</a>',
        f'<a href="{prefix}index.html" class="branding-links">Buttercup Advertising Studio</a>',
        content,
        flags=re.IGNORECASE
    )
    content = re.sub(
        r'<a\s+href="https?://(?:www\.)?pixybits\.com/?"\s+class="branding-links">PixyBits</a>',
        f'<a href="{prefix}index.html" class="branding-links">Buttercup Advertising Studio</a>',
        content,
        flags=re.IGNORECASE
    )

    # 5. In blogs/*.html, if footer does not have Socials group, inject it before closing of footer-links-grid
    if filepath.startswith(os.path.join(ROOT, 'blogs/')) and filepath.endswith('.html') and filepath != os.path.join(ROOT, 'blogs.html'):
        if 'class="footer-links-group footer-socials-group"' not in content and 'footer-link_header">Socials' not in content:
            socials_block = f'''        <div class="footer-links-group">
          <div class="footer-link_header">Socials</div>
          <div class="spacer-small"></div>
          <a href="{INSTAGRAM_URL}" target="_blank" rel="noopener noreferrer" class="footer-nav-links social w-inline-block"><div>instagram</div><div class="social-arrow_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 4V10.5C12.75 10.6989 12.671 10.8897 12.5303 11.0303C12.3896 11.171 12.1989 11.25 12 11.25C11.8011 11.25 11.6103 11.171 11.4696 11.0303C11.329 10.8897 11.25 10.6989 11.25 10.5V5.8125L4.5306 12.5306C4.3897 12.6715 4.19861 12.7507 3.99935 12.7507C3.80009 12.7507 3.60899 12.6715 3.4681 12.5306C3.3272 12.3897 3.24805 12.1986 3.24805 11.9994C3.24805 11.8001 3.3272 11.609 3.4681 11.4681L10.1875 4.75H5.49997C5.30106 4.75 5.11029 4.67098 4.96964 4.53033C4.82899 4.38968 4.74997 4.19891 4.74997 4C4.74997 3.80109 4.82899 3.61032 4.96964 3.46967C5.11029 3.32902 5.30106 3.25 5.49997 3.25H12C12.1989 3.25 12.3896 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4Z" fill="currentColor"/></svg></div></a>
          <a href="{LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" class="footer-nav-links social w-inline-block"><div>linkedIn</div><div class="social-arrow_icon w-embed"><svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.75 4V10.5C12.75 10.6989 12.671 10.8897 12.5303 11.0303C12.3896 11.171 12.1989 11.25 12 11.25C11.8011 11.25 11.6103 11.171 11.4696 11.0303C11.329 10.8897 11.25 10.6989 11.25 10.5V5.8125L4.5306 12.5306C4.3897 12.6715 4.19861 12.7507 3.99935 12.7507C3.80009 12.7507 3.60899 12.6715 3.4681 12.5306C3.3272 12.3897 3.24805 12.1986 3.24805 11.9994C3.24805 11.8001 3.3272 11.609 3.4681 11.4681L10.1875 4.75H5.49997C5.30106 4.75 5.11029 4.67098 4.96964 4.53033C4.82899 4.38968 4.74997 4.19891 4.74997 4C4.74997 3.80109 4.82899 3.61032 4.96964 3.46967C5.11029 3.32902 5.30106 3.25 5.49997 3.25H12C12.1989 3.25 12.3896 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4Z" fill="currentColor"/></svg></div></a>
        </div>
'''
            # insert before the closing of <div class="footer-links-grid">
            m_grid = re.search(r'(<div class="footer-links-grid">.*?</div>)(\s*</div>\s*</div>\s*</section>)', content, re.DOTALL)
            if m_grid:
                content = content[:m_grid.end(1)] + '\n' + socials_block + content[m_grid.end(1):]

    if content != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    files = [f for f in glob.glob(f'{ROOT}/**/*.html', recursive=True) if '/scratch/' not in f]
    modified = 0
    for f in sorted(files):
        if clean_file(f):
            modified += 1
            print(f'Updated: {os.path.relpath(f, ROOT)}')

    print(f'\nTotal modified files: {modified} / {len(files)}')

if __name__ == '__main__':
    main()
