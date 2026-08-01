import os
os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
os.environ["AWS_SECURITY_TOKEN"] = "testing"
os.environ["AWS_SESSION_TOKEN"] = "testing"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
os.environ["APP_REGION"] = "us-east-1"
os.environ["TABLE_NAME"] = "test-order-table"
os.environ["SNS_TOPIC_ARN"] = "arn:aws:sns:us-east-1:123456789012:test-order-topic"
os.environ["AWS_LAMBDA_FUNCTION_NAME"] = "test"

from fastapi.testclient import TestClient
import pytest
from app import app
from database import table
import json

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200

def test_create_order(dynamodb_mock, sns_mock):
    response = client.post("/orders/", json={
        "order_id": "ORD1",
        "customer_id": "CUST1",
        "items": [
            {
                "product_id": "PROD1",
                "product_name": "Test Prod",
                "quantity": 1,
                "unit_price": 100
            }
        ],
        "shipping_address": "123 Test St"
    })
    
    assert response.status_code == 201
    
    # Verify DB
    item = table.get_item(Key={"order_id": "ORD1"})["Item"]
    assert item["customer_id"] == "CUST1"
    assert item["order_status"] == "Placed"

def test_get_order(dynamodb_mock):
    table.put_item(Item={
        "order_id": "ORD2",
        "customer_id": "CUST2",
        "status": "COMPLETED"
    })

    response = client.get("/orders/ORD2")
    assert response.status_code == 200
    data = response.json()
    assert data["order_id"] == "ORD2"
    assert data["status"] == "COMPLETED"


