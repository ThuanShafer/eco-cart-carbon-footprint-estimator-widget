import json

from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

opt_ins_data = []

WIDGET_CONFIG = json.load(open('configs/eco_cart_test-3.0.i18n.en_us.json'))

CARBON_OFFSET_FACTOR = 0.02

@app.route('/api/widget-config', methods=['GET'])
def get_widget_config():
    """
    Endpoint to return the widget configuration.
    """
    print("Received request for widget config.")
    return jsonify(WIDGET_CONFIG)

@app.route('/api/estimate-offset', methods=['POST'])
def estimate_offset():
    """
    Endpoint to receive cart data and return an estimated offset.
    Cart data example: {"subtotal": 303.40, "products": [...], "categories": [...], "weights": [...]}
    For this prototype, we only use 'subtotal'.
    """
    data = request.get_json()
    if not data or 'subtotal' not in data:
        print("Invalid request for estimate-offset: missing 'subtotal'")
        return jsonify({"error": "Missing 'subtotal' in request data"}), 400

    try:
        subtotal = float(data['subtotal'])
        estimated_offset = round(subtotal * CARBON_OFFSET_FACTOR, 2)
        print(f"Estimated offset for subtotal {subtotal}: {estimated_offset}")
        return jsonify({"estimated_offset": estimated_offset})
    except ValueError:
        print("Invalid 'subtotal' value received.")
        return jsonify({"error": "Invalid 'subtotal' value"}), 400

@app.route('/api/track-opt-in', methods=['POST'])
def track_opt_in():
    """
    Endpoint to track customer opt-ins and estimated offsets.
    Request data example: {"customer_id": "cust123", "cart_id": "cart456", "estimated_offset": 18.43}
    """
    data = request.get_json()
    if not data or 'estimated_offset' not in data:
        print("Invalid request for track-opt-in: missing 'estimated_offset'")
        return jsonify({"error": "Missing 'estimated_offset' in request data"}), 400

    opt_in_record = {
        "opt_in_id": str(uuid.uuid4()),
        "merchant_id": "shopify-store-123",
        "customer_id": data.get("customer_id", "anonymous-customer-" + str(uuid.uuid4())),
        "estimated_offset_amount": data['estimated_offset'],
        "timestamp": datetime.now().isoformat()
    }
    opt_ins_data.append(opt_in_record)
    print(f"Opt-in tracked: {opt_in_record}")
    return jsonify({"message": "Opt-in tracked successfully", "opt_in_id": opt_in_record["opt_in_id"]}), 200

@app.route('/api/opt-ins-report', methods=['GET'])
def get_opt_ins_report():
    """
    Endpoint to view the tracked opt-ins. This report supports monthly invoicing.
    In a real app, this would be an authenticated admin endpoint,
    potentially with filters for merchant_id and date range.
    """
    print("Returning opt-ins report.")

    monthly_invoice_data = {}
    for record in opt_ins_data:
        month_year = datetime.fromisoformat(record["timestamp"]).strftime("%Y-%m")
        merchant = record["merchant_id"]
        if merchant not in monthly_invoice_data:
            monthly_invoice_data[merchant] = {}
        if month_year not in monthly_invoice_data[merchant]:
            monthly_invoice_data[merchant][month_year] = {
                "total_offset_amount": 0.0,
                "opt_in_count": 0,
                "details": []
            }
        monthly_invoice_data[merchant][month_year]["total_offset_amount"] += record["estimated_offset_amount"]
        monthly_invoice_data[merchant][month_year]["opt_in_count"] += 1
        monthly_invoice_data[merchant][month_year]["details"].append(record)

    return jsonify(monthly_invoice_data)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
