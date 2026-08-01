import boto3
import json
from decimal import Decimal
import os
from utils.logger import get_logger

logger = get_logger(__name__)

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

class SNSPublisher:
    _sns_client = None

    @classmethod
    def get_client(cls):
        if cls._sns_client is None:
            try:
                if not os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
                    session = boto3.Session(profile_name="Rahull Ganesh", region_name=os.getenv("AWS_REGION", "us-east-1"))
                    cls._sns_client = session.client("sns")
                else:
                    cls._sns_client = boto3.client("sns", region_name=os.getenv("AWS_REGION", "us-east-1"))
            except Exception as e:
                logger.warning(f"SNS Warning: Failed to initialize AWS session: {e}")
                cls._sns_client = boto3.client("sns", region_name=os.getenv("AWS_REGION", "us-east-1"))
        return cls._sns_client

    @classmethod
    def publish_user_registered(cls, user_data):
        topic_arn = os.getenv("USER_REGISTERED_TOPIC_ARN", "mock")
        
        event = {
            "event_type": "USER_REGISTERED",
            "user_id": user_data.get("id"),
            "name": user_data.get("name"),
            "email": user_data.get("email"),
            "role": user_data.get("role")
        }

        if not topic_arn or topic_arn.lower() == "mock":
            logger.info("SNS Info: USER_REGISTERED_TOPIC_ARN not set or is 'mock'. Using Local Mock Queue...")
            from services.mock_queue import publish_mock_message
            return publish_mock_message(event)

        try:
            client = cls.get_client()
            response = client.publish(
                TopicArn=topic_arn,
                Message=json.dumps(event, cls=DecimalEncoder),
                Subject="User Registered Event"
            )
            logger.info(f"SNS Info: Published user registered event to SNS. MessageId: {response.get('MessageId')}")
            return response.get("MessageId")
        except Exception as e:
            logger.error(f"SNS Error: Failed to publish message to SNS topic: {e}. Falling back to Local Mock Queue...")
            from services.mock_queue import publish_mock_message
            return publish_mock_message(event)
