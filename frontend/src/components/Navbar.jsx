export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm">

      <h1 className="text-3xl font-bold tracking-tight">
        AI-Powered Data Quality{" "}
        <span className="text-indigo-600">
          Auditor
        </span>
      </h1>

      <div className="text-gray-500 font-medium">
        Deloitte Style Dashboard
      </div>

    </header>
  );
}