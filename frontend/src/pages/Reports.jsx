import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Reports() {
  const [audits, setAudits] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("quality");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/audits`)
      .then((res) => res.json())
      .then((data) => setAudits(data))
      .catch(console.error);
  }, []);

  const exportCSV = () => {
  const headers = [
    "Dataset",
    "Quality",
    "Missing %",
    "Duplicates %",
  ];

  const rows = filteredAudits.map((audit) => [
    audit.filename,
    audit.quality_score,
    audit.missing_percentage,
    audit.duplicate_percentage,
  ]);

  const csv =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "audit_report.csv");
  };

  const exportPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("AI Data Quality Audit Report", 14, 20);

  doc.setFontSize(11);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    30
  );

  autoTable(doc, {
    startY: 40,
    head: [[
      "Dataset",
      "Quality %",
      "Missing %",
      "Duplicates %"
    ]],
    body: filteredAudits.map(audit => [
      audit.filename,
      audit.quality_score,
      audit.missing_percentage,
      audit.duplicate_percentage,
    ]),
  });

  doc.save("AI_Data_Quality_Report.pdf");
  };

  const filteredAudits = audits
  .filter((audit) =>
    audit.filename.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    switch (sortBy) {
      case "quality":
        return b.quality_score - a.quality_score;

      case "missing":
        return b.missing_percentage - a.missing_percentage;

      case "duplicates":
        return b.duplicate_percentage - a.duplicate_percentage;

      case "name":
        return a.filename.localeCompare(b.filename);

      default:
        return 0;
    }
  });

  return (
  <div className="flex min-h-screen bg-slate-100">

    <Sidebar />

    <div className="flex-1">

      <Navbar />

      <main className="p-8">

        
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Reports Dashboard
      </h1>
      <div className="mb-6 flex flex-col md:flex-row gap-4">

        <input
            type="text"
            placeholder="Search dataset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-2"
        >
            <option value="quality">Sort by Quality</option>
            <option value="missing">Sort by Missing %</option>
            <option value="duplicates">Sort by Duplicates %</option>
            <option value="name">Sort by Dataset Name</option>
        </select>

        <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
            >
            Export CSV
        </button>

        <button
            onClick={exportPDF}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
            Export PDF
        </button>

        </div>

      <div className="bg-white rounded-xl shadow p-6">

        <table className="min-w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left p-3">Dataset</th>

              <th className="text-left p-3">Quality</th>

              <th className="text-left p-3">Missing</th>

              <th className="text-left p-3">Duplicates</th>

            </tr>

          </thead>

          <tbody>

            {filteredAudits.map((audit) => (

              <tr key={audit.id} className="border-b">

                <td className="p-3">{audit.filename}</td>

                <td className="p-3">{audit.quality_score}%</td>

                <td className="p-3">{audit.missing_percentage}%</td>

                <td className="p-3">{audit.duplicate_percentage}%</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  

      </main>

    </div>

  </div>
);
}