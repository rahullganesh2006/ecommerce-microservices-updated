import random
from datetime import datetime


class PaymentEngine:

    @staticmethod
    def generate_transaction():

        return (
            "TXN"
            + datetime.now().strftime("%Y%m%d%H%M%S")
            + str(random.randint(1000,9999))
        )

    @staticmethod
    def cashback(amount, method):

        method = method.upper()

        if method == "UPI":
            return amount * 0.05

        elif method == "CARD":
            return amount * 0.02

        elif method == "NET_BANKING":
            return amount * 0.01

        return 0

    @staticmethod
    def fraud_score(amount, method):

        score = 0

        if amount > 50000:
            score += 60

        elif amount > 20000:
            score += 30

        method = method.upper()

        if method == "CARD":
            score += 20

        elif method == "NET_BANKING":
            score += 10

        return score

    @staticmethod
    def risk(score):

        if score >= 70:
            return "HIGH"

        elif score >= 30:
            return "MEDIUM"

        return "LOW"

    @staticmethod
    def payment_status(risk):

        if risk == "HIGH":
            return "PENDING_REVIEW"

        return "SUCCESS"

    @staticmethod
    
    def payment_time():

        return datetime.now().strftime(
            "%d-%m-%Y %H:%M:%S"
        )
# Force deploy
