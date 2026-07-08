from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_home():

    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Inventory Service Running Successfully"
    }


def test_health():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "Healthy"
    }


def test_get_all_inventory():

    response = client.get("/inventory/")

    assert response.status_code == 200


def test_create_inventory():

    payload = {
        "inventory_id": "I101",
        "product_id": "P101",
        "available_stock": 100,
        "reserved_stock": 10,
        "warehouse_location": "Chennai"
    }

    response = client.post(
        "/inventory/",
        json=payload
    )

    assert response.status_code in [201, 409]


def test_get_inventory():

    response = client.get(
        "/inventory/I101"
    )

    assert response.status_code in [200, 404]


def test_update_inventory():

    payload = {
        "available_stock": 120,
        "reserved_stock": 15,
        "warehouse_location": "Bangalore"
    }

    response = client.put(
        "/inventory/I101",
        json=payload
    )

    assert response.status_code in [200, 404]


def test_delete_inventory():

    response = client.delete(
        "/inventory/I101"
    )

    assert response.status_code in [200, 404]