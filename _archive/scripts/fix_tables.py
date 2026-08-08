import os

services = ["auth-service", "cart-service", "inventory-service", "notification-service", "order-service", "payment-service", "product-service"]

for service in services:
    if service == "auth-service" or service == "notification-service":
        continue
        
    table_name = f"rahull-{service.split('-')[0]}"
    if service == "product-service":
        table_name = "rahull-products" # because it is plural
    if service == "order-service":
        table_name = "rahull-orders"
    if service == "payment-service":
        table_name = "rahull-payments"

    # Search for config.py or database.py
    for file in ["config.py", "database.py"]:
        path = os.path.join(service, file)
        if os.path.exists(path):
            with open(path, "r") as f:
                content = f.read()
            
            # replace "os.getenv("TABLE_NAME", "orders")" with "os.getenv("TABLE_NAME", "rahull-orders")"
            if "os.getenv(\"TABLE_NAME\"," in content or "os.getenv('TABLE_NAME'," in content:
                # regex replace
                import re
                content = re.sub(r'os\.getenv\([\'"]TABLE_NAME[\'"],\s*[\'"][^\'"]+[\'"]\)', f'os.getenv("TABLE_NAME", "{table_name}")', content)
                with open(path, "w") as f:
                    f.write(content)
                print(f"Updated {path} to use {table_name}")
