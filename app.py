from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    data_path = os.path.join(app.static_folder, 'data.json')
    with open(data_path) as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/save', methods=['POST'])
def save():
    data = request.get_json()
    try:
        data_path = os.path.join(app.static_folder, 'data.json')
        with open(data_path, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
