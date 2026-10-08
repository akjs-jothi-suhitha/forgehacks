from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
        "has_ai_credentials": settings.has_ai_credentials,
        "demo_mode": settings.DEMO_MODE or not settings.has_ai_credentials,
        "ai_model": settings.AI_MODEL
    }
