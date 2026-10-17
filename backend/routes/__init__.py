from backend.routes.health import router as health_router
from backend.routes.medicines import router as medicines_router
from backend.routes.verify import router as verify_router
from backend.routes.reports import router as reports_router
from backend.routes.history import router as history_router
from backend.routes.dashboard import router as dashboard_router

__all__ = [
    "health_router",
    "medicines_router",
    "verify_router",
    "reports_router",
    "history_router",
    "dashboard_router",
]
