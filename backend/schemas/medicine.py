from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class MedicineBase(BaseModel):
    product_identifier: str
    name: str
    generic_name: Optional[str] = None
    manufacturer: str
    batch_number: str
    manufacturing_date: Optional[str] = None
    expiry_date: str
    composition: Optional[str] = None
    dosage_form: Optional[str] = None
    packaging_type: Optional[str] = None
    mfg_license_no: Optional[str] = None
    source_name: Optional[str] = "Sample Verified Drug Registry (Demonstration Data)"
    source_type: Optional[str] = "SAMPLE_DATABASE"
    is_sample_data: bool = True
    verification_notes: Optional[str] = None

class MedicineResponse(MedicineBase):
    id: int
    record_updated_at: Optional[Any] = None

    model_config = ConfigDict(from_attributes=True)

# Verification Input Schemas
class VerifyRequest(BaseModel):
    product_identifier: Optional[str] = Field(None, description="GTIN, Barcode, or Product Code")
    name: Optional[str] = Field(None, description="Medicine Name")
    manufacturer: Optional[str] = Field(None, description="Manufacturer")
    batch_number: Optional[str] = Field(None, description="Batch Number")
    expiry_date: Optional[str] = Field(None, description="Expiry Date (e.g., MM/YY, YYYY-MM, or MM/YYYY)")
    verification_method: Optional[str] = Field("MANUAL_ENTRY", description="QR_BARCODE, IMAGE_OCR, or MANUAL_ENTRY")
    user_id: Optional[str] = None

# Comparison Field Detail
class FieldComparison(BaseModel):
    field_name: str
    submitted_value: Optional[str] = None
    database_value: Optional[str] = None
    is_match: bool
    notes: Optional[str] = None

# Verification Output Schema
class VerifyResponse(BaseModel):
    scan_id: int
    status: str  # VERIFIED | SUSPICIOUS | UNABLE_TO_VERIFY
    headline: str
    explanation: str
    disclaimer: str
    product_identifier: Optional[str]
    scanned_details: Dict[str, Any]
    database_record: Optional[Dict[str, Any]] = None
    matched_fields: List[FieldComparison]
    mismatched_fields: List[FieldComparison]
    recommended_steps: List[str]
    created_at: str

# OCR / Packaging extraction response
class OCRExtractResponse(BaseModel):
    extracted_text: str
    detected_fields: Dict[str, Optional[str]]
    confidence_score: float
    preprocessing_notes: List[str]
    image_url: Optional[str] = None

# Suspicious Report Schemas
class ReportCreateRequest(BaseModel):
    medicine_name: str
    manufacturer: Optional[str] = None
    batch_number: Optional[str] = None
    expiry_date: Optional[str] = None
    purchase_location: Optional[str] = None
    suspicion_reason: str
    description: str
    image_path: Optional[str] = None
    contact_info: Optional[str] = None
    user_id: Optional[str] = None

class ReportResponse(BaseModel):
    id: int
    report_reference: str
    medicine_name: str
    manufacturer: Optional[str]
    batch_number: Optional[str]
    expiry_date: Optional[str]
    purchase_location: Optional[str]
    suspicion_reason: str
    description: str
    image_path: Optional[str]
    contact_info: Optional[str]
    status: str
    created_at: Optional[Any] = None

    model_config = ConfigDict(from_attributes=True)

# Dashboard Stats Schemas
class DashboardStatsResponse(BaseModel):
    total_scans: int
    verified_matches: int
    suspicious_count: int
    unable_to_verify_count: int
    reports_submitted: int
    recent_scans: List[Dict[str, Any]]
    status_distribution: List[Dict[str, Any]]
    monthly_trend: List[Dict[str, Any]]
    demo_mode: bool
    notice: str
