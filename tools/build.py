#!/usr/bin/env python3
"""
Builds the static Oddly Made site from the downloaded page sources in scratch/pages.
 - localises every image/asset into /images
 - rewrites internal links to local .html files
 - strips Webflow runtime scripts and wires in our own (js/main.js + GSAP/Lenis/Swiper)
Run from the project root:  python3 tools/build.py
"""
import os, re, json, hashlib, urllib.request, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'scratch', 'pages')
IMG = os.path.join(ROOT, 'images')
os.makedirs(IMG, exist_ok=True)

CDN_RE = re.compile(r'https://cdn\.prod\.website-files\.com/[^\s"\'<>\\]+')
_cache = {}


def local_asset(url):
    """Download url into /images and return the filename (cached)."""
    url = url.replace('&amp;', '&')
    if url in _cache:
        return _cache[url]
    last = urllib.parse.unquote(url.split('?')[0].rsplit('/', 1)[-1])
    name = re.sub(r'[^A-Za-z0-9._-]+', '-', last).strip('-')
    # keep the site-id/asset-id prefix unique
    seg = url.split('/')[-2] if url.count('/') > 4 else ''
    if name in {v for v in _cache.values()}:
        name = hashlib.md5(url.encode()).hexdigest()[:6] + '_' + name
    path = os.path.join(IMG, name)
    if not os.path.exists(path):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            data = urllib.request.urlopen(req, timeout=60).read()
            open(path, 'wb').write(data)
        except Exception as e:
            print('   !! failed', url, e)
    _cache[url] = name
    return name


PAGE_MAP = {
    '': 'index.html', 'work': 'work.html', 'about': 'about.html', 'blogs': 'blogs.html',
    'contact': 'contact.html', '401': '401.html', '404': '404.html',
}


def map_link(href, prefix):
    if href.startswith(('http', 'mailto:', 'tel:', '#', 'javascript:')):
        return href
    anchor = ''
    if '#' in href:
        href, anchor = href.split('#', 1)
        anchor = '#' + anchor
    h = href.strip('/')
    if h in PAGE_MAP:
        out = PAGE_MAP[h]
    elif h.startswith(('projects/', 'blogs/', 'utilities/')):
        out = h + '.html'
    else:
        return href + anchor
    return prefix + out + anchor


def build_page(src_name, out_rel):
    html = open(os.path.join(SRC, src_name + '.html'), encoding='utf-8').read()
    depth = out_rel.count('/')
    prefix = '../' * depth

    title = re.search(r'<title>(.*?)</title>', html, re.S).group(1).strip()
    desc = re.search(r'<meta content="([^"]*)" name="description"', html)
    desc = desc.group(1) if desc else ''

    body = html[html.find('<body'):html.rfind('</body>')]
    body = re.sub(r'^<body[^>]*>', '', body)

    # --- cut Webflow badge / awwwards ribbon (everything from the badge on)
    i = body.find('<div class="pb-branding-badge">')
    if i != -1:
        body = body[:i]

    # --- lightbox JSON -> data attribute
    def lb(m):
        attrs, inner, js = m.group(1), m.group(2), m.group(3)
        try:
            url = json.loads(js)['items'][0]['url']
        except Exception:
            url = ''
        return '<a %s data-lightbox-url="%s">%s</a>' % (attrs, url, inner)
    body = re.sub(r'<a ([^>]*w-lightbox[^>]*)>(.*?)<script[^>]*class="w-json"[^>]*>(.*?)</script></a>', lb, body, flags=re.S)

    # --- drop scripts
    body = re.sub(r'<script\b.*?</script>', '', body, flags=re.S)
    body = re.sub(r'<link[^>]*>', '', body)

    # --- srcset / sizes
    body = re.sub(r'\s(?:srcset|sizes)="[^"]*"', '', body)
    body = re.sub(r'\sloading="lazy"', '', body)

    # --- images & assets
    body = CDN_RE.sub(lambda m: prefix + 'images/' + local_asset(m.group(0)), body)

    # --- links
    body = re.sub(r'href="(/[^"]*)"', lambda m: 'href="%s"' % map_link(m.group(1), prefix), body)

    # strip Webflow ids
    body = re.sub(r'\sdata-w-id="[^"]*"', '', body)
    body = re.sub(r'\sid="w-node-[^"]*"', '', body)

    # favicon
    fav = re.search(r'<link href="(https://cdn[^"]+)" rel="shortcut icon"', html)
    fav_name = local_asset(fav.group(1)) if fav else ''

    page_class = os.path.splitext(os.path.basename(out_rel))[0]
    head = f'''<!DOCTYPE html>
<html lang="en" class="w-mod-js">
<head>
<meta charset="utf-8">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="{prefix}images/{fav_name}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=TASA+Orbiter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{prefix}css/site.css">
<link rel="stylesheet" href="{prefix}css/swiper-bundle.min.css">
<link rel="stylesheet" href="{prefix}css/lenis.css">
<link rel="stylesheet" href="{prefix}css/extra.css">
</head>
<body data-page="{page_class}">
'''
    tail = f'''
<script src="{prefix}js/vendor/gsap.min.js"></script>
<script src="{prefix}js/vendor/ScrollTrigger.min.js"></script>
<script src="{prefix}js/vendor/SplitText.min.js"></script>
<script src="{prefix}js/vendor/lenis.min.js"></script>
<script src="{prefix}js/vendor/swiper-bundle.min.js"></script>
<script src="{prefix}js/vendor/ztstestimonials.js"></script>
<script src="{prefix}js/main.js"></script>
</body>
</html>
'''
    out_path = os.path.join(ROOT, out_rel)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    open(out_path, 'w', encoding='utf-8').write(head + body + tail)
    print('built', out_rel, len(body))


def main():
    for f in sorted(os.listdir(SRC)):
        name = f[:-5]
        if name == 'home':
            out = 'index.html'
        elif '__' in name:
            out = name.replace('__', '/') + '.html'
        else:
            out = name + '.html'
        build_page(name, out)


if __name__ == '__main__':
    main()
