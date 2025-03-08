import os
import json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Fallback dataset with at least 20 rows


@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

@app.route('/data')
def data():
    """
    Return JSON data. If data.json exists in /static, load it.
    Otherwise, use the embedded FALLBACK_DATA (20+ rows).
    """
    data_path = os.path.join(app.static_folder, 'data.json')
    if os.path.exists(data_path):
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = FALLBACK_DATA
    return jsonify(data)

@app.route('/save', methods=['POST'])
def save():
    """
    Save the updated data back to data.json in /static.
    If data.json doesn't exist yet, it will be created.
    """
    data_path = os.path.join(app.static_folder, 'data.json')
    new_data = request.get_json()
    try:
        with open(data_path, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, indent=2)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
