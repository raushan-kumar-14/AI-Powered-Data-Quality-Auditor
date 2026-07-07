import { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Analytics() {
  const [audits, setAudits] = useState([]);

  const totalAudits = audits.length;

    const averageQuality =
    totalAudits > 0
        ? (
            audits.reduce(
            (sum, item) => sum + item.quality_score,
            0
            ) / totalAudits
        ).toFixed(2)
        : 0;

    const averageMissing =
    totalAudits > 0
        ? (
            audits.reduce(
            (sum, item) => sum + item.missing_percentage,
            0
            ) / totalAudits
        ).toFixed(2)
        : 0;

    const averageDuplicates =
    totalAudits > 0
        ? (
            audits.reduce(
            (sum, item) => sum + item.duplicate_percentage,
            0
            ) / totalAudits
        ).toFixed(2)
        : 0;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/analytics");
      setAudits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

    return (
    <div className="flex min-h-screen bg-slate-100">

        <Sidebar />

        <div className="flex-1">

        <Navbar />

        <main className="p-8">

            <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-indigo-50 rounded-xl p-6 shadow">
            <p className="text-gray-500">Total Audits</p>
            <h2 className="text-3xl font-bold">{totalAudits}</h2>
        </div>

        <div className="bg-green-50 rounded-xl p-6 shadow">
            <p className="text-gray-500">Average Quality</p>
            <h2 className="text-3xl font-bold">{averageQuality}%</h2>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 shadow">
            <p className="text-gray-500">Average Missing</p>
            <h2 className="text-3xl font-bold">{averageMissing}%</h2>
        </div>

        <div className="bg-red-50 rounded-xl p-6 shadow">
            <p className="text-gray-500">Average Duplicates</p>
            <h2 className="text-3xl font-bold">{averageDuplicates}%</h2>
        </div>

        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h2 className="text-xl font-bold mb-4">
                Dataset Quality Comparison
            </h2>

            <Plot
                data={[
                {
                    x: audits.map(a => a.filename),
                    y: audits.map(a => a.quality_score),
                    type: "bar"
                }
                ]}
                layout={{
                title: "Quality Score",
                autosize: true,
                height: 420
                }}
                style={{ width: "100%" }}
                useResizeHandler
            />

            </div>
      <div className="bg-white rounded-xl shadow p-6">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Dataset</th>
              <th className="text-left p-2">Quality</th>
              <th className="text-left p-2">Missing %</th>
              <th className="text-left p-2">Duplicates %</th>
            </tr>
          </thead>

          <tbody>
            {audits.map((audit) => (
              <tr key={audit.id} className="border-b">
                <td className="p-2">{audit.filename}</td>
                <td className="p-2">{audit.quality_score}%</td>
                <td className="p-2">{audit.missing_percentage}%</td>
                <td className="p-2">{audit.duplicate_percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

        </main>

        </div>

    </div>
    );
}