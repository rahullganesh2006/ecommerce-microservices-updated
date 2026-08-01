import os
import json
import pytest
from fastapi.testclient import TestClient
from app import app
from services.queue_consumer import QueueConsumer
from services.email_service import EmailService

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "notification"}

def test_email_service(monkeypatch):
    # Mock real email to just return True
    mock_called = {"to_address": None, "subject": None, "body": None}
    
    def mock_send(to_address, subject, body):
        mock_called["to_address"] = to_address
        mock_called["subject"] = subject
        mock_called["body"] = body
        return True
        
    monkeypatch.setattr("services.email_service.EmailService._send_real_email", mock_send)

    # Test Welcome Email
    user_data = {"id": "u1", "email": "test@test.com", "name": "Test User"}
    EmailService.send_welcome_email(user_data)
    
    assert mock_called["to_address"] == "test@test.com"
    assert "Welcome to CloudCart, Test User!" in mock_called["subject"]

    # Test Order Email
    order_data = {"order_id": "ORD1", "customer_id": "CUST1", "total_amount": 100, "shipping_address": "123 Test St"}
    EmailService.send_order_tracking_email(order_data)
    
    assert mock_called["to_address"] == "CUST1"
    assert "Your CloudCart Order ORD1 has been placed" in mock_called["subject"]

def test_queue_consumer(tmp_path, monkeypatch):
    # Mock the queue file and email sender
    test_queue = tmp_path / "mock_sqs_queue.json"
    
    mock_called = []
    def mock_send(to_address, subject, body):
        mock_called.append(to_address)
        return True

    monkeypatch.setattr("services.queue_consumer.QUEUE_FILE", str(test_queue))
    monkeypatch.setattr("services.email_service.EmailService._send_real_email", mock_send)

    # Create dummy messages
    messages = [
        {
            "MessageId": "msg1",
            "Body": json.dumps({
                "Message": json.dumps({"event_type": "USER_REGISTERED", "email": "q@test.com", "name": "QUser"})
            })
        },
        {
            "MessageId": "msg2",
            "Body": json.dumps({
                "Message": json.dumps({"event_type": "ORDER_PLACED", "order_id": "O99", "customer_id": "C99", "total_amount": 50})
            })
        },
        {
            "MessageId": "msg3",
            "Body": json.dumps({
                "Message": json.dumps({"event_type": "OTHER_EVENT"})
            })
        }
    ]
    test_queue.write_text(json.dumps(messages))

    consumer = QueueConsumer()
    consumer._process_queue()

    # The first two messages should be processed and removed
    # The third message should remain in the queue
    remaining = json.loads(test_queue.read_text())
    assert len(remaining) == 1
    assert "OTHER_EVENT" in remaining[0]["Body"]

    assert "C99" in mock_called
