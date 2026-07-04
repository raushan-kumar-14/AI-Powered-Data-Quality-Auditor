export default function FileUpload() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-10 border-2 border-dashed border-blue-500 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Upload Dataset
      </h2>

      <p className="text-gray-500 mb-5">
        Drag & Drop CSV or Excel file here
      </p>

      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg">
        Choose File
      </button>
    </div>
  );
}