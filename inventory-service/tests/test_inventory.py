from fastapi.testclient import TestClient
import pytest
from app import app
from database import table

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200

def test_get_inventory(dynamodb_mock):
    # Insert dummy inventory
    table.put_item(Item={
        "inventory_id": "INV1",
        "product_id": "PROD1",
        "available_stock": 100,
        "reserved_stock": 0
    })

    response = client.get("/inventory/INV1", headers={"Authorization": "Bearer testing"})
    assert response.status_code == 200
    data = response.json()
    assert data["available_stock"] == 100

def test_reserve_stock(dynamodb_mock):
    table.put_item(Item={
        "inventory_id": "INV1",
        "product_id": "PROD1",
        "available_stock": 100,
        "reserved_stock": 0
    })

    response = client.post(
        "/inventory/INV1/reserve?quantity=10",
        headers={"Authorization": "Bearer testing"}
    )
    
    assert response.status_code == 200
    
    # Verify DB
    item = table.get_item(Key={"inventory_id": "INV1"})["Item"]
    assert item["available_stock"] == 90
    assert item["reserved_stock"] == 10

def test_release_stock(dynamodb_mock):
    table.put_item(Item={
        "inventory_id": "INV1",
        "product_id": "PROD1",
        "available_stock": 90,
        "reserved_stock": 10
    })

    response = client.post(
        "/inventory/INV1/release?quantity=10",
        headers={"Authorization": "Bearer testing"}
    )
    
    assert response.status_code == 200
    
    item = table.get_item(Key={"inventory_id": "INV1"})["Item"]
    assert item["available_stock"] == 100
    assert item["reserved_stock"] == 0
