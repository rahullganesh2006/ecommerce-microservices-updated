import requests

API_BASE = "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1"

invalid_order = {
    "order_id": "ORD-12345"
}

try:
    resp = requests.post(f"{API_BASE}/orders/", json=invalid_order, verify=False)
    print(f"Order Service status: {resp.status_code}")
    print(f"Order Service response: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
