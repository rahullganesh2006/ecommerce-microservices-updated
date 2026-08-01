import asyncio
import json
import os
from services.email_service import EmailService

QUEUE_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "mock_sqs_queue.json")

class QueueConsumer:
    def __init__(self):
        self.is_running = False

    async def start_polling(self):
        self.is_running = True
        print(f"QueueConsumer: Started polling {QUEUE_FILE}...")
        while self.is_running:
            self._process_queue()
            await asyncio.sleep(2)  # Poll every 2 seconds

    def stop_polling(self):
        self.is_running = False
        print("QueueConsumer: Stopped polling.")

    def _process_queue(self):
        if not os.path.exists(QUEUE_FILE):
            return

        try:
            with open(QUEUE_FILE, "r") as f:
                content = f.read().strip()
                if not content:
                    return
                messages = json.loads(content)
        except Exception as e:
            print(f"QueueConsumer Error: Failed to read queue: {e}")
            return

        if not messages:
            return

        unprocessed_messages = []
        for msg in messages:
            try:
                body = json.loads(msg.get("Body", "{}"))
                inner_msg = json.loads(body.get("Message", "{}"))
                event_type = inner_msg.get("event_type")

                if event_type == "USER_REGISTERED":
                    print(f"QueueConsumer: Processing USER_REGISTERED event for {inner_msg.get('email')}")
                    success = EmailService.send_welcome_email(inner_msg)
                    if not success:
                        unprocessed_messages.append(msg)
                elif event_type == "ORDER_PLACED":
                    print(f"QueueConsumer: Processing ORDER_PLACED event for {inner_msg.get('order_id')}")
                    email_notifications = inner_msg.get("email_notifications", True)
                    if not email_notifications:
                        print(f"QueueConsumer: Email notifications are disabled for {inner_msg.get('customer_id')}. Skipping.")
                        success = True
                    else:
                        success = EmailService.send_order_tracking_email(inner_msg)
                    if not success:
                        unprocessed_messages.append(msg)
                else:
                    # Not an event we care about, put it back in queue
                    unprocessed_messages.append(msg)
            except Exception as e:
                print(f"QueueConsumer Error processing message: {e}")
                # Keep message in queue on failure
                unprocessed_messages.append(msg)

        # Write back unprocessed messages
        try:
            if len(unprocessed_messages) != len(messages):
                with open(QUEUE_FILE, "w") as f:
                    json.dump(unprocessed_messages, f, indent=2)
        except Exception as e:
            print(f"QueueConsumer Error: Failed to write back to queue: {e}")
