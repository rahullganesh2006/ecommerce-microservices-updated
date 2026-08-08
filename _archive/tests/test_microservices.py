import requests
import jwt
import time
import urllib3
urllib3.disable_warnings()

SECRET_KEY = "super-secret-jwt-key"
ALGORITHM = "HS256"
API_BASE = "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1"

payload = {
    "sub": "u_admin",
    "email": "admin@cloudcart.io",
    "role": "ADMIN",
    "name": "Rahull Ganesh",
    "exp": time.time() + 3600
}
access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
headers = {"Authorization": f"Bearer {access_token}"}

# 1. Test Order Service
order_data = {
    "order_id": "ORD-12345",
    "customer_id": "u_admin",
    "customer_name": "Rahull Ganesh",
    "email_notifications": True,
    "items": [
        {"product_id": "P1001", "product_name": "Test", "quantity": 1, "unit_price": 10.0}
    ],
    "shipping_address": "123 Test St"
}
resp = requests.post(f"{API_BASE}/orders/", json=order_data, headers=headers, verify=False)
print("Order Service:", resp.status_code, resp.text)

# 2. Test Payment Service
payment_data = {
    "payment_id": "PAY-12345",
    "order_id": "ORD-12345",
    "customer_id": "u_admin",
    "amount": 10.0,
    "payment_method": "credit_card"
}
resp = requests.post(f"{API_BASE}/payments/", json=payment_data, headers=headers, verify=False)
print("Payment Service:", resp.status_code, resp.text)
