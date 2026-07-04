import pandas as pd

from app.database.database import SessionLocal
from app.models.audit import Audit


def analyze_dataset(file_path: str, filename: str):
    df = pd.read_csv(file_path)
    
    preview = df.head(10).fillna("").to_dict(orient="records")
    columns = df.columns.tolist()

    total_rows = len(df)
    total_columns = len(df.columns)

    total_cells = total_rows * total_columns

    missing_percentage = (
        df.isnull().sum().sum() / total_cells
    ) * 100 if total_cells > 0 else 0

    duplicate_percentage = (
        df.duplicated().sum() / total_rows
    ) * 100 if total_rows > 0 else 0

    quality_score = max(
        0,
        100 - (missing_percentage + duplicate_percentage)
    )

    db = SessionLocal()

    audit = Audit(
        filename=filename,
        total_rows=total_rows,
        total_columns=total_columns,
        missing_percentage=round(missing_percentage, 2),
        duplicate_percentage=round(duplicate_percentage, 2),
        quality_score=round(quality_score, 2)
    )

    db.add(audit)
    db.commit()
    db.refresh(audit)
    db.close()

    return {
    "audit": audit,
    "preview": preview,
    "columns": columns,
}