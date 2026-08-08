import os
import py_compile

services = [
    'auth-service', 'cart-service', 'inventory-service',
    'notification-service', 'order-service', 'payment-service', 'product-service'
]

for svc in services:
    app_file = f'{svc}/app.py'
    try:
        py_compile.compile(app_file, doraise=True)
        print(f"{svc}/app.py: Syntax OK")
    except Exception as e:
        print(f"Syntax Error in {svc}/app.py: {e}")
