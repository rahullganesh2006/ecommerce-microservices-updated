from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

patch_all()
xray_recorder.configure(service='notification-service')

from mangum import Mangum
import asyncio
from fastapi import FastAPI
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

patch_all()
xray_recorder.configure(service='notification-service')

from services.queue_consumer import QueueConsumer

app = FastAPI(title="Notification Service")


consumer = QueueConsumer()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consumer.start_polling())

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "notification"}


handler = Mangum(app, lifespan="off", api_gateway_base_path="/v1")
