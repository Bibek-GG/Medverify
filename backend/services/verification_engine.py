import re
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple
from sqlalchemy.orm import Session
from backend.models.medicine import Medicine
from backend.models.scan import VerificationScan
from backend.schemas.medicine import VerifyRequest, VerifyResponse, FieldComparison

def normalize_text(text: Optional[str]) -> str:
    if not text:
        return ""
    # remove punctuation and extra spaces, lowercase
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    return " ".join(cleaned.split())

def is_expired(expiry_str: Optional[str]) -> Tuple[bool, Optional[str]]:
    """Checks if expiry date formatted as MM/YY, MM/YYYY, or YYYY-MM is past."""
    if not expiry_str:
        return False, None
    
    now = datetime.now()
    cleaned = expiry_str.strip()
    
    # Try formats
    formats = ["%m/%y", "%m/%Y", "%Y-%m", "%d/%m/%Y", "%m-%Y", "%Y/%m"]
    for fmt in formats:
        try:
            parsed = datetime.strptime(cleaned, fmt)
            # If format had no day, assume end of month
            if "%d" not in fmt:
                # end of that month: advance to next month 1st day then subtract 1 second
                month = parsed.month
                year = parsed.year
                if month == 12:
                    month_end = datetime(year + 1, 1, 1)
                else:
                    month_end = datetime(year, month + 1, 1)
                if month_end < now:
                    return True, f"Expired on {expiry_str}"
            else:
                if parsed < now:
                    return True, f"Expired on {expiry_str}"
            return False, None
        except ValueError:
            continue
            
    return False, None

def fuzzy_match(submitted: Optional[str], registered: Optional[str]) -> bool:
    if not submitted or not registered:
        return True # if not provided, skip hard failure
    s_norm = normalize_text(submitted)
    r_norm = normalize_text(registered)
    if s_norm in r_norm or r_norm in s_norm:
        return True
    return False

