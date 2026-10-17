from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.database import get_db
from backend.models.medicine import Medicine
from backend.schemas.medicine import MedicineResponse

router = APIRouter(prefix="/medicines", tags=["Medicines"])

@router.get("", response_model=List[MedicineResponse])
def list_medicines(
    search: Optional[str] = Query(None, description="Search by name, manufacturer, or product ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Medicine)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Medicine.name.ilike(s),
                Medicine.manufacturer.ilike(s),
                Medicine.product_identifier.ilike(s),
                Medicine.batch_number.ilike(s)
            )
        )
    return query.offset(skip).limit(limit).all()

@router.get("/{product_id}", response_model=MedicineResponse)
def get_medicine(product_id: str, db: Session = Depends(get_db)):
    clean_id = product_id.strip()
    medicine = db.query(Medicine).filter(
        or_(
            Medicine.product_identifier == clean_id,
            Medicine.id == int(clean_id) if clean_id.isdigit() else False
        )
    ).first()
    
    if not medicine:
        raise HTTPException(
            status_code=404,
            detail=f"Medicine record with identifier '{product_id}' not found in demonstration registry."
        )
    return medicine
