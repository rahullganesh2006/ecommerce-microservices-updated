from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_home():

    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Product Service Running Successfully"
    }


def test_health():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "Healthy"
    }


def test_get_all_products():

    response = client.get("/products/")

    assert response.status_code == 200


def test_create_product():

    payload = {
        "product_id": "P101",
        "product_name": "Laptop",
        "description": "Dell Inspiron",
        "category": "Electronics",
        "price": 65000,
        "stock": 10
    }

    response = client.post(
        "/products/",
        json=payload
    )

    assert response.status_code in [201, 409]


def test_get_product():

    response = client.get(
        "/products/P101"
    )

    assert response.status_code in [200, 404]


def test_update_product():

    payload = {
        "price": 70000,
        "stock": 20
    }

    response = client.put(
        "/products/P101",
        json=payload
    )

    assert response.status_code in [200, 404]


def test_delete_product():

    response = client.delete(
        "/products/P101"
    )

    assert response.status_code in [200, 404]