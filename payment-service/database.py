import os
import boto3

if os.getenv("AWS_LAMBDA_FUNCTION_NAME") is None:
    from dotenv import load_dotenv
    load_dotenv(override=False)
    session = boto3.Session(profile_name="Rahull Ganesh")
    dynamodb = session.resource(
        "dynamodb",
        region_name=os.getenv("AWS_REGION")
    )
else:
    dynamodb = boto3.resource(
        "dynamodb",
        region_name=os.getenv("APP_REGION")
    )

TABLE_NAME = os.getenv("TABLE_NAME")
table = dynamodb.Table(TABLE_NAME)
