from repositories.cart_repository import CartRepository


class CartService:

    @staticmethod
    def create_cart(cart):

        existing = CartRepository.get_cart_by_id(
            cart.cart_id
        )

        if existing:
            return None

        return CartRepository.create_cart(cart)

    @staticmethod
    def get_all_cart():

        return CartRepository.get_all_cart()

    @staticmethod
    def get_cart_by_id(cart_id):

        return CartRepository.get_cart_by_id(
            cart_id
        )

    @staticmethod
    def update_cart(cart_id, cart):

        existing = CartRepository.get_cart_by_id(
            cart_id
        )

        if not existing:
            return None

        return CartRepository.update_cart(
            cart_id,
            cart
        )

    @staticmethod
    def delete_cart(cart_id):

        existing = CartRepository.get_cart_by_id(
            cart_id
        )

        if not existing:
            return False

        CartRepository.delete_cart(cart_id)

        return True