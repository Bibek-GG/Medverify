from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.config import settings
from backend.schemas.medicine import VerifyRequest, VerifyResponse, OCRExtractResponse
from backend.services.verification_engine import verify_medicine
from backend.services.ocr_service import process_medicine_image

router = APIRouter(prefix="/verify", tags=["Verification"])

@router.post("", response_model=VerifyResponse)
def verify_medicine_endpoint(request: VerifyRequest, db: Session = Depends(get_db)):
    if not request.product_identifier and not request.name:
        raise HTTPException(
            status_code=400,
            detail="Either a product identifier (barcode/GTIN) or a medicine name must be provided for verification."
        )
    return verify_medicine(db, request)

@router.post("/image", response_model=OCRExtractResponse)
async def verify_image_endpoint(file: UploadFile = File(...)):
    # 1. Validate file extension
    filename = file.filename or "upload.jpg"
    ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Please upload JPG, PNG, or WebP images."
        )

    # 2. Read bytes and validate file size
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum size limit of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB."
        )

    # 3. Process image with OpenCV and text extractor
    try:
        result = process_medicine_image(contents, filename)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image processing failed: {str(e)}"
        )
