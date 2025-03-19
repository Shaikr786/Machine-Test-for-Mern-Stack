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
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        
        {/* Role Selection Dropdown */}
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
