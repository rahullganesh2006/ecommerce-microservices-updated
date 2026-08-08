import os

repo_path = r"product-service\repositories\product_repository.py"
with open(repo_path, "r") as f:
    content = f.read()

# Replace Exception with HTTPException
content = content.replace("raise Exception(e.response[\"Error\"][\"Message\"])", "from fastapi import HTTPException\n            raise HTTPException(status_code=400, detail=str(e.response[\"Error\"][\"Message\"]))")

with open(repo_path, "w") as f:
    f.write(content)
