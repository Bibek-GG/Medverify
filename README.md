# MedVerify India — Fake or Suspicious Medicine Verification System

A complete, full-stack, responsive healthcare application built to help Indian consumers, pharmacists, and medical compliance testers verify pharmaceutical packaging, detect potential discrepancies against registered medicine catalog records, flag suspicious products, and access surveillance insights.

> **Important Healthcare Safety Notice:**  
> MedVerify India provides preliminary digital consistency checks against configured database records. A matching barcode or packaging image **cannot independently establish physical chemical authenticity, pharmaceutical purity, or tamper-free storage**. Never discontinue or alter prescribed medical treatments without direct guidance from a licensed physician or registered pharmacist.

---

## 1. Key Features

- **Multi-Modal Verification Engine:**
  - **Method A (QR / Barcode Scanning):** In-browser live camera scanning (powered by `html5-qrcode` / `ZXing`) supporting GS1 2D DataMatrix codes mandated under CDSCO Rule 96(5B) and standard EAN-13 barcodes.
  - **Method B (Packaging Photograph OCR):** Drag-and-drop photograph upload with OpenCV computer vision preprocessing (CLAHE contrast normalization, bilateral smoothing) and text extraction for batch numbers, manufacturing licenses, and expiry dates.
  - **Editable Confirmation:** Users can review and adjust extracted OCR details before executing a 1-click database query.
- **Three-Tier Verification Outcomes:**
  - **VERIFIED:** Available parameters precisely match active catalog records. Includes celebratory feedback, field breakdown table, and caveat regarding physical storage inspection.
  - **SUSPICIOUS:** Inconsistencies detected (such as tampered batch codes, conflicting manufacturer entities, or elapsed expiry dates). Explains exact field differences and offers an immediate 1-click report workflow.
  - **UNABLE TO VERIFY:** Record absence explained neutrally (record absence does not automatically indicate counterfeit goods, as many authentic regional medicines are uncataloged).
- **Incident Reporting System:**
  - Submit formal suspicious drug reports with purchase pharmacy location, suspicion reason, photos, and descriptions.
  - Generates unique tracking reference IDs (`MV-2026-XXXXX`).
  - Searchable "Track Report Status" portal to monitor review progress (`SUBMITTED`, `UNDER_REVIEW`, `ACTION_TAKEN`).
- **Audit History & Certificate Printing:**
  - Searchable, filterable, and sortable audit log of past scans with pagination.
  - Detailed modal inspector and clean print stylesheet (`window.print()`) for saving verification certificates.
- **Interactive Surveillance Dashboard:**
  - Key metrics: Total Scans, Verified Matches, Suspicious Alerts, Uncataloged Scans, User Reports.
  - Recharts visualizations: Outcome Distribution Donut Chart and Weekly Verification Timeline Trend.
  - Live activity feed of recent verification queries.
- **One-Click Evaluator Test Presets:**
  - Built-in test case selectors allowing instant testing of all three verification outcomes without requiring physical medicine packaging.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS 3.4, Lucide Icons, Recharts, Canvas-Confetti, Html5-QRCode |
| **Backend** | Python 3.12, FastAPI, Pydantic v2, Uvicorn, Python-Multipart |
| **Database & ORM** | SQLAlchemy 2.0, Alembic migrations, PostgreSQL 16 (with zero-config SQLite for local dev) |
| **Computer Vision / OCR** | OpenCV (`cv2`), Pillow, Pytesseract (with fallback packaging analysis) |
| **DevOps / Containers** | Docker, Docker Compose, Nginx |

---

## 3. Project Directory Structure

```
MediCare/
├── backend/
│   ├── alembic/              # Alembic migration environment and versions
│   │   ├── versions/         # Migration revisions
│   │   └── env.py
│   ├── models/               # SQLAlchemy ORM Models
│   │   ├── medicine.py       # Medicine catalog record
│   │   ├── scan.py           # VerificationScan audit log
│   │   └── report.py         # SuspiciousReport incident model
│   ├── routes/               # FastAPI modular endpoints
│   │   ├── health.py         # GET /api/health
│   │   ├── medicines.py      # GET /api/medicines, GET /api/medicines/{id}
│   │   ├── verify.py         # POST /api/verify, POST /api/verify/image
│   │   ├── reports.py        # POST /api/reports, GET /api/reports/{id}
│   │   ├── history.py        # GET /api/history, GET /api/history/{id}
│   │   └── dashboard.py      # GET /api/dashboard/stats
│   ├── schemas/              # Pydantic v2 validation models
│   │   └── medicine.py
│   ├── services/             # Core business logic
│   │   ├── verification_engine.py  # Matching rules & discrepancy algorithms
│   │   ├── ocr_service.py          # OpenCV preprocessing & packaging OCR
│   │   ├── report_service.py       # Reference code generator & reporting
│   │   └── seed_data.py            # 12+ fictional sample test medicines
│   ├── tests/                # Automated pytest suite
│   │   └── test_verification.py   # 11 unit & integration tests
│   ├── config.py             # Settings, directories, CORS, file limits
│   ├── database.py           # Engine & SessionLocal session generator
│   ├── main.py               # FastAPI application entrypoint
│   ├── Dockerfile            # Container definition for backend
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx            # Sticky navigation with demo badge
│   │   │   ├── Footer.jsx            # Healthcare helpline & CDSCO links
│   │   │   ├── CameraScanner.jsx     # Live html5-qrcode video scanner
│   │   │   ├── DemoPresetSelector.jsx# 1-click test scenario autofill
│   │   │   └── DisclaimerBanner.jsx  # Safety notices
│   │   ├── pages/            # Application views
│   │   │   ├── HomePage.jsx          # Hero, Trust, How It Works, Features
│   │   │   ├── VerifyPage.jsx        # Dual-mode scanner & confirmation
│   │   │   ├── ResultPage.jsx        # 3-tier results, comparisons, print
│   │   │   ├── ReportPage.jsx        # Incident report form & tracker
│   │   │   ├── HistoryPage.jsx       # Audit log, search, filters, modal
│   │   │   ├── DashboardPage.jsx     # Recharts metrics & telemetry
│   │   │   ├── HowItWorksPage.jsx    # Indian pharma serialization guide
│   │   │   └── AboutPage.jsx         # Architecture & public health mission
│   │   ├── services/
│   │   │   └── api.js        # Axios API client
│   │   ├── App.jsx           # Main state management & view routing
│   │   ├── index.css         # Tailwind directives & design tokens
│   │   └── main.jsx          # React DOM entry
│   ├── Dockerfile            # Multi-stage production container
│   ├── nginx.conf            # Nginx reverse proxy configuration
│   ├── tailwind.config.js    # Medical-tech design system
│   └── vite.config.js        # Vite dev server & proxy settings
├── .env.example              # Environment variables template
├── alembic.ini               # Alembic configuration file
├── docker-compose.yml        # Full-stack Docker orchestration
└── README.md                 # Documentation
```

