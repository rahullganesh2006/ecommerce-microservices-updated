from fastapi import FastAPI
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware

patch_all()
xray_recorder.configure(service='product-service')
, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from routers.product_router import router

app = FastAPI(

    title="Product Service",
    version="1.0.0",
    description="Product Microservice secured using JWT Authentication"
)

app.add_middleware(XRayMiddleware, app_name='product-service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Swagger Security Scheme
security = HTTPBearer()


@app.get("/", tags=["Home"])
def home():
    return {
        "message": "Product Service Running Successfully"
    }


@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "Healthy"
    }


# Sample Protected Endpoint
@app.get("/secure-test", tags=["Security"])
def secure_test(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    return {
        "message": "JWT Token Received Successfully",
        "token": credentials.credentials
    }


# Include Product Routes
app.include_router(router)

# AWS Lambda Handler
handler = Mangum(
    app,
    lifespan="off",
    api_gateway_base_path="/v1"
)