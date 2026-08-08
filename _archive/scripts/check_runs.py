import json
import urllib.request

url = "https://api.github.com/repos/rahullganesh2006/ecommerce-microservices-updated/actions/runs"
req = urllib.request.Request(url, headers={"Accept": "application/vnd.github.v3+json"})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if data['workflow_runs']:
            latest_run = data['workflow_runs'][0]
            print(f"Latest run status: {latest_run['status']}")
            print(f"Latest run conclusion: {latest_run['conclusion']}")
            print(f"Latest run URL: {latest_run['html_url']}")
            
            # Get jobs for the latest run
            jobs_url = latest_run['jobs_url']
            jobs_req = urllib.request.Request(jobs_url, headers={"Accept": "application/vnd.github.v3+json"})
            with urllib.request.urlopen(jobs_req) as jobs_response:
                jobs_data = json.loads(jobs_response.read().decode())
                for job in jobs_data['jobs']:
                    print(f"Job: {job['name']}, Status: {job['status']}, Conclusion: {job['conclusion']}")
        else:
            print("No runs found")
except Exception as e:
    print(f"Error: {e}")
