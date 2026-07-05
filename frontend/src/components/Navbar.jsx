export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm">

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
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