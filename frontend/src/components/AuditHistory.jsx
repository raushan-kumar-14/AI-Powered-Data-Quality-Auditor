import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditHistory() {
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/audits");
      setAudits(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAudit = async (id) => {
  try {
    await axios.delete(`http://127.0.0.1:8000/audits/${id}`);
    loadAudits();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-md border p-6">
      <h2 className="text-2xl font-bold mb-6">
        Audit History
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 text-left">Dataset</th>
              <th className="p-3">Quality</th>
              <th className="p-3">Rows</th>
              <th className="p-3">Columns</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {audits.map((audit) => (
              <tr
                key={audit.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{audit.filename}</td>

                <td className="p-3 text-center">
                  {audit.quality_score.toFixed(2)}%
                </td>

                <td className="p-3 text-center">
                  {audit.total_rows}
                </td>

                <td className="p-3 text-center">
                  {audit.total_columns}
                </td>

                <td className="p-3 text-center">
                  {new Date(audit.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-center">
                <button
                    onClick={() => deleteAudit(audit.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                    Delete
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}