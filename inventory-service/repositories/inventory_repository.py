from decimal import Decimal
from botocore.exceptions import ClientError
from database import table


class InventoryRepository:

    @staticmethod
    def get_inventory_by_product_id(product_id):
        try:
            response = table.scan(
                FilterExpression="product_id = :pid",
                ExpressionAttributeValues={":pid": product_id}
            )
            items = response.get("Items", [])
            return items[0] if items else None
        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

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

    @staticmethod
    def reserve_stock(inventory_id, quantity):
        try:
            response = table.get_item(Key={"inventory_id": inventory_id})
            if "Item" not in response:
                return None
            item = response["Item"]
            
            # Since dynamo stores as Decimal we need to cast to int if we process them
            available = int(item.get("available_stock", 0))
            reserved = int(item.get("reserved_stock", 0))
            
            if available < quantity:
                return None
                
            item["available_stock"] = available - quantity
            item["reserved_stock"] = reserved + quantity
            
            table.put_item(Item=item)
            return item
        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def release_stock(inventory_id, quantity):
        try:
            response = table.get_item(Key={"inventory_id": inventory_id})
            if "Item" not in response:
                return None
            item = response["Item"]
            
            available = int(item.get("available_stock", 0))
            reserved = int(item.get("reserved_stock", 0))
            
            if reserved < quantity:
                return None
                
            item["available_stock"] = available + quantity
            item["reserved_stock"] = reserved - quantity
            
            table.put_item(Item=item)
            return item
        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])

    @staticmethod
    def confirm_stock(inventory_id, quantity):
        try:
            response = table.get_item(Key={"inventory_id": inventory_id})
            if "Item" not in response:
                return None
            item = response["Item"]
            
            reserved = int(item.get("reserved_stock", 0))
                
            item["reserved_stock"] = max(0, reserved - quantity)
            
            table.put_item(Item=item)
            return item
        except ClientError as e:
            raise Exception(e.response["Error"]["Message"])