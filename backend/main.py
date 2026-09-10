import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.admin import router as admin_router
from routes.assistant import router as assistant_router
from routes.voice import router as voice_router
from routes.routes import router as routes_router
from routes.orders import router as orders_router
from routes.transport import router as transport_router
from routes.notifications import router as notifications_router

app = FastAPI(
    title="AgriConnect API & Supply Chain Operations",
    description="Backend API powering Authentication, Role Authorization, Google Maps Routing, & Operations",
    version="1.2.0"
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
    data_mode = os.getenv("DATA_MODE", "demo")
    return {
        "service": "AgriConnect Backend API",
        "status": "online",
        "data_mode": data_mode,
        "supported_languages": ["ta", "en", "tanglish", "ml", "te", "hi", "kn"],
        "modules": ["auth", "admin", "assistant", "voice", "routes", "orders", "transport", "notifications"]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
