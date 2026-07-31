from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from schemas.order_schema import OrderCreate
from schemas.order_schema import OrderUpdate
from services.order_service import OrderService

router = APIRouter(
    prefix="/orders",
    tags=["Order Service"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_order(order: OrderCreate):

    created = OrderService.create_order(order)

    if created is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Order already exists"
        )

    return {
        "message": "Order created successfully",
        "data": created
    }


@router.get("/")
def get_all_orders():

    orders = OrderService.get_all_orders()

    return {
        "count": len(orders),
        "data": orders
    }


@router.get("/{order_id}")
def get_order(order_id: str):

    order = OrderService.get_order_by_id(order_id)

    if order is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return order


@router.put("/{order_id}")
def update_order(
    order_id: str,
    order: OrderUpdate
):

    try:
        updated = OrderService.update_order(
            order_id,
            order
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return {
        "message": "Order updated successfully",
        "data": updated
    }


@router.delete("/{order_id}")
def delete_order(order_id: str):

    deleted = OrderService.delete_order(
        order_id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    return {
        "message": "Order deleted successfully"
    }