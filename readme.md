# 🌱 Carbon Offset Estimator & Widget

This is a **minimal full‑stack prototype** built as part of a take‑home assessment.  
It demonstrates how a Shopify store could offer customers the option to **offset the carbon footprint of their cart**.

---

## ✨ Features

✅ **Embeddable Widget (Stencil.js)**  
- Injected into a merchant’s cart page via a `<script>` tag.  
- Fetches widget configuration (placement & verbiage) from backend.  
- Displays a button for the customer to opt in to offset their order’s footprint.  
- On opt‑in, sends cart data to backend to estimate carbon offset and thanks the user.

✅ **Backend API (Python + Flask)**  
- **`/widget-config`** – returns JSON configuration for placement and button text.  
- **`/estimate-offset`** – receives cart data (e.g., product prices) and returns a simple offset calculation (`total_price * 0.02`).  
- **`/track-optin`** – tracks opt‑ins and estimated offsets in memory for later reporting.

✅ **CORS Enabled**  
- Configured via `flask-cors` to allow requests from the frontend development server.

---

## 🏗️ Tech Stack

- **Frontend:** [Stencil.js](https://stenciljs.com/) (Web Component)
- **Backend:** [Python Flask](https://flask.palletsprojects.com/)

---

## 📄 Assumptions

- Cart data is mocked in the prototype (replace with real cart payload in production).
- Opt‑ins are stored in memory for simplicity (replace with DB for production).
- Basic configuration is fetched from backend (extendable for dynamic placement or A/B tests).

---

## 🚀 Running Locally

### Frontend
```bash
npm install
npm run build
npm run start
```

### Backend
```bash
cd server
pip install flask flask-cors
python app.py
```
