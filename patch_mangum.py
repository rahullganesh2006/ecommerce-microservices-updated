import os
for root, dirs, files in os.walk("."):
    if "venv" in root or "node_modules" in root or "frontend-ui" in root:
        continue
    if "app.py" in files:
        path = os.path.join(root, "app.py")
        with open(path, "r") as f:
            content = f.read()
        if 'api_gateway_base_path="/"' in content:
            content = content.replace('api_gateway_base_path="/"', 'api_gateway_base_path="/v1"')
            with open(path, "w") as f:
                f.write(content)
