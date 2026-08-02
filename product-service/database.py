import os
import boto3

# Load .env only for local development
if os.getenv("AWS_LAMBDA_FUNCTION_NAME") is None:
    from dotenv import load_dotenv
    load_dotenv(override=False)

TABLE_NAME = os.getenv("TABLE_NAME", "rahull-products")
AWS_REGION = os.getenv("APP_REGION", "ap-southeast-1")

# Local development
if os.getenv("AWS_LAMBDA_FUNCTION_NAME") is None:

    session = boto3.Session(
        profile_name="Rahull Ganesh"
    )

    dynamodb = session.resource(
        "dynamodb",
        region_name=AWS_REGION
    )

# AWS Lambda
else:

    dynamodb = boto3.resource(
        "dynamodb",
        region_name=AWS_REGION
    )

table = dynamodb.Table(TABLE_NAME)