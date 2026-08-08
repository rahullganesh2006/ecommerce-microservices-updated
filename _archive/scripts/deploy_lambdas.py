import os
import boto3
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

profile_name = "AWS-Academy-Developer-726101441380"
region_name = "us-east-1"  # Lambdas are located in us-east-1

session = boto3.Session(profile_name=profile_name, region_name=region_name)
lambda_client = session.client("lambda")

api_gateway_url = "https://fvv32bobrb.execute-api.ap-southeast-1.amazonaws.com/prod"
common_role = "arn:aws:iam::726101441380:role/flashmart-lambda-role-dev"

lambdas_to_deploy = [
    {
        "name": "flashmart-product-service-dev",
        "zip_path": os.path.join(BASE_DIR, "lambda_packages", "product-service.zip"),
        "env": {
            "TABLE_NAME": "rahull-products",
            "APP_REGION": "ap-southeast-1"
        }
    },
    {
        "name": "flashmart-cart-service-dev",
        "zip_path": os.path.join(BASE_DIR, "lambda_packages", "cart-service.zip"),
        "env": {
            "DYNAMODB_TABLE": "rahull-cart",
            "APP_REGION": "ap-southeast-1",
            "PRODUCT_SERVICE_URL": api_gateway_url,
            "INVENTORY_SERVICE_URL": api_gateway_url
        }
    },
    {
        "name": "flashmart-products-v1",  # Inventory Service
        "zip_path": os.path.join(BASE_DIR, "lambda_packages", "inventory-service.zip"),
        "env": {
            "TABLE_NAME": "rahull-inventory",
            "APP_REGION": "ap-southeast-1"
        }
    },
    {
        "name": "flashmart-order-service-dev",
        "zip_path": os.path.join(BASE_DIR, "lambda_packages", "order-service.zip"),
        "env": {
            "TABLE_NAME": "rahull-order",
            "APP_REGION": "ap-southeast-1",
            "PRODUCT_SERVICE_URL": api_gateway_url,
            "INVENTORY_SERVICE_URL": api_gateway_url,
            "PAYMENT_SERVICE_URL": api_gateway_url
        }
    },
    {
        "name": "flashmart-cart-v1",  # Payment Service
        "zip_path": os.path.join(BASE_DIR, "lambda_packages", "payment-service.zip"),
        "env": {
            "TABLE_NAME": "rahull-payment",
            "APP_REGION": "ap-southeast-1"
        }
    }
]

def wait_for_lambda_active(function_name):
    print(f"Waiting for function {function_name} to be active/ready...")
    for _ in range(30):
        res = lambda_client.get_function_configuration(FunctionName=function_name)
        state = res.get("State", "Active")
        last_status = res.get("LastUpdateStatus", "Successful")
        if state == "Active" and last_status != "InProgress":
            print(f"Function {function_name} is ready.")
            return True
        time.sleep(2)
    return False

for l in lambdas_to_deploy:
    name = l["name"]
    zip_path = l["zip_path"]
    env = l["env"]
    
    print("\n" + "="*50)
    print(f"Deploying {name} from {zip_path}...")
    
    # 1. Update Code
    with open(zip_path, "rb") as f:
        zip_bytes = f.read()

        
    try:
        wait_for_lambda_active(name)
        
        print(f"Uploading code to {name}...")
        lambda_client.update_function_code(
            FunctionName=name,
            ZipFile=zip_bytes
        )
        
        # 2. Update Configuration (runtime, handler, role, environment)
        wait_for_lambda_active(name)
        
        print(f"Updating configuration for {name}...")
        lambda_client.update_function_configuration(
            FunctionName=name,
            Runtime="python3.12",
            Handler="app.handler",
            Role=common_role,
            Timeout=30,
            Environment={
                "Variables": env
            }
        )
        
        wait_for_lambda_active(name)
        print(f"Successfully deployed {name}!")
        
    except Exception as e:
        print(f"Error deploying {name}: {str(e)}")

print("\n" + "="*50)
print("Deployment completed!")
