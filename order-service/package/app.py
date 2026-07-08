from fastapi import FastAPI
from mangum import Mangum

from routers.order_router import router

app = FastAPI(
    title="Order Service",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Order Service Running Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }


app.include_router(router)

handler = Mangum(app, lifespan="off")