import uuid
import time
import random

from fastapi import HTTPException

from clients.product_client import ProductClient
from clients.inventory_client import InventoryClient
from clients.order_client import OrderClient
from clients.payment_client import PaymentClient
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

        available_quantity = inventory["available_stock"]

        if cart.quantity > available_quantity:

            raise HTTPException(
                status_code=400,
                detail="Requested quantity exceeds available stock"
            )
            
        # Reserve stock
        InventoryClient.reserve_stock(inventory["inventory_id"], cart.quantity, access_token)

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
    def get_all_carts():
        return CartRepository.get_all_carts()

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
    def update_cart(cart_id, quantity, access_token):
    
        item = CartRepository.get_cart_item(cart_id)
        if item is None:
            raise HTTPException(status_code=404, detail="Cart item not found")

        old_quantity = item["quantity"]
        diff = quantity - old_quantity

        if diff > 0:
            try:
                inventory = InventoryClient.get_inventory(item["product_id"], access_token)
                if diff > inventory["available_stock"]:
                    raise HTTPException(status_code=400, detail="Requested quantity exceeds available stock")
                InventoryClient.reserve_stock(inventory["inventory_id"], diff, access_token)
            except HTTPException as e:
                raise e
            except Exception as e:
                print(f"Warning: Failed to reserve stock for {item['product_id']}: {e}")
        elif diff < 0:
            try:
                inventory = InventoryClient.get_inventory(item["product_id"], access_token)
                InventoryClient.release_stock(inventory["inventory_id"], abs(diff), access_token)
            except Exception as e:
                print(f"Warning: Failed to release stock for {item['product_id']}: {e}")

        updated = CartRepository.update_cart(
            cart_id,
            quantity
        )

        if updated is None:
            raise HTTPException(status_code=404, detail="Cart item not found")

        return updated

    @staticmethod
    def remove_cart(cart_id, access_token):
    
        item = CartRepository.get_cart_item(cart_id)
        if item:
            try:
                inventory = InventoryClient.get_inventory(item["product_id"], access_token)
                InventoryClient.release_stock(inventory["inventory_id"], item["quantity"], access_token)
            except Exception as e:
                print(f"Warning: Failed to release stock when removing cart item {cart_id}: {e}")

        deleted = CartRepository.remove_cart(
            cart_id
        )

        if not deleted:
            raise HTTPException(status_code=404, detail="Cart item not found")

        return {
            "message": "Cart item removed successfully"
        }

    @staticmethod
    def _process_checkout_cleanup(items, access_token):
        for item in items:
            try:
                inventory = InventoryClient.get_inventory(item["product_id"], access_token)
                InventoryClient.confirm_stock(inventory["inventory_id"], item["quantity"], access_token)
                
                prod = ProductClient.get_product(item["product_id"], access_token)
                new_stock = max(0, prod["stock"] - item["quantity"])
                ProductClient.update_product(item["product_id"], {"stock": new_stock}, access_token)
            except Exception as e:
                print(f"Failed to sync master product catalog for {item['product_id']}: {e}")
                
            if item.get("cart_id"):
                CartRepository.remove_cart(item["cart_id"])

    @staticmethod
    def checkout(customer_id, payment_method, shipping_address, items, access_token, background_tasks):

        if not items:
            raise HTTPException(status_code=400, detail="Cart is empty")

        transaction_time = int(time.time() * 1000)
        rand_str = ''.join(random.choices("abcdefghijklmnopqrstuvwxyz0123456789", k=4))

        order_id = f"ORD-{transaction_time}-{rand_str}"
        payment_id = f"PAY-{transaction_time}-{rand_str}"
        
        # 1. Create a single Order with all items
        order_items = []
        cart_total = 0
        for item in items:
            order_items.append({
                "product_id": item["product_id"],
                "product_name": item["product_name"],
                "quantity": item["quantity"],
                "unit_price": item["unit_price"]
            })
            cart_total += item["total_price"]
            
        order_data = {
            "order_id": order_id,
            "customer_id": customer_id,
            "items": order_items,
            "shipping_address": shipping_address
        }
        OrderClient.create_order(order_data, access_token)
        
        # 2. Create a single Payment
        payment_data = {
            "payment_id": payment_id,
            "order_id": order_id,
            "customer_id": customer_id,
            "amount": cart_total,
            "payment_method": payment_method
        }
        PaymentClient.create_payment(payment_data, access_token)
        
        # 3. Process inventory and cleanup asynchronously
        background_tasks.add_task(CartService._process_checkout_cleanup, items, access_token)

        return {
            "message": "Checkout successful, items purchased.",
            "customer_id": customer_id
        }