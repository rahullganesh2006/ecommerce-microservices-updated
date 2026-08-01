from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi import BackgroundTasks

from security import get_current_user

from schemas.cart_schema import AddToCartRequest
from schemas.cart_schema import UpdateCartRequest
from schemas.cart_schema import CheckoutRequest

from services.cart_service import CartService

router = APIRouter()


@router.post(
    "/add",
    status_code=status.HTTP_201_CREATED
)
def add_to_cart(
    cart: AddToCartRequest,
    user=Depends(get_current_user)
):
    print(f"DEBUG: Entering add_to_cart for cart: {cart}")
    try:
        created = CartService.create_cart(
            cart,
            user["access_token"]
        )
    except Exception as e:
        print(f"DEBUG: Exception in CartService.create_cart: {str(e)}")
        raise e

    if created is None:

        raise HTTPException(
            status_code=409,
            detail="Cart item already exists"
        )

    return {
        "message": "Item added to cart successfully",
        "data": created
    }


@router.get("/all")
def get_all_carts(user=Depends(get_current_user)):
    # Optional: ensure user is ADMIN
    return CartService.get_all_carts()

@router.get(
    "/customer/{customer_id}"
)
def get_customer_cart(
    customer_id: str,
    user=Depends(get_current_user)
):

    return CartService.get_customer_cart(
        customer_id
    )


@router.put(
    "/update/{cart_id}"
)
def update_cart(
    cart_id: str,
    request: UpdateCartRequest,
    user=Depends(get_current_user)
):

    return CartService.update_cart(
        cart_id,
        request.quantity,
        user["access_token"]
    )


@router.delete(
    "/remove/{cart_id}"
)
def remove_cart(
    cart_id: str,
    user=Depends(get_current_user)
):

    return CartService.remove_cart(
        cart_id,
        user["access_token"]
    )


@router.post(
    "/checkout/{customer_id}"
)
def checkout(
    customer_id: str,
    request: CheckoutRequest,
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user)
):

    return CartService.checkout(
        customer_id,
        request.customer_name or user.get("claims", {}).get("name"),
        request.email_notifications,
        request.payment_method,
        request.shipping_address,
        [item.dict() for item in request.items],
        user["access_token"],
        background_tasks
    )