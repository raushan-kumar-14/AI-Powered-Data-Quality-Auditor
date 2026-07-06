import pandas as pd

from app.database.database import SessionLocal
from app.models.audit import Audit


def analyze_dataset(file_path: str, filename: str):
    df = pd.read_csv(file_path)
    
    missing_by_column = (
    df.isnull()
      .sum()
      .to_dict()
    )

    dtype_distribution = (
        df.dtypes
        .astype(str)
        .value_counts()
        .to_dict()
    )
    
    numeric_summary = {}

    numeric_df = df.select_dtypes(include="number")

    if not numeric_df.empty:

        numeric_summary = {

            "mean":
                numeric_df.mean().round(2).to_dict(),

            "median":
                numeric_df.median().round(2).to_dict(),

            "std":
                numeric_df.std().round(2).to_dict(),

            "min":
                numeric_df.min().round(2).to_dict(),

            "max":
                numeric_df.max().round(2).to_dict(),
        }
    
    preview = df.head(10).fillna("").to_dict(orient="records")
    columns = df.columns.tolist()
    numeric_columns = len(df.select_dtypes(include="number").columns)

    categorical_columns = len(
        df.select_dtypes(include=["object", "category"]).columns
    )

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
    
    recommendations = []

    for column in df.columns:
        missing = int(df[column].isna().sum())

        if missing > 0:
            percentage = (missing / len(df)) * 100

            if percentage > 50:
                recommendations.append({
                    "column": column,
                    "issue": f"{missing} missing values ({percentage:.1f}%)",
                    "recommendation": "Consider dropping this column"
                })

            elif pd.api.types.is_numeric_dtype(df[column]):
                recommendations.append({
                    "column": column,
                    "issue": f"{missing} missing values ({percentage:.1f}%)",
                    "recommendation": "Fill missing values using Median"
                })

            else:
                recommendations.append({
                    "column": column,
                    "issue": f"{missing} missing values ({percentage:.1f}%)",
                    "recommendation": "Fill missing values using Mode"
                })
    return {
    "audit": audit,
    "preview": preview,
    "columns": columns,

    "missing_by_column": missing_by_column,
    "dtype_distribution": dtype_distribution,
    "numeric_summary": numeric_summary,

    "numeric_columns": numeric_columns,
    "categorical_columns": categorical_columns,
    "recommendations": recommendations
}