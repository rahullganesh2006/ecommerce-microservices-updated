from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from routers.payment_router import router

app = FastAPI(
    title="Payment Service",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
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

handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")