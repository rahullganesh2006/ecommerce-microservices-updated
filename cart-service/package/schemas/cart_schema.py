from pydantic import BaseModel, Field
from typing import Optional


class CartCreate(BaseModel):

    cart_id: str = Field(..., example="C101")

    customer_id: str = Field(..., example="CUS101")

    product_id: str = Field(..., example="P101")

    quantity: int = Field(..., ge=1)

    price: float = Field(..., gt=0)


class CartUpdate(BaseModel):

    quantity: Optional[int] = Field(default=None, ge=1)

    price: Optional[float] = Field(default=None, gt=0)


class CartResponse(BaseModel):

    cart_id: str

    customer_id: str

    product_id: str

    quantity: int

    price: float

    total_price: float