from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.report import SuspiciousReport
from backend.schemas.medicine import ReportCreateRequest, ReportResponse
from backend.services.report_service import create_suspicious_report, get_report_by_reference

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse)
def submit_report(request: ReportCreateRequest, db: Session = Depends(get_db)):
    if not request.medicine_name or not request.description or not request.suspicion_reason:
        raise HTTPException(
            status_code=400,
            detail="Medicine name, suspicion reason, and description are required fields."
        )
    return create_suspicious_report(db, request)

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = get_report_by_reference(db, report_id)
    if not report:
        raise HTTPException(
            status_code=404,
            detail=f"Report with reference ID '{report_id}' was not found."
        )
    return report

@router.get("", response_model=List[ReportResponse])
def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SuspiciousReport)
    if user_id:
        query = query.filter(SuspiciousReport.user_id == user_id)
    records = query.order_by(SuspiciousReport.created_at.desc()).offset(skip).limit(limit).all()
    
    return [
        ReportResponse(
            id=r.id,
            report_reference=r.report_reference,
            medicine_name=r.medicine_name,
            manufacturer=r.manufacturer,
            batch_number=r.batch_number,
            expiry_date=r.expiry_date,
            purchase_location=r.purchase_location,
            suspicion_reason=r.suspicion_reason,
            description=r.description,
            image_path=r.image_path,
            contact_info=r.contact_info,
            status=r.status,
            created_at=r.created_at.isoformat() if r.created_at else "",
        )
        for r in records
    ]
