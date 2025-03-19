import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UploadTasks = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/tasks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("File uploaded and tasks distributed successfully!");
      } else {
        toast.error("Failed to upload file.");
      }
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
      console.error("Upload Error:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-96 mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Upload Tasks CSV</h2>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Upload & Distribute
      </button>
    </div>
  );
};

export default UploadTasks;
