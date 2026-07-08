from decimal import Decimal

from botocore.exceptions import ClientError

from database import table
from services.payment_service import PaymentEngine


class PaymentRepository:

    @staticmethod
    def create_payment(payment):

        try:

            response = table.get_item(
                Key={
                    "payment_id": payment.payment_id
                }
            )

            if "Item" in response:
                return None

            cashback = PaymentEngine.cashback(
                payment.amount,
                payment.payment_method
            )

            final_amount = payment.amount - cashback

            fraud_score = PaymentEngine.fraud_score(
                payment.amount,
                payment.payment_method
            )

            risk_level = PaymentEngine.risk(
                fraud_score
            )

            payment_status = PaymentEngine.payment_status(
                risk_level
            )

            transaction_id = PaymentEngine.generate_transaction()

            payment_time = PaymentEngine.payment_time()

            item = {

                "payment_id": payment.payment_id,

                "order_id": payment.order_id,

                "customer_id": payment.customer_id,

                "amount": Decimal(
                    str(payment.amount)
                ),

                "payment_method": payment.payment_method,

                "cashback": Decimal(
                    str(round(cashback, 2))
                ),

                "final_amount": Decimal(
                    str(round(final_amount, 2))
                ),

                "fraud_score": fraud_score,

                "risk_level": risk_level,

                "payment_status": payment_status,

                "transaction_id": transaction_id,

                "payment_time": payment_time

            }

            table.put_item(Item=item)

            return item

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )

    @staticmethod
    def get_all_payments():

        try:

            response = table.scan()

            return response.get("Items", [])

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )

    @staticmethod
    def get_payment_by_id(payment_id):

        try:

            response = table.get_item(
                Key={
                    "payment_id": payment_id
                }
            )

            return response.get("Item")

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )

    @staticmethod
    def update_payment(payment_id, payment):

        try:

            response = table.get_item(
                Key={
                    "payment_id": payment_id
                }
            )

            if "Item" not in response:
                return None

            item = response["Item"]

            update_data = payment.model_dump(
                exclude_unset=True
            )

            item.update(update_data)

            table.put_item(Item=item)

            return item

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )

    @staticmethod
    def delete_payment(payment_id):

        try:

            response = table.get_item(
                Key={
                    "payment_id": payment_id
                }
            )

            if "Item" not in response:
                return False

            table.delete_item(
                Key={
                    "payment_id": payment_id
                }
            )

            return True

        except ClientError as e:

            raise Exception(
                e.response["Error"]["Message"]
            )