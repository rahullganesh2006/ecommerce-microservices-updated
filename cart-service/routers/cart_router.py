from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from schemas.cart_schema import CartCreate
from schemas.cart_schema import CartUpdate
from services.cart_service import CartService

router = APIRouter(
    prefix="/cart",
    tags=["Cart Service"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_cart(cart: CartCreate):

    created = CartService.create_cart(cart)

    if created is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cart already exists"
        )

    return {
        "message": "Cart created successfully",
        "data": created
    }


@router.get("/")
def get_all_cart():

    carts = CartService.get_all_cart()

    return {
        "count": len(carts),
        "data": carts
    }


@router.get("/{cart_id}")
def get_cart(cart_id: str):

    cart = CartService.get_cart_by_id(cart_id)

    if cart is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )

    return cart


@router.put("/{cart_id}")
def update_cart(
    cart_id: str,
    cart: CartUpdate
):

    updated = CartService.update_cart(
        cart_id,
        cart
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )

    return {
        "message": "Cart updated successfully",
        "data": updated
    }


@router.delete("/{cart_id}")
def delete_cart(cart_id: str):

    deleted = CartService.delete_cart(
        cart_id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found"
        )

    return {
        "message": "Cart deleted successfully"
    }