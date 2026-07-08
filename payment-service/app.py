from fastapi import FastAPI
from mangum import Mangum

from routers.payment_router import router

app = FastAPI(
    title="Payment Service",
    version="2.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Payment Service Running Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }


app.include_router(router)

handler = Mangum(app, lifespan="off")