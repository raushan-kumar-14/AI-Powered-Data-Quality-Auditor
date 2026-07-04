import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
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
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

const COLORS = ["#4F46E5", "#F59E0B", "#EF4444"];

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");


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

  const missingChartData =
  audit?.missing_by_column
    ? Object.entries(audit.missing_by_column).map(
        ([name, value]) => ({
          name,
          value,
        })
      )
    : [];

const typeChartData =
  audit?.dtype_distribution
    ? Object.entries(audit.dtype_distribution).map(
        ([name, value]) => ({
          name,
          value,
        })
      )
    : [];
const downloadReport = () => {
  if (!audit) return;

  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Data Quality Audit Report", 20, 20);

  doc.setFontSize(12);
  doc.text(`Dataset: ${audit.filename}`, 20, 40);
  doc.text(`Rows: ${audit.total_rows}`, 20, 50);
  doc.text(`Columns: ${audit.total_columns}`, 20, 60);
  doc.text(`Missing Data: ${audit.missing_percentage}%`, 20, 70);
  doc.text(`Duplicate Data: ${audit.duplicate_percentage}%`, 20, 80);
  doc.text(`Quality Score: ${audit.quality_score}%`, 20, 90);

  doc.save(`${audit.filename}-audit-report.pdf`);
};
const columns = useMemo(() => {
  if (!audit?.columns) return [];

  return audit.columns.map((column) => ({
    accessorKey: column,
    header: column,
  }));
}, [audit]);
const table = useReactTable({
  data: audit?.preview || [],
  columns,
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});
const downloadExcelReport = () => {
  if (!audit) return;

  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summary = [
    { Metric: "Dataset", Value: audit.filename },
    { Metric: "Rows", Value: audit.total_rows },
    { Metric: "Columns", Value: audit.total_columns },
    { Metric: "Missing %", Value: audit.missing_percentage },
    { Metric: "Duplicate %", Value: audit.duplicate_percentage },
    { Metric: "Quality Score", Value: audit.quality_score },
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Data Preview sheet
  if (audit.preview) {
    const previewSheet = XLSX.utils.json_to_sheet(audit.preview);
    XLSX.utils.book_append_sheet(workbook, previewSheet, "Preview");
  }

  // Numeric Statistics sheet
  if (
    audit.numeric_summary &&
    audit.numeric_summary.mean
  ) {
    const stats = Object.keys(audit.numeric_summary.mean).map((column) => ({
      Column: column,
      Mean: audit.numeric_summary.mean[column],
      Median: audit.numeric_summary.median[column],
      Std: audit.numeric_summary.std[column],
      Min: audit.numeric_summary.min[column],
      Max: audit.numeric_summary.max[column],
    }));

    const statsSheet = XLSX.utils.json_to_sheet(stats);
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Statistics");
  }

  XLSX.writeFile(
    workbook,
    `${audit.filename}-audit-report.xlsx`
  );
};
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

    <div className="flex justify-between items-center mb-8">
  <h2 className="text-3xl font-bold text-gray-800">
    Audit Results
  </h2>

  <div className="flex gap-3">
  <button
    onClick={downloadExcelReport}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
  >
    Download Excel
  </button>

  <button
    onClick={downloadReport}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow transition"
  >
    Download PDF
  </button>
</div>
</div>

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
  Data Insights
</h2>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

  <div className="bg-indigo-50 rounded-xl p-5 border">
    <p className="text-sm text-gray-500">Rows</p>
    <h3 className="text-3xl font-bold mt-2">
      {audit.total_rows}
    </h3>
  </div>

  <div className="bg-blue-50 rounded-xl p-5 border">
    <p className="text-sm text-gray-500">Columns</p>
    <h3 className="text-3xl font-bold mt-2">
      {audit.total_columns}
    </h3>
  </div>

  <div className="bg-green-50 rounded-xl p-5 border">
    <p className="text-sm text-gray-500">
      Numeric Columns
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {audit.numeric_columns}
    </h3>
  </div>

  <div className="bg-yellow-50 rounded-xl p-5 border">
    <p className="text-sm text-gray-500">
      Categorical Columns
    </p>
    <h3 className="text-3xl font-bold mt-2">
      {audit.categorical_columns}
    </h3>
  </div>

</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <div className="bg-gray-50 rounded-xl p-4 border">
      <h3 className="font-semibold mb-4">
        Missing Values by Column
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={missingChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="bg-gray-50 rounded-xl p-4 border">
      <h3 className="font-semibold mb-4">
        Data Types Distribution
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={typeChartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {typeChartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>
  <div className="mt-8 bg-gray-50 rounded-xl border p-6">
  <h3 className="text-xl font-semibold mb-6">
    Numeric Statistics
  </h3>

  {audit?.numeric_summary &&
    Object.keys(audit.numeric_summary.mean || {}).length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 text-left">Column</th>
              <th className="p-3">Mean</th>
              <th className="p-3">Median</th>
              <th className="p-3">Std</th>
              <th className="p-3">Min</th>
              <th className="p-3">Max</th>
            </tr>
          </thead>

          <tbody>
            {Object.keys(audit.numeric_summary.mean).map((column) => (
              <tr key={column} className="border-b hover:bg-gray-100">
                <td className="p-3 font-medium">{column}</td>
                <td className="p-3 text-center">
                  {audit.numeric_summary.mean[column]}
                </td>
                <td className="p-3 text-center">
                  {audit.numeric_summary.median[column]}
                </td>
                <td className="p-3 text-center">
                  {audit.numeric_summary.std[column]}
                </td>
                <td className="p-3 text-center">
                  {audit.numeric_summary.min[column]}
                </td>
                <td className="p-3 text-center">
                  {audit.numeric_summary.max[column]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-gray-500">
        No numeric columns found.
      </p>
    )}
</div>
</div>
<div className="mt-10 bg-white rounded-2xl shadow-md border p-6">

  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    Dataset Information
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div>
      <p className="text-sm text-gray-500">Filename</p>
      <p className="font-semibold text-lg break-all">
        {audit.filename}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">Quality Score</p>
      <p className="font-semibold text-green-600 text-lg">
        {audit.quality_score.toFixed(2)}%
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">Rows</p>
      <p className="font-semibold">
        {audit.total_rows}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">Columns</p>
      <p className="font-semibold">
        {audit.total_columns}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">Numeric Columns</p>
      <p className="font-semibold">
        {audit.numeric_columns}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">Categorical Columns</p>
      <p className="font-semibold">
        {audit.categorical_columns}
      </p>
    </div>

  </div>

</div>
<div className="mt-10 bg-white rounded-2xl shadow-md border p-6">
  <div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-gray-800">
    Data Preview
  </h2>

  <input
    type="text"
    placeholder="Search..."
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    className="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
</div>

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
  {table.getRowModel().rows.map((row) => (
    <tr
      key={row.id}
      className="border-b hover:bg-gray-50"
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          className="px-4 py-3 text-sm"
        >
          {flexRender(
            cell.column.columnDef.cell,
            cell.getContext()
          )}
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