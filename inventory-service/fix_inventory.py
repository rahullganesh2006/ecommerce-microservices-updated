import boto3

session = boto3.Session(profile_name="Rahull Ganesh")
dynamodb = session.resource('dynamodb', region_name='ap-southeast-1')
inventory_table = dynamodb.Table('rahull-inventory')
products_table = dynamodb.Table('rahull-products')

# 1. Delete I101
print("Deleting duplicate I101...")
inventory_table.delete_item(Key={'inventory_id': 'I101'})

# 2. Find missing inventory records
response = products_table.scan()
products = response.get('Items', [])

response = inventory_table.scan()
inventory_items = response.get('Items', [])
existing_product_ids = set([i['product_id'] for i in inventory_items if i['inventory_id'] != 'I101'])

for p in products:
    if p['product_id'] not in existing_product_ids:
        print(f"Creating missing inventory for {p['product_id']} (Stock: {p.get('stock', 0)})")
        inventory_table.put_item(Item={
            'inventory_id': f"inv_{p['product_id']}",
            'product_id': p['product_id'],
            'available_stock': int(p.get('stock', 0)),
            'reserved_stock': 0,
            'warehouse_location': 'Chennai'
        })

print("Done fixing inventory!")
