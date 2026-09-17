import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.mongo import init_mongo, close_mongo, is_mongo_connected
from routes.auth import router as auth_router
from routes.admin import router as admin_router
from routes.assistant import router as assistant_router
from routes.voice import router as voice_router
from routes.routes import router as routes_router
from routes.orders import router as orders_router
from routes.transport import router as transport_router
from routes.notifications import router as notifications_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("agriconnect_main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize MongoDB connection
    logger.info("Initializing AgriConnect Backend & MongoDB driver...")
    await init_mongo()
    yield
    # Shutdown: Close MongoDB connection
    logger.info("Shutting down AgriConnect Backend...")
    close_mongo()

app = FastAPI(
    title="AgriConnect API & Supply Chain Operations",
    description="Backend API powering JWT Authentication, MongoDB Database, Google Maps Routing, & Operations",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(assistant_router)
app.include_router(voice_router)
app.include_router(routes_router)
app.include_router(orders_router)
app.include_router(transport_router)
app.include_router(notifications_router)

@app.get("/")
def read_root():
    data_mode = os.getenv("DATA_MODE", "mongodb")
    mongo_active = is_mongo_connected()
    return {
        "service": "AgriConnect Backend API",
        "status": "online",
        "version": "2.0.0",
        "stack": "FastAPI + MongoDB (FARM)",
        "database": "MongoDB (Active)" if mongo_active else "In-Memory Fallback Store",
        "data_mode": data_mode,
        "supported_languages": ["ta", "en", "tanglish", "ml", "te", "hi", "kn"],
        "modules": ["auth (JWT)", "admin", "assistant", "voice", "routes", "orders", "transport", "notifications"]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
