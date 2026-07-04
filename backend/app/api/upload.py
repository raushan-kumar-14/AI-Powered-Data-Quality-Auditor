from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.file_service import save_uploaded_file
from app.services.audit_service import analyze_dataset

from app.database.database import SessionLocal
from app.models.audit import Audit

router = APIRouter()


@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    file_path = save_uploaded_file(file)

    result = analyze_dataset(
    file_path=file_path,
    filename=file.filename
    )

    return {
    "message": "Dataset uploaded successfully.",
    "audit": {
        "id": result["audit"].id,
        "filename": result["audit"].filename,
        "total_rows": result["audit"].total_rows,
        "total_columns": result["audit"].total_columns,
        "missing_percentage": result["audit"].missing_percentage,
        "duplicate_percentage": result["audit"].duplicate_percentage,
        "quality_score": result["audit"].quality_score,
        "created_at": result["audit"].created_at,
        "preview": result["preview"],
        "columns": result["columns"],
    }
}
    
@router.get("/audits")
def get_all_audits():
    db = SessionLocal()

    audits = db.query(Audit).order_by(Audit.created_at.desc()).all()

    db.close()

    return audits