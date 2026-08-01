from decimal import Decimal
from botocore.exceptions import ClientError

from database import table
from utils.logger import get_logger

logger = get_logger(__name__)


class OrderRepository:

    @staticmethod
    def create_order(order):

        try:

            response = table.get_item(
                Key={
                    "order_id": order.order_id
                }
            )

            if "Item" in response:
                return None

            total_amount = sum(item.quantity * item.unit_price for item in order.items)

            item = {

                "order_id": order.order_id,

                "customer_id": order.customer_id,
                
                "customer_name": order.customer_name,

                "email_notifications": order.email_notifications,

                "items": [
                    {
                        "product_id": i.product_id,
                        "product_name": i.product_name,
                        "quantity": i.quantity,
                        "unit_price": Decimal(str(i.unit_price))
                    } for i in order.items
                ],

                "total_amount": Decimal(
                    str(total_amount)
                ),

                "shipping_address":
                    order.shipping_address,

                "order_status":
                    "Placed"

            }

            table.put_item(Item=item)

            return item

        except ClientError as e:
            logger.error(f"DynamoDB ClientError: {e}")
            raise

    @staticmethod
    def get_all_orders():

        try:

            response = table.scan()

            return response.get("Items", [])

        except ClientError as e:
            logger.error(f"DynamoDB ClientError: {e}")
            raise

    @staticmethod
    def get_order_by_id(order_id):

        try:

            response = table.get_item(
                Key={
                    "order_id": order_id
                }
            )

            return response.get("Item")

        except ClientError as e:
            logger.error(f"DynamoDB ClientError: {e}")
            raise

    @staticmethod
    def update_order(order_id, order):

        try:

            response = table.get_item(
                Key={
                    "order_id": order_id
                }
            )

            if "Item" not in response:
                return None

            item = response["Item"]

            update_data = order.model_dump(
                exclude_unset=True
            )

            # Skip quantity update logic since it's now grouped
            pass

            item.update(update_data)

            table.put_item(Item=item)

            return item

        except ClientError as e:
            logger.error(f"DynamoDB ClientError: {e}")
            raise

    @staticmethod
    def delete_order(order_id):

        try:

            response = table.get_item(
                Key={
                    "order_id": order_id
                }
            )

            if "Item" not in response:
                return False

            table.delete_item(
                Key={
                    "order_id": order_id
                }
            )

            return True

        except ClientError as e:
            logger.error(f"DynamoDB ClientError: {e}")
            raise