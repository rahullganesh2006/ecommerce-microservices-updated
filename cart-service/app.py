from fastapi import FastAPI
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware

patch_all()
xray_recorder.configure(service='cart-service')

from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from routers.cart_router import router as cart_router

app = FastAPI(
app.add_middleware(XRayMiddleware, app_name='cart-service')

    title="Cart Service",
    description="E-Commerce Cart Microservice",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "success",
        "message": "Cart Service is running"
    }

app.include_router(
    cart_router,
    prefix="/cart",
    tags=["Cart"]
)

handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")