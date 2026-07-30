import boto3
import hmac
import hashlib
import base64

CLIENT_ID = "1bro6jt0pb4mu4q0vo9cfkme5m"
CLIENT_SECRET = "j5tchtgkl74a834fqnae4prj39i600nnm3q5fjq0c5ldi9rhe0s"

USERNAME = "rahullganesh2006@gmail.com"
PASSWORD = "Rahull@2006#Test123"

REGION = "ap-southeast-1"


def secret_hash(username):
    message = username + CLIENT_ID

    digest = hmac.new(
        CLIENT_SECRET.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).digest()

    return base64.b64encode(digest).decode()


session = boto3.Session(
    profile_name="Rahull Ganesh"
)

client = session.client(
    "cognito-idp",
    region_name=REGION
)

response = client.initiate_auth(
    ClientId=CLIENT_ID,
    AuthFlow="USER_PASSWORD_AUTH",
    AuthParameters={
        "USERNAME": USERNAME,
        "PASSWORD": PASSWORD,
        "SECRET_HASH": secret_hash(USERNAME)
    }
)

print("\nACCESS TOKEN:\n")
print(response["AuthenticationResult"]["AccessToken"])

print("\nID TOKEN:\n")
print(response["AuthenticationResult"]["IdToken"])

print("\nREFRESH TOKEN:\n")
print(response["AuthenticationResult"]["RefreshToken"])