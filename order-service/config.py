import os

class Config:
    def __init__(self):
        # Determine if we are running in Lambda (AWS sets AWS_LAMBDA_FUNCTION_NAME)
        self.is_lambda = os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None

        if not self.is_lambda:
            try:
                from dotenv import load_dotenv
                load_dotenv()
            except ImportError:
                pass

        # AWS Config
        self.aws_region = os.getenv("APP_REGION") or os.getenv("AWS_REGION") or "us-east-1"
        self.table_name = os.getenv("TABLE_NAME", "rahull-orders")
        
        # SNS Config
        self.order_placed_topic_arn = os.getenv("ORDER_PLACED_TOPIC_ARN", "mock")

config = Config()
