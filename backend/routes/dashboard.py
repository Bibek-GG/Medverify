from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.models.scan import VerificationScan
from backend.models.report import SuspiciousReport
from backend.models.medicine import Medicine
from backend.schemas.medicine import DashboardStatsResponse
from backend.config import settings

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_scans = db.query(VerificationScan).count()
    verified_matches = db.query(VerificationScan).filter_by(status="VERIFIED").count()
    suspicious_count = db.query(VerificationScan).filter_by(status="SUSPICIOUS").count()
    unable_to_verify_count = db.query(VerificationScan).filter_by(status="UNABLE_TO_VERIFY").count()
    reports_submitted = db.query(SuspiciousReport).count()

    recent_scans = (
        db.query(VerificationScan)
        .order_by(VerificationScan.created_at.desc())
        .limit(6)
        .all()
    )

    status_distribution = [
        {"name": "Verified Matches", "count": verified_matches, "color": "#10b981"},
        {"name": "Suspicious Alerts", "count": suspicious_count, "color": "#f59e0b"},
        {"name": "Unable to Verify", "count": unable_to_verify_count, "color": "#64748b"},
    ]

    # Sample timeline distribution for charts
    monthly_trend = [
        {"period": "Oct 06", "verified": max(1, verified_matches // 3), "suspicious": 1, "unverified": 1},
        {"period": "Oct 07", "verified": max(2, verified_matches // 2), "suspicious": max(1, suspicious_count // 2), "unverified": 2},
        {"period": "Oct 08", "verified": max(3, (verified_matches * 2) // 3), "suspicious": 2, "unverified": 1},
        {"period": "Oct 09", "verified": max(4, verified_matches), "suspicious": suspicious_count, "unverified": unable_to_verify_count},
        {"period": "Oct 10", "verified": max(2, verified_matches // 2), "suspicious": 1, "unverified": 1},
        {"period": "Oct 11", "verified": verified_matches, "suspicious": suspicious_count, "unverified": unable_to_verify_count},
        {"period": "Oct 12", "verified": max(1, verified_matches), "suspicious": suspicious_count, "unverified": unable_to_verify_count},
    ]

    return DashboardStatsResponse(
        total_scans=total_scans,
        verified_matches=verified_matches,
        suspicious_count=suspicious_count,
        unable_to_verify_count=unable_to_verify_count,
        reports_submitted=reports_submitted,
        recent_scans=[s.to_dict() for s in recent_scans],
        status_distribution=status_distribution,
        monthly_trend=monthly_trend,
        demo_mode=settings.DEMO_MODE,
        notice=settings.DEMO_NOTICE
    )
