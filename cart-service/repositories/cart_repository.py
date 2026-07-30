from decimal import Decimal

from boto3.dynamodb.conditions import Attr

from database import cart_table


class CartRepository:

    @staticmethod
    def add_to_cart(item: dict):

        existing = cart_table.get_item(
            Key={
                "cart_id": item["cart_id"]
            }
        )

        if "Item" in existing:
            return None

        dynamo_item = {}

        for key, value in item.items():

            if isinstance(value, float):
                dynamo_item[key] = Decimal(str(value))
            else:
                dynamo_item[key] = value

        cart_table.put_item(
            Item=dynamo_item
        )

        return item

    @staticmethod
    def get_cart_by_customer(customer_id: str):

        response = cart_table.scan(
            FilterExpression=Attr("customer_id").eq(customer_id)
        )

        items = response.get("Items", [])

        result = []

        for item in items:

            converted = {}

            for key, value in item.items():

                if isinstance(value, Decimal):
                    converted[key] = float(value)
                else:
                    converted[key] = value

            result.append(converted)

        return result

    @staticmethod
    def get_cart_item(cart_id: str):

        response = cart_table.get_item(
            Key={
                "cart_id": cart_id
            }
        )

        item = response.get("Item")

        if item is None:
            return None

        converted = {}

        for key, value in item.items():

            if isinstance(value, Decimal):
                converted[key] = float(value)
            else:
                converted[key] = value

        return converted

    @staticmethod
    def update_cart(cart_id: str, quantity: int):

        item = CartRepository.get_cart_item(cart_id)

        if item is None:
            return None

        item["quantity"] = quantity
        item["total_price"] = item["unit_price"] * quantity

        dynamo_item = {}

        for key, value in item.items():

            if isinstance(value, float):
                dynamo_item[key] = Decimal(str(value))
            else:
                dynamo_item[key] = value

        cart_table.put_item(
            Item=dynamo_item
        )

        return item

    @staticmethod
    def remove_cart(cart_id: str):

        item = CartRepository.get_cart_item(cart_id)

        if item is None:
            return False

        cart_table.delete_item(
            Key={
                "cart_id": cart_id
            }
        )

        return True

    @staticmethod
    def checkout(customer_id: str):

        items = CartRepository.get_cart_by_customer(customer_id)

        subtotal = 0

        for item in items:
            subtotal += item["total_price"]

        gst = subtotal * 0.18
        shipping_charge = 100 if subtotal > 0 else 0
        grand_total = subtotal + gst + shipping_charge

        return {
            "customer_id": customer_id,
            "subtotal": subtotal,
            "gst": gst,
            "shipping_charge": shipping_charge,
            "grand_total": grand_total
        }