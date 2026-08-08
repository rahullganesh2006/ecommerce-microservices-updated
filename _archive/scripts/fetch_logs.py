import boto3

client = boto3.client('logs', region_name='us-east-1')
try:
    streams = client.describe_log_streams(
        logGroupName='/aws/lambda/angadi-hub-product-service',
        orderBy='LastEventTime',
        descending=True,
        limit=1
    )
    if streams['logStreams']:
        stream_name = streams['logStreams'][0]['logStreamName']
        events = client.get_log_events(
            logGroupName='/aws/lambda/angadi-hub-product-service',
            logStreamName=stream_name,
            limit=20
        )
        for e in events['events']:
            print(e['message'].strip())
    else:
        print("No log streams found.")
except Exception as e:
    print("Error:", e)
