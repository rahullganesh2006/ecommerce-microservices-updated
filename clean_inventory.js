const http = require('http');

async function doFetch(url, options) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : null);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log("Fetching products...");
  const productsRes = await doFetch('http://localhost:8000/products/', { method: 'GET' });
  const products = productsRes?.data || [];
  const validIds = new Set(products.map(p => p.product_id));
  console.log(`Found ${validIds.size} products.`);

  console.log("Fetching inventory...");
  const inventoryRes = await doFetch('http://localhost:8002/inventory/', { method: 'GET' });
  const inventory = inventoryRes?.data || [];
  console.log(`Found ${inventory.length} inventory records.`);
  
  let deleted = 0;
  for (const item of inventory) {
    if (!validIds.has(item.product_id)) {
      console.log(`Deleting ${item.inventory_id} (product: ${item.product_id})`);
      await doFetch(`http://localhost:8002/inventory/${item.inventory_id}`, { method: 'DELETE' });
      deleted++;
    }
  }
  console.log(`Done. Deleted ${deleted} orphaned records.`);
}

run();
