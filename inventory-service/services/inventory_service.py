from repositories.inventory_repository import InventoryRepository


class InventoryService:

    @staticmethod
    def get_inventory_by_product_id(product_id):
        return InventoryRepository.get_inventory_by_product_id(product_id)

    @staticmethod
    def create_inventory(inventory):

        existing = InventoryRepository.get_inventory_by_id(
            inventory.inventory_id
        )

        if existing:
            return None

        return InventoryRepository.create_inventory(inventory)

    @staticmethod
    def get_all_inventory():

        return InventoryRepository.get_all_inventory()

    @staticmethod
    def get_inventory_by_id(inventory_id):

        return InventoryRepository.get_inventory_by_id(
            inventory_id
        )

    @staticmethod
    def update_inventory(inventory_id, inventory):

        existing = InventoryRepository.get_inventory_by_id(
            inventory_id
        )

        if not existing:
            return None

        return InventoryRepository.update_inventory(
            inventory_id,
            inventory
        )

    @staticmethod
    def delete_inventory(inventory_id):

        existing = InventoryRepository.get_inventory_by_id(
            inventory_id
        )

        if not existing:
            return False

        InventoryRepository.delete_inventory(
            inventory_id
        )

        return True

    @staticmethod
    def reserve_stock(inventory_id, quantity):
        return InventoryRepository.reserve_stock(inventory_id, quantity)
        
    @staticmethod
    def release_stock(inventory_id, quantity):
        return InventoryRepository.release_stock(inventory_id, quantity)

    @staticmethod
    def confirm_stock(inventory_id, quantity):
        return InventoryRepository.confirm_stock(inventory_id, quantity)