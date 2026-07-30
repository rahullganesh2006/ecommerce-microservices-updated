import boto3

session = boto3.Session(profile_name="Rahull Ganesh")
dynamodb = session.resource('dynamodb', region_name='ap-southeast-1')

inventory_table = dynamodb.Table('rahull-inventory')
products_table = dynamodb.Table('rahull-products')

print("Scanning products...")
response = products_table.scan()
products = response.get('Items', [])
valid_product_ids = set([p['product_id'] for p in products])

print(f"Found {len(valid_product_ids)} valid products: {valid_product_ids}")

print("Scanning inventory...")
response = inventory_table.scan()
inventory_items = response.get('Items', [])

deleted = 0
for item in inventory_items:
    if item['product_id'] not in valid_product_ids:
        print(f"Deleting orphaned inventory record: {item['inventory_id']} for product {item['product_id']}")
        inventory_table.delete_item(Key={'inventory_id': item['inventory_id']})
        deleted += 1

print(f"Cleaned up {deleted} orphaned inventory records.")
