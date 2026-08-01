from fastapi.testclient import TestClient
import pytest
from app import app
from unittest.mock import patch
from security import get_current_user

app.dependency_overrides[get_current_user] = lambda: {"access_token": "token", "claims": {}}

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200

@patch("services.cart_service.ProductClient.get_product")
@patch("services.cart_service.InventoryClient.get_inventory")
@patch("services.cart_service.InventoryClient.reserve_stock")
def test_add_to_cart(mock_reserve, mock_inv, mock_prod, dynamodb_mock):
    mock_prod.return_value = {"product_name": "Test Product", "price": 100.0}
    mock_inv.return_value = {"inventory_id": "INV1", "available_stock": 50}
    mock_reserve.return_value = True

    response = client.post("/cart/add", json={
        "customer_id": "cust1",
        "product_id": "prod1",
        "quantity": 2
    }, headers={"Authorization": "Bearer mock"})

    assert response.status_code == 201
    data = response.json()
    assert data["data"]["customer_id"] == "cust1"
    assert data["data"]["product_id"] == "prod1"
    assert data["data"]["quantity"] == 2
    assert data["data"]["total_price"] == 200.0

def test_get_customer_cart(dynamodb_mock):
    response = client.get("/cart/customer/cust1")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
