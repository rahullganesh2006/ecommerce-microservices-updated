from fastapi import FastAPI
from mangum import Mangum

from routers.cart_router import router as cart_router

app = FastAPI(
    title="Cart Service",
    description="E-Commerce Cart Microservice",
    version="1.0.0"
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

handler = Mangum(app)