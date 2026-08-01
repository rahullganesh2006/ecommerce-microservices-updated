import os
import boto3

if os.getenv("AWS_LAMBDA_FUNCTION_NAME") is None:
    from dotenv import load_dotenv
    load_dotenv()

TABLE_NAME = os.getenv("TABLE_NAME", "rahull-inventory")
AWS_REGION = os.getenv("APP_REGION", "us-east-1")

if os.getenv("AWS_LAMBDA_FUNCTION_NAME") is None:
    session = boto3.Session(
        profile_name="Rahull Ganesh"
    )

    dynamodb = session.resource(
        "dynamodb",
        region_name=AWS_REGION
    )
else:
    dynamodb = boto3.resource(
        "dynamodb",
        region_name=AWS_REGION
    )

table = dynamodb.Table(TABLE_NAME)