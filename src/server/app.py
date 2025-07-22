# app.py
from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)
optins = []

@app.route('/widget-config')
def widget_config():
    return jsonify({
        "placement": "#cart_container",
        "verbiage": "Reduce my order's carbon footprint"
    })

@app.route('/estimate-offset', methods=['POST'])
def estimate_offset():
    data = request.get_json()
    items = data.get('items', [])
    total_price = sum([i.get('price', 0) for i in items])
    offset = total_price * 0.02  # simple formula
    return jsonify({"offset": offset})

@app.route('/track-optin', methods=['POST'])
def track_optin():
    data = request.get_json()
    offset = data.get('offset', 0)
    optins.append({"offset": offset, "timestamp": datetime.utcnow().isoformat()})
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)
