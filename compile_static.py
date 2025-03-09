#!/usr/bin/env python3
import os

html_file = os.path.join("templates", "index.html")
css_file = os.path.join("static", "style.css")
script_file = os.path.join("static", "script.js")
dnd_file = os.path.join("static", "dragAndDrop.js")
output_file = os.path.join("docs", "index.html") 

# 1. Check files exist
for f in [html_file, css_file, script_file, dnd_file]:
    if not os.path.exists(f):
        raise FileNotFoundError(f"Error: {f} not found.")

# 2. Read files
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

with open(css_file, "r", encoding="utf-8") as f:
    css_content = f.read()

with open(script_file, "r", encoding="utf-8") as f:
    script_content = f.read()

with open(dnd_file, "r", encoding="utf-8") as f:
    dnd_content = f.read()

# 3. Inline the CSS
html_content = html_content.replace(
    '<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'style.css\') }}">',
    f"<style>\n{css_content}\n</style>"
)

# 4. Inline script.js
html_content = html_content.replace(
    '<script src="{{ url_for(\'static\', filename=\'script.js\') }}"></script>',
    f"<script>\n{script_content}\n</script>"
)

# 5. Inline dragAndDrop.js
html_content = html_content.replace(
    '<script src="{{ url_for(\'static\', filename=\'dragAndDrop.js\') }}"></script>',
    f"<script>\n{dnd_content}\n</script>"
)

# 6. Write out the final static HTML file
with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✅ Static HTML file generated: {output_file}")
