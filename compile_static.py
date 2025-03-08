#!/usr/bin/env python3
import os

html_file = os.path.join("templates", "index.html")
css_file = os.path.join("static", "style.css")
script_file = os.path.join("static", "script.js")
dnd_file = os.path.join("static", "dragAndDrop.js")
data_file = os.path.join("static", "data.json")
output_file = "static_index.html"

# 1. Check files exist
for f in [html_file, css_file, script_file, dnd_file, data_file]:
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

with open(data_file, "r", encoding="utf-8") as f:
    data_content = f.read()

# 3. Inline the CSS
html_content = html_content.replace(
    '<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'style.css\') }}">',
    f"<style>\n{css_content}\n</style>"
)

# 4. Insert inlineData script block (test data) before the inlined scripts
#   We’ll place it near where we’d load script.js
inline_data_script = f'<script>\nvar inlineData = {data_content};\n</script>\n'

# Insert it just before we inline script.js
search_str_1 = f'<script src="{{{{ url_for(\'static\', filename=\'script.js\') }}}}"></script>'
replace_str_1 = inline_data_script + search_str_1
html_content = html_content.replace(search_str_1, replace_str_1)

# 5. Replace fetch('/data') in script.js and dragAndDrop.js
#   This ensures they use inlineData instead of an HTTP call.
script_content = script_content.replace("fetch('/data')", "Promise.resolve(inlineData)")
dnd_content = dnd_content.replace("fetch('/data')", "Promise.resolve(inlineData)")

# 6. Inline the main script.js
html_content = html_content.replace(
    f'<script src="{{{{ url_for(\'static\', filename=\'script.js\') }}}}"></script>',
    f"<script>\n{script_content}\n</script>"
)

# 7. Inline the dragAndDrop.js
html_content = html_content.replace(
    f'<script src="{{{{ url_for(\'static\', filename=\'dragAndDrop.js\') }}}}"></script>',
    f"<script>\n{dnd_content}\n</script>"
)

# 8. Write out the final static HTML file
with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✅ Static HTML file generated: {output_file}")
