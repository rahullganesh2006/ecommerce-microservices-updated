from decimal import Decimal
from botocore.exceptions import ClientError

from database import table


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

            total_amount = order.quantity * order.unit_price

            item = {

                "order_id": order.order_id,

                "customer_id": order.customer_id,

                "product_id": order.product_id,

                "quantity": order.quantity,

                "unit_price": Decimal(
                    str(order.unit_price)
                ),

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

            raise Exception(
                e.response["Error"]["Message"]
            )

    @staticmethod
    def get_all_orders():

        try:

            response = table.scan()

            return response.get("Items", [])

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )

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

            raise Exception(
                e.response["Error"]["Message"]
            )

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

            if "quantity" in update_data:

                price = float(item["unit_price"])

                update_data["total_amount"] = Decimal(
                    str(
                        update_data["quantity"] * price
                    )
                )

            item.update(update_data)

            table.put_item(Item=item)

            return item

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )

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

            raise Exception(
                e.response["Error"]["Message"]
            )