import matplotlib

matplotlib.use("Agg")   # Use non-GUI backend

import matplotlib.pyplot as plt
import os
import pandas as pd


def generate_missing_values_chart(missing_by_column, filename):
    """
    Generate a bar chart showing missing values per column.
    """

    output_dir = os.path.join("generated_reports", "charts")
    os.makedirs(output_dir, exist_ok=True)

    plt.figure(figsize=(10, 6))

    plt.bar(
        list(missing_by_column.keys()),
        list(missing_by_column.values())
    )

    plt.xticks(rotation=45, ha="right")
    plt.xlabel("Columns")
    plt.ylabel("Missing Values")
    plt.title("Missing Values by Column")

    plt.tight_layout()

    chart_path = os.path.join(
        output_dir,
        f"{filename}_missing_values.png"
    )

    plt.savefig(chart_path)
    plt.close()

    return chart_path

def generate_correlation_heatmap(df, filename):
    """
    Generate correlation heatmap.
    """

    numeric_df = df.select_dtypes(include="number")

    if numeric_df.empty:
        return None

    correlation = numeric_df.corr()

    output_dir = os.path.join(
        "generated_reports",
        "charts"
    )

    os.makedirs(output_dir, exist_ok=True)

    plt.figure(figsize=(8, 6))

    plt.imshow(correlation, interpolation="nearest")

    plt.colorbar()

    plt.xticks(
        range(len(correlation.columns)),
        correlation.columns,
        rotation=45,
        ha="right"
    )

    plt.yticks(
        range(len(correlation.columns)),
        correlation.columns
    )

    plt.title("Correlation Heatmap")

    plt.tight_layout()

    chart_path = os.path.join(
        output_dir,
        f"{filename}_correlation_heatmap.png"
    )

    plt.savefig(chart_path)

    plt.close()

    return chart_path