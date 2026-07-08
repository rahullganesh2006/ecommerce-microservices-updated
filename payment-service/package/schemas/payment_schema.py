from pydantic import BaseModel, Field
from typing import Optional


class PaymentCreate(BaseModel):

    payment_id: str

    order_id: str

    customer_id: str

    amount: float = Field(..., gt=0)

    payment_method: str = Field(
        ...,
        examples=["UPI", "CARD", "NET_BANKING"]
    )


class PaymentUpdate(BaseModel):

    payment_method: Optional[str] = None

    payment_status: Optional[str] = None


class PaymentResponse(BaseModel):

    payment_id: str

    order_id: str

    customer_id: str

    amount: float

    payment_method: str

    cashback: float

    final_amount: float

    fraud_score: int

    risk_level: str

    payment_status: str

    transaction_id: str

    payment_time: str