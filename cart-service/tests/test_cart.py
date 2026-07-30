from fastapi.testclient import TestClient
from unittest.mock import patch

from app import app

client = TestClient(app)


def mock_user():
    return {
        "access_token": "dummy-token",
        "claims": {
            "sub": "12345"
        }
    }


@patch("security.get_current_user", return_value=mock_user())
@patch("services.cart_service.ProductClient.get_product")
@patch("services.cart_service.InventoryClient.get_inventory")
@patch("services.cart_service.CartRepository.add_to_cart")
def test_add_to_cart(
    mock_add,
    mock_inventory,
    mock_product,
    mock_auth
):

    mock_product.return_value = {
        "product_id": "P100",
        "product_name": "iPhone 16",
        "price": 80000
    }

    mock_inventory.return_value = {
        "product_id": "P100",
        "available_quantity": 50
    }

    mock_add.return_value = {
        "cart_id": "CART001",
        "customer_id": "CUS1001",
        "product_id": "P100",
        "product_name": "iPhone 16",
        "quantity": 2,
        "unit_price": 80000,
        "total_price": 160000
    }

    response = client.post(
        "/cart/add",
        headers={
            "Authorization": "Bearer dummy-token"
        },
        json={
            "customer_id": "CUS1001",
            "product_id": "P100",
            "quantity": 2
        }
    )

    assert response.status_code == 201


@patch("security.get_current_user", return_value=mock_user())
@patch("services.cart_service.CartRepository.get_cart_by_customer")
def test_get_cart(
    mock_cart,
    mock_auth
):

    mock_cart.return_value = []

    response = client.get(
        "/cart/customer/CUS1001",
        headers={
            "Authorization": "Bearer dummy-token"
        }
    )

    assert response.status_code == 200


@patch("security.get_current_user", return_value=mock_user())
@patch("services.cart_service.CartRepository.update_cart")
def test_update_cart(
    mock_update,
    mock_auth
):

    mock_update.return_value = {
        "cart_id": "CART001",
        "quantity": 5
    }

    response = client.put(
        "/cart/update/CART001",
        headers={
            "Authorization": "Bearer dummy-token"
        },
        json={
            "quantity": 5
        }
    )

    assert response.status_code == 200


@patch("security.get_current_user", return_value=mock_user())
@patch("services.cart_service.CartRepository.remove_cart")
def test_remove_cart(
    mock_remove,
    mock_auth
):

    mock_remove.return_value = True

    response = client.delete(
        "/cart/remove/CART001",
        headers={
            "Authorization": "Bearer dummy-token"
        }
    )

    assert response.status_code == 200


@patch("security.get_current_user", return_value=mock_user())
@patch("services.cart_service.CartRepository.checkout")
def test_checkout(
    mock_checkout,
    mock_auth
):

    mock_checkout.return_value = {
        "customer_id": "CUS1001",
        "subtotal": 1000,
        "gst": 180,
        "shipping_charge": 100,
        "grand_total": 1280
    }

    response = client.get(
        "/cart/checkout/CUS1001",
        headers={
            "Authorization": "Bearer dummy-token"
        }
    )

    assert response.status_code == 200