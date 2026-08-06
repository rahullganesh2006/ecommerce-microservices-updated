import requests
import urllib3

urllib3.disable_warnings()

API_BASE = "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1"

# 1. Login to get token
login_data = {"email": "rahull.ganesh@idp.com", "password": "securepassword"}
resp = requests.post(f"{API_BASE}/auth/login/password", json=login_data, verify=False)
if resp.status_code != 200:
    print("Auth login failed, trying root login:", resp.status_code, resp.text)
else:
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Logged in successfully.")

    # 2. Add item to cart
    cart_data = {"product_id": "P1001", "quantity": 1}
    resp = requests.post(f"{API_BASE}/cart/", json=cart_data, headers=headers, verify=False)
    print("Add to cart:", resp.status_code, resp.text)

    # 3. Checkout (this triggers CartService.checkout which calls OrderService and PaymentService)
    checkout_data = {"payment_method": "credit_card"}
    resp = requests.post(f"{API_BASE}/cart/checkout", json=checkout_data, headers=headers, verify=False)
    print("Checkout:", resp.status_code, resp.text)
