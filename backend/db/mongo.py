import os
import logging
from typing import Optional, Any

logger = logging.getLogger("agriconnect_mongo")

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "agriconnect")

# Safe dynamic import of motor and pymongo
try:
    from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase  # type: ignore
    HAS_MOTOR = True
except (ImportError, ModuleNotFoundError):
    AsyncIOMotorClient = None
    AsyncIOMotorDatabase = None
    HAS_MOTOR = False

try:
    import pymongo  # type: ignore
    HAS_PYMONGO = True
except (ImportError, ModuleNotFoundError):
    pymongo = None
    HAS_PYMONGO = False

_client: Optional[Any] = None
_db: Optional[Any] = None
_is_connected: bool = False

async def init_mongo() -> bool:
    """Initialize async MongoDB client and verify connectivity."""
    global _client, _db, _is_connected
    if not HAS_MOTOR or AsyncIOMotorClient is None:
        logger.info(
            "[INFO] 'motor' package is not active. "
            "Running in resilient In-Memory store mode. Run 'pip install -r requirements.txt' to activate live MongoDB."
        )
        _is_connected = False
        return False

    try:
        logger.info(f"Connecting to MongoDB at {MONGODB_URI}...")
        _client = AsyncIOMotorClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=2000,
            connectTimeoutMS=2000
        )
        # Test connection with a ping
        await _client.admin.command('ping')
        _db = _client[MONGODB_DB_NAME]
        _is_connected = True
        logger.info(f"Successfully connected to MongoDB database '{MONGODB_DB_NAME}'")
        return True
    except Exception as e:
        _is_connected = False
        logger.warning(
            f"MongoDB connection failed ({e}). Operating in resilient In-Memory / Demo mode."
        )
        return False

def get_db():
    """Returns the connected AsyncIOMotorDatabase instance or None."""
    global _db, _is_connected
    if _is_connected:
        return _db
    return None

def is_mongo_connected() -> bool:
    """Returns True if live MongoDB connection is active."""
    global _is_connected
    return _is_connected

def close_mongo():
    """Closes the MongoDB connection."""
    global _client, _is_connected
    if _client:
        try:
            _client.close()
        except Exception:
            pass
        _is_connected = False
        logger.info("MongoDB connection closed.")

def get_sync_db():
    """Returns a synchronous PyMongo database connection (useful for scripts & seeders)."""
    if not HAS_PYMONGO or pymongo is None:
        return None
    try:
        client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        return client[MONGODB_DB_NAME]
    except Exception as e:
        logger.warning(f"Sync MongoDB connection failed: {e}")
        return None
