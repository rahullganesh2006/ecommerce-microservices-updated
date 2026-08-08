import urllib.request
import urllib.error
import time
import json
import base64

header = base64.urlsafe_b64encode(json.dumps({"alg": "none", "typ": "JWT"}).encode()).decode().rstrip("=")
payload = base64.urlsafe_b64encode(json.dumps({"sub": "123"}).encode()).decode().rstrip("=")
token = f"{header}.{payload}."

body = json.dumps({"product_id": "test-1", "product_name": "Test", "description": "Test", "price": 100, "stock": 10, "category": "Test"}).encode("utf-8")

req = urllib.request.Request(
    "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/products/",
    data=body,
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as res:
        print(f"Status: {res.status}")
        print(res.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
