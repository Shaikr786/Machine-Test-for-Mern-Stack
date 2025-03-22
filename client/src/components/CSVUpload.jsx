import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { UploadCloud, Loader2 } from "lucide-react";

const CSVUpload = () => {
  const { user, isAuthenticated } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchAgents();
    }
  }, [isAuthenticated, user]); // ✅ Added user dependency to prevent stale data

  const fetchAgents = async () => {
    try {
      const { data } = await api.get("/agents");
      console.log("Agents API Response:", data); // Debugging log

      // ✅ Ensure data is an array and filter active agents
      setAgents(Array.isArray(data) ? data.filter(agent => agent.isActive) : []);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setAgents([]); // Prevents undefined issues
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]); // ✅ Ensuring only one file is selected
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "❌ Please select a file." });
      return;
    }

    if (agents.length === 0) {
      setMessage({ type: "error", text: "❌ No active agents available. Please create an agent first." });
      return;
    }

    const allowedExtensions = ["csv", "xlsx", "xls"];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
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

      console.log(response.data);

      setMessage({ type: "success", text: `✅ ${response.data.message}` });
      setFile(null);
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      setMessage({ type: "error", text: "❌ Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-700">
      <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-lg border border-gray-500">
        <h2 className="text-2xl font-bold text-center text-white mb-6">📂 Upload CSV/XLSX for Task Distribution</h2>

        {agents.length === 0 ? (
          <p className="text-red-400 text-center">❌ No active agents available. Please create an agent first.</p>
        ) : (
          <>
            <label className="flex flex-col items-center justify-center w-full p-4 border border-gray-400 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition">
              <UploadCloud className="w-10 h-10 text-blue-300 mb-2" />
              <span className="text-gray-300">{file ? `📄 ${file.name}` : "Choose a CSV or Excel file"}</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading} // ✅ Prevents file selection during upload
              />
            </label>

            <button
              onClick={handleUpload}
              className="w-full py-2 px-4 mt-4 bg-blue-500 text-white font-semibold rounded-lg flex justify-center items-center gap-2 hover:bg-blue-600 transition-all duration-200 disabled:bg-gray-500"
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Upload"}
            </button>
          </>
        )}

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
