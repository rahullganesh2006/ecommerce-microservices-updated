import os

services = [
    'auth-service', 'cart-service', 'inventory-service',
    'notification-service', 'order-service', 'payment-service', 'product-service'
]

for svc in services:
    app_file = f'{svc}/app.py'
    with open(app_file, 'r') as f:
        content = f.read()
    
    # Remove the bad import
    bad_import = "from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware"
    content = content.replace(bad_import + "\n", "")
    content = content.replace(bad_import, "")
    
    # Remove the middleware addition
    bad_add1 = f"app.add_middleware(XRayMiddleware, app_name='{svc}')\n\n"
    bad_add2 = f"app.add_middleware(XRayMiddleware, app_name='{svc}')\n"
    bad_add3 = f"app.add_middleware(XRayMiddleware, app_name='{svc}')"
    
    content = content.replace(bad_add1, "")
    content = content.replace(bad_add2, "")
    content = content.replace(bad_add3, "")
    
    with open(app_file, 'w') as f:
        f.write(content)

print("Invalid middleware removed.")
