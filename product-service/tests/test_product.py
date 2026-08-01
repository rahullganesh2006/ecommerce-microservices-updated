from fastapi.testclient import TestClient
import pytest
from app import app
from database import table
from security import get_current_user
from decimal import Decimal

app.dependency_overrides[get_current_user] = lambda: {"access_token": "token", "claims": {}}

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200

def test_create_product(dynamodb_mock):
    response = client.post("/products/", json={
        "product_id": "PROD1",
        "product_name": "Test Laptop",
        "description": "A very fast laptop",
        "category": "Electronics",
        "price": 1200.0,
        "stock": 50,
        "image_url": ""
    })
    
    assert response.status_code == 201
    
    # Verify DB
    item = table.get_item(Key={"product_id": "PROD1"})["Item"]
    assert item["product_name"] == "Test Laptop"
    assert item["price"] == 1200.0

def test_get_product(dynamodb_mock):
    table.put_item(Item={
        "product_id": "PROD2",
        "product_name": "Mouse",
        "price": Decimal("25.0"),
        "stock": 100
    })

    response = client.get("/products/PROD2")
    assert response.status_code == 200
    data = response.json()
    assert data["product_id"] == "PROD2"
    assert data["product_name"] == "Mouse"

def test_get_all_products(dynamodb_mock):
    table.put_item(Item={
        "product_id": "PROD3",
        "product_name": "Keyboard",
        "price": Decimal("45.0"),
        "stock": 100
    })

    response = client.get("/products/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
