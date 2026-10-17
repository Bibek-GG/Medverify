from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.database import Base

class SuspiciousReport(Base):
    __tablename__ = "suspicious_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_reference = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(String(100), nullable=True, index=True)
    medicine_name = Column(String(200), nullable=False)
    manufacturer = Column(String(200), nullable=True)
    batch_number = Column(String(100), nullable=True)
    expiry_date = Column(String(50), nullable=True)
    purchase_location = Column(String(250), nullable=True)  # Store name, address or city
    suspicion_reason = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    image_path = Column(String(300), nullable=True)
    contact_info = Column(String(150), nullable=True)
    status = Column(String(50), default="SUBMITTED", index=True)  # SUBMITTED | UNDER_REVIEW | RESOLVED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "report_reference": self.report_reference,
            "user_id": self.user_id,
            "medicine_name": self.medicine_name,
            "manufacturer": self.manufacturer,
            "batch_number": self.batch_number,
            "expiry_date": self.expiry_date,
            "purchase_location": self.purchase_location,
            "suspicion_reason": self.suspicion_reason,
            "description": self.description,
            "image_path": self.image_path,
            "contact_info": self.contact_info,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
