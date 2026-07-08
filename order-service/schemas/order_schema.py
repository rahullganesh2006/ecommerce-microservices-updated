from pydantic import BaseModel, Field
from typing import Optional


class OrderCreate(BaseModel):

    order_id: str = Field(..., example="O101")

    customer_id: str = Field(..., example="CUS101")

    product_id: str = Field(..., example="P101")

    quantity: int = Field(..., ge=1)

    unit_price: float = Field(..., gt=0)

    shipping_address: str = Field(
        ...,
        example="Chennai"
    )


class OrderUpdate(BaseModel):

    quantity: Optional[int] = Field(
        default=None,
        ge=1
    )

    shipping_address: Optional[str] = None

    order_status: Optional[str] = None


class OrderResponse(BaseModel):

    order_id: str

    customer_id: str

    product_id: str

    quantity: int

    unit_price: float

    total_amount: float

    shipping_address: str

    order_status: str