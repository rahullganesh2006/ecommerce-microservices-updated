import boto3
import json
import os
import sys
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add parent directory to path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.inventory_service import InventoryService

def start_worker():
    print("====================================================")
    print("        AngadiHub Inventory SQS Worker Starting      ")
    print("====================================================")

    queue_url = os.getenv("INVENTORY_SQS_QUEUE_URL", "mock")
    use_mock = not queue_url or queue_url.lower() == "mock"

    profile_name = "Rahull Ganesh"
    region_name = os.getenv("AWS_REGION", "us-east-1")

    sqs = None
    if not use_mock:
        print(f"Connecting to SQS Queue: {queue_url}")
        print(f"AWS Profile: {profile_name} | Region: {region_name}")
        try:
            session = boto3.Session(profile_name=profile_name, region_name=region_name)
            sqs = session.client("sqs")
            print("Worker successfully authenticated and connected to SQS!")
        except Exception as e:
            print(f"AWS Connection failed: {e}. Falling back to Local Mock Queue...")
            use_mock = True

    if use_mock:
        print("Worker is running in LOCAL MOCK QUEUE mode (monitoring mock_sqs_queue.json).")

    print("\nListening for order placement events... (Press Ctrl+C to quit)\n")
    while True:
        try:
            messages = []
            if use_mock:
                from services.mock_queue import poll_mock_messages, delete_mock_message
                messages = poll_mock_messages()
                if not messages:
                    time.sleep(2)  # Avoid high CPU usage in mock mode
                    continue
            else:
                # Poll messages using SQS Long Polling
                response = sqs.receive_message(
                    QueueUrl=queue_url,
                    MaxNumberOfMessages=10,
                    WaitTimeSeconds=20,  # 20 second long polling
                    AttributeNames=["All"]
                )
                messages = response.get("Messages", [])
                if not messages:
                    continue

            print(f"Received {len(messages)} message(s)...")

            for message in messages:
                receipt_handle = message["ReceiptHandle"]
                body = json.loads(message["Body"])

                # Handle raw SQS message or SNS notification wrapper
                event_data = {}
                if "TopicArn" in body and "Message" in body:
                    # Wrapped in SNS Envelope
                    event_data = json.loads(body["Message"])
                else:
                    event_data = body

                event_type = event_data.get("event_type")
                order_id = event_data.get("order_id")
                product_id = event_data.get("product_id")
                quantity = int(event_data.get("quantity", 0))

                print(f"Processing event: {event_type} | Order: {order_id} | Product: {product_id} | Qty: {quantity}")

                if event_type == "ORDER_PLACED" and product_id and quantity > 0:
                    inventory_id = f"inv_{product_id}"
                    
                    # Verify if inventory item exists, if not, auto-create it with fallback
                    existing = InventoryService.get_inventory_by_id(inventory_id)
                    if not existing:
                        print(f"  Warning: Inventory record for {inventory_id} does not exist. Auto-creating...")
                        # Mock schema object representation
                        from schemas.inventory_schema import InventoryCreate
                        new_inv = InventoryCreate(
                            inventory_id=inventory_id,
                            product_id=product_id,
                            available_stock=100,
                            reserved_stock=0,
                            warehouse_location="Chennai"
                        )
                        InventoryService.create_inventory(new_inv)

                    # Deduct/reserve stock
                    res = InventoryService.reserve_stock(inventory_id, quantity)
                    if res:
                        print(f"  Success: Reserved {quantity} units for {inventory_id}. New stock: {res.get('available_stock')}")
                    else:
                        print(f"  Failed: Insufficient stock available to reserve {quantity} units for {inventory_id}")

                # Delete the message from queue to prevent reprocessing
                if use_mock:
                    delete_mock_message(receipt_handle)
                else:
                    sqs.delete_message(
                        QueueUrl=queue_url,
                        ReceiptHandle=receipt_handle
                    )
                print(f"  Message processed and deleted from queue.")

        except KeyboardInterrupt:
            print("\nShutting down SQS worker...")
            break
        except Exception as e:
            print(f"Error polling SQS queue: {e}")
            time.sleep(5)  # Backoff before retrying

if __name__ == "__main__":
    start_worker()
