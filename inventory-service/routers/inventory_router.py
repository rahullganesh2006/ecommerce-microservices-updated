from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status
from fastapi import Depends

from fastapi.security import HTTPBearer
from fastapi.security import HTTPAuthorizationCredentials

from schemas.inventory_schema import InventoryCreate, InventoryUpdate
from services.inventory_service import InventoryService

# JWT Security for Swagger
security = HTTPBearer()

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory Service"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_inventory(
    inventory: InventoryCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

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
def get_all_inventory(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    inventory = InventoryService.get_all_inventory()

    return {
        "count": len(inventory),
        "data": inventory
    }


@router.get("/product/{product_id}")
def get_inventory_by_product(
    product_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    inventory = InventoryService.get_inventory_by_product_id(product_id)
    if inventory is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory not found for this product"
        )
    return inventory


@router.get("/{inventory_id}")
def get_inventory(
    inventory_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

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
    inventory: InventoryUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
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
def delete_inventory(
    inventory_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

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


# -------------------------------
# UNIQUE FEATURE 1
# Reserve Stock
# -------------------------------

@router.post("/{inventory_id}/reserve")
def reserve_stock(
    inventory_id: str,
    quantity: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    reserved = InventoryService.reserve_stock(
        inventory_id,
        quantity
    )

    if reserved is None:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    return {
        "message": "Stock reserved successfully",
        "data": reserved
    }


# -------------------------------
# UNIQUE FEATURE 2
# Release Stock
# -------------------------------

@router.post("/{inventory_id}/release")
def release_stock(
    inventory_id: str,
    quantity: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    released = InventoryService.release_stock(
        inventory_id,
        quantity
    )

    if released is None:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found"
        )

    return {
        "message": "Reserved stock released",
        "data": released
    }

# -------------------------------
# UNIQUE FEATURE 3
# Confirm Stock
# -------------------------------

@router.post("/{inventory_id}/confirm")
def confirm_stock(
    inventory_id: str,
    quantity: int,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    confirmed = InventoryService.confirm_stock(
        inventory_id,
        quantity
    )

    if confirmed is None:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found"
        )

    return {
        "message": "Stock confirmed and permanently deducted",
        "data": confirmed
    }