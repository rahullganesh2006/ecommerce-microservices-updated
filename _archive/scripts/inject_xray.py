import os

services = [
    'auth-service', 'cart-service', 'inventory-service',
    'notification-service', 'order-service', 'payment-service', 'product-service'
]

for svc in services:
    req_file = f'{svc}/requirements.txt'
    with open(req_file, 'a') as f:
        f.write('\naws-xray-sdk==2.14.0\n')
    
    app_file = f'{svc}/app.py'
    with open(app_file, 'r') as f:
        content = f.read()
    
    # Check if already added
    if 'XRayMiddleware' in content:
        continue
    
    # We need to inject imports at the top
    imports = f"""from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware

patch_all()
xray_recorder.configure(service='{svc}')
"""
    
    # Find the line 'from fastapi import FastAPI' and add imports after
    new_content = content.replace("from fastapi import FastAPI", "from fastapi import FastAPI\n" + imports)
    
    # find where app is defined
    idx = new_content.find("app = FastAPI")
    if idx != -1:
        # find end of the line
        end_idx = new_content.find("\n", idx)
        if end_idx != -1:
            injection = f"\napp.add_middleware(XRayMiddleware, app_name='{svc}')\n"
            new_content = new_content[:end_idx] + injection + new_content[end_idx:]
    
    with open(app_file, 'w') as f:
        f.write(new_content)

print("X-Ray code injected successfully into all 7 microservices.")
