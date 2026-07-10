import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(df: pd.DataFrame):
    """
    Detect anomalies using Isolation Forest.
    """

    numeric_df = df.select_dtypes(include="number")

    if numeric_df.empty:
        return {
            "total_anomalies": 0,
            "anomaly_indices": []
        }

    numeric_df = numeric_df.fillna(
        numeric_df.median()
    )

    model = IsolationForest(
        contamination=0.05,
        random_state=42
    )

    predictions = model.fit_predict(numeric_df)

    anomaly_indices = [
        int(index)
        for index, value in enumerate(predictions)
        if value == -1
    ]

    return {
        "total_anomalies": len(anomaly_indices),
        "anomaly_indices": anomaly_indices
    }