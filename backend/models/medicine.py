from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from backend.database import Base

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    product_identifier = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(200), index=True, nullable=False)
    generic_name = Column(String(200), nullable=True)
    manufacturer = Column(String(200), index=True, nullable=False)
    batch_number = Column(String(100), index=True, nullable=False)
    manufacturing_date = Column(String(50), nullable=True)
    expiry_date = Column(String(50), nullable=False)
    composition = Column(Text, nullable=True)
    dosage_form = Column(String(100), nullable=True)  # Tablet, Syrup, Injection, Capsule
    packaging_type = Column(String(100), nullable=True)  # Strip of 10, 100ml Bottle, Vial
    mfg_license_no = Column(String(100), nullable=True)
    
    # Metadata
    source_name = Column(String(200), default="Sample Verified Drug Registry (Demonstration Data)")
    source_type = Column(String(100), default="SAMPLE_DATABASE")
    record_updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_sample_data = Column(Boolean, default=True)
    verification_notes = Column(Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "product_identifier": self.product_identifier,
            "name": self.name,
            "generic_name": self.generic_name,
            "manufacturer": self.manufacturer,
            "batch_number": self.batch_number,
            "manufacturing_date": self.manufacturing_date,
            "expiry_date": self.expiry_date,
            "composition": self.composition,
            "dosage_form": self.dosage_form,
            "packaging_type": self.packaging_type,
            "mfg_license_no": self.mfg_license_no,
            "source_name": self.source_name,
            "source_type": self.source_type,
            "record_updated_at": self.record_updated_at.isoformat() if self.record_updated_at else None,
            "is_sample_data": self.is_sample_data,
            "verification_notes": self.verification_notes,
        }