def verify_medicine(db: Session, request: VerifyRequest) -> VerifyResponse:
    # 1. Search for matching product in database
    product_record: Optional[Medicine] = None
    
    if request.product_identifier:
        clean_id = request.product_identifier.strip()
        product_record = db.query(Medicine).filter_by(product_identifier=clean_id).first()
        
    if not product_record and request.name:
        # Search by name match
        norm_req_name = normalize_text(request.name)
        all_meds = db.query(Medicine).all()
        for m in all_meds:
            norm_db_name = normalize_text(m.name)
            if norm_req_name in norm_db_name or norm_db_name in norm_req_name:
                product_record = m
                break

    matched_fields: List[FieldComparison] = []
    mismatched_fields: List[FieldComparison] = []
    status = "UNABLE_TO_VERIFY"
    headline = ""
    explanation = ""
    recommended_steps: List[str] = []

    # CASE A: Product not found in database
    if not product_record:
        status = "UNABLE_TO_VERIFY"
        headline = "Product Record Not Found in Demonstration Registry"
        explanation = (
            f"No matching product entry was found in the configured sample database for identifier "
            f"'{request.product_identifier or request.name or 'provided details'}'. "
            "Important: A record absence in this demo database does NOT indicate that the medicine is fake or substandard. "
            "Many authentic products and regional formulations are not currently cataloged in this demonstration system."
        )
        recommended_steps = [
            "Check that the barcode number or product code was entered or scanned correctly.",
            "Verify the packaging details directly with the dispensing chemist or hospital pharmacy.",
            "Contact the pharmaceutical manufacturer customer care phone printed on the packaging.",
            "Submit a non-emergency inquiry report through MedVerify if packaging appears suspicious."
        ]

    # CASE B: Product record found -> Compare attributes
    else:
        # 1. Product identifier
        if request.product_identifier:
            if request.product_identifier.strip() == product_record.product_identifier:
                matched_fields.append(FieldComparison(
                    field_name="Product Identifier (GTIN/Barcode)",
                    submitted_value=request.product_identifier,
                    database_value=product_record.product_identifier,
                    is_match=True,
                    notes="Identifier matches registered catalog entry"
                ))
            else:
                mismatched_fields.append(FieldComparison(
                    field_name="Product Identifier",
                    submitted_value=request.product_identifier,
                    database_value=product_record.product_identifier,
                    is_match=False,
                    notes="Submitted product identifier does not match catalog"
                ))

        # 2. Medicine Name
        if request.name:
            if fuzzy_match(request.name, product_record.name):
                matched_fields.append(FieldComparison(
                    field_name="Medicine Brand Name",
                    submitted_value=request.name,
                    database_value=product_record.name,
                    is_match=True,
                    notes="Product name matches registered trade description"
                ))
            else:
                mismatched_fields.append(FieldComparison(
                    field_name="Medicine Brand Name",
                    submitted_value=request.name,
                    database_value=product_record.name,
                    is_match=False,
                    notes=f"Catalog record lists name as '{product_record.name}'"
                ))

        # 3. Manufacturer
        if request.manufacturer:
            if fuzzy_match(request.manufacturer, product_record.manufacturer):
                matched_fields.append(FieldComparison(
                    field_name="Manufacturer",
                    submitted_value=request.manufacturer,
                    database_value=product_record.manufacturer,
                    is_match=True,
                    notes="Manufacturer entity confirmed with catalog entry"
                ))
            else:
                mismatched_fields.append(FieldComparison(
                    field_name="Manufacturer",
                    submitted_value=request.manufacturer,
                    database_value=product_record.manufacturer,
                    is_match=False,
                    notes=f"Conflict: Scanned manufacturer '{request.manufacturer}' differs from registered entity '{product_record.manufacturer}'"
                ))

        # 4. Batch Number
        if request.batch_number:
            sub_batch = request.batch_number.strip().upper()
            db_batch = product_record.batch_number.strip().upper()
            if sub_batch == db_batch:
                matched_fields.append(FieldComparison(
                    field_name="Batch / Lot Number",
                    submitted_value=request.batch_number,
                    database_value=product_record.batch_number,
                    is_match=True,
                    notes="Batch lot number matches authorized manufacturing record"
                ))
            else:
                mismatched_fields.append(FieldComparison(
                    field_name="Batch / Lot Number",
                    submitted_value=request.batch_number,
                    database_value=product_record.batch_number,
                    is_match=False,
                    notes=f"Discrepancy: Packaging indicates batch '{request.batch_number}', but registry record lists batch '{product_record.batch_number}'"
                ))

        # 5. Expiry Date & Expiration Check
        exp_to_check = request.expiry_date or product_record.expiry_date
        past_due, exp_reason = is_expired(exp_to_check)
        
        if request.expiry_date:
            sub_exp = request.expiry_date.strip()
            db_exp = product_record.expiry_date.strip()
            if sub_exp == db_exp or sub_exp in db_exp or db_exp in sub_exp:
                matched_fields.append(FieldComparison(
                    field_name="Expiry Date",
                    submitted_value=request.expiry_date,
                    database_value=product_record.expiry_date,
                    is_match=True,
                    notes="Expiry date aligns with batch validity period"
                ))
            else:
                mismatched_fields.append(FieldComparison(
                    field_name="Expiry Date",
                    submitted_value=request.expiry_date,
                    database_value=product_record.expiry_date,
                    is_match=False,
                    notes=f"Discrepancy: Submitted expiry '{request.expiry_date}' differs from registered date '{product_record.expiry_date}'"
                ))

        # 6. Evaluation of outcome
        if past_due:
            status = "SUSPICIOUS"
            headline = "Product Expired — Safety Warning"
            explanation = (
                f"The medicine packaging indicates an expiry date ({exp_to_check}) which has already elapsed. "
                "Consuming expired medication can lead to reduced efficacy, toxic chemical degradation, or severe adverse health complications. "
                "Do not ingest this medicine."
            )
            recommended_steps = [
                "Do NOT consume or administer this expired medication.",
                "Safely quarantine the packaging and return it to the dispensing pharmacy for proper disposal.",
                "Request a replacement batch with valid shelf-life from your licensed pharmacist.",
                "Submit a report if an expired product was sold without disclosure."
            ]
        elif len(mismatched_fields) > 0:
            status = "SUSPICIOUS"
            discrepancy_list = ", ".join([f.field_name for f in mismatched_fields])
            headline = "Inconsistencies Detected with Registered Records"
            explanation = (
                f"One or more submitted details ({discrepancy_list}) do not match the registered records in the database. "
                "Some details do not match the available records. This does not independently prove that the medicine is counterfeit. "
                "Do not rely on this result alone; seek confirmation from a pharmacist, manufacturer, or appropriate drug authority."
            )
            recommended_steps = [
                "Check for typographical errors or OCR misreads and re-verify the packaging.",
                "Compare the physical security hologram, packaging seal, and blister foil against verified samples.",
                "Immediately contact the dispensing chemist and the manufacturer customer relations.",
                "Submit a suspicious medicine report on this portal with photos for further documentation."
            ]
        else:
            # All available details match
            status = "VERIFIED"
            headline = "Product Details Match Demonstration Database Records"
            explanation = (
                f"All submitted information for '{product_record.name}' matches the registered catalog record in the demonstration database. "
                "This verification confirms that the scanned identifier, batch ({product_record.batch_number}), and manufacturer align with our record. "
                "Please note: A matching database record confirms digital consistency but cannot independently guarantee physical chemical authenticity or tamper-free storage."
            )
            recommended_steps = [
                "Inspect the physical packaging seal, foil backing, and blister integrity before opening.",
                "Ensure the medicine has been stored according to package instructions (cool, dry place or refrigeration).",
                "Only consume medicines dispensed with a valid tax invoice from a licensed pharmacy.",
                "Consult your doctor or pharmacist if physical appearance or pill color looks unusual."
            ]

    disclaimer = (
        "MedVerify India provides preliminary information checks. "
        "A matching code or package image cannot independently establish medicine authenticity. "
        "This tool checks available product information and identifies potential inconsistencies. "
        "It cannot conclusively determine whether a physical medicine package is genuine or whether its contents are safe. "
        "Never alter prescribed medical treatment without guidance from a licensed physician or healthcare professional."
    )

    # Save verification scan to database
    scan_entry = VerificationScan(
        user_id=request.user_id or "anonymous-session",
        product_identifier=request.product_identifier or (product_record.product_identifier if product_record else None),
        scanned_medicine_name=request.name or (product_record.name if product_record else "Unidentified Product"),
        extracted_details_json=request.model_dump_json(),
        status=status,
        explanation=explanation,
        mismatched_fields_json=str([m.model_dump() for m in mismatched_fields]).replace("'", '"'),
        matched_fields_json=str([m.model_dump() for m in matched_fields]).replace("'", '"'),
        verification_method=request.verification_method or "MANUAL_ENTRY",
    )
    db.add(scan_entry)
    db.commit()
    db.refresh(scan_entry)

    return VerifyResponse(
        scan_id=scan_entry.id,
        status=status,
        headline=headline,
        explanation=explanation,
        disclaimer=disclaimer,
        product_identifier=scan_entry.product_identifier,
        scanned_details=request.model_dump(),
        database_record=product_record.to_dict() if product_record else None,
        matched_fields=matched_fields,
        mismatched_fields=mismatched_fields,
        recommended_steps=recommended_steps,
        created_at=scan_entry.created_at.isoformat() if scan_entry.created_at else datetime.now(timezone.utc).isoformat(),
    )
