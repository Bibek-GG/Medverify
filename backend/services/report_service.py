import random
import string
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from backend.models.report import SuspiciousReport
from backend.schemas.medicine import ReportCreateRequest, ReportResponse

def generate_report_reference() -> str:
    """Generate a unique reference code like MV-2026-K9P2X"""
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))
    return f"MV-2026-{suffix}"

def create_suspicious_report(db: Session, request: ReportCreateRequest) -> ReportResponse:
    # Ensure reference code is unique
    while True:
        ref_id = generate_report_reference()
        if not db.query(SuspiciousReport).filter_by(report_reference=ref_id).first():
            break

    new_report = SuspiciousReport(
        report_reference=ref_id,
        user_id=request.user_id or "anonymous-reporter",
        medicine_name=request.medicine_name,
        manufacturer=request.manufacturer,
        batch_number=request.batch_number,
        expiry_date=request.expiry_date,
        purchase_location=request.purchase_location,
        suspicion_reason=request.suspicion_reason,
        description=request.description,
        image_path=request.image_path,
        contact_info=request.contact_info,
        status="SUBMITTED"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return ReportResponse(
        id=new_report.id,
        report_reference=new_report.report_reference,
        medicine_name=new_report.medicine_name,
        manufacturer=new_report.manufacturer,
        batch_number=new_report.batch_number,
        expiry_date=new_report.expiry_date,
        purchase_location=new_report.purchase_location,
        suspicion_reason=new_report.suspicion_reason,
        description=new_report.description,
        image_path=new_report.image_path,
        contact_info=new_report.contact_info,
        status=new_report.status,
        created_at=new_report.created_at.isoformat() if new_report.created_at else datetime.now(timezone.utc).isoformat(),
    )

def get_report_by_reference(db: Session, reference: str) -> Optional[ReportResponse]:
    clean_ref = reference.strip().upper()
    report = db.query(SuspiciousReport).filter(
        (SuspiciousReport.report_reference == clean_ref) | 
        (SuspiciousReport.id == int(reference) if reference.isdigit() else False)
    ).first()
    
    if not report:
        return None

    return ReportResponse(
        id=report.id,
        report_reference=report.report_reference,
        medicine_name=report.medicine_name,
        manufacturer=report.manufacturer,
        batch_number=report.batch_number,
        expiry_date=report.expiry_date,
        purchase_location=report.purchase_location,
        suspicion_reason=report.suspicion_reason,
        description=report.description,
        image_path=report.image_path,
        contact_info=report.contact_info,
        status=report.status,
        created_at=report.created_at.isoformat() if report.created_at else "",
    )
