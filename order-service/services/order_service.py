from repositories.order_repository import OrderRepository


class OrderService:

    @staticmethod
    def create_order(order):

        existing = OrderRepository.get_order_by_id(
            order.order_id
        )

        if existing:
            return None

        created_item = OrderRepository.create_order(order)
        if created_item:
            from services.sns_publisher import SNSPublisher
            from utils.logger import get_logger
            logger = get_logger(__name__)
            logger.info(f"Order created successfully: {created_item['order_id']}. Publishing event.")
            SNSPublisher.publish_order_placed(created_item)
            
        return created_item

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