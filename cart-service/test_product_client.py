from clients.product_client import ProductClient

product = ProductClient.get_product(
    product_id="P101"
)

print(product)