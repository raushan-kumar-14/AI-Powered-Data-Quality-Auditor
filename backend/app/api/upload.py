from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.file_service import save_uploaded_file
from app.services.audit_service import analyze_dataset, clean_dataset

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

    "missing_by_column": result["missing_by_column"],
    "dtype_distribution": result["dtype_distribution"],
    "numeric_summary": result["numeric_summary"],
    "numeric_columns": result["numeric_columns"],
    "categorical_columns": result["categorical_columns"],
    "preview": result["preview"],
    "columns": result["columns"],
    "recommendations": result["recommendations"],
    "correlation_matrix": result["correlation_matrix"],
    "outlier_summary": result["outlier_summary"],
    "dataset_memory_kb": result["dataset_memory_kb"],
    "uniqueness": result["uniqueness"],
    "skewness": result["skewness"],
    "kurtosis": result["kurtosis"],
    "total_anomalies": result["total_anomalies"],
}
}
    
@router.get("/audits")
def get_all_audits():
    db = SessionLocal()

    audits = db.query(Audit).order_by(Audit.created_at.desc()).all()

    db.close()

    return audits

@router.post("/clean-dataset")
async def clean_uploaded_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    file_path = save_uploaded_file(file)

    import pandas as pd

    df = pd.read_csv(file_path)

    cleaned_df = clean_dataset(df)

    return {
        "rows_before": len(df),
        "rows_after": len(cleaned_df),
        "duplicates_removed": int(df.duplicated().sum()),
        "missing_before": int(df.isnull().sum().sum()),
        "missing_after": int(cleaned_df.isnull().sum().sum()),
        "preview": cleaned_df.head(10).fillna("").to_dict(orient="records"),
        "columns": cleaned_df.columns.tolist()
    }
    
@router.get("/analytics")
def analytics():
    db = SessionLocal()

    audits = db.query(Audit).all()

    db.close()

    return audits

@router.delete("/audits/{audit_id}")
def delete_audit(audit_id: int):
    db = SessionLocal()

    audit = db.query(Audit).filter(Audit.id == audit_id).first()

    if audit is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Audit not found."
        )

    db.delete(audit)
    db.commit()
    db.close()

    return {"message": "Audit deleted successfully."}