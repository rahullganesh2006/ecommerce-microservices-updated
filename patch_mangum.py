import os
for root, dirs, files in os.walk("."):
    if "venv" in root or "node_modules" in root or "frontend-ui" in root or "package" in root:
        continue
    if "app.py" in files:
        path = os.path.join(root, "app.py")
        with open(path, "r") as f:
            content = f.read()
        
        # Replace Mangum(app) or Mangum(app, lifespan="off") with Mangum(app, lifespan="off", api_gateway_base_path="/v1")
        if "api_gateway_base_path" not in content:
            content = content.replace('handler = Mangum(app)', 'handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")')
            content = content.replace('handler = Mangum(app, lifespan="off")', 'handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")')
            
            with open(path, "w") as f:
                f.write(content)
            print(f"Patched {path}")
