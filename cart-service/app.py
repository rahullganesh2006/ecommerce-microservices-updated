from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from routers.cart_router import router as cart_router

app = FastAPI(
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