---

## 4. Local Installation & Setup

### Prerequisites
- Python 3.10+ (tested on Python 3.12)
- Node.js 18+ (tested on Node.js 24)
- Git

### Step 1: Clone or Navigate to the Workspace
```bash
cd MediCare
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(By default, SQLite is pre-configured for zero-friction local testing. To use PostgreSQL, update `DATABASE_URL` in `.env`.)*

### Step 3: Install Backend Dependencies & Run Migrations
```bash
# Install Python packages
pip install -r backend/requirements.txt

# Run database migrations
alembic upgrade head
```
*(On first application launch, the database automatically seeds with 12 distinct demonstration medicines, sample audit scans, and incident reports.)*

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

---

## 5. Starting the Application Locally

### Running the Backend Server
From the root workspace directory:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc UI: `http://127.0.0.1:8000/redoc`

### Running the Frontend Dev Server
In a separate terminal:
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
- Web Application: `http://127.0.0.1:5173/`

---

## 6. How to Test All Three Verification Statuses

The application includes built-in quick test buttons on the **Verify Medicine** page and **Home** page. You can click any preset or type the sample parameters manually:

### Status 1: VERIFIED (Exact Match)
- **Preset:** "Match Scenario: Dolo-650 Tablets"
- **Product Identifier:** `8901234567890`
- **Medicine Name:** `Dolo-650 Tablets`
- **Manufacturer:** `Micro Labs Ltd`
- **Batch Number:** `DL24098`
- **Expiry Date:** `02/2027`
- **Result:** **VERIFIED** — Displays green verification badge, celebratory feedback, full matched parameters table, and storage integrity advice.

### Status 2: SUSPICIOUS (Inconsistency Detected)
- **Scenario A (Tampered Batch Code):**
  - **Preset:** "Discrepancy: Batch Code Tampered"
  - **Product Identifier:** `8906789012356`
  - **Medicine Name:** `Asthalin Inhaler 100mcg`
  - **Batch Number:** `AS9999-TAMPERED` (Official registered batch is `AS9912`)
  - **Result:** **SUSPICIOUS** — Highlights batch code discrepancy, displays cautionary advisory, and offers 1-click incident reporting.
- **Scenario B (Counterfeit Manufacturer Entity):**
  - **Preset:** "Discrepancy: Counterfeit Manufacturer"
  - **Product Identifier:** `8907890123467`
  - **Medicine Name:** `Monocef 1g Injection`
  - **Manufacturer:** `Apex Remedies` (Official manufacturer is `Aristo Pharmaceuticals Pvt Ltd`)
  - **Result:** **SUSPICIOUS** — Flags manufacturer conflict.
- **Scenario C (Past Expiry Date Warning):**
  - **Preset:** "Safety Warning: Expired Medication"
  - **Product Identifier:** `8908901234578`
  - **Medicine Name:** `Pan-D Capsules`
  - **Expiry Date:** `12/2023`
  - **Result:** **SUSPICIOUS** — Triggers immediate shelf-life expiration warning.

### Status 3: UNABLE TO VERIFY (Uncataloged in Registry)
- **Preset:** "Uncataloged: Unregistered Product ID"
- **Product Identifier:** `8909999999999`
- **Medicine Name:** `Generic Cough Linctus`
- **Result:** **UNABLE TO VERIFY** — Displays neutral guidance that product absence does not mean counterfeit, advising user to contact dispensing pharmacy.

---

## 7. Running Automated Tests

Run the comprehensive pytest suite:
```bash
python -m pytest backend/tests -v
```
All 11 unit and integration tests validate:
- System health check
- Medicine catalog listing and single-item retrieval
- Verified match algorithm
- Batch mismatch detection
- Manufacturer conflict detection
- Expiration calculation
- Unregistered product handling
- Incident report creation & reference lookup
- Surveillance dashboard metric aggregation
- Audit history filtering and sorting

---

## 8. Docker Deployment

To launch the complete application with PostgreSQL, FastAPI, and Nginx-served React:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

---

## 9. Official Indian Regulatory Helplines

- **CDSCO Toll-Free Helpline:** `1800-11-0144` (Central Drugs Standard Control Organisation)
- **National Consumer Helpline:** `1915` or SMS `8800001915`
- **National Portal:** [cdsco.gov.in](https://cdsco.gov.in)

---

## 10. License & Disclaimers

Developed for educational, architectural demonstration, and public health evaluation purposes. All seeded records are fictional sample data explicitly labeled as demonstration entries.
