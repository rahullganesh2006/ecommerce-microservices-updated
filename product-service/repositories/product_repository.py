from botocore.exceptions import ClientError
from database import table
from decimal import Decimal

class ProductRepository:

    @staticmethod
    def create_product(product):
        try:
            # Check if product already exists
            response = table.get_item(
                Key={
                    "product_id": product.product_id
                }
            )

            if "Item" in response:
                return None

            item = {
                "product_id": product.product_id,
                "product_name": product.product_name,
                "description": product.description,
                "category": product.category,
                "price": Decimal(str(product.price)),
                "stock": product.stock,
                "image": product.image if product.image else ""
            }

            table.put_item(Item=item)

            return item

        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_all_products():
        try:
            response = table.scan()

            return response.get("Items", [])

        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def get_product_by_id(product_id):
        try:
            response = table.get_item(
                Key={
                    "product_id": product_id
                }
            )

            return response.get("Item")

        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def update_product(product_id, product):

        try:

            existing = table.get_item(
                Key={
                    "product_id": product_id
                }
            )

            if "Item" not in existing:
                return None

            item = existing["Item"]

            update_data = product.model_dump(exclude_unset=True)

            if "price" in update_data:
                update_data["price"] = Decimal(str(update_data["price"]))

            item.update(update_data)

            table.put_item(Item=item)

            return item

        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    def delete_product(product_id):

        try:

            existing = table.get_item(
                Key={
                    "product_id": product_id
                }
            )

            if "Item" not in existing:
                return False

            table.delete_item(
                Key={
                    "product_id": product_id
                }
            )

            return True

        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=400, detail=str(e))