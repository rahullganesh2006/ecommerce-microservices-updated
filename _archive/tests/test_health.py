import urllib.request
import urllib.error

req = urllib.request.Request(
    "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/products"
)
try:
    with urllib.request.urlopen(req) as res:
        print(f"Status: {res.status}")
        print(res.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode())
except Exception as e:
    print(f"Error: {e}")
