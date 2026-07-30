import json
import os

QUEUE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "mock_sqs_queue.json")

def poll_mock_messages():
    try:
        if not os.path.exists(QUEUE_FILE):
            return []
        
        with open(QUEUE_FILE, "r") as f:
            content = f.read().strip()
            if not content:
                return []
            return json.loads(content)
    except Exception as e:
        print(f"Mock SQS/SNS Error: Failed to poll local queue file: {e}")
        return []

def delete_mock_message(receipt_handle):
    try:
        if not os.path.exists(QUEUE_FILE):
            return
        
        messages = []
        with open(QUEUE_FILE, "r") as f:
            content = f.read().strip()
            if content:
                messages = json.loads(content)
                
        filtered = [m for m in messages if m["ReceiptHandle"] != receipt_handle]
        
        with open(QUEUE_FILE, "w") as f:
            json.dump(filtered, f, indent=2)
    except Exception as e:
        print(f"Mock SQS/SNS Error: Failed to delete local queue message: {e}")
