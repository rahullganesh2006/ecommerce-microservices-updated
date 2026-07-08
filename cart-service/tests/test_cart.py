from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_home():

    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Cart Service Running Successfully"
    }


def test_health():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "Healthy"
    }


def test_get_all_cart():

    response = client.get("/cart/")

    assert response.status_code == 200


def test_create_cart():

    payload = {
        "cart_id": "C101",
        "customer_id": "CUS101",
        "product_id": "P101",
        "quantity": 2,
        "price": 1500
    }

    response = client.post(
        "/cart/",
        json=payload
    )

    assert response.status_code in [201, 409]


def test_get_cart():

    response = client.get(
        "/cart/C101"
    )

    assert response.status_code in [200, 404]


def test_update_cart():

    payload = {
        "quantity": 5,
        "price": 1800
    }

    response = client.put(
        "/cart/C101",
        json=payload
    )

    assert response.status_code in [200, 404]


def test_delete_cart():

    response = client.delete(
        "/cart/C101"
    )

    assert response.status_code in [200, 404]