#!/usr/bin/env python3
"""
Reorganizes website pages into dedicated folders under `pages/`:
  - about.html -> pages/about/index.html
  - contact.html -> pages/contact/index.html
  - case-studies.html -> pages/case-studies/index.html
  - work.html -> pages/work/index.html
  - work-classic.html -> pages/work-classic/index.html
  - blogs.html -> pages/blogs/index.html
  - brand-strategy.html -> pages/services/brand-strategy/index.html
  - visual-identity.html -> pages/services/visual-identity/index.html
  - marketing-communication.html -> pages/services/marketing-communication/index.html
  - product-base.html -> pages/industries/product-base/index.html
  - service-base.html -> pages/industries/service-base/index.html
  - 401.html -> pages/401/index.html
  - 404.html -> pages/404/index.html

Also cleans up loose root clutter (scripts to tools/, images/media to images/ or old/).
Updates all internal links, assets (CSS/JS/images/video), and inline scripts so the site remains 100% operational.
"""

import os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. Page moves: original relative path -> new relative path
PAGE_MOVES = {
    'about.html': 'pages/about/index.html',
    'contact.html': 'pages/contact/index.html',
    'case-studies.html': 'pages/case-studies/index.html',
    'work.html': 'pages/work/index.html',
    'work-classic.html': 'pages/work-classic/index.html',
    'blogs.html': 'pages/blogs/index.html',
    'brand-strategy.html': 'pages/services/brand-strategy/index.html',
    'visual-identity.html': 'pages/services/visual-identity/index.html',
    'marketing-communication.html': 'pages/services/marketing-communication/index.html',
    'product-base.html': 'pages/industries/product-base/index.html',
    'service-base.html': 'pages/industries/service-base/index.html',
    '401.html': 'pages/401/index.html',
    '404.html': 'pages/404/index.html',
}

# Loose root files cleanup
LOOSE_FILES = {
    'get_large_images.py': 'tools/get_large_images.py',
    'update.py': 'tools/update.py',
    'oddly.css': 'old/oddly.css',
    'oddlymade.html': 'old/oddlymade.html',
    'play_btn.svg': 'old/play_btn.svg',
    'thumbnail.jpg': 'old/thumbnail.jpg',
    'thumbnail_original.avif': 'old/thumbnail_original.avif',
    'frame.svg': 'images/frame.svg',
    'oddlymade.svg': 'images/oddlymade.svg',
    'test.jpg': 'scratch/test.jpg',
    'yt.jpg': 'scratch/yt.jpg',
}

# Canonical root-relative destination for every page
CANONICAL_TARGETS = {
    'index.html': 'index.html',
    'about.html': 'pages/about/index.html',
    'contact.html': 'pages/contact/index.html',
    'case-studies.html': 'pages/case-studies/index.html',
    'work.html': 'pages/work/index.html',
    'work-classic.html': 'pages/work-classic/index.html',
    'blogs.html': 'pages/blogs/index.html',
    'brand-strategy.html': 'pages/services/brand-strategy/index.html',
    'visual-identity.html': 'pages/services/visual-identity/index.html',
    'marketing-communication.html': 'pages/services/marketing-communication/index.html',
    'product-base.html': 'pages/industries/product-base/index.html',
    'service-base.html': 'pages/industries/service-base/index.html',
    '401.html': 'pages/401/index.html',
    '404.html': 'pages/404/index.html',
}


def compute_rel_url(target_canonical, current_dir):
    """Compute relative URL from current_dir (relative to ROOT) to target_canonical (relative to ROOT)."""
    rel = os.path.relpath(target_canonical, current_dir)
    return rel


