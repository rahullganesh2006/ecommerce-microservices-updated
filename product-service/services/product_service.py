from repositories.product_repository import ProductRepository


class ProductService:

    @staticmethod
    def create_product(product):

        existing_product = ProductRepository.get_product_by_id(
            product.product_id
        )

        if existing_product:
            return None

        return ProductRepository.create_product(product)

    @staticmethod
    def get_all_products():

        return ProductRepository.get_all_products()

    @staticmethod
    def get_product_by_id(product_id):

        return ProductRepository.get_product_by_id(product_id)

    @staticmethod
    def update_product(product_id, product):

        existing_product = ProductRepository.get_product_by_id(
            product_id
        )

        if not existing_product:
            return None

        return ProductRepository.update_product(
            product_id,
            product
        )

    @staticmethod
    def delete_product(product_id):

        existing_product = ProductRepository.get_product_by_id(
            product_id
        )

        if not existing_product:
            return False

        ProductRepository.delete_product(product_id)

        return True