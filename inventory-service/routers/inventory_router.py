from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from schemas.inventory_schema import InventoryCreate
from schemas.inventory_schema import InventoryUpdate
from services.inventory_service import InventoryService

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory Service"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_inventory(inventory: InventoryCreate):

    created_inventory = InventoryService.create_inventory(inventory)

    if created_inventory is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Inventory already exists"
        )

    return {
        "message": "Inventory created successfully",
        "data": created_inventory
    }


@router.get("/")
def get_all_inventory():

    inventory = InventoryService.get_all_inventory()

    return {
        "count": len(inventory),
        "data": inventory
    }


@router.get("/{inventory_id}")
def get_inventory(inventory_id: str):

    inventory = InventoryService.get_inventory_by_id(inventory_id)

    if inventory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found"
        )

    return inventory


@router.put("/{inventory_id}")
def update_inventory(
    inventory_id: str,
    inventory: InventoryUpdate
):

    updated_inventory = InventoryService.update_inventory(
        inventory_id,
        inventory
    )

    if updated_inventory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found"
        )

    return {
        "message": "Inventory updated successfully",
        "data": updated_inventory
    }


@router.delete("/{inventory_id}")
def delete_inventory(inventory_id: str):

    deleted = InventoryService.delete_inventory(
        inventory_id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found"
        )

    return {
        "message": "Inventory deleted successfully"
    }