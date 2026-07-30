from pydantic import BaseModel
from typing import List


class AddToCartRequest(BaseModel):

    customer_id: str
    product_id: str
    quantity: int


class UpdateCartRequest(BaseModel):

    quantity: int


class CartItemResponse(BaseModel):

    cart_id: str
    customer_id: str
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    total_price: float


class CartResponse(BaseModel):

    customer_id: str
    items: List[CartItemResponse]
    total_items: int
    cart_total: float


class CheckoutResponse(BaseModel):

    customer_id: str
    subtotal: float
    gst: float
    shipping_charge: float
    grand_total: float