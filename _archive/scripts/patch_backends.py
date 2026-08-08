import os

SERVICES = {
    "product-service": {
        "TABLE_NAME": "rahull-products"
    },
    "inventory-service": {
        "TABLE_NAME": "rahull-inventory"
    },
    "cart-service": {
        "DYNAMODB_TABLE": "rahull-cart",
        "PRODUCT_SERVICE_URL": "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/products",
        "INVENTORY_SERVICE_URL": "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/inventory",
        "ORDER_SERVICE_URL": "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/orders",
        "PAYMENT_SERVICE_URL": "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/payments"
    },
    "order-service": {
        "TABLE_NAME": "rahull-order"
    },
    "payment-service": {
        "TABLE_NAME": "rahull-payment"
    },
    "auth-service": {},
    "notification-service": {}
}

# 1. Patch database.py
for service, vars in SERVICES.items():
    db_path = os.path.join(service, "database.py")
    if os.path.exists(db_path):
        with open(db_path, "r") as f:
            content = f.read()
        
        # Patch table name
        if "TABLE_NAME" in vars:
            content = content.replace('os.getenv("TABLE_NAME")', f'os.getenv("TABLE_NAME", "{vars["TABLE_NAME"]}")')
        if "DYNAMODB_TABLE" in vars:
            content = content.replace('os.getenv("DYNAMODB_TABLE")', f'os.getenv("DYNAMODB_TABLE", "{vars["DYNAMODB_TABLE"]}")')
            
        # Patch regions
        content = content.replace('os.getenv("APP_REGION")', 'os.getenv("APP_REGION", "us-east-1")')
        content = content.replace('os.getenv("AWS_REGION")', 'os.getenv("AWS_REGION", "us-east-1")')
        
        with open(db_path, "w") as f:
            f.write(content)
            
# 2. Patch security.py (Cognito keys)
for service in SERVICES.keys():
    sec_path = os.path.join(service, "security.py")
    if os.path.exists(sec_path):
        with open(sec_path, "r") as f:
            content = f.read()
            
        content = content.replace('os.getenv("COGNITO_REGION")', 'os.getenv("COGNITO_REGION", "ap-southeast-1")')
        content = content.replace('os.getenv("COGNITO_USER_POOL_ID")', 'os.getenv("COGNITO_USER_POOL_ID", "ap-southeast-1_Kg1vyWIZ4")')
        content = content.replace('os.getenv("COGNITO_APP_CLIENT_ID")', 'os.getenv("COGNITO_APP_CLIENT_ID", "1bhgnpkm8ke9idecj24t7se1ld")')
        
        with open(sec_path, "w") as f:
            f.write(content)

# 3. Patch inter-service URLs in cart/order etc
for service, vars in SERVICES.items():
    client_path = os.path.join(service, "clients")
    if os.path.exists(client_path):
        for root, _, files in os.walk(client_path):
            for file in files:
                if file.endswith(".py"):
                    p = os.path.join(root, file)
                    with open(p, "r") as f:
                        content = f.read()
                    
                    if "PRODUCT_SERVICE_URL" in vars:
                        content = content.replace('os.getenv("PRODUCT_SERVICE_URL")', f'os.getenv("PRODUCT_SERVICE_URL", "{vars["PRODUCT_SERVICE_URL"]}")')
                    if "INVENTORY_SERVICE_URL" in vars:
                        content = content.replace('os.getenv("INVENTORY_SERVICE_URL")', f'os.getenv("INVENTORY_SERVICE_URL", "{vars["INVENTORY_SERVICE_URL"]}")')
                    if "ORDER_SERVICE_URL" in vars:
                        content = content.replace('os.getenv("ORDER_SERVICE_URL")', f'os.getenv("ORDER_SERVICE_URL", "{vars["ORDER_SERVICE_URL"]}")')
                    if "PAYMENT_SERVICE_URL" in vars:
                        content = content.replace('os.getenv("PAYMENT_SERVICE_URL")', f'os.getenv("PAYMENT_SERVICE_URL", "{vars["PAYMENT_SERVICE_URL"]}")')

                    with open(p, "w") as f:
                        f.write(content)
