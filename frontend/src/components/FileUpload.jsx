import { useState } from "react";
import { FaCloudUploadAlt, FaFileAlt, FaUpload } from "react-icons/fa";
import {
  FiDatabase,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiBarChart2,
} from "react-icons/fi";
import { uploadDataset } from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#4F46E5", "#F59E0B", "#EF4444"];

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState(null);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file.");
      return;
    }

    try {
      setLoading(true);

      const response = await uploadDataset(selectedFile);

      setAudit(response.audit);

      alert("Dataset uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = audit
  ? [
      {
        name: "Valid",
        value: Number(audit.quality_score.toFixed(2)),
      },
      {
        name: "Missing",
        value: Number(audit.missing_percentage.toFixed(2)),
      },
      {
        name: "Duplicates",
        value: Number(audit.duplicate_percentage.toFixed(2)),
      },
    ]
  : [];

  return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-300 shadow-sm p-14">

    <div className="flex justify-center">

        <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center">

            <FaCloudUploadAlt
                className="text-indigo-600"
                size={46}
            />

        </div>

    </div>

    <h2 className="text-5xl font-bold text-center mt-8">

        Upload Dataset

    </h2>

    <p className="text-gray-500 text-center mt-4 text-lg">

        Drag & Drop CSV or choose a file to upload

    </p>

    <input
        id="csvUpload"
        type="file"
        accept=".csv"
        hidden
        onChange={(e) => setSelectedFile(e.target.files[0])}
    />

    <label
        htmlFor="csvUpload"
        className="mt-10 mx-auto w-[650px] h-16 bg-white rounded-xl
        border border-gray-300 shadow-sm
        flex items-center justify-between
        px-6 cursor-pointer hover:border-indigo-500 transition"
    >

        <div className="flex items-center gap-3">

            <FaFileAlt
                className="text-gray-500"
            />

            <span className="text-gray-600">

                {selectedFile
                    ? selectedFile.name
                    : "No file chosen"}

            </span>

        </div>

        <span
            className="
            border border-indigo-500
            text-indigo-600
            rounded-lg
            px-6
            py-2
            font-semibold
            hover:bg-indigo-50
            transition
        ">

            Browse File

        </span>

    </label>

    <p className="text-gray-400 text-center mt-5">

        Only CSV files are supported

    </p>

    <div className="flex justify-center">

        <button

            onClick={handleUpload}

            disabled={loading}

            className="
            mt-8
            flex
            items-center
            gap-3
            bg-gradient-to-r
            from-indigo-600
            to-blue-600
            hover:scale-105
            transition
            text-white
            px-10
            py-4
            rounded-xl
            shadow-lg
            font-semibold
        "

        >

            <FaUpload />

            {loading
                ? "Uploading..."
                : "Upload Dataset"}

        </button>

    </div>


      {audit && (
  <div className="mt-12">

    <h2 className="text-3xl font-bold text-gray-800 mb-8">
  Audit Results
</h2>

<div className="bg-white rounded-2xl shadow-md p-6 border mb-8">
  <h3 className="text-2xl font-bold text-gray-800 mb-6">
    Data Quality Overview
  </h3>

  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={110}
            paddingAngle={3}
            label={({ name, value }) => `${name}: ${value}%`}
            >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

    <div className="flex justify-center gap-8 mt-6 flex-wrap">
    {chartData.map((item, index) => (
        <div key={item.name} className="flex items-center gap-2">
        <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: COLORS[index] }}
        />
        <span className="text-gray-700 font-medium">
            {item.name}: {item.value}%
        </span>
        </div>
    ))}
    </div>

  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

      <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
          <FiDatabase className="text-indigo-600 text-2xl" />
        </div>

        <p className="text-gray-500 text-sm">Rows</p>

        <h3 className="text-3xl font-bold mt-2">
          {audit.total_rows}
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
          <FiBarChart2 className="text-blue-600 text-2xl" />
        </div>

        <p className="text-gray-500 text-sm">Columns</p>

        <h3 className="text-3xl font-bold mt-2">
          {audit.total_columns}
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
  <p className="text-gray-500 text-sm">Dataset</p>

  <h3 className="text-lg font-semibold mt-2 break-all">
    {audit.filename}
  </h3>
</div>

      <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center mb-4">
          <FiAlertTriangle className="text-yellow-500 text-2xl" />
        </div>

        <p className="text-gray-500 text-sm">Missing Data</p>

        <h3 className="text-3xl font-bold mt-2">
          {audit.missing_percentage.toFixed(2)}%
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
          <FiXCircle className="text-red-500 text-2xl" />
        </div>

        <p className="text-gray-500 text-sm">Duplicates</p>

        <h3 className="text-3xl font-bold mt-2">
          {audit.duplicate_percentage.toFixed(2)}%
        </h3>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
          <FiCheckCircle className="text-green-600 text-2xl" />
        </div>

        <p className="text-gray-500 text-sm">Quality Score</p>

        <h3 className="text-3xl font-bold mt-2">
          {audit.quality_score.toFixed(2)}%
        </h3>

<div className="mt-4 w-full h-3 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-green-500 rounded-full transition-all duration-700"
    style={{ width: `${audit.quality_score}%` }}
  />
</div>
    </div>

    </div>

    <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">

      <div className="flex items-center gap-3">

        <FiCheckCircle className="text-green-600 text-3xl" />

        <div>

          <h3 className="text-xl font-bold text-green-700">
            Audit Completed Successfully
          </h3>

          <p className="text-green-600 mt-1">
            Dataset <strong>{audit.filename}</strong> has been analyzed successfully.
          </p>

        </div>

      </div>
      <div className="mt-10 bg-white rounded-2xl shadow-md border p-6">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    Data Preview
  </h2>

  <div className="overflow-x-auto">
    <table className="min-w-full border-collapse">
      <thead>
        <tr className="bg-indigo-600 text-white">
          {audit.columns?.map((column) => (
            <th
              key={column}
              className="px-4 py-3 text-left font-semibold"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {audit.preview?.map((row, rowIndex) => (
          <tr
            key={rowIndex}
            className="border-b hover:bg-gray-50"
          >
            {audit.columns.map((column) => (
              <td
                key={column}
                className="px-4 py-3 text-sm"
              >
                {String(row[column])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

    </div>

  </div>
)}
    </div>
  );
}