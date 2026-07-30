import uuid

from fastapi import HTTPException

from clients.product_client import ProductClient
from clients.inventory_client import InventoryClient
from repositories.cart_repository import CartRepository


class CartService:

    @staticmethod
    def create_cart(cart, access_token):

        # Fetch Product Details
        product = ProductClient.get_product(
            cart.product_id,
            access_token
        )

        # Fetch Inventory Details
        inventory = InventoryClient.get_inventory(
            cart.product_id,
            access_token
        )

        available_quantity = inventory["available_quantity"]

        if cart.quantity > available_quantity:

            raise HTTPException(
                status_code=400,
                detail="Requested quantity exceeds available stock"
            )

        unit_price = float(product["price"])

        total_price = unit_price * cart.quantity

        cart_item = {

            "cart_id": str(uuid.uuid4()),

            "customer_id": cart.customer_id,

            "product_id": cart.product_id,

            "product_name": product["product_name"],

            "quantity": cart.quantity,

            "unit_price": unit_price,

            "total_price": total_price

        }

        return CartRepository.add_to_cart(cart_item)

    @staticmethod
    def get_customer_cart(customer_id):

        items = CartRepository.get_cart_by_customer(
            customer_id
        )

        total_items = len(items)

        cart_total = sum(
            item["total_price"]
            for item in items
        )

        return {

            "customer_id": customer_id,

            "items": items,

            "total_items": total_items,

            "cart_total": cart_total

        }

    @staticmethod
    def update_cart(cart_id, quantity):

        updated = CartRepository.update_cart(
            cart_id,
            quantity
        )

        if updated is None:

            raise HTTPException(
                status_code=404,
                detail="Cart item not found"
            )

        return updated

    @staticmethod
    def remove_cart(cart_id):

        deleted = CartRepository.remove_cart(
            cart_id
        )

        if not deleted:

            raise HTTPException(
                status_code=404,
                detail="Cart item not found"
            )

        return {
            "message": "Cart item removed successfully"
        }

    @staticmethod
    def checkout(customer_id):

        return CartRepository.checkout(
            customer_id
        )