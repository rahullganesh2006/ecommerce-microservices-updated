import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    @staticmethod
    def get_smtp_config():
        return {
            "server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
            "port": int(os.getenv("SMTP_PORT", 587)),
            "username": os.getenv("SMTP_USERNAME", ""),
            "password": os.getenv("SMTP_PASSWORD", "")
        }

    @staticmethod
    def send_welcome_email(user_data):
        email = user_data.get("email")
        name = user_data.get("name")
        subject = f"Welcome to CloudCart, {name}!"
        body = f"Hi {name},\n\nThank you for registering at CloudCart. We are excited to have you on board!\n\nBest,\nThe CloudCart Team"
        return EmailService._send_real_email(email, subject, body)

    @staticmethod
    def send_order_tracking_email(order_data):
        customer_id = order_data.get("customer_id", "Unknown")
        customer_name = order_data.get("customer_name")
        display_name = customer_name if customer_name else customer_id
        order_id = order_data.get("order_id", "Unknown")
        subject = f"Your CloudCart Order {order_id} has been placed!"
        
        items = order_data.get("items", [])
        items_list_str = ""
        for item in items:
            name = item.get("product_name", "Unknown Product")
            qty = item.get("quantity", 1)
            price = item.get("unit_price", 0.0)
            items_list_str += f"- {qty}x {name} (₹{price})\n"
            
        if not items_list_str:
            items_list_str = "No item details available.\n"
            
        body = (
            f"Hi {display_name},\n\n"
            f"Your order ({order_id}) has been placed successfully. You will receive tracking information soon.\n\n"
            f"Order Summary:\n"
            f"{items_list_str}\n"
            f"Total Amount: ₹{order_data.get('total_amount')}\n"
            f"Shipping Address: {order_data.get('shipping_address')}\n\n"
            f"Thank you for shopping with us!"
        )
        
        # We assume customer_id is the email in our mock auth system
        return EmailService._send_real_email(customer_id, subject, body)

    @staticmethod
    def _send_real_email(to_address, subject, body):
        config = EmailService.get_smtp_config()
        
        if not config["username"] or not config["password"]:
            print(f"EmailService Warning: SMTP credentials not configured. Skipping real email to {to_address}")
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = config["username"]
            msg['To'] = to_address
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(config["server"], config["port"])
            server.starttls()
            server.login(config["username"], config["password"])
            server.send_message(msg)
            server.quit()
            
            print(f"EmailService: Successfully sent real email to {to_address}")
            return True
        except Exception as e:
            print(f"EmailService Error: Failed to send real email to {to_address}: {e}")
            return False

