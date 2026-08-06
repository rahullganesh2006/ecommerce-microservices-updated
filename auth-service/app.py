from mangum import Mangum
from fastapi import FastAPI
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all
from aws_xray_sdk.ext.fastapi.middleware import XRayMiddleware

patch_all()
xray_recorder.configure(service='auth-service')



from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

load_dotenv()

from routers.auth_router import router as auth_router

app = FastAPI(
app.add_middleware(XRayMiddleware, app_name='auth-service')


    title="Auth Service",
    description="E-Commerce Auth Microservice",
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
        "message": "Auth Service is running"
    }

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Auth"]
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8005)


handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")
