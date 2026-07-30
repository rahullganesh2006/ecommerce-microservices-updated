import os
import httpx

from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8000")


class ProductClient:

    @staticmethod
    def get_product(
        product_id: str,
        access_token: str
    ):

        url = f"{PRODUCT_SERVICE_URL}/products/{product_id}"

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        try:

            response = httpx.get(
                url,
                headers=headers,
                timeout=30
            )

            if response.status_code == 200:
                return response.json()

            if response.status_code == 404:
                raise HTTPException(
                    status_code=404,
                    detail="Product not found"
                )

            if response.status_code == 401:
                raise HTTPException(
                    status_code=401,
                    detail="Unauthorized while calling Product Service"
                )

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        except httpx.RequestError:

            raise HTTPException(
                status_code=500,
                detail="Unable to connect to Product Service"
            )

    @staticmethod
    def update_product(
        product_id: str,
        update_data: dict,
        access_token: str
    ):
        url = f"{PRODUCT_SERVICE_URL}/products/{product_id}"
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        try:
            response = httpx.put(
                url,
                json=update_data,
                headers=headers,
                timeout=30
            )
            if response.status_code == 200:
                return response.json()
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Product not found")
            if response.status_code == 401:
                raise HTTPException(status_code=401, detail="Unauthorized while calling Product Service")
            
            raise HTTPException(status_code=response.status_code, detail=response.text)
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Unable to connect to Product Service")