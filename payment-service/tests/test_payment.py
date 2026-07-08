from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_home():

    response = client.get("/")

    assert response.status_code == 200

    assert response.json() == {
        "message": "Payment Service Running Successfully"
    }


def test_health():

    response = client.get("/health")

    assert response.status_code == 200

    assert response.json() == {
        "status": "Healthy"
    }


def test_get_all_payments():

    response = client.get("/payments/")

    assert response.status_code == 200


def test_create_payment():

    payload = {

        "payment_id": "PAY101",

        "order_id": "O101",

        "customer_id": "CUS101",

        "amount": 65000,

        "payment_method": "CARD"

    }

    response = client.post(
        "/payments/",
        json=payload
    )

    assert response.status_code in [201, 409]


def test_get_payment():

    response = client.get(
        "/payments/PAY101"
    )

    assert response.status_code in [200, 404]


def test_update_payment():

    payload = {

        "payment_method": "UPI",

        "payment_status": "SUCCESS"

    }

    response = client.put(
        "/payments/PAY101",
        json=payload
    )

    assert response.status_code in [200, 404]


def test_delete_payment():

    response = client.delete(
        "/payments/PAY101"
    )

    assert response.status_code in [200, 404]