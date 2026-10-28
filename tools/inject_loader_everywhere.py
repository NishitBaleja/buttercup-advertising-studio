#!/usr/bin/env python3
import os, glob, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def process_file(filepath):
    rel = os.path.relpath(filepath, ROOT)
    depth = rel.count('/')
    prefix = '../' * depth

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    modified = False

    # 1. Ensure loader.css is linked in <head>
    css_tag = f'<link rel="stylesheet" href="{prefix}css/loader.css?v=6">'
    if 'loader.css' not in content:
        if '</head>' in content:
            content = content.replace('</head>', f'{css_tag}\n</head>', 1)
            modified = True
        elif '<body' in content:
            content = content.replace('<body', f'{css_tag}\n<body', 1)
            modified = True
    else:
        # Update existing tag to ensure v=5
        new_content = re.sub(r'<link[^>]*href="[^"]*loader\.css[^"]*"[^>]*>', css_tag, content)
        if new_content != content:
            content = new_content
            modified = True

    # 2. Ensure loader.js is linked before </body>
    js_tag = f'<script src="{prefix}js/loader.js?v=6"></script>'
    if 'loader.js' not in content:
        if '</body>' in content:
            content = content.replace('</body>', f'{js_tag}\n</body>', 1)
            modified = True
        else:
            content = content + f'\n{js_tag}\n'
            modified = True
    else:
        # Update existing tag to ensure v=5
        new_content = re.sub(r'<script[^>]*src="[^"]*loader\.js[^"]*"[^>]*></script>', js_tag, content)
        if new_content != content:
            content = new_content
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Collect all html files
count = 0
for dirpath, _, filenames in os.walk(ROOT):
    if '/.' in dirpath or '/old' in dirpath or '/scratch' in dirpath:
        continue
    for f in filenames:
        if f.endswith('.html'):
            fpath = os.path.join(dirpath, f)
            if process_file(fpath):
                count += 1

print(f"Successfully injected / updated loader into {count} HTML files!")