def rewrite_html_content(content, current_rel_path, is_moved_page=False):
    """
    Rewrites URLs in an HTML file located at current_rel_path (relative to ROOT).
    If is_moved_page is True, the content came from a root file (where links were written for root depth),
    so we first adjust root asset paths (css/, js/, images/, rings.mp4) to the new depth.
    """
    current_dir = os.path.dirname(current_rel_path)
    depth = 0 if not current_dir else current_dir.count('/') + 1
    root_prefix = '../' * depth

    # If this was originally at root, asset paths like href="css/...", src="js/...", src="images/...", src="rings.mp4"
    # must be prefixed with root_prefix
    if is_moved_page and root_prefix:
        # Asset prefixes for CSS, JS, images, favicon, video
        content = re.sub(r'href="(css/[^"]+)"', lambda m: f'href="{root_prefix}{m.group(1)}"', content)
        content = re.sub(r'src="(js/[^"]+)"', lambda m: f'src="{root_prefix}{m.group(1)}"', content)
        content = re.sub(r'href="(images/[^"]+)"', lambda m: f'href="{root_prefix}{m.group(1)}"', content)
        content = re.sub(r'src="(images/[^"]+)"', lambda m: f'src="{root_prefix}{m.group(1)}"', content)
        content = re.sub(r'src="rings\.mp4"', f'src="{root_prefix}rings.mp4"', content)

        # In projects/ and blogs/ links originally in root pages:
        content = re.sub(r'href="blogs/([^"]+)"', lambda m: f'href="{root_prefix}blogs/{m.group(1)}"', content)
        content = re.sub(r'href="projects/([^"]+)"', lambda m: f'href="{root_prefix}projects/{m.group(1)}"', content)

        # In work.html and case-studies.html JS inline data:
        # "link": "projects/..." -> "link": "../../projects/..."
        # "img": "images/..." -> "img": "../../images/..."
        content = re.sub(r'"link":\s*"projects/([^"]+)"', lambda m: f'"link": "{root_prefix}projects/{m.group(1)}"', content)
        content = re.sub(r'"img":\s*"images/([^"]+)"', lambda m: f'"img": "{root_prefix}images/{m.group(1)}"', content)

    # Now rewrite page links
    # Matches href="(../)?(page.html)(#anchor)?"
    def replace_page_href(m):
        quote = m.group(1) # ' or "
        page_name = m.group(2)
        anchor = m.group(3) or ''

        if page_name in CANONICAL_TARGETS:
            canonical = CANONICAL_TARGETS[page_name]
            rel_link = compute_rel_url(canonical, current_dir)
            return f'href={quote}{rel_link}{anchor}{quote}'
        return m.group(0)

    pattern = re.compile(r'href=([\'"])(?:\.\./)?([a-zA-Z0-9_\-]+\.html)(#[a-zA-Z0-9_\-]+)?([\'"])')
    content = pattern.sub(replace_page_href, content)

    return content


def run():
    print("=== Starting Project Reorganization ===")

    # Ensure images/rings.mp4 exists
    src_rings = os.path.join(ROOT, 'rings.mp4')
    dst_rings = os.path.join(ROOT, 'images', 'rings.mp4')
    if os.path.exists(src_rings) and not os.path.exists(dst_rings):
        shutil.copy2(src_rings, dst_rings)
        print("Copied rings.mp4 -> images/rings.mp4")

    # Move loose non-HTML files
    for src_rel, dst_rel in LOOSE_FILES.items():
        src_path = os.path.join(ROOT, src_rel)
        dst_path = os.path.join(ROOT, dst_rel)
        if os.path.exists(src_path):
            os.makedirs(os.path.dirname(dst_path), exist_ok=True)
            shutil.move(src_path, dst_path)
            print(f"Moved {src_rel} -> {dst_rel}")

    # Process and move each page
    for orig_rel, new_rel in PAGE_MOVES.items():
        orig_path = os.path.join(ROOT, orig_rel)
        new_path = os.path.join(ROOT, new_rel)

        if not os.path.exists(orig_path):
            print(f"Notice: {orig_rel} already moved or does not exist.")
            continue

        with open(orig_path, 'r', encoding='utf-8') as f:
            content = f.read()

        updated_content = rewrite_html_content(content, new_rel, is_moved_page=True)

        os.makedirs(os.path.dirname(new_path), exist_ok=True)
        with open(new_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        os.remove(orig_path)
        print(f"Moved & rewrote: {orig_rel} -> {new_rel}")

    # Process remaining HTML files: index.html, blogs/*.html, projects/*.html, utilities/*.html
    other_html_files = ['index.html']

    for folder in ['blogs', 'projects', 'utilities']:
        folder_path = os.path.join(ROOT, folder)
        if os.path.exists(folder_path):
            for fname in sorted(os.listdir(folder_path)):
                if fname.endswith('.html'):
                    other_html_files.append(os.path.join(folder, fname))

    for rel_path in other_html_files:
        full_path = os.path.join(ROOT, rel_path)
        if not os.path.exists(full_path):
            continue

        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        updated_content = rewrite_html_content(content, rel_path, is_moved_page=False)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        print(f"Updated links in: {rel_path}")

    print("=== Reorganization Completed Successfully! ===")


if __name__ == '__main__':
    run()
