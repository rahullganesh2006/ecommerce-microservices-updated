import json
import urllib.request
import zipfile
import io
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://api.github.com/repos/rahullganesh2006/ecommerce-microservices-updated/actions/runs/30743418556/logs"
req = urllib.request.Request(url, headers={"Accept": "application/vnd.github.v3+json"})
try:
    with urllib.request.urlopen(req) as response:
        # The logs endpoint redirects to a zip file download
        pass
except urllib.error.HTTPError as e:
    if e.code == 302:
        redirect_url = e.headers['Location']
        print(f"Redirecting to: {redirect_url}")
        with urllib.request.urlopen(redirect_url) as zip_response:
            with zipfile.ZipFile(io.BytesIO(zip_response.read())) as z:
                # Find the log file for deploy-backend (order-service)
                for name in z.namelist():
                    if "order-service" in name and "deploy-backend" in name:
                        print(f"Found log: {name}")
                        print(z.read(name).decode()[-2000:])
                        break
    else:
        print(f"Error: {e}")
except Exception as e:
    print(f"Error: {e}")
