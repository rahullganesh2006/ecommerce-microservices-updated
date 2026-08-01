import json
import os
import time

QUEUE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "mock_sqs_queue.json")

def publish_mock_message(message):
    try:
        messages = []
        if os.path.exists(QUEUE_FILE):
            try:
                with open(QUEUE_FILE, "r") as f:
                    content = f.read().strip()
                    if content:
                        messages = json.loads(content)
            except Exception:
                pass
        
        sqs_message = {
            "MessageId": f"mock-msg-{int(time.time() * 1000)}",
            "ReceiptHandle": f"mock-receipt-{int(time.time() * 1000)}",
            "Body": json.dumps({
                "TopicArn": "arn:aws:sns:us-east-1:123456789012:mock-topic",
                "Message": json.dumps(message)
            })
        }
        messages.append(sqs_message)
        
        with open(QUEUE_FILE, "w") as f:
            json.dump(messages, f, indent=2)
            
        print(f"Mock SQS/SNS Info: Message written to local queue file ({QUEUE_FILE}). ID: {sqs_message['MessageId']}")
        return sqs_message["MessageId"]
    except Exception as e:
        print(f"Mock SQS/SNS Error: Failed to write to local queue file: {e}")
        return None
