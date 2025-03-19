import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AddAgent = ({ onAgentAdded }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, role: "agent" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add agent");

      toast.success("Agent added successfully");
      setFormData({ name: "", email: "", mobile: "", password: "" });
      onAgentAdded(); // Refresh agent list
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Agent Name" className="w-full p-2 border rounded" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full p-2 border rounded" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 w-full">Add Agent</button>
      </form>
    </div>
  );
};

export default AddAgent;
