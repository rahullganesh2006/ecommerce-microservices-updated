from pydantic import BaseModel, Field
from typing import Optional, List


class OrderItem(BaseModel):
    product_id: str
    product_name: str
    quantity: int = Field(..., ge=1)
    unit_price: float = Field(..., gt=0)


class OrderCreate(BaseModel):

    order_id: str = Field(..., example="O101")

    customer_id: str = Field(..., example="CUS101")

    items: List[OrderItem]

    shipping_address: str = Field(
        ...,
        example="Chennai"
    )


class OrderUpdate(BaseModel):

    shipping_address: Optional[str] = None

    order_status: Optional[str] = None


class OrderResponse(BaseModel):

    order_id: str

    customer_id: str

    items: List[OrderItem]

    total_amount: float

    shipping_address: str

    order_status: str