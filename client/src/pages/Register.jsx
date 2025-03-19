import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "agent", // Default role is "agent"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Frontend validations
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required!");
      return;
    }
  
    // Email validation (simple regex)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
  
    // Password validation (minimum length of 6 characters)
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
  
    const res = await register(formData);
  
    if (res.success) {
      toast.success("Registration successful!");
      
      // Redirect based on user role
      if (res.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/agent-dashboard");
      }
    } else {
      toast.error(res.message);
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-purple-800">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 border border-orange-500">
        <h2 className="text-3xl font-bold text-center text-orange-400 mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-orange-300 text-sm mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-orange-300 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-orange-300 text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-orange-300 text-sm mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
              required
            >
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
