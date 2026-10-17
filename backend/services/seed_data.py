from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.models.medicine import Medicine
from backend.models.scan import VerificationScan
from backend.models.report import SuspiciousReport

SAMPLE_MEDICINES = [
    {
        "product_identifier": "8901234567890",
        "name": "Dolo-650 Tablets",
        "generic_name": "Paracetamol Tablets IP 650mg",
        "manufacturer": "Micro Labs Ltd",
        "batch_number": "DL24098",
        "manufacturing_date": "03/2024",
        "expiry_date": "02/2027",
        "composition": "Each uncoated tablet contains: Paracetamol IP 650 mg",
        "dosage_form": "Tablet",
        "packaging_type": "Blister strip of 15 tablets",
        "mfg_license_no": "KA-B-201/2021",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Benchmark sample record. Clean active batch with no reported alerts."
    },
    {
        "product_identifier": "8902345678901",
        "name": "Augmentin 625 Duo",
        "generic_name": "Amoxycillin and Potassium Clavulanate Tablets IP",
        "manufacturer": "GlaxoSmithKline Pharmaceuticals Ltd",
        "batch_number": "AG7731",
        "manufacturing_date": "05/2024",
        "expiry_date": "04/2026",
        "composition": "Amoxycillin Trihydrate IP eq to Amoxycillin 500mg, Potassium Clavulanate IP eq to Clavulanic Acid 125mg",
        "dosage_form": "Tablet",
        "packaging_type": "Alu-Alu strip of 10 tablets",
        "mfg_license_no": "MH-TZ-49/2020",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Sample verified antibiotic record."
    },
    {
        "product_identifier": "8903456789012",
        "name": "Pantocid 40",
        "generic_name": "Pantoprazole Gastro-resistant Tablets IP 40mg",
        "manufacturer": "Sun Pharmaceutical Industries Ltd",
        "batch_number": "PC9024",
        "manufacturing_date": "01/2024",
        "expiry_date": "12/2026",
        "composition": "Pantoprazole Sodium IP eq to Pantoprazole 40mg",
        "dosage_form": "Tablet",
        "packaging_type": "Alu-Alu strip of 15 tablets",
        "mfg_license_no": "GJ-SUR-102/2019",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Demonstration standard record."
    },
    {
        "product_identifier": "8904567890234",
        "name": "Azithral 500",
        "generic_name": "Azithromycin Tablets IP 500mg",
        "manufacturer": "Alembic Pharmaceuticals Ltd",
        "batch_number": "AZ1120",
        "manufacturing_date": "08/2024",
        "expiry_date": "07/2027",
        "composition": "Azithromycin Dihydrate IP eq to Azithromycin anhydrous 500mg",
        "dosage_form": "Tablet",
        "packaging_type": "Strip of 5 tablets",
        "mfg_license_no": "GJ-VAD-331/2022",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Demonstration standard record."
    },
    {
        "product_identifier": "8905678901245",
        "name": "Telma 40",
        "generic_name": "Telmisartan Tablets IP 40mg",
        "manufacturer": "Glenmark Pharmaceuticals Ltd",
        "batch_number": "TL5541",
        "manufacturing_date": "10/2024",
        "expiry_date": "09/2027",
        "composition": "Telmisartan IP 40mg",
        "dosage_form": "Tablet",
        "packaging_type": "Alu-Alu strip of 15 tablets",
        "mfg_license_no": "HP-SOL-88/2021",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Demonstration anti-hypertensive record."
    },
    {
        "product_identifier": "8906789012356",
        "name": "Asthalin Inhaler 100mcg",
        "generic_name": "Salbutamol Inhalation IP",
        "manufacturer": "Cipla Ltd",
        "batch_number": "AS9912",
        "manufacturing_date": "02/2024",
        "expiry_date": "01/2026",
        "composition": "Each actuation delivers Salbutamol IP 100 mcg",
        "dosage_form": "Inhaler",
        "packaging_type": "Pressurized canister with 200 metered doses",
        "mfg_license_no": "MH-RAI-405/2018",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Registered official batch is AS9912. Use for testing batch discrepancies."
    },
    {
        "product_identifier": "8907890123467",
        "name": "Monocef 1g Injection",
        "generic_name": "Ceftriaxone Injection IP 1000mg",
        "manufacturer": "Aristo Pharmaceuticals Pvt Ltd",
        "batch_number": "MN4432",
        "manufacturing_date": "04/2024",
        "expiry_date": "03/2026",
        "composition": "Ceftriaxone Sodium IP eq to sterile Ceftriaxone 1g",
        "dosage_form": "Injection",
        "packaging_type": "Vial with sterile water for injection",
        "mfg_license_no": "MP-BHP-12/2017",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Authentic manufacturer is Aristo Pharmaceuticals Pvt Ltd. Use for testing fake manufacturer mismatch."
    },
    {
        "product_identifier": "8908901234578",
        "name": "Pan-D Capsules",
        "generic_name": "Pantoprazole and Domperidone Capsules",
        "manufacturer": "Alkem Laboratories Ltd",
        "batch_number": "PD1092",
        "manufacturing_date": "01/2021",
        "expiry_date": "12/2023",  # Intentionally past expiry for test case
        "composition": "Pantoprazole Sodium 40mg (enteric coated), Domperidone 30mg (sustained release)",
        "dosage_form": "Capsule",
        "packaging_type": "Strip of 10 capsules",
        "mfg_license_no": "SK-RAN-55/2019",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "TEST SAMPLE: Expired batch for testing past expiration alerts."
    },
    {
        "product_identifier": "8909012345689",
        "name": "Glycomet-GP 2",
        "generic_name": "Metformin Hydrochloride and Glimepiride Tablets",
        "manufacturer": "USV Private Ltd",
        "batch_number": "GM3319",
        "manufacturing_date": "06/2024",
        "expiry_date": "05/2026",
        "composition": "Metformin Hydrochloride 500mg (SR), Glimepiride 2mg",
        "dosage_form": "Tablet",
        "packaging_type": "Blister strip of 10 tablets",
        "mfg_license_no": "DD-DAM-92/2020",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Standard demonstration anti-diabetic record."
    },
    {
        "product_identifier": "8900123456790",
        "name": "Thyronorm 50mcg",
        "generic_name": "Thyroxine Sodium Tablets IP",
        "manufacturer": "Abbott India Ltd",
        "batch_number": "TH8810",
        "manufacturing_date": "11/2024",
        "expiry_date": "10/2026",
        "composition": "Thyroxine Sodium IP equivalent to anhydrous Thyroxine Sodium 50 mcg",
        "dosage_form": "Tablet",
        "packaging_type": "Bottle of 120 tablets",
        "mfg_license_no": "MH-MUM-71/2021",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Standard demonstration endocrine medication."
    },
    {
        "product_identifier": "8901122334455",
        "name": "Calpol 500mg Tablets",
        "generic_name": "Paracetamol Tablets IP 500mg",
        "manufacturer": "GlaxoSmithKline Pharmaceuticals Ltd",
        "batch_number": "CP4421",
        "manufacturing_date": "07/2024",
        "expiry_date": "06/2026",
        "composition": "Paracetamol IP 500mg",
        "dosage_form": "Tablet",
        "packaging_type": "Blister strip of 15 tablets",
        "mfg_license_no": "TN-CHE-19/2020",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Standard pediatric/adult antipyretic demonstration sample."
    },
    {
        "product_identifier": "8902233445566",
        "name": "Montair-LC Tablets",
        "generic_name": "Montelukast and Levocetirizine Tablets",
        "manufacturer": "Cipla Ltd",
        "batch_number": "ML6614",
        "manufacturing_date": "09/2024",
        "expiry_date": "08/2026",
        "composition": "Montelukast Sodium 10mg, Levocetirizine Dihydrochloride 5mg",
        "dosage_form": "Tablet",
        "packaging_type": "Alu-Alu strip of 10 tablets",
        "mfg_license_no": "MH-KUR-82/2022",
        "source_name": "Sample CDSCO Demonstration Database",
        "source_type": "SAMPLE_DATABASE",
        "is_sample_data": True,
        "verification_notes": "Standard demonstration antihistamine record."
    }
]

