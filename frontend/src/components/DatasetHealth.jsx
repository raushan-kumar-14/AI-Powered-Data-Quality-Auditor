export default function DatasetHealth({ audit }) {
  if (!audit) return null;

  const uniqueness =
    audit.uniqueness
      ? Object.values(audit.uniqueness)
      : [];

  const skewness =
    audit.skewness
      ? Object.values(audit.skewness)
      : [];

  const kurtosis =
    audit.kurtosis
      ? Object.values(audit.kurtosis)
      : [];

  const outliers =
    audit.outlier_summary
      ? Object.values(audit.outlier_summary).reduce((a, b) => a + b, 0)
      : 0;

  const avgUniqueness =
    uniqueness.length
      ? (
          uniqueness.reduce((a, b) => a + b, 0) /
          uniqueness.length
        ).toFixed(1)
      : "0";

  const avgSkewness =
    skewness.length
      ? (
          skewness.reduce((a, b) => a + b, 0) /
          skewness.length
        ).toFixed(2)
      : "0";

  const avgKurtosis =
    kurtosis.length
      ? (
          kurtosis.reduce((a, b) => a + b, 0) /
          kurtosis.length
        ).toFixed(2)
      : "0";

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-md border p-6">
      <h2 className="text-2xl font-bold mb-6">
        Dataset Health
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

        <div className="rounded-xl bg-blue-50 p-4">
          <p>Memory</p>
          <h3>{audit.dataset_memory_kb} KB</h3>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <p>Outliers</p>
          <h3>{outliers}</h3>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p>Uniqueness</p>
          <h3>{avgUniqueness}%</h3>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4">
          <p>Skewness</p>
          <h3>{avgSkewness}</h3>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <p>Kurtosis</p>
          <h3>{avgKurtosis}</h3>
        </div>

      </div>
    </div>
  );
}