import { FaDatabase, FaChartBar, FaFilePdf } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-10">
        Data Auditor
      </h2>

      <div className="space-y-6">
        <div className="flex items-center gap-3 cursor-pointer">
          <FaDatabase />
          Dashboard
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <FaChartBar />
          Analytics
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          <FaFilePdf />
          Reports
        </div>
      </div>
    </div>
  );
}