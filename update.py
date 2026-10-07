with open("oddlymade.svg", "r") as f:
    svg_content = f.read().strip()

with open("index.html", "r") as f:
    html = f.read()

import re
# Replace the <div class="bg-text">BAS</div> with the new one containing the SVG
new_html = re.sub(
    r'<div class="bg-text">.*?</div>',
    f'<div class="bg-text">\n{svg_content}\n</div>',
    html,
    flags=re.DOTALL
)

with open("index.html", "w") as f:
    f.write(new_html)

print("Updated index.html")
