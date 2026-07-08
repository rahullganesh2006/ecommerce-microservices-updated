import os
import boto3

# Load .env only for local development, ignored in Lambda
if os.getenv("AWS_LAMBDA_FUNCTION_NAME") is None:
    from dotenv import load_dotenv
    load_dotenv(override=False)

TABLE_NAME = os.getenv("TABLE_NAME")
AWS_REGION = os.getenv("APP_REGION")

dynamodb = boto3.resource(
    "dynamodb",
    region_name=AWS_REGION
)

table = dynamodb.Table(TABLE_NAME)