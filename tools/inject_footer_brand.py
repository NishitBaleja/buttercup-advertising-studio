#!/usr/bin/env python3
"""
Injects the Orionix-style giant footer brand shimmer block:
<div class="footer-bottom-brand-wrap" aria-label="buttercup"><div class="footer-bottom-brand-text">buttercup</div></div>
into every HTML page with .section.is-footer.
"""

import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BRAND_BLOCK = '<div class="footer-bottom-brand-wrap" aria-label="buttercup"><div class="footer-bottom-brand-text">buttercup</div></div>'

updated = []
skipped = []

for dirpath, dirnames, filenames in os.walk(ROOT):
    if any(p in dirpath for p in ['.git', '.backups', 'old', 'scratch', 'node_modules']):
        continue
    for f in filenames:
        if f.endswith('.html'):
            p = os.path.join(dirpath, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()

            if 'section is-footer' not in c:
                continue

            if 'footer-bottom-brand-wrap' in c:
                skipped.append(os.path.relpath(p, ROOT))
                continue

            new_c = None
            if '<div class="spacer-medium"></div><div class="legal-wrp">' in c:
                new_c = c.replace(
                    '<div class="spacer-medium"></div><div class="legal-wrp">',
                    BRAND_BLOCK + '<div class="legal-wrp">',
                    1
                )
            elif '<div class="legal-wrp">' in c:
                new_c = c.replace(
                    '<div class="legal-wrp">',
                    BRAND_BLOCK + '<div class="legal-wrp">',
                    1
                )
            else:
                # Page without legal-wrp (e.g. blog posts)
                # Find the end of footer-links-grid and container
                # Replace </div>\n    </div>\n  </section> with brand block
                pattern = re.compile(r'(</div>\s*</div>\s*</section>)')
                m = pattern.search(c)
                if m:
                    target = m.group(1)
                    replacement = '</div>\n      ' + BRAND_BLOCK + '\n    </div>\n  </section>'
                    new_c = c[:m.start()] + replacement + c[m.end():]

            if new_c and new_c != c:
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_c)
                updated.append(os.path.relpath(p, ROOT))
            else:
                print('COULD NOT UPDATE:', os.path.relpath(p, ROOT))

print(f'Successfully updated: {len(updated)} files.')
print(f'Already had brand block: {len(skipped)} files.')
