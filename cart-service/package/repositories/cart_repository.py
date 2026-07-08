from decimal import Decimal
from botocore.exceptions import ClientError

from database import table


class CartRepository:

    @staticmethod
    def create_cart(cart):

        try:

            response = table.get_item(
                Key={
                    "cart_id": cart.cart_id
                }
            )

            if "Item" in response:
                return None

            total = cart.quantity * cart.price

            item = {

                "cart_id": cart.cart_id,

                "customer_id": cart.customer_id,

                "product_id": cart.product_id,

                "quantity": cart.quantity,

                "price": Decimal(str(cart.price)),

                "total_price": Decimal(str(total))

            }

            table.put_item(Item=item)

            return item

        except ClientError as e:

            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def get_all_cart():

        try:

            response = table.scan()

            return response.get("Items", [])

        except ClientError as e:

            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def get_cart_by_id(cart_id):

        try:

            response = table.get_item(
                Key={
                    "cart_id": cart_id
                }
            )

            return response.get("Item")

        except ClientError as e:

            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def update_cart(cart_id, cart):

        try:

            response = table.get_item(
                Key={
                    "cart_id": cart_id
                }
            )

            if "Item" not in response:
                return None

            item = response["Item"]

            update_data = cart.model_dump(exclude_unset=True)

            if "price" in update_data:
                update_data["price"] = Decimal(
                    str(update_data["price"])
                )

            if "quantity" in update_data:

                price = float(item["price"])

                quantity = update_data["quantity"]

                update_data["total_price"] = Decimal(
                    str(price * quantity)
                )

            item.update(update_data)

            table.put_item(Item=item)

            return item

        except ClientError as e:

            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def delete_cart(cart_id):

        try:

            response = table.get_item(
                Key={
                    "cart_id": cart_id
                }
            )

            if "Item" not in response:
                return False

            table.delete_item(
                Key={
                    "cart_id": cart_id
                }
            )

            return True

        except ClientError as e:

            raise Exception(e.response["Error"]["Message"])