from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import status

from schemas.payment_schema import (
    PaymentCreate,
    PaymentUpdate
)
from repositories.payment_repository import PaymentRepository

router = APIRouter(
    prefix="/payments",
    tags=["Payment Service"]
)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED
)
def create_payment(payment: PaymentCreate):

    created = PaymentRepository.create_payment(
        payment
    )

    if created is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment already exists"
        )

    return {
        "message": "Payment processed successfully",
        "data": created
    }


@router.get("/")
def get_all_payments():

    payments = PaymentRepository.get_all_payments()

    return {
        "count": len(payments),
        "data": payments
    }


@router.get("/{payment_id}")
def get_payment(payment_id: str):

    payment = PaymentRepository.get_payment_by_id(
        payment_id
    )

    if payment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    return payment


@router.put("/{payment_id}")
def update_payment(
    payment_id: str,
    payment: PaymentUpdate
):

    updated = PaymentRepository.update_payment(
        payment_id,
        payment
    )

    if updated is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    return {
        "message": "Payment updated successfully",
        "data": updated
    }


@router.delete("/{payment_id}")
def delete_payment(payment_id: str):

    deleted = PaymentRepository.delete_payment(
        payment_id
    )

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )

    return {
        "message": "Payment deleted successfully"
    }