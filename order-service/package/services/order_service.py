from repositories.order_repository import OrderRepository


class OrderService:

    @staticmethod
    def create_order(order):

        existing = OrderRepository.get_order_by_id(
            order.order_id
        )

        if existing:
            return None

        return OrderRepository.create_order(order)

    @staticmethod
    def get_all_orders():

        return OrderRepository.get_all_orders()

    @staticmethod
    def get_order_by_id(order_id):

        return OrderRepository.get_order_by_id(
            order_id
        )

    @staticmethod
    def update_order(order_id, order):

        existing = OrderRepository.get_order_by_id(
            order_id
        )

        if not existing:
            return None

        return OrderRepository.update_order(
            order_id,
            order
        )

    @staticmethod
    def delete_order(order_id):

        existing = OrderRepository.get_order_by_id(
            order_id
        )

        if not existing:
            return False

        OrderRepository.delete_order(
            order_id
        )

        return True