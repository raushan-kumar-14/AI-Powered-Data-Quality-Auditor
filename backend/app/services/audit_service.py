import pandas as pd

from app.charts.chart_generator import (
    generate_missing_values_chart,
    generate_correlation_heatmap,
)

from app.services.ml_service import detect_anomalies

from app.database.database import SessionLocal
from app.models.audit import Audit

from app.charts.chart_generator import generate_missing_values_chart


def analyze_dataset(file_path: str, filename: str):
    df = pd.read_csv(file_path)
    
    missing_by_column = (
    df.isnull()
      .sum()
      .to_dict()
    )
    missing_chart = generate_missing_values_chart(
        missing_by_column,
        filename.replace(".csv", "")
    )

    correlation_chart = generate_correlation_heatmap(
        df,
        filename.replace(".csv", "")
    )

    dtype_distribution = (
        df.dtypes
        .astype(str)
        .value_counts()
        .to_dict()
    )
    
    numeric_summary = {}
    
    correlation_matrix = {}

    outlier_summary = {}

    dataset_memory = round(
        df.memory_usage(deep=True).sum() / 1024,
        2
    )

    uniqueness = {}

    skewness = {}

    kurtosis = {}

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
        
        correlation_matrix = (
            numeric_df.corr()
            .round(2)
            .fillna(0)
            .to_dict()
        )

        skewness = (
            numeric_df.skew()
            .round(2)
            .to_dict()
        )

        kurtosis = (
            numeric_df.kurtosis()
            .round(2)
            .to_dict()
        )

        for column in numeric_df.columns:
            q1 = numeric_df[column].quantile(0.25)
            q3 = numeric_df[column].quantile(0.75)
            iqr = q3 - q1

            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr

            outliers = int(
                (
                    (numeric_df[column] < lower) |
                    (numeric_df[column] > upper)
                ).sum()
            )

            outlier_summary[column] = outliers
    
    preview = df.head(10).fillna("").to_dict(orient="records")
    columns = df.columns.tolist()
    numeric_columns = len(df.select_dtypes(include="number").columns)
    anomaly_result = detect_anomalies(df)

    categorical_columns = len(
        df.select_dtypes(include=["object", "category"]).columns
    )
    
    for column in df.columns:
        uniqueness[column] = round(
            (df[column].nunique() / len(df)) * 100,
            2
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
    missing_chart = generate_missing_values_chart(
        missing_by_column,
        filename.split(".")[0]
    )
    
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
    "recommendations": recommendations,
    
    "correlation_matrix": correlation_matrix,

    "outlier_summary": outlier_summary,

    "dataset_memory_kb": dataset_memory,

    "uniqueness": uniqueness,

    "skewness": skewness,

    "kurtosis": kurtosis,
    
    "total_anomalies": anomaly_result["total_anomalies"],

    "anomaly_indices": anomaly_result["anomaly_indices"],
    
    "missing_chart": missing_chart,
    
    "correlation_chart": correlation_chart
    }
    
def clean_dataset(df):
    cleaned = df.copy()

    for column in cleaned.columns:
        if cleaned[column].isna().sum() == 0:
            continue

        if pd.api.types.is_numeric_dtype(cleaned[column]):
            cleaned[column] = cleaned[column].fillna(
                cleaned[column].median()
            )
        else:
            cleaned[column] = cleaned[column].fillna(
                cleaned[column].mode()[0]
            )

    cleaned = cleaned.drop_duplicates()

    return cleaned