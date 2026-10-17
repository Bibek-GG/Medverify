import json
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.database import Base

class VerificationScan(Base):
    __tablename__ = "verification_scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=True, index=True)  # Demo session ID or user ID
    product_identifier = Column(String(100), nullable=True, index=True)
    scanned_medicine_name = Column(String(200), nullable=True)
    
    # JSON-encoded payload and results
    extracted_details_json = Column(Text, nullable=False, default="{}")
    status = Column(String(50), nullable=False, index=True)  # VERIFIED | SUSPICIOUS | UNABLE_TO_VERIFY
    explanation = Column(Text, nullable=False)
    mismatched_fields_json = Column(Text, nullable=False, default="[]")
    matched_fields_json = Column(Text, nullable=False, default="[]")
    
    verification_method = Column(String(50), default="MANUAL_ENTRY")  # QR_BARCODE | IMAGE_OCR | MANUAL_ENTRY
    image_path = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    @property
    def extracted_details(self):
        try:
            return json.loads(self.extracted_details_json or "{}")
        except Exception:
            return {}

    @extracted_details.setter
    def extracted_details(self, val):
        self.extracted_details_json = json.dumps(val or {})

    @property
    def mismatched_fields(self):
        try:
            return json.loads(self.mismatched_fields_json or "[]")
        except Exception:
            return []

    @mismatched_fields.setter
    def mismatched_fields(self, val):
        self.mismatched_fields_json = json.dumps(val or [])

    @property
    def matched_fields(self):
        try:
            return json.loads(self.matched_fields_json or "[]")
        except Exception:
            return []

    @matched_fields.setter
    def matched_fields(self, val):
        self.matched_fields_json = json.dumps(val or [])

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_identifier": self.product_identifier,
            "scanned_medicine_name": self.scanned_medicine_name,
            "extracted_details": self.extracted_details,
            "status": self.status,
            "explanation": self.explanation,
            "mismatched_fields": self.mismatched_fields,
            "matched_fields": self.matched_fields,
            "verification_method": self.verification_method,
            "image_path": self.image_path,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
