from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from backend.database import get_db
from backend.models.scan import VerificationScan

router = APIRouter(prefix="/history", tags=["History"])

@router.get("")
def get_verification_history(
    search: Optional[str] = Query(None, description="Search medicine name or product ID"),
    status: Optional[str] = Query(None, description="Filter by status: VERIFIED, SUSPICIOUS, UNABLE_TO_VERIFY"),
    sort_by: str = Query("created_at", description="Sort field: created_at, status, scanned_medicine_name"),
    order: str = Query("desc", description="asc or desc"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(VerificationScan)
    
    if user_id:
        query = query.filter(VerificationScan.user_id == user_id)
        
    if status and status.upper() != "ALL":
        query = query.filter(VerificationScan.status == status.upper())
        
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                VerificationScan.scanned_medicine_name.ilike(s),
                VerificationScan.product_identifier.ilike(s),
                VerificationScan.explanation.ilike(s)
            )
        )
        
    total_count = query.count()
    
    sort_column = getattr(VerificationScan, sort_by, VerificationScan.created_at)
    if order.lower() == "asc":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))
        
    scans = query.offset(skip).limit(limit).all()
    
    return {
        "total": total_count,
        "skip": skip,
        "limit": limit,
        "items": [scan.to_dict() for scan in scans]
    }

@router.get("/{scan_id}")
def get_scan_detail(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(VerificationScan).filter_by(id=scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail=f"Verification scan with ID {scan_id} not found.")
    return scan.to_dict()
