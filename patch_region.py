import os
for root, dirs, files in os.walk("."):
    if "venv" in root or "node_modules" in root or "frontend-ui" in root:
        continue
    if "database.py" in files:
        path = os.path.join(root, "database.py")
        with open(path, "r") as f:
            content = f.read()
        
        # Change us-east-1 to ap-southeast-1
        content = content.replace('os.getenv("APP_REGION", "us-east-1")', 'os.getenv("APP_REGION", "ap-southeast-1")')
        content = content.replace('os.getenv("AWS_REGION", "us-east-1")', 'os.getenv("AWS_REGION", "ap-southeast-1")')
        
        with open(path, "w") as f:
            f.write(content)
