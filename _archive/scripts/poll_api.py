import requests
import time

API_BASE = "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1"

invalid_order = {
    "order_id": "ORD-12345"
}

for i in range(12):
    try:
        resp = requests.post(f"{API_BASE}/orders/", json=invalid_order, verify=False)
        if resp.status_code != 500:
            print(f"Deployment successful! Status: {resp.status_code}")
            break
        else:
            print(f"Still getting 500... Wait 20 seconds. (Attempt {i+1})")
    except Exception as e:
        print(f"Request error: {e}")
    time.sleep(20)
