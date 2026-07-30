import boto3
from config import config
from utils.logger import get_logger

logger = get_logger(__name__)

if not config.is_lambda:
    session = boto3.Session(
        profile_name="Rahull Ganesh"
    )

    dynamodb = session.resource(
        "dynamodb",
        region_name=config.aws_region
    )
else:
    dynamodb = boto3.resource(
        "dynamodb",
        region_name=config.aws_region
    )

table = dynamodb.Table(config.table_name)
logger.info(f"Initialized DynamoDB table: {config.table_name} in region: {config.aws_region}")
