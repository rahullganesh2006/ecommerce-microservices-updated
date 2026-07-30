import os
import boto3
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
TABLE_NAME = os.getenv("DYNAMODB_TABLE")

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

cart_table = dynamodb.Table(TABLE_NAME)