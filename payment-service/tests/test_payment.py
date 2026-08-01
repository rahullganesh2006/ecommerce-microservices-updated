import os
os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
os.environ["AWS_SECURITY_TOKEN"] = "testing"
os.environ["AWS_SESSION_TOKEN"] = "testing"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
os.environ["APP_REGION"] = "us-east-1"
os.environ["TABLE_NAME"] = "test-payment-table"
os.environ["AWS_LAMBDA_FUNCTION_NAME"] = "test"

from fastapi.testclient import TestClient
import pytest
from app import app
from database import table
import json
from unittest.mock import patch
from decimal import Decimal

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200

def test_create_payment(dynamodb_mock):
    response = client.post("/payments/", json={
        "payment_id": "PAY1",
        "order_id": "ORD1",
        "customer_id": "CUST1",
        "amount": 250.0,
        "payment_method": "CREDIT_CARD"
    })
    
    assert response.status_code == 201
    
    # Verify DB
    item = table.get_item(Key={"payment_id": "PAY1"})["Item"]
    assert item["order_id"] == "ORD1"
    assert item["payment_status"] == "SUCCESS"
    assert item["amount"] == Decimal("250.0")

def test_get_payment(dynamodb_mock):
    table.put_item(Item={
        "payment_id": "PAY2",
        "order_id": "ORD2",
        "customer_id": "CUST2",
        "amount": Decimal("500.0"),
        "payment_status": "SUCCESS"
    })

    response = client.get("/payments/PAY2")
    assert response.status_code == 200
    data = response.json()
    assert data["payment_id"] == "PAY2"
    assert float(data["amount"]) == 500.0
