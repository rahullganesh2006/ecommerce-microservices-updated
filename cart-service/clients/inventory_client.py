import os
import httpx

from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

INVENTORY_SERVICE_URL = os.getenv("INVENTORY_SERVICE_URL", "http://localhost:8002")


class InventoryClient:

    @staticmethod
    def get_inventory(
        product_id: str,
        access_token: str
    ):

        url = f"{INVENTORY_SERVICE_URL}/inventory/product/{product_id}"

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
                    detail="Inventory not found"
                )

            if response.status_code == 401:
                raise HTTPException(
                    status_code=401,
                    detail="Unauthorized while calling Inventory Service"
                )

            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        except httpx.RequestError:

            raise HTTPException(
                status_code=500,
                detail="Unable to connect to Inventory Service"
            )

    @staticmethod
    def reserve_stock(inventory_id: str, quantity: int, access_token: str):
        url = f"{INVENTORY_SERVICE_URL}/inventory/{inventory_id}/reserve?quantity={quantity}"
        headers = {"Authorization": f"Bearer {access_token}"}
        try:
            response = httpx.post(url, headers=headers, timeout=30)
            if response.status_code == 200:
                return response.json()
            raise HTTPException(status_code=response.status_code, detail=response.text)
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Unable to connect to Inventory Service")

    @staticmethod
    def release_stock(inventory_id: str, quantity: int, access_token: str):
        url = f"{INVENTORY_SERVICE_URL}/inventory/{inventory_id}/release?quantity={quantity}"
        headers = {"Authorization": f"Bearer {access_token}"}
        try:
            response = httpx.post(url, headers=headers, timeout=30)
            if response.status_code == 200:
                return response.json()
            raise HTTPException(status_code=response.status_code, detail=response.text)
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Unable to connect to Inventory Service")

    @staticmethod
    def confirm_stock(inventory_id: str, quantity: int, access_token: str):
        url = f"{INVENTORY_SERVICE_URL}/inventory/{inventory_id}/confirm?quantity={quantity}"
        headers = {"Authorization": f"Bearer {access_token}"}
        try:
            response = httpx.post(url, headers=headers, timeout=30)
            if response.status_code == 200:
                return response.json()
            raise HTTPException(status_code=response.status_code, detail=response.text)
        except httpx.RequestError:
            raise HTTPException(status_code=500, detail="Unable to connect to Inventory Service")