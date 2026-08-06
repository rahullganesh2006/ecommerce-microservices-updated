from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

patch_all()
xray_recorder.configure(service='order-service')

from fastapi import FastAPI, Request
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

patch_all()
xray_recorder.configure(service='order-service')
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from mangum import Mangum
from botocore.exceptions import ClientError

from routers.order_router import router
from utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(

    title="Order Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(ClientError)
async def botocore_exception_handler(request: Request, exc: ClientError):
    logger.error(f"AWS Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error connecting to AWS resources", "details": str(exc)},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "details": str(exc)},
    )

@app.get("/")
def home():
    logger.info("Health check (home) requested")
    return {
        "message": "Order Service Running Successfully"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }


app.include_router(router)

handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")