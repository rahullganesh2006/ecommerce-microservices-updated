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
print("Generated token.")

# 2. Add item to cart
cart_data = {"product_id": "P1001", "quantity": 1}
resp = requests.post(f"{API_BASE}/cart/add", json=cart_data, headers=headers, verify=False)
print("Add to cart:", resp.status_code, resp.text)

# 3. Checkout (this triggers CartService.checkout which calls OrderService and PaymentService)
checkout_data = {
    "payment_method": "credit_card",
    "customer_name": "Rahull Ganesh",
    "email_notifications": True,
    "shipping_address": "123 Test St",
    "items": [
        {"product_id": "P1001", "product_name": "Test", "quantity": 1, "unit_price": 10.0, "total_price": 10.0}
    ]
}
resp = requests.post(f"{API_BASE}/cart/checkout/u_admin", json=checkout_data, headers=headers, verify=False)
print("Checkout:", resp.status_code, resp.text)
