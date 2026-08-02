import urllib.request
import urllib.error
import time
import json
import base64

header = base64.urlsafe_b64encode(json.dumps({"alg": "none", "typ": "JWT"}).encode()).decode().rstrip("=")
payload = base64.urlsafe_b64encode(json.dumps({"sub": "123"}).encode()).decode().rstrip("=")
token = f"{header}.{payload}."

req = urllib.request.Request(
    "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/products/secure-test",
    headers={"Authorization": f"Bearer {token}"}
)

for i in range(15):
    try:
        with urllib.request.urlopen(req) as res:
            print(f"Status: {res.status}")
            print(res.read().decode())
            break
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "is not authorized to perform" in body:
            print(f"Still waiting for GitHub Actions... ({i+1}/15)")
            time.sleep(5)
        else:
            print(f"HTTPError: {e.code}")
            print(body)
            break
    except Exception as e:
        print(f"Error: {e}")
        break
