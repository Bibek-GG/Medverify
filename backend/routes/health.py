from fastapi import APIRouter
from backend.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "database_type": "PostgreSQL" if "postgresql" in settings.DATABASE_URL else "SQLite (Local Dev)",
        "message": "MedVerify India verification engine operational."
    }
