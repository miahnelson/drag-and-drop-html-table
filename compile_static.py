#!/usr/bin/env python3
import os

# Define file paths
html_file = os.path.join("templates", "index.html")
css_file = os.path.join("static", "style.css")
js_file = os.path.join("static", "script.js")
data_file = os.path.join("static", "data.json")
output_file = "static_index.html"

# 1. Check if the required files exist
if not os.path.exists(html_file):
    raise FileNotFoundError(f"Error: {html_file} not found. "
                            "Ensure you are running this script from the correct directory.")

if not os.path.exists(css_file):
    raise FileNotFoundError(f"Error: {css_file} not found.")

if not os.path.exists(js_file):
    raise FileNotFoundError(f"Error: {js_file} not found.")

if not os.path.exists(data_file):
    raise FileNotFoundError(f"Error: {data_file} not found.")

# 2. Read the HTML file
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

# 3. Read the CSS file
with open(css_file, "r", encoding="utf-8") as f:
    css_content = f.read()

# 4. Read the JavaScript file
with open(js_file, "r", encoding="utf-8") as f:
    js_content = f.read()

# 5. Read the data file (sample data)
with open(data_file, "r", encoding="utf-8") as f:
    data_content = f.read()

# 6. Inline the CSS
#   Replace the Flask template reference to style.css with <style>...</style>
html_content = html_content.replace(
    '<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'style.css\') }}">',
    f"<style>\n{css_content}\n</style>"
)

# 7. Insert a script tag with inlineData (the contents of data.json)
#   We'll place this right before the inline JS in the HTML, so it's available when script.js runs.
inline_data_script = f'<script>\nvar inlineData = {data_content};\n</script>\n'

# We'll insert it just before we inline script.js. We'll search for the script reference:
search_str = '<script src="{{ url_for(\'static\', filename=\'script.js\') }}"></script>'
replace_str = inline_data_script + search_str
html_content = html_content.replace(search_str, replace_str)

# 8. Replace fetch('/data') in the JS with a promise that resolves to inlineData
#   This ensures script.js uses inlineData instead of making an HTTP call.
js_content = js_content.replace("fetch('/data')", "Promise.resolve(inlineData)")

# 9. Inline the modified JS
#   Replace the Flask template reference to script.js with <script>...</script>
html_content = html_content.replace(
    '<script src="{{ url_for(\'static\', filename=\'script.js\') }}"></script>',
    f"<script>\n{js_content}\n</script>"
)

# 10. Write out the final static HTML file
with open(output_file, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"✅ Static HTML file generated: {output_file}")
