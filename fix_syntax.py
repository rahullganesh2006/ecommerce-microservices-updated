import os

services = [
    'auth-service', 'cart-service', 'inventory-service',
    'notification-service', 'order-service', 'payment-service', 'product-service'
]

for svc in services:
    app_file = f'{svc}/app.py'
    with open(app_file, 'r') as f:
        content = f.read()
    
    # Remove the incorrectly placed line
    bad_line = f"app.add_middleware(XRayMiddleware, app_name='{svc}')\n"
    content = content.replace(bad_line, "")
    
    # We want to insert the middleware correctly after the FastAPI initialization.
    # The initialization usually ends with `)` followed by a newline, or `app = FastAPI(...)`
    # A safe place to put it is right before `app.add_middleware(` for CORS, or before `@app.get`
    
    if "app.add_middleware(\n    CORSMiddleware," in content:
        content = content.replace(
            "app.add_middleware(\n    CORSMiddleware,", 
            f"app.add_middleware(XRayMiddleware, app_name='{svc}')\n\napp.add_middleware(\n    CORSMiddleware,"
        )
    elif "@app.get" in content:
        content = content.replace(
            "@app.get", 
            f"app.add_middleware(XRayMiddleware, app_name='{svc}')\n\n@app.get"
        )
    
    with open(app_file, 'w') as f:
        f.write(content)

print("Syntax fixed across all services.")
