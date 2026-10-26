#!/usr/bin/env python3
import os, glob, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 1. Read clean_nav from index.html
with open(os.path.join(ROOT, 'index.html'), 'r', encoding='utf-8') as f:
    index_content = f.read()

start_marker = '<div data-animation="over-right" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" class="navbar w-nav">'
start_idx = index_content.find(start_marker)
if start_idx == -1:
    raise ValueError("Start marker not found in index.html")

# Find the end of this navbar block
# In index.html, right after the navbar is <section class="section is-hero">
hero_idx = index_content.find('<section class="section is-hero">', start_idx)
if hero_idx == -1:
    raise ValueError("Hero section not found after navbar in index.html")

raw_nav = index_content[start_idx:hero_idx].rstrip()
# Verify closing div count
div_opens = len(re.findall(r'<div\b', raw_nav))
div_closes = len(re.findall(r'</div>', raw_nav))
print(f"Index navbar extracted: length={len(raw_nav)}, opens={div_opens}, closes={div_closes}")
if div_opens != div_closes:
    raise ValueError(f"Div mismatch in extracted navbar: {div_opens} vs {div_closes}")

# Create a clean template by removing aria-current="page" and w--current from brand/links
clean_template = raw_nav.replace(' aria-current="page"', '').replace(' w--current', '')

def get_navbar_for(prefix):
    if not prefix:
        return clean_template
    # Replace relative urls with prefixed urls
    nav = clean_template
    # Links to replace:
    urls = [
        'index.html',
        'case-studies.html',
        'blogs.html',
        'about.html',
        'contact.html',
        'brand-strategy.html',
        'visual-identity.html',
        'marketing-communication.html',
        'product-base.html',
        'service-base.html',
        'work-classic.html',
        'work.html',
        'rings.mp4'
    ]
    for u in urls:
        # replace href="url" with href="{prefix}url"
        nav = nav.replace(f'href="{u}"', f'href="{prefix}{u}"')
        nav = nav.replace(f'src="{u}"', f'src="{prefix}{u}"')
    return nav

def update_file(filepath, prefix=""):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Locate existing navbar
    # Find start
    m_start = re.search(r'<div[^>]*role="banner"[^>]*class="navbar w-nav"[^>]*>', content)
    if not m_start:
        print(f"Skipping {filepath}: No navbar start found")
        return False
    
    start_pos = m_start.start()
    
    # We want to find the corresponding end of the navbar
    # Count div tags starting from start_pos until balanced
    count = 0
    pos = start_pos
    end_pos = -1
    
    for m in re.finditer(r'<div\b|</div>', content[start_pos:]):
        tag = m.group(0)
        if tag.startswith('<div'):
            count += 1
        elif tag == '</div>':
            count -= 1
            if count == 0:
                end_pos = start_pos + m.end()
                break
                
    if end_pos == -1 or count != 0:
        print(f"Error in {filepath}: Could not find balanced closing div for navbar (count={count})")
        return False
        
    old_nav = content[start_pos:end_pos]
    new_nav = get_navbar_for(prefix)
    
    # If file is index.html, mark home as current
    if os.path.basename(filepath) == 'index.html' and prefix == "":
        new_nav = new_nav.replace('class="navbar-brand w-nav-brand"', 'aria-current="page" class="navbar-brand w-nav-brand w--current"')
        new_nav = new_nav.replace('href="index.html" class="nav-links w-inline-block"', 'href="index.html" aria-current="page" class="nav-links w-inline-block w--current"')
    
    new_content = content[:start_pos] + new_nav + content[end_pos:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath} (replaced {len(old_nav)} bytes with {len(new_nav)} bytes)")
    return True

# 1. Update Root pages
root_pages = [
    'about.html',
    'contact.html',
    'brand-strategy.html',
    'visual-identity.html',
    'marketing-communication.html',
    'product-base.html',
    'service-base.html',
    'work-classic.html',
    'blogs.html',
    '404.html'
]

for p in root_pages:
    fpath = os.path.join(ROOT, p)
    if os.path.exists(fpath):
        update_file(fpath, prefix="")

# 2. Update blogs/
blog_files = glob.glob(os.path.join(ROOT, 'blogs', '*.html'))
for fpath in blog_files:
    update_file(fpath, prefix="../")

# 3. Update projects/
project_files = glob.glob(os.path.join(ROOT, 'projects', '*.html'))
for fpath in project_files:
    update_file(fpath, prefix="../")

# 4. Update utilities/
util_files = [
    os.path.join(ROOT, 'utilities', 'instruction.html'),
    os.path.join(ROOT, 'utilities', 'licenses.html'),
    os.path.join(ROOT, 'utilities', 'change-log.html'),
]
for fpath in util_files:
    if os.path.exists(fpath):
        update_file(fpath, prefix="../")

print("All navbars synchronized successfully!")
