import { useState } from "react";
import api from "../utils/api"; // Ensure correct path
import { UploadCloud, Loader2 } from "lucide-react"; // Icons for better UI

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "❌ Please select a file." });
      return;
    }

    const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "❌ Invalid file type. Please upload a CSV or Excel file." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage(null);

      const response = await api.post("/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: `✅ ${response.data.message}` });
      setFile(null); // Reset file input after success
    } catch (error) {
        console.error(error);
      setMessage({ type: "error", text: "❌ Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-lg border border-gray-500">
        <h2 className="text-2xl font-bold text-center text-white mb-6">📂 Upload CSV/XLSX for Task Distribution</h2>

        {/* File Input */}
        <label className="flex flex-col items-center justify-center w-full p-4 border border-gray-400 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition">
          <UploadCloud className="w-10 h-10 text-blue-300 mb-2" />
          <span className="text-gray-300">{file ? file.name : "Choose a CSV or Excel file"}</span>
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full py-2 px-4 mt-4 bg-blue-500 text-white font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-blue-600 transition-all duration-200 disabled:bg-gray-500"
          disabled={uploading}
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload"}
        </button>

        {/* Message Feedback */}
        {message && (
          <p className={`mt-4 p-2 rounded-lg text-center text-sm font-semibold ${message.type === "success" ? "bg-green-300 text-green-900" : "bg-red-300 text-red-900"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default CSVUpload;
