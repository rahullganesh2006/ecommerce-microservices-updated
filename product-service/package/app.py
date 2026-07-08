from fastapi import FastAPI
from mangum import Mangum

from routers.product_router import router

app = FastAPI(
    title="Product Service",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Product Service Running Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }


app.include_router(router)

handler = Mangum(app, lifespan="off", api_gateway_base_path="/")