from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.database import engine, Base, SessionLocal
from backend.services.seed_data import seed_database
from backend.routes import (
    health_router,
    medicines_router,
    verify_router,
    reports_router,
    history_router,
    dashboard_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed sample database records
    db = SessionLocal()
    try:
        count = seed_database(db)
        print(f"[MedVerify] Initialized database with {count} sample medicines.")
    finally:
        db.close()
        
    yield
    print("[MedVerify] Application shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploaded medicine packaging photos
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Include Routers
app.include_router(health_router, prefix="/api")
app.include_router(medicines_router, prefix="/api")
app.include_router(verify_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "path": request.url.path
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
