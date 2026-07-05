import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-x-hidden">

        <Navbar />

        <main className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold mb-2">
            AI Data Quality Auditor
          </h1>

          <p className="text-gray-500 mb-8">
            Upload a dataset and receive an automated quality audit report.
          </p>

          <FileUpload />
        </main>
      </div>
    </div>
  );
}