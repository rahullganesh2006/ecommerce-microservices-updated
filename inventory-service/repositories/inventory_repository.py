from decimal import Decimal
from botocore.exceptions import ClientError
from database import table


class InventoryRepository:

    @staticmethod
    def create_inventory(inventory):
        try:

            response = table.get_item(
                Key={
                    "inventory_id": inventory.inventory_id
                }
            )

            if "Item" in response:
                return None

            item = {
                "inventory_id": inventory.inventory_id,
                "product_id": inventory.product_id,
                "available_stock": inventory.available_stock,
                "reserved_stock": inventory.reserved_stock,
                "warehouse_location": inventory.warehouse_location
            }

            table.put_item(Item=item)

            return item

        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def get_all_inventory():

        try:

            response = table.scan()

            return response.get("Items", [])

        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def get_inventory_by_id(inventory_id):

        try:

            response = table.get_item(
                Key={
                    "inventory_id": inventory_id
                }
            )

            return response.get("Item")

        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def update_inventory(inventory_id, inventory):

        try:

            response = table.get_item(
                Key={
                    "inventory_id": inventory_id
                }
            )

            if "Item" not in response:
                return None

            item = response["Item"]

            update_data = inventory.model_dump(exclude_unset=True)

            item.update(update_data)

            table.put_item(Item=item)

            return item

        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def delete_inventory(inventory_id):

        try:

            response = table.get_item(
                Key={
                    "inventory_id": inventory_id
                }
            )

            if "Item" not in response:
                return False

            table.delete_item(
                Key={
                    "inventory_id": inventory_id
                }
            )

            return True

        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])