from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_home():

    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Order Service Running Successfully"
    }


def test_health():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "Healthy"
    }


def test_get_all_orders():

    response = client.get("/orders/")

    assert response.status_code == 200


def test_create_order():

    payload = {
        "order_id": "O101",
        "customer_id": "CUS101",
        "product_id": "P101",
        "quantity": 2,
        "unit_price": 50000,
        "shipping_address": "Chennai"
    }

    response = client.post(
        "/orders/",
        json=payload
    )

    assert response.status_code in [201, 409]


def test_get_order():

    response = client.get(
        "/orders/O101"
    )

    assert response.status_code in [200, 404]


def test_update_order():

    payload = {
        "quantity": 3,
        "shipping_address": "Bangalore",
        "order_status": "Shipped"
    }

    response = client.put(
        "/orders/O101",
        json=payload
    )

    assert response.status_code in [200, 404]


def test_delete_order():

    response = client.delete(
        "/orders/O101"
    )

    assert response.status_code in [200, 404]