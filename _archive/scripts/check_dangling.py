import os
import ast

services = [
    'auth-service', 'cart-service', 'inventory-service',
    'notification-service', 'order-service', 'payment-service', 'product-service'
]

for svc in services:
    app_file = f'{svc}/app.py'
    with open(app_file, 'r') as f:
        content = f.read()
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if line.strip().startswith(','):
            print(f"Dangling comma found in {app_file} at line {i+1}: {line}")

