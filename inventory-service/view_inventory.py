import boto3

session = boto3.Session(profile_name="Rahull Ganesh")
dynamodb = session.resource('dynamodb', region_name='ap-southeast-1')
inventory_table = dynamodb.Table('rahull-inventory')

response = inventory_table.scan()
inventory_items = response.get('Items', [])

print("Inventory items:")
for i in inventory_items:
    print(f"Inventory ID: {i.get('inventory_id')}, Product ID: {i.get('product_id')}")