def seed_database(db: Session, force: bool = False):
    """Seed the database with standard demonstration medicines and initial scans."""
    existing_count = db.query(Medicine).count()
    if existing_count > 0 and not force:
        return existing_count

    for med_data in SAMPLE_MEDICINES:
        existing = db.query(Medicine).filter_by(product_identifier=med_data["product_identifier"]).first()
        if not existing:
            med = Medicine(**med_data)
            db.add(med)
    
    db.commit()

    # Seed sample verification scans for initial dashboard and history
    if db.query(VerificationScan).count() == 0:
        sample_scans = [
            VerificationScan(
                user_id="demo-user-1",
                product_identifier="8901234567890",
                scanned_medicine_name="Dolo-650 Tablets",
                extracted_details_json='{"name":"Dolo-650 Tablets","manufacturer":"Micro Labs Ltd","batch_number":"DL24098","expiry_date":"02/2027"}',
                status="VERIFIED",
                explanation="All submitted parameters (Product Code, Manufacturer, Batch DL24098, Expiry 02/2027) precisely match active records in the sample verified registry.",
                mismatched_fields_json='[]',
                matched_fields_json='[{"field_name":"Product Identifier","is_match":true},{"field_name":"Medicine Name","is_match":true},{"field_name":"Manufacturer","is_match":true},{"field_name":"Batch Number","is_match":true}]',
                verification_method="QR_BARCODE",
            ),
            VerificationScan(
                user_id="demo-user-1",
                product_identifier="8906789012356",
                scanned_medicine_name="Asthalin Inhaler",
                extracted_details_json='{"name":"Asthalin Inhaler","manufacturer":"Cipla Ltd","batch_number":"AS9999-TAMPERED","expiry_date":"01/2026"}',
                status="SUSPICIOUS",
                explanation="Batch number mismatch detected. The scanned packaging indicates batch AS9999-TAMPERED, but the official registered batch for this product is AS9912.",
                mismatched_fields_json='[{"field_name":"Batch Number","submitted_value":"AS9999-TAMPERED","database_value":"AS9912","is_match":false,"notes":"Batch code not recognized for this product"}]',
                matched_fields_json='[{"field_name":"Product Identifier","is_match":true},{"field_name":"Manufacturer","is_match":true}]',
                verification_method="IMAGE_OCR",
            ),
            VerificationScan(
                user_id="demo-user-1",
                product_identifier="8909999999999",
                scanned_medicine_name="Unknown Cough Syrup",
                extracted_details_json='{"name":"Unknown Cough Syrup","batch_number":"UN901"}',
                status="UNABLE_TO_VERIFY",
                explanation="No corresponding record was found in the sample verified database for product code 8909999999999. This does not automatically indicate counterfeit product, as many regional medications are not cataloged.",
                mismatched_fields_json='[]',
                matched_fields_json='[]',
                verification_method="MANUAL_ENTRY",
            ),
            VerificationScan(
                user_id="demo-user-1",
                product_identifier="8908901234578",
                scanned_medicine_name="Pan-D Capsules",
                extracted_details_json='{"name":"Pan-D Capsules","manufacturer":"Alkem Laboratories Ltd","batch_number":"PD1092","expiry_date":"12/2023"}',
                status="SUSPICIOUS",
                explanation="Product expiry alert: The recorded expiry date (12/2023) has passed. Expired medications may pose severe health risks due to chemical degradation.",
                mismatched_fields_json='[{"field_name":"Expiry Date","submitted_value":"12/2023","database_value":"12/2023","is_match":false,"notes":"Expired medication warning"}]',
                matched_fields_json='[{"field_name":"Product Identifier","is_match":true},{"field_name":"Batch Number","is_match":true}]',
                verification_method="QR_BARCODE",
            )
        ]
        db.add_all(sample_scans)
        db.commit()

    # Seed sample reports
    if db.query(SuspiciousReport).count() == 0:
        sample_reports = [
            SuspiciousReport(
                report_reference="MV-REP-2026-X8801",
                user_id="demo-user-1",
                medicine_name="Asthalin Inhaler 100mcg",
                manufacturer="Cipla Ltd (Claimed)",
                batch_number="AS9999-TAMPERED",
                expiry_date="01/2026",
                purchase_location="Subhash Chemist, Sadar Bazar, Delhi",
                suspicion_reason="Batch number mismatch",
                description="The packaging foil printing had blurred edges and the batch number did not match the official QR barcode encoding.",
                status="UNDER_REVIEW",
                contact_info="evaluator@medverify.demo"
            ),
            SuspiciousReport(
                report_reference="MV-REP-2026-W4192",
                user_id="demo-user-2",
                medicine_name="Monocef 1g Injection",
                manufacturer="Apex Remedies (Suspected Fake)",
                batch_number="MN9910",
                expiry_date="03/2025",
                purchase_location="Local Clinic Store, Kanpur",
                suspicion_reason="Manufacturer details differ",
                description="Monocef is normally manufactured by Aristo Pharmaceuticals, but packaging claimed Apex Remedies with peeling label.",
                status="SUBMITTED",
                contact_info="citizen.alert@medverify.demo"
            )
        ]
        db.add_all(sample_reports)
        db.commit()

    return db.query(Medicine).count()
