from fastapi import APIRouter
from app.api.v1 import auth, chat, upload

api_router = APIRouter()

# Include all v1 routers
api_router.include_router(auth.router)
api_router.include_router(chat.router)
api_router.include_router(upload.router)
