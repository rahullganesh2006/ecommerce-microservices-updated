import os
import httpx

from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

ORDER_SERVICE_URL = os.getenv("ORDER_SERVICE_URL", "http://localhost:8003")


class OrderClient:

    @staticmethod
    def create_order(
        order_data: dict,
        access_token: str
    ):

        url = f"{ORDER_SERVICE_URL}/orders/"

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        try:

            response = httpx.post(
                url,
                json=order_data,
                headers=headers,
                timeout=30
            )

            if response.status_code == 200 or response.status_code == 201:
                return response.json()

            if response.status_code == 401:
                raise HTTPException(
                    status_code=401,
                    detail="Unauthorized while calling Order Service"
                )

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        except httpx.RequestError:

            raise HTTPException(
                status_code=500,
                detail="Unable to connect to Order Service"
            )
