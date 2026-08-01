import asyncio
from fastapi import FastAPI
from services.queue_consumer import QueueConsumer

app = FastAPI(title="Notification Service")

consumer = QueueConsumer()

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(consumer.start_polling())

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "notification"}
