import os
import json
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

@app.route('/data')
def data():
    """
    Return JSON data from static/data.json if it exists.
    Otherwise, return 404 so the client uses fallback data.
    """
    data_path = os.path.join(app.static_folder, 'data.json')
    if os.path.exists(data_path):
        with open(data_path, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    else:
        return jsonify({"error": "No data.json found"}), 404

@app.route('/save', methods=['POST'])
def save():
    """
    If you want to save changes back to data.json, implement here.
    Otherwise, you can omit this route or leave as is.
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
