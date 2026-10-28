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

    # 1. Ensure ai-assistant.css is linked in <head>
    css_tag = f'<link rel="stylesheet" href="{prefix}css/ai-assistant.css?v=1">'
    if 'ai-assistant.css' not in content:
        if 'loader.css' in content:
            # Place right after loader.css
            content = re.sub(
                r'(<link[^>]*loader\.css[^>]*>)',
                r'\1\n' + css_tag,
                content,
                count=1
            )
            modified = True
        elif '</head>' in content:
            content = content.replace('</head>', f'{css_tag}\n</head>', 1)
            modified = True
        elif '<body' in content:
            content = content.replace('<body', f'{css_tag}\n<body', 1)
            modified = True

    # 2. Ensure ai-assistant.js is linked before </body>
    js_tag = f'<script src="{prefix}js/ai-assistant.js?v=1"></script>'
    if 'ai-assistant.js' not in content:
        if 'loader.js' in content:
            # Place right before loader.js
            content = re.sub(
                r'(<script[^>]*loader\.js[^>]*></script>)',
                js_tag + r'\n\1',
                content,
                count=1
            )
            modified = True
        elif '</body>' in content:
            content = content.replace('</body>', f'{js_tag}\n</body>', 1)
            modified = True
        else:
            content = content + f'\n{js_tag}\n'
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

count = 0
for dirpath, _, filenames in os.walk(ROOT):
    if '/.' in dirpath or '/old' in dirpath or '/scratch' in dirpath:
        continue
    for f in filenames:
        if f.endswith('.html'):
            fpath = os.path.join(dirpath, f)
            if process_file(fpath):
                count += 1

print(f"Successfully injected AI assistant into {count} HTML files!")
