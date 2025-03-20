import { useEffect, useState } from "react";
import api from "../utils/api";

const AgentsManagement = () => {
  const [agents, setAgents] = useState([]);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", mobile: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await api.get("/agents");
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents", error);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10,15}$/; // Adjust based on expected format

    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }
    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobile)) {
      errors.mobile = "Invalid mobile number.";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const handleAddAgent = async () => {
    setIsSubmitting(true);
    console.log(isSubmitting);
    const validationErrors = validateForm(newAgent);
    setErrors(validationErrors);
    console.log(errors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await api.post("/agents", newAgent);
        setAgents((prevAgents) => [...prevAgents, response.data.agent]);
        setNewAgent({ name: "", email: "", mobile: "", password: "" });
        setErrors({});
      } catch (error) {
        console.error("Error adding agent", error);
        if (error.response && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        }
      }
    }
    setIsSubmitting(false);
    console.log(isSubmitting);

  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/agents/${id}/toggle`);
      fetchAgents();
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await api.delete(`/agents/${id}`);
      fetchAgents();
    } catch (error) {
      console.error("Error deleting agent", error);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-orange-400 mb-6">Agents Management</h2>

      <div className="grid grid-cols-4 gap-4">
        <input type="text" placeholder="Name" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} />
        <input type="email" placeholder="Email" value={newAgent.email} onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })} />
        <input type="text" placeholder="Mobile" value={newAgent.mobile} onChange={(e) => setNewAgent({ ...newAgent, mobile: e.target.value })} />
        <input type="password" placeholder="Password" value={newAgent.password} onChange={(e) => setNewAgent({ ...newAgent, password: e.target.value })} />
        <button onClick={handleAddAgent} className="bg-green-500 text-white py-2 px-4 rounded-lg">Add Agent</button>
      </div>

      <table className="w-full mt-6 bg-gray-800 text-white">
        <thead>
          <tr className="bg-gray-700 text-blue-300">
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.length > 0 ? agents.map((agent) => (
            <tr key={agent._id} className="border-b border-gray-600">
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.mobile}</td>
              <td>
                <span className={`px-2 py-1 rounded ${agent.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                  {agent.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <button onClick={() => handleToggleStatus(agent._id)} className="mr-2 px-3 py-1 bg-blue-500 rounded">
                  {agent.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDeleteAgent(agent._id)} className="px-3 py-1 bg-red-500 rounded">Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" className="text-center py-4">No agents available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AgentsManagement;
