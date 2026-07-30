import boto3
import json
import os
import sys

def setup():
    print("====================================================")
    print("      AngadiHub SNS/SQS Infrastructure Setup        ")
    print("====================================================")

    profile_name = "Rahull Ganesh"
    region_name = "us-east-1"  # Default region for SQS/SNS in AWS Academy

    print(f"Connecting using AWS Profile: '{profile_name}' in region: '{region_name}'...")
    try:
        session = boto3.Session(profile_name=profile_name, region_name=region_name)
        sns = session.client("sns")
        sqs = session.client("sqs")
        # Validate connection
        session.client("sts").get_caller_identity()
        print("AWS Connection validated successfully!")
    except Exception as e:
        print(f"\nERROR: Failed to connect to AWS using profile '{profile_name}'.")
        print(f"Details: {e}")
        print("\nPlease make sure:")
        print("1. Your AWS credentials are configured under the profile name 'Rahull Ganesh'")
        print("2. You are connected to the internet.")
        sys.exit(1)

    # 1. Create SNS Topic
    topic_name = "angadihub-order-placed-topic"
    print(f"\nCreating SNS Topic: '{topic_name}'...")
    try:
        topic_res = sns.create_topic(Name=topic_name)
        topic_arn = topic_res["TopicArn"]
        print(f"-> SNS Topic Created! ARN: {topic_arn}")
    except Exception as e:
        print(f"Failed to create SNS topic: {e}")
        sys.exit(1)

    # 2. Create SQS Queue
    queue_name = "angadihub-inventory-updates-queue"
    print(f"\nCreating SQS Queue: '{queue_name}'...")
    try:
        queue_res = sqs.create_queue(
            QueueName=queue_name,
            Attributes={
                "ReceiveMessageWaitTimeSeconds": "20",  # Enable Long Polling
                "VisibilityTimeout": "30"
            }
        )
        queue_url = queue_res["QueueUrl"]
        print(f"-> SQS Queue Created! URL: {queue_url}")
    except Exception as e:
        print(f"Failed to create SQS queue: {e}")
        sys.exit(1)

    # 3. Get SQS Queue ARN
    print("\nFetching SQS Queue ARN...")
    try:
        attrs = sqs.get_queue_attributes(
            QueueUrl=queue_url,
            AttributeNames=["QueueArn"]
        )
        queue_arn = attrs["Attributes"]["QueueArn"]
        print(f"-> SQS Queue ARN: {queue_arn}")
    except Exception as e:
        print(f"Failed to fetch SQS queue ARN: {e}")
        sys.exit(1)

    # 4. Subscribe SQS to SNS Topic
    print(f"\nSubscribing SQS Queue to SNS Topic...")
    try:
        sub_res = sns.subscribe(
            TopicArn=topic_arn,
            Protocol="sqs",
            Endpoint=queue_arn
        )
        subscription_arn = sub_res["SubscriptionArn"]
        print(f"-> Subscribed successfully! Subscription ARN: {subscription_arn}")
    except Exception as e:
        print(f"Failed to subscribe SQS to SNS: {e}")
        sys.exit(1)

    # 5. Configure SQS Policy to allow SNS Topic writes
    print("\nConfiguring SQS Access Policy to allow SNS writes...")
    policy = {
        "Version": "2012-10-17",
        "Statement": [{
            "Sid": "Allow-SNS-SendMessage",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "sqs:SendMessage",
            "Resource": queue_arn,
            "Condition": {
                "ArnEquals": {
                    "aws:SourceArn": topic_arn
                }
            }
        }]
    }

    try:
        sqs.set_queue_attributes(
            QueueUrl=queue_url,
            Attributes={
                "Policy": json.dumps(policy)
            }
        )
        print("-> SQS Access Policy updated successfully!")
    except Exception as e:
        print(f"Failed to set SQS policy attributes: {e}")
        sys.exit(1)

    # 6. Update local env files
    print("\nUpdating environment variables...")
    
    order_env_path = os.path.join("order-service", ".env")
    inventory_env_path = os.path.join("inventory-service", ".env")

    # Update order-service .env
    try:
        lines = []
        if os.path.exists(order_env_path):
            with open(order_env_path, "r") as f:
                lines = f.readlines()
        
        # Remove existing topic arn key if present
        lines = [l for l in lines if not l.startswith("ORDER_PLACED_TOPIC_ARN")]
        lines.append(f"ORDER_PLACED_TOPIC_ARN={topic_arn}\n")
        lines.append(f"AWS_REGION={region_name}\n")
        
        with open(order_env_path, "w") as f:
            f.writelines(lines)
        print(f"-> Updated {order_env_path} with SNS Topic ARN.")
    except Exception as e:
        print(f"Failed to update {order_env_path}: {e}")

    # Update inventory-service .env
    try:
        lines = []
        if os.path.exists(inventory_env_path):
            with open(inventory_env_path, "r") as f:
                lines = f.readlines()
        
        # Remove existing queue url key if present
        lines = [l for l in lines if not l.startswith("INVENTORY_SQS_QUEUE_URL")]
        lines.append(f"INVENTORY_SQS_QUEUE_URL={queue_url}\n")
        lines.append(f"AWS_REGION={region_name}\n")
        
        with open(inventory_env_path, "w") as f:
            f.writelines(lines)
        print(f"-> Updated {inventory_env_path} with SQS Queue URL.")
    except Exception as e:
        print(f"Failed to update {inventory_env_path}: {e}")

    print("\n====================================================")
    print("            SETUP COMPLETED SUCCESSFULLY!           ")
    print("====================================================")
    print(f"SNS Topic ARN: {topic_arn}")
    print(f"SQS Queue URL: {queue_url}")
    print("====================================================")

if __name__ == "__main__":
    setup()
