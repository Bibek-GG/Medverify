import os
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
WORKSPACE_DIR = BASE_DIR.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "MedVerify India"
    PROJECT_DESCRIPTION: str = "Fake or Suspicious Medicine Verification System"
    VERSION: str = "1.0.0"
    
    # Database
    # Default to local SQLite for immediate zero-config execution; easily overridden with PostgreSQL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{BASE_DIR / 'medverify.db'}"
    )
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]
    
    # File Uploads
    UPLOAD_DIR: Path = UPLOAD_DIR
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png", ".webp"}
    ALLOWED_MIME_TYPES: set[str] = {
        "image/jpeg",
        "image/png",
        "image/webp"
    }
    
    # Demo Settings
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "true").lower() in ("true", "1", "yes")
    DEMO_NOTICE: str = "DEMO MODE — Sample Data records used for technical demonstration. Not an official government CDSCO database."

settings = Settings()
