from fastapi.testclient import TestClient
import pytest
from app import app
from services.auth_service import USER_STORE, AuthService

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_register_success():
    email = "testnewuser@cloudcart.io"
    response = client.post("/auth/register", json={
        "name": "Test User",
        "email": email,
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "tokens" in data
    assert data["user"]["email"] == email

def test_register_duplicate():
    email = "admin@cloudcart.io"
    response = client.post("/auth/register", json={
        "name": "Admin",
        "email": email,
        "password": "password123"
    })
    assert response.status_code == 400

def test_login_success():
    response = client.post("/auth/login/password", json={
        "email": "customer@cloudcart.io",
        "password": "customer"
    })
    assert response.status_code == 200
    assert "tokens" in response.json()

def test_login_failure():
    response = client.post("/auth/login/password", json={
        "email": "customer@cloudcart.io",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_change_password():
    email = "customer@cloudcart.io"
    response = client.post("/auth/change-password", json={
        "email": email,
        "current_password": "customer",
        "new_password": "newcustomerpassword"
    })
    assert response.status_code == 200
    assert USER_STORE[email]["password"] == "newcustomerpassword"
