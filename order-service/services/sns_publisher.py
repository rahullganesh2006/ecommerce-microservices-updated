import boto3
import json
from decimal import Decimal
from config import config
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
                if not config.is_lambda:
                    session = boto3.Session(profile_name="Rahull Ganesh", region_name=config.aws_region)
                    cls._sns_client = session.client("sns")
                else:
                    cls._sns_client = boto3.client("sns", region_name=config.aws_region)
            except Exception as e:
                logger.warning(f"SNS Warning: Failed to initialize AWS session: {e}")
                cls._sns_client = boto3.client("sns", region_name=config.aws_region)
        return cls._sns_client

    @classmethod
    def publish_order_placed(cls, order_item):
        topic_arn = config.order_placed_topic_arn
        
        # Helper to convert Decimals to floats for JSON serialization
        def serialize_item(item):
            d = dict(item)
            if "unit_price" in d and hasattr(d["unit_price"], "quantize"):
                d["unit_price"] = float(d["unit_price"])
            return d

        total_amount = order_item.get("total_amount")
        if hasattr(total_amount, "quantize"):
            total_amount = float(total_amount)

        event = {
            "event_type": "ORDER_PLACED",
            "order_id": order_item.get("order_id"),
            "customer_id": order_item.get("customer_id"),
            "customer_name": order_item.get("customer_name"),
            "email_notifications": order_item.get("email_notifications", True),
            "items": [serialize_item(i) for i in order_item.get("items", [])],
            "total_amount": total_amount,
            "shipping_address": order_item.get("shipping_address")
        }

        if not topic_arn or topic_arn.lower() == "mock":
            logger.info("SNS Info: ORDER_PLACED_TOPIC_ARN not set or is 'mock'. Using Local Mock Queue...")
            from services.mock_queue import publish_mock_message
            return publish_mock_message(event)

        try:
            client = cls.get_client()
            response = client.publish(
                TopicArn=topic_arn,
                Message=json.dumps(event, cls=DecimalEncoder),
                Subject="Order Placed Event"
            )
            logger.info(f"SNS Info: Published order event to SNS. MessageId: {response.get('MessageId')}")
            return response.get("MessageId")
        except Exception as e:
            logger.error(f"SNS Error: Failed to publish message to SNS topic: {e}. Falling back to Local Mock Queue...")
            from services.mock_queue import publish_mock_message
            return publish_mock_message(event)
