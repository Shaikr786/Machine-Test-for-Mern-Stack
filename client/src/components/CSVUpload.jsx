import { useState } from "react";
import api from "../utils/api"; // Ensure correct path

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a file." });
      return;
    }
  
    const allowedTypes = ["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: "error", text: "Invalid file type. Please upload a CSV or Excel file." });
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
  
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Upload CSV/XLSX for Task Distribution</h2>
      
      <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
      
      <button 
        onClick={handleUpload} 
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p className={`mt-3 p-2 rounded-lg ${message.type === "success" ? "bg-green-200" : "bg-red-200"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default CSVUpload;
