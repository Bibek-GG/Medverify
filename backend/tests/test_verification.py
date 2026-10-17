import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database import Base, engine, SessionLocal
from backend.services.seed_data import seed_database

@pytest.fixture(scope="module")
def client():
    # Initialize DB & Seed
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db, force=True)
    db.close()
    
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "MedVerify India"

def test_list_medicines(client):
    response = client.get("/api/medicines")
    assert response.status_code == 200
    medicines = response.json()
    assert len(medicines) >= 10
    
    # Check Dolo exists
    dolo = next((m for m in medicines if "Dolo" in m["name"]), None)
    assert dolo is not None
    assert dolo["product_identifier"] == "8901234567890"

def test_get_single_medicine(client):
    response = client.get("/api/medicines/8901234567890")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Dolo-650 Tablets"
    assert data["manufacturer"] == "Micro Labs Ltd"

def test_verify_match_success(client):
    payload = {
        "product_identifier": "8901234567890",
        "name": "Dolo-650 Tablets",
        "manufacturer": "Micro Labs Ltd",
        "batch_number": "DL24098",
        "expiry_date": "02/2027",
        "verification_method": "QR_BARCODE"
    }
    response = client.post("/api/verify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "VERIFIED"
    assert len(data["mismatched_fields"]) == 0
    assert len(data["matched_fields"]) >= 3
    assert "preliminary information checks" in data["disclaimer"]

def test_verify_batch_mismatch_suspicious(client):
    payload = {
        "product_identifier": "8906789012356",
        "name": "Asthalin Inhaler 100mcg",
        "manufacturer": "Cipla Ltd",
        "batch_number": "FAKE-BATCH-999",  # Real is AS9912
        "expiry_date": "01/2026",
        "verification_method": "IMAGE_OCR"
    }
    response = client.post("/api/verify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUSPICIOUS"
    assert len(data["mismatched_fields"]) > 0
    assert any(m["field_name"] == "Batch / Lot Number" for m in data["mismatched_fields"])

def test_verify_manufacturer_mismatch_suspicious(client):
    payload = {
        "product_identifier": "8907890123467",
        "name": "Monocef 1g Injection",
        "manufacturer": "Counterfeit Labs Ltd",  # Real is Aristo Pharmaceuticals Pvt Ltd
        "batch_number": "MN4432",
        "verification_method": "MANUAL_ENTRY"
    }
    response = client.post("/api/verify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUSPICIOUS"
    assert any(m["field_name"] == "Manufacturer" for m in data["mismatched_fields"])

def test_verify_expired_medicine_suspicious(client):
    payload = {
        "product_identifier": "8908901234578",  # Pan-D expired in 12/2023
        "name": "Pan-D Capsules",
        "batch_number": "PD1092",
        "expiry_date": "12/2023"
    }
    response = client.post("/api/verify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUSPICIOUS"
    assert "Expired" in data["headline"] or "expired" in data["explanation"].lower()

def test_verify_unknown_product(client):
    payload = {
        "product_identifier": "9999999999999",
        "name": "Unregistered Syrup",
        "batch_number": "XYZ99"
    }
    response = client.post("/api/verify", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "UNABLE_TO_VERIFY"
    assert "Not Found" in data["headline"]

def test_submit_report_and_lookup(client):
    report_data = {
        "medicine_name": "Suspicious Antibiotic",
        "manufacturer": "Unknown Entity",
        "batch_number": "TAMPER123",
        "expiry_date": "05/2025",
        "purchase_location": "Small Clinic Pharmacy, Lucknow",
        "suspicion_reason": "Damaged or unusual packaging",
        "description": "Foil seal was already open and batch imprint was smudged.",
        "contact_info": "doctor.test@example.com"
    }
    create_resp = client.post("/api/reports", json=report_data)
    assert create_resp.status_code == 200
    created = create_resp.json()
    assert "report_reference" in created
    assert created["status"] == "SUBMITTED"
    
    # Test lookup by reference
    ref_id = created["report_reference"]
    get_resp = client.get(f"/api/reports/{ref_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["report_reference"] == ref_id

def test_dashboard_stats(client):
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_scans"] >= 4
    assert stats["verified_matches"] >= 1
    assert stats["suspicious_count"] >= 1
    assert stats["unable_to_verify_count"] >= 1
    assert len(stats["status_distribution"]) == 3
    assert stats["demo_mode"] is True

def test_history_list(client):
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) >= 4
