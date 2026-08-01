import os
import pytest
import boto3
from moto import mock_aws

os.environ["AWS_ACCESS_KEY_ID"] = "testing"
os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
os.environ["AWS_SECURITY_TOKEN"] = "testing"
os.environ["AWS_SESSION_TOKEN"] = "testing"
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
os.environ["AWS_REGION"] = "us-east-1"
os.environ["DYNAMODB_TABLE"] = "test-cart-table"
os.environ["AWS_LAMBDA_FUNCTION_NAME"] = "test"

@pytest.fixture(scope="function")
def aws_credentials():
    pass

@pytest.fixture(scope="function")
def dynamodb_mock(aws_credentials):
    with mock_aws():
        dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
        table = dynamodb.create_table(
            TableName="test-cart-table",
            KeySchema=[{"AttributeName": "cart_id", "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": "cart_id", "AttributeType": "S"}],
            BillingMode="PAY_PER_REQUEST"
        )
        yield dynamodb
