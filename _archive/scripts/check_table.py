import boto3

session = boto3.Session(profile_name="Rahull Ganesh", region_name="us-east-1")
dynamodb = session.client('dynamodb')

try:
    print(dynamodb.describe_table(TableName="rahull-orders"))
except Exception as e:
    print(f"Error checking rahull-orders: {e}")

try:
    print(dynamodb.describe_table(TableName="rahull-order"))
except Exception as e:
    print(f"Error checking rahull-order: {e}")